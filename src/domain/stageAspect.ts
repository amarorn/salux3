export type StageAspectMode = 'totem' | 'presentation';

export const STAGE_TOTEM = { width: 1080, height: 1920 } as const;
export const STAGE_PRESENTATION = { width: 1920, height: 1080 } as const;

export function dimensionsForStageAspect(mode: StageAspectMode): { width: number; height: number } {
  return mode === 'totem'
    ? { width: STAGE_TOTEM.width, height: STAGE_TOTEM.height }
    : { width: STAGE_PRESENTATION.width, height: STAGE_PRESENTATION.height };
}
