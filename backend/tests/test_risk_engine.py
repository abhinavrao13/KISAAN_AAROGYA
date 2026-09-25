import pytest
from app.risk_engine.calculator import calculate_disease_spread_risk

def test_fungal_high_risk():
    weather = {
        "temperature_c": 25.0,
        "humidity_percent": 88.0,
        "precipitation_mm": 5.0,
        "wind_speed_kmh": 12.0
    }
    forecast = [
        {"mean_humidity_percent": 90.0, "precip_sum_mm": 15.0, "max_temp_c": 26.0},
        {"mean_humidity_percent": 85.0, "precip_sum_mm": 10.0, "max_temp_c": 27.0}
    ]
    
    risk = calculate_disease_spread_risk(
        pathogen_type="fungal",
        disease_name="Early Blight",
        current_weather=weather,
        forecast_days=forecast,
        current_severity=20.0
    )
    
    assert risk["risk_level"] in ["HIGH", "CRITICAL"]
    assert risk["risk_score"] > 60.0
    assert len(risk["key_drivers"]) > 0

def test_healthy_low_risk():
    weather = {
        "temperature_c": 28.0,
        "humidity_percent": 45.0,
        "precipitation_mm": 0.0,
        "wind_speed_kmh": 8.0
    }
    risk = calculate_disease_spread_risk(
        pathogen_type="none",
        disease_name="Healthy",
        current_weather=weather,
        forecast_days=[],
        current_severity=0.0
    )
    assert risk["risk_level"] == "LOW"
    assert risk["risk_score"] <= 35.0
