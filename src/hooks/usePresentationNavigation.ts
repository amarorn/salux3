import { useMemo } from 'react';
import { usePresentationStore } from '@/store/presentationStore';
import { useCurrentPresentation } from './useCurrentPresentation';

export function usePresentationNavigation() {
  const { steps, stepsById } = useCurrentPresentation();
  const currentStepId = usePresentationStore((s) => s.currentStepId);
  const isOverview = usePresentationStore((s) => s.isOverview);
  const setStep = usePresentationStore((s) => s.setStep);
  const next = usePresentationStore((s) => s.next);
  const prev = usePresentationStore((s) => s.prev);
  const goToIndex = usePresentationStore((s) => s.goToIndex);
  const toggleOverview = usePresentationStore((s) => s.toggleOverview);
  const setOverview = usePresentationStore((s) => s.setOverview);

  const current = stepsById[currentStepId]!;
  const total = steps.length;

  const indicators = useMemo(
    () => ({
      isFirst: current.index === 0,
      isLast: current.index === total - 1,
      position: `${current.index + 1} / ${total}`,
    }),
    [current.index, total],
  );

  return {
    current,
    total,
    isOverview,
    indicators,
    setStep,
    next,
    prev,
    goToIndex,
    toggleOverview,
    setOverview,
  };
}
