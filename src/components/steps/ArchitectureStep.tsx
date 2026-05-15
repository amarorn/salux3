import { useContext } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Brain, Database, ShieldCheck, Wrench } from "lucide-react";
import { FloatingCard, FloatingCardContext } from "../FloatingCard";
import { AnimatedRiskCurve } from "../visuals/AnimatedRiskCurve";
import { KpiCards } from "../visuals/KpiCards";
import { theme } from "@/domain/theme";
import type { PresentationStep } from "@/domain/types";
import { getCardTextVariants } from "./cardTextMotion";

interface Props {
  step: PresentationStep;
  active: boolean;
}

const LAYERS = [
  {
    icon: Brain,
    label: "Raciocínio",
    desc: "Orquestrador + LLMs",
    accent: "#7c3aed",
  },
  {
    icon: Wrench,
    label: "Ferramentas",
    desc: "Adapters tipados (EHR, RIS, LIS)",
    accent: "#06b6d4",
  },
  {
    icon: Database,
    label: "Dados",
    desc: "Feature store + memória vetorial",
    accent: "#10b981",
  },
  {
    icon: ShieldCheck,
    label: "Governança",
    desc: "Políticas, auditoria, kill switch",
    accent: "#f59e0b",
  },
];

export function ArchitectureStep({ step, active }: Props) {
  const reduceMotion = useReducedMotion();
  const flipPhoto = useContext(FloatingCardContext)?.flipPhoto ?? false;
  const { container, item } = getCardTextVariants(
    Boolean(reduceMotion),
    step.index,
    `${step.id}:${step.title}`,
    flipPhoto,
  );
  const minimal = Boolean(step.content.architectureMinimal);
  const accent = theme.accents[step.accent];
  const hasRichMetrics =
    step.content.metrics &&
    step.content.metrics.length > 0 &&
    step.content.metrics.some(
      (m) => m.trend || m.label || m.delta !== undefined,
    );

  return (
    <FloatingCard
      accent={step.accent}
      active={active}
      stepId={step.id}
      badge={step.content.headline ?? String(step.index + 1).padStart(2, "0")}
      width={minimal ? 680 : 620}
    >
      <motion.div
        className="flex flex-col gap-6"
        variants={container}
        initial={reduceMotion ? false : "hidden"}
        animate={active ? "visible" : "hidden"}
      >
        <motion.div variants={item}>
          <h2 className="font-display text-[28px] font-bold leading-[1.15] tracking-tight text-white">
            {step.title}
          </h2>
        </motion.div>

        {!minimal && (
          <motion.div variants={item} className="space-y-2.5">
            {LAYERS.map((layer, i) => (
              <motion.div
                key={layer.label}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.15 + i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 shadow-soft"
              >
                <div
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
                  style={{ background: `${layer.accent}18` }}
                >
                  <layer.icon
                    className="h-5 w-5"
                    style={{ color: layer.accent }}
                    strokeWidth={1.8}
                  />
                </div>
                <div className="flex-1">
                  <p className="text-[1.02rem] font-semibold text-white">
                    {layer.label}
                  </p>
                  <p className="text-xs text-slate-400">{layer.desc}</p>
                </div>
                <div
                  className="h-2 w-16 overflow-hidden rounded-full"
                  style={{ background: `${layer.accent}1f` }}
                >
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{
                      delay: 0.4 + i * 0.08,
                      duration: 0.7,
                      ease: "easeOut",
                    }}
                    className="h-full rounded-full"
                    style={{ background: layer.accent }}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {step.content.body && (
          <motion.p
            variants={item}
            className="text-[1.02rem] leading-relaxed text-slate-300 whitespace-pre-line"
          >
            {step.content.body}
          </motion.p>
        )}

        {hasRichMetrics && (
          <motion.div variants={item}>
            <KpiCards
              items={step.content.metrics!}
              active={active}
              reducedMotion={Boolean(reduceMotion)}
              accentColor={accent.base}
            />
          </motion.div>
        )}

        {minimal && step.content.bullets && step.content.bullets.length > 0 && (
          <motion.div variants={item} className="grid gap-3 sm:grid-cols-2">
            {step.content.bullets.map((line, i) => (
              <motion.div
                key={`${line}-${i}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.12 + i * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="rounded-2xl border border-violet-400/20 bg-gradient-to-br from-violet-500/[0.07] to-transparent px-4 py-3 shadow-soft"
              >
                <p className="text-[13px] leading-snug text-slate-100">
                  {line}
                </p>
              </motion.div>
            ))}
          </motion.div>
        )}

        {step.content.visual?.type === "risk-curve" && (
          <motion.div variants={item}>
            <AnimatedRiskCurve active={active} />
          </motion.div>
        )}
      </motion.div>
    </FloatingCard>
  );
}
