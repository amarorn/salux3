import { useEffect } from 'react';
import { useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { usePresentationNavigation } from '@/hooks/usePresentationNavigation';
import { useCurrentPresentation } from '@/hooks/useCurrentPresentation';

const MAX_TX = 18;
const MAX_TY = 14;
const MAX_ROT = 7;

/**
 * Offset suave do logo em relação ao slide ativo no grafo da trilha:
 * o símbolo inclina-se na direção do cartão atual (sensação de tração no deck).
 */
export function usePresentationLogoTraction(enabled: boolean) {
  const reducedMotion = useReducedMotion();
  const { current, isOverview } = usePresentationNavigation();
  const { steps } = useCurrentPresentation();

  const tx = useMotionValue(0);
  const ty = useMotionValue(0);
  const rot = useMotionValue(0);

  const stiffness = reducedMotion ? 400 : 110;
  const damping = reducedMotion ? 40 : 22;

  const sx = useSpring(tx, { stiffness, damping, mass: 0.85 });
  const sy = useSpring(ty, { stiffness, damping, mass: 0.85 });
  const sRot = useSpring(rot, { stiffness: reducedMotion ? 400 : 95, damping: reducedMotion ? 42 : 24 });

  useEffect(() => {
    if (!enabled || steps.length === 0 || isOverview) {
      tx.set(0);
      ty.set(0);
      rot.set(0);
      return;
    }

    const xs = steps.map((s) => s.position.x);
    const ys = steps.map((s) => s.position.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;

    const spanX = Math.max(maxX - minX, 520);
    const spanY = Math.max(maxY - minY, 520);

    const dx = current.position.x - cx;
    const dy = current.position.y - cy;

    const nx = Math.max(-1, Math.min(1, (dx / spanX) * 2.2));
    const ny = Math.max(-1, Math.min(1, (dy / spanY) * 2.2));

    tx.set(nx * MAX_TX);
    ty.set(ny * MAX_TY);
    rot.set(nx * MAX_ROT);
  }, [enabled, steps, current.id, current.position.x, current.position.y, isOverview, tx, ty, rot]);

  return { x: sx, y: sy, rotate: sRot };
}
