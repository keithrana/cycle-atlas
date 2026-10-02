import { Check } from 'lucide-react';
import FadeIn from '../components/FadeIn';
import { foundations, roles } from '../data/content';

export default function ExperienceSection() {
  return (
    <section id="experience" className="bg-white px-5 pb-28 pt-20 sm:px-8 sm:pb-32 sm:pt-24 md:px-10 md:pb-40 md:pt-32">
      <FadeIn>
        <h2 className="mb-16 text-center font-black uppercase leading-none text-[#0C0C0C] sm:mb-20 md:mb-28" style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}>
          Experience
        </h2>
      </FadeIn>
      <div className="mx-auto max-w-5xl">
        {roles.map((r, i) => (
          <FadeIn key={r.role + r.organisation}>
            <article className="grid gap-4 py-8 sm:py-10 md:grid-cols-[220px_1fr] md:gap-12 md:py-12" style={{ borderTop: '1px solid rgba(12, 12, 12, 0.15)' }}>
              <div className="flex flex-col gap-1 text-[#0C0C0C]">
                <span className="text-sm font-medium uppercase tracking-wider opacity-60">{r.dates}</span>
                <span className="font-black uppercase leading-tight" style={{ fontSize: 'clamp(1.1rem, 1.8vw, 1.5rem)' }}>{r.organisation}</span>
                <span className="text-sm font-light opacity-60">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <div className="flex min-w-0 flex-col gap-4 text-[#0C0C0C]">
                <h3 className="font-medium uppercase" style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}>{r.role}</h3>
                <p className="max-w-2xl font-light leading-relaxed opacity-70" style={{ fontSize: 'clamp(0.9rem, 1.6vw, 1.2rem)' }}>{r.summary}</p>
                <ul className="flex max-w-2xl flex-col gap-3">
                  {r.points.map((p) => (
                    <li key={p} className="flex gap-3 font-light leading-relaxed" style={{ fontSize: 'clamp(0.85rem, 1.4vw, 1.05rem)' }}>
                      <Check size={18} className="mt-1 shrink-0" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </FadeIn>
        ))}

        <FadeIn>
          <div className="grid gap-6 py-10 md:grid-cols-[220px_1fr] md:gap-12 md:py-12" style={{ borderTop: '1px solid rgba(12, 12, 12, 0.15)' }}>
            <h3 className="text-sm font-medium uppercase tracking-wider text-[#0C0C0C] opacity-60">Earlier foundations</h3>
            <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
              {foundations.map((f) => (
                <div key={f.role + f.organisation} className="flex min-w-0 flex-col text-[#0C0C0C]">
                  <span className="text-xs font-medium uppercase tracking-wider opacity-60">{f.dates}</span>
                  <strong className="font-medium uppercase">{f.role}</strong>
                  <span className="font-light opacity-70">{f.organisation}</span>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
