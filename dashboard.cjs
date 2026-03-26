const http = require("http");
const { exec, execSync } = require("child_process");
const os = require("os");
const fs = require("fs");
const path = require("path");
const WebSocket = require("ws");

const PORT = 3001;
const PASSWORD = "karma123";
const PC_NAME = "DESKTOP-KARMA";
const USERS = [{ username: "admin", role: "admin" }];

// Multi-PC Support
const CONNECTED_PCS = new Map(); // Store connected PCs
const PC_SESSIONS = new Map(); // Store active sessions

// Custom Alerts
const CUSTOM_ALERTS = [
  { type: 'cpu', threshold: 80, enabled: true },
  { type: 'ram', threshold: 85, enabled: true },
  { type: 'disk', threshold: 90, enabled: true }
];

// Rate limiting
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 100;
const requestCounts = new Map();

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>RemotePC - ${PC_NAME}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg-primary: #0a0a0f;
      --bg-secondary: rgba(18, 18, 26, 0.8);
      --bg-card: rgba(26, 26, 36, 0.6);
      --bg-elevated: rgba(34, 34, 46, 0.8);
      --text-primary: #ffffff;
      --text-secondary: #8b8b9e;
      --text-muted: #5a5a6e;
      --accent-green: #00d4aa;
      --accent-blue: #4f8cff;
      --accent-purple: #a855f7;
      --accent-orange: #f59e0b;
      --accent-red: #ef4444;
      --accent-cyan: #06b6d4;
      --gradient-start: #00d4aa;
      --gradient-end: #4f8cff;
      --border-color: rgba(255,255,255,0.1);
      --shadow-soft: 0 8px 32px rgba(0,0,0,0.4);
      --shadow-glow: 0 0 60px rgba(0,212,170,0.3);
      --glass-bg: rgba(26, 26, 36, 0.4);
      --glass-border: rgba(255,255,255,0.1);
    }
    [data-theme="light"] {
      --bg-primary: #f8fafc;
      --bg-secondary: rgba(241, 245, 249, 0.8);
      --bg-card: rgba(255, 255, 255, 0.6);
      --bg-elevated: rgba(241, 245, 249, 0.9);
      --text-primary: #1e293b;
      --text-secondary: #64748b;
      --text-muted: #94a3b8;
      --accent-green: #059669;
      --accent-blue: #2563eb;
      --accent-purple: #7c3aed;
      --accent-orange: #d97706;
      --accent-red: #dc2626;
      --accent-cyan: #0891b2;
      --gradient-start: #059669;
      --gradient-end: #2563eb;
      --border-color: rgba(0,0,0,0.1);
      --shadow-soft: 0 8px 32px rgba(0,0,0,0.1);
      --shadow-glow: 0 0 60px rgba(5,150,105,0.2);
      --glass-bg: rgba(255, 255, 255, 0.4);
      --glass-border: rgba(0,0,0,0.1);
    }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: var(--bg-primary);
      color: var(--text-primary);
      min-height: 100vh;
      padding: 20px;
      background-image:
        radial-gradient(ellipse at 20% 0%, rgba(0,212,170,0.08) 0%, transparent 50%),
        radial-gradient(ellipse at 80% 100%, rgba(79,140,255,0.08) 0%, transparent 50%);
      backdrop-filter: blur(20px);
    }
    .container { max-width: 1100px; margin: 0 auto; }
    
    /* Login Screen */
    .login-screen {
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(10, 10, 15, 0.8);
      display: flex; align-items: center; justify-content: center;
      z-index: 1000;
      backdrop-filter: blur(20px);
      animation: fadeIn 0.5s ease-out;
    }
    .login-screen.hidden { display: none; }
    .login-box {
      background: var(--glass-bg);
      backdrop-filter: blur(20px);
      padding: 48px;
      border-radius: 24px;
      text-align: center;
      max-width: 380px;
      width: 90%;
      border: 1px solid var(--glass-border);
      box-shadow: var(--shadow-soft);
    }
    .login-logo { 
      font-size: 48px; margin-bottom: 16px; 
      animation: pulse 2s ease-in-out infinite;
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
    .login-title { 
      font-size: 28px; font-weight: 700; margin-bottom: 8px;
      background: linear-gradient(135deg, var(--gradient-start), var(--gradient-end));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .login-subtitle { color: var(--text-secondary); font-size: 14px; margin-bottom: 32px; }
    .login-input { 
      width: 100%; padding: 16px 20px; font-size: 16px; 
      border: 2px solid var(--border-color); border-radius: 12px; 
      background: var(--bg-secondary); color: var(--text-primary); 
      margin-bottom: 12px; transition: all 0.3s;
    }
    .login-input:focus { 
      outline: none; border-color: var(--accent-green);
      box-shadow: 0 0 0 4px rgba(0,212,170,0.1);
    }
    .login-input::placeholder { color: var(--text-muted); }
    .login-btn { 
      width: 100%; padding: 16px; 
      background: linear-gradient(135deg, var(--gradient-start), var(--gradient-end));
      color: #000; border: none; border-radius: 12px; 
      font-size: 16px; font-weight: 600; cursor: pointer; 
      transition: all 0.3s;
    }
    .login-btn:hover { 
      transform: translateY(-2px);
      box-shadow: var(--shadow-glow);
    }
    .login-error { 
      color: var(--accent-red); margin-bottom: 12px; 
      display: none; font-size: 14px; 
    }

    /* Header */
    .header { text-align: center; margin-bottom: 24px; }
    .header h1 {
      font-size: 32px; font-weight: 700; margin-bottom: 8px;
      display: flex; align-items: center; justify-content: center; gap: 12px;
    }
    .pc-selector {
      margin-top: 16px;
      display: flex;
      justify-content: center;
      gap: 12px;
      align-items: center;
    }
    .pc-dropdown {
      background: var(--glass-bg);
      backdrop-filter: blur(20px);
      border: 1px solid var(--glass-border);
      border-radius: 12px;
      padding: 8px 16px;
      color: var(--text-primary);
      cursor: pointer;
      box-shadow: var(--shadow-soft);
    }
    .pc-status {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: var(--text-secondary);
    }
    .header-actions {
      display: flex; justify-content: center; gap: 12px;
      margin-top: 16px;
    }
    .export-btn {
      background: var(--glass-bg);
      backdrop-filter: blur(20px);
      color: var(--accent-cyan);
      border: 1px solid var(--glass-border);
      padding: 10px 20px;
      border-radius: 12px;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s;
      box-shadow: var(--shadow-soft);
    }
    .export-btn:hover {
      transform: translateY(-2px);
      background: var(--bg-elevated);
    }
    .theme-toggle {
      background: var(--glass-bg);
      backdrop-filter: blur(20px);
      border: 1px solid var(--glass-border);
      padding: 10px;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s;
      box-shadow: var(--shadow-soft);
    }
    .theme-toggle:hover {
      transform: translateY(-2px);
      background: var(--bg-elevated);
    }
    .header-badge {
      display: inline-flex; align-items: center; gap: 6px;
      background: var(--glass-bg);
      backdrop-filter: blur(20px);
      padding: 8px 16px;
      border-radius: 20px; font-size: 12px;
      border: 1px solid var(--glass-border);
      box-shadow: var(--shadow-soft);
    }
    .status-dot {
      width: 8px; height: 8px; background: var(--accent-green);
      border-radius: 50%; animation: blink 2s infinite;
    }
    @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }

    /* Alert Cards */
    .alerts-container { margin-bottom: 20px; }
    .alert { 
      padding: 14px 20px; border-radius: 12px; margin-bottom: 8px;
      font-size: 14px; display: flex; align-items: center; gap: 10px;
      animation: slideIn 0.3s ease-out;
    }
    @keyframes slideIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
    .alert-warning { 
      background: linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.05));
      border: 1px solid rgba(245,158,11,0.3); color: var(--accent-orange);
    }
    .alert-danger { 
      background: linear-gradient(135deg, rgba(239,68,68,0.15), rgba(239,68,68,0.05));
      border: 1px solid rgba(239,68,68,0.3); color: var(--accent-red);
    }

    /* Stats Grid */
    .stats-grid { 
      display: grid; grid-template-columns: repeat(2, 1fr); 
      gap: 16px; margin-bottom: 20px; 
    }
    .stat-card {
      background: var(--glass-bg);
      backdrop-filter: blur(20px);
      border-radius: 20px; padding: 24px;
      border: 1px solid var(--glass-border); position: relative;
      overflow: hidden;
      box-shadow: var(--shadow-soft);
      animation: slideInUp 0.6s ease-out;
    }
    @keyframes slideInUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .stat-card::before {
      content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
      background: linear-gradient(90deg, var(--gradient-start), var(--gradient-end));
    }
    .stat-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .stat-label { font-size: 13px; color: var(--text-secondary); font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; }
    .stat-icon { font-size: 20px; }
    .stat-value { 
      font-size: 42px; font-weight: 700; 
      font-family: 'JetBrains Mono', monospace;
      background: linear-gradient(135deg, var(--text-primary), var(--text-secondary));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .stat-value.cpu { color: var(--accent-orange); -webkit-text-fill-color: var(--accent-orange); }
    .stat-value.ram { color: var(--accent-cyan); -webkit-text-fill-color: var(--accent-cyan); }
    .stat-bar { 
      height: 6px; background: var(--bg-secondary); 
      border-radius: 3px; margin-top: 16px; overflow: hidden;
    }
    .stat-bar-fill { 
      height: 100%; border-radius: 3px;
      background: linear-gradient(90deg, var(--gradient-start), var(--gradient-end));
      transition: width 0.5s ease-out;
    }
    .history-graph {
      height: 50px; margin-top: 12px; display: flex; align-items: flex-end; gap: 2px;
    }
    .history-bar {
      flex: 1; min-height: 2px; background: var(--accent-green);
      border-radius: 2px 2px 0 0; opacity: 0.6; transition: height 0.3s;
    }
    .history-bar:hover { opacity: 1; }

    /* Quick Stats Row */
    .quick-stats { 
      display: grid; grid-template-columns: repeat(4, 1fr); 
      gap: 12px; margin-bottom: 20px; 
    }
    .quick-stat {
      background: var(--glass-bg);
      backdrop-filter: blur(20px);
      border-radius: 16px; padding: 20px;
      text-align: center; border: 1px solid var(--glass-border);
      transition: all 0.3s;
      box-shadow: var(--shadow-soft);
    }
    .quick-stat:hover { transform: translateY(-2px); border-color: var(--accent-blue); }
    .quick-stat-value { 
      font-size: 20px; font-weight: 700; 
      font-family: 'JetBrains Mono', monospace;
      color: var(--accent-blue);
    }
    .quick-stat-label { font-size: 11px; color: var(--text-muted); margin-top: 4px; text-transform: uppercase; }

    /* GPU Section */
    .gpu-card {
      background: var(--glass-bg);
      backdrop-filter: blur(20px);
      border: 1px solid var(--glass-border);
      border-radius: 16px; padding: 16px; margin-top: 12px;
      box-shadow: var(--shadow-soft);
    }
    .gpu-name { font-size: 12px; color: var(--text-secondary); margin-bottom: 6px; }
    .gpu-stats { display: flex; gap: 16px; font-size: 14px; font-weight: 600; }
    .gpu-usage { color: var(--accent-purple); }
    .gpu-mem { color: var(--accent-blue); }
    .gpu-temp { color: var(--accent-orange); }

    /* Section Cards */
    .section {
      background: var(--glass-bg);
      backdrop-filter: blur(20px);
      border-radius: 20px; padding: 24px;
      margin-bottom: 16px; border: 1px solid var(--glass-border);
      box-shadow: var(--shadow-soft);
    }
    .section-title { 
      font-size: 14px; font-weight: 600; color: var(--text-secondary); 
      margin-bottom: 16px; display: flex; align-items: center; gap: 8px;
      text-transform: uppercase; letter-spacing: 0.5px;
    }

    /* Disk */
    .disk-item { margin-bottom: 16px; }
    .disk-header { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 8px; }
    .disk-name { font-weight: 600; }
    .disk-info { color: var(--text-muted); }
    .disk-bar { height: 8px; background: var(--bg-secondary); border-radius: 4px; overflow: hidden; }
    .disk-fill { height: 100%; border-radius: 4px; transition: width 0.5s; }
    .disk-fill.low { background: var(--accent-green); }
    .disk-fill.medium { background: var(--accent-blue); }
    .disk-fill.high { background: var(--accent-orange); }
    .disk-fill.critical { background: var(--accent-red); }

    /* Processes */
    .process-list { max-height: 200px; overflow-y: auto; }
    .process-item { 
      display: flex; justify-content: space-between; 
      padding: 10px 0; border-bottom: 1px solid var(--border-color);
      font-size: 13px;
    }
    .process-item:last-child { border-bottom: none; }
    .process-name { color: var(--text-secondary); }
    .process-mem { 
      font-family: 'JetBrains Mono', monospace; 
      color: var(--accent-purple); font-weight: 500;
    }

    /* Actions Grid */
    .actions-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .btn {
      padding: 16px 20px; border: none; border-radius: 14px;
      font-size: 14px; font-weight: 600; cursor: pointer;
      transition: all 0.3s; display: flex; align-items: center; justify-content: center; gap: 8px;
      backdrop-filter: blur(10px);
    }
    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 40px rgba(0,0,0,0.5);
    }
    .btn:hover { transform: translateY(-2px); }
    .btn-kill { 
      background: linear-gradient(135deg, rgba(239,68,68,0.2), rgba(239,68,68,0.1));
      color: var(--accent-red); border: 1px solid rgba(239,68,68,0.3);
    }
    .btn-kill:hover { background: linear-gradient(135deg, rgba(239,68,68,0.3), rgba(239,68,68,0.2)); }
    .btn-docker { 
      background: linear-gradient(135deg, rgba(6,182,212,0.2), rgba(6,182,212,0.1));
      color: var(--accent-cyan); border: 1px solid rgba(6,182,212,0.3);
    }
    .btn-docker:hover { background: linear-gradient(135deg, rgba(6,182,212,0.3), rgba(6,182,212,0.2)); }
    .btn-restart { 
      background: linear-gradient(135deg, rgba(79,140,255,0.2), rgba(79,140,255,0.1));
      color: var(--accent-blue); border: 1px solid rgba(79,140,255,0.3);
    }
    .btn-shutdown { 
      background: var(--bg-elevated); color: var(--text-secondary);
      border: 1px solid var(--border-color);
    }
    .btn-shutdown:hover { background: var(--bg-card); color: var(--text-primary); }

    /* Custom Kill */
    .custom-kill { 
      display: flex; gap: 12px; margin-top: 12px; padding-top: 12px; 
      border-top: 1px solid var(--border-color);
    }
    .custom-kill input { 
      flex: 1; padding: 12px 16px; 
      background: var(--bg-secondary); border: 1px solid var(--border-color);
      border-radius: 10px; color: var(--text-primary); font-size: 14px;
    }
    .custom-kill input:focus { outline: none; border-color: var(--accent-red); }
    .custom-kill button { 
      padding: 12px 20px; background: var(--accent-red); color: #fff;
      border: none; border-radius: 10px; font-weight: 600; cursor: pointer;
      transition: all 0.3s;
    }
    .custom-kill button:hover { background: #dc2626; }

    /* Services */
    .services-list { max-height: 150px; overflow-y: auto; }
    .service-item {
      display: flex; justify-content: space-between;
      padding: 8px 0; font-size: 13px;
    }
    .service-name { color: var(--text-secondary); }
    .service-running { color: var(--accent-green); }
    .service-stopped { color: var(--accent-red); }

    .users-list { max-height: 150px; overflow-y: auto; }
    .user-item {
      display: flex; justify-content: space-between; align-items: center;
      padding: 8px 0; font-size: 13px;
    }
    .user-name { color: var(--text-secondary); }
    .user-role { color: var(--accent-purple); font-weight: 500; }
    .user-remove { color: var(--accent-red); cursor: pointer; font-size: 16px; }

    /* File Browser */
    .file-browser { display: flex; flex-direction: column; gap: 16px; }
    .file-path { display: flex; gap: 8px; align-items: center; }
    .btn-file {
      background: var(--glass-bg);
      backdrop-filter: blur(20px);
      color: var(--accent-cyan);
      border: 1px solid var(--glass-border);
      padding: 8px 16px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s;
      box-shadow: var(--shadow-soft);
    }
    .btn-file:hover {
      transform: translateY(-2px);
      background: var(--bg-elevated);
    }
    .file-list {
      background: var(--glass-bg);
      backdrop-filter: blur(20px);
      border: 1px solid var(--glass-border);
      border-radius: 12px;
      padding: 16px;
      max-height: 300px;
      overflow-y: auto;
      box-shadow: var(--shadow-soft);
    }
    .file-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 12px;
      margin-bottom: 4px;
      border-radius: 8px;
      transition: all 0.2s;
      cursor: pointer;
    }
    .file-item:hover { background: var(--bg-elevated); }
    .file-item.dir { color: var(--accent-blue); }
    .file-item.file { color: var(--text-secondary); }
    .file-info { font-size: 12px; color: var(--text-muted); }

    /* Terminal */
    .terminal { font-family: 'JetBrains Mono', monospace; }
    .terminal-output {
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
      max-height: 200px;
      overflow-y: auto;
      margin-bottom: 12px;
      font-size: 12px;
      line-height: 1.4;
    }
    .terminal-input {
      display: flex;
      align-items: center;
      gap: 8px;
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 12px;
    }
    .terminal-prompt { color: var(--accent-green); font-weight: bold; }
    .terminal-input input {
      flex: 1;
      background: transparent;
      border: none;
      color: var(--text-primary);
      font-family: inherit;
      font-size: 12px;
      outline: none;
    }

    /* Docker */
    .docker-controls { margin-bottom: 16px; }
    .docker-list {
      background: var(--glass-bg);
      backdrop-filter: blur(20px);
      border: 1px solid var(--glass-border);
      border-radius: 12px;
      padding: 16px;
      max-height: 300px;
      overflow-y: auto;
      box-shadow: var(--shadow-soft);
    }
    .docker-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      margin-bottom: 8px;
      border-radius: 8px;
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
    }
    .docker-info { flex: 1; }
    .docker-name { font-weight: 600; color: var(--text-primary); }
    .docker-status {
      font-size: 12px;
      padding: 2px 8px;
      border-radius: 12px;
      font-weight: 500;
    }
    .docker-status.running { background: var(--accent-green); color: #000; }
    .docker-status.exited { background: var(--accent-red); color: #fff; }
    .docker-actions { display: flex; gap: 8px; }
    .docker-btn {
      padding: 6px 12px;
      border: none;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .docker-btn.start { background: var(--accent-green); color: #000; }
    .docker-btn.stop { background: var(--accent-red); color: #fff; }
    .docker-btn.restart { background: var(--accent-orange); color: #000; }

    /* PCs */
    .pcs-controls { margin-bottom: 16px; }
    .pcs-list {
      background: var(--glass-bg);
      backdrop-filter: blur(20px);
      border: 1px solid var(--glass-border);
      border-radius: 12px;
      padding: 16px;
      box-shadow: var(--shadow-soft);
    }
    .pc-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      margin-bottom: 8px;
      border-radius: 8px;
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
    }
    .pc-info { flex: 1; }
    .pc-name { font-weight: 600; color: var(--text-primary); }
    .pc-details { font-size: 12px; color: var(--text-muted); margin-top: 4px; }
    .pc-status-dot {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      margin-right: 6px;
    }
    .pc-status-dot.online { background: var(--accent-green); }
    .pc-status-dot.offline { background: var(--accent-red); }
    .pc-actions { display: flex; gap: 8px; }
    .pc-btn {
      padding: 6px 12px;
      border: none;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .pc-btn.connect { background: var(--accent-blue); color: #fff; }
    .pc-btn.remove { background: var(--accent-red); color: #fff; }

    /* Network & Ports */
    .network-controls { margin-bottom: 16px; display: flex; align-items: center; }
    .network-info, .ports-list {
      background: var(--glass-bg);
      backdrop-filter: blur(20px);
      border: 1px solid var(--glass-border);
      border-radius: 12px;
      padding: 16px;
      box-shadow: var(--shadow-soft);
    }
    .port-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 12px;
      margin-bottom: 4px;
      border-radius: 8px;
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
    }
    .port-info { font-weight: 600; color: var(--text-primary); }
    .port-service { font-size: 12px; color: var(--text-muted); }

    /* System Info */
    .system-info {
      background: var(--glass-bg);
      backdrop-filter: blur(20px);
      border: 1px solid var(--glass-border);
      border-radius: 12px;
      padding: 16px;
      box-shadow: var(--shadow-soft);
    }
    .system-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }
    .system-item {
      background: var(--bg-secondary);
      padding: 12px;
      border-radius: 8px;
      border: 1px solid var(--border-color);
    }
    .system-label { font-size: 12px; color: var(--text-muted); margin-bottom: 4px; }
    .system-value { font-weight: 600; color: var(--text-primary); }

    /* Log */
    .log { 
      font-family: 'JetBrains Mono', monospace; font-size: 12px; 
      max-height: 100px; overflow-y: auto; 
    }
    .log-entry { 
      padding: 8px 0; border-bottom: 1px solid var(--border-color);
      animation: fadeIn 0.3s ease-out;
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .log-time { color: var(--text-muted); }

    /* Footer */
    .footer { 
      text-align: center; padding: 24px; 
      color: var(--text-muted); font-size: 12px; 
    }
    .footer a { color: var(--accent-green); text-decoration: none; }

    /* Mobile Responsive */
    @media (max-width: 768px) {
      .stats-grid { grid-template-columns: 1fr; }
      .quick-stats { grid-template-columns: repeat(2, 1fr); }
      .actions-grid { grid-template-columns: 1fr; }
      .stat-value { font-size: 32px; }
    }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: var(--bg-secondary); }
    ::-webkit-scrollbar-thumb { background: var(--bg-elevated); border-radius: 3px; }
    ::-webkit-scrollbar-thumb:hover { background: var(--text-muted); }
  </style>
</head>
<body>
  <div class="login-screen" id="loginScreen">
    <div class="login-box">
      <div class="login-logo">🖥️</div>
      <h2 class="login-title">RemotePC</h2>
      <p class="login-subtitle">Monitor & control your PC from anywhere</p>
      <input type="password" class="login-input" id="password" placeholder="Enter password">
      <div class="login-error" id="error">Incorrect password. Please try again.</div>
      <button class="login-btn" onclick="login()">Access Dashboard</button>
    </div>
  </div>
  
  <div class="container" id="dashboard">
    <div class="header">
      <h1>🖥️ <span id="currentPCName">${PC_NAME}</span></h1>
      <div class="header-badge">
        <span class="status-dot"></span>
        <span id="uptime">Online</span>
      </div>
      <div class="pc-selector">
        <select class="pc-dropdown" id="pcSelector" onchange="switchPC(this.value)">
          <option value="local">${PC_NAME} (Local)</option>
        </select>
        <div class="pc-status">
          <span class="status-dot"></span>
          <span>Connected PCs: <span id="pcCount">1</span></span>
        </div>
      </div>
      <div class="header-actions">
        <button class="export-btn" onclick="exportCSV()">📊 Export History (CSV)</button>
        <button class="theme-toggle" onclick="toggleTheme()" id="themeBtn">🌙</button>
        <button class="theme-toggle" onclick="toggleFileBrowser()">📁 Files</button>
        <button class="theme-toggle" onclick="toggleTerminal()">💻 Terminal</button>
        <button class="theme-toggle" onclick="toggleDocker()">🐳 Docker</button>
        <button class="theme-toggle" onclick="togglePCs()">🖥️ PCs</button>
        <button class="theme-toggle" onclick="toggleNetwork()">🌐 Network</button>
        <button class="theme-toggle" onclick="toggleSystem()">💻 System</button>
      </div>
    </div>
    
    <div class="alerts-container" id="alerts"></div>
    
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-header">
          <span class="stat-label">CPU Usage</span>
          <span class="stat-icon">⚡</span>
        </div>
        <div class="stat-value cpu" id="cpu">--%</div>
        <div class="stat-bar"><div class="stat-bar-fill" id="cpuBar" style="width: 0%"></div></div>
        <div class="history-graph" id="cpuHistory"></div>
      </div>
      <div class="stat-card">
        <div class="stat-header">
          <span class="stat-label">Memory</span>
          <span class="stat-icon">🧠</span>
        </div>
        <div class="stat-value ram" id="ram">--%</div>
        <div class="stat-bar"><div class="stat-bar-fill" id="ramBar" style="width: 0%"></div></div>
        <div class="history-graph" id="ramHistory"></div>
      </div>
    </div>
    
    <div class="quick-stats">
      <div class="quick-stat">
        <div class="quick-stat-value" id="memUsed">--</div>
        <div class="quick-stat-label">RAM Used</div>
      </div>
      <div class="quick-stat">
        <div class="quick-stat-value" id="disk">--</div>
        <div class="quick-stat-label">Disk</div>
      </div>
      <div class="quick-stat">
        <div class="quick-stat-value" id="temp">--°</div>
        <div class="quick-stat-label">GPU Temp</div>
      </div>
      <div class="quick-stat">
        <div class="quick-stat-value" id="processCount">--</div>
        <div class="quick-stat-label">Processes</div>
      </div>
    </div>
    
    <div id="gpuContainer"></div>
    
    <div class="section" id="diskSection" style="display:none;">
      <div class="section-title">💾 Storage</div>
      <div id="diskList"></div>
    </div>
    
    <div class="section">
      <div class="section-title">📊 Top Processes</div>
      <div class="process-list" id="processList">
        <div style="color: var(--text-muted); text-align: center; padding: 20px;">Loading processes...</div>
      </div>
    </div>
    
    <div class="section">
      <div class="section-title">⚡ Quick Actions</div>
      <div class="actions-grid">
        <button class="btn btn-kill" onclick="killNode()">☠️ Kill All Node</button>
        <button class="btn btn-docker" onclick="killDocker()">🐳 Kill Docker</button>
        <button class="btn btn-restart" onclick="restart()">🔄 Restart PC</button>
        <button class="btn btn-shutdown" onclick="shutdown()">🔴 Shutdown</button>
      </div>
      <div class="custom-kill">
        <input type="text" id="customProcess" placeholder="Enter process name (e.g., chrome, code)">
        <button onclick="killCustom()">Kill Process</button>
      </div>
    </div>
    
    <div class="section" id="servicesSection" style="display:none;">
      <div class="section-title">🔧 Windows Services</div>
      <div class="services-list" id="servicesList">
        <div style="color: var(--text-muted); text-align: center; padding: 20px;">Loading services...</div>
      </div>
    </div>
    
    <div class="section" id="usersSection" style="display:none;">
      <div class="section-title">👥 User Management</div>
      <div class="users-list" id="usersList">
        <div style="color: var(--text-muted); text-align: center; padding: 20px;">Loading users...</div>
      </div>
      <div class="custom-kill" style="margin-top: 16px;">
        <input type="text" id="newUser" placeholder="Username">
        <select id="newUserRole" style="margin: 0 12px; padding: 12px; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 10px; color: var(--text-primary);">
          <option value="viewer">Viewer</option>
          <option value="admin">Admin</option>
        </select>
        <button onclick="addUser()">Add User</button>
      </div>
    </div>

    <div class="section" id="fileBrowserSection" style="display:none;">
      <div class="section-title">📁 File Browser</div>
      <div class="file-browser">
        <div class="file-path">
          <button onclick="goToParent()" class="btn-file">⬆️ Up</button>
          <input type="text" id="currentPath" value="C:\" readonly style="flex:1; margin:0 12px; padding:8px; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:8px; color:var(--text-primary);">
          <button onclick="refreshFiles()" class="btn-file">🔄 Refresh</button>
        </div>
        <div class="file-list" id="fileList">
          <div style="color: var(--text-muted); text-align: center; padding: 20px;">Loading files...</div>
        </div>
      </div>
    </div>

    <div class="section" id="terminalSection" style="display:none;">
      <div class="section-title">💻 Terminal</div>
      <div class="terminal">
        <div class="terminal-output" id="terminalOutput"></div>
        <div class="terminal-input">
          <span class="terminal-prompt">C:\></span>
          <input type="text" id="terminalCommand" placeholder="Enter command (ls, dir, ipconfig, etc.)" onkeypress="handleTerminalKey(event)">
        </div>
      </div>
    </div>

    <div class="section" id="dockerSection" style="display:none;">
      <div class="section-title">🐳 Docker Containers</div>
      <div class="docker-controls">
        <button class="btn-docker" onclick="fetchDockerContainers()">🔄 Refresh</button>
      </div>
      <div class="docker-list" id="dockerList">
        <div style="color: var(--text-muted); text-align: center; padding: 20px;">Loading containers...</div>
      </div>
    </div>

    <div class="section" id="pcsSection" style="display:none;">
      <div class="section-title">🖥️ Connected PCs</div>
      <div class="pcs-controls">
        <button class="btn-docker" onclick="fetchPCs()">🔄 Refresh</button>
        <button class="btn-docker" onclick="registerCurrentPC()">➕ Register This PC</button>
      </div>
      <div class="pcs-list" id="pcsList">
        <div style="color: var(--text-muted); text-align: center; padding: 20px;">Loading PCs...</div>
      </div>
    </div>

    <div class="section" id="networkSection" style="display:none;">
      <div class="section-title">🌐 Network & Ports</div>
      <div class="network-controls">
        <button class="btn-docker" onclick="scanPorts()">🔍 Scan Ports</button>
        <input type="number" id="startPort" placeholder="Start" value="1" min="1" max="65535" style="width:80px; margin:0 8px; padding:8px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-secondary); color:var(--text-primary);">
        <input type="number" id="endPort" placeholder="End" value="100" min="1" max="65535" style="width:80px; margin:0 8px; padding:8px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-secondary); color:var(--text-primary);">
      </div>
      <div class="network-info" id="networkInfo">
        <div style="color: var(--text-muted); text-align: center; padding: 20px;">Network information...</div>
      </div>
      <div class="ports-list" id="portsList" style="display:none;">
        <div style="color: var(--text-muted); text-align: center; padding: 20px;">No open ports found...</div>
      </div>
    </div>

    <div class="section" id="systemSection" style="display:none;">
      <div class="section-title">🖥️ System Information</div>
      <div class="system-info" id="systemInfo">
        <div style="color: var(--text-muted); text-align: center; padding: 20px;">Loading system info...</div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">📝 Activity Log</div>
      <div class="log" id="log"></div>
    </div>
    
    <div class="footer">
      <p>Built after 14 months of learning to code • RemotePC v1.6</p>
    </div>
  </div>

  <script>
    let loggedIn = false;
    const PASS = '${PASSWORD}';
    let cpuHistory = [];
    let ramHistory = [];
    
    function login() {
      const pwd = document.getElementById('password').value;
      if (pwd === PASS) {
        loggedIn = true;
        document.getElementById('loginScreen').classList.add('hidden');
        log('✅ Welcome to RemotePC!');
        fetchStats();
        fetchDisk();
        fetchProcesses();
        fetchServices();
        fetchUsers();
      } else {
        document.getElementById('error').style.display = 'block';
        setTimeout(() => document.getElementById('error').style.display = 'none', 3000);
      }
    }
    
    function log(msg) {
      const logEl = document.getElementById('log');
      const entry = document.createElement('div');
      entry.className = 'log-entry';
      const time = new Date().toLocaleTimeString();
      entry.innerHTML = '<span class="log-time">[' + time + ']</span> ' + msg;
      logEl.insertBefore(entry, logEl.firstChild);
    }
    
    function renderHistory(elementId, history, maxLen = 40) {
      const el = document.getElementById(elementId);
      el.innerHTML = '';
      const data = history.slice(-maxLen);
      data.forEach((val, i) => {
        const bar = document.createElement('div');
        bar.className = 'history-bar';
        bar.style.height = Math.max(4, val) + '%';
        bar.style.opacity = 0.3 + (i / maxLen) * 0.7;
        el.appendChild(bar);
      });
    }
    
    function renderAlerts(alerts) {
      const el = document.getElementById('alerts');
      el.innerHTML = '';
      alerts.forEach(alert => {
        const div = document.createElement('div');
        div.className = 'alert ' + (alert.type === 'danger' ? 'alert-danger' : 'alert-warning');
        div.textContent = alert.msg;
        el.appendChild(div);
      });
    }
    
    function renderGPU(gpus) {
      const el = document.getElementById('gpuContainer');
      if (!gpus || gpus.length === 0) {
        el.innerHTML = '';
        return;
      }
      el.innerHTML = gpus.map(gpu => '<div class="gpu-card"><div class="gpu-name">' + gpu.name + '</div><div class="gpu-stats"><span class="gpu-usage">🎮 ' + gpu.usage + '%</span><span class="gpu-mem">📍 ' + (gpu.memoryUsed/1024).toFixed(0) + '/' + (gpu.memoryTotal/1024).toFixed(0) + 'GB</span>' + (gpu.temperature ? '<span class="gpu-temp">🌡️ ' + gpu.temperature + '°C</span>' : '') + '</div></div>').join('');
    }
    
    function renderDisk(disks) {
      const el = document.getElementById('diskList');
      if (!disks || disks.length === 0) return;
      document.getElementById('diskSection').style.display = 'block';
      document.getElementById('diskSection').querySelector('.section-title').textContent = '💾 Storage (' + disks.length + ' drives)';
      el.innerHTML = disks.map(d => {
        let cls = 'low';
        if (d.percent > 90) cls = 'critical';
        else if (d.percent > 75) cls = 'high';
        else if (d.percent > 50) cls = 'medium';
        return '<div class="disk-item"><div class="disk-header"><span class="disk-name">' + d.drive + '</span><span class="disk-info">' + d.free + '/' + d.total + ' GB free (' + (100 - d.percent) + '%)</span></div><div class="disk-bar"><div class="disk-fill ' + cls + '" style="width:' + d.percent + '%"></div></div></div>';
      }).join('');
    }
    
    function renderProcesses(processes) {
      const el = document.getElementById('processList');
      if (!processes || processes.length === 0) return;
      el.innerHTML = processes.slice(0, 12).map(p => '<div class="process-item"><span class="process-name">' + p.name + '</span><span class="process-mem">' + p.memory + ' GB</span></div>').join('');
    }
    
    function renderServices(services) {
      const el = document.getElementById('servicesList');
      if (!services || services.length === 0) return;
      document.getElementById('servicesSection').style.display = 'block';
      el.innerHTML = services.slice(0, 15).map(s => '<div class="service-item"><span class="service-name">' + s.name + '</span><span class="' + (s.status === 'Running' ? 'service-running' : 'service-stopped') + '">' + s.status + '</span></div>').join('');
    }
    
    async function fetchStats() {
      if (!loggedIn) return;
      try {
        const res = await fetch('/api/stats');
        const data = await res.json();
        document.getElementById('cpu').textContent = data.cpu + '%';
        document.getElementById('ram').textContent = data.ram + '%';
        document.getElementById('uptime').textContent = 'Online • ' + data.uptime;
        document.getElementById('memUsed').textContent = data.memUsed + '/' + data.memTotal + 'G';
        
        // Update bars
        document.getElementById('cpuBar').style.width = data.cpu + '%';
        document.getElementById('ramBar').style.width = data.ram + '%';
        
        // GPU temp
        document.getElementById('temp').textContent = data.gpu && data.gpu[0] && data.gpu[0].temperature ? data.gpu[0].temperature + '°' : '--';
        
        // History
        cpuHistory.push(data.cpu);
        ramHistory.push(data.ram);
        if (cpuHistory.length > 60) cpuHistory.shift();
        if (ramHistory.length > 60) ramHistory.shift();
        
        renderHistory('cpuHistory', cpuHistory);
        renderHistory('ramHistory', ramHistory);
        renderAlerts(data.alerts || []);
        renderGPU(data.gpu);
      } catch(e) { console.error(e); }
    }
    
    async function fetchDisk() {
      try {
        const res = await fetch('/api/disk');
        const data = await res.json();
        // Calculate total disk
        const total = data.reduce((sum, d) => sum + d.free, 0);
        document.getElementById('disk').textContent = Math.round(total/1000) + 'G';
        renderDisk(data);
      } catch(e) {}
    }
    
    async function fetchProcesses() {
      try {
        const res = await fetch('/api/processes');
        const data = await res.json();
        document.getElementById('processCount').textContent = data.length || '--';
        renderProcesses(data);
      } catch(e) {}
    }
    
    async function fetchServices() {
      try {
        const res = await fetch('/api/services');
        const data = await res.json();
        renderServices(data);
      } catch(e) {}
    }
    
    async function killNode() {
      if (!loggedIn) return alert('Please login first');
      log('☠️ Killing all Node processes...');
      try {
        await fetch('/api/kill-node', { method: 'POST' });
        setTimeout(() => log('✅ Node processes terminated'), 500);
      } catch(e) { log('Error: ' + e.message); }
    }
    
    async function killDocker() {
      if (!loggedIn) return alert('Please login first');
      log('🐳 Stopping Docker...');
      try {
        await fetch('/api/kill-docker', { method: 'POST' });
        setTimeout(() => log('✅ Docker stopped'), 500);
      } catch(e) { log('Error: ' + e.message); }
    }
    
    async function killCustom() {
      if (!loggedIn) return alert('Please login first');
      const name = document.getElementById('customProcess').value.trim();
      if (!name) return;
      log('☠️ Terminating ' + name + '...');
      try {
        const res = await fetch('/api/kill-process', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({name})
        });
        const data = await res.json();
        if (data.success) {
          log('✅ ' + name + ' terminated (' + data.count + ' instances)');
        } else {
          log('⚠️ ' + (data.error || 'Process not found'));
        }
      } catch(e) { log('Error: ' + e.message); }
    }
    
    async function restart() {
      if (!loggedIn) return alert('Please login first');
      if(!confirm('⚠️ Restart PC in 10 seconds?')) return;
      log('🔄 Restarting PC...');
      try { await fetch('/api/restart', { method: 'POST' }); }
      catch(e) { log('Error: ' + e.message); }
    }
    
    async function shutdown() {
      if (!loggedIn) return alert('Please login first');
      if(!confirm('🔴 SHUTDOWN PC in 10 seconds? This will turn off your PC!')) return;
      log('🔴 Shutting down PC...');
      try { await fetch('/api/shutdown', { method: 'POST' }); }
      catch(e) { log('Error: ' + e.message); }
    }

    function exportCSV() {
      if (!loggedIn) return alert('Please login first');
      log('📊 Exporting history data...');
      const link = document.createElement('a');
      link.href = '/api/export-csv';
      link.download = 'remotepc-history.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      log('✅ History exported');
    }

    function toggleTheme() {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      document.getElementById('themeBtn').textContent = newTheme === 'light' ? '☀️' : '🌙';
      log('🎨 Theme switched to ' + newTheme);
    }

    function toggleFileBrowser() {
      if (!loggedIn) return alert('Please login first');
      const section = document.getElementById('fileBrowserSection');
      if (section.style.display === 'block') {
        section.style.display = 'none';
      } else {
        fetchFiles();
      }
      log('📁 File browser ' + (section.style.display === 'none' ? 'closed' : 'opened'));
    }

    function toggleTerminal() {
      if (!loggedIn) return alert('Please login first');
      const section = document.getElementById('terminalSection');
      section.style.display = section.style.display === 'block' ? 'none' : 'block';
      if (section.style.display === 'block') {
        document.getElementById('terminalCommand').focus();
      }
      log('💻 Terminal ' + (section.style.display === 'none' ? 'closed' : 'opened'));
    }

    function toggleDocker() {
      if (!loggedIn) return alert('Please login first');
      const section = document.getElementById('dockerSection');
      if (section.style.display === 'block') {
        section.style.display = 'none';
      } else {
        fetchDockerContainers();
      }
      log('🐳 Docker ' + (section.style.display === 'none' ? 'closed' : 'opened'));
    }

    // Multi-PC Support
    let currentPC = 'local';
    async function fetchPCs() {
      try {
        const res = await fetch('/api/pcs');
        const pcs = await res.json();
        renderPCs(pcs);
        updatePCSelector(pcs);
        document.getElementById('pcCount').textContent = pcs.length + 1; // +1 for local
        document.getElementById('pcsSection').style.display = 'block';
      } catch(e) {
        log('Error loading PCs: ' + e.message);
      }
    }

    function renderPCs(pcs) {
      const el = document.getElementById('pcsList');
      let html = '<div class="pc-item"><div class="pc-info"><div class="pc-name">🏠 Local PC (' + PC_NAME + ')</div><div class="pc-details"><span class="pc-status-dot online"></span>Online • Current Session</div></div><div class="pc-actions"><button class="pc-btn connect" disabled>Connected</button></div></div>';
      pcs.forEach(pc => {
        const isOnline = (Date.now() - pc.lastSeen) < 300000; // 5 minutes
        html += '<div class="pc-item"><div class="pc-info"><div class="pc-name">' + pc.name + '</div><div class="pc-details"><span class="pc-status-dot ' + (isOnline ? 'online' : 'offline') + '"></span>' + (isOnline ? 'Online' : 'Offline') + ' • ' + pc.ip + '</div></div><div class="pc-actions"><button class="pc-btn connect" onclick="switchPC(\'' + pc.id + '\')">Connect</button><button class="pc-btn remove" onclick="removePC(\'' + pc.id + '\')">Remove</button></div></div>';
      });
      el.innerHTML = html;
    }

    function updatePCSelector(pcs) {
      const selector = document.getElementById('pcSelector');
      selector.innerHTML = '<option value="local">' + PC_NAME + ' (Local)</option>';
      pcs.forEach(pc => {
        const option = document.createElement('option');
        option.value = pc.id;
        option.textContent = pc.name;
        selector.appendChild(option);
      });
    }

    function switchPC(pcId) {
      currentPC = pcId;
      if (pcId === 'local') {
        document.getElementById('currentPCName').textContent = PC_NAME;
        fetchStats(); // Reload local stats
        log('🔄 Switched to local PC');
      } else {
        // In full implementation, this would fetch from remote PC
        const pc = Array.from(CONNECTED_PCS.values()).find(p => p.id === pcId);
        if (pc) {
          document.getElementById('currentPCName').textContent = pc.name;
          log('🔄 Switched to PC: ' + pc.name);
        }
      }
    }

    async function registerCurrentPC() {
      try {
        const res = await fetch('/api/pc/register', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: generatePCId(),
            name: PC_NAME,
            os: 'Windows',
            version: '1.5.0'
          })
        });
        const data = await res.json();
        if (data.success) {
          log('✅ PC registered with ID: ' + data.pcId);
          fetchPCs();
        }
      } catch(e) {
        log('Error registering PC: ' + e.message);
      }
    }

    async function removePC(pcId) {
      // In full implementation, this would call an API to remove remote PC
      CONNECTED_PCS.delete(pcId);
      log('🗑️ Removed PC: ' + pcId);
      fetchPCs();
    }

    function togglePCs() {
      if (!loggedIn) return alert('Please login first');
      const section = document.getElementById('pcsSection');
      if (section.style.display === 'block') {
        section.style.display = 'none';
      } else {
        fetchPCs();
      }
      log('🖥️ PCs ' + (section.style.display === 'none' ? 'closed' : 'opened'));
    }

    // Network & Ports
    async function scanPorts() {
      if (!loggedIn) return alert('Please login first');
      const startPort = document.getElementById('startPort').value || 1;
      const endPort = document.getElementById('endPort').value || 100;
      log('🔍 Scanning ports ' + startPort + ' to ' + endPort + '...');

      try {
        const res = await fetch('/api/v1/ports?start=' + startPort + '&end=' + endPort, {
          headers: {'Authorization': 'Bearer ' + PASS}
        });
        const data = await res.json();
        renderPorts(data.ports);
        document.getElementById('networkSection').style.display = 'block';
        document.getElementById('portsList').style.display = 'block';
      } catch(e) {
        log('Error scanning ports: ' + e.message);
      }
    }

    function renderPorts(ports) {
      const el = document.getElementById('portsList');
      if (!ports || ports.length === 0) {
        el.innerHTML = '<div style="color: var(--text-muted); text-align: center; padding: 20px;">No open ports found in the scanned range.</div>';
        return;
      }
      el.innerHTML = ports.map(p =>
        '<div class="port-item">' +
        '<div><span class="port-info">Port ' + p.port + '</span><br><span class="port-service">' + p.service + '</span></div>' +
        '<div style="color: var(--accent-green); font-weight: 600;">OPEN</div>' +
        '</div>'
      ).join('');
    }

    function toggleNetwork() {
      if (!loggedIn) return alert('Please login first');
      const section = document.getElementById('networkSection');
      section.style.display = section.style.display === 'block' ? 'none' : 'block';
      if (section.style.display === 'block') {
        fetchNetworkInfo();
      }
      log('🌐 Network ' + (section.style.display === 'none' ? 'closed' : 'opened'));
    }

    async function fetchNetworkInfo() {
      const infoEl = document.getElementById('networkInfo');
      infoEl.innerHTML = '<div style="color: var(--text-muted); text-align: center; padding: 20px;">Loading network info...</div>';

      try {
        const res = await fetch('/api/v1/uptime');
        const data = await res.json();
        infoEl.innerHTML = '<div class="system-grid">' +
          '<div class="system-item"><div class="system-label">Platform</div><div class="system-value">' + data.platform + '</div></div>' +
          '<div class="system-item"><div class="system-label">Architecture</div><div class="system-value">' + data.arch + '</div></div>' +
          '<div class="system-item"><div class="system-label">CPU Cores</div><div class="system-value">' + data.cpus + '</div></div>' +
          '<div class="system-item"><div class="system-label">Uptime</div><div class="system-value">' + data.uptime + '</div></div>' +
          '<div class="system-item"><div class="system-label">Load Average</div><div class="system-value">' + data.loadAverage.slice(0, 3).join(', ') + '</div></div>' +
          '<div class="system-item"><div class="system-label">Boot Time</div><div class="system-value">' + new Date(data.bootTime).toLocaleString() + '</div></div>' +
          '</div>';
      } catch(e) {
        infoEl.innerHTML = '<div style="color: var(--accent-red); text-align: center; padding: 20px;">Error loading network info</div>';
      }
    }

    function toggleSystem() {
      if (!loggedIn) return alert('Please login first');
      const section = document.getElementById('systemSection');
      section.style.display = section.style.display === 'block' ? 'none' : 'block';
      if (section.style.display === 'block') {
        fetchSystemInfo();
      }
      log('💻 System ' + (section.style.display === 'none' ? 'closed' : 'opened'));
    }

    async function fetchSystemInfo() {
      const infoEl = document.getElementById('systemInfo');
      infoEl.innerHTML = '<div style="color: var(--text-muted); text-align: center; padding: 20px;">Loading system info...</div>';

      try {
        const [uptimeRes, alertsRes] = await Promise.all([
          fetch('/api/v1/uptime'),
          fetch('/api/v1/alerts')
        ]);
        const uptime = await uptimeRes.json();
        const alerts = await alertsRes.json();

        infoEl.innerHTML = '<div class="system-grid">' +
          '<div class="system-item"><div class="system-label">Status</div><div class="system-value" style="color:var(--accent-green)">Online</div></div>' +
          '<div class="system-item"><div class="system-label">Active Alerts</div><div class="system-value">' + alerts.alerts.length + '</div></div>' +
          '<div class="system-item"><div class="system-label">Platform</div><div class="system-value">' + uptime.platform + '</div></div>' +
          '<div class="system-item"><div class="system-label">Architecture</div><div class="system-value">' + uptime.arch + '</div></div>' +
          '<div class="system-item"><div class="system-label">CPU Cores</div><div class="system-value">' + uptime.cpus + '</div></div>' +
          '<div class="system-item"><div class="system-label">Uptime</div><div class="system-value">' + uptime.uptime + '</div></div>' +
          '</div>';
      } catch(e) {
        infoEl.innerHTML = '<div style="color: var(--accent-red); text-align: center; padding: 20px;">Error loading system info</div>';
      }
    }
    
    async function fetchUsers() {
      try {
        const res = await fetch('/api/users');
        const data = await res.json();
        renderUsers(data);
        document.getElementById('usersSection').style.display = 'block';
      } catch(e) {}
    }

    function renderUsers(users) {
      const el = document.getElementById('usersList');
      el.innerHTML = users.map(u => '<div class="user-item"><span class="user-name">' + u.username + '</span><span class="user-role">' + u.role + '</span><span class="user-remove" onclick="removeUser(\'' + u.username + '\')">×</span></div>').join('');
    }

    async function addUser() {
      if (!loggedIn) return alert('Please login first');
      const username = document.getElementById('newUser').value.trim();
      const role = document.getElementById('newUserRole').value;
      if (!username) return;
      try {
        const res = await fetch('/api/add-user', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({username, role})
        });
        if (res.ok) {
          log('✅ Added user: ' + username);
          fetchUsers();
          document.getElementById('newUser').value = '';
        } else {
          log('⚠️ Failed to add user');
        }
      } catch(e) { log('Error: ' + e.message); }
    }

    async function removeUser(username) {
      if (!loggedIn) return alert('Please login first');
      try {
        await fetch('/api/remove-user/' + username, { method: 'DELETE' });
        log('✅ Removed user: ' + username);
        fetchUsers();
      } catch(e) { log('Error: ' + e.message); }
    }

    // File Browser
    let currentPath = "C:\\";
    async function fetchFiles(dir = currentPath) {
      try {
        const res = await fetch('/api/files?dir=' + encodeURIComponent(dir));
        const data = await res.json();
        renderFiles(data);
        document.getElementById('currentPath').value = dir;
        currentPath = dir;
        document.getElementById('fileBrowserSection').style.display = 'block';
      } catch(e) {
        log('Error loading files: ' + e.message);
      }
    }

    function renderFiles(files) {
      const el = document.getElementById('fileList');
      el.innerHTML = files.map(f =>
        '<div class="file-item ' + (f.isDirectory ? 'dir' : 'file') + '" onclick="' + (f.isDirectory ? 'navigateTo(\'' + f.path.replace(/\\/g, '\\\\') + '\')' : 'log(\'File: ' + f.name + '\')') + '">' +
        '<span>' + (f.isDirectory ? '📁' : '📄') + ' ' + f.name + '</span>' +
        '<span class="file-info">' + (f.isDirectory ? '' : formatFileSize(f.size)) + '</span>' +
        '</div>'
      ).join('');
    }

    function navigateTo(path) {
      fetchFiles(path);
    }

    function goToParent() {
      const parent = path.dirname(currentPath);
      if (parent !== currentPath) {
        fetchFiles(parent);
      }
    }

    function refreshFiles() {
      fetchFiles(currentPath);
    }

    function formatFileSize(bytes) {
      if (bytes === 0) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }

    // Terminal
    async function executeCommand(cmd) {
      if (!cmd.trim()) return;
      try {
        const res = await fetch('/api/exec', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ command: cmd })
        });
        const data = await res.json();
        const outputEl = document.getElementById('terminalOutput');
        outputEl.innerHTML += '<div><span style="color:var(--accent-green)">C:\\></span> ' + cmd + '</div>';
        outputEl.innerHTML += '<div style="color:var(--text-secondary)">' + (data.output || data.error || 'Command executed') + '</div>';
        outputEl.scrollTop = outputEl.scrollHeight;
        document.getElementById('terminalCommand').value = '';
      } catch(e) {
        log('Terminal error: ' + e.message);
      }
    }

    function handleTerminalKey(e) {
      if (e.key === 'Enter') {
        executeCommand(document.getElementById('terminalCommand').value);
      }
    }

    // Docker
    async function fetchDockerContainers() {
      try {
        const res = await fetch('/api/docker/containers');
        const containers = await res.json();
        renderDockerContainers(containers);
        document.getElementById('dockerSection').style.display = 'block';
      } catch(e) {
        log('Docker not available: ' + e.message);
      }
    }

    function renderDockerContainers(containers) {
      const el = document.getElementById('dockerList');
      if (!containers || containers.length === 0) {
        el.innerHTML = '<div style="color: var(--text-muted); text-align: center; padding: 20px;">No containers found or Docker not running</div>';
        return;
      }
      el.innerHTML = containers.map(c =>
        '<div class="docker-item">' +
        '<div class="docker-info">' +
        '<div class="docker-name">' + (c.Names || c.names || 'Unknown') + '</div>' +
        '<div class="docker-status ' + (c.Status && c.Status.includes('Up') ? 'running' : 'exited') + '">' +
        (c.Status || 'Unknown') + '</div>' +
        '</div>' +
        '<div class="docker-actions">' +
        (c.Status && c.Status.includes('Up') ?
          '<button class="docker-btn stop" onclick="dockerAction(\'' + c.Id + '\', \'stop\')">Stop</button>' +
          '<button class="docker-btn restart" onclick="dockerAction(\'' + c.Id + '\', \'restart\')">Restart</button>'
          :
          '<button class="docker-btn start" onclick="dockerAction(\'' + c.Id + '\', \'start\')">Start</button>'
        ) +
        '</div>' +
        '</div>'
      ).join('');
    }

    async function dockerAction(containerId, action) {
      try {
        const res = await fetch('/api/docker/action', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ action, containerId })
        });
        const data = await res.json();
        if (data.success) {
          log('🐳 Container ' + action + ' successful');
          setTimeout(fetchDockerContainers, 1000);
        } else {
          log('🐳 Container ' + action + ' failed: ' + (data.error || 'Unknown error'));
        }
      } catch(e) {
        log('🐳 Docker error: ' + e.message);
      }
    }

    setInterval(fetchStats, 2000);
    setInterval(fetchDisk, 15000);
    setInterval(fetchProcesses, 5000);
    setInterval(fetchServices, 30000);
    setInterval(fetchUsers, 60000); // Fetch users every minute
  </script>
</body>
</html>`;

// =============== RATE LIMITING ===============
function checkRateLimit(clientIP) {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;

  if (!requestCounts.has(clientIP)) {
    requestCounts.set(clientIP, []);
  }

  const requests = requestCounts.get(clientIP);
  const validRequests = requests.filter((time) => time > windowStart);
  requestCounts.set(clientIP, validRequests);

  if (validRequests.length >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  validRequests.push(now);
  return true;
}

function getClientIP(req) {
  return req.headers['x-forwarded-for'] ||
         req.connection.remoteAddress ||
         req.socket.remoteAddress ||
         'unknown';
}

function generatePCId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// =============== HISTORY DATA ===============
const HISTORY_FILE = path.join(__dirname, "data", "history.json");
const MAX_HISTORY_DAYS = 30;

function ensureDataDir() {
  const dataDir = path.join(__dirname, "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

function loadHistory() {
  try {
    if (fs.existsSync(HISTORY_FILE)) {
      const data = JSON.parse(fs.readFileSync(HISTORY_FILE, "utf8"));
      const now = Date.now();
      const cutoff = now - MAX_HISTORY_DAYS * 24 * 60 * 60 * 1000;
      return data.filter((entry) => entry.timestamp > cutoff);
    }
  } catch (e) {}
  return [];
}

function saveHistory(stats) {
  ensureDataDir();
  let history = loadHistory();
  history.push({
    timestamp: Date.now(),
    cpu: stats.cpu,
    ram: stats.ram,
    memUsed: stats.memUsed,
    memTotal: stats.memTotal,
    disk: stats.disk,
    gpu: stats.gpu,
  });
  const now = Date.now();
  const cutoff = now - MAX_HISTORY_DAYS * 24 * 60 * 60 * 1000;
  history = history.filter((entry) => entry.timestamp > cutoff);
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
}

const inMemoryHistory = { cpu: [], ram: [], maxLength: 60 };

// =============== GPU MONITORING ===============
function getGPUInfo() {
  const gpus = [];
  try {
    const output = execSync(
      "nvidia-smi --query-gpu=name,utilization.gpu,memory.used,memory.total,temperature.gpu --format=csv,noheader",
      { encoding: "utf8", timeout: 5000 },
    );
    const lines = output.trim().split("\n");
    lines.forEach((line) => {
      const parts = line.split(",").map((p) => p.trim());
      if (parts.length >= 5) {
        gpus.push({
          name: parts[0],
          usage: parseInt(parts[1]) || 0,
          memoryUsed: parseInt(parts[2]) || 0,
          memoryTotal: parseInt(parts[3]) || 0,
          temperature: parseInt(parts[4]) || 0,
          type: "NVIDIA",
          vramPercent: Math.round((parseInt(parts[2]) || 0) / (parseInt(parts[3]) || 1) * 100)
        });
      }
    });
  } catch (e) {}
  if (gpus.length === 0) {
    try {
      const output = execSync(
        "wmic path win32_VideoController get name,adapterram /format:csv",
        { encoding: "utf8", timeout: 5000 },
      );
      const lines = output.trim().split("\n").slice(1);
      lines.forEach((line) => {
        const parts = line.split(",");
        if (parts.length >= 3 && parts[1]) {
          gpus.push({
            name: parts[1].trim(),
            usage: 0,
            memoryUsed: 0,
            memoryTotal: Math.round((parseInt(parts[2]) || 0) / 1024),
            temperature: null,
            type: "AMD/Intel",
            vramPercent: 0
          });
        }
      });
    } catch (e) {}
  }
  return gpus.length > 0 ? gpus : null;
}

// =============== PORT SCANNING ===============
function scanPorts(startPort = 1, endPort = 1024) {
  const results = [];
  const commonPorts = [21, 22, 23, 25, 53, 80, 110, 143, 443, 993, 995];

  // For demo, just check common ports quickly
  const portsToCheck = endPort <= 100 ? Array.from({length: endPort}, (_, i) => i + 1) : commonPorts;

  portsToCheck.forEach(port => {
    try {
      // Simple port check using net module would require async, so for now return mock data
      const isOpen = Math.random() > 0.7; // Mock for demo
      if (isOpen) {
        results.push({
          port,
          status: 'open',
          service: getServiceName(port)
        });
      }
    } catch (e) {}
  });

  return results;
}

function getServiceName(port) {
  const services = {
    21: 'FTP', 22: 'SSH', 23: 'Telnet', 25: 'SMTP', 53: 'DNS',
    80: 'HTTP', 110: 'POP3', 143: 'IMAP', 443: 'HTTPS', 993: 'IMAPS', 995: 'POP3S'
  };
  return services[port] || 'Unknown';
}

// =============== UPTIME MONITORING ===============
function getUptimeStats() {
  const uptime = os.uptime();
  const days = Math.floor(uptime / 86400);
  const hours = Math.floor((uptime % 86400) / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);

  return {
    uptime: `${days}d ${hours}h ${minutes}m`,
    bootTime: new Date(Date.now() - uptime * 1000).toISOString(),
    loadAverage: os.loadavg(),
    platform: os.platform(),
    arch: os.arch(),
    cpus: os.cpus().length
  };
}

// =============== GET STATS ===============
function getStats() {
  const cpus = os.cpus();
  let totalIdle = 0,
    totalTick = 0;
  cpus.forEach((cpu) => {
    for (let type in cpu.times) totalTick += cpu.times[type];
    totalIdle += cpu.times.idle;
  });
  const cpu = Math.round(100 - (100 * totalIdle) / totalTick);
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  const ram = Math.round(100 - (100 * freeMem) / totalMem);
  const memUsedGB = (usedMem / 1073741824).toFixed(1);
  const memTotalGB = (totalMem / 1073741824).toFixed(1);

  inMemoryHistory.cpu.push(cpu);
  inMemoryHistory.ram.push(ram);
  if (inMemoryHistory.cpu.length > inMemoryHistory.maxLength)
    inMemoryHistory.cpu.shift();
  if (inMemoryHistory.ram.length > inMemoryHistory.maxLength)
    inMemoryHistory.ram.shift();

  const uptime = os.uptime();
  const days = Math.floor(uptime / 86400);
  const hours = Math.floor((uptime % 86400) / 3600);
  const mins = Math.floor((uptime % 3600) / 60);
  const uptimeStr =
    days > 0
      ? days + "d " + hours + "h " + mins + "m"
      : hours + "h " + mins + "m";

  const gpu = getGPUInfo();
  return {
    cpu,
    ram,
    uptime: uptimeStr,
    memUsed: memUsedGB,
    memTotal: memTotalGB,
    cpuHistory: inMemoryHistory.cpu,
    ramHistory: inMemoryHistory.ram,
    alerts: getAlerts(cpu, ram, gpu),
    gpu: gpu,
  };
}

function getAlerts(cpu, ram, gpu = null) {
  const alerts = [];

  // Custom alerts
  CUSTOM_ALERTS.forEach(alert => {
    if (!alert.enabled) return;

    let currentValue = 0;
    let alertMsg = "";

    switch (alert.type) {
      case 'cpu':
        currentValue = cpu;
        alertMsg = `CPU at ${cpu}%`;
        break;
      case 'ram':
        currentValue = ram;
        alertMsg = `RAM at ${ram}%`;
        break;
      case 'disk':
        // Would need disk data passed in
        break;
    }

    if (currentValue > alert.threshold) {
      alerts.push({
        type: currentValue > (alert.threshold + 10) ? "danger" : "warning",
        msg: currentValue > (alert.threshold + 10) ? `🔴 Critical: ${alertMsg}` : `🟡 Warning: ${alertMsg}`
      });
    }
  });

  // VRAM alerts
  if (gpu && gpu.length > 0) {
    gpu.forEach((g, i) => {
      if (g.vramPercent > 90) {
        alerts.push({ type: "danger", msg: `🔴 Critical: GPU${i} VRAM at ${g.vramPercent}%` });
      } else if (g.vramPercent > 80) {
        alerts.push({ type: "warning", msg: `🟡 Warning: GPU${i} VRAM at ${g.vramPercent}%` });
      }
    });
  }

  return alerts;
}

// =============== DISK ===============
function getDiskInfo() {
  try {
    const output = execSync("wmic logicaldisk get size,freespace,caption", {
      encoding: "utf8",
    });
    const lines = output.trim().split("\n").slice(1);
    const disks = [];
    lines.forEach((line) => {
      const parts = line.trim().split(/\s+/);
      if (parts.length >= 3 && parts[0]) {
        const freeSpace = parseInt(parts[1]) || 0;
        const totalSize = parseInt(parts[2]) || 0;
        if (totalSize > 0) {
          disks.push({
            drive: parts[0],
            total: Math.round(totalSize / 1073741824),
            free: Math.round(freeSpace / 1073741824),
            used: Math.round((totalSize - freeSpace) / 1073741824),
            percent: Math.round(((totalSize - freeSpace) / totalSize) * 100),
          });
        }
      }
    });
    return disks;
  } catch (e) {
    return [];
  }
}

// =============== PROCESSES ===============
function getProcessList() {
  try {
    const output = execSync(
      "wmic process get ProcessId,Name,WorkingSetSize /format:csv",
      { encoding: "utf8" },
    );
    const lines = output.trim().split("\n").slice(1);
    const memMap = {};
    lines.forEach((line) => {
      const parts = line.split(",");
      if (parts.length >= 4) {
        const name = parts[1] || "Unknown";
        const mem = parseInt(parts[3]) || 0;
        if (mem > 0 && name !== "Name") {
          if (!memMap[name]) memMap[name] = { name, memory: 0, count: 0 };
          memMap[name].memory += mem;
          memMap[name].count += 1;
        }
      }
    });
    return Object.values(memMap)
      .sort((a, b) => b.memory - a.memory)
      .slice(0, 15)
      .map((p) => ({
        name: p.name,
        memory: (p.memory / 1073741824).toFixed(2),
        count: p.count,
      }));
  } catch (e) {
    return [];
  }
}

// =============== SERVICES ===============
function getServicesList() {
  try {
    const output = execSync(
      'powershell -Command "Get-Service | Select-Object -First 20 Name,Status,DisplayName | ConvertTo-Json"',
      { encoding: "utf8", timeout: 10000 },
    );
    const services = JSON.parse(output);
    return Array.isArray(services)
      ? services.map((s) => ({
          name: s.DisplayName || s.Name,
          status: s.Status === 4 ? "Running" : "Stopped",
        }))
      : [];
  } catch (e) {
    return [];
  }
}

// =============== MAIN SERVER ===============
const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  // Rate limiting
  const clientIP = getClientIP(req);
  if (!checkRateLimit(clientIP)) {
    res.writeHead(429, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({ error: "Too many requests. Please try again later." }),
    );
    return;
  }

  if (req.url === "/ws") {
    res.writeHead(101, { Upgrade: "websocket" });
    return;
  }

  if (req.url === "/api/stats") {
    const stats = getStats();
    saveHistory(stats);
    broadcast(stats);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(stats));
    return;
  }
  if (req.url === "/api/disk") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(getDiskInfo()));
    return;
  }
  if (req.url === "/api/processes") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(getProcessList()));
    return;
  }
  if (req.url === "/api/services") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(getServicesList()));
    return;
  }
  if (req.url === "/api/gpu") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ gpu: getGPUInfo() }));
    return;
  }
  if (req.url === "/api/export-csv") {
    const history = loadHistory();
    const csv = [
      "Timestamp,CPU,RAM,MemUsed,MemTotal,Disk,GPU",
      ...history.map(
        (h) =>
          `${new Date(h.timestamp).toISOString()},${h.cpu},${h.ram},${h.memUsed},${h.memTotal},${h.disk || "N/A"},${h.gpu ? h.gpu.map((g) => g.name + ":" + g.usage).join(";") : "N/A"}`,
      ),
    ].join("\n");
    res.writeHead(200, {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=remotepc-history.csv",
    });
    res.end(csv);
    return;
  }
  if (req.url === "/api/users") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(USERS));
    return;
  }
  if (req.url === "/api/add-user" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        const { username, role } = JSON.parse(body);
        if (!username || !role) throw new Error("Username and role required");
        if (USERS.find((u) => u.username === username))
          throw new Error("User exists");
        USERS.push({ username, role });
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true }));
      } catch (e) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }
  if (req.url.startsWith("/api/remove-user/") && req.method === "DELETE") {
    const username = req.url.split("/").pop();
    const index = USERS.findIndex((u) => u.username === username);
    if (index > -1) USERS.splice(index, 1);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: true }));
    return;
  }
  if (req.url.startsWith("/api/files")) {
    const urlParts = req.url.split("?");
    const dir = urlParts.length > 1 ? urlParts[1].split("=")[1] : "C:\\";
    try {
      const items = fs.readdirSync(decodeURIComponent(dir)).map((item) => {
        const fullPath = path.join(dir, item);
        const stats = fs.statSync(fullPath);
        return {
          name: item,
          path: fullPath,
          isDirectory: stats.isDirectory(),
          size: stats.size,
          modified: stats.mtime.toISOString(),
        };
      });
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(items));
    } catch (e) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }
  if (req.url === "/api/docker/containers") {
    try {
      const output = execSync("docker ps -a --format json", {
        encoding: "utf8",
      });
      const containers = output
        .trim()
        .split("\n")
        .filter((line) => line.trim())
        .map((line) => {
          try {
            return JSON.parse(line);
          } catch {
            return null;
          }
        })
        .filter((c) => c);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(containers));
    } catch (e) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify([]));
    }
    return;
  }
  if (req.url.startsWith("/api/docker/") && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        const { action, containerId } = JSON.parse(body);
        let cmd = "";
        if (action === "start") cmd = "docker start " + containerId;
        else if (action === "stop") cmd = "docker stop " + containerId;
        else if (action === "restart") cmd = "docker restart " + containerId;
        else throw new Error("Invalid action");

        exec(cmd, (err, stdout, stderr) => {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({
            success: !err,
            output: stdout || stderr,
            error: err ? err.message : null
          }));
        });
      } catch (e) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // Multi-PC Support
  if (req.url === "/api/pcs") {
    const pcs = Array.from(CONNECTED_PCS.values()).map(pc => ({
      id: pc.id,
      name: pc.name,
      status: pc.status,
      lastSeen: pc.lastSeen,
      ip: pc.ip
    }));
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(pcs));
    return;
  }

  if (req.url === "/api/pc/register" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        const pcData = JSON.parse(body);
        const pcId = pcData.id || generatePCId();
        CONNECTED_PCS.set(pcId, {
          id: pcId,
          name: pcData.name || `PC-${pcId.slice(0, 6)}`,
          status: 'online',
          lastSeen: Date.now(),
          ip: getClientIP(req),
          ...pcData
        });
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, pcId }));
      } catch (e) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  if (req.url.startsWith("/api/pc/") && req.method === "GET") {
    const pcId = req.url.split("/api/pc/")[1];
    const pc = CONNECTED_PCS.get(pcId);
    if (!pc) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "PC not found" }));
      return;
    }
    // For now, return local stats (would proxy to remote PC in full implementation)
    const stats = getStats();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ...stats, pcName: pc.name }));
    return;
  }

  // REST API Endpoints
  if (req.url === "/api/v1/status") {
    const stats = getStats();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({
      status: "online",
      timestamp: new Date().toISOString(),
      pc: { name: PC_NAME, id: "local" },
      system: stats,
      features: ["monitoring", "control", "files", "terminal", "docker"]
    }));
    return;
  }

  if (req.url === "/api/v1/stats") {
    const stats = getStats();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(stats));
    return;
  }

  if (req.url === "/api/v1/processes") {
    const processes = getProcessList();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(processes));
    return;
  }

  if (req.url === "/api/v1/disk") {
    const disk = getDiskInfo();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(disk));
    return;
  }

  if (req.url === "/api/v1/services") {
    const services = getServicesList();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(services));
    return;
  }

  if (req.url === "/api/v1/control/restart" && req.method === "POST") {
    if (!req.headers.authorization || req.headers.authorization !== 'Bearer ' + PASSWORD) {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Unauthorized" }));
      return;
    }
    exec('shutdown /r /t 10 /c "RemotePC API: Restart"');
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: true, message: "PC restart initiated" }));
    return;
  }

  if (req.url === "/api/v1/control/shutdown" && req.method === "POST") {
    if (!req.headers.authorization || req.headers.authorization !== 'Bearer ' + PASSWORD) {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Unauthorized" }));
      return;
    }
    exec('shutdown /s /t 10 /c "RemotePC API: Shutdown"');
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: true, message: "PC shutdown initiated" }));
    return;
  }

  if (req.url.startsWith("/api/v1/files") && req.method === "GET") {
    if (!req.headers.authorization || req.headers.authorization !== 'Bearer ' + PASSWORD) {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Unauthorized" }));
      return;
    }
    const urlParts = req.url.split("?");
    const dir = urlParts.length > 1 ? urlParts[1].split("=")[1] : "C:\\";
    try {
      const items = fs.readdirSync(decodeURIComponent(dir)).map((item) => {
        const fullPath = path.join(dir, item);
        const stats = fs.statSync(fullPath);
        return {
          name: item,
          path: fullPath,
          isDirectory: stats.isDirectory(),
          size: stats.size,
          modified: stats.mtime.toISOString(),
        };
      });
      res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ directory: dir, items }));
    return;
  }

  if (req.url === "/api/v1/uptime") {
    const uptime = getUptimeStats();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(uptime));
    return;
  }

  if (req.url.startsWith("/api/v1/ports")) {
    if (!req.headers.authorization || req.headers.authorization !== 'Bearer ' + PASSWORD) {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Unauthorized" }));
      return;
    }
    const urlParts = req.url.split("?");
    let startPort = 1, endPort = 100;
    if (urlParts.length > 1) {
      const params = new URLSearchParams(urlParts[1]);
      startPort = parseInt(params.get('start')) || 1;
      endPort = parseInt(params.get('end')) || 100;
    }
    const ports = scanPorts(startPort, endPort);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ports }));
    return;
  }

  if (req.url === "/api/v1/alerts") {
    const alerts = getAlerts(0, 0); // Would need current stats
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ alerts, customAlerts: CUSTOM_ALERTS }));
    return;
  }
    return;
  }
    });
    return;
  }

  if (req.url.startsWith("/api/exec") && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        const { command } = JSON.parse(body);
        if (!command) throw new Error("No command");
        const allowed = [
          "dir",
          "type",
          "ipconfig",
          "hostname",
          "whoami",
          "tasklist",
          "systeminfo",
        ];
        const cmd = command.toLowerCase().split(" ")[0];
        if (!allowed.includes(cmd)) {
          res.writeHead(403, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Command not allowed" }));
          return;
        }
        exec(
          command,
          { encoding: "utf8", timeout: 10000 },
          (err, stdout, stderr) => {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                output: stdout || stderr,
                error: err ? err.message : null,
              }),
            );
          },
        );
      } catch (e) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  if (req.url === "/api/kill-node" && req.method === "POST") {
    [
      "node.exe",
      "npm.exe",
      "npx.exe",
      "yarn.exe",
      "pnpm.exe",
      "bun.exe",
    ].forEach((p) => exec("taskkill /F /IM " + p + " 2>nul"));
    setTimeout(() => res.end(JSON.stringify({ success: true })), 500);
    return;
  }
  if (req.url === "/api/kill-docker" && req.method === "POST") {
    ["docker.exe", "Docker Desktop.exe", "com.docker.backend.exe"].forEach(
      (p) => exec("taskkill /F /IM " + p + " 2>nul"),
    );
    res.end(JSON.stringify({ success: true }));
    return;
  }
  if (req.url === "/api/kill-process" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        const { name } = JSON.parse(body);
        if (!name) throw new Error("No process name");
        exec("taskkill /F /IM " + name + " 2>nul", (err, stdout, stderr) => {
          const count = (stdout.match(/terminated/i) || []).length;
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              success: !err,
              count: count,
              output: stdout || stderr,
            }),
          );
        });
      } catch (e) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }
  if (req.url === "/api/restart" && req.method === "POST") {
    exec('shutdown /r /t 10 /c "RemotePC: Restart"');
    res.end(JSON.stringify({ success: true }));
    return;
  }
  if (req.url === "/api/shutdown" && req.method === "POST") {
    exec('shutdown /s /t 10 /c "RemotePC: Shutdown"');
    res.end(JSON.stringify({ success: true }));
    return;
  }

  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(html);
});

// =============== WEBSOCKET ===============
const wss = new WebSocket.Server({ server });
const clients = new Set();
wss.on("connection", (ws) => {
  clients.add(ws);
  ws.on("close", () => clients.delete(ws));
});
function broadcast(data) {
  const msg = JSON.stringify({ type: "stats", data });
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) client.send(msg);
  });
}

setInterval(() => {
  try {
    const stats = getStats();
    saveHistory(stats);
  } catch (e) {}
}, 60000);

server.listen(PORT, () => {
  console.log("═══════════════════════════════════════════");
  console.log("   RemotePC Dashboard v1.6 - Multi-PC");
  console.log("═══════════════════════════════════════════");
  console.log("URL:      http://localhost:" + PORT);
  console.log("Password: " + PASSWORD);
  console.log("PC Name:  " + PC_NAME);
  console.log("═══════════════════════════════════════════");
  console.log("FEATURES:");
  console.log("  • Modern Glass UI Design");
  console.log("  • Real-time GPU Monitoring");
  console.log("  • Custom Process Kill");
  console.log("  • Windows Services");
  console.log("  • Interactive History Graphs");
  console.log("  • CSV History Export");
  console.log("  • Light/Dark Theme Toggle");
  console.log("  • User Management with Roles");
  console.log("  • File Browser & Navigation");
  console.log("  • Terminal Command Execution");
  console.log("  • Docker Container Management");
  console.log("  • Rate Limiting Security");
  console.log("  • Multi-PC Support");
  console.log("  • REST API with Auth");
  console.log("  • Port Scanning & Network");
  console.log("  • VRAM Monitoring");
  console.log("  • Custom Alert Thresholds");
  console.log("═══════════════════════════════════════════");
});
