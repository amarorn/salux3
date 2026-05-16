import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { connections } from '@/domain/connections';
import { bezierBetween } from '@/lib/geometry';
import { useCurrentPresentation } from '@/hooks/useCurrentPresentation';

interface ConnectionLinesProps {
  activeStepId: string;
  isOverview: boolean;
}

const VIEWBOX_SIZE = 8000;
const VIEWBOX_OFFSET = VIEWBOX_SIZE / 2;

interface ResolvedConnection {
  id: string;
  fromId: string;
  toId: string;
  d: string;
  dashed: boolean;
}

function ConnectionLinesComponent({ activeStepId, isOverview }: ConnectionLinesProps) {
  const { stepsById } = useCurrentPresentation();
  const paths = useMemo<ResolvedConnection[]>(() => {
    return connections
      .map((conn) => {
        const from = stepsById[conn.from];
        const to = stepsById[conn.to];
        if (!from || !to) return null;
        const path = bezierBetween(from.position, to.position, conn.curvature ?? 0.18);
        return {
          id: `${from.id}-${to.id}`,
          fromId: from.id,
          toId: to.id,
          d: path.d,
          dashed: Boolean(conn.dashed),
        } satisfies ResolvedConnection;
      })
      .filter((p): p is ResolvedConnection => p !== null);
  }, [stepsById]);

  return (
    <svg
      className="pointer-events-none absolute"
      width={VIEWBOX_SIZE}
      height={VIEWBOX_SIZE}
      viewBox={`-${VIEWBOX_OFFSET} -${VIEWBOX_OFFSET} ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
      style={{ left: -VIEWBOX_OFFSET, top: -VIEWBOX_OFFSET }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="conn-base" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#54c1ed" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id="conn-particle" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#a8e6ff" />
          <stop offset="50%" stopColor="#54c1ed" />
          <stop offset="100%" stopColor="#4a9cfa" />
        </linearGradient>
        <filter id="particle-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="0" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {paths.map(({ id, fromId, toId, d, dashed }) => {
        const isActive =
          !isOverview && (fromId === activeStepId || toId === activeStepId);
        const baseOpacity = isOverview ? 0.32 : 0.14;
        const opacity = isActive ? 0.7 : baseOpacity;

        return (
          <g key={id}>
            <path
              d={d}
              fill="none"
              stroke="url(#conn-base)"
              strokeWidth={isActive ? 2 : 1}
              strokeOpacity={opacity}
              strokeDasharray={dashed ? '10 14' : undefined}
              strokeLinecap="round"
              style={{ transition: 'stroke-opacity 600ms ease, stroke-width 600ms ease' }}
            />
            <ParticleStream pathD={d} active={isActive} burstKey={activeStepId} />
          </g>
        );
      })}
    </svg>
  );
}

interface ParticleStreamProps {
  pathD: string;
  active: boolean;
  burstKey: string;
}

const PARTICLE_PHASES = [
  { dash: '0.001 0.34', delay: 0, duration: 6 },
  { dash: '0.001 0.34', delay: 1.5, duration: 6 },
  { dash: '0.001 0.34', delay: 3, duration: 6 },
];

function ParticleStream({ pathD, active, burstKey }: ParticleStreamProps) {
  return (
    <g filter="url(#particle-glow)">
      {PARTICLE_PHASES.map((p, i) => (
        <motion.path
          key={i}
          d={pathD}
          fill="none"
          stroke="url(#conn-particle)"
          strokeWidth={active ? 6.5 : 4.5}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={p.dash}
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: -1 }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            opacity: active ? 0.95 : 0.6,
            transition: 'opacity 500ms ease, stroke-width 500ms ease',
          }}
        />
      ))}
      {active && (
        <motion.path
          key={`burst-${burstKey}`}
          d={pathD}
          fill="none"
          stroke="#ffffff"
          strokeWidth={9}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="0.06 0.94"
          initial={{ strokeDashoffset: 0, opacity: 1 }}
          animate={{ strokeDashoffset: -1, opacity: 0 }}
          transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
        />
      )}
    </g>
  );
}

export const ConnectionLines = memo(ConnectionLinesComponent);
