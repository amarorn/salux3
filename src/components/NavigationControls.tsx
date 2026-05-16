import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Compass, Map, Home } from 'lucide-react';
import clsx from 'clsx';
import { usePresentationNavigation } from '@/hooks/usePresentationNavigation';
import { useCurrentPresentation } from '@/hooks/useCurrentPresentation';
import { stepKindLabel } from '@/domain/stepKindLabel';

export function NavigationControls() {
  const { current, indicators, isOverview, prev, next, goToIndex, toggleOverview, setStep } =
    usePresentationNavigation();
  const { steps, meta } = useCurrentPresentation();

  return (
    <>
      <motion.div
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute bottom-6 left-1/2 z-30 -translate-x-1/2"
      >
        <div
          data-no-click-advance
          className="pointer-events-auto flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] p-1.5 shadow-[0_22px_60px_-22px_rgba(0,0,0,0.6)]"
        >
          <ControlButton onClick={() => setStep(steps[0]!.id)} aria-label="Voltar à capa">
            <Home className="h-4 w-4" />
          </ControlButton>

          <div className="mx-1 h-5 w-px bg-white/15" />

          <ControlButton
            onClick={prev}
            disabled={indicators.isFirst || isOverview}
            aria-label="Etapa anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </ControlButton>

          <div className="flex items-center gap-1 px-2">
            {steps.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => goToIndex(i)}
                aria-label={`Ir para ${s.title}`}
                aria-current={s.id === current.id ? 'true' : undefined}
                className={clsx(
                  'h-1.5 rounded-full transition-all duration-300 ease-out',
                  s.id === current.id && !isOverview
                    ? 'w-7 bg-white'
                    : 'w-1.5 bg-white/30 hover:bg-white/60',
                )}
              />
            ))}
          </div>

          <ControlButton
            onClick={next}
            disabled={indicators.isLast || isOverview}
            aria-label="Próxima etapa"
          >
            <ChevronRight className="h-4 w-4" />
          </ControlButton>

          <div className="mx-1 h-5 w-px bg-white/15" />

          <ControlButton
            onClick={toggleOverview}
            aria-pressed={isOverview}
            aria-label="Modo overview"
            highlighted={isOverview}
          >
            <Map className="h-4 w-4" />
          </ControlButton>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="pointer-events-none absolute left-6 top-6 z-30"
      >
        <div
          data-no-click-advance
          className="pointer-events-auto flex items-center gap-3 rounded-2xl border border-white/15 bg-white/[0.06] px-4 py-2.5 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.6)]"
        >
          <Compass className="h-4 w-4 text-ppt-highlight" strokeWidth={1.8} />
          <div className="flex max-w-[min(52vw,420px)] flex-col leading-tight">
            <span className="truncate text-[10px] font-semibold uppercase tracking-[0.28em] text-white/40">
              {meta.title}
            </span>
            <span className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.2em] text-white/30">
              {isOverview ? 'Visão geral' : `${stepKindLabel(current.kind)} · ${indicators.position}`}
            </span>
            <span className="mt-1 truncate font-display text-[15px] font-semibold tracking-tight text-white">
              {isOverview ? 'Mapa da trilha' : current.title}
            </span>
          </div>
        </div>
      </motion.div>

      <div aria-live="polite" className="sr-only">
        Etapa {indicators.position}: {current.title}
      </div>
    </>
  );
}

interface ControlButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  highlighted?: boolean;
  'aria-label'?: string;
  'aria-pressed'?: boolean;
}

function ControlButton({
  onClick,
  children,
  disabled,
  highlighted,
  'aria-label': ariaLabel,
  'aria-pressed': ariaPressed,
}: ControlButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-pressed={ariaPressed}
      className={clsx(
        'flex h-9 w-9 items-center justify-center rounded-full text-white/75 transition-all duration-200 ease-out',
        'hover:bg-white/15 hover:text-white',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#54c1ed]/40',
        'disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white/75',
        highlighted && 'bg-white text-[#04060c]',
      )}
    >
      {children}
    </button>
  );
}
