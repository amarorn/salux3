import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { glassPanelStyle } from '@/lib/glassPanelStyle';

interface Props {
  badge?: string;
  prefix?: string;
  value: number;
  /** Sobrepõe o rótulo calculado (ex.: ano de referência). */
  highlightLabel?: string;
  /** Efeito de digitação no texto em destaque. */
  typewriter?: boolean;
  headline: string;
  context?: string;
  accentColor: string;
  active: boolean;
  delay?: number;
}

export function EvidenceHighlightCard({
  badge,
  prefix,
  value,
  highlightLabel,
  typewriter = false,
  headline,
  context,
  accentColor,
  active,
  delay = 0,
}: Props) {
  const reduce = useReducedMotion();
  const highlight =
    highlightLabel ??
    (prefix && value > 0
      ? `${prefix} #${Math.round(value)}`
      : prefix
        ? prefix
        : String(Math.round(value)));

  const [typed, setTyped] = useState(reduce || !active || !typewriter ? highlight : '');
  const [typingDone, setTypingDone] = useState(reduce || !typewriter);

  useEffect(() => {
    if (!active || reduce || !typewriter) {
      setTyped(highlight);
      setTypingDone(true);
      return;
    }

    setTyped('');
    setTypingDone(false);
    const startMs = Math.round((0.45 + delay) * 1000);
    let intervalId = 0;
    const startTimeout = window.setTimeout(() => {
      let index = 0;
      intervalId = window.setInterval(() => {
        index += 1;
        setTyped(highlight.slice(0, index));
        if (index >= highlight.length) {
          window.clearInterval(intervalId);
          setTypingDone(true);
        }
      }, 72);
    }, startMs);

    return () => {
      window.clearTimeout(startTimeout);
      window.clearInterval(intervalId);
    };
  }, [active, reduce, typewriter, highlight, delay]);

  const displayHighlight = typewriter && active && !reduce ? typed : highlight;
  const showCursor = typewriter && active && !reduce && !typingDone;

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl border px-6 py-5"
      style={glassPanelStyle(accentColor)}
      initial={reduce ? false : { opacity: 0, y: 14 }}
      animate={
        active ? { opacity: 1, y: 0 } : reduce ? undefined : { opacity: 0, y: 14 }
      }
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.35 + delay }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-6 -top-px h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${accentColor}cc, transparent)`,
        }}
      />

      {badge && (
        <p
          className="text-[10px] font-semibold uppercase tracking-[0.32em]"
          style={{ color: accentColor, opacity: 0.95 }}
        >
          {badge}
        </p>
      )}

      <p
        className="mt-3 min-h-[1.2em] font-display text-[clamp(1.75rem,4.5vw,2.35rem)] font-bold leading-none tracking-tight"
        style={{
          color: accentColor,
          textShadow: `0 0 28px ${accentColor}66`,
        }}
        aria-label={highlight}
      >
        {displayHighlight}
        {showCursor && (
          <motion.span
            aria-hidden
            className="ml-0.5 inline-block h-[0.85em] w-[2px] translate-y-[0.06em] bg-current align-middle"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.85, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
      </p>

      <motion.p
        className="mt-4 text-[0.98rem] font-semibold leading-snug text-white/95"
        initial={reduce ? false : { opacity: 0, y: 6 }}
        animate={
          active ? { opacity: 1, y: 0 } : reduce ? undefined : { opacity: 0, y: 6 }
        }
        transition={{
          duration: 0.5,
          delay: typewriter && !reduce ? 0.65 + delay + highlight.length * 0.072 : 0.65 + delay,
        }}
      >
        {headline}
      </motion.p>

      {context && (
        <motion.p
          className="mt-2 text-[0.86rem] italic leading-snug text-slate-300/85"
          initial={reduce ? false : { opacity: 0 }}
          animate={active ? { opacity: 1 } : reduce ? undefined : { opacity: 0 }}
          transition={{
            duration: 0.6,
            delay: typewriter && !reduce ? 0.85 + delay + highlight.length * 0.072 : 0.85 + delay,
          }}
        >
          {context}
        </motion.p>
      )}
    </motion.div>
  );
}
