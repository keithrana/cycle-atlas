import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowRight, Globe, Instagram, Twitter } from 'lucide-react'
import VideoBackground from './VideoBackground'
import FaqList from './Faq'
import ContactForm from './ContactForm'
import type { Faq } from './types'
import Staff from './Staff'
import faqData from './data/faqs.json'

const bundledFaqs = faqData as Faq[]

export default function App() {
  const [faqs, setFaqs] = useState<Faq[]>(bundledFaqs)
  const [isStaff, setIsStaff] = useState(location.hash.startsWith('#/staff'))
  const categories = useMemo(() => Array.from(new Set(faqs.map((f) => f.category))), [faqs])

  useEffect(() => {
    fetch('/api/faqs').then((r) => (r.ok ? r.json() : Promise.reject())).then(setFaqs).catch(() => {})
    const onHash = () => setIsStaff(location.hash.startsWith('#/staff'))
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string | null>(null)
  const answersRef = useRef<HTMLElement>(null)

  const results = useMemo(() => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean)
    return faqs.filter((f) => {
      if (category && f.category !== category) return false
      const text = `${f.question} ${f.answer} ${f.category}`.toLowerCase()
      return words.every((w) => text.includes(w))
    })
  }, [query, category, faqs])

  if (isStaff) return <Staff />

  const scrollToAnswers = () => answersRef.current?.scrollIntoView({ behavior: 'smooth' })

  return (
    <div className="bg-black">
      <div className="min-h-screen bg-black overflow-hidden relative flex flex-col">
        <VideoBackground />

        <nav className="relative z-20 pl-6 pr-6 py-6">
          <div className="liquid-glass rounded-full px-6 py-3 flex items-center justify-between max-w-5xl mx-auto">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2 text-white font-semibold text-lg">
                <Globe size={24} />
                <span>HelpDesk</span>
              </div>
              <div className="hidden md:flex items-center gap-8">
                {[
                  ['Topics', '#answers'],
                  ['Search', '#top'],
                  ['Contact', '#contact'],
                ].map(([label, href]) => (
                  <a key={label} href={href} className="text-white/80 hover:text-white transition-colors text-sm font-medium">
                    {label}
                  </a>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a href="#contact" className="text-white text-sm font-medium">Contact IT</a>
              <a href="#/staff" className="liquid-glass rounded-full px-6 py-2 text-white text-sm font-medium">Staff login</a>
            </div>
          </div>
        </nav>

        <div
          id="top"
          className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center -translate-y-[20%]"
        >
          <h1
            className="text-5xl md:text-6xl lg:text-7xl text-white mb-8 tracking-tight whitespace-nowrap"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            IT help, <em>made simple</em>
          </h1>
          <div className="max-w-xl w-full space-y-4">
            <form
              className="liquid-glass rounded-full pl-6 pr-2 py-2 flex items-center gap-3"
              onSubmit={(e) => {
                e.preventDefault()
                scrollToAnswers()
              }}
            >
              <input
                type="text"
                value={query}
                maxLength={200}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Describe your problem"
                aria-label="Search IT help"
                className="bg-transparent outline-none flex-1 text-white placeholder:text-white/40 text-base"
              />
              <button type="submit" aria-label="Search" className="bg-white rounded-full p-3 text-black">
                <ArrowRight size={20} />
              </button>
            </form>
            <p className="text-white text-sm leading-relaxed px-4">
              Locked out? Wi-Fi down? Printer acting up? Search {faqs.length} plain-English answers to the most common IT problems.
            </p>
            <div className="flex justify-center">
              <button
                onClick={scrollToAnswers}
                className="liquid-glass rounded-full px-8 py-3 text-white text-sm font-medium hover:bg-white/5 transition-colors"
              >
                Browse all topics
              </button>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex justify-center gap-4 pb-12">
          {[
            { Icon: Instagram, label: 'Instagram' },
            { Icon: Twitter, label: 'Twitter' },
            { Icon: Globe, label: 'Website' },
          ].map(({ Icon, label }) => (
            <button
              key={label}
              aria-label={label}
              className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all"
            >
              <Icon size={20} />
            </button>
          ))}
        </div>
      </div>

      <section id="answers" ref={answersRef} className="max-w-3xl mx-auto px-6 py-20">
        <h2 className="text-4xl text-white mb-2" style={{ fontFamily: "'Instrument Serif', serif" }}>
          Answers
        </h2>
        <p className="text-white/60 text-sm mb-6" aria-live="polite">
          Showing {results.length} of {faqs.length}
        </p>
        <div className="flex flex-wrap gap-2 mb-8">
          {[null, ...categories].map((c) => (
            <button
              key={c ?? 'all'}
              onClick={() => setCategory(c)}
              aria-pressed={category === c}
              className={`liquid-glass rounded-full px-4 py-2 text-sm transition-colors ${
                category === c ? 'bg-white/20 text-white' : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              {c ?? 'All'}
            </button>
          ))}
        </div>
        <FaqList items={results} />
      </section>

      <ContactForm topics={categories} />

      <footer id="about" className="max-w-3xl mx-auto px-6 pb-16 text-center text-white/50 text-sm">
        General guidance only. For account-specific problems, contact your organisation's IT service desk.
      </footer>
    </div>
  )
}
