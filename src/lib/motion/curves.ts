/**
 * Curvas e springs canônicos do Salux.
 *
 * Três curvas com papéis distintos — não escolhe aleatório.
 *   • cinematic — hero, logo, headlines, TransitionMorph. Tem peso.
 *   • ui        — cards, bandas de texto, reveals de produto. Discreto.
 *   • exit      — única ease-in do sistema; usar quando algo sai da tela.
 *
 * Springs para movimento orgânico (hover, magnetic, scale).
 */

export const EASE = {
  cinematic: [0.22, 1, 0.36, 1] as [number, number, number, number],
  ui:        [0.32, 0.72, 0, 1]  as [number, number, number, number],
  exit:      [0.4, 0, 1, 1]      as [number, number, number, number],
} as const;

export const SPRING = {
  /** Botão, click, magnetic — feedback imediato. */
  snappy: { type: 'spring' as const, stiffness: 380, damping: 30 },
  /** Card, panel, hover de superfície — UI cotidiana. */
  gentle: { type: 'spring' as const, stiffness: 140, damping: 22 },
  /** Hero, scroll reveal, entrada com peso. */
  lazy:   { type: 'spring' as const, stiffness: 70,  damping: 18 },
} as const;

/**
 * Stagger defaults — multiplicadores em segundos.
 * Usar como base; ajustar conforme densidade da lista.
 */
export const STAGGER = {
  tight:   0.04,
  default: 0.06,
  loose:   0.08,
} as const;
