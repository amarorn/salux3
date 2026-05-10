import { useMemo } from 'react';
import { tracksById } from '@/domain/tracks';
import { usePresentationStore } from '@/store/presentationStore';

export function useCurrentPresentation() {
  const currentTrackId = usePresentationStore((s) => s.currentTrackId);

  return useMemo(() => tracksById[currentTrackId], [currentTrackId]);
}

