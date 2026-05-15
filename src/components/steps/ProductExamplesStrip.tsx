import { motion, useReducedMotion } from 'framer-motion';
import type { ProductExample } from '@/domain/types';

interface Props {
  examples: ProductExample[];
  active: boolean;
  accentColor: string;
}

export function ProductExamplesStrip({ examples, active, accentColor }: Props) {
  const reduce = useReducedMotion();
  if (examples.length === 0) return null;

  return (
    <motion.section
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={active ? { opacity: 1, y: 0 } : reduce ? undefined : { opacity: 0, y: 12 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
      className="flex flex-col gap-3"
      aria-label="Exemplos de produto em operação"
    >
      <motion.div
        className="flex items-center gap-3"
      >
        <span
          className="text-[10px] font-semibold uppercase tracking-[0.28em]"
          style={{ color: accentColor, opacity: 0.9 }}
        >
          Em operação
        </span>
        <span
          className="h-px flex-1"
          style={{
            background: `linear-gradient(90deg, ${accentColor}55, transparent)`,
          }}
        />
      </motion.div>
      <motion.div
        className="flex gap-3 overflow-x-auto pb-1 snap-x snap-mandatory"
        initial={false}
      >
        {examples.map((ex, i) => (
          <motion.figure
            key={ex.imageSrc}
            className="group relative min-w-[min(100%,420px)] flex-1 snap-center overflow-hidden rounded-2xl border"
            style={{
              borderColor: `${accentColor}44`,
              boxShadow: `0 24px 60px -24px ${accentColor}33`,
            }}
            initial={reduce ? false : { opacity: 0, scale: 0.97 }}
            animate={
              active
                ? { opacity: 1, scale: 1 }
                : reduce
                  ? undefined
                  : { opacity: 0, scale: 0.97 }
            }
            transition={{
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.45 + i * 0.1,
            }}
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/40">
              <img
                src={ex.imageSrc}
                alt={ex.alt ?? ex.caption}
                className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                loading="lazy"
              />
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(4,8,16,0.75) 100%)',
                }}
              />
              <motion.span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-px"
                style={{
                  background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
                }}
                animate={reduce ? undefined : { opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
            <figcaption className="border-t border-white/8 bg-white/[0.03] px-4 py-3">
              <p className="text-[0.92rem] font-medium leading-snug text-slate-100/95">
                {ex.caption}
              </p>
            </figcaption>
          </motion.figure>
        ))}
      </motion.div>
    </motion.section>
  );
}
