import { motion } from 'framer-motion';
import type { MotionProps } from 'framer-motion';
import type { ComponentType, ElementType, ReactNode } from 'react';

type FadeInProps = {
  children: ReactNode;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  className?: string;
  as?: ElementType;
};

const cache = new Map<ElementType, ComponentType<MotionProps & { className?: string }>>();
const getMotion = (el: ElementType) => {
  if (!cache.has(el)) cache.set(el, motion.create(el as 'div') as ComponentType<MotionProps & { className?: string }>);
  return cache.get(el)!;
};

export default function FadeIn({
  children,
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  className,
  as = 'div',
}: FadeInProps) {
  const Component = getMotion(as);
  return (
    <Component
      className={className}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '50px', amount: 0 }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </Component>
  );
}
