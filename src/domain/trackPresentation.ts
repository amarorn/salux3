import type { TrackId } from "./tracks";

/**
 * Trilha 1 (Receita) e trilha 2 (Assistência no mapa `operacoes`) compartilham
 * a mesma linguagem visual: revelação por bandas (EraRevealBand) e escala
 * de texto do FloatingCard alinhada à trilha Receita.
 */
export function trackUsesPremiumStagedPresentation(
  trackId: TrackId | undefined,
): boolean {
  return trackId === "era-agentica" || trackId === "operacoes";
}
