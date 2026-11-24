import * as THREE from './lib/three.module.js';
import { RoundedBoxGeometry } from './lib/RoundedBoxGeometry.js';

const vert = `
varying vec3 vN;
varying vec3 vEye;
void main() {
  vec4 wp = modelMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * viewMatrix * wp;
  vN = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
  vEye = normalize(wp.xyz - cameraPosition);
}`;

const frag = `
precision highp float;
uniform sampler2D uTexture;
uniform vec2 uRes;
uniform float uIor[6];
uniform float uDisp;
uniform float uRefract, uChroma, uSat, uFresnelPow, uFresnelAmt, uShine, uDiffuse, uSpecAmt, uFront;
uniform vec3 uLight;
varying vec3 vN;
varying vec3 vEye;
const int LOOP = 16;

vec3 sat(vec3 c, float a) { return mix(vec3(dot(c, vec3(0.2125, 0.7154, 0.0721))), c, a); }
vec3 tap(vec2 uv, vec3 n, float ior, float k) { return texture2D(uTexture, uv + refract(vEye, n, 1.0 / mix(1.185, ior, uDisp)).xy * k).rgb; }

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec3 n = normalize(vN);
  vec3 col = vec3(0.0);
  for (int i = 0; i < LOOP; i++) {
    float k = (uRefract + float(i) / float(LOOP) * 0.1 * uDisp) * uChroma;
    vec3 tr = tap(uv, n, uIor[0], k), ty = tap(uv, n, uIor[1], k), tg = tap(uv, n, uIor[2], k);
    vec3 tc = tap(uv, n, uIor[3], k), tb = tap(uv, n, uIor[4], k), tp = tap(uv, n, uIor[5], k);
    float r = tr.r * 0.5, g = tg.g * 0.5, b = tb.b * 0.5;
    float y = (ty.r * 2.0 + ty.g * 2.0 - ty.b) / 6.0;
    float c = (tc.g * 2.0 + tc.b * 2.0 - tc.r) / 6.0;
    float p = (tp.b * 2.0 + tp.r * 2.0 - tp.g) / 6.0;
    col += sat(vec3(r + (2.0 * p + 2.0 * y - c) / 3.0, g + (2.0 * y + 2.0 * c - p) / 3.0, b + (2.0 * c + 2.0 * p - y) / 3.0), uSat);
  }
  col /= float(LOOP);
  vec3 L = normalize(-uLight);
  vec3 H = normalize(vEye + L);
  float nh = dot(n, H);
  col += uFront * (pow(nh * nh, uShine) + max(0.0, dot(n, L)) * uDiffuse) * uSpecAmt;
  col += uFront * pow(1.0 - abs(dot(vEye, n)), uFresnelPow) * uFresnelAmt;
  gl_FragColor = vec4(col, 1.0);
}`;

export function createGlass(canvas, W, H, { size = 1.6, fov = 32 } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(1);
  renderer.setSize(W, H, false);
  renderer.autoClear = false;
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;

  const rtOpts = { type: THREE.HalfFloatType, colorSpace: THREE.NoColorSpace, depthBuffer: true };
  const mainRT = new THREE.WebGLRenderTarget(W, H, rtOpts);
  const backRT = new THREE.WebGLRenderTarget(W, H, rtOpts);

  const bgTex = new THREE.Texture();
  bgTex.colorSpace = THREE.NoColorSpace;
  bgTex.minFilter = THREE.LinearFilter;
  bgTex.generateMipmaps = false;
  const bgScene = new THREE.Scene();
  const ortho = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  bgScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.MeshBasicMaterial({ map: bgTex, depthTest: false, depthWrite: false })));

  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(fov, W / H, 0.1, 100);
  cam.position.set(0, 0, 7);
  const uniforms = {
    uTexture: { value: null },
    uRes: { value: new THREE.Vector2(W, H) },
    uIor: { value: [1.15, 1.16, 1.18, 1.19, 1.21, 1.22] },
    uRefract: { value: 0.22 },
    uDisp: { value: 1 },
    uChroma: { value: 0.4 },
    uSat: { value: 1.04 },
    uFresnelPow: { value: 9.0 },
    uFresnelAmt: { value: 0.14 },
    uShine: { value: 90.0 },
    uDiffuse: { value: 0.05 },
    uSpecAmt: { value: 0.2 },
    uFront: { value: 1 },
    uLight: { value: new THREE.Vector3(-1.0, 1.0, 1.0) },
  };
  const mat = new THREE.ShaderMaterial({ vertexShader: vert, fragmentShader: frag, uniforms });
  const cube = new THREE.Mesh(new RoundedBoxGeometry(size, size, size, 10, size * 0.12), mat);
  scene.add(cube);

  const pass = (target, tex, side) => {
    renderer.setRenderTarget(target);
    renderer.clear();
    renderer.render(bgScene, ortho);
    if (tex) {
      uniforms.uTexture.value = tex;
      mat.side = side;
      uniforms.uFront.value = side === THREE.FrontSide ? 1 : 0;
      renderer.clearDepth();
      renderer.render(scene, cam);
    }
  };

  return {
    renderer,
    compile: () => renderer.compileAsync(scene, cam),
    setBackground(src) {
      bgTex.image = src;
      bgTex.needsUpdate = true;
    },
    render({ rx, ry, rz, x = 0, y = 0, s = 1, show = true, disp = 1 }) {
      uniforms.uDisp.value = disp;
      cube.rotation.set(rx, ry, rz);
      cube.position.set(x, y, 0);
      cube.scale.setScalar(Math.max(s, 1e-4));
      if (!show || s <= 0.001) return pass(null, null);
      pass(mainRT, null);
      pass(backRT, mainRT.texture, THREE.BackSide);
      pass(null, backRT.texture, THREE.FrontSide);
    },
    worldToPx(px, py) {
      const h = 2 * Math.tan(THREE.MathUtils.degToRad(fov / 2)) * cam.position.z;
      return { x: (px / W - 0.5) * h * (W / H), y: -(py / H - 0.5) * h };
    },
  };
}
