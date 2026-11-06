Write-Host "Seeding NOVA STORE Database..." -ForegroundColor Cyan
Set-Location backend
& ".\.venv\Scripts\python.exe" seed_data.py
Set-Location ..
Write-Host "Database Seeding Complete." -ForegroundColor Green
