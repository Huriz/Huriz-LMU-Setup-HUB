import express from 'express'
import Redis from 'ioredis'
import fetch from 'node-fetch'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { execSync } from 'child_process'
import dotenv from 'dotenv'

dotenv.config({ path: './server.cfg' })

function ensureFirewallRule(port) {
  try {
    const rulePort = execSync(
      `powershell -Command "Get-NetFirewallRule -DisplayName 'LMU Setup HUB' -ErrorAction SilentlyContinue | Get-NetFirewallPortFilter | Select-Object -ExpandProperty LocalPort"`,
      { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }
    ).trim()
    if (rulePort === String(port)) return
    // Rule missing or points to a different port — create/update
    execSync(
      `powershell -Command "Remove-NetFirewallRule -DisplayName 'LMU Setup HUB' -ErrorAction SilentlyContinue; New-NetFirewallRule -DisplayName 'LMU Setup HUB' -Direction Inbound -Protocol TCP -LocalPort ${port} -Action Allow"`,
      { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }
    )
    console.log(`Firewall rule set for port ${port}.`)
  } catch {
    console.warn(`[warn] Could not configure firewall. Run as administrator once to allow LAN access on port ${port}.`)
  }
}

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
app.use(express.json())
app.get('/', (req, res) => res.sendFile(join(__dirname, '../frontend/index-ui.html')))
app.get('/demo', (req, res) => res.sendFile(join(__dirname, '../demo/demo-ui.html')))

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')
redis.on('error', (err) => console.error('Redis error:', err))

const LMU_URL = process.env.LMU_URL || 'http://localhost:6397'
const TTL = parseInt(process.env.TTL_SECONDS || '172800') // 48h

function buildKey(name) {
  return name.toLowerCase()
}

// ── PUSH: reads setup from local LMU and uploads to Redis ────────────────────
app.post('/api/push', async (req, res) => {
  const { sessionName } = req.body

  if (!sessionName || sessionName.length > 10 || !/^[a-zA-Z0-9]+$/.test(sessionName)) {
    return res.status(400).json({ error: 'Invalid name. Letters and numbers only, max 10 chars.' })
  }

  const key = buildKey(sessionName)

  // Check if already exists
  const exists = await redis.exists(key)
  if (exists) {
    return res.status(409).json({ error: `Session "${key}" already in use. Try another name.` })
  }

  // Read setup from local LMU
  let setupJson
  try {
    const lmuRes = await fetch(`${LMU_URL}/rest/garage/UIScreen/CarSetupOverview`)
    if (!lmuRes.ok) throw new Error(`LMU responded with ${lmuRes.status}`)
    setupJson = await lmuRes.json()
  } catch (err) {
    return res.status(502).json({ error: `Could not read LMU setup: ${err.message}` })
  }

  const payload = {
    setupJson,
    sessionName: key,
    createdAt: new Date().toISOString(),
  }

  await redis.set(key, JSON.stringify(payload), 'EX', TTL)

  res.json({ sessionId: key, expiresIn: TTL })
})

// ── PULL: downloads setup from Redis and sends to local LMU ──────────────────
app.post('/api/pull', async (req, res) => {
  const { sessionName } = req.body

  if (!sessionName || !/^[a-zA-Z0-9]+$/.test(sessionName)) {
    return res.status(400).json({ error: 'Invalid session name.' })
  }

  const key = buildKey(sessionName)
  const raw = await redis.get(key)

  if (!raw) {
    return res.status(404).json({ error: `Session "${key}" not found or expired.` })
  }

  const { setupJson, createdAt } = JSON.parse(raw)

  // Send each garage value individually to LMU
  const garageValues = setupJson?.carSetup?.garageValues
  if (!garageValues) {
    return res.status(502).json({ error: 'Stored setup has no garageValues.' })
  }

  // GET current setup and only send values that differ
  let currentValues = {}
  try {
    const cur = await fetch(`${LMU_URL}/rest/garage/UIScreen/CarSetupOverview`)
    if (cur.ok) {
      const curJson = await cur.json()
      currentValues = curJson?.carSetup?.garageValues ?? {}
    }
  } catch (_) {}

  const changed = Object.entries(garageValues).filter(([key_param, val]) => {
    if (val.value === undefined || val.value === '') return false
    return currentValues[key_param]?.value !== val.value
  })

  const results = await Promise.all(
    changed.map(([key_param, val]) =>
      fetch(`${LMU_URL}/rest/garage/${key_param}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: val.value }),
      }).then(r => r.ok ? null : `${key_param}: ${r.status}`)
        .catch(err => `${key_param}: ${err.message}`)
    )
  )

  const errors = results.filter(Boolean)

  const changes = changed.map(([key_param, val]) => ({
    key: key_param,
    from: currentValues[key_param]?.value ?? '—',
    to: val.value,
  }))

  res.json({ ok: true, sessionId: key, createdAt, changed: changed.length, changes, errors: errors.length ? errors : undefined })
})

// ── Healthcheck ───────────────────────────────────────────────────────────────
app.get('/api/health', async (req, res) => {
  const result = { hub: 'ok', redis: 'disconnected', lmu: 'disconnected' }

  try {
    await Promise.race([
      redis.ping(),
      new Promise((_, r) => setTimeout(() => r(new Error('timeout')), 500))
    ])
    result.redis = 'connected'
  } catch {}

  try {
    const ctrl = new AbortController()
    const t = setTimeout(() => ctrl.abort(), 500)
    await fetch(`${LMU_URL}/rest/garage/summary`, { signal: ctrl.signal })
    clearTimeout(t)
    result.lmu = 'connected'
  } catch {}

  res.json(result)
})

const PORT = process.env.PORT || 8080
ensureFirewallRule(PORT)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`LMU Setup Sharing running on http://0.0.0.0:${PORT}`)
  console.log(`Pointing to LMU at ${LMU_URL}`)
})
