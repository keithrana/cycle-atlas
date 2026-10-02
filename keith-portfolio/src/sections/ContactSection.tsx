import { ArrowUpRight, Phone } from 'lucide-react';
import FadeIn from '../components/FadeIn';
import ContactButton from '../components/ContactButton';
import { profile } from '../data/content';

export default function ContactSection() {
  return (
    <section id="contact" className="flex flex-col items-center gap-10 px-5 pb-10 pt-20 sm:gap-14 sm:px-8 md:px-10 md:pt-28">
      <FadeIn>
        <h2 className="hero-heading text-center font-black uppercase leading-none tracking-tight" style={{ fontSize: 'clamp(2.6rem, 10vw, 140px)' }}>
          Let’s talk
        </h2>
      </FadeIn>
      <FadeIn>
        <p className="max-w-[560px] text-center font-medium leading-relaxed text-[#D7E2EA]" style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)' }}>
          Based in {profile.location}. Available for the right conversation.
        </p>
      </FadeIn>
      <FadeIn>
        <ContactButton />
      </FadeIn>
      <FadeIn className="w-full max-w-3xl">
        <div className="grid gap-3 sm:grid-cols-2">
          <a href={`mailto:${profile.email}`} className="flex min-w-0 items-center justify-between gap-3 rounded-3xl border border-[#D7E2EA]/25 p-5 text-[#D7E2EA] transition-colors hover:bg-[#D7E2EA]/10">
            <span className="min-w-0">
              <span className="block text-xs font-light uppercase tracking-widest opacity-70">Email</span>
              <strong className="block break-words font-medium">{profile.email}</strong>
            </span>
            <ArrowUpRight size={20} className="shrink-0" />
          </a>
          <a href={profile.phoneHref} className="flex min-w-0 items-center justify-between gap-3 rounded-3xl border border-[#D7E2EA]/25 p-5 text-[#D7E2EA] transition-colors hover:bg-[#D7E2EA]/10">
            <span className="min-w-0">
              <span className="block text-xs font-light uppercase tracking-widest opacity-70">Phone</span>
              <strong className="block font-medium">{profile.phone}</strong>
            </span>
            <Phone size={18} className="shrink-0" />
          </a>
        </div>
      </FadeIn>
      <footer className="mt-10 flex w-full flex-wrap justify-between gap-2 border-t border-[#D7E2EA]/20 pt-6 text-xs font-light uppercase tracking-wider text-[#D7E2EA]/70">
        <span>{profile.name}</span>
        <span>{profile.role}</span>
        <span>{profile.location}</span>
      </footer>
    </section>
  );
}
