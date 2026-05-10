import type { Variants } from 'framer-motion';

/**
 * Texto do slide — entra depois da foto lateral e do painel (`delayChildren`).
 * Ordem no DOM: primeiro blocos visuais (ex.: hero), depois títulos e parágrafos.
 */
export function getCardTextVariants(
  reducedMotion: boolean,
  stepIndex: number,
  flipPhoto: boolean = false,
) {
  if (reducedMotion) {
    return {
      container: { hidden: {}, visible: {} } satisfies Variants,
      item: { hidden: {}, visible: {} } satisfies Variants,
    };
  }
  const xFrom = flipPhoto ? 18 : -18;
  /** Espera foto lateral + painel (delay 0.14s + duração ~0.48s) antes do texto começar. */
  const delayChildren = 0.62 + stepIndex * 0.018;

  return {
    container: {
      hidden: {
        transition: {
          staggerChildren: 0.035,
          staggerDirection: -1,
        },
      },
      visible: {
        transition: {
          staggerChildren: 0.055,
          delayChildren,
        },
      },
    } satisfies Variants,
    item: {
      hidden: {
        opacity: 0,
        x: xFrom,
        y: 10,
        filter: 'blur(8px)',
        transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
      },
      visible: {
        opacity: 1,
        x: 0,
        y: 0,
        filter: 'blur(0px)',
        transition: { duration: 0.48, ease: [0.16, 1, 0.3, 1] },
      },
    } satisfies Variants,
  };
}
