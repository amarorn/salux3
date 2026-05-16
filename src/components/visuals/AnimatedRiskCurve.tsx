import { motion, useReducedMotion } from 'framer-motion';

export function AnimatedRiskCurve({ active }: { active: boolean }) {
  const reduceMotion = useReducedMotion();
  const d =
    'M 24 180 C 70 176, 92 160, 116 144 C 140 128, 154 112, 178 98 C 206 82, 238 68, 268 54 C 296 42, 322 30, 356 26';

  const points = [
    { x: 24, y: 180 },
    { x: 116, y: 144 },
    { x: 178, y: 98 },
    { x: 268, y: 54 },
    { x: 356, y: 26 },
  ];

  // Linhas verticais de grid (eixo de tempo)
  const gridX = [82, 140, 198, 256, 314];

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
              <stop offset="0%" stopColor="#fb7185" stopOpacity="0.32" />
              <stop offset="55%" stopColor="#f59e0b" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#54c1ed" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="risk-zone-warn" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fb7185" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#fb7185" stopOpacity="0" />
            </linearGradient>
            <filter id="risk-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="0" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Eixos */}
          <path d="M 24 180 L 356 180" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          <path d="M 24 26 L 24 180" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

          {/* Zona de alerta no topo (onde risco materializa) */}
          <motion.rect
            x={24}
            y={26}
            width={332}
            height={28}
            fill="url(#risk-zone-warn)"
            initial={{ opacity: 0 }}
            animate={{ opacity: active ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          />
          {/* Linha tracejada de limiar */}
          <motion.line
            x1={24}
            y1={54}
            x2={356}
            y2={54}
            stroke="#fb7185"
            strokeWidth={1}
            strokeDasharray="4 6"
            strokeOpacity={0.55}
            initial={reduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
            animate={{ pathLength: active ? 1 : 0 }}
            transition={{ duration: 0.9, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
          {/* Etiqueta do limiar */}
          <motion.text
            x={350}
            y={46}
            textAnchor="end"
            fontSize="8"
            fontWeight="700"
            letterSpacing="2"
            fill="#fb7185"
            initial={{ opacity: 0 }}
            animate={{ opacity: active ? 0.85 : 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            LIMIAR
          </motion.text>

          {/* Linhas verticais de grid */}
          {gridX.map((x, i) => (
            <motion.line
              key={`grid-${i}`}
              x1={x}
              y1={180}
              x2={x}
              y2={30}
              stroke="rgba(255,255,255,0.04)"
              strokeWidth={1}
              initial={reduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
              animate={{ pathLength: active ? 1 : 0 }}
              transition={{ duration: 0.55, delay: 0.1 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
            />
          ))}

          {/* Área sob a curva */}
          <motion.path
            d={`${d} L 356 180 L 24 180 Z`}
            fill="url(#risk-fill)"
            initial={{ opacity: 0 }}
            animate={{ opacity: active ? 1 : 0.2 }}
            transition={{ duration: 0.8, delay: 1.0, ease: 'easeOut' }}
          />

          {/* Linha principal — drawing real via pathLength */}
          <motion.path
            d={d}
            fill="none"
            stroke="url(#risk-line)"
            strokeWidth={3.2}
            strokeLinecap="round"
            filter="url(#risk-glow)"
            initial={reduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
            animate={{ pathLength: active ? 1 : 0 }}
            transition={{ duration: 1.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Pulso de batimento percorrendo continuamente após o draw */}
          {!reduceMotion && active && (
            <motion.path
              d={d}
              fill="none"
              stroke="white"
              strokeWidth={2.2}
              strokeLinecap="round"
              style={{
                filter: 'drop-shadow(0 0 8px #fb7185)',
                strokeDasharray: '14 360',
              }}
              initial={{ strokeDashoffset: 0 }}
              animate={{ strokeDashoffset: -380 }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'linear', delay: 2.2 }}
            />
          )}

          {/* Pontos emergindo sequencialmente — surgem conforme a linha "passa" por eles */}
          {points.map((p, i) => {
            const progress = i / (points.length - 1);
            const pointDelay = 0.3 + progress * 1.5;
            const fillColor = i === 0 ? '#54c1ed' : i === points.length - 1 ? '#fb7185' : i >= points.length - 2 ? '#f59e0b' : '#a8e6ff';
            return (
              <g key={i}>
                {/* Halo respirando */}
                {!reduceMotion && active && (
                  <motion.circle
                    cx={p.x}
                    cy={p.y}
                    r={12}
                    fill="none"
                    stroke={fillColor}
                    strokeWidth={1}
                    initial={{ opacity: 0, scale: 0.4 }}
                    animate={{ opacity: [0, 0.5, 0], scale: [0.4, 1.4, 1.8] }}
                    transition={{
                      duration: 2.4,
                      delay: pointDelay + 0.3,
                      repeat: Infinity,
                      repeatDelay: 1.2,
                      ease: 'easeOut',
                    }}
                  />
                )}
                {/* Núcleo do ponto */}
                <motion.circle
                  cx={p.x}
                  cy={p.y}
                  r={4.5}
                  fill={fillColor}
                  style={{ filter: `drop-shadow(0 0 6px ${fillColor})` }}
                  initial={reduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                  animate={active ? { opacity: 1, scale: 1 } : { opacity: 0.5, scale: 0.8 }}
                  transition={{ duration: 0.45, delay: pointDelay, ease: [0.22, 1.4, 0.36, 1] }}
                />
              </g>
            );
          })}

          {/* Heartbeat radial no ponto final (zona de risco) */}
          {!reduceMotion && active && (
            <>
              <motion.circle
                cx={356}
                cy={26}
                r={4.5}
                fill="#fb7185"
                fillOpacity={0.4}
                animate={{ scale: [1, 3.5, 1], opacity: [0.7, 0, 0.7] }}
                transition={{ duration: 1.9, repeat: Infinity, ease: 'easeOut', delay: 2.0 }}
              />
              <motion.circle
                cx={356}
                cy={26}
                r={4.5}
                fill="#fb7185"
                fillOpacity={0.25}
                animate={{ scale: [1, 5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 1.9, repeat: Infinity, ease: 'easeOut', delay: 2.4 }}
              />
            </>
          )}
        </svg>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/45">
        <span>início</span>
        <span>risco cresce em silêncio</span>
        <span style={{ color: '#fb7185' }}>materializa</span>
      </div>
    </div>
  );
}
