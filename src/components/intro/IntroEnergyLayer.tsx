import { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import energiaSvgUrl from '@/assets/intro/energia-abstrata-v3.svg?url';
import { EnergiaSpeechWaves } from './EnergiaSpeechWaves';

interface IntroEnergyLayerProps {
  highlightedTrackIndex: number | null;
  highlightColor: string | null;
  reduceMotion: boolean;
  logoReady: boolean;
}

export function IntroEnergyLayer({
  highlightedTrackIndex,
  highlightColor,
  reduceMotion,
  logoReady,
}: IntroEnergyLayerProps) {
  const targetX = useMotionValue(0);
  const springX = useSpring(targetX, { stiffness: 90, damping: 24, mass: 0.8 });

  useEffect(() => {
    if (highlightedTrackIndex === null) {
      targetX.set(0);
      return;
    }
    const nudge = (highlightedTrackIndex + 0.5) / 5 - 0.5;
    targetX.set(nudge * 140);
  }, [highlightedTrackIndex, targetX]);

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
      initial={{ opacity: 0.45 }}
      animate={{ opacity: logoReady ? 1 : 0.5 }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="absolute inset-0"
        animate={{
          opacity: highlightedTrackIndex !== null ? 0.62 : 0.42,
          scale: highlightedTrackIndex !== null ? 1.045 : 1,
        }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="absolute left-1/2 top-1/2 h-[125vmin] w-[125vmin] max-h-[1600px] max-w-[1600px] -translate-x-1/2 -translate-y-1/2"
          style={{ x: springX }}
          animate={reduceMotion ? undefined : { rotate: 360 }}
          transition={
            reduceMotion
              ? undefined
              : { rotate: { duration: 220, repeat: Infinity, ease: 'linear' } }
          }
        >
          <motion.div
            className="relative h-full w-full"
            animate={reduceMotion ? undefined : { scale: [1, 1.028, 1] }}
            transition={
              reduceMotion
                ? undefined
                : {
                    duration: 14,
                    repeat: Infinity,
                    ease: [0.45, 0, 0.55, 1],
                  }
            }
          >
            <div
              className="relative h-full w-full"
              style={{
                transform: 'translate(-3.25%, -2.25%)',
              }}
            >
              <img
                src={energiaSvgUrl}
                alt=""
                draggable={false}
                className="relative z-0 h-full w-full select-none object-contain object-center opacity-[0.44]"
                style={{ mixBlendMode: 'screen' }}
              />
              <svg
                className="pointer-events-none absolute inset-0 z-[1] h-full w-full overflow-visible"
                viewBox="-70 -115 1740 1130"
                preserveAspectRatio="xMidYMid meet"
                aria-hidden
                style={{ mixBlendMode: 'screen' }}
              >
                <EnergiaSpeechWaves
                  reduceMotion={reduceMotion}
                  boosted={highlightedTrackIndex !== null}
                />
              </svg>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute inset-0"
          animate={{ opacity: highlightColor ? 0.2 : 0 }}
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background: highlightColor
              ? `radial-gradient(ellipse 58% 48% at 50% 50%, ${highlightColor}66, transparent 74%)`
              : 'transparent',
            mixBlendMode: 'screen',
          }}
        />
      </motion.div>

      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,transparent_0%,#05070d_80%)]"
        style={{ opacity: 0.9 }}
      />
    </motion.div>
  );
}
