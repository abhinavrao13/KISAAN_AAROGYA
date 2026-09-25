@echo off
echo =========================================================
echo   Starting KisanArogya AI - AI Crop Health Assistant
echo =========================================================
echo.

if exist "%LOCALAPPDATA%\Programs\Python\Python313\python.exe" (
    set "PYTHON_EXE=%LOCALAPPDATA%\Programs\Python\Python313\python.exe"
) else if exist "%~dp0backend\.venv\Scripts\python.exe" (
    set "PYTHON_EXE=%~dp0backend\.venv\Scripts\python.exe"
) else (
    set "PYTHON_EXE=python"
)

start "Backend Server (FastAPI)" cmd /k "cd /d "%~dp0backend" && "%PYTHON_EXE%" run.py"
timeout /t 3 /nobreak >nul

start "Frontend App (Vite React)" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo Both servers are starting up!
echo Backend Docs:  http://127.0.0.1:8000/docs
echo Frontend App:  http://localhost:5173
echo =========================================================
pause

