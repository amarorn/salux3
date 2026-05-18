import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Reveal ao scroll (GSAP + ScrollTrigger): opacidade e deslocamento.
 */
export function bindRevealOnScroll(element: HTMLElement | null): () => void {
  if (!element) {
    return () => {};
  }

  const ctx = gsap.context(() => {
    gsap.fromTo(
      element,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 88%',
          toggleActions: 'play none none reverse',
        },
      },
    );
  }, element);

  return () => ctx.revert();
}
