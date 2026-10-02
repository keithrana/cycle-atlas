import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { expertise, images } from '../data/content';

const TILE_W = 420;
const GAP = 12;

const photoTiles: { src: string; alt: string; position: string }[] = [
  { src: images.portrait, alt: 'Keith Rana at his work desk', position: 'center 20%' },
  { src: images.leadership, alt: 'Hands organising a service-delivery briefing', position: 'center' },
  { src: images.systems, alt: 'Abstract composition of connected service pathways', position: 'center' },
];

const photos = photoTiles.map((t) => (
  <img
    key={t.alt}
    src={t.src}
    alt={t.alt}
    loading="lazy"
    className="h-[270px] w-[420px] shrink-0 rounded-2xl object-cover"
    style={{ objectPosition: t.position }}
  />
));

const skills = expertise.map((e, i) => (
  <div
    key={e.name}
    className="flex h-[270px] w-[420px] shrink-0 flex-col justify-between rounded-2xl border border-[#D7E2EA]/25 p-6"
    style={{ background: 'linear-gradient(135deg, #14161a, #1d2127)' }}
  >
    <span className="hero-heading text-5xl font-black leading-none">{String(i + 1).padStart(2, '0')}</span>
    <span className="text-2xl font-medium uppercase leading-tight text-[#D7E2EA]">{e.name}</span>
  </div>
));

function Row({ tiles, setWidth, transform }: { tiles: ReactNode[]; setWidth: number; transform: string }) {
  return (
    <div className="flex" style={{ gap: GAP, marginLeft: -setWidth, transform, willChange: 'transform' }} aria-hidden={tiles === skills}>
      {[0, 1, 2].map((copy) => (
        <div key={copy} className="flex" style={{ gap: GAP }}>
          {tiles}
        </div>
      ))}
    </div>
  );
}

export default function MarqueeSection() {
  const ref = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      const top = ref.current.getBoundingClientRect().top + window.scrollY;
      setOffset((window.scrollY - top + window.innerHeight) * 0.3);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const width = (n: number) => n * (TILE_W + GAP) + GAP;

  return (
    <section ref={ref} className="flex flex-col gap-3 bg-[#0C0C0C] pb-10 pt-24 sm:pt-32 md:pt-40" style={{ overflow: 'clip' }}>
      <Row tiles={photos} setWidth={width(photos.length)} transform={`translateX(${offset - 200}px)`} />
      <Row tiles={skills} setWidth={width(skills.length)} transform={`translateX(${-(offset - 200)}px)`} />
    </section>
  );
}
