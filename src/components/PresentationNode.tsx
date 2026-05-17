import { memo, useEffect, useMemo, useRef, type ReactNode } from 'react';
import { motion, useAnimation, useReducedMotion } from 'framer-motion';
import clsx from 'clsx';
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
import { CARD_EDGE_SHELL, cardEdgeDataAttr } from '@/lib/cardEdgeFade';
import { usePresentationStore } from '@/store/presentationStore';

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
  unframedBanner,
  children,
}: {
  active: boolean;
  flipPhoto: boolean;
  stepLabel: string;
  /** Cantos superiores rectos para o banner não ser “cortado” pela moldura do cartão. */
  unframedBanner?: boolean;
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
          {...cardEdgeDataAttr('shell')}
          className={clsx(
            CARD_EDGE_SHELL,
            'group block text-left outline-none focus-visible:ring-4 focus-visible:ring-violet-300/60',
            unframedBanner ? 'rounded-b-3xl rounded-t-none' : 'rounded-3xl',
          )}
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
  const currentTrackId = usePresentationStore((s) => s.currentTrackId);

  return (
    <motion.div
      className="absolute"
      style={{
        left: step.position.x,
        top: step.position.y,
        zIndex: active ? 30 : step.index,
        pointerEvents: faded ? 'none' : 'auto',
      }}
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
      <motion.div
        style={{ x: '-50%', y: '-50%', willChange: 'transform' }}
        animate={
          reducedMotion
            ? undefined
            : {
                translateY: ['-50%', 'calc(-50% - 10px)', '-50%', 'calc(-50% + 8px)', '-50%'],
                rotate: [0, 0.35, 0, -0.3, 0],
              }
        }
        transition={{
          duration: 11 + (step.index % 3) * 1.3,
          ease: 'easeInOut',
          repeat: Infinity,
          delay: (step.index % 5) * 0.6,
        }}
      >
        <FloatingCardContext.Provider
          value={{
            flipPhoto,
            forceWidth,
            bannerVideoSrc: step.content.bannerMedia?.videoSrc,
            bannerVideoPoster: step.content.bannerMedia?.posterSrc,
            bannerVideoPlayOnClick: step.content.bannerMedia?.playOnClick,
            trackId: currentTrackId,
            omitSidePhoto: step.content.omitSidePhoto,
          }}
        >
          <CardFlipShell active={active} flipPhoto={flipPhoto} stepLabel={stepLabel} unframedBanner={Boolean(step.content.bannerUnframed)}>
            <StepBody step={step} active={active} />
          </CardFlipShell>
        </FloatingCardContext.Provider>
      </motion.div>
    </motion.div>
  );
}

export const PresentationNode = memo(PresentationNodeComponent);
