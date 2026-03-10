@echo off
echo Starting Dashboard on port 3001...
start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" "http://localhost:3001"
cd /d C:\Users\karma\Desktop\ffs
node dashboard.cjs
