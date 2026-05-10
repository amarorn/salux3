import { useMemo } from 'react';
import { LANDING_SHOWCASE_URLS } from '@/config/assetUrls';

const SHOWCASE_IMAGES = LANDING_SHOWCASE_URLS;

const CARD_COUNT = 3;

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function buildShowcaseCards() {
  return Array.from({ length: CARD_COUNT }, (_, i) => ({
    src: SHOWCASE_IMAGES[i]!,
    objectPosition: `${rand(14, 86).toFixed(1)}% ${rand(10, 90).toFixed(1)}%`,
    zoom: rand(1.04, 1.14),
  }));
}

export function LandingShowcaseCards() {
  const cards = useMemo(() => buildShowcaseCards(), []);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((card, i) => (
        <article
          key={`showcase-${i}`}
          className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a0d14] shadow-[0_0_0_1px_rgba(255,255,255,0.04)] transition-[box-shadow,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-white/[0.14] hover:shadow-[0_24px_48px_-24px_rgba(124,58,237,0.35)]"
        >
          <div className="absolute inset-0 overflow-hidden">
            <div className="h-full w-full origin-center transition-transform duration-[680ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.045]">
              <img
                src={card.src}
                alt=""
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
                style={{
                  objectPosition: card.objectPosition,
                  transform: `scale(${card.zoom})`,
                }}
              />
            </div>
          </div>
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#05070d]/85 via-transparent to-[#05070d]/25 opacity-90 transition-opacity duration-500 group-hover:opacity-100"
            aria-hidden
          />
        </article>
      ))}
    </div>
  );
}
