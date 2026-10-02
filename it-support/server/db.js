import { DatabaseSync } from 'node:sqlite'
import { readFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const dataDir = process.env.DATA_DIR || join(here, 'data')
mkdirSync(dataDir, { recursive: true })

export const db = new DatabaseSync(join(dataDir, 'helpdesk.db'))
db.exec(`
CREATE TABLE IF NOT EXISTS faqs (id INTEGER PRIMARY KEY AUTOINCREMENT, category TEXT NOT NULL, question TEXT NOT NULL, answer TEXT NOT NULL, link TEXT NOT NULL DEFAULT '', link_label TEXT NOT NULL DEFAULT '');
CREATE TABLE IF NOT EXISTS tickets (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL, topic TEXT NOT NULL, message TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'open', emailed INTEGER NOT NULL DEFAULT 0, created TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS votes (id INTEGER PRIMARY KEY AUTOINCREMENT, faq_id INTEGER NOT NULL, vote TEXT NOT NULL, created TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS staff (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT NOT NULL UNIQUE, name TEXT NOT NULL, password_hash TEXT NOT NULL, created TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS sessions (token_hash TEXT PRIMARY KEY, staff_id INTEGER NOT NULL, expires INTEGER NOT NULL);
`)

// First run: copy the 87 FAQs from the bundled file into the real database.
if (db.prepare('SELECT COUNT(*) AS n FROM faqs').get().n === 0) {
  const seed = JSON.parse(readFileSync(join(here, '..', 'src', 'data', 'faqs.json'), 'utf8'))
  const ins = db.prepare('INSERT INTO faqs (id, category, question, answer, link, link_label) VALUES (?,?,?,?,?,?)')
  for (const f of seed) ins.run(f.id, f.category, f.question, f.answer, f.link, f.linkLabel)
}
