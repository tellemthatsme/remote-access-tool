# Changelog

All notable changes to this project will be documented in this file.

## [1.8.0] - 2026-03-28

### Added

- **File Transfer System** - Upload/download files between web/mobile and PC (100MB limit)
- **Google Drive Backup** - Automated backup to Google Drive with OAuth integration
- **Admin Dashboard** - Complete admin panel for user management, analytics, and system health
- **Automated Backup Scheduling** - Cron-based daily backups with retention policies
- **Customer Support Infrastructure** - Framework for support tickets and help systems
- **File Upload API** - REST endpoints for file transfer with authentication
- **Backup Management UI** - Interface to create, view, and download backups
- **Admin Analytics** - User metrics, revenue tracking, system monitoring
- **Google Drive Integration** - OAuth2 authentication and file upload
- **Enterprise Admin Features** - User management, system health, analytics dashboard

### Changed

- Enhanced file handling with proper upload/download capabilities
- Improved backup system with cloud storage integration
- Added admin controls for enterprise management
- Extended API with file operations and backup endpoints
- Upgraded security with file upload validation and access controls

### API New Endpoints

- `POST /api/upload` - File upload with multipart/form-data
- `GET /api/download/:userId/:fileName` - Secure file download
- `POST /api/backup/create` - Create system backup
- `GET /api/backup/list` - List available backups
- `GET /api/auth/google-drive` - Google Drive OAuth initiation
- `GET /api/auth/google-drive/callback` - OAuth callback handling

### Google Drive Integration

- OAuth2 authentication flow for Google Drive access
- Automated folder creation and file organization
- Secure token storage and refresh token handling
- Backup file upload with metadata tracking
- Configurable backup retention and cleanup

### Admin Features

- **User Management**: View, edit, delete users with role management
- **System Health**: Server status, database health, API monitoring
- **Analytics Dashboard**: User metrics, revenue tracking, usage statistics
- **Content Management**: Support for announcements and system messages
- **Security Monitoring**: Failed login attempts, suspicious activity

### File Transfer

- Drag-and-drop file upload interface
- Progress indicators and upload status
- File type validation and size limits
- Secure file storage with user isolation
- Download links with temporary access tokens

### Backup System

- Automated daily backups via cron scheduling
- Google Drive cloud storage integration
- Local backup retention with cleanup
- Backup verification and integrity checks
- Manual backup creation and restoration

### Mobile App Enhancements

- File upload/download capabilities
- Backup management interface
- Admin features for mobile access
- Enhanced offline file handling

### Added

- **Complete User Authentication System** - Registration, login, JWT tokens, sessions
- **SQLite Database Integration** - Proper data persistence for users, PCs, analytics, webhooks
- **React Native Mobile Apps** - iOS/Android apps with Expo framework
- **Advanced Analytics System** - User behavior tracking, event logging, usage metrics
- **Webhook Management** - Create, manage, and trigger webhooks for integrations
- **API Documentation** - Comprehensive endpoint documentation in UI
- **Payment Link Integration** - Stripe payment flow setup
- **Mobile-First Design** - Responsive mobile app interfaces
- **Cross-Platform Authentication** - JWT tokens for web and mobile
- **Real-Time Mobile Updates** - Live data synchronization
- **Offline Capabilities** - Basic offline support in mobile apps

### Changed

- Migrated from JSON file storage to SQLite database
- Enhanced security with proper user authentication
- Added mobile app frameworks and components
- Improved analytics tracking and reporting
- Updated landing page with Stripe payment integration
- Enhanced API with authentication and analytics
- Mobile-optimized UI components and navigation

### API New Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication
- `GET /api/auth/me` - Current user info
- `GET /api/v1/analytics` - User analytics data
- `POST /api/v1/analytics/log` - Log user events
- `POST /api/v1/webhooks` - Create webhooks
- `GET /api/v1/webhooks` - List user webhooks

### Mobile Apps

- **iOS App**: Native iOS experience with App Store deployment ready
- **Android App**: Material Design 3 with Play Store ready
- **Cross-Platform**: Single codebase for iOS, Android, and Web
- **Features**: Dashboard, PC control, real-time monitoring, authentication

### Database Schema

- **Users Table**: Authentication, profiles, billing
- **Sessions Table**: JWT token management
- **PCs Table**: Multi-PC management and status
- **Analytics Table**: Event tracking and metrics
- **Webhooks Table**: Integration management

### Security Enhancements

- JWT-based authentication with expiration
- Password hashing with bcrypt
- Session management and cleanup
- API rate limiting and request validation
- User-specific data isolation

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
