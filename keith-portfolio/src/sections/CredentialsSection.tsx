import FadeIn from '../components/FadeIn';
import { certifications, education } from '../data/content';

export default function CredentialsSection() {
  return (
    <section id="credentials" className="px-5 py-20 sm:px-8 sm:py-24 md:px-10 md:py-32">
      <FadeIn>
        <h2 className="hero-heading mb-10 text-center font-black uppercase leading-none tracking-tight sm:mb-14" style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}>
          Credentials
        </h2>
      </FadeIn>
      <FadeIn>
        <div className="mx-auto mb-12 flex max-w-5xl flex-col items-center gap-1 text-center text-[#D7E2EA] sm:mb-16">
          <span className="text-xs font-light uppercase tracking-widest opacity-70 sm:text-sm">Education</span>
          <strong className="font-medium uppercase" style={{ fontSize: 'clamp(1.1rem, 2.2vw, 2.1rem)' }}>{education.degree}</strong>
          <span className="font-light opacity-70">{education.school}, {education.year}</span>
        </div>
      </FadeIn>
      <div className="mx-auto grid max-w-5xl gap-3 sm:grid-cols-2">
        {certifications.map((c, i) => (
          <FadeIn key={c} delay={(i % 2) * 0.08}>
            <div className="flex h-full items-center gap-4 rounded-3xl border border-[#D7E2EA]/25 p-5 sm:p-6">
              <span className="hero-heading text-3xl font-black leading-none sm:text-4xl">{String(i + 1).padStart(2, '0')}</span>
              <p className="min-w-0 font-medium uppercase leading-snug text-[#D7E2EA]" style={{ fontSize: 'clamp(0.85rem, 1.4vw, 1.1rem)' }}>{c}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
