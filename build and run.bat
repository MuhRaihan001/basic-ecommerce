@echo off
cd frontend
npm run build
if %errorlevel% neq 0 (
    echo Build failed. Exiting...
    pause
    exit /b %errorlevel%
)
cd ../backend
npm start
pause
