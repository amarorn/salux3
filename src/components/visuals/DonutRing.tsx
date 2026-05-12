import { useEffect, useState } from 'react';
import { animate } from 'framer-motion';

interface DonutRingProps {
  /** Percentual 0–100. */
  value: number;
  /** Cor do anel. */
  color: string;
  /** Tamanho em px (lado do svg quadrado). */
  size?: number;
  /** Espessura do anel. */
  thickness?: number;
  active: boolean;
  reducedMotion: boolean;
  /** Conteúdo no centro (ex.: número grande). */
  children?: React.ReactNode;
}

export function DonutRing({
  value,
  color,
  size = 120,
  thickness = 8,
  active,
  reducedMotion,
  children,
}: DonutRingProps) {
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const target = Math.max(0, Math.min(100, value));
  const [pct, setPct] = useState(reducedMotion || !active ? target : 0);

  useEffect(() => {
    if (!active || reducedMotion) {
      setPct(target);
      return;
    }
    setPct(0);
    const controls = animate(0, target, {
      duration: 1.55,
      delay: 0.25,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setPct(v),
    });
    return () => controls.stop();
  }, [active, reducedMotion, target]);

  const offset = c - (pct / 100) * c;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="absolute inset-0 -rotate-90">
        <defs>
          <linearGradient id={`donut-grad-${color.replace('#', '')}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.55" />
            <stop offset="100%" stopColor={color} stopOpacity="1" />
          </linearGradient>
        </defs>
        {/* Trilha base */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth={thickness}
        />
        {/* Arco preenchido */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#donut-grad-${color.replace('#', '')})`}
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{
            filter: `drop-shadow(0 0 8px ${color}66)`,
            transition: reducedMotion ? 'stroke-dashoffset 0.2s linear' : undefined,
          }}
        />
        {/* Marcador no fim do arco */}
        {pct > 1 && (
          <circle
            cx={size / 2 + r * Math.cos((pct / 100) * 2 * Math.PI - Math.PI / 2)}
            cy={size / 2 + r * Math.sin((pct / 100) * 2 * Math.PI - Math.PI / 2)}
            r={thickness * 0.5 + 1}
            fill={color}
            style={{ filter: `drop-shadow(0 0 6px ${color})` }}
          />
        )}
      </svg>
      <div className="relative z-10 flex flex-col items-center justify-center leading-none">{children}</div>
    </div>
  );
}
