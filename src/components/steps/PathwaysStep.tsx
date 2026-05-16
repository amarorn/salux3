import { useContext, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { FloatingCard, FloatingCardContext } from '../FloatingCard';
import type { PresentationStep } from '@/domain/types';
import { theme } from '@/domain/theme';
import { getCardTextVariants } from './cardTextMotion';
import { HighlightPhraseList } from './HighlightBlocks';

interface Props {
  step: PresentationStep;
  active: boolean;
}

/** Card 9 — Painel-radar consultivo.
 *  Setores rotativos = dores. Núcleo central = produto/capacidade ativa.
 *  Apresentador navega por dor sem percorrer todos os caminhos. */
export function PathwaysStep({ step, active }: Props) {
  const accent = theme.accents[step.accent];
  const reduce = useReducedMotion();
  const flipPhoto = useContext(FloatingCardContext)?.flipPhoto ?? false;
  const { container, item } = getCardTextVariants(
    Boolean(reduce),
    step.index,
    `${step.id}:${step.title}`,
    flipPhoto,
  );
  const items = step.content.pathways ?? [];
  const [focus, setFocus] = useState<number>(0);
  const focused = items[focus];

  return (
    <FloatingCard
      accent={step.accent}
      active={active}
      stepId={step.id}
      width={760}
      badge={step.title}
    >
      <motion.div
        className="flex flex-col gap-5"
        variants={container}
        initial={reduce ? false : 'hidden'}
        animate={active ? 'visible' : 'hidden'}
      >
        <motion.div variants={item} className="space-y-2">
          <span
            className="block text-[10px] font-semibold uppercase tracking-[0.32em]"
            style={{ color: accent.base, opacity: 0.85 }}
          >
            Painel consultivo · diagnóstico → resposta
          </span>
          <h2
            className="presentation-ppt-title max-w-[22ch] text-[clamp(1.72rem,3.8vw,2.45rem)] leading-[1.1]"
            style={{ textShadow: `0 0 28px ${accent.base}22` }}
          >
            {step.content.headline ?? 'Por onde o crescimento está travando hoje?'}
          </h2>
        </motion.div>

        <motion.div
          variants={item}
          className="grid grid-cols-[260px,1fr] items-stretch gap-5"
        >
          <RadarDial
            count={items.length}
            color={accent.base}
            focus={focus}
            onFocus={setFocus}
            reduce={Boolean(reduce)}
            active={active}
          />

          <ul className="flex flex-col gap-1.5">
            {items.map((p, i) => {
              const isFocused = i === focus;
              return (
                <li key={p.product}>
                  <button
                    type="button"
                    data-no-click-advance
                    onClick={(e) => {
                      e.stopPropagation();
                      setFocus(i);
                    }}
                    onMouseEnter={() => setFocus(i)}
                    onFocus={() => setFocus(i)}
                    className="group relative grid w-full grid-cols-[18px,1fr,auto] items-center gap-3 rounded-lg border px-3 py-2 text-left transition-[border-color,background] duration-300"
                    style={{
                      borderColor: isFocused ? `${accent.base}` : `${accent.base}22`,
                      background: isFocused
                        ? `linear-gradient(90deg, ${accent.base}1f 0%, ${accent.base}05 100%)`
                        : 'rgba(255,255,255,0.02)',
                      boxShadow: isFocused
                        ? `0 0 0 1px ${accent.base}55, 0 10px 28px -16px ${accent.base}`
                        : undefined,
                    }}
                  >
                    <span
                      className="font-display text-[10px] font-bold tabular-nums"
                      style={{
                        color: isFocused ? accent.base : 'rgba(255,255,255,0.4)',
                      }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span
                      className="text-[0.94rem] font-medium leading-relaxed"
                      style={{ color: isFocused ? '#ffffff' : 'rgba(226,232,240,0.78)' }}
                    >
                      {p.pain}
                    </span>
                    <motion.span
                      aria-hidden
                      className="text-[1.05rem] leading-none"
                      style={{
                        color: accent.base,
                        textShadow: isFocused ? `0 0 10px ${accent.base}` : undefined,
                        opacity: isFocused ? 1 : 0.45,
                      }}
                      animate={
                        reduce || !isFocused ? undefined : { x: [0, 3, 0] }
                      }
                      transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      →
                    </motion.span>
                  </button>
                </li>
              );
            })}
          </ul>
        </motion.div>

        <motion.div
          variants={item}
          className="relative overflow-hidden rounded-xl border px-4 py-3"
          style={{
            borderColor: `${accent.base}55`,
            background: `linear-gradient(135deg, ${accent.base}1f 0%, rgba(255,255,255,0.02) 100%)`,
            boxShadow: `inset 0 1px 0 rgba(255,255,255,0.05), 0 0 24px -10px ${accent.base}`,
          }}
        >
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-x-6 -top-px h-px"
            style={{ background: `linear-gradient(90deg, transparent, ${accent.base}, transparent)` }}
            animate={reduce ? undefined : { opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="flex items-center justify-between gap-3">
            <span
              className="text-[10px] font-semibold uppercase tracking-[0.24em]"
              style={{ color: accent.base, opacity: 0.85 }}
            >
              Resposta coordenada
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
              {String(focus + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
            </span>
          </div>
          <motion.p
            key={focused?.product}
            initial={reduce ? false : { opacity: 0, y: 6, filter: 'none' }}
            animate={{ opacity: 1, y: 0, filter: 'none' }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="mt-1 font-display text-[1.4rem] font-extrabold leading-tight"
            style={{ color: '#fff', textShadow: `0 0 16px ${accent.base}66` }}
          >
            {focused?.product}
          </motion.p>
        </motion.div>

        {step.content.highlightPhrases && (
          <motion.div variants={item}>
            <HighlightPhraseList items={step.content.highlightPhrases} active={active} />
          </motion.div>
        )}
      </motion.div>
    </FloatingCard>
  );
}

/** Radar/dial — setores rotativos com pulso no setor ativo. */
function RadarDial({
  count,
  color,
  focus,
  onFocus,
  reduce,
  active,
}: {
  count: number;
  color: string;
  focus: number;
  onFocus: (i: number) => void;
  reduce: boolean;
  active: boolean;
}) {
  const size = 260;
  const cx = size / 2;
  const cy = size / 2;
  const rOuter = size / 2 - 8;
  const rInner = 46;
  const startAngle = -Math.PI / 2;

  const sectors = Array.from({ length: count }, (_, i) => {
    const a0 = startAngle + (i / count) * Math.PI * 2;
    const a1 = startAngle + ((i + 1) / count) * Math.PI * 2;
    const aMid = (a0 + a1) / 2;
    return {
      a0,
      a1,
      aMid,
      path: arcPath(cx, cy, rInner, rOuter, a0, a1),
      labelX: cx + Math.cos(aMid) * (rOuter - 16),
      labelY: cy + Math.sin(aMid) * (rOuter - 16),
    };
  });

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="absolute inset-0"
        style={{ filter: `drop-shadow(0 0 24px ${color}33)` }}
      >
        <defs>
          <radialGradient id={`radar-core-${color}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.6" />
            <stop offset="70%" stopColor={color} stopOpacity="0.15" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Grade circular */}
        {[0.55, 0.78, 1].map((t, i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={rInner + (rOuter - rInner) * t}
            stroke={`${color}22`}
            strokeWidth={0.5}
            fill="none"
            strokeDasharray="2 4"
          />
        ))}

        {/* Setores */}
        {sectors.map((s, i) => {
          const isFocused = i === focus;
          return (
            <motion.path
              key={i}
              d={s.path}
              fill={isFocused ? `${color}33` : `${color}0a`}
              stroke={isFocused ? color : `${color}33`}
              strokeWidth={isFocused ? 1.5 : 0.6}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => onFocus(i)}
              onFocus={() => onFocus(i)}
              onClick={(e) => {
                e.stopPropagation();
                onFocus(i);
              }}
              animate={
                reduce || !isFocused
                  ? undefined
                  : { fillOpacity: [0.18, 0.32, 0.18] }
              }
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            />
          );
        })}

        {/* Núcleo */}
        <circle cx={cx} cy={cy} r={rInner - 2} fill={`url(#radar-core-${color})`} />
        <motion.circle
          cx={cx}
          cy={cy}
          r={rInner - 14}
          fill="none"
          stroke={color}
          strokeWidth={0.8}
          animate={reduce ? undefined : { r: [rInner - 18, rInner - 6, rInner - 18], opacity: [0.7, 0.2, 0.7] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <circle cx={cx} cy={cy} r={3} fill={color} style={{ filter: `drop-shadow(0 0 6px ${color})` }} />

        {/* Raio do setor ativo */}
        {sectors[focus] && (
          <motion.line
            x1={cx}
            y1={cy}
            x2={cx + Math.cos(sectors[focus].aMid) * rOuter}
            y2={cy + Math.sin(sectors[focus].aMid) * rOuter}
            stroke={color}
            strokeWidth={1.2}
            strokeLinecap="round"
            initial={false}
            animate={{ opacity: 1 }}
            style={{ filter: `drop-shadow(0 0 6px ${color})` }}
          />
        )}

        {/* Varredura tipo sonar */}
        {!reduce && active && (
          <motion.line
            x1={cx}
            y1={cy}
            x2={cx + rOuter}
            y2={cy}
            stroke={color}
            strokeWidth={0.8}
            strokeOpacity={0.55}
            style={{ originX: `${cx}px`, originY: `${cy}px` } as React.CSSProperties}
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          />
        )}

        {/* Labels numéricos */}
        {sectors.map((s, i) => (
          <text
            key={`t-${i}`}
            x={s.labelX}
            y={s.labelY}
            fontSize={9}
            fontFamily="ui-monospace, SFMono-Regular, monospace"
            fill={i === focus ? color : `${color}88`}
            opacity={i === focus ? 1 : 0.55}
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ pointerEvents: 'none', letterSpacing: '0.08em' }}
          >
            {String(i + 1).padStart(2, '0')}
          </text>
        ))}
      </svg>

      {/* Badge central */}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-[8px] font-semibold uppercase tracking-[0.3em]"
          style={{ color, opacity: 0.7 }}
        >
          Salux
        </span>
        <span
          className="font-display text-[12px] font-bold uppercase tracking-[0.18em] text-white"
        >
          Núcleo
        </span>
      </div>
    </div>
  );
}

function arcPath(
  cx: number,
  cy: number,
  rInner: number,
  rOuter: number,
  a0: number,
  a1: number,
): string {
  const x0o = cx + Math.cos(a0) * rOuter;
  const y0o = cy + Math.sin(a0) * rOuter;
  const x1o = cx + Math.cos(a1) * rOuter;
  const y1o = cy + Math.sin(a1) * rOuter;
  const x0i = cx + Math.cos(a0) * rInner;
  const y0i = cy + Math.sin(a0) * rInner;
  const x1i = cx + Math.cos(a1) * rInner;
  const y1i = cy + Math.sin(a1) * rInner;
  const largeArc = a1 - a0 > Math.PI ? 1 : 0;
  return `M ${x0o} ${y0o} A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${x1o} ${y1o} L ${x1i} ${y1i} A ${rInner} ${rInner} 0 ${largeArc} 0 ${x0i} ${y0i} Z`;
}
