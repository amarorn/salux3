import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Reveal ao scroll (GSAP + ScrollTrigger): opacidade, deslocamento e blur.
 */
export function bindRevealOnScroll(element: HTMLElement | null): () => void {
  if (!element) {
    return () => {};
  }

  const ctx = gsap.context(() => {
    gsap.fromTo(
      element,
      { opacity: 0, y: 56, filter: 'blur(14px)' },
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 1.05,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 84%',
          toggleActions: 'play none none reverse',
        },
      },
    );
  }, element);

  return () => ctx.revert();
}
