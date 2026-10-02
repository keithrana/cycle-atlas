import { ExternalLink, SearchX } from 'lucide-react'
import type { Faq } from './types'

function safeUrl(url: string): string | null {
  try {
    const u = new URL(url)
    return u.protocol === 'https:' || u.protocol === 'http:' ? u.href : null
  } catch {
    return null
  }
}

export default function FaqList({ items }: { items: Faq[] }) {
  if (items.length === 0) {
    return (
      <div className="liquid-glass rounded-3xl p-10 text-center text-white/70">
        <SearchX className="mx-auto mb-3" size={28} />
        <p>No answers found. Try different words, or contact your IT service desk.</p>
      </div>
    )
  }
  return (
    <ul className="space-y-3">
      {items.map((f) => {
        const href = f.link ? safeUrl(f.link) : null
        return (
          <li key={f.id}>
            <details className="liquid-glass rounded-3xl group">
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
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-4 text-white hover:underline"
                  >
                    {f.linkLabel || 'Official guide'} <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </details>
          </li>
        )
      })}
    </ul>
  )
}
