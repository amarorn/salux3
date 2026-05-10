import { useEffect } from 'react';
import { resolveKey } from '@/lib/keyboard';
import { usePresentationStore } from '@/store/presentationStore';
import { tracksById } from '@/domain/tracks';
import { tryRevealGovernanceBeforeAdvance } from '@/lib/governanceReveal';

export function useKeyboardNavigation() {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }
      const action = resolveKey(event);
      if (!action) return;

      const store = usePresentationStore.getState();
      if (!store.hasEntered) return;
      event.preventDefault();

      switch (action.type) {
        case 'next':
          if (!tryRevealGovernanceBeforeAdvance()) store.next();
          break;
        case 'prev':
          store.prev();
          break;
        case 'first':
          store.goToIndex(0);
          break;
        case 'last':
          store.goToIndex(tracksById[store.currentTrackId].steps.length - 1);
          break;
        case 'overview':
          store.toggleOverview();
          break;
        case 'goto':
          store.goToIndex(action.index);
          break;
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);
}
