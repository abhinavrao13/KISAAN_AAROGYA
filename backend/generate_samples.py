"""Generate realistic synthetic crop leaf samples and soil health card for instant testing and demos."""

import os
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

SAMPLE_DIR = Path(__file__).resolve().parent.parent / "sample_data" / "sample_leaves"
SOIL_DIR = Path(__file__).resolve().parent.parent / "sample_data" / "sample_soil_reports"
STATIC_SAMPLES = Path(__file__).resolve().parent / "static" / "samples"

SAMPLE_DIR.mkdir(parents=True, exist_ok=True)
SOIL_DIR.mkdir(parents=True, exist_ok=True)
STATIC_SAMPLES.mkdir(parents=True, exist_ok=True)

def create_base_leaf(width=400, height=400, base_color=(56, 142, 60)):
    """Draw a realistic leaf shape on neutral off-white background."""
    img = Image.new("RGB", (width, height), (245, 247, 245))
    draw = ImageDraw.Draw(img)
    
    # Elliptical / ovate leaf polygon
    center_x, center_y = width // 2, height // 2
    points = []
    num_pts = 60
    for i in range(num_pts):
        angle = (2 * math.pi * i) / num_pts
        # Ovate shape formula
        rx = 130 * (1 - 0.3 * math.sin(angle)) * math.sin(angle)
        ry = -160 * math.cos(angle)
        # Slight leaf waviness
        rx += math.sin(angle * 7) * 4
        points.append((center_x + rx, center_y + ry))
        
    draw.polygon(points, fill=base_color, outline=(38, 100, 42))
    
    # Central midrib vein
    draw.line([(center_x, center_y - 150), (center_x, center_y + 150)], fill=(76, 175, 80), width=4)
    # Lateral veins
    for dy in range(-120, 130, 30):
        draw.line([(center_x, center_y + dy), (center_x - 70, center_y + dy - 30)], fill=(76, 175, 80), width=2)
        draw.line([(center_x, center_y + dy), (center_x + 70, center_y + dy - 30)], fill=(76, 175, 80), width=2)
        
    return img, (center_x, center_y)

def create_tomato_early_blight():
    img, (cx, cy) = create_base_leaf(base_color=(67, 160, 71))
    draw = ImageDraw.Draw(img)
    
    # Target-board concentric brown rings (Early blight signature)
    lesion_centers = [
        (cx - 45, cy - 50, 32),
        (cx + 35, cy + 30, 26),
        (cx - 30, cy + 65, 22),
        (cx + 40, cy - 70, 20)
    ]
    
    for lx, ly, r in lesion_centers:
        # Yellow chlorotic halo
        draw.ellipse([lx - r - 8, ly - r - 8, lx + r + 8, ly + r + 8], fill=(212, 175, 55))
        # Concentric dark brown circles
        draw.ellipse([lx - r, ly - r, lx + r, ly + r], fill=(93, 64, 55))
        draw.ellipse([lx - r + 6, ly - r + 6, lx + r - 6, ly + r - 6], fill=(62, 39, 35))
        draw.ellipse([lx - r + 12, ly - r + 12, lx + r - 12, ly + r - 12], fill=(120, 80, 60))
        draw.ellipse([lx - r + 16, ly - r + 16, lx + r - 16, ly + r - 16], fill=(44, 26, 23))

    return img

def create_potato_late_blight():
    img, (cx, cy) = create_base_leaf(base_color=(50, 130, 55))
    draw = ImageDraw.Draw(img)
    
    # Water-soaked irregular black necrotic lesions with pale border
    lesion_spots = [
        (cx - 60, cy - 20, 45),
        (cx + 40, cy + 40, 50),
        (cx - 20, cy + 90, 35)
    ]
    for lx, ly, r in lesion_spots:
        # Pale chlorotic margin
        draw.ellipse([lx - r - 6, ly - r - 6, lx + r + 6, ly + r + 6], fill=(160, 160, 90))
        # Dark necrotic blotch
        draw.ellipse([lx - r, ly - r, lx + r, ly + r], fill=(30, 30, 30))
        # Inner grayish water-soaked patch
        draw.ellipse([lx - r + 10, ly - r + 10, lx + r - 10, ly + r - 10], fill=(50, 50, 45))

    return img

def create_corn_common_rust():
    # Long slender corn-like leaf
    img = Image.new("RGB", (400, 400), (245, 247, 245))
    draw = ImageDraw.Draw(img)
    
    # Slender elongated corn leaf
    leaf_poly = [
        (160, 40), (240, 40), (250, 360), (150, 360)
    ]
    draw.polygon(leaf_poly, fill=(76, 175, 80), outline=(46, 125, 50))
    # Parallel veins
    for vx in range(165, 240, 8):
        draw.line([(vx, 40), (vx, 360)], fill=(90, 195, 95), width=1)
        
    # Cinnamon brown rust pustules (raised blisters)
    np.random.seed(42)
    for _ in range(70):
        px = np.random.randint(165, 235)
        py = np.random.randint(70, 330)
        pw = np.random.randint(4, 9)
        ph = np.random.randint(8, 18)
        draw.ellipse([px, py, px + pw, py + ph], fill=(183, 75, 25), outline=(130, 45, 10))

    return img

def create_healthy_tomato():
    img, _ = create_base_leaf(base_color=(46, 125, 50))
    return img

def create_pepper_bacterial_spot():
    img, (cx, cy) = create_base_leaf(base_color=(56, 142, 60))
    draw = ImageDraw.Draw(img)
    
    # Multiple small angular dark water-soaked spots with yellow halos
    np.random.seed(101)
    for _ in range(40):
        sx = cx + np.random.randint(-70, 70)
        sy = cy + np.random.randint(-100, 100)
        sr = np.random.randint(3, 8)
        draw.ellipse([sx - sr - 2, sy - sr - 2, sx + sr + 2, sy + sr + 2], fill=(200, 190, 60))
        draw.ellipse([sx - sr, sy - sr, sx + sr, sy + sr], fill=(45, 30, 20))

    return img

def create_soil_health_card():
    # Card mockup
    img = Image.new("RGB", (650, 450), (255, 255, 255))
    draw = ImageDraw.Draw(img)
    
    # Header banner
    draw.rectangle([0, 0, 650, 65], fill=(46, 125, 50))
    draw.text((20, 15), "SOIL HEALTH CARD - LAB ANALYSIS REPORT", fill=(255, 255, 255))
    draw.text((20, 38), "Department of Agriculture & Farmers Welfare, Govt of India", fill=(200, 230, 201))
    
    # Sample details
    draw.rectangle([20, 80, 630, 130], outline=(200, 200, 200), width=1)
    draw.text((30, 90), "Farmer Name: Ramesh Kumar   |   Village: Anandpur   |   Survey No: 142/3", fill=(50, 50, 50))
    draw.text((30, 108), "Soil Type: Sandy Loam   |   Sample Date: 12-Sep-2026   |   Lab Ref: SHC-8921", fill=(80, 80, 80))
    
    # Table header
    draw.rectangle([20, 145, 630, 175], fill=(232, 245, 233))
    draw.text((30, 152), "Parameter Name", fill=(30, 70, 32))
    draw.text((250, 152), "Test Value", fill=(30, 70, 32))
    draw.text((360, 152), "Unit", fill=(30, 70, 32))
    draw.text((470, 152), "Rating", fill=(30, 70, 32))
    
    rows = [
        ("pH (Soil Reaction)", "6.7", "scale", "Neutral / Optimal"),
        ("Electrical Conductivity (EC)", "0.38", "dS/m", "Normal"),
        ("Organic Carbon (OC)", "0.44", "%", "Low"),
        ("Available Nitrogen (N)", "215.0", "kg/ha", "Low"),
        ("Available Phosphorus (P)", "16.2", "kg/ha", "Medium"),
        ("Available Potassium (K)", "185.0", "kg/ha", "Medium"),
        ("Available Zinc (Zn)", "0.48", "ppm", "Deficient"),
        ("Available Iron (Fe)", "6.2", "ppm", "Sufficient"),
        ("Available Sulphur (S)", "9.1", "ppm", "Deficient")
    ]
    
    y = 185
    for name, val, unit, rating in rows:
        draw.text((30, y), name, fill=(40, 40, 40))
        draw.text((250, y), val, fill=(0, 0, 0))
        draw.text((360, y), unit, fill=(80, 80, 80))
        
        rating_color = (198, 40, 40) if "Low" in rating or "Deficient" in rating else (46, 125, 50)
        draw.text((470, y), rating, fill=rating_color)
        draw.line([(20, y + 22), (630, y + 22)], fill=(240, 240, 240), width=1)
        y += 26
        
    return img

def main():
    samples = {
        "tomato_early_blight.jpg": create_tomato_early_blight(),
        "potato_late_blight.jpg": create_potato_late_blight(),
        "corn_common_rust.jpg": create_corn_common_rust(),
        "healthy_tomato.jpg": create_healthy_tomato(),
        "pepper_bacterial_spot.jpg": create_pepper_bacterial_spot()
    }
    
    for filename, img in samples.items():
        p1 = SAMPLE_DIR / filename
        p2 = STATIC_SAMPLES / filename
        img.save(p1, quality=95)
        img.save(p2, quality=95)
        print(f"Generated {filename}")
        
    soil_img = create_soil_health_card()
    soil_p1 = SOIL_DIR / "sample_soil_card.png"
    soil_p2 = STATIC_SAMPLES / "sample_soil_card.png"
    soil_img.save(soil_p1)
    soil_img.save(soil_p2)
    print("Generated sample_soil_card.png")

if __name__ == "__main__":
    main()
