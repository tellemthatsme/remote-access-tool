# Dashboard Guide - What All The Buttons Do

## Your Dashboard Overview

```
┌──────────────────────────────────────────────────────────┐
│                    🚀 DESKTOP-KARMA                     │
│              Remote Dashboard • Updated every 2s          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─────────────┐  ┌─────────────┐                       │
│  │    CPU      │  │    RAM      │                       │
│  │    45%      │  │    72%      │                       │
│  │   (red)     │  │  (teal)     │                       │
│  └─────────────┘  └─────────────┘                       │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │  CPU & RAM History (last 60 seconds)               │ │
│  │  ████▓▓▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░             │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │  💾 Memory                                         │ │
│  │  12.4 GB / 16.0 GB                                │ │
│  │  [████████████░░░░░░░░░░░░░░░░░]  72%            │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │  💿 Disk                                           │ │
│  │  ┌─────┐ ┌─────┐ ┌─────┐                         │ │
│  │  │ C:  │ │ D:  │ │ E:  │                         │ │
│  │  │350GB│ │80GB │ │500GB│                         │ │
│  │  │ /500│ │/100 │ │/1TB │                         │ │
│  │  └─────┘ └─────┘ └─────┘                         │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │  🌡️ Temperature                                   │ │
│  │              65°C                                  │ │
│  │            Normal                                   │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │  📊 Network                                       │ │
│  │  ┌──────────┐  ┌──────────┐                       │ │
│  │  │Downloaded│  │ Uploaded │                       │ │
│  │  │ 125 GB   │  │  45 GB  │                       │ │
│  │  └──────────┘  └──────────┘                       │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │  🔝 Top Processes                                  │ │
│  │  chrome.exe...........1.5 GB                       │ │
│  │  code.exe..............0.8 GB                      │ │
│  │  node.exe..............0.5 GB                      │ │
│  │  docker.exe............0.3 GB                      │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │  ⚡ Quick Actions                                  │ │
│  │                                                    │ │
│  │  [☠️ Kill All Node]                               │ │
│  │  [🐳 Kill Docker]                                 │ │
│  │  [🔄 Restart PC]                                  │ │
│  │  [🔴 Shutdown PC]                                 │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## Section by Section Guide

### 🔴 The Status Bar (Top)

```
┌─────────────────────────────────────┐
│  🟢 Online • 2d 5h                │
└─────────────────────────────────────┘
```

- **🟢 Online** = Your PC is running and connected
- **2d 5h** = PC has been on for 2 days, 5 hours

---

### 📊 CPU & RAM (Real-Time)

```
┌─────────────┐  ┌─────────────┐
│    CPU      │  │    RAM      │
│    45%      │  │    72%      │
│   (red)     │  │  (teal)     │
└─────────────┘  └─────────────┘
```

**CPU (Central Processing Unit)**
- Your computer's brain
- 0% = idle, 100% = working hard
- **45%** = moderate use
- Color: Red (shows it's working)

**RAM (Random Access Memory)**
- Short-term memory
- **72%** = using 72% of available memory
- Color: Teal

---

### 📈 History Graph

```
┌─────────────────────────────────────┐
│  CPU & RAM History                  │
│  ████▓▓▒▒░░░░░░░░░░░░░░░░░░      │
└─────────────────────────────────────┘
```

- Shows last 60 seconds
- Bars go up = more usage
- Helps spot patterns

---

### 💾 Memory Bar

```
┌─────────────────────────────────────┐
│  💾 Memory                          │
│  12.4 GB / 16.0 GB                │
│  [████████████░░░░░░░░░░]  72%    │
└─────────────────────────────────────┘
```

- **12.4 GB** = How much you're using
- **16.0 GB** = Total available
- **72%** = Percent used
- Bar fills up as you use more

---

### 💿 Disk Space

```
┌─────────────────────────────────────┐
│  💿 Disk                            │
│  ┌─────┐ ┌─────┐                   │
│  │ C:  │ │ D:  │                   │
│  │350GB│ │80GB │                   │
│  │ /500│ │/100 │                   │
│  └─────┘ └─────┘                   │
└─────────────────────────────────────┘
```

Shows each drive:
- **C:** = Main drive (350GB used of 500GB)
- **D:** = Second drive (80GB used of 100GB)
- **Red bar** = Almost full (>90%)
- **Orange bar** = Getting full (>80%)

---

### 🌡️ Temperature

```
┌─────────────────────────────────────┐
│  🌡️ Temperature                     │
│           65°C                      │
│         Normal                      │
└─────────────────────────────────────┘
```

| Temp | Status | What to do |
|------|--------|------------|
| <60°C | Normal | ✅ Good |
| 60-80°C | Warm | ⚠️ OK |
| >80°C | Hot | 🔥 Close programs! |

**Note:** Shows "N/A" if your PC doesn't have a temperature sensor.

---

### 📊 Network

```
┌─────────────────────────────────────┐
│  📊 Network                         │
│  ┌──────────┐  ┌──────────┐        │
│  │Downloaded│  │ Uploaded │        │
│  │ 125 GB   │  │  45 GB  │        │
│  └──────────┘  └──────────┘        │
└─────────────────────────────────────┘
```

- **Downloaded** = Total data received
- **Uploaded** = Total data sent
- Shows since last PC restart

---

### 🔝 Top Processes

```
┌─────────────────────────────────────┐
│  🔝 Top Processes                   │
│  chrome.exe...........1.5 GB       │
│  code.exe..............0.8 GB      │
│  node.exe..............0.5 GB      │
│  docker.exe............0.3 GB      │
└─────────────────────────────────────┘
```

Programs using most memory:
- **chrome.exe** = Chrome browser (1.5GB)
- **code.exe** = VS Code (0.8GB)
- **node.exe** = Node.js (0.5GB)
- **docker.exe** = Docker (0.3GB)

---

### ⚡ Quick Actions (DANGER ZONE!)

```
┌─────────────────────────────────────┐
│  ⚡ Quick Actions                   │
│                                     │
│  [☠️ Kill All Node]                │
│  [🐳 Kill Docker]                  │
│  [🔄 Restart PC]                   │
│  [🔴 Shutdown PC]                  │
└─────────────────────────────────────┘
```

---

## ⛔ THE DANGER ZONE - Use With Care!

### ☠️ Kill All Node

**What it does:**
Stops ALL Node.js related programs:
- node.exe (Node runtime)
- npm.exe (package manager)
- npx.exe (package executor)
- yarn.exe (yarn package manager)
- pnpm.exe (pnpm package manager)
- bun.exe (Bun runtime)

**When to use:**
- Node processes are frozen
- npm install stuck
- Using too much memory
- Can't stop a server

**When NOT to:**
- Active development
- Running important servers
- Building projects

**⚠️ WARNING:** Will force-close all Node programs!

---

### 🐳 Kill Docker

**What it does:**
Stops Docker completely:
- docker.exe
- Docker Desktop.exe
- com.docker.backend.exe

**When to use:**
- Docker using too much memory (often 4GB+)
- Docker is frozen
- Need to free resources

**When NOT to:**
- Containers running important services
- Active development

**⚠️ WARNING:** Will stop all Docker containers!

---

### 🔄 Restart PC

**What it does:**
Restarts your computer in 10 seconds

**When to use:**
- After installing updates
- System is slow/unresponsive
- Need fresh start

**Confirmation required:** YES (popup)

**After clicking:**
1. Popup: "Restart PC in 10 seconds?"
2. Click OK
3. 10 seconds later... PC restarts

**To cancel:**
```cmd
shutdown /a
```

---

### 🔴 Shutdown PC

**What it does:**
Turns OFF your computer in 10 seconds

**When to use:**
- Leaving for a while
- Want to save power
- Emergency

**Confirmation required:** YES - TWO confirmations!

**⚠️ WARNING:** PC will be OFF! Must physically turn on again.

**To cancel:**
```cmd
shutdown /a
```

---

## ⚠️ Alerts - What They Mean

### Green Alert (Good)
```
┌─────────────────────────────┐
│ ✅ All systems normal       │
└─────────────────────────────┘
```
Everything is fine!

---

### Yellow Alert (Warning)
```
┌─────────────────────────────┐
│ 🟡 CPU high: 85%            │
│ 🟡 RAM high: 82%            │
└─────────────────────────────┘
```

| Alert | Meaning | What To Do |
|-------|---------|------------|
| CPU high 85% | Working hard | Check what's running |
| RAM high 82% | Using lots of memory | Kill unused programs |

---

### Red Alert (Critical!)
```
┌─────────────────────────────┐
│ 🔴 CPU critical: 95%        │
│ 🔴 RAM critical: 92%        │
└─────────────────────────────┘
```

| Alert | Meaning | What To Do |
|-------|---------|------------|
| CPU critical 95% | Almost maxed out! | Kill processes ASAP |
| RAM critical 92% | Almost out of memory! | Kill processes ASAP |

---

## Color Code Cheat Sheet

| Color | Meaning |
|-------|---------|
| 🟢 Green | Good/Normal |
| 🟡 Yellow | Warning/High |
| 🔴 Red | Critical/Danger |
| 🟠 Orange | Warm |

---

## Refresh Rates

| Section | Updates Every |
|---------|--------------|
| CPU/RAM | 2 seconds |
| Alerts | 2 seconds |
| Network | 5 seconds |
| Temperature | 5 seconds |
| Disk | 10 seconds |
| Processes | 10 seconds |

---

## What Happens When...

| You Click | What Happens |
|-----------|--------------|
| ☠️ Kill All Node | All Node programs close |
| 🐳 Kill Docker | Docker stops |
| 🔄 Restart PC | PC restarts in 10s |
| 🔴 Shutdown PC | PC turns off in 10s |

---

## Summary

### Monitor:
- ✅ CPU - brain usage
- ✅ RAM - memory usage  
- ✅ Disk - storage space
- ✅ Temp - how hot
- ✅ Network - data used
- ✅ Processes - what's running

### Control:
- ✅ Kill Node - stop Node
- ✅ Kill Docker - stop Docker
- ✅ Restart - reboot
- ✅ Shutdown - turn off

---

**Dashboard v1.1 - Built with 💚**
