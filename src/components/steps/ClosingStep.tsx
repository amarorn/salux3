import { useContext } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Orbit } from 'lucide-react';
import { FloatingCard, FloatingCardContext } from '../FloatingCard';
import type { PresentationStep } from '@/domain/types';
import { theme } from '@/domain/theme';
import { getCardTextVariants } from './cardTextMotion';
import { HighlightPhraseList } from './HighlightBlocks';
import { usePresentationStore } from '@/store/presentationStore';
import { resolveContactFormUrl } from '@/config/contact';

interface Props {
  step: PresentationStep;
  active: boolean;
}

export function ClosingStep({ step, active }: Props) {
  const reduceMotion = useReducedMotion();
  const flipPhoto = useContext(FloatingCardContext)?.flipPhoto ?? false;
  const { container, item } = getCardTextVariants(Boolean(reduceMotion), step.index, flipPhoto);
  const returnToTrackSelection = usePresentationStore((s) => s.returnToTrackSelection);
  const metaContact = step.content.meta?.Contato;
  const formUrl = resolveContactFormUrl(typeof metaContact === 'string' ? metaContact : undefined);

  const accent = theme.accents[step.accent];
  const benefits = step.content.valueStages ?? [];

  return (
    <FloatingCard
      accent={step.accent}
      active={active}
      stepId={step.id}
      width={benefits.length >= 4 ? 820 : 580}
      cardVisual={step.content.cardVisual}
    >
      <motion.div
        className="flex flex-col gap-6"
        variants={container}
        initial={reduceMotion ? false : 'hidden'}
        animate={active ? 'visible' : 'hidden'}
      >
        <motion.span
          variants={item}
          className="inline-flex items-center gap-2 self-start rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em]"
          style={{
            borderColor: `${accent.base}55`,
            background: `${accent.base}1f`,
            color: accent.base,
          }}
        >
          Encerramento
        </motion.span>

        <motion.h2
          variants={item}
          className="presentation-ppt-title max-w-[22ch] text-[clamp(1.5rem,3.8vw,2.35rem)] whitespace-pre-line"
        >
          {step.content.headline}
        </motion.h2>

        {step.content.body && (
          <motion.p variants={item} className="text-base leading-relaxed text-slate-200 whitespace-pre-line">
            {step.content.body}
          </motion.p>
        )}

        {benefits.length > 0 && (
          <motion.div
            variants={item}
            className="grid gap-2.5"
            style={{
              gridTemplateColumns: `repeat(${step.content.valueStagesGridCols ?? Math.min(benefits.length, 3)}, minmax(0, 1fr))`,
            }}
          >
            {benefits.map((b, i) => (
              <motion.div
                key={`${b.label}-${i}`}
                className="relative overflow-hidden rounded-xl border px-3.5 py-3"
                style={{
                  borderColor: `${accent.base}55`,
                  background: `linear-gradient(135deg, ${accent.base}1c 0%, rgba(255,255,255,0.02) 70%)`,
                  boxShadow: `inset 0 1px 0 rgba(255,255,255,0.05)`,
                }}
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                animate={
                  active ? { opacity: 1, y: 0 } : reduceMotion ? undefined : { opacity: 0, y: 10 }
                }
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.4 + i * 0.08 }}
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-3 -top-px h-px"
                  style={{ background: `linear-gradient(90deg, transparent, ${accent.base}, transparent)` }}
                />
                <div className="flex items-start gap-2.5">
                  <span
                    aria-hidden
                    className="mt-0.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md text-[12px] font-bold"
                    style={{
                      background: accent.base,
                      color: '#0b0f1a',
                      boxShadow: `0 0 14px ${accent.base}66`,
                    }}
                  >
                    {b.number || '✓'}
                  </span>
                  <p className="text-[0.88rem] font-medium leading-snug text-white/95">
                    {b.label}
                    {b.description && (
                      <span className="block text-[0.82rem] font-normal text-slate-300/85">
                        {b.description}
                      </span>
                    )}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {step.content.attentionPhrase && (
          <motion.div
            variants={item}
            className="relative overflow-hidden rounded-2xl border px-5 py-4"
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
            <p
              className="relative pl-3 text-[clamp(0.98rem,2.2vw,1.15rem)] font-medium italic leading-snug"
              style={{ color: accent.base, textShadow: `0 0 24px ${accent.base}33` }}
            >
              “{step.content.attentionPhrase}”
            </p>
          </motion.div>
        )}

        {step.content.closingQuestion && (
          <motion.div
            variants={item}
            className="relative overflow-hidden rounded-2xl border px-5 py-4"
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
            {step.content.closingQuestionLabel && (
              <span
                className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.32em]"
                style={{ color: accent.base, opacity: 0.9 }}
              >
                ▸ {step.content.closingQuestionLabel}
              </span>
            )}
            <p
              className="text-[1.05rem] font-semibold leading-snug text-white"
              style={{ textShadow: `0 0 24px ${accent.base}25` }}
            >
              {step.content.closingQuestion}
            </p>
          </motion.div>
        )}

        {step.content.highlightPhrases && step.content.highlightPhrases.length > 0 && (
          <motion.div variants={item}>
            <HighlightPhraseList items={step.content.highlightPhrases} active={active} />
          </motion.div>
        )}

        <motion.div
          variants={item}
          data-no-click-advance
          className="mt-2 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4"
        >
          <button
            type="button"
            data-no-click-advance
            onClick={(e) => {
              e.stopPropagation();
              returnToTrackSelection();
            }}
            className="pointer-events-auto inline-flex items-center justify-center gap-2 rounded-full border border-white/16 bg-white/[0.04] px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/90 shadow-[0_12px_40px_-20px_rgba(0,0,0,0.75)] transition-[border-color,background-color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-white/32 hover:bg-white/[0.09] active:scale-[0.99]"
          >
            <Orbit className="h-4 w-4 opacity-80" strokeWidth={2} aria-hidden />
            Escolher outra trilha
          </button>
          <a
            data-no-click-advance
            href={formUrl}
            {...(formUrl.startsWith('http') || formUrl.startsWith('mailto:')
              ? { target: '_blank', rel: 'noopener noreferrer' }
              : {})}
            onClick={(e) => e.stopPropagation()}
            className="pointer-events-auto inline-flex items-center justify-center gap-2 rounded-full border border-violet-400/35 bg-violet-500/10 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-violet-200 shadow-[0_18px_48px_-22px_rgba(124,58,237,0.55)] transition-[border-color,background-color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-violet-400/55 hover:bg-violet-500/18"
          >
            Ir para o formulário
            <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden />
          </a>
        </motion.div>

        {step.content.closingHighlight && (
          <motion.p
            variants={item}
            className="mt-1 text-center text-[0.85rem] leading-snug text-slate-300/80"
          >
            {step.content.closingHighlight}
          </motion.p>
        )}
      </motion.div>
    </FloatingCard>
  );
}
