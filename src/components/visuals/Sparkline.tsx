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

      {/* Linha base */}
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

      {/* Linha de batimento percorrendo continuamente */}
      {!reducedMotion && active && (
        <motion.path
          d={linePath}
          fill="none"
          stroke="white"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            filter: `drop-shadow(0 0 6px ${color})`,
            strokeDasharray: '12 200',
          }}
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: -240 }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'linear', delay: 1.5 }}
        />
      )}

      {/* Pontos de dados emergindo sequencialmente */}
      {points.map(([x, y], i) => {
        const isLast = i === points.length - 1;
        return (
          <motion.circle
            key={`pt-${i}`}
            cx={x}
            cy={y}
            r={isLast ? 3.2 : 1.8}
            fill={isLast ? color : 'white'}
            fillOpacity={isLast ? 1 : 0.7}
            style={{ filter: `drop-shadow(0 0 ${isLast ? 8 : 3}px ${color})` }}
            initial={reducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
            animate={active ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
            transition={{
              duration: 0.4,
              delay: reducedMotion ? 0 : 0.35 + (i / (points.length - 1)) * 1.1,
              ease: [0.22, 1.4, 0.36, 1],
            }}
          />
        );
      })}

      {/* Pulso radial no ponto final (batimento) */}
      {!reducedMotion && active && (
        <motion.circle
          cx={lastPoint[0]}
          cy={lastPoint[1]}
          r={3}
          fill={color}
          fillOpacity={0.4}
          animate={{ scale: [1, 2.6, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut', delay: 1.6 }}
        />
      )}
    </svg>
  );
}
