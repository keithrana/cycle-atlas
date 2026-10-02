import FadeIn from '../components/FadeIn';
import AnimatedText from '../components/AnimatedText';
import ContactButton from '../components/ContactButton';
import { aboutText, images, stats } from '../data/content';

export default function AboutSection() {
  return (
    <section id="about" className="relative flex min-h-screen flex-col items-center justify-center gap-16 px-5 py-20 sm:gap-20 sm:px-8 md:gap-24 md:px-10">
      <FadeIn delay={0.1} x={-80} y={0} duration={0.9} className="absolute left-[1%] top-[3%] w-[90px] sm:left-[2%] sm:w-[130px] md:left-[4%] md:w-[170px]">
        <img src={images.signalMark} alt="" className="aspect-square w-full rounded-2xl object-cover" />
      </FadeIn>
      <FadeIn delay={0.25} x={-80} y={0} duration={0.9} className="absolute bottom-[4%] left-[3%] w-[100px] sm:left-[6%] sm:w-[150px] md:left-[10%] md:w-[200px]">
        <img src={images.systems} alt="" className="aspect-[4/3] w-full -rotate-6 rounded-2xl object-cover" />
      </FadeIn>
      <FadeIn delay={0.15} x={80} y={0} duration={0.9} className="absolute right-[1%] top-[3%] w-[100px] sm:right-[2%] sm:w-[150px] md:right-[4%] md:w-[210px]">
        <img src={images.leadership} alt="" className="aspect-[3/2] w-full rotate-6 rounded-2xl object-cover" />
      </FadeIn>
      <FadeIn delay={0.3} x={80} y={0} duration={0.9} className="absolute bottom-[4%] right-[3%] sm:right-[6%] md:right-[10%]">
        <div className="flex gap-2 sm:gap-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-[#D7E2EA]/30 px-2.5 py-2 text-center sm:px-5 sm:py-3">
              <div className="hero-heading text-2xl font-black leading-none sm:text-5xl md:text-6xl">{s.value}</div>
              <div className="mt-1 whitespace-nowrap text-[9px] font-light uppercase tracking-wide text-[#D7E2EA] sm:text-xs">{s.label}</div>
            </div>
          ))}
        </div>
      </FadeIn>

      <div className="relative z-10 flex flex-col items-center gap-10 sm:gap-14 md:gap-16">
        <FadeIn delay={0} y={40}>
          <h2 className="hero-heading text-center font-black uppercase leading-none tracking-tight" style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}>
            About me
          </h2>
        </FadeIn>
        <AnimatedText
          text={aboutText}
          className="max-w-[560px] text-center font-medium leading-relaxed text-[#D7E2EA]"
          style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)' }}
        />
      </div>
      <div className="relative z-10 mb-24 sm:mb-28 md:mb-0">
        <ContactButton />
      </div>
    </section>
  );
}
