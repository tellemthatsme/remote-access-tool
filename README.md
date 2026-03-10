# Remote Access Tool

<p align="center">
  <img src="https://img.shields.io/badge/Platform-Windows-blue" alt="Platform">
  <img src="https://img.shields.io/badge/Node.js-18%2B-green" alt="Node.js">
  <img src="https://img.shields.io/badge/License-MIT-yellow" alt="License">
</p>

A free, reliable remote access solution for Windows PCs that avoids paid tools like TeamViewer/AnyDesk. Features Chrome Remote Desktop integration, auto-login, process management, and a web-based dashboard.

## Features

- **Chrome Remote Desktop Integration** - Automatic startup and login
- **Auto-Login** - Windows auto-login without password prompt
- **Process Management** - Kill Node.js, npm, npx, and Docker processes with one click
- **Web Dashboard** - Real-time system stats and remote management interface
- **Cloudflare Tunnel** - Expose dashboard to the internet securely
- **Billing System Ready** - Monetization via Patreon/BuyMeACoffee integration

## Quick Start

### Prerequisites

- Windows 10/11
- Node.js 18+ (for dashboard)
- Chrome browser

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/karma/remote-access-tool.git
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

## Documentation

| File | Description |
|------|-------------|
| [SETUP_GUIDE.md](./SETUP_GUIDE.md) | Complete installation instructions |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Technical architecture |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Developer contribution guide |
| [CHANGELOG.md](./CHANGELOG.md) | Version history |
| [SECURITY.md](./SECURITY.md) | Security policy |

## System Requirements

- Windows 10/11
- Node.js 18+ (for dashboard)
- Chrome browser (for remote access)
- Internet connection

## Configuration

### Change Password

Edit `dashboard.cjs` and change the password:

```javascript
const AUTH_PASSWORD = "your-new-password";
```

### Change Port

Edit `dashboard.cjs`:

```javascript
const PORT = 3001; // Change this
```

## Project Structure

```
remote-access-tool/
├── dashboard.cjs          # Main dashboard server
├── package.json           # NPM configuration
├── README.md              # This file
├── SETUP_GUIDE.md         # Installation guide
├── ARCHITECTURE.md        # Technical docs
├── CONTRIBUTING.md        # Contribution guidelines
├── CHANGELOG.md           # Version history
├── SECURITY.md            # Security policy
├── LICENSE                # MIT License
├── .env.example           # Environment variables
├── .gitignore             # Git ignore patterns
├── START_DASHBOARD.bat    # Start dashboard on boot
├── START_TUNNEL.bat       # Start Cloudflare Tunnel
├── KILL_NODE.bat          # Kill Node.js processes
└── KILL_DOCKER.bat        # Kill Docker processes
```

## Technologies

- **Node.js** - Runtime
- **Express** - Web framework
- **os-utils** - System information
- **Cloudflare Tunnel** - Secure tunneling

## License

MIT License - see [LICENSE](./LICENSE) for details.

## Disclaimer

This tool is for legitimate remote access purposes. Ensure compliance with all applicable laws and terms of service when using remote access tools.
