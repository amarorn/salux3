import { useContext } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { FloatingCard, FloatingCardContext } from '../FloatingCard';
import type { ContrastItem, PresentationStep } from '@/domain/types';
import { theme } from '@/domain/theme';
import { getCardTextVariants } from './cardTextMotion';

interface Props {
  step: PresentationStep;
  active: boolean;
}

function toneColors(tone: ContrastItem['tone']) {
  if (tone === 'cool') return theme.accents.cyan;
  return theme.accents.rose;
}

function ContrastColumn({
  item,
  active,
  reduce,
  delay,
}: {
  item: ContrastItem;
  active: boolean;
  reduce: boolean;
  delay: number;
}) {
  const c = toneColors(item.tone);
  return (
    <motion.div
      className="relative flex-1 overflow-hidden rounded-xl border px-4 py-3.5"
      style={{
        borderColor: `${c.base}44`,
        background: `linear-gradient(135deg, ${c.base}1a 0%, rgba(255,255,255,0.02) 70%)`,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.06)`,
      }}
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={active ? { opacity: 1, y: 0 } : reduce ? undefined : { opacity: 0, y: 8 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-3 -top-px h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${c.base}, transparent)` }}
      />
      <div className="mb-1.5 flex items-center gap-2">
        {item.icon && (
          <span aria-hidden className="text-[13px]" style={{ filter: `drop-shadow(0 0 8px ${c.base}55)` }}>
            {item.icon}
          </span>
        )}
        <span
          className="text-[10px] font-semibold uppercase tracking-[0.32em]"
          style={{ color: c.base }}
        >
          {item.label}
        </span>
      </div>
      <p className="text-[0.92rem] leading-snug text-white/85 whitespace-pre-line">{item.text}</p>
    </motion.div>
  );
}

export function CoverStep({ step, active }: Props) {
  const reduceMotion = useReducedMotion();
  const flipPhoto = useContext(FloatingCardContext)?.flipPhoto ?? false;
  const { container, item } = getCardTextVariants(Boolean(reduceMotion), step.index, flipPhoto);
  const hero = step.content.heroImage;
  const accent = theme.accents[step.accent];
  const contrast = step.content.contrastPair;
  const attention = step.content.attentionPhrase;
  const cta = step.content.closingQuestion;
  const ctaLabel = step.content.closingQuestionLabel;

  const enriched = Boolean(contrast || attention || cta);

  return (
    <FloatingCard
      accent={step.accent}
      active={active}
      width={enriched ? 640 : 580}
      stepId={step.id}
      sidePhotoSrc={hero?.src}
      sidePhotoAlt={hero?.alt}
      cardVisual={step.content.cardVisual}
    >
      <motion.div
        className="flex flex-col items-start gap-5"
        variants={container}
        initial={reduceMotion ? false : 'hidden'}
        animate={active ? 'visible' : 'hidden'}
      >
        <motion.h1
          variants={item}
          className="presentation-ppt-title max-w-[22ch] text-[clamp(1.7rem,4.4vw,2.45rem)] whitespace-pre-line"
        >
          {step.title}
        </motion.h1>

        {contrast && (
          <motion.div variants={item} className="flex w-full gap-3">
            <ContrastColumn item={contrast.left} active={active} reduce={Boolean(reduceMotion)} delay={0.55} />
            <ContrastColumn item={contrast.right} active={active} reduce={Boolean(reduceMotion)} delay={0.7} />
          </motion.div>
        )}

        {step.content.body && (
          <motion.p variants={item} className="presentation-ppt-body max-w-prose whitespace-pre-line">
            {step.content.body}
          </motion.p>
        )}

        {attention && (
          <motion.div
            variants={item}
            className="relative w-full overflow-hidden rounded-2xl border px-5 py-4"
            style={{
              borderColor: `${accent.base}55`,
              background: `linear-gradient(135deg, ${accent.base}1f 0%, transparent 65%)`,
            }}
          >
            <span
              aria-hidden
              className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full"
              style={{ background: accent.base, boxShadow: `0 0 14px ${accent.base}` }}
            />
            <motion.span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-2xl"
              style={{ boxShadow: `0 0 0 1px ${accent.base}33, 0 0 36px ${accent.base}44` }}
              animate={
                active && !reduceMotion ? { opacity: [0.5, 1, 0.5] } : { opacity: 0.5 }
              }
              transition={{ duration: 2.8, ease: 'easeInOut', repeat: Infinity }}
            />
            <p
              className="relative pl-3 text-[clamp(0.98rem,2.2vw,1.15rem)] font-medium italic leading-snug"
              style={{ color: accent.base, textShadow: `0 0 24px ${accent.base}33` }}
            >
              “{attention}”
            </p>
          </motion.div>
        )}

        {cta && (
          <motion.div
            variants={item}
            className="relative w-full overflow-hidden rounded-2xl border px-5 py-4"
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
            {ctaLabel && (
              <span
                className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.32em]"
                style={{ color: accent.base, opacity: 0.9 }}
              >
                ▸ {ctaLabel}
              </span>
            )}
            <p
              className="text-[1.05rem] font-semibold leading-snug text-white"
              style={{ textShadow: `0 0 24px ${accent.base}25` }}
            >
              {cta}
            </p>
          </motion.div>
        )}
      </motion.div>
    </FloatingCard>
  );
}
