import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "online"

def test_analyze_crop_endpoint():
    with open("sample_data/sample_leaves/tomato_early_blight.jpg", "rb") as f:
        response = client.post(
            "/api/analyze/crop",
            files={"file": ("tomato_early_blight.jpg", f, "image/jpeg")},
            data={"crop": "Tomato", "latitude": 28.6139, "longitude": 77.2090, "language": "hi"}
        )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["diagnosis"]["crop"] == "Tomato"
    assert data["severity"]["affected_area_percent"] > 0
    assert data["voice_summary"]["transcript"] != ""

def test_analyze_soil_endpoint():
    response = client.post("/api/analyze/soil")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert len(data["soil_report"]["parameters"]) > 0

def test_history_endpoint():
    response = client.get("/api/history")
    assert response.status_code == 200
    assert "history" in response.json()
