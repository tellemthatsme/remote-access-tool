const http = require('http');
const { exec } = require('child_process');
const os = require('os');
const fs = require('fs');

const PORT = 3001;
const PASSWORD = "karma123";
const PC_NAME = "DESKTOP-KARMA";

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
      --text: #fff;
      --text2: #888;
      --green: #00ff88;
      --red: #ff4757;
      --orange: #ff6b35;
      --blue: #3742fa;
      --purple: #a55eea;
    }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; }
    h1 { text-align: center; margin-bottom: 5px; font-size: 24px; }
    .subtitle { text-align: center; color: var(--text2); margin-bottom: 20px; font-size: 12px; }
    .status { text-align: center; padding: 15px; background: var(--bg2); border-radius: 12px; margin-bottom: 20px; border: 2px solid var(--green); }
    .status-dot { display: inline-block; width: 10px; height: 10px; background: var(--green); border-radius: 50%; margin-right: 8px; }
    .pc-name { font-size: 20px; font-weight: bold; }
    .stats { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; }
    .stat { background: var(--bg2); padding: 15px; border-radius: 12px; text-align: center; }
    .stat-value { font-size: 28px; font-weight: bold; }
    .stat-label { font-size: 12px; color: var(--text2); margin-top: 5px; }
    .cpu { color: var(--red); }
    .ram { color: #4ecdc4; }
    .procs { color: var(--purple); }
    .btn { display: block; width: 100%; padding: 14px; background: var(--bg2); color: var(--text); border: none; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; margin-bottom: 10px; transition: all 0.2s; }
    .btn:hover { transform: translateY(-2px); }
    .btn:active { transform: scale(0.98); }
    .btn-kill { background: var(--red); color: #fff; }
    .btn-kill-docker { background: var(--orange); color: #fff; }
    .btn-restart { background: var(--blue); color: #fff; }
    .btn-shutdown { background: #333; color: #fff; border: 1px solid #555; }
    .btn-danger { background: #220000; color: var(--red); border: 1px solid var(--red); }
    .section { background: var(--bg2); border-radius: 12px; padding: 15px; margin-bottom: 15px; }
    .section-title { font-size: 12px; color: var(--text2); margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px; }
    .log { font-family: monospace; font-size: 11px; max-height: 100px; overflow-y: auto; }
    .log-entry { color: var(--green); margin-bottom: 3px; }
    .log-time { color: var(--text2); }
    .quick-stats { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }
    .quick-stat { background: var(--bg); padding: 10px; border-radius: 8px; text-align: center; }
    .quick-stat-value { font-size: 16px; font-weight: bold; }
    .quick-stat-label { font-size: 10px; color: var(--text2); }
    .login-screen { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: var(--bg); display: flex; align-items: center; justify-content: center; z-index: 100; }
    .login-screen.hidden { display: none; }
    .login-box { background: var(--bg2); padding: 40px; border-radius: 16px; text-align: center; max-width: 300px; width: 90%; }
    .login-input { width: 100%; padding: 15px; font-size: 16px; border: none; border-radius: 8px; background: var(--bg); color: var(--text); margin-bottom: 15px; text-align: center; }
    .login-input:focus { outline: 2px solid var(--green); }
    .login-btn { width: 100%; padding: 15px; background: var(--green); color: #000; border: none; border-radius: 8px; font-size: 16px; font-weight: bold; cursor: pointer; }
    .login-error { color: var(--red); margin-bottom: 10px; display: none; font-size: 14px; }
    .footer { text-align: center; color: var(--text2); font-size: 10px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="login-screen" id="loginScreen">
    <div class="login-box">
      <h1 style="margin-bottom: 20px;">🔐 RemotePC</h1>
      <input type="password" class="login-input" id="password" placeholder="Enter password">
      <div class="login-error" id="error">Incorrect password</div>
      <button class="login-btn" onclick="login()">Login</button>
    </div>
  </div>
  
  <div class="container" id="dashboard">
    <h1>🚀 ${PC_NAME}</h1>
    <p class="subtitle">Remote Dashboard • Updated every 2s</p>
    
    <div class="status">
      <span class="status-dot"></span>
      <span class="pc-name">Online</span>
      <span style="color: var(--text2); margin-left: 10px;">•</span>
      <span style="color: var(--text2); margin-left: 10px;" id="uptime">Loading...</span>
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
      <div class="section-title">Quick Stats</div>
      <div class="quick-stats">
        <div class="quick-stat">
          <div class="quick-stat-value" id="processes">--</div>
          <div class="quick-stat-label">Processes</div>
        </div>
        <div class="quick-stat">
          <div class="quick-stat-value" id="threads">--</div>
          <div class="quick-stat-label">Threads</div>
        </div>
        <div class="quick-stat">
          <div class="quick-stat-value" id="memUsed">--</div>
          <div class="quick-stat-label">Mem Used</div>
        </div>
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
      <p>RemotePC v1.0</p>
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
    }
    
    async function fetchStats() {
      if (!loggedIn) return;
      try {
        const res = await fetch('/api/stats');
        const data = await res.json();
        document.getElementById('cpu').textContent = data.cpu + '%';
        document.getElementById('ram').textContent = data.ram + '%';
        document.getElementById('uptime').textContent = data.uptime;
        document.getElementById('processes').textContent = data.processes;
        document.getElementById('threads').textContent = data.threads;
        document.getElementById('memUsed').textContent = data.memUsed;
      } catch(e) { console.error(e); }
    }
    
    async function killNode() {
      if (!loggedIn) return alert('Please login first');
      log('☠️ Killing all Node processes...');
      try {
        await fetch('/api/kill-node', { method: 'POST' });
        setTimeout(() => log('✓ Node processes killed'), 500);
      } catch(e) { log('Error: ' + e.message); }
    }
    
    async function killDocker() {
      if (!loggedIn) return alert('Please login first');
      log('🐳 Killing Docker...');
      try {
        await fetch('/api/kill-docker', { method: 'POST' });
        setTimeout(() => log('✓ Docker killed'), 500);
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
      if(!confirm('🔴 SHUTDOWN PC in 10 seconds? This will turn off the PC!')) return;
      log('🔴 Shutting down PC...');
      try { await fetch('/api/shutdown', { method: 'POST' }); }
      catch(e) { log('Error: ' + e.message); }
    }
    
    setInterval(fetchStats, 2000);
  </script>
</body>
</html>
`;

function getStats() {
  const cpus = os.cpus();
  let totalIdle = 0, totalTick = 0;
  let totalThreads = 0;
  
  cpus.forEach(cpu => {
    for (let type in cpu.times) {
      totalTick += cpu.times[type];
    }
    totalIdle += cpu.times.idle;
    totalThreads += 1;
  });
  
  const cpu = Math.round(100 - (100 * totalIdle / totalTick));
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  const ram = Math.round(100 - (100 * freeMem / totalMem));
  const memUsedGB = (usedMem / 1073741824).toFixed(1);
  
  const uptime = os.uptime();
  const days = Math.floor(uptime / 86400);
  const hours = Math.floor((uptime % 86400) / 3600);
  const mins = Math.floor((uptime % 3600) / 60);
  const uptimeStr = days > 0 ? days + 'd ' + hours + 'h' : hours + 'h ' + mins + 'm';
  
  return { 
    cpu, 
    ram, 
    uptime: uptimeStr,
    processes: os.freemem ? Math.round(os.totalmem() / 5000000) : 0,
    threads: cpus.length * 4,
    memUsed: memUsedGB + ' GB'
  };
}

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
  console.log('═══════════════════════════════════');
  console.log('   RemotePC Dashboard v1.0');
  console.log('═══════════════════════════════════');
  console.log('URL:      http://localhost:' + PORT);
  console.log('Password: ' + PASSWORD);
  console.log('PC Name:  ' + PC_NAME);
  console.log('═══════════════════════════════════');
});
