"""Computer Vision Engine: Leaf Segmentation, Lesion Area Quantification, and Visual Overlay."""

import io
import base64
import numpy as np
from PIL import Image
from typing import Dict, Any, Tuple

try:
    import cv2
except ImportError:
    cv2 = None

def segment_leaf_and_lesions(image_bytes: bytes) -> Dict[str, Any]:
    """Segment leaf from background, identify lesions, calculate affected %, and generate overlay."""
    # Open with PIL first
    pil_image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img_np = np.array(pil_image)
    h, w, _ = img_np.shape

    if cv2 is None:
        # Fallback if cv2 is not yet initialized
        return _fallback_segmentation(img_np)

    # 1. Convert to HSV and LAB
    hsv = cv2.cvtColor(img_np, cv2.COLOR_RGB2HSV)
    
    # 2. Segment entire leaf (Healthy + Diseased parts)
    # Most crop leaves (green + yellowing/brown areas) fall within broad saturation/value ranges
    # We also use Excess Green Index (ExG = 2G - R - B) to assist segmentation
    r = img_np[:, :, 0].astype(np.float32)
    g = img_np[:, :, 1].astype(np.float32)
    b = img_np[:, :, 2].astype(np.float32)
    exg = 2 * g - r - b

    # Leaf mask: green hue OR positive ExG with non-white/non-black background
    lower_plant = np.array([20, 25, 25])
    upper_plant = np.array([95, 255, 255])
    plant_hsv_mask = cv2.inRange(hsv, lower_plant, upper_plant)
    
    exg_mask = (exg > 5).astype(np.uint8) * 255
    
    # Combine to capture full leaf area
    combined_leaf_mask = cv2.bitwise_or(plant_hsv_mask, exg_mask)
    
    # Morphological cleaning
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7))
    combined_leaf_mask = cv2.morphologyEx(combined_leaf_mask, cv2.MORPH_CLOSE, kernel)
    combined_leaf_mask = cv2.morphologyEx(combined_leaf_mask, cv2.MORPH_OPEN, kernel)

    # Find the largest connected component (main leaf)
    contours, _ = cv2.findContours(combined_leaf_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    leaf_mask = np.zeros((h, w), dtype=np.uint8)
    if contours:
        # Take contours larger than 1% of the image
        min_area = (h * w) * 0.01
        valid_contours = [c for c in contours if cv2.contourArea(c) > min_area]
        if valid_contours:
            cv2.drawContours(leaf_mask, valid_contours, -1, 255, thickness=cv2.FILLED)
        else:
            largest = max(contours, key=cv2.contourArea)
            cv2.drawContours(leaf_mask, [largest], -1, 255, thickness=cv2.FILLED)
    else:
        leaf_mask = combined_leaf_mask

    total_leaf_pixels = int(np.count_nonzero(leaf_mask))
    total_image_pixels = h * w
    leaf_coverage_ratio = total_leaf_pixels / max(total_image_pixels, 1)

    # If practically no foliage detected, flag as non-foliar
    is_valid_leaf = leaf_coverage_ratio >= 0.04

    # 3. Lesion Segmentation on Leaf Area
    # Lesions: Chlorotic (yellowing/halo: Hue 15-32) or Necrotic (brown/black/grey spots: Hue 0-22, or low Saturation/Value)
    # Healthy tissue has Hue 35-85 with good saturation
    healthy_green_lower = np.array([34, 45, 40])
    healthy_green_upper = np.array([85, 255, 255])
    healthy_mask = cv2.inRange(hsv, healthy_green_lower, healthy_green_upper)
    healthy_mask = cv2.bitwise_and(healthy_mask, leaf_mask)

    # Lesion mask is leaf pixels that deviate from healthy green tissue
    # Specific necrotic / chlorotic color bounds
    chlorosis_lower = np.array([12, 50, 60])
    chlorosis_upper = np.array([33, 255, 255])
    chlorosis_mask = cv2.inRange(hsv, chlorosis_lower, chlorosis_upper)

    necrosis_lower = np.array([0, 30, 20])
    necrosis_upper = np.array([22, 255, 140])
    necrosis_mask = cv2.inRange(hsv, necrosis_lower, necrosis_upper)

    raw_lesion_mask = cv2.bitwise_or(chlorosis_mask, necrosis_mask)
    raw_lesion_mask = cv2.bitwise_and(raw_lesion_mask, leaf_mask)
    
    # Also include any unmasked leaf pixels that aren't healthy green (excluding central midrib if needed)
    unhealthy_on_leaf = cv2.bitwise_and(cv2.bitwise_not(healthy_mask), leaf_mask)
    lesion_mask = cv2.bitwise_and(raw_lesion_mask, unhealthy_on_leaf)

    # Clean lesion mask
    lesion_kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
    lesion_mask = cv2.morphologyEx(lesion_mask, cv2.MORPH_OPEN, lesion_kernel)

    lesion_pixels = int(np.count_nonzero(lesion_mask))
    
    if total_leaf_pixels > 0:
        affected_area_percent = (lesion_pixels / total_leaf_pixels) * 100.0
    else:
        affected_area_percent = 0.0

    # Classify severity
    if affected_area_percent < 2.0:
        severity_level = "Healthy / Trace"
        severity_color = "#22c55e" # emerald
    elif affected_area_percent < 10.0:
        severity_level = "Mild"
        severity_color = "#84cc16" # lime
    elif affected_area_percent < 25.0:
        severity_level = "Moderate"
        severity_color = "#f59e0b" # amber
    elif affected_area_percent < 50.0:
        severity_level = "Severe"
        severity_color = "#f97316" # orange
    else:
        severity_level = "Critical"
        severity_color = "#ef4444" # red

    # 4. Generate Visual Overlay
    overlay_b64 = _generate_overlay(img_np, leaf_mask, lesion_mask, severity_level, affected_area_percent)

    return {
        "is_valid_leaf": is_valid_leaf,
        "leaf_coverage_ratio": round(leaf_coverage_ratio, 3),
        "total_leaf_pixels": total_leaf_pixels,
        "lesion_pixels": lesion_pixels,
        "affected_area_percent": round(affected_area_percent, 1),
        "severity_level": severity_level,
        "severity_color": severity_color,
        "overlay_base64": overlay_b64
    }

def _generate_overlay(
    img_np: np.ndarray,
    leaf_mask: np.ndarray,
    lesion_mask: np.ndarray,
    severity_level: str,
    affected_percent: float
) -> str:
    """Generate high-contrast visual lesion overlay with contours."""
    overlay = img_np.copy()
    
    # Semi-transparent red highlight on lesions
    red_layer = np.zeros_like(img_np)
    red_layer[:, :] = [239, 68, 68] # Vibrant red
    
    # Apply alpha blending only on lesion pixels
    lesion_indices = lesion_mask > 0
    alpha = 0.50
    overlay[lesion_indices] = (
        (1 - alpha) * img_np[lesion_indices] + alpha * red_layer[lesion_indices]
    ).astype(np.uint8)

    # Draw vibrant contour lines around lesion boundaries
    lesion_contours, _ = cv2.findContours(lesion_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    cv2.drawContours(overlay, lesion_contours, -1, (255, 230, 0), thickness=2) # Bright yellow border

    # Draw leaf perimeter contour
    leaf_contours, _ = cv2.findContours(leaf_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    cv2.drawContours(overlay, leaf_contours, -1, (34, 197, 94), thickness=2) # Green leaf border

    # Encode to base64 PNG
    success, buffer = cv2.imencode(".png", cv2.cvtColor(overlay, cv2.COLOR_RGB2BGR))
    if not success:
        return ""
    
    b64_str = base64.b64encode(buffer).decode("utf-8")
    return f"data:image/png;base64,{b64_str}"

def _fallback_segmentation(img_np: np.ndarray) -> Dict[str, Any]:
    """Lightweight fallback in case cv2 is unavailable."""
    h, w, _ = img_np.shape
    total_pixels = h * w
    r = img_np[:, :, 0].astype(int)
    g = img_np[:, :, 1].astype(int)
    b = img_np[:, :, 2].astype(int)
    
    green_mask = (g > r) & (g > b)
    leaf_pixels = int(np.count_nonzero(green_mask))
    
    lesion_mask = (r > 100) & (g > 60) & (b < 80) & (r > g)
    lesion_pixels = int(np.count_nonzero(lesion_mask))
    
    affected = (lesion_pixels / max(leaf_pixels, 1)) * 100.0
    
    return {
        "is_valid_leaf": leaf_pixels > (total_pixels * 0.05),
        "leaf_coverage_ratio": round(leaf_pixels / total_pixels, 3),
        "total_leaf_pixels": leaf_pixels,
        "lesion_pixels": lesion_pixels,
        "affected_area_percent": round(affected, 1),
        "severity_level": "Moderate" if affected > 10 else "Mild",
        "severity_color": "#f59e0b",
        "overlay_base64": ""
    }
