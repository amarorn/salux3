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
import { ClosingMaestroCompanion } from "@/components/MaestroOrb";
import { SaluxLogo } from "@/components/intro/SaluxLogo";
import { BURST_VECTORS, EASE_BURST } from "@/components/intro/logoMotion";
import { ClosingHighlight, HighlightPhraseList } from "./HighlightBlocks";
import { resolveContactFormUrl } from "@/config/contact";
import { usePresentationStore } from "@/store/presentationStore";
import { EraRevealBand } from "@/components/motion/EraAgenticaReveal";
import { buildClosingBandKeys } from "@/lib/eraAgenticaRevealBands";
import { trackUsesEraStagedReveal } from "@/lib/trackEraStaging";
import { ExpandedCardPortal } from "./ExpandedCardPortal";

const CLOSING_FORM_CTA_LABEL = "Ir para o formulário";
const CLOSING_FORM_CTA_CHARS = CLOSING_FORM_CTA_LABEL.split("");
const CLOSING_CTA_ASSEMBLY_DELAY = 1.55;
const CLOSING_CTA_CHAR_STAGGER = 0.036;

const CLOSING_LOGO_SIZE = 200;
const CLOSING_MAESTRO_GAP = 72;

function ClosingFormCta({
  href,
  external,
  active,
  reduceMotion,
  afterLogoFlight,
}: {
  href: string;
  external: boolean;
  active: boolean;
  reduceMotion: boolean | null;
  afterLogoFlight: boolean;
}) {
  const assemblyDelay =
    CLOSING_CTA_ASSEMBLY_DELAY + (afterLogoFlight ? 0.45 : 0);
  const linkClass =
    "pointer-events-auto group inline-flex min-h-[3.25rem] items-center justify-center gap-4 border-0 bg-transparent px-2 py-3 text-[clamp(1.05rem,2.15vw,1.4rem)] font-semibold uppercase tracking-[0.14em] text-white outline-none transition-[color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-violet-100 focus-visible:ring-2 focus-visible:ring-violet-300/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070d]";

  const label = (
    <span
      className="inline-flex flex-wrap items-center justify-center gap-[0.02em] leading-none"
      aria-hidden
    >
      {CLOSING_FORM_CTA_CHARS.map((char, i) => {
        const v = BURST_VECTORS[i % BURST_VECTORS.length]!;
        const isSpace = char === " ";
        return (
          <motion.span
            key={`${i}-${char}`}
            className={isSpace ? "inline-block w-[0.38em]" : "inline-block"}
            initial={
              reduceMotion
                ? false
                : {
                  opacity: 0,
                  x: v.x * 0.14,
                  y: v.y * 0.1,
                  rotate: v.rz * 0.35,
                  scale: 0.25,
                  filter: "blur(10px)",
                }
            }
            animate={
              active
                ? {
                  opacity: 1,
                  x: 0,
                  y: 0,
                  rotate: 0,
                  scale: 1,
                  filter: "blur(0px)",
                }
                : reduceMotion
                  ? undefined
                  : {
                    opacity: 0,
                    x: v.x * 0.14,
                    y: v.y * 0.1,
                    rotate: v.rz * 0.35,
                    scale: 0.25,
                    filter: "blur(10px)",
                  }
            }
            transition={
              reduceMotion
                ? { duration: 0.01 }
                : {
                  delay: assemblyDelay + i * CLOSING_CTA_CHAR_STAGGER,
                  duration: 0.68,
                  ease: EASE_BURST,
                }
            }
          >
            {isSpace ? "\u00a0" : char}
          </motion.span>
        );
      })}
    </span>
  );

  const arrow = (
    <motion.span
      className="inline-flex shrink-0"
      initial={
        reduceMotion
          ? false
          : { opacity: 0, x: -28, scale: 0.2, rotate: -40, filter: "blur(8px)" }
      }
      animate={
        active
          ? { opacity: 1, x: 0, scale: 1, rotate: 0, filter: "blur(0px)" }
          : reduceMotion
            ? undefined
            : { opacity: 0, x: -28, scale: 0.2, rotate: -40, filter: "blur(8px)" }
      }
      transition={
        reduceMotion
          ? { duration: 0.01 }
          : {
            delay:
              assemblyDelay +
              CLOSING_FORM_CTA_CHARS.length * CLOSING_CTA_CHAR_STAGGER +
              0.12,
            duration: 0.72,
            ease: EASE_BURST,
          }
      }
    >
      <ArrowRight
        className="h-6 w-6 transition-transform duration-300 group-hover:translate-x-1.5 md:h-7 md:w-7"
        strokeWidth={2.25}
        aria-hidden
      />
    </motion.span>
  );

  const content = (
    <>
      {label}
      {arrow}
    </>
  );

  if (external) {
    return (
      <a
        data-no-click-advance
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className={linkClass}
        aria-label={CLOSING_FORM_CTA_LABEL}
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      data-no-click-advance
      to={href}
      onClick={(e) => e.stopPropagation()}
      className={linkClass}
      aria-label={CLOSING_FORM_CTA_LABEL}
    >
      {content}
    </Link>
  );
}

function ClosingLogoDescent({
  active,
  reduceMotion,
  accentColor,
  innerMotion,
  eraStaging,
  step,
  bandIndex,
}: {
  active: boolean;
  reduceMotion: boolean | null;
  accentColor: string;
  innerMotion: Record<string, unknown>;
  eraStaging: boolean;
  step: PresentationStep;
  bandIndex: (id: string) => number;
}) {
  const motionOn = active && !reduceMotion;

  return (
    <EraRevealBand
      bandId="closingLogo"
      bandIndex={bandIndex("closingLogo")}
      stepId={step.id}
      stepIndex={step.index}
      eraStaging={eraStaging}
      active={active}
      className="flex w-full justify-center py-2"
    >
      <motion.div
        {...innerMotion}
        className="relative flex h-[min(14rem,28vh)] w-full items-center justify-center overflow-visible"
        aria-hidden
      >
        <div
          className="relative flex items-center justify-center"
          style={{ width: CLOSING_LOGO_SIZE, height: CLOSING_LOGO_SIZE }}
        >
          <motion.div
            className="absolute top-1/2 z-[2] -translate-y-1/2"
            style={{ right: `calc(100% + ${CLOSING_MAESTRO_GAP}px)` }}
          >
            <ClosingMaestroCompanion
              accent={accentColor}
              active={active}
              reduceMotion={Boolean(reduceMotion)}
            />
          </motion.div>
          <motion.div
            className="relative z-[1] flex items-center justify-center"
            initial={
              reduceMotion
                ? false
                : { opacity: 0, y: "-44vh", scale: 0.15, filter: "blur(18px)" }
            }
            animate={
              active
                ? {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  filter: "blur(0px)",
                }
                : reduceMotion
                  ? undefined
                  : { opacity: 0, y: "-44vh", scale: 0.15, filter: "blur(18px)" }
            }
            transition={
              reduceMotion
                ? { duration: 0.01 }
                : {
                  opacity: { duration: 0.5, delay: 0.1 },
                  y: { duration: 1.45, ease: [0.12, 1.15, 0.28, 1], delay: 0.08 },
                  scale: { duration: 1.45, ease: [0.12, 1.15, 0.28, 1], delay: 0.08 },
                  filter: { duration: 1.1, delay: 0.2 },
                }
            }
          >
            <motion.div
              animate={
                motionOn
                  ? {
                    y: [0, -14, 0],
                    scale: [1, 1.08, 1],
                  }
                  : undefined
              }
              transition={{
                duration: 4.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.55,
              }}
            >
              <SaluxLogo
                width={CLOSING_LOGO_SIZE}
                symbolOnly
                animate={motionOn}
                idle={active}
                effects={{ shimmer: true, glowRing: false, aberration: true }}
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </EraRevealBand>
  );
}

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
  const allTextWhite = Boolean(step.content.allTextWhite);
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
  const trackId = useContext(FloatingCardContext)?.trackId;
  const eraStaging = trackUsesEraStagedReveal(trackId);
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

  const hero = step.content.heroImage;

  return (
    <FloatingCard
      accent={step.accent}
      active={active}
      stepId={step.id}
      width={benefits.length >= 4 ? 920 : 640}
      cardVisual={step.content.cardVisual}
      hideValueFlow={true}
      bannerUnframed
      sidePhotoSrc={hero?.src ?? ""}
      sidePhotoAlt={hero?.alt}
      bannerTransparentCutout={Boolean(hero?.transparentCutout)}
      bannerLightenBlackMatte={Boolean(hero?.lightenBlackMatte)}
    >
      <motion.div
        className="flex min-h-0 flex-1 flex-col gap-6"
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
              className={
                allTextWhite
                  ? "presentation-ppt-body text-[1.05rem] leading-relaxed text-white whitespace-pre-line"
                  : "presentation-ppt-body text-[1.05rem] leading-relaxed text-slate-100/96 whitespace-pre-line"
              }
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
                      className="presentation-card-chip relative cursor-pointer overflow-hidden rounded-xl border px-3.5 py-3 outline-none transition-[border-color,box-shadow,background] duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/45"
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
                          style={
                            allTextWhite
                              ? {
                                background: "rgba(255,255,255,0.92)",
                                color: "#0b0f1a",
                                boxShadow: "0 0 14px rgba(255,255,255,0.35)",
                              }
                              : {
                                background: accent.base,
                                color: "#0b0f1a",
                                boxShadow: `0 0 14px ${accent.base}66`,
                              }
                          }
                        >
                          {row.number || "✓"}
                        </span>
                        <p
                          className={
                            allTextWhite
                              ? "text-[1rem] font-medium leading-relaxed text-white"
                              : "text-[1rem] font-medium leading-relaxed text-white/95"
                          }
                        >
                          {row.label}
                          {row.description && (
                            <span
                              className={
                                allTextWhite
                                  ? "block text-[0.96rem] font-normal text-white/90"
                                  : "block text-[0.96rem] font-normal text-slate-100/88"
                              }
                            >
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
              className="presentation-card-quote relative overflow-hidden rounded-2xl border px-5 py-4"
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
              <p className="relative pl-3 text-[clamp(1.12rem,2.5vw,1.35rem)] font-medium italic leading-relaxed text-white">
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

        <motion.div className="mt-auto flex w-full max-w-[36rem] flex-col items-center gap-4 self-center pt-3 text-center">
          {step.content.closingHighlight && (
            <EraRevealBand
              bandId="closingHighlight"
              bandIndex={bandIndex("closingHighlight")}
              stepId={step.id}
              stepIndex={step.index}
              eraStaging={eraStaging}
              active={active}
              className="w-full"
            >
              <motion.div {...innerMotion} className="mx-auto w-full max-w-md">
                <ClosingHighlight
                  text={step.content.closingHighlight}
                  active={active}
                />
              </motion.div>
            </EraRevealBand>
          )}

          {step.content.closingQuestion && (
            <EraRevealBand
              bandId="closingQuestion"
              bandIndex={bandIndex("closingQuestion")}
              stepId={step.id}
              stepIndex={step.index}
              eraStaging={eraStaging}
              active={active}
              className="flex w-full justify-center px-1"
            >
              <motion.h2
                {...innerMotion}
                data-maestro-anchor
                data-maestro-anchor-priority="3"
                className="presentation-ppt-title mx-auto w-full max-w-[32ch] text-center text-[clamp(1.45rem,3vw,2.35rem)] leading-[1.14] text-white"
                style={{
                  textShadow: `0 0 36px ${accent.base}66, 0 0 72px ${accent.base}33`,
                }}
              >
                {step.content.closingQuestion}
              </motion.h2>
            </EraRevealBand>
          )}

          {step.content.closingLogoFlight && (
            <ClosingLogoDescent
              active={active}
              reduceMotion={reduceMotion}
              accentColor={accent.base}
              innerMotion={innerMotion}
              eraStaging={eraStaging}
              step={step}
              bandIndex={bandIndex}
            />
          )}

          {!step.content.hideContactForm && (
            <EraRevealBand
              bandId="cta"
              bandIndex={bandIndex("cta")}
              stepId={step.id}
              stepIndex={step.index}
              eraStaging={eraStaging}
              active={active}
              className="flex w-full justify-center"
            >
              <motion.div
                data-no-click-advance
                className="flex w-full flex-col items-center justify-center"
              >
                <ClosingFormCta
                  href={formUrl}
                  external={
                    formUrl.startsWith("http") || formUrl.startsWith("mailto:")
                  }
                  active={active}
                  reduceMotion={reduceMotion}
                  afterLogoFlight={Boolean(step.content.closingLogoFlight)}
                />
              </motion.div>
            </EraRevealBand>
          )}
        </motion.div>
      </motion.div>
    </FloatingCard>
  );
}
