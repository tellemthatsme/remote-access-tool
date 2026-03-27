# Changelog

All notable changes to this project will be documented in this file.

## [1.6.0] - 2026-03-28

### Added

- **Enterprise White-Label** - Custom branding, logos, colors for enterprise clients
- **Stripe Payment Integration** - Professional subscription management
- **Webhook System** - Real-time event notifications and integrations
- **Multi-PC Support** - Connect and manage multiple computers from one dashboard
- **REST API** - Full REST API with Bearer authentication for external integrations
- **Port Scanning** - Network port scanning and service detection
- **VRAM Monitoring** - GPU memory usage monitoring for AI/ML workloads
- **Custom Alerts** - Configurable alert thresholds for CPU, RAM, disk, VRAM
- **System Information** - Detailed system specs and uptime monitoring
- **Mobile App Preparation** - Framework and assets for iOS/Android apps

### Changed

- Enhanced GPU monitoring with VRAM percentage tracking
- Improved alert system with customizable thresholds
- Added system health monitoring and diagnostics
- Updated landing page with enterprise pricing and mobile app info
- Modernized UI with enterprise features and branding controls

### API New Endpoints

- `GET /api/pcs` - List connected PCs
- `POST /api/pc/register` - Register a new PC
- `GET /api/pc/{id}` - Get PC stats
- `GET /api/v1/status` - System status overview
- `GET /api/v1/uptime` - System uptime information
- `GET /api/v1/ports` - Port scanning results
- `GET /api/v1/alerts` - Current alerts and thresholds
- `POST /api/v1/stripe/create-session` - Create payment session
- `POST /api/v1/webhooks/test` - Test webhook delivery
- `PUT /api/v1/branding` - Update white-label branding

### Security Enhancements

- Bearer token authentication for API endpoints
- Enhanced rate limiting with configurable windows
- Webhook signature verification (planned)
- Enterprise-grade security controls

### Business Features

- **Pricing Tiers**: Basic ($4.99/mo), Professional ($9.99/mo), Enterprise ($29.99/mo)
- **Stripe Integration**: Secure payment processing
- **White-Label Branding**: Custom logos, colors, company names
- **Webhook System**: Real-time integrations and notifications
- **14-Day Free Trial**: Risk-free evaluation period

### Added

- **File Browser** - Browse files and directories remotely with navigation
- **Terminal Access** - Execute safe system commands through web interface
- **Docker Management** - View and control Docker containers (start/stop/restart)
- **Rate Limiting** - Security protection against brute force attacks (100 req/15min)
- **Enhanced Security** - Request throttling and IP-based rate limiting

### Changed

- Improved security with comprehensive rate limiting
- Added file system navigation capabilities
- Extended Docker integration for container management
- Enhanced terminal with real-time command execution

### API New Endpoints

- `GET /api/files?dir=path` - Browse directory contents
- `GET /api/docker/containers` - List Docker containers
- `POST /api/docker/action` - Control Docker containers (start/stop/restart)

### Security Enhancements

- Rate limiting implemented (429 responses for abuse)
- IP-based request tracking and throttling
- Enhanced API security validation

## [1.4.0] - 2026-03-27

### Added

- **Glassmorphism UI** - Frosted glass effects with backdrop blur
- **CSV Export** - Download historical data as CSV file
- **Light/Dark Theme Toggle** - Dynamic theme switching with smooth transitions
- **User Management** - Add/remove users with role-based access (Admin/Viewer)
- **Enhanced Animations** - Smooth slide-in effects and micro-interactions

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
