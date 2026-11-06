Write-Host "========================================" -ForegroundColor Magenta
Write-Host "  NOVA STORE — Full-Stack Launch Script  " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Magenta

# Check virtualenv
if (Test-Path "backend\.venv\Scripts\python.exe") {
    Write-Host "[1/2] Launching FastAPI Backend on http://localhost:8000..." -ForegroundColor Green
    Start-Process -FilePath "backend\.venv\Scripts\python.exe" -ArgumentList "-m uvicorn app.main:app --reload --port 8000" -WorkingDirectory "backend"
} else {
    Write-Host "[Error] Python virtualenv not found in backend\.venv" -ForegroundColor Red
}

# Launch Vite frontend
Write-Host "[2/2] Launching Vite React Frontend on http://localhost:5173..." -ForegroundColor Green
Start-Process -FilePath "npm.cmd" -ArgumentList "run dev" -WorkingDirectory "frontend"

Write-Host "System initialized! Visit http://localhost:5173" -ForegroundColor Cyan
