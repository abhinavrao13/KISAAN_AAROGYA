import pytest
from app.cv.severity import segment_leaf_and_lesions

def test_severity_segmentation():
    with open("sample_data/sample_leaves/tomato_early_blight.jpg", "rb") as f:
        img_bytes = f.read()

    result = segment_leaf_and_lesions(img_bytes)
    assert result["is_valid_leaf"] is True
    assert result["total_leaf_pixels"] > 1000
    assert result["lesion_pixels"] > 0
    assert result["affected_area_percent"] > 0.0
    assert result["overlay_base64"].startswith("data:image/png;base64,")

def test_healthy_severity():
    with open("sample_data/sample_leaves/healthy_tomato.jpg", "rb") as f:
        img_bytes = f.read()

    result = segment_leaf_and_lesions(img_bytes)
    assert result["is_valid_leaf"] is True
    assert result["affected_area_percent"] < 10.0
