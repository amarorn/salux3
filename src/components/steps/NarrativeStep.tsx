import { useContext } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
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

        {painPoints && step.content.bullets && step.content.bullets.length > 0 && (
          <PainPointChips
            bullets={step.content.bullets}
            accentColor={accent.base}
            active={active}
            reducedMotion={Boolean(reduceMotion)}
          />
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

        {step.content.visual?.type === 'risk-curve' && (
          <motion.div variants={item}>
            <AnimatedRiskCurve active={active} />
          </motion.div>
        )}
      </motion.div>
    </FloatingCard>
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
