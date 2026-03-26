# RemotePC - Developer Documentation

## Overview

RemotePC is a web-based dashboard for monitoring and controlling a Windows PC remotely. Built with Node.js, it provides real-time system stats, process management, and remote control features.

**Current Version:** v1.3.0
**License:** MIT
**Repository:** https://github.com/tellemthatsme/remote-access-tool

---

## Quick Start

```bash
# Install dependencies
npm install

# Start dashboard
node dashboard.cjs

# Open in browser
http://localhost:3001

# Password: karma123
```

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    RemotePC Dashboard                   │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐   ┌──────────────┐   ┌───────────┐  │
│  │   HTTP API   │   │  WebSocket   │   │  Dashboard│  │
│  │  (REST API)  │◄──►│ (Real-time)  │   │   (HTML)  │  │
│  └──────┬───────┘   └──────────────┘   └───────────┘  │
│         │                                                │
│  ┌──────▼───────────────────────────────────────────┐   │
│  │              System Monitoring                    │   │
│  │  • CPU • RAM • GPU • Disk • Network • Processes │   │
│  └───────────────────────────────────────────────────┘   │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## API Endpoints

### Stats & Monitoring

| Endpoint         | Method | Description                 |
| ---------------- | ------ | --------------------------- |
| `/api/stats`     | GET    | CPU, RAM, uptime, alerts    |
| `/api/disk`      | GET    | Disk usage per drive        |
| `/api/processes` | GET    | Top 15 processes by memory  |
| `/api/services`  | GET    | Windows services list       |
| `/api/gpu`       | GET    | GPU usage (NVIDIA/AMD)      |
| `/api/network`   | GET    | Network traffic             |
| `/api/temp`      | GET    | CPU temperature             |
| `/api/history`   | GET    | Historical data ( ?days=7 ) |

### Actions

| Endpoint            | Method | Description             |
| ------------------- | ------ | ----------------------- |
| `/api/kill-node`    | POST   | Kill all Node processes |
| `/api/kill-docker`  | POST   | Kill Docker processes   |
| `/api/kill-process` | POST   | Kill custom process     |
| `/api/restart`      | POST   | Restart PC              |
| `/api/shutdown`     | POST   | Shutdown PC             |

### Development

| Endpoint     | Method | Description                |
| ------------ | ------ | -------------------------- |
| `/api/files` | GET    | Browse files ( ?path=C:\ ) |
| `/api/exec`  | POST   | Run safe commands          |
| `/ws`        | WS     | WebSocket for real-time    |

---

## Configuration

Edit these constants in `dashboard.cjs`:

```javascript
const PORT = 3001; // Dashboard port
const PASSWORD = "karma123"; // Login password
const PC_NAME = "DESKTOP-KARMA"; // Display name
```

---

## Data Storage

- **History:** `data/history.json` (30 days of stats)
- **Config:** Stored in-memory

---

## Security

### Current Protections

- Password-protected dashboard
- CORS enabled for API
- Command whitelist for terminal

### Recommended Additions

- Rate limiting
- HTTPS/TLS
- Encrypted passwords
- IP whitelist

---

## Adding New Features

### Example: Add New API Endpoint

```javascript
// In dashboard.cjs, add before the catch-all:
if (req.url === "/api/your-feature" && req.method === "GET") {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(yourData));
  return;
}
```

### Example: Add New UI Section

```javascript
// Add to the HTML template:
<div class="section">
  <div class="section-title">Your Feature</div>
  <div id="your-feature">Loading...</div>
</div>;

// Add JavaScript:
async function fetchYourFeature() {
  const res = await fetch("/api/your-feature");
  const data = await res.json();
  // Update UI
}
```

---

## WebSocket API

Connect to `/ws` for real-time updates:

```javascript
const ws = new WebSocket("ws://localhost:3001/ws");
ws.onmessage = (event) => {
  const { type, data } = JSON.parse(event.data);
  if (type === "stats") {
    console.log("CPU:", data.cpu, "RAM:", data.ram);
  }
};
```

---

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3001
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

### Cloudflare Tunnel Issues

```bash
# Re-authenticate
cloudflared.exe tunnel login

# Test tunnel
cloudflared.exe tunnel --url http://localhost:3001
```

### GPU Not Showing

- Install NVIDIA drivers + nvidia-smi
- Or use AMD drivers

---

## File Structure

```
remote-access-tool/
├── dashboard.cjs        # Main server (Node.js)
├── package.json         # Dependencies
├── landing.html        # Sales page
├── data/               # Historical data
│   └── history.json
├── START_DASHBOARD.bat # Start script
├── START_TUNNEL.bat    # Tunnel script
├── KILL_NODE.bat       # Kill Node
├── KILL_DOCKER.bat     # Kill Docker
└── *.md               # Documentation
```

---

## Contributing

1. Fork the repo
2. Create a feature branch
3. Make changes
4. Test locally
5. Submit PR

---

## Changelog

See `CHANGELOG.md` for version history.

---

## Support

- GitHub Issues: https://github.com/tellemthatsme/remote-access-tool/issues
- Email: (your email)

---

## Roadmap

See `ENHANCEMENT_LIST.md` for planned features.

---

_Last Updated: 2026-03-25_
_Version: 1.3.0_
