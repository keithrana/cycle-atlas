import { useState } from 'react'
import { Send } from 'lucide-react'
import { load, save } from './storage'

interface Ticket { id: string; name: string; email: string; topic: string; message: string; created: string }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const inputCls = 'w-full bg-transparent outline-none text-white placeholder:text-white/40 text-base'

export default function ContactForm({ topics }: { topics: string[] }) {
  const [form, setForm] = useState({ name: '', email: '', topic: topics[0] ?? '', message: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [ticketId, setTicketId] = useState<string | null>(null)

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [k]: e.target.value })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!form.name.trim()) errs.name = 'Please enter your name.'
    if (!EMAIL_RE.test(form.email.trim())) errs.email = 'Please enter a valid email.'
    if (form.message.trim().length < 10) errs.message = 'Please describe the problem (at least 10 characters).'
    setErrors(errs)
    if (Object.keys(errs).length) return
    const id = `IT-${Date.now().toString(36).toUpperCase()}`
    const ticket: Ticket = { id, ...form, created: new Date().toISOString() }
    save('tickets', [...load<Ticket[]>('tickets', []), ticket])
    setTicketId(id)
    setForm({ name: '', email: '', topic: topics[0] ?? '', message: '' })
  }

  const field = 'liquid-glass rounded-3xl px-6 py-4'
  const err = (k: string) => errors[k] && <p role="alert" className="text-red-300 text-sm mt-1 px-2">{errors[k]}</p>

  return (
    <section id="contact" className="max-w-3xl mx-auto px-6 pb-20">
      <h2 className="text-4xl text-white mb-2" style={{ fontFamily: "'Instrument Serif', serif" }}>Contact IT</h2>
      <p className="text-white/60 text-sm mb-6">Can't find your answer? Tell us what's wrong.</p>
      {ticketId ? (
        <div className="liquid-glass rounded-3xl p-8 text-white" role="status">
          <p className="text-xl mb-2">Request saved. Your ticket number is <strong>{ticketId}</strong>.</p>
          <p className="text-white/70 text-sm mb-4">
            Heads up: this demo version only saves the request in this browser. It is not yet sent to an IT team. Real sending arrives in the next phase.
          </p>
          <button onClick={() => setTicketId(null)} className="liquid-glass rounded-full px-6 py-2 text-sm hover:bg-white/5">Send another</button>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="space-y-3">
          <div>
            <div className={field}><input className={inputCls} placeholder="Your name" aria-label="Your name" maxLength={100} value={form.name} onChange={set('name')} /></div>
            {err('name')}
          </div>
          <div>
            <div className={field}><input className={inputCls} type="email" placeholder="Your email" aria-label="Your email" maxLength={200} value={form.email} onChange={set('email')} /></div>
            {err('email')}
          </div>
          <div className={field}>
            <select className={`${inputCls} [&>option]:text-black`} aria-label="Topic" value={form.topic} onChange={set('topic')}>
              {topics.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <div className={field}><textarea className={`${inputCls} resize-none`} rows={5} placeholder="What's the problem?" aria-label="Problem description" maxLength={2000} value={form.message} onChange={set('message')} /></div>
            {err('message')}
          </div>
          <button type="submit" className="bg-white text-black rounded-full px-8 py-3 text-sm font-medium inline-flex items-center gap-2">
            <Send size={16} /> Send request
          </button>
        </form>
      )}
    </section>
  )
}
