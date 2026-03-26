# RemotePC Architecture

## Overview

RemotePC is a Node.js-based web dashboard for monitoring and controlling a Windows PC remotely. It provides real-time system stats, process management, and remote control via a web interface.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Browser                         │
│                    (Dashboard UI)                           │
│         📱 Mobile Responsive • Dark Theme • PWA           │
└─────────────────────────┬───────────────────────────────────┘
                           │ HTTP / WebSocket
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  Node.js Server (dashboard.cjs)            │
│                     Port: 3001                            │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   HTTP       │  │   WebSocket  │  │   System     │      │
│  │   Server     │  │   Server     │  │   Monitor    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Dashboard  │  │   Process    │  │    Data      │      │
│  │   HTML      │  │   Manager    │  │    Store     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────┬───────────────────────────────────┘
                           │
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
    ┌─────────┐       ┌───────────┐    ┌──────────┐
    │ Windows │       │  Chrome   │    │Cloudflare│
    │  OS     │       │  Remote   │    │  Tunnel  │
    │  APIs   │       │  Desktop  │    │          │
    └─────────┘       └───────────┘    └──────────┘
```

## Components

### dashboard.cjs (Main Server)

```
┌─────────────────────────────────────────────────┐
│              dashboard.cjs                      │
├─────────────────────────────────────────────────┤
│                                                 │
│  CONSTANTS                                     │
│  ├── PORT = 3001                               │
│  ├── PASSWORD = "karma123"                     │
│  └── PC_NAME = "DESKTOP-KARMA"                 │
│                                                 │
│  HTML TEMPLATE                                 │
│  ├── Login screen                              │
│  ├── Dashboard UI                              │
│  └── JavaScript (fetch, WebSocket)            │
│                                                 │
│  FUNCTIONS                                     │
│  ├── getStats()        - CPU, RAM, uptime     │
│  ├── getGPUInfo()     - NVIDIA/AMD            │
│  ├── getDiskInfo()    - Disk usage            │
│  ├── getProcessList() - Top processes         │
│  ├── getServicesList() - Windows services    │
│  ├── getNetworkStats() - Network traffic      │
│  └── getTemperature() - CPU temp             │
│                                                 │
│  API ENDPOINTS                                │
│  ├── /api/stats        - Get all stats        │
│  ├── /api/disk         - Disk usage          │
│  ├── /api/processes    - Process list         │
│  ├── /api/services    - Windows services     │
│  ├── /api/gpu         - GPU info             │
│  ├── /api/kill-node   - Kill Node            │
│  ├── /api/kill-docker - Kill Docker          │
│  ├── /api/kill-process - Kill custom         │
│  ├── /api/restart     - Restart PC           │
│  ├── /api/shutdown    - Shutdown PC          │
│  └── /ws              - WebSocket           │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Data Flow

### 1. Real-Time Monitoring

```
User Browser          dashboard.cjs           Windows OS
     │                    │                      │
     │──── GET /api/stats ──►                     │
     │                    │──── os.cpus() ────────►│
     │                    │◄──── CPU data ─────────│
     │◄──── JSON ─────────│                      │
     │                    │                      │
     │  (every 2 seconds)│                      │
```

### 2. WebSocket Updates

```
User Browser          dashboard.cjs           Windows OS
     │                    │                      │
     │──── WS Connect ───►│                      │
     │                    │                      │
     │                    │◄─── getStats() ─────│
     │◄─── JSON (stats) ──│                      │
     │                    │                      │
     │  (real-time)       │                      │
```

### 3. Process Control

```
User Browser          dashboard.cjs           Windows OS
     │                    │                      │
     │── POST /api/kill-node ──►               │
     │                    │── taskkill ────────►│
     │◄── JSON {success} ─│◄──── OK ───────────│
```

## Key Modules

### System Monitor

- **CPU**: Uses `os.cpus()` to calculate usage
- **RAM**: Uses `os.totalmem()` / `os.freemem()`
- **GPU**: Uses `nvidia-smi` or WMI
- **Disk**: Uses `wmic logicaldisk`
- **Processes**: Uses `wmic process`
- **Services**: Uses PowerShell `Get-Service`

### Data Storage

- **In-Memory**: Recent CPU/RAM history (60 readings)
- **File**: `data/history.json` (30 days)

### Real-Time

- **Polling**: HTTP every 2-30 seconds
- **WebSocket**: Push updates to all connected clients

## Dependencies

### Production

- `ws` - WebSocket server (v8.20.0)
- `axios` - HTTP client (v1.13.6)

### Built-in Node.js

- `http` - HTTP server
- `os` - System info
- `fs` - File system
- `child_process` - Shell commands
- `path` - Path utilities

## Security

### Current

- ✅ Password protection (simple)
- ✅ CORS enabled
- ✅ Command whitelist (terminal)
- ✅ No port forwarding (Cloudflare Tunnel)

### Recommended Additions

- ☐ Rate limiting
- ☐ HTTPS/TLS
- ☐ Encrypted passwords
- ☐ IP whitelist
- ☐ 2FA
- ☐ Access logging

## Deployment

### Local

```bash
node dashboard.cjs
# http://localhost:3001
```

### Remote (Cloudflare Tunnel)

```bash
cloudflared.exe tunnel --url http://localhost:3001
# Generates public URL
```

### Auto-Start

- Windows Task Scheduler
- Registry Run key
- Startup folder

## Performance

| Metric       | Value        |
| ------------ | ------------ |
| Memory Usage | ~50MB        |
| CPU (idle)   | <1%          |
| CPU (stats)  | <2%          |
| Refresh Rate | 2-30 seconds |
| Max Clients  | 100+         |

## File Structure

```
remote-access-tool/
├── dashboard.cjs         # Main server (THIS IS THE APP)
├── package.json          # Dependencies
├── data/
│   └── history.json      # Historical data
├── landing.html          # Sales page
├── START_DASHBOARD.bat   # Quick start
├── START_TUNNEL.bat      # Remote access
├── KILL_NODE.bat         # Utility
├── KILL_DOCKER.bat       # Utility
├── *.md                  # Docs
└── .env.example          # Config template
```

---

_Version: 1.3.0_
