@echo off
echo ========================================
echo   KILL ALL NODE PROCESSES
echo ========================================
echo.

echo Killing node.exe...
taskkill /F /IM node.exe 2>nul

echo Killing npm.exe...
taskkill /F /IM npm.exe 2>nul

echo Killing npx.exe...
taskkill /F /IM npx.exe 2>nul

echo Killing yarn.exe...
taskkill /F /IM yarn.exe 2>nul

echo Killing pnpm.exe...
taskkill /F /IM pnpm.exe 2>nul

echo Killing bun.exe...
taskkill /F /IM bun.exe 2>nul

echo Killing deno.exe...
taskkill /F /IM deno.exe 2>nul

echo.
echo ========================================
echo   DONE - ALL NODE PROCESSES KILLED
echo ========================================
echo.
pause
