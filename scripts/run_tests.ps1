Write-Host "Executing Backend Automated Test Suite..." -ForegroundColor Cyan
Set-Location backend
& ".\.venv\Scripts\pytest.exe" ..\tests\backend\test_api_endpoints.py -v -s
Set-Location ..
Write-Host "Tests Complete." -ForegroundColor Green
