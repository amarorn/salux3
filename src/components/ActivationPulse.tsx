import { motion } from 'framer-motion';
import type { NodePosition } from '@/domain/types';

interface ActivationPulseProps {
  position: NodePosition;
  color: string;
}

const RINGS = [
  { delay: 0, scale: 6.2, duration: 1.7 },
  { delay: 0.18, scale: 5.4, duration: 1.55 },
  { delay: 0.34, scale: 4.6, duration: 1.4 },
];

export function ActivationPulse({ position, color }: ActivationPulseProps) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {RINGS.map((r, i) => (
        <motion.span
          key={i}
          className="absolute left-1/2 top-1/2 block rounded-full"
          style={{
            borderColor: color,
            borderStyle: 'solid',
            borderWidth: 1.6,
            boxShadow: `0 0 22px ${color}66`,
            width: 96,
            height: 96,
            translateX: '-50%',
            translateY: '-50%',
          }}
          initial={{ scale: 0.4, opacity: 0.85 }}
          animate={{ scale: r.scale, opacity: 0 }}
          transition={{
            duration: r.duration,
            delay: r.delay,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      ))}

      <motion.span
        aria-hidden
        className="absolute left-1/2 top-1/2 block rounded-full"
        style={{
          width: 220,
          height: 220,
          translateX: '-50%',
          translateY: '-50%',
          background: `radial-gradient(circle, ${color}55 0%, ${color}22 30%, transparent 70%)`,
          filter: 'blur(12px)',
        }}
        initial={{ scale: 0.6, opacity: 0.85 }}
        animate={{ scale: 2.6, opacity: 0 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}
