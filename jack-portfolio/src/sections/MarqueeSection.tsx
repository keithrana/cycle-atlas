import { useEffect, useRef, useState } from 'react';
import { marqueeImages } from '../data/content';

const row1 = marqueeImages.slice(0, 11);
const row2 = marqueeImages.slice(11);

function Row({ images, transform }: { images: string[]; transform: string }) {
  const tripled = [...images, ...images, ...images];
  return (
    <div className="flex gap-3" style={{ transform, willChange: 'transform' }}>
      {tripled.map((src, i) => (
        <img
          key={i}
          src={src}
          alt=""
          loading="lazy"
          className="rounded-2xl object-cover"
          style={{ width: 420, height: 270, flexShrink: 0 }}
        />
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
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section ref={ref} className="flex flex-col gap-3 bg-[#0C0C0C] pb-10 pt-24 sm:pt-32 md:pt-40" style={{ overflow: 'clip' }}>
      <Row images={row1} transform={`translateX(${offset - 200}px)`} />
      <Row images={row2} transform={`translateX(${-(offset - 200)}px)`} />
    </section>
  );
}
