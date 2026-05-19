import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Play } from "lucide-react";
import { theme } from "@/domain/theme";
import type { TrackId } from "@/domain/tracks";
import type { Accent } from "@/domain/types";

import {
  getContentPanelVariants,
  getPhotoColumnVariants,
} from "@/components/steps/slideLayerMotion";
import {
  INTRO_ASSIST_COVER_URL,
  presentationSidePhotoForStep,
} from "@/config/assetUrls";
import { EraEntryReveal } from "@/components/motion/EraAgenticaReveal";
import { CinematicBanner } from "@/components/visuals/CinematicBanner";
import {
  CardVisual,
  type CardVisualVariant,
} from "@/components/visuals/CardVisualVariants";
import {
  CARD_EDGE_BANNER,
  CARD_EDGE_SHELL,
  cardEdgeDataAttr,
} from "@/lib/cardEdgeFade";
import {
  bannerHeightForViewport,
  CARD_TEXT_SCALE,
  cardMaxHeightForViewport,
} from "@/lib/presentationLayout";
import type { ViewportSize } from "@/domain/types";

const CARD_BACKGROUND = INTRO_ASSIST_COVER_URL;

/** Reduz proporcionalmente o conteúdo quando excede a altura disponível,
 * para nada ser cortado dentro do card. */
function AutoFitContent({
  children,
  parentScale = 1,
}: {
  children: ReactNode;
  parentScale?: number;
}) {
  const outerRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    const update = () => {
      const availableH = outer.clientHeight;
      const naturalH = inner.scrollHeight;
      if (availableH <= 0 || naturalH <= 0) return;
      const next = Math.min(
        1,
        availableH / Math.max(parentScale, 0.01) / naturalH,
      );
      setScale((prev) => (Math.abs(prev - next) < 0.002 ? prev : next));
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(outer);
    ro.observe(inner);
    return () => ro.disconnect();
  }, [parentScale]);

  return (
    <div
      ref={outerRef}
      className="relative flex h-full w-full items-end justify-center"
    >
      <div
        ref={innerRef}
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "bottom center",
          width: "100%",
        }}
      >
        {children}
      </div>
    </div>
  );
}

/** Hash determinístico do `stepId` — usado para gerar valores estáveis
 *  (posição de gradiente radial, id do `linearGradient` SVG, etc). */
function hashStepId(id: string | undefined): number {
  if (!id) return 0;
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export const FloatingCardContext = createContext<{
  flipPhoto?: boolean;
  /** Quando definido, sobrepõe o `width` solicitado por cada step component. */
  forceWidth?: number;
  /** Vídeo do banner (loop muted), passado a partir do step content. */
  bannerVideoSrc?: string;
  bannerVideoPoster?: string;
  /** Poster no banner; vídeo em lightbox ao clicar. */
  bannerVideoPlayOnClick?: boolean;
  trackId?: TrackId;
  /** Esconde a faixa de foto/vídeo no topo; só o painel de conteúdo. */
  omitSidePhoto?: boolean;
  stageViewport?: ViewportSize;
  /** Imagem do banner abre lightbox ao clicar (default: true). */
  bannerPhotoExpandable?: boolean;
} | null>(null);

interface FloatingCardProps {
  accent: Accent;
  active?: boolean;
  width?: number;
  height?: 640 | 820 | 0;
  className?: string;
  badge?: string;
  flipPhoto?: boolean;
  /** Sobrepõe a foto da coluna lateral (evita repetir a mesma imagem dentro do painel na capa). */
  sidePhotoSrc?: string;
  sidePhotoAlt?: string;
  /** Vídeo no banner (loop, muted, autoplay) — sobrepõe sidePhotoSrc quando definido. */
  bannerVideoSrc?: string;
  /** Poster opcional (imagem antes do vídeo carregar). */
  bannerVideoPoster?: string;
  /** Poster estático no banner; reproduz o vídeo só ao clicar. */
  bannerVideoPlayOnClick?: boolean;
  /** Atribui uma foto distinta por slide (`config/assetUrls`). */
  stepId?: string;
  /** Banner com PNG transparente: fundo `#05070d`, sem tratamento “foto cheia”. */
  bannerTransparentCutout?: boolean;
  /** PNG com chapa preta: `mix-blend-mode: lighten` (fundo escuro da app). */
  bannerLightenBlackMatte?: boolean;
  /** Desativa o visual decorativo no rodapé do painel. */
  hideValueFlow?: boolean;
  /** Variante temática do visual de rodapé (default: 'flow'). */
  cardVisual?: CardVisualVariant;
  /** Altura do banner superior (`h-[460px]` por omissão). Quando há muito texto + grelha, usar classe mais baixa para o bloco dos cartões caber no palco (a câmera assume ~1280px de altura). */
  bannerHeightClass?: string;
  /** Sem caixa em torno da foto (sem borda/sombra/arredondamento). */
  bannerUnframed?: boolean;
  /** Esconde o arco SVG sobre o painel de texto. */
  hideWatermarkSvg?: boolean;
  bannerEraStaging?: boolean;
  stepIndex?: number;
  /** Grelha de capturas de notícia no topo (substitui foto/vídeo do banner). */
  bannerNewsUrls?: string[];
  onBannerNewsExpand?: (url: string) => void;
  /** Callback customizado ao clicar na foto do banner (sobrescreve lightbox padrão). */
  onBannerPhotoClick?: () => void;
  /** Texto do badge e rótulos do card em branco (trilhas com fundo escuro). */
  allTextWhite?: boolean;
  /** Remove máscara/limites visuais do card e deixa o conteúdo flutuar no palco. */
  floatingContent?: boolean;
  /** Componente customizado no lugar do banner (imagem/vídeo). */
  bannerChildren?: ReactNode;
  children: ReactNode;
}

export function FloatingCard({
  accent,
  active = false,
  width = 520,
  height,
  className,
  badge,
  flipPhoto,
  sidePhotoSrc,
  sidePhotoAlt,
  bannerVideoSrc,
  bannerVideoPoster,
  bannerVideoPlayOnClick,
  stepId,
  bannerTransparentCutout = false,
  bannerLightenBlackMatte = false,
  hideValueFlow,
  cardVisual,
  bannerHeightClass,
  bannerUnframed = false,
  hideWatermarkSvg = false,
  bannerEraStaging = false,
  stepIndex = 0,
  bannerNewsUrls,
  onBannerNewsExpand,
  onBannerPhotoClick,
  allTextWhite = false,
  floatingContent = false,
  bannerChildren,
  children,
}: FloatingCardProps) {
  const ctx = useContext(FloatingCardContext);
  const resolvedFlip = flipPhoto ?? ctx?.flipPhoto ?? false;
  const resolvedWidth = ctx?.forceWidth ?? width;
  const resolvedVideoSrc = bannerVideoSrc ?? ctx?.bannerVideoSrc;
  const resolvedVideoPoster = bannerVideoPoster ?? ctx?.bannerVideoPoster;
  const resolvedVideoPlayOnClick =
    bannerVideoPlayOnClick ?? ctx?.bannerVideoPlayOnClick ?? false;
  const [bannerVideoOpen, setBannerVideoOpen] = useState(false);
  const [bannerPhotoExpanded, setBannerPhotoExpanded] = useState(false);
  const omitSidePhoto = Boolean(ctx?.omitSidePhoto);
  useEffect(() => {
    if (!bannerVideoOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setBannerVideoOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [bannerVideoOpen]);

  useEffect(() => {
    if (!active) {
      setBannerVideoOpen(false);
      setBannerPhotoExpanded(false);
    }
  }, [active]);

  useEffect(() => {
    if (!bannerPhotoExpanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setBannerPhotoExpanded(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [bannerPhotoExpanded]);
  const cardTextScale = CARD_TEXT_SCALE;
  const stageViewport = ctx?.stageViewport;
  const cardMaxHeight = stageViewport
    ? cardMaxHeightForViewport(stageViewport.height)
    : undefined;
  const resolvedBannerHeightPx = stageViewport
    ? bannerHeightForViewport(stageViewport.height)
    : undefined;
  const accentColor = theme.accents[accent];
  const reduceMotion = useReducedMotion();
  const photoMotion = getPhotoColumnVariants(resolvedFlip);
  const panelMotion = getContentPanelVariants(resolvedFlip);
  const skipPhotoMotion = bannerUnframed && bannerEraStaging;
  const layerAnimate = reduceMotion
    ? "visible"
    : skipPhotoMotion
      ? undefined
      : active
        ? "visible"
        : "hidden";
  const layerInitial = reduceMotion || skipPhotoMotion ? false : "hidden";
  const preset = stepId ? presentationSidePhotoForStep(stepId) : null;
  const hasBannerNews = Boolean(bannerNewsUrls && bannerNewsUrls.length > 0);
  const photoSrc =
    sidePhotoSrc ??
    (hasBannerNews
      ? undefined
      : resolvedVideoSrc
        ? (resolvedVideoPoster ?? undefined)
        : (preset?.src ?? CARD_BACKGROUND));
  const photoAlt = sidePhotoAlt ?? preset?.alt ?? "";

  const bannerPhotoExpandable = ctx?.bannerPhotoExpandable !== false;
  const canExpandBannerPhoto = Boolean(
    bannerPhotoExpandable &&
    sidePhotoSrc &&
    photoSrc &&
    !hasBannerNews &&
    !resolvedVideoSrc,
  );

  const wrapBannerPhotoExpand = (node: ReactNode) => {
    if (!canExpandBannerPhoto) return node;
    return (
      <motion.div className="absolute inset-0">
        <motion.div className="absolute inset-0" aria-hidden={false}>
          {node}
        </motion.div>
        <button
          type="button"
          data-no-click-advance
          aria-label="Expandir imagem"
          className={clsx(
            "absolute inset-0 z-10 border-0 bg-transparent p-0 outline-none",
            "cursor-zoom-in transition-transform duration-300 hover:scale-[1.01] focus-visible:ring-2 focus-visible:ring-white/45",
          )}
          onClick={(e) => {
            e.stopPropagation();
            if (onBannerPhotoClick) {
              onBannerPhotoClick();
            } else {
              setBannerPhotoExpanded(true);
            }
          }}
        />
      </motion.div>
    );
  };

  return (
    <div
      {...cardEdgeDataAttr("shell")}
      className={clsx(
        !floatingContent && CARD_EDGE_SHELL,
        "flex min-h-0 items-stretch",
        floatingContent ? "overflow-visible" : "overflow-hidden",
        bannerUnframed ? "gap-0" : "gap-3",
        resolvedFlip ? "flex-col-reverse" : "flex-col",
      )}
      style={{
        width: resolvedWidth,
        maxHeight: floatingContent ? undefined : cardMaxHeight,
      }}
    >
      {!omitSidePhoto && (
        <motion.div
          {...cardEdgeDataAttr("banner")}
          variants={skipPhotoMotion ? undefined : photoMotion}
          initial={layerInitial}
          animate={layerAnimate}
          className={clsx(
            CARD_EDGE_BANNER,
            "relative w-full shrink-0 overflow-hidden",
            bannerUnframed ? "mt-0" : "mt-5 rounded-3xl duration-500 ease-out",
            !bannerHeightClass && !resolvedBannerHeightPx && "h-[460px]",
            !bannerUnframed &&
              // ring-1 ring-inset white/15 — "metal escovado" sutil que separa a imagem do fundo
              "ring-1 ring-inset ring-white/12",
            !bannerUnframed &&
            (active
              ? "border border-transparent shadow-[0_30px_80px_-24px_rgba(0,0,0,0.7)]"
              : "border border-transparent shadow-[0_22px_60px_-24px_rgba(0,0,0,0.58)] group-hover:-translate-y-1"),
          )}
          style={
            !bannerHeightClass && resolvedBannerHeightPx
              ? { height: resolvedBannerHeightPx }
              : undefined
          }
        >
          {bannerChildren ? (
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
              {bannerChildren}
            </div>
          ) : hasBannerNews ? (
            bannerNewsUrls!.length === 3 ? (
              <motion.div
                data-no-click-advance
                className="absolute inset-0 p-3 md:p-5"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr 1fr",
                  gridTemplateRows: "1fr 1fr 1fr 1fr",
                  gap: "12px",
                  gridTemplateAreas: `
                    "q0 q0 .  ."
                    "q0 q0 q2 q2"
                    "q1 q1 q2 q2"
                    "q1 q1 q2 q2"
                  `,
                }}
              >
                {bannerNewsUrls!.map((url, index) => {
                  const areas = ["q0", "q1", "q2"];
                  return (
                    <button
                      key={`banner-news-${index}`}
                      type="button"
                      data-no-click-advance
                      aria-label="Expandir imagem"
                      className={clsx(
                        "group relative h-full min-h-0 w-full overflow-hidden rounded-xl border border-white/10 bg-[#0a101c] p-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.55)] outline-none transition-[border-color,box-shadow] duration-300",
                        onBannerNewsExpand &&
                          "cursor-zoom-in hover:border-white/20 hover:shadow-[0_12px_40px_rgba(0,0,0,0.7)] focus-visible:ring-2 focus-visible:ring-white/45",
                      )}
                      style={{ gridArea: areas[index] }}
                      onClick={
                        onBannerNewsExpand
                          ? (e) => {
                              e.stopPropagation();
                              onBannerNewsExpand(url);
                            }
                          : undefined
                      }
                    >
                      <div className="relative h-full w-full overflow-hidden rounded-lg">
                        <img
                          src={url}
                          alt=""
                          draggable={false}
                          className="pointer-events-none h-full w-full object-cover object-top"
                        />
                        <div className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-inset ring-white/[0.04]" />
                      </div>
                    </button>
                  );
                })}
              </motion.div>
            ) : bannerNewsUrls!.length === 6 ? (
              <motion.div
                data-no-click-advance
                className="absolute inset-0 grid grid-cols-2 grid-rows-3 gap-2 bg-[#05070d] p-2"
              >
                {bannerNewsUrls!.map((url, index) => (
                  <button
                    key={`banner-news-${index}`}
                    type="button"
                    data-no-click-advance
                    aria-label="Expandir imagem"
                    className={clsx(
                      "relative h-full min-h-0 w-full overflow-hidden rounded-lg border border-white/10 bg-gray-800/50 p-0 shadow-inner outline-none",
                      onBannerNewsExpand &&
                        "cursor-zoom-in transition-transform duration-300 hover:scale-[1.01] focus-visible:ring-2 focus-visible:ring-white/45",
                    )}
                    onClick={
                      onBannerNewsExpand
                        ? (e) => {
                            e.stopPropagation();
                            onBannerNewsExpand(url);
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
            ) : (
              <motion.div
                data-no-click-advance
                className="absolute inset-0 grid grid-cols-3 gap-2 bg-[#05070d] p-2"
              >
                {bannerNewsUrls!.map((url, index) => (
                  <button
                    key={`banner-news-${index}`}
                    type="button"
                    data-no-click-advance
                    aria-label="Expandir imagem"
                    className={clsx(
                      "relative h-full min-h-0 w-full overflow-hidden rounded-lg border border-white/10 bg-gray-800/50 p-0 shadow-inner outline-none",
                      onBannerNewsExpand &&
                        "cursor-zoom-in transition-transform duration-300 hover:scale-[1.01] focus-visible:ring-2 focus-visible:ring-white/45",
                    )}
                    onClick={
                      onBannerNewsExpand
                        ? (e) => {
                            e.stopPropagation();
                            onBannerNewsExpand(url);
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
            )
          ) : resolvedVideoSrc && resolvedVideoPlayOnClick ? (
            <button
              type="button"
              data-no-click-advance
              aria-label="Reproduzir vídeo"
              className="absolute inset-0 cursor-pointer border-0 bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              onClick={(e) => {
                e.stopPropagation();
                setBannerVideoOpen(true);
              }}
            >
              <CinematicBanner
                src={resolvedVideoPoster ?? photoSrc ?? CARD_BACKGROUND}
                alt={photoAlt}
                accentColor={accentColor.base}
                active={active}
                transparentCutout={bannerTransparentCutout}
                lightenBlackMatte={bannerLightenBlackMatte}
                plain={bannerUnframed}
              />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/25"
              >
                <span
                  className="flex h-16 w-16 items-center justify-center rounded-full border border-white/25 bg-black/45 shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur-sm"
                  style={{ boxShadow: `0 0 32px ${accentColor.base}44` }}
                >
                  <Play className="ml-1 h-7 w-7 text-white" fill="white" />
                </span>
              </span>
            </button>
          ) : resolvedVideoSrc ? (
            <>
              <video
                key={resolvedVideoSrc}
                src={resolvedVideoSrc}
                poster={resolvedVideoPoster ?? photoSrc ?? CARD_BACKGROUND}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                aria-hidden
                className="absolute inset-0 h-full w-full object-cover"
                style={{ filter: "brightness(0.85) saturate(0.95)" }}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.55) 100%)",
                }}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background: `linear-gradient(180deg, transparent 60%, ${accentColor.base}30 100%)`,
                  opacity: active ? 1 : 0.6,
                }}
              />
            </>
          ) : bannerUnframed && bannerEraStaging && stepId && photoSrc ? (
            wrapBannerPhotoExpand(
              <EraEntryReveal
                stepId={stepId}
                stepIndex={stepIndex}
                bandIndex={-1}
                eraStaging={bannerEraStaging}
                active={active}
                className="absolute inset-0"
              >
                <CinematicBanner
                  src={photoSrc}
                  alt={photoAlt}
                  accentColor={accentColor.base}
                  active={active}
                  transparentCutout={bannerTransparentCutout}
                  lightenBlackMatte={bannerLightenBlackMatte}
                  plain
                />
              </EraEntryReveal>,
            )
          ) : photoSrc ? (
            wrapBannerPhotoExpand(
              <CinematicBanner
                src={photoSrc}
                alt={photoAlt}
                accentColor={accentColor.base}
                active={active}
                transparentCutout={bannerTransparentCutout}
                lightenBlackMatte={bannerLightenBlackMatte}
                plain={bannerUnframed}
              />,
            )
          ) : null}
          {!bannerTransparentCutout && (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-28"
              style={{
                background:
                  "linear-gradient(to top, #05070d 0%, rgba(5,7,13,0.72) 42%, transparent 100%)",
              }}
              animate={{ opacity: active ? 1 : 0.65 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            />
          )}
        </motion.div>
      )}

      <AnimatePresence>
        {bannerVideoOpen && resolvedVideoSrc && (
          <BannerVideoLightbox
            videoSrc={resolvedVideoSrc}
            onClose={() => setBannerVideoOpen(false)}
            reducedMotion={Boolean(reduceMotion)}
          />
        )}
        {bannerPhotoExpanded && photoSrc && (
          <BannerPhotoLightbox
            src={photoSrc}
            alt={photoAlt}
            onClose={() => setBannerPhotoExpanded(false)}
            reducedMotion={Boolean(reduceMotion)}
          />
        )}
      </AnimatePresence>

      <motion.div
        variants={panelMotion}
        initial={layerInitial}
        animate={layerAnimate}
        className={clsx(
          omitSidePhoto && CARD_EDGE_SHELL,
          "relative min-h-0 w-full flex-1",
          floatingContent
            ? "overflow-visible rounded-none p-0"
            : "overflow-hidden rounded-3xl px-8 pt-8 pb-10 sm:px-12 sm:pt-12 sm:pb-28",
          floatingContent ? "flex flex-col" : "flex flex-col justify-end",
          omitSidePhoto
            ? "min-h-[min(420px,55vh)]"
            : bannerHeightClass
              ? "min-h-[180px]"
              : "min-h-[160px]",
          className,
        )}
        {...(omitSidePhoto ? cardEdgeDataAttr("shell") : {})}
      >
        {/* ── Luz cenográfica de fundo ── duas elipses defasadas + plano vinheta.
            Sem borda, sem container — o conteúdo "emerge" da escuridão. */}
        {!floatingContent && (
          <div
            aria-hidden
            className="pointer-events-none absolute -z-10"
            style={{
              inset: "-12% -10% -18% -10%",
              background: `
                radial-gradient(58% 42% at 28% 18%, ${accentColor.base}1f 0%, transparent 70%),
                radial-gradient(68% 48% at 78% 72%, ${accentColor.base}14 0%, transparent 75%)
              `,
              filter: "none",
              opacity: active ? 1 : 0.55,
              transition: "opacity 500ms ease-out",
            }}
          />
        )}
        {!floatingContent && (
          <div
            aria-hidden
            className="pointer-events-none absolute -z-10"
            style={{
              inset: "-4% -6% -12% -6%",
              background: `radial-gradient(55% 45% at ${20 + (hashStepId(stepId) % 50)}% ${30 + (hashStepId(stepId + "y") % 40)}%, ${accentColor.base}1a 0%, transparent 70%)`,
              opacity: active ? 0.9 : 0.4,
              mixBlendMode: "screen",
              filter: "none",
            }}
          />
        )}
        {!floatingContent && (
          <div
            aria-hidden
            className="pointer-events-none absolute -z-10 opacity-[0.04]"
            style={{
              inset: 0,
              backgroundImage:
                "radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "3px 3px",
              mixBlendMode: "screen",
            }}
          />
        )}
        {!floatingContent && !hideWatermarkSvg && (
          <svg
            aria-hidden
            className="pointer-events-none absolute -z-10"
            style={{ inset: "-6% -8% -10% -8%", opacity: active ? 0.6 : 0.3 }}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient
                id={`fc-arc-${hashStepId(stepId)}`}
                x1="0"
                y1="0"
                x2="1"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor={accentColor.base}
                  stopOpacity="0"
                />
                <stop
                  offset="50%"
                  stopColor={accentColor.base}
                  stopOpacity="0.5"
                />
                <stop
                  offset="100%"
                  stopColor={accentColor.base}
                  stopOpacity="0"
                />
              </linearGradient>
            </defs>
            <path
              d={
                hashStepId(stepId) % 3 === 0
                  ? "M -5 18 Q 50 4 105 24"
                  : hashStepId(stepId) % 3 === 1
                    ? "M -5 85 Q 60 95 105 78"
                    : "M 8 -5 Q 30 50 22 105"
              }
              fill="none"
              stroke={`url(#fc-arc-${hashStepId(stepId)})`}
              strokeWidth="0.3"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        )}
        <div
          className={clsx(
            "relative z-[1] flex h-full flex-col",
            typeof height === "number" && height > 0 && `min-h-[${height}px]`,
          )}
        >
          <div
            className={clsx(
              "relative mx-auto flex min-h-0 w-full flex-1 flex-col",
              "origin-top",
            )}
            style={{
              transform: `scale(${cardTextScale})`,
              width: `${(100 / cardTextScale).toFixed(4)}%`,
            }}
          >
            {badge && (
              <div className="mb-6 flex w-full items-center justify-center gap-3">
                <span
                  aria-hidden
                  className="h-px min-w-[2rem] flex-1 rounded-full opacity-70"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${accentColor.base}66)`,
                  }}
                />
                <span
                  className={clsx(
                    "inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] transition-[box-shadow] duration-500",
                    allTextWhite && "text-white",
                  )}
                  style={
                    allTextWhite
                      ? {
                        background: "rgba(255,255,255,0.08)",
                        border: "1px solid rgba(255,255,255,0.35)",
                        boxShadow: active
                          ? "0 0 18px rgba(255,255,255,0.12), inset 0 1px 0 rgba(255,255,255,0.08)"
                          : undefined,
                      }
                      : {
                        background: `${accentColor.base}1a`,
                        color: accentColor.base,
                        border: `1px solid ${accentColor.base}55`,
                        boxShadow: active
                          ? `0 0 18px ${accentColor.base}40, inset 0 1px 0 rgba(255,255,255,0.08)`
                          : undefined,
                      }
                  }
                >
                  <span
                    className="h-1 w-1 rounded-full"
                    style={{
                      background: allTextWhite ? "#ffffff" : accentColor.base,
                    }}
                  />
                  {badge}
                </span>
                <span
                  aria-hidden
                  className="h-px min-w-[2rem] flex-1 rounded-full opacity-70"
                  style={{
                    background: `linear-gradient(90deg, ${accentColor.base}66, transparent)`,
                  }}
                />
              </div>
            )}
            <div
              className={clsx(
                "relative",
                floatingContent ? "w-full" : "flex-1 min-h-0",
              )}
            >
              {floatingContent ? children : (
                <AutoFitContent parentScale={cardTextScale}>
                  {children}
                </AutoFitContent>
              )}
            </div>
          </div>

          {!hideValueFlow && (
            <CardVisual
              variant={cardVisual}
              accentColor={accentColor.base}
              active={active}
            />
          )}
        </div>
      </motion.div>
    </div>
  );
}

interface BannerPhotoLightboxProps {
  src: string;
  alt: string;
  onClose: () => void;
  reducedMotion: boolean;
}

function BannerPhotoLightbox({
  src,
  alt,
  onClose,
  reducedMotion,
}: BannerPhotoLightboxProps) {
  if (typeof document === "undefined") return null;

  return createPortal(
    <motion.div
      data-no-click-advance
      role="dialog"
      aria-modal="true"
      aria-label="Imagem ampliada"
      className="fixed inset-0 z-[85] flex items-center justify-center p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.button
        type="button"
        aria-label="Fechar imagem"
        className="absolute inset-0 cursor-zoom-out border-0 bg-black/80 p-0"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      />
      <motion.div
        className="relative z-10 max-h-[86vh] max-w-[90vw] cursor-zoom-out rounded-2xl border border-white/15 p-3 shadow-[0_40px_120px_rgba(0,0,0,0.65)]"
        initial={reducedMotion ? false : { opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={
          reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 8 }
        }
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <motion.img
          src={src}
          alt={alt || "Imagem ampliada"}
          className="max-h-[calc(86vh-1.5rem)] max-w-[calc(90vw-1.5rem)] object-contain"
          initial={false}
          animate={{ opacity: 1 }}
        />
      </motion.div>
      <p className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-center text-[11px] uppercase tracking-[0.3em] text-white/45">
        Clique para fechar · ESC
      </p>
    </motion.div>,
    document.body,
  );
}

interface BannerVideoLightboxProps {
  videoSrc: string;
  onClose: () => void;
  reducedMotion: boolean;
}

function BannerVideoLightbox({
  videoSrc,
  onClose,
  reducedMotion,
}: BannerVideoLightboxProps) {
  if (typeof document === "undefined") return null;

  return createPortal(
    <motion.div
      data-no-click-advance
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[85] flex items-center justify-center p-6 sm:p-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.button
        type="button"
        aria-label="Fechar vídeo"
        className="absolute inset-0 cursor-pointer border-0 bg-black/82 p-0"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      />
      <motion.div
        className="relative z-10 w-full max-w-[min(96vw,1100px)]"
        initial={reducedMotion ? false : { opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={
          reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98, y: 6 }
        }
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <video
          key={videoSrc}
          src={videoSrc}
          controls
          autoPlay
          playsInline
          preload="auto"
          className="max-h-[82vh] w-full rounded-2xl border border-white/15 bg-black shadow-[0_40px_120px_rgba(0,0,0,0.65)]"
        />
        <p className="mt-4 text-center text-[11px] uppercase tracking-[0.3em] text-white/45">
          Clique fora para fechar · ESC
        </p>
      </motion.div>
    </motion.div>,
    document.body,
  );
}
