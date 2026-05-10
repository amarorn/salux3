import { useLayoutEffect, useRef } from 'react';
import { bindRevealOnScroll } from '@/animations/revealOnScroll';
import { LandingShowcaseCards } from '@/landing/components/LandingShowcaseCards';

export function RevealSection() {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const cleanup = bindRevealOnScroll(el);
    return () => cleanup?.();
  }, []);

  return (
    <section
      ref={ref}
      className="relative z-10 mx-auto flex max-w-3xl flex-col gap-6 px-6 pb-40 pt-24 md:px-10"
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.38em] text-white/35">Continuidade</p>
      <h2 className="font-display text-3xl font-semibold tracking-tight text-white md:text-4xl">
        Operação coordenada em tempo real
      </h2>
      <p className="text-base leading-relaxed text-slate-400 md:text-lg">
        Esta landing usa React Three Fiber para fundir HTML e WebGL: parallax orientado ao rato, malha com shader GLSL,
        partículas aditivas e pós-processamento cinematográfico — com degradância automática em telemóveis para manter
        fluidez.
      </p>

      <div className="pointer-events-auto pt-4">
        <LandingShowcaseCards />
      </div>
    </section>
  );
}
