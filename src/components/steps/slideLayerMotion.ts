import type { Variants } from 'framer-motion';

const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const EASE_SOFT = [0.16, 1, 0.3, 1] as const;

/** Coluna da foto lateral — entra primeiro. */
export function getPhotoColumnVariants(flipPhoto: boolean): Variants {
  const dir = flipPhoto ? 1 : -1;
  return {
    hidden: {
      opacity: 0,
      x: 40 * dir,
      scale: 0.94,
      transition: { duration: 0.22, ease: EASE_OUT },
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { duration: 0.5, ease: EASE_OUT },
    },
  };
}

/** Painel do cartão (campo / caixa) — entra em segundo lugar. */
export function getContentPanelVariants(flipPhoto: boolean): Variants {
  const dir = flipPhoto ? -1 : 1;
  return {
    hidden: {
      opacity: 0,
      x: 28 * dir,
      filter: 'blur(12px)',
      transition: { duration: 0.24, ease: EASE_SOFT },
    },
    visible: {
      opacity: 1,
      x: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.48, delay: 0.14, ease: EASE_SOFT },
    },
  };
}
