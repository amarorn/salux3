import { useEffect, useState } from 'react';
import { animate, motion, useReducedMotion } from 'framer-motion';
import { glassPanelStyle } from '@/lib/glassPanelStyle';

interface Props {
  badge?: string;
  prefix?: string;
  value: number;
  decimals?: number;
  unit?: string;
  headline: string;
  context?: string;
  accentColor: string;
  active: boolean;
  delay?: number;
}

function formatBR(value: number, decimals: number) {
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function EvidenceMetricCard({
  badge,
  prefix,
  value,
  decimals = 0,
  unit = '%',
  headline,
  context,
  accentColor,
  active,
  delay = 0,
}: Props) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(reduce || !active ? value : 0);

  useEffect(() => {
    if (!active || reduce) {
      setDisplay(value);
      return;
    }
    setDisplay(0);
    const controls = animate(0, value, {
      duration: 1.8,
      delay: 0.55 + delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [active, reduce, value, delay]);

  const fillPct = Math.max(0, Math.min(100, (value / 100) * 100));

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
      {/* linha luminosa no topo */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-6 -top-px h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${accentColor}cc, transparent)`,
        }}
      />
      {/* glow radial canto */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full"
        style={{
          background: `radial-gradient(circle, ${accentColor}33 0%, transparent 70%)`,
        }}
      />
      {/* pulso sutil ao redor da borda */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{ boxShadow: `0 0 0 1px ${accentColor}33` }}
        animate={
          active && !reduce ? { opacity: [0.45, 0.9, 0.45] } : { opacity: 0.45 }
        }
        transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut', delay: delay + 1.5 }}
      />

      {badge && (
        <div className="mb-2 flex items-center gap-2">
          <motion.span
            aria-hidden
            className="inline-flex h-5 w-5 items-center justify-center rounded text-[12px]"
            style={{ color: accentColor }}
            initial={reduce ? false : { opacity: 0, scale: 0 }}
            animate={
              active ? { opacity: 1, scale: 1 } : reduce ? undefined : { opacity: 0, scale: 0 }
            }
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.45 + delay }}
          >
            📊
          </motion.span>
          <span
            className="text-[10px] font-semibold uppercase tracking-[0.32em]"
            style={{ color: accentColor, opacity: 0.95 }}
          >
            {badge}
          </span>
        </div>
      )}

      {/* número grande */}
      <div className="mt-1 flex items-baseline gap-2">
        {prefix && (
          <motion.span
            className="text-[1.05rem] font-semibold uppercase tracking-[0.18em] text-white/65"
            initial={reduce ? false : { opacity: 0, x: -6 }}
            animate={
              active ? { opacity: 1, x: 0 } : reduce ? undefined : { opacity: 0, x: -6 }
            }
            transition={{ duration: 0.5, delay: 0.5 + delay }}
          >
            {prefix}
          </motion.span>
        )}
        <motion.span
          className="font-display tabular-nums leading-none"
          style={{
            color: accentColor,
            fontSize: 'clamp(2.8rem, 7vw, 4.2rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            textShadow: `0 0 28px ${accentColor}88, 0 0 60px ${accentColor}44`,
          }}
          initial={reduce ? false : { opacity: 0, filter: 'none', y: 6 }}
          animate={
            active
              ? { opacity: 1, filter: 'none', y: 0 }
              : reduce
                ? undefined
                : { opacity: 0, filter: 'none', y: 6 }
          }
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.5 + delay }}
        >
          {formatBR(display, decimals)}
          <span
            className="ml-0.5 text-[0.55em] font-bold opacity-75"
            style={{ color: accentColor }}
          >
            {unit}
          </span>
        </motion.span>
      </div>

      {/* barra de proporção */}
      <div className="relative mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.05]">
        {/* ticks */}
        {[25, 50, 75].map((tick) => (
          <span
            key={tick}
            aria-hidden
            className="absolute top-0 h-full w-px bg-white/10"
            style={{ left: `${tick}%` }}
          />
        ))}
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background: `linear-gradient(90deg, ${accentColor}99, ${accentColor})`,
            boxShadow: `0 0 18px ${accentColor}aa`,
          }}
          initial={reduce ? false : { width: '0%' }}
          animate={active ? { width: `${fillPct}%` } : reduce ? undefined : { width: '0%' }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.55 + delay }}
        />
        {/* marcador no fim */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2"
          style={{ left: `${fillPct}%` }}
          initial={reduce ? false : { opacity: 0, scale: 0 }}
          animate={
            active ? { opacity: 1, scale: 1 } : reduce ? undefined : { opacity: 0, scale: 0 }
          }
          transition={{ duration: 0.5, delay: 2.05 + delay }}
        >
          <span
            aria-hidden
            className="block h-3 w-3 -translate-x-1/2 rounded-full"
            style={{ background: accentColor, boxShadow: `0 0 14px ${accentColor}` }}
          />
          {!reduce && (
            <motion.span
              aria-hidden
              className="absolute left-0 top-1/2 block h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ border: `1px solid ${accentColor}` }}
              animate={{ scale: [1, 2.4, 3.2], opacity: [0.7, 0.2, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, delay: 2.2 + delay }}
            />
          )}
        </motion.div>
      </div>

      <motion.p
        className="mt-4 text-[0.98rem] font-semibold leading-snug text-white/95"
        initial={reduce ? false : { opacity: 0, y: 6 }}
        animate={
          active ? { opacity: 1, y: 0 } : reduce ? undefined : { opacity: 0, y: 6 }
        }
        transition={{ duration: 0.5, delay: 0.95 + delay }}
      >
        {headline}
      </motion.p>

      {context && (
        <motion.p
          className="mt-2 text-[0.86rem] italic leading-snug text-slate-300/85"
          initial={reduce ? false : { opacity: 0 }}
          animate={active ? { opacity: 1 } : reduce ? undefined : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 1.2 + delay }}
        >
          {context}
        </motion.p>
      )}
    </motion.div>
  );
}
