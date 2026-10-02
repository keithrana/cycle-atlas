import { scryptSync, randomBytes, timingSafeEqual, createHash } from 'node:crypto'
import { db } from './db.js'

export const SESSION_DAYS = 7
export const hashPassword = (pw) => {
  const salt = randomBytes(16)
  return `${salt.toString('hex')}:${scryptSync(pw, salt, 64).toString('hex')}`
}
export const verifyPassword = (pw, stored) => {
  const [salt, hash] = stored.split(':')
  const a = Buffer.from(hash, 'hex')
  const b = scryptSync(pw, Buffer.from(salt, 'hex'), 64)
  return a.length === b.length && timingSafeEqual(a, b)
}
const sha = (t) => createHash('sha256').update(t).digest('hex')

export function createSession(staffId) {
  const token = randomBytes(32).toString('hex')
  db.prepare('INSERT INTO sessions VALUES (?,?,?)').run(sha(token), staffId, Date.now() + SESSION_DAYS * 864e5)
  return token
}
export const destroySession = (token) => db.prepare('DELETE FROM sessions WHERE token_hash=?').run(sha(token))

function cookieToken(req) {
  const m = /(?:^|;\s*)session=([a-f0-9]{64})/.exec(req.headers.cookie || '')
  return m ? m[1] : null
}
export { cookieToken }

export function requireStaff(req, res, next) {
  const token = cookieToken(req)
  const row = token && db.prepare('SELECT s.id, s.email, s.name, x.expires FROM sessions x JOIN staff s ON s.id=x.staff_id WHERE x.token_hash=?').get(sha(token))
  if (!row || row.expires < Date.now()) return res.status(401).json({ error: 'Please log in.' })
  req.staff = row
  next()
}

// Tiny in-memory rate limiter: `max` hits per `windowMs` per IP+bucket.
const hits = new Map()
export const rateLimit = (bucket, max, windowMs) => (req, res, next) => {
  const key = `${bucket}:${req.ip}`
  const now = Date.now()
  const recent = (hits.get(key) || []).filter((t) => now - t < windowMs)
  if (recent.length >= max) return res.status(429).json({ error: 'Too many tries. Please wait a bit.' })
  recent.push(now)
  hits.set(key, recent)
  next()
}
