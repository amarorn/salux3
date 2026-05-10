import { useEffect } from 'react';
import { ActivationPulse } from './ActivationPulse';
import { CameraController } from './CameraController';
import { ConnectionLines } from './ConnectionLines';
import { PresentationNode } from './PresentationNode';
import { theme } from '@/domain/theme';
import { usePresentationNavigation } from '@/hooks/usePresentationNavigation';
import { useViewportSize } from '@/hooks/useViewportSize';
import { useCurrentPresentation } from '@/hooks/useCurrentPresentation';

export function PresentationCanvas({ externalBackground = false }: { externalBackground?: boolean }) {
  const { current, isOverview } = usePresentationNavigation();
  const { steps } = useCurrentPresentation();
  const viewport = useViewportSize();

  useEffect(() => {
    document.body.classList.add('presentation-body');
    return () => document.body.classList.remove('presentation-body');
  }, []);

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      role="region"
      aria-label="Apresentação espacial"
    >
      {!externalBackground && (
        <>
          <BackgroundGradient />
          <BackgroundGrid />
          <BackgroundGlow />
        </>
      )}

      <CameraController step={current} isOverview={isOverview} viewport={viewport}>
        <ConnectionLines activeStepId={current.id} isOverview={isOverview} />
        {steps.map((step) => (
          <PresentationNode
            key={step.id}
            step={step}
            active={step.id === current.id && !isOverview}
            dimNonActive={!isOverview}
          />
        ))}
        {!isOverview && (
          <ActivationPulse
            key={current.id}
            position={current.position}
            color={theme.accents[current.accent].base}
          />
        )}
      </CameraController>
    </div>
  );
}

function BackgroundGradient() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 90% 70% at 50% 60%, #0e1726 0%, #08101c 45%, #04060c 100%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-screen"
        style={{
          background:
            'radial-gradient(circle at 20% 80%, rgba(82,160,239,0.16), transparent 42%), radial-gradient(circle at 80% 20%, rgba(84,193,237,0.12), transparent 48%)',
        }}
      />
    </>
  );
}

function BackgroundGrid() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 opacity-[0.18]"
      style={{
        backgroundImage:
          'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
        backgroundSize: '80px 80px',
        maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
        WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
      }}
    />
  );
}

function BackgroundGlow() {
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-1/4 h-[480px] w-[480px] rounded-full opacity-30 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.45), transparent 70%)' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 bottom-0 h-[520px] w-[520px] rounded-full opacity-30 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.4), transparent 70%)' }}
      />
    </>
  );
}
