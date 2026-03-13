const http = require('http');
const { exec, execSync } = require('child_process');
const os = require('os');
const fs = require('fs');

const PORT = 3001;
const PASSWORD = "karma123";
const PC_NAME = "DESKTOP-KARMA";

const history = {
  cpu: [],
  ram: [],
  maxLength: 30
};

function getStats() {
  const cpus = os.cpus();
  let totalIdle = 0, totalTick = 0;
  
  cpus.forEach(cpu => {
    for (let type in cpu.times) {
      totalTick += cpu.times[type];
    }
    totalIdle += cpu.times.idle;
  });
  
  const cpu = Math.round(100 - (100 * totalIdle / totalTick));
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  const ram = Math.round(100 - (100 * freeMem / totalMem));
  const memUsedGB = (usedMem / 1073741824).toFixed(1);
  const memTotalGB = (totalMem / 1073741824).toFixed(1);
  
  history.cpu.push(cpu);
  history.ram.push(ram);
  if (history.cpu.length > history.maxLength) history.cpu.shift();
  if (history.ram.length > history.maxLength) history.ram.shift();
  
  const uptime = os.uptime();
  const days = Math.floor(uptime / 86400);
  const hours = Math.floor((uptime % 86400) / 3600);
  const mins = Math.floor((uptime % 3600) / 60);
  const uptimeStr = days > 0 ? days + 'd ' + hours + 'h' : hours + 'h ' + mins + 'm';
  
  return { 
    cpu, 
    ram, 
    uptime: uptimeStr,
    memUsed: memUsedGB,
    memTotal: memTotalGB,
    cpuHistory: history.cpu,
    ramHistory: history.ram,
    alerts: getAlerts(cpu, ram)
  };
}

function getAlerts(cpu, ram) {
  const alerts = [];
  if (cpu > 90) alerts.push({ type: 'danger', msg: `🔴 CPU critical: ${cpu}%` });
  else if (cpu > 80) alerts.push({ type: 'warning', msg: `🟡 CPU high: ${cpu}%` });
  
  if (ram > 90) alerts.push({ type: 'danger', msg: `🔴 RAM critical: ${ram}%` });
  else if (ram > 80) alerts.push({ type: 'warning', msg: `🟡 RAM high: ${ram}%` });
  
  return alerts;
}

function getDiskInfo() {
  try {
    const output = execSync('wmic logicaldisk get size,freespace,caption', { encoding: 'utf8' });
    const lines = output.trim().split('\n').slice(1);
    const disks = [];
    
    lines.forEach(line => {
      const parts = line.trim().split(/\s+/);
      if (parts.length >= 3 && parts[0]) {
        const caption = parts[0];
        const freeSpace = parseInt(parts[1]) || 0;
        const totalSize = parseInt(parts[2]) || 0;
        const usedSpace = totalSize - freeSpace;
        const percentUsed = totalSize > 0 ? Math.round((usedSpace / totalSize) * 100) : 0;
        
        if (totalSize > 0) {
          disks.push({
            drive: caption,
            total: Math.round(totalSize / 1073741824),
            free: Math.round(freeSpace / 1073741824),
            used: Math.round(usedSpace / 1073741824),
            percent: percentUsed
          });
        }
      }
    });
    return disks;
  } catch (e) {
    return [];
  }
}

function getProcessList() {
  try {
    const output = execSync('wmic process get ProcessId,Name,WorkingSetSize /format:csv', { encoding: 'utf8' });
    const lines = output.trim().split('\n').slice(1);
    const processes = [];
    
    const memMap = {};
    lines.forEach(line => {
      const parts = line.split(',');
      if (parts.length >= 4) {
        const name = parts[1] || 'Unknown';
        const pid = parseInt(parts[2]) || 0;
        const mem = parseInt(parts[3]) || 0;
        
        if (mem > 0 && name !== 'Name') {
          if (!memMap[name]) {
            memMap[name] = { name, memory: 0, count: 0 };
          }
          memMap[name].memory += mem;
          memMap[name].count += 1;
        }
      }
    });
    
    return Object.values(memMap)
      .sort((a, b) => b.memory - a.memory)
      .slice(0, 10)
      .map(p => ({
        name: p.name,
        memory: (p.memory / 1073741824).toFixed(2),
        count: p.count
      }));
  } catch (e) {
    return [];
  }
}

function getNetworkStats() {
  try {
    const output = execSync('powershell -Command "Get-NetAdapterStatistics | Select-Object -First 1 ReceivedBytes,SentBytes"', { encoding: 'utf8' });
    const lines = output.trim().split('\n');
    let received = 0, sent = 0;
    
    lines.forEach(line => {
      const match = line.match(/(\d+)/g);
      if (match && match.length >= 2) {
        received = parseInt(match[0]) || 0;
        sent = parseInt(match[1]) || 0;
      }
    });
    
    return {
      received: (received / 1073741824).toFixed(2),
      sent: (sent / 1073741824).toFixed(2)
    };
  } catch (e) {
    return { received: '0', sent: '0' };
  }
}

function getTemperature() {
  try {
    const output = execSync('powershell -Command "Get-WmiObject MSAcpi_ThermalZoneTemperature -Namespace root/wmi -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty CurrentTemperature"', { encoding: 'utf8' });
    const temp = parseInt(output.trim());
    if (temp) {
      const celsius = (temp - 2732) / 10;
      return Math.round(celsius);
    }
  } catch (e) {}
  
  return null;
}

const html = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>RemotePC - ${PC_NAME}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg: #0f0f0f;
      --bg2: #1a1a1a;
      --bg3: #252525;
      --text: #fff;
      --text2: #888;
      --green: #00ff88;
      --red: #ff4757;
      --orange: #ff6b35;
      --blue: #3742fa;
      --purple: #a55eea;
      --yellow: #ffd43b;
    }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; padding: 15px; }
    .container { max-width: 700px; margin: 0 auto; }
    h1 { text-align: center; margin-bottom: 5px; font-size: 22px; }
    .subtitle { text-align: center; color: var(--text2); margin-bottom: 15px; font-size: 11px; }
    
    .alerts { margin-bottom: 15px; }
    .alert { padding: 10px 15px; border-radius: 8px; margin-bottom: 8px; font-size: 13px; font-weight: 600; }
    .alert-danger { background: #220000; border: 1px solid var(--red); color: var(--red); }
    .alert-warning { background: #221a00; border: 1px solid var(--yellow); color: var(--yellow); }
    .alert-success { background: #002200; border: 1px solid var(--green); color: var(--green); }
    
    .status { text-align: center; padding: 12px; background: var(--bg2); border-radius: 12px; margin-bottom: 15px; border: 2px solid var(--green); }
    .status-dot { display: inline-block; width: 10px; height: 10px; background: var(--green); border-radius: 50%; margin-right: 8px; }
    .pc-name { font-size: 18px; font-weight: bold; }
    
    .stats { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px; }
    .stat { background: var(--bg2); padding: 15px; border-radius: 12px; text-align: center; }
    .stat-value { font-size: 26px; font-weight: bold; }
    .stat-label { font-size: 11px; color: var(--text2); margin-top: 5px; }
    .cpu { color: var(--red); }
    .ram { color: #4ecdc4; }
    .procs { color: var(--purple); }
    .temp { color: var(--orange); }
    
    .section { background: var(--bg2); border-radius: 12px; padding: 15px; margin-bottom: 12px; }
    .section-title { font-size: 11px; color: var(--text2); margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px; }
    
    .graph { height: 60px; display: flex; align-items: flex-end; gap: 2px; margin: 10px 0; }
    .graph-bar { flex: 1; background: var(--blue); border-radius: 2px 2px 0 0; min-height: 2px; transition: height 0.3s; }
    .graph-bar.cpu { background: var(--red); }
    .graph-bar.ram { background: #4ecdc4; }
    
    .disk-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 8px; }
    .disk { background: var(--bg3); padding: 10px; border-radius: 8px; text-align: center; }
    .disk-name { font-weight: bold; font-size: 14px; }
    .disk-used { font-size: 12px; color: var(--orange); }
    .disk-free { font-size: 10px; color: var(--text2); }
    .disk-bar { height: 4px; background: var(--bg); border-radius: 2px; margin-top: 5px; overflow: hidden; }
    .disk-bar-fill { height: 100%; background: var(--orange); }
    .disk-bar-fill.high { background: var(--red); }
    
    .process-list { font-size: 11px; }
    .process { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid var(--bg3); }
    .process:last-child { border-bottom: none; }
    .process-name { color: var(--text); }
    .process-mem { color: var(--orange); font-weight: bold; }
    
    .network-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .network-item { background: var(--bg3); padding: 10px; border-radius: 8px; text-align: center; }
    .network-label { font-size: 10px; color: var(--text2); }
    .network-value { font-size: 16px; font-weight: bold; }
    .network-up { color: var(--green); }
    .network-down { color: var(--blue); }
    
    .btn { display: block; width: 100%; padding: 12px; background: var(--bg3); color: var(--text); border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; margin-bottom: 8px; transition: all 0.2s; }
    .btn:hover { transform: translateY(-1px); }
    .btn:active { transform: scale(0.98); }
    .btn-kill { background: var(--red); color: #fff; }
    .btn-kill-docker { background: var(--orange); color: #fff; }
    .btn-restart { background: var(--blue); color: #fff; }
    .btn-shutdown { background: #333; color: #fff; border: 1px solid #555; }
    
    .log { font-family: monospace; font-size: 10px; max-height: 80px; overflow-y: auto; background: var(--bg3); padding: 8px; border-radius: 6px; }
    .log-entry { color: var(--green); margin-bottom: 2px; }
    .log-time { color: var(--text2); }
    
    .footer { text-align: center; color: var(--text2); font-size: 9px; margin-top: 15px; }
    
    .login-screen { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: var(--bg); display: flex; align-items: center; justify-content: center; z-index: 100; }
    .login-screen.hidden { display: none; }
    .login-box { background: var(--bg2); padding: 30px; border-radius: 16px; text-align: center; max-width: 280px; width: 90%; }
    .login-input { width: 100%; padding: 12px; font-size: 14px; border: none; border-radius: 8px; background: var(--bg); color: var(--text); margin-bottom: 12px; text-align: center; }
    .login-input:focus { outline: 2px solid var(--green); }
    .login-btn { width: 100%; padding: 12px; background: var(--green); color: #000; border: none; border-radius: 8px; font-size: 14px; font-weight: bold; cursor: pointer; }
    .login-error { color: var(--red); margin-bottom: 8px; display: none; font-size: 12px; }
    
    @media (max-width: 500px) {
      .stats { grid-template-columns: 1fr; }
      .container { padding: 10px; }
    }
  </style>
</head>
<body>
  <div class="login-screen" id="loginScreen">
    <div class="login-box">
      <h1 style="margin-bottom: 15px;">🔐 RemotePC</h1>
      <input type="password" class="login-input" id="password" placeholder="Enter password">
      <div class="login-error" id="error">Incorrect password</div>
      <button class="login-btn" onclick="login()">Login</button>
    </div>
  </div>
  
  <div class="container" id="dashboard">
    <h1>🚀 ${PC_NAME}</h1>
    <p class="subtitle">Remote Dashboard • Updated every 2s</p>
    
    <div class="alerts" id="alerts"></div>
    
    <div class="status">
      <span class="status-dot"></span>
      <span class="pc-name">Online</span>
      <span style="color: var(--text2); margin-left: 8px;">•</span>
      <span style="color: var(--text2); margin-left: 8px;" id="uptime">Loading...</span>
    </div>
    
    <div class="stats">
      <div class="stat">
        <div class="stat-value cpu" id="cpu">--%</div>
        <div class="stat-label">CPU</div>
      </div>
      <div class="stat">
        <div class="stat-value ram" id="ram">--%</div>
        <div class="stat-label">RAM</div>
      </div>
    </div>
    
    <div class="section">
      <div class="section-title">📈 CPU & RAM History</div>
      <div style="display: flex; justify-content: space-between; font-size: 10px; color: var(--text2); margin-bottom: 5px;">
        <span><span style="color: var(--red);">●</span> CPU</span>
        <span><span style="color: #4ecdc4;">●</span> RAM</span>
      </div>
      <div class="graph" id="cpuGraph"></div>
    </div>
    
    <div class="section">
      <div class="section-title">💾 Memory</div>
      <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 5px;">
        <span id="memUsed">-- GB</span>
        <span style="color: var(--text2);" id="memTotal">/ -- GB</span>
      </div>
      <div style="height: 8px; background: var(--bg3); border-radius: 4px; overflow: hidden;">
        <div id="memBar" style="height: 100%; background: linear-gradient(90deg, var(--green), var(--orange)); width: 0%; transition: width 0.5s;"></div>
      </div>
    </div>
    
    <div class="section">
      <div class="section-title">💿 Disk</div>
      <div class="disk-grid" id="diskGrid">
        <div class="disk">Loading...</div>
      </div>
    </div>
    
    <div class="section">
      <div class="section-title">🌡️ Temperature</div>
      <div style="text-align: center; padding: 10px;">
        <span class="stat-value temp" id="temp">--°C</span>
        <div class="stat-label" id="tempStatus">Normal</div>
      </div>
    </div>
    
    <div class="section">
      <div class="section-title">📊 Network</div>
      <div class="network-grid">
        <div class="network-item">
          <div class="network-value network-down" id="netDown">-- GB</div>
          <div class="network-label">Downloaded</div>
        </div>
        <div class="network-item">
          <div class="network-value network-up" id="netUp">-- GB</div>
          <div class="network-label">Uploaded</div>
        </div>
      </div>
    </div>
    
    <div class="section">
      <div class="section-title">🔝 Top Processes</div>
      <div class="process-list" id="processList">
        <div class="process">Loading...</div>
      </div>
    </div>
    
    <div class="section">
      <div class="section-title">⚡ Quick Actions</div>
      <button class="btn btn-kill" onclick="killNode()">☠️ Kill All Node</button>
      <button class="btn btn-kill-docker" onclick="killDocker()">🐳 Kill Docker</button>
      <button class="btn btn-restart" onclick="restart()">🔄 Restart PC</button>
      <button class="btn btn-shutdown" onclick="shutdown()">🔴 Shutdown PC</button>
    </div>
    
    <div class="section">
      <div class="section-title">📝 Activity Log</div>
      <div class="log" id="log"></div>
    </div>
    
    <div class="footer">
      <p>Built after 14 months of learning to code</p>
      <p>RemotePC v1.1 • Enhanced</p>
    </div>
  </div>

  <script>
    let loggedIn = false;
    const PASS = '${PASSWORD}';
    
    function login() {
      const pwd = document.getElementById('password').value;
      if (pwd === PASS) {
        loggedIn = true;
        document.getElementById('loginScreen').classList.add('hidden');
        log('Logged in successfully');
        fetchStats();
      } else {
        document.getElementById('error').style.display = 'block';
      }
    }
    
    function log(msg) {
      const logEl = document.getElementById('log');
      const entry = document.createElement('div');
      entry.className = 'log-entry';
      entry.innerHTML = '<span class="log-time">[' + new Date().toLocaleTimeString() + ']</span> ' + msg;
      logEl.insertBefore(entry, logEl.firstChild);
      if (logEl.children.length > 20) logEl.removeChild(logEl.lastChild);
    }
    
    async function fetchStats() {
      if (!loggedIn) return;
      try {
        const res = await fetch('/api/stats');
        const data = await res.json();
        
        document.getElementById('cpu').textContent = data.cpu + '%';
        document.getElementById('ram').textContent = data.ram + '%';
        document.getElementById('uptime').textContent = data.uptime;
        document.getElementById('memUsed').textContent = data.memUsed + ' GB';
        document.getElementById('memTotal').textContent = '/ ' + data.memTotal + ' GB';
        document.getElementById('memBar').style.width = data.ram + '%';
        
        const cpuGraph = document.getElementById('cpuGraph');
        cpuGraph.innerHTML = '';
        data.cpuHistory.forEach((val, i) => {
          const bar = document.createElement('div');
          bar.className = 'graph-bar cpu';
          bar.style.height = Math.max(2, val) + '%';
          bar.title = val + '%';
          cpuGraph.appendChild(bar);
        });
        
        const alertsEl = document.getElementById('alerts');
        alertsEl.innerHTML = '';
        if (data.alerts && data.alerts.length > 0) {
          data.alerts.forEach(alert => {
            const div = document.createElement('div');
            div.className = 'alert alert-' + alert.type;
            div.textContent = alert.msg;
            alertsEl.appendChild(div);
          });
        } else {
          const div = document.createElement('div');
          div.className = 'alert alert-success';
          div.textContent = '✅ All systems normal';
          alertsEl.appendChild(div);
        }
        
      } catch(e) { console.error(e); }
    }
    
    async function fetchDisk() {
      if (!loggedIn) return;
      try {
        const res = await fetch('/api/disk');
        const disks = await res.json();
        const grid = document.getElementById('diskGrid');
        grid.innerHTML = '';
        disks.forEach(disk => {
          const div = document.createElement('div');
          div.className = 'disk';
          div.innerHTML = '<div class="disk-name">' + disk.drive + '</div><div class="disk-used">' + disk.used + 'GB / ' + disk.total + 'GB</div><div class="disk-free">' + disk.free + 'GB free</div><div class="disk-bar"><div class="disk-bar-fill' + (disk.percent > 90 ? ' high' : '') + '" style="width:' + disk.percent + '%"></div></div>';
          grid.appendChild(div);
        });
      } catch(e) {}
    }
    
    async function fetchProcesses() {
      if (!loggedIn) return;
      try {
        const res = await fetch('/api/processes');
        const procs = await res.json();
        const list = document.getElementById('processList');
        list.innerHTML = '';
        procs.forEach(p => {
          const div = document.createElement('div');
          div.className = 'process';
          div.innerHTML = '<span class="process-name">' + p.name + '</span><span class="process-mem">' + p.memory + ' GB</span>';
          list.appendChild(div);
        });
      } catch(e) {}
    }
    
    async function fetchNetwork() {
      if (!loggedIn) return;
      try {
        const res = await fetch('/api/network');
        const data = await res.json();
        document.getElementById('netDown').textContent = data.received + ' GB';
        document.getElementById('netUp').textContent = data.sent + ' GB';
      } catch(e) {}
    }
    
    async function fetchTemp() {
      if (!loggedIn) return;
      try {
        const res = await fetch('/api/temp');
        const data = await res.json();
        const temp = data.temp;
        const tempEl = document.getElementById('temp');
        const statusEl = document.getElementById('tempStatus');
        if (temp !== null) {
          tempEl.textContent = temp + '°C';
          if (temp > 80) {
            tempEl.style.color = 'var(--red)';
            statusEl.textContent = '🔥 Hot!';
            statusEl.style.color = 'var(--red)';
          } else if (temp > 60) {
            tempEl.style.color = 'var(--orange)';
            statusEl.textContent = 'Warm';
            statusEl.style.color = 'var(--orange)';
          } else {
            tempEl.style.color = 'var(--green)';
            statusEl.textContent = 'Normal';
            statusEl.style.color = 'var(--green)';
          }
        } else {
          tempEl.textContent = 'N/A';
          statusEl.textContent = 'Sensor unavailable';
        }
      } catch(e) {}
    }
    
    async function killNode() {
      if (!loggedIn) return alert('Please login first');
      if(!confirm('☠️ Kill all Node processes?')) return;
      log('☠️ Killing Node processes...');
      try {
        await fetch('/api/kill-node', { method: 'POST' });
        setTimeout(() => log('✓ Node processes killed'), 500);
      } catch(e) { log('Error: ' + e.message); }
    }
    
    async function killDocker() {
      if (!loggedIn) return alert('Please login first');
      if(!confirm('🐳 Kill Docker?')) return;
      log('🐳 Killing Docker...');
      try {
        await fetch('/api/kill-docker', { method: 'POST' });
        setTimeout(() => log('✓ Docker killed'), 500);
      } catch(e) { log('Error: ' + e.message); }
    }
    
    async function restart() {
      if (!loggedIn) return alert('Please login first');
      if(!confirm('🔄 Restart PC in 10 seconds?')) return;
      log('🔄 Restarting PC...');
      try { await fetch('/api/restart', { method: 'POST' }); }
      catch(e) { log('Error: ' + e.message); }
    }
    
    async function shutdown() {
      if (!loggedIn) return alert('Please login first');
      if(!confirm('🔴 SHUTDOWN PC? This will turn off the PC!')) return;
      log('🔴 Shutting down PC...');
      try { await fetch('/api/shutdown', { method: 'POST' }); }
      catch(e) { log('Error: ' + e.message); }
    }
    
    setInterval(fetchStats, 2000);
    setInterval(fetchDisk, 10000);
    setInterval(fetchProcesses, 10000);
    setInterval(fetchNetwork, 5000);
    setInterval(fetchTemp, 5000);
  </script>
</body>
</html>
`;

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  if (req.url === '/api/stats') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(getStats()));
    return;
  }
  
  if (req.url === '/api/disk') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(getDiskInfo()));
    return;
  }
  
  if (req.url === '/api/processes') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(getProcessList()));
    return;
  }
  
  if (req.url === '/api/network') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(getNetworkStats()));
    return;
  }
  
  if (req.url === '/api/temp') {
    const temp = getTemperature();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ temp }));
    return;
  }
  
  if (req.url === '/api/kill-node' && req.method === 'POST') {
    const processes = ['node.exe', 'npm.exe', 'npx.exe', 'yarn.exe', 'pnpm.exe', 'bun.exe'];
    processes.forEach(p => exec('taskkill /F /IM ' + p + ' 2>nul'));
    setTimeout(() => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true }));
    }, 500);
    return;
  }
  
  if (req.url === '/api/kill-docker' && req.method === 'POST') {
    exec('taskkill /F /IM docker.exe 2>nul');
    exec('taskkill /F /IM "Docker Desktop.exe" 2>nul');
    exec('taskkill /F /IM com.docker.backend.exe 2>nul');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true }));
    return;
  }
  
  if (req.url === '/api/restart' && req.method === 'POST') {
    exec('shutdown /r /t 10 /c "RemotePC: Restart"');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true }));
    return;
  }
  
  if (req.url === '/api/shutdown' && req.method === 'POST') {
    exec('shutdown /s /t 10 /c "RemotePC: Shutdown"');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true }));
    return;
  }
  
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(html);
});

server.listen(PORT, () => {
  console.log('═══════════════════════════════════════════');
  console.log('   RemotePC Dashboard v1.1 - Enhanced');
  console.log('═══════════════════════════════════════════');
  console.log('URL:      http://localhost:' + PORT);
  console.log('Password: ' + PASSWORD);
  console.log('PC Name:  ' + PC_NAME);
  console.log('═══════════════════════════════════════════');
  console.log('Features:');
  console.log('  • CPU & RAM monitoring with history');
  console.log('  • Disk usage per drive');
  console.log('  • Top processes by memory');
  console.log('  • Network traffic stats');
  console.log('  • Temperature (if available)');
  console.log('  • Resource alerts');
  console.log('═══════════════════════════════════════════');
});
