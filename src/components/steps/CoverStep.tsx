import { useContext, useLayoutEffect, useMemo } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { FloatingCard, FloatingCardContext } from '../FloatingCard';
import type { ContrastItem, PresentationStep } from '@/domain/types';
import { theme } from '@/domain/theme';
import { getCardTextVariants } from './cardTextMotion';
import { usePresentationStore } from '@/store/presentationStore';
import { EraRevealBand } from '@/components/motion/EraAgenticaReveal';
import { buildCoverBandKeys } from '@/lib/eraAgenticaRevealBands';

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
      <p className="text-[0.96rem] leading-snug text-white/92 whitespace-pre-line">{item.text}</p>
    </motion.div>
  );
}

export function CoverStep({ step, active }: Props) {
  const reduceMotion = useReducedMotion();
  const flipPhoto = useContext(FloatingCardContext)?.flipPhoto ?? false;
  const { container, item } = getCardTextVariants(
    Boolean(reduceMotion),
    step.index,
    `${step.id}:${step.title}`,
    flipPhoto,
  );
  const hero = step.content.heroImage;
  const accent = theme.accents[step.accent];
  const contrast = step.content.contrastPair;
  const attention = step.content.attentionPhrase;
  const enriched = Boolean(contrast || attention);
  const trackId = useContext(FloatingCardContext)?.trackId;
  const eraStaging = trackId === 'era-agentica';
  const bandKeys = useMemo(() => buildCoverBandKeys(step.content), [step.content]);
  const b = (id: string) => bandKeys.indexOf(id);
  const setEraCfg = usePresentationStore((s) => s.setEraStagedRevealConfig);
  const clearEra = usePresentationStore((s) => s.clearEraStagedReveal);
  const stagingLayout = Boolean(active && eraStaging && !reduceMotion);
  const innerMotion = stagingLayout ? {} : { variants: item };
  const outerContainer: Variants = stagingLayout ? { hidden: {}, visible: {} } : container;

  useLayoutEffect(() => {
    if (!active || !eraStaging) return;
    if (reduceMotion) {
      setEraCfg(step.id, 1);
      return () => {
        if (usePresentationStore.getState().eraStagedRevealStepId === step.id) clearEra();
      };
    }
    setEraCfg(step.id, bandKeys.length);
    return () => {
      if (usePresentationStore.getState().eraStagedRevealStepId === step.id) clearEra();
    };
  }, [active, eraStaging, reduceMotion, step.id, bandKeys.length, setEraCfg, clearEra]);

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
        variants={outerContainer}
        initial={reduceMotion ? false : 'hidden'}
        animate={active ? 'visible' : 'hidden'}
      >
        <EraRevealBand
          bandId="title"
          bandIndex={b('title')}
          stepId={step.id}
          stepIndex={step.index}
          eraStaging={eraStaging}
          active={active}
        >
          <motion.h1
            {...innerMotion}
            className="presentation-ppt-title max-w-[22ch] text-[clamp(2.2rem,5.5vw,3.15rem)] whitespace-pre-line"
          >
            {step.title}
          </motion.h1>
        </EraRevealBand>

        {step.content.lead && (
          <EraRevealBand
            bandId="lead"
            bandIndex={b('lead')}
            stepId={step.id}
            stepIndex={step.index}
            eraStaging={eraStaging}
            active={active}
          >
            <motion.p
              {...innerMotion}
              className="presentation-ppt-body max-w-prose whitespace-pre-line text-slate-100/95"
            >
              {step.content.lead}
            </motion.p>
          </EraRevealBand>
        )}

        {contrast && (
          <EraRevealBand
            bandId="contrastPair"
            bandIndex={b('contrastPair')}
            stepId={step.id}
            stepIndex={step.index}
            eraStaging={eraStaging}
            active={active}
          >
            <motion.div {...innerMotion} className="flex w-full gap-3">
              <ContrastColumn item={contrast.left} active={active} reduce={Boolean(reduceMotion)} delay={0.55} />
              <ContrastColumn item={contrast.right} active={active} reduce={Boolean(reduceMotion)} delay={0.7} />
            </motion.div>
          </EraRevealBand>
        )}

        {step.content.body && (
          <EraRevealBand
            bandId="body"
            bandIndex={b('body')}
            stepId={step.id}
            stepIndex={step.index}
            eraStaging={eraStaging}
            active={active}
          >
            <motion.p {...innerMotion} className="presentation-ppt-body max-w-prose whitespace-pre-line">
              {step.content.body}
            </motion.p>
          </EraRevealBand>
        )}

        {attention && (
          <EraRevealBand
            bandId="attention"
            bandIndex={b('attention')}
            stepId={step.id}
            stepIndex={step.index}
            eraStaging={eraStaging}
            active={active}
          >
            <motion.div
              {...innerMotion}
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
              className="relative pl-3 text-[clamp(1.12rem,2.5vw,1.34rem)] font-medium italic leading-relaxed"
              style={{ color: accent.base, textShadow: `0 0 24px ${accent.base}33` }}
            >
              “{attention}”
            </p>
          </motion.div>
          </EraRevealBand>
        )}

      </motion.div>
    </FloatingCard>
  );
}
