import pytest
from app.ocr.extractor import extract_soil_parameters_from_text, format_soil_report

def test_soil_parameter_extraction():
    sample_text = """
    GOVT OF INDIA SOIL HEALTH CARD
    pH: 6.2
    EC: 0.45 dS/m
    Organic Carbon: 0.38 %
    Available Nitrogen: 220 kg/ha
    Available Phosphorus: 14 kg/ha
    Available Potassium: 180 kg/ha
    Zinc: 0.51 ppm
    """
    report = extract_soil_parameters_from_text(sample_text)
    assert report["soil_health_grade"] is not None
    assert len(report["parameters"]) >= 6
    assert len(report["deficiencies"]) > 0

def test_fertilizer_advisory_generation():
    params = {
        "nitrogen": 190.0, # Low
        "potassium": 80.0,  # Low
        "zinc": 0.45        # Deficient
    }
    report = format_soil_report(params)
    recommendations_str = " ".join(report["recommendations"])
    assert "Urea" in recommendations_str
    assert "Potash" in recommendations_str
    assert "Zinc" in recommendations_str
