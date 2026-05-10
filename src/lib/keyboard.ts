export type KeyAction =
  | { type: 'next' }
  | { type: 'prev' }
  | { type: 'first' }
  | { type: 'last' }
  | { type: 'overview' }
  | { type: 'goto'; index: number };

export function resolveKey(event: KeyboardEvent): KeyAction | null {
  if (event.metaKey || event.ctrlKey || event.altKey) return null;

  switch (event.key) {
    case 'ArrowRight':
    case 'PageDown':
    case ' ':
      return { type: 'next' };
    case 'ArrowLeft':
    case 'PageUp':
      return { type: 'prev' };
    case 'Home':
      return { type: 'first' };
    case 'End':
      return { type: 'last' };
    case 'o':
    case 'O':
    case 'Escape':
      return { type: 'overview' };
    default:
      if (/^[1-9]$/.test(event.key)) {
        return { type: 'goto', index: Number.parseInt(event.key, 10) - 1 };
      }
      return null;
  }
}
