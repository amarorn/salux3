import { useContext, useLayoutEffect, useMemo } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { FloatingCard, FloatingCardContext } from "../FloatingCard";
import type { ContrastItem, PresentationStep } from "@/domain/types";
import { theme } from "@/domain/theme";
import { getCardTextVariants } from "./cardTextMotion";
import { usePresentationStore } from "@/store/presentationStore";
import { EraRevealBand } from "@/components/motion/EraAgenticaReveal";
import { buildCoverBandKeys } from "@/lib/eraAgenticaRevealBands";

interface Props {
  step: PresentationStep;
  active: boolean;
}

function toneColors(tone: ContrastItem["tone"]) {
  if (tone === "cool") return theme.accents.cyan;
  return theme.accents.rose;
}

function ContrastColumn({
  item,
  active,
  reduce,
  delay,
  className,
}: {
  item: ContrastItem;
  active: boolean;
  reduce: boolean;
  delay: number;
  className?: string;
}) {
  const c = toneColors(item.tone);
  return (
    <motion.div
      className={`relative flex-1 overflow-hidden rounded-xl border px-4 py-3.5 ${className}`}
      style={{
        borderColor: `${c.base}44`,
        background: `linear-gradient(135deg, ${c.base}1a 0%, rgba(255,255,255,0.02) 70%)`,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.06)`,
      }}
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={
        active
          ? { opacity: 1, y: 0 }
          : reduce
            ? undefined
            : { opacity: 0, y: 8 }
      }
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-3 -top-px h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${c.base}, transparent)`,
        }}
      />
      <div className="mb-1.5 flex w-full items-center justify-center gap-2">
        {item.icon && (
          <span
            aria-hidden
            className="text-[22px]"
            style={{ filter: `drop-shadow(0 0 8px ${c.base}55)` }}
          >
            {item.icon}
          </span>
        )}

        <span
          className="text-[16px] font-semibold uppercase tracking-[0.32em]"
          style={{ color: c.base }}
        >
          {item.label}
        </span>
      </div>
      <p className="text-[0.96rem] leading-snug text-white/92 whitespace-pre-line text-center">
        {item.text}
      </p>
    </motion.div>
  );
}

export function CoverStep({ step, active }: Props) {
  const reduceMotion = useReducedMotion();
  const flipPhoto = useContext(FloatingCardContext)?.flipPhoto ?? false;
  const { container, item } = getCardTextVariants(
    Boolean(reduceMotion),
    step.index,
    `${step.id}:${step.title}`,
    flipPhoto,
  );
  const hero = step.content.heroImage;
  const accent = theme.accents[step.accent];
  const contrast = step.content.contrastPair;
  const attention = step.content.attentionPhrase;
  const enriched = Boolean(contrast || attention);
  const trackId = useContext(FloatingCardContext)?.trackId;
  const eraStaging = trackId === "era-agentica";
  const bandKeys = useMemo(
    () => buildCoverBandKeys(step.content),
    [step.content],
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

  return (
    <FloatingCard
      accent={step.accent}
      active={active}
      width={enriched ? 640 : 580}
      height={false}
      stepId={step.id}
      sidePhotoSrc={hero?.src}
      sidePhotoAlt={hero?.alt}
      hideValueFlow={true}
      // cardVisual={step.content.cardVisual}
    >
      <motion.div
        className="flex flex-col items-start gap-5"
        variants={outerContainer}
        initial={reduceMotion ? false : "hidden"}
        animate={active ? "visible" : "hidden"}
      >
        <EraRevealBand
          bandId="title"
          bandIndex={b("title")}
          stepId={step.id}
          stepIndex={step.index}
          eraStaging={eraStaging}
          active={active}
        >
          <motion.h1
            {...innerMotion}
            className="presentation-ppt-title max-w-[22ch] text-[clamp(2.2rem,5.5vw,3.15rem)] text-center whitespace-pre-line"
          >
            {step.title}
          </motion.h1>
        </EraRevealBand>

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

        {contrast && (
          <EraRevealBand
            bandId="contrastPair"
            bandIndex={b("contrastPair")}
            stepId={step.id}
            stepIndex={step.index}
            eraStaging={eraStaging}
            active={active}
            className="w-full"
          >
            <motion.div {...innerMotion} className="flex w-full gap-3">
              <ContrastColumn
                item={contrast.left}
                active={active}
                reduce={Boolean(reduceMotion)}
                delay={0.55}
              />
              <ContrastColumn
                item={contrast.right}
                active={active}
                reduce={Boolean(reduceMotion)}
                delay={0.7}
              />
            </motion.div>
          </EraRevealBand>
        )}

        {step.content.body && (
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
              className="presentation-ppt-body max-w-prose whitespace-pre-line"
            >
              {step.content.body}
            </motion.p>
          </EraRevealBand>
        )}

        {attention && (
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
              className="relative w-full overflow-hidden px-5 py-4"
              style={{
                borderRight: "6px solid",
                borderLeft: "6px solid",
                borderColor: `${accent.base}55`,
                background: `linear-gradient(135deg, ${accent.base}1f 0%, transparent 65%)`,
              }}
            >
              <motion.span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-2xl"
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
                className="relative pl-3 text-[clamp(1.22rem,2.6vw,1.44rem)] text-center italic leading-relaxed"
                style={{
                  color: accent.base,
                  fontFamily: "Inter, system-ui, sans-serif",
                  fontWeight: "var(--ppt-title-weight)",
                  letterSpacing: "var(--ppt-title-tracking)",
                  lineHeight: 1.08,
                }}
              >
                “{attention}”
              </p>
            </motion.div>
          </EraRevealBand>
        )}
      </motion.div>
    </FloatingCard>
  );
}
