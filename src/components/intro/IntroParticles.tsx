import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface IntroParticlesProps {
  reduceMotion: boolean;
  count?: number;
}

interface Particle {
  angle: number;
  startRadius: number;
  endRadius: number;
  size: number;
  trailLength: number;
  duration: number;
  delay: number;
  hue: 'gold' | 'cyan' | 'white';
}

const HUE_MAP: Record<Particle['hue'], { core: string; trail: string }> = {
  gold: { core: '#fff4c4', trail: '#ffb84a' },
  cyan: { core: '#dffaff', trail: '#5fc4ff' },
  white: { core: '#ffffff', trail: '#ffe9b8' },
};

function generateParticles(count: number): Particle[] {
  const particles: Particle[] = [];
  const hues: Particle['hue'][] = ['gold', 'cyan', 'white'];

  for (let i = 0; i < count; i++) {
    const seed = i / count;
    const angle = seed * Math.PI * 2 + (i % 7) * 0.13;
    particles.push({
      angle,
      startRadius: 60 + (i % 5) * 8,
      endRadius: 360 + (i % 11) * 28,
      size: 1.4 + (i % 4) * 0.7,
      trailLength: 14 + (i % 6) * 6,
      duration: 2.8 + (i % 5) * 0.6,
      delay: (i % 9) * 0.32,
      hue: hues[i % hues.length]!,
    });
  }
  return particles;
}

export function IntroParticles({ reduceMotion, count = 60 }: IntroParticlesProps) {
  const particles = useMemo(() => generateParticles(count), [count]);

  if (reduceMotion) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-1/2 h-0 w-0"
      style={{ mixBlendMode: 'screen' }}
    >
      {particles.map((p, i) => {
        const cos = Math.cos(p.angle);
        const sin = Math.sin(p.angle);
        const xStart = cos * p.startRadius;
        const yStart = sin * p.startRadius;
        const xEnd = cos * p.endRadius;
        const yEnd = sin * p.endRadius;
        const colors = HUE_MAP[p.hue];

        return (
          <motion.span
            key={i}
            className="absolute left-0 top-0 block"
            initial={{ x: xStart, y: yStart, opacity: 0 }}
            animate={{
              x: [xStart, xEnd],
              y: [yStart, yEnd],
              opacity: [0, 1, 0.85, 0],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: [0.22, 0.61, 0.36, 1],
              times: [0, 0.18, 0.62, 1],
            }}
            style={{
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              background: colors.core,
              boxShadow: `0 0 ${p.size * 4}px ${colors.core}, 0 0 ${p.size * 10}px ${colors.trail}`,
              transform: `translate(-50%, -50%)`,
            }}
          >
            <span
              className="absolute left-1/2 top-1/2 block"
              style={{
                width: p.trailLength,
                height: 1,
                background: `linear-gradient(90deg, ${colors.trail}, transparent)`,
                transform: `translate(-100%, -50%) rotate(${p.angle + Math.PI}rad)`,
                transformOrigin: '100% 50%',
                opacity: 0.7,
              }}
            />
          </motion.span>
        );
      })}
    </div>
  );
}
