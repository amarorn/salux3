import { memo } from 'react';
import { motion } from 'framer-motion';
import { SaluxSymbol } from './intro/SaluxLogo';

interface HeroClusterProps {
  active: boolean;
}

const ORBIT_NODES = [
  { angle: 0, label: 'Raciocínio', accent: '#a78bfa' },
  { angle: 72, label: 'Ferramentas', accent: '#54c1ed' },
  { angle: 144, label: 'Dados', accent: '#34d399' },
  { angle: 216, label: 'Memória', accent: '#fbbf24' },
  { angle: 288, label: 'Governança', accent: '#fb7185' },
];

function HeroClusterComponent({ active }: HeroClusterProps) {
  return (
    <div
      aria-hidden="true"
      className="absolute"
      style={{ left: 0, top: 0, transform: 'translate(-50%, -50%)' }}
    >
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 80, ease: 'linear', repeat: Infinity }}
        className="relative"
        style={{ width: 760, height: 760 }}
      >
        <div className="absolute inset-0 rounded-full border border-white/10" />
        <div
          className="absolute inset-12 rounded-full border border-cyan-400/15"
          style={{ transform: 'rotate(20deg)' }}
        />
        <div
          className="absolute inset-24 rounded-full border border-violet-400/15"
          style={{ transform: 'rotate(-12deg)' }}
        />

        {ORBIT_NODES.map((node, i) => {
          const rad = (node.angle * Math.PI) / 180;
          const r = 360;
          const x = Math.cos(rad) * r;
          const y = Math.sin(rad) * r;
          return (
            <motion.div
              key={node.label}
              className="absolute"
              style={{
                left: '50%',
                top: '50%',
                transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`,
              }}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 0.95, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.08, type: 'spring', stiffness: 120, damping: 18 }}
            >
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 80, ease: 'linear', repeat: Infinity }}
                className="flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-white/80 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.6)]"
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: node.accent, boxShadow: `0 0 14px ${node.accent}` }}
                />
                {node.label}
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        animate={{ scale: active ? [1, 1.04, 1] : 1 }}
        transition={{ duration: 4, ease: 'easeInOut', repeat: Infinity }}
      >
        <div className="relative">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(124,58,237,0.45), rgba(6,182,212,0.25) 60%, transparent 80%)',
              transform: 'scale(2.6)',
            }}
          />
          <motion.div
            className="relative flex items-center justify-center"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 5, ease: 'easeInOut', repeat: Infinity }}
          >
            <div
              aria-hidden
              className="absolute -inset-12 rounded-full"
              style={{
                background:
                  'radial-gradient(circle, rgba(74,156,250,0.18), transparent 70%)',
              }}
            />
            <SaluxLogoSymbolOnly />
          </motion.div>
          <div className="mt-6 text-center">
            <p className="font-display text-base font-semibold tracking-tight text-white">
              Plataforma agêntica
            </p>
            <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.22em] text-white/45">
              Dados · Modelos · Ação
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function SaluxLogoSymbolOnly() {
  return <SaluxSymbol width={240} idle />;
}

export const HeroCluster = memo(HeroClusterComponent);
