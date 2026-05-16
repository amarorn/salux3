import { motion, useReducedMotion } from 'framer-motion';
import { glassPanelStyle } from '@/lib/glassPanelStyle';

interface Props {
  badge?: string;
  prefix?: string;
  value: number;
  headline: string;
  context?: string;
  accentColor: string;
  active: boolean;
  delay?: number;
}

export function EvidenceHighlightCard({
  badge,
  prefix,
  value,
  headline,
  context,
  accentColor,
  active,
  delay = 0,
}: Props) {
  const reduce = useReducedMotion();
  const highlight =
    prefix && value > 0
      ? `${prefix} #${Math.round(value)}`
      : prefix
        ? prefix
        : `#${Math.round(value)}`;

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl border px-6 py-5"
      style={glassPanelStyle(accentColor)}
      initial={reduce ? false : { opacity: 0, y: 14 }}
      animate={
        active ? { opacity: 1, y: 0 } : reduce ? undefined : { opacity: 0, y: 14 }
      }
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.35 + delay }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-6 -top-px h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${accentColor}cc, transparent)`,
        }}
      />

      {badge && (
        <p
          className="text-[10px] font-semibold uppercase tracking-[0.32em]"
          style={{ color: accentColor, opacity: 0.95 }}
        >
          {badge}
        </p>
      )}

      <motion.p
        className="mt-3 font-display text-[clamp(1.75rem,4.5vw,2.35rem)] font-bold leading-none tracking-tight"
        style={{
          color: accentColor,
          textShadow: `0 0 28px ${accentColor}66`,
        }}
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={
          active ? { opacity: 1, y: 0 } : reduce ? undefined : { opacity: 0, y: 8 }
        }
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.45 + delay }}
      >
        {highlight}
      </motion.p>

      <motion.p
        className="mt-4 text-[0.98rem] font-semibold leading-snug text-white/95"
        initial={reduce ? false : { opacity: 0, y: 6 }}
        animate={
          active ? { opacity: 1, y: 0 } : reduce ? undefined : { opacity: 0, y: 6 }
        }
        transition={{ duration: 0.5, delay: 0.65 + delay }}
      >
        {headline}
      </motion.p>

      {context && (
        <motion.p
          className="mt-2 text-[0.86rem] italic leading-snug text-slate-300/85"
          initial={reduce ? false : { opacity: 0 }}
          animate={active ? { opacity: 1 } : reduce ? undefined : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.85 + delay }}
        >
          {context}
        </motion.p>
      )}
    </motion.div>
  );
}
