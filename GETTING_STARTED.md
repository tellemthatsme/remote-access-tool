# RemotePC - Complete Beginner's Guide

## What is RemotePC?

RemotePC is a tool that lets you control your home computer from anywhere using your phone or another computer.

**Imagine:** You can check if your home PC is running, see how much memory it's using, and even restart it - all from your phone!

**Cost:** $1/month (or name your price)

**Why:** Because TeamViewer costs $50+/year and is too complicated!

---

## What Can You Do With It?

| Feature | What It Does |
|---------|--------------|
| 📊 See CPU | Watch how hard your PC is working |
| 💾 See RAM | Check how much memory is used |
| 💿 See Disk | Know how much space is left |
| 🌡️ See Temp | Check if PC is overheating |
| ☠️ Kill Node | One-click to stop stuck programs |
| 🐳 Kill Docker | Stop Docker if it's slow |
| 🔄 Restart | Restart PC from anywhere |
| 🔴 Shutdown | Turn off PC remotely |

---

## Part 1: Set Up Your BuyMeACoffee Page

### Why?
This is how you get paid $1/month from users.

### Steps:

1. **Open your browser** and go to:
   ```
   https://www.buymeacoffee.com
   ```

2. **Click "Sign Up"** (top right corner)

3. **Choose how to sign up:**
   - Option A: Click "Continue with Google"
   - Option B: Enter email + password

4. **Create your page:**
   - Page name: `remote-pc` (or anything you want)
   - Click "Continue"

5. **Set up your $1 tier:**
   - Click "Add a tier"
   - Title: `Remote PC Access`
   - Description:
     ```
     🚀 Control your PC from anywhere
     
     ✅ Live CPU/RAM monitoring
     ✅ Kill stuck processes
     ✅ Restart PC remotely
     ✅ Works on phone
     
     Cancel anytime.
     ```
   - Price: `$1/month`
   - Click "Save"

6. **Publish:**
   - Click "Publish page" button

7. **Copy your link!** It will look like:
   ```
   https://buymeacoffee.com/YOUR_NAME
   ```

**SAVE THIS LINK!** You'll need it later.

---

## Part 2: Download the Files

### Steps:

1. Go to GitHub:
   ```
   https://github.com/tellemthatsme/remote-access-tool
   ```

2. Click the green **"Code"** button

3. Click **"Download ZIP"**

4. Wait for download to finish

5. **Find the file** (usually in Downloads folder)

6. **Right-click** the ZIP file → **"Extract All"**

7. **Choose where** to save it (Desktop is easiest)

8. Click **"Extract"**

Now you have a folder called `remote-access-tool`!

---

## Part 3: Update the Landing Page

### Why?
So when people click "Get Started", they go to YOUR BuyMeACoffee page.

### Steps:

1. Open the `remote-access-tool` folder

2. **Right-click** on `landing.html`

3. Click **"Open with"** → **"Notepad"** (or any text editor)

4. **Press Ctrl + F** to find

5. Search for: `YOUR_LINK_HERE`

6. **Replace** `YOUR_LINK_HERE` with your BuyMeACoffee link

   **Before:**
   ```html
   <a href="https://www.buymeacoffee.com/YOUR_LINK_HERE" class="btn">
   ```

   **After:**
   ```html
   <a href="https://buymeacoffee.com/yourname" class="btn">
   ```

7. **Press Ctrl + S** to save

8. Close Notepad

---

## Part 4: Start the Dashboard

### What is this?
The dashboard is the website that shows your PC stats.

### Steps:

1. Open the `remote-access-tool` folder

2. **Double-click** on `START_DASHBOARD.bat`

3. A black window will open briefly and close

4. A new window will stay open saying:
   ```
   ═══════════════════════════════════════════
      RemotePC Dashboard v1.1 - Enhanced
   ═══════════════════════════════════════════
   URL:      http://localhost:3001
   Password: karma123
   PC Name:  DESKTOP-KARMA
   ═══════════════════════════════════════════
   ```

**KEEP THIS WINDOW OPEN!** If you close it, the dashboard stops.

---

## Part 5: Test It Works

### Steps:

1. Open your web browser (Chrome, Edge, etc.)

2. In the address bar, type:
   ```
   http://localhost:3001
   ```

3. Press **Enter**

4. You should see a login screen!

5. In the password box, type:
   ```
   karma123
   ```

6. Click **"Login"**

7. 🎉 **You should see your dashboard!**

It shows:
- CPU percentage
- RAM usage
- Disk space
- And more!

---

## Part 6: Set Up Internet Access (Cloudflare Tunnel)

### Why?
This lets you access your PC from ANYWHERE - not just your home WiFi!

### Steps:

1. Make sure the dashboard is running (Part 4)

2. In the `remote-access-tool` folder, **double-click** `START_TUNNEL.bat`

3. A black window will open

4. **First time only:**
   - It will say something like:
     ```
     Please run: cloudflared.exe tunnel login
     ```
   - Press **Enter**
   - Your browser will open
   - Click your Cloudflare account
   - Go back to the black window

5. **The tunnel will start!**

6. Look for a URL that looks like:
   ```
   https://random-name.trycloudflare.com
   ```

7. **COPY THIS URL!**

8. Test it:
   - Open a new browser tab
   - Paste the URL
   - You should see your dashboard!

**🎉 You're online!**

---

## Part 7: Share with the World!

### Now what?

1. **Send your tunnel URL** to people:
   ```
   Check out my PC dashboard!
   https://xxxx.trycloudflare.com
   Password: karma123
   ```

2. **Send them to your BuyMeACoffee:**
   ```
   Support me for $1/month:
   https://buymeacoffee.com/YOUR_NAME
   ```

---

## Quick Reference Card

```
┌─────────────────────────────────────────────┐
│           REMOTEPC QUICK START              │
├─────────────────────────────────────────────┤
│                                             │
│ TO START:                                   │
│   1. Double-click START_DASHBOARD.bat      │
│   2. Double-click START_TUNNEL.bat          │
│                                             │
│ YOUR URL:                                   │
│   https://xxxx.trycloudflare.com            │
│                                             │
│ PASSWORD:                                   │
│   karma123                                  │
│                                             │
│ TO STOP:                                    │
│   Close the black windows                   │
│                                             │
└─────────────────────────────────────────────┘
```

---

## Troubleshooting

### "Port already in use" error
```
Something is using port 3001.
Solution:
1. Press Ctrl + Shift + Esc
2. Click "Processes"
3. Find "node.exe"
4. Right-click → "End task"
5. Try starting again
```

### "Tunnel won't connect"
```
1. Check your internet
2. Make sure dashboard is running first
3. Try closing and reopening START_TUNNEL.bat
```

### "Can't access from phone"
```
1. Make sure your phone is NOT on the same WiFi
2. Use mobile data or another network
3. The tunnel URL must start with https://
```

### Forgot your tunnel URL?
```
Just double-click START_TUNNEL.bat again!
It will show the new URL.
```

---

## What To Do Next

### 1. Post on Social Media
Copy from `SOCIAL_POSTS.md` in the folder

### 2. Tell Friends
Send them your tunnel URL

### 3. Get Paid
Share your BuyMeACoffee link!

### 4. Check Back Daily
See if anyone subscribed!

---

## FAQ - Questions People Ask

**Q: Is this safe?**
A: Yes! Uses Cloudflare security. Password protected.

**Q: Does it work on Mac?**
A: Currently Windows only. Mac version coming soon!

**Q: What if my internet goes down?**
A: The dashboard stops. When internet returns, restart START_TUNNEL.bat

**Q: Can I cancel anytime?**
A: Yes! Through BuyMeACoffee

**Q: How do I change the password?**
A: Open dashboard.cjs in Notepad, find "karma123", change it

---

## Summary - What To Remember

| Step | What To Do |
|------|------------|
| 1 | Create BuyMeACoffee page |
| 2 | Download from GitHub |
| 3 | Update landing.html with your link |
| 4 | Double-click START_DASHBOARD.bat |
| 5 | Double-click START_TUNNEL.bat |
| 6 | Share your URL! |

---

## Need Help?

📧 **Email:** [Your email]
💬 **Twitter:** [Your Twitter]

I'm here to help you get set up!

---

**Made with 💚 after 14 months learning to code**
**RemotePC v1.1**
