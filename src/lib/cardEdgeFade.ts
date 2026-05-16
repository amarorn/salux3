/** Classes CSS — máscara radial como na logo Salux (`IntroScreen`). */
export const CARD_EDGE_SHELL = 'presentation-card-shell';
export const CARD_EDGE_BANNER = 'presentation-card-banner';
export const CARD_EDGE_CHIP = 'presentation-card-chip';
export const CARD_EDGE_QUOTE = 'presentation-card-quote';

export const CARD_EDGE_DATA = {
  shell: 'shell',
  banner: 'banner',
  chip: 'chip',
  quote: 'quote',
} as const;

export type CardEdgeKind = (typeof CARD_EDGE_DATA)[keyof typeof CARD_EDGE_DATA];

export function cardEdgeDataAttr(kind: CardEdgeKind): {
  'data-presentation-card': CardEdgeKind;
} {
  return { 'data-presentation-card': kind };
}
