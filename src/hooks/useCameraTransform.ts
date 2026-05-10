import { useEffect, useMemo, useRef } from 'react';
import { animate, useMotionValue, useReducedMotion } from 'framer-motion';
import { cameraForOverview, cameraForStep } from '@/lib/camera';
import type { PresentationStep, ViewportSize } from '@/domain/types';
import { useCurrentPresentation } from './useCurrentPresentation';

interface UseCameraTransformArgs {
  step: PresentationStep;
  isOverview: boolean;
  viewport: ViewportSize;
}

export function useCameraTransform({ step, isOverview, viewport }: UseCameraTransformArgs) {
  const { steps } = useCurrentPresentation();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);
  const reduceMotion = useReducedMotion();
  const isAnimating = useRef(false);

  const target = useMemo(() => {
    return isOverview ? cameraForOverview(steps, viewport) : cameraForStep(step, viewport);
  }, [isOverview, step, steps, viewport]);

  useEffect(() => {
    const transition = reduceMotion
      ? { type: 'tween' as const, duration: 0.2, ease: 'easeOut' as const }
      : { type: 'spring' as const, stiffness: 70, damping: 22, mass: 1.1 };

    isAnimating.current = true;
    const controls = [
      animate(x, target.x, transition),
      animate(y, target.y, transition),
      animate(scale, target.scale, transition),
    ];
    Promise.all(controls.map((c) => c.then?.(() => undefined) ?? c)).finally(() => {
      isAnimating.current = false;
    });

    return () => controls.forEach((c) => c.stop());
  }, [target.x, target.y, target.scale, x, y, scale, reduceMotion]);

  return { x, y, scale };
}
