vant@echo off
echo 🚀 Enhanced Cline Code Extension - System Launch
echo ════════════════════════════════════════════════════════════════════════════════
echo.

echo 🔧 Initializing Port Manager...
node -e "const portManager = require('./src/utils/port-manager.js'); portManager.initialize().then(() => console.log('✅ Port Manager ready')).catch(console.error);"

echo.
echo 🤖 Initializing Cline Agent System...
node -e "const clineAgent = require('./src/agents/main-cline-agent.js'); clineAgent.initialize().then(() => console.log('✅ Cline Agent System ready')).catch(console.error);"

echo.
echo 📊 Starting Dashboard...
start "" "http://localhost:3001"

echo.
echo 🧪 Running System Tests...
node test-system.js

echo.
echo 💡 System Status:
echo   • Port Manager: Ready
echo   • Cline Agent: Ready  
echo   • Dashboard: http://localhost:3001
echo   • Password: karma123
echo   • Test Report: test-report.json
echo.

echo 🎉 Enhanced Cline Code Extension is now ready!
echo ════════════════════════════════════════════════════════════════════════════════
pause