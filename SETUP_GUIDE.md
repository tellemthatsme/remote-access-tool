# RemotePC Setup Guide

## Prerequisites

- Windows 10/11
- Node.js v14+ (https://nodejs.org)

---

## Quick Start (5 minutes)

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Start Dashboard

```bash
node dashboard.cjs
```

Or double-click `START_DASHBOARD.bat`

### Step 3: Access Dashboard

```
URL: http://localhost:3001
Password: karma123
```

---

## Remote Access Setup

### Option 1: Cloudflare Tunnel (Recommended)

1. Run `START_TUNNEL.bat`
2. Or manually:
   ```
   cloudflared.exe tunnel --url http://localhost:3001
   ```
3. Copy the generated URL
4. Share with others (no port forwarding needed!)

### Option 2: Port Forwarding (Advanced)

1. Forward port 3001 on your router
2. Know your public IP
3. Access via `http://YOUR_IP:3001`

**Not recommended** - less secure

---

## Auto-Login Setup (Optional)

Skip password on every visit:

### Method 1: netplwiz

1. Press `Win + R`
2. Type `netplwiz`
3. Uncheck "Users must enter a user name and password..."
4. Click Apply
5. Enter your password

### Method 2: Registry

```cmd
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Winlogon" /v AutoAdminLogon /t REG_SZ /d 1 /f
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Winlogon" /v DefaultUserName /t REG_SZ /d karma /f
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Winlogon" /v DefaultPassword /t REG_SZ /d your_password /f
```

---

## Auto-Start on Boot

### Method 1: Startup Folder

1. Press `Win + R`
2. Type `shell:startup`
3. Create shortcut to `START_DASHBOARD.bat`

### Method 2: Task Scheduler

```cmd
schtasks /create /tn "RemotePC" /tr "C:\path\to\dashboard.cjs" /sc onstart /rl limited
```

### Method 3: Registry

```cmd
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Run" /v RemotePC /t REG_SZ /d "C:\path\to\node.exe C:\path\to\dashboard.cjs" /f
```

---

## Configuration

Edit these in `dashboard.cjs`:

```javascript
const PORT = 3001; // Change port
const PASSWORD = "karma123"; // Change password
const PC_NAME = "MY-PC"; // Change display name
```

---

## Firewall Setup

### Allow Through Firewall

```cmd
netsh advfirewall firewall add rule name="RemotePC" dir=in action=allow program="C:\path\to\node.exe" enable=yes
```

### Check if Blocked

```cmd
netsh advfirewall firewall show rule name="RemotePC"
```

---

## Troubleshooting

### "Port already in use"

```cmd
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

### "cloudflared not found"

- Download from: https://developers.cloudflare.com/cloudflare-one/downloads/
- Place in project folder

### Dashboard not loading

1. Check Node is running: `tasklist | findstr node`
2. Check port: `netstat -ano | findstr 3001`
3. Check logs in console

### GPU not showing

- Install NVIDIA drivers + nvidia-smi
- Or use AMD drivers

### Temperature not showing

- Temperature requires ACPI sensor
- Usually available on laptops
- May need admin rights

---

## Production Tips

### Use PM2 for Reliability

```bash
npm install -g pm2
pm2 start dashboard.cjs
pm2 save
pm2 startup
```

### Enable HTTPS (Advanced)

1. Get SSL certificate (Let's Encrypt)
2. Use reverse proxy (nginx)
3. Or use Cloudflare Pro

### Monitor with Uptime Robot

- Add your tunnel URL
- Get alerts when down

---

## Uninstallation

### Stop Services

```cmd
taskkill /F /IM node.exe
```

### Remove Auto-Start

- Delete from `shell:startup`
- Or: `schtasks /delete /tn "RemotePC"`
- Or: Registry cleanup

---

## Need Help?

- GitHub Issues: https://github.com/tellemthatsme/remote-access-tool/issues
- Check `SECURITY.md` for security info
- Check `API_REFERENCE.md` for developer docs

---

_Version 1.3.0_
