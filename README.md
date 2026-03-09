# Remote Access Tool

A free, reliable remote access solution for PC that avoids paid tools like TeamViewer/AnyDesk. Features Chrome Remote Desktop integration, auto-login, and coding process management.

## Features

- **Chrome Remote Desktop Integration**: Automatic login and startup
- **Auto-Login**: Windows auto-login without password
- **Process Management**: Kill Node.js, npm, npx, and Docker processes with one click
- **Web Dashboard**: Real-time stats and remote management interface
- **Cloudflare Tunnel**: Expose dashboard to the internet
- **Billing System**: Monetization via Patreon/BuyMeACoffee

## Installation

1. Clone this repository
2. Run `npm install` (not required for basic functionality)
3. Follow the setup instructions in `SETUP_GUIDE.md`

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

### Kill Processes

```bash
KILL_NODE.bat       # Kill all Node.js processes
KILL_DOCKER.bat     # Kill Docker processes
```

## Files

- `dashboard.cjs` - Web dashboard server
- `landing.html` - Sales page
- `START_DASHBOARD.bat` - Starts the dashboard on boot
- `START_TUNNEL.bat` - Exposes the dashboard via Cloudflare Tunnel
- `KILL_NODE.bat` - Kills all Node.js processes
- `KILL_DOCKER.bat` - Kills Docker processes
- `SETUP_GUIDE.md` - Complete installation instructions
- `MARKETING_RESEARCH.txt` - Competitor analysis
- `HOW_TO_SELL.txt` - Selling guide

## System Requirements

- Windows 10/11
- Node.js (for dashboard)
- Chrome browser (for remote access)

## License

MIT
