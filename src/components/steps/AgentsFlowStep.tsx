import { useContext, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { FloatingCard, FloatingCardContext } from '../FloatingCard';
import type { PresentationStep } from '@/domain/types';
import { theme } from '@/domain/theme';
import { getCardTextVariants } from './cardTextMotion';
import { HighlightPhraseList } from './HighlightBlocks';

interface Props {
  step: PresentationStep;
  active: boolean;
}

/** Card 10 — INITIA como hub orquestrador.
 *  Funções dos agentes orbitam o núcleo INITIA; pipeline animado mostra a transição "antes → com INITIA". */
export function AgentsFlowStep({ step, active }: Props) {
  const accent = theme.accents[step.accent];
  const reduce = useReducedMotion();
  const flipPhoto = useContext(FloatingCardContext)?.flipPhoto ?? false;
  const { container, item } = getCardTextVariants(
    Boolean(reduce),
    step.index,
    `${step.id}:${step.title}`,
    flipPhoto,
  );
  const before = step.content.beforeAfter?.before ?? [];
  const after = step.content.beforeAfter?.after ?? [];
  const fns = step.content.agentFunctions ?? [];

  return (
    <FloatingCard
      accent={step.accent}
      active={active}
      stepId={step.id}
      width={780}
      badge={step.title}
    >
      <motion.div
        className="flex flex-col gap-5"
        variants={container}
        initial={reduce ? false : 'hidden'}
        animate={active ? 'visible' : 'hidden'}
      >
        <motion.div variants={item}>
          <h2
            className="presentation-ppt-title max-w-[28ch] text-[clamp(1.62rem,3.5vw,2.25rem)] leading-[1.12]"
            style={{ textShadow: `0 0 28px ${accent.base}22` }}
          >
            {step.content.headline}
          </h2>
        </motion.div>

        {/* Hub orquestrador com órbita */}
        <motion.div variants={item}>
          <InitiaHub
            color={accent.base}
            functions={fns}
            reduce={Boolean(reduce)}
            active={active}
          />
        </motion.div>

        {/* Pipeline antes → com INITIA */}
        <motion.div variants={item}>
          <TransitionPipeline
            before={before}
            after={after}
            color={accent.base}
            reduce={Boolean(reduce)}
            active={active}
          />
        </motion.div>

        {step.content.highlightPhrases && (
          <motion.div variants={item}>
            <HighlightPhraseList items={step.content.highlightPhrases} active={active} />
          </motion.div>
        )}
      </motion.div>
    </FloatingCard>
  );
}

/** Núcleo INITIA com 8 funções orbitando. Humano à esquerda + agente à direita. */
function InitiaHub({
  color,
  functions,
  reduce,
  active,
}: {
  color: string;
  functions: string[];
  reduce: boolean;
  active: boolean;
}) {
  const size = 320;
  const cx = size / 2;
  const cy = size / 2;
  const rOrbit = 128;
  const count = functions.length || 8;

  return (
    <div
      className="relative mx-auto"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        className="absolute inset-0"
        style={{ filter: `drop-shadow(0 0 28px ${color}33)` }}
      >
        <defs>
          <radialGradient id={`hub-${color}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.7" />
            <stop offset="60%" stopColor={color} stopOpacity="0.15" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Anéis orbitais */}
        {[0.55, 0.78, 1].map((t, i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={rOrbit * t}
            stroke={`${color}22`}
            strokeWidth={0.5}
            strokeDasharray={i === 1 ? '2 3' : '0'}
            fill="none"
          />
        ))}

        {/* Núcleo */}
        <circle cx={cx} cy={cy} r={48} fill={`url(#hub-${color})`} />
        <motion.circle
          cx={cx}
          cy={cy}
          r={32}
          fill="none"
          stroke={color}
          strokeWidth={1}
          animate={reduce ? undefined : { r: [28, 36, 28], opacity: [0.75, 0.3, 0.75] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <circle cx={cx} cy={cy} r={5} fill={color} style={{ filter: `drop-shadow(0 0 6px ${color})` }} />
      </svg>

      {/* Label central */}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-[9px] font-semibold uppercase tracking-[0.3em]"
          style={{ color, opacity: 0.8 }}
        >
          orquestração
        </span>
        <span
          className="font-display text-[1.05rem] font-extrabold tracking-tight text-white"
          style={{ textShadow: `0 0 14px ${color}66` }}
        >
          INITIA
        </span>
        <span className="mt-0.5 text-[8.5px] uppercase tracking-[0.24em] text-white/55">
          camada de suporte
        </span>
      </div>

      {/* Humano + Agente nos polos */}
      <PoleIcon side="left" color={color} label="Humano" reduce={reduce} active={active} />
      <PoleIcon side="right" color={color} label="Agente" reduce={reduce} active={active} variant="agent" />

      {/* Funções orbitando — rotação contínua do contêiner, contra-rotação dos chips */}
      <motion.div
        className="absolute inset-0"
        animate={reduce ? undefined : { rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      >
        {functions.slice(0, count).map((f, i) => {
          const a = (i / count) * Math.PI * 2 - Math.PI / 2;
          const x = cx + Math.cos(a) * rOrbit;
          const y = cy + Math.sin(a) * rOrbit;
          return (
            <motion.div
              key={f}
              className="absolute"
              style={{
                left: x,
                top: y,
                transform: 'translate(-50%, -50%)',
              }}
              initial={reduce ? false : { opacity: 0, scale: 0.6 }}
              animate={active ? { opacity: 1, scale: 1 } : reduce ? undefined : { opacity: 0, scale: 0.6 }}
              transition={{
                duration: 0.5,
                delay: 0.5 + i * 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <motion.span
                className="block whitespace-nowrap rounded-full border px-2.5 py-1 text-[10.5px] font-semibold text-slate-50"
                style={{
                  borderColor: `${color}66`,
                  background: `linear-gradient(135deg, ${color}22 0%, rgba(13,16,24,0.95) 100%)`,
                  boxShadow: `0 0 14px -4px ${color}99, inset 0 1px 0 rgba(255,255,255,0.08)`,
                }}
                animate={reduce ? undefined : { rotate: -360 }}
                transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
              >
                {f}
              </motion.span>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

function PoleIcon({
  side,
  color,
  label,
  reduce,
  active,
  variant,
}: {
  side: 'left' | 'right';
  color: string;
  label: string;
  reduce: boolean;
  active: boolean;
  variant?: 'agent';
}) {
  const isAgent = variant === 'agent';
  return (
    <motion.div
      aria-hidden
      className="absolute top-1/2 -translate-y-1/2"
      style={{ [side]: -10 }}
      initial={reduce ? false : { opacity: 0, x: side === 'left' ? -8 : 8 }}
      animate={active ? { opacity: 1, x: 0 } : reduce ? undefined : { opacity: 0, x: side === 'left' ? -8 : 8 }}
      transition={{ duration: 0.55, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="flex h-12 w-12 items-center justify-center rounded-full border"
        style={{
          borderColor: `${color}77`,
          background: `radial-gradient(circle, ${color}22, rgba(13,16,24,1) 70%)`,
          boxShadow: `0 0 0 1px ${color}33, 0 0 22px -4px ${color}`,
        }}
      >
        {isAgent ? (
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M11 2l8 8-8 8-8-8z" stroke={color} strokeWidth="1.5" fill={`${color}33`} />
            <circle cx="11" cy="11" r="2" fill={color} />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="6" r="3" stroke="#e2e8f0" strokeWidth="1.4" fill="none" />
            <path
              d="M3 19c0-3.5 3.1-6 7-6s7 2.5 7 6"
              stroke="#e2e8f0"
              strokeWidth="1.4"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        )}
      </div>
      <p
        className="mt-1 text-center text-[8.5px] font-semibold uppercase tracking-[0.22em]"
        style={{ color: isAgent ? color : 'rgba(255,255,255,0.65)' }}
      >
        {label}
      </p>
    </motion.div>
  );
}

/** Pipeline antes → com INITIA: tokens fragmentados se coalescem em fluxo coordenado. */
function TransitionPipeline({
  before,
  after,
  color,
  reduce,
  active,
}: {
  before: string[];
  after: string[];
  color: string;
  reduce: boolean;
  active: boolean;
}) {
  const [phase, setPhase] = useState<'before' | 'after'>('before');

  useEffect(() => {
    if (!active || reduce) {
      setPhase('after');
      return;
    }
    setPhase('before');
    const t = window.setTimeout(() => setPhase('after'), 1400);
    return () => window.clearTimeout(t);
  }, [active, reduce]);

  const steps = phase === 'before' ? before : after;
  const isAfter = phase === 'after';

  return (
    <div
      className="relative overflow-hidden rounded-2xl border px-4 py-3"
      style={{
        borderColor: isAfter ? `${color}55` : 'rgba(255,255,255,0.08)',
        background: isAfter
          ? `linear-gradient(135deg, ${color}14 0%, rgba(255,255,255,0.02) 100%)`
          : 'rgba(255,255,255,0.025)',
        boxShadow: isAfter ? `0 0 28px -12px ${color}99` : undefined,
      }}
    >
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.28em]">
          <span
            className="rounded-full px-2 py-0.5"
            style={{
              color: isAfter ? 'rgba(255,255,255,0.45)' : '#e2e8f0',
              background: isAfter ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            Antes
          </span>
          <span className="text-white/30">→</span>
          <span
            className="rounded-full px-2 py-0.5"
            style={{
              color: isAfter ? color : 'rgba(255,255,255,0.45)',
              background: isAfter ? `${color}1a` : 'rgba(255,255,255,0.04)',
              border: `1px solid ${isAfter ? `${color}55` : 'rgba(255,255,255,0.06)'}`,
            }}
          >
            Com INITIA
          </span>
        </div>
        <button
          type="button"
          data-no-click-advance
          onClick={(e) => {
            e.stopPropagation();
            setPhase((p) => (p === 'before' ? 'after' : 'before'));
          }}
          className="rounded-full border border-white/10 px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/55 transition-colors hover:border-white/20 hover:text-white/80"
        >
          alternar
        </button>
      </div>

      <div className="relative flex items-stretch">
        {steps.map((t, i) => (
          <div key={`${phase}-${t}`} className="flex flex-1 items-center">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 8, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{
                duration: 0.45,
                ease: [0.22, 1, 0.36, 1],
                delay: i * 0.08,
              }}
              className="relative flex-1 rounded-lg border px-2.5 py-2"
              style={{
                borderColor: isAfter ? `${color}55` : 'rgba(255,255,255,0.1)',
                background: isAfter
                  ? `linear-gradient(135deg, ${color}1a 0%, rgba(255,255,255,0.02) 100%)`
                  : 'rgba(255,255,255,0.03)',
                boxShadow: isAfter ? `0 0 14px -8px ${color}` : undefined,
              }}
            >
              <span
                className="block text-[8.5px] font-bold uppercase tracking-[0.22em]"
                style={{ color: isAfter ? color : 'rgba(255,255,255,0.45)' }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <span
                className="block text-[0.78rem] leading-snug"
                style={{ color: isAfter ? '#f1f5ff' : 'rgba(255,255,255,0.7)' }}
              >
                {t}
              </span>
            </motion.div>

            {i < steps.length - 1 && (
              <div className="relative mx-1 h-px w-3 flex-shrink-0">
                <span
                  className="absolute inset-0"
                  style={{
                    background: isAfter
                      ? `linear-gradient(90deg, ${color}aa, ${color})`
                      : 'rgba(255,255,255,0.18)',
                    boxShadow: isAfter ? `0 0 8px ${color}` : undefined,
                  }}
                />
                {isAfter && !reduce && (
                  <motion.span
                    className="absolute -top-[2px] h-[5px] w-[5px] rounded-full"
                    style={{ background: color, boxShadow: `0 0 8px ${color}` }}
                    initial={{ left: '-10%' }}
                    animate={{ left: '110%' }}
                    transition={{
                      duration: 1.6,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: i * 0.2,
                    }}
                  />
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
