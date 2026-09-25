import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, JSON, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class ScanRecord(Base):
    __tablename__ = "scan_records"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))
    image_url = Column(String(255), nullable=True)
    mask_url = Column(String(255), nullable=True)
    
    # Diagnosis
    crop = Column(String(100), nullable=False)
    disease = Column(String(150), nullable=False)
    confidence = Column(Float, nullable=False)
    raw_class = Column(String(150), nullable=False)
    
    # Severity & Affected Area
    severity_level = Column(String(50), nullable=False) # Healthy, Mild, Moderate, Severe, Critical
    affected_area_percent = Column(Float, default=0.0)
    
    # Weather & Risk
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    location_name = Column(String(100), nullable=True)
    temperature_c = Column(Float, nullable=True)
    humidity_percent = Column(Float, nullable=True)
    risk_score = Column(Float, default=0.0)
    risk_level = Column(String(50), default="LOW") # LOW, MODERATE, HIGH, CRITICAL
    
    # Recommendations & Speech
    top_recommendations = Column(JSON, nullable=True)
    audio_transcript = Column(Text, nullable=True)

class SoilRecord(Base):
    __tablename__ = "soil_records"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    report_image_url = Column(String(255), nullable=True)
    
    ph = Column(Float, nullable=True)
    ec = Column(Float, nullable=True)
    organic_carbon = Column(Float, nullable=True)
    nitrogen = Column(Float, nullable=True)
    phosphorus = Column(Float, nullable=True)
    potassium = Column(Float, nullable=True)
    zinc = Column(Float, nullable=True)
    iron = Column(Float, nullable=True)
    sulphur = Column(Float, nullable=True)
    
    soil_health_grade = Column(String(50), default="Moderate")
    summary = Column(Text, nullable=True)
    parameters_json = Column(JSON, nullable=True)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(150), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    salt = Column(String(64), nullable=False)
    phone = Column(String(20), nullable=True)
    location = Column(String(100), nullable=True)
    role = Column(String(50), default="farmer")  # farmer, agronomist, researcher, student
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))

    tokens = relationship("AuthToken", back_populates="user", cascade="all, delete-orphan")

class AuthToken(Base):
    __tablename__ = "auth_tokens"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    token = Column(String(128), unique=True, index=True, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))

    user = relationship("User", back_populates="tokens")

