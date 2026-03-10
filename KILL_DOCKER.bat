@echo off
echo ========================================
echo   KILL ALL DOCKER PROCESSES
echo ========================================
echo.

taskkill /F /IM docker.exe 2>nul
taskkill /F /IM "Docker Desktop.exe" 2>nul
taskkill /F /IM com.docker.backend.exe 2>nul
taskkill /F /IM com.docker.build.exe 2>nul
taskkill /F /IM docker-compose.exe 2>nul
taskkill /F /IM docker-sandbox.exe 2>nul

echo DONE - Docker killed!
pause
