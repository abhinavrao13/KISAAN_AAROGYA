import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_register_success():
    payload = {
        "full_name": "Ramesh Kumar",
        "email": "ramesh.farmer@example.com",
        "password": "SecretPassword123!",
        "confirm_password": "SecretPassword123!",
        "phone": "+91 9876543210",
        "location": "Punjab Agri Belt",
        "role": "farmer"
    }
    response = client.post("/api/auth/register", json=payload)
    # If already exists from earlier test run, it's either 200 or 400
    assert response.status_code in [200, 400]
    if response.status_code == 200:
        data = response.json()
        assert data["success"] is True
        assert "Account created successfully" in data["message"]

def test_register_mismatched_password():
    payload = {
        "full_name": "Test User",
        "email": "test.mismatch@example.com",
        "password": "Password123!",
        "confirm_password": "DifferentPassword456!",
        "role": "farmer"
    }
    response = client.post("/api/auth/register", json=payload)
    assert response.status_code == 400
    assert "Passwords do not match" in response.json()["detail"]

def test_register_duplicate_email():
    payload = {
        "full_name": "Duplicate User",
        "email": "duplicate.test@example.com",
        "password": "Password123!",
        "confirm_password": "Password123!"
    }
    # First registration
    client.post("/api/auth/register", json=payload)
    # Second registration should fail
    response = client.post("/api/auth/register", json=payload)
    assert response.status_code == 400
    assert "already exists" in response.json()["detail"]

def test_login_and_profile_and_logout():
    email = "auth.flow.test@example.com"
    password = "StrongPassword789!"

    # 1. Register user
    reg_res = client.post("/api/auth/register", json={
        "full_name": "Flow Test Farmer",
        "email": email,
        "password": password,
        "confirm_password": password,
        "location": "Haryana Belt",
        "role": "farmer"
    })
    assert reg_res.status_code in [200, 400]

    # 2. Test invalid password
    bad_login = client.post("/api/auth/login", json={
        "email": email,
        "password": "WrongPassword123!"
    })
    assert bad_login.status_code == 401

    # 3. Test successful login
    good_login = client.post("/api/auth/login", json={
        "email": email,
        "password": password,
        "remember_me": True
    })
    assert good_login.status_code == 200
    login_data = good_login.json()
    assert login_data["success"] is True
    assert "token" in login_data
    token = login_data["token"]
    assert login_data["user"]["full_name"] == "Flow Test Farmer"

    # 4. Test /api/auth/me with Bearer token
    headers = {"Authorization": f"Bearer {token}"}
    me_res = client.get("/api/auth/me", headers=headers)
    assert me_res.status_code == 200
    me_data = me_res.json()
    assert me_data["success"] is True
    assert me_data["user"]["email"] == email

    # 5. Test logout
    logout_res = client.post("/api/auth/logout", headers=headers)
    assert logout_res.status_code == 200
    assert logout_res.json()["success"] is True

    # 6. Test /api/auth/me after logout (should be 401)
    post_logout_me = client.get("/api/auth/me", headers=headers)
    assert post_logout_me.status_code == 401
