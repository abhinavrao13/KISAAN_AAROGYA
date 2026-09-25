@echo off
echo ===============================================================
echo  KisanArogya AI - MobileNetV3 PlantVillage Training Script
echo ===============================================================
echo.
echo This will train a real MobileNetV3 model on the PlantVillage dataset.
echo.
echo STEP 1: Ensure your PlantVillage dataset is at:
echo   d:\SIH IGRIS 3.0\SIH IGRIS\backend\dataset\plantvillage\
echo.
echo STEP 2: Dataset structure must be:
echo   plantvillage\Apple___Apple_scab\  (images here)
echo   plantvillage\Apple___healthy\     (images here)
echo   plantvillage\Tomato___Early_blight\
echo   ... (38 class folders)
echo.
echo Download PlantVillage from:
echo   https://www.kaggle.com/datasets/vipoooool/new-plant-diseases-dataset
echo.
echo Starting dataset analysis...
echo.

if exist "%LOCALAPPDATA%\Programs\Python\Python313\python.exe" (
    set "VENV_PYTHON=%LOCALAPPDATA%\Programs\Python\Python313\python.exe"
) else (
    set "VENV_PYTHON=python"
)
set DATASET=d:\SIH IGRIS 3.0\SIH IGRIS\backend\dataset\plantvillage
set OUTPUT=d:\SIH IGRIS 3.0\SIH IGRIS\backend\app\ml\model_weights.pth

"%VENV_PYTHON%" -m app.ml.dataset_report --dataset "%DATASET%"
if errorlevel 1 (
    echo.
    echo [ERROR] Dataset not found. Please download and extract PlantVillage.
    pause
    exit /b 1
)

echo.
echo Dataset verified. Starting training pipeline...
echo Training may take 2-6 hours on CPU. Keep this window open.
echo.

"%VENV_PYTHON%" -m app.ml.train --dataset "%DATASET%" --output "%OUTPUT%" --epochs1 3 --epochs2 5 --batch 32

echo.
echo ===================================================
echo Training complete! Model saved to: %OUTPUT%
echo Restart the backend server to load new weights.
echo ===================================================
pause
