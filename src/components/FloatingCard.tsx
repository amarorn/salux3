import { createContext, useContext, type ReactNode } from 'react';
import clsx from 'clsx';
import { motion, useReducedMotion } from 'framer-motion';
import { theme } from '@/domain/theme';
import type { Accent } from '@/domain/types';
import { getContentPanelVariants, getPhotoColumnVariants } from '@/components/steps/slideLayerMotion';
import { INTRO_ASSIST_COVER_URL, presentationSidePhotoForStep } from '@/config/assetUrls';

const CARD_BACKGROUND = INTRO_ASSIST_COVER_URL;

export const FloatingCardContext = createContext<{
  flipPhoto?: boolean;
  /** Quando definido, sobrepõe o `width` solicitado por cada step component. */
  forceWidth?: number;
} | null>(null);

interface FloatingCardProps {
  accent: Accent;
  active?: boolean;
  width?: number;
  className?: string;
  badge?: string;
  flipPhoto?: boolean;
  /** Sobrepõe a foto da coluna lateral (evita repetir a mesma imagem dentro do painel na capa). */
  sidePhotoSrc?: string;
  sidePhotoAlt?: string;
  /** Atribui uma foto distinta por slide (`config/assetUrls`). */
  stepId?: string;
  children: ReactNode;
}

export function FloatingCard({
  accent,
  active = false,
  width = 520,
  className,
  badge,
  flipPhoto,
  sidePhotoSrc,
  sidePhotoAlt,
  stepId,
  children,
}: FloatingCardProps) {
  const ctx = useContext(FloatingCardContext);
  const resolvedFlip = flipPhoto ?? ctx?.flipPhoto ?? false;
  const resolvedWidth = ctx?.forceWidth ?? width;
  const accentColor = theme.accents[accent];
  const reduceMotion = useReducedMotion();
  const photoMotion = getPhotoColumnVariants(resolvedFlip);
  const panelMotion = getContentPanelVariants(resolvedFlip);
  const layerAnimate = reduceMotion ? 'visible' : active ? 'visible' : 'hidden';
  const layerInitial = reduceMotion ? false : 'hidden';
  const preset = stepId ? presentationSidePhotoForStep(stepId) : null;
  const photoSrc = sidePhotoSrc ?? preset?.src ?? CARD_BACKGROUND;
  const photoAlt = sidePhotoAlt ?? preset?.alt ?? '';

  return (
    <div
      className={clsx(
        'flex items-stretch gap-3',
        resolvedFlip ? 'flex-col-reverse' : 'flex-col',
      )}
      style={{ width: resolvedWidth }}
    >
      <motion.div
        variants={photoMotion}
        initial={layerInitial}
        animate={layerAnimate}
        className={clsx(
          'relative h-[260px] w-full shrink-0 overflow-hidden rounded-3xl border border-white/10 transition-[border-color,box-shadow] duration-500 ease-out',
          active
            ? 'border-white/20 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.65)]'
            : 'shadow-[0_22px_60px_-22px_rgba(0,0,0,0.55)] group-hover:-translate-y-1 group-hover:border-white/16',
        )}
      >
        <img
          key={photoSrc}
          src={photoSrc}
          alt={photoAlt}
          {...(!photoAlt ? { 'aria-hidden': true as const } : {})}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ filter: 'brightness(0.85) saturate(0.95)' }}
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.55) 100%)',
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, transparent 60%, ${accentColor.base}30 100%)`,
            opacity: active ? 1 : 0.6,
          }}
        />
      </motion.div>

      <motion.div
        variants={panelMotion}
        initial={layerInitial}
        animate={layerAnimate}
        className={clsx(
          'relative w-full overflow-hidden rounded-3xl border border-white/10 bg-[#0d1018] p-8 transition-[border-color,box-shadow] duration-500 ease-out',
          active
            ? 'border-white/20 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.08)]'
            : 'shadow-[0_22px_60px_-22px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.05)] group-hover:-translate-y-1 group-hover:border-white/16',
          className,
        )}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at top, ${accentColor.base}1f, transparent 60%)`,
            opacity: active ? 1 : 0.5,
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-6 -top-px h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${accentColor.base}cc, transparent)`,
            opacity: active ? 1 : 0.5,
          }}
        />
        <div className="relative">
          {badge && (
            <div className="mb-6 flex items-center gap-3">
              <span
                className={clsx(
                  'inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] transition-[box-shadow] duration-500',
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
                className="h-px flex-1"
                style={{
                  background: `linear-gradient(90deg, ${accentColor.base}66, transparent)`,
                }}
              />
            </div>
          )}
          {children}
        </div>
      </motion.div>
    </div>
  );
}
