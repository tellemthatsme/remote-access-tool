@echo off
REM Setup Automated CLI Cache Cleanup
REM ==================================
REM Creates scheduled task for daily cleanup

echo Setting up automated CLI cache cleanup...

REM Check if running as administrator
net session >nul 2>&1
if %errorLevel% == 0 (
    echo Running with administrator privileges ✓
) else (
    echo WARNING: Not running as administrator. Scheduled task may fail.
    echo Please run this script as Administrator.
    pause
    exit /b 1
)

REM Create the scheduled task
schtasks /create /tn "CLI_Cache_Cleanup" /tr "powershell.exe -ExecutionPolicy Bypass -File 'C:\Users\karma\Desktop\remote-access-tool\Monitor-CLICache.ps1'" /sc daily /st 03:00 /ru "%USERNAME%" /rl highest /f

if %errorLevel% == 0 (
    echo ✓ Scheduled task created successfully!
    echo.
    echo Task Details:
    echo - Name: CLI_Cache_Cleanup
    echo - Schedule: Daily at 3:00 AM
    echo - Action: Run PowerShell cleanup script
    echo - User: %USERNAME%
    echo.
    echo The task will automatically monitor and clean CLI caches daily.
) else (
    echo ✗ Failed to create scheduled task.
    echo Error code: %errorLevel%
    echo.
    echo Manual setup instructions:
    echo 1. Open Task Scheduler (Windows key + R, type 'taskschd.msc')
    echo 2. Create new task named 'CLI_Cache_Cleanup'
    echo 3. Set to run daily at 3:00 AM
    echo 4. Action: Start program 'powershell.exe'
    echo 5. Arguments: -ExecutionPolicy Bypass -File 'C:\Users\karma\Desktop\remote-access-tool\Monitor-CLICache.ps1'
)

echo.
echo To test the cleanup manually:
echo powershell.exe -ExecutionPolicy Bypass -File "C:\Users\karma\Desktop\remote-access-tool\Monitor-CLICache.ps1"
echo.
pause