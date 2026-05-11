import { useContext } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { FloatingCard, FloatingCardContext } from '../FloatingCard';
import type { PresentationStep } from '@/domain/types';
import { theme } from '@/domain/theme';
import { getCardTextVariants } from './cardTextMotion';

interface Props {
  step: PresentationStep;
  active: boolean;
}

/**
 * Step de transição com dois momentos de leitura:
 *   1) Frase de entrada com fade-in escalonado palavra a palavra (destaque).
 *   2) Frase de atenção em destaque maior, com glow pulsando e scale-in.
 */
export function HighlightStep({ step, active }: Props) {
  const accent = theme.accents[step.accent];
  const reduceMotion = useReducedMotion();
  const flipPhoto = useContext(FloatingCardContext)?.flipPhoto ?? false;
  const { container, item } = getCardTextVariants(Boolean(reduceMotion), step.index, flipPhoto);

  const intro = step.content.body ?? '';
  const attention = step.content.attentionPhrase;
  const introWords = intro.split(/\s+/).filter(Boolean);

  return (
    <FloatingCard
      accent={step.accent}
      active={active}
      stepId={step.id}
      width={640}
      badge={step.content.headline ?? String(step.index + 1).padStart(2, '0')}
    >
      <motion.div
        className="flex flex-col gap-7"
        variants={container}
        initial={reduceMotion ? false : 'hidden'}
        animate={active ? 'visible' : 'hidden'}
      >
        <motion.div variants={item}>
          <h2 className="presentation-ppt-title max-w-[24ch] text-[clamp(1.35rem,3.2vw,1.85rem)]">
            {step.title}
          </h2>
        </motion.div>

        {intro && (
          <motion.p
            variants={item}
            className="presentation-ppt-body relative leading-relaxed"
            style={{
              textShadow: active ? `0 0 24px ${accent.base}33` : undefined,
            }}
          >
            {reduceMotion
              ? intro
              : introWords.map((word, i) => (
                  <motion.span
                    key={`${word}-${i}`}
                    className="inline-block"
                    initial={{ opacity: 0, y: 6, filter: 'blur(4px)' }}
                    animate={
                      active
                        ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                        : { opacity: 0, y: 6, filter: 'blur(4px)' }
                    }
                    transition={{
                      duration: 0.45,
                      ease: [0.22, 1, 0.36, 1],
                      delay: 0.85 + i * 0.045,
                    }}
                  >
                    {word}
                    {i < introWords.length - 1 && <span>&nbsp;</span>}
                  </motion.span>
                ))}
          </motion.p>
        )}

        {attention && (
          <motion.div
            variants={item}
            className="relative mt-2 overflow-hidden rounded-2xl border px-6 py-5"
            style={{
              borderColor: `${accent.base}55`,
              background: `linear-gradient(135deg, ${accent.base}1f 0%, transparent 60%)`,
            }}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
            animate={
              active
                ? { opacity: 1, scale: 1 }
                : reduceMotion
                  ? undefined
                  : { opacity: 0, scale: 0.94 }
            }
            transition={{
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.85 + introWords.length * 0.045 + 0.35,
            }}
          >
            <motion.span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-2xl"
              style={{
                boxShadow: `0 0 0 1px ${accent.base}33, 0 0 48px ${accent.base}55`,
              }}
              animate={
                active && !reduceMotion
                  ? { opacity: [0.55, 1, 0.55] }
                  : { opacity: 0.55 }
              }
              transition={{ duration: 2.6, ease: 'easeInOut', repeat: Infinity }}
            />
            <p
              className="presentation-ppt-body relative text-[clamp(1.05rem,2.6vw,1.35rem)] font-semibold"
              style={{ color: accent.base }}
            >
              {attention}
            </p>
          </motion.div>
        )}
      </motion.div>
    </FloatingCard>
  );
}
