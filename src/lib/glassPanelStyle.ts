import type { CSSProperties } from "react";

/** Painel “vidro” alinhado ao `contrastPair` / cartões de evidência (sem backdrop-blur). */
export function glassPanelStyle(accentHex: string): CSSProperties {
  return {
    borderColor: `${accentHex}44`,
    background: `linear-gradient(135deg, ${accentHex}1a 0%, rgba(255,255,255,0.02) 70%)`,
    boxShadow: `inset 0 1px 0 rgba(255,255,255,0.06)`,
  };
}

/** Variante um pouco mais forte (ex.: cartão em foco / hover). */
export function glassPanelStyleEmphasis(accentHex: string): CSSProperties {
  return {
    borderColor: `${accentHex}aa`,
    background: `linear-gradient(135deg, ${accentHex}30 0%, rgba(255,255,255,0.04) 70%)`,
    boxShadow: `inset 0 1px 0 rgba(255,255,255,0.08), 0 0 0 1px ${accentHex}55`,
  };
}
