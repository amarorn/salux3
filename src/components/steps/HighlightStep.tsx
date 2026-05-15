import { useContext } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { FloatingCard, FloatingCardContext } from '../FloatingCard';
import type { PresentationStep } from '@/domain/types';
import { theme } from '@/domain/theme';
import { getCardTextVariants } from './cardTextMotion';
import { ClosingHighlight, EvidenceCardBlock } from './HighlightBlocks';

interface Props {
  step: PresentationStep;
  active: boolean;
}

/** Visual "camadas acumuladas → base coordenada": pilha desalinhada que se alinha sobre uma base luminosa. */
function LayersToBase({
  color,
  reduce,
  active,
}: {
  color: string;
  reduce: boolean;
  active: boolean;
}) {
  const layers = [0, 1, 2, 3, 4];
  return (
    <div
      aria-hidden
      className="relative overflow-hidden rounded-xl border px-5 py-4"
      style={{
        borderColor: `${color}33`,
        background: `linear-gradient(135deg, ${color}10 0%, rgba(255,255,255,0.02) 100%)`,
      }}
    >
      <div className="flex items-end justify-between gap-3">
        <span className="text-[10px] uppercase tracking-[0.28em] text-white/45">
          Camadas acumuladas
        </span>
        <span className="text-[10px] uppercase tracking-[0.28em]" style={{ color }}>
          Base coordenada
        </span>
      </div>
      <div className="relative mt-3 h-12">
        {layers.map((i) => (
          <motion.span
            key={i}
            className="absolute left-0 right-0 rounded-md"
            style={{
              height: 4,
              background: `linear-gradient(90deg, rgba(255,255,255,0.18), ${color}55)`,
              boxShadow: `inset 0 0 0 1px ${color}22`,
            }}
            initial={
              reduce
                ? false
                : { top: i * 6, x: i % 2 === 0 ? -8 : 8, opacity: 0.5, scaleX: 0.9 }
            }
            animate={
              active
                ? { top: 18, x: 0, opacity: 1, scaleX: 1 }
                : reduce
                  ? undefined
                  : { top: i * 6, x: i % 2 === 0 ? -8 : 8, opacity: 0.5, scaleX: 0.9 }
            }
            transition={{
              duration: 0.85,
              delay: 0.4 + i * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        ))}
        <motion.span
          className="absolute inset-x-0 bottom-0 h-[3px] rounded-full"
          style={{ background: color, boxShadow: `0 0 16px ${color}` }}
          initial={reduce ? false : { scaleX: 0.3, opacity: 0 }}
          animate={
            active
              ? { scaleX: 1, opacity: 1 }
              : reduce
                ? undefined
                : { scaleX: 0.3, opacity: 0 }
          }
          transition={{ duration: 0.6, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
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
  const { container, item } = getCardTextVariants(
    Boolean(reduceMotion),
    step.index,
    `${step.id}:${step.title}`,
    flipPhoto,
  );

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

        {step.content.layersToBase && (
          <motion.div variants={item}>
            <LayersToBase color={accent.base} reduce={Boolean(reduceMotion)} active={active} />
          </motion.div>
        )}

        {step.content.evidenceCard && (
          <motion.div variants={item}>
            <EvidenceCardBlock
              card={step.content.evidenceCard}
              active={active}
              accentColor={accent.base}
            />
          </motion.div>
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

        {step.content.closingHighlight && (
          <motion.div variants={item}>
            <ClosingHighlight text={step.content.closingHighlight} active={active} />
          </motion.div>
        )}
      </motion.div>
    </FloatingCard>
  );
}
