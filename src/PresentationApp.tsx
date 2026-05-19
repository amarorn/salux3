import { AnimatePresence, motion } from "framer-motion";
import { IntroScreen } from "./components/IntroScreen";
import { PresentationCanvas } from "./components/PresentationCanvas";
import { useKeyboardNavigation } from "./hooks/useKeyboardNavigation";
import { usePresentationClickAdvance } from "./hooks/usePresentationClickAdvance";
import { useCurrentPresentation } from "./hooks/useCurrentPresentation";
import { usePresentationStore } from "./store/presentationStore";
import { IntroBackground } from "./components/intro/IntroBackground";
import { PresentationCornerLogo } from "./components/PresentationCornerLogo";
import { MaestroOrb } from "./components/MaestroOrb";
import { PresentationNavArrows } from "./components/PresentationNavArrows";
import { PresentationCursor } from "./components/PresentationCursor";
import { TransitionMorph } from "./components/intro/TransitionMorph";
import { Stage } from "./components/Stage";
import "./styles/presentationHierarchy.css";

/** Fluxo original: intro → morph → apresentação espacial (rota `/apresentacao`). */
export function PresentationApp() {
  useKeyboardNavigation();
  usePresentationClickAdvance();
  const hasEntered = usePresentationStore((s) => s.hasEntered);
  const showCornerLogo = usePresentationStore((s) => s.showCornerLogo);
  const currentStepId = usePresentationStore((s) => s.currentStepId);
  const transitionPhase = usePresentationStore((s) => s.transitionPhase);
  const finishTransition = usePresentationStore((s) => s.finishTransition);
  const { steps } = useCurrentPresentation();
  const closingLogoFlight = Boolean(
    steps.find((s) => s.id === currentStepId)?.content.closingLogoFlight,
  );
  const cornerLogoVisible =
    (showCornerLogo || hasEntered) &&
    transitionPhase !== "morphing" &&
    !closingLogoFlight;

  return (
    <Stage>
      <main className="relative h-full w-full overflow-hidden bg-[#05070d]">
        <IntroBackground />

        <PresentationCornerLogo visible={cornerLogoVisible} />
        <MaestroOrb
          visible={transitionPhase !== "morphing" && !closingLogoFlight}
        />

        <AnimatePresence>
          {transitionPhase === "idle" && !hasEntered && (
            <IntroScreen key="intro" />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {transitionPhase === "morphing" && (
            <TransitionMorph key="transition" onComplete={finishTransition} />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {hasEntered && (
            <motion.div
              key="presentation"
              initial={{ opacity: 0, scale: 0.96, filter: "none" }}
              animate={{ opacity: 1, scale: 1, filter: "none" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <PresentationCanvas externalBackground />
            </motion.div>
          )}
        </AnimatePresence>

        {hasEntered && transitionPhase !== "morphing" && (
          <PresentationNavArrows />
        )}
      </main>

      <PresentationCursor />
    </Stage>
  );
}
