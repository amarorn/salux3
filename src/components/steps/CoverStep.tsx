import { useContext } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { FloatingCard, FloatingCardContext } from '../FloatingCard';
import type { PresentationStep } from '@/domain/types';
import { getCardTextVariants } from './cardTextMotion';

interface Props {
  step: PresentationStep;
  active: boolean;
}

export function CoverStep({ step, active }: Props) {
  const reduceMotion = useReducedMotion();
  const flipPhoto = useContext(FloatingCardContext)?.flipPhoto ?? false;
  const { container, item } = getCardTextVariants(Boolean(reduceMotion), step.index, flipPhoto);
  const hero = step.content.heroImage;

  return (
    <FloatingCard
      accent={step.accent}
      active={active}
      width={580}
      stepId={step.id}
      sidePhotoSrc={hero?.src}
      sidePhotoAlt={hero?.alt}
    >
      <motion.div
        className="flex flex-col items-start gap-6"
        variants={container}
        initial={reduceMotion ? false : 'hidden'}
        animate={active ? 'visible' : 'hidden'}
      >
        <motion.h1
          variants={item}
          className="presentation-ppt-title max-w-[18ch] text-[clamp(2rem,5vw,2.75rem)] whitespace-pre-line"
        >
          {step.title}
        </motion.h1>

        <motion.p variants={item} className="presentation-ppt-body max-w-prose whitespace-pre-line">
          {step.content.body}
        </motion.p>
      </motion.div>
    </FloatingCard>
  );
}
