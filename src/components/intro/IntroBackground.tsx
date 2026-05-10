import { DriftingBackground } from './DriftingBackground';

export function IntroBackground() {
  return (
    <div className="absolute inset-0">
      <DriftingBackground />
      <Vignette />
    </div>
  );
}

function Vignette() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        background:
          'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)',
      }}
    />
  );
}

