import type { NodePosition } from '@/domain/types';

export interface BezierPath {
  d: string;
  midX: number;
  midY: number;
}

export function bezierBetween(a: NodePosition, b: NodePosition, curvature = 0.18): BezierPath {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dist = Math.hypot(dx, dy);
  const nx = -dy / (dist || 1);
  const ny = dx / (dist || 1);
  const offset = dist * curvature;

  const cx1 = a.x + dx * 0.28 + nx * offset;
  const cy1 = a.y + dy * 0.28 + ny * offset;
  const cx2 = a.x + dx * 0.72 + nx * offset;
  const cy2 = a.y + dy * 0.72 + ny * offset;

  return {
    d: `M ${a.x} ${a.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${b.x} ${b.y}`,
    midX: (a.x + b.x) / 2 + nx * offset * 0.6,
    midY: (a.y + b.y) / 2 + ny * offset * 0.6,
  };
}

export function distance(a: NodePosition, b: NodePosition): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}
