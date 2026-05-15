import clsx from 'clsx';
import { usePresentationStore } from '@/store/presentationStore';
import type { StageAspectMode } from '@/domain/stageAspect';

const OPTIONS: { id: StageAspectMode; label: string; hint: string }[] = [
  { id: 'totem', label: 'Totem', hint: '9 : 16' },
  { id: 'presentation', label: 'PS', hint: '16 : 9' },
];

export function StageAspectPicker() {
  const mode = usePresentationStore((s) => s.stageAspectMode);
  const setMode = usePresentationStore((s) => s.setStageAspectMode);

  return (
    <div
      role="radiogroup"
      aria-label="Proporção do palco da apresentação"
      className="flex flex-col gap-1.5 rounded-xl border border-white/[0.08] bg-black/25 px-3 py-2.5 backdrop-blur-md"
    >
      <span className="px-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">
        Palco
      </span>
      <div className="flex gap-1">
        {OPTIONS.map((opt) => {
          const active = mode === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setMode(opt.id)}
              className={clsx(
                'flex min-w-[4.8rem] flex-col rounded-lg px-2.5 py-1.5 text-left transition-colors',
                active
                  ? 'bg-white/[0.12] ring-1 ring-white/25'
                  : 'bg-white/[0.03] hover:bg-white/[0.07]',
              )}
            >
              <span className="text-[12px] font-medium leading-tight text-white/90">{opt.label}</span>
              <span className="text-[10px] tabular-nums text-white/50">{opt.hint}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
