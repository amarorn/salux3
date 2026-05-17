import {
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import clsx from "clsx";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { FloatingCard, FloatingCardContext } from "../FloatingCard";
import type {
  CapacityGroup,
  CapacityItem,
  PresentationStep,
} from "@/domain/types";
import { theme } from "@/domain/theme";
import { getCardTextVariants } from "./cardTextMotion";
import { usePresentationStore } from "@/store/presentationStore";
import { EraRevealBand } from "@/components/motion/EraAgenticaReveal";
import { buildCapacitiesBandKeys } from "@/lib/eraAgenticaRevealBands";
import { trackUsesEraStagedReveal } from "@/lib/trackEraStaging";
import { ExpandedCardPortal } from "./ExpandedCardPortal";
import { ProductExamplesStrip } from "./ProductExamplesStrip";

interface Props {
  step: PresentationStep;
  active: boolean;
}

const TONE_COLORS: Record<
  CapacityGroup["tone"],
  { ring: string; chip: string }
> = {
  core: { ring: "#a4c2f4", chip: "Central" },
  support: { ring: "#6fa8dc", chip: "Sustentação" },
};

export function CapacitiesStep({ step, active }: Props) {
  const accent = theme.accents[step.accent];
  const allTextWhite = Boolean(step.content.allTextWhite);
  const reduce = useReducedMotion();
  const cardCtx = useContext(FloatingCardContext);
  const flipPhoto = cardCtx?.flipPhoto ?? false;
  const { container, item } = getCardTextVariants(
    Boolean(reduce),
    step.index,
    `${step.id}:${step.title}`,
    flipPhoto,
  );
  const groups = step.content.capacityGroups ?? [];
  const productExamples = step.content.productExamples ?? [];
  const eraStaging = trackUsesEraStagedReveal(cardCtx?.trackId);
  const bandKeys = useMemo(
    () => buildCapacitiesBandKeys(step.content),
    [step.content],
  );
  const b = (id: string) => bandKeys.indexOf(id);
  const setEraCfg = usePresentationStore((s) => s.setEraStagedRevealConfig);
  const clearEra = usePresentationStore((s) => s.clearEraStagedReveal);
  const stagingLayout = Boolean(active && eraStaging && !reduce);

  const [selectedCapacity, setSelectedCapacity] = useState<number | null>(null);
  const capacityRefs = useRef<(HTMLLIElement | null)[]>([]);

  const flatItems = useMemo(
    () =>
      groups.flatMap((group) =>
        group.items.map((item) => ({
          item,
          ring: TONE_COLORS[group.tone].ring,
        })),
      ),
    [groups],
  );

  useEffect(() => {
    if (!active) setSelectedCapacity(null);
  }, [active]);

  useEffect(() => {
    if (selectedCapacity === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setSelectedCapacity(null);
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [selectedCapacity]);
  const innerMotion = stagingLayout ? {} : { variants: item };
  const outerContainer: Variants = stagingLayout
    ? { hidden: {}, visible: {} }
    : container;

  useLayoutEffect(() => {
    if (!active || !eraStaging) return;
    if (reduce) {
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
    reduce,
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
      sidePhotoSrc={step.content.heroImage?.src}
      sidePhotoAlt={step.content.heroImage?.alt}
      bannerTransparentCutout={Boolean(
        step.content.heroImage?.transparentCutout,
      )}
      bannerLightenBlackMatte={Boolean(
        step.content.heroImage?.lightenBlackMatte,
      )}
      width={760}
      badge={step.title}
      allTextWhite={allTextWhite}
      cardVisual={step.content.cardVisual}
      hideValueFlow={Boolean(step.content.hideValueFlow)}
    >
      <motion.div
        className="flex flex-col gap-6"
        variants={outerContainer}
        initial={reduce ? false : "hidden"}
        animate={active ? "visible" : "hidden"}
      >
        <EraRevealBand
          bandId="headline"
          bandIndex={b("headline")}
          stepId={step.id}
          stepIndex={step.index}
          eraStaging={eraStaging}
          active={active}
          className="flex w-full justify-center"
        >
          <motion.div {...innerMotion}>
            <h2
              className="presentation-ppt-title max-w-[26ch] text-[clamp(1.9rem,4.2vw,2.75rem)] leading-[1.1]"
              style={{ textShadow: `0 0 28px ${accent.base}22` }}
            >
              {step.content.headline ?? "Capacidades coordenadas"}
            </h2>
          </motion.div>
        </EraRevealBand>

        {step.content.body && (
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
              className={
                allTextWhite
                  ? "presentation-ppt-body text-center text-[1.08rem] leading-relaxed text-white whitespace-pre-line"
                  : "presentation-ppt-body text-center text-[1.08rem] leading-relaxed text-slate-100/100 whitespace-pre-line"
              }
            >
              {step.content.body}
            </motion.p>
          </EraRevealBand>
        )}

        {groups.map((group, gi) => {
          const groupBandKey = `group:${gi}:${group.title}`;
          const groupOffset = groups
            .slice(0, gi)
            .reduce((acc, g) => acc + g.items.length, 0);
          return (
            <EraRevealBand
              key={group.title}
              bandId={groupBandKey}
              bandIndex={b(groupBandKey)}
              stepId={step.id}
              stepIndex={step.index}
              eraStaging={eraStaging}
              active={active}
            >
              <motion.section {...innerMotion} className="flex flex-col gap-3">
                <header className="flex items-center gap-3">
                  <span
                    className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em]"
                    style={
                      allTextWhite
                        ? {
                            borderColor: "rgba(255,255,255,0.35)",
                            background: "rgba(255,255,255,0.08)",
                            color: "#ffffff",
                          }
                        : {
                            borderColor: `${TONE_COLORS[group.tone].ring}66`,
                            background: `${TONE_COLORS[group.tone].ring}1a`,
                            color: TONE_COLORS[group.tone].ring,
                          }
                    }
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{
                        background: allTextWhite
                          ? "#ffffff"
                          : TONE_COLORS[group.tone].ring,
                        boxShadow: allTextWhite
                          ? "0 0 10px rgba(255,255,255,0.45)"
                          : `0 0 10px ${TONE_COLORS[group.tone].ring}`,
                      }}
                    />
                    {TONE_COLORS[group.tone].chip}
                  </span>
                  <h3
                    className={
                      allTextWhite
                        ? "text-[1.04rem] font-semibold text-white"
                        : "text-[1.04rem] font-semibold text-white/90"
                    }
                  >
                    {group.title}
                  </h3>
                  <span
                    className="ml-1 h-px flex-1"
                    style={{
                      background: `linear-gradient(90deg, ${TONE_COLORS[group.tone].ring}55, transparent)`,
                    }}
                  />
                </header>

                <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {group.items.map((it, i) => {
                    const fi = groupOffset + i;
                    return (
                      <CapacityCard
                        key={it.name}
                        item={it}
                        ring={TONE_COLORS[group.tone].ring}
                        textWhite={allTextWhite}
                        delay={gi * 0.1 + i * 0.06}
                        reduce={Boolean(reduce)}
                        active={active}
                        selected={selectedCapacity === fi}
                        dimmed={
                          selectedCapacity !== null && selectedCapacity !== fi
                        }
                        onClick={
                          it.productImage
                            ? () =>
                                setSelectedCapacity((s) => (s === fi ? null : fi))
                            : undefined
                        }
                        refCallback={(el) => {
                          capacityRefs.current[fi] = el;
                        }}
                      />
                    );
                  })}
                </ul>
              </motion.section>
            </EraRevealBand>
          );
        })}

        {productExamples.length > 0 && (
          <EraRevealBand
            bandId="productExamples"
            bandIndex={b("productExamples")}
            stepId={step.id}
            stepIndex={step.index}
            eraStaging={eraStaging}
            active={active}
          >
            <motion.div {...innerMotion}>
              <ProductExamplesStrip
                examples={productExamples}
                active={active}
                accentColor={accent.base}
              />
            </motion.div>
          </EraRevealBand>
        )}

        <AnimatePresence>
          {selectedCapacity !== null &&
            flatItems[selectedCapacity] !== undefined && (
              <ExpandedCardPortal
                key={`cap-expanded-${selectedCapacity}`}
                text={flatItems[selectedCapacity]!.item.name}
                description={
                  [
                    flatItems[selectedCapacity]!.item.description,
                    flatItems[selectedCapacity]!.item.tagline,
                  ]
                    .filter(Boolean)
                    .join("\n\n") || undefined
                }
                imageSrc={flatItems[selectedCapacity]!.item.productImage}
                imageAlt={flatItems[selectedCapacity]!.item.name}
                accentColor={flatItems[selectedCapacity]!.ring}
                reducedMotion={Boolean(reduce)}
                origin={capacityRefs.current[selectedCapacity] ?? null}
                onClose={() => setSelectedCapacity(null)}
              />
            )}
        </AnimatePresence>
      </motion.div>
    </FloatingCard>
  );
}

function CapacityCard({
  item,
  ring,
  textWhite = false,
  delay,
  reduce,
  active,
  selected,
  dimmed,
  onClick,
  refCallback,
}: {
  item: CapacityItem;
  ring: string;
  textWhite?: boolean;
  delay: number;
  reduce: boolean;
  active: boolean;
  selected: boolean;
  dimmed: boolean;
  onClick?: () => void;
  refCallback: (el: HTMLLIElement | null) => void;
}) {
  const expandable = Boolean(item.productImage && onClick);

  return (
    <motion.li
      ref={refCallback}
      data-no-click-advance
      role={expandable ? "button" : undefined}
      tabIndex={expandable ? 0 : undefined}
      aria-expanded={expandable ? selected : undefined}
      aria-label={expandable ? item.name : undefined}
      initial={reduce ? false : { opacity: 0, y: 12, scale: 0.96, filter: "" }}
      animate={
        !active
          ? reduce
            ? undefined
            : { opacity: 0, y: 12, scale: 0.96, filter: "" }
          : dimmed
            ? {
                opacity: 0.35,
                scale: 0.97,
                transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
              }
            : { opacity: 1, y: 0, scale: 1, filter: "" }
      }
      transition={{
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
        delay: 0.2 + delay,
      }}
      whileHover={
        expandable && !reduce && !dimmed
          ? { y: -2, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } }
          : undefined
      }
      whileTap={expandable && !reduce ? { scale: 0.96 } : undefined}
      onClick={
        expandable
          ? (e) => {
              e.stopPropagation();
              onClick?.();
            }
          : undefined
      }
      onKeyDown={
        expandable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
      className={clsx(
        "group relative overflow-hidden rounded-2xl border px-4 py-3 outline-none",
        expandable
          ? "cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/45"
          : "cursor-default",
      )}
      style={{
        borderColor: selected ? `${ring}aa` : `${ring}44`,
        background: selected
          ? `linear-gradient(135deg, ${ring}24 0%, rgba(255,255,255,0.04) 100%)`
          : `linear-gradient(135deg, ${ring}14 0%, rgba(255,255,255,0.02) 100%)`,
        boxShadow: selected
          ? `inset 0 1px 0 rgba(255,255,255,0.1), 0 0 0 1px ${ring}55, 0 16px 40px -8px ${ring}44`
          : `inset 0 1px 0 rgba(255,255,255,0.05)`,
      }}
    >
      <motion.span
        aria-hidden
        className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full"
        style={{
          background: `radial-gradient(circle, ${ring}33 0%, transparent 70%)`,
        }}
        animate={reduce ? undefined : { opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative flex flex-col gap-1">
        <span
          className="text-[1.12rem] font-bold leading-tight text-white"
          style={{ textShadow: `0 0 14px ${ring}55` }}
        >
          {item.name}
        </span>
        {/* Subtítulo (marcas/produtos) — oculto na grade; dados permanecem no conteúdo/expanded */}
        {/* {item.subtitle && (
          <span
            className="text-[0.88rem] font-medium uppercase tracking-[0.16em]"
            style={{ color: ring, opacity: 1 }}
          >
            {item.subtitle}
          </span>
        )} */}
        {/* {item.description && (
          <p className="text-[1rem] leading-relaxed text-slate-300/100">
            {item.description}
          </p>
        )} */}
        <p
          className={
            textWhite
              ? "mt-1 text-[1rem] font-semibold italic leading-relaxed text-white/95"
              : "mt-1 text-[1rem] font-semibold italic leading-relaxed"
          }
          style={textWhite ? undefined : { color: ring }}
        >
          {item.tagline}
        </p>
      </div>
    </motion.li>
  );
}
