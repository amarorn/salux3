import { useContext } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Activity, AlertTriangle, CalendarCheck, MessageSquare, Stethoscope } from 'lucide-react';
import { FloatingCard, FloatingCardContext } from '../FloatingCard';
import type { PresentationStep } from '@/domain/types';
import { theme } from '@/domain/theme';
import { getCardTextVariants } from './cardTextMotion';

interface Props {
  step: PresentationStep;
  active: boolean;
}

const TIMELINE = [
  { icon: MessageSquare, label: 'Triagem', detail: 'Conversação clínica' },
  { icon: CalendarCheck, label: 'Agenda', detail: 'Encaixe inteligente' },
  { icon: Stethoscope, label: 'Consulta', detail: 'Pré-leitura completa' },
  { icon: Activity, label: 'Continuidade', detail: 'Follow-up ativo' },
];

function JourneyStageRail({
  stages,
  active,
  accentBase,
}: {
  stages: string[];
  active: boolean;
  accentBase: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex min-w-max items-start gap-0 px-1">
        {stages.map((label, i) => (
          <div key={`${label}-${i}`} className="flex items-start">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: active ? 1 : 0.35, y: 0 }}
              transition={{
                delay: reduceMotion ? 0 : 0.15 + i * 0.07,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex w-[76px] shrink-0 flex-col items-center sm:w-[88px]"
            >
              <div
                className="flex h-9 w-9 items-center justify-center rounded-full border text-[11px] font-bold shadow-soft sm:h-10 sm:w-10"
                style={{
                  borderColor: `${accentBase}55`,
                  background: `${accentBase}14`,
                  color: '#f8fafc',
                  boxShadow: `0 0 20px ${accentBase}22`,
                }}
              >
                {i + 1}
              </div>
              <p className="mt-2 text-center text-[9px] font-medium leading-tight text-slate-200 sm:text-[10px]">
                {label}
              </p>
            </motion.div>
            {i < stages.length - 1 && (
              <div className="flex h-9 flex-1 items-center px-0.5 pt-1 sm:h-10">
                <div className="h-px w-5 bg-gradient-to-r from-emerald-400/35 to-amber-400/35 sm:w-7" />
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: active ? 1 : 0.4, scale: 1 }}
                  transition={{ delay: reduceMotion ? 0 : 0.2 + i * 0.06 }}
                  className="mx-0.5 flex h-6 w-6 items-center justify-center rounded-full border border-amber-400/35 bg-amber-500/15 text-amber-300"
                  title="Ruptura de contexto"
                >
                  <AlertTriangle className="h-3 w-3" strokeWidth={2} aria-hidden />
                </motion.span>
                <div className="h-px w-5 bg-gradient-to-r from-amber-400/35 to-emerald-400/35 sm:w-7" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function JourneyStep({ step, active }: Props) {
  const accent = theme.accents[step.accent];
  const reduceMotion = useReducedMotion();
  const flipPhoto = useContext(FloatingCardContext)?.flipPhoto ?? false;
  const { container, item } = getCardTextVariants(
    Boolean(reduceMotion),
    step.index,
    `${step.id}:${step.title}`,
    flipPhoto,
  );
  const stages = step.content.journeyStages;

  return (
    <FloatingCard
      accent={step.accent}
      active={active}
      stepId={step.id}
      badge={step.content.headline ?? String(step.index + 1).padStart(2, '0')}
      width={stages?.length ? 720 : 620}
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

        {stages && stages.length > 0 ? (
          <motion.div variants={item}>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300/80">
              Jornada — rupturas entre etapas
            </p>
            <JourneyStageRail stages={stages} active={active} accentBase={accent.base} />
          </motion.div>
        ) : null}

        {step.content.body && (
          <motion.p variants={item} className="text-sm leading-relaxed text-slate-300 whitespace-pre-line">
            {step.content.body}
          </motion.p>
        )}

        {!(stages && stages.length > 0) ? (
          <motion.div variants={item} className="relative">
            <div className="absolute left-5 right-5 top-5 h-px bg-gradient-to-r from-emerald-300 via-emerald-400 to-cyan-400 opacity-60" />
            <div className="relative grid grid-cols-4 gap-2">
              {TIMELINE.map((itemTl, i) => (
                <motion.div
                  key={itemTl.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col items-center text-center"
                >
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-400/25 bg-white/5 shadow-soft"
                    style={{ color: accent.strong }}
                  >
                    <itemTl.icon className="h-4.5 w-4.5" strokeWidth={1.8} />
                  </div>
                  <p className="mt-2 text-[12px] font-semibold text-white">{itemTl.label}</p>
                  <p className="text-[10px] text-slate-400">{itemTl.detail}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : null}

        {step.content.bullets && step.content.bullets.length > 0 && (
          <motion.ul variants={item} className="mt-1 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {step.content.bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-2 text-xs leading-snug text-slate-200">
                <span
                  className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full"
                  style={{ background: accent.base }}
                />
                <span className="whitespace-pre-line">{bullet}</span>
              </li>
            ))}
          </motion.ul>
        )}
      </motion.div>
    </FloatingCard>
  );
}
