import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import { usePresentationNavigation } from '@/hooks/usePresentationNavigation';

/**
 * Setas laterais de navegação (prev/next) + pílula com posição atual.
 * Sempre visíveis durante a apresentação; respeitam `data-no-click-advance`
 * para não disparar o avanço global por clique.
 */
export function PresentationNavArrows() {
  const { prev, next, indicators, isOverview } = usePresentationNavigation();

  if (isOverview) return null;

  return (
    <>
      <ArrowButton
        side="left"
        disabled={indicators.isFirst}
        onClick={prev}
        ariaLabel="Slide anterior"
      >
        <ChevronLeft className="h-6 w-6" strokeWidth={2.2} />
      </ArrowButton>

      <ArrowButton
        side="right"
        disabled={indicators.isLast}
        onClick={next}
        ariaLabel="Próximo slide"
      >
        <ChevronRight className="h-6 w-6" strokeWidth={2.2} />
      </ArrowButton>

      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        data-no-click-advance
        className="pointer-events-none absolute right-6 top-6 z-30"
      >
        <span className="pointer-events-auto rounded-full border border-white/15 bg-white/[0.05] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/70 backdrop-blur-md">
          {indicators.position}
        </span>
      </motion.div>
    </>
  );
}

interface ArrowButtonProps {
  side: 'left' | 'right';
  onClick: () => void;
  disabled?: boolean;
  ariaLabel: string;
  children: React.ReactNode;
}

function ArrowButton({ side, onClick, disabled, ariaLabel, children }: ArrowButtonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: side === 'left' ? -16 : 16 }}
      animate={{ opacity: disabled ? 0.3 : 1, x: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      data-no-click-advance
      className={clsx(
        'pointer-events-none absolute top-1/2 z-30 -translate-y-1/2',
        side === 'left' ? 'left-3 sm:left-5' : 'right-3 sm:right-5',
      )}
    >
      <button
        type="button"
        data-no-click-advance
        disabled={disabled}
        aria-label={ariaLabel}
        onClick={(e) => {
          e.stopPropagation();
          if (!disabled) onClick();
        }}
        className={clsx(
          'pointer-events-auto group inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/14 bg-black/35 text-white/85 shadow-[0_18px_44px_-20px_rgba(0,0,0,0.85)] backdrop-blur-md transition-[border-color,background-color,transform] duration-300',
          'hover:border-white/30 hover:bg-black/55 hover:text-white',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/50',
          'active:scale-[0.96]',
          'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-black/35',
        )}
      >
        <span
          aria-hidden
          className="absolute inset-0 rounded-full bg-gradient-to-br from-white/[0.08] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
        <span className="relative">{children}</span>
      </button>
    </motion.div>
  );
}
