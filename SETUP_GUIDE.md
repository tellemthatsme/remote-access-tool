# Setup Guide

## 1. Auto-Login Configuration

### Step 1: Enable Auto-Login via Registry

```powershell
# Run Command Prompt as Administrator
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Winlogon" /v AutoAdminLogon /t REG_SZ /d 1 /f
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Winlogon" /v DefaultUserName /t REG_SZ /d karma /f
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Winlogon" /v DefaultPassword /t REG_SZ /d "" /f
```

### Step 2: Disable User Account Control (UAC) - Optional but recommended

```powershell
# Run Command Prompt as Administrator
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System" /v EnableLUA /t REG_DWORD /d 0 /f
```

### Step 3: Configure User Accounts

1. Open `netplwiz` (Run > netplwiz)
2. Uncheck "Users must enter a user name and password to use this computer"
3. Click Apply and enter the password for "karma"

## 2. Chrome Remote Desktop Setup

### Step 1: Install Chrome Remote Desktop

1. Open Chrome browser
2. Go to https://remotedesktop.google.com/
3. Click "Set up remote access"
4. Follow the installation wizard

### Step 2: Add Chrome to Startup

1. Press `Win + R` and type `shell:startup`
2. Create a shortcut with the following target:
   ```
   "C:\Program Files\Google\Chrome\Application\chrome.exe" --profile-directory=Default
   ```

## 3. Dashboard Setup

### Step 1: Start the Dashboard

```bash
START_DASHBOARD.bat
```

### Step 2: Access the Dashboard

- Local: http://localhost:3000
- Password: karma123

## 4. Exposing to Internet (Cloudflare Tunnel)

### Step 1: Download cloudflared

```bash
# Download from https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation
# Extract to remote-access-tool folder
```

### Step 2: Login to Cloudflare

```bash
cloudflared tunnel login
```

### Step 3: Create and Run Tunnel

```bash
START_TUNNEL.bat
```

## 5. System Requirements

- Windows 10/11
- Node.js (for dashboard)
- Chrome browser
- Internet connection

## Troubleshooting

### Dashboard not accessible

1. Check if Node.js is running: `tasklist | findstr node`
2. Restart the dashboard: `START_DASHBOARD.bat`
3. Check firewall settings

### Chrome Remote Desktop not working

1. Ensure Chrome is open on the remote PC
2. Check if Chrome Remote Desktop is running
3. Verify internet connection

### Auto-login not working

1. Check registry settings
2. Re-run netplwiz setup
3. Restart the PC
