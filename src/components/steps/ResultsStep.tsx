import { useContext } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { FloatingCard, FloatingCardContext } from '../FloatingCard';
import type { PresentationStep } from '@/domain/types';
import { theme } from '@/domain/theme';
import { getCardTextVariants } from './cardTextMotion';
import { HighlightPhraseList } from './HighlightBlocks';

interface Props {
  step: PresentationStep;
  active: boolean;
}

/** Diagrama de mudança de modelo: pilha pesada (legado) → base coordenada (modular). */
function ModelShift({
  color,
  reduce,
  active,
}: {
  color: string;
  reduce: boolean;
  active: boolean;
}) {
  const heavy = [0, 1, 2, 3, 4];
  return (
    <div
      aria-hidden
      className="flex items-center justify-between rounded-xl border px-4 py-2.5"
      style={{
        borderColor: `${color}33`,
        background: `linear-gradient(90deg, rgba(255,255,255,0.025), ${color}10)`,
      }}
    >
      {/* Pesado / acúmulo */}
      <div className="flex items-end gap-px">
        {heavy.map((i) => (
          <motion.span
            key={`h-${i}`}
            className="block rounded-sm"
            style={{
              width: 7,
              height: 6 + i * 3,
              background: 'rgba(255,255,255,0.22)',
              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06)',
            }}
            animate={reduce ? undefined : { y: [0, -1, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.08 }}
          />
        ))}
        <span className="ml-2 text-[10px] uppercase tracking-[0.24em] text-white/45">
          Pesado
        </span>
      </div>

      {/* Seta de transição */}
      <motion.div
        className="flex items-center gap-1"
        animate={reduce ? undefined : { x: [0, 4, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span
          className="block h-px w-14"
          style={{
            background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
            boxShadow: `0 0 8px ${color}`,
          }}
        />
        <span style={{ color, textShadow: `0 0 10px ${color}` }}>→</span>
      </motion.div>

      {/* Coordenado: base contínua + módulos sobre ela */}
      <div className="flex items-end gap-px">
        <span className="mr-2 text-[10px] uppercase tracking-[0.24em]" style={{ color }}>
          Coordenado
        </span>
        <div className="flex items-end gap-px">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.span
              key={`c-${i}`}
              className="block rounded-sm"
              style={{
                width: 7,
                height: 12,
                background: color,
                boxShadow: `0 0 10px ${color}88`,
                opacity: 0.6 + (i % 2) * 0.4,
              }}
              initial={reduce ? false : { scaleY: 0 }}
              animate={
                active
                  ? { scaleY: 1 }
                  : reduce
                    ? undefined
                    : { scaleY: 0 }
              }
              transition={{ duration: 0.5, delay: 0.4 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            />
          ))}
        </div>
        <span
          className="ml-1 block h-px w-10 self-end"
          style={{
            background: color,
            boxShadow: `0 0 12px ${color}`,
          }}
        />
      </div>
    </div>
  );
}

/** Card 11 — Resultado: cards de outcomes em grade com glow alternado. */
export function ResultsStep({ step, active }: Props) {
  const accent = theme.accents[step.accent];
  const reduce = useReducedMotion();
  const flipPhoto = useContext(FloatingCardContext)?.flipPhoto ?? false;
  const { container, item } = getCardTextVariants(
    Boolean(reduce),
    step.index,
    `${step.id}:${step.title}`,
    flipPhoto,
  );
  const cards = step.content.resultsCards ?? [];

  return (
    <FloatingCard
      accent={step.accent}
      active={active}
      stepId={step.id}
      width={720}
      badge={step.title}
    >
      <motion.div
        className="flex flex-col gap-5"
        variants={container}
        initial={reduce ? false : 'hidden'}
        animate={active ? 'visible' : 'hidden'}
      >
        <motion.div variants={item} className="flex flex-col gap-3">
          <h2
            className="presentation-ppt-title max-w-[28ch] text-[clamp(1.35rem,3vw,1.95rem)] leading-[1.12]"
            style={{ textShadow: `0 0 28px ${accent.base}22` }}
          >
            {step.content.headline}
          </h2>
          <ModelShift color={accent.base} reduce={Boolean(reduce)} active={active} />
        </motion.div>

        <motion.ul variants={item} className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {cards.map((c, i) => (
            <motion.li
              key={c}
              initial={reduce ? false : { opacity: 0, y: 14, scale: 0.94 }}
              animate={
                active
                  ? { opacity: 1, y: 0, scale: 1 }
                  : reduce
                    ? undefined
                    : { opacity: 0, y: 14, scale: 0.94 }
              }
              transition={{
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.25 + i * 0.08,
              }}
              whileHover={
                reduce
                  ? undefined
                  : { y: -3, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } }
              }
              className="group relative overflow-hidden rounded-2xl border px-4 py-5"
              style={{
                borderColor: `${accent.base}44`,
                background: `linear-gradient(160deg, ${accent.base}18 0%, rgba(255,255,255,0.02) 100%)`,
                boxShadow: `inset 0 1px 0 rgba(255,255,255,0.06), 0 18px 38px -18px ${accent.base}99`,
              }}
            >
              <motion.span
                aria-hidden
                className="pointer-events-none absolute -bottom-12 -right-12 h-32 w-32 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${accent.base}40 0%, transparent 70%)`,
                }}
                animate={reduce ? undefined : { opacity: [0.4, 0.85, 0.4], scale: [1, 1.15, 1] }}
                transition={{
                  duration: 4 + (i % 3) * 0.4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.2,
                }}
              />
              <span
                className="relative block text-[10px] font-semibold uppercase tracking-[0.3em]"
                style={{ color: accent.base, opacity: 0.85 }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <p
                className="relative mt-1 text-[1.02rem] font-bold leading-snug text-white"
                style={{ textShadow: `0 0 18px ${accent.base}55` }}
              >
                {c}
              </p>
            </motion.li>
          ))}
        </motion.ul>

        {step.content.highlightPhrases && (
          <motion.div variants={item}>
            <HighlightPhraseList items={step.content.highlightPhrases} active={active} />
          </motion.div>
        )}
      </motion.div>
    </FloatingCard>
  );
}
