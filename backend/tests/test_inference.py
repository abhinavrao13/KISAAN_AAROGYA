import pytest
from app.ml.inference import classifier
from app.ml.labels import get_class_meta
from PIL import Image
import io

def test_class_meta():
    meta = get_class_meta("Tomato___Early_blight")
    assert meta["crop"] == "Tomato"
    assert meta["pathogen_type"] == "fungal"
    assert "Early Blight" in meta["disease"]

def test_inference_valid_crop():
    with open("sample_data/sample_leaves/tomato_early_blight.jpg", "rb") as f:
        img_bytes = f.read()
    
    result = classifier.predict(img_bytes, crop="Tomato", filename="IMG_001.jpg")
    assert result["status"] in ["DIAGNOSED", "LOW_CONFIDENCE"]
    assert result["is_valid_crop"] is True

def test_inference_crop_conditioning():
    """Ensure crop selection restricts predicted class to specified crop."""
    with open("sample_data/sample_leaves/tomato_early_blight.jpg", "rb") as f:
        img_bytes = f.read()
    
    # Restrict to Potato crop
    result = classifier.predict(img_bytes, crop="Potato", filename="IMG_002.jpg")
    if result["status"] == "DIAGNOSED":
        assert result["top_prediction"]["crop"] == "Potato"

def test_inference_non_leaf_rejection():
    # Create pure white blank image (simulating non-leaf photo)
    blank_img = Image.new("RGB", (300, 300), (255, 255, 255))
    buf = io.BytesIO()
    blank_img.save(buf, format="JPEG")
    blank_bytes = buf.getvalue()

    result = classifier.predict(blank_bytes, filename="IMG_999.jpg")
    assert result["status"] == "INVALID_LEAF"
    assert result["is_valid_crop"] is False
    assert "Foliage not detected" in result["error_message"]
