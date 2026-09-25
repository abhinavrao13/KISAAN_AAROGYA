"""PlantVillage Dataset Imbalance & Class Distribution Inspector."""

import os
import sys
import json
import argparse
from typing import Dict, Any

def analyze_dataset(dataset_dir: str) -> Dict[str, Any]:
    """Inspect dataset directory and compute per-class and per-crop sample counts."""
    if not os.path.exists(dataset_dir):
        return {
            "exists": False,
            "error": f"Dataset directory '{dataset_dir}' not found.",
            "instructions": (
                f"Please download the PlantVillage dataset and extract it to '{dataset_dir}'.\n"
                "Expected directory structure:\n"
                f"  {dataset_dir}/\n"
                "    Apple___Apple_scab/\n"
                "    Apple___healthy/\n"
                "    Potato___Early_blight/\n"
                "    ...\n"
            )
        }

    class_counts = {}
    crop_counts = {}
    total_images = 0

    for item in sorted(os.listdir(dataset_dir)):
        class_path = os.path.join(dataset_dir, item)
        if os.path.isdir(class_path):
            images = [
                f for f in os.listdir(class_path)
                if f.lower().endswith(('.jpg', '.jpeg', '.png', '.bmp'))
            ]
            count = len(images)
            class_counts[item] = count
            total_images += count

            crop_name = item.split("___")[0].replace("_(including_sour)", "").replace(",_bell", "")
            crop_counts[crop_name] = crop_counts.get(crop_name, 0) + count

    if total_images == 0:
        return {
            "exists": False,
            "error": f"No image files found in '{dataset_dir}'.",
            "instructions": f"Ensure '{dataset_dir}' contains subdirectories for each PlantVillage class with JPG/PNG images."
        }

    # Compute imbalance ratio and weights
    max_count = max(class_counts.values()) if class_counts else 1
    min_count = min(class_counts.values()) if class_counts else 1
    imbalance_ratio = max_count / max(min_count, 1)

    class_weights = {}
    for cls, cnt in class_counts.items():
        # Inverse class frequency weight
        class_weights[cls] = round(total_images / max(cnt * len(class_counts), 1), 4)

    return {
        "exists": True,
        "dataset_dir": os.path.abspath(dataset_dir),
        "total_classes": len(class_counts),
        "total_images": total_images,
        "imbalance_ratio": round(imbalance_ratio, 2),
        "class_counts": class_counts,
        "crop_counts": crop_counts,
        "class_weights": class_weights
    }

def print_report(report: Dict[str, Any]):
    """Format and print dataset report to console."""
    if not report.get("exists"):
        print("\n=======================================================")
        print(" [WARNING] PLANTVILLAGE DATASET NOT FOUND")
        print("=======================================================")
        print(report.get("error"))
        print("\nINSTRUCTIONS:")
        print(report.get("instructions"))
        return

    print("\n=======================================================")
    print(" PLANTVILLAGE DATASET ANALYSIS REPORT")
    print("=======================================================")
    print(f"Path: {report['dataset_dir']}")
    print(f"Total Classes: {report['total_classes']}")
    print(f"Total Images: {report['total_images']}")
    print(f"Imbalance Ratio (Max/Min): {report['imbalance_ratio']}x\n")

    print("CROP-LEVEL DISTRIBUTION:")
    print("-------------------------------------------------------")
    for crop, count in sorted(report['crop_counts'].items(), key=lambda x: x[1], reverse=True):
        pct = (count / report['total_images']) * 100
        bar = "#" * int(pct // 2)
        print(f"  {crop:<15} | {count:>5} imgs ({pct:>5.1f}%) | {bar}")

    print("\nPER-CLASS DISTRIBUTION (TOP 10 & BOTTOM 5):")
    print("-------------------------------------------------------")
    sorted_classes = sorted(report['class_counts'].items(), key=lambda x: x[1], reverse=True)
    for cls, count in sorted_classes[:10]:
        print(f"  {cls:<45} | {count:>5} imgs")
    if len(sorted_classes) > 15:
        print("  ...")
        for cls, count in sorted_classes[-5:]:
            print(f"  {cls:<45} | {count:>5} imgs")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Analyze PlantVillage Dataset Balance")
    parser.add_argument("--dataset", type=str, default="./dataset/plantvillage", help="Path to PlantVillage dataset")
    args = parser.parse_args()

    report = analyze_dataset(args.dataset)
    print_report(report)
