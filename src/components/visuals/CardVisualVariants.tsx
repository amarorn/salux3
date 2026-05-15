import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CardValueFlow } from "./CardValueFlow";

export type CardVisualVariant =
  | "flow"
  | "reveal"
  | "pattern"
  | "accumulation"
  | "late-reaction"
  | "transform"
  | "mesh"
  | "orbit"
  | "radar"
  | "entry-points"
  | "alignment"
  | "modular"
  | "signal"
  | "spotlight"
  | "bloom"
  | "compass"
  | "weave"
  | "ripple"
  | "tide"
  | "fragment"
  | "converge"
  | "ladder"
  | "branch"
  | "echo"
  | "scale"
  | "thread"
  | "bridge"
  | "heartbeat"
  | "magnet"
  | "prism"
  | "spiral"
  | "portal"
  | "lens"
  | "shield"
  | "gear"
  | "crystal"
  | "funnel"
  | "relay"
  | "fan"
  | "helix";

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
        style={{ height: "clamp(110px, 18vh, 160px)" }}
      >
        {children}
      </svg>
    </div>
  );
}

function Label({
  x,
  y,
  anchor,
  color,
  opacity,
  children,
}: {
  x: number;
  y: number;
  anchor?: "start" | "end" | "middle";
  color: string;
  opacity: number;
  children: string;
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor ?? "start"}
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
      <Label x={20} y={18} color="#ffffff" opacity={0.32}>
        DESPERCEBIDO
      </Label>
      <Label
        x={VIEW.w - 20}
        y={18}
        anchor="end"
        color={accentColor}
        opacity={0.75}
      >
        VISÍVEL
      </Label>
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
              fill={visible ? accentColor : "#ffffff"}
              initial={reduce ? false : { opacity: 0 }}
              animate={
                active
                  ? { opacity: visible ? 1 : 0.18 }
                  : reduce
                    ? undefined
                    : { opacity: 0 }
              }
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
                animate={
                  active && !reduce
                    ? { opacity: [0, 0.45, 0], r: [2.2, 8, 12] }
                    : { opacity: 0 }
                }
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  delay: 1.2 + (i % 5) * 0.45,
                }}
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
    pts.push(`${i === 0 ? "M" : "L"} ${x} ${y}`);
  }
  return (
    <Shell>
      <Label x={20} y={18} color="#ffffff" opacity={0.32}>
        CICLO 1
      </Label>
      <Label
        x={VIEW.w - 20}
        y={18}
        anchor="end"
        color={accentColor}
        opacity={0.75}
      >
        SE REPETE
      </Label>
      {/* marcas dos picos para reforçar "padrão" */}
      {Array.from({ length: cycles }).map((_, i) => {
        const cx = (i + 0.25) * (VIEW.w / cycles) + 10;
        return (
          <motion.line
            key={i}
            x1={cx}
            x2={cx}
            y1={baseY - amp - 6}
            y2={baseY + amp + 6}
            stroke={accentColor}
            strokeOpacity={0.15}
            strokeDasharray="2 3"
            initial={reduce ? false : { opacity: 0 }}
            animate={
              active ? { opacity: 1 } : reduce ? undefined : { opacity: 0 }
            }
            transition={{ duration: 0.5, delay: 0.8 + i * 0.15 }}
          />
        );
      })}
      <motion.path
        d={pts.join(" ")}
        fill="none"
        stroke={accentColor}
        strokeWidth={1.7}
        strokeLinecap="round"
        initial={reduce ? false : { pathLength: 0 }}
        animate={
          active ? { pathLength: 1 } : reduce ? undefined : { pathLength: 0 }
        }
        transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
      />
    </Shell>
  );
}

/* ───────── 3. accumulation ─────────
   4 colunas crescentes — perda que se acumula. */
function Accumulation({
  accentColor,
  active,
  reduce,
}: Props & { reduce: boolean }) {
  const bars = [22, 38, 58, 82];
  const labels = ["01", "02", "03", "04"];
  const barW = 60;
  const gap = (VIEW.w - barW * 4) / 5;
  const baseY = VIEW.h - 14;
  return (
    <Shell>
      <Label x={20} y={18} color="#ffffff" opacity={0.32}>
        ETAPA 01
      </Label>
      <Label
        x={VIEW.w - 20}
        y={18}
        anchor="end"
        color={accentColor}
        opacity={0.75}
      >
        RUPTURA ACUMULADA
      </Label>
      <line
        x1={0}
        x2={VIEW.w}
        y1={baseY + 2}
        y2={baseY + 2}
        stroke="#ffffff"
        strokeOpacity={0.08}
      />
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
              animate={
                active ? { scaleY: 1 } : reduce ? undefined : { scaleY: 0 }
              }
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.55 + i * 0.16,
              }}
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
function LateReaction({
  accentColor,
  active,
  reduce,
}: Props & { reduce: boolean }) {
  const path = `M 20 ${VIEW.h / 2} C 120 ${VIEW.h / 2}, 200 ${VIEW.h / 2 + 5}, 320 ${VIEW.h - 28} S 500 ${VIEW.h - 14}, 575 ${VIEW.h - 12}`;
  return (
    <Shell>
      <Label x={20} y={18} color="#ffffff" opacity={0.32}>
        VALOR
      </Label>
      <Label
        x={VIEW.w - 20}
        y={18}
        anchor="end"
        color={accentColor}
        opacity={0.75}
      >
        ALERTA TARDE DEMAIS
      </Label>
      <motion.path
        d={path}
        fill="none"
        stroke={accentColor}
        strokeWidth={1.6}
        strokeLinecap="round"
        opacity={0.9}
        initial={reduce ? false : { pathLength: 0 }}
        animate={
          active ? { pathLength: 1 } : reduce ? undefined : { pathLength: 0 }
        }
        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
      />
      {/* alerta aparece TARDE no final */}
      <motion.g
        initial={reduce ? false : { opacity: 0, scale: 0 }}
        animate={
          active
            ? { opacity: 1, scale: 1 }
            : reduce
              ? undefined
              : { opacity: 0, scale: 0 }
        }
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
          animate={
            !reduce ? { r: [5, 16, 24], opacity: [0.6, 0.2, 0] } : undefined
          }
          transition={{ duration: 2, repeat: Infinity, delay: 2.4 }}
        />
      </motion.g>
    </Shell>
  );
}

/* ───────── 5. transform ─────────
   Curva caótica à esquerda → curva coordenada à direita. */
function Transform({
  accentColor,
  active,
  reduce,
}: Props & { reduce: boolean }) {
  // caótica esquerda
  const chaos =
    "M 20 70 L 50 50 L 70 85 L 95 45 L 120 80 L 145 55 L 170 90 L 195 50 L 220 75 L 250 60";
  // coordenada direita
  const coord = "M 280 60 C 350 60, 410 55, 480 48 S 560 38, 580 36";
  const bridge = "M 250 60 C 260 60, 270 60, 280 60";
  return (
    <Shell>
      <Label x={20} y={18} color="#ffffff" opacity={0.32}>
        REAÇÃO
      </Label>
      <Label
        x={VIEW.w - 20}
        y={18}
        anchor="end"
        color={accentColor}
        opacity={0.75}
      >
        ESTRUTURA
      </Label>
      <line
        x1={VIEW.w / 2 - 15}
        x2={VIEW.w / 2 - 15}
        y1={26}
        y2={VIEW.h - 6}
        stroke="#ffffff"
        strokeOpacity={0.06}
        strokeDasharray="2 4"
      />
      <motion.path
        d={chaos}
        fill="none"
        stroke="#ffffff"
        strokeOpacity={0.3}
        strokeWidth={1.3}
        strokeLinecap="round"
        initial={reduce ? false : { pathLength: 0 }}
        animate={
          active ? { pathLength: 1 } : reduce ? undefined : { pathLength: 0 }
        }
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
        animate={
          active ? { pathLength: 1 } : reduce ? undefined : { pathLength: 0 }
        }
        transition={{ duration: 0.4, delay: 1.6 }}
      />
      <motion.path
        d={coord}
        fill="none"
        stroke={accentColor}
        strokeWidth={1.8}
        strokeLinecap="round"
        initial={reduce ? false : { pathLength: 0 }}
        animate={
          active ? { pathLength: 1 } : reduce ? undefined : { pathLength: 0 }
        }
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
        animate={
          active && !reduce
            ? { r: [3, 10, 16], opacity: [0.6, 0.2, 0] }
            : { opacity: 0 }
        }
        transition={{ duration: 2.4, repeat: Infinity, delay: 2.0 }}
      />
    </Shell>
  );
}

/* ───────── 6. mesh ─────────
   N nós conectados — coordenação. */
function Mesh({
  accentColor,
  active,
  reduce,
  nodes = 6,
}: Props & { reduce: boolean; nodes?: number }) {
  // distribuir em duas linhas (3+3) ou hexágono
  const pts: { x: number; y: number }[] = [];
  if (nodes === 6) {
    const xs = [110, 240, 370, 490, 240, 370];
    const ys = [40, 30, 38, 55, 95, 100];
    for (let i = 0; i < 6; i++) pts.push({ x: xs[i], y: ys[i] });
  } else {
    for (let i = 0; i < nodes; i++)
      pts.push({ x: 60 + i * ((VIEW.w - 120) / (nodes - 1)), y: VIEW.h / 2 });
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
      <Label x={20} y={18} color="#ffffff" opacity={0.32}>
        PONTO
      </Label>
      <Label
        x={VIEW.w - 20}
        y={18}
        anchor="end"
        color={accentColor}
        opacity={0.75}
      >
        BASE COORDENADA
      </Label>
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
          animate={
            active ? { pathLength: 1 } : reduce ? undefined : { pathLength: 0 }
          }
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
            animate={
              active
                ? { opacity: 1, scale: 1 }
                : reduce
                  ? undefined
                  : { opacity: 0, scale: 0 }
            }
            transition={{ duration: 0.4, delay: 1.2 + i * 0.08 }}
          />
          <motion.circle
            cx={p.x}
            cy={p.y}
            r={4}
            fill="none"
            stroke={accentColor}
            strokeWidth={1}
            animate={
              active && !reduce
                ? { r: [4, 12, 18], opacity: [0.6, 0.2, 0] }
                : { opacity: 0 }
            }
            transition={{
              duration: 2.6,
              repeat: Infinity,
              delay: 1.6 + i * 0.25,
            }}
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
      <Label x={20} y={18} color="#ffffff" opacity={0.32}>
        NÚCLEO
      </Label>
      <Label
        x={VIEW.w - 20}
        y={18}
        anchor="end"
        color={accentColor}
        opacity={0.75}
      >
        ECOSSISTEMA
      </Label>
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
          strokeDasharray={i === 2 ? "2 4" : undefined}
          initial={reduce ? false : { pathLength: 0, opacity: 0 }}
          animate={
            active
              ? { pathLength: 1, opacity: 0.5 - i * 0.08 }
              : reduce
                ? undefined
                : { pathLength: 0, opacity: 0 }
          }
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
              animate={
                active
                  ? { opacity: 0.85, scale: 1 }
                  : reduce
                    ? undefined
                    : { opacity: 0, scale: 0 }
              }
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
      <Label x={20} y={18} color="#ffffff" opacity={0.32}>
        SCAN
      </Label>
      <Label
        x={VIEW.w - 20}
        y={18}
        anchor="end"
        color={accentColor}
        opacity={0.75}
      >
        AGENTE EM AÇÃO
      </Label>
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
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "linear",
            delay: 0.6,
          }}
        >
          <defs>
            <linearGradient id="radar-sweep" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={accentColor} stopOpacity="0" />
              <stop offset="100%" stopColor={accentColor} stopOpacity="0.55" />
            </linearGradient>
          </defs>
          <path
            d={`M ${cx} ${cy} L ${cx + max} ${cy} A ${max} ${max} 0 0 0 ${cx + Math.cos(-Math.PI / 4) * max} ${cy + Math.sin(-Math.PI / 4) * max} Z`}
            fill="url(#radar-sweep)"
          />
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
          animate={
            active && !reduce
              ? { opacity: [0, 1, 0.4, 1, 0.4] }
              : active
                ? { opacity: 0.7 }
                : { opacity: 0 }
          }
          transition={{ duration: 0.6, delay: 1.5 + i * 0.4 }}
        />
      ))}
    </Shell>
  );
}

/* ───────── 9. entry-points ─────────
   N setas/linhas entrando em um nó central. */
function EntryPoints({
  accentColor,
  active,
  reduce,
}: Props & { reduce: boolean }) {
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
      <Label x={20} y={18} color="#ffffff" opacity={0.32}>
        PONTOS DE ENTRADA
      </Label>
      <Label
        x={VIEW.w - 20}
        y={18}
        anchor="end"
        color={accentColor}
        opacity={0.75}
      >
        RESPOSTA COORDENADA
      </Label>
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
              animate={
                active
                  ? { pathLength: 1, opacity: 0.55 }
                  : reduce
                    ? undefined
                    : { pathLength: 0, opacity: 0 }
              }
              transition={{ duration: 0.7, delay: 0.5 + i * 0.12 }}
            />
            <motion.circle
              cx={s.x}
              cy={s.y}
              r={2.5}
              fill={accentColor}
              fillOpacity={0.85}
              initial={reduce ? false : { opacity: 0 }}
              animate={
                active ? { opacity: 1 } : reduce ? undefined : { opacity: 0 }
              }
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
        animate={
          active && !reduce
            ? { r: [6, 18, 28], opacity: [0.55, 0.15, 0] }
            : { opacity: 0 }
        }
        transition={{ duration: 2.4, repeat: Infinity, delay: 1.4 }}
      />
    </Shell>
  );
}

/* ───────── 11. alignment ─────────
   8 pontos dispersos que se alinham numa mesma linha — "mesma lógica". */
function Alignment({
  accentColor,
  active,
  reduce,
}: Props & { reduce: boolean }) {
  const baseY = VIEW.h / 2 + 6;
  // posições iniciais "dispersas" e finais (alinhadas)
  const pts = [
    { sx: 60, sy: 30, fx: 60 },
    { sx: 130, sy: 95, fx: 130 },
    { sx: 200, sy: 35, fx: 200 },
    { sx: 270, sy: 100, fx: 270 },
    { sx: 330, sy: 28, fx: 330 },
    { sx: 410, sy: 92, fx: 410 },
    { sx: 480, sy: 38, fx: 480 },
    { sx: 550, sy: 98, fx: 550 },
  ];
  return (
    <Shell>
      <Label x={20} y={18} color="#ffffff" opacity={0.32}>
        DISPERSO
      </Label>
      <Label
        x={VIEW.w - 20}
        y={18}
        anchor="end"
        color={accentColor}
        opacity={0.75}
      >
        MESMA LÓGICA
      </Label>
      {/* linha de alinhamento (eixo) — surge depois */}
      <motion.line
        x1={pts[0].fx - 18}
        x2={pts[pts.length - 1].fx + 18}
        y1={baseY}
        y2={baseY}
        stroke={accentColor}
        strokeOpacity={0.35}
        strokeWidth={1}
        strokeDasharray="3 4"
        initial={reduce ? false : { pathLength: 0, opacity: 0 }}
        animate={
          active
            ? { pathLength: 1, opacity: 0.5 }
            : reduce
              ? undefined
              : { pathLength: 0, opacity: 0 }
        }
        transition={{ duration: 0.8, delay: 1.4 }}
      />
      {/* glow do eixo */}
      <motion.line
        x1={pts[0].fx - 18}
        x2={pts[pts.length - 1].fx + 18}
        y1={baseY}
        y2={baseY}
        stroke={accentColor}
        strokeOpacity={0.4}
        strokeWidth={6}
        strokeLinecap="round"
        initial={reduce ? false : { opacity: 0 }}
        animate={
          active && !reduce ? { opacity: [0, 0.5, 0.25] } : { opacity: 0 }
        }
        transition={{
          duration: 1.8,
          delay: 1.7,
          repeat: Infinity,
          repeatType: "mirror",
        }}
      />
      {pts.map((p, i) => (
        <motion.g key={i}>
          {/* conexão sutil ao próximo */}
          {i < pts.length - 1 && (
            <motion.line
              x1={p.fx}
              y1={baseY}
              x2={pts[i + 1].fx}
              y2={baseY}
              stroke={accentColor}
              strokeOpacity={0.4}
              strokeWidth={1}
              initial={reduce ? false : { pathLength: 0, opacity: 0 }}
              animate={
                active
                  ? { pathLength: 1, opacity: 0.6 }
                  : reduce
                    ? undefined
                    : { pathLength: 0, opacity: 0 }
              }
              transition={{ duration: 0.5, delay: 1.6 + i * 0.06 }}
            />
          )}
          {/* o ponto migra da posição dispersa para a alinhada */}
          <motion.circle
            r={4.5}
            fill={accentColor}
            initial={reduce ? false : { cx: p.sx, cy: p.sy, opacity: 0 }}
            animate={
              active
                ? { cx: p.fx, cy: baseY, opacity: 1 }
                : reduce
                  ? undefined
                  : { cx: p.sx, cy: p.sy, opacity: 0 }
            }
            transition={{
              cx: {
                duration: 1.0,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.45 + i * 0.05,
              },
              cy: {
                duration: 1.0,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.45 + i * 0.05,
              },
              opacity: { duration: 0.3, delay: 0.4 + i * 0.05 },
            }}
          />
          {/* anel pulsante na posição final */}
          <motion.circle
            cx={p.fx}
            cy={baseY}
            r={4.5}
            fill="none"
            stroke={accentColor}
            strokeWidth={1}
            animate={
              active && !reduce
                ? { r: [4.5, 11, 16], opacity: [0.6, 0.2, 0] }
                : { opacity: 0 }
            }
            transition={{
              duration: 2.4,
              repeat: Infinity,
              delay: 2.0 + i * 0.12,
            }}
          />
        </motion.g>
      ))}
    </Shell>
  );
}

/* ───────── 12. modular ─────────
   Módulos retangulares que se encaixam — capacidades coordenadas. */
function Modular({ accentColor, active, reduce }: Props & { reduce: boolean }) {
  const baseY = VIEW.h / 2 + 4;
  const bw = 72;
  const bh = 28;
  const gap = 8;
  const total = 6;
  const totalW = total * bw + (total - 1) * gap;
  const startX = (VIEW.w - totalW) / 2;
  // origens "dispersas" - cada bloco vem de uma direção diferente
  const starts = [
    { dx: -120, dy: -40 },
    { dx: 0, dy: -55 },
    { dx: 80, dy: -45 },
    { dx: -90, dy: 50 },
    { dx: 30, dy: 60 },
    { dx: 110, dy: 40 },
  ];
  return (
    <Shell>
      <Label x={20} y={18} color="#ffffff" opacity={0.32}>
        MÓDULOS
      </Label>
      <Label
        x={VIEW.w - 20}
        y={18}
        anchor="end"
        color={accentColor}
        opacity={0.75}
      >
        ENCAIXE COORDENADO
      </Label>
      {/* trilho luminoso — surge quando os blocos se encaixam */}
      <motion.line
        x1={startX}
        x2={startX + totalW}
        y1={baseY + bh / 2 + 3}
        y2={baseY + bh / 2 + 3}
        stroke={accentColor}
        strokeOpacity={0.55}
        strokeWidth={1.2}
        initial={reduce ? false : { pathLength: 0 }}
        animate={
          active ? { pathLength: 1 } : reduce ? undefined : { pathLength: 0 }
        }
        transition={{ duration: 0.8, delay: 1.5 }}
      />
      {Array.from({ length: total }).map((_, i) => {
        const fx = startX + i * (bw + gap);
        const sx = fx + starts[i].dx;
        const sy = baseY + starts[i].dy;
        return (
          <motion.g key={i}>
            <motion.rect
              width={bw}
              height={bh}
              rx={4}
              fill={accentColor}
              fillOpacity={0.18}
              stroke={accentColor}
              strokeOpacity={0.7}
              strokeWidth={1}
              initial={
                reduce
                  ? false
                  : {
                      x: sx,
                      y: sy,
                      opacity: 0,
                      rotate: starts[i].dx > 0 ? 8 : -8,
                    }
              }
              animate={
                active
                  ? { x: fx, y: baseY, opacity: 1, rotate: 0 }
                  : reduce
                    ? undefined
                    : {
                        x: sx,
                        y: sy,
                        opacity: 0,
                        rotate: starts[i].dx > 0 ? 8 : -8,
                      }
              }
              transition={{
                x: {
                  duration: 0.9,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.5 + i * 0.07,
                },
                y: {
                  duration: 0.9,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.5 + i * 0.07,
                },
                rotate: {
                  duration: 0.9,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.5 + i * 0.07,
                },
                opacity: { duration: 0.3, delay: 0.45 + i * 0.07 },
              }}
            />
            {/* faixa luminosa no topo do módulo */}
            <motion.line
              x1={fx + 6}
              x2={fx + bw - 6}
              y1={baseY + 1}
              y2={baseY + 1}
              stroke={accentColor}
              strokeWidth={1}
              initial={reduce ? false : { opacity: 0 }}
              animate={
                active && !reduce ? { opacity: [0, 1, 0.6] } : { opacity: 0 }
              }
              transition={{ duration: 0.6, delay: 1.4 + i * 0.08 }}
            />
          </motion.g>
        );
      })}
    </Shell>
  );
}

/* ───────── 13. signal ─────────
   Sinais convergindo para uma linha central — agentes/INITIA. */
function Signal({ accentColor, active, reduce }: Props & { reduce: boolean }) {
  const cy = VIEW.h / 2 + 8;
  const inputs = [
    { x: 80, y: 30 },
    { x: 160, y: 100 },
    { x: 250, y: 28 },
    { x: 330, y: 102 },
    { x: 420, y: 32 },
    { x: 500, y: 100 },
  ];
  const outX = VIEW.w - 30;
  return (
    <Shell>
      <Label x={20} y={18} color="#ffffff" opacity={0.32}>
        SINAIS
      </Label>
      <Label
        x={VIEW.w - 20}
        y={18}
        anchor="end"
        color={accentColor}
        opacity={0.75}
      >
        AÇÃO COORDENADA
      </Label>
      {/* eixo central horizontal */}
      <motion.line
        x1={40}
        x2={outX}
        y1={cy}
        y2={cy}
        stroke={accentColor}
        strokeOpacity={0.5}
        strokeWidth={1}
        initial={reduce ? false : { pathLength: 0 }}
        animate={
          active ? { pathLength: 1 } : reduce ? undefined : { pathLength: 0 }
        }
        transition={{ duration: 1.0, delay: 0.4 }}
      />
      {inputs.map((p, i) => {
        const meet = p.x;
        return (
          <motion.g key={i}>
            {/* fonte (ponto pequeno) */}
            <motion.circle
              cx={p.x}
              cy={p.y}
              r={3}
              fill={accentColor}
              fillOpacity={0.8}
              initial={reduce ? false : { opacity: 0 }}
              animate={
                active ? { opacity: 1 } : reduce ? undefined : { opacity: 0 }
              }
              transition={{ duration: 0.35, delay: 0.5 + i * 0.08 }}
            />
            {/* linha do sinal até o eixo */}
            <motion.line
              x1={p.x}
              y1={p.y}
              x2={meet}
              y2={cy}
              stroke={accentColor}
              strokeOpacity={0.45}
              strokeWidth={1}
              initial={reduce ? false : { pathLength: 0 }}
              animate={
                active
                  ? { pathLength: 1 }
                  : reduce
                    ? undefined
                    : { pathLength: 0 }
              }
              transition={{ duration: 0.55, delay: 0.6 + i * 0.08 }}
            />
            {/* dot que pulsa a viagem do sinal */}
            {!reduce && (
              <motion.circle
                r={2.5}
                fill={accentColor}
                initial={{ cx: p.x, cy: p.y, opacity: 0 }}
                animate={
                  active
                    ? {
                        cx: [p.x, meet, meet + 40],
                        cy: [p.y, cy, cy],
                        opacity: [0, 1, 0],
                      }
                    : { opacity: 0 }
                }
                transition={{
                  duration: 2.0,
                  ease: "easeOut",
                  repeat: Infinity,
                  delay: 1.4 + i * 0.25,
                }}
              />
            )}
            {/* ponto de junção no eixo */}
            <motion.circle
              cx={meet}
              cy={cy}
              r={2}
              fill={accentColor}
              initial={reduce ? false : { opacity: 0 }}
              animate={
                active ? { opacity: 1 } : reduce ? undefined : { opacity: 0 }
              }
              transition={{ duration: 0.3, delay: 1.0 + i * 0.08 }}
            />
          </motion.g>
        );
      })}
      {/* saída pulsante */}
      <circle cx={outX} cy={cy} r={5} fill={accentColor} />
      <motion.circle
        cx={outX}
        cy={cy}
        r={5}
        fill="none"
        stroke={accentColor}
        strokeWidth={1}
        animate={
          active && !reduce
            ? { r: [5, 14, 22], opacity: [0.7, 0.2, 0] }
            : { opacity: 0 }
        }
        transition={{ duration: 2.4, repeat: Infinity, delay: 1.8 }}
      />
    </Shell>
  );
}

/* ───────── 14. spotlight ─────────
   Cones de luz vindos de várias bordas convergindo num foco central — pontos
   de entrada distintos, resposta coordenada. */
function Spotlight({
  accentColor,
  active,
  reduce,
}: Props & { reduce: boolean }) {
  const cx = VIEW.w / 2;
  const cy = VIEW.h / 2 + 6;
  const cones = [
    { ox: 40, oy: 24, angle: 30 },
    { ox: VIEW.w - 40, oy: 24, angle: -30 },
    { ox: 70, oy: VIEW.h - 18, angle: -45 },
    { ox: VIEW.w - 70, oy: VIEW.h - 18, angle: 45 },
    { ox: VIEW.w / 2 - 180, oy: 32, angle: 12 },
    { ox: VIEW.w / 2 + 180, oy: VIEW.h - 24, angle: -12 },
  ];
  return (
    <Shell>
      <Label x={20} y={18} color="#ffffff" opacity={0.32}>
        PONTO DE ENTRADA
      </Label>
      <Label
        x={VIEW.w - 20}
        y={18}
        anchor="end"
        color={accentColor}
        opacity={0.75}
      >
        RESPOSTA COORDENADA
      </Label>
      <defs>
        <radialGradient id="spot-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={accentColor} stopOpacity="0.5" />
          <stop offset="60%" stopColor={accentColor} stopOpacity="0.15" />
          <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
        </radialGradient>
      </defs>
      {cones.map((c, i) => {
        const dx = cx - c.ox;
        const dy = cy - c.oy;
        const len = Math.sqrt(dx * dx + dy * dy);
        const ux = dx / len;
        const uy = dy / len;
        // perpendicular para abrir o cone
        const px = -uy;
        const py = ux;
        const half = 10;
        const tipx = cx;
        const tipy = cy;
        const a = { x: c.ox + px * half, y: c.oy + py * half };
        const b = { x: c.ox - px * half, y: c.oy - py * half };
        return (
          <motion.g key={i}>
            {/* cone como triângulo translúcido */}
            <motion.path
              d={`M ${a.x} ${a.y} L ${tipx} ${tipy} L ${b.x} ${b.y} Z`}
              fill={accentColor}
              fillOpacity={0.12}
              stroke={accentColor}
              strokeOpacity={0.4}
              strokeWidth={0.8}
              initial={reduce ? false : { opacity: 0 }}
              animate={
                active ? { opacity: 1 } : reduce ? undefined : { opacity: 0 }
              }
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.5 + i * 0.1,
              }}
            />
            {/* feixe luminoso central */}
            <motion.line
              x1={c.ox}
              y1={c.oy}
              x2={tipx}
              y2={tipy}
              stroke={accentColor}
              strokeOpacity={0.55}
              strokeWidth={1}
              initial={reduce ? false : { pathLength: 0 }}
              animate={
                active
                  ? { pathLength: 1 }
                  : reduce
                    ? undefined
                    : { pathLength: 0 }
              }
              transition={{ duration: 0.7, delay: 0.6 + i * 0.1 }}
            />
            {/* ponto fonte */}
            <motion.circle
              cx={c.ox}
              cy={c.oy}
              r={3}
              fill={accentColor}
              initial={reduce ? false : { opacity: 0 }}
              animate={
                active ? { opacity: 1 } : reduce ? undefined : { opacity: 0 }
              }
              transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
            />
          </motion.g>
        );
      })}
      {/* foco central */}
      <circle cx={cx} cy={cy} r={26} fill="url(#spot-grad)" />
      <circle cx={cx} cy={cy} r={6} fill={accentColor} />
      <motion.circle
        cx={cx}
        cy={cy}
        r={6}
        fill="none"
        stroke={accentColor}
        strokeWidth={1}
        animate={
          active && !reduce
            ? { r: [6, 20, 32], opacity: [0.7, 0.2, 0] }
            : { opacity: 0 }
        }
        transition={{ duration: 2.4, repeat: Infinity, delay: 1.6 }}
      />
    </Shell>
  );
}

/* ───────── 15. bloom ─────────
   Raios irradiando de um centro — crescimento sustentado / resultado positivo. */
function Bloom({ accentColor, active, reduce }: Props & { reduce: boolean }) {
  const cx = VIEW.w / 2;
  const cy = VIEW.h / 2 + 6;
  const rays = 14;
  const inner = 10;
  const outer = 56;
  return (
    <Shell>
      <Label x={20} y={18} color="#ffffff" opacity={0.32}>
        CENTRO
      </Label>
      <Label
        x={VIEW.w - 20}
        y={18}
        anchor="end"
        color={accentColor}
        opacity={0.75}
      >
        EXPANSÃO COORDENADA
      </Label>
      {/* anel base */}
      <motion.circle
        cx={cx}
        cy={cy}
        r={inner}
        fill="none"
        stroke={accentColor}
        strokeOpacity={0.4}
        strokeWidth={1}
        initial={reduce ? false : { scale: 0, opacity: 0 }}
        animate={
          active
            ? { scale: 1, opacity: 0.8 }
            : reduce
              ? undefined
              : { scale: 0, opacity: 0 }
        }
        transition={{ duration: 0.5, delay: 0.4 }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />
      <circle cx={cx} cy={cy} r={5} fill={accentColor} />
      {/* raios */}
      {Array.from({ length: rays }).map((_, i) => {
        const angle = (i / rays) * Math.PI * 2 - Math.PI / 2;
        const ix = cx + Math.cos(angle) * inner;
        const iy = cy + Math.sin(angle) * inner;
        // raio com comprimento variável para parecer orgânico
        const len = outer - (i % 3 === 0 ? 6 : i % 3 === 1 ? 0 : -8);
        const ox = cx + Math.cos(angle) * (inner + len);
        const oy = cy + Math.sin(angle) * (inner + len);
        return (
          <motion.g key={i}>
            <motion.line
              x1={ix}
              y1={iy}
              x2={ox}
              y2={oy}
              stroke={accentColor}
              strokeOpacity={0.55}
              strokeWidth={1.2}
              strokeLinecap="round"
              initial={reduce ? false : { pathLength: 0, opacity: 0 }}
              animate={
                active
                  ? { pathLength: 1, opacity: 0.7 }
                  : reduce
                    ? undefined
                    : { pathLength: 0, opacity: 0 }
              }
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.6 + (i / rays) * 0.5,
              }}
            />
            {/* ponta luminosa */}
            <motion.circle
              cx={ox}
              cy={oy}
              r={1.6}
              fill={accentColor}
              initial={reduce ? false : { opacity: 0 }}
              animate={
                active && !reduce
                  ? { opacity: [0, 1, 0.6] }
                  : active
                    ? { opacity: 0.85 }
                    : { opacity: 0 }
              }
              transition={{
                duration: 1.6,
                delay: 1.0 + (i / rays) * 0.5,
                repeat: Infinity,
                repeatType: "mirror",
              }}
            />
          </motion.g>
        );
      })}
      {/* halo pulsante */}
      <motion.circle
        cx={cx}
        cy={cy}
        r={inner + 6}
        fill="none"
        stroke={accentColor}
        strokeWidth={1}
        animate={
          active && !reduce
            ? { r: [inner + 6, outer + 6, outer + 24], opacity: [0.5, 0.15, 0] }
            : { opacity: 0 }
        }
        transition={{ duration: 3, repeat: Infinity, delay: 1.8 }}
      />
    </Shell>
  );
}

/* ───────── 16. compass ─────────
   Bússola com pins direcionais convergindo a um centro — pontos de partida. */
function Compass({ accentColor, active, reduce }: Props & { reduce: boolean }) {
  const cx = VIEW.w / 2;
  const cy = VIEW.h / 2 + 4;
  const r = 48;
  const pins = [
    { angle: -90, label: "N" },
    { angle: -30, label: "NE" },
    { angle: 30, label: "SE" },
    { angle: 90, label: "S" },
    { angle: 150, label: "SW" },
    { angle: -150, label: "NW" },
  ];
  return (
    <Shell>
      <Label x={20} y={18} color="#ffffff" opacity={0.32}>
        PONTO DE PARTIDA
      </Label>
      <Label
        x={VIEW.w - 20}
        y={18}
        anchor="end"
        color={accentColor}
        opacity={0.75}
      >
        MAPEAR JUNTOS
      </Label>
      {/* círculo da bússola */}
      <motion.circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={accentColor}
        strokeOpacity={0.4}
        strokeWidth={1}
        strokeDasharray="2 4"
        initial={reduce ? false : { pathLength: 0, opacity: 0 }}
        animate={
          active
            ? { pathLength: 1, opacity: 0.55 }
            : reduce
              ? undefined
              : { pathLength: 0, opacity: 0 }
        }
        transition={{ duration: 1.2, delay: 0.4 }}
      />
      <motion.circle
        cx={cx}
        cy={cy}
        r={r - 18}
        fill="none"
        stroke={accentColor}
        strokeOpacity={0.2}
        strokeWidth={1}
        initial={reduce ? false : { pathLength: 0, opacity: 0 }}
        animate={
          active
            ? { pathLength: 1, opacity: 0.4 }
            : reduce
              ? undefined
              : { pathLength: 0, opacity: 0 }
        }
        transition={{ duration: 1.2, delay: 0.55 }}
      />
      {/* eixos cruzados */}
      <motion.line
        x1={cx - r - 12}
        x2={cx + r + 12}
        y1={cy}
        y2={cy}
        stroke={accentColor}
        strokeOpacity={0.18}
        strokeWidth={1}
        initial={reduce ? false : { pathLength: 0 }}
        animate={
          active ? { pathLength: 1 } : reduce ? undefined : { pathLength: 0 }
        }
        transition={{ duration: 0.8, delay: 0.6 }}
      />
      <motion.line
        x1={cx}
        x2={cx}
        y1={cy - r - 12}
        y2={cy + r + 12}
        stroke={accentColor}
        strokeOpacity={0.18}
        strokeWidth={1}
        initial={reduce ? false : { pathLength: 0 }}
        animate={
          active ? { pathLength: 1 } : reduce ? undefined : { pathLength: 0 }
        }
        transition={{ duration: 0.8, delay: 0.75 }}
      />
      {/* pins */}
      {pins.map((p, i) => {
        const a = (p.angle * Math.PI) / 180;
        const px = cx + Math.cos(a) * (r + 10);
        const py = cy + Math.sin(a) * (r + 10);
        // mini-linha conectando ao centro
        const ix = cx + Math.cos(a) * (r - 14);
        const iy = cy + Math.sin(a) * (r - 14);
        return (
          <motion.g key={i}>
            <motion.line
              x1={cx}
              y1={cy}
              x2={ix}
              y2={iy}
              stroke={accentColor}
              strokeOpacity={0.4}
              strokeWidth={1}
              initial={reduce ? false : { pathLength: 0 }}
              animate={
                active
                  ? { pathLength: 1 }
                  : reduce
                    ? undefined
                    : { pathLength: 0 }
              }
              transition={{ duration: 0.55, delay: 0.9 + i * 0.07 }}
            />
            <motion.circle
              cx={px}
              cy={py}
              r={4}
              fill={accentColor}
              initial={reduce ? false : { opacity: 0, scale: 0 }}
              animate={
                active
                  ? { opacity: 1, scale: 1 }
                  : reduce
                    ? undefined
                    : { opacity: 0, scale: 0 }
              }
              transition={{ duration: 0.4, delay: 1.0 + i * 0.07 }}
            />
            <motion.circle
              cx={px}
              cy={py}
              r={4}
              fill="none"
              stroke={accentColor}
              strokeWidth={1}
              animate={
                active && !reduce
                  ? { r: [4, 10, 14], opacity: [0.7, 0.2, 0] }
                  : { opacity: 0 }
              }
              transition={{
                duration: 2.4,
                repeat: Infinity,
                delay: 1.3 + i * 0.15,
              }}
            />
          </motion.g>
        );
      })}
      {/* agulha (norte–sul) */}
      <motion.line
        x1={cx}
        y1={cy + r - 8}
        x2={cx}
        y2={cy - r + 8}
        stroke={accentColor}
        strokeWidth={2}
        strokeLinecap="round"
        initial={reduce ? false : { opacity: 0, rotate: 45 }}
        animate={
          active
            ? { opacity: 1, rotate: 0 }
            : reduce
              ? undefined
              : { opacity: 0, rotate: 45 }
        }
        transition={{ duration: 0.8, delay: 1.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />
      {/* pivot */}
      <circle
        cx={cx}
        cy={cy}
        r={5}
        fill="#0b0f1a"
        stroke={accentColor}
        strokeWidth={1.5}
      />
      <circle cx={cx} cy={cy} r={2} fill={accentColor} />
    </Shell>
  );
}

type V = Props & { reduce: boolean };

/* 17. weave — fios entrelaçando */
function Weave({ accentColor, active, reduce }: V) {
  const baseY = VIEW.h / 2 + 6;
  const amp = 16;
  const w = VIEW.w - 40;
  const x0 = 20;
  const pts = (phase: number) => {
    const arr: string[] = [];
    for (let i = 0; i <= 80; i++) {
      const x = x0 + (i / 80) * w;
      const y = baseY + Math.sin((i / 80) * Math.PI * 6 + phase) * amp;
      arr.push(`${i === 0 ? "M" : "L"} ${x} ${y}`);
    }
    return arr.join(" ");
  };
  return (
    <Shell>
      <Label x={20} y={18} color="#ffffff" opacity={0.32}>
        FIOS
      </Label>
      <Label
        x={VIEW.w - 20}
        y={18}
        anchor="end"
        color={accentColor}
        opacity={0.75}
      >
        TRAMA COORDENADA
      </Label>
      {[0, Math.PI].map((p, i) => (
        <motion.path
          key={i}
          d={pts(p)}
          fill="none"
          stroke={accentColor}
          strokeOpacity={0.55}
          strokeWidth={1.4}
          initial={reduce ? false : { pathLength: 0 }}
          animate={
            active ? { pathLength: 1 } : reduce ? undefined : { pathLength: 0 }
          }
          transition={{
            duration: 1.8,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.5 + i * 0.3,
          }}
        />
      ))}
    </Shell>
  );
}

/* 18. ripple — ondas concêntricas */
function Ripple({ accentColor, active, reduce }: V) {
  const cx = VIEW.w / 2;
  const cy = VIEW.h / 2 + 6;
  return (
    <Shell>
      <Label x={20} y={18} color="#ffffff" opacity={0.32}>
        IMPACTO
      </Label>
      <Label
        x={VIEW.w - 20}
        y={18}
        anchor="end"
        color={accentColor}
        opacity={0.75}
      >
        ONDA SISTÊMICA
      </Label>
      <circle cx={cx} cy={cy} r={4} fill={accentColor} />
      {[0, 0.7, 1.4, 2.1].map((d, i) => (
        <motion.circle
          key={i}
          cx={cx}
          cy={cy}
          r={4}
          fill="none"
          stroke={accentColor}
          strokeWidth={1.2}
          animate={
            active && !reduce
              ? { r: [4, 70], opacity: [0.7, 0] }
              : { opacity: 0 }
          }
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: 0.5 + d,
            ease: "easeOut",
          }}
        />
      ))}
    </Shell>
  );
}

/* 19. tide — maré subindo */
function Tide({ accentColor, active, reduce }: V) {
  const baseY = VIEW.h - 14;
  const w = VIEW.w - 40;
  const points = Array.from({ length: 40 }).map((_, i) => {
    const x = 20 + (i / 39) * w;
    return { x, y: baseY };
  });
  return (
    <Shell>
      <Label x={20} y={18} color="#ffffff" opacity={0.32}>
        NÍVEL DE PRESSÃO
      </Label>
      <Label
        x={VIEW.w - 20}
        y={18}
        anchor="end"
        color={accentColor}
        opacity={0.75}
      >
        LIMITE DA REDE
      </Label>
      <motion.rect
        x={20}
        width={w}
        rx={4}
        fill={accentColor}
        fillOpacity={0.18}
        stroke={accentColor}
        strokeOpacity={0.5}
        strokeWidth={1}
        initial={reduce ? false : { height: 0, y: baseY }}
        animate={
          active
            ? { height: 60, y: baseY - 60 }
            : reduce
              ? undefined
              : { height: 0, y: baseY }
        }
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
      />
      {points
        .filter((_, i) => i % 5 === 0)
        .map((p, i) => (
          <motion.circle
            key={i}
            cx={p.x}
            cy={baseY - 60}
            r={1.8}
            fill={accentColor}
            initial={reduce ? false : { opacity: 0 }}
            animate={
              active && !reduce
                ? {
                    opacity: [0, 1, 0.5],
                    cy: [baseY - 60, baseY - 64, baseY - 60],
                  }
                : { opacity: 0.6 }
            }
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: 1.5 + i * 0.1,
              ease: "easeInOut",
            }}
          />
        ))}
    </Shell>
  );
}

/* 20. fragment — pedaços que se quebram */
function Fragment({ accentColor, active, reduce }: V) {
  const cx = VIEW.w / 2;
  const cy = VIEW.h / 2 + 6;
  const pieces = Array.from({ length: 9 }).map((_, i) => {
    const angle = (i / 9) * Math.PI * 2;
    return {
      tx: cx + Math.cos(angle) * 90,
      ty: cy + Math.sin(angle) * 35,
      r: angle * 60,
    };
  });
  return (
    <Shell>
      <Label x={20} y={18} color="#ffffff" opacity={0.32}>
        INTEIRO
      </Label>
      <Label
        x={VIEW.w - 20}
        y={18}
        anchor="end"
        color={accentColor}
        opacity={0.75}
      >
        FRAGMENTADO
      </Label>
      {pieces.map((p, i) => (
        <motion.rect
          key={i}
          width={14}
          height={14}
          rx={2}
          fill={accentColor}
          fillOpacity={0.2}
          stroke={accentColor}
          strokeOpacity={0.7}
          strokeWidth={1}
          initial={
            reduce ? false : { x: cx - 7, y: cy - 7, opacity: 0, rotate: 0 }
          }
          animate={
            active
              ? { x: p.tx - 7, y: p.ty - 7, opacity: 1, rotate: p.r }
              : reduce
                ? undefined
                : { x: cx - 7, y: cy - 7, opacity: 0, rotate: 0 }
          }
          transition={{
            duration: 0.9,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.5 + i * 0.06,
          }}
        />
      ))}
    </Shell>
  );
}

/* 21. converge — linhas convergindo a um ponto */
function Converge({ accentColor, active, reduce }: V) {
  const tx = VIEW.w / 2;
  const ty = VIEW.h / 2 + 6;
  const sources = Array.from({ length: 10 }).map((_, i) => {
    const a = (i / 10) * Math.PI * 2;
    return { x: tx + Math.cos(a) * 220, y: ty + Math.sin(a) * 60 };
  });
  return (
    <Shell>
      <Label x={20} y={18} color="#ffffff" opacity={0.32}>
        DISPERSO
      </Label>
      <Label
        x={VIEW.w - 20}
        y={18}
        anchor="end"
        color={accentColor}
        opacity={0.75}
      >
        FOCO
      </Label>
      {sources.map((s, i) => (
        <motion.line
          key={i}
          x1={s.x}
          y1={s.y}
          x2={tx}
          y2={ty}
          stroke={accentColor}
          strokeOpacity={0.4}
          strokeWidth={1}
          initial={reduce ? false : { pathLength: 0 }}
          animate={
            active ? { pathLength: 1 } : reduce ? undefined : { pathLength: 0 }
          }
          transition={{ duration: 0.8, delay: 0.5 + i * 0.05 }}
        />
      ))}
      <circle cx={tx} cy={ty} r={5} fill={accentColor} />
    </Shell>
  );
}

/* 22. ladder — escada ascendente */
function Ladder({ accentColor, active, reduce }: V) {
  const steps = 6;
  return (
    <Shell>
      <Label x={20} y={18} color="#ffffff" opacity={0.32}>
        INÍCIO
      </Label>
      <Label
        x={VIEW.w - 20}
        y={18}
        anchor="end"
        color={accentColor}
        opacity={0.75}
      >
        ESCALA
      </Label>
      {Array.from({ length: steps }).map((_, i) => {
        const x = 60 + i * 80;
        const y = VIEW.h - 18 - i * 14;
        return (
          <motion.rect
            key={i}
            x={x}
            y={y}
            width={70}
            height={8}
            rx={2}
            fill={accentColor}
            fillOpacity={0.25 + i * 0.1}
            stroke={accentColor}
            strokeOpacity={0.7}
            strokeWidth={1}
            initial={reduce ? false : { opacity: 0, y: y + 20 }}
            animate={
              active
                ? { opacity: 1, y }
                : reduce
                  ? undefined
                  : { opacity: 0, y: y + 20 }
            }
            transition={{
              duration: 0.6,
              delay: 0.5 + i * 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        );
      })}
    </Shell>
  );
}

/* 23. branch — ramificação em árvore */
function Branch({ accentColor, active, reduce }: V) {
  const cx = 60;
  const cy = VIEW.h / 2 + 6;
  const ends = [
    { x: VIEW.w - 40, y: 30 },
    { x: VIEW.w - 40, y: 60 },
    { x: VIEW.w - 40, y: cy },
    { x: VIEW.w - 40, y: cy + 30 },
    { x: VIEW.w - 40, y: VIEW.h - 16 },
  ];
  return (
    <Shell>
      <Label x={20} y={18} color="#ffffff" opacity={0.32}>
        BASE
      </Label>
      <Label
        x={VIEW.w - 20}
        y={18}
        anchor="end"
        color={accentColor}
        opacity={0.75}
      >
        DESDOBRAMENTOS
      </Label>
      <circle cx={cx} cy={cy} r={5} fill={accentColor} />
      {ends.map((e, i) => (
        <motion.path
          key={i}
          d={`M ${cx} ${cy} Q ${(cx + e.x) / 2} ${cy + (e.y - cy) * 0.3} ${e.x} ${e.y}`}
          fill="none"
          stroke={accentColor}
          strokeOpacity={0.55}
          strokeWidth={1.2}
          initial={reduce ? false : { pathLength: 0 }}
          animate={
            active ? { pathLength: 1 } : reduce ? undefined : { pathLength: 0 }
          }
          transition={{ duration: 0.9, delay: 0.5 + i * 0.08 }}
        />
      ))}
      {ends.map((e, i) => (
        <motion.circle
          key={i}
          cx={e.x}
          cy={e.y}
          r={3}
          fill={accentColor}
          initial={reduce ? false : { opacity: 0 }}
          animate={
            active ? { opacity: 1 } : reduce ? undefined : { opacity: 0 }
          }
          transition={{ duration: 0.4, delay: 1.3 + i * 0.08 }}
        />
      ))}
    </Shell>
  );
}

/* 24. echo — círculos eco esmaecendo */
function Echo({ accentColor, active, reduce }: V) {
  const cx = VIEW.w / 2;
  const cy = VIEW.h / 2 + 6;
  return (
    <Shell>
      <Label x={20} y={18} color="#ffffff" opacity={0.32}>
        SINAL
      </Label>
      <Label
        x={VIEW.w - 20}
        y={18}
        anchor="end"
        color={accentColor}
        opacity={0.75}
      >
        ECO PROPAGADO
      </Label>
      {[18, 36, 54].map((r, i) => (
        <motion.circle
          key={i}
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={accentColor}
          strokeOpacity={0.5 - i * 0.13}
          strokeWidth={1.4}
          initial={reduce ? false : { scale: 0.2, opacity: 0 }}
          animate={
            active
              ? { scale: 1, opacity: 0.7 - i * 0.18 }
              : reduce
                ? undefined
                : { scale: 0.2, opacity: 0 }
          }
          transition={{
            duration: 1.0,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.5 + i * 0.18,
          }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />
      ))}
      <circle cx={cx} cy={cy} r={5} fill={accentColor} />
    </Shell>
  );
}

/* 25. scale — balança */
function Scale({ accentColor, active, reduce }: V) {
  const cx = VIEW.w / 2;
  const cy = VIEW.h / 2;
  return (
    <Shell>
      <Label x={20} y={18} color="#ffffff" opacity={0.32}>
        UM LADO
      </Label>
      <Label
        x={VIEW.w - 20}
        y={18}
        anchor="end"
        color={accentColor}
        opacity={0.75}
      >
        EQUILÍBRIO
      </Label>
      <line
        x1={cx}
        y1={cy - 20}
        x2={cx}
        y2={cy + 25}
        stroke={accentColor}
        strokeOpacity={0.5}
        strokeWidth={2}
      />
      <motion.g
        initial={reduce ? false : { rotate: -16 }}
        animate={active ? { rotate: 0 } : reduce ? undefined : { rotate: -16 }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.7 }}
        style={{ transformOrigin: `${cx}px ${cy - 20}px` }}
      >
        <line
          x1={cx - 90}
          y1={cy - 20}
          x2={cx + 90}
          y2={cy - 20}
          stroke={accentColor}
          strokeWidth={1.5}
        />
        <circle
          cx={cx - 90}
          cy={cy - 20}
          r={10}
          fill="none"
          stroke={accentColor}
          strokeOpacity={0.7}
          strokeWidth={1.5}
        />
        <circle
          cx={cx + 90}
          cy={cy - 20}
          r={10}
          fill={accentColor}
          fillOpacity={0.3}
          stroke={accentColor}
          strokeWidth={1.5}
        />
      </motion.g>
    </Shell>
  );
}

/* 26. thread — fio contínuo */
function Thread({ accentColor, active, reduce }: V) {
  return (
    <Shell>
      <Label x={20} y={18} color="#ffffff" opacity={0.32}>
        ENTRADA
      </Label>
      <Label
        x={VIEW.w - 20}
        y={18}
        anchor="end"
        color={accentColor}
        opacity={0.75}
      >
        CONTINUIDADE
      </Label>
      <motion.path
        d={`M 20 80 C 120 30, 200 100, 300 60 S 460 30, 580 70`}
        fill="none"
        stroke={accentColor}
        strokeOpacity={0.85}
        strokeWidth={2}
        strokeLinecap="round"
        initial={reduce ? false : { pathLength: 0 }}
        animate={
          active ? { pathLength: 1 } : reduce ? undefined : { pathLength: 0 }
        }
        transition={{ duration: 2.0, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
      />
      {!reduce && (
        <motion.circle
          r={3}
          fill={accentColor}
          animate={
            active
              ? { offsetDistance: ["0%", "100%"], opacity: [0, 1, 0] }
              : { opacity: 0 }
          }
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: 2.4,
            ease: "linear",
          }}
          style={{
            offsetPath: `path('M 20 80 C 120 30, 200 100, 300 60 S 460 30, 580 70')`,
          }}
        />
      )}
    </Shell>
  );
}

/* 27. bridge — arco/ponte */
function Bridge({ accentColor, active, reduce }: V) {
  return (
    <Shell>
      <Label x={20} y={18} color="#ffffff" opacity={0.32}>
        MARGEM
      </Label>
      <Label
        x={VIEW.w - 20}
        y={18}
        anchor="end"
        color={accentColor}
        opacity={0.75}
      >
        OUTRA MARGEM
      </Label>
      <motion.path
        d="M 40 100 Q 300 20 560 100"
        fill="none"
        stroke={accentColor}
        strokeOpacity={0.8}
        strokeWidth={2}
        strokeLinecap="round"
        initial={reduce ? false : { pathLength: 0 }}
        animate={
          active ? { pathLength: 1 } : reduce ? undefined : { pathLength: 0 }
        }
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
      />
      {[40, 140, 240, 340, 440, 560].map((x, i) => {
        const t = (x - 40) / 520;
        const y = 100 - 4 * t * (1 - t) * 80;
        return (
          <motion.line
            key={i}
            x1={x}
            y1={y}
            x2={x}
            y2={110}
            stroke={accentColor}
            strokeOpacity={0.35}
            strokeWidth={1}
            initial={reduce ? false : { pathLength: 0 }}
            animate={
              active
                ? { pathLength: 1 }
                : reduce
                  ? undefined
                  : { pathLength: 0 }
            }
            transition={{ duration: 0.4, delay: 1.4 + i * 0.06 }}
          />
        );
      })}
      <line
        x1={20}
        y1={110}
        x2={VIEW.w - 20}
        y2={110}
        stroke={accentColor}
        strokeOpacity={0.2}
        strokeWidth={1}
      />
    </Shell>
  );
}

/* 28. heartbeat — onda de batimento */
function Heartbeat({ accentColor, active, reduce }: V) {
  const baseY = VIEW.h / 2 + 6;
  const d = `M 20 ${baseY} L 120 ${baseY} L 140 ${baseY - 22} L 160 ${baseY + 22} L 180 ${baseY - 8} L 200 ${baseY} L 320 ${baseY} L 340 ${baseY - 22} L 360 ${baseY + 22} L 380 ${baseY - 8} L 400 ${baseY} L 580 ${baseY}`;
  return (
    <Shell>
      <Label x={20} y={18} color="#ffffff" opacity={0.32}>
        PULSO
      </Label>
      <Label
        x={VIEW.w - 20}
        y={18}
        anchor="end"
        color={accentColor}
        opacity={0.75}
      >
        VIDA DA OPERAÇÃO
      </Label>
      <motion.path
        d={d}
        fill="none"
        stroke={accentColor}
        strokeWidth={1.6}
        strokeLinecap="round"
        initial={reduce ? false : { pathLength: 0 }}
        animate={
          active ? { pathLength: 1 } : reduce ? undefined : { pathLength: 0 }
        }
        transition={{
          duration: 2.4,
          ease: "linear",
          delay: 0.5,
          repeat: Infinity,
          repeatDelay: 0.4,
        }}
      />
    </Shell>
  );
}

/* 29. magnet — campo magnético */
function Magnet({ accentColor, active, reduce }: V) {
  const cx = VIEW.w / 2;
  const cy = VIEW.h / 2 + 6;
  return (
    <Shell>
      <Label x={20} y={18} color="#ffffff" opacity={0.32}>
        FORÇA
      </Label>
      <Label
        x={VIEW.w - 20}
        y={18}
        anchor="end"
        color={accentColor}
        opacity={0.75}
      >
        ATRAÇÃO
      </Label>
      {[1, 2, 3, 4].map((i) => (
        <motion.ellipse
          key={i}
          cx={cx}
          cy={cy}
          rx={i * 38}
          ry={i * 14}
          fill="none"
          stroke={accentColor}
          strokeOpacity={0.4 - i * 0.07}
          strokeWidth={1}
          strokeDasharray="3 5"
          initial={reduce ? false : { pathLength: 0 }}
          animate={
            active ? { pathLength: 1 } : reduce ? undefined : { pathLength: 0 }
          }
          transition={{ duration: 1.2, delay: 0.5 + i * 0.12 }}
        />
      ))}
      <circle cx={cx} cy={cy} r={5} fill={accentColor} />
    </Shell>
  );
}

/* 30. prism — luz se decompondo */
function Prism({ accentColor, active, reduce }: V) {
  return (
    <Shell>
      <Label x={20} y={18} color="#ffffff" opacity={0.32}>
        LUZ ÚNICA
      </Label>
      <Label
        x={VIEW.w - 20}
        y={18}
        anchor="end"
        color={accentColor}
        opacity={0.75}
      >
        ESPECTRO
      </Label>
      <motion.line
        x1={30}
        y1={VIEW.h / 2 + 6}
        x2={250}
        y2={VIEW.h / 2 + 6}
        stroke={accentColor}
        strokeWidth={1.4}
        initial={reduce ? false : { pathLength: 0 }}
        animate={
          active ? { pathLength: 1 } : reduce ? undefined : { pathLength: 0 }
        }
        transition={{ duration: 0.6, delay: 0.5 }}
      />
      <motion.path
        d={`M 250 ${VIEW.h / 2 - 18} L 290 ${VIEW.h / 2 + 6} L 250 ${VIEW.h / 2 + 30} Z`}
        fill={accentColor}
        fillOpacity={0.2}
        stroke={accentColor}
        strokeOpacity={0.6}
        strokeWidth={1}
        initial={reduce ? false : { opacity: 0 }}
        animate={active ? { opacity: 1 } : reduce ? undefined : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 1.0 }}
      />
      {[-20, -10, 0, 10, 20].map((dy, i) => (
        <motion.line
          key={i}
          x1={290}
          y1={VIEW.h / 2 + 6}
          x2={580}
          y2={VIEW.h / 2 + 6 + dy * 2}
          stroke={accentColor}
          strokeOpacity={0.55 - Math.abs(dy) * 0.012}
          strokeWidth={1.1}
          initial={reduce ? false : { pathLength: 0 }}
          animate={
            active ? { pathLength: 1 } : reduce ? undefined : { pathLength: 0 }
          }
          transition={{ duration: 0.9, delay: 1.3 + i * 0.05 }}
        />
      ))}
    </Shell>
  );
}

/* 31. spiral — espiral expandindo */
function Spiral({ accentColor, active, reduce }: V) {
  const cx = VIEW.w / 2;
  const cy = VIEW.h / 2 + 6;
  const turns = 3;
  const samples = 120;
  const pts: string[] = [];
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const a = t * Math.PI * 2 * turns;
    const r = t * 56;
    const x = cx + Math.cos(a) * r * 1.4;
    const y = cy + Math.sin(a) * r * 0.6;
    pts.push(`${i === 0 ? "M" : "L"} ${x} ${y}`);
  }
  return (
    <Shell>
      <Label x={20} y={18} color="#ffffff" opacity={0.32}>
        CENTRO
      </Label>
      <Label
        x={VIEW.w - 20}
        y={18}
        anchor="end"
        color={accentColor}
        opacity={0.75}
      >
        EXPANSÃO
      </Label>
      <motion.path
        d={pts.join(" ")}
        fill="none"
        stroke={accentColor}
        strokeOpacity={0.7}
        strokeWidth={1.4}
        strokeLinecap="round"
        initial={reduce ? false : { pathLength: 0 }}
        animate={
          active ? { pathLength: 1 } : reduce ? undefined : { pathLength: 0 }
        }
        transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
      />
      <circle cx={cx} cy={cy} r={3} fill={accentColor} />
    </Shell>
  );
}

/* 32. portal — anéis se abrindo */
function Portal({ accentColor, active, reduce }: V) {
  const cx = VIEW.w / 2;
  const cy = VIEW.h / 2 + 6;
  return (
    <Shell>
      <Label x={20} y={18} color="#ffffff" opacity={0.32}>
        FECHADO
      </Label>
      <Label
        x={VIEW.w - 20}
        y={18}
        anchor="end"
        color={accentColor}
        opacity={0.75}
      >
        ABERTURA
      </Label>
      {[1, 2, 3, 4].map((i) => (
        <motion.ellipse
          key={i}
          cx={cx}
          cy={cy}
          rx={20 + i * 22}
          ry={8 + i * 5}
          fill="none"
          stroke={accentColor}
          strokeOpacity={0.6 - i * 0.1}
          strokeWidth={1.2}
          initial={reduce ? false : { opacity: 0, scale: 0.4 }}
          animate={
            active
              ? { opacity: 1, scale: 1 }
              : reduce
                ? undefined
                : { opacity: 0, scale: 0.4 }
          }
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.5 + i * 0.12,
          }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />
      ))}
      <circle cx={cx} cy={cy} r={4} fill={accentColor} />
    </Shell>
  );
}

/* 33. lens — convergência tipo lente */
function Lens({ accentColor, active, reduce }: V) {
  const cx = VIEW.w / 2;
  const cy = VIEW.h / 2 + 6;
  return (
    <Shell>
      <Label x={20} y={18} color="#ffffff" opacity={0.32}>
        RUÍDO
      </Label>
      <Label
        x={VIEW.w - 20}
        y={18}
        anchor="end"
        color={accentColor}
        opacity={0.75}
      >
        SINAL FOCALIZADO
      </Label>
      {[-30, -15, 0, 15, 30].map((dy, i) => (
        <motion.path
          key={i}
          d={`M 30 ${cy + dy * 2} Q ${cx} ${cy + dy * 0.3} ${VIEW.w - 30} ${cy + dy * 2}`}
          fill="none"
          stroke={accentColor}
          strokeOpacity={0.4 + (4 - Math.abs(i - 2)) * 0.08}
          strokeWidth={1.2}
          initial={reduce ? false : { pathLength: 0 }}
          animate={
            active ? { pathLength: 1 } : reduce ? undefined : { pathLength: 0 }
          }
          transition={{ duration: 1.2, delay: 0.5 + i * 0.08 }}
        />
      ))}
      <ellipse
        cx={cx}
        cy={cy}
        rx={18}
        ry={42}
        fill={accentColor}
        fillOpacity={0.12}
        stroke={accentColor}
        strokeOpacity={0.5}
        strokeWidth={1}
      />
    </Shell>
  );
}

/* 34. shield — escudo hexagonal */
function Shield({ accentColor, active, reduce }: V) {
  const cx = VIEW.w / 2;
  const cy = VIEW.h / 2 + 8;
  const pts = Array.from({ length: 6 })
    .map((_, i) => {
      const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
      return `${cx + Math.cos(a) * 48},${cy + Math.sin(a) * 48}`;
    })
    .join(" ");
  return (
    <Shell>
      <Label x={20} y={18} color="#ffffff" opacity={0.32}>
        VULNERÁVEL
      </Label>
      <Label
        x={VIEW.w - 20}
        y={18}
        anchor="end"
        color={accentColor}
        opacity={0.75}
      >
        PROTEÇÃO ATIVA
      </Label>
      <motion.polygon
        points={pts}
        fill={accentColor}
        fillOpacity={0.12}
        stroke={accentColor}
        strokeOpacity={0.8}
        strokeWidth={1.5}
        initial={reduce ? false : { opacity: 0, scale: 0.5 }}
        animate={
          active
            ? { opacity: 1, scale: 1 }
            : reduce
              ? undefined
              : { opacity: 0, scale: 0.5 }
        }
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />
      <motion.polygon
        points={pts}
        fill="none"
        stroke={accentColor}
        strokeWidth={1}
        animate={
          active && !reduce
            ? { scale: [1, 1.2, 1.4], opacity: [0.5, 0.2, 0] }
            : { opacity: 0 }
        }
        transition={{ duration: 2.4, repeat: Infinity, delay: 1.6 }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />
      <circle cx={cx} cy={cy} r={4} fill={accentColor} />
    </Shell>
  );
}

/* 35. gear — engrenagens */
function Gear({ accentColor, active, reduce }: V) {
  function teeth(cx: number, cy: number, r: number, n: number) {
    const pts: string[] = [];
    for (let i = 0; i < n * 2; i++) {
      const a = (i / (n * 2)) * Math.PI * 2;
      const rr = i % 2 === 0 ? r + 4 : r;
      pts.push(`${cx + Math.cos(a) * rr},${cy + Math.sin(a) * rr}`);
    }
    return pts.join(" ");
  }
  return (
    <Shell>
      <Label x={20} y={18} color="#ffffff" opacity={0.32}>
        MECÂNICA
      </Label>
      <Label
        x={VIEW.w - 20}
        y={18}
        anchor="end"
        color={accentColor}
        opacity={0.75}
      >
        ENGRENADO
      </Label>
      <motion.polygon
        points={teeth(VIEW.w / 2 - 56, VIEW.h / 2 + 6, 26, 10)}
        fill="none"
        stroke={accentColor}
        strokeOpacity={0.7}
        strokeWidth={1.4}
        initial={reduce ? false : { opacity: 0, rotate: -30 }}
        animate={
          active
            ? { opacity: 1, rotate: !reduce ? 360 : 0 }
            : reduce
              ? undefined
              : { opacity: 0, rotate: -30 }
        }
        transition={
          !reduce
            ? {
                rotate: { duration: 16, repeat: Infinity, ease: "linear" },
                opacity: { duration: 0.6, delay: 0.5 },
              }
            : { opacity: { duration: 0.6, delay: 0.5 } }
        }
        style={{ transformOrigin: `${VIEW.w / 2 - 56}px ${VIEW.h / 2 + 6}px` }}
      />
      <motion.polygon
        points={teeth(VIEW.w / 2 + 36, VIEW.h / 2 + 6, 22, 8)}
        fill="none"
        stroke={accentColor}
        strokeOpacity={0.7}
        strokeWidth={1.4}
        initial={reduce ? false : { opacity: 0, rotate: 0 }}
        animate={
          active
            ? { opacity: 1, rotate: !reduce ? -360 : 0 }
            : reduce
              ? undefined
              : { opacity: 0, rotate: 0 }
        }
        transition={
          !reduce
            ? {
                rotate: { duration: 12, repeat: Infinity, ease: "linear" },
                opacity: { duration: 0.6, delay: 0.7 },
              }
            : { opacity: { duration: 0.6, delay: 0.7 } }
        }
        style={{ transformOrigin: `${VIEW.w / 2 + 36}px ${VIEW.h / 2 + 6}px` }}
      />
    </Shell>
  );
}

/* 36. crystal — formação cristalina */
function Crystal({ accentColor, active, reduce }: V) {
  const cx = VIEW.w / 2;
  const cy = VIEW.h / 2 + 6;
  const r = 38;
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
    pts.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r });
  }
  return (
    <Shell>
      <Label x={20} y={18} color="#ffffff" opacity={0.32}>
        FORMAÇÃO
      </Label>
      <Label
        x={VIEW.w - 20}
        y={18}
        anchor="end"
        color={accentColor}
        opacity={0.75}
      >
        ESTRUTURA
      </Label>
      {pts.map((p, i) => {
        const next = pts[(i + 1) % 6];
        return (
          <motion.line
            key={`o-${i}`}
            x1={p.x}
            y1={p.y}
            x2={next.x}
            y2={next.y}
            stroke={accentColor}
            strokeOpacity={0.7}
            strokeWidth={1.4}
            initial={reduce ? false : { pathLength: 0 }}
            animate={
              active
                ? { pathLength: 1 }
                : reduce
                  ? undefined
                  : { pathLength: 0 }
            }
            transition={{ duration: 0.5, delay: 0.5 + i * 0.08 }}
          />
        );
      })}
      {pts.map((p, i) => (
        <motion.line
          key={`r-${i}`}
          x1={cx}
          y1={cy}
          x2={p.x}
          y2={p.y}
          stroke={accentColor}
          strokeOpacity={0.35}
          strokeWidth={1}
          initial={reduce ? false : { pathLength: 0 }}
          animate={
            active ? { pathLength: 1 } : reduce ? undefined : { pathLength: 0 }
          }
          transition={{ duration: 0.5, delay: 1.0 + i * 0.06 }}
        />
      ))}
      <circle cx={cx} cy={cy} r={4} fill={accentColor} />
    </Shell>
  );
}

/* 37. funnel — funil convergindo */
function Funnel({ accentColor, active, reduce }: V) {
  const cx = VIEW.w / 2;
  return (
    <Shell>
      <Label x={20} y={18} color="#ffffff" opacity={0.32}>
        VOLUME
      </Label>
      <Label
        x={VIEW.w - 20}
        y={18}
        anchor="end"
        color={accentColor}
        opacity={0.75}
      >
        PRIORIDADE
      </Label>
      <motion.path
        d={`M ${cx - 130} 30 L ${cx + 130} 30 L ${cx + 30} 90 L ${cx + 30} ${VIEW.h - 14} L ${cx - 30} ${VIEW.h - 14} L ${cx - 30} 90 Z`}
        fill={accentColor}
        fillOpacity={0.12}
        stroke={accentColor}
        strokeOpacity={0.7}
        strokeWidth={1.3}
        initial={reduce ? false : { opacity: 0 }}
        animate={active ? { opacity: 1 } : reduce ? undefined : { opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      />
      {[0, 1, 2].map((i) => (
        <motion.circle
          key={i}
          cx={cx + (i - 1) * 30}
          cy={42}
          r={3}
          fill={accentColor}
          initial={{ opacity: 0 }}
          animate={
            active && !reduce
              ? { cy: [42, VIEW.h - 24], opacity: [0, 1, 0] }
              : { opacity: 0 }
          }
          transition={{
            duration: 2.2,
            repeat: Infinity,
            delay: 1.2 + i * 0.4,
            ease: "easeIn",
          }}
        />
      ))}
    </Shell>
  );
}

/* 38. relay — bastão de revezamento */
function Relay({ accentColor, active, reduce }: V) {
  const baseY = VIEW.h / 2 + 6;
  const stops = [60, 180, 300, 420, 540];
  return (
    <Shell>
      <Label x={20} y={18} color="#ffffff" opacity={0.32}>
        ETAPA
      </Label>
      <Label
        x={VIEW.w - 20}
        y={18}
        anchor="end"
        color={accentColor}
        opacity={0.75}
      >
        ENTREGA
      </Label>
      <line
        x1={40}
        x2={VIEW.w - 40}
        y1={baseY}
        y2={baseY}
        stroke={accentColor}
        strokeOpacity={0.3}
        strokeWidth={1}
        strokeDasharray="2 4"
      />
      {stops.map((x, i) => (
        <motion.g key={i}>
          <motion.circle
            cx={x}
            cy={baseY}
            r={5}
            fill={accentColor}
            initial={reduce ? false : { opacity: 0, scale: 0 }}
            animate={
              active
                ? { opacity: 1, scale: 1 }
                : reduce
                  ? undefined
                  : { opacity: 0, scale: 0 }
            }
            transition={{ duration: 0.4, delay: 0.5 + i * 0.18 }}
          />
          <motion.rect
            x={x - 14}
            y={baseY - 4}
            width={28}
            height={8}
            rx={4}
            fill="none"
            stroke={accentColor}
            strokeWidth={1}
            initial={reduce ? false : { opacity: 0 }}
            animate={
              active && !reduce ? { opacity: [0, 0.7, 0] } : { opacity: 0 }
            }
            transition={{
              duration: 1.4,
              delay: 0.5 + i * 0.18,
              repeat: Infinity,
              repeatDelay: 2,
            }}
          />
        </motion.g>
      ))}
    </Shell>
  );
}

/* 39. fan — leque radiante */
function Fan({ accentColor, active, reduce }: V) {
  const cx = VIEW.w / 2;
  const cy = VIEW.h - 10;
  return (
    <Shell>
      <Label x={20} y={18} color="#ffffff" opacity={0.32}>
        PONTO
      </Label>
      <Label
        x={VIEW.w - 20}
        y={18}
        anchor="end"
        color={accentColor}
        opacity={0.75}
      >
        ALCANCE
      </Label>
      {Array.from({ length: 9 }).map((_, i) => {
        const a = -Math.PI / 2 + (i - 4) * (Math.PI / 14);
        const x = cx + Math.cos(a) * 100;
        const y = cy + Math.sin(a) * 100;
        return (
          <motion.line
            key={i}
            x1={cx}
            y1={cy}
            x2={x}
            y2={y}
            stroke={accentColor}
            strokeOpacity={0.5}
            strokeWidth={1.1}
            strokeLinecap="round"
            initial={reduce ? false : { pathLength: 0 }}
            animate={
              active
                ? { pathLength: 1 }
                : reduce
                  ? undefined
                  : { pathLength: 0 }
            }
            transition={{ duration: 0.7, delay: 0.5 + i * 0.06 }}
          />
        );
      })}
      <circle cx={cx} cy={cy} r={5} fill={accentColor} />
      <motion.path
        d={`M ${cx - 100} ${cy - 5} A 100 100 0 0 1 ${cx + 100} ${cy - 5}`}
        fill="none"
        stroke={accentColor}
        strokeOpacity={0.3}
        strokeWidth={1}
        strokeDasharray="2 4"
        initial={reduce ? false : { pathLength: 0 }}
        animate={
          active ? { pathLength: 1 } : reduce ? undefined : { pathLength: 0 }
        }
        transition={{ duration: 1.0, delay: 1.2 }}
      />
    </Shell>
  );
}

/* 40. helix — hélice dupla */
function Helix({ accentColor, active, reduce }: V) {
  const baseY = VIEW.h / 2 + 6;
  const w = VIEW.w - 40;
  const amp = 18;
  const sample = 120;
  const path = (phase: number) => {
    const arr: string[] = [];
    for (let i = 0; i <= sample; i++) {
      const t = i / sample;
      const x = 20 + t * w;
      const y = baseY + Math.sin(t * Math.PI * 4 + phase) * amp;
      arr.push(`${i === 0 ? "M" : "L"} ${x} ${y}`);
    }
    return arr.join(" ");
  };
  return (
    <Shell>
      <Label x={20} y={18} color="#ffffff" opacity={0.32}>
        DUAS LÓGICAS
      </Label>
      <Label
        x={VIEW.w - 20}
        y={18}
        anchor="end"
        color={accentColor}
        opacity={0.75}
      >
        MESMA TRAJETÓRIA
      </Label>
      <motion.path
        d={path(0)}
        fill="none"
        stroke={accentColor}
        strokeOpacity={0.8}
        strokeWidth={1.4}
        initial={reduce ? false : { pathLength: 0 }}
        animate={
          active ? { pathLength: 1 } : reduce ? undefined : { pathLength: 0 }
        }
        transition={{ duration: 1.6, delay: 0.5 }}
      />
      <motion.path
        d={path(Math.PI)}
        fill="none"
        stroke={accentColor}
        strokeOpacity={0.45}
        strokeWidth={1.4}
        strokeDasharray="2 3"
        initial={reduce ? false : { pathLength: 0 }}
        animate={
          active ? { pathLength: 1 } : reduce ? undefined : { pathLength: 0 }
        }
        transition={{ duration: 1.6, delay: 0.7 }}
      />
      {Array.from({ length: 5 }).map((_, i) => {
        const t = (i + 1) / 6;
        const x = 20 + t * w;
        const y1 = baseY + Math.sin(t * Math.PI * 4) * amp;
        const y2 = baseY + Math.sin(t * Math.PI * 4 + Math.PI) * amp;
        return (
          <motion.line
            key={i}
            x1={x}
            y1={y1}
            x2={x}
            y2={y2}
            stroke={accentColor}
            strokeOpacity={0.35}
            strokeWidth={0.8}
            initial={reduce ? false : { opacity: 0 }}
            animate={
              active ? { opacity: 0.5 } : reduce ? undefined : { opacity: 0 }
            }
            transition={{ duration: 0.5, delay: 1.6 + i * 0.1 }}
          />
        );
      })}
    </Shell>
  );
}

export function CardVisual({ variant, accentColor, active }: Props) {
  const reduce = Boolean(useReducedMotion());
  switch (variant) {
    case "reveal":
      return (
        <Reveal accentColor={accentColor} active={active} reduce={reduce} />
      );
    case "pattern":
      return (
        <Pattern accentColor={accentColor} active={active} reduce={reduce} />
      );
    case "accumulation":
      return (
        <Accumulation
          accentColor={accentColor}
          active={active}
          reduce={reduce}
        />
      );
    case "late-reaction":
      return (
        <LateReaction
          accentColor={accentColor}
          active={active}
          reduce={reduce}
        />
      );
    case "transform":
      return (
        <Transform accentColor={accentColor} active={active} reduce={reduce} />
      );
    case "mesh":
      return <Mesh accentColor={accentColor} active={active} reduce={reduce} />;
    case "orbit":
      return (
        <Orbit accentColor={accentColor} active={active} reduce={reduce} />
      );
    case "radar":
      return (
        <Radar accentColor={accentColor} active={active} reduce={reduce} />
      );
    case "entry-points":
      return (
        <EntryPoints
          accentColor={accentColor}
          active={active}
          reduce={reduce}
        />
      );
    case "alignment":
      return (
        <Alignment accentColor={accentColor} active={active} reduce={reduce} />
      );
    case "modular":
      return (
        <Modular accentColor={accentColor} active={active} reduce={reduce} />
      );
    case "signal":
      return (
        <Signal accentColor={accentColor} active={active} reduce={reduce} />
      );
    case "spotlight":
      return (
        <Spotlight accentColor={accentColor} active={active} reduce={reduce} />
      );
    case "bloom":
      return (
        <Bloom accentColor={accentColor} active={active} reduce={reduce} />
      );
    case "compass":
      return (
        <Compass accentColor={accentColor} active={active} reduce={reduce} />
      );
    case "weave":
      return (
        <Weave accentColor={accentColor} active={active} reduce={reduce} />
      );
    case "ripple":
      return (
        <Ripple accentColor={accentColor} active={active} reduce={reduce} />
      );
    case "tide":
      return <Tide accentColor={accentColor} active={active} reduce={reduce} />;
    case "fragment":
      return (
        <Fragment accentColor={accentColor} active={active} reduce={reduce} />
      );
    case "converge":
      return (
        <Converge accentColor={accentColor} active={active} reduce={reduce} />
      );
    case "ladder":
      return (
        <Ladder accentColor={accentColor} active={active} reduce={reduce} />
      );
    case "branch":
      return (
        <Branch accentColor={accentColor} active={active} reduce={reduce} />
      );
    case "echo":
      return <Echo accentColor={accentColor} active={active} reduce={reduce} />;
    case "scale":
      return (
        <Scale accentColor={accentColor} active={active} reduce={reduce} />
      );
    case "thread":
      return (
        <Thread accentColor={accentColor} active={active} reduce={reduce} />
      );
    case "bridge":
      return (
        <Bridge accentColor={accentColor} active={active} reduce={reduce} />
      );
    case "heartbeat":
      return (
        <Heartbeat accentColor={accentColor} active={active} reduce={reduce} />
      );
    case "magnet":
      return (
        <Magnet accentColor={accentColor} active={active} reduce={reduce} />
      );
    case "prism":
      return (
        <Prism accentColor={accentColor} active={active} reduce={reduce} />
      );
    case "spiral":
      return (
        <Spiral accentColor={accentColor} active={active} reduce={reduce} />
      );
    case "portal":
      return (
        <Portal accentColor={accentColor} active={active} reduce={reduce} />
      );
    case "lens":
      return <Lens accentColor={accentColor} active={active} reduce={reduce} />;
    case "shield":
      return (
        <Shield accentColor={accentColor} active={active} reduce={reduce} />
      );
    case "gear":
      return <Gear accentColor={accentColor} active={active} reduce={reduce} />;
    case "crystal":
      return (
        <Crystal accentColor={accentColor} active={active} reduce={reduce} />
      );
    case "funnel":
      return (
        <Funnel accentColor={accentColor} active={active} reduce={reduce} />
      );
    case "relay":
      return (
        <Relay accentColor={accentColor} active={active} reduce={reduce} />
      );
    case "fan":
      return <Fan accentColor={accentColor} active={active} reduce={reduce} />;
    case "helix":
      return (
        <Helix accentColor={accentColor} active={active} reduce={reduce} />
      );
    case "flow":
    default:
      return <CardValueFlow accentColor={accentColor} active={active} />;
  }
}
