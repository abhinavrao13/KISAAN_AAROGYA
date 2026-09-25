"""AI Crop Health Assistant - FastAPI Main Server."""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import STATIC_DIR
from app.database import Base, engine
from app.api.analyze import router as crop_router
from app.api.auth import router as auth_router

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI-Based Crop Health Assistant API",
    description="Multimodal Agricultural AI Platform: Disease Diagnosis, Lesion Severity, Weather Risk, Soil OCR, & Multilingual Voice Advisory",
    version="1.0.0"
)

# Enable CORS for local development and mobile web clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static uploads directory
app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

# Include API routers
app.include_router(crop_router)
app.include_router(auth_router)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "AI Crop Health Assistant Backend",
        "version": "1.0.0",
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    host = os.environ.get("HOST", "0.0.0.0")
    uvicorn.run("app.main:app", host=host, port=port, reload=True)
