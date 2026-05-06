# LMU Setup HUB

Share Le Mans Ultimate car setups between drivers instantly over the internet — no file transfers, no Discord uploads.

## How it works

Each driver runs this server on their own PC (the one with LMU open). Both connect to the same Upstash Redis instance in the cloud.

```
Driver A (sends)                    Upstash Redis               Driver B (receives)
─────────────────                   ─────────────               ────────────────────
Opens UI on phone
Types a name → SEND ───────────────► SET key ◄──────────────── Types same name → RECEIVE
                                                                 Setup applied to LMU ✓
```

1. Driver A opens the UI, types a session name, taps **SEND**
2. Server reads the active setup from LMU's local API → uploads to Redis
3. Driver A shares the session name with Driver B (Discord, chat, etc.)
4. Driver B opens the UI on their PC, types the same name, taps **RECEIVE**
5. Setup is applied to their LMU automatically

## Requirements

- Le Mans Ultimate running on the same PC (must be in the garage for the API to work)
- A free [Upstash](https://upstash.com) Redis database
- **WiFi or LAN connection** — the phone/tablet used as the UI must be on the same local network as the PC running the server

> Node.js is installed automatically the first time you run the launcher. No manual installation needed.

## Setup

**1. Download and extract** the latest release zip, or clone the repo:
```bash
git clone https://github.com/Huriz/lmu-setup-hub.git
```

**2. Open `webserver/backend/server.cfg` and fill in your Upstash Redis URL**

```
PORT=3000
REDIS_URL=rediss://default:YOUR_TOKEN@YOUR_HOST.upstash.io:6379
LMU_URL=http://localhost:6397
TTL_SECONDS=172800
```

| Parameter | Description |
|-----------|-------------|
| `PORT` | Port the web server listens on. Open `http://your-ip:<PORT>` in a browser or on your phone. |
| `REDIS_URL` | Upstash Redis connection URL — contains your password, keep the file private. Get it at upstash.com → your database → **Connect** → **ioredis**. |
| `LMU_URL` | Address of LMU's local API. Don't change this unless LMU moves to a different port. |
| `TTL_SECONDS` | How long setups stay available in seconds. `172800` = 48 hours. |

**3. First run — right-click `start-lmu-setup-hub.bat` → Run as Administrator**

The first time only, Administrator is required to:
- Install Node.js automatically via `winget` (if not already installed)
- Add a Windows Firewall inbound rule so phones and tablets on your local network can reach the server

After that first run, you can double-click the launcher normally — no Administrator needed.

## Usage

| Action | Who | Steps |
|--------|-----|-------|
| Share your setup | Driver sending | Open UI → type a name → tap **SEND** |
| Load a setup | Driver receiving | Open UI → type same name → tap **RECEIVE** |

After a successful **RECEIVE**, a **◈ CHANGES APPLIED** button appears showing how many setup values were modified. Tap it to see a before/after diff of every changed parameter.

- Session names: max 10 characters, letters and numbers only
- Sessions expire after 48 hours
- LMU must be open **in the garage** — the API is not active in menus

## Windows Firewall

The launcher adds an inbound TCP rule named **"LMU Setup HUB"** automatically on first run (requires Administrator). This rule allows devices on your **local network** (phone, tablet) to reach the server — it does not open any port to the internet.

Once the rule exists, subsequent runs do not require Administrator.


## Accessing from another device (phone, tablet)

When you run `start-lmu-setup-hub.bat`, it prints the addresses you can use:

```
  LMU Setup HUB
  ================================
  Local:   http://localhost:3000
  Network: http://192.168.1.X:3000   ← open this on your phone
  Host:    http://YOUR-PC-NAME:3000  ← alternative if DNS resolves
  ================================
```

## Tech stack

- **Node.js + Express** — HTTP server and LMU API proxy
- **ioredis** — Redis client (Upstash compatible)
- **Upstash Redis** — serverless Redis for session storage
- **LMU REST API** — local garage API (port 6397)

## Future implementation

- Setup page accessible from the UI to change `server.cfg` parameters (Redis URL, port, TTL) on the fly, without editing the file manually

## License

MIT License — Copyright (c) 2025 Huriz
