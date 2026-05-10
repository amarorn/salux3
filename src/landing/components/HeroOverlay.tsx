import { motion, useMotionValue, useMotionTemplate } from 'framer-motion';
import { useMouseBridge } from '@/landing/MouseBridgeContext';
import { useLandingParallax } from '@/landing/hooks/useLandingParallax';
import { MagneticButton } from './MagneticButton';

const lineVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.082, delayChildren: 0.14 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 32, filter: 'blur(14px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.78, ease: [0.16, 1, 0.3, 1] },
  },
};

export function HeroOverlay() {
  const { smoothRef, mobile } = useMouseBridge();

  const d1x = useMotionValue(0);
  const d1y = useMotionValue(0);
  const d2x = useMotionValue(0);
  const d2y = useMotionValue(0);
  const orbX = useMotionValue(0);
  const orbY = useMotionValue(0);

  const tLayer1 = useMotionTemplate`translate3d(${d1x}px, ${d1y}px, 0)`;
  const tLayer2 = useMotionTemplate`translate3d(${d2x}px, ${d2y}px, 0)`;
  const tOrb = useMotionTemplate`translate3d(${orbX}px, ${orbY}px, 0)`;

  useLandingParallax(smoothRef, [
    { x: d1x, y: d1y, kx: mobile ? 5 : 11, ky: mobile ? 4 : 9 },
    { x: d2x, y: d2y, kx: mobile ? 8 : 22, ky: mobile ? 6 : 18 },
    { x: orbX, y: orbY, kx: mobile ? -5 : -15, ky: mobile ? -3 : -11 },
  ]);

  return (
    <section className="pointer-events-none relative z-10 flex min-h-screen flex-col items-center justify-center px-6 pt-24 text-center md:px-10">
      <motion.div
        aria-hidden
        style={{ transform: tOrb }}
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_40%_at_50%_38%,rgba(124,58,237,0.14),transparent_72%)]"
      />

      <motion.div
        variants={lineVariants}
        initial="hidden"
        animate="visible"
        className="relative flex max-w-[980px] flex-col items-center gap-8"
      >
        <motion.p
          variants={itemVariants}
          style={{ transform: tLayer1 }}
          className="pointer-events-auto text-[10px] font-semibold uppercase tracking-[0.42em] text-white/40"
        >
          Salux · experiência imersiva
        </motion.p>

        <motion.h1
          variants={itemVariants}
          style={{ transform: tLayer2 }}
          className="pointer-events-auto font-display text-[clamp(2.1rem,6.5vw,4.1rem)] font-bold leading-[1.02] tracking-tight text-white"
        >
          Proteção econômica
          <br />
          <span className="bg-gradient-to-r from-violet-200 via-cyan-200 to-violet-300 bg-clip-text text-transparent">
            da operação em saúde
          </span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          style={{ transform: tLayer1 }}
          className="pointer-events-auto max-w-[56ch] text-pretty text-base font-medium leading-relaxed text-slate-400 md:text-lg"
        >
          Uma camada cinematográfica onde o rato modula luz, profundidade e movimento em tempo real — WebGL, shaders e
          motion design de estúdio.
        </motion.p>

        <motion.div variants={itemVariants} className="group relative mt-2">
          {!mobile && (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-[-20px] rounded-full bg-violet-500/10 opacity-0 blur-3xl transition-[opacity] duration-[520ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-[0.75]"
            />
          )}
          <div className="pointer-events-auto">
            <MagneticButton to="/apresentacao">Iniciar apresentação</MagneticButton>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
