import { useEffect, useState } from 'react';
import { animate, motion, useReducedMotion } from 'framer-motion';

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

/**
 * Visualização "manômetro de carga" — arco de 240° preenchendo até o valor.
 * Ticks discretos, agulha rotativa, zona de alerta ≥70% — comunica peso/limite
 * operacional. Distinto da barra horizontal usada em outras evidências.
 */
export function EvidenceGaugeCard({
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
      duration: 2.0,
      delay: 0.65 + delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [active, reduce, value, delay]);

  // arco: começa em -120° e vai até +120° (240° de varredura total)
  const startAngle = -120; // graus, "9 horas e meia" inclinado
  const endAngle = 120;
  const sweep = endAngle - startAngle; // 240
  const cx = 140;
  const cy = 130;
  const r = 96;

  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const arcPoint = (deg: number) => {
    // 0deg = "topo"; ajustamos para que 0 = startAngle visualmente.
    // Convertemos: rotação 0° aponta para 12h. Subtraímos 90° para alinhar 0=topo.
    const a = toRad(deg - 90);
    return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r };
  };

  function arcPath(fromDeg: number, toDeg: number, radius = r) {
    const start = arcPoint(fromDeg);
    const end = arcPoint(toDeg);
    const large = toDeg - fromDeg > 180 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${large} 1 ${end.x} ${end.y}`;
  }

  // ângulo final do preenchimento, baseado no valor (0–100 → 0..sweep)
  const fillEnd = startAngle + (Math.max(0, Math.min(100, value)) / 100) * sweep;
  const dangerStart = startAngle + 0.7 * sweep; // a partir de 70%

  // agulha — usa o display (animado)
  const needleAngle = startAngle + (Math.max(0, Math.min(100, display)) / 100) * sweep;
  const needleEnd = arcPoint(needleAngle);

  // ticks a cada 10%
  const ticks = Array.from({ length: 11 }, (_, i) => {
    const deg = startAngle + (i / 10) * sweep;
    const inner = arcPoint(deg);
    const outerR = r + (i % 5 === 0 ? 8 : 4);
    const outerA = toRad(deg - 90);
    const outer = { x: cx + Math.cos(outerA) * outerR, y: cy + Math.sin(outerA) * outerR };
    return { deg, inner, outer, major: i % 5 === 0 };
  });

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl border px-6 py-5"
      style={{
        borderColor: `${accentColor}55`,
        background: `linear-gradient(135deg, ${accentColor}38 0%, rgba(10,12,20,0.98) 34%, rgba(7,9,15,0.99) 100%)`,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.06), 0 18px 48px -28px ${accentColor}55`,
      }}
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
        transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut', delay: delay + 1.6 }}
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

      <div className="mt-2 flex flex-col items-center gap-3 sm:flex-row sm:items-stretch sm:gap-6">
        {/* GAUGE */}
        <div className="relative flex-shrink-0">
          <svg width={280} height={180} viewBox="0 0 280 180" aria-hidden>
            <defs>
              <linearGradient id="gauge-fill" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={accentColor} stopOpacity="0.5" />
                <stop offset="60%" stopColor={accentColor} stopOpacity="0.95" />
                <stop offset="100%" stopColor={accentColor} stopOpacity="1" />
              </linearGradient>
              <filter id="gauge-glow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="0" />
              </filter>
            </defs>

            {/* arco de fundo (track) */}
            <path
              d={arcPath(startAngle, endAngle)}
              fill="none"
              stroke="#ffffff"
              strokeOpacity={0.08}
              strokeWidth={14}
              strokeLinecap="round"
            />

            {/* zona de alerta — 70%-100% */}
            <path
              d={arcPath(dangerStart, endAngle)}
              fill="none"
              stroke={accentColor}
              strokeOpacity={0.15}
              strokeWidth={14}
              strokeLinecap="round"
            />

            {/* arco glow */}
            <motion.path
              d={arcPath(startAngle, fillEnd)}
              fill="none"
              stroke={accentColor}
              strokeOpacity={0.35}
              strokeWidth={18}
              strokeLinecap="round"
              filter="url(#gauge-glow)"
              initial={reduce ? false : { pathLength: 0 }}
              animate={active ? { pathLength: 1 } : reduce ? undefined : { pathLength: 0 }}
              transition={{ duration: 2.0, ease: [0.16, 1, 0.3, 1], delay: 0.65 + delay }}
            />

            {/* arco preenchido — anima drawing */}
            <motion.path
              d={arcPath(startAngle, fillEnd)}
              fill="none"
              stroke="url(#gauge-fill)"
              strokeWidth={11}
              strokeLinecap="round"
              initial={reduce ? false : { pathLength: 0 }}
              animate={active ? { pathLength: 1 } : reduce ? undefined : { pathLength: 0 }}
              transition={{ duration: 2.0, ease: [0.16, 1, 0.3, 1], delay: 0.65 + delay }}
            />

            {/* ticks */}
            {ticks.map((t, i) => (
              <motion.line
                key={i}
                x1={t.inner.x}
                y1={t.inner.y}
                x2={t.outer.x}
                y2={t.outer.y}
                stroke={t.deg >= dangerStart ? accentColor : '#ffffff'}
                strokeOpacity={t.major ? (t.deg >= dangerStart ? 0.95 : 0.45) : (t.deg >= dangerStart ? 0.6 : 0.18)}
                strokeWidth={t.major ? 1.6 : 1}
                strokeLinecap="round"
                initial={reduce ? false : { opacity: 0 }}
                animate={active ? { opacity: 1 } : reduce ? undefined : { opacity: 0 }}
                transition={{ duration: 0.4, delay: 0.4 + delay + i * 0.04 }}
              />
            ))}

            {/* labels 0 e 100 */}
            <text
              x={arcPoint(startAngle).x - 14}
              y={arcPoint(startAngle).y + 18}
              fill="#ffffff"
              fillOpacity={0.4}
              fontSize="10"
              fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
              letterSpacing="2"
              textAnchor="middle"
            >
              0
            </text>
            <text
              x={arcPoint(endAngle).x + 14}
              y={arcPoint(endAngle).y + 18}
              fill={accentColor}
              fillOpacity={0.8}
              fontSize="10"
              fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
              letterSpacing="2"
              textAnchor="middle"
            >
              100
            </text>

            {/* agulha animada */}
            <motion.line
              x1={cx}
              y1={cy}
              x2={needleEnd.x}
              y2={needleEnd.y}
              stroke={accentColor}
              strokeWidth={2.5}
              strokeLinecap="round"
              filter="url(#gauge-glow)"
              initial={reduce ? false : { opacity: 0 }}
              animate={active ? { opacity: 1 } : reduce ? undefined : { opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.85 + delay }}
            />
            <motion.line
              x1={cx}
              y1={cy}
              x2={needleEnd.x}
              y2={needleEnd.y}
              stroke="#ffffff"
              strokeOpacity={0.95}
              strokeWidth={1.2}
              strokeLinecap="round"
              initial={reduce ? false : { opacity: 0 }}
              animate={active ? { opacity: 1 } : reduce ? undefined : { opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.85 + delay }}
            />

            {/* pivot */}
            <circle cx={cx} cy={cy} r={6} fill="#0b0f1a" stroke={accentColor} strokeWidth={1.5} />
            <circle cx={cx} cy={cy} r={2} fill={accentColor} />

            {/* dot pulsante na ponta */}
            <motion.circle
              cx={needleEnd.x}
              cy={needleEnd.y}
              r={3}
              fill={accentColor}
              initial={reduce ? false : { opacity: 0, scale: 0 }}
              animate={
                active ? { opacity: 1, scale: 1 } : reduce ? undefined : { opacity: 0, scale: 0 }
              }
              transition={{ duration: 0.4, delay: 2.4 + delay }}
            />
            <motion.circle
              cx={needleEnd.x}
              cy={needleEnd.y}
              r={3}
              fill="none"
              stroke={accentColor}
              strokeWidth={1}
              animate={
                active && !reduce
                  ? { r: [3, 9, 14], opacity: [0.7, 0.25, 0] }
                  : { opacity: 0 }
              }
              transition={{ duration: 2.6, repeat: Infinity, delay: 2.6 + delay }}
            />
          </svg>

          {/* número centro */}
          <div
            className="pointer-events-none absolute left-1/2 -translate-x-1/2 text-center"
            style={{ top: '60%' }}
          >
            {prefix && (
              <motion.div
                className="text-[0.78rem] font-semibold uppercase tracking-[0.22em] text-white/65"
                initial={reduce ? false : { opacity: 0 }}
                animate={active ? { opacity: 1 } : reduce ? undefined : { opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + delay }}
              >
                {prefix}
              </motion.div>
            )}
            <motion.div
              className="font-display tabular-nums leading-none"
              style={{
                color: accentColor,
                fontSize: 'clamp(2.4rem, 6vw, 3.2rem)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                textShadow: `0 0 24px ${accentColor}88, 0 0 56px ${accentColor}44`,
              }}
              initial={reduce ? false : { opacity: 0, filter: 'none' }}
              animate={
                active
                  ? { opacity: 1, filter: 'none' }
                  : reduce
                    ? undefined
                    : { opacity: 0, filter: 'none' }
              }
              transition={{ duration: 0.7, delay: 0.6 + delay }}
            >
              {formatBR(display, decimals)}
              <span className="ml-0.5 text-[0.55em] font-bold opacity-75">{unit}</span>
            </motion.div>
          </div>
        </div>

        {/* texto à direita do gauge */}
        <div className="flex flex-1 flex-col justify-center">
          <motion.p
            className="text-[1.0rem] font-semibold leading-snug text-white/95"
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={active ? { opacity: 1, y: 0 } : reduce ? undefined : { opacity: 0, y: 6 }}
            transition={{ duration: 0.5, delay: 1.1 + delay }}
          >
            {headline}
          </motion.p>
          {context && (
            <motion.p
              className="mt-2 text-[0.88rem] italic leading-snug text-slate-300/85"
              initial={reduce ? false : { opacity: 0 }}
              animate={active ? { opacity: 1 } : reduce ? undefined : { opacity: 0 }}
              transition={{ duration: 0.6, delay: 1.4 + delay }}
            >
              {context}
            </motion.p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
