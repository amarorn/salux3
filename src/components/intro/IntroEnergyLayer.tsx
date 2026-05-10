import { motion, useMotionValue, useTransform, type MotionValue } from 'framer-motion';
import energiaSvgUrl from '@/assets/intro/energia-abstrata-v3.svg?url';
import { EnergiaSpeechWaves } from './EnergiaSpeechWaves';
import { IntroParticles } from './IntroParticles';

interface IntroEnergyLayerProps {
  highlightedTrackIndex: number | null;
  highlightColor: string | null;
  reduceMotion: boolean;
  logoReady: boolean;
  parallaxX?: MotionValue<number>;
  parallaxY?: MotionValue<number>;
  wheelEnergy?: MotionValue<number>;
}

export function IntroEnergyLayer({
  highlightedTrackIndex,
  highlightColor,
  reduceMotion,
  logoReady,
  parallaxX,
  parallaxY,
  wheelEnergy,
}: IntroEnergyLayerProps) {
  const fallbackZero = useMotionValue(0);
  const energy = wheelEnergy ?? fallbackZero;
  const coreScale = useTransform(energy, (v) => 1 + v * 0.18);
  const coreOpacityBoost = useTransform(energy, (v) => Math.min(v * 0.6, 0.9));
  const burstScale = useTransform(energy, (v) => 1 + v * 0.06);
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
      initial={{ opacity: 0.45 }}
      animate={{ opacity: logoReady ? 1 : 0.5 }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Atmospheric multi-radial backdrop */}
      <motion.div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 45% at 22% 28%, rgba(95,196,255,0.14), transparent 55%), radial-gradient(ellipse 55% 40% at 78% 72%, rgba(255,184,74,0.10), transparent 55%), radial-gradient(ellipse 80% 60% at 50% 50%, rgba(20,40,90,0.35), transparent 75%), #05070d',
        }}
        animate={
          reduceMotion
            ? undefined
            : { opacity: [0.85, 1, 0.9, 1, 0.85] }
        }
        transition={
          reduceMotion ? undefined : { duration: 22, repeat: Infinity, ease: [0.45, 0, 0.55, 1] }
        }
      />

      <div className="absolute inset-0">
        {/* Pulsing core glow — wheel energy expands it */}
        <motion.div
          aria-hidden
          className="absolute left-1/2 top-1/2 h-[60vmin] w-[60vmin] max-h-[760px] max-w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(255,228,140,0.85) 0%, rgba(255,170,60,0.55) 18%, rgba(70,160,255,0.35) 42%, rgba(20,80,200,0.15) 65%, transparent 80%)',
            filter: 'blur(28px)',
            mixBlendMode: 'screen',
            willChange: 'opacity, transform',
            scale: coreScale,
          }}
          animate={
            reduceMotion
              ? undefined
              : { opacity: [0.78, 1, 0.85, 0.95, 0.78] }
          }
          transition={
            reduceMotion ? undefined : { duration: 6.5, repeat: Infinity, ease: [0.45, 0, 0.55, 1] }
          }
        />

        {/* Wheel-energy bloom flash */}
        <motion.div
          aria-hidden
          className="absolute left-1/2 top-1/2 h-[80vmin] w-[80vmin] max-h-[1000px] max-w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(255,210,120,0.55) 0%, rgba(120,200,255,0.28) 35%, transparent 70%)',
            filter: 'blur(40px)',
            mixBlendMode: 'screen',
            opacity: coreOpacityBoost,
            willChange: 'opacity',
          }}
        />

        <div className="absolute left-1/2 top-1/2 h-[125vmin] w-[125vmin] max-h-[1600px] max-w-[1600px] -translate-x-1/2 -translate-y-1/2">
          <motion.div
            className="absolute inset-0"
            style={{
              ...(parallaxX && parallaxY ? { x: parallaxX, y: parallaxY } : {}),
              scale: burstScale,
            }}
          >
          <motion.div
            className="absolute inset-0"
            animate={
              reduceMotion ? undefined : { y: [0, -6, 0, 5, 0], scale: [1, 1.012, 1] }
            }
            transition={
              reduceMotion
                ? undefined
                : { duration: 11, repeat: Infinity, ease: [0.45, 0, 0.55, 1] }
            }
            style={{ willChange: 'transform' }}
          >
            <img
              src={energiaSvgUrl}
              alt=""
              draggable={false}
              className="relative z-0 h-full w-full select-none object-contain object-center opacity-[0.85]"
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
          </motion.div>
          </motion.div>
        </div>

        <IntroParticles reduceMotion={reduceMotion} />

        {/* Light sweep — diagonal shimmer crossing the scene */}
        {!reduceMotion && (
          <motion.div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(105deg, transparent 38%, rgba(255,240,200,0.05) 48%, rgba(150,210,255,0.07) 52%, transparent 62%)',
              mixBlendMode: 'screen',
              willChange: 'transform, opacity',
            }}
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: ['-100%', '120%'], opacity: [0, 1, 0] }}
            transition={{
              duration: 9,
              repeat: Infinity,
              repeatDelay: 6,
              ease: [0.22, 1, 0.36, 1],
              times: [0, 0.5, 1],
            }}
          />
        )}

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
      </div>

      {/* Vignette */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 100% 80% at 50% 50%, transparent 35%, rgba(0,0,0,0.55) 88%, rgba(0,0,0,0.85) 100%)',
        }}
      />

      {/* Inner soft fade to deep background */}
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,transparent_0%,#05070d_80%)]"
        style={{ opacity: 0.85 }}
      />

      {/* Film grain — SVG turbulence */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.07] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")",
          backgroundSize: '220px 220px',
        }}
      />
    </motion.div>
  );
}
