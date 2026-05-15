import { useEffect } from 'react';
import { usePresentationStore } from '@/store/presentationStore';
import { tryRevealGovernanceBeforeAdvance } from '@/lib/governanceReveal';

/**
 * Avança um slide por clique em qualquer lugar da tela.
 * Elementos com `data-no-click-advance` (ex.: HUD de navegação) são ignorados.
 */
export function usePresentationClickAdvance() {
  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (event.button !== 0) return;

      const store = usePresentationStore.getState();
      if (!store.hasEntered) return;

      const target = event.target as HTMLElement | null;
      if (!target) return;
      if (
        target.closest(
          'button, a, [role="button"], input, select, textarea, [data-no-click-advance]',
        )
      ) {
        return;
      }

      if (tryRevealGovernanceBeforeAdvance()) return;

      if (usePresentationStore.getState().tryAdvanceEraStagedReveal()) return;

      store.next();
    };

    // Bubble: botões/cards interativos recebem o clique antes do avanço do slide.
    window.addEventListener('click', handler, false);
    return () => window.removeEventListener('click', handler, false);
  }, []);
}
