/** Limiar para reduzir efeitos WebGL em telemóveis / tablets estreitos. */
export function isMobileViewport(width?: number): boolean {
  const w = width ?? (typeof window !== 'undefined' ? window.innerWidth : 1024);
  return w < 768;
}
