import { motion, useReducedMotion } from "framer-motion";

interface Props {
  accentColor: string;
  active: boolean;
  /** Sutil etiqueta opcional sob o gráfico (ex.: "Fluxo de valor"). */
  caption?: string;
}

/**
 * Visual decorativo de rodapé do card — uma "trilha de valor" abstrata.
 * Mostra dois caminhos em paralelo: o de cima (interrompido / sem coordenação)
 * em traço pontilhado neutro, e o de baixo (contínuo / coordenado) em
 * accent com glow e dots pulsantes — reforçando a tese de toda a trilha:
 * valor que se perde em rupturas vs valor protegido enquanto acontece.
 */
export function CardValueFlow({ accentColor, active, caption }: Props) {
  const reduce = useReducedMotion();

  const width = 600;
  const height = 120;

  // Caminho "ruptura" — sobe e desce, com falhas
  const brokenPath =
    "M 20 50 L 100 50 M 130 50 L 230 28 M 260 28 L 360 64 M 390 64 L 490 36 M 520 36 L 580 50";
  // Caminho "contínuo" — uma curva suave e ascendente
  const flowPath = "M 20 90 C 120 90, 180 80, 280 70 S 460 50, 580 40";

  // Pontos no caminho contínuo para os dots pulsantes
  const dots = [
    { x: 80, y: 91, d: 0 },
    { x: 220, y: 76, d: 0.45 },
    { x: 360, y: 62, d: 0.9 },
    { x: 480, y: 48, d: 1.35 },
    { x: 575, y: 41, d: 1.7 },
  ];

  return (
    <div className="pointer-events-none relative mt-auto w-full select-none">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="block w-full"
        aria-hidden
        preserveAspectRatio="none"
        style={{ height: "clamp(110px, 18vh, 160px)" }}
      >
        <defs>
          <linearGradient id="flow-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={accentColor} stopOpacity="0" />
            <stop offset="20%" stopColor={accentColor} stopOpacity="0.8" />
            <stop offset="80%" stopColor={accentColor} stopOpacity="0.8" />
            <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
          </linearGradient>
          <linearGradient id="broken-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <filter id="flow-glow" x="-20%" y="-50%" width="140%" height="200%">
            <feGaussianBlur stdDeviation="0" />
            <feComposite
              in="SourceGraphic"
              in2="SourceGraphic"
              operator="over"
            />
          </filter>
        </defs>

        {/* faixa de fundo sutil */}
        <rect
          x="0"
          y="0"
          width={width}
          height={height}
          fill="url(#flow-grad)"
          opacity="0.04"
        />

        {/* eixo guia */}
        <line
          x1="0"
          y1={height - 8}
          x2={width}
          y2={height - 8}
          stroke="#ffffff"
          strokeOpacity="0.05"
        />

        {/* caminho "ruptura" — pontilhado neutro */}
        <motion.path
          d={brokenPath}
          fill="none"
          stroke="url(#broken-grad)"
          strokeWidth={1.3}
          strokeDasharray="4 5"
          strokeLinecap="round"
          initial={reduce ? false : { pathLength: 0, opacity: 0 }}
          animate={
            active
              ? { pathLength: 1, opacity: 0.7 }
              : reduce
                ? undefined
                : { pathLength: 0, opacity: 0 }
          }
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
        />

        {/* caminho "contínuo" — glow */}
        <motion.path
          d={flowPath}
          fill="none"
          stroke={accentColor}
          strokeWidth={3}
          strokeLinecap="round"
          opacity="0.35"
          filter="url(#flow-glow)"
          initial={reduce ? false : { pathLength: 0 }}
          animate={
            active ? { pathLength: 1 } : reduce ? undefined : { pathLength: 0 }
          }
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: 0.85 }}
        />

        {/* caminho "contínuo" — linha sólida */}
        <motion.path
          d={flowPath}
          fill="none"
          stroke={accentColor}
          strokeWidth={1.5}
          strokeLinecap="round"
          initial={reduce ? false : { pathLength: 0 }}
          animate={
            active ? { pathLength: 1 } : reduce ? undefined : { pathLength: 0 }
          }
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: 0.85 }}
        />

        {/* dots pulsantes no caminho contínuo */}
        {dots.map((d, i) => (
          <motion.g key={i}>
            <motion.circle
              cx={d.x}
              cy={d.y}
              r={2.5}
              fill={accentColor}
              initial={reduce ? false : { opacity: 0, scale: 0 }}
              animate={
                active
                  ? { opacity: 1, scale: 1 }
                  : reduce
                    ? undefined
                    : { opacity: 0, scale: 0 }
              }
              transition={{
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
                delay: 1.2 + d.d * 0.25,
              }}
            />
            <motion.circle
              cx={d.x}
              cy={d.y}
              r={2.5}
              fill="none"
              stroke={accentColor}
              strokeWidth={1}
              initial={{ opacity: 0 }}
              animate={
                active && !reduce
                  ? { opacity: [0, 0.5, 0], r: [2.5, 9, 12] }
                  : { opacity: 0 }
              }
              transition={{
                duration: 2.6,
                ease: "easeOut",
                repeat: Infinity,
                delay: 1.5 + d.d * 0.3,
              }}
            />
          </motion.g>
        ))}

        {/* labels minúsculos nas pontas */}
        <text
          x="20"
          y={18}
          fill="#ffffff"
          fillOpacity="0.32"
          fontSize="8"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          letterSpacing="2"
        >
          ORIGEM
        </text>
        <text
          x={width - 20}
          y={18}
          textAnchor="end"
          fill={accentColor}
          fillOpacity="0.75"
          fontSize="8"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          letterSpacing="2"
        >
          VALOR PROTEGIDO
        </text>
      </svg>

      {caption && (
        <p
          className="mt-1 text-center text-[10px] font-semibold uppercase tracking-[0.32em]"
          style={{ color: accentColor, opacity: 0.55 }}
        >
          {caption}
        </p>
      )}
    </div>
  );
}
