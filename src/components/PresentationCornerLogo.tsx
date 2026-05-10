import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { useEffect } from 'react';
import { SaluxSymbol } from './intro/SaluxLogo';
import { useCurrentPresentation } from '@/hooks/useCurrentPresentation';
import { usePresentationLogoTraction } from '@/hooks/usePresentationLogoTraction';
import { usePresentationStore } from '@/store/presentationStore';

interface Props {
  /** Mesma condição de visibilidade do bloco do canto (inclui após escolher trilha e após entrar). */
  visible: boolean;
}

/**
 * Logo Salux no canto: inclina e desloca suavemente em direção ao cartão ativo no grafo da trilha.
 */
export function PresentationCornerLogo({ visible }: Props) {
  const hasEntered = usePresentationStore((s) => s.hasEntered);
  const stepId = usePresentationStore((s) => s.currentStepId);
  const { meta } = useCurrentPresentation();
  const reduceMotion = useReducedMotion();
  const traction = usePresentationLogoTraction(visible);

  const scale = useMotionValue(1);
  const scaleSpring = useSpring(scale, { stiffness: 320, damping: 24 });

  useEffect(() => {
    if (!visible || !hasEntered || reduceMotion) return;
    scale.set(1.06);
    const id = window.setTimeout(() => scale.set(1), 260);
    return () => window.clearTimeout(id);
  }, [stepId, visible, hasEntered, reduceMotion, scale]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="pointer-events-none absolute left-6 top-6 z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="flex items-center gap-3">
            <motion.div
              style={{
                x: traction.x,
                y: traction.y,
                rotate: traction.rotate,
                scale: scaleSpring,
              }}
              className="will-change-transform drop-shadow-[0_12px_28px_-8px_rgba(124,58,237,0.35)]"
            >
              <SaluxSymbol width={60} idle />
            </motion.div>
            {hasEntered && (
              <div className="flex flex-col leading-tight">
                <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/45">
                  apresentação ativa
                </span>
                <span className="text-[12px] font-semibold text-white/80">{meta.title}</span>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
