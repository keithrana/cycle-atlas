import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Check } from 'lucide-react';
import FadeIn from '../components/FadeIn';
import ProjectDiagram from '../components/ProjectDiagram';
import { projects } from '../data/content';

type Project = (typeof projects)[number];

const radius = 'rounded-[40px] sm:rounded-[50px] md:rounded-[60px]';

function ProjectCard({ project, index, total }: { project: Project; index: number; total: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start start'] });
  const targetScale = 1 - (total - 1 - index) * 0.03;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);

  return (
    <div ref={ref} className="sticky top-24 min-h-[85vh]">
      <motion.div
        className={`border-2 border-[#D7E2EA] bg-[#0C0C0C] p-4 sm:p-6 md:p-8 ${radius}`}
        style={{ scale, top: `${index * 28}px`, position: 'relative', transformOrigin: 'top center' }}
      >
        <div className="mb-4 flex flex-col gap-3 sm:mb-6 md:flex-row md:items-center md:justify-between md:gap-10">
          <div className="flex items-center gap-4 sm:gap-8">
            <span className="hero-heading font-black leading-none" style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}>
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className="min-w-0 text-[#D7E2EA]">
              <p className="text-xs font-light uppercase tracking-widest opacity-70 sm:text-sm">{project.category}</p>
              <h3 className="font-medium uppercase" style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}>{project.name}</h3>
            </div>
          </div>
          <p className="max-w-xl px-1 font-light leading-relaxed text-[#D7E2EA]/70" style={{ fontSize: 'clamp(0.85rem, 1.5vw, 1.15rem)' }}>
            {project.body}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
          <div className="flex flex-col gap-3 sm:w-[40%] sm:gap-4">
            <img
              src={project.photo}
              alt=""
              loading="lazy"
              className={`hidden w-full object-cover sm:block ${radius}`}
              style={{ height: 'clamp(130px, 16vw, 230px)', objectPosition: project.photoPosition }}
            />
            <div
              className={`flex flex-1 flex-col justify-center gap-3 border border-[#D7E2EA]/25 p-5 sm:gap-4 sm:p-6 md:p-8 ${radius}`}
              style={{ background: 'linear-gradient(135deg, #14161a, #1d2127)', minHeight: 'clamp(160px, 22vw, 340px)' }}
            >
              <span className="text-xs font-medium uppercase tracking-widest text-[#D7E2EA]/60 sm:text-sm">Delivered</span>
              <ul className="flex flex-col gap-2 sm:gap-3">
                {project.delivered.map((d) => (
                  <li key={d} className="flex gap-2 font-light leading-snug text-[#D7E2EA]" style={{ fontSize: 'clamp(0.8rem, 1.3vw, 1.1rem)' }}>
                    <Check className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div
            className={`order-first flex items-center justify-center border border-[#D7E2EA]/25 p-3 sm:order-none sm:w-[60%] sm:p-5 md:p-8 ${radius}`}
            style={{ background: 'linear-gradient(135deg, #14161a, #1d2127)' }}
          >
            <ProjectDiagram kind={project.diagram} className="h-auto w-full" style={{ maxHeight: "clamp(240px, 30vw, 430px)" }} />
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
          Projects
        </h2>
      </FadeIn>
      {projects.map((p, i) => (
        <ProjectCard key={p.name} project={p} index={i} total={projects.length} />
      ))}
    </section>
  );
}
