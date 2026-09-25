"""MobileNetV3 PlantVillage Training & Fine-Tuning Pipeline with Class Balancing."""

import os
import sys
import json
import time
import math
import random
import argparse
import numpy as np
from typing import Dict, Any, Tuple, List

try:
    import torch
    import torch.nn as nn
    import torch.optim as optim
    from torch.utils.data import DataLoader, Dataset, Subset, WeightedRandomSampler
    import torchvision.transforms as transforms
    from torchvision.models import mobilenet_v3_small, MobileNet_V3_Small_Weights
    from PIL import Image
    TORCH_AVAILABLE = True
except ImportError:
    TORCH_AVAILABLE = False

from app.ml.dataset_report import analyze_dataset

def set_seed(seed: int = 42):
    random.seed(seed)
    np.random.seed(seed)
    if TORCH_AVAILABLE:
        torch.manual_seed(seed)
        if torch.cuda.is_available():
            torch.cuda.manual_seed_all(seed)

class PlantVillageDataset(Dataset):
    def __init__(self, image_paths: List[str], labels: List[int], transform=None):
        self.image_paths = image_paths
        self.labels = labels
        self.transform = transform

    def __len__(self):
        return len(self.image_paths)

    def __getitem__(self, idx):
        img_path = self.image_paths[idx]
        label = self.labels[idx]
        try:
            image = Image.open(img_path).convert("RGB")
        except Exception:
            # Fallback black image if corrupt file
            image = Image.new("RGB", (224, 224), (0, 0, 0))

        if self.transform:
            image = self.transform(image)

        return image, label

def load_dataset_samples(dataset_dir: str, class_names: List[str]) -> Tuple[List[str], List[int]]:
    class_to_idx = {name: i for i, name in enumerate(class_names)}
    image_paths = []
    labels = []

    for class_name in class_names:
        class_dir = os.path.join(dataset_dir, class_name)
        if not os.path.exists(class_dir):
            continue
        for fname in os.listdir(class_dir):
            if fname.lower().endswith(('.jpg', '.jpeg', '.png', '.bmp')):
                image_paths.append(os.path.join(class_dir, fname))
                labels.append(class_to_idx[class_name])

    return image_paths, labels

def create_split(
    image_paths: List[str],
    labels: List[int],
    train_ratio: float = 0.70,
    val_ratio: float = 0.15,
    seed: int = 42
) -> Tuple[List[int], List[int], List[int]]:
    """Stratified 70/15/15 train/val/test split."""
    set_seed(seed)
    class_indices = {}
    for idx, label in enumerate(labels):
        if label not in class_indices:
            class_indices[label] = []
        class_indices[label].append(idx)

    train_idx, val_idx, test_idx = [], [], []

    for label, idxs in class_indices.items():
        random.shuffle(idxs)
        n = len(idxs)
        n_train = int(n * train_ratio)
        n_val = int(n * val_ratio)

        train_idx.extend(idxs[:n_train])
        val_idx.extend(idxs[n_train:n_train + n_val])
        test_idx.extend(idxs[n_train + n_val:])

    return train_idx, val_idx, test_idx

def calibrate_temperature(model, val_loader, device) -> float:
    """Find optimal temperature T on validation set using NLL loss minimization."""
    model.eval()
    logits_list, labels_list = [], []
    with torch.no_grad():
        for images, labels in val_loader:
            images = images.to(device)
            logits = model(images)
            logits_list.append(logits)
            labels_list.append(labels.to(device))

    logits_all = torch.cat(logits_list, dim=0)
    labels_all = torch.cat(labels_list, dim=0)

    temperature = nn.Parameter(torch.ones(1) * 1.5)
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.LBFGS([temperature], lr=0.01, max_iter=50)

    def eval_fn():
        optimizer.zero_grad()
        loss = criterion(logits_all / temperature, labels_all)
        loss.backward()
        return loss

    optimizer.step(eval_fn)
    best_temp = max(float(temperature.item()), 0.5)
    return round(best_temp, 4)

def build_mobilenet_v3(num_classes: int):
    """Build MobileNetV3 Small model pretrained on ImageNet."""
    weights = MobileNet_V3_Small_Weights.DEFAULT
    model = mobilenet_v3_small(weights=weights)
    in_features = model.classifier[3].in_features
    model.classifier[3] = nn.Linear(in_features, num_classes)
    return model

def train_pipeline(
    dataset_dir: str,
    output_model_path: str = "./model_weights.pth",
    epochs_stage1: int = 3,
    epochs_stage2: int = 5,
    batch_size: int = 32,
    lr_stage1: float = 1e-3,
    lr_stage2: float = 1e-4,
    seed: int = 42
):
    if not TORCH_AVAILABLE:
        print("Error: PyTorch and Torchvision are required for model training.")
        sys.exit(1)

    set_seed(seed)
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Using compute device: {device}")

    # Load class names
    ml_dir = os.path.dirname(os.path.abspath(__file__))
    class_names_file = os.path.join(ml_dir, "class_names.json")
    if not os.path.exists(class_names_file):
        from app.ml.config_generator import generate_configs
        generate_configs(ml_dir)

    with open(class_names_file, "r") as f:
        class_names = json.load(f)

    # 1. Dataset verification
    report = analyze_dataset(dataset_dir)
    if not report.get("exists"):
        print("\n[ERROR] Cannot proceed with training: Dataset not found.")
        print(report.get("error"))
        print("\nINSTRUCTIONS:")
        print(report.get("instructions"))
        return False

    print(f"\nLoaded dataset with {report['total_images']} images across {report['total_classes']} classes.")

    image_paths, labels = load_dataset_samples(dataset_dir, class_names)
    train_idx, val_idx, test_idx = create_split(image_paths, labels, seed=seed)

    print(f"Split sizes -> Train: {len(train_idx)}, Val: {len(val_idx)}, Test: {len(test_idx)}")

    # 2. Augmentations
    train_transform = transforms.Compose([
        transforms.RandomResizedCrop(224, scale=(0.8, 1.0)),
        transforms.RandomHorizontalFlip(),
        transforms.RandomRotation(15),
        transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])

    val_test_transform = transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])

    # 3. Datasets & Weighted Sampler for Class Balancing
    train_paths = [image_paths[i] for i in train_idx]
    train_labels = [labels[i] for i in train_idx]

    val_paths = [image_paths[i] for i in val_idx]
    val_labels = [labels[i] for i in val_idx]

    test_paths = [image_paths[i] for i in test_idx]
    test_labels = [labels[i] for i in test_idx]

    class_sample_counts = np.bincount(train_labels, minlength=len(class_names))
    class_weights = 1.0 / np.maximum(class_sample_counts, 1)
    sample_weights = np.array([class_weights[t] for t in train_labels])
    sampler = WeightedRandomSampler(weights=sample_weights, num_samples=len(sample_weights), replacement=True)

    train_ds = PlantVillageDataset(train_paths, train_labels, transform=train_transform)
    val_ds = PlantVillageDataset(val_paths, val_labels, transform=val_test_transform)
    test_ds = PlantVillageDataset(test_paths, test_labels, transform=val_test_transform)

    train_loader = DataLoader(train_ds, batch_size=batch_size, sampler=sampler, num_workers=0)
    val_loader = DataLoader(val_ds, batch_size=batch_size, shuffle=False, num_workers=0)
    test_loader = DataLoader(test_ds, batch_size=batch_size, shuffle=False, num_workers=0)

    # 4. Model Construction & Stage 1 (Head Training)
    model = build_mobilenet_v3(num_classes=len(class_names)).to(device)

    # Freeze backbone
    for param in model.features.parameters():
        param.requires_grad = False

    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.classifier.parameters(), lr=lr_stage1)

    print("\n--- Stage 1: Training Classification Head (Backbone Frozen) ---")
    for epoch in range(1, epochs_stage1 + 1):
        model.train()
        running_loss = 0.0
        correct = 0
        total = 0
        for images, lbls in train_loader:
            images, lbls = images.to(device), lbls.to(device)
            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, lbls)
            loss.backward()
            optimizer.step()

            running_loss += loss.item() * images.size(0)
            _, preds = torch.max(outputs, 1)
            correct += (preds == lbls).sum().item()
            total += images.size(0)

        epoch_loss = running_loss / total
        epoch_acc = (correct / total) * 100.0
        print(f"Stage 1 - Epoch {epoch}/{epochs_stage1} | Loss: {epoch_loss:.4f} | Train Acc: {epoch_acc:.2f}%")

    # 5. Stage 2 (Fine-tuning backbone)
    print("\n--- Stage 2: Fine-Tuning Full Network ---")
    for param in model.features.parameters():
        param.requires_grad = True

    optimizer = optim.Adam(model.parameters(), lr=lr_stage2)

    best_val_acc = 0.0
    best_model_state = None

    for epoch in range(1, epochs_stage2 + 1):
        model.train()
        running_loss = 0.0
        correct = 0
        total = 0
        for images, lbls in train_loader:
            images, lbls = images.to(device), lbls.to(device)
            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, lbls)
            loss.backward()
            optimizer.step()

            running_loss += loss.item() * images.size(0)
            _, preds = torch.max(outputs, 1)
            correct += (preds == lbls).sum().item()
            total += images.size(0)

        train_acc = (correct / total) * 100.0

        # Validation
        model.eval()
        val_correct = 0
        val_total = 0
        with torch.no_grad():
            for images, lbls in val_loader:
                images, lbls = images.to(device), lbls.to(device)
                outputs = model(images)
                _, preds = torch.max(outputs, 1)
                val_correct += (preds == lbls).sum().item()
                val_total += images.size(0)

        val_acc = (val_correct / val_total) * 100.0 if val_total > 0 else 0.0
        print(f"Stage 2 - Epoch {epoch}/{epochs_stage2} | Train Acc: {train_acc:.2f}% | Val Acc: {val_acc:.2f}%")

        if val_acc >= best_val_acc:
            best_val_acc = val_acc
            best_model_state = model.state_dict().copy()

    if best_model_state:
        model.load_state_dict(best_model_state)

    # 6. Temperature Calibration
    print("\nCalibrating model temperature scaling on validation set...")
    temp_scale = calibrate_temperature(model, val_loader, device)
    print(f"Optimal Calibration Temperature T = {temp_scale}")

    # 7. Save Checkpoint & Metadata
    os.makedirs(os.path.dirname(os.path.abspath(output_model_path)), exist_ok=True)
    checkpoint = {
        "state_dict": model.state_dict(),
        "class_names": class_names,
        "temperature": temp_scale,
        "best_val_acc": best_val_acc,
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
    }
    torch.save(checkpoint, output_model_path)
    print(f"\n[SUCCESS] Model checkpoint saved to: {os.path.abspath(output_model_path)}")

    return True

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train MobileNetV3 on PlantVillage")
    parser.add_argument("--dataset", type=str, default="./dataset/plantvillage", help="Path to PlantVillage dataset")
    parser.add_argument("--output", type=str, default="./model_weights.pth", help="Path to save trained weights")
    parser.add_argument("--epochs1", type=int, default=3, help="Stage 1 epochs")
    parser.add_argument("--epochs2", type=int, default=5, help="Stage 2 epochs")
    parser.add_argument("--batch", type=int, default=32, help="Batch size")
    args = parser.parse_args()

    train_pipeline(
        dataset_dir=args.dataset,
        output_model_path=args.output,
        epochs_stage1=args.epochs1,
        epochs_stage2=args.epochs2,
        batch_size=args.batch
    )
