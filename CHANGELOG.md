# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2026-03-10

### Added
- Initial release
- Dashboard web server (Node.js)
- Chrome Remote Desktop integration
- Auto-login configuration scripts
- Process management batch files
- Cloudflare Tunnel support
- Basic authentication (password: karma123)
- Real-time system stats display
- Process kill functionality

### Features
- Web-based dashboard on port 3001
- System information display (CPU, memory, disk)
- Process management interface
- Cloudflare Tunnel for internet exposure
- Batch scripts for easy startup/shutdown

### Files
- `dashboard.cjs` - Main dashboard server
- `START_DASHBOARD.bat` - Dashboard startup script
- `START_TUNNEL.bat` - Cloudflare Tunnel script
- `KILL_NODE.bat` - Kill Node processes
- `KILL_DOCKER.bat` - Kill Docker processes

## [Unreleased]

### Planned Features
- Multi-user support
- WebSocket real-time updates
- Mobile-responsive UI
- API for external integrations
- Docker container management
- Custom theming support
