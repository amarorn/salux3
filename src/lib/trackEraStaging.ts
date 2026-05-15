import type { TrackId } from "@/domain/tracks";

/** Trilhas com `EraRevealBand` + fases por clique (Receita, Assistência e Operação). */
export function trackUsesEraStagedReveal(
  trackId: TrackId | undefined,
): boolean {
  return (
    trackId === "era-agentica" ||
    trackId === "operacoes" ||
    trackId === "assistencial"
  );
}
