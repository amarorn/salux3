import {
  forwardRef,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  Fragment,
  type RefObject,
  type ReactNode,
  type CSSProperties,
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
  ChevronRight,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { resolveContactFormUrl } from "@/config/contact";
import { renderTextWithClickableWords } from "./InlineMediaTrigger";

const FORM_BUTTON_CLASS =
  "pointer-events-auto inline-flex items-center justify-center gap-2 rounded-full border border-violet-400/35 bg-violet-500/10 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-violet-200 shadow-[0_18px_48px_-22px_rgba(124,58,237,0.55)] transition-[border-color,background-color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-violet-400/55 hover:bg-violet-500/18";

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
import type { Accent, PresentationStep } from "@/domain/types";
import { theme } from "@/domain/theme";
import { AnimatedRiskCurve } from "../visuals/AnimatedRiskCurve";
import { AnimatedNarrativeMetrics } from "../visuals/AnimatedNarrativeMetrics";
import { KpiCards } from "../visuals/KpiCards";
import {
  NewsArticlePreview,
  NewsEvidenceReveal,
} from "../visuals/NewsEvidenceReveal";
import { EvidenceMetricCard } from "../visuals/EvidenceMetricCard";
import { EvidenceHighlightCard } from "../visuals/EvidenceHighlightCard";
import { EvidenceGaugeCard } from "../visuals/EvidenceGaugeCard";
import { EvidenceRangeCard } from "../visuals/EvidenceRangeCard";
import { RoadStages } from "../visuals/RoadStages";
import { getCardTextVariants } from "./cardTextMotion";
import {
  ClosingHighlight,
  EvidenceCardBlock,
  HighlightPhraseList,
} from "./HighlightBlocks";
import { usePresentationStore } from "@/store/presentationStore";
import { EraRevealBand } from "@/components/motion/EraAgenticaReveal";
import { buildNarrativeBandKeys, splitLeadParagraphs } from "@/lib/eraAgenticaRevealBands";
import { trackUsesEraStagedReveal } from "@/lib/trackEraStaging";
import { ExpandedCardPortal, renderExpandedCardPrefixContent } from "./ExpandedCardPortal";
import {
  glassPanelStyle,
} from "@/lib/glassPanelStyle";

function accentPaletteForValueStage(
  stepAccent: Accent,
  stage: { accent?: Accent },
) {
  const key = stage.accent ?? stepAccent;
  return theme.accents[key];
}

function accentHexToRgbTuple(hex: string): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return "71,85,105";
  const n = parseInt(m[1], 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `${r},${g},${b}`;
}

/** Fundo e borda do vidro seguem o acento do cartão (não só o texto). */
function valueStageCardGlassStyle(
  accentHex: string,
  emphasis: boolean,
): CSSProperties {
  const rgb = accentHexToRgbTuple(accentHex);
  const baseA = emphasis ? 0.24 : 0.16;
  const washA = emphasis ? 0.06 : 0.036;
  const edgeA = emphasis ? 0.38 : 0.18;
  return {
    borderColor: emphasis ? `rgba(${rgb},${edgeA})` : `rgba(${rgb},${edgeA})`,
    background: `linear-gradient(135deg, rgba(${rgb},${baseA}) 0%, rgba(255,255,255,${washA}) 72%)`,
    boxShadow: emphasis
      ? `inset 0 1px 0 rgba(255,255,255,0.1), 0 0 32px -12px rgba(${rgb},0.42)`
      : `inset 0 1px 0 rgba(255,255,255,0.05), 0 0 24px -16px rgba(${rgb},0.28)`,
  };
}

interface Props {
  step: PresentationStep;
  active: boolean;
}

type DualStageSide = NonNullable<PresentationStep["content"]["dualStages"]>;

function DualStageGroupBlock({
  group,
  cfg,
  reduceMotion,
  active,
  innerMotion,
}: {
  group: "positive" | "negative";
  cfg: DualStageSide["positive"];
  reduceMotion: boolean | null;
  active: boolean;
  innerMotion: Record<string, unknown>;
}) {
  const c =
    group === "positive" ? theme.accents.emerald : theme.accents.rose;
  const icon = group === "positive" ? "✓" : "⚠";
  const cardDelayBase = group === "positive" ? 0.35 : 0.52;
  const cardDelayStep = group === "positive" ? 0.07 : 0.22;

  return (
    <motion.div {...innerMotion} className="space-y-2.5">
      <motion.p
        className="text-[1.02rem] font-semibold leading-relaxed"
        style={{
          color: c.base,
          textShadow: `0 0 16px ${c.base}1f`,
        }}
        initial={reduceMotion ? false : { opacity: 0, y: 6 }}
        animate={
          active
            ? { opacity: 1, y: 0 }
            : reduceMotion
              ? undefined
              : { opacity: 0, y: 6 }
        }
        transition={{
          duration: 0.4,
          ease: [0.22, 1, 0.36, 1],
          delay: group === "negative" ? 0.12 : 0,
        }}
      >
        {cfg.lead}
      </motion.p>
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
            style={glassPanelStyle(c.base)}
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
              delay: cardDelayBase + i * cardDelayStep,
            }}
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-3 -top-px h-px"
              style={{
                background: `linear-gradient(90deg, transparent, ${c.base}, transparent)`,
              }}
            />
            <div className="flex flex-col items-center gap-2 text-center">
              <span
                aria-hidden
                className="inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded text-[11px] font-bold"
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
    </motion.div>
  );
}

function valueStagesColCount(count: number, gridCols?: number): number {
  if (typeof gridCols === "number" && gridCols > 0) {
    return Math.min(gridCols, Math.max(1, count));
  }
  return count === 4 ? 2 : Math.min(count, 4);
}

function valueStagesGridColumns(count: number, gridCols?: number): string {
  const cols = valueStagesColCount(count, gridCols);
  return `repeat(${cols}, minmax(0, 1fr))`;
}

function valueStageOrphanGridPlacement(
  cols: number,
  bandSize: number,
  indexInBand: number,
): CSSProperties | undefined {
  if (cols < 2 || bandSize < 1) return undefined;
  const r = bandSize % cols;
  if (r !== 1 || indexInBand !== bandSize - 1) return undefined;
  if (cols === 2) {
    return {
      gridColumn: "1 / -1",
      justifySelf: "center",
      maxWidth: "100%",
      width: "100%",
    };
  }
  const col = Math.floor((cols - 1) / 2) + 1;
  return { gridColumn: `${col} / ${col + 1}` };
}

/** Seta entre cartões da grelha evolutiva (trilha em linha). */
function ValueStageRowArrow({
  accentColor,
  emphasized,
}: {
  accentColor: string;
  emphasized: boolean;
}) {
  return (
    <div
      className="pointer-events-none flex h-[5.5rem] shrink-0 items-center justify-center px-0.5 sm:px-1"
      aria-hidden
    >
      <ChevronRight
        className="h-5 w-5 shrink-0 transition-[opacity,filter] duration-300 sm:h-6 sm:w-6"
        strokeWidth={2.25}
        style={{
          color: accentColor,
          opacity: emphasized ? 0.92 : 0.2,
          filter: emphasized ? `drop-shadow(0 0 10px ${accentColor}55)` : undefined,
        }}
      />
    </div>
  );
}

export function NarrativeStep({ step, active }: Props) {
  const accent = theme.accents[step.accent];
  const attentionAccent = step.content.attentionAccent
    ? theme.accents[step.content.attentionAccent]
    : accent;
  const allTextWhite = Boolean(step.content.allTextWhite);
  const whiteText = allTextWhite || Boolean(step.content.whiteTextOnly);
  const ctaFormSlide = Boolean(
    step.content.ctaFormSlide && step.content.closingQuestion,
  );
  const formUrl = resolveContactFormUrl();
  const reduceMotion = useReducedMotion();
  const flipPhoto = useContext(FloatingCardContext)?.flipPhoto ?? false;
  const trackId = useContext(FloatingCardContext)?.trackId;
  const hasChunkedValueStages = Boolean(
    (step.content.valueStagesRevealChunkSize ?? 0) > 0 &&
    step.content.valueStages &&
    step.content.valueStages.length > 0,
  );
  const eraStaging =
    trackUsesEraStagedReveal(trackId) ||
    Boolean(step.content.forceEraStagedReveal) ||
    hasChunkedValueStages;
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
  const valueStagesChunks = useMemo(() => {
    const vs = step.content.valueStages;
    const chunk = step.content.valueStagesRevealChunkSize;
    if (!vs?.length || typeof chunk !== "number" || chunk < 1) return null;
    const rows: (typeof vs)[] = [];
    for (let i = 0; i < vs.length; i += chunk) {
      rows.push(vs.slice(i, i + chunk));
    }
    return rows;
  }, [step.content.valueStages, step.content.valueStagesRevealChunkSize]);
  const b = (id: string) => bandKeys.indexOf(id);
  const setEraCfg = usePresentationStore((s) => s.setEraStagedRevealConfig);
  const clearEra = usePresentationStore((s) => s.clearEraStagedReveal);
  const eraStagedRevealPhase = usePresentationStore((s) =>
    s.eraStagedRevealStepId === step.id ? s.eraStagedRevealPhase : -1,
  );
  const stagingLayout = Boolean(active && eraStaging && !reduceMotion);
  const innerMotion = stagingLayout ? {} : { variants: item };
  const outerContainer: Variants = stagingLayout
    ? { hidden: {}, visible: {} }
    : container;

  useLayoutEffect(() => {
    if (!active || !eraStaging) return;
    if (reduceMotion) {
      if (
        step.content.valueStagesRevealSequentialCards &&
        step.content.valueStagesRevealOneAtATime
      ) {
        setEraCfg(step.id, bandKeys.length, bandKeys.length - 1);
      } else {
        setEraCfg(step.id, 1);
      }
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
    step.content.valueStagesRevealSequentialCards,
    step.content.valueStagesRevealOneAtATime,
    setEraCfg,
    clearEra,
  ]);

  const [balloonOpen, setBalloonOpen] = useState(false);
  const [tracerActive, setTracerActive] = useState(false);
  const [impactActive, setImpactActive] = useState(false);
  const [valueStageSpotlight, setValueStageSpotlight] = useState<number | null>(
    null,
  );
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [bannerPreviewItem, setBannerPreviewItem] = useState<{
    item: import("@/domain/types").NewsItem;
    accentColor: string;
  } | null>(null);
  const [heroPreviewItem, setHeroPreviewItem] = useState<{
    item: import("@/domain/types").NewsItem;
    accentColor: string;
  } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const stageRefs = useRef<(HTMLElement | null)[]>([]);
  const roadStageRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const expandImage = Boolean(
    step.content.newsUrls?.length || step.content.bannerNewsUrls?.length,
  );

  // Fecha o balão e reseta o tracer quando o slide deixa de estar ativo
  useEffect(() => {
    if (!active) {
      setBalloonOpen(false);
      setTracerActive(false);
      setImpactActive(false);
      setValueStageSpotlight(null);
      setExpandedImage(null);
      setBannerPreviewItem(null);
      setHeroPreviewItem(null);
    }
  }, [active]);

  const handleExpandImage = (url: string) => {
    const bannerUrls = step.content.bannerNewsUrls;
    const bannerPreviewUrls = step.content.bannerNewsPreviewUrls;
    if (bannerUrls && bannerPreviewUrls && bannerUrls.includes(url)) {
      const idx = bannerUrls.indexOf(url);
      const previewUrl = bannerPreviewUrls[idx];
      if (previewUrl) {
        setBannerPreviewItem({
          item: {
            imageUrl: previewUrl,
            articleUrl: "",
            title: step.title,
            source: step.subtitle,
          },
          accentColor: theme.accents[step.accent].base,
        });
        return;
      }
    }
    const newsUrls = step.content.newsUrls;
    const newsPreviewUrls = step.content.newsPreviewUrls;
    if (newsUrls && newsPreviewUrls && newsUrls.includes(url)) {
      const idx = newsUrls.indexOf(url);
      const previewUrl = newsPreviewUrls[idx];
      if (previewUrl) {
        setBannerPreviewItem({
          item: {
            imageUrl: previewUrl,
            articleUrl: "",
            title: step.title,
            source: step.subtitle,
          },
          accentColor: theme.accents[step.accent].base,
        });
        return;
      }
    }
    setExpandedImage(url);
  };

  const handleCloseExpandedImage = () => {
    setExpandedImage(null);
  };

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

  useEffect(() => {
    if (!expandedImage) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setExpandedImage(null);
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [expandedImage]);

  const renderValueStagesSection = (): ReactNode => {
    const vs = step.content.valueStages;
    if (!vs?.length) return null;
    const valueStagesClickable = step.content.valueStagesClickable !== false;
    const chunks = valueStagesChunks;
    const revealChunk = step.content.valueStagesRevealChunkSize ?? 1;

    const valueStagesLeadBlock =
      step.content.valueStagesLead ? (
        <p
          className={clsx(
            "mx-auto w-full max-w-prose whitespace-pre-line text-center text-[1.05rem] leading-relaxed",
            whiteText ? "text-white" : "text-slate-100/95",
          )}
          style={{ textShadow: `0 0 18px ${accent.base}1f` }}
        >
          {step.content.valueStagesLead}
        </p>
      ) : null;

    const spotlightStage =
      valueStageSpotlight !== null ? vs[valueStageSpotlight] : undefined;
    const expandedPortal = (
      <AnimatePresence>
        {active &&
          valueStagesClickable &&
          spotlightStage !== undefined &&
          (spotlightStage.news ? (
            <NewsArticlePreview
              key={`stage-news-${valueStageSpotlight}`}
              item={spotlightStage.news}
              accentColor={
                accentPaletteForValueStage(step.accent, spotlightStage).base
              }
              reducedMotion={Boolean(reduceMotion)}
              onClose={() => setValueStageSpotlight(null)}
            />
          ) : (
            <ExpandedCardPortal
              key={`stage-expanded-${valueStageSpotlight}`}
              text={spotlightStage.label}
              accentColor={
                accentPaletteForValueStage(step.accent, spotlightStage).base
              }
              reducedMotion={Boolean(reduceMotion)}
              origin={
                (step.content.valueStagesRoad
                  ? roadStageRefs.current[valueStageSpotlight!]
                  : stageRefs.current[valueStageSpotlight!]) ?? null
              }
              onClose={() => setValueStageSpotlight(null)}
              prefix={spotlightStage.number}
              description={spotlightStage.description || undefined}
              imageSrc={spotlightStage.mediaUrl}
              imageAlt={spotlightStage.label}
            />
          ))}
      </AnimatePresence>
    );

    if (step.content.valueStagesRoad) {
      return (
        <>
          <div className="relative flex w-full flex-col items-center gap-3">
            {valueStagesLeadBlock}
            <RoadStages
              stages={vs}
              accentColor={accent.base}
              stepId={step.id}
              stepIndex={step.index}
              active={active}
              bandIndexFor={b}
              spotlightIndex={valueStageSpotlight}
              onStageToggle={(i: number) => {
                setValueStageSpotlight((s) => (s === i ? null : i));
              }}
              setStageButtonRef={(i: number, el: HTMLButtonElement | null) => {
                roadStageRefs.current[i] = el;
              }}
            />
          </div>
          {expandedPortal}
        </>
      );
    }

    const renderStageButton = (
      stage: (typeof vs)[number],
      i: number,
      ji: number,
      chunked: boolean,
      gridCols: number,
      bandSize: number,
      indexInBand: number,
    ) => {
      const stagePal = accentPaletteForValueStage(step.accent, stage);
      const stageExpandable =
        valueStagesClickable &&
        Boolean(stage.news || stage.mediaUrl || stage.description);
      const dimmed =
        stageExpandable &&
        valueStageSpotlight !== null &&
        valueStageSpotlight !== i;
      const focused = stageExpandable && valueStageSpotlight === i;
      const enterDelay =
        active && valueStageSpotlight === null
          ? chunked
            ? 0.34 + ji * 0.11
            : 0.45 + ji * 0.12
          : 0;
      const orphanPlacement = valueStageOrphanGridPlacement(
        gridCols,
        bandSize,
        indexInBand,
      );
      const shellClass =
        "presentation-card-chip relative flex h-full min-h-[5.5rem] w-full flex-col overflow-hidden rounded-xl border px-3.5 py-3 text-center text-slate-100/90 outline-none transition-[border-color,box-shadow,background] duration-300 ease-out";
      const focusRingClass = valueStagesClickable
        ? "cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/45 disabled:cursor-default disabled:opacity-40"
        : "cursor-default";

      const inner = (
        <>
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-3 -top-px h-px"
            style={{
              background: `linear-gradient(90deg, transparent, ${stagePal.base}, transparent)`,
            }}
          />
          <div className="flex items-baseline justify-center gap-1.5 text-center">
            <motion.span
              className="font-display inline-block text-[1.03rem] font-bold tabular-nums"
              style={{ color: allTextWhite ? "#ffffff" : stagePal.base }}
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={
                !active
                  ? reduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, y: 10 }
                  : dimmed
                    ? {
                      opacity: 0.52,
                      y: 0,
                      transition: {
                        duration: 0.28,
                        ease: [0.22, 1, 0.36, 1],
                      },
                    }
                    : reduceMotion
                      ? {
                        opacity: 1,
                        transition: {
                          duration: 0.38,
                          delay: enterDelay + 0.06,
                          ease: [0.22, 1, 0.36, 1],
                        },
                      }
                      : {
                        opacity: 1,
                        y: 0,
                        transition: {
                          duration: 0.42,
                          delay: enterDelay + 0.07,
                          ease: [0.22, 1, 0.36, 1],
                        },
                      }
              }
            >
              {stage.number}
            </motion.span>
            <span
              className={clsx(
                "text-[11px] font-semibold uppercase tracking-[0.22em]",
                whiteText && "text-white",
              )}
              style={
                whiteText ? undefined : { color: stagePal.base, opacity: 0.9 }
              }
            >
              {stage.label}
            </span>
          </div>
          {stage.description && step.content.valueStagesShowDescription && (
            <p
              className={clsx(
                "mt-2 text-center text-[0.94rem] leading-relaxed",
                whiteText ? "text-white/95" : "text-slate-100/90",
              )}
            >
              {stage.description}
            </p>
          )}
          {stage.description && !step.content.valueStagesShowDescription && (
            <p
              className={clsx(
                "mt-2 text-center text-[0.96rem] leading-relaxed",
                whiteText ? "text-white/95" : "text-slate-100/92",
              )}
            >
              {stage.mediaUrl && <>(Vídeo)</>}
            </p>
          )}
          {stageExpandable ? (
            <span
              className={clsx(
                "mt-2 block text-[10px] font-semibold uppercase tracking-[0.2em]",
                whiteText && "text-white/45",
              )}
              style={
                whiteText ? undefined : { color: stagePal.base, opacity: 0.42 }
              }
            >
              {stage.news ? "Clique para ver a matéria" : "Clique para ampliar"}
            </span>
          ) : null}
        </>
      );

      if (!stageExpandable) {
        return (
          <motion.div
            key={`${stage.number}-${stage.label}-${i}`}
            data-maestro-anchor
            data-maestro-anchor-priority="1"
            data-no-click-advance
            onPointerDown={(e) => e.stopPropagation()}
            className={`${shellClass} cursor-default`}
            style={{
              zIndex: 1,
              ...valueStageCardGlassStyle(stagePal.base, false),
              ...orphanPlacement,
            }}
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={
              !active
                ? reduceMotion
                  ? undefined
                  : { opacity: 0, y: 12 }
                : {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.55,
                    ease: [0.22, 1, 0.36, 1],
                    delay: enterDelay,
                  },
                }
            }
          >
            {inner}
          </motion.div>
        );
      }

      return (
        <motion.button
          ref={(el) => {
            stageRefs.current[i] = el;
          }}
          key={`${stage.number}-${stage.label}-${i}`}
          type="button"
          data-maestro-anchor
          data-maestro-anchor-priority="1"
          data-no-click-advance
          disabled={!active}
          aria-expanded={focused}
          aria-label={`Ampliar: ${stage.label}`}
          className={`${shellClass} ${focusRingClass}`}
          style={{
            zIndex: focused ? 2 : 1,
            ...valueStageCardGlassStyle(stagePal.base, focused),
            ...orphanPlacement,
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
                  transition: {
                    duration: 0.32,
                    ease: [0.22, 1, 0.36, 1],
                  },
                }
                : {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.55,
                    ease: [0.22, 1, 0.36, 1],
                    delay: enterDelay,
                  },
                }
          }
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            if (!active) return;
            setValueStageSpotlight((s) => (s === i ? null : i));
          }}
        >
          {inner}
        </motion.button>
      );
    };

    if (chunks) {
      if (step.content.valueStagesRevealSequentialCards) {
        const cols = valueStagesColCount(
          vs.length,
          step.content.valueStagesGridCols,
        );
        const oneAtATime = Boolean(step.content.valueStagesRevealOneAtATime);
        const firstCardDelayed = Boolean(
          step.content.valueStagesRevealFirstOnClick,
        );

        if (oneAtATime) {
          const phaseStart = firstCardDelayed ? 1 : 0;
          const nCards = vs.length;
          const visibleCardIndex = (() => {
            if (eraStagedRevealPhase < phaseStart) return null;
            const idx = eraStagedRevealPhase - phaseStart;
            if (idx < nCards) return idx;
            // Fases depois do último cartão (ex.: atenção): não deixar a faixa vazia
            return nCards - 1;
          })();
          if (reduceMotion) {
            return (
              <>
                <div className="relative flex w-full flex-col items-center space-y-3 overflow-visible py-1">
                  {valueStagesLeadBlock}
                  <motion.div
                    {...innerMotion}
                    className="flex w-full flex-col items-center space-y-3"
                  >
                    <div className="flex w-full shrink-0 flex-wrap justify-center gap-2 px-1">
                      {vs.map((stage, i) => (
                        <div
                          key={`${stage.number}-${stage.label}-${i}-rm`}
                          className="flex min-w-[10rem] max-w-[11rem] justify-center"
                        >
                          {renderStageButton(
                            stage,
                            i,
                            i,
                            true,
                            cols,
                            nCards,
                            i,
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>
                {expandedPortal}
              </>
            );
          }
          return (
            <>
              <div className="relative flex w-full flex-col items-center space-y-3 overflow-visible py-1">
                {valueStagesLeadBlock}
                <motion.div
                  {...innerMotion}
                  className="flex w-full flex-col items-center space-y-3"
                >
                  {firstCardDelayed ? (
                    <EraRevealBand
                      reveal="single"
                      bandId="valueStagesCardRow"
                      bandIndex={b("valueStagesCardRow")}
                      stepId={step.id}
                      stepIndex={step.index}
                      eraStaging={eraStaging}
                      active={active}
                      className="pointer-events-none absolute left-0 top-0 h-0 w-0 overflow-hidden opacity-0"
                    >
                      <span aria-hidden className="block h-0 w-0" />
                    </EraRevealBand>
                  ) : null}
                  <div className="flex min-h-[5.75rem] w-full shrink-0 justify-center px-1">
                    <AnimatePresence mode="wait" initial={false}>
                      {visibleCardIndex !== null &&
                        vs[visibleCardIndex] !== undefined && (
                          <motion.div
                            key={visibleCardIndex}
                            className="flex w-full min-w-[10rem] max-w-[11rem] justify-center"
                            initial={
                              reduceMotion ? false : { opacity: 0, x: 16 }
                            }
                            animate={{ opacity: 1, x: 0 }}
                            exit={
                              reduceMotion
                                ? { opacity: 0 }
                                : { opacity: 0, x: -16 }
                            }
                            transition={{
                              duration: 0.28,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                          >
                            {renderStageButton(
                              vs[visibleCardIndex]!,
                              visibleCardIndex,
                              visibleCardIndex,
                              true,
                              cols,
                              nCards,
                              visibleCardIndex,
                            )}
                          </motion.div>
                        )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </div>
              {expandedPortal}
            </>
          );
        }

        const phaseOffset = firstCardDelayed ? 1 : 0;
        const arrowLit = (afterIndex: number) =>
          !active ||
          Boolean(reduceMotion) ||
          eraStagedRevealPhase >= afterIndex + phaseOffset;
        return (
          <>
            <div className="relative flex w-full flex-col items-center space-y-3 overflow-visible py-1">
              {valueStagesLeadBlock}
              <motion.div
                {...innerMotion}
                className="flex w-full flex-col items-center space-y-3"
              >
                {firstCardDelayed && (
                  <EraRevealBand
                    bandId="valueStagesCardRow"
                    bandIndex={b("valueStagesCardRow")}
                    stepId={step.id}
                    stepIndex={step.index}
                    eraStaging={eraStaging}
                    active={active}
                    className="pointer-events-none absolute left-0 top-0 h-0 w-0 overflow-hidden opacity-0"
                  >
                    <span aria-hidden className="block h-0 w-0" />
                  </EraRevealBand>
                )}
                <div className="flex w-full shrink-0 justify-center px-1">
                  <motion.div
                    data-no-click-advance
                    className="relative isolate z-10 flex w-max max-w-full flex-row flex-wrap items-center justify-center gap-y-2"
                    onPointerDown={(e) => e.stopPropagation()}
                  >
                    {vs.map((stage, i) => (
                      <Fragment key={`${stage.number}-${stage.label}-${i}-row`}>
                        {i > 0 ? (
                          <ValueStageRowArrow
                            accentColor={accent.base}
                            emphasized={arrowLit(i)}
                          />
                        ) : null}
                        <div
                          className="flex min-w-[10rem] max-w-[11rem] flex-[0_0_auto] justify-center"
                        >
                          <EraRevealBand
                            bandId={`valueStagesChunk${i}`}
                            bandIndex={b(`valueStagesChunk${i}`)}
                            stepId={step.id}
                            stepIndex={step.index}
                            eraStaging={eraStaging}
                            active={active}
                            className="w-full"
                          >
                            {renderStageButton(
                              stage,
                              i,
                              i,
                              true,
                              cols,
                              vs.length,
                              i,
                            )}
                          </EraRevealBand>
                        </div>
                      </Fragment>
                    ))}
                  </motion.div>
                </div>
              </motion.div>
            </div>
            {expandedPortal}
          </>
        );
      }

      return (
        <>
          {chunks.map((slice, gi) => (
            <EraRevealBand
              key={`valueStagesChunk-${gi}`}
              bandId={`valueStagesChunk${gi}`}
              bandIndex={b(`valueStagesChunk${gi}`)}
              stepId={step.id}
              stepIndex={step.index}
              eraStaging={eraStaging}
              active={active}
              className="flex w-full justify-center"
            >
              <div className="flex w-full flex-col items-center space-y-3 overflow-visible py-1">
                {gi === 0 ? valueStagesLeadBlock : null}
                <motion.div
                  {...innerMotion}
                  className="relative flex w-full flex-col items-center"
                >
                  <div className="flex w-full shrink-0 justify-center px-1">
                    <motion.div
                      data-no-click-advance
                      className="relative isolate z-10 grid w-full max-w-full auto-rows-fr justify-items-stretch gap-2.5"
                      style={{
                        gridTemplateColumns: valueStagesGridColumns(
                          slice.length,
                          step.content.valueStagesGridCols,
                        ),
                      }}
                      onPointerDown={(e) => e.stopPropagation()}
                    >
                      {slice.map((stage, ji) => {
                        const cols = valueStagesColCount(
                          slice.length,
                          step.content.valueStagesGridCols,
                        );
                        return renderStageButton(
                          stage,
                          gi * revealChunk + ji,
                          ji,
                          true,
                          cols,
                          slice.length,
                          ji,
                        );
                      })}
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </EraRevealBand>
          ))}
          {expandedPortal}
        </>
      );
    }

    return (
      <EraRevealBand
        bandId="valueStages"
        bandIndex={b("valueStages")}
        stepId={step.id}
        stepIndex={step.index}
        eraStaging={eraStaging}
        active={active}
        className="flex w-full justify-center"
      >
        <div className="flex w-full flex-col items-center space-y-3 overflow-visible py-1">
          {valueStagesLeadBlock}
          <motion.div
            {...innerMotion}
            className="relative flex w-full flex-col items-center"
          >
            <div className="flex w-full shrink-0 justify-center px-1">
              <motion.div
                data-no-click-advance
                className="relative isolate z-10 grid w-full max-w-full auto-rows-fr justify-items-stretch gap-2.5"
                style={{
                  gridTemplateColumns: valueStagesGridColumns(
                    vs.length,
                    step.content.valueStagesGridCols,
                  ),
                }}
                onPointerDown={(e) => e.stopPropagation()}
              >
                {vs.map((stage, i) => {
                  const cols = valueStagesColCount(
                    vs.length,
                    step.content.valueStagesGridCols,
                  );
                  return renderStageButton(stage, i, i, false, cols, vs.length, i);
                })}
              </motion.div>
            </div>
          </motion.div>
          {expandedPortal}
        </div>
      </EraRevealBand>
    );
  };

  const renderInfoCardsSection = (): ReactNode => {
    const cards = step.content.infoCards;
    if (!cards?.length) return null;
    const gridCols = step.content.infoCardsGridCols ?? 3;
    const cols = gridCols;
    const leadBlock = step.content.infoCardsLead ? (
      <p
        className={clsx(
          "mx-auto w-full max-w-prose whitespace-pre-line text-center text-[1.05rem] leading-relaxed",
          whiteText ? "text-white" : "text-slate-100/95",
        )}
        style={{ textShadow: `0 0 18px ${accent.base}1f` }}
      >
        {step.content.infoCardsLead}
      </p>
    ) : null;

    return (
      <div className="relative flex w-full flex-col items-center gap-3">
        {leadBlock}
        <div
          className="grid w-full gap-2"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
          {cards.map((card, i) => {
            const stagePal = accentPaletteForValueStage(step.accent, {});
            const shellClass =
              "presentation-card-chip relative flex h-full min-h-[5.5rem] w-full flex-col overflow-hidden rounded-xl border px-3.5 py-3 text-center text-slate-100/90 outline-none transition-[border-color,box-shadow,background] duration-300 ease-out";
            return (
              <div
                key={`info-${i}`}
                data-maestro-anchor
                data-maestro-anchor-priority="1"
                data-no-click-advance
                onPointerDown={(e) => e.stopPropagation()}
                className={`${shellClass} cursor-default`}
                style={{
                  zIndex: 1,
                  ...valueStageCardGlassStyle(stagePal.base, false),
                }}
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-3 -top-px h-px"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${stagePal.base}, transparent)`,
                  }}
                />
                <div className="flex items-baseline justify-center gap-1.5 text-center">
                  {card.number && (
                    <span
                      className="font-display inline-block text-[1.03rem] font-bold tabular-nums"
                      style={{ color: allTextWhite ? "#ffffff" : stagePal.base }}
                    >
                      {card.number}
                    </span>
                  )}
                  <span
                    className={clsx(
                      "text-[11px] font-semibold uppercase tracking-[0.22em]",
                      whiteText && "text-white",
                    )}
                    style={
                      whiteText ? undefined : { color: stagePal.base, opacity: 0.9 }
                    }
                  >
                    {card.label}
                  </span>
                </div>
                {card.description && (
                  <p
                    className={clsx(
                      "mt-2 text-center text-[0.94rem] leading-relaxed",
                      whiteText ? "text-white/95" : "text-slate-100/90",
                    )}
                  >
                    {card.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const hero = step.content.heroImage;

  const centerTitleAndStagesPanel = Boolean(
    step.content.centerTitleAndValueStagesInPanel &&
      ((step.content.valueStages && step.content.valueStages.length > 0) ||
        (step.content.infoCards && step.content.infoCards.length > 0)),
  );

  const clickableWordMedia = step.content.clickableWordMedia ?? [];

  const titleBand =
    painPoints && step.content.headline ? (
      <EraRevealBand
        bandId="title"
        bandIndex={b("title")}
        stepId={step.id}
        stepIndex={step.index}
        eraStaging={eraStaging}
        active={active}
        className="flex w-full justify-center"
      >
        <motion.div {...innerMotion} className="space-y-3 text-center">
          <span
            className={clsx(
              "block text-[10px] font-semibold uppercase tracking-[0.32em]",
              whiteText && "text-white",
            )}
            style={
              whiteText
                ? undefined
                : { color: accent.base, opacity: 0.85 }
            }
          >
            {step.title}
          </span>
          <h2
            className="presentation-ppt-title max-w-[20ch] text-[clamp(1.9rem,4.2vw,2.9rem)] leading-[1.08]"
            style={{
              textShadow: whiteText
                ? "0 0 28px rgba(255,255,255,0.15)"
                : `0 0 28px ${accent.base}22`,
            }}
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
        className="flex w-full justify-center"
      >
        <motion.div
          {...innerMotion}
          className={centerTitleAndStagesPanel ? "text-center" : undefined}
        >
          <h2
            className={
              centerTitleAndStagesPanel
                ? "presentation-ppt-title mx-auto max-w-[24ch] text-center text-[clamp(1.8rem,4vw,2.55rem)]"
                : "presentation-ppt-title max-w-[24ch] text-[clamp(1.8rem,4vw,2.55rem)]"
            }
          >
            {clickableWordMedia.length > 0
              ? renderTextWithClickableWords(
                step.title,
                clickableWordMedia,
                accent.base,
              )
              : step.title}
          </h2>
        </motion.div>
      </EraRevealBand>
    );

  const bodyBand =
    step.content.body && !painPoints ? (
      <EraRevealBand
        bandId="body"
        bandIndex={b("body")}
        stepId={step.id}
        stepIndex={step.index}
        eraStaging={eraStaging}
        active={active}
        className="flex w-full justify-center"
      >
        <motion.p
          {...innerMotion}
          className={clsx(
            "presentation-ppt-body mx-auto w-full max-w-prose whitespace-pre-line text-center",
            whiteText ? "text-white" : "text-slate-100/95",
          )}
        >
          {clickableWordMedia.length > 0
            ? renderTextWithClickableWords(
              step.content.body!,
              clickableWordMedia,
              accent.base,
            )
            : step.content.body}
        </motion.p>
      </EraRevealBand>
    ) : null;

  const contactFormCta = (
    <EraRevealBand
      bandId="contactCta"
      bandIndex={b("contactCta")}
      stepId={step.id}
      stepIndex={step.index}
      eraStaging={eraStaging}
      active={active}
      className="flex w-full justify-center"
    >
      <motion.div
        {...innerMotion}
        data-no-click-advance
        className="flex flex-col items-center justify-center"
      >
        {formUrl.startsWith("http") || formUrl.startsWith("mailto:") ? (
          <a
            data-no-click-advance
            href={formUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className={FORM_BUTTON_CLASS}
          >
            Ir para o formulário
            <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden />
          </a>
        ) : (
          <Link
            data-no-click-advance
            to={formUrl}
            onClick={(e) => e.stopPropagation()}
            className={FORM_BUTTON_CLASS}
          >
            Ir para o formulário
            <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden />
          </Link>
        )}
      </motion.div>
    </EraRevealBand>
  );

  if (ctaFormSlide) {
    return (
      <FloatingCard
        accent={step.accent}
        active={active}
        stepId={step.id}
        cardVisual={step.content.cardVisual}
        hideValueFlow={true}
        hideWatermarkSvg={Boolean(step.content.hideFloatingWatermarkSvg)}
        stepIndex={step.index}
        width={920}
        badge={step.content.headline ?? String(step.index + 1).padStart(2, "0")}
      >
        <motion.div
          className="flex min-h-[min(58vh,500px)] w-full flex-1 flex-col items-center justify-end gap-8 pb-2 pt-10"
          variants={outerContainer}
          initial={reduceMotion ? false : "hidden"}
          animate={active ? "visible" : "hidden"}
        >
          <EraRevealBand
            bandId="closingQuestion"
            bandIndex={b("closingQuestion")}
            stepId={step.id}
            stepIndex={step.index}
            eraStaging={eraStaging}
            active={active}
            className="flex w-full justify-center px-2"
          >
            <motion.h2
              {...innerMotion}
              data-maestro-anchor
              data-maestro-anchor-priority="3"
              className="presentation-ppt-title mx-auto max-w-[34ch] text-center text-[clamp(1.65rem,3.4vw,2.65rem)] leading-[1.12] text-white"
              style={{
                textShadow: `0 0 36px ${accent.base}66, 0 0 72px ${accent.base}33`,
              }}
            >
              {step.content.closingQuestion}
            </motion.h2>
          </EraRevealBand>
          {!step.content.hideContactForm && contactFormCta}
        </motion.div>
      </FloatingCard>
    );
  }

  return (
    <FloatingCard
      accent={step.accent}
      active={active}
      stepId={step.id}
      sidePhotoSrc={hero?.src}
      sidePhotoAlt={hero?.alt}
      bannerTransparentCutout={Boolean(hero?.transparentCutout)}
      bannerLightenBlackMatte={Boolean(hero?.lightenBlackMatte)}
      cardVisual={step.content.cardVisual}
      hideValueFlow={true}
      bannerUnframed={Boolean(step.content.bannerUnframed)}
      hideWatermarkSvg={Boolean(step.content.hideFloatingWatermarkSvg)}
      bannerEraStaging={
        eraStaging && !step.content.heroImage?.transparentCutout
      }
      stepIndex={step.index}
      bannerNewsUrls={step.content.bannerNewsUrls}
      onBannerNewsExpand={expandImage ? handleExpandImage : undefined}
      onBannerPhotoClick={
        hero?.previewSrc
          ? () =>
              setHeroPreviewItem({
                item: {
                  imageUrl: hero.previewSrc!,
                  articleUrl: "",
                  title: hero.alt || step.title,
                  source: step.subtitle,
                },
                accentColor: theme.accents[step.accent].base,
              })
          : undefined
      }
      bannerHeightClass={
        step.content.bannerHeightClass ??
        (step.content.valueStagesRevealSequentialCards ? "h-[300px]" : undefined)
      }
      width={
        painPoints
          ? step.content.painPointsGridCols === 4
            ? 960
            : step.content.painPointsGridCols === 3
              ? 820
              : 640
          : step.content.dualStages
            ? 900
            : step.content.valueStagesRevealChunkSize
              ? 1000
              : step.content.valueStages && step.content.valueStages.length >= 4
                ? 1000
                : step.content.valueStages && step.content.valueStages.length > 0
                  ? 760
                  : undefined
      }
      badge={
        painPoints
          ? String(step.index + 1).padStart(2, "0")
          : (step.content.headline ?? String(step.index + 1).padStart(2, "0"))
      }
    >
      <motion.div
        className={
          centerTitleAndStagesPanel
            ? "flex h-full min-h-0 w-full flex-1 flex-col gap-5"
            : "flex w-full flex-col gap-5"
        }
        variants={outerContainer}
        initial={reduceMotion ? false : "hidden"}
        animate={active ? "visible" : "hidden"}
      >
        {!centerTitleAndStagesPanel && titleBand}

        {step.content.bodyAfterTitle && bodyBand}

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
                  textWhite={whiteText}
                />
              ) : (
                <AnimatedNarrativeMetrics
                  items={step.content.metrics}
                  active={active}
                  reducedMotion={Boolean(reduceMotion)}
                  accentColor={accent.base}
                  textWhite={whiteText}
                />
              )}
            </motion.div>
          </EraRevealBand>
        )}

        {step.content.lead && !step.content.leadByParagraph && (
          <EraRevealBand
            bandId="lead"
            bandIndex={b("lead")}
            stepId={step.id}
            stepIndex={step.index}
            eraStaging={eraStaging}
            active={active}
            className="flex w-full justify-center"
          >
            <motion.p
              {...innerMotion}
              className={clsx(
                "presentation-ppt-body mx-auto max-w-prose whitespace-pre-line text-center",
                whiteText ? "text-white" : "text-slate-100/95",
              )}
            >
              {step.content.lead}
            </motion.p>
          </EraRevealBand>
        )}

        {step.content.lead &&
          step.content.leadByParagraph &&
          splitLeadParagraphs(step.content.lead).map((paragraph, i) => (
            <EraRevealBand
              key={`lead${i}`}
              bandId={`lead${i}`}
              bandIndex={b(`lead${i}`)}
              stepId={step.id}
              stepIndex={step.index}
              eraStaging={eraStaging}
              active={active}
              className="flex w-full justify-center"
            >
              <motion.p
                {...innerMotion}
                className={clsx(
                  "presentation-ppt-body mx-auto max-w-prose whitespace-pre-line text-center",
                  whiteText ? "text-white" : "text-slate-100/95",
                )}
              >
                {paragraph}
              </motion.p>
            </EraRevealBand>
          ))}

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
                    className="presentation-card-chip relative flex-1 overflow-hidden rounded-xl border px-4 py-3.5"
                    style={glassPanelStyle(c.base)}
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
                    <div className="mb-1.5 flex w-full items-center justify-center gap-2">
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
                        className={clsx(
                          "text-[10px] font-semibold uppercase tracking-[0.32em]",
                          whiteText && "text-white",
                        )}
                        style={whiteText ? undefined : { color: c.base }}
                      >
                        {it.label}
                      </span>
                    </div>
                    <p className="text-center text-[1.03rem] leading-relaxed text-white/90 whitespace-pre-line">
                      {it.text}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>
          </EraRevealBand>
        )}

        {centerTitleAndStagesPanel ? (
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-5">
            {titleBand}
            {step.content.infoCards && step.content.infoCards.length > 0
              ? renderInfoCardsSection()
              : renderValueStagesSection()}
          </div>
        ) : step.content.infoCards && step.content.infoCards.length > 0 ? (
          renderInfoCardsSection()
        ) : (
          renderValueStagesSection()
        )}

        {step.content.productExamples && step.content.productExamples.length > 0 && (
          <EraRevealBand
            bandId="productExamples"
            bandIndex={b("productExamples")}
            stepId={step.id}
            stepIndex={step.index}
            eraStaging={eraStaging}
            active={active}
            className="flex w-full justify-center"
          >
            <motion.div {...innerMotion} className="w-full">
              {step.content.productExamples.map((ex) => (
                <img
                  key={ex.imageSrc}
                  src={ex.imageSrc}
                  alt={ex.alt ?? ex.caption}
                  className="mx-auto w-full max-w-full rounded-2xl object-contain"
                  loading="lazy"
                />
              ))}
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
                  if (m.style === "highlight") {
                    return (
                      <EvidenceHighlightCard
                        key={`${m.value}-${m.prefix ?? ""}-${i}`}
                        badge={m.badge}
                        prefix={m.prefix}
                        value={m.value}
                        highlightLabel={m.highlightLabel}
                        typewriter={m.highlightTypewriter}
                        headline={m.headline}
                        context={m.context}
                        accentColor={accent.base}
                        active={active}
                        delay={i * 0.45}
                      />
                    );
                  }
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
                      textWhite={whiteText}
                    />
                  );
                })}
              </motion.div>
            </EraRevealBand>
          )}

        {step.content.dualStages && (
          <div className="space-y-5">
            <EraRevealBand
              bandId="dualStagesPositive"
              bandIndex={b("dualStagesPositive")}
              stepId={step.id}
              stepIndex={step.index}
              eraStaging={eraStaging}
              active={active}
            >
              <DualStageGroupBlock
                group="positive"
                cfg={step.content.dualStages.positive}
                reduceMotion={reduceMotion}
                active={active}
                innerMotion={innerMotion}
              />
            </EraRevealBand>
            <EraRevealBand
              bandId="dualStagesNegative"
              bandIndex={b("dualStagesNegative")}
              stepId={step.id}
              stepIndex={step.index}
              eraStaging={eraStaging}
              active={active}
            >
              <DualStageGroupBlock
                group="negative"
                cfg={step.content.dualStages.negative}
                reduceMotion={reduceMotion}
                active={active}
                innerMotion={innerMotion}
              />
            </EraRevealBand>
          </div>
        )}

        {!step.content.bodyAfterTitle && bodyBand}

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
              className="flex w-full justify-center"
            >
              <motion.ul
                {...innerMotion}
                className="mx-auto mt-1 w-full max-w-prose space-y-2.5 text-center"
              >
                {step.content.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className={
                      whiteText
                        ? "text-[0.96rem] leading-relaxed text-white"
                        : "text-[0.96rem] leading-relaxed text-slate-200"
                    }
                  >
                    <span
                      aria-hidden
                      className="mr-2 inline-block h-1.5 w-1.5 translate-y-[-0.15em] rounded-full align-middle"
                      style={{
                        background: allTextWhite ? "#ffffff" : accent.base,
                        boxShadow: allTextWhite
                          ? "0 0 8px rgba(255,255,255,0.45)"
                          : `0 0 8px ${accent.base}88`,
                      }}
                    />
                    <span className="whitespace-pre-line text-center">
                      {clickableWordMedia.length > 0
                        ? renderTextWithClickableWords(
                          bullet,
                          clickableWordMedia,
                          accent.base,
                        )
                        : bullet}
                    </span>
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
                          className={clsx(
                            "block text-[11px] font-semibold uppercase tracking-[0.26em]",
                          whiteText && "text-white",
                        )}
                        style={
                          whiteText
                            ? undefined
                            : { color: rose.base, opacity: 0.9 }
                        }
                        >
                          DE →
                        </span>
                        <p
                          className={clsx(
                            "mt-0.5 text-[0.98rem] leading-relaxed",
                            whiteText ? "text-white/95" : "text-slate-100/92",
                          )}
                        >
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
                          className={clsx(
                            "block text-[11px] font-semibold uppercase tracking-[0.26em]",
                            whiteText && "text-white",
                        )}
                        style={
                            whiteText
                              ? undefined
                              : { color: emerald.base, opacity: 0.95 }
                        }
                        >
                          PARA →
                        </span>
                        <p
                          className="mt-0.5 text-[0.96rem] font-medium leading-relaxed text-white/95"
                          style={{
                            textShadow: whiteText
                              ? "0 0 18px rgba(255,255,255,0.12)"
                              : `0 0 18px ${emerald.base}22`,
                          }}
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
            reveal={
              step.content.valueStagesRevealSequentialCards &&
                step.content.valueStagesRevealOneAtATime
                ? "single"
                : "cumulative"
            }
            className="flex w-full justify-center"
          >
            <motion.div
              {...innerMotion}
              data-maestro-anchor
              data-maestro-anchor-priority="3"
              className="presentation-card-quote relative mx-auto mt-1 w-fit max-w-full overflow-hidden rounded-2xl border px-5 py-4 sm:max-w-2xl"
              style={{
                borderColor: `${attentionAccent.base}55`,
                background: `linear-gradient(135deg, ${attentionAccent.base}1f 0%, transparent 65%)`,
              }}
            >
              <span
                aria-hidden
                className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full"
                style={{
                  background: attentionAccent.base,
                  boxShadow: `0 0 14px ${attentionAccent.base}`,
                }}
              />
              <motion.span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-2xl"
                style={{
                  boxShadow: `0 0 0 1px ${attentionAccent.base}33, 0 0 36px ${attentionAccent.base}44`,
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
                className="relative whitespace-pre-line px-3 text-center text-[clamp(1.05rem,2.4vw,1.22rem)] font-medium italic leading-relaxed"
                style={{ color: whiteText ? "#ffffff" : attentionAccent.base }}
              >
                “
                {clickableWordMedia.length > 0
                  ? renderTextWithClickableWords(
                    step.content.attentionPhrase,
                    clickableWordMedia,
                    attentionAccent.base,
                  )
                  : step.content.attentionPhrase}
                ”
              </p>
            </motion.div>
          </EraRevealBand>
        )}

        {step.content.newsItems && step.content.newsItems.length > 0 && (
          <EraRevealBand
            bandId="newsItems"
            bandIndex={b("newsItems")}
            stepId={step.id}
            stepIndex={step.index}
            eraStaging={eraStaging}
            active={active}
            className="flex w-full justify-center"
          >
            <motion.div {...innerMotion} className="w-full">
              <NewsEvidenceReveal
                items={step.content.newsItems}
                active={active}
                accentColor={accent.base}
              />
            </motion.div>
          </EraRevealBand>
        )}

        {step.content.newsUrls &&
          step.content.newsUrls.length > 0 &&
          !step.content.newsItems?.length && (
            <EraRevealBand
              bandId="newsUrls"
              bandIndex={b("newsUrls")}
              stepId={step.id}
              stepIndex={step.index}
              eraStaging={eraStaging}
              active={active}
              className="flex w-full justify-center"
            >
              <motion.div
                {...innerMotion}
                data-no-click-advance
                className={
                  step.content.newsUrls.length >= 3
                    ? "grid w-full grid-cols-3 gap-3"
                    : "grid w-full grid-cols-2 gap-3"
                }
              >
                {step.content.newsUrls.map((url, index) => (
                  <button
                    key={`news-url-${index}`}
                    type="button"
                    data-no-click-advance
                    aria-label={expandImage ? "Expandir imagem" : undefined}
                    className={`relative mx-auto h-[280px] w-full overflow-hidden rounded-lg border border-white/10 bg-gray-800/50 p-0 shadow-inner outline-none ${step.content.newsUrls!.length >= 3
                      ? ""
                      : "max-w-[400px]"
                      } ${expandImage
                        ? "cursor-zoom-in transition-transform duration-300 hover:scale-[1.015] focus-visible:ring-2 focus-visible:ring-white/45"
                        : ""
                      }`}
                    onClick={
                      expandImage
                        ? (e) => {
                          e.stopPropagation();
                          handleExpandImage(url);
                        }
                        : undefined
                    }
                  >
                    <img
                      src={url}
                      alt=""
                      draggable={false}
                      className="pointer-events-none h-full w-full object-cover object-top"
                    />
                  </button>
                ))}
              </motion.div>
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

        {step.content.closingQuestion && !step.content.hideContactForm && (
          <EraRevealBand
            bandId="closingQuestion"
            bandIndex={b("closingQuestion")}
            stepId={step.id}
            stepIndex={step.index}
            eraStaging={eraStaging}
            active={active}
            className="flex w-full justify-center"
          >
            <motion.div
              {...innerMotion}
              className="flex flex-col items-center gap-4"
            >
              <motion.div
                data-maestro-anchor
                data-maestro-anchor-priority="2"
                className="presentation-card-quote relative overflow-hidden rounded-2xl border px-5 py-4"
                style={{
                  borderColor: `${accent.base}55`,
                  background: `linear-gradient(135deg, ${accent.base}1c 0%, rgba(255,255,255,0.02) 100%)`,
                  boxShadow: `0 0 0 1px ${accent.base}22, 0 0 32px -12px ${accent.base}99`,
                }}
              >
                <motion.span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-6 -top-px h-px"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${accent.base}, transparent)`,
                  }}
                  animate={
                    active && !reduceMotion
                      ? { opacity: [0.6, 1, 0.6] }
                      : { opacity: 0.6 }
                  }
                  transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                />
                <p
                  className="text-[1.08rem] font-semibold leading-snug text-white"
                  style={{ textShadow: `0 0 22px ${accent.base}44` }}
                >
                  {step.content.closingQuestion}
                </p>
              </motion.div>
              <motion.div
                data-no-click-advance
                className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
              >
                {formUrl.startsWith("http") || formUrl.startsWith("mailto:") ? (
                  <a
                    data-no-click-advance
                    href={formUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className={FORM_BUTTON_CLASS}
                  >
                    Ir para o formulário
                    <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden />
                  </a>
                ) : (
                  <Link
                    data-no-click-advance
                    to={formUrl}
                    onClick={(e) => e.stopPropagation()}
                    className={FORM_BUTTON_CLASS}
                  >
                    Ir para o formulário
                    <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden />
                  </Link>
                )}
              </motion.div>
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

      <AnimatePresence>
        {expandedImage && (
          <ExpandedNewsImage
            imageUrl={expandedImage}
            alt="Imagem ampliada"
            reducedMotion={Boolean(reduceMotion)}
            onClose={handleCloseExpandedImage}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {bannerPreviewItem && (
          <NewsArticlePreview
            item={bannerPreviewItem.item}
            accentColor={bannerPreviewItem.accentColor}
            onClose={() => setBannerPreviewItem(null)}
            reducedMotion={Boolean(reduceMotion)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {heroPreviewItem && (
          <NewsArticlePreview
            item={heroPreviewItem.item}
            accentColor={heroPreviewItem.accentColor}
            onClose={() => setHeroPreviewItem(null)}
            reducedMotion={Boolean(reduceMotion)}
          />
        )}
      </AnimatePresence>
    </FloatingCard>
  );
}

interface ExpandedNewsImageProps {
  imageUrl: string;
  alt?: string;
  reducedMotion: boolean;
  onClose: () => void;
}

function ExpandedNewsImage({
  imageUrl,
  alt = "",
  reducedMotion,
  onClose,
}: ExpandedNewsImageProps) {
  if (typeof document === "undefined") return null;

  return createPortal(
    <motion.div
      data-no-click-advance
      className="fixed inset-0 z-[85] flex items-center justify-center p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <motion.div
        aria-hidden
        className="absolute inset-0 cursor-zoom-out bg-black/80"
      />
      <motion.img
        src={imageUrl}
        alt={alt}
        className="relative max-h-[86vh] max-w-[90vw] cursor-zoom-out rounded-2xl border border-white/15 object-contain shadow-[0_40px_120px_rgba(0,0,0,0.65)]"
        initial={reducedMotion ? false : { opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={
          reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 8 }
        }
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      />
      <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-[11px] uppercase tracking-[0.3em] text-white/45">
        Clique para fechar · ESC
      </p>
    </motion.div>,
    document.body,
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
            filter: "",
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
      : { opacity: 0, y: 14, scale: 0.94, filter: "none" },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "none",
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
        initial={{ backdropFilter: "none" }}
        animate={{ backdropFilter: "none" }}
        exit={{ backdropFilter: "none" }}
        transition={{ duration: 0.4 }}
        style={{ background: "rgba(4, 6, 12, 0.82)" }}
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
              filter: "none",
            }
        }
        animate={{ opacity: 1, scale: 1, x: 0, y: 0, filter: "none" }}
        exit={
          reducedMotion
            ? { opacity: 0 }
            : {
              opacity: 0,
              scale: 0.94,
              y: 8,
              filter: "none",
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
      : { opacity: 0, y: 10, scale: 0.96, filter: "none" },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "none",
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
                className="group relative flex cursor-pointer flex-col items-center gap-3 overflow-hidden rounded-2xl border px-4 py-3 text-center outline-none transition-[border-color,box-shadow,background] duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/45"
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
                    className="inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg"
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
                    className="relative h-2 w-2 flex-shrink-0 rounded-full"
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
                <span className="w-full text-[1.02rem] font-medium leading-relaxed text-slate-100">
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
        initial={{ backdropFilter: "none", background: "rgba(4,6,12,0)" }}
        animate={{
          backdropFilter: "none",
          background: "rgba(4,6,12,0.78)",
        }}
        exit={{ backdropFilter: "none", background: "rgba(4,6,12,0)" }}
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
            : { opacity: 0, scale: 0.88, y: 10, filter: "none" }
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
        <div className="relative flex flex-col items-center gap-4 text-center">
          {prefix ? (
            <span
              aria-hidden
              className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-[1.2rem] font-bold"
              style={{
                background: `${accentColor}22`,
                border: `1px solid ${accentColor}55`,
                color: accentColor,
                boxShadow: `0 0 22px ${accentColor}44`,
              }}
            >
              {renderExpandedCardPrefixContent(prefix)}
            </span>
          ) : Icon ? (
            <span
              aria-hidden
              className="inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl"
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
              className="h-3 w-3 flex-shrink-0 rounded-full"
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
