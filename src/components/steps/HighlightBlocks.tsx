import { useEffect, useState } from 'react';
import { animate, motion, useReducedMotion } from 'framer-motion';
import type { EvidenceCard } from '@/domain/types';
import { glassPanelStyle } from '@/lib/glassPanelStyle';

const GREEN = '#93c47d';
const CYAN = '#7fd6ff';

/** Bloco verde de destaque/release — frase de apoio em vidro com glow pulsante. */
export function HighlightPhrase({
  text,
  index = 0,
  active = true,
}: {
  text: string;
  index?: number;
  active?: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, x: -8, filter: 'none' }}
      animate={
        active
          ? { opacity: 1, x: 0, filter: 'none' }
          : reduce
            ? undefined
            : { opacity: 0, x: -8, filter: 'none' }
      }
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.25 + index * 0.12 }}
      className="presentation-card-chip relative overflow-hidden rounded-xl border px-4 py-3"
      style={{
        borderColor: `${GREEN}55`,
        background: `linear-gradient(135deg, ${GREEN}1c 0%, rgba(147,196,125,0.04) 100%)`,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.06), 0 0 22px -8px ${GREEN}66`,
      }}
    >
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-[3px]"
        style={{ background: GREEN, boxShadow: `0 0 14px ${GREEN}` }}
        animate={reduce ? undefined : { opacity: [0.55, 1, 0.55] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.span
        aria-hidden
        className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full"
        style={{ background: `radial-gradient(circle, ${GREEN}33 0%, transparent 70%)` }}
        animate={reduce ? undefined : { opacity: [0.4, 0.8, 0.4], scale: [1, 1.15, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <p className="relative text-[0.95rem] font-medium leading-snug text-slate-100">{text}</p>
    </motion.div>
  );
}

export function HighlightPhraseList({
  items,
  active,
}: {
  items: string[];
  active: boolean;
}) {
  if (!items || items.length === 0) return null;
  return (
    <div className="flex flex-col gap-2.5">
      {items.map((t, i) => (
        <HighlightPhrase key={t} text={t} index={i} active={active} />
      ))}
    </div>
  );
}

/** Detecta o formato da métrica: percentual, intervalo "X a Y" ou texto livre. */
function parseMetric(metric: string | undefined):
  | { kind: 'percent'; prefix: string; value: number; suffix: string }
  | { kind: 'range'; from: number; to: number; unit: string }
  | { kind: 'text'; text: string }
  | null {
  if (!metric) return null;
  const m = metric.trim();
  const percentMatch = m.match(/^(.*?)\s*(\d+(?:[.,]\d+)?)\s*%(.*)$/);
  if (percentMatch) {
    return {
      kind: 'percent',
      prefix: percentMatch[1].trim(),
      value: parseFloat(percentMatch[2].replace(',', '.')),
      suffix: percentMatch[3].trim(),
    };
  }
  const rangeMatch = m.match(/^(\d+)\s*a\s*(\d+)\s*(.*)$/i);
  if (rangeMatch) {
    return {
      kind: 'range',
      from: parseInt(rangeMatch[1], 10),
      to: parseInt(rangeMatch[2], 10),
      unit: rangeMatch[3].trim(),
    };
  }
  return { kind: 'text', text: m };
}

function useCountUp(target: number, active: boolean, reduce: boolean, delay = 0.4, duration = 1.5) {
  const [value, setValue] = useState(reduce || !active ? target : 0);
  useEffect(() => {
    if (!active || reduce) {
      setValue(target);
      return;
    }
    setValue(0);
    const controls = animate(0, target, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setValue(v),
    });
    return () => controls.stop();
  }, [active, reduce, target, delay, duration]);
  return value;
}

function PercentVisual({
  prefix,
  value,
  suffix,
  color,
  active,
  reduce,
}: {
  prefix: string;
  value: number;
  suffix: string;
  color: string;
  active: boolean;
  reduce: boolean;
}) {
  const v = useCountUp(value, active, reduce, 0.45, 1.6);
  const size = 96;
  const stroke = 8;
  const r = (size - stroke) / 2;
  const C = 2 * Math.PI * r;
  const offset = C - (C * Math.min(value, 100)) / 100;

  return (
    <div className="flex items-center gap-4">
      <div
        className="relative flex-shrink-0"
        style={{ width: size, height: size }}
      >
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={`${color}22`}
            strokeWidth={stroke}
            fill="none"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={C}
            initial={{ strokeDashoffset: C }}
            animate={{ strokeDashoffset: active || reduce ? offset : C }}
            transition={{ duration: reduce ? 0 : 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
            style={{ filter: `drop-shadow(0 0 8px ${color})` }}
          />
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center leading-none">
          {prefix && (
            <span
              className="text-[9px] font-semibold uppercase tracking-[0.18em]"
              style={{ color, opacity: 0.75 }}
            >
              {prefix}
            </span>
          )}
          <span
            className="font-display tabular-nums text-[1.55rem] font-extrabold leading-none"
            style={{
              color,
              textShadow: `0 0 18px ${color}66`,
            }}
          >
            {Math.round(v)}
            <span className="text-[0.95rem] align-top">%</span>
          </span>
        </div>
        {/* Anel de halo pulsante */}
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{ boxShadow: `0 0 24px -2px ${color}66, inset 0 0 16px ${color}33` }}
          animate={reduce ? undefined : { opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
      {suffix && (
        <p className="flex-1 text-[0.86rem] leading-snug text-slate-300/90">{suffix}</p>
      )}
    </div>
  );
}

function RangeVisual({
  from,
  to,
  unit,
  color,
  active,
  reduce,
}: {
  from: number;
  to: number;
  unit: string;
  color: string;
  active: boolean;
  reduce: boolean;
}) {
  const max = Math.ceil(to * 1.25);
  const a = useCountUp(from, active, reduce, 0.4, 1.2);
  const b = useCountUp(to, active, reduce, 0.6, 1.4);
  const fromPct = (from / max) * 100;
  const toPct = (to / max) * 100;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <span
          className="font-display tabular-nums text-[1.4rem] font-extrabold leading-none"
          style={{ color, textShadow: `0 0 18px ${color}66` }}
        >
          {Math.round(a)} <span className="text-[0.8rem] opacity-70">a</span>{' '}
          {Math.round(b)}
          <span className="ml-1.5 text-[0.78rem] font-semibold opacity-80">{unit}</span>
        </span>
        <span
          className="text-[9px] font-semibold uppercase tracking-[0.28em] text-white/40"
        >
          intervalo crítico
        </span>
      </div>

      {/* Trilho */}
      <div
        className="relative h-2.5 overflow-hidden rounded-full"
        style={{ background: `${color}10`, boxShadow: `inset 0 0 0 1px ${color}22` }}
      >
        {/* Ticks */}
        {Array.from({ length: 6 }).map((_, i) => (
          <span
            key={i}
            aria-hidden
            className="absolute top-0 h-full w-px"
            style={{ left: `${(i / 5) * 100}%`, background: `${color}22` }}
          />
        ))}
        {/* Faixa preenchida */}
        <motion.span
          className="absolute top-0 h-full rounded-full"
          style={{
            left: `${fromPct}%`,
            background: `linear-gradient(90deg, ${color}99, ${color})`,
            boxShadow: `0 0 14px ${color}, inset 0 1px 0 rgba(255,255,255,0.25)`,
          }}
          initial={{ width: 0 }}
          animate={{ width: active || reduce ? `${toPct - fromPct}%` : 0 }}
          transition={{ duration: reduce ? 0 : 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
        />
        {/* Marcadores */}
        <motion.span
          className="absolute top-1/2 -ml-[6px] h-3 w-3 -translate-y-1/2 rounded-full"
          style={{
            left: `${fromPct}%`,
            background: color,
            boxShadow: `0 0 12px ${color}, 0 0 0 2px rgba(13,16,24,1)`,
          }}
          initial={{ scale: 0 }}
          animate={{ scale: active || reduce ? 1 : 0 }}
          transition={{ duration: 0.4, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.span
          className="absolute top-1/2 -ml-[6px] h-3 w-3 -translate-y-1/2 rounded-full"
          style={{
            left: `${toPct}%`,
            background: color,
            boxShadow: `0 0 14px ${color}, 0 0 0 2px rgba(13,16,24,1)`,
          }}
          initial={{ scale: 0 }}
          animate={{ scale: active || reduce ? 1 : 0 }}
          transition={{ duration: 0.4, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}
        />
        {/* Scanline */}
        <motion.span
          aria-hidden
          className="absolute top-0 h-full w-12"
          style={{
            background: `linear-gradient(90deg, transparent, ${color}66, transparent)`,
            mixBlendMode: 'screen',
          }}
          initial={{ left: '-15%' }}
          animate={reduce ? undefined : { left: ['-15%', '110%'] }}
          transition={{
            duration: 2.6,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1.2,
            repeatDelay: 1.4,
          }}
        />
      </div>

      <div className="flex justify-between text-[9px] font-semibold uppercase tracking-[0.18em] text-white/35">
        <span>0</span>
        <span>{max} {unit}</span>
      </div>
    </div>
  );
}

/** Card de evidência — data-viz com count-up, anel/barra, scanline e glow. */
export function EvidenceCardBlock({
  card,
  active,
  accentColor,
}: {
  card: EvidenceCard;
  active: boolean;
  accentColor: string;
}) {
  const reduce = useReducedMotion();
  const parsed = parseMetric(card.metric);

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 10, scale: 0.96 }}
      animate={
        active
          ? { opacity: 1, y: 0, scale: 1 }
          : reduce
            ? undefined
            : { opacity: 0, y: 10, scale: 0.96 }
      }
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
      className="relative overflow-hidden rounded-2xl border px-5 py-4"
      style={glassPanelStyle(accentColor)}
    >
      <motion.span
        aria-hidden
        className="pointer-events-none absolute -inset-px"
        style={{
          background: `conic-gradient(from 0deg, transparent 0%, ${accentColor}22 25%, transparent 50%, ${accentColor}18 75%, transparent 100%)`,
          mixBlendMode: 'screen',
        }}
        animate={reduce ? undefined : { rotate: 360 }}
        transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
      />
      <div className="relative">
        {/* Hex notch decorativo */}
        <span
          aria-hidden
          className="pointer-events-none absolute -top-1 right-0 flex items-center gap-1"
        >
          <span
            className="h-1.5 w-1.5 rotate-45"
            style={{ background: accentColor, boxShadow: `0 0 8px ${accentColor}` }}
          />
          <span
            className="h-1 w-1 rotate-45 opacity-70"
            style={{ background: accentColor }}
          />
        </span>

        {parsed?.kind === 'percent' && (
          <PercentVisual
            prefix={parsed.prefix}
            value={parsed.value}
            suffix={card.text}
            color={accentColor}
            active={active}
            reduce={Boolean(reduce)}
          />
        )}

        {parsed?.kind === 'range' && (
          <>
            <RangeVisual
              from={parsed.from}
              to={parsed.to}
              unit={parsed.unit}
              color={accentColor}
              active={active}
              reduce={Boolean(reduce)}
            />
            <p className="mt-2.5 text-[0.86rem] leading-snug text-slate-300/90">
              {card.text}
            </p>
          </>
        )}

        {(!parsed || parsed.kind === 'text') && (
          <>
            {card.metric && (
              <p
                className="text-[clamp(1.4rem,3vw,1.95rem)] font-extrabold leading-tight"
                style={{ color: accentColor, textShadow: `0 0 22px ${accentColor}66` }}
              >
                {card.metric}
              </p>
            )}
            <p className="mt-1.5 text-[0.92rem] leading-snug text-slate-200">{card.text}</p>
          </>
        )}
      </div>
    </motion.div>
  );
}

/** Frase de fechamento ciano — pergunta/CTA reflexivo. */
export function ClosingHighlight({ text, active }: { text: string; active: boolean }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={active ? { opacity: 1, y: 0 } : reduce ? undefined : { opacity: 0, y: 8 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.7 }}
      className="relative mt-2 overflow-hidden rounded-2xl border px-5 py-4"
      style={{
        borderColor: `${CYAN}55`,
        background: `linear-gradient(135deg, ${CYAN}1c 0%, rgba(127,214,255,0.04) 100%)`,
        boxShadow: `0 0 0 1px ${CYAN}22, 0 0 32px -12px ${CYAN}99`,
      }}
    >
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-x-6 -top-px h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${CYAN}, transparent)` }}
        animate={reduce ? undefined : { opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <p
        className="text-[1.1rem] font-semibold leading-snug text-white"
        style={{ textShadow: `0 0 22px ${CYAN}55` }}
      >
        {text}
      </p>
    </motion.div>
  );
}
