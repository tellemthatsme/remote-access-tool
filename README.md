# 🚀 RemotePC - Control Your PC From Anywhere

RemotePC is a web-based dashboard for monitoring and controlling a Windows PC remotely. Built after 14 months of learning to code as a free alternative to TeamViewer.

**Version:** 1.4.0  
**License:** MIT  
**Demo:** https://remote-pc.example.com

---

## ✨ Features

### 📊 Real-Time Monitoring

- **CPU Usage** - Live percentage with history graph
- **RAM Usage** - Memory usage with visual bar
- **GPU Monitoring** - NVIDIA/AMD GPU usage and temperature
- **Disk Usage** - Per-drive space information
- **Network Stats** - Total upload/download
- **Temperature** - CPU temperature (when sensor available)
- **Process List** - Top 15 processes by memory

### 🎨 Modern UI

- **Glassmorphism Design** - Frosted glass effects with backdrop blur
- **Light/Dark Theme** - Toggle between themes
- **Smooth Animations** - Slide-in effects and micro-interactions
- **World-Class Design** - Professional, modern interface

### ⚡ Quick Actions

- **Kill Node** - One-click stop all Node processes
- **Kill Docker** - One-click stop Docker
- **Custom Kill** - Kill any process by name
- **Restart PC** - Remote restart with countdown
- **Shutdown PC** - Remote shutdown
- **CSV Export** - Export history data to CSV

### 🔧 System Info

- **Windows Services** - View running/stopped services
- **User Management** - Add/remove users with roles
- **Uptime** - Days, hours, minutes
- **Historical Data** - 30 days of stats saved to file

### 🔐 Security

- **Password Protected** - Login required
- **Cloudflare Tunnel** - No port forwarding needed
- **HTTPS** - Secure connection

### 📱 Mobile First

- **Responsive Design** - Works on phone
- **Light/Dark Theme** - Toggle between themes
- **PWA Ready** - Install as app
- **Glassmorphism** - Modern visual effects

---

## 🚀 Quick Start

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

## 🔧 Setup

### 1. Install Node.js

Download from https://nodejs.org (LTS version)

### 2. Start the Dashboard

```bash
# Double-click START_DASHBOARD.bat
# OR run manually:
node dashboard.cjs
```

### 3. Access Remotely (Optional)

```bash
# Run START_TUNNEL.bat
# OR manually:
cloudflared.exe tunnel --url http://localhost:3001
```

### 4. Auto-Login (Optional)

See `SETUP_GUIDE.md` for auto-login configuration

---

## 📡 API

### Endpoints

| Endpoint            | Method    | Description              |
| ------------------- | --------- | ------------------------ |
| `/api/stats`        | GET       | CPU, RAM, uptime, alerts |
| `/api/disk`         | GET       | Disk usage               |
| `/api/processes`    | GET       | Top processes            |
| `/api/services`     | GET       | Windows services         |
| `/api/gpu`          | GET       | GPU info                 |
| `/api/kill-node`    | POST      | Kill Node                |
| `/api/kill-docker`  | POST      | Kill Docker              |
| `/api/kill-process` | POST      | Kill custom              |
| `/api/restart`      | POST      | Restart PC               |
| `/api/shutdown`     | POST      | Shutdown PC              |
| `/ws`               | WebSocket | Real-time updates        |

### Example

```javascript
// Fetch stats
const res = await fetch("http://localhost:3001/api/stats");
const data = await res.json();
console.log(`CPU: ${data.cpu}%, RAM: ${data.ram}%`);
```

---

## 🖥️ Requirements

- **OS:** Windows 10/11
- **Node.js:** v14+
- **Optional:** NVIDIA GPU for GPU monitoring

---

## 📁 File Structure

```
remote-access-tool/
├── dashboard.cjs        # Main server
├── landing.html         # Sales page
├── package.json         # Dependencies
├── data/                # Data storage
│   └── history.json
├── START_DASHBOARD.bat  # Start dashboard
├── START_TUNNEL.bat     # Start tunnel
├── KILL_NODE.bat        # Kill Node
├── KILL_DOCKER.bat     # Kill Docker
├── DEVELOPER_DOCS.md   # API docs
├── SETUP_GUIDE.md      # Setup guide
├── CHANGELOG.md        # Version history
└── ENHANCEMENT_LIST.md # Future features
```

---

## 🆙 Upgrade

```bash
# Update to latest version
git pull origin main

# Or download new files
```

---

## 🤝 Contributing

1. Fork the repo
2. Create feature branch
3. Make changes
4. Test locally
5. Submit PR

See `CONTRIBUTING.md` for guidelines.

---

## 📄 License

MIT License - see `LICENSE`

---

## 🔗 Links

- **GitHub:** https://github.com/tellemthatsme/remote-access-tool
- **Demo:** https://remote-pc.example.com
- **Support:** https://github.com/tellemthatsme/remote-access-tool/issues

---

## 🙏 Acknowledgments

Built after 14 months of learning to code. Thanks to:

- Online tutorials and courses
- Open source community
- You for trying it!

---

_Version 1.3.0 - March 2026_
