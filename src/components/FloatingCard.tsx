import { createContext, useContext, type ReactNode } from "react";
import clsx from "clsx";
import { motion, useReducedMotion } from "framer-motion";
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
import { CinematicBanner } from "@/components/visuals/CinematicBanner";
import {
  CardVisual,
  type CardVisualVariant,
} from "@/components/visuals/CardVisualVariants";

/** Escala base para melhorar leitura sem perder composição do layout (todas as trilhas). */
const BASE_CARD_TEXT_SCALE = 1.08;

const CARD_BACKGROUND = INTRO_ASSIST_COVER_URL;

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
  trackId?: TrackId;
  /** Esconde a faixa de foto/vídeo no topo; só o painel de conteúdo. */
  omitSidePhoto?: boolean;
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
  stepId,
  bannerTransparentCutout = false,
  bannerLightenBlackMatte = false,
  hideValueFlow,
  cardVisual,
  bannerHeightClass,
  bannerUnframed = false,
  hideWatermarkSvg = false,
  children,
}: FloatingCardProps) {
  const ctx = useContext(FloatingCardContext);
  const resolvedFlip = flipPhoto ?? ctx?.flipPhoto ?? false;
  const resolvedWidth = ctx?.forceWidth ?? width;
  const resolvedVideoSrc = bannerVideoSrc ?? ctx?.bannerVideoSrc;
  const resolvedVideoPoster = bannerVideoPoster ?? ctx?.bannerVideoPoster;
  const omitSidePhoto = Boolean(ctx?.omitSidePhoto);
  const cardTextScale = BASE_CARD_TEXT_SCALE;
  const accentColor = theme.accents[accent];
  const reduceMotion = useReducedMotion();
  const photoMotion = getPhotoColumnVariants(resolvedFlip);
  const panelMotion = getContentPanelVariants(resolvedFlip);
  const layerAnimate = reduceMotion ? "visible" : active ? "visible" : "hidden";
  const layerInitial = reduceMotion ? false : "hidden";
  const preset = stepId ? presentationSidePhotoForStep(stepId) : null;
  const photoSrc = sidePhotoSrc ?? preset?.src ?? CARD_BACKGROUND;
  const photoAlt = sidePhotoAlt ?? preset?.alt ?? "";

  return (
    <div
      className={clsx(
        "flex items-stretch",
        bannerUnframed ? "gap-0" : "gap-3",
        resolvedFlip ? "flex-col-reverse" : "flex-col",
      )}
      style={{ width: resolvedWidth }}
    >
      {!omitSidePhoto && (
        <motion.div
          variants={photoMotion}
          initial={layerInitial}
          animate={layerAnimate}
          className={clsx(
            "relative w-full shrink-0 overflow-hidden",
            bannerUnframed ? "mt-0" : "mt-5 rounded-3xl duration-500 ease-out",
            bannerHeightClass ?? "h-[460px]",
            bannerTransparentCutout && "bg-[#05070d]",
            !bannerUnframed &&
              (active
                ? "border-white/20 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.65)]"
                : "shadow-[0_22px_60px_-22px_rgba(0,0,0,0.55)] group-hover:-translate-y-1 group-hover:border-white/16"),
          )}
        >
          {resolvedVideoSrc ? (
            <>
              <video
                key={resolvedVideoSrc}
                src={resolvedVideoSrc}
                poster={resolvedVideoPoster ?? photoSrc}
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
          ) : (
            <CinematicBanner
              src={photoSrc}
              alt={photoAlt}
              accentColor={accentColor.base}
              active={active}
              transparentCutout={bannerTransparentCutout}
              lightenBlackMatte={bannerLightenBlackMatte}
              plain={bannerUnframed}
            />
          )}
        </motion.div>
      )}
      <motion.div
        variants={panelMotion}
        initial={layerInitial}
        animate={layerAnimate}
        className={clsx(
          "relative w-full p-12",
          omitSidePhoto
            ? "min-h-[1100px] rounded-3xl "
            : bannerHeightClass
              ? "min-h-[360px]"
              : "min-h-[420px]",
          omitSidePhoto &&
            (active
              ? // ? "border-white/18 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.65)]"
                ""
              : "shadow-[0_22px_60px_-22px_rgba(0,0,0,0.55)]"),
          className,
        )}
      >
        {/* ── Luz cenográfica de fundo ── duas elipses defasadas + plano vinheta.
            Sem borda, sem container — o conteúdo "emerge" da escuridão. */}
        <div
          aria-hidden
          className="pointer-events-none absolute -z-10"
          style={{
            // expande além das bordas do conteúdo, sem forma fixa
            inset: "-12% -10% -18% -10%",
            background: `
              radial-gradient(58% 42% at 28% 18%, ${accentColor.base}28 0%, transparent 70%),
              radial-gradient(68% 48% at 78% 72%, ${accentColor.base}18 0%, transparent 75%),
              radial-gradient(70% 55% at 50% 45%, rgba(13,16,24,0.85) 0%, rgba(6,8,14,0.55) 60%, transparent 100%)
            `,
            filter: "none",
            opacity: active ? 1 : 0.55,
            transition: "opacity 500ms ease-out",
          }}
        />
        {/* Camada de "fumaça" sutil — varia a textura sem desenhar bordas */}
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
        {/* Partículas/grain levíssimo, só pra quebrar planos chapados */}
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
        {!hideWatermarkSvg && (
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
                <stop offset="0%" stopColor={accentColor.base} stopOpacity="0" />
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
            "relative flex h-full flex-col",
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
                  )}
                  style={{
                    background: `${accentColor.base}1a`,
                    color: accentColor.base,
                    border: `1px solid ${accentColor.base}55`,
                    boxShadow: active
                      ? `0 0 18px ${accentColor.base}40, inset 0 1px 0 rgba(255,255,255,0.08)`
                      : undefined,
                  }}
                >
                  <span
                    className="h-1 w-1 rounded-full"
                    style={{ background: accentColor.base }}
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
            <div className="relative flex-1">{children}</div>
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
