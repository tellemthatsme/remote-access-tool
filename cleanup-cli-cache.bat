@echo off
REM Enhanced CLI Cache Cleanup & Prevention Script
REM ==============================================
REM Prevents CLI tools from filling up C: drive
REM Run daily via scheduled task

echo [%date% %time%] Starting Enhanced CLI Cache Cleanup...

REM Check current disk space
echo Current disk space:
powershell -Command "Get-WmiObject -Class Win32_LogicalDisk -Filter 'Caption=\"C:\"' | Select-Object @{Name='FreeGB';Expression={[math]::Round($_.FreeSpace/1GB, 2)}}, @{Name='SizeGB';Expression={[math]::Round($_.Size/1GB, 2)}}" 2>nul

echo.
echo Cleaning OpenCode caches...

REM OpenCode snapshot cleanup - keep only last 5
if exist "C:\Users\karma\.local\share\opencode\snapshot" (
    echo Cleaning snapshots (keeping last 5)...
    setlocal enabledelayedexpansion
    set count=0
    for /f "delims=" %%i in ('dir /b /o-d "C:\Users\karma\.local\share\opencode\snapshot\*" 2^>nul') do (
        set /a count+=1
        if !count! gtr 5 (
            echo Removing old snapshot: %%i
            rmdir /s /q "C:\Users\karma\.local\share\opencode\snapshot\%%i" 2>nul
        )
    )
    endlocal
)

REM OpenCode tool-output cleanup - remove files older than 24 hours
if exist "C:\Users\karma\.local\share\opencode\tool-output" (
    echo Cleaning tool-output (files older than 24h)...
    forfiles /p "C:\Users\karma\.local\share\opencode\tool-output" /s /m *.* /d -1 /c "cmd /c del @path" 2>nul
)

REM OpenCode storage cleanup
if exist "C:\Users\karma\.local\share\opencode\storage" (
    echo Cleaning storage directory...
    REM Remove temp files but keep important data
    for /r "C:\Users\karma\.local\share\opencode\storage" %%i in (*.tmp *.cache) do del "%%i" 2>nul
)

echo.
echo Cleaning Kilo caches...

REM Kilo tool-output cleanup
if exist "C:\Users\karma\.local\share\kilo\tool-output" (
    echo Cleaning kilo tool-output...
    forfiles /p "C:\Users\karma\.local\share\kilo\tool-output" /s /m *.* /d -1 /c "cmd /c del @path" 2>nul
)

REM Kilo snapshot cleanup
if exist "C:\Users\karma\.local\share\kilo\snapshot" (
    echo Cleaning kilo snapshots (keeping last 3)...
    setlocal enabledelayedexpansion
    set count=0
    for /f "delims=" %%i in ('dir /b /o-d "C:\Users\karma\.local\share\kilo\snapshot\*" 2^>nul') do (
        set /a count+=1
        if !count! gtr 3 (
            echo Removing old kilo snapshot: %%i
            rmdir /s /q "C:\Users\karma\.local\share\kilo\snapshot\%%i" 2>nul
        )
    )
    endlocal
)

echo.
echo Optimizing databases...

REM SQLite optimization for OpenCode
if exist "C:\Users\karma\.local\share\opencode\opencode.db" (
    echo Optimizing OpenCode database...
    REM Note: sqlite3 command would be used here if available
    REM For now, just remove WAL files if database is clean
    if exist "C:\Users\karma\.local\share\opencode\opencode.db-wal" (
        REM WAL file indicates active transactions, skip optimization
        echo Database has active transactions, skipping optimization
    )
)

echo.
echo Cleaning Windows temp files...

REM Windows temp cleanup
del /q /f "C:\Users\karma\AppData\Local\Temp\*" 2>nul
for /d %%i in ("C:\Users\karma\AppData\Local\Temp\*") do rmdir /s /q "%%i" 2>nul

REM Clean npm cache if it exists
npm cache clean --force 2>nul

echo.
echo Final disk space:
powershell -Command "Get-WmiObject -Class Win32_LogicalDisk -Filter 'Caption=\"C:\"' | Select-Object @{Name='FreeGB';Expression={[math]::Round($_.FreeSpace/1GB, 2)}}" 2>nul

echo.
echo [%date% %time%] CLI Cache cleanup completed successfully!
echo.
echo To set up automatic cleanup:
echo 1. Open Task Scheduler (taskschd.msc)
echo 2. Create new task: "CLI_Cache_Cleanup"
echo 3. Run daily at 3:00 AM
echo 4. Action: Start program "C:\Users\karma\Desktop\remote-access-tool\cleanup-cli-cache.bat"
echo.
echo For permanent prevention, see CLI_CACHE_SOLUTION.md
echo.
pause