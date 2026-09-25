import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
STATIC_DIR = BASE_DIR / "static"
UPLOAD_DIR = STATIC_DIR / "uploads"
MASKS_DIR = STATIC_DIR / "masks"
DB_PATH = BASE_DIR / "crop_health.db"

UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
MASKS_DIR.mkdir(parents=True, exist_ok=True)

# Default location: New Delhi / Central Agricultural Belt
DEFAULT_LATITUDE = 28.6139
DEFAULT_LONGITUDE = 77.2090

# Computer Vision & Decision Thresholds
CONFIDENCE_THRESHOLD = 0.50
MIN_LEAF_COVERAGE_RATIO = 0.05
MAX_IMAGE_SIZE_MB = 10
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
