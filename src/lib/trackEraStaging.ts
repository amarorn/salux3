import type { TrackId } from "@/domain/tracks";

/** Trilhas com `EraRevealBand` + fases por clique na tela (Receita e Assistência no intro). */
export function trackUsesEraStagedReveal(
  trackId: TrackId | undefined,
): boolean {
  return trackId === "era-agentica" || trackId === "operacoes";
}
