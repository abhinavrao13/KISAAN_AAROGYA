"""Model Evaluation & Potato Bias Analysis Engine."""

import os
import sys
import json
import argparse
import numpy as np
from typing import Dict, Any, List

try:
    import torch
    import torch.nn as nn
    from torch.utils.data import DataLoader
    import torchvision.transforms as transforms
    from torchvision.models import mobilenet_v3_small
    TORCH_AVAILABLE = True
except ImportError:
    TORCH_AVAILABLE = False

from app.ml.dataset_report import analyze_dataset
from app.ml.train import PlantVillageDataset, load_dataset_samples, create_split, build_mobilenet_v3

def evaluate_model(
    model_path: str = "./model_weights.pth",
    dataset_dir: str = "./dataset/plantvillage",
    output_metrics_path: str = "./test_metrics.json"
) -> Dict[str, Any]:
    if not TORCH_AVAILABLE:
        print("PyTorch is required for evaluation.")
        return {}

    ml_dir = os.path.dirname(os.path.abspath(__file__))
    class_names_file = os.path.join(ml_dir, "class_names.json")
    if not os.path.exists(class_names_file):
        print("class_names.json missing.")
        return {}

    with open(class_names_file, "r") as f:
        class_names = json.load(f)

    num_classes = len(class_names)
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    # Load model
    model = build_mobilenet_v3(num_classes).to(device)
    if os.path.exists(model_path):
        checkpoint = torch.load(model_path, map_location=device)
        if isinstance(checkpoint, dict) and "state_dict" in checkpoint:
            model.load_state_dict(checkpoint["state_dict"])
        elif isinstance(checkpoint, dict):
            model.load_state_dict(checkpoint)
        print(f"Loaded trained weights from: {model_path}")
    else:
        print(f"[WARNING] Weight file {model_path} not found. Running with baseline initialized weights.")

    model.eval()

    # Load dataset test split
    if not os.path.exists(dataset_dir):
        print(f"Dataset directory '{dataset_dir}' not found. Cannot compute empirical metrics.")
        return {}

    image_paths, labels = load_dataset_samples(dataset_dir, class_names)
    _, _, test_idx = create_split(image_paths, labels, seed=42)

    test_paths = [image_paths[i] for i in test_idx]
    test_labels = [labels[i] for i in test_idx]

    transform = transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])

    test_ds = PlantVillageDataset(test_paths, test_labels, transform=transform)
    test_loader = DataLoader(test_ds, batch_size=32, shuffle=False)

    all_preds = []
    all_targets = []
    potato_class_indices = [i for i, c in enumerate(class_names) if "Potato" in c]

    with torch.no_grad():
        for images, targets in test_loader:
            images = images.to(device)
            outputs = model(images)
            _, preds = torch.max(outputs, 1)
            all_preds.extend(preds.cpu().numpy())
            all_targets.extend(targets.numpy())

    all_preds = np.array(all_preds)
    all_targets = np.array(all_targets)

    # Compute Confusion Matrix
    conf_matrix = np.zeros((num_classes, num_classes), dtype=int)
    for t, p in zip(all_targets, all_preds):
        conf_matrix[t, p] += 1

    # Overall Accuracy
    overall_acc = float(np.mean(all_preds == all_targets)) * 100.0

    # Per-class metrics
    per_class_acc = {}
    f1_scores = []
    for i, name in enumerate(class_names):
        tp = conf_matrix[i, i]
        fn = np.sum(conf_matrix[i, :]) - tp
        fp = np.sum(conf_matrix[:, i]) - tp
        acc = (tp / max(np.sum(conf_matrix[i, :]), 1)) * 100.0
        per_class_acc[name] = round(acc, 2)

        prec = tp / max(tp + fp, 1)
        rec = tp / max(tp + fn, 1)
        f1 = (2 * prec * rec / max(prec + rec, 1e-6))
        f1_scores.append(f1)

    macro_f1 = round(float(np.mean(f1_scores)), 4)
    balanced_acc = round(float(np.mean(list(per_class_acc.values()))), 2)

    # Potato Bias Metric: Percentage of non-potato samples falsely predicted as potato
    non_potato_indices = [i for i in range(num_classes) if i not in potato_class_indices]
    non_potato_mask = np.isin(all_targets, non_potato_indices)
    non_potato_preds = all_preds[non_potato_mask]

    false_potato_count = np.sum(np.isin(non_potato_preds, potato_class_indices))
    total_non_potato = len(non_potato_preds)
    potato_bias_rate = (false_potato_count / max(total_non_potato, 1)) * 100.0

    metrics = {
        "overall_accuracy_percent": round(overall_acc, 2),
        "balanced_accuracy_percent": balanced_acc,
        "macro_f1_score": macro_f1,
        "potato_bias_rate_percent": round(potato_bias_rate, 2),
        "total_test_samples": len(all_targets),
        "per_class_accuracy": per_class_acc,
        "confusion_matrix": conf_matrix.tolist()
    }

    with open(output_metrics_path, "w") as f:
        json.dump(metrics, f, indent=2)

    print("\n=======================================================")
    print(" MODEL EVALUATION & POTATO BIAS ANALYSIS REPORT")
    print("=======================================================")
    print(f"Overall Test Accuracy:    {overall_acc:.2f}%")
    print(f"Balanced Accuracy:        {balanced_acc:.2f}%")
    print(f"Macro F1-Score:           {macro_f1:.4f}")
    print(f"Potato Prediction Bias:   {potato_bias_rate:.2f}% (False Potato on non-Potato crops)")
    print(f"\nSaved metrics to: {os.path.abspath(output_metrics_path)}")

    return metrics

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Evaluate PlantVillage Model and Analyze Potato Bias")
    parser.add_argument("--weights", type=str, default="./model_weights.pth")
    parser.add_argument("--dataset", type=str, default="./dataset/plantvillage")
    parser.add_argument("--output", type=str, default="./test_metrics.json")
    args = parser.parse_args()

    evaluate_model(args.weights, args.dataset, args.output)
