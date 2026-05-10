import { useContext, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
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
  const { container, item } = getCardTextVariants(Boolean(reduceMotion), step.index, flipPhoto);

  if (agents?.length) {
    const COLS = 3;

    return (
      <FloatingCard
        accent={step.accent}
        active={active}
        stepId={step.id}
        badge={step.content.headline ?? String(step.index + 1).padStart(2, '0')}
        width={960}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
        width={720}
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

          <motion.ul variants={item} className="flex flex-col gap-3">
            {step.content.bullets.map((line, i) => (
              <motion.li
                key={`${line}-${i}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: reduceMotion ? 0 : 0.14 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-start gap-4 rounded-2xl border border-violet-400/20 bg-gradient-to-r from-violet-500/[0.07] to-transparent px-4 py-3.5 shadow-soft"
              >
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-violet-400/35 bg-violet-500/15 text-violet-200">
                  <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden />
                </span>
                <span className="text-[13px] font-medium leading-snug text-slate-100">{line}</span>
              </motion.li>
            ))}
          </motion.ul>

          {step.content.body && (
            <motion.p variants={item} className="text-sm leading-relaxed text-slate-300 whitespace-pre-line">
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
