import { useEffect, useState } from 'react';
import { animate, motion, useReducedMotion } from 'framer-motion';
import { glassPanelStyle } from '@/lib/glassPanelStyle';

interface Props {
  badge?: string;
  prefix?: string;
  /** Início do intervalo (ex.: 12). */
  value: number;
  /** Fim do intervalo (ex.: 24). Se ausente, comporta-se como ponto único. */
  rangeEnd?: number;
  /** Rótulo da unidade (ex.: "meses"). */
  valueLabel?: string;
  /** Escala máxima (default 36). */
  rangeMax?: number;
  decimals?: number;
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

/**
 * Visualização de **intervalo temporal** — uma régua horizontal com
 * o intervalo destacado entre dois pontos pulsantes. Acima, os dois
 * números (count-up) com a unidade. Comunica "tempo que se estica" —
 * distinto da barra de proporção (style='bar') e do manômetro (style='gauge').
 */
export function EvidenceRangeCard({
  badge,
  prefix,
  value,
  rangeEnd,
  valueLabel = 'meses',
  rangeMax = 36,
  decimals = 0,
  headline,
  context,
  accentColor,
  active,
  delay = 0,
}: Props) {
  const reduce = useReducedMotion();
  const start = value;
  const end = rangeEnd ?? value;
  const [displayStart, setDisplayStart] = useState(reduce || !active ? start : 0);
  const [displayEnd, setDisplayEnd] = useState(reduce || !active ? end : 0);

  useEffect(() => {
    if (!active || reduce) {
      setDisplayStart(start);
      setDisplayEnd(end);
      return;
    }
    setDisplayStart(0);
    setDisplayEnd(0);
    const c1 = animate(0, start, {
      duration: 1.4,
      delay: 0.55 + delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplayStart(v),
    });
    const c2 = animate(0, end, {
      duration: 1.7,
      delay: 0.85 + delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplayEnd(v),
    });
    return () => {
      c1.stop();
      c2.stop();
    };
  }, [active, reduce, start, end, delay]);

  // SVG
  const W = 480;
  const padX = 28;
  const trackY = 86;
  const xFor = (m: number) => padX + (m / rangeMax) * (W - padX * 2);
  const startX = xFor(start);
  const endX = xFor(end);

  // ticks a cada 6 meses
  const tickMonths: number[] = [];
  for (let m = 0; m <= rangeMax; m += 6) tickMonths.push(m);

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl border px-6 py-5"
      style={glassPanelStyle(accentColor)}
      initial={reduce ? false : { opacity: 0, y: 14 }}
      animate={active ? { opacity: 1, y: 0 } : reduce ? undefined : { opacity: 0, y: 14 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.35 + delay }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-6 -top-px h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${accentColor}cc, transparent)`,
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full"
        style={{
          background: `radial-gradient(circle, ${accentColor}33 0%, transparent 70%)`,
        }}
      />
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{ boxShadow: `0 0 0 1px ${accentColor}33` }}
        animate={active && !reduce ? { opacity: [0.45, 0.9, 0.45] } : { opacity: 0.45 }}
        transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut', delay: delay + 1.5 }}
      />

      {badge && (
        <div className="mb-2 flex items-center gap-2">
          <motion.span
            aria-hidden
            className="inline-flex h-5 w-5 items-center justify-center rounded text-[12px]"
            initial={reduce ? false : { opacity: 0, scale: 0 }}
            animate={
              active ? { opacity: 1, scale: 1 } : reduce ? undefined : { opacity: 0, scale: 0 }
            }
            transition={{ duration: 0.45, delay: 0.45 + delay }}
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

      {/* Números grandes */}
      <div className="mt-2 flex items-baseline gap-3">
        {prefix && (
          <motion.span
            className="text-[0.95rem] font-semibold uppercase tracking-[0.18em] text-white/65"
            initial={reduce ? false : { opacity: 0, x: -6 }}
            animate={
              active ? { opacity: 1, x: 0 } : reduce ? undefined : { opacity: 0, x: -6 }
            }
            transition={{ duration: 0.5, delay: 0.55 + delay }}
          >
            {prefix}
          </motion.span>
        )}
        <div className="flex items-baseline gap-2 leading-none">
          <motion.span
            className="font-display tabular-nums"
            style={{
              color: accentColor,
              fontSize: 'clamp(2.4rem, 6.2vw, 3.6rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              textShadow: `0 0 10px ${accentColor}55`,
            }}
            initial={reduce ? false : { opacity: 0, filter: 'none', y: 6 }}
            animate={
              active
                ? { opacity: 1, filter: 'none', y: 0 }
                : reduce
                  ? undefined
                  : { opacity: 0, filter: 'none', y: 6 }
            }
            transition={{ duration: 0.7, delay: 0.5 + delay }}
          >
            {formatBR(displayStart, decimals)}
          </motion.span>
          {rangeEnd != null && (
            <>
              <motion.span
                className="text-[1.2rem] font-bold text-white/55"
                initial={reduce ? false : { opacity: 0 }}
                animate={active ? { opacity: 1 } : reduce ? undefined : { opacity: 0 }}
                transition={{ duration: 0.5, delay: 1.05 + delay }}
              >
                a
              </motion.span>
              <motion.span
                className="font-display tabular-nums"
                style={{
                  color: accentColor,
                  fontSize: 'clamp(2.4rem, 6.2vw, 3.6rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  textShadow: `0 0 10px ${accentColor}55`,
                }}
                initial={reduce ? false : { opacity: 0, filter: 'none', y: 6 }}
                animate={
                  active
                    ? { opacity: 1, filter: 'none', y: 0 }
                    : reduce
                      ? undefined
                      : { opacity: 0, filter: 'none', y: 6 }
                }
                transition={{ duration: 0.7, delay: 0.8 + delay }}
              >
                {formatBR(displayEnd, decimals)}
              </motion.span>
            </>
          )}
          <motion.span
            className="ml-1 text-[0.85rem] font-bold uppercase tracking-[0.18em]"
            style={{ color: accentColor, opacity: 0.8 }}
            initial={reduce ? false : { opacity: 0 }}
            animate={active ? { opacity: 0.8 } : reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 1.2 + delay }}
          >
            {valueLabel}
          </motion.span>
        </div>
      </div>

      {/* Régua temporal */}
      <div className="mt-4">
        <svg width="100%" height={120} viewBox={`0 0 ${W} 120`} aria-hidden preserveAspectRatio="none">
          <defs>
            <linearGradient id="range-fill" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={accentColor} stopOpacity="0.7" />
              <stop offset="50%" stopColor={accentColor} stopOpacity="1" />
              <stop offset="100%" stopColor={accentColor} stopOpacity="0.7" />
            </linearGradient>
          </defs>

          {/* track de fundo (linha horizontal) */}
          <line
            x1={padX}
            y1={trackY}
            x2={W - padX}
            y2={trackY}
            stroke="#ffffff"
            strokeOpacity={0.08}
            strokeWidth={6}
            strokeLinecap="round"
          />

          {/* ticks a cada 6 meses */}
          {tickMonths.map((m) => {
            const x = xFor(m);
            const inRange = m >= start && m <= end;
            return (
              <motion.g
                key={m}
                initial={reduce ? false : { opacity: 0 }}
                animate={active ? { opacity: 1 } : reduce ? undefined : { opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.5 + delay + (m / rangeMax) * 0.4 }}
              >
                <line
                  x1={x}
                  y1={trackY - 8}
                  x2={x}
                  y2={trackY + 8}
                  stroke={inRange ? accentColor : '#ffffff'}
                  strokeOpacity={inRange ? 0.7 : 0.25}
                  strokeWidth={1.2}
                  strokeLinecap="round"
                />
                <text
                  x={x}
                  y={trackY + 26}
                  textAnchor="middle"
                  fill={inRange ? accentColor : '#ffffff'}
                  fillOpacity={inRange ? 0.85 : 0.35}
                  fontSize="9"
                  fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                  letterSpacing="1.5"
                >
                  {m}
                </text>
              </motion.g>
            );
          })}

          {/* glow do intervalo */}
          <motion.line
            x1={startX}
            y1={trackY}
            x2={endX}
            y2={trackY}
            stroke={accentColor}
            strokeOpacity={0.45}
            strokeWidth={14}
            strokeLinecap="round"
            initial={reduce ? false : { pathLength: 0 }}
            animate={active ? { pathLength: 1 } : reduce ? undefined : { pathLength: 0 }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.95 + delay }}
          />

          {/* barra do intervalo */}
          <motion.line
            x1={startX}
            y1={trackY}
            x2={endX}
            y2={trackY}
            stroke="url(#range-fill)"
            strokeWidth={7}
            strokeLinecap="round"
            initial={reduce ? false : { pathLength: 0 }}
            animate={active ? { pathLength: 1 } : reduce ? undefined : { pathLength: 0 }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.95 + delay }}
          />

          {/* colchete esquerdo */}
          <motion.path
            d={`M ${startX - 6} ${trackY - 18} L ${startX - 6} ${trackY + 18} M ${startX - 6} ${trackY - 18} L ${startX + 2} ${trackY - 18} M ${startX - 6} ${trackY + 18} L ${startX + 2} ${trackY + 18}`}
            fill="none"
            stroke={accentColor}
            strokeWidth={1.6}
            strokeLinecap="round"
            initial={reduce ? false : { opacity: 0 }}
            animate={active ? { opacity: 1 } : reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 1.7 + delay }}
          />
          {/* colchete direito */}
          <motion.path
            d={`M ${endX + 6} ${trackY - 18} L ${endX + 6} ${trackY + 18} M ${endX + 6} ${trackY - 18} L ${endX - 2} ${trackY - 18} M ${endX + 6} ${trackY + 18} L ${endX - 2} ${trackY + 18}`}
            fill="none"
            stroke={accentColor}
            strokeWidth={1.6}
            strokeLinecap="round"
            initial={reduce ? false : { opacity: 0 }}
            animate={active ? { opacity: 1 } : reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 1.85 + delay }}
          />

          {/* dots pulsantes nas extremidades */}
          {[
            { x: startX, dly: 2.0 },
            { x: endX, dly: 2.15 },
          ].map((p, i) => (
            <motion.g key={i}>
              <motion.circle
                cx={p.x}
                cy={trackY}
                r={5}
                fill={accentColor}
                initial={reduce ? false : { opacity: 0, scale: 0 }}
                animate={
                  active ? { opacity: 1, scale: 1 } : reduce ? undefined : { opacity: 0, scale: 0 }
                }
                transition={{ duration: 0.4, delay: p.dly + delay }}
              />
              <motion.circle
                cx={p.x}
                cy={trackY}
                r={5}
                fill="none"
                stroke={accentColor}
                strokeWidth={1}
                animate={
                  active && !reduce
                    ? { r: [5, 13, 20], opacity: [0.7, 0.25, 0] }
                    : { opacity: 0 }
                }
                transition={{ duration: 2.5, repeat: Infinity, delay: p.dly + 0.3 + delay }}
              />
            </motion.g>
          ))}

          {/* legenda de unidade */}
          <text
            x={W / 2}
            y={trackY + 48}
            textAnchor="middle"
            fill="#ffffff"
            fillOpacity={0.4}
            fontSize="9"
            fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
            letterSpacing="3"
          >
            {valueLabel.toUpperCase()}
          </text>
        </svg>
      </div>

      <motion.p
        className="mt-2 text-[0.98rem] font-semibold leading-snug text-white/95"
        initial={reduce ? false : { opacity: 0, y: 6 }}
        animate={active ? { opacity: 1, y: 0 } : reduce ? undefined : { opacity: 0, y: 6 }}
        transition={{ duration: 0.5, delay: 1.05 + delay }}
      >
        {headline}
      </motion.p>

      {context && (
        <motion.p
          className="mt-2 text-[0.86rem] italic leading-snug text-slate-300/85"
          initial={reduce ? false : { opacity: 0 }}
          animate={active ? { opacity: 1 } : reduce ? undefined : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 1.3 + delay }}
        >
          {context}
        </motion.p>
      )}
    </motion.div>
  );
}
