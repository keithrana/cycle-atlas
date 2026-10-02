import { useEffect, useState } from 'react'
import { Check, ExternalLink, Link2, SearchX, ThumbsDown, ThumbsUp } from 'lucide-react'
import type { Faq } from './types'
import { load, save } from './storage'

type Votes = Record<number, 'up' | 'down'>

function safeUrl(url: string): string | null {
  try {
    const u = new URL(url)
    return u.protocol === 'https:' || u.protocol === 'http:' ? u.href : null
  } catch {
    return null
  }
}

function FaqCard({ f, forceOpen, vote, onVote }: { f: Faq; forceOpen: boolean; vote?: 'up' | 'down'; onVote: (v: 'up' | 'down') => void }) {
  const [copied, setCopied] = useState(false)
  const href = f.link ? safeUrl(f.link) : null

  const copyLink = async () => {
    const url = `${location.origin}${location.pathname}#faq-${f.id}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      location.hash = `faq-${f.id}`
    }
  }

  const voteBtn = (v: 'up' | 'down', label: string, Icon: typeof ThumbsUp) => (
    <button
      onClick={() => onVote(v)}
      aria-pressed={vote === v}
      className={`liquid-glass rounded-full px-4 py-2 inline-flex items-center gap-2 text-sm transition-colors ${
        vote === v ? 'bg-white/20 text-white' : 'text-white/70 hover:text-white hover:bg-white/5'
      }`}
    >
      <Icon size={14} /> {label}
    </button>
  )

  return (
    <li id={`faq-${f.id}`} className="scroll-mt-6">
      <details className="liquid-glass rounded-3xl group" open={forceOpen || undefined}>
        <summary className="cursor-pointer list-none px-6 py-5 flex items-start justify-between gap-4 text-white">
          <span>
            <span className="block text-xs uppercase tracking-wider text-white/50 mb-1">{f.category}</span>
            <span className="text-lg">{f.question}</span>
          </span>
          <span className="text-white/60 transition-transform group-open:rotate-45 text-2xl leading-none">+</span>
        </summary>
        <div className="px-6 pb-6 text-white/80 text-sm leading-relaxed">
          <p>{f.answer}</p>
          {href && (
            <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-4 text-white hover:underline">
              {f.linkLabel || 'Official guide'} <ExternalLink size={14} />
            </a>
          )}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="text-white/50 mr-1">Was this helpful?</span>
            {voteBtn('up', 'Yes', ThumbsUp)}
            {voteBtn('down', 'No', ThumbsDown)}
            <button
              onClick={copyLink}
              className="liquid-glass rounded-full px-4 py-2 inline-flex items-center gap-2 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors ml-auto"
            >
              {copied ? <Check size={14} /> : <Link2 size={14} />} {copied ? 'Link copied' : 'Copy link'}
            </button>
          </div>
          {vote === 'down' && (
            <p className="mt-3 text-white/60">
              Sorry about that. <a href="#contact" className="text-white underline">Contact IT</a> and we'll help directly.
            </p>
          )}
        </div>
      </details>
    </li>
  )
}

export default function FaqList({ items }: { items: Faq[] }) {
  const [votes, setVotes] = useState<Votes>(() => load<Votes>('faq-votes', {}))
  const [hashId, setHashId] = useState<number | null>(null)

  useEffect(() => {
    const read = () => {
      const m = /^#faq-(\d+)$/.exec(location.hash)
      setHashId(m ? Number(m[1]) : null)
      if (m) window.setTimeout(() => document.getElementById(`faq-${m[1]}`)?.scrollIntoView({ behavior: 'smooth' }), 50)
    }
    read()
    window.addEventListener('hashchange', read)
    return () => window.removeEventListener('hashchange', read)
  }, [])

  const onVote = (id: number, v: 'up' | 'down') => {
    const next = { ...votes, [id]: v }
    setVotes(next)
    save('faq-votes', next)
    fetch('/api/votes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ faqId: id, vote: v }) }).catch(() => {})
  }

  if (items.length === 0) {
    return (
      <div className="liquid-glass rounded-3xl p-10 text-center text-white/70">
        <SearchX className="mx-auto mb-3" size={28} />
        <p>No answers found. Try different words, or <a href="#contact" className="text-white underline">contact IT</a>.</p>
      </div>
    )
  }
  return (
    <ul className="space-y-3">
      {items.map((f) => (
        <FaqCard key={f.id} f={f} forceOpen={hashId === f.id} vote={votes[f.id]} onVote={(v) => onVote(f.id, v)} />
      ))}
    </ul>
  )
}
