import type { Connection } from './types';

export const connections: Connection[] = [
  { from: 'cover', to: 'limit', curvature: 0.18 },
  { from: 'cover', to: 'why-agents', curvature: 0.18 },
  { from: 'cover', to: 'architecture', curvature: 0.22 },
  { from: 'cover', to: 'journey', curvature: 0.22 },
  { from: 'cover', to: 'integration', curvature: 0.22 },
  { from: 'cover', to: 'governance', curvature: 0.22 },
  { from: 'cover', to: 'roadmap', curvature: 0.26 },
  { from: 'cover', to: 'closing', curvature: 0.16, dashed: true },

  { from: 'limit', to: 'why-agents', curvature: 0.12 },
  { from: 'why-agents', to: 'architecture', curvature: 0.18 },
  { from: 'architecture', to: 'journey', curvature: 0.16 },
  { from: 'architecture', to: 'integration', curvature: 0.2, dashed: true },
  { from: 'integration', to: 'governance', curvature: 0.18 },
  { from: 'governance', to: 'roadmap', curvature: 0.22, dashed: true },
  { from: 'roadmap', to: 'closing', curvature: 0.32 },
];
