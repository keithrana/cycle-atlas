import FadeIn from '../components/FadeIn';
import Magnet from '../components/Magnet';
import ContactButton from '../components/ContactButton';
import { images, profile } from '../data/content';

const links = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];

export default function HeroSection() {
  return (
    <section className="relative flex h-screen min-h-[600px] flex-col" style={{ overflowX: 'clip' }}>
      <FadeIn delay={0} y={-20}>
        <nav className="flex justify-between px-6 pt-6 md:px-10 md:pt-8" aria-label="Section navigation">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm font-medium uppercase tracking-wider text-[#D7E2EA] transition-opacity duration-200 hover:opacity-70 md:text-lg lg:text-[1.4rem]"
            >
              {l.label}
            </a>
          ))}
        </nav>
      </FadeIn>

      <div className="overflow-hidden">
        <FadeIn delay={0.15} y={40}>
          <h1 className="hero-heading mt-6 w-full whitespace-nowrap text-center text-[16.5vw] font-black uppercase leading-none tracking-tight sm:mt-4 md:-mt-5">
            Hi, i’m {profile.firstName}
          </h1>
        </FadeIn>
      </div>

      <div className="absolute left-1/2 top-1/2 z-10 w-[min(280px,52vh)] -translate-x-1/2 -translate-y-1/2 sm:bottom-0 sm:top-auto sm:w-[min(360px,56vh)] sm:translate-y-0 md:w-[min(440px,58vh)] lg:w-[min(520px,58vh)]">
        <FadeIn delay={0.6} y={30}>
          <Magnet padding={150} strength={3} activeTransition="transform 0.3s ease-out" inactiveTransition="transform 0.6s ease-in-out" className="!block">
            <img
              src={images.portrait}
              alt="Keith Rana at his work desk"
              className="aspect-square w-full border border-[#D7E2EA]/30 object-cover object-top"
              style={{ borderRadius: '999px 999px 32px 32px' }}
            />
          </Magnet>
        </FadeIn>
      </div>

      <div className="mt-auto flex items-end justify-between gap-4 px-6 pb-7 sm:pb-8 md:px-10 md:pb-10">
        <FadeIn delay={0.35} y={20}>
          <p
            className="max-w-[160px] font-light uppercase leading-snug tracking-wide text-[#D7E2EA] sm:max-w-[220px] md:max-w-[260px]"
            style={{ fontSize: 'clamp(0.7rem, 1.4vw, 1.5rem)' }}
          >
            {profile.tagline}
          </p>
        </FadeIn>
        <FadeIn delay={0.5} y={20} className="relative z-20">
          <ContactButton />
        </FadeIn>
      </div>
    </section>
  );
}
