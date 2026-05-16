import type { ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePresentationStore } from "@/store/presentationStore";

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

type RevealPreset = {
  initial: Record<string, number | string>;
  animate: Record<string, number | string | (number | string)[]>;
  transition: { duration: number; ease: [number, number, number, number] };
};

const REVEAL_PRESETS: RevealPreset[] = [
  {
    initial: {
      opacity: 0,
      y: 22,
      scale: 0.94,
      rotate: -2.2,
      filter: "none",
    },
    animate: { opacity: 1, y: 0, scale: 1, rotate: 0, filter: "none" },
    transition: { duration: 0.58, ease: [0.16, 1, 0.3, 1] },
  },
  {
    initial: { opacity: 0, x: -28, skewX: 6, filter: "none" },
    animate: { opacity: 1, x: 0, skewX: 0, filter: "none" },
    transition: { duration: 0.62, ease: [0.12, 0.95, 0.22, 1] },
  },
  {
    initial: {
      opacity: 0,
      y: -18,
      scale: 1.08,
      rotate: 3.5,
      filter: "none",
    },
    animate: { opacity: 1, y: 0, scale: 1, rotate: 0, filter: "none" },
    transition: { duration: 0.55, ease: [0.22, 1, 0.28, 1] },
  },
  {
    initial: {
      opacity: 0,
      scale: 0.82,
      rotate: -5,
      filter: "saturate(1.4)",
    },
    animate: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      filter: "saturate(1)",
    },
    transition: { duration: 0.68, ease: [0.08, 0.92, 0.2, 1] },
  },
  {
    initial: { opacity: 0, x: 26, y: 10, scale: 0.96, filter: "none" },
    animate: { opacity: 1, x: 0, y: 0, scale: 1, filter: "none" },
    transition: { duration: 0.52, ease: [0.2, 1, 0.32, 1] },
  },
  {
    initial: { opacity: 0, y: 14, scale: 0.9, skewX: -5, filter: "none" },
    animate: { opacity: 1, y: 0, scale: 1, skewX: 0, filter: "none" },
    transition: { duration: 0.64, ease: [0.14, 1, 0.26, 1] },
  },
  {
    initial: { opacity: 0, rotateX: 12, y: 16, filter: "none" },
    animate: { opacity: 1, rotateX: 0, y: 0, filter: "none" },
    transition: { duration: 0.6, ease: [0.18, 1, 0.3, 1] },
  },
  {
    initial: { opacity: 0, scale: 0.88, rotate: 2.2, filter: "none" },
    animate: {
      opacity: 1,
      scale: [0.88, 1.04, 0.99, 1],
      rotate: 0,
      filter: "none",
    },
    transition: { duration: 0.72, ease: [0.1, 0.98, 0.22, 1] },
  },
];

function presetIndex(
  stepId: string,
  stepIndex: number,
  bandIndex: number,
): number {
  return (
    (hash(`${stepId}|${stepIndex}|${bandIndex}`) + bandIndex * 3) %
    REVEAL_PRESETS.length
  );
}

export function EraDrift({
  seed,
  children,
}: {
  seed: string;
  children: ReactNode;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;
  const h = hash(seed);
  const dur = 8.8 + (h % 7) * 0.35;
  return (
    <motion.div
      className="relative"
      animate={{
        y: [0, -2.2, 0.9, -1.1, 0],
        x: [0, 1.2, -0.9, 0.6, 0],
        rotate: [0, 0.28, -0.22, 0.12, 0],
      }}
      transition={{ duration: dur, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

interface EraRevealBandProps {
  bandId: string;
  bandIndex: number;
  stepId: string;
  stepIndex: number;
  eraStaging: boolean;
  active: boolean;
  /** `single`: só nesta fase (a anterior some). `cumulative` (default): esta fase e todas as anteriores. */
  reveal?: "cumulative" | "single";
  style?: React.CSSProperties;
  className?: string;
  children: ReactNode;
}

export function EraRevealBand({
  bandId,
  bandIndex,
  stepId,
  stepIndex,
  eraStaging,
  active,
  reveal = "cumulative",
  style,
  className,
  children,
}: EraRevealBandProps) {
  const reduce = useReducedMotion();
  const currentStepId = usePresentationStore((s) => s.currentStepId);
  const trackedId = usePresentationStore((s) => s.eraStagedRevealStepId);
  const phase = usePresentationStore((s) => s.eraStagedRevealPhase);

  if (!eraStaging) {
    return <>{children}</>;
  }

  if (!active) {
    if (reduce) return <>{children}</>;
    return <EraDrift seed={`${stepId}:${bandId}:idle`}>{children}</EraDrift>;
  }

  const showAll =
    stepId !== currentStepId ||
    trackedId !== stepId ||
    (reduce && reveal !== "single");
  const visible =
    showAll ||
    (reveal === "single" ? phase === bandIndex : phase >= bandIndex);
  const preset = REVEAL_PRESETS[presetIndex(stepId, stepIndex, bandIndex)]!;

  return (
    <AnimatePresence initial={false}>
      {visible && (
        <motion.div
          key={`${stepId}-${bandId}`}
          initial={reduce ? false : preset.initial}
          animate={reduce ? { opacity: 1 } : preset.animate}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          transition={reduce ? { duration: 0 } : preset.transition}
          style={{ transformOrigin: "50% 20%", perspective: 900, ...style }}
          className={className}
        >
          <EraDrift seed={`${stepId}:${bandId}:${bandIndex}`}>
            {children}
          </EraDrift>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
