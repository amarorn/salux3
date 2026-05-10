import { useEffect, useState } from 'react';

export interface StageScaleState {
  scale: number;
  offsetX: number;
  offsetY: number;
  viewportW: number;
  viewportH: number;
}

function compute(stageW: number, stageH: number): StageScaleState {
  if (typeof window === 'undefined') {
    return { scale: 1, offsetX: 0, offsetY: 0, viewportW: stageW, viewportH: stageH };
  }
  const w = window.innerWidth;
  const h = window.innerHeight;
  const scale = Math.min(w / stageW, h / stageH);
  const renderedW = stageW * scale;
  const renderedH = stageH * scale;
  return {
    scale,
    offsetX: (w - renderedW) / 2,
    offsetY: (h - renderedH) / 2,
    viewportW: w,
    viewportH: h,
  };
}

/**
 * Calcula a escala necessária para encaixar um palco de dimensões fixas
 * (stageW × stageH) dentro da janela, preservando aspect ratio (letterbox).
 */
export function useStageScale(stageW: number, stageH: number): StageScaleState {
  const [state, setState] = useState<StageScaleState>(() => compute(stageW, stageH));

  useEffect(() => {
    let frame = 0;
    const onResize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setState(compute(stageW, stageH)));
    };
    onResize();
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
  }, [stageW, stageH]);

  return state;
}
