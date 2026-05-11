import { forwardRef, useContext, useEffect, useRef, useState, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { FloatingCard, FloatingCardContext } from '../FloatingCard';
import type { PresentationStep } from '@/domain/types';
import { theme } from '@/domain/theme';
import { AnimatedRiskCurve } from '../visuals/AnimatedRiskCurve';
import { AnimatedNarrativeMetrics } from '../visuals/AnimatedNarrativeMetrics';
import { getCardTextVariants } from './cardTextMotion';
import { ClosingHighlight, EvidenceCardBlock, HighlightPhraseList } from './HighlightBlocks';

interface Props {
  step: PresentationStep;
  active: boolean;
}

export function NarrativeStep({ step, active }: Props) {
  const accent = theme.accents[step.accent];
  const reduceMotion = useReducedMotion();
  const flipPhoto = useContext(FloatingCardContext)?.flipPhoto ?? false;
  const { container, item } = getCardTextVariants(Boolean(reduceMotion), step.index, flipPhoto);
  const painPoints = step.content.painPointsLayout;
  const useBalloon = painPoints && step.content.painPointsBalloon;
  const [balloonOpen, setBalloonOpen] = useState(false);
  const [tracerActive, setTracerActive] = useState(false);
  const [impactActive, setImpactActive] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Fecha o balão e reseta o tracer quando o slide deixa de estar ativo
  useEffect(() => {
    if (!active) {
      setBalloonOpen(false);
      setTracerActive(false);
      setImpactActive(false);
    }
  }, [active]);

  const handleTriggerClick = () => {
    if (reduceMotion) {
      setBalloonOpen(true);
      return;
    }
    if (tracerActive || balloonOpen) return;
    setTracerActive(true);
  };

  const handleTracerArrive = () => {
    setTracerActive(false);
    setImpactActive(true);
    // Pequeno atraso para o impacto antes do balão abrir
    window.setTimeout(() => {
      setImpactActive(false);
      setBalloonOpen(true);
    }, 320);
  };

  // ESC fecha o balão
  useEffect(() => {
    if (!balloonOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        setBalloonOpen(false);
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [balloonOpen]);

  return (
    <FloatingCard
      accent={step.accent}
      active={active}
      stepId={step.id}
      width={painPoints ? 640 : undefined}
      badge={
        painPoints
          ? String(step.index + 1).padStart(2, '0')
          : step.content.headline ?? String(step.index + 1).padStart(2, '0')
      }
    >
      <motion.div
        className="flex flex-col gap-5"
        variants={container}
        initial={reduceMotion ? false : 'hidden'}
        animate={active ? 'visible' : 'hidden'}
      >
        {painPoints && step.content.headline ? (
          <motion.div variants={item} className="space-y-3">
            <span
              className="block text-[10px] font-semibold uppercase tracking-[0.32em]"
              style={{ color: accent.base, opacity: 0.85 }}
            >
              {step.title}
            </span>
            <h2
              className="presentation-ppt-title max-w-[20ch] text-[clamp(1.65rem,3.6vw,2.45rem)] leading-[1.08]"
              style={{ textShadow: `0 0 28px ${accent.base}22` }}
            >
              {step.content.headline}
            </h2>
          </motion.div>
        ) : (
          <motion.div variants={item}>
            <h2 className="presentation-ppt-title max-w-[24ch] text-[clamp(1.35rem,3.2vw,1.85rem)]">
              {step.title}
            </h2>
          </motion.div>
        )}

        {step.content.metrics && step.content.metrics.length > 0 && (
          <motion.div variants={item}>
            <AnimatedNarrativeMetrics
              items={step.content.metrics}
              active={active}
              reducedMotion={Boolean(reduceMotion)}
              accentColor={accent.base}
            />
          </motion.div>
        )}

        {step.content.body && !painPoints && (
          <motion.p variants={item} className="presentation-ppt-body whitespace-pre-line">
            {step.content.body}
          </motion.p>
        )}

        {step.content.bullets &&
          step.content.bullets.length > 0 &&
          typeof step.content.bulletSplitAfter === 'number' &&
          step.content.bulletSplitAfter > 0 &&
          step.content.bullets.length > step.content.bulletSplitAfter && (
            <motion.div variants={item} className="space-y-5">
              <div>
                <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-300/85">
                  O que a instituição faz hoje
                </p>
                <div className="flex flex-wrap gap-2">
                  {step.content.bullets.slice(0, step.content.bulletSplitAfter).map((verb) => (
                    <span
                      key={verb}
                      className="rounded-full border border-cyan-400/25 bg-cyan-500/[0.09] px-3 py-1.5 text-[12px] font-medium text-slate-100 shadow-soft"
                    >
                      {verb}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-rose-300/85">
                  Onde a continuidade falha
                </p>
                <ul className="space-y-2">
                  {step.content.bullets.slice(step.content.bulletSplitAfter).map((bullet) => (
                    <li key={bullet} className="flex items-start gap-3 text-sm text-slate-200">
                      <span
                        className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full"
                        style={{ background: accent.base, boxShadow: `0 0 8px ${accent.base}88` }}
                      />
                      <span className="whitespace-pre-line">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}

        {painPoints && !useBalloon && step.content.bullets && step.content.bullets.length > 0 && (
          <motion.div variants={item} className="relative">
            {step.content.painPointsBackdrop === 'stacked' && (
              <StackedLayersBackdrop
                color={accent.base}
                reduce={Boolean(reduceMotion)}
                active={active}
              />
            )}
            {step.content.painPointsBackdrop === 'web' && (
              <TenseWebBackdrop
                color={accent.base}
                reduce={Boolean(reduceMotion)}
                active={active}
                count={step.content.bullets.length}
              />
            )}
            <div className="relative">
              <PainPointChips
                bullets={step.content.bullets}
                accentColor={accent.base}
                active={active}
                reducedMotion={Boolean(reduceMotion)}
              />
            </div>
          </motion.div>
        )}

        {useBalloon && step.content.bullets && step.content.bullets.length > 0 && (
          <motion.div variants={item} className="flex justify-center py-3">
            <BalloonTrigger
              ref={triggerRef}
              label={step.content.painPointsTriggerLabel ?? 'Abrir os 7 pontos'}
              accentColor={accent.base}
              onClick={handleTriggerClick}
              reducedMotion={Boolean(reduceMotion)}
              charged={tracerActive && !balloonOpen}
              impact={impactActive}
            />
          </motion.div>
        )}

        {!painPoints &&
          step.content.bullets &&
          step.content.bullets.length > 0 &&
          !(
            typeof step.content.bulletSplitAfter === 'number' &&
            step.content.bulletSplitAfter > 0 &&
            step.content.bullets.length > step.content.bulletSplitAfter
          ) && (
          <motion.ul variants={item} className="mt-1 space-y-2.5">
            {step.content.bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-3 text-sm text-slate-200">
                <span
                  className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full"
                  style={{ background: accent.base, boxShadow: `0 0 8px ${accent.base}88` }}
                />
                <span className="whitespace-pre-line">{bullet}</span>
              </li>
            ))}
          </motion.ul>
        )}

        {painPoints && step.content.body && (
          <motion.div variants={item} className="relative mt-1 pl-4">
            <span
              aria-hidden
              className="absolute left-0 top-1 bottom-1 w-px"
              style={{ background: `linear-gradient(180deg, ${accent.base}, transparent)` }}
            />
            <p className="presentation-ppt-body whitespace-pre-line text-[0.95rem] leading-relaxed text-slate-300/95">
              {step.content.body}
            </p>
          </motion.div>
        )}

        {step.content.highlightPhrases && step.content.highlightPhrases.length > 0 && (
          <motion.div variants={item}>
            <HighlightPhraseList items={step.content.highlightPhrases} active={active} />
          </motion.div>
        )}

        {step.content.evidenceCard && (
          <motion.div variants={item}>
            <EvidenceCardBlock
              card={step.content.evidenceCard}
              active={active}
              accentColor={accent.base}
            />
          </motion.div>
        )}

        {step.content.closingHighlight && (
          <motion.div variants={item}>
            <ClosingHighlight text={step.content.closingHighlight} active={active} />
          </motion.div>
        )}

        {painPoints && step.content.closingQuestion && (
          <motion.div
            variants={item}
            className="relative mt-2 overflow-hidden rounded-2xl border px-5 py-4"
            style={{
              borderColor: `${accent.base}55`,
              background: `linear-gradient(135deg, ${accent.base}1c 0%, rgba(255,255,255,0.02) 70%)`,
              boxShadow: `0 0 0 1px ${accent.base}22, inset 0 1px 0 rgba(255,255,255,0.05)`,
            }}
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-6 -top-px h-px"
              style={{ background: `linear-gradient(90deg, transparent, ${accent.base}, transparent)` }}
            />
            <p
              className="text-[1.1rem] font-semibold leading-snug text-white"
              style={{ textShadow: `0 0 24px ${accent.base}25` }}
            >
              {step.content.closingQuestion}
            </p>
          </motion.div>
        )}

        {step.content.visual?.type === 'risk-curve' && (
          <motion.div variants={item}>
            <AnimatedRiskCurve active={active} />
          </motion.div>
        )}
      </motion.div>

      <AnimatePresence>
        {useBalloon && tracerActive && !balloonOpen && (
          <TracerParticle
            key="tracer"
            targetRef={triggerRef}
            accentColor={accent.base}
            onArrive={handleTracerArrive}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {useBalloon && impactActive && (
          <ImpactBurst key="impact" targetRef={triggerRef} accentColor={accent.base} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {useBalloon && balloonOpen && step.content.bullets && (
          <PainPointsBalloon
            title={step.content.painPointsBalloonTitle ?? 'Pontos de atrito'}
            headline={step.content.headline}
            bullets={step.content.bullets}
            accentColor={accent.base}
            reducedMotion={Boolean(reduceMotion)}
            originRef={triggerRef}
            onClose={() => setBalloonOpen(false)}
          />
        )}
      </AnimatePresence>
    </FloatingCard>
  );
}

interface BalloonTriggerProps {
  label: string;
  accentColor: string;
  onClick: () => void;
  reducedMotion: boolean;
  charged?: boolean;
  impact?: boolean;
}

const BalloonTrigger = forwardRef<HTMLButtonElement, BalloonTriggerProps>(function BalloonTrigger(
  { label, accentColor, onClick, reducedMotion, charged, impact },
  ref,
) {
  const idleShadow = `0 0 0 1px ${accentColor}33, 0 12px 32px -10px ${accentColor}60, inset 0 1px 0 rgba(255,255,255,0.08)`;
  const chargedShadow = `0 0 0 2px ${accentColor}, 0 18px 48px -8px ${accentColor}, inset 0 1px 0 rgba(255,255,255,0.12)`;
  const impactShadow = `0 0 0 6px ${accentColor}99, 0 0 48px 12px ${accentColor}, inset 0 1px 0 rgba(255,255,255,0.4)`;

  return (
    <motion.button
      ref={ref}
      type="button"
      data-no-click-advance
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      whileHover={
        reducedMotion || charged || impact
          ? undefined
          : { scale: 1.03, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } }
      }
      whileTap={reducedMotion ? undefined : { scale: 0.97 }}
      animate={
        impact && !reducedMotion
          ? {
              boxShadow: [chargedShadow, impactShadow, idleShadow],
              scale: [1, 1.18, 1],
              x: [0, -3, 3, -2, 2, 0],
            }
          : charged && !reducedMotion
            ? {
                boxShadow: [idleShadow, chargedShadow, idleShadow],
                scale: [1, 1.04, 1],
              }
            : undefined
      }
      transition={
        impact
          ? { duration: 0.32, ease: [0.4, 0, 0.2, 1] }
          : charged
            ? { duration: 1.2, ease: 'easeInOut', repeat: Infinity }
            : undefined
      }
      className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border px-6 py-3 text-[0.95rem] font-semibold tracking-wide text-white"
      style={{
        borderColor: `${accentColor}77`,
        background: `linear-gradient(135deg, ${accentColor}26 0%, ${accentColor}0d 100%)`,
        boxShadow: `0 0 0 1px ${accentColor}33, 0 12px 32px -10px ${accentColor}60, inset 0 1px 0 rgba(255,255,255,0.08)`,
      }}
    >
      <motion.span
        aria-hidden
        className="relative h-2.5 w-2.5 rounded-full"
        style={{ background: accentColor, boxShadow: `0 0 14px ${accentColor}` }}
        animate={
          reducedMotion
            ? undefined
            : { scale: [0.9, 1.2, 0.9], opacity: [0.7, 1, 0.7] }
        }
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <span>{label}</span>
      <motion.span
        aria-hidden
        className="text-lg leading-none"
        style={{ color: accentColor }}
        animate={reducedMotion ? undefined : { x: [0, 3, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        →
      </motion.span>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${accentColor}33, transparent 70%)`,
        }}
      />
    </motion.button>
  );
});

interface ImpactBurstProps {
  targetRef: RefObject<HTMLElement>;
  accentColor: string;
}

function ImpactBurst({ targetRef, accentColor }: ImpactBurstProps) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!targetRef.current) return;
    const rect = targetRef.current.getBoundingClientRect();
    setPos({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
  }, [targetRef]);

  if (typeof document === 'undefined' || !pos) return null;

  const ripples = [0, 0.07, 0.14];

  return createPortal(
    <div
      className="pointer-events-none fixed inset-0 z-[75]"
      data-no-click-advance
      style={{ overflow: 'hidden' }}
    >
      {/* Flash branco */}
      <motion.div
        className="absolute h-3 w-3 rounded-full"
        style={{
          top: pos.y,
          left: pos.x,
          translate: '-50% -50%',
          background: `radial-gradient(circle, #ffffff 0%, ${accentColor} 35%, transparent 70%)`,
        }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: [0, 1, 0], scale: [0, 8, 14] }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1], times: [0, 0.3, 1] }}
      />

      {/* Ondas de choque */}
      {ripples.map((delay, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border-2"
          style={{
            top: pos.y,
            left: pos.x,
            translate: '-50% -50%',
            borderColor: accentColor,
            boxShadow: `0 0 24px ${accentColor}, inset 0 0 16px ${accentColor}55`,
          }}
          initial={{ width: 8, height: 8, opacity: 0.9 }}
          animate={{ width: 360 + i * 80, height: 360 + i * 80, opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, delay, ease: [0.2, 0.8, 0.2, 1] }}
        />
      ))}

      {/* Estilhaços/raios curtos */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const dx = Math.cos(angle) * 90;
        const dy = Math.sin(angle) * 90;
        return (
          <motion.span
            key={`spark-${i}`}
            className="absolute h-[3px] w-3 rounded-full"
            style={{
              top: pos.y,
              left: pos.x,
              translate: '-50% -50%',
              background: accentColor,
              boxShadow: `0 0 12px ${accentColor}`,
              transformOrigin: 'left center',
              rotate: `${(angle * 180) / Math.PI}deg`,
            }}
            initial={{ opacity: 1, x: 0, y: 0, scaleX: 0.2 }}
            animate={{ opacity: [1, 1, 0], x: dx, y: dy, scaleX: [0.2, 2, 0.6] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1], times: [0, 0.5, 1] }}
          />
        );
      })}
    </div>,
    document.body,
  );
}

interface TracerParticleProps {
  targetRef: RefObject<HTMLElement>;
  accentColor: string;
  onArrive: () => void;
}

function TracerParticle({ targetRef, accentColor, onArrive }: TracerParticleProps) {
  const [path, setPath] = useState<{ x: number[]; y: number[] } | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !targetRef.current) {
      onArrive();
      return;
    }
    const rect = targetRef.current.getBoundingClientRect();
    const endX = rect.left + rect.width / 2;
    const endY = rect.top + rect.height / 2;

    // Spawn de um dos cantos superiores aleatoriamente
    const fromLeft = Math.random() < 0.5;
    const startX = fromLeft ? window.innerWidth * 0.08 : window.innerWidth * 0.92;
    const startY = window.innerHeight * (0.08 + Math.random() * 0.14);

    // Trajetória reta para velocidade constante
    setPath({ x: [startX, endX], y: [startY, endY] });

    const t = window.setTimeout(onArrive, 1500);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (typeof document === 'undefined' || !path) return null;

  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-[70]" data-no-click-advance>
      <motion.div
        className="absolute"
        style={{ top: 0, left: 0 }}
        initial={{ x: path.x[0], y: path.y[0] }}
        animate={{
          x: path.x,
          y: path.y,
        }}
        exit={{ opacity: 0, transition: { duration: 0.18 } }}
        transition={{
          duration: 1.5,
          ease: 'linear',
        }}
      >
        {/* Núcleo brilhante — brilho constante (sem pulse) */}
        <span
          className="absolute -left-2 -top-2 block h-4 w-4 rounded-full"
          style={{
            background: accentColor,
            boxShadow: `0 0 24px ${accentColor}, 0 0 64px ${accentColor}aa, 0 0 120px ${accentColor}55`,
          }}
        />
        {/* Halo externo estável */}
        <span
          className="absolute -left-6 -top-6 block h-12 w-12 rounded-full"
          style={{
            background: `radial-gradient(circle, ${accentColor}66 0%, ${accentColor}22 40%, transparent 72%)`,
          }}
        />
        {/* Trail/rastro discreto */}
        <span
          aria-hidden
          className="absolute -left-1 -top-1 block h-2 w-2 rounded-full opacity-60"
          style={{
            background: `radial-gradient(circle, ${accentColor}, transparent 70%)`,
            filter: 'blur(2px)',
          }}
        />
      </motion.div>
    </div>,
    document.body,
  );
}

interface PainPointsBalloonProps {
  title: string;
  headline?: string;
  bullets: string[];
  accentColor: string;
  reducedMotion: boolean;
  originRef?: RefObject<HTMLElement>;
  onClose: () => void;
}

function PainPointsBalloon({
  title,
  headline,
  bullets,
  accentColor,
  reducedMotion,
  originRef,
  onClose,
}: PainPointsBalloonProps) {
  // Calcula a posição inicial do balão a partir do botão de origem (centro relativo)
  const origin = (() => {
    if (typeof window === 'undefined' || !originRef?.current) return { dx: 0, dy: 0 };
    const rect = originRef.current.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    return { dx: originX - centerX, dy: originY - centerY };
  })();
  const list = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: reducedMotion ? 0 : 0.18,
        staggerChildren: reducedMotion ? 0 : 0.06,
      },
    },
  };
  const tile = {
    hidden: reducedMotion ? {} : { opacity: 0, y: 14, scale: 0.94, filter: 'blur(6px)' },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <motion.div
      data-no-click-advance
      className="fixed inset-0 z-[80] flex items-center justify-center p-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        aria-hidden
        className="absolute inset-0 cursor-pointer"
        onClick={onClose}
        initial={{ backdropFilter: 'blur(0px)' }}
        animate={{ backdropFilter: 'blur(14px)' }}
        exit={{ backdropFilter: 'blur(0px)' }}
        transition={{ duration: 0.4 }}
        style={{ background: 'rgba(4, 6, 12, 0.72)' }}
      />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        initial={
          reducedMotion
            ? { opacity: 0 }
            : { opacity: 0, scale: 0.02, x: origin.dx, y: origin.dy, filter: 'blur(14px)' }
        }
        animate={{ opacity: 1, scale: 1, x: 0, y: 0, filter: 'blur(0px)' }}
        exit={
          reducedMotion
            ? { opacity: 0 }
            : { opacity: 0, scale: 0.94, y: 8, filter: 'blur(8px)', transition: { duration: 0.35 } }
        }
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-[820px] overflow-hidden rounded-[28px] border bg-[#0b0f18]/95 p-10 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.8)]"
        style={{
          borderColor: `${accentColor}55`,
          boxShadow: `0 0 0 1px ${accentColor}22, 0 50px 140px -20px ${accentColor}30, inset 0 1px 0 rgba(255,255,255,0.06)`,
        }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-10 -top-px h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
          }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at top, ${accentColor}1a, transparent 60%)`,
          }}
        />

        <div className="relative flex items-start justify-between gap-4">
          <div>
            <span
              className="block text-[10px] font-semibold uppercase tracking-[0.36em]"
              style={{ color: accentColor, opacity: 0.85 }}
            >
              {title}
            </span>
            {headline && (
              <h3 className="mt-3 max-w-[28ch] text-[clamp(1.35rem,2.6vw,1.8rem)] font-bold leading-tight text-white">
                {headline}
              </h3>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-white/70 transition-colors duration-200 hover:border-white/30 hover:bg-white/[0.08] hover:text-white"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M1 1L13 13M13 1L1 13"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <motion.ul
          variants={list}
          initial="hidden"
          animate="visible"
          className="relative mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2"
        >
          {bullets.map((text, i) => (
            <motion.li key={text} variants={tile}>
              <div
                className="relative flex items-start gap-3 overflow-hidden rounded-2xl border px-5 py-4"
                style={{
                  borderColor: `${accentColor}33`,
                  background: `linear-gradient(135deg, ${accentColor}14 0%, rgba(255,255,255,0.025) 100%)`,
                  boxShadow: `inset 0 1px 0 rgba(255,255,255,0.05)`,
                }}
              >
                <span
                  aria-hidden
                  className="mt-0.5 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                  style={{
                    background: `${accentColor}26`,
                    color: accentColor,
                    border: `1px solid ${accentColor}55`,
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-[0.98rem] font-medium leading-snug text-slate-50">
                  {text}
                </span>
              </div>
            </motion.li>
          ))}
        </motion.ul>

        <p className="relative mt-7 text-center text-[11px] uppercase tracking-[0.32em] text-white/35">
          Toque fora ou pressione ESC para fechar
        </p>
      </motion.div>
    </motion.div>,
    document.body,
  );
}

/** Camadas sobrepostas — "crescimento por acúmulo": cartões empilhados em offset. */
function StackedLayersBackdrop({
  color,
  reduce,
  active,
}: {
  color: string;
  reduce: boolean;
  active: boolean;
}) {
  const layers = [0, 1, 2, 3];
  return (
    <div aria-hidden className="pointer-events-none absolute -inset-3 overflow-hidden">
      {layers.map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-2xl border"
          style={{
            borderColor: `${color}22`,
            background: `linear-gradient(135deg, ${color}06 0%, transparent 80%)`,
            transform: `translate(${i * 6}px, ${i * 6}px)`,
            opacity: 0.5 - i * 0.1,
          }}
          initial={reduce ? false : { opacity: 0, x: -10 - i * 4, y: -10 - i * 4 }}
          animate={
            active
              ? { opacity: 0.5 - i * 0.1, x: i * 6, y: i * 6 }
              : reduce
                ? undefined
                : { opacity: 0, x: -10 - i * 4, y: -10 - i * 4 }
          }
          transition={{ duration: 0.6, delay: 0.2 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}
    </div>
  );
}

/** Teia tensa — "operação que cresce conectada de forma fragmentada". */
function TenseWebBackdrop({
  color,
  reduce,
  active,
  count,
}: {
  color: string;
  reduce: boolean;
  active: boolean;
  count: number;
}) {
  const W = 600;
  const H = 320;
  const nodes = Array.from({ length: Math.min(count, 8) }, (_, i) => {
    // Distribuição pseudo-aleatória estável
    const seed = (i * 9301 + 49297) % 233280;
    const r = seed / 233280;
    return {
      x: 60 + ((i * 73) % (W - 120)) + r * 30,
      y: 40 + ((i * 47) % (H - 80)),
    };
  });
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className="pointer-events-none absolute -inset-3 h-[calc(100%+24px)] w-[calc(100%+24px)]"
      style={{ opacity: active ? 0.45 : 0.15 }}
    >
      {nodes.map((n, i) =>
        nodes.slice(i + 1).map((m, j) => (
          <motion.line
            key={`tw-${i}-${j}`}
            x1={n.x}
            y1={n.y}
            x2={m.x}
            y2={m.y}
            stroke={color}
            strokeWidth={0.5}
            strokeOpacity={0.25}
            strokeDasharray="3 5"
            animate={reduce ? undefined : { strokeDashoffset: [0, -8] }}
            transition={{
              duration: 4 + ((i + j) % 3),
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        )),
      )}
      {nodes.map((n, i) => (
        <motion.circle
          key={`twn-${i}`}
          cx={n.x}
          cy={n.y}
          r={2}
          fill={color}
          opacity={0.55}
          animate={reduce ? undefined : { opacity: [0.3, 0.7, 0.3] }}
          transition={{
            duration: 2.6,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.18,
          }}
        />
      ))}
    </svg>
  );
}

interface PainPointChipsProps {
  bullets: string[];
  accentColor: string;
  active: boolean;
  reducedMotion: boolean;
}

function PainPointChips({ bullets, accentColor, active, reducedMotion }: PainPointChipsProps) {
  const container = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: reducedMotion ? 0 : 0.12,
        staggerChildren: reducedMotion ? 0 : 0.07,
      },
    },
  };

  const chip = {
    hidden: reducedMotion ? {} : { opacity: 0, y: 10, scale: 0.96, filter: 'blur(4px)' },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <motion.ul
      variants={container}
      initial={reducedMotion ? false : 'hidden'}
      animate={active ? 'visible' : 'hidden'}
      className="grid grid-cols-1 gap-2.5 sm:grid-cols-2"
    >
      {bullets.map((text, i) => (
        <motion.li key={text} variants={chip}>
          <motion.div
            whileHover={
              reducedMotion
                ? undefined
                : { y: -2, scale: 1.015, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } }
            }
            className="group relative flex items-center gap-3 overflow-hidden rounded-2xl border px-4 py-3"
            style={{
              borderColor: `${accentColor}33`,
              background: `linear-gradient(135deg, ${accentColor}10 0%, rgba(255,255,255,0.02) 100%)`,
              boxShadow: `inset 0 1px 0 rgba(255,255,255,0.04)`,
            }}
          >
            <motion.span
              aria-hidden
              className="relative h-2 w-2 flex-shrink-0 rounded-full"
              style={{ background: accentColor, boxShadow: `0 0 10px ${accentColor}` }}
              animate={
                reducedMotion
                  ? undefined
                  : {
                      opacity: [0.55, 1, 0.55],
                      scale: [0.85, 1.1, 0.85],
                    }
              }
              transition={{
                duration: 2.6,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.18,
              }}
            />
            <span className="flex-1 text-[0.92rem] font-medium leading-snug text-slate-100">
              {text}
            </span>
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 w-12 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background: `linear-gradient(270deg, ${accentColor}22, transparent)`,
              }}
            />
          </motion.div>
        </motion.li>
      ))}
    </motion.ul>
  );
}
