import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
  type ReactNode,
} from 'react';
import type { SmoothCursorState } from '@/hooks/useSmoothCursor';

export interface MouseBridgeValue {
  smoothRef: MutableRefObject<SmoothCursorState>;
  mobile: boolean;
  /** True quando o cursor está sobre elemento interativo (expansão do cursor). */
  interactiveHover: boolean;
  beginInteractiveHover: () => void;
  endInteractiveHover: () => void;
}

const MouseBridgeContext = createContext<MouseBridgeValue | null>(null);

export function MouseBridgeProvider({
  smoothRef,
  mobile,
  children,
}: {
  smoothRef: MutableRefObject<SmoothCursorState>;
  mobile: boolean;
  children: ReactNode;
}) {
  const depth = useRef(0);
  const [interactiveHover, setInteractiveHover] = useState(false);

  const beginInteractiveHover = useCallback(() => {
    depth.current += 1;
    if (depth.current === 1) setInteractiveHover(true);
  }, []);

  const endInteractiveHover = useCallback(() => {
    depth.current = Math.max(0, depth.current - 1);
    if (depth.current === 0) setInteractiveHover(false);
  }, []);

  const value = useMemo(
    () => ({
      smoothRef,
      mobile,
      interactiveHover,
      beginInteractiveHover,
      endInteractiveHover,
    }),
    [smoothRef, mobile, interactiveHover, beginInteractiveHover, endInteractiveHover],
  );

  return <MouseBridgeContext.Provider value={value}>{children}</MouseBridgeContext.Provider>;
}

export function useMouseBridge(): MouseBridgeValue {
  const ctx = useContext(MouseBridgeContext);
  if (!ctx) {
    throw new Error('useMouseBridge must be used within MouseBridgeProvider');
  }
  return ctx;
}
