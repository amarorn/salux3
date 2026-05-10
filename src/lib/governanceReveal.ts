import { tracksById, type TrackId } from '@/domain/tracks';
import { usePresentationStore } from '@/store/presentationStore';

export function governanceHasRevealContent(trackId: TrackId): boolean {
  const step = tracksById[trackId].stepsById['governance'];
  return Boolean(step?.content?.revealPillars?.length);
}

/** Primeiro interesse: revela governança sem avançar slide. Retorna true se consumiu o gesto. */
export function tryRevealGovernanceBeforeAdvance(): boolean {
  const store = usePresentationStore.getState();
  if (store.currentStepId !== 'governance') return false;
  if (!governanceHasRevealContent(store.currentTrackId)) return false;
  if (store.governanceRevealExpanded) return false;
  store.setGovernanceRevealExpanded(true);
  return true;
}
