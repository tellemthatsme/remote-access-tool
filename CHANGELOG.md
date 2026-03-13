# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2026-03-13

### Added
- **CPU Monitoring** - Real-time CPU percentage with history graph
- **RAM Monitoring** - Memory usage with visual bar and history
- **Disk Usage** - Per-drive information (total, used, free, percentage)
- **Temperature** - CPU temperature display (when sensor available)
- **Network Stats** - Total uploaded/downloaded data
- **Process List** - Top 10 processes by memory usage
- **Alert System** - Automatic warnings when CPU/RAM >80%/90%
- **Visual Alerts** - Color-coded status indicators

### Changed
- Enhanced dashboard UI with more sections
- Updated refresh intervals (stats: 2s, disk: 10s, network: 5s)
- Improved mobile responsiveness

### API New Endpoints
- `GET /api/disk` - Disk usage
- `GET /api/processes` - Top processes
- `GET /api/network` - Network stats
- `GET /api/temp` - Temperature

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
- System information display (CPU, memory)
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
- Multi-user support with different permission levels
- WebSocket real-time updates (faster than polling)
- Mobile-responsive UI improvements
- REST API for external integrations
- Docker container management UI
- Custom theming support
- GPU monitoring (for gaming/ML rigs)
- Historical data logging
- Export stats to CSV/JSON
