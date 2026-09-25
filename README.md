# 🌾 KisanArogya AI - AI-Powered Crop Health Intelligence Platform

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61DAFB.svg?logo=react&logoColor=black)](https://reactjs.org)
[![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![PyTorch](https://img.shields.io/badge/AI%20Model-PyTorch%20MobileNetV3-EE4C2C.svg?logo=pytorch&logoColor=white)](https://pytorch.org)
[![OpenCV](https://img.shields.io/badge/Vision-OpenCV%20Pathology-5C3EE8.svg?logo=opencv&logoColor=white)](https://opencv.org)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel%20%2B%20Railway%2FRender-black.svg?logo=vercel&logoColor=white)](https://vercel.com)

**KisanArogya AI** is an end-to-end multimodal agricultural AI platform designed to help farmers and agronomists detect foliar plant diseases early, quantify lesion severity, calculate weather-driven epidemiological spread risks, and receive actionable organic & chemical treatment advisory in 6 regional Indian languages.

---

## 🏛️ System Architecture

```
                               ┌──────────────────────────────────────────────┐
                               │             Farmer / Web Client              │
                               └──────────────────────┬───────────────────────┘
                                                      │
                                                      ▼
                               ┌──────────────────────────────────────────────┐
                               │             Vercel Frontend (SPA)            │
                               │  - Landing Page (AgriTech Showcase)          │
                               │  - Secure Auth (Register / Login / Session)  │
                               │  - Disease Diagnosis Dashboard               │
                               │  - Outbreak Radar Map & Soil OCR             │
                               └──────────────────────┬───────────────────────┘
                                                      │ HTTPS / REST API
                                                      ▼
                               ┌──────────────────────────────────────────────┐
                               │        FastAPI Production Backend            │
                               │  - PBKDF2-HMAC-SHA256 Auth & Bearer Tokens   │
                               │  - Crop-Conditioned Masking Engine           │
                               │  - Open-Meteo Weather Risk Model             │
                               │  - Geodesic Outbreak Clustering              │
                               └──────────────┬───────────────────────────────┘
                                              │
                       ┌──────────────────────┴──────────────────────┐
                       ▼                                             ▼
        ┌─────────────────────────────┐               ┌─────────────────────────────┐
        │       Railway Database      │               │   AI / CV Inference Engine  │
        │  - PostgreSQL / SQLite      │               │  - MobileNetV3 PyTorch NN   │
        │  - Users & Auth Tokens      │               │  - OpenCV Foliar Pathology  │
        │  - Scan Records & Soil OCR  │               │  - ExG & HSV Chlorosis Mask │
        └─────────────────────────────┘               └─────────────────────────────┘
```

---

## ✨ Core Features

1. **AI-Powered Plant Disease Diagnosis**:
   - Classifies **38 distinct foliar disease classes** across 14 major agricultural crops (Tomato, Potato, Corn, Apple, Grape, Pepper, Peach, Cherry, Strawberry, Squash, etc.).
   - **Hybrid Inference Engine**: Employs an intelligent dual-mode system (MobileNetV3 neural network + advanced OpenCV foliar pathology) providing high-confidence predictions (88%–97%).
2. **Crop-Conditioned Masking**:
   - Allows farmers to select their crop to suppress cross-crop false positives via mathematical logit filtering.
3. **Computer Vision Lesion Severity Quantification**:
   - Analyzes chlorophyll indices (ExG = 2G - R - B) and HSV necrosis/chlorosis halos to compute exact affected leaf area percentage and severity level (Healthy, Mild, Moderate, Severe, Critical).
4. **Epidemiological Weather Spread Risk**:
   - Connects live GPS coordinates to real-time meteorological forecasts (temperature, relative humidity, precipitation) to calculate disease spread likelihood.
5. **Soil Health Card OCR & Fertilizer Advisory**:
   - Parses NPK nutrients, pH, Electrical Conductivity, and micronutrients from photographed Soil Health Cards.
6. **Multilingual Voice Assistant**:
   - Natural speech synthesis in **Hindi, Punjabi, Marathi, Telugu, Tamil, and English**.
7. **Community Outbreak Radar Map**:
   - Visualizes nearby agricultural infection clusters within configurable radius buffers (5km–25km).
8. **Secure Authentication & Session Management**:
   - PBKDF2 with HMAC-SHA256 (100,000 iterations) and 256-bit cryptographically secure session tokens.
   - Protected routes with automatic redirects for unauthenticated access.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Leaflet, React-Leaflet, Lucide Icons, Canvas Confetti |
| **Backend** | Python 3.11+, FastAPI, Uvicorn, Gunicorn, Pydantic v2, SQLAlchemy 2.0, HTTPX |
| **AI / ML & CV** | PyTorch, Torchvision (MobileNetV3-Small), OpenCV (Headless), NumPy, Pillow |
| **OCR** | Tesseract OCR engine wrapper & heuristic parameter parser |
| **Database** | PostgreSQL (Railway / Render) & SQLite (local development) |
| **Deployment** | Vercel (Frontend SPA), Railway / Render / Docker (Backend API) |

---

## 🚀 Local Development Setup

### Prerequisites
- **Python 3.11+**
- **Node.js 18+** & **npm**

### 1. Backend Setup
```bash
cd backend
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
source .venv/bin/activate

pip install -r requirements.txt
python run.py
```
*Backend runs at `http://127.0.0.1:8000` (Swagger docs: `http://127.0.0.1:8000/docs`)*

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs at `http://localhost:5173`*

### Quick Start (Windows)
Double-click [`run_app.bat`](file:///d:/SIH%20IGRIS%203.0/SIH%20IGRIS/run_app.bat) to launch both backend and frontend servers simultaneously.

---

## ⚙️ Environment Variables

### Backend Configuration
| Variable | Description | Default |
| :--- | :--- | :--- |
| `DATABASE_URL` | Production PostgreSQL connection URL (e.g. from Railway/Render) | `sqlite:///crop_health.db` |
| `PORT` | HTTP port for server | `8000` |
| `HOST` | Bind host address | `0.0.0.0` |
| `CORS_ORIGINS` | Allowed CORS origins (comma-separated or `*`) | `*` |
| `ENVIRONMENT` | Runtime environment (`production` / `development`) | `development` |

### Frontend Configuration
| Variable | Description | Default |
| :--- | :--- | :--- |
| `VITE_API_URL` | Deployed backend URL (e.g. `https://your-backend.onrender.com`) | `""` (uses relative proxy) |

---

## 🌐 Production Deployment Guide

### 1. Database (Railway PostgreSQL)
1. Go to [Railway.app](https://railway.app) and create a **New Project** $\rightarrow$ **Provision PostgreSQL**.
2. In the PostgreSQL service **Variables** tab, copy the `DATABASE_URL` (format: `postgresql://postgres:password@host:port/railway`).

### 2. Backend (Render / Railway)

#### Option A: Deploy to Render (Recommended Free Tier)
1. Go to [Render.com](https://render.com) and click **New +** $\rightarrow$ **Web Service**.
2. Connect your GitHub repository: `https://github.com/abhinavrao13/KISAAN_AAROGYA`.
3. Configure settings:
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. In **Environment Variables**, add:
   - `DATABASE_URL`: *(Your Railway or Render PostgreSQL URL)*
   - `CORS_ORIGINS`: `*`
   - `PYTHON_VERSION`: `3.11.9`
5. Click **Deploy**. Copy your live backend URL (e.g., `https://kisaan-aarogya-backend.onrender.com`).

#### Option B: Deploy to Railway (Docker)
1. On Railway, click **New Service** $\rightarrow$ **GitHub Repo** $\rightarrow$ `abhinavrao13/KISAAN_AAROGYA`.
2. Set Root Directory to `/` or use the included [`backend/Dockerfile`](file:///d:/SIH%20IGRIS%203.0/SIH%20IGRIS/backend/Dockerfile).
3. In service settings, add variable `DATABASE_URL` linked to your Railway PostgreSQL service.

### 3. Frontend (Vercel)
1. Go to [Vercel.com](https://vercel.com) $\rightarrow$ **Add New Project** $\rightarrow$ Import `abhinavrao13/KISAAN_AAROGYA`.
2. Configure settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. In **Environment Variables**, add:
   - `VITE_API_URL`: `https://your-backend-service.onrender.com` (your actual deployed backend URL)
4. Click **Deploy**. Vercel will build and assign your production domain.

---

## 🧪 Automated Testing

To run the complete test suite (18 automated tests covering API endpoints, Authentication, MobileNetV3 inference, Crop Conditioning, Foliar rejection, OCR, Severity segmentation, and Risk calculation):

```bash
python -m pytest backend/tests/ -v
```

---

## 📜 License & Acknowledgments
Built for agricultural sustainability, food security, and smallholder farmer empowerment.
- **Dataset**: PlantVillage Dataset (38 Classes)
- **Computer Vision**: OpenCV & Foliar Chlorosis Pathology Models
- **Weather API**: Open-Meteo Meteorological Forecasts
