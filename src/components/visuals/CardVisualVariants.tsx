import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { CardValueFlow } from './CardValueFlow';

export type CardVisualVariant =
  | 'flow'
  | 'reveal'
  | 'pattern'
  | 'accumulation'
  | 'late-reaction'
  | 'transform'
  | 'mesh'
  | 'orbit'
  | 'radar'
  | 'entry-points';

interface Props {
  variant?: CardVisualVariant;
  accentColor: string;
  active: boolean;
}

const VIEW = { w: 600, h: 130 };

function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="pointer-events-none relative mt-auto w-full select-none">
      <svg
        viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
        className="block w-full"
        aria-hidden
        preserveAspectRatio="none"
        style={{ height: 'clamp(110px, 18vh, 160px)' }}
      >
        {children}
      </svg>
    </div>
  );
}

function Label({ x, y, anchor, color, opacity, children }: { x: number; y: number; anchor?: 'start' | 'end' | 'middle'; color: string; opacity: number; children: string }) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor ?? 'start'}
      fill={color}
      fillOpacity={opacity}
      fontSize="8"
      fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
      letterSpacing="2"
    >
      {children}
    </text>
  );
}

/* ───────── 1. reveal ─────────
   Pontos em grade; metade "visível" (accent + glow), metade
   "despercebida" (cinza fraco). Anéis pulsando sobre os visíveis. */
function Reveal({ accentColor, active, reduce }: Props & { reduce: boolean }) {
  const cols = 18;
  const rows = 5;
  const cellW = VIEW.w / (cols + 1);
  const cellH = (VIEW.h - 30) / (rows + 1);
  const visibleIdx = new Set([3, 9, 16, 22, 31, 40, 48, 56, 63, 71, 80]);
  return (
    <Shell>
      <Label x={20} y={18} color="#ffffff" opacity={0.32}>DESPERCEBIDO</Label>
      <Label x={VIEW.w - 20} y={18} anchor="end" color={accentColor} opacity={0.75}>VISÍVEL</Label>
      {Array.from({ length: cols * rows }).map((_, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = (col + 1) * cellW;
        const y = (row + 1) * cellH + 18;
        const visible = visibleIdx.has(i);
        return (
          <motion.g key={i}>
            <motion.circle
              cx={x}
              cy={y}
              r={visible ? 2.2 : 1.4}
              fill={visible ? accentColor : '#ffffff'}
              initial={reduce ? false : { opacity: 0 }}
              animate={active ? { opacity: visible ? 1 : 0.18 } : reduce ? undefined : { opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + (i % 11) * 0.04 }}
            />
            {visible && (
              <motion.circle
                cx={x}
                cy={y}
                r={2.2}
                fill="none"
                stroke={accentColor}
                strokeWidth={0.7}
                initial={{ opacity: 0 }}
                animate={active && !reduce ? { opacity: [0, 0.45, 0], r: [2.2, 8, 12] } : { opacity: 0 }}
                transition={{ duration: 2.8, repeat: Infinity, delay: 1.2 + (i % 5) * 0.45 }}
              />
            )}
          </motion.g>
        );
      })}
    </Shell>
  );
}

/* ───────── 2. pattern ─────────
   Onda senoidal repetindo — mostra que não é desvio, é padrão. */
function Pattern({ accentColor, active, reduce }: Props & { reduce: boolean }) {
  const cycles = 4;
  const amp = 16;
  const baseY = VIEW.h / 2 + 8;
  const step = VIEW.w / 240;
  const pts: string[] = [];
  for (let i = 0; i <= 240; i++) {
    const x = i * step;
    const y = baseY + Math.sin((i / 240) * cycles * Math.PI * 2) * amp;
    pts.push(`${i === 0 ? 'M' : 'L'} ${x} ${y}`);
  }
  return (
    <Shell>
      <Label x={20} y={18} color="#ffffff" opacity={0.32}>CICLO 1</Label>
      <Label x={VIEW.w - 20} y={18} anchor="end" color={accentColor} opacity={0.75}>SE REPETE</Label>
      {/* marcas dos picos para reforçar "padrão" */}
      {Array.from({ length: cycles }).map((_, i) => {
        const cx = (i + 0.25) * (VIEW.w / cycles) + 10;
        return (
          <motion.line
            key={i}
            x1={cx} x2={cx}
            y1={baseY - amp - 6} y2={baseY + amp + 6}
            stroke={accentColor}
            strokeOpacity={0.15}
            strokeDasharray="2 3"
            initial={reduce ? false : { opacity: 0 }}
            animate={active ? { opacity: 1 } : reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.8 + i * 0.15 }}
          />
        );
      })}
      <motion.path
        d={pts.join(' ')}
        fill="none"
        stroke={accentColor}
        strokeWidth={1.7}
        strokeLinecap="round"
        initial={reduce ? false : { pathLength: 0 }}
        animate={active ? { pathLength: 1 } : reduce ? undefined : { pathLength: 0 }}
        transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
      />
    </Shell>
  );
}

/* ───────── 3. accumulation ─────────
   4 colunas crescentes — perda que se acumula. */
function Accumulation({ accentColor, active, reduce }: Props & { reduce: boolean }) {
  const bars = [22, 38, 58, 82];
  const labels = ['01', '02', '03', '04'];
  const barW = 60;
  const gap = (VIEW.w - barW * 4) / 5;
  const baseY = VIEW.h - 14;
  return (
    <Shell>
      <Label x={20} y={18} color="#ffffff" opacity={0.32}>ETAPA 01</Label>
      <Label x={VIEW.w - 20} y={18} anchor="end" color={accentColor} opacity={0.75}>RUPTURA ACUMULADA</Label>
      <line x1={0} x2={VIEW.w} y1={baseY + 2} y2={baseY + 2} stroke="#ffffff" strokeOpacity={0.08} />
      {bars.map((h, i) => {
        const x = gap + i * (barW + gap);
        return (
          <motion.g key={i}>
            <motion.rect
              x={x}
              y={baseY - h}
              width={barW}
              height={h}
              fill={accentColor}
              fillOpacity={0.18 + i * 0.18}
              rx={3}
              initial={reduce ? false : { scaleY: 0 }}
              animate={active ? { scaleY: 1 } : reduce ? undefined : { scaleY: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.55 + i * 0.16 }}
              style={{ transformOrigin: `${x + barW / 2}px ${baseY}px` }}
            />
            <motion.rect
              x={x}
              y={baseY - h}
              width={barW}
              height={2}
              fill={accentColor}
              initial={{ opacity: 0 }}
              animate={active ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.85 + i * 0.16 }}
            />
            <motion.text
              x={x + barW / 2}
              y={baseY + 12}
              textAnchor="middle"
              fill={accentColor}
              fillOpacity={0.7}
              fontSize="8"
              fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
              letterSpacing="2"
              initial={{ opacity: 0 }}
              animate={active ? { opacity: 0.8 } : { opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.85 + i * 0.16 }}
            >
              {labels[i]}
            </motion.text>
          </motion.g>
        );
      })}
    </Shell>
  );
}

/* ───────── 4. late-reaction ─────────
   Curva descendente + alerta tardio aparecendo só na ponta. */
function LateReaction({ accentColor, active, reduce }: Props & { reduce: boolean }) {
  const path = `M 20 ${VIEW.h / 2} C 120 ${VIEW.h / 2}, 200 ${VIEW.h / 2 + 5}, 320 ${VIEW.h - 28} S 500 ${VIEW.h - 14}, 575 ${VIEW.h - 12}`;
  return (
    <Shell>
      <Label x={20} y={18} color="#ffffff" opacity={0.32}>VALOR</Label>
      <Label x={VIEW.w - 20} y={18} anchor="end" color={accentColor} opacity={0.75}>ALERTA TARDE DEMAIS</Label>
      <motion.path
        d={path}
        fill="none"
        stroke={accentColor}
        strokeWidth={1.6}
        strokeLinecap="round"
        opacity={0.9}
        initial={reduce ? false : { pathLength: 0 }}
        animate={active ? { pathLength: 1 } : reduce ? undefined : { pathLength: 0 }}
        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
      />
      {/* alerta aparece TARDE no final */}
      <motion.g
        initial={reduce ? false : { opacity: 0, scale: 0 }}
        animate={active ? { opacity: 1, scale: 1 } : reduce ? undefined : { opacity: 0, scale: 0 }}
        transition={{ duration: 0.45, delay: 2.2 }}
        style={{ transformOrigin: `575px ${VIEW.h - 12}px` }}
      >
        <circle cx={575} cy={VIEW.h - 12} r={5} fill={accentColor} />
        <motion.circle
          cx={575}
          cy={VIEW.h - 12}
          r={5}
          fill="none"
          stroke={accentColor}
          strokeWidth={1}
          animate={!reduce ? { r: [5, 16, 24], opacity: [0.6, 0.2, 0] } : undefined}
          transition={{ duration: 2, repeat: Infinity, delay: 2.4 }}
        />
      </motion.g>
    </Shell>
  );
}

/* ───────── 5. transform ─────────
   Curva caótica à esquerda → curva coordenada à direita. */
function Transform({ accentColor, active, reduce }: Props & { reduce: boolean }) {
  // caótica esquerda
  const chaos = 'M 20 70 L 50 50 L 70 85 L 95 45 L 120 80 L 145 55 L 170 90 L 195 50 L 220 75 L 250 60';
  // coordenada direita
  const coord = 'M 280 60 C 350 60, 410 55, 480 48 S 560 38, 580 36';
  const bridge = 'M 250 60 C 260 60, 270 60, 280 60';
  return (
    <Shell>
      <Label x={20} y={18} color="#ffffff" opacity={0.32}>REAÇÃO</Label>
      <Label x={VIEW.w - 20} y={18} anchor="end" color={accentColor} opacity={0.75}>ESTRUTURA</Label>
      <line x1={VIEW.w / 2 - 15} x2={VIEW.w / 2 - 15} y1={26} y2={VIEW.h - 6} stroke="#ffffff" strokeOpacity={0.06} strokeDasharray="2 4" />
      <motion.path
        d={chaos}
        fill="none"
        stroke="#ffffff"
        strokeOpacity={0.3}
        strokeWidth={1.3}
        strokeLinecap="round"
        initial={reduce ? false : { pathLength: 0 }}
        animate={active ? { pathLength: 1 } : reduce ? undefined : { pathLength: 0 }}
        transition={{ duration: 1.2, delay: 0.4 }}
      />
      <motion.path
        d={bridge}
        fill="none"
        stroke={accentColor}
        strokeOpacity={0.4}
        strokeWidth={1}
        strokeDasharray="3 3"
        initial={reduce ? false : { pathLength: 0 }}
        animate={active ? { pathLength: 1 } : reduce ? undefined : { pathLength: 0 }}
        transition={{ duration: 0.4, delay: 1.6 }}
      />
      <motion.path
        d={coord}
        fill="none"
        stroke={accentColor}
        strokeWidth={1.8}
        strokeLinecap="round"
        initial={reduce ? false : { pathLength: 0 }}
        animate={active ? { pathLength: 1 } : reduce ? undefined : { pathLength: 0 }}
        transition={{ duration: 1.4, delay: 2.0 }}
      />
      {/* divisor luminoso entre os dois lados */}
      <motion.circle
        cx={265}
        cy={60}
        r={3}
        fill={accentColor}
        initial={reduce ? false : { opacity: 0 }}
        animate={active ? { opacity: 1 } : reduce ? undefined : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 1.7 }}
      />
      <motion.circle
        cx={265}
        cy={60}
        r={3}
        fill="none"
        stroke={accentColor}
        strokeWidth={1}
        animate={active && !reduce ? { r: [3, 10, 16], opacity: [0.6, 0.2, 0] } : { opacity: 0 }}
        transition={{ duration: 2.4, repeat: Infinity, delay: 2.0 }}
      />
    </Shell>
  );
}

/* ───────── 6. mesh ─────────
   N nós conectados — coordenação. */
function Mesh({ accentColor, active, reduce, nodes = 6 }: Props & { reduce: boolean; nodes?: number }) {
  // distribuir em duas linhas (3+3) ou hexágono
  const pts: { x: number; y: number }[] = [];
  if (nodes === 6) {
    const xs = [110, 240, 370, 490, 240, 370];
    const ys = [40, 30, 38, 55, 95, 100];
    for (let i = 0; i < 6; i++) pts.push({ x: xs[i], y: ys[i] });
  } else {
    for (let i = 0; i < nodes; i++) pts.push({ x: 60 + i * ((VIEW.w - 120) / (nodes - 1)), y: VIEW.h / 2 });
  }
  // conexões (pares)
  const edges: [number, number][] = [
    [0, 1],
    [1, 2],
    [2, 3],
    [0, 4],
    [1, 4],
    [2, 5],
    [3, 5],
    [4, 5],
  ];
  return (
    <Shell>
      <Label x={20} y={18} color="#ffffff" opacity={0.32}>PONTO</Label>
      <Label x={VIEW.w - 20} y={18} anchor="end" color={accentColor} opacity={0.75}>BASE COORDENADA</Label>
      {edges.map(([a, b], i) => (
        <motion.line
          key={i}
          x1={pts[a].x}
          y1={pts[a].y}
          x2={pts[b].x}
          y2={pts[b].y}
          stroke={accentColor}
          strokeOpacity={0.35}
          strokeWidth={1}
          initial={reduce ? false : { pathLength: 0 }}
          animate={active ? { pathLength: 1 } : reduce ? undefined : { pathLength: 0 }}
          transition={{ duration: 0.6, delay: 0.6 + i * 0.07 }}
        />
      ))}
      {pts.map((p, i) => (
        <motion.g key={i}>
          <motion.circle
            cx={p.x}
            cy={p.y}
            r={4}
            fill={accentColor}
            initial={reduce ? false : { opacity: 0, scale: 0 }}
            animate={active ? { opacity: 1, scale: 1 } : reduce ? undefined : { opacity: 0, scale: 0 }}
            transition={{ duration: 0.4, delay: 1.2 + i * 0.08 }}
          />
          <motion.circle
            cx={p.x}
            cy={p.y}
            r={4}
            fill="none"
            stroke={accentColor}
            strokeWidth={1}
            animate={active && !reduce ? { r: [4, 12, 18], opacity: [0.6, 0.2, 0] } : { opacity: 0 }}
            transition={{ duration: 2.6, repeat: Infinity, delay: 1.6 + i * 0.25 }}
          />
        </motion.g>
      ))}
    </Shell>
  );
}

/* ───────── 7. orbit ─────────
   Anéis concêntricos, dots orbitando — ecossistema. */
function Orbit({ accentColor, active, reduce }: Props & { reduce: boolean }) {
  const cx = VIEW.w / 2;
  const cy = VIEW.h / 2 + 8;
  const rings = [22, 38, 54];
  return (
    <Shell>
      <Label x={20} y={18} color="#ffffff" opacity={0.32}>NÚCLEO</Label>
      <Label x={VIEW.w - 20} y={18} anchor="end" color={accentColor} opacity={0.75}>ECOSSISTEMA</Label>
      {rings.map((r, i) => (
        <motion.circle
          key={i}
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={accentColor}
          strokeOpacity={0.18 + i * 0.1}
          strokeWidth={1}
          strokeDasharray={i === 2 ? '2 4' : undefined}
          initial={reduce ? false : { pathLength: 0, opacity: 0 }}
          animate={active ? { pathLength: 1, opacity: 0.5 - i * 0.08 } : reduce ? undefined : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 1.2, delay: 0.4 + i * 0.15 }}
        />
      ))}
      <circle cx={cx} cy={cy} r={4} fill={accentColor} />
      {rings.map((r, i) => {
        const count = 3 + i;
        return Array.from({ length: count }).map((_, k) => {
          const angle = (k / count) * Math.PI * 2 + i * 0.4;
          const px = cx + Math.cos(angle) * r;
          const py = cy + Math.sin(angle) * r;
          return (
            <motion.circle
              key={`${i}-${k}`}
              cx={px}
              cy={py}
              r={2}
              fill={accentColor}
              initial={reduce ? false : { opacity: 0, scale: 0 }}
              animate={active ? { opacity: 0.85, scale: 1 } : reduce ? undefined : { opacity: 0, scale: 0 }}
              transition={{ duration: 0.4, delay: 1.1 + i * 0.15 + k * 0.07 }}
            />
          );
        });
      })}
    </Shell>
  );
}

/* ───────── 8. radar ─────────
   Setor de radar varrendo — agente que age. */
function Radar({ accentColor, active, reduce }: Props & { reduce: boolean }) {
  const cx = 90;
  const cy = VIEW.h / 2 + 8;
  const max = 56;
  // marcas sendo "vistas" pelo radar
  const targets = [
    { x: 180, y: 40 },
    { x: 250, y: 70 },
    { x: 340, y: 35 },
    { x: 420, y: 80 },
    { x: 500, y: 50 },
    { x: 550, y: 90 },
  ];
  return (
    <Shell>
      <Label x={20} y={18} color="#ffffff" opacity={0.32}>SCAN</Label>
      <Label x={VIEW.w - 20} y={18} anchor="end" color={accentColor} opacity={0.75}>AGENTE EM AÇÃO</Label>
      {[1, 2, 3].map((i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={(max / 3) * i}
          fill="none"
          stroke={accentColor}
          strokeOpacity={0.12}
          strokeDasharray="2 4"
        />
      ))}
      {!reduce && (
        <motion.g
          style={{ transformOrigin: `${cx}px ${cy}px` }}
          animate={active ? { rotate: 360 } : undefined}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'linear', delay: 0.6 }}
        >
          <defs>
            <linearGradient id="radar-sweep" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={accentColor} stopOpacity="0" />
              <stop offset="100%" stopColor={accentColor} stopOpacity="0.55" />
            </linearGradient>
          </defs>
          <path d={`M ${cx} ${cy} L ${cx + max} ${cy} A ${max} ${max} 0 0 0 ${cx + Math.cos(-Math.PI / 4) * max} ${cy + Math.sin(-Math.PI / 4) * max} Z`} fill="url(#radar-sweep)" />
        </motion.g>
      )}
      <circle cx={cx} cy={cy} r={3} fill={accentColor} />
      {targets.map((t, i) => (
        <motion.circle
          key={i}
          cx={t.x}
          cy={t.y}
          r={2.5}
          fill={accentColor}
          initial={reduce ? false : { opacity: 0 }}
          animate={active && !reduce ? { opacity: [0, 1, 0.4, 1, 0.4] } : active ? { opacity: 0.7 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 1.5 + i * 0.4 }}
        />
      ))}
    </Shell>
  );
}

/* ───────── 9. entry-points ─────────
   N setas/linhas entrando em um nó central. */
function EntryPoints({ accentColor, active, reduce }: Props & { reduce: boolean }) {
  const cx = VIEW.w / 2;
  const cy = VIEW.h / 2 + 6;
  const starts = [
    { x: 50, y: 40 },
    { x: 80, y: 95 },
    { x: VIEW.w - 50, y: 40 },
    { x: VIEW.w - 80, y: 95 },
    { x: cx - 200, y: 30 },
    { x: cx + 180, y: 110 },
  ];
  return (
    <Shell>
      <Label x={20} y={18} color="#ffffff" opacity={0.32}>PONTOS DE ENTRADA</Label>
      <Label x={VIEW.w - 20} y={18} anchor="end" color={accentColor} opacity={0.75}>RESPOSTA COORDENADA</Label>
      {starts.map((s, i) => {
        const dx = cx - s.x;
        const dy = cy - s.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        const tx = s.x + (dx / len) * (len - 10);
        const ty = s.y + (dy / len) * (len - 10);
        return (
          <motion.g key={i}>
            <motion.line
              x1={s.x}
              y1={s.y}
              x2={tx}
              y2={ty}
              stroke={accentColor}
              strokeOpacity={0.5}
              strokeWidth={1}
              initial={reduce ? false : { pathLength: 0, opacity: 0 }}
              animate={active ? { pathLength: 1, opacity: 0.55 } : reduce ? undefined : { pathLength: 0, opacity: 0 }}
              transition={{ duration: 0.7, delay: 0.5 + i * 0.12 }}
            />
            <motion.circle
              cx={s.x}
              cy={s.y}
              r={2.5}
              fill={accentColor}
              fillOpacity={0.85}
              initial={reduce ? false : { opacity: 0 }}
              animate={active ? { opacity: 1 } : reduce ? undefined : { opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.5 + i * 0.12 }}
            />
          </motion.g>
        );
      })}
      <circle cx={cx} cy={cy} r={6} fill={accentColor} />
      <motion.circle
        cx={cx}
        cy={cy}
        r={6}
        fill="none"
        stroke={accentColor}
        strokeWidth={1}
        animate={active && !reduce ? { r: [6, 18, 28], opacity: [0.55, 0.15, 0] } : { opacity: 0 }}
        transition={{ duration: 2.4, repeat: Infinity, delay: 1.4 }}
      />
    </Shell>
  );
}

export function CardVisual({ variant, accentColor, active }: Props) {
  const reduce = Boolean(useReducedMotion());
  switch (variant) {
    case 'reveal':
      return <Reveal accentColor={accentColor} active={active} reduce={reduce} />;
    case 'pattern':
      return <Pattern accentColor={accentColor} active={active} reduce={reduce} />;
    case 'accumulation':
      return <Accumulation accentColor={accentColor} active={active} reduce={reduce} />;
    case 'late-reaction':
      return <LateReaction accentColor={accentColor} active={active} reduce={reduce} />;
    case 'transform':
      return <Transform accentColor={accentColor} active={active} reduce={reduce} />;
    case 'mesh':
      return <Mesh accentColor={accentColor} active={active} reduce={reduce} />;
    case 'orbit':
      return <Orbit accentColor={accentColor} active={active} reduce={reduce} />;
    case 'radar':
      return <Radar accentColor={accentColor} active={active} reduce={reduce} />;
    case 'entry-points':
      return <EntryPoints accentColor={accentColor} active={active} reduce={reduce} />;
    case 'flow':
    default:
      return <CardValueFlow accentColor={accentColor} active={active} />;
  }
}
