import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import { usePresentationNavigation } from '@/hooks/usePresentationNavigation';
import { theme } from '@/domain/theme';
import { SPRING, EASE } from '@/lib/motion/curves';

/**
 * Setas laterais de navegação (prev/next) + indicador de progresso segmentado.
 * Sempre visíveis durante a apresentação; respeitam `data-no-click-advance`
 * para não disparar o avanço global por clique.
 */
export function PresentationNavArrows() {
  const { prev, next, indicators, isOverview, current, total, goToIndex } =
    usePresentationNavigation();

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

      <ProgressSegments
        currentIndex={current.index}
        total={total}
        accent={current.accent}
        onJump={goToIndex}
      />
    </>
  );
}

interface ProgressSegmentsProps {
  currentIndex: number;
  total: number;
  accent: keyof typeof theme.accents | undefined;
  onJump: (index: number) => void;
}

function ProgressSegments({ currentIndex, total, accent, onJump }: ProgressSegmentsProps) {
  const accentColor = theme.accents[accent ?? 'violet'].base;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: EASE.cinematic }}
      data-no-click-advance
      className="pointer-events-none absolute right-6 top-6 z-30"
      aria-label={`Progresso: slide ${currentIndex + 1} de ${total}`}
    >
      <div className="pointer-events-auto flex items-center gap-3 rounded-full border border-white/10 bg-black/45 px-3.5 py-2 backdrop-blur-md">
        <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-white/45 tabular-nums">
          {String(currentIndex + 1).padStart(2, '0')}
          <span className="text-white/25"> / {String(total).padStart(2, '0')}</span>
        </span>

        <div className="flex items-center gap-[3px]">
          {Array.from({ length: total }, (_, i) => {
            const isActive = i === currentIndex;
            const isPassed = i < currentIndex;
            return (
              <button
                key={i}
                type="button"
                data-no-click-advance
                aria-label={`Ir para slide ${i + 1}`}
                aria-current={isActive ? 'true' : undefined}
                onClick={(e) => {
                  e.stopPropagation();
                  onJump(i);
                }}
                className="group flex h-3 items-center"
              >
                <motion.span
                  className="block h-[2px] rounded-full will-change-transform"
                  animate={{
                    width: isActive ? 24 : 4,
                    backgroundColor: isActive
                      ? '#ffffff'
                      : isPassed
                        ? 'rgba(255,255,255,0.55)'
                        : 'rgba(255,255,255,0.18)',
                  }}
                  transition={{ duration: 0.5, ease: EASE.cinematic }}
                  style={
                    isActive
                      ? { boxShadow: `0 0 12px ${accentColor}99, 0 0 4px ${accentColor}` }
                      : undefined
                  }
                  whileHover={!isActive ? { scaleY: 2.2 } : undefined}
                />
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
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
      <motion.button
        type="button"
        data-no-click-advance
        disabled={disabled}
        aria-label={ariaLabel}
        whileHover={disabled ? undefined : { scale: 1.06, y: -1 }}
        whileTap={disabled ? undefined : { scale: 0.94 }}
        transition={SPRING.snappy}
        onClick={(e) => {
          e.stopPropagation();
          if (!disabled) onClick();
        }}
        className={clsx(
          'pointer-events-auto group inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/14 bg-black/50 text-white/85 shadow-[0_18px_44px_-20px_rgba(0,0,0,0.85)] transition-[border-color,background-color] duration-300 will-change-transform',
          'hover:border-white/30 hover:bg-black/55 hover:text-white',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/50',
          'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-black/35',
        )}
      >
        <span
          aria-hidden
          className="absolute inset-0 rounded-full bg-gradient-to-br from-white/[0.08] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
        <span className="relative">{children}</span>
      </motion.button>
    </motion.div>
  );
}
