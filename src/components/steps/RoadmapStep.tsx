import { useContext, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Link2, Unlink } from 'lucide-react';
import { SaluxSymbol } from '../intro/SaluxLogo';
import { FloatingCard, FloatingCardContext } from '../FloatingCard';
import type { PresentationStep, RoadmapAgentCard } from '@/domain/types';
import { getCardTextVariants } from './cardTextMotion';

interface Props {
  step: PresentationStep;
  active: boolean;
}

const PHASES = [
  { phase: 'F1', label: 'Copiloto', desc: 'Sob supervisão humana', tone: '#a78bfa' },
  { phase: 'F2', label: 'Agente vertical', desc: 'Autonomia em fluxo restrito', tone: '#8b5cf6' },
  { phase: 'F3', label: 'Orquestração', desc: 'Múltiplos agentes coordenados', tone: '#7c3aed' },
  { phase: 'F4', label: 'Plataforma', desc: 'Capacidade institucional', tone: '#6d28d9' },
];

/** Extrai "antes" e "depois" de linhas tipo "De registro → contexto". */
function parseTransformBullet(line: string): { from: string; to: string } | null {
  const trimmed = line.trim();
  const arrowIdx = trimmed.indexOf('→');
  if (arrowIdx === -1) return null;
  let left = trimmed.slice(0, arrowIdx).trim();
  const right = trimmed.slice(arrowIdx + 1).trim();
  left = left.replace(/^De\s+/i, '').trim();
  if (!left || !right) return null;
  return { from: left, to: right };
}

/** Anel animado reutilizando a estética do ActivationPulse. */
function NodePulseRing({ color, active }: { color: string; active: boolean }) {
  if (!active) return null;
  return (
    <>
      {[1.55, 2.1, 2.6].map((s, i) => (
        <motion.span
          key={i}
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{ borderColor: color, borderStyle: 'solid', borderWidth: 1 }}
          initial={{ scale: 1, opacity: 0.7 }}
          animate={{ scale: s, opacity: 0 }}
          transition={{ duration: 2, delay: i * 0.25, repeat: Infinity, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}
    </>
  );
}

/** Partícula SVG que percorre o path (reutiliza a lógica do ParticleStream). */
function MiniParticleStream({
  pathD,
  color,
  active,
}: {
  pathD: string;
  color: string;
  active: boolean;
}) {
  const phases = [
    { dash: '0.001 0.32', delay: 0, dur: 3.8 },
    { dash: '0.001 0.32', delay: 1.2, dur: 3.8 },
  ];
  return (
    <g>
      {phases.map((p, i) => (
        <motion.path
          key={i}
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth={active ? 4.5 : 3}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={p.dash}
          initial={{ strokeDashoffset: 0, opacity: 0.7 }}
          animate={{ strokeDashoffset: -1 }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'linear' }}
          style={{ filter: `drop-shadow(0 0 4px ${color})` }}
        />
      ))}
    </g>
  );
}

function FragmentedVsCoordinatedPreview({
  active,
  reduceMotion,
}: {
  active: boolean;
  reduceMotion: boolean;
}) {
  const fragNodes = [
    { cx: 18, cy: 18 },
    { cx: 72, cy: 12 },
    { cx: 32, cy: 55 },
    { cx: 82, cy: 58 },
    { cx: 50, cy: 85 },
  ];

  const coordNodes = [
    { cx: 10, cy: 50 },
    { cx: 30, cy: 50 },
    { cx: 50, cy: 50 },
    { cx: 70, cy: 50 },
    { cx: 90, cy: 50 },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-stretch">
      {/* -- Fragmentada -- */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: active ? 1 : 0.35, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-2xl border border-rose-400/25 bg-gradient-to-br from-rose-950/40 to-transparent p-4 shadow-soft"
      >
        <div className="mb-3 flex items-center gap-2">
          <Unlink className="h-4 w-4 text-rose-300/90" strokeWidth={2} aria-hidden />
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-rose-200/95">Jornada fragmentada</p>
        </div>
        <div className="relative mb-2 h-[130px]">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
            <defs>
              <linearGradient id="frag-line" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#fb7185" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#fb7185" stopOpacity="0.08" />
              </linearGradient>
            </defs>
            <path d="M 18 18 Q 45 35 32 55" fill="none" stroke="url(#frag-line)" strokeWidth="0.6" strokeDasharray="2 3" />
            <path d="M 72 12 Q 77 35 82 58" fill="none" stroke="url(#frag-line)" strokeWidth="0.6" strokeDasharray="2 3" />
            <path d="M 32 55 Q 42 70 50 85" fill="none" stroke="url(#frag-line)" strokeWidth="0.6" strokeDasharray="2 3" />
          </svg>
          {fragNodes.map((n, i) => (
            <motion.div
              key={i}
              initial={reduceMotion ? false : { scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: active ? 1 : 0.45 }}
              transition={{ delay: reduceMotion ? 0 : 0.08 + i * 0.06 }}
              className="absolute flex items-center justify-center"
              style={{ left: `${n.cx}%`, top: `${n.cy}%`, transform: 'translate(-50%, -50%)' }}
            >
              <div className="relative flex h-8 w-8 items-center justify-center rounded-full border border-rose-400/50 bg-rose-500/20 text-[11px] font-bold text-rose-100 shadow-soft">
                {i + 1}
                {i === 2 && (
                  <motion.span
                    className="pointer-events-none absolute inset-0 rounded-full border border-rose-400/40"
                    animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
                  />
                )}
              </div>
            </motion.div>
          ))}
          {active && !reduceMotion && (
            <motion.div
              className="pointer-events-none absolute text-[8px] font-semibold uppercase tracking-wider text-rose-300/70"
              style={{ left: '42%', top: '36%' }}
              animate={{ opacity: [0.35, 0.7, 0.35] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              ?
            </motion.div>
          )}
        </div>
        <p className="text-[11px] leading-snug text-rose-200/75">
          Etapas isoladas, lacunas entre decisões e reconstrução manual do contexto.
        </p>
      </motion.div>

      {/* -- Passagem -- */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, scale: 0.92 }}
        animate={{ opacity: active ? 1 : 0.4, scale: 1 }}
        transition={{ delay: reduceMotion ? 0 : 0.15, duration: 0.5 }}
        className="flex flex-col items-center justify-center gap-2 py-4 md:py-0"
        aria-hidden
      >
        <div className="hidden h-px w-full bg-gradient-to-r from-transparent via-violet-400/35 to-transparent md:block" />
        <div className="relative flex flex-col items-center gap-1 rounded-xl border border-violet-400/25 bg-violet-500/10 px-3 py-2.5">
          <NodePulseRing color="#7c3aed" active={active && !reduceMotion} />
          <ArrowRight className="h-5 w-5 text-violet-300" strokeWidth={2} />
          <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-violet-200/80">Passagem</span>
        </div>
        <div className="hidden h-px w-full bg-gradient-to-r from-transparent via-violet-400/35 to-transparent md:block" />
      </motion.div>

      {/* -- Coordenada -- */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: active ? 1 : 0.35, y: 0 }}
        transition={{ delay: reduceMotion ? 0 : 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-2xl border border-emerald-400/25 bg-gradient-to-br from-emerald-950/35 to-transparent p-4 shadow-soft"
      >
        <div className="mb-3 flex items-center gap-2">
          <Link2 className="h-4 w-4 text-emerald-300/95" strokeWidth={2} aria-hidden />
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-200/95">Jornada coordenada</p>
        </div>
        <div className="relative mb-2 h-[130px]">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
            <defs>
              <linearGradient id="coord-line" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#34d399" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#54c1ed" stopOpacity="0.6" />
              </linearGradient>
              <filter id="coord-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <path
              d="M 10 50 L 30 50 L 50 50 L 70 50 L 90 50"
              fill="none"
              stroke="url(#coord-line)"
              strokeWidth="0.6"
              strokeLinecap="round"
            />
            {active && !reduceMotion && (
              <MiniParticleStream
                pathD="M 10 50 L 30 50 L 50 50 L 70 50 L 90 50"
                color="#34d399"
                active={active}
              />
            )}
          </svg>
          {coordNodes.map((n, i) => (
            <motion.div
              key={i}
              initial={reduceMotion ? false : { opacity: 0, scale: 0.7 }}
              animate={{ opacity: active ? 1 : 0.45, scale: 1 }}
              transition={{ delay: reduceMotion ? 0 : 0.2 + i * 0.07 }}
              className="absolute flex items-center justify-center"
              style={{ left: `${n.cx}%`, top: `${n.cy}%`, transform: 'translate(-50%, -50%)' }}
            >
              <div className="relative flex h-9 w-9 items-center justify-center rounded-full border border-emerald-400/50 bg-emerald-500/20 text-[12px] font-bold text-emerald-50 shadow-soft">
                {i + 1}
                <NodePulseRing color="#34d399" active={active && !reduceMotion && i === 2} />
              </div>
            </motion.div>
          ))}
          {active && !reduceMotion && (
            <motion.div
              className="pointer-events-none absolute inset-0 rounded-lg"
              style={{
                background: 'radial-gradient(ellipse at 50% 50%, rgba(52,211,153,0.12), transparent 70%)',
              }}
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}
        </div>
        <p className="text-[11px] leading-snug text-emerald-200/80">
          Um fio condutor de contexto atravessa etapas, equipas e momentos do cuidado.
        </p>
      </motion.div>
    </div>
  );
}

function AgentCard({ card }: { card: RoadmapAgentCard }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="flex h-full flex-col rounded-2xl p-4"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'rgba(139,92,246,0.1)' : 'rgba(255,255,255,0.035)',
        border: `1px solid ${hovered ? 'rgba(139,92,246,0.45)' : 'rgba(139,92,246,0.22)'}`,
        boxShadow: hovered ? '0 8px 28px -8px rgba(139,92,246,0.3), inset 0 1px 0 rgba(255,255,255,0.07)' : 'inset 0 1px 0 rgba(255,255,255,0.04)',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        transition: 'background 300ms, border 300ms, box-shadow 300ms, transform 280ms ease',
      }}
    >
      <div
        className="flex items-start gap-2.5 pb-2.5"
        style={{ borderBottom: `1px solid ${hovered ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.08)'}`, transition: 'border-color 300ms' }}
      >
        <span
          className="mt-0.5 shrink-0 transition-[filter] duration-300"
          style={{ filter: hovered ? 'drop-shadow(0 0 10px rgba(139,92,246,0.7))' : 'drop-shadow(0 0 6px rgba(139,92,246,0.3))' }}
        >
          <SaluxSymbol width={22} idle={false} className="h-[22px] w-[22px]" />
        </span>
        <p
          className="min-w-0 flex-1 text-[10px] font-bold uppercase leading-tight tracking-[0.12em] transition-colors duration-300"
          style={{ color: hovered ? '#c4b5fd' : '#a78bfa' }}
        >
          {card.title}
        </p>
      </div>
      <div className="mt-3 flex min-h-0 flex-1 flex-col gap-2 text-[11px] leading-snug">
        {card.segments.map((seg, i) =>
          seg.type === 'text' ? (
            <p key={i} className="whitespace-pre-line text-slate-300">
              {seg.text}
            </p>
          ) : (
            <p key={i} className="font-semibold transition-colors duration-300" style={{ color: hovered ? '#c4b5fd' : '#a78bfa' }}>
              → {seg.name}
            </p>
          ),
        )}
      </div>
    </div>
  );
}

export function RoadmapStep({ step, active }: Props) {
  const agents = step.content.roadmapAgents;
  const reduceMotion = useReducedMotion();
  const flipPhoto = useContext(FloatingCardContext)?.flipPhoto ?? false;
  const { container, item } = getCardTextVariants(
    Boolean(reduceMotion),
    step.index,
    `${step.id}:${step.title}`,
    flipPhoto,
  );

  if (agents?.length) {
    const COLS = 3;

    return (
      <FloatingCard
        accent={step.accent}
        active={active}
        stepId={step.id}
        badge={step.content.headline ?? String(step.index + 1).padStart(2, '0')}
        width={760}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* Título */}
          <motion.div
            className="sm:col-span-2 lg:col-span-3"
            initial={reduceMotion ? false : { opacity: 0, y: -10, filter: 'blur(4px)' }}
            animate={active ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: -10, filter: 'blur(4px)' }}
            transition={{
              duration: 0.55,
              ease: [0.22, 1, 0.36, 1],
              delay: reduceMotion ? 0 : 0.62,
            }}
          >
            <h2 className="font-display text-[26px] font-bold leading-[1.15] tracking-tight text-white md:text-[28px]">
              {step.title}
            </h2>
          </motion.div>

          {/* Cards com entrada por linha */}
          {agents.map((card, i) => {
            const row = Math.floor(i / COLS);   // 0 = linha de cima, 1 = linha de baixo
            const col = i % COLS;
            const layerPad = reduceMotion ? 0 : 0.62;
            const rowDelay = layerPad + 0.18 + row * 0.42;
            const delay = rowDelay + col * 0.1;
            const yFrom = row === 0 ? -18 : 18;  // cima desce, baixo sobe

            return (
              <motion.div
                key={card.title}
                className="min-h-0"
                initial={reduceMotion ? false : { opacity: 0, y: yFrom, scale: 0.95, filter: 'blur(5px)' }}
                animate={
                  active
                    ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }
                    : { opacity: 0, y: yFrom, scale: 0.95, filter: 'blur(5px)' }
                }
                transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <AgentCard card={card} />
              </motion.div>
            );
          })}
        </div>
      </FloatingCard>
    );
  }

  if (step.content.roadmapTransform && step.content.bullets?.length) {
    return (
      <FloatingCard
        accent={step.accent}
        active={active}
        stepId={step.id}
        badge={step.content.headline ?? String(step.index + 1).padStart(2, '0')}
        width={780}
      >
        <motion.div
          className="flex flex-col gap-6"
          variants={container}
          initial={reduceMotion ? false : 'hidden'}
          animate={active ? 'visible' : 'hidden'}
        >
          <motion.div variants={item}>
            <h2 className="font-display text-[28px] font-bold leading-[1.15] tracking-tight text-white">{step.title}</h2>
          </motion.div>

          <motion.div variants={item}>
            <FragmentedVsCoordinatedPreview active={active} reduceMotion={Boolean(reduceMotion)} />
          </motion.div>

          <motion.div variants={item} className="space-y-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-violet-300/85">
              Cinco mudanças de lógica
            </p>
            <ul className="flex flex-col gap-2.5">
              {step.content.bullets.map((line, i) => {
                const parsed = parseTransformBullet(line);
                return (
                  <motion.li
                    key={`${line}-${i}`}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: reduceMotion ? 0 : 0.22 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                    className="grid gap-2 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-3 shadow-soft sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:gap-3"
                  >
                    {parsed ? (
                      <>
                        <span className="rounded-lg border border-rose-400/20 bg-rose-500/[0.06] px-3 py-2 text-[12px] leading-snug text-rose-100/95">
                          {parsed.from}
                        </span>
                        <span className="flex justify-center sm:px-1">
                          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-violet-400/35 bg-violet-500/15 text-violet-200">
                            <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden />
                          </span>
                        </span>
                        <span className="rounded-lg border border-emerald-400/25 bg-emerald-500/[0.07] px-3 py-2 text-[12px] font-medium leading-snug text-emerald-50/95">
                          {parsed.to}
                        </span>
                      </>
                    ) : (
                      <span className="sm:col-span-3 text-[13px] font-medium leading-snug text-slate-100">{line}</span>
                    )}
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>

          {step.content.body && (
            <motion.p variants={item} className="border-t border-white/[0.06] pt-5 text-sm leading-relaxed text-slate-300 whitespace-pre-line">
              {step.content.body}
            </motion.p>
          )}
        </motion.div>
      </FloatingCard>
    );
  }

  return (
    <FloatingCard
      accent={step.accent}
      active={active}
      stepId={step.id}
      badge={step.content.headline ?? String(step.index + 1).padStart(2, '0')}
      width={680}
    >
      <motion.div
        className="flex flex-col gap-6"
        variants={container}
        initial={reduceMotion ? false : 'hidden'}
        animate={active ? 'visible' : 'hidden'}
      >
        <motion.div variants={item}>
          <h2 className="font-display text-[28px] font-bold leading-[1.15] tracking-tight text-white">{step.title}</h2>
        </motion.div>

        <motion.div variants={item} className="grid grid-cols-4 items-end gap-3">
          {PHASES.map((p, i) => (
            <motion.div
              key={p.phase}
              initial={{ opacity: 0, y: 12 }}
              animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              transition={{
                delay: (reduceMotion ? 0 : 0.62) + 0.18 + i * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-soft"
              style={{
                marginTop: `${(3 - i) * 12}px`,
                borderTop: `3px solid ${p.tone}`,
              }}
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: p.tone }}>
                {p.phase}
              </p>
              <p className="mt-1.5 text-sm font-semibold text-white">{p.label}</p>
              <p className="mt-0.5 text-[11px] leading-snug text-slate-400">{p.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.p variants={item} className="text-sm leading-relaxed text-slate-300 whitespace-pre-line">
          {step.content.body}
        </motion.p>
      </motion.div>
    </FloatingCard>
  );
}
