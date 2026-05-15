import { useContext, useEffect, useRef, useState } from 'react';
import type { ElementType } from 'react';
import { motion, useAnimation, useReducedMotion, AnimatePresence } from 'framer-motion';
import { Eye, FileLock, Gavel, KeyRound, RotateCcw } from 'lucide-react';
import { FloatingCard, FloatingCardContext } from '../FloatingCard';
import type { PresentationStep } from '@/domain/types';
import { usePresentationStore } from '@/store/presentationStore';
import { getCardTextVariants } from './cardTextMotion';

interface Props {
  step: PresentationStep;
  active: boolean;
}

const LEGACY_PILLARS = [
  { icon: Gavel, label: 'Políticas', desc: 'Por especialidade e risco' },
  { icon: FileLock, label: 'LGPD', desc: 'Minimização e finalidade' },
  { icon: Eye, label: 'Auditoria', desc: 'Logs imutáveis' },
  { icon: KeyRound, label: 'Alçada', desc: 'Revisão humana obrigatória' },
];

export function GovernanceStep({ step, active }: Props) {
  const pillars = step.content.revealPillars;
  const revealMode = Boolean(pillars?.length);
  const expanded = usePresentationStore((s) => s.governanceRevealExpanded);
  const reduceMotion = useReducedMotion();
  const flipPhoto = useContext(FloatingCardContext)?.flipPhoto ?? false;
  const { container, item } = getCardTextVariants(
    Boolean(reduceMotion),
    step.index,
    `${step.id}:${step.title}`,
    flipPhoto,
  );

  const showExpanded = revealMode && active && expanded;

  const compare = step.content.governanceCompare;

  if (revealMode && pillars) {
    return (
      <FloatingCard
        accent={step.accent}
        active={active}
        stepId={step.id}
        badge={step.content.headline ?? String(step.index + 1).padStart(2, '0')}
        width={700}
      >
        <RevealFlipCard
          step={step}
          active={active}
          expanded={showExpanded}
          pillars={pillars}
          reduceMotion={Boolean(reduceMotion)}
          container={container}
          item={item}
        />
      </FloatingCard>
    );
  }

  return (
    <FloatingCard
      accent={step.accent}
      active={active}
      stepId={step.id}
      badge={step.content.headline ?? String(step.index + 1).padStart(2, '0')}
      width={compare ? 720 : 620}
    >
      <motion.div
        className="flex flex-col gap-6"
        variants={container}
        initial={reduceMotion ? false : 'hidden'}
        animate={active ? 'visible' : 'hidden'}
      >
        <motion.div variants={item}>
          <h2 className="font-display text-[28px] font-bold leading-[1.15] tracking-tight text-white">
            {step.title}
          </h2>
        </motion.div>

        {compare && (
          <motion.div variants={item} className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-rose-400/30 bg-gradient-to-br from-rose-500/[0.12] to-transparent p-5 shadow-soft">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-rose-200/85">Pergunta antiga</p>
              <p className="mt-3 text-sm leading-relaxed text-slate-100">{compare.before}</p>
            </div>
            <div className="rounded-2xl border border-emerald-400/30 bg-gradient-to-br from-emerald-500/[0.12] to-transparent p-5 shadow-soft">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-200/85">Pergunta nova</p>
              <p className="mt-3 text-sm leading-relaxed text-slate-100">{compare.after}</p>
            </div>
          </motion.div>
        )}

        {!compare && (
          <div className="grid grid-cols-2 gap-3">
            {LEGACY_PILLARS.map((pillar, i) => (
              <PillarCard key={pillar.label} pillar={pillar} index={i} active={active} />
            ))}
          </div>
        )}

        {step.content.body && (
          <motion.p variants={item} className="text-sm leading-relaxed text-slate-300 whitespace-pre-line">
            {step.content.body}
          </motion.p>
        )}
      </motion.div>
    </FloatingCard>
  );
}

/* ─── Reveal Flip Card ────────────────────────────────────────────── */

interface RevealFlipCardProps {
  step: PresentationStep;
  active: boolean;
  expanded: boolean;
  pillars: string[];
  reduceMotion: boolean;
  container: ReturnType<typeof getCardTextVariants>['container'];
  item: ReturnType<typeof getCardTextVariants>['item'];
}

function RevealFlipCard({ step, active, expanded, pillars, reduceMotion, container, item }: RevealFlipCardProps) {
  const [showBack, setShowBack] = useState(false);
  const flipControls = useAnimation();
  const prevExpanded = useRef(false);

  // Reset quando o slide fica inativo
  useEffect(() => {
    if (!active) {
      setShowBack(false);
      void flipControls.set({ rotateY: 0 });
      prevExpanded.current = false;
    }
  }, [active, flipControls]);

  // Animação de virar o card
  useEffect(() => {
    if (expanded && !prevExpanded.current) {
      prevExpanded.current = true;

      if (reduceMotion) {
        setShowBack(true);
        return;
      }

      // 1. Inclina para 90° (borda)
      void flipControls
        .start({
          rotateY: 90,
          transition: { duration: 0.28, ease: [0.55, 0.06, 0.68, 0.19] },
        })
        .then(() => {
          // 2. No ponto morto (edge-on) troca o conteúdo
          setShowBack(true);
          // 3. Volta para 0° revelando o verso
          void flipControls.start({
            rotateY: 0,
            transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
          });
        });
    }
  }, [expanded, flipControls, reduceMotion]);

  return (
    <div style={{ perspective: '1400px', perspectiveOrigin: 'center center' }}>
      <motion.div
        animate={flipControls}
        initial={{ rotateY: 0 }}
        style={{ transformOrigin: 'center center', willChange: 'transform' }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {showBack ? (
            <motion.div
              key="back"
              className="flex flex-col gap-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.18 }}
            >
              {/* Indicador de que virou */}
              <div className="flex items-center gap-2">
                <h2 className="font-display text-[28px] font-bold leading-[1.15] tracking-tight text-white">
                  {step.title}
                </h2>
                <motion.span
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="ml-1 inline-flex items-center gap-1.5 rounded-full border border-amber-400/25 bg-amber-400/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-400/80"
                >
                  <RotateCcw className="h-2.5 w-2.5" strokeWidth={2.5} />
                  Revelado
                </motion.span>
              </div>

              {/* Grid de pilares com entrada escalonada */}
              <div className="grid grid-cols-3 gap-2.5">
                {pillars.map((label, i) => (
                  <RevealPillarChip key={label} label={label} index={i} />
                ))}
              </div>

              {step.content.body && (
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + pillars.length * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="border-t border-white/10 pt-4 text-sm leading-relaxed text-slate-300 whitespace-pre-line"
                >
                  {step.content.body}
                </motion.p>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="front"
              className="flex flex-col gap-6"
              variants={container}
              initial={reduceMotion ? false : 'hidden'}
              animate={active ? 'visible' : 'hidden'}
            >
              <motion.div variants={item}>
                <h2 className="font-display text-[28px] font-bold leading-[1.15] tracking-tight text-white">
                  {step.title}
                </h2>
              </motion.div>

              {/* Hint visual de "tem mais" */}
              {active && (
                <motion.div variants={item} className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="block h-1 w-1 rounded-full bg-amber-400"
                        animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
                        transition={{
                          duration: 1.6,
                          repeat: Infinity,
                          delay: i * 0.22,
                          ease: 'easeInOut',
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-amber-400/60">
                    Clique ou espaço para revelar
                  </span>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

/* ─── Reveal Pillar Chip ──────────────────────────────────────────── */

function RevealPillarChip({ label, index }: { label: string; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.94, filter: 'blur(3px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      transition={{
        delay: 0.04 + index * 0.07,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative overflow-hidden rounded-2xl px-4 py-3.5"
      style={{
        background: hovered ? 'rgba(245,158,11,0.12)' : 'rgba(245,158,11,0.06)',
        border: `1px solid ${hovered ? 'rgba(245,158,11,0.4)' : 'rgba(245,158,11,0.2)'}`,
        boxShadow: hovered ? '0 6px 20px -6px rgba(245,158,11,0.25)' : 'none',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'background 300ms, border 300ms, box-shadow 300ms, transform 250ms',
      }}
    >
      <p className="text-sm font-semibold leading-snug text-white">{label}</p>
      {/* Glow de canto */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-4 -top-4 h-12 w-12 rounded-full blur-xl"
        style={{
          background: 'rgba(245,158,11,0.4)',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 350ms',
        }}
      />
    </motion.div>
  );
}

/* ─── Legacy Pillar Card ──────────────────────────────────────────── */

interface PillarCardProps {
  pillar: { icon: ElementType; label: string; desc: string };
  index: number;
  active: boolean;
}

function PillarCard({ pillar, index, active }: PillarCardProps) {
  const [hovered, setHovered] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 14, scale: 0.96, filter: 'blur(4px)' }}
      animate={active ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' } : { opacity: 0, y: 14, scale: 0.96, filter: 'blur(4px)' }}
      transition={{ delay: active ? 0.18 + index * 0.09 : 0, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative flex items-center gap-3 overflow-hidden rounded-2xl p-3.5"
      style={{
        background: hovered ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.025)',
        border: `1px solid ${hovered ? 'rgba(245,158,11,0.35)' : 'rgba(245,158,11,0.15)'}`,
        boxShadow: hovered ? '0 8px 24px -8px rgba(245,158,11,0.2)' : 'none',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'background 300ms, border 300ms, box-shadow 300ms, transform 250ms',
      }}
    >
      <div
        className="relative flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl"
        style={{
          background: hovered ? 'rgba(245,158,11,0.2)' : 'rgba(245,158,11,0.1)',
          border: '1px solid rgba(245,158,11,0.3)',
          boxShadow: hovered ? '0 0 14px rgba(245,158,11,0.25)' : 'none',
          transition: 'background 300ms, box-shadow 300ms',
        }}
      >
        <pillar.icon
          className="h-4 w-4"
          style={{ color: hovered ? '#fcd34d' : '#f59e0b', transition: 'color 300ms' }}
          strokeWidth={1.7}
        />
      </div>

      <div className="min-w-0">
        <p className="text-sm font-semibold leading-tight text-white">{pillar.label}</p>
        <p
          className="text-[11px] transition-colors duration-300"
          style={{ color: hovered ? 'rgba(255,255,255,0.55)' : 'rgba(148,163,184,1)' }}
        >
          {pillar.desc}
        </p>
      </div>

      <span
        aria-hidden
        className="pointer-events-none absolute -right-6 -top-6 h-14 w-14 rounded-full blur-2xl"
        style={{ background: 'rgba(245,158,11,0.3)', opacity: hovered ? 1 : 0, transition: 'opacity 400ms' }}
      />
    </motion.div>
  );
}
