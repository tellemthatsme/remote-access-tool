# Changelog

All notable changes to this project will be documented in this file.

## [1.4.0] - 2026-03-27

### Added

- **Glassmorphism UI** - Modern frosted glass design with backdrop blur
- **CSV Export** - Export historical data to CSV file
- **Light/Dark Theme Toggle** - Switch between themes dynamically
- **User Management** - Add/remove users with role-based access (Admin/Viewer)
- **Enhanced Animations** - Smooth slide-in animations and micro-interactions

### Changed

- Updated UI to world-class modern design standards
- Improved glassmorphism effects across all components
- Better hover states and visual feedback
- Enhanced mobile responsiveness with glass effects

### API New Endpoints

- `GET /api/export-csv` - Export history as CSV
- `GET /api/users` - List users
- `POST /api/add-user` - Add new user
- `DELETE /api/remove-user/:username` - Remove user

## [1.3.0] - 2026-03-24

### Added

- **Custom Process Kill** - Kill any process by name (not just Node/Docker)
- **Windows Services List** - View running/stopped Windows services
- **CPU/RAM History Graphs** - Visual history bars in dashboard
- **PWA Ready** - Can be installed as a standalone app
- **GPU Monitoring** - NVIDIA/AMD GPU usage and temperature
- **WebSocket Support** - Real-time updates without polling

### Changed

- Enhanced dashboard UI with history visualizations
- Improved mobile responsiveness
- Better alert system with color-coded warnings

### API New Endpoints

- `GET /api/services` - Windows services list
- `POST /api/kill-process` - Kill custom process by name

## [1.2.0] - 2026-03-13

### Added

- WebSocket real-time updates
- GPU Monitoring (NVIDIA/AMD)
- Historical Data (saves to file)
- File Browser (browse directories)
- Terminal (safe command execution)

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
- User Roles (Admin vs Viewer)
- Session Timeout
- User Profiles
- REST API for external integrations
- Docker container management UI
- Custom theming support
- Historical data logging
- Export stats to CSV/JSON
- Multiple PC support
- Mobile apps (iOS/Android)
