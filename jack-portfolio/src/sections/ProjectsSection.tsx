import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import FadeIn from '../components/FadeIn';
import LiveProjectButton from '../components/LiveProjectButton';
import { projects } from '../data/content';

type Project = (typeof projects)[number];

const radius = 'rounded-[40px] sm:rounded-[50px] md:rounded-[60px]';

function ProjectCard({ project, index, total }: { project: Project; index: number; total: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start start'] });
  const targetScale = 1 - (total - 1 - index) * 0.03;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);

  return (
    <div ref={ref} className="sticky top-24 h-[85vh] md:top-32">
      <motion.div
        className={`border-2 border-[#D7E2EA] bg-[#0C0C0C] p-4 sm:p-6 md:p-8 ${radius}`}
        style={{ scale, top: `${index * 28}px`, position: 'relative', transformOrigin: 'top center' }}
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4 sm:mb-6">
          <div className="flex items-center gap-4 sm:gap-8">
            <span className="hero-heading font-black leading-none" style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}>
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className="text-[#D7E2EA]">
              <p className="text-xs font-light uppercase tracking-widest opacity-70 sm:text-sm">{project.category}</p>
              <h3 className="font-medium uppercase" style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}>{project.name}</h3>
            </div>
          </div>
          <LiveProjectButton />
        </div>
        <div className="flex gap-3 sm:gap-4">
          <div className="flex w-[40%] flex-col gap-3 sm:gap-4">
            <img src={project.col1[0]} alt="" loading="lazy" className={`w-full object-cover ${radius}`} style={{ height: 'clamp(130px, 16vw, 230px)' }} />
            <img src={project.col1[1]} alt="" loading="lazy" className={`w-full object-cover ${radius}`} style={{ height: 'clamp(160px, 22vw, 340px)' }} />
          </div>
          <div className="w-[60%]">
            <img src={project.col2} alt="" loading="lazy" className={`h-full w-full object-cover ${radius}`} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function ProjectsSection() {
  return (
    <section id="projects" className="relative z-10 -mt-10 rounded-t-[40px] bg-[#0C0C0C] px-5 py-20 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 sm:py-24 md:-mt-14 md:rounded-t-[60px] md:px-10 md:py-32">
      <FadeIn>
        <h2 className="hero-heading mb-16 text-center font-black uppercase leading-none tracking-tight sm:mb-20 md:mb-28" style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}>
          Project
        </h2>
      </FadeIn>
      {projects.map((p, i) => (
        <ProjectCard key={p.name} project={p} index={i} total={projects.length} />
      ))}
    </section>
  );
}
