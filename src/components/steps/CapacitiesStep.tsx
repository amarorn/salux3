import { useContext } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { FloatingCard, FloatingCardContext } from '../FloatingCard';
import type { CapacityGroup, CapacityItem, PresentationStep } from '@/domain/types';
import { theme } from '@/domain/theme';
import { getCardTextVariants } from './cardTextMotion';

interface Props {
  step: PresentationStep;
  active: boolean;
}

const TONE_COLORS: Record<CapacityGroup['tone'], { ring: string; chip: string }> = {
  core: { ring: '#a4c2f4', chip: 'Central' },
  support: { ring: '#6fa8dc', chip: 'Sustentação' },
};

export function CapacitiesStep({ step, active }: Props) {
  const accent = theme.accents[step.accent];
  const reduce = useReducedMotion();
  const flipPhoto = useContext(FloatingCardContext)?.flipPhoto ?? false;
  const { container, item } = getCardTextVariants(Boolean(reduce), step.index, flipPhoto);
  const groups = step.content.capacityGroups ?? [];

  return (
    <FloatingCard
      accent={step.accent}
      active={active}
      stepId={step.id}
      width={760}
      badge={step.title}
      cardVisual={step.content.cardVisual}
    >
      <motion.div
        className="flex flex-col gap-6"
        variants={container}
        initial={reduce ? false : 'hidden'}
        animate={active ? 'visible' : 'hidden'}
      >
        <motion.div variants={item}>
          <h2
            className="presentation-ppt-title max-w-[26ch] text-[clamp(1.65rem,3.6vw,2.3rem)] leading-[1.1]"
            style={{ textShadow: `0 0 28px ${accent.base}22` }}
          >
            {step.content.headline ?? 'Capacidades coordenadas'}
          </h2>
        </motion.div>

        {step.content.body && (
          <motion.p variants={item} className="presentation-ppt-body text-[0.95rem] leading-snug text-slate-200/90 whitespace-pre-line">
            {step.content.body}
          </motion.p>
        )}

        {groups.map((group, gi) => (
          <motion.section variants={item} key={group.title} className="flex flex-col gap-3">
            <header className="flex items-center gap-3">
              <span
                className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em]"
                style={{
                  borderColor: `${TONE_COLORS[group.tone].ring}66`,
                  background: `${TONE_COLORS[group.tone].ring}1a`,
                  color: TONE_COLORS[group.tone].ring,
                }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{
                    background: TONE_COLORS[group.tone].ring,
                    boxShadow: `0 0 10px ${TONE_COLORS[group.tone].ring}`,
                  }}
                />
                {TONE_COLORS[group.tone].chip}
              </span>
              <h3 className="text-[0.92rem] font-semibold text-white/85">{group.title}</h3>
              <span
                className="ml-1 h-px flex-1"
                style={{
                  background: `linear-gradient(90deg, ${TONE_COLORS[group.tone].ring}55, transparent)`,
                }}
              />
            </header>

            <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {group.items.map((it, i) => (
                <CapacityCard
                  key={it.name}
                  item={it}
                  ring={TONE_COLORS[group.tone].ring}
                  delay={gi * 0.1 + i * 0.06}
                  reduce={Boolean(reduce)}
                  active={active}
                />
              ))}
            </ul>
          </motion.section>
        ))}
      </motion.div>
    </FloatingCard>
  );
}

function CapacityCard({
  item,
  ring,
  delay,
  reduce,
  active,
}: {
  item: CapacityItem;
  ring: string;
  delay: number;
  reduce: boolean;
  active: boolean;
}) {
  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, y: 12, scale: 0.96, filter: 'blur(6px)' }}
      animate={
        active
          ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }
          : reduce
            ? undefined
            : { opacity: 0, y: 12, scale: 0.96, filter: 'blur(6px)' }
      }
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.2 + delay }}
      whileHover={
        reduce
          ? undefined
          : { y: -2, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } }
      }
      className="group relative overflow-hidden rounded-2xl border px-4 py-3"
      style={{
        borderColor: `${ring}44`,
        background: `linear-gradient(135deg, ${ring}14 0%, rgba(255,255,255,0.02) 100%)`,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.05)`,
      }}
    >
      <motion.span
        aria-hidden
        className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full"
        style={{ background: `radial-gradient(circle, ${ring}33 0%, transparent 70%)` }}
        animate={reduce ? undefined : { opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="relative flex flex-col gap-1">
        <div className="flex items-baseline justify-between gap-3">
          <span
            className="text-[0.92rem] font-bold leading-tight text-white"
            style={{ textShadow: `0 0 14px ${ring}55` }}
          >
            {item.name}
          </span>
          <span
            className="text-[0.7rem] font-medium uppercase tracking-[0.18em]"
            style={{ color: ring, opacity: 0.85 }}
          >
            {item.subtitle}
          </span>
        </div>
        {item.description && (
          <p className="text-[0.82rem] leading-snug text-slate-300/85">{item.description}</p>
        )}
        <p
          className="mt-1 text-[0.82rem] font-semibold italic leading-snug"
          style={{ color: ring }}
        >
          {item.tagline}
        </p>
      </div>
    </motion.li>
  );
}
