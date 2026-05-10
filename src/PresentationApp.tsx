import { AnimatePresence, motion } from 'framer-motion';
import { IntroScreen } from './components/IntroScreen';
import { PresentationCanvas } from './components/PresentationCanvas';
import { useKeyboardNavigation } from './hooks/useKeyboardNavigation';
import { usePresentationClickAdvance } from './hooks/usePresentationClickAdvance';
import { usePresentationStore } from './store/presentationStore';
import { IntroBackground } from './components/intro/IntroBackground';
import { PresentationCornerLogo } from './components/PresentationCornerLogo';
import { TransitionMorph } from './components/intro/TransitionMorph';
import './styles/presentationHierarchy.css';

/** Fluxo original: intro → morph → apresentação espacial (rota `/apresentacao`). */
export function PresentationApp() {
  useKeyboardNavigation();
  usePresentationClickAdvance();
  const hasEntered = usePresentationStore((s) => s.hasEntered);
  const showCornerLogo = usePresentationStore((s) => s.showCornerLogo);
  const transitionPhase = usePresentationStore((s) => s.transitionPhase);
  const finishTransition = usePresentationStore((s) => s.finishTransition);
  const cornerLogoVisible =
    (showCornerLogo || hasEntered) && transitionPhase !== 'morphing';

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-[#05070d]">
      <IntroBackground />

      <PresentationCornerLogo visible={cornerLogoVisible} />

      <AnimatePresence>
        {transitionPhase === 'idle' && !hasEntered && <IntroScreen key="intro" />}
      </AnimatePresence>

      <AnimatePresence>
        {transitionPhase === 'morphing' && (
          <TransitionMorph key="transition" onComplete={finishTransition} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {hasEntered && (
          <motion.div
            key="presentation"
            initial={{ opacity: 0, scale: 0.96, filter: 'blur(6px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <PresentationCanvas externalBackground />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
