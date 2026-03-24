@echo off
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                 Cline Code Extension Launcher                 ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo 🚀 Starting your enhanced AI development platform...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: Node.js is not installed or not in PATH
    echo Please install Node.js from: https://nodejs.org
    echo.
    pause
    exit /b 1
)

REM Check if the main files exist
if not exist "dashboard.cjs" (
    echo ❌ Error: dashboard.cjs not found
    echo Please ensure you're running this from the remote-access-tool directory
    echo.
    pause
    exit /b 1
)

if not exist "src\agents\main-cline-agent.js" (
    echo ❌ Error: Main Cline Agent not found
    echo Please ensure all agent files are present
    echo.
    pause
    exit /b 1
)

echo ✅ System checks passed
echo.
echo 📋 System Status:
echo   • Node.js: Available
echo   • Dashboard: Found
echo   • Cline Agent: Found
echo   • MCP Config: Found
echo.

echo 🎯 Launch Options:
echo   1. Start Dashboard Only (Monitoring & Control)
echo   2. Start with Cline Agent (Full AI Platform)
echo   3. System Status Check
echo   4. Exit
echo.

set /p choice="Please select an option (1-4): "

if "%choice%"=="1" goto start_dashboard
if "%choice%"=="2" goto start_full
if "%choice%"=="3" goto status_check
if "%choice%"=="4" goto exit_script

echo ❌ Invalid option. Please select 1, 2, 3, or 4.
echo.
pause
exit /b 1

:start_dashboard
echo.
echo 🌐 Starting Dashboard...
echo URL: http://localhost:3001
echo Password: karma123
echo.
echo 📊 Features available:
echo   • Real-time system monitoring
echo   • Resource usage graphs
echo   • Process management
echo   • Network statistics
echo   • Temperature monitoring
echo.
echo 💡 Tip: Use this for system monitoring and basic controls
echo.
node dashboard.cjs
goto end

:start_full
echo.
echo 🤖 Starting Full Cline AI Platform...
echo.
echo 📊 Dashboard: http://localhost:3001
echo 🔑 Password: karma123
echo.
echo 🧠 AI Features available:
echo   • Automated code review
echo   • Python development assistance
echo   • Task orchestration
echo   • Multi-agent coordination
echo   • Real-time monitoring
echo.
echo 💡 Tip: Use this for full AI-powered development assistance
echo.
node dashboard.cjs
goto end

:status_check
echo.
echo 📊 System Status Check
echo ════════════════════════════════════════════════════════════════
echo.
echo 📁 Project Structure:
echo   • .claude/config.json (MCP Configuration)
echo   • src/agents/ (Specialized Agents)
echo   • src/skills/ (Skill Modules)
echo   • dashboard.cjs (Monitoring Interface)
echo.
echo 🔗 MCP Servers Configured:
echo   • filesystem, memory, fetch, sequential-thinking
echo   • git, python-execution, playwright
echo   • aws, azure, gcp, kubernetes
echo   • docker, github, security-scanner
echo   • code-reviewer, testing-framework, monitoring
echo.
echo 🤖 AI Agents Available:
echo   • Main Cline Agent (Central Orchestrator)
echo   • Code Reviewer Agent (Security & Quality)
echo.
echo 🎯 Skill Modules:
echo   • Python Skill (Development Best Practices)
echo.
echo ✅ All components are properly configured!
echo.
echo 💡 To start the system, run this script again and choose option 1 or 2
echo.
pause
goto end

:exit_script
echo.
echo 👋 Goodbye! To restart the system, run this script again.
echo.
pause
exit /b 0

:end
echo.
echo 🔄 If the dashboard stops, simply restart this script
echo 📚 For detailed instructions, see: CLINE_SETUP_GUIDE.md
echo.
pause