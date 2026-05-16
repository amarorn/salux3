import { useEffect, useState } from 'react';
import { animate } from 'framer-motion';
import clsx from 'clsx';
import type { NarrativeMetric } from '@/domain/types';

function formatBR(value: number, decimals: number) {
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

interface Props {
  items: NarrativeMetric[];
  active: boolean;
  reducedMotion: boolean;
  accentColor: string;
}

export function AnimatedNarrativeMetrics({ items, active, reducedMotion, accentColor }: Props) {
  return (
    <div className="flex flex-col gap-3">
      {items.map((item, i) => (
        <AnimatedMetricLine
          key={`${item.value}-${item.suffix}-${i}`}
          metric={item}
          active={active}
          reducedMotion={reducedMotion}
          accentColor={accentColor}
          staggerDelay={i * 0.14}
        />
      ))}
    </div>
  );
}

function AnimatedMetricLine({
  metric,
  active,
  reducedMotion,
  accentColor,
  staggerDelay,
}: {
  metric: NarrativeMetric;
  active: boolean;
  reducedMotion: boolean;
  accentColor: string;
  staggerDelay: number;
}) {
  const decimals = metric.decimals ?? 0;
  const target = metric.value;
  const [display, setDisplay] = useState(reducedMotion || !active ? target : 0);

  useEffect(() => {
    if (!active || reducedMotion) {
      setDisplay(target);
      return;
    }
    setDisplay(0);
    const controls = animate(0, target, {
      duration: 1.55,
      delay: staggerDelay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [active, reducedMotion, target, staggerDelay]);

  return (
    <div className="rounded-2xl border border-white/[0.09] bg-gradient-to-br from-white/[0.06] via-white/[0.02] to-transparent px-4 py-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]  transition-[border-color,box-shadow] duration-300 hover:border-white/[0.14]">
      <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="relative inline-flex shrink-0 overflow-hidden rounded-lg px-1 py-0.5">
          <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-lg">
            <span
              className={clsx(
                'pointer-events-none absolute inset-y-0 left-0 w-[42%] bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-35 narrative-metric-sheen',
                reducedMotion && '!animate-none',
              )}
              style={{ mixBlendMode: 'overlay' }}
            />
          </span>
          <span
            className={clsx(
              'relative font-display text-[1.65rem] font-bold tabular-nums leading-none tracking-tight md:text-[1.9rem]',
              !reducedMotion && 'narrative-metric-value',
            )}
            style={{
              color: accentColor,
              textShadow: `0 0 22px rgba(${hexToRgb(accentColor)}, 0.45), 0 0 48px rgba(${hexToRgb(accentColor)}, 0.22), 0 2px 14px rgba(0,0,0,0.5)`,
            }}
          >
            {formatBR(display, decimals)}%
          </span>
        </span>
        <span className="min-w-0 flex-1 text-[15px] font-medium leading-snug text-slate-400">
          {metric.suffix}
        </span>
      </p>
    </div>
  );
}

function hexToRgb(hex: string): string {
  const h = hex.replace('#', '');
  if (h.length !== 6) return '0, 206, 209';
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}
