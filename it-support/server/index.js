import express from 'express'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { randomBytes } from 'node:crypto'
import { db } from './db.js'
import { hashPassword, verifyPassword, createSession, destroySession, cookieToken, requireStaff, rateLimit, SESSION_DAYS } from './auth.js'
import { sendTicketEmail, emailConfigured } from './mail.js'

const app = express()
const prod = process.env.NODE_ENV === 'production'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const clean = (s, max) => String(s ?? '').replace(/[\r\n]+/g, ' ').trim().slice(0, max)
const cleanBlock = (s, max) => String(s ?? '').trim().slice(0, max)
const isHttpUrl = (u) => { try { return ['http:', 'https:'].includes(new URL(u).protocol) } catch { return false } }

app.set('trust proxy', process.env.TRUST_PROXY ? 1 : false)
app.disable('x-powered-by')
app.use((req, res, next) => {
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'same-origin',
    'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; media-src https://d8j0ntlcm91z4.cloudfront.net; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'",
  })
  next()
})
app.use(express.json({ limit: '20kb' }))
// Block cross-site writes: browsers always send Origin on POST/PUT/PATCH/DELETE from other sites.
app.use((req, res, next) => {
  if (['GET', 'HEAD'].includes(req.method)) return next()
  const origin = req.headers.origin
  if (origin && new URL(origin).host !== req.headers.host) return res.status(403).json({ error: 'Bad origin.' })
  next()
})

// ---------- Public ----------
const faqOut = (r) => ({ id: r.id, category: r.category, question: r.question, answer: r.answer, link: r.link, linkLabel: r.link_label })
app.get('/api/faqs', (_req, res) => res.json(db.prepare('SELECT * FROM faqs ORDER BY id').all().map(faqOut)))

app.post('/api/tickets', rateLimit('ticket', 5, 3600e3), async (req, res) => {
  const t = {
    id: `IT-${Date.now().toString(36).toUpperCase()}${randomBytes(2).toString('hex').toUpperCase()}`,
    name: clean(req.body.name, 100), email: clean(req.body.email, 200),
    topic: clean(req.body.topic, 100), message: cleanBlock(req.body.message, 2000),
  }
  if (!t.name) return res.status(400).json({ error: 'Please enter your name.' })
  if (!EMAIL_RE.test(t.email)) return res.status(400).json({ error: 'Please enter a valid email.' })
  if (t.message.length < 10) return res.status(400).json({ error: 'Please describe the problem (at least 10 characters).' })
  db.prepare('INSERT INTO tickets (id,name,email,topic,message,created) VALUES (?,?,?,?,?,?)').run(t.id, t.name, t.email, t.topic, t.message, new Date().toISOString())
  const emailed = await sendTicketEmail(t)
  if (emailed) db.prepare('UPDATE tickets SET emailed=1 WHERE id=?').run(t.id)
  res.status(201).json({ id: t.id })
})

app.post('/api/votes', rateLimit('vote', 30, 3600e3), (req, res) => {
  const faqId = Number(req.body.faqId)
  const vote = req.body.vote
  if (!['up', 'down'].includes(vote) || !db.prepare('SELECT 1 FROM faqs WHERE id=?').get(faqId)) return res.status(400).json({ error: 'Bad vote.' })
  db.prepare('INSERT INTO votes (faq_id,vote,created) VALUES (?,?,?)').run(faqId, vote, new Date().toISOString())
  res.status(201).json({ ok: true })
})

// ---------- Staff login ----------
app.post('/api/login', rateLimit('login', 10, 15 * 60e3), (req, res) => {
  const row = db.prepare('SELECT * FROM staff WHERE email=?').get(clean(req.body.email, 200).toLowerCase())
  // Same message either way so attackers can't learn which emails exist.
  if (!row || !verifyPassword(String(req.body.password ?? ''), row.password_hash)) return res.status(401).json({ error: 'Wrong email or password.' })
  const token = createSession(row.id)
  res.cookie('session', token, { httpOnly: true, sameSite: 'strict', secure: prod, maxAge: SESSION_DAYS * 864e5, path: '/' })
  res.json({ name: row.name, email: row.email })
})
app.post('/api/logout', (req, res) => {
  const t = cookieToken(req)
  if (t) destroySession(t)
  res.clearCookie('session', { path: '/' })
  res.json({ ok: true })
})
app.get('/api/me', requireStaff, (req, res) => res.json({ name: req.staff.name, email: req.staff.email }))

// ---------- Staff only ----------
app.get('/api/staff/status', requireStaff, (_req, res) => res.json({ emailConfigured }))
app.get('/api/staff/tickets', requireStaff, (_req, res) => res.json(db.prepare('SELECT * FROM tickets ORDER BY created DESC').all()))
app.patch('/api/staff/tickets/:id', requireStaff, (req, res) => {
  if (!['open', 'in_progress', 'closed'].includes(req.body.status)) return res.status(400).json({ error: 'Bad status.' })
  db.prepare('UPDATE tickets SET status=? WHERE id=?').run(req.body.status, req.params.id)
  res.json({ ok: true })
})

app.get('/api/staff/faqs', requireStaff, (_req, res) => {
  const votes = db.prepare("SELECT faq_id, SUM(vote='up') AS up, SUM(vote='down') AS down FROM votes GROUP BY faq_id").all()
  const byId = new Map(votes.map((v) => [v.faq_id, v]))
  res.json(db.prepare('SELECT * FROM faqs ORDER BY id').all().map((r) => ({ ...faqOut(r), up: byId.get(r.id)?.up ?? 0, down: byId.get(r.id)?.down ?? 0 })))
})
function faqFields(body) {
  const f = { category: clean(body.category, 100), question: clean(body.question, 300), answer: cleanBlock(body.answer, 3000), link: clean(body.link, 500), link_label: clean(body.linkLabel, 200) }
  if (!f.category || !f.question || !f.answer) return { error: 'Category, question and answer are required.' }
  if (f.link && !isHttpUrl(f.link)) return { error: 'Link must start with http:// or https://' }
  return { f }
}
app.post('/api/staff/faqs', requireStaff, (req, res) => {
  const { f, error } = faqFields(req.body)
  if (error) return res.status(400).json({ error })
  const r = db.prepare('INSERT INTO faqs (category,question,answer,link,link_label) VALUES (?,?,?,?,?)').run(f.category, f.question, f.answer, f.link, f.link_label)
  res.status(201).json({ id: Number(r.lastInsertRowid) })
})
app.put('/api/staff/faqs/:id', requireStaff, (req, res) => {
  const { f, error } = faqFields(req.body)
  if (error) return res.status(400).json({ error })
  db.prepare('UPDATE faqs SET category=?,question=?,answer=?,link=?,link_label=? WHERE id=?').run(f.category, f.question, f.answer, f.link, f.link_label, req.params.id)
  res.json({ ok: true })
})
app.delete('/api/staff/faqs/:id', requireStaff, (req, res) => {
  db.prepare('DELETE FROM faqs WHERE id=?').run(req.params.id)
  res.json({ ok: true })
})

app.get('/api/staff/team', requireStaff, (_req, res) => res.json(db.prepare('SELECT id,email,name,created FROM staff ORDER BY id').all()))
app.post('/api/staff/team', requireStaff, (req, res) => {
  const email = clean(req.body.email, 200).toLowerCase(), name = clean(req.body.name, 100), pw = String(req.body.password ?? '')
  if (!EMAIL_RE.test(email) || !name) return res.status(400).json({ error: 'Name and a valid email are required.' })
  if (pw.length < 10) return res.status(400).json({ error: 'Password must be at least 10 characters.' })
  if (db.prepare('SELECT 1 FROM staff WHERE email=?').get(email)) return res.status(409).json({ error: 'That email is already on the team.' })
  db.prepare('INSERT INTO staff (email,name,password_hash,created) VALUES (?,?,?,?)').run(email, name, hashPassword(pw), new Date().toISOString())
  res.status(201).json({ ok: true })
})
app.delete('/api/staff/team/:id', requireStaff, (req, res) => {
  if (Number(req.params.id) === req.staff.id) return res.status(400).json({ error: "You can't remove yourself." })
  db.prepare('DELETE FROM sessions WHERE staff_id=?').run(req.params.id)
  db.prepare('DELETE FROM staff WHERE id=?').run(req.params.id)
  res.json({ ok: true })
})

app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found.' }))

// ---------- First staff member ----------
if (db.prepare('SELECT COUNT(*) AS n FROM staff').get().n === 0) {
  const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env
  if (ADMIN_EMAIL && ADMIN_PASSWORD && ADMIN_PASSWORD.length >= 10) {
    db.prepare('INSERT INTO staff (email,name,password_hash,created) VALUES (?,?,?,?)').run(ADMIN_EMAIL.toLowerCase(), 'Admin', hashPassword(ADMIN_PASSWORD), new Date().toISOString())
    console.log(`Created first staff login: ${ADMIN_EMAIL}`)
  } else console.warn('No staff yet. Set ADMIN_EMAIL and ADMIN_PASSWORD (10+ characters) and restart.')
}
if (!emailConfigured) console.warn('Email not configured (SMTP_HOST/SMTP_USER/SMTP_PASS). Tickets are saved but not emailed.')

// ---------- Serve the website (production) ----------
const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist')
if (existsSync(dist)) app.use(express.static(dist))

const port = Number(process.env.PORT || 3001)
app.listen(port, () => console.log(`HelpDesk server on http://localhost:${port}`))
