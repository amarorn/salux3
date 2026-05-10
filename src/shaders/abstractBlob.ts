/** Vertex: onda orgânica + atracção em direção ao rato + distorção quando o cursor se move rápido. */
export const abstractBlobVertex = /* glsl */ `
uniform float uTime;
uniform vec2 uMouse;
uniform float uWarp;

varying vec3 vNorm;
varying vec3 vView;

void main() {
  vec3 pos = position;

  float t = uTime * 0.45;
  float wave =
    sin(pos.x * 2.4 + t) * cos(pos.y * 2.1 + t * 0.8) * 0.5 +
    sin(pos.z * 2.0 - t * 0.6) * 0.35;
  float wave2 =
    sin(pos.x * 3.2 + t * 1.05) * sin(pos.y * 2.75 - t * 0.88) * 0.13 +
    cos(pos.z * 2.6 + t * 0.4) * 0.08;
  float ripple = sin(dot(pos.xy, uMouse) * 2.6 + t * 1.2) * 0.07 * length(uMouse);

  float mouseInfl = clamp(length(uMouse) * 1.4, 0.0, 1.0);

  vec3 rawMagnet = vec3(uMouse.x * 1.35, uMouse.y * 1.1, sin(t * 0.35) * 0.32);
  vec3 magnet = normalize(rawMagnet + vec3(0.0001));
  pos += magnet * mouseInfl * 0.42 * (0.35 + wave * 0.5);
  pos += normalize(magnet + normal * 0.4) * wave2 * (0.24 + uWarp * 0.2);
  pos += normal * ripple * (0.4 + uWarp * 0.5);

  float disp = (wave + wave2) * (0.2 + mouseInfl * 0.22 + uWarp * 0.32);
  pos += normal * disp;

  float twist = dot(pos, magnet) * uMouse.x * mouseInfl * 0.045;
  pos.x += twist;
  pos.y -= twist * 0.72;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  vNorm = normalize(normalMatrix * normal);
  vView = -mvPosition.xyz;
  gl_Position = projectionMatrix * mvPosition;
}
`;

export const abstractBlobFragment = /* glsl */ `
uniform float uTime;
uniform vec3 uColorCore;
uniform vec3 uColorEdge;

varying vec3 vNorm;
varying vec3 vView;

void main() {
  float fr = pow(1.0 - max(dot(normalize(vNorm), normalize(vView)), 0.0), 2.6);
  float pulse = 0.5 + 0.5 * sin(uTime * 0.55);
  vec3 col = mix(uColorCore, uColorEdge, fr + pulse * 0.06);
  gl_FragColor = vec4(col, 0.94);
}
`;
