import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';

interface ExpandedCardPortalProps {
  text: string;
  prefix?: string;
  description?: string;
  accentColor: string;
  reducedMotion: boolean;
  origin: HTMLElement | null;
  onClose: () => void;
}

export function ExpandedCardPortal({
  text,
  prefix,
  description,
  accentColor,
  reducedMotion,
  origin,
  onClose,
}: ExpandedCardPortalProps) {
  const startOffset = (() => {
    if (reducedMotion || typeof window === 'undefined' || !origin) return { dx: 0, dy: 0 };
    const rect = origin.getBoundingClientRect();
    return {
      dx: (rect.left + rect.width / 2) - window.innerWidth / 2,
      dy: (rect.top + rect.height / 2) - window.innerHeight / 2,
    };
  })();

  if (typeof document === 'undefined') return null;

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
        initial={{ backdropFilter: 'blur(0px)', background: 'rgba(4,6,12,0)' }}
        animate={{ backdropFilter: 'blur(14px)', background: 'rgba(4,6,12,0.68)' }}
        exit={{ backdropFilter: 'blur(0px)', background: 'rgba(4,6,12,0)' }}
        transition={{ duration: 0.4 }}
      />

      {/* Card expandido */}
      <motion.div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-[440px] cursor-pointer overflow-hidden rounded-3xl border px-9 py-9"
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
            : { opacity: 0, scale: 0.88, y: 10, filter: 'blur(8px)' }
        }
        transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => { e.stopPropagation(); onClose(); }}
      >
        {/* Linha de destaque superior */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-8 -top-px h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }}
        />
        {/* Halo de fundo */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: `radial-gradient(ellipse at top, ${accentColor}1c, transparent 62%)` }}
        />
        {/* Pulso de borda */}
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-3xl"
          style={{ boxShadow: `0 0 0 1px ${accentColor}44, 0 0 40px ${accentColor}22` }}
          animate={reducedMotion ? {} : { opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.6, ease: 'easeInOut', repeat: Infinity }}
        />

        <div className="relative flex items-start gap-4">
          {prefix && (
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
          )}
          <div>
            <p
              className="text-[1.3rem] font-semibold leading-snug text-white"
              style={{ textShadow: `0 0 30px ${accentColor}33` }}
            >
              {text}
            </p>
            {description && (
              <p className="mt-3 text-[1rem] leading-relaxed text-slate-200/80">{description}</p>
            )}
          </div>
        </div>

        <p className="relative mt-7 text-center text-[11px] uppercase tracking-[0.3em] text-white/32">
          Clique para fechar · ESC
        </p>
      </motion.div>
    </motion.div>,
    document.body,
  );
}

interface ExpandedCardTriggerProps {
  open: boolean;
  children: React.ReactNode;
}

export function ExpandedCardTriggerWrapper({ open, children }: ExpandedCardTriggerProps) {
  return (
    <AnimatePresence>
      {open && children}
    </AnimatePresence>
  );
}
