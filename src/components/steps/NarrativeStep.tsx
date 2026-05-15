import {
  forwardRef,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import {
  Building2,
  Link as LinkIcon,
  Users,
  Microscope,
  TrendingDown,
  Landmark,
  Plus,
  type LucideIcon,
} from "lucide-react";

const PAIN_POINT_ICONS: Record<string, LucideIcon> = {
  "building-2": Building2,
  link: LinkIcon,
  users: Users,
  microscope: Microscope,
  "trending-down": TrendingDown,
  landmark: Landmark,
  plus: Plus,
};
import { FloatingCard, FloatingCardContext } from "../FloatingCard";
import type { PresentationStep } from "@/domain/types";
import { theme } from "@/domain/theme";
import { AnimatedRiskCurve } from "../visuals/AnimatedRiskCurve";
import { AnimatedNarrativeMetrics } from "../visuals/AnimatedNarrativeMetrics";
import { KpiCards } from "../visuals/KpiCards";
import { EvidenceMetricCard } from "../visuals/EvidenceMetricCard";
import { EvidenceGaugeCard } from "../visuals/EvidenceGaugeCard";
import { EvidenceRangeCard } from "../visuals/EvidenceRangeCard";
import { getCardTextVariants } from "./cardTextMotion";
import {
  ClosingHighlight,
  EvidenceCardBlock,
  HighlightPhraseList,
} from "./HighlightBlocks";
import { usePresentationStore } from "@/store/presentationStore";
import { EraRevealBand } from "@/components/motion/EraAgenticaReveal";
import { buildNarrativeBandKeys } from "@/lib/eraAgenticaRevealBands";

interface Props {
  step: PresentationStep;
  active: boolean;
}

export function NarrativeStep({ step, active }: Props) {
  const accent = theme.accents[step.accent];
  const reduceMotion = useReducedMotion();
  const flipPhoto = useContext(FloatingCardContext)?.flipPhoto ?? false;
  const trackId = useContext(FloatingCardContext)?.trackId;
  const eraStaging = trackId === "era-agentica";
  const { container, item } = getCardTextVariants(
    Boolean(reduceMotion),
    step.index,
    `${step.id}:${step.title}`,
    flipPhoto,
  );
  const painPoints = step.content.painPointsLayout;
  const useBalloon = painPoints && step.content.painPointsBalloon;
  const bandKeys = useMemo(
    () =>
      buildNarrativeBandKeys(
        step.content,
        Boolean(painPoints),
        Boolean(useBalloon),
      ),
    [step.content, painPoints, useBalloon],
  );
  const b = (id: string) => bandKeys.indexOf(id);
  const setEraCfg = usePresentationStore((s) => s.setEraStagedRevealConfig);
  const clearEra = usePresentationStore((s) => s.clearEraStagedReveal);
  const stagingLayout = Boolean(active && eraStaging && !reduceMotion);
  const innerMotion = stagingLayout ? {} : { variants: item };
  const outerContainer: Variants = stagingLayout
    ? { hidden: {}, visible: {} }
    : container;

  useLayoutEffect(() => {
    if (!active || !eraStaging) return;
    if (reduceMotion) {
      setEraCfg(step.id, 1);
      return () => {
        if (usePresentationStore.getState().eraStagedRevealStepId === step.id)
          clearEra();
      };
    }
    setEraCfg(step.id, bandKeys.length);
    return () => {
      if (usePresentationStore.getState().eraStagedRevealStepId === step.id)
        clearEra();
    };
  }, [
    active,
    eraStaging,
    reduceMotion,
    step.id,
    bandKeys.length,
    setEraCfg,
    clearEra,
  ]);

  const [balloonOpen, setBalloonOpen] = useState(false);
  const [tracerActive, setTracerActive] = useState(false);
  const [impactActive, setImpactActive] = useState(false);
  const [valueStageSpotlight, setValueStageSpotlight] = useState<number | null>(
    null,
  );
  const triggerRef = useRef<HTMLButtonElement>(null);
  const stageRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Fecha o balão e reseta o tracer quando o slide deixa de estar ativo
  useEffect(() => {
    if (!active) {
      setBalloonOpen(false);
      setTracerActive(false);
      setImpactActive(false);
      setValueStageSpotlight(null);
    }
  }, [active]);

  const handleTriggerClick = () => {
    if (reduceMotion) {
      setBalloonOpen(true);
      return;
    }
    if (tracerActive || balloonOpen) return;
    setTracerActive(true);
  };

  const handleTracerArrive = () => {
    setTracerActive(false);
    setImpactActive(true);
    // Pequeno atraso para o impacto antes do balão abrir
    window.setTimeout(() => {
      setImpactActive(false);
      setBalloonOpen(true);
    }, 320);
  };

  // ESC fecha o balão
  useEffect(() => {
    if (!balloonOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setBalloonOpen(false);
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [balloonOpen]);

  useEffect(() => {
    if (valueStageSpotlight === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setValueStageSpotlight(null);
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [valueStageSpotlight]);

  const hero = step.content.heroImage;

  return (
    <FloatingCard
      accent={step.accent}
      active={active}
      stepId={step.id}
      sidePhotoSrc={hero?.src}
      sidePhotoAlt={hero?.alt}
      cardVisual={step.content.cardVisual}
      hideValueFlow={true}
      width={
        painPoints
          ? step.content.painPointsGridCols === 4
            ? 960
            : step.content.painPointsGridCols === 3
              ? 820
              : 640
          : step.content.dualStages
            ? 900
            : step.content.valueStages && step.content.valueStages.length >= 4
              ? step.content.valueStages.length >= 6 ||
                step.content.valueStagesGridCols === 4
                ? 880
                : 760
              : undefined
      }
      badge={
        painPoints
          ? String(step.index + 1).padStart(2, "0")
          : (step.content.headline ?? String(step.index + 1).padStart(2, "0"))
      }
    >
      <motion.div
        className="flex flex-col gap-5"
        variants={outerContainer}
        initial={reduceMotion ? false : "hidden"}
        animate={active ? "visible" : "hidden"}
      >
        {painPoints && step.content.headline ? (
          <EraRevealBand
            bandId="title"
            bandIndex={b("title")}
            stepId={step.id}
            stepIndex={step.index}
            eraStaging={eraStaging}
            active={active}
          >
            <motion.div {...innerMotion} className="space-y-3">
              <span
                className="block text-[10px] font-semibold uppercase tracking-[0.32em]"
                style={{ color: accent.base, opacity: 0.85 }}
              >
                {step.title}
              </span>
              <h2
                className="presentation-ppt-title max-w-[20ch] text-[clamp(1.9rem,4.2vw,2.9rem)] leading-[1.08]"
                style={{ textShadow: `0 0 28px ${accent.base}22` }}
              >
                {step.content.headline}
              </h2>
            </motion.div>
          </EraRevealBand>
        ) : (
          <EraRevealBand
            bandId="title"
            bandIndex={b("title")}
            stepId={step.id}
            stepIndex={step.index}
            eraStaging={eraStaging}
            active={active}
          >
            <motion.div {...innerMotion}>
              <h2 className="presentation-ppt-title max-w-[24ch] text-[clamp(1.8rem,4vw,2.55rem)]">
                {step.title}
              </h2>
            </motion.div>
          </EraRevealBand>
        )}

        {step.content.metrics && step.content.metrics.length > 0 && (
          <EraRevealBand
            bandId="metrics"
            bandIndex={b("metrics")}
            stepId={step.id}
            stepIndex={step.index}
            eraStaging={eraStaging}
            active={active}
          >
            <motion.div {...innerMotion}>
              {step.content.metrics.some(
                (m) => m.trend || m.label || m.delta !== undefined,
              ) ? (
                <KpiCards
                  items={step.content.metrics}
                  active={active}
                  reducedMotion={Boolean(reduceMotion)}
                  accentColor={accent.base}
                />
              ) : (
                <AnimatedNarrativeMetrics
                  items={step.content.metrics}
                  active={active}
                  reducedMotion={Boolean(reduceMotion)}
                  accentColor={accent.base}
                />
              )}
            </motion.div>
          </EraRevealBand>
        )}

        {step.content.lead && (
          <EraRevealBand
            bandId="lead"
            bandIndex={b("lead")}
            stepId={step.id}
            stepIndex={step.index}
            eraStaging={eraStaging}
            active={active}
          >
            <motion.p
              {...innerMotion}
              className="presentation-ppt-body max-w-prose whitespace-pre-line text-slate-100/95"
            >
              {step.content.lead}
            </motion.p>
          </EraRevealBand>
        )}

        {step.content.contrastPair && (
          <EraRevealBand
            bandId="contrastPair"
            bandIndex={b("contrastPair")}
            stepId={step.id}
            stepIndex={step.index}
            eraStaging={eraStaging}
            active={active}
          >
            <motion.div {...innerMotion} className="flex w-full gap-3">
              {(["left", "right"] as const).map((side, idx) => {
                const it = step.content.contrastPair![side];
                const c =
                  it.tone === "cool"
                    ? theme.accents.emerald
                    : trackId === "assistencial"
                      ? theme.accents.amber
                      : theme.accents.rose;
                return (
                  <motion.div
                    key={side}
                    className="relative flex-1 overflow-hidden rounded-xl border px-4 py-3.5"
                    style={{
                      borderColor: `${c.base}44`,
                      background: `linear-gradient(135deg, ${c.base}1a 0%, rgba(255,255,255,0.02) 70%)`,
                      boxShadow: `inset 0 1px 0 rgba(255,255,255,0.06)`,
                    }}
                    initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                    animate={
                      active
                        ? { opacity: 1, y: 0 }
                        : reduceMotion
                          ? undefined
                          : { opacity: 0, y: 8 }
                    }
                    transition={{
                      duration: 0.55,
                      ease: [0.22, 1, 0.36, 1],
                      delay: 0.45 + idx * 0.15,
                    }}
                  >
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-x-3 -top-px h-px"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${c.base}, transparent)`,
                      }}
                    />
                    <div className="mb-1.5 flex items-center gap-2">
                      {it.icon && (
                        <span
                          aria-hidden
                          className="text-[13px]"
                          style={{ filter: `drop-shadow(0 0 8px ${c.base}55)` }}
                        >
                          {it.icon}
                        </span>
                      )}
                      <span
                        className="text-[10px] font-semibold uppercase tracking-[0.32em]"
                        style={{ color: c.base }}
                      >
                        {it.label}
                      </span>
                    </div>
                    <p className="text-[1.03rem] leading-relaxed text-white/90 whitespace-pre-line">
                      {it.text}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>
          </EraRevealBand>
        )}

        {step.content.valueStages && step.content.valueStages.length > 0 && (
          <EraRevealBand
            bandId="valueStages"
            bandIndex={b("valueStages")}
            stepId={step.id}
            stepIndex={step.index}
            eraStaging={eraStaging}
            active={active}
          >
            <motion.div
              {...innerMotion}
              className="relative space-y-3 overflow-visible py-1"
            >
              {step.content.valueStagesLead && (
                <p
                  className="whitespace-pre-line text-[1.05rem] leading-relaxed text-slate-100/95"
                  style={{ textShadow: `0 0 18px ${accent.base}1f` }}
                >
                  {step.content.valueStagesLead}
                </p>
              )}
              <div
                className="grid gap-2.5"
                style={{
                  gridTemplateColumns: `repeat(${
                    step.content.valueStagesGridCols ??
                    step.content.valueStages.length
                  }, minmax(0, 1fr))`,
                }}
              >
                {step.content.valueStages.map((stage, i) => {
                  const intensity = step.content.valueStagesFlat
                    ? 0.85
                    : 0.55 +
                      (i / Math.max(step.content.valueStages!.length - 1, 1)) *
                        0.45;
                  const hex = (mult: number) =>
                    Math.round(intensity * mult)
                      .toString(16)
                      .padStart(2, "0");
                  const dimmed =
                    valueStageSpotlight !== null && valueStageSpotlight !== i;
                  const focused = valueStageSpotlight === i;
                  return (
                    <motion.div
                      ref={(el) => {
                        stageRefs.current[i] = el;
                      }}
                      key={`${stage.number}-${stage.label}`}
                      data-no-click-advance
                      role="button"
                      tabIndex={0}
                      aria-expanded={focused}
                      aria-label={`Destacar: ${stage.label}`}
                      className="relative cursor-pointer overflow-hidden rounded-xl border px-3.5 py-3 outline-none transition-[border-color,box-shadow,background] duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/45"
                      style={{
                        borderColor: focused
                          ? `${accent.base}aa`
                          : `${accent.base}${hex(95)}`,
                        background: `linear-gradient(160deg, ${accent.base}${hex(30)} 0%, rgba(255,255,255,0.02) 70%)`,
                        boxShadow: focused
                          ? `inset 0 1px 0 rgba(255,255,255,0.1), 0 0 0 1px ${accent.base}55, 0 16px 40px -8px ${accent.base}44`
                          : `inset 0 1px 0 rgba(255,255,255,0.05), 0 8px 24px -16px ${accent.base}${hex(88)}`,
                      }}
                      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                      animate={
                        !active
                          ? reduceMotion
                            ? undefined
                            : { opacity: 0, y: 12 }
                          : dimmed
                            ? {
                                opacity: 0.35,
                                scale: 0.97,
                                transition: {
                                  duration: 0.32,
                                  ease: [0.22, 1, 0.36, 1],
                                },
                              }
                            : {
                                opacity: 1,
                                scale: 1,
                                y: 0,
                                transition: {
                                  duration: 0.55,
                                  ease: [0.22, 1, 0.36, 1],
                                  delay:
                                    active && valueStageSpotlight === null
                                      ? 0.45 + i * 0.12
                                      : 0,
                                },
                              }
                      }
                      whileTap={reduceMotion ? undefined : { scale: 0.96 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setValueStageSpotlight((s) => (s === i ? null : i));
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setValueStageSpotlight((s) => (s === i ? null : i));
                        }
                      }}
                    >
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-x-3 -top-px h-px"
                        style={{
                          background: `linear-gradient(90deg, transparent, ${accent.base}, transparent)`,
                        }}
                      />
                      <div className="flex items-baseline gap-1.5">
                        <span
                          className="font-display text-[1.03rem] font-bold tabular-nums"
                          style={{
                            color: accent.base,
                            textShadow: `0 0 12px ${accent.base}66`,
                          }}
                        >
                          {stage.number}
                        </span>
                        <span
                          className="text-[11px] font-semibold uppercase tracking-[0.22em]"
                          style={{ color: accent.base, opacity: 0.9 }}
                        >
                          {stage.label}
                        </span>
                      </div>
                      {stage.description && (
                        <p className="mt-2 text-[0.96rem] leading-relaxed text-slate-100/92">
                          {stage.description} {stage.mediaUrl && <>(Vídeo)</>}
                        </p>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              <AnimatePresence>
                {valueStageSpotlight !== null &&
                  step.content.valueStages[valueStageSpotlight] !==
                    undefined && (
                    <ExpandedChip
                      key={`stage-expanded-${valueStageSpotlight}`}
                      text={
                        step.content.valueStages[valueStageSpotlight]!.label
                      }
                      accentColor={accent.base}
                      reducedMotion={Boolean(reduceMotion)}
                      origin={stageRefs.current[valueStageSpotlight] ?? null}
                      onClose={() => setValueStageSpotlight(null)}
                      prefix={
                        step.content.valueStages[valueStageSpotlight]!.number
                      }
                      description={
                        step.content.valueStages[valueStageSpotlight]!
                          .description || undefined
                      }
                      mediaUrl={
                        step.content.valueStages[valueStageSpotlight]!
                          .mediaUrl || undefined
                      }
                      isPlayingMedia={
                        valueStageSpotlight === valueStageSpotlight
                      }
                    />
                  )}
              </AnimatePresence>
            </motion.div>
          </EraRevealBand>
        )}

        {step.content.evidenceMetrics &&
          step.content.evidenceMetrics.length > 0 && (
            <EraRevealBand
              bandId="evidenceMetrics"
              bandIndex={b("evidenceMetrics")}
              stepId={step.id}
              stepIndex={step.index}
              eraStaging={eraStaging}
              active={active}
            >
              <motion.div {...innerMotion} className="space-y-3">
                {step.content.evidenceMetrics.map((m, i) => {
                  if (m.style === "range") {
                    return (
                      <EvidenceRangeCard
                        key={`${m.value}-${i}`}
                        badge={m.badge}
                        prefix={m.prefix}
                        value={m.value}
                        rangeEnd={m.rangeEnd}
                        valueLabel={m.valueLabel}
                        rangeMax={m.rangeMax}
                        decimals={m.decimals}
                        headline={m.headline}
                        context={m.context}
                        accentColor={accent.base}
                        active={active}
                        delay={i * 0.45}
                      />
                    );
                  }
                  const Card =
                    m.style === "gauge"
                      ? EvidenceGaugeCard
                      : EvidenceMetricCard;
                  return (
                    <Card
                      key={`${m.value}-${i}`}
                      badge={m.badge}
                      prefix={m.prefix}
                      value={m.value}
                      decimals={m.decimals}
                      unit={m.unit}
                      headline={m.headline}
                      context={m.context}
                      accentColor={accent.base}
                      active={active}
                      delay={i * 0.45}
                    />
                  );
                })}
              </motion.div>
            </EraRevealBand>
          )}

        {step.content.dualStages && (
          <EraRevealBand
            bandId="dualStages"
            bandIndex={b("dualStages")}
            stepId={step.id}
            stepIndex={step.index}
            eraStaging={eraStaging}
            active={active}
          >
            <motion.div {...innerMotion} className="space-y-5">
              {(["positive", "negative"] as const).map((group, gi) => {
                const cfg = step.content.dualStages![group];
                const c =
                  group === "positive"
                    ? theme.accents.emerald
                    : theme.accents.rose;
                const icon = group === "positive" ? "✓" : "⚠";
                return (
                  <div key={group} className="space-y-2.5">
                    <p
                      className="text-[1.02rem] font-semibold leading-relaxed"
                      style={{
                        color: c.base,
                        textShadow: `0 0 16px ${c.base}1f`,
                      }}
                    >
                      {cfg.lead}
                    </p>
                    <div
                      className="grid gap-2"
                      style={{
                        gridTemplateColumns: `repeat(${cfg.gridCols ?? cfg.items.length}, minmax(0, 1fr))`,
                      }}
                    >
                      {cfg.items.map((it, i) => (
                        <motion.div
                          key={`${it.label}-${i}`}
                          className="relative overflow-hidden rounded-lg border px-3 py-2.5"
                          style={{
                            borderColor: `${c.base}55`,
                            background: `linear-gradient(135deg, ${c.base}18 0%, rgba(255,255,255,0.02) 70%)`,
                            boxShadow: `inset 0 1px 0 rgba(255,255,255,0.05)`,
                          }}
                          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                          animate={
                            active
                              ? { opacity: 1, y: 0 }
                              : reduceMotion
                                ? undefined
                                : { opacity: 0, y: 8 }
                          }
                          transition={{
                            duration: 0.45,
                            ease: [0.22, 1, 0.36, 1],
                            delay: 0.4 + gi * 0.15 + i * 0.06,
                          }}
                        >
                          <span
                            aria-hidden
                            className="pointer-events-none absolute inset-x-3 -top-px h-px"
                            style={{
                              background: `linear-gradient(90deg, transparent, ${c.base}, transparent)`,
                            }}
                          />
                          <div className="flex items-start gap-2">
                            <span
                              aria-hidden
                              className="mt-0.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded text-[11px] font-bold"
                              style={{
                                background: c.base,
                                color: "#0b0f1a",
                                boxShadow: `0 0 10px ${c.base}66`,
                              }}
                            >
                              {icon}
                            </span>
                            <p className="text-[0.94rem] font-medium leading-relaxed text-white/95">
                              {it.label}
                              {it.description && (
                                <span className="block text-[0.86rem] font-normal text-slate-300/85">
                                  {it.description}
                                </span>
                              )}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </EraRevealBand>
        )}

        {step.content.body && !painPoints && (
          <EraRevealBand
            bandId="body"
            bandIndex={b("body")}
            stepId={step.id}
            stepIndex={step.index}
            eraStaging={eraStaging}
            active={active}
          >
            <motion.p
              {...innerMotion}
              className="presentation-ppt-body whitespace-pre-line"
            >
              {step.content.body}
            </motion.p>
          </EraRevealBand>
        )}

        {step.content.bullets &&
          step.content.bullets.length > 0 &&
          typeof step.content.bulletSplitAfter === "number" &&
          step.content.bulletSplitAfter > 0 &&
          step.content.bullets.length > step.content.bulletSplitAfter && (
            <EraRevealBand
              bandId="bulletSplit"
              bandIndex={b("bulletSplit")}
              stepId={step.id}
              stepIndex={step.index}
              eraStaging={eraStaging}
              active={active}
            >
              <motion.div {...innerMotion} className="space-y-5">
                <div>
                  <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-300/85">
                    O que a instituição faz hoje
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {step.content.bullets
                      .slice(0, step.content.bulletSplitAfter)
                      .map((verb) => (
                        <span
                          key={verb}
                          className="rounded-full border border-cyan-400/25 bg-cyan-500/[0.09] px-3 py-1.5 text-[13px] font-medium text-slate-100 shadow-soft"
                        >
                          {verb}
                        </span>
                      ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-rose-300/85">
                    Onde a continuidade falha
                  </p>
                  <ul className="space-y-2">
                    {step.content.bullets
                      .slice(step.content.bulletSplitAfter)
                      .map((bullet) => (
                        <li
                          key={bullet}
                          className="flex items-start gap-3 text-[0.96rem] leading-relaxed text-slate-200"
                        >
                          <span
                            className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full"
                            style={{
                              background: accent.base,
                              boxShadow: `0 0 8px ${accent.base}88`,
                            }}
                          />
                          <span className="whitespace-pre-line">{bullet}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              </motion.div>
            </EraRevealBand>
          )}

        {painPoints &&
          !useBalloon &&
          step.content.bullets &&
          step.content.bullets.length > 0 && (
            <EraRevealBand
              bandId="painChips"
              bandIndex={b("painChips")}
              stepId={step.id}
              stepIndex={step.index}
              eraStaging={eraStaging}
              active={active}
            >
              <motion.div {...innerMotion} className="relative space-y-3">
                {step.content.painPointsLead && (
                  <p
                    className="text-[1.02rem] font-semibold leading-relaxed text-slate-100/90"
                    style={{ textShadow: `0 0 18px ${accent.base}22` }}
                  >
                    {step.content.painPointsLead}
                  </p>
                )}
                {step.content.painPointsBackdrop === "stacked" && (
                  <StackedLayersBackdrop
                    color={accent.base}
                    reduce={Boolean(reduceMotion)}
                    active={active}
                  />
                )}
                {step.content.painPointsBackdrop === "web" && (
                  <TenseWebBackdrop
                    color={accent.base}
                    reduce={Boolean(reduceMotion)}
                    active={active}
                    count={step.content.bullets.length}
                  />
                )}
                <div className="relative">
                  <PainPointChips
                    bullets={step.content.bullets}
                    icons={step.content.painPointsIcons}
                    gridCols={step.content.painPointsGridCols}
                    accentColor={accent.base}
                    active={active}
                    reducedMotion={Boolean(reduceMotion)}
                  />
                </div>
              </motion.div>
            </EraRevealBand>
          )}

        {useBalloon &&
          step.content.bullets &&
          step.content.bullets.length > 0 && (
            <EraRevealBand
              bandId="balloonTrigger"
              bandIndex={b("balloonTrigger")}
              stepId={step.id}
              stepIndex={step.index}
              eraStaging={eraStaging}
              active={active}
            >
              <motion.div {...innerMotion} className="flex justify-center py-3">
                <BalloonTrigger
                  ref={triggerRef}
                  label={
                    step.content.painPointsTriggerLabel ?? "Abrir os 7 pontos"
                  }
                  accentColor={accent.base}
                  onClick={handleTriggerClick}
                  reducedMotion={Boolean(reduceMotion)}
                  charged={tracerActive && !balloonOpen}
                  impact={impactActive}
                />
              </motion.div>
            </EraRevealBand>
          )}

        {!painPoints &&
          step.content.bullets &&
          step.content.bullets.length > 0 &&
          !(
            typeof step.content.bulletSplitAfter === "number" &&
            step.content.bulletSplitAfter > 0 &&
            step.content.bullets.length > step.content.bulletSplitAfter
          ) && (
            <EraRevealBand
              bandId="bullets"
              bandIndex={b("bullets")}
              stepId={step.id}
              stepIndex={step.index}
              eraStaging={eraStaging}
              active={active}
            >
              <motion.ul {...innerMotion} className="mt-1 space-y-2.5">
                {step.content.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="flex items-start gap-3 text-[0.96rem] leading-relaxed text-slate-200"
                  >
                    <span
                      className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full"
                      style={{
                        background: accent.base,
                        boxShadow: `0 0 8px ${accent.base}88`,
                      }}
                    />
                    <span className="whitespace-pre-line">{bullet}</span>
                  </li>
                ))}
              </motion.ul>
            </EraRevealBand>
          )}

        {painPoints && step.content.body && (
          <EraRevealBand
            bandId="painBody"
            bandIndex={b("painBody")}
            stepId={step.id}
            stepIndex={step.index}
            eraStaging={eraStaging}
            active={active}
          >
            <motion.div {...innerMotion} className="relative mt-1 pl-4">
              <span
                aria-hidden
                className="absolute left-0 top-1 bottom-1 w-px"
                style={{
                  background: `linear-gradient(180deg, ${accent.base}, transparent)`,
                }}
              />
              <p className="presentation-ppt-body whitespace-pre-line text-[1.06rem] leading-relaxed text-slate-100/96">
                {step.content.body}
              </p>
            </motion.div>
          </EraRevealBand>
        )}

        {step.content.beforeAfter &&
          step.content.beforeAfter.before.length > 0 &&
          step.content.beforeAfter.before.length ===
            step.content.beforeAfter.after.length && (
            <EraRevealBand
              bandId="beforeAfter"
              bandIndex={b("beforeAfter")}
              stepId={step.id}
              stepIndex={step.index}
              eraStaging={eraStaging}
              active={active}
            >
              <motion.div {...innerMotion} className="space-y-2">
                {step.content.beforeAfter.before.map((from, i) => {
                  const to = step.content.beforeAfter!.after[i]!;
                  const rose = theme.accents.rose;
                  const emerald = theme.accents.emerald;
                  return (
                    <motion.div
                      key={`${from}-${to}`}
                      className="grid grid-cols-2 gap-2"
                      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                      animate={
                        active
                          ? { opacity: 1, y: 0 }
                          : reduceMotion
                            ? undefined
                            : { opacity: 0, y: 8 }
                      }
                      transition={{
                        duration: 0.5,
                        ease: [0.22, 1, 0.36, 1],
                        delay: 0.55 + i * 0.12,
                      }}
                    >
                      <div
                        className="relative overflow-hidden rounded-lg border px-3.5 py-2.5"
                        style={{
                          borderColor: `${rose.base}33`,
                          background: `linear-gradient(135deg, ${rose.base}10 0%, rgba(255,255,255,0.015) 70%)`,
                        }}
                      >
                        <span
                          className="block text-[11px] font-semibold uppercase tracking-[0.26em]"
                          style={{ color: rose.base, opacity: 0.9 }}
                        >
                          DE →
                        </span>
                        <p className="mt-0.5 text-[0.98rem] leading-relaxed text-slate-100/92">
                          {from}
                        </p>
                      </div>
                      <div
                        className="relative overflow-hidden rounded-lg border px-3.5 py-2.5"
                        style={{
                          borderColor: `${emerald.base}40`,
                          background: `linear-gradient(135deg, ${emerald.base}16 0%, rgba(255,255,255,0.015) 70%)`,
                          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.04)`,
                        }}
                      >
                        <span
                          aria-hidden
                          className="pointer-events-none absolute inset-x-3 -top-px h-px"
                          style={{
                            background: `linear-gradient(90deg, transparent, ${emerald.base}, transparent)`,
                          }}
                        />
                        <span
                          className="block text-[11px] font-semibold uppercase tracking-[0.26em]"
                          style={{ color: emerald.base, opacity: 0.95 }}
                        >
                          PARA →
                        </span>
                        <p
                          className="mt-0.5 text-[0.96rem] font-medium leading-relaxed text-white/95"
                          style={{ textShadow: `0 0 18px ${emerald.base}22` }}
                        >
                          {to}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </EraRevealBand>
          )}

        {step.content.attentionPhrase && (
          <EraRevealBand
            bandId="attention"
            bandIndex={b("attention")}
            stepId={step.id}
            stepIndex={step.index}
            eraStaging={eraStaging}
            active={active}
          >
            <motion.div
              {...innerMotion}
              className="relative mt-1 overflow-hidden rounded-2xl border px-5 py-4"
              style={{
                borderColor: `${accent.base}55`,
                background: `linear-gradient(135deg, ${accent.base}1f 0%, transparent 65%)`,
              }}
            >
              <span
                aria-hidden
                className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full"
                style={{
                  background: accent.base,
                  boxShadow: `0 0 14px ${accent.base}`,
                }}
              />
              <motion.span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-2xl"
                style={{
                  boxShadow: `0 0 0 1px ${accent.base}33, 0 0 36px ${accent.base}44`,
                }}
                animate={
                  active && !reduceMotion
                    ? { opacity: [0.5, 1, 0.5] }
                    : { opacity: 0.5 }
                }
                transition={{
                  duration: 2.8,
                  ease: "easeInOut",
                  repeat: Infinity,
                }}
              />
              <p
                className="relative pl-3 text-[clamp(1.05rem,2.4vw,1.22rem)] font-medium italic leading-relaxed"
                style={{
                  color: accent.base,
                  textShadow: `0 0 24px ${accent.base}33`,
                }}
              >
                “{step.content.attentionPhrase}”
              </p>
            </motion.div>
            {step.content.newsUrls && step.content.newsUrls.length > 0 && (
              <div className="mt-6 grid w-full grid-cols-1 gap-2 md:grid-cols-2">
                {step.content.newsUrls.map((url, index) => (
                  <div
                    key={`news-url-${index}`}
                    className="h-[300px] w-full max-w-[400px] rounded-lg border border-white/10 bg-gray-800/50 bg-cover bg-center shadow-inner"
                    style={{
                      backgroundImage: `url(${url})`,
                    }}
                  />
                ))}
              </div>
            )}
          </EraRevealBand>
        )}

        {step.content.highlightPhrases &&
          step.content.highlightPhrases.length > 0 && (
            <EraRevealBand
              bandId="highlightPhrases"
              bandIndex={b("highlightPhrases")}
              stepId={step.id}
              stepIndex={step.index}
              eraStaging={eraStaging}
              active={active}
            >
              <motion.div {...innerMotion}>
                <HighlightPhraseList
                  items={step.content.highlightPhrases}
                  active={active}
                />
              </motion.div>
            </EraRevealBand>
          )}

        {step.content.evidenceCard && (
          <EraRevealBand
            bandId="evidenceCard"
            bandIndex={b("evidenceCard")}
            stepId={step.id}
            stepIndex={step.index}
            eraStaging={eraStaging}
            active={active}
          >
            <motion.div {...innerMotion}>
              <EvidenceCardBlock
                card={step.content.evidenceCard}
                active={active}
                accentColor={accent.base}
              />
            </motion.div>
          </EraRevealBand>
        )}

        {step.content.closingHighlight && (
          <EraRevealBand
            bandId="closingHighlight"
            bandIndex={b("closingHighlight")}
            stepId={step.id}
            stepIndex={step.index}
            eraStaging={eraStaging}
            active={active}
          >
            <motion.div {...innerMotion}>
              <ClosingHighlight
                text={step.content.closingHighlight}
                active={active}
              />
            </motion.div>
          </EraRevealBand>
        )}

        {step.content.visual?.type === "risk-curve" && (
          <EraRevealBand
            bandId="riskCurve"
            bandIndex={b("riskCurve")}
            stepId={step.id}
            stepIndex={step.index}
            eraStaging={eraStaging}
            active={active}
          >
            <motion.div {...innerMotion}>
              <AnimatedRiskCurve active={active} />
            </motion.div>
          </EraRevealBand>
        )}
      </motion.div>

      <AnimatePresence>
        {useBalloon && tracerActive && !balloonOpen && (
          <TracerParticle
            key="tracer"
            targetRef={triggerRef}
            accentColor={accent.base}
            onArrive={handleTracerArrive}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {useBalloon && impactActive && (
          <ImpactBurst
            key="impact"
            targetRef={triggerRef}
            accentColor={accent.base}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {useBalloon && balloonOpen && step.content.bullets && (
          <PainPointsBalloon
            title={step.content.painPointsBalloonTitle ?? "Pontos de atrito"}
            headline={step.content.headline}
            bullets={step.content.bullets}
            accentColor={accent.base}
            reducedMotion={Boolean(reduceMotion)}
            originRef={triggerRef}
            onClose={() => setBalloonOpen(false)}
          />
        )}
      </AnimatePresence>
    </FloatingCard>
  );
}

interface BalloonTriggerProps {
  label: string;
  accentColor: string;
  onClick: () => void;
  reducedMotion: boolean;
  charged?: boolean;
  impact?: boolean;
}

const BalloonTrigger = forwardRef<HTMLButtonElement, BalloonTriggerProps>(
  function BalloonTrigger(
    { label, accentColor, onClick, reducedMotion, charged, impact },
    ref,
  ) {
    const idleShadow = `0 0 0 1px ${accentColor}33, 0 12px 32px -10px ${accentColor}60, inset 0 1px 0 rgba(255,255,255,0.08)`;
    const chargedShadow = `0 0 0 2px ${accentColor}, 0 18px 48px -8px ${accentColor}, inset 0 1px 0 rgba(255,255,255,0.12)`;
    const impactShadow = `0 0 0 6px ${accentColor}99, 0 0 48px 12px ${accentColor}, inset 0 1px 0 rgba(255,255,255,0.4)`;

    return (
      <motion.button
        ref={ref}
        type="button"
        data-no-click-advance
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        whileHover={
          reducedMotion || charged || impact
            ? undefined
            : {
                scale: 1.03,
                transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
              }
        }
        whileTap={reducedMotion ? undefined : { scale: 0.97 }}
        animate={
          impact && !reducedMotion
            ? {
                boxShadow: [chargedShadow, impactShadow, idleShadow],
                scale: [1, 1.18, 1],
                x: [0, -3, 3, -2, 2, 0],
              }
            : charged && !reducedMotion
              ? {
                  boxShadow: [idleShadow, chargedShadow, idleShadow],
                  scale: [1, 1.04, 1],
                }
              : undefined
        }
        transition={
          impact
            ? { duration: 0.32, ease: [0.4, 0, 0.2, 1] }
            : charged
              ? { duration: 1.2, ease: "easeInOut", repeat: Infinity }
              : undefined
        }
        className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border px-6 py-3 text-[0.95rem] font-semibold tracking-wide text-white"
        style={{
          borderColor: `${accentColor}77`,
          background: `linear-gradient(135deg, ${accentColor}26 0%, ${accentColor}0d 100%)`,
          boxShadow: `0 0 0 1px ${accentColor}33, 0 12px 32px -10px ${accentColor}60, inset 0 1px 0 rgba(255,255,255,0.08)`,
        }}
      >
        <motion.span
          aria-hidden
          className="relative h-2.5 w-2.5 rounded-full"
          style={{
            background: accentColor,
            boxShadow: `0 0 14px ${accentColor}`,
          }}
          animate={
            reducedMotion
              ? undefined
              : { scale: [0.9, 1.2, 0.9], opacity: [0.7, 1, 0.7] }
          }
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
        <span>{label}</span>
        <motion.span
          aria-hidden
          className="text-lg leading-none"
          style={{ color: accentColor }}
          animate={reducedMotion ? undefined : { x: [0, 3, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          →
        </motion.span>
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${accentColor}33, transparent 70%)`,
          }}
        />
      </motion.button>
    );
  },
);

interface ImpactBurstProps {
  targetRef: RefObject<HTMLElement>;
  accentColor: string;
}

function ImpactBurst({ targetRef, accentColor }: ImpactBurstProps) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!targetRef.current) return;
    const rect = targetRef.current.getBoundingClientRect();
    setPos({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
  }, [targetRef]);

  if (typeof document === "undefined" || !pos) return null;

  const ripples = [0, 0.07, 0.14];

  return createPortal(
    <div
      className="pointer-events-none fixed inset-0 z-[75]"
      data-no-click-advance
      style={{ overflow: "hidden" }}
    >
      {/* Flash branco */}
      <motion.div
        className="absolute h-3 w-3 rounded-full"
        style={{
          top: pos.y,
          left: pos.x,
          translate: "-50% -50%",
          background: `radial-gradient(circle, #ffffff 0%, ${accentColor} 35%, transparent 70%)`,
        }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: [0, 1, 0], scale: [0, 8, 14] }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 0.35,
          ease: [0.2, 0.8, 0.2, 1],
          times: [0, 0.3, 1],
        }}
      />

      {/* Ondas de choque */}
      {ripples.map((delay, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border-2"
          style={{
            top: pos.y,
            left: pos.x,
            translate: "-50% -50%",
            borderColor: accentColor,
            boxShadow: `0 0 24px ${accentColor}, inset 0 0 16px ${accentColor}55`,
          }}
          initial={{ width: 8, height: 8, opacity: 0.9 }}
          animate={{ width: 360 + i * 80, height: 360 + i * 80, opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, delay, ease: [0.2, 0.8, 0.2, 1] }}
        />
      ))}

      {/* Estilhaços/raios curtos */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const dx = Math.cos(angle) * 90;
        const dy = Math.sin(angle) * 90;
        return (
          <motion.span
            key={`spark-${i}`}
            className="absolute h-[3px] w-3 rounded-full"
            style={{
              top: pos.y,
              left: pos.x,
              translate: "-50% -50%",
              background: accentColor,
              boxShadow: `0 0 12px ${accentColor}`,
              transformOrigin: "left center",
              rotate: `${(angle * 180) / Math.PI}deg`,
            }}
            initial={{ opacity: 1, x: 0, y: 0, scaleX: 0.2 }}
            animate={{
              opacity: [1, 1, 0],
              x: dx,
              y: dy,
              scaleX: [0.2, 2, 0.6],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.45,
              ease: [0.2, 0.8, 0.2, 1],
              times: [0, 0.5, 1],
            }}
          />
        );
      })}
    </div>,
    document.body,
  );
}

interface TracerParticleProps {
  targetRef: RefObject<HTMLElement>;
  accentColor: string;
  onArrive: () => void;
}

function TracerParticle({
  targetRef,
  accentColor,
  onArrive,
}: TracerParticleProps) {
  const [path, setPath] = useState<{ x: number[]; y: number[] } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !targetRef.current) {
      onArrive();
      return;
    }
    const rect = targetRef.current.getBoundingClientRect();
    const endX = rect.left + rect.width / 2;
    const endY = rect.top + rect.height / 2;

    // Spawn de um dos cantos superiores aleatoriamente
    const fromLeft = Math.random() < 0.5;
    const startX = fromLeft
      ? window.innerWidth * 0.08
      : window.innerWidth * 0.92;
    const startY = window.innerHeight * (0.08 + Math.random() * 0.14);

    // Trajetória reta para velocidade constante
    setPath({ x: [startX, endX], y: [startY, endY] });

    const t = window.setTimeout(onArrive, 1500);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (typeof document === "undefined" || !path) return null;

  return createPortal(
    <div
      className="pointer-events-none fixed inset-0 z-[70]"
      data-no-click-advance
    >
      <motion.div
        className="absolute"
        style={{ top: 0, left: 0 }}
        initial={{ x: path.x[0], y: path.y[0] }}
        animate={{
          x: path.x,
          y: path.y,
        }}
        exit={{ opacity: 0, transition: { duration: 0.18 } }}
        transition={{
          duration: 1.5,
          ease: "linear",
        }}
      >
        {/* Núcleo brilhante — brilho constante (sem pulse) */}
        <span
          className="absolute -left-2 -top-2 block h-4 w-4 rounded-full"
          style={{
            background: accentColor,
            boxShadow: `0 0 24px ${accentColor}, 0 0 64px ${accentColor}aa, 0 0 120px ${accentColor}55`,
          }}
        />
        {/* Halo externo estável */}
        <span
          className="absolute -left-6 -top-6 block h-12 w-12 rounded-full"
          style={{
            background: `radial-gradient(circle, ${accentColor}66 0%, ${accentColor}22 40%, transparent 72%)`,
          }}
        />
        {/* Trail/rastro discreto */}
        <span
          aria-hidden
          className="absolute -left-1 -top-1 block h-2 w-2 rounded-full opacity-60"
          style={{
            background: `radial-gradient(circle, ${accentColor}, transparent 70%)`,
            filter: "blur(2px)",
          }}
        />
      </motion.div>
    </div>,
    document.body,
  );
}

interface PainPointsBalloonProps {
  title: string;
  headline?: string;
  bullets: string[];
  accentColor: string;
  reducedMotion: boolean;
  originRef?: RefObject<HTMLElement>;
  onClose: () => void;
}

function PainPointsBalloon({
  title,
  headline,
  bullets,
  accentColor,
  reducedMotion,
  originRef,
  onClose,
}: PainPointsBalloonProps) {
  // Calcula a posição inicial do balão a partir do botão de origem (centro relativo)
  const origin = (() => {
    if (typeof window === "undefined" || !originRef?.current)
      return { dx: 0, dy: 0 };
    const rect = originRef.current.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    return { dx: originX - centerX, dy: originY - centerY };
  })();
  const list = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: reducedMotion ? 0 : 0.18,
        staggerChildren: reducedMotion ? 0 : 0.06,
      },
    },
  };
  const tile = {
    hidden: reducedMotion
      ? {}
      : { opacity: 0, y: 14, scale: 0.94, filter: "blur(6px)" },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <motion.div
      data-no-click-advance
      className="fixed inset-0 z-[80] flex items-center justify-center p-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        aria-hidden
        className="absolute inset-0 cursor-pointer"
        onClick={onClose}
        initial={{ backdropFilter: "blur(0px)" }}
        animate={{ backdropFilter: "blur(14px)" }}
        exit={{ backdropFilter: "blur(0px)" }}
        transition={{ duration: 0.4 }}
        style={{ background: "rgba(4, 6, 12, 0.72)" }}
      />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        initial={
          reducedMotion
            ? { opacity: 0 }
            : {
                opacity: 0,
                scale: 0.02,
                x: origin.dx,
                y: origin.dy,
                filter: "blur(14px)",
              }
        }
        animate={{ opacity: 1, scale: 1, x: 0, y: 0, filter: "blur(0px)" }}
        exit={
          reducedMotion
            ? { opacity: 0 }
            : {
                opacity: 0,
                scale: 0.94,
                y: 8,
                filter: "blur(8px)",
                transition: { duration: 0.35 },
              }
        }
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-[820px] overflow-hidden rounded-[28px] border bg-[#0b0f18]/95 p-10 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.8)]"
        style={{
          borderColor: `${accentColor}55`,
          boxShadow: `0 0 0 1px ${accentColor}22, 0 50px 140px -20px ${accentColor}30, inset 0 1px 0 rgba(255,255,255,0.06)`,
        }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-10 -top-px h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
          }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at top, ${accentColor}1a, transparent 60%)`,
          }}
        />

        <div className="relative flex items-start justify-between gap-4">
          <div>
            <span
              className="block text-[10px] font-semibold uppercase tracking-[0.36em]"
              style={{ color: accentColor, opacity: 0.85 }}
            >
              {title}
            </span>
            {headline && (
              <h3 className="mt-3 max-w-[28ch] text-[clamp(1.35rem,2.6vw,1.8rem)] font-bold leading-tight text-white">
                {headline}
              </h3>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-white/70 transition-colors duration-200 hover:border-white/30 hover:bg-white/[0.08] hover:text-white"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M1 1L13 13M13 1L1 13"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <motion.ul
          variants={list}
          initial="hidden"
          animate="visible"
          className="relative mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2"
        >
          {bullets.map((text, i) => (
            <motion.li key={text} variants={tile}>
              <div
                className="relative flex items-start gap-3 overflow-hidden rounded-2xl border px-5 py-4"
                style={{
                  borderColor: `${accentColor}33`,
                  background: `linear-gradient(135deg, ${accentColor}14 0%, rgba(255,255,255,0.025) 100%)`,
                  boxShadow: `inset 0 1px 0 rgba(255,255,255,0.05)`,
                }}
              >
                <span
                  aria-hidden
                  className="mt-0.5 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                  style={{
                    background: `${accentColor}26`,
                    color: accentColor,
                    border: `1px solid ${accentColor}55`,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[1.04rem] font-medium leading-relaxed text-slate-50">
                  {text}
                </span>
              </div>
            </motion.li>
          ))}
        </motion.ul>

        <p className="relative mt-7 text-center text-[12px] uppercase tracking-[0.28em] text-white/40">
          Toque fora ou pressione ESC para fechar
        </p>
      </motion.div>
    </motion.div>,
    document.body,
  );
}

/** Camadas sobrepostas — "crescimento por acúmulo": cartões empilhados em offset. */
function StackedLayersBackdrop({
  color,
  reduce,
  active,
}: {
  color: string;
  reduce: boolean;
  active: boolean;
}) {
  const layers = [0, 1, 2, 3];
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute -inset-3 overflow-hidden"
    >
      {layers.map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-2xl border"
          style={{
            borderColor: `${color}22`,
            background: `linear-gradient(135deg, ${color}06 0%, transparent 80%)`,
            transform: `translate(${i * 6}px, ${i * 6}px)`,
            opacity: 0.5 - i * 0.1,
          }}
          initial={
            reduce ? false : { opacity: 0, x: -10 - i * 4, y: -10 - i * 4 }
          }
          animate={
            active
              ? { opacity: 0.5 - i * 0.1, x: i * 6, y: i * 6 }
              : reduce
                ? undefined
                : { opacity: 0, x: -10 - i * 4, y: -10 - i * 4 }
          }
          transition={{
            duration: 0.6,
            delay: 0.2 + i * 0.12,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      ))}
    </div>
  );
}

/** Teia tensa — "operação que cresce conectada de forma fragmentada". */
function TenseWebBackdrop({
  color,
  reduce,
  active,
  count,
}: {
  color: string;
  reduce: boolean;
  active: boolean;
  count: number;
}) {
  const W = 600;
  const H = 320;
  const nodes = Array.from({ length: Math.min(count, 8) }, (_, i) => {
    // Distribuição pseudo-aleatória estável
    const seed = (i * 9301 + 49297) % 233280;
    const r = seed / 233280;
    return {
      x: 60 + ((i * 73) % (W - 120)) + r * 30,
      y: 40 + ((i * 47) % (H - 80)),
    };
  });
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className="pointer-events-none absolute -inset-3 h-[calc(100%+24px)] w-[calc(100%+24px)]"
      style={{ opacity: active ? 0.45 : 0.15 }}
    >
      {nodes.map((n, i) =>
        nodes.slice(i + 1).map((m, j) => (
          <motion.line
            key={`tw-${i}-${j}`}
            x1={n.x}
            y1={n.y}
            x2={m.x}
            y2={m.y}
            stroke={color}
            strokeWidth={0.5}
            strokeOpacity={0.25}
            strokeDasharray="3 5"
            animate={reduce ? undefined : { strokeDashoffset: [0, -8] }}
            transition={{
              duration: 4 + ((i + j) % 3),
              repeat: Infinity,
              ease: "linear",
            }}
          />
        )),
      )}
      {nodes.map((n, i) => (
        <motion.circle
          key={`twn-${i}`}
          cx={n.x}
          cy={n.y}
          r={2}
          fill={color}
          opacity={0.55}
          animate={reduce ? undefined : { opacity: [0.3, 0.7, 0.3] }}
          transition={{
            duration: 2.6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.18,
          }}
        />
      ))}
    </svg>
  );
}

interface PainPointChipsProps {
  bullets: string[];
  icons?: string[];
  gridCols?: 2 | 3 | 4;
  accentColor: string;
  active: boolean;
  reducedMotion: boolean;
}

function PainPointChips({
  bullets,
  icons,
  gridCols,
  accentColor,
  active,
  reducedMotion,
}: PainPointChipsProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const chipRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (selected === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setSelected(null);
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [selected]);

  useEffect(() => {
    if (!active) setSelected(null);
  }, [active]);

  const container = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: reducedMotion ? 0 : 0.12,
        staggerChildren: reducedMotion ? 0 : 0.07,
      },
    },
  };

  const chip = {
    hidden: reducedMotion
      ? {}
      : { opacity: 0, y: 10, scale: 0.96, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <>
      <motion.ul
        variants={container}
        initial={reducedMotion ? false : "hidden"}
        animate={active ? "visible" : "hidden"}
        className={
          gridCols === 4
            ? "grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4"
            : gridCols === 3
              ? "grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3"
              : "grid grid-cols-1 gap-2.5 sm:grid-cols-2"
        }
      >
        {bullets.map((text, i) => {
          const iconKey = icons?.[i];
          const Icon = iconKey ? PAIN_POINT_ICONS[iconKey] : undefined;
          const isSelected = selected === i;
          const isDimmed = selected !== null && !isSelected;
          return (
            <motion.li key={text} variants={chip}>
              <motion.div
                ref={(el) => {
                  chipRefs.current[i] = el;
                }}
                data-no-click-advance
                role="button"
                tabIndex={0}
                aria-expanded={isSelected}
                aria-label={text}
                whileHover={
                  reducedMotion || selected !== null
                    ? undefined
                    : {
                        y: -2,
                        scale: 1.015,
                        transition: {
                          duration: 0.25,
                          ease: [0.22, 1, 0.36, 1],
                        },
                      }
                }
                whileTap={reducedMotion ? undefined : { scale: 0.96 }}
                animate={
                  reducedMotion
                    ? {}
                    : isDimmed
                      ? {
                          opacity: 0.35,
                          scale: 0.97,
                          transition: {
                            duration: 0.32,
                            ease: [0.22, 1, 0.36, 1],
                          },
                        }
                      : {
                          opacity: 1,
                          scale: 1,
                          transition: {
                            duration: 0.32,
                            ease: [0.22, 1, 0.36, 1],
                          },
                        }
                }
                onClick={(e) => {
                  e.stopPropagation();
                  setSelected((s) => (s === i ? null : i));
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelected((s) => (s === i ? null : i));
                  }
                }}
                className="group relative flex cursor-pointer items-start gap-3 overflow-hidden rounded-2xl border px-4 py-3 outline-none transition-[border-color,box-shadow,background] duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/45"
                style={{
                  borderColor: isSelected
                    ? `${accentColor}99`
                    : `${accentColor}33`,
                  background: isSelected
                    ? `linear-gradient(135deg, ${accentColor}22 0%, rgba(255,255,255,0.04) 100%)`
                    : `linear-gradient(135deg, ${accentColor}10 0%, rgba(255,255,255,0.02) 100%)`,
                  boxShadow: isSelected
                    ? `inset 0 1px 0 rgba(255,255,255,0.1), 0 0 0 1px ${accentColor}55, 0 8px 28px -8px ${accentColor}44`
                    : `inset 0 1px 0 rgba(255,255,255,0.04)`,
                }}
              >
                {Icon ? (
                  <span
                    aria-hidden
                    className="mt-0.5 inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg"
                    style={{
                      background: `${accentColor}22`,
                      border: `1px solid ${accentColor}44`,
                      color: accentColor,
                      boxShadow: `0 0 12px ${accentColor}33`,
                    }}
                  >
                    <Icon size={15} strokeWidth={2} />
                  </span>
                ) : (
                  <motion.span
                    aria-hidden
                    className="relative mt-2 h-2 w-2 flex-shrink-0 rounded-full"
                    style={{
                      background: accentColor,
                      boxShadow: `0 0 10px ${accentColor}`,
                    }}
                    animate={
                      reducedMotion
                        ? undefined
                        : { opacity: [0.55, 1, 0.55], scale: [0.85, 1.1, 0.85] }
                    }
                    transition={{
                      duration: 2.6,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.18,
                    }}
                  />
                )}
                <span className="flex-1 text-[1.02rem] font-medium leading-relaxed text-slate-100">
                  {text}
                </span>
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 right-0 w-12 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background: `linear-gradient(270deg, ${accentColor}22, transparent)`,
                  }}
                />
              </motion.div>
            </motion.li>
          );
        })}
      </motion.ul>

      <AnimatePresence>
        {selected !== null && bullets[selected] !== undefined && (
          <ExpandedChip
            key={`expanded-${selected}`}
            text={bullets[selected]!}
            iconKey={icons?.[selected]}
            accentColor={accentColor}
            reducedMotion={reducedMotion}
            origin={chipRefs.current[selected] ?? null}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

interface ExpandedChipProps {
  text: string;
  iconKey?: string;
  accentColor: string;
  reducedMotion: boolean;
  origin: HTMLElement | null;
  onClose: () => void;
  prefix?: string;
  description?: string;
  mediaUrl?: string;
  isPlayingMedia?: boolean;
}

function ExpandedChip({
  text,
  iconKey,
  accentColor,
  reducedMotion,
  origin,
  onClose,
  prefix,
  description,
  mediaUrl,
  isPlayingMedia,
}: ExpandedChipProps) {
  const Icon = iconKey ? PAIN_POINT_ICONS[iconKey] : undefined;

  const startOffset = (() => {
    if (reducedMotion || typeof window === "undefined" || !origin)
      return { dx: 0, dy: 0 };
    const rect = origin.getBoundingClientRect();
    return {
      dx: rect.left + rect.width / 2 - window.innerWidth / 2,
      dy: rect.top + rect.height / 2 - window.innerHeight / 2,
    };
  })();

  if (typeof document === "undefined") return null;

  return createPortal(
    <motion.div
      data-no-click-advance
      className="fixed inset-0 z-[80] flex items-center justify-center p-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Backdrop */}
      <motion.div
        aria-hidden
        className="absolute inset-0 cursor-pointer"
        onClick={onClose}
        initial={{ backdropFilter: "blur(0px)", background: "rgba(4,6,12,0)" }}
        animate={{
          backdropFilter: "blur(14px)",
          background: "rgba(4,6,12,0.68)",
        }}
        exit={{ backdropFilter: "blur(0px)", background: "rgba(4,6,12,0)" }}
        transition={{ duration: 0.4 }}
      />

      {/* Card expandido */}
      <motion.div
        role="dialog"
        aria-modal="true"
        className={`relative w-full ${mediaUrl ? "max-w-[920px]" : "max-w-[440px]"} cursor-pointer overflow-hidden rounded-3xl border px-9 py-9`}
        style={{
          borderColor: `${accentColor}66`,
          background: `linear-gradient(145deg, ${accentColor}1e 0%, rgba(11,15,24,0.97) 100%)`,
          boxShadow: `0 0 0 1px ${accentColor}33, 0 50px 130px -20px ${accentColor}44, 0 50px 130px -20px rgba(0,0,0,0.88)`,
        }}
        initial={
          reducedMotion
            ? { opacity: 0, scale: 0.9 }
            : { opacity: 0, scale: 0.08, x: startOffset.dx, y: startOffset.dy }
        }
        animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
        exit={
          reducedMotion
            ? { opacity: 0, scale: 0.9 }
            : { opacity: 0, scale: 0.88, y: 10, filter: "blur(8px)" }
        }
        transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        {/* Linha de destaque superior */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-8 -top-px h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
          }}
        />
        {/* Halo de fundo */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at top, ${accentColor}1c, transparent 62%)`,
          }}
        />
        {/* Pulso de borda */}
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-3xl"
          style={{
            boxShadow: `0 0 0 1px ${accentColor}44, 0 0 40px ${accentColor}22`,
          }}
          animate={reducedMotion ? {} : { opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.6, ease: "easeInOut", repeat: Infinity }}
        />
        <div className="relative flex items-start gap-4">
          {prefix ? (
            <span
              aria-hidden
              className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-[1.2rem] font-bold"
              style={{
                background: `${accentColor}22`,
                border: `1px solid ${accentColor}55`,
                color: accentColor,
                boxShadow: `0 0 22px ${accentColor}44`,
              }}
            >
              {prefix}
            </span>
          ) : Icon ? (
            <span
              aria-hidden
              className="mt-0.5 inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl"
              style={{
                background: `${accentColor}22`,
                border: `1px solid ${accentColor}55`,
                color: accentColor,
                boxShadow: `0 0 22px ${accentColor}44`,
              }}
            >
              <Icon size={22} strokeWidth={1.8} />
            </span>
          ) : (
            <motion.span
              aria-hidden
              className="mt-2 h-3 w-3 flex-shrink-0 rounded-full"
              style={{
                background: accentColor,
                boxShadow: `0 0 18px ${accentColor}`,
              }}
              animate={
                reducedMotion
                  ? {}
                  : { scale: [0.9, 1.25, 0.9], opacity: [0.7, 1, 0.7] }
              }
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
          <div>
            <p
              className="text-[1.3rem] font-semibold leading-snug text-white"
              style={{ textShadow: `0 0 30px ${accentColor}33` }}
            >
              {text}
            </p>
            {description && (
              <p className="mt-3 text-[1rem] leading-relaxed text-slate-200/80">
                {description}
              </p>
            )}
          </div>
        </div>{" "}
        {mediaUrl && (
          <div className=" w-full">
            <video
              src={mediaUrl}
              className="mt-2 w-full rounded-lg"
              controls
              autoPlay={isPlayingMedia}
            />
          </div>
        )}
        <p className="relative mt-7 text-center text-[11px] uppercase tracking-[0.3em] text-white/32">
          Clique para fechar · ESC
        </p>
      </motion.div>
    </motion.div>,
    document.body,
  );
}
