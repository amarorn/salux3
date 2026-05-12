import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { usePresentationStore } from '@/store/presentationStore';
import { useCurrentPresentation } from '@/hooks/useCurrentPresentation';
import { theme } from '@/domain/theme';

/**
 * Maestro — orbe de luz pulsante que acompanha a apresentação.
 * Muda de cor e intensidade conforme o slide ativo, e sussurra
 * uma frase curta a cada transição (whisper).
 */

interface Props {
  visible: boolean;
}

/** Sussurros curtos por kind de slide. */
const WHISPERS: Record<string, string> = {
  cover: 'Vamos começar.',
  narrative: 'Olha por aqui.',
  highlight: 'Esse ponto é importante.',
  architecture: 'A estrutura sustenta tudo.',
  journey: 'Cada etapa conta.',
  integration: 'A virada de lógica.',
  governance: 'Tudo se conecta.',
  roadmap: 'Capacidades que sustentam.',
  closing: 'Até a próxima.',
};

export function MaestroOrb({ visible }: Props) {
  const reduceMotion = useReducedMotion();
  const stepId = usePresentationStore((s) => s.currentStepId);
  const { stepsById } = useCurrentPresentation();
  const current = stepsById[stepId];
  const accent = current ? theme.accents[current.accent].base : '#54c1ed';
  const whisper = current ? WHISPERS[current.kind] ?? '' : '';

  // Mostra o whisper brevemente a cada troca de slide
  const [showWhisper, setShowWhisper] = useState(false);
  useEffect(() => {
    if (!visible || !whisper || reduceMotion) return;
    setShowWhisper(true);
    const t = window.setTimeout(() => setShowWhisper(false), 3200);
    return () => window.clearTimeout(t);
  }, [stepId, visible, whisper, reduceMotion]);

  // Calcula a intensidade baseada no kind (alguns slides demandam mais energia)
  const intensity = useMemo(() => {
    const high = ['cover', 'closing', 'highlight'];
    return current && high.includes(current.kind) ? 1.15 : 1;
  }, [current]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="maestro"
          className="pointer-events-none fixed z-30 select-none"
          style={{ right: 28, bottom: 28 }}
          initial={{ opacity: 0, scale: 0.6, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 14 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative flex flex-col items-end gap-3">
            {/* Whisper text */}
            <AnimatePresence>
              {showWhisper && whisper && (
                <motion.div
                  key={`whisper-${stepId}`}
                  initial={{ opacity: 0, x: 8, y: 4 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="relative rounded-full border px-3.5 py-1.5 text-[11px] font-medium tracking-wide text-white/90 backdrop-blur-md"
                  style={{
                    borderColor: `${accent}44`,
                    background: `linear-gradient(135deg, ${accent}1a 0%, rgba(8,12,20,0.85) 100%)`,
                    boxShadow: `0 8px 24px -6px ${accent}55, inset 0 1px 0 rgba(255,255,255,0.08)`,
                  }}
                >
                  {whisper}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Orbe */}
            <div className="relative" style={{ width: 72, height: 72 }}>
              {/* Glow externo difuso */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${accent}66 0%, ${accent}22 40%, transparent 70%)`,
                  filter: 'blur(8px)',
                }}
                animate={
                  reduceMotion
                    ? undefined
                    : {
                        scale: [1, 1.18 * intensity, 1.08, 1.22 * intensity, 1],
                        opacity: [0.55, 0.9, 0.7, 0.95, 0.55],
                      }
                }
                transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
              />

              {/* Anel orbital 1 */}
              <motion.div
                className="absolute inset-1 rounded-full border"
                style={{
                  borderColor: `${accent}88`,
                  boxShadow: `0 0 16px ${accent}, inset 0 0 12px ${accent}44`,
                }}
                animate={
                  reduceMotion
                    ? undefined
                    : { scale: [1, 1.08, 1], rotate: 360, opacity: [0.7, 1, 0.7] }
                }
                transition={{
                  scale: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
                  opacity: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
                  rotate: { duration: 18, repeat: Infinity, ease: 'linear' },
                }}
              />

              {/* Anel orbital 2 (contra-rotação) */}
              <motion.div
                className="absolute rounded-full border"
                style={{
                  inset: 8,
                  borderColor: `${accent}55`,
                  borderStyle: 'dashed',
                }}
                animate={reduceMotion ? undefined : { rotate: -360 }}
                transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
              />

              {/* Núcleo de luz */}
              <motion.div
                className="absolute rounded-full"
                style={{
                  inset: 18,
                  background: `radial-gradient(circle at 35% 35%, #ffffff 0%, ${accent} 35%, ${accent}88 70%, transparent 100%)`,
                  boxShadow: `0 0 24px ${accent}, 0 0 60px ${accent}88, inset 0 0 16px rgba(255,255,255,0.6)`,
                }}
                animate={
                  reduceMotion
                    ? undefined
                    : {
                        scale: [1, 1.14, 1.02, 1.12, 1],
                        opacity: [0.9, 1, 0.95, 1, 0.9],
                      }
                }
                transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
              />

              {/* Feixe horizontal (lens flare sutil) */}
              {!reduceMotion && (
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute left-1/2 top-1/2 h-px -translate-x-1/2 -translate-y-1/2"
                  style={{
                    width: 120,
                    background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
                    boxShadow: `0 0 10px ${accent}`,
                  }}
                  animate={{
                    opacity: [0, 0.6, 0.3, 0.7, 0],
                    scaleX: [0.6, 1, 0.85, 1.1, 0.6],
                  }}
                  transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}

              {/* Centelhas orbitais */}
              {!reduceMotion &&
                [0, 1, 2].map((i) => (
                  <motion.span
                    key={`spark-${i}`}
                    className="absolute h-1 w-1 rounded-full"
                    style={{
                      top: '50%',
                      left: '50%',
                      background: accent,
                      boxShadow: `0 0 8px ${accent}`,
                      transformOrigin: '0 0',
                    }}
                    animate={{
                      rotate: 360,
                      x: [28, 24, 30, 26, 28],
                      y: 0,
                    }}
                    transition={{
                      rotate: {
                        duration: 6 + i * 1.5,
                        repeat: Infinity,
                        ease: 'linear',
                        delay: i * 1.2,
                      },
                    }}
                  />
                ))}
            </div>

            {/* Label discreto "MAESTRO" */}
            <motion.span
              className="text-[8px] font-semibold uppercase tracking-[0.42em] text-white/30"
              animate={reduceMotion ? undefined : { opacity: [0.25, 0.55, 0.25] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              Maestro
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
