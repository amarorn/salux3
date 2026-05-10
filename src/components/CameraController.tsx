import type { ReactNode } from 'react';
import { motion, useMotionTemplate } from 'framer-motion';
import { useCameraTransform } from '@/hooks/useCameraTransform';
import type { PresentationStep, ViewportSize } from '@/domain/types';

interface CameraControllerProps {
  step: PresentationStep;
  isOverview: boolean;
  viewport: ViewportSize;
  children: ReactNode;
}

export function CameraController({ step, isOverview, viewport, children }: CameraControllerProps) {
  const { x, y, scale } = useCameraTransform({ step, isOverview, viewport });
  const transform = useMotionTemplate`translate3d(${x}px, ${y}px, 0) scale(${scale})`;

  return (
    <motion.div
      className="absolute left-0 top-0 origin-top-left will-change-transform"
      style={{ transform }}
      data-camera-world
    >
      {children}
    </motion.div>
  );
}
