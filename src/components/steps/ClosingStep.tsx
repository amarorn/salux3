import { useContext } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Orbit } from 'lucide-react';
import { FloatingCard, FloatingCardContext } from '../FloatingCard';
import type { PresentationStep } from '@/domain/types';
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

  return (
    <FloatingCard accent={step.accent} active={active} stepId={step.id} width={580}>
      <motion.div
        className="flex flex-col gap-6"
        variants={container}
        initial={reduceMotion ? false : 'hidden'}
        animate={active ? 'visible' : 'hidden'}
      >
        <motion.span
          variants={item}
          className="inline-flex items-center gap-2 self-start rounded-full border border-violet-400/30 bg-violet-500/15 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-violet-300"
        >
          Encerramento
        </motion.span>

        <motion.h2
          variants={item}
          className="presentation-ppt-title max-w-[22ch] text-[clamp(1.5rem,3.8vw,2.35rem)] whitespace-pre-line"
        >
          {step.content.headline}
        </motion.h2>

        <motion.p variants={item} className="text-base leading-relaxed text-slate-200 whitespace-pre-line">
          {step.content.body}
        </motion.p>

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
      </motion.div>
    </FloatingCard>
  );
}
