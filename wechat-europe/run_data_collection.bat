@echo off
REM Run data collection script for WeChat Europe Analysis

echo Installing required packages...
pip install -r requirements.txt

echo.
echo Running data collection script...
python data_collection.py

echo.
echo Data collection completed!
pause
