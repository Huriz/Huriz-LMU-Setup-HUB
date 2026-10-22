# Changelog

All notable changes to this project will be documented in this file.

---

## [v2.0.7] - 2026-10-22

**Huriz - LMU Setup HUB is now a SimHub plugin.** No more Node.js, launcher or `server.cfg`: install it, open SimHub
and go to the garage.

### Overlay
- Send and receive setups from an **overlay on top of the game**, with the same look as the phone page
- It **only shows in LMU's garage (setup screen)** and hides by itself when you go out on track
- **LMU**, **REDIS** and **GARAGE** lights in the title bar; outside the garage everything is read only
- **CHANGES APPLIED** list after receiving: every value, before in red → after in green, with LMU's own text
  (e.g. brake balance `52.8:47.2`) and readable names
- Progress while applying ("APPLYING 37/120…") and the result in its own box
- Drag it by the title, fold it, three sizes (Normal / Large / Extra large), "Show to place it" and "Reset position"

### Plugin tab
- Two tabs, **Setup** and **Overlay**
- **Status:** Server, Redis, LMU and Overlay in green / yellow / red, plus the last changes applied
- **Mobile server:** the phone page now runs inside the plugin, with a QR code and a firewall button
- **Redis:** server and token (token hidden with `*`); shared free database by default, or your own (link to Upstash)
- English and Spanish

### Phone page
- Same look as the overlay: **LMU / REDIS / GARAGE** lights, red SEND / blue RECEIVE, green **CHANGES APPLIED**
  list and the result in its own box
- Read only outside the garage, Spanish / English following the plugin's language

### Sharing
- **Same name all the time:** sending with an existing name overwrites it ("New setup created" / "Setup overwritten")
- The name is kept after sending / receiving; clicking the field selects it so typing replaces it
- Only the values that are different are sent to LMU, all at once (fast, like 1.0.x)

### Installer
- Finds SimHub, asks to close it, installs the plugin and allows phones and tablets on the Windows Firewall

### Known limitation
- After receiving, LMU's setup screen does not refresh by itself: switch to any other tab at the top of the garage
  menu and back to see the new values. They are already applied to the car

---

## [v1.0.8] - 2026-05-21

### Launcher
- QR code printed in the terminal after the URL block — scan with your phone to open LMU Setup Hub without typing the address
- Added `qrcode-terminal` dependency

---

## [v1.0.5] - 2026-05-03

### Frontend
- Button label renamed from **CHANGES DONE** to **◈ CHANGES APPLIED** in both production UI and demo

### Demo
- `demo-ui.html` synced with production UI: arrow between phone mockups restored, **◈ CHANGES APPLIED** button added to phone B, changes modal inside phone B with before/after diff, unused CSS removed

### Docs
- README rewritten: Node.js removed from requirements (auto-installed by launcher on first run)
- First run must be executed as Administrator — installs Node via `winget` and adds a Windows Firewall inbound rule for LAN access (not internet)
- Subsequent runs do not require Administrator
- TTL corrected to 172800 (48 h) in the config example

---

## [v1.0.4] - 2026-05-03

### Backend
- Removed unused `summary` call (`/rest/garage/summary`) — data was fetched and stored in Redis but never consumed by any client
- `PULL` response now includes a `changes` array with `{ key, from, to }` for each value that was modified

### Frontend
- After a successful RECEIVE, a **◈ CHANGES APPLIED (N)** button appears below the action button
- Tapping it opens a bottom-sheet modal listing every parameter that changed, showing the old value (red) and the new value (green)

---

## [v1.0.2] - 2026-05-03

### Launcher (`start-lmu-setup-hub.bat`)
- Auto-installs Node.js silently via `winget` if not present; relaunches automatically after install
- Windows Firewall inbound rule (`LMU Setup HUB`) is now created and kept up to date directly from the launcher — no longer requires running Node as administrator
- `PORT` is now read dynamically from `server.cfg` instead of being hardcoded to `3001`

### Backend
- Firewall rule logic moved out of `index.js` into the launcher; `ensureFirewallRule` kept as fallback only

---

## [v1.0.0] - 2026-05-02

- Initial release
