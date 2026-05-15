import { useContext } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Cable } from 'lucide-react';
import { FloatingCard, FloatingCardContext } from '../FloatingCard';
import type { PresentationStep } from '@/domain/types';
import { theme } from '@/domain/theme';
import { getCardTextVariants } from './cardTextMotion';

interface Props {
  step: PresentationStep;
  active: boolean;
}

const SYSTEMS = [
  'TASY',
  'MV',
  'Soul MV',
  'Pixeon',
  'Philips',
  'Cerner',
  'FHIR',
  'HL7 v2',
  'DICOM',
  'SUS',
  'CID-11',
  'SNOMED',
];

export function IntegrationStep({ step, active }: Props) {
  const accent = theme.accents[step.accent];
  const reduceMotion = useReducedMotion();
  const flipPhoto = useContext(FloatingCardContext)?.flipPhoto ?? false;
  const { container, item } = getCardTextVariants(
    Boolean(reduceMotion),
    step.index,
    `${step.id}:${step.title}`,
    flipPhoto,
  );
  const minimal = Boolean(step.content.integrationMinimal);

  return (
    <FloatingCard
      accent={step.accent}
      active={active}
      stepId={step.id}
      badge={step.content.headline ?? String(step.index + 1).padStart(2, '0')}
      width={minimal ? 680 : 620}
    >
      <motion.div
        className="flex flex-col gap-6"
        variants={container}
        initial={reduceMotion ? false : 'hidden'}
        animate={active ? 'visible' : 'hidden'}
      >
        <motion.div variants={item}>
          <h2 className="font-display text-[28px] font-bold leading-[1.15] tracking-tight text-white">
            {step.title}
          </h2>
        </motion.div>

        {step.content.body && (
          <motion.p variants={item} className="text-sm leading-relaxed text-slate-200 whitespace-pre-line">
            {step.content.body}
          </motion.p>
        )}

        {!minimal && (
        <motion.div variants={item} className="relative rounded-2xl border border-cyan-400/20 bg-white/[0.025] p-5">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/25 bg-white/5 shadow-soft">
              <Cable className="h-6 w-6 text-cyan-300" strokeWidth={1.7} />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {SYSTEMS.map((sys, i) => (
              <motion.div
                key={sys}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-xl border border-white/10 bg-white/5 px-2 py-2 text-center text-[11px] font-medium text-slate-200 shadow-soft"
              >
                {sys}
              </motion.div>
            ))}
          </div>
        </motion.div>
        )}

        {step.content.bullets && (
          <motion.ul
            variants={item}
            className={minimal ? 'mt-1 space-y-3' : 'mt-1 space-y-2'}
          >
            {step.content.bullets.map((bullet) => (
              <li
                key={bullet}
                className={
                  minimal
                    ? 'flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 text-sm text-slate-200'
                    : 'flex items-start gap-3 text-sm text-slate-200'
                }
              >
                <span
                  className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full"
                  style={{ background: accent.base, boxShadow: `0 0 8px ${accent.base}88` }}
                />
                <span className="whitespace-pre-line leading-snug">{bullet}</span>
              </li>
            ))}
          </motion.ul>
        )}
      </motion.div>
    </FloatingCard>
  );
}
