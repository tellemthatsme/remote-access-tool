# Remote Access Tool

<p align="center">
  <img src="https://img.shields.io/badge/Platform-Windows-blue" alt="Platform">
  <img src="https://img.shields.io/badge/Node.js-18%2B-green" alt="Node.js">
  <img src="https://img.shields.io/badge/License-MIT-yellow" alt="License">
</p>

A free, reliable remote access solution for Windows PCs that avoids paid tools like TeamViewer/AnyDesk. Features a powerful web-based dashboard with real-time monitoring.

## Features

### Monitoring
- **CPU Monitoring** - Real-time usage with history graph
- **RAM Monitoring** - Memory usage with history graph
- **Disk Usage** - Per-drive space information (total, used, free)
- **Temperature** - CPU temperature (if sensor available)
- **Network Stats** - Total data uploaded/downloaded
- **Process List** - Top 10 processes by memory usage

### Alerts
- **Automatic Alerts** - Warnings when CPU/RAM exceeds thresholds
- **Visual Indicators** - Color-coded status (green/yellow/red)
- **Alert History** - View recent alerts in dashboard

### Process Management
- **Kill Node** - Terminate all Node.js processes (node, npm, npx, yarn, pnpm, bun)
- **Kill Docker** - Stop Docker Desktop and related processes

### Remote Control
- **Restart PC** - Remote restart with confirmation
- **Shutdown PC** - Remote shutdown with confirmation

### Remote Access
- **Chrome Remote Desktop** - Full remote desktop control
- **Cloudflare Tunnel** - Secure internet exposure without port forwarding

## Quick Start

### Prerequisites

- Windows 10/11
- Node.js 18+ (for dashboard)
- Chrome browser

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/tellemthatsme/remote-access-tool.git
   cd remote-access-tool
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the dashboard:
   ```bash
   npm start
   ```

4. Open http://localhost:3001
5. Login with password: `karma123`

## Dashboard Features

### Main Dashboard
- Real-time CPU & RAM percentage
- Historical graph (last 30 readings)
- System uptime
- Quick action buttons

### Disk Section
- All drives with usage bars
- Color-coded (red when >90%)

### Temperature Section
- CPU temperature (if available)
- Status: Normal/Warm/Hot

### Network Section
- Total downloaded data
- Total uploaded data

### Process Section
- Top 10 processes by memory
- Memory usage per process

### Alerts Section
- Automatic warnings
- CPU >80% = Warning, >90% = Critical
- RAM >80% = Warning, >90% = Critical

## Usage

### Starting the Dashboard

```bash
# Windows
START_DASHBOARD.bat

# Or manually
node dashboard.cjs
```

### Exposing to Internet

```bash
START_TUNNEL.bat
```

### Process Management

```bash
KILL_NODE.bat       # Kill all Node.js processes
KILL_DOCKER.bat     # Kill Docker processes
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/stats` | GET | CPU, RAM, uptime, memory, alerts |
| `/api/disk` | GET | Disk usage per drive |
| `/api/processes` | GET | Top processes by memory |
| `/api/network` | GET | Network traffic stats |
| `/api/temp` | GET | CPU temperature |
| `/api/kill-node` | POST | Kill Node processes |
| `/api/kill-docker` | POST | Kill Docker |
| `/api/restart` | POST | Restart PC |
| `/api/shutdown` | POST | Shutdown PC |

## Configuration

### Change Password

Edit `dashboard.cjs`:

```javascript
const PASSWORD = "karma123";  // Change this
```

### Change PC Name

Edit `dashboard.cjs`:

```javascript
const PC_NAME = "DESKTOP-KARMA";  // Change this
```

### Change Port

Edit `dashboard.cjs`:

```javascript
const PORT = 3001;  // Change this
```

## Project Structure

```
remote-access-tool/
├── dashboard.cjs          # Main dashboard server (v1.1 Enhanced)
├── package.json           # NPM configuration
├── README.md              # This file
├── SETUP_GUIDE.md         # Installation guide
├── ARCHITECTURE.md        # Technical architecture
├── CONTRIBUTING.md        # Developer guidelines
├── CHANGELOG.md           # Version history
├── SECURITY.md            # Security policy
├── LICENSE                # MIT License
├── .env.example           # Environment variables template
├── .gitignore             # Git ignore patterns
├── START_DASHBOARD.bat    # Start dashboard on boot
├── START_TUNNEL.bat       # Start Cloudflare Tunnel
├── KILL_NODE.bat          # Kill Node.js processes
├── KILL_DOCKER.bat        # Kill Docker processes
├── cloudflared.exe        # Cloudflare Tunnel binary
└── landing.html           # Landing page
```

## System Requirements

- Windows 10/11
- Node.js 18+ (for dashboard)
- Chrome browser (for remote access)
- Internet connection

## Technologies

- **Node.js** - Runtime
- **Express** - Web framework
- **Windows WMIC** - System information
- **PowerShell** - Temperature & processes
- **Cloudflare Tunnel** - Secure tunneling

## License

MIT License - see [LICENSE](./LICENSE) for details.

## Disclaimer

This tool is for legitimate remote access purposes. Ensure compliance with all applicable laws and terms of service when using remote access tools.
