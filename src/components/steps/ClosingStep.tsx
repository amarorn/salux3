import {
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { FloatingCard, FloatingCardContext } from "../FloatingCard";
import type { PresentationStep } from "@/domain/types";
import { theme } from "@/domain/theme";
import { getCardTextVariants } from "./cardTextMotion";
import { HighlightPhraseList } from "./HighlightBlocks";
import { resolveContactFormUrl } from "@/config/contact";
import { usePresentationStore } from "@/store/presentationStore";
import { EraRevealBand } from "@/components/motion/EraAgenticaReveal";
import { buildClosingBandKeys } from "@/lib/eraAgenticaRevealBands";
import { ExpandedCardPortal } from "./ExpandedCardPortal";

const FORM_BUTTON_CLASS =
  "pointer-events-auto inline-flex items-center justify-center gap-2 rounded-full border border-violet-400/35 bg-violet-500/10 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-violet-200 shadow-[0_18px_48px_-22px_rgba(124,58,237,0.55)] transition-[border-color,background-color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-violet-400/55 hover:bg-violet-500/18";

interface Props {
  step: PresentationStep;
  active: boolean;
}

export function ClosingStep({ step, active }: Props) {
  const reduceMotion = useReducedMotion();
  const flipPhoto = useContext(FloatingCardContext)?.flipPhoto ?? false;
  const { container, item } = getCardTextVariants(
    Boolean(reduceMotion),
    step.index,
    `${step.id}:${step.title}`,
    flipPhoto,
  );
  const metaContact = step.content.meta?.Contato;
  const formUrl = resolveContactFormUrl(
    typeof metaContact === "string" ? metaContact : undefined,
  );

  const accent = theme.accents[step.accent];
  const benefits = step.content.valueStages ?? [];
  const [selectedBenefit, setSelectedBenefit] = useState<number | null>(null);
  const benefitRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!active) setSelectedBenefit(null);
  }, [active]);

  useEffect(() => {
    if (selectedBenefit === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setSelectedBenefit(null);
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [selectedBenefit]);
  const hero = step.content.heroImage;
  const trackId = useContext(FloatingCardContext)?.trackId;
  const eraStaging = trackId === "era-agentica";
  const bandKeys = useMemo(
    () => buildClosingBandKeys(step.content),
    [step.content],
  );
  const bandIndex = (id: string) => bandKeys.indexOf(id);
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

  return (
    <FloatingCard
      accent={step.accent}
      active={active}
      stepId={step.id}
      sidePhotoSrc={hero?.src}
      sidePhotoAlt={hero?.alt}
      width={benefits.length >= 4 ? 820 : 580}
      cardVisual={step.content.cardVisual}
    >
      <motion.div
        className="flex flex-col gap-6"
        variants={outerContainer}
        initial={reduceMotion ? false : "hidden"}
        animate={active ? "visible" : "hidden"}
      >
        <EraRevealBand
          bandId="headline"
          bandIndex={bandIndex("headline")}
          stepId={step.id}
          stepIndex={step.index}
          eraStaging={eraStaging}
          active={active}
        >
          <motion.h2
            {...innerMotion}
            className="presentation-ppt-title max-w-[22ch] text-[clamp(1.95rem,4.8vw,3.05rem)] whitespace-pre-line"
          >
            {step.content.headline}
          </motion.h2>
        </EraRevealBand>

        {step.content.body && (
          <EraRevealBand
            bandId="body"
            bandIndex={bandIndex("body")}
            stepId={step.id}
            stepIndex={step.index}
            eraStaging={eraStaging}
            active={active}
          >
            <motion.p
              {...innerMotion}
              className="presentation-ppt-body text-[1.05rem] leading-relaxed text-slate-100/96 whitespace-pre-line"
            >
              {step.content.body}
            </motion.p>
          </EraRevealBand>
        )}

        {benefits.length > 0 && (
          <EraRevealBand
            bandId="benefits"
            bandIndex={bandIndex("benefits")}
            stepId={step.id}
            stepIndex={step.index}
            eraStaging={eraStaging}
            active={active}
          >
            <motion.div {...innerMotion}>
              <div
                className="grid gap-2.5"
                style={{
                  gridTemplateColumns: `repeat(${step.content.valueStagesGridCols ?? Math.min(benefits.length, 3)}, minmax(0, 1fr))`,
                }}
              >
                {benefits.map((row, i) => {
                  const isFocused = selectedBenefit === i;
                  const isDimmed = selectedBenefit !== null && !isFocused;
                  return (
                    <motion.div
                      ref={(el) => {
                        benefitRefs.current[i] = el;
                      }}
                      key={`${row.label}-${i}`}
                      data-no-click-advance
                      role="button"
                      tabIndex={0}
                      aria-expanded={isFocused}
                      aria-label={row.label}
                      className="relative cursor-pointer overflow-hidden rounded-xl border px-3.5 py-3 outline-none transition-[border-color,box-shadow,background] duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/45"
                      style={{
                        borderColor: isFocused
                          ? `${accent.base}aa`
                          : `${accent.base}55`,
                        background: isFocused
                          ? `linear-gradient(135deg, ${accent.base}28 0%, rgba(255,255,255,0.04) 70%)`
                          : `linear-gradient(135deg, ${accent.base}1c 0%, rgba(255,255,255,0.02) 70%)`,
                        boxShadow: isFocused
                          ? `inset 0 1px 0 rgba(255,255,255,0.1), 0 0 0 1px ${accent.base}55, 0 16px 40px -8px ${accent.base}44`
                          : `inset 0 1px 0 rgba(255,255,255,0.05)`,
                      }}
                      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                      animate={
                        !active
                          ? reduceMotion
                            ? undefined
                            : { opacity: 0, y: 10 }
                          : isDimmed
                            ? {
                                opacity: 0.35,
                                scale: 0.97,
                                transition: {
                                  duration: 0.3,
                                  ease: [0.22, 1, 0.36, 1],
                                },
                              }
                            : {
                                opacity: 1,
                                scale: 1,
                                y: 0,
                                transition: {
                                  duration: 0.5,
                                  ease: [0.22, 1, 0.36, 1],
                                  delay: 0.4 + i * 0.08,
                                },
                              }
                      }
                      whileTap={reduceMotion ? undefined : { scale: 0.96 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedBenefit((s) => (s === i ? null : i));
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSelectedBenefit((s) => (s === i ? null : i));
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
                      <div className="flex items-start gap-2.5">
                        <span
                          aria-hidden
                          className="mt-0.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md text-[12px] font-bold"
                          style={{
                            background: accent.base,
                            color: "#0b0f1a",
                            boxShadow: `0 0 14px ${accent.base}66`,
                          }}
                        >
                          {row.number || "✓"}
                        </span>
                        <p className="text-[1rem] font-medium leading-relaxed text-white/95">
                          {row.label}
                          {row.description && (
                            <span className="block text-[0.96rem] font-normal text-slate-100/88">
                              {row.description}
                            </span>
                          )}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <AnimatePresence>
                {selectedBenefit !== null &&
                  benefits[selectedBenefit] !== undefined && (
                    <ExpandedCardPortal
                      key={`benefit-expanded-${selectedBenefit}`}
                      text={benefits[selectedBenefit]!.label}
                      prefix={benefits[selectedBenefit]!.number || "✓"}
                      description={
                        benefits[selectedBenefit]!.description || undefined
                      }
                      accentColor={accent.base}
                      reducedMotion={Boolean(reduceMotion)}
                      origin={benefitRefs.current[selectedBenefit] ?? null}
                      onClose={() => setSelectedBenefit(null)}
                    />
                  )}
              </AnimatePresence>
            </motion.div>
          </EraRevealBand>
        )}

        {step.content.attentionPhrase && (
          <EraRevealBand
            bandId="attention"
            bandIndex={bandIndex("attention")}
            stepId={step.id}
            stepIndex={step.index}
            eraStaging={eraStaging}
            active={active}
          >
            <motion.div
              {...innerMotion}
              className="relative overflow-hidden rounded-2xl border px-5 py-4"
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
              <p
                className="relative pl-3 text-[clamp(1.12rem,2.5vw,1.35rem)] font-medium italic leading-relaxed"
                style={{
                  color: accent.base,
                  textShadow: `0 0 24px ${accent.base}33`,
                }}
              >
                “{step.content.attentionPhrase}”
              </p>
            </motion.div>
          </EraRevealBand>
        )}

        {step.content.highlightPhrases &&
          step.content.highlightPhrases.length > 0 && (
            <EraRevealBand
              bandId="highlights"
              bandIndex={bandIndex("highlights")}
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

        <EraRevealBand
          bandId="cta"
          bandIndex={bandIndex("cta")}
          stepId={step.id}
          stepIndex={step.index}
          eraStaging={eraStaging}
          active={active}
        >
          <motion.div
            {...innerMotion}
            data-no-click-advance
            className="mt-2 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
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

        {step.content.closingHighlight && (
          <EraRevealBand
            bandId="closingHighlight"
            bandIndex={bandIndex("closingHighlight")}
            stepId={step.id}
            stepIndex={step.index}
            eraStaging={eraStaging}
            active={active}
          >
            <motion.p
              {...innerMotion}
              className="mt-1 text-center text-[1rem] leading-relaxed text-slate-100/90"
            >
              {step.content.closingHighlight}
            </motion.p>
          </EraRevealBand>
        )}
      </motion.div>
    </FloatingCard>
  );
}
