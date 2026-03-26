# RemotePC API Reference

## Base URL

```
http://localhost:3001
```

## Authentication

All endpoints except `/api/stats` require no authentication (protected by dashboard login).

---

## Endpoints

### GET /api/stats

Returns real-time system statistics.

**Response:**

```json
{
  "cpu": 45,
  "ram": 62,
  "uptime": "2d 14h",
  "memUsed": "8.2",
  "memTotal": "16.0",
  "cpuHistory": [45, 50, 48, 52, 45],
  "ramHistory": [60, 62, 61, 63, 62],
  "alerts": [{ "type": "warning", "msg": "🟡 CPU high: 85%" }],
  "gpu": [
    {
      "name": "NVIDIA GeForce RTX 3060",
      "usage": 75,
      "memoryUsed": 6144,
      "memoryTotal": 12288,
      "temperature": 65,
      "type": "NVIDIA"
    }
  ]
}
```

---

### GET /api/disk

Returns disk usage for all drives.

**Response:**

```json
[
  {
    "drive": "C:",
    "total": 500,
    "free": 200,
    "used": 300,
    "percent": 60
  },
  {
    "drive": "D:",
    "total": 1000,
    "free": 800,
    "used": 200,
    "percent": 20
  }
]
```

---

### GET /api/processes

Returns top 15 processes by memory usage.

**Response:**

```json
[
  { "name": "chrome.exe", "memory": "2.50", "count": 12 },
  { "name": "code.exe", "memory": "1.80", "count": 5 },
  { "name": "node.exe", "memory": "0.90", "count": 3 }
]
```

---

### GET /api/services

Returns Windows services list.

**Response:**

```json
[
  { "name": "Windows Update", "status": "Running" },
  { "name": "Docker Desktop Service", "status": "Stopped" },
  { "name": "Spooler", "status": "Running" }
]
```

---

### GET /api/gpu

Returns GPU information.

**Response:**

```json
{
  "gpu": [
    {
      "name": "NVIDIA GeForce RTX 3060",
      "usage": 75,
      "memoryUsed": 6144,
      "memoryTotal": 12288,
      "temperature": 65,
      "type": "NVIDIA"
    }
  ]
}
```

---

### GET /api/network

Returns network traffic stats.

**Response:**

```json
{
  "received": "125.50",
  "sent": "45.20"
}
```

---

### GET /api/temp

Returns CPU temperature.

**Response:**

```json
{
  "temp": 55
}
```

---

### GET /api/history

Returns historical data.

**Query Parameters:**

- `days` (optional): Number of days (default: 7)

**Response:**

```json
[
  { "time": "3/24 14:00", "cpu": 45, "ram": 62 },
  { "time": "3/24 15:00", "cpu": 50, "ram": 65 },
  { "time": "3/24 16:00", "cpu": 42, "ram": 60 }
]
```

---

### GET /api/files

Browse files and directories.

**Query Parameters:**

- `path` (optional): Directory path (default: C:\)

**Response:**

```json
[
  {
    "name": "Documents",
    "isDirectory": true,
    "size": null,
    "modified": "2026-03-20T10:30:00.000Z"
  },
  {
    "name": "file.txt",
    "isDirectory": false,
    "size": 1024,
    "modified": "2026-03-20T10:30:00.000Z"
  }
]
```

---

## Action Endpoints

### POST /api/kill-node

Kill all Node.js processes.

**Response:**

```json
{ "success": true }
```

---

### POST /api/kill-docker

Kill Docker processes.

**Response:**

```json
{ "success": true }
```

---

### POST /api/kill-process

Kill a specific process by name.

**Request Body:**

```json
{ "name": "chrome" }
```

**Response:**

```json
{
  "success": true,
  "count": 5,
  "output": "..."
}
```

---

### POST /api/restart

Restart the PC (10 second countdown).

**Response:**

```json
{ "success": true }
```

---

### POST /api/shutdown

Shutdown the PC (10 second countdown).

**Response:**

```json
{ "success": true }
```

---

## WebSocket

Connect to `/ws` for real-time updates.

```javascript
const ws = new WebSocket("ws://localhost:3001/ws");

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);

  if (message.type === "stats") {
    console.log("CPU:", message.data.cpu);
    console.log("RAM:", message.data.ram);
  }
};
```

---

## JavaScript Client Example

```javascript
class RemotePC {
  constructor(baseUrl = "http://localhost:3001") {
    this.baseUrl = baseUrl;
  }

  async getStats() {
    const res = await fetch(`${this.baseUrl}/api/stats`);
    return res.json();
  }

  async getDisk() {
    const res = await fetch(`${this.baseUrl}/api/disk`);
    return res.json();
  }

  async killProcess(name) {
    const res = await fetch(`${this.baseUrl}/api/kill-process`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    return res.json();
  }

  onUpdate(callback) {
    const ws = new WebSocket(`${this.baseUrl.replace("http", "ws")}/ws`);
    ws.onmessage = (e) => callback(JSON.parse(e.data));
  }
}

// Usage
const pc = new RemotePC();
const stats = await pc.getStats();
console.log(stats.cpu);

// Real-time updates
pc.onUpdate((msg) => {
  if (msg.type === "stats") {
    console.log("CPU:", msg.data.cpu);
  }
});
```

---

_Version: 1.3.0_
