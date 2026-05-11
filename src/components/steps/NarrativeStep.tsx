import { useContext, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { FloatingCard, FloatingCardContext } from '../FloatingCard';
import type { PresentationStep } from '@/domain/types';
import { theme } from '@/domain/theme';
import { AnimatedRiskCurve } from '../visuals/AnimatedRiskCurve';
import { AnimatedNarrativeMetrics } from '../visuals/AnimatedNarrativeMetrics';
import { getCardTextVariants } from './cardTextMotion';

interface Props {
  step: PresentationStep;
  active: boolean;
}

export function NarrativeStep({ step, active }: Props) {
  const accent = theme.accents[step.accent];
  const reduceMotion = useReducedMotion();
  const flipPhoto = useContext(FloatingCardContext)?.flipPhoto ?? false;
  const { container, item } = getCardTextVariants(Boolean(reduceMotion), step.index, flipPhoto);
  const painPoints = step.content.painPointsLayout;
  const useBalloon = painPoints && step.content.painPointsBalloon;
  const [balloonOpen, setBalloonOpen] = useState(false);

  // Fecha o balão quando o slide deixa de estar ativo
  useEffect(() => {
    if (!active) setBalloonOpen(false);
  }, [active]);

  // ESC fecha o balão
  useEffect(() => {
    if (!balloonOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        setBalloonOpen(false);
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [balloonOpen]);

  return (
    <FloatingCard
      accent={step.accent}
      active={active}
      stepId={step.id}
      width={painPoints ? 640 : undefined}
      badge={
        painPoints
          ? String(step.index + 1).padStart(2, '0')
          : step.content.headline ?? String(step.index + 1).padStart(2, '0')
      }
    >
      <motion.div
        className="flex flex-col gap-5"
        variants={container}
        initial={reduceMotion ? false : 'hidden'}
        animate={active ? 'visible' : 'hidden'}
      >
        {painPoints && step.content.headline ? (
          <motion.div variants={item} className="space-y-3">
            <span
              className="block text-[10px] font-semibold uppercase tracking-[0.32em]"
              style={{ color: accent.base, opacity: 0.85 }}
            >
              {step.title}
            </span>
            <h2
              className="presentation-ppt-title max-w-[20ch] text-[clamp(1.65rem,3.6vw,2.45rem)] leading-[1.08]"
              style={{ textShadow: `0 0 28px ${accent.base}22` }}
            >
              {step.content.headline}
            </h2>
          </motion.div>
        ) : (
          <motion.div variants={item}>
            <h2 className="presentation-ppt-title max-w-[24ch] text-[clamp(1.35rem,3.2vw,1.85rem)]">
              {step.title}
            </h2>
          </motion.div>
        )}

        {step.content.metrics && step.content.metrics.length > 0 && (
          <motion.div variants={item}>
            <AnimatedNarrativeMetrics
              items={step.content.metrics}
              active={active}
              reducedMotion={Boolean(reduceMotion)}
              accentColor={accent.base}
            />
          </motion.div>
        )}

        {step.content.body && !painPoints && (
          <motion.p variants={item} className="presentation-ppt-body whitespace-pre-line">
            {step.content.body}
          </motion.p>
        )}

        {step.content.bullets &&
          step.content.bullets.length > 0 &&
          typeof step.content.bulletSplitAfter === 'number' &&
          step.content.bulletSplitAfter > 0 &&
          step.content.bullets.length > step.content.bulletSplitAfter && (
            <motion.div variants={item} className="space-y-5">
              <div>
                <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-300/85">
                  O que a instituição faz hoje
                </p>
                <div className="flex flex-wrap gap-2">
                  {step.content.bullets.slice(0, step.content.bulletSplitAfter).map((verb) => (
                    <span
                      key={verb}
                      className="rounded-full border border-cyan-400/25 bg-cyan-500/[0.09] px-3 py-1.5 text-[12px] font-medium text-slate-100 shadow-soft"
                    >
                      {verb}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-rose-300/85">
                  Onde a continuidade falha
                </p>
                <ul className="space-y-2">
                  {step.content.bullets.slice(step.content.bulletSplitAfter).map((bullet) => (
                    <li key={bullet} className="flex items-start gap-3 text-sm text-slate-200">
                      <span
                        className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full"
                        style={{ background: accent.base, boxShadow: `0 0 8px ${accent.base}88` }}
                      />
                      <span className="whitespace-pre-line">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}

        {painPoints && !useBalloon && step.content.bullets && step.content.bullets.length > 0 && (
          <PainPointChips
            bullets={step.content.bullets}
            accentColor={accent.base}
            active={active}
            reducedMotion={Boolean(reduceMotion)}
          />
        )}

        {useBalloon && step.content.bullets && step.content.bullets.length > 0 && (
          <motion.div variants={item} className="flex justify-center py-3">
            <BalloonTrigger
              label={step.content.painPointsTriggerLabel ?? 'Abrir os 7 pontos'}
              accentColor={accent.base}
              onClick={() => setBalloonOpen(true)}
              reducedMotion={Boolean(reduceMotion)}
            />
          </motion.div>
        )}

        {!painPoints &&
          step.content.bullets &&
          step.content.bullets.length > 0 &&
          !(
            typeof step.content.bulletSplitAfter === 'number' &&
            step.content.bulletSplitAfter > 0 &&
            step.content.bullets.length > step.content.bulletSplitAfter
          ) && (
          <motion.ul variants={item} className="mt-1 space-y-2.5">
            {step.content.bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-3 text-sm text-slate-200">
                <span
                  className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full"
                  style={{ background: accent.base, boxShadow: `0 0 8px ${accent.base}88` }}
                />
                <span className="whitespace-pre-line">{bullet}</span>
              </li>
            ))}
          </motion.ul>
        )}

        {painPoints && step.content.body && (
          <motion.div variants={item} className="relative mt-1 pl-4">
            <span
              aria-hidden
              className="absolute left-0 top-1 bottom-1 w-px"
              style={{ background: `linear-gradient(180deg, ${accent.base}, transparent)` }}
            />
            <p className="presentation-ppt-body whitespace-pre-line text-[0.95rem] leading-relaxed text-slate-300/95">
              {step.content.body}
            </p>
          </motion.div>
        )}

        {painPoints && step.content.closingQuestion && (
          <motion.div
            variants={item}
            className="relative mt-2 overflow-hidden rounded-2xl border px-5 py-4"
            style={{
              borderColor: `${accent.base}55`,
              background: `linear-gradient(135deg, ${accent.base}1c 0%, rgba(255,255,255,0.02) 70%)`,
              boxShadow: `0 0 0 1px ${accent.base}22, inset 0 1px 0 rgba(255,255,255,0.05)`,
            }}
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-6 -top-px h-px"
              style={{ background: `linear-gradient(90deg, transparent, ${accent.base}, transparent)` }}
            />
            <span
              className="mb-1.5 block text-[9px] font-semibold uppercase tracking-[0.34em]"
              style={{ color: accent.base, opacity: 0.85 }}
            >
              Para a sua liderança
            </span>
            <p
              className="text-[1.05rem] font-semibold leading-snug text-white"
              style={{ textShadow: `0 0 24px ${accent.base}25` }}
            >
              {step.content.closingQuestion}
            </p>
          </motion.div>
        )}

        {step.content.visual?.type === 'risk-curve' && (
          <motion.div variants={item}>
            <AnimatedRiskCurve active={active} />
          </motion.div>
        )}
      </motion.div>

      <AnimatePresence>
        {useBalloon && balloonOpen && step.content.bullets && (
          <PainPointsBalloon
            title={step.content.painPointsBalloonTitle ?? 'Pontos de atrito'}
            headline={step.content.headline}
            bullets={step.content.bullets}
            accentColor={accent.base}
            reducedMotion={Boolean(reduceMotion)}
            onClose={() => setBalloonOpen(false)}
          />
        )}
      </AnimatePresence>
    </FloatingCard>
  );
}

interface BalloonTriggerProps {
  label: string;
  accentColor: string;
  onClick: () => void;
  reducedMotion: boolean;
}

function BalloonTrigger({ label, accentColor, onClick, reducedMotion }: BalloonTriggerProps) {
  return (
    <motion.button
      type="button"
      data-no-click-advance
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      whileHover={
        reducedMotion ? undefined : { scale: 1.03, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } }
      }
      whileTap={reducedMotion ? undefined : { scale: 0.97 }}
      className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border px-6 py-3 text-[0.95rem] font-semibold tracking-wide text-white"
      style={{
        borderColor: `${accentColor}77`,
        background: `linear-gradient(135deg, ${accentColor}26 0%, ${accentColor}0d 100%)`,
        boxShadow: `0 0 0 1px ${accentColor}33, 0 12px 32px -10px ${accentColor}60, inset 0 1px 0 rgba(255,255,255,0.08)`,
      }}
    >
      <motion.span
        aria-hidden
        className="relative h-2.5 w-2.5 rounded-full"
        style={{ background: accentColor, boxShadow: `0 0 14px ${accentColor}` }}
        animate={
          reducedMotion
            ? undefined
            : { scale: [0.9, 1.2, 0.9], opacity: [0.7, 1, 0.7] }
        }
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <span>{label}</span>
      <motion.span
        aria-hidden
        className="text-lg leading-none"
        style={{ color: accentColor }}
        animate={reducedMotion ? undefined : { x: [0, 3, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        →
      </motion.span>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${accentColor}33, transparent 70%)`,
        }}
      />
    </motion.button>
  );
}

interface PainPointsBalloonProps {
  title: string;
  headline?: string;
  bullets: string[];
  accentColor: string;
  reducedMotion: boolean;
  onClose: () => void;
}

function PainPointsBalloon({
  title,
  headline,
  bullets,
  accentColor,
  reducedMotion,
  onClose,
}: PainPointsBalloonProps) {
  const list = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: reducedMotion ? 0 : 0.18,
        staggerChildren: reducedMotion ? 0 : 0.06,
      },
    },
  };
  const tile = {
    hidden: reducedMotion ? {} : { opacity: 0, y: 14, scale: 0.94, filter: 'blur(6px)' },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <motion.div
      data-no-click-advance
      className="fixed inset-0 z-[80] flex items-center justify-center p-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        aria-hidden
        className="absolute inset-0 cursor-pointer"
        onClick={onClose}
        initial={{ backdropFilter: 'blur(0px)' }}
        animate={{ backdropFilter: 'blur(14px)' }}
        exit={{ backdropFilter: 'blur(0px)' }}
        transition={{ duration: 0.4 }}
        style={{ background: 'rgba(4, 6, 12, 0.72)' }}
      />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.86, y: 16, filter: 'blur(10px)' }}
        animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
        exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: 8, filter: 'blur(8px)' }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-[820px] overflow-hidden rounded-[28px] border bg-[#0b0f18]/95 p-10 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.8)]"
        style={{
          borderColor: `${accentColor}55`,
          boxShadow: `0 0 0 1px ${accentColor}22, 0 50px 140px -20px ${accentColor}30, inset 0 1px 0 rgba(255,255,255,0.06)`,
        }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-10 -top-px h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
          }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at top, ${accentColor}1a, transparent 60%)`,
          }}
        />

        <div className="relative flex items-start justify-between gap-4">
          <div>
            <span
              className="block text-[10px] font-semibold uppercase tracking-[0.36em]"
              style={{ color: accentColor, opacity: 0.85 }}
            >
              {title}
            </span>
            {headline && (
              <h3 className="mt-3 max-w-[28ch] text-[clamp(1.35rem,2.6vw,1.8rem)] font-bold leading-tight text-white">
                {headline}
              </h3>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-white/70 transition-colors duration-200 hover:border-white/30 hover:bg-white/[0.08] hover:text-white"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M1 1L13 13M13 1L1 13"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <motion.ul
          variants={list}
          initial="hidden"
          animate="visible"
          className="relative mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2"
        >
          {bullets.map((text, i) => (
            <motion.li key={text} variants={tile}>
              <div
                className="relative flex items-start gap-3 overflow-hidden rounded-2xl border px-5 py-4"
                style={{
                  borderColor: `${accentColor}33`,
                  background: `linear-gradient(135deg, ${accentColor}14 0%, rgba(255,255,255,0.025) 100%)`,
                  boxShadow: `inset 0 1px 0 rgba(255,255,255,0.05)`,
                }}
              >
                <span
                  aria-hidden
                  className="mt-0.5 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                  style={{
                    background: `${accentColor}26`,
                    color: accentColor,
                    border: `1px solid ${accentColor}55`,
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-[0.98rem] font-medium leading-snug text-slate-50">
                  {text}
                </span>
              </div>
            </motion.li>
          ))}
        </motion.ul>

        <p className="relative mt-7 text-center text-[11px] uppercase tracking-[0.32em] text-white/35">
          Toque fora ou pressione ESC para fechar
        </p>
      </motion.div>
    </motion.div>,
    document.body,
  );
}

interface PainPointChipsProps {
  bullets: string[];
  accentColor: string;
  active: boolean;
  reducedMotion: boolean;
}

function PainPointChips({ bullets, accentColor, active, reducedMotion }: PainPointChipsProps) {
  const container = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: reducedMotion ? 0 : 0.12,
        staggerChildren: reducedMotion ? 0 : 0.07,
      },
    },
  };

  const chip = {
    hidden: reducedMotion ? {} : { opacity: 0, y: 10, scale: 0.96, filter: 'blur(4px)' },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <motion.ul
      variants={container}
      initial={reducedMotion ? false : 'hidden'}
      animate={active ? 'visible' : 'hidden'}
      className="grid grid-cols-1 gap-2.5 sm:grid-cols-2"
    >
      {bullets.map((text, i) => (
        <motion.li key={text} variants={chip}>
          <motion.div
            whileHover={
              reducedMotion
                ? undefined
                : { y: -2, scale: 1.015, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } }
            }
            className="group relative flex items-center gap-3 overflow-hidden rounded-2xl border px-4 py-3"
            style={{
              borderColor: `${accentColor}33`,
              background: `linear-gradient(135deg, ${accentColor}10 0%, rgba(255,255,255,0.02) 100%)`,
              boxShadow: `inset 0 1px 0 rgba(255,255,255,0.04)`,
            }}
          >
            <motion.span
              aria-hidden
              className="relative h-2 w-2 flex-shrink-0 rounded-full"
              style={{ background: accentColor, boxShadow: `0 0 10px ${accentColor}` }}
              animate={
                reducedMotion
                  ? undefined
                  : {
                      opacity: [0.55, 1, 0.55],
                      scale: [0.85, 1.1, 0.85],
                    }
              }
              transition={{
                duration: 2.6,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.18,
              }}
            />
            <span className="flex-1 text-[0.92rem] font-medium leading-snug text-slate-100">
              {text}
            </span>
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 w-12 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background: `linear-gradient(270deg, ${accentColor}22, transparent)`,
              }}
            />
          </motion.div>
        </motion.li>
      ))}
    </motion.ul>
  );
}
