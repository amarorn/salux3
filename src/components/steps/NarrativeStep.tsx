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

  return (
    <FloatingCard
      accent={step.accent}
      active={active}
      stepId={step.id}
      badge={step.content.headline ?? String(step.index + 1).padStart(2, '0')}
    >
      <motion.div
        className="flex flex-col gap-5"
        variants={container}
        initial={reduceMotion ? false : 'hidden'}
        animate={active ? 'visible' : 'hidden'}
      >
        <motion.div variants={item}>
          <h2 className="presentation-ppt-title max-w-[24ch] text-[clamp(1.35rem,3.2vw,1.85rem)]">
            {step.title}
          </h2>
        </motion.div>

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

        {step.content.body && (
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

        {step.content.bullets &&
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

        {step.content.visual?.type === 'risk-curve' && (
          <motion.div variants={item}>
            <AnimatedRiskCurve active={active} />
          </motion.div>
        )}
      </motion.div>
    </FloatingCard>
  );
}
