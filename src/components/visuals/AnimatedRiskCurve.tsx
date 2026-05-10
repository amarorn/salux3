import { motion } from 'framer-motion';

export function AnimatedRiskCurve({ active }: { active: boolean }) {
  // Um gráfico estilizado (SVG) que "desenha" a curva e pulsa os pontos.
  // Mantido simples para ficar leve e consistente com o tema.
  const d =
    'M 24 180 C 70 176, 92 160, 116 144 C 140 128, 154 112, 178 98 C 206 82, 238 68, 268 54 C 296 42, 322 30, 356 26';

  const points = [
    { x: 24, y: 180 },
    { x: 116, y: 144 },
    { x: 178, y: 98 },
    { x: 268, y: 54 },
    { x: 356, y: 26 },
  ];

  return (
    <div className="mt-2 rounded-2xl border border-white/10 bg-white/[0.03] p-4 shadow-soft">
      <div className="relative overflow-hidden rounded-xl bg-[#07101b]">
        <svg viewBox="0 0 380 200" className="block h-[190px] w-full">
          <defs>
            <linearGradient id="risk-line" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#54c1ed" stopOpacity="0.9" />
              <stop offset="55%" stopColor="#f59e0b" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#fb7185" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="risk-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#54c1ed" stopOpacity="0.18" />
              <stop offset="70%" stopColor="#fb7185" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </linearGradient>
            <filter id="risk-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <path d="M 24 180 L 356 180" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          <path d="M 24 26 L 24 180" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

          <motion.path
            d={`${d} L 356 180 L 24 180 Z`}
            fill="url(#risk-fill)"
            initial={{ opacity: 0 }}
            animate={{ opacity: active ? 1 : 0.35 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />

          <motion.path
            d={d}
            fill="none"
            stroke="url(#risk-line)"
            strokeWidth="3.2"
            strokeLinecap="round"
            filter="url(#risk-glow)"
            pathLength={1}
            initial={{ strokeDasharray: 1, strokeDashoffset: 1, opacity: 0.9 }}
            animate={
              active
                ? { strokeDashoffset: 0, opacity: 1 }
                : { strokeDashoffset: 0, opacity: 0.65 }
            }
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          />

          {points.map((p, i) => (
            <g key={i}>
              <motion.circle
                cx={p.x}
                cy={p.y}
                r={10}
                fill="rgba(255,255,255,0.0)"
                stroke="rgba(84,193,237,0.18)"
                strokeWidth="1"
                initial={false}
                animate={
                  active
                    ? { opacity: [0.2, 0.6, 0.2], scale: [1, 1.08, 1] }
                    : { opacity: 0.12, scale: 1 }
                }
                transition={{ duration: 1.8, delay: 0.2 + i * 0.08, repeat: active ? Infinity : 0 }}
              />
              <motion.circle
                cx={p.x}
                cy={p.y}
                r={4.5}
                fill="#a8e6ff"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: active ? 1 : 0.7, scale: 1 }}
                transition={{ delay: 0.25 + i * 0.08, duration: 0.5, ease: 'easeOut' }}
              />
            </g>
          ))}
        </svg>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/45">
        <span>início</span>
        <span>risco cresce em silêncio</span>
        <span>materializa</span>
      </div>
    </div>
  );
}

