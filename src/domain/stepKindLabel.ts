import type { NodeKind } from './types';

/** Rótulo curto por tipo de slide — hierarquia tipo estrutura de PPT (capa → corpo → encerramento). */
export function stepKindLabel(kind: NodeKind): string {
  const map: Record<NodeKind, string> = {
    cover: 'Abertura',
    narrative: 'Conteúdo',
    architecture: 'Arquitetura',
    journey: 'Jornada',
    integration: 'Integração',
    governance: 'Governança',
    roadmap: 'Roadmap',
    closing: 'Encerramento',
  };
  return map[kind];
}
