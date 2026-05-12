import { memo, useEffect, useMemo, useRef, type ReactNode } from 'react';
import { motion, useAnimation, useReducedMotion } from 'framer-motion';
import type { PresentationStep } from '@/domain/types';
import { CoverStep } from './steps/CoverStep';
import { NarrativeStep } from './steps/NarrativeStep';
import { ArchitectureStep } from './steps/ArchitectureStep';
import { JourneyStep } from './steps/JourneyStep';
import { IntegrationStep } from './steps/IntegrationStep';
import { GovernanceStep } from './steps/GovernanceStep';
import { RoadmapStep } from './steps/RoadmapStep';
import { HighlightStep } from './steps/HighlightStep';
import { ClosingStep } from './steps/ClosingStep';
import { CapacitiesStep } from './steps/CapacitiesStep';
import { PathwaysStep } from './steps/PathwaysStep';
import { AgentsFlowStep } from './steps/AgentsFlowStep';
import { ResultsStep } from './steps/ResultsStep';
import { FloatingCardContext } from './FloatingCard';

/** Largura unificada para todos os cards de todas as trilhas (independente do tipo do step).
 *  Layout vertical: foto como banner no topo, conteúdo abaixo.
 *  Stage 1080×1920 — 920px ≈ 85% da largura, dando respiração lateral. */
const UNIFIED_CARD_WIDTH = 920;

function flipFromId(id: string): boolean {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = ((h << 5) - h + id.charCodeAt(i)) | 0;
  return Math.abs(h) % 2 === 1;
}

interface PresentationNodeProps {
  step: PresentationStep;
  active: boolean;
  /** Quando true, slides que não estão ativos ficam mais baixos em opacidade (efeito “fader” na trilha). */
  dimNonActive?: boolean;
}

function StepBody({ step, active }: PresentationNodeProps) {
  switch (step.kind) {
    case 'cover':
      return <CoverStep step={step} active={active} />;
    case 'narrative':
      return <NarrativeStep step={step} active={active} />;
    case 'architecture':
      return <ArchitectureStep step={step} active={active} />;
    case 'journey':
      return <JourneyStep step={step} active={active} />;
    case 'integration':
      return <IntegrationStep step={step} active={active} />;
    case 'governance':
      return <GovernanceStep step={step} active={active} />;
    case 'roadmap':
      return <RoadmapStep step={step} active={active} />;
    case 'highlight':
      return <HighlightStep step={step} active={active} />;
    case 'capacities':
      return <CapacitiesStep step={step} active={active} />;
    case 'pathways':
      return <PathwaysStep step={step} active={active} />;
    case 'agents-flow':
      return <AgentsFlowStep step={step} active={active} />;
    case 'results':
      return <ResultsStep step={step} active={active} />;
    case 'closing':
      return <ClosingStep step={step} active={active} />;
  }
}

function CardFlipShell({
  active,
  flipPhoto,
  stepLabel,
  children,
}: {
  active: boolean;
  flipPhoto: boolean;
  stepLabel: string;
  children: ReactNode;
}) {
  const reduceMotion = useReducedMotion();
  const flipControls = useAnimation();
  const prevActive = useRef(active);

  useEffect(() => {
    if (reduceMotion) {
      void flipControls.set({ rotateY: 0, opacity: 1 });
      prevActive.current = active;
      return;
    }

    if (active && !prevActive.current) {
      void flipControls.set({ rotateY: flipPhoto ? -82 : 82, opacity: 1 });
      requestAnimationFrame(() => {
        void flipControls.start({
          rotateY: 0,
          transition: { duration: 0.72, ease: [0.22, 1, 0.36, 1] },
        });
      });
    }

    prevActive.current = active;
  }, [active, flipControls, reduceMotion, flipPhoto]);

  const perspectiveOrigin = flipPhoto ? 'right center' : 'left center';

  return (
    <div
      className="relative"
      style={{
        perspective: '1600px',
        perspectiveOrigin,
      }}
    >
      <motion.div
        animate={flipControls}
        initial={{ rotateY: reduceMotion ? 0 : 0, opacity: 1 }}
        style={{
          transformStyle: 'preserve-3d',
          transformOrigin: flipPhoto ? 'right center' : 'left center',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          willChange: reduceMotion ? undefined : 'transform',
        }}
      >
        <div
          role="group"
          aria-roledescription="Slide"
          aria-current={active ? 'step' : undefined}
          aria-label={stepLabel}
          className="group block cursor-pointer rounded-3xl text-left outline-none focus-visible:ring-4 focus-visible:ring-violet-300/60"
        >
          {children}
        </div>
      </motion.div>
    </div>
  );
}

function PresentationNodeComponent({ step, active, dimNonActive = true }: PresentationNodeProps) {
  const flipPhoto = useMemo(() => flipFromId(step.id), [step.id]);
  const stepLabel = `Etapa ${step.index + 1}: ${step.title}`;
  const reducedMotion = useReducedMotion();
  const faded = dimNonActive && !active;
  const forceWidth = UNIFIED_CARD_WIDTH;

  return (
    <motion.div
      className="absolute"
      style={{ left: step.position.x, top: step.position.y }}
      initial={{ opacity: 0, y: 24 }}
      animate={{
        opacity: faded ? 0.34 : 1,
        y: 0,
        scale: faded && !reducedMotion ? 0.97 : 1,
      }}
      transition={{
        opacity: { duration: 0.52, ease: [0.22, 1, 0.36, 1] },
        scale: { duration: 0.52, ease: [0.22, 1, 0.36, 1] },
        delay: step.index * 0.04,
      }}
    >
      <div style={{ transform: 'translate(-50%, -50%)' }}>
        <FloatingCardContext.Provider value={{ flipPhoto, forceWidth }}>
          <CardFlipShell active={active} flipPhoto={flipPhoto} stepLabel={stepLabel}>
            <StepBody step={step} active={active} />
          </CardFlipShell>
        </FloatingCardContext.Provider>
      </div>
    </motion.div>
  );
}

export const PresentationNode = memo(PresentationNodeComponent);
