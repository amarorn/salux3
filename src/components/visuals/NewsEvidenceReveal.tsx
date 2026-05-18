import { useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ExternalLink, X } from "lucide-react";
import clsx from "clsx";
import type { NewsItem } from "@/domain/types";

interface NewsEvidenceRevealProps {
  items: NewsItem[];
  active: boolean;
  accentColor: string;
  staggerMs?: number;
}

export function NewsEvidenceReveal({
  items,
  active,
  accentColor,
  staggerMs = 140,
}: NewsEvidenceRevealProps) {
  const reduceMotion = useReducedMotion();
  const [preview, setPreview] = useState<NewsItem | null>(null);

  if (!items.length) return null;

  return (
    <>
      <motion.div
        data-no-click-advance
        className={clsx(
          "mx-auto grid w-full gap-3",
          items.length === 1 ? "max-w-xl grid-cols-1" : "grid-cols-3",
        )}
        initial={false}
      >
        {items.map((item, index) => (
          <NewsCard
            key={`${item.articleUrl}-${index}`}
            item={item}
            index={index}
            active={active}
            accentColor={accentColor}
            reduceMotion={Boolean(reduceMotion)}
            staggerMs={staggerMs}
            onOpen={() => setPreview(item)}
          />
        ))}
      </motion.div>

      <AnimatePresence>
        {preview && (
          <NewsArticlePreview
            item={preview}
            accentColor={accentColor}
            onClose={() => setPreview(null)}
            reducedMotion={Boolean(reduceMotion)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function NewsCard({
  item,
  index,
  active,
  accentColor,
  reduceMotion,
  staggerMs,
  onOpen,
}: {
  item: NewsItem;
  index: number;
  active: boolean;
  accentColor: string;
  reduceMotion: boolean;
  staggerMs: number;
  onOpen: () => void;
}) {
  const delay = reduceMotion ? 0 : index * (staggerMs / 1000);

  return (
    <motion.button
      type="button"
      data-no-click-advance
      aria-label={
        item.title ? `Abrir prévia: ${item.title}` : "Abrir prévia da matéria"
      }
      className={clsx(
        "presentation-glass-chip group relative flex h-full min-h-0 w-full flex-col overflow-hidden rounded-xl border text-left outline-none",
        "transition-[box-shadow,border-color] duration-300",
        "focus-visible:ring-2 focus-visible:ring-white/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070d]",
      )}
      style={{
        borderColor: `${accentColor}33`,
        boxShadow: `0 20px 48px -24px rgba(0,0,0,0.75), 0 0 36px -16px ${accentColor}44`,
      }}
      initial={
        reduceMotion ? false : { opacity: 0, scale: 0.82, filter: "blur(8px)" }
      }
      animate={
        active
          ? { opacity: 1, scale: 1, filter: "blur(0px)" }
          : reduceMotion
            ? undefined
            : { opacity: 0, scale: 0.82, filter: "blur(8px)" }
      }
      transition={{
        duration: 0.72,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={reduceMotion ? undefined : { scale: 1.03, y: -2 }}
      whileTap={reduceMotion ? undefined : { scale: 0.992 }}
      onClick={(e) => {
        e.stopPropagation();
        onOpen();
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-4 -top-px h-px opacity-80"
        style={{
          background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(80% 60% at 50% 0%, ${accentColor}18 0%, transparent 70%)`,
        }}
      />
      <motion.div
        className="relative h-[88px] w-full shrink-0 overflow-hidden"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.88 }}
        animate={
          active
            ? { opacity: 1, scale: 1 }
            : reduceMotion
              ? undefined
              : { opacity: 0, scale: 0.88 }
        }
        transition={{
          duration: 0.55,
          delay: delay + 0.06,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <img
          src={item.imageUrl}
          alt=""
          draggable={false}
          className="pointer-events-none h-full w-full object-cover object-top"
        />
        <span
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-[#05070d]/90 via-[#05070d]/20 to-transparent"
        />
      </motion.div>
      <motion.div
        className="flex min-h-0 flex-1 flex-col justify-center gap-1 px-3 py-2.5"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
        animate={
          active
            ? { opacity: 1, scale: 1 }
            : reduceMotion
              ? undefined
              : { opacity: 0, scale: 0.94 }
        }
        transition={{
          duration: 0.5,
          delay: delay + 0.12,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        {item.source && (
          <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/50">
            {item.source}
          </span>
        )}
        {item.title && (
          <p className="line-clamp-2 text-[0.8rem] font-medium leading-snug text-white/92">
            {item.title}
          </p>
        )}
        <span className="mt-0.5 inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-white/45 transition-colors group-hover:text-white/75">
          Ver matéria
          <ExternalLink className="h-3 w-3" strokeWidth={2} aria-hidden />
        </span>
      </motion.div>
    </motion.button>
  );
}

export function NewsArticlePreview({
  item,
  accentColor,
  onClose,
  reducedMotion,
}: {
  item: NewsItem;
  accentColor: string;
  onClose: () => void;
  reducedMotion: boolean;
}) {
  const [showEmbed, setShowEmbed] = useState(false);
  const host =
    typeof document !== "undefined"
      ? document.getElementById("salux-stage")
      : null;

  if (!host) return null;

  return createPortal(
    <motion.div
      data-no-click-advance
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reducedMotion ? 0.01 : 0.28 }}
    >
      <motion.button
        type="button"
        aria-label="Fechar prévia"
        className="absolute inset-0 cursor-pointer border-0 bg-[#05070d]/82 backdrop-blur-md"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="news-preview-title"
        className="presentation-glass-chip relative z-[1] flex max-h-[min(88vh,920px)] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border shadow-2xl"
        style={{
          borderColor: `${accentColor}44`,
          boxShadow: `0 32px 80px -20px rgba(0,0,0,0.85), 0 0 60px -12px ${accentColor}55`,
        }}
        initial={
          reducedMotion
            ? false
            : { opacity: 0, scale: 0.88, y: 24, filter: "blur(12px)" }
        }
        animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
        exit={
          reducedMotion
            ? { opacity: 0 }
            : { opacity: 0, scale: 0.92, y: 16, filter: "blur(8px)" }
        }
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div
          className="flex shrink-0 items-start justify-between gap-3 border-b border-white/10 px-5 py-4"
          style={{
            background: `linear-gradient(135deg, ${accentColor}14 0%, transparent 70%)`,
          }}
        >
          <div className="min-w-0 flex-1">
            {item.source && (
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/50">
                {item.source}
              </p>
            )}
            <h2
              id="news-preview-title"
              className="mt-1 text-[1.05rem] font-semibold leading-snug text-white sm:text-lg"
            >
              {item.title ?? "Matéria"}
            </h2>
          </div>
          <button
            type="button"
            data-no-click-advance
            aria-label="Fechar"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition-colors hover:border-white/30 hover:bg-white/10 hover:text-white"
            onClick={onClose}
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </motion.div>

        <motion.div className="relative min-h-0 flex-1 overflow-y-auto">
          <PreviewHero item={item} accentColor={accentColor} maxHeightClass={item.skipEmbedPreview ? "max-h-[64vh]" : "max-h-[38vh]"} />
          {!item.skipEmbedPreview && showEmbed ? (
            item.embedAsMobile ? (
              <div className="flex justify-center border-t border-white/10 bg-[#0a0c12] py-6">
                <div
                  className="relative overflow-hidden rounded-[2rem] border-[6px] border-[#1a1a1a] bg-black shadow-2xl"
                  style={{ width: 375, maxWidth: "90vw" }}
                >
                  <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-6 bg-[#1a1a1a]" />
                  <iframe
                    title={item.title ?? "Prévia da matéria"}
                    src={item.articleUrl}
                    className="h-[min(52vh,560px)] w-[375px] max-w-full border-0 bg-white"
                    sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-1 bg-[#1a1a1a]" />
                </div>
              </div>
            ) : (
              <iframe
                title={item.title ?? "Prévia da matéria"}
                src={item.articleUrl}
                className="h-[min(52vh,560px)] w-full border-0 border-t border-white/10 bg-[#0a0c12]"
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              />
            )
          ) : null}
        </motion.div>

        <motion.div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-white/10 px-5 py-3.5">
          {!item.skipEmbedPreview && (
            <button
              type="button"
              data-no-click-advance
              className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50 transition-colors hover:text-white/85"
              onClick={() => setShowEmbed((v) => !v)}
            >
              {showEmbed ? "Ocultar prévia do site" : "Tentar prévia do site"}
            </button>
          )}
          {item.skipEmbedPreview ? (
            <span className="text-[11px] font-medium tracking-[0.12em] text-white/40">
              {item.articleUrl}
            </span>
          ) : (
            <a
              data-no-click-advance
              href={item.articleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/90 transition-colors hover:text-white"
              style={{
                borderColor: `${accentColor}55`,
                background: `${accentColor}18`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              Abrir matéria completa
              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            </a>
          )}
        </motion.div>
      </motion.div>
    </motion.div>,
    host,
  );
}

function PreviewHero({
  item,
  accentColor,
  maxHeightClass = "max-h-[38vh]",
}: {
  item: NewsItem;
  accentColor: string;
  maxHeightClass?: string;
}) {
  return (
    <motion.div
      className="relative overflow-hidden"
      initial={{ opacity: 0, scale: 1.06 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className={clsx("relative overflow-hidden", maxHeightClass)}
        style={{
          boxShadow: `inset 0 -48px 48px -24px ${accentColor}22`,
        }}
      >
        <img
          src={item.imageUrl}
          alt=""
          className={clsx("h-full w-full object-cover object-top", maxHeightClass)}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#05070d] via-[#05070d]/20 to-transparent"
        />
      </div>
    </motion.div>
  );
}
