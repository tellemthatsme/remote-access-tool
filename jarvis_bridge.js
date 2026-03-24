/**
 * JARVIS <-> CLINE BACKEND BRIDGE
 * This script connects the Jarvis Voice UI (Port 8080) to the Cline Computer Use Backend (Port 3001).
 * When Jarvis transcribes a voice command requesting computer or browser use, it routes here.
 */

const axios = require('axios');

const CLINE_BACKEND_URL = 'http://localhost:3001';

class JarvisComputerBridge {
    constructor() {
        this.isConnected = false;
        console.log("🌉 Initializing Jarvis <-> Cline Computer Bridge...");
    }

    async testConnection() {
        try {
            const res = await axios.get(`${CLINE_BACKEND_URL}/stats`);
            if (res.status === 200) {
                this.isConnected = true;
                console.log("✅ SUCCESS: Jarvis is now wired to the Cline Backend.");
                console.log(`💻 Computer Model: ${res.data.cpu}`);
                return true;
            }
        } catch (error) {
            console.error("❌ ERROR: Cannot reach Cline Backend. Ensure start-cline.bat is running.");
            return false;
        }
    }

    async executeVoiceCommand(transcription) {
        if (!this.isConnected) {
            console.log("Attempting to reconnect to computer backend...");
            await this.testConnection();
        }

        console.log(`\n🎙️ JARVIS HEARD: "${transcription}"`);
        console.log("🤖 Routing command to OpenClaw / Cline for execution...");

        // In a full implementation, this sends the transcription to the Cline API
        // For now, we simulate the handoff to the Playwright / System execution layer
        
        try {
            // Pseudo-endpoint for the Cline Agent to accept raw natural language tasks
            const response = await axios.post(`${CLINE_BACKEND_URL}/execute-task`, {
                task: transcription,
                source: "JARVIS_VOICE",
                useBrowser: transcription.toLowerCase().includes("browser") || transcription.toLowerCase().includes("website")
            });
            
            console.log("✅ Task Accepted by Cline Agent Army.");
            return response.data;
        } catch (e) {
            console.log("⚠️ Cline Backend /execute-task endpoint not yet exposed, or Agent is busy.");
            // Fallback: trigger a local system beep or response
            return { status: "fallback", message: "Task queued for OpenClaw." };
        }
    }
}

// Auto-run if executed directly
if (require.main === module) {
    const bridge = new JarvisComputerBridge();
    bridge.testConnection().then(connected => {
        if(connected) {
            console.log("\nReady for Voice Commands. Try routing a request...");
            bridge.executeVoiceCommand("Open the browser and go to ausai.tech");
        }
    });
}

module.exports = JarvisComputerBridge;
