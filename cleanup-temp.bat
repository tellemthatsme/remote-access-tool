@echo off
echo RemotePC Temp File Cleanup Utility
echo ==================================

echo Current disk space:
powershell -Command "Get-WmiObject -Class Win32_LogicalDisk -Filter 'Caption=\"C:\"' | Select-Object @{Name='FreeGB';Expression={[math]::Round($_.FreeSpace/1GB, 2)}}" 2>nul

echo.
echo Cleaning up CLI tool caches...

REM Clean Kilo cache
echo Cleaning Kilo tool-output...
if exist "C:\Users\karma\.local\share\kilo\tool-output" (
    rmdir /s /q "C:\Users\karma\.local\share\kilo\tool-output" 2>nul
    echo ✓ Kilo tool-output cleaned
)

REM Clean OpenCode cache (moved to backup)
echo OpenCode directory moved to backup
if exist "C:\Users\karma\.local\share\opencode_backup" (
    echo ✓ OpenCode backup exists at: C:\Users\karma\.local\share\opencode_backup
)

REM Clean Windows temp files
echo Cleaning Windows temp files...
del /q /f "C:\Users\karma\AppData\Local\Temp\*" 2>nul
for /d %%i in ("C:\Users\karma\AppData\Local\Temp\*") do rmdir /s /q "%%i" 2>nul
echo ✓ Windows temp files cleaned

REM Clean npm cache if it exists
echo Cleaning npm cache...
npm cache clean --force 2>nul
echo ✓ npm cache cleaned

echo.
echo Final disk space:
powershell -Command "Get-WmiObject -Class Win32_LogicalDisk -Filter 'Caption=\"C:\"' | Select-Object @{Name='FreeGB';Expression={[math]::Round($_.FreeSpace/1GB, 2)}}" 2>nul

echo.
echo To free up more space, you can delete:
echo C:\Users\karma\.local\share\opencode_backup (63GB)
echo.
echo For ongoing maintenance, run this script weekly.
echo.
pause