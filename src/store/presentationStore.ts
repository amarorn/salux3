import { create } from 'zustand';
import { tracksById, type TrackId } from '@/domain/tracks';

type TransitionPhase = 'idle' | 'morphing' | 'done';

interface PresentationState {
  currentTrackId: TrackId;
  currentStepId: string;
  isOverview: boolean;
  hasEntered: boolean;
  showCornerLogo: boolean;
  transitionPhase: TransitionPhase;
  /** Slides governance com `revealPillars`: primeiro clique expande em vez de avançar. */
  governanceRevealExpanded: boolean;
  setGovernanceRevealExpanded: (value: boolean) => void;
  setTrack: (id: TrackId) => void;
  setShowCornerLogo: (value: boolean) => void;
  setStep: (id: string) => void;
  next: () => void;
  prev: () => void;
  goToIndex: (index: number) => void;
  toggleOverview: () => void;
  setOverview: (value: boolean) => void;
  enter: () => void;
  finishTransition: () => void;
  enterTrack: (id: TrackId) => void;
  reset: () => void;
  /** Volta ao ecrã inicial para escolher outra trilha (mantém a sessão na mesma rota). */
  returnToTrackSelection: () => void;
}

const defaultTrackId: TrackId = 'era-agentica';

function orderedIdsForTrack(trackId: TrackId) {
  return tracksById[trackId].steps.map((s) => s.id);
}

function firstIdForTrack(trackId: TrackId) {
  return tracksById[trackId].steps[0]!.id;
}

export const usePresentationStore = create<PresentationState>((set, get) => ({
  currentTrackId: defaultTrackId,
  currentStepId: firstIdForTrack(defaultTrackId),
  isOverview: false,
  hasEntered: false,
  showCornerLogo: false,
  transitionPhase: 'idle',
  governanceRevealExpanded: false,
  setGovernanceRevealExpanded: (value) => set({ governanceRevealExpanded: value }),
  setTrack: (id) => {
    const firstId = firstIdForTrack(id);
    set({ currentTrackId: id, currentStepId: firstId, isOverview: false, governanceRevealExpanded: false });
  },
  setShowCornerLogo: (value) => set({ showCornerLogo: value }),
  setStep: (id) => {
    const orderedIds = orderedIdsForTrack(get().currentTrackId);
    if (!orderedIds.includes(id)) return;
    set({ currentStepId: id, isOverview: false, governanceRevealExpanded: false });
  },
  next: () => {
    const orderedIds = orderedIdsForTrack(get().currentTrackId);
    const i = orderedIds.indexOf(get().currentStepId);
    const nextId = orderedIds[Math.min(i + 1, orderedIds.length - 1)]!;
    set({ currentStepId: nextId, isOverview: false, governanceRevealExpanded: false });
  },
  prev: () => {
    const orderedIds = orderedIdsForTrack(get().currentTrackId);
    const i = orderedIds.indexOf(get().currentStepId);
    const prevId = orderedIds[Math.max(i - 1, 0)]!;
    set({ currentStepId: prevId, isOverview: false, governanceRevealExpanded: false });
  },
  goToIndex: (index) => {
    const orderedIds = orderedIdsForTrack(get().currentTrackId);
    const id = orderedIds[Math.max(0, Math.min(index, orderedIds.length - 1))]!;
    set({ currentStepId: id, isOverview: false, governanceRevealExpanded: false });
  },
  toggleOverview: () => set((s) => ({ isOverview: !s.isOverview })),
  setOverview: (value) => set({ isOverview: value }),
  enter: () => set({ transitionPhase: 'morphing' }),
  finishTransition: () => set({ hasEntered: true, transitionPhase: 'done' }),
  enterTrack: (id) => {
    const firstId = firstIdForTrack(id);
    set({
      currentTrackId: id,
      currentStepId: firstId,
      isOverview: false,
      hasEntered: false,
      transitionPhase: 'morphing',
      governanceRevealExpanded: false,
    });
  },
  reset: () =>
    set({
      currentTrackId: defaultTrackId,
      currentStepId: firstIdForTrack(defaultTrackId),
      isOverview: false,
      hasEntered: false,
      showCornerLogo: false,
      transitionPhase: 'idle',
      governanceRevealExpanded: false,
    }),
  returnToTrackSelection: () =>
    set({
      hasEntered: false,
      transitionPhase: 'idle',
      showCornerLogo: false,
      isOverview: false,
      governanceRevealExpanded: false,
    }),
}));
