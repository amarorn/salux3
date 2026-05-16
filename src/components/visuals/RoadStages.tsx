import { useMemo } from "react";
import clsx from "clsx";
import { motion, useReducedMotion } from "framer-motion";
import type { ValueStage } from "@/domain/types";
import { EraRevealBand } from "@/components/motion/EraAgenticaReveal";
import { usePresentationStore } from "@/store/presentationStore";

interface RoadStagesProps {
  stages: ValueStage[];
  accentColor: string;
  stepId: string;
  stepIndex: number;
  active: boolean;
  bandIndexFor: (bandId: string) => number;
  /** Índice do marco com overlay expandido (ampliar imagem/conteúdo). */
  spotlightIndex?: number | null;
  onStageToggle?: (index: number) => void;
  setStageButtonRef?: (index: number, el: HTMLButtonElement | null) => void;
}

interface Point {
  x: number;
  y: number;
}

const STAGE_W = 240;
const SIDE_PAD = 90;
const HEIGHT = 320;
const Y_CENTER = HEIGHT / 2;
const WAVE_AMP = 80;

function isNegativeStageMarker(number: string): boolean {
  const p = number.trim();
  return p === "✕" || p === "×" || p === "✗";
}

function computePoints(count: number): Point[] {
  const points: Point[] = [];
  for (let i = 0; i < count; i++) {
    const x = SIDE_PAD + i * STAGE_W + STAGE_W / 2;
    const t = count > 1 ? i / (count - 1) : 0;
    const phase = t * Math.PI * (count >= 4 ? 1.2 : 1);
    const waveDamp = 1 - 0.5 * t * t;
    const y =
      Y_CENTER -
      Math.sin(phase + 0.5) * WAVE_AMP * waveDamp -
      t * 92 -
      t * t * 38;
    points.push({ x, y });
  }
  return points;
}

function buildSmoothPath(points: Point[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0]!.x} ${points[0]!.y}`;
  const p = points;
  let d = `M ${p[0]!.x} ${p[0]!.y}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] ?? p[i]!;
    const p1 = p[i]!;
    const p2 = p[i + 1]!;
    const p3 = p[i + 2] ?? p2;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

export function RoadStages({
  stages,
  accentColor,
  stepId,
  stepIndex,
  active,
  bandIndexFor,
  spotlightIndex = null,
  onStageToggle,
  setStageButtonRef,
}: RoadStagesProps) {
  const reduce = useReducedMotion();
  const currentStepId = usePresentationStore((s) => s.currentStepId);
  const trackedId = usePresentationStore((s) => s.eraStagedRevealStepId);
  const phase = usePresentationStore((s) => s.eraStagedRevealPhase);

  const count = stages.length;
  const points = useMemo(() => {
    const base = computePoints(count);
    if (base.length === 0) return base;
    const lastStage = stages[count - 1];
    if (lastStage && isNegativeStageMarker(lastStage.number)) {
      const last = base.length - 1;
      return base.map((p, i) =>
        i === last ? { ...p, y: p.y - 28 } : p
      );
    }
    return base;
  }, [count, stages]);
  const viewBoxW = SIDE_PAD * 2 + STAGE_W * count;
  const pathD = useMemo(() => buildSmoothPath(points), [points]);

  const revealedCount = (() => {
    if (!active) return 0;
    const off =
      stepId !== currentStepId || trackedId !== stepId || reduce;
    if (off) return count;
    const firstBand = bandIndexFor("roadStage0");
    if (firstBand < 0) return count;
    const r = phase - firstBand + 1;
    return Math.max(0, Math.min(count, r));
  })();

  const progressRatio = count > 1 ? (revealedCount - 1) / (count - 1) : 1;
  const progress = Math.max(0, Math.min(1, progressRatio));

  return (
    <div className="relative w-full">
      <div
        className="relative mx-auto"
        style={{ width: "100%", maxWidth: "min(100%, 920px)" }}
      >
        <svg
          viewBox={`0 0 ${viewBoxW} ${HEIGHT}`}
          width="100%"
          height="auto"
          preserveAspectRatio="xMidYMid meet"
          className="block"
          aria-hidden
        >
          <defs>
            <linearGradient
              id={`road-${stepId}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor={accentColor} stopOpacity="0.15" />
              <stop offset="18%" stopColor={accentColor} stopOpacity="0.72" />
              <stop offset="88%" stopColor={accentColor} stopOpacity="0.92" />
              <stop offset="100%" stopColor={accentColor} stopOpacity="0.68" />
            </linearGradient>
          </defs>

          <motion.path
            d={pathD}
            stroke={`url(#road-${stepId})`}
            strokeWidth={4}
            fill="none"
            strokeLinecap="round"
            initial={false}
            animate={{ pathLength: progress }}
            transition={{
              duration: reduce ? 0 : 1.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              filter: `drop-shadow(0 0 8px ${accentColor}88)`,
            }}
          />

          {revealedCount > 0 &&
            revealedCount <= count &&
            (() => {
              const p = points[revealedCount - 1]!;
              return (
                <motion.circle
                  cx={p.x}
                  cy={p.y}
                  r={10}
                  fill="none"
                  stroke={accentColor}
                  strokeWidth={1.5}
                  initial={reduce ? false : { opacity: 0.7, scale: 0.6 }}
                  animate={
                    reduce
                      ? { opacity: 0 }
                      : { opacity: [0.6, 0, 0.6], scale: [0.6, 2.2, 0.6] }
                  }
                  transition={
                    reduce
                      ? { duration: 0 }
                      : {
                          duration: 2.4,
                          ease: "easeOut",
                          repeat: Infinity,
                        }
                  }
                />
              );
            })()}
        </svg>

        <div className="absolute inset-0">
          {stages.map((stage, i) => {
            const p = points[i]!;
            const leftPct = (p.x / viewBoxW) * 100;
            const topPct = (p.y / HEIGHT) * 100;
            const labelBelow = i % 2 === 0;
            return (
              <div
                key={`${stage.label}-${i}`}
                className="absolute"
                style={{
                  left: `${leftPct}%`,
                  top: `${topPct}%`,
                  transform: "translate(-50%, -50%)",
                  width: "min(170px, 22vw)",
                }}
              >
                <EraRevealBand
                  bandId={`roadStage${i}`}
                  bandIndex={bandIndexFor(`roadStage${i}`)}
                  stepId={stepId}
                  stepIndex={stepIndex}
                  eraStaging
                  active={active}
                >
                  {onStageToggle ? (
                    <button
                      type="button"
                      ref={(el) => setStageButtonRef?.(i, el)}
                      disabled={!active}
                      aria-expanded={spotlightIndex === i}
                      aria-label={`Ampliar: ${stage.label}`}
                      data-no-click-advance
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!active) return;
                        onStageToggle(i);
                      }}
                      className={clsx(
                        "flex w-full flex-col items-center rounded-2xl border border-transparent bg-transparent p-1.5 text-center outline-none transition-opacity",
                        labelBelow ? "" : "flex-col-reverse",
                        spotlightIndex !== null &&
                          spotlightIndex !== i &&
                          "opacity-[0.38]",
                        active && "cursor-pointer hover:border-white/14",
                        "focus-visible:ring-2 focus-visible:ring-white/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[#06080f]",
                      )}
                    >
                      <div
                        className="relative flex h-16 w-16 items-center justify-center rounded-full"
                        style={{
                          background: isNegativeStageMarker(stage.number)
                            ? "radial-gradient(circle at 30% 28%, rgba(6, 182, 212, 0.12) 0%, rgba(213, 7, 27, 0.1) 57%, rgba(11, 13, 18, 0.35) 100%)"
                            : `radial-gradient(circle at 32% 26%, ${accentColor}22 0%, ${accentColor}0d 52%, rgba(11,13,18,0.25) 100%)`,
                          boxShadow: isNegativeStageMarker(stage.number)
                            ? "0 10px 28px rgba(0,0,0,0.55), 0 0 28px rgba(213, 7, 27, 0.22)"
                            : `0 10px 28px rgba(0,0,0,0.5), 0 0 22px ${accentColor}55`,
                        }}
                      >
                        <span
                          className="text-[1.35rem] font-bold leading-none"
                          style={{
                            color: isNegativeStageMarker(stage.number)
                              ? "rgba(251, 4, 4, 1)"
                              : accentColor,
                            textShadow: isNegativeStageMarker(stage.number)
                              ? "0 0 16px rgba(251, 4, 4, 0.67)"
                              : `0 0 16px ${accentColor}aa`,
                          }}
                        >
                          {stage.number}
                        </span>
                      </div>

                      <div
                        className={clsx(
                          "text-center",
                          labelBelow ? "mt-3" : "mb-3",
                        )}
                      >
                        <span
                          className="block text-[11px] font-semibold uppercase tracking-[0.24em]"
                          style={{ color: accentColor, opacity: 0.95 }}
                        >
                          {stage.label}
                        </span>
                        {stage.description && (
                          <p className="mt-1 text-[0.78rem] leading-snug text-white/72">
                            {stage.description}
                          </p>
                        )}
                      </div>
                    </button>
                  ) : (
                    <div
                      className={`flex flex-col items-center ${labelBelow ? "" : "flex-col-reverse"}`}
                    >
                      <div
                        className="relative flex h-16 w-16 items-center justify-center rounded-full"
                        style={{
                          background: isNegativeStageMarker(stage.number)
                            ? "radial-gradient(circle at 30% 28%, rgba(6, 182, 212, 0.12) 0%, rgba(213, 7, 27, 0.1) 57%, rgba(11, 13, 18, 0.35) 100%)"
                            : `radial-gradient(circle at 32% 26%, ${accentColor}22 0%, ${accentColor}0d 52%, rgba(11,13,18,0.25) 100%)`,
                          boxShadow: isNegativeStageMarker(stage.number)
                            ? "0 10px 28px rgba(0,0,0,0.55), 0 0 28px rgba(213, 7, 27, 0.22)"
                            : `0 10px 28px rgba(0,0,0,0.5), 0 0 22px ${accentColor}55`,
                        }}
                      >
                        <span
                          className="text-[1.35rem] font-bold leading-none"
                          style={{
                            color: isNegativeStageMarker(stage.number)
                              ? "rgba(251, 4, 4, 1)"
                              : accentColor,
                            textShadow: isNegativeStageMarker(stage.number)
                              ? "0 0 16px rgba(251, 4, 4, 0.67)"
                              : `0 0 16px ${accentColor}aa`,
                          }}
                        >
                          {stage.number}
                        </span>
                      </div>

                      <div
                        className={`${labelBelow ? "mt-3" : "mb-3"} text-center`}
                      >
                        <span
                          className="block text-[11px] font-semibold uppercase tracking-[0.24em]"
                          style={{ color: accentColor, opacity: 0.95 }}
                        >
                          {stage.label}
                        </span>
                        {stage.description && (
                          <p className="mt-1 text-[0.78rem] leading-snug text-white/72">
                            {stage.description}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </EraRevealBand>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
