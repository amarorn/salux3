import type { CSSProperties } from "react";

/**
 * Painel "vidro" alinhado ao `contrastPair` / cartões de evidência.
 *
 * Inclui `backdrop-filter: blur + saturate(140%)` — o detalhe que separa um
 * gradient simulando vidro de um vidro real. O saturate empurra as cores
 * por trás do painel, criando a sensação líquida (referência iOS / visionOS).
 */
function accentRgb(accentHex: string): string {
  const h = accentHex.replace('#', '');
  if (h.length !== 6) return '84,193,237';
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `${r},${g},${b}`;
}

const GLASS_BACKDROP = 'blur(20px) saturate(140%)';

export function glassPanelStyle(accentHex: string): CSSProperties {
  const rgb = accentRgb(accentHex);
  return {
    borderColor: `rgba(${rgb},0.2)`,
    background: `linear-gradient(135deg, rgba(${rgb},0.14) 0%, rgba(255,255,255,0.02) 72%)`,
    boxShadow: `inset 0 1px 0 rgba(255,255,255,0.05), 0 0 28px -14px rgba(${rgb},0.35)`,
    backdropFilter: GLASS_BACKDROP,
    WebkitBackdropFilter: GLASS_BACKDROP,
  };
}

/** Variante um pouco mais forte (ex.: cartão em foco / hover). */
export function glassPanelStyleEmphasis(accentHex: string): CSSProperties {
  const rgb = accentRgb(accentHex);
  return {
    borderColor: `rgba(${rgb},0.42)`,
    background: `linear-gradient(135deg, rgba(${rgb},0.26) 0%, rgba(255,255,255,0.04) 70%)`,
    boxShadow: `inset 0 1px 0 rgba(255,255,255,0.08), 0 0 36px -10px rgba(${rgb},0.45)`,
    backdropFilter: GLASS_BACKDROP,
    WebkitBackdropFilter: GLASS_BACKDROP,
  };
}
