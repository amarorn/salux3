import { motion, useMotionValue, useSpring } from 'framer-motion';
import { type MouseEvent, type ReactNode, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useMouseBridge } from '@/landing/MouseBridgeContext';

interface Props {
  to: string;
  children: ReactNode;
  className?: string;
}

/**
 * Hover magnético + expansão orgânica (scale) com spring + integração ao cursor custom.
 */
export function MagneticButton({ to, children, className = '' }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 210, damping: 24, mass: 0.48 });
  const sy = useSpring(my, { stiffness: 210, damping: 24, mass: 0.48 });
  const scale = useSpring(1, { stiffness: 170, damping: 20, mass: 0.42 });

  const { mobile, beginInteractiveHover, endInteractiveHover } = useMouseBridge();

  const onMove = (e: MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const ox = e.clientX - (r.left + r.width / 2);
    const oy = e.clientY - (r.top + r.height / 2);
    mx.set(ox * 0.44);
    my.set(oy * 0.44);
  };

  const onEnter = () => {
    if (!mobile) {
      beginInteractiveHover();
      scale.set(1.035);
    }
  };

  const onLeave = () => {
    mx.set(0);
    my.set(0);
    scale.set(1);
    if (!mobile) endInteractiveHover();
  };

  return (
    <Link
      ref={ref}
      to={to}
      onMouseMove={onMove}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={`relative inline-flex overflow-hidden rounded-full border border-white/18 bg-white/[0.06] px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.22em] text-white shadow-[0_20px_60px_-24px_rgba(0,0,0,0.85)] backdrop-blur-md transition-[border-color,background-color] duration-[480ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-white/38 hover:bg-white/[0.11] ${className}`}
    >
      <motion.span style={{ x: sx, y: sy, scale }} className="inline-block">
        {children}
      </motion.span>
    </Link>
  );
}
