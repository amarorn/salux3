/** Interpolação linear escalar. */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Lerp 2D para pontos normalizados ou pixels. */
export function lerp2(
  ax: number,
  ay: number,
  bx: number,
  by: number,
  t: number,
): [number, number] {
  return [lerp(ax, bx, t), lerp(ay, by, t)];
}
