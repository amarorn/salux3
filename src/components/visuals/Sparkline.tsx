import { motion } from 'framer-motion';

interface SparklineProps {
  data: number[];
  color: string;
  width?: number;
  height?: number;
  active: boolean;
  reducedMotion: boolean;
}

export function Sparkline({
  data,
  color,
  width = 180,
  height = 44,
  active,
  reducedMotion,
}: SparklineProps) {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const padX = 4;
  const padY = 4;
  const innerW = width - padX * 2;
  const innerH = height - padY * 2;

  const points = data.map((v, i) => {
    const x = padX + (i / (data.length - 1)) * innerW;
    const y = padY + innerH - ((v - min) / range) * innerH;
    return [x, y] as const;
  });

  const linePath = points
    .map(([x, y], i) => (i === 0 ? `M${x},${y}` : `L${x},${y}`))
    .join(' ');

  const areaPath =
    points.map(([x, y], i) => (i === 0 ? `M${x},${y}` : `L${x},${y}`)).join(' ') +
    ` L${points[points.length - 1]![0]},${height - padY} L${points[0]![0]},${height - padY} Z`;

  const lastPoint = points[points.length - 1]!;
  const gradId = `spark-grad-${color.replace('#', '')}`;

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Linha de base */}
      <line
        x1={padX}
        y1={height - padY}
        x2={width - padX}
        y2={height - padY}
        stroke="rgba(255,255,255,0.06)"
        strokeWidth={1}
      />

      {/* Área */}
      <motion.path
        d={areaPath}
        fill={`url(#${gradId})`}
        initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
        animate={active ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Linha */}
      <motion.path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ filter: `drop-shadow(0 0 4px ${color}aa)` }}
        initial={reducedMotion ? { pathLength: 1 } : { pathLength: 0 }}
        animate={active ? { pathLength: 1 } : { pathLength: 0 }}
        transition={{ duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Ponto final pulsante */}
      <motion.circle
        cx={lastPoint[0]}
        cy={lastPoint[1]}
        r={3}
        fill={color}
        style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        initial={{ opacity: 0, scale: 0.4 }}
        animate={
          active
            ? reducedMotion
              ? { opacity: 1, scale: 1 }
              : { opacity: [0, 1, 0.7, 1], scale: [0.4, 1.2, 0.9, 1.1] }
            : { opacity: 0, scale: 0.4 }
        }
        transition={{ duration: 1.6, delay: 1.1, repeat: Infinity, repeatDelay: 1.2 }}
      />
    </svg>
  );
}
