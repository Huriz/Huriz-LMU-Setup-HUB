# Changelog

All notable changes to this project will be documented in this file.

---

## [v1.0.4] - 2026-05-03

### Backend
- Removed unused `summary` call (`/rest/garage/summary`) — data was fetched and stored in Redis but never consumed by any client
- `PULL` response now includes a `changes` array with `{ key, from, to }` for each value that was modified

### Frontend
- After a successful RECEIVE, a **CHANGES DONE (N)** button appears below the action button
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
