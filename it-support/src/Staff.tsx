import { useCallback, useEffect, useState } from 'react'
import { LogOut } from 'lucide-react'

interface Ticket { id: string; name: string; email: string; topic: string; message: string; status: string; emailed: number; created: string }
interface StaffFaq { id: number; category: string; question: string; answer: string; link: string; linkLabel: string; up: number; down: number }
interface Member { id: number; email: string; name: string }
type Tab = 'tickets' | 'faqs' | 'team'

async function api<T = unknown>(path: string, method = 'GET', body?: unknown): Promise<T> {
  const res = await fetch(`/api${path}`, { method, headers: body ? { 'Content-Type': 'application/json' } : undefined, body: body ? JSON.stringify(body) : undefined })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw Object.assign(new Error(data.error || 'Request failed'), { status: res.status })
  return data as T
}

const box = 'liquid-glass rounded-3xl p-6 text-white'
const input = 'w-full bg-white/5 rounded-2xl px-4 py-3 text-white placeholder:text-white/40 outline-none'
const btn = 'liquid-glass rounded-full px-5 py-2 text-sm text-white hover:bg-white/5 transition-colors'

function Login({ onDone }: { onDone: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    try { await api('/login', 'POST', { email, password }); onDone() } catch (err) { setError((err as Error).message) }
  }
  return (
    <form onSubmit={submit} className={`${box} max-w-sm mx-auto space-y-3`}>
      <h1 className="text-3xl mb-2" style={{ fontFamily: "'Instrument Serif', serif" }}>Staff login</h1>
      <input className={input} type="email" placeholder="Email" aria-label="Email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" />
      <input className={input} type="password" placeholder="Password" aria-label="Password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
      {error && <p role="alert" className="text-red-300 text-sm">{error}</p>}
      <button type="submit" className="bg-white text-black rounded-full px-6 py-2 text-sm font-medium">Log in</button>
    </form>
  )
}

function Tickets() {
  const [rows, setRows] = useState<Ticket[]>([])
  const load = useCallback(() => api<Ticket[]>('/staff/tickets').then(setRows), [])
  useEffect(() => { load() }, [load])
  const setStatus = async (id: string, status: string) => { await api(`/staff/tickets/${id}`, 'PATCH', { status }); load() }
  if (!rows.length) return <p className="text-white/60">No tickets yet.</p>
  return (
    <ul className="space-y-3">
      {rows.map((t) => (
        <li key={t.id} className={box}>
          <div className="flex flex-wrap justify-between gap-2 text-sm text-white/60">
            <span>{t.id} · {t.topic} · {new Date(t.created).toLocaleString()}</span>
            <span>{t.emailed ? 'emailed' : 'not emailed'}</span>
          </div>
          <p className="mt-2 whitespace-pre-wrap">{t.message}</p>
          <p className="mt-2 text-sm text-white/70">{t.name} · <a className="underline" href={`mailto:${encodeURIComponent(t.email)}`}>{t.email}</a></p>
          <select aria-label="Status" value={t.status} onChange={(e) => setStatus(t.id, e.target.value)} className="mt-3 bg-white/10 rounded-full px-4 py-2 text-sm [&>option]:text-black">
            <option value="open">Open</option><option value="in_progress">In progress</option><option value="closed">Closed</option>
          </select>
        </li>
      ))}
    </ul>
  )
}

const emptyFaq = { category: '', question: '', answer: '', link: '', linkLabel: '' }
function Faqs() {
  const [rows, setRows] = useState<StaffFaq[]>([])
  const [editing, setEditing] = useState<(typeof emptyFaq & { id?: number }) | null>(null)
  const [error, setError] = useState('')
  const load = useCallback(() => api<StaffFaq[]>('/staff/faqs').then(setRows), [])
  useEffect(() => { load() }, [load])
  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editing) return
    try {
      if (editing.id) await api(`/staff/faqs/${editing.id}`, 'PUT', editing)
      else await api('/staff/faqs', 'POST', editing)
      setEditing(null); setError(''); load()
    } catch (err) { setError((err as Error).message) }
  }
  const remove = async (f: StaffFaq) => { if (confirm(`Delete "${f.question}"?`)) { await api(`/staff/faqs/${f.id}`, 'DELETE'); load() } }
  const set = (k: keyof typeof emptyFaq) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => editing && setEditing({ ...editing, [k]: e.target.value })
  return (
    <div className="space-y-4">
      {editing ? (
        <form onSubmit={save} className={`${box} space-y-3`}>
          <input className={input} placeholder="Category" aria-label="Category" value={editing.category} onChange={set('category')} />
          <input className={input} placeholder="Question" aria-label="Question" value={editing.question} onChange={set('question')} />
          <textarea className={input} rows={5} placeholder="Answer" aria-label="Answer" value={editing.answer} onChange={set('answer')} />
          <input className={input} placeholder="Link (optional, https://...)" aria-label="Link" value={editing.link} onChange={set('link')} />
          <input className={input} placeholder="Link label (optional)" aria-label="Link label" value={editing.linkLabel} onChange={set('linkLabel')} />
          {error && <p role="alert" className="text-red-300 text-sm">{error}</p>}
          <div className="flex gap-2"><button type="submit" className="bg-white text-black rounded-full px-6 py-2 text-sm font-medium">Save</button><button type="button" className={btn} onClick={() => { setEditing(null); setError('') }}>Cancel</button></div>
        </form>
      ) : <button className={btn} onClick={() => setEditing({ ...emptyFaq })}>+ Add FAQ</button>}
      <ul className="space-y-2">
        {rows.map((f) => (
          <li key={f.id} className={`${box} flex flex-wrap items-center justify-between gap-3 !py-4`}>
            <span><span className="block text-xs text-white/50">{f.category}</span>{f.question}</span>
            <span className="flex items-center gap-3 text-sm text-white/70">
              👍 {f.up} 👎 {f.down}
              <button className={btn} onClick={() => setEditing(f)}>Edit</button>
              <button className={btn} onClick={() => remove(f)}>Delete</button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Team({ me }: { me: string }) {
  const [rows, setRows] = useState<Member[]>([])
  const [f, setF] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const load = useCallback(() => api<Member[]>('/staff/team').then(setRows), [])
  useEffect(() => { load() }, [load])
  const add = async (e: React.FormEvent) => {
    e.preventDefault()
    try { await api('/staff/team', 'POST', f); setF({ name: '', email: '', password: '' }); setError(''); load() } catch (err) { setError((err as Error).message) }
  }
  const remove = async (m: Member) => { if (confirm(`Remove ${m.name}?`)) { try { await api(`/staff/team/${m.id}`, 'DELETE'); load() } catch (err) { setError((err as Error).message) } } }
  return (
    <div className="space-y-4">
      <ul className="space-y-2">
        {rows.map((m) => (
          <li key={m.id} className={`${box} flex items-center justify-between !py-4`}>
            <span>{m.name} <span className="text-white/60 text-sm">· {m.email}</span></span>
            {m.email !== me && <button className={btn} onClick={() => remove(m)}>Remove</button>}
          </li>
        ))}
      </ul>
      <form onSubmit={add} className={`${box} space-y-3`}>
        <h2 className="text-xl">Add a team member</h2>
        <input className={input} placeholder="Name" aria-label="Name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
        <input className={input} type="email" placeholder="Email" aria-label="Email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
        <input className={input} type="password" placeholder="Temporary password (10+ characters)" aria-label="Password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} autoComplete="new-password" />
        {error && <p role="alert" className="text-red-300 text-sm">{error}</p>}
        <button type="submit" className="bg-white text-black rounded-full px-6 py-2 text-sm font-medium">Add</button>
      </form>
    </div>
  )
}

export default function Staff() {
  const [me, setMe] = useState<{ name: string; email: string } | null | undefined>(undefined)
  const [emailOk, setEmailOk] = useState(true)
  const [tab, setTab] = useState<Tab>('tickets')
  const check = useCallback(() => {
    api<{ name: string; email: string }>('/me').then((m) => { setMe(m); api<{ emailConfigured: boolean }>('/staff/status').then((s) => setEmailOk(s.emailConfigured)) }).catch(() => setMe(null))
  }, [])
  useEffect(() => { check() }, [check])
  const logout = async () => { await api('/logout', 'POST'); setMe(null) }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <a href="#" className="text-white/70 hover:text-white text-sm">← Back to site</a>
          {me && <button onClick={logout} className={`${btn} inline-flex items-center gap-2`}><LogOut size={14} /> Log out ({me.name})</button>}
        </div>
        {me === undefined ? <p className="text-white/60">Loading...</p> : me === null ? <Login onDone={check} /> : (
          <>
            {!emailOk && <p className="mb-4 text-amber-300 text-sm">Email is not set up on the server yet, so new tickets are saved here but not emailed.</p>}
            <div className="flex gap-2 mb-6">
              {(['tickets', 'faqs', 'team'] as Tab[]).map((t) => (
                <button key={t} onClick={() => setTab(t)} aria-pressed={tab === t} className={`${btn} capitalize ${tab === t ? 'bg-white/20' : ''}`}>{t === 'faqs' ? 'FAQs' : t}</button>
              ))}
            </div>
            {tab === 'tickets' && <Tickets />}{tab === 'faqs' && <Faqs />}{tab === 'team' && <Team me={me.email} />}
          </>
        )}
      </div>
    </div>
  )
}
