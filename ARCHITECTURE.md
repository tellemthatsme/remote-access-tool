# Architecture Documentation

## Overview

Remote Access Tool is a Node.js-based web dashboard for managing remote PC access. It provides a web interface for system monitoring and process management.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Browser                         │
│                    (Dashboard UI)                           │
└─────────────────────────┬───────────────────────────────────┘
                          │ HTTP/WebSocket
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                  Node.js Server (dashboard.cjs)             │
│                   Port: 3001                                │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   HTTP       │  │  Auth        │  │  System      │    │
│  │   Server     │  │  Middleware  │  │  Info Module  │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│  ┌──────────────┐  ┌──────────────┐                       │
│  │  Dashboard   │  │  Process     │                       │
│  │  Routes      │  │  Manager     │                       │
│  └──────────────┘  └──────────────┘                       │
└─────────────────────────┬───────────────────────────────────┘
                          │
         ┌────────────────┼────────────────┐
         ▼                ▼                ▼
    ┌─────────┐     ┌───────────┐    ┌──────────┐
    │ Windows │     │  Chrome   │    │Cloudflare│
    │  OS     │     │  Remote   │    │  Tunnel  │
    │  APIs   │     │  Desktop  │    │          │
    └─────────┘     └───────────┘    └──────────┘
```

## Components

### dashboard.cjs
Main Node.js server that:
- Serves the web dashboard
- Handles authentication
- Collects system information
- Manages processes

### Authentication
- Simple password-based auth
- Password: `karma123` (configurable in code)
- Session-based using express-session

### System Information
- CPU usage
- Memory usage
- Disk space
- Running processes

### Process Management
- Kill Node.js processes
- Kill npm/npx processes
- Kill Docker processes

## Dependencies

### Production
- `express` - Web server framework
- `os-utils` - System information
- `express-session` - Session management

### Development
- `node` - JavaScript runtime

## Configuration

### Port
Default: `3001` (configurable in dashboard.cjs)

### Password
Default: `karma123` (change in dashboard.cjs)

## Security Considerations

1. Change default password
2. Use behind Cloudflare Tunnel
3. Enable HTTPS in production
4. Implement rate limiting
5. Add CSRF protection

## Future Improvements

- [ ] Add database for user management
- [ ] Implement JWT authentication
- [ ] Add WebSocket for real-time updates
- [ ] Create REST API
- [ ] Add Docker management UI
- [ ] Implement logs viewer
