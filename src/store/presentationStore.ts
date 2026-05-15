import { create } from 'zustand';
import { tracksById, type TrackId } from '@/domain/tracks';
import type { StageAspectMode } from '@/domain/stageAspect';
import { trackUsesEraStagedReveal } from '@/lib/trackEraStaging';

const STAGE_ASPECT_STORAGE_KEY = 'salux-stage-aspect';

function readStoredStageAspect(): StageAspectMode {
  if (typeof window === 'undefined') return 'totem';
  try {
    const raw = localStorage.getItem(STAGE_ASPECT_STORAGE_KEY);
    if (raw === 'totem' || raw === 'presentation') return raw;
  } catch {
    /* ignore */
  }
  return 'totem';
}

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
  /** Revelação por faixas no slide (trilhas Receita e Assistência no intro). */
  eraStagedRevealStepId: string | null;
  eraStagedRevealPhase: number;
  eraStagedRevealMax: number;
  /** Totem vertical (9:16) ou tela de apresentação (16:9). Afeta escala do palco e câmera. */
  stageAspectMode: StageAspectMode;
  setGovernanceRevealExpanded: (value: boolean) => void;
  setStageAspectMode: (mode: StageAspectMode) => void;
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
  setEraStagedRevealConfig: (stepId: string, maxPhases: number) => void;
  clearEraStagedReveal: () => void;
  tryAdvanceEraStagedReveal: () => boolean;
}

const defaultTrackId: TrackId = 'era-agentica';

function orderedIdsForTrack(trackId: TrackId) {
  return tracksById[trackId].steps.map((s) => s.id);
}

function firstIdForTrack(trackId: TrackId) {
  return tracksById[trackId].steps[0]!.id;
}

const eraRevealCleared = {
  eraStagedRevealStepId: null as string | null,
  eraStagedRevealPhase: 0,
  eraStagedRevealMax: 0,
};

export const usePresentationStore = create<PresentationState>((set, get) => ({
  currentTrackId: defaultTrackId,
  currentStepId: firstIdForTrack(defaultTrackId),
  isOverview: false,
  hasEntered: false,
  showCornerLogo: false,
  transitionPhase: 'idle',
  governanceRevealExpanded: false,
  ...eraRevealCleared,
  stageAspectMode: readStoredStageAspect(),
  setGovernanceRevealExpanded: (value) => set({ governanceRevealExpanded: value }),
  setStageAspectMode: (mode) => {
    try {
      localStorage.setItem(STAGE_ASPECT_STORAGE_KEY, mode);
    } catch {
      /* ignore */
    }
    set({ stageAspectMode: mode });
  },
  setTrack: (id) => {
    const firstId = firstIdForTrack(id);
    set({
      currentTrackId: id,
      currentStepId: firstId,
      isOverview: false,
      governanceRevealExpanded: false,
      ...eraRevealCleared,
    });
  },
  setShowCornerLogo: (value) => set({ showCornerLogo: value }),
  setStep: (id) => {
    const orderedIds = orderedIdsForTrack(get().currentTrackId);
    if (!orderedIds.includes(id)) return;
    set({
      currentStepId: id,
      isOverview: false,
      governanceRevealExpanded: false,
      ...eraRevealCleared,
    });
  },
  next: () => {
    const orderedIds = orderedIdsForTrack(get().currentTrackId);
    const i = orderedIds.indexOf(get().currentStepId);
    const nextId = orderedIds[Math.min(i + 1, orderedIds.length - 1)]!;
    set({
      currentStepId: nextId,
      isOverview: false,
      governanceRevealExpanded: false,
      ...eraRevealCleared,
    });
  },
  prev: () => {
    const orderedIds = orderedIdsForTrack(get().currentTrackId);
    const i = orderedIds.indexOf(get().currentStepId);
    const prevId = orderedIds[Math.max(i - 1, 0)]!;
    set({
      currentStepId: prevId,
      isOverview: false,
      governanceRevealExpanded: false,
      ...eraRevealCleared,
    });
  },
  goToIndex: (index) => {
    const orderedIds = orderedIdsForTrack(get().currentTrackId);
    const id = orderedIds[Math.max(0, Math.min(index, orderedIds.length - 1))]!;
    set({
      currentStepId: id,
      isOverview: false,
      governanceRevealExpanded: false,
      ...eraRevealCleared,
    });
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
      ...eraRevealCleared,
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
      ...eraRevealCleared,
    }),
  returnToTrackSelection: () =>
    set({
      hasEntered: false,
      transitionPhase: 'idle',
      showCornerLogo: false,
      isOverview: false,
      governanceRevealExpanded: false,
      ...eraRevealCleared,
    }),
  setEraStagedRevealConfig: (stepId, maxPhases) =>
    set({
      eraStagedRevealStepId: stepId,
      eraStagedRevealPhase: 0,
      eraStagedRevealMax: Math.max(1, maxPhases),
    }),
  clearEraStagedReveal: () => set(eraRevealCleared),
  tryAdvanceEraStagedReveal: () => {
    const s = get();
    if (!trackUsesEraStagedReveal(s.currentTrackId)) return false;
    if (!s.eraStagedRevealStepId || s.eraStagedRevealStepId !== s.currentStepId) return false;
    if (s.eraStagedRevealMax <= 1) return false;
    if (s.eraStagedRevealPhase < s.eraStagedRevealMax - 1) {
      set({ eraStagedRevealPhase: s.eraStagedRevealPhase + 1 });
      return true;
    }
    return false;
  },
}));
