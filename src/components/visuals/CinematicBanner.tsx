import { useMemo, type CSSProperties } from "react";
import { motion, useReducedMotion } from 'framer-motion';

interface CinematicBannerProps {
  /** Imagem de fundo do banner. */
  src: string;
  /** Alt text (opcional, deixe vazio para aria-hidden). */
  alt?: string;
  /** Cor accent do slide (hex). */
  accentColor: string;
  /** Slide ativo? Animações respiram com mais intensidade quando ativo. */
  active: boolean;
  /** Quantidade de partículas (default 5). */
  particles?: number;
  /** Arte com transparência: fundo escuro fixo, `object-contain`, overlays mínimos. */
  transparentCutout?: boolean;
  /** Chapa preta #000 no ficheiro: dissolve sobre fundo escuro da app (`mix-blend-mode: lighten`). */
  lightenBlackMatte?: boolean;
  /** Imagem estática, sem efeitos (Ken Burns, vignette, partículas). */
  plain?: boolean;
}

/**
 * Banner cinematográfico: foto base com Ken Burns suave, partículas
 * de luz na cor accent, vignette respirando e tint dinâmico.
 *
 * Substitui o `<img>` simples mantendo a mesma assinatura de fora
 * (cobre todo o container do parent absoluto/relative).
 */
export function CinematicBanner({
  src,
  alt,
  accentColor,
  active,
  particles = 5,
  transparentCutout = false,
  lightenBlackMatte = false,
  plain = false,
}: CinematicBannerProps) {
  const reduceMotion = useReducedMotion();

  const particleSeeds = useMemo(() => {
    let seed = 0;
    for (let i = 0; i < src.length; i++) seed = (seed * 31 + src.charCodeAt(i)) >>> 0;
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return (seed & 0xffff) / 0xffff;
    };
    return Array.from({ length: particles }).map((_, i) => ({
      key: `p-${i}`,
      x0: 10 + rand() * 80, // %
      y0: 10 + rand() * 80,
      x1: 10 + rand() * 80,
      y1: 10 + rand() * 80,
      x2: 10 + rand() * 80,
      y2: 10 + rand() * 80,
      size: 3 + rand() * 4,
      duration: 18 + rand() * 14,
      delay: rand() * 6,
      opacity: 0.4 + rand() * 0.4,
    }));
  }, [src, particles]);

  const matteImgStyle: CSSProperties | undefined = lightenBlackMatte
    ? { mixBlendMode: "lighten" }
    : undefined;

  if (transparentCutout) {
    return (
      <>
        <div className="absolute inset-0 bg-[#05070d]" aria-hidden />
        <div className="absolute inset-0 flex items-center justify-center p-3">
          <img
            src={src}
            alt={alt ?? ""}
            {...(!alt ? { "aria-hidden": true as const } : {})}
            className="max-h-full max-w-full object-contain object-center"
            style={matteImgStyle}
          />
        </div>
      </>
    );
  }

  if (plain) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          src={src}
          alt={alt ?? ""}
          {...(!alt ? { "aria-hidden": true as const } : {})}
          className="max-h-full max-w-full object-contain object-center"
          style={matteImgStyle}
        />
      </div>
    );
  }

  return (
    <>
      {/* Ken Burns — imagem com pan + zoom contínuos */}
      <motion.div
        className="absolute inset-0"
        initial={reduceMotion ? false : { scale: 1, x: 0, y: 0 }}
        animate={
          reduceMotion
            ? undefined
            : {
                scale: [1.0, 1.06, 1.02, 1.05, 1.0],
                x: ['0%', '-1.5%', '0.5%', '-1%', '0%'],
                y: ['0%', '0.8%', '-0.5%', '1%', '0%'],
              }
        }
        transition={{
          duration: 28,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'mirror',
        }}
        style={{ willChange: 'transform' }}
      >
        <img
          src={src}
          alt={alt ?? ''}
          {...(!alt ? { 'aria-hidden': true as const } : {})}
          className="h-full w-full object-cover"
          style={{ filter: 'brightness(0.82) saturate(0.95)' }}
        />
      </motion.div>

      {/* Tint accent dinâmico (mais visível quando ativo) */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-overlay"
        initial={{ opacity: 0 }}
        animate={
          reduceMotion
            ? { opacity: active ? 0.3 : 0.15 }
            : {
                opacity: active ? [0.25, 0.42, 0.28, 0.4, 0.25] : 0.15,
              }
        }
        transition={{ duration: 9, ease: 'easeInOut', repeat: Infinity }}
        style={{
          background: `linear-gradient(135deg, ${accentColor}66 0%, transparent 55%, ${accentColor}33 100%)`,
        }}
      />

      {/* Gradiente de escurecimento (estável) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.55) 100%)',
        }}
      />

      {/* Vignette respirando */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        animate={
          reduceMotion
            ? { opacity: 1 }
            : { opacity: [0.7, 1, 0.85, 1, 0.7] }
        }
        transition={{ duration: 8.5, ease: 'easeInOut', repeat: Infinity }}
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.45) 95%)',
        }}
      />

      {/* Partículas de luz na cor accent */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {particleSeeds.map((p) => (
          <motion.span
            key={p.key}
            className="absolute rounded-full"
            initial={{
              x: `${p.x0}%`,
              y: `${p.y0}%`,
              opacity: 0,
              scale: 0.5,
            }}
            animate={
              reduceMotion
                ? { opacity: p.opacity * 0.4, scale: 1 }
                : {
                    x: [`${p.x0}%`, `${p.x1}%`, `${p.x2}%`, `${p.x0}%`],
                    y: [`${p.y0}%`, `${p.y1}%`, `${p.y2}%`, `${p.y0}%`],
                    opacity: [0, p.opacity, p.opacity * 0.6, p.opacity, 0],
                    scale: [0.5, 1, 0.85, 1.1, 0.5],
                  }
            }
            transition={{
              duration: p.duration,
              delay: p.delay,
              ease: 'easeInOut',
              repeat: Infinity,
            }}
            style={{
              width: p.size,
              height: p.size,
              background: accentColor,
              boxShadow: `0 0 ${p.size * 3}px ${accentColor}, 0 0 ${p.size * 6}px ${accentColor}88`,
              willChange: 'transform, opacity',
            }}
          />
        ))}
      </div>

      {/* Glow accent na borda inferior (overlay original do FloatingCard) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `linear-gradient(180deg, transparent 60%, ${accentColor}30 100%)`,
          opacity: active ? 1 : 0.6,
        }}
      />

      {/* Scan-line shimmer (acontece ocasionalmente) */}
      {!reduceMotion && active && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${accentColor}cc, transparent)`,
            boxShadow: `0 0 12px ${accentColor}`,
            top: '50%',
          }}
          animate={{ top: ['0%', '100%'], opacity: [0, 1, 1, 0] }}
          transition={{
            duration: 3.5,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatDelay: 7,
            times: [0, 0.1, 0.9, 1],
          }}
        />
      )}
    </>
  );
}
