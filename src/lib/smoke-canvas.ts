/** Canvas 2D volumetric smoke — soft wisps with trail persistence and smooth drift. */

export type SmokeEngineOptions = {
  reducedMotion: boolean;
  accent?: boolean;
  /** Skip extra lobes/filaments — cheaper draw path. */
  simple?: boolean;
};

type Wisp = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  phase: number;
  layer: 0 | 1 | 2;
  rot: number;
  stretch: number;
};

const WISP_COUNT_DESKTOP = 36;
const WISP_COUNT_MOBILE = 22;
const WISP_COUNT_ACCENT_DESKTOP = 6;
const WISP_COUNT_ACCENT_MOBILE = 4;
const HAZE_COUNT = 5;
const ACCENT_OPACITY_SCALE = 0.22;
/** Fade prior frame via alpha erosion — avoids painting black (gray veil over page). */
const FADE_ALPHA_ACCENT = 0.05;
const FADE_ALPHA_FULL = 0.032;

function wispCount(width: number, accent?: boolean): number {
  if (accent) {
    return width < 640 ? WISP_COUNT_ACCENT_MOBILE : WISP_COUNT_ACCENT_DESKTOP;
  }
  return width < 640 ? WISP_COUNT_MOBILE : WISP_COUNT_DESKTOP;
}

function hash(n: number): number {
  const x = Math.sin(n * 127.1 + n * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function layerFromSeed(i: number): 0 | 1 | 2 {
  const h = hash(i * 3.1);
  if (h > 0.68) return 2;
  if (h > 0.38) return 1;
  return 0;
}

const LAYER_SCALE = [1.22, 1, 0.82] as const;
const LAYER_OPACITY = [0.72, 1, 1.28] as const;
const LAYER_SPEED = [0.62, 1, 1.18] as const;

function createWisps(width: number, height: number, count: number, accent?: boolean): Wisp[] {
  const minDim = Math.min(width, height);
  const wisps: Wisp[] = [];

  for (let i = 0; i < count; i++) {
    const layer = layerFromSeed(i);
    const baseR = 0.12 + hash(i * 7.3) * 0.28;
    const layerMul = LAYER_SCALE[layer];
    wisps.push({
      x: hash(i * 1.9) * width,
      y: height * (0.35 + hash(i * 2.7) * 0.55),
      vx: (hash(i * 4.2) - 0.5) * 0.0045 * LAYER_SPEED[layer],
      vy: (-0.006 - hash(i * 5.8) * 0.009) * LAYER_SPEED[layer],
      radius: minDim * baseR * layerMul * (0.88 + hash(i * 11.3) * 0.24),
      opacity: (0.052 + hash(i * 6.4) * 0.078) * LAYER_OPACITY[layer],
      phase: hash(i * 8.1) * Math.PI * 2,
      layer,
      rot: hash(i * 9.2) * Math.PI * 2,
      stretch: 1.35 + hash(i * 10.4) * 0.65,
    });
  }

  if (accent) {
    return wisps;
  }

  for (let h = 0; h < HAZE_COUNT; h++) {
    const layer = h < 2 ? 0 : 1;
    wisps.push({
      x: width * (0.2 + hash(h * 2.1) * 0.6),
      y: height * (0.2 + hash(h * 3.3) * 0.65),
      vx: (hash(h * 4.4) - 0.5) * 0.003,
      vy: -0.005 - hash(h * 5.1) * 0.006,
      radius: minDim * (0.38 + hash(h * 6.2) * 0.22),
      opacity: 0.038 + hash(h * 7.1) * 0.032,
      phase: hash(h * 8.4) * Math.PI * 2,
      layer,
      rot: hash(h * 9.5) * Math.PI * 2,
      stretch: 1.7 + hash(h * 10.1) * 0.4,
    });
  }

  return wisps;
}

function turbulence(w: Wisp, time: number, width: number, height: number): { dx: number; dy: number } {
  const slow = time * 0.00012;
  const p = w.phase;
  const amp = w.layer === 0 ? 1.1 : w.layer === 1 ? 1 : 0.88;

  const dx =
    (Math.sin(slow * 0.7 + p) * width * 0.00055 +
      Math.sin(slow * 0.31 + p * 1.4) * width * 0.00028) *
    amp;

  const dy =
    (-height * 0.00028 +
      Math.sin(slow * 0.45 + p * 0.85) * height * 0.00026 +
      Math.cos(slow * 0.18 + p * 1.9) * height * 0.00014) *
    amp;

  return { dx, dy };
}

function addSoftStops(grad: CanvasGradient, peak: number, bright: number): void {
  const b = bright;
  grad.addColorStop(0, `rgba(${b}, ${b}, ${b + 6}, ${peak * 0.68})`);
  grad.addColorStop(0.12, `rgba(${b - 18}, ${b - 18}, ${b - 12}, ${peak * 0.48})`);
  grad.addColorStop(0.28, `rgba(${b - 42}, ${b - 42}, ${b - 36}, ${peak * 0.28})`);
  grad.addColorStop(0.46, `rgba(${b - 72}, ${b - 72}, ${b - 64}, ${peak * 0.14})`);
  grad.addColorStop(0.64, `rgba(${b - 98}, ${b - 98}, ${b - 90}, ${peak * 0.05})`);
  grad.addColorStop(0.82, `rgba(${b - 118}, ${b - 118}, ${b - 110}, ${peak * 0.012})`);
  grad.addColorStop(1, "rgba(0, 0, 0, 0)");
}

function drawWisp(
  ctx: CanvasRenderingContext2D,
  w: Wisp,
  width: number,
  height: number,
  time: number,
  motionScale: number,
  opacityScale = 1,
  simple = false,
): void {
  const { dx, dy } = turbulence(w, time * motionScale, width, height);
  const cx = w.x + dx;
  const cy = w.y + dy;

  const breathe = 1 + Math.sin(time * 0.00012 + w.phase) * 0.06;
  const stretch = w.stretch * breathe;
  const rx = w.radius * stretch;
  const ry = w.radius * (0.42 + w.layer * 0.05 + Math.sin(w.phase) * 0.03);

  const peak = w.opacity * (w.layer === 2 ? 1.12 : w.layer === 1 ? 1 : 0.88) * opacityScale;
  const bright = w.layer === 2 ? 238 : w.layer === 1 ? 228 : 218;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(w.rot + time * 0.000014 * (w.layer === 2 ? 0.9 : w.layer === 0 ? -0.4 : 0.55));

  const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
  addSoftStops(grad, peak, bright);
  ctx.globalAlpha = 1;
  ctx.fillStyle = grad;
  ctx.scale(1, ry / rx);
  ctx.beginPath();
  ctx.arc(0, 0, rx, 0, Math.PI * 2);
  ctx.fill();

  if (!simple) {
    const lobeAngle = w.phase + time * 0.000012 * motionScale;
    const lobeX = rx * (0.28 + Math.sin(lobeAngle) * 0.14);
    const lobeY = -ry * (0.22 + Math.cos(lobeAngle * 0.65) * 0.1);
    const lobeR = rx * (0.5 + hash(w.phase) * 0.1);
    const lobeGrad = ctx.createRadialGradient(lobeX, lobeY, 0, lobeX, lobeY, lobeR);
    addSoftStops(lobeGrad, peak * 0.5, bright - 8);
    ctx.fillStyle = lobeGrad;
    ctx.beginPath();
    ctx.arc(lobeX, lobeY, lobeR, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function updateWisps(wisps: Wisp[], width: number, height: number, dt: number, motionScale: number): void {
  const margin = 120;

  for (const w of wisps) {
    w.x += w.vx * dt * motionScale;
    w.y += w.vy * dt * motionScale;

    if (w.x < -margin) w.x = width + margin * 0.4;
    if (w.x > width + margin) w.x = -margin * 0.4;
    if (w.y < -margin) w.y = height + margin * 0.25;
    if (w.y > height + margin) w.y = -margin * 0.15;
  }
}

export type SmokeEngine = {
  resize: (width: number, height: number, dpr: number) => void;
  draw: (time: number, motionScale?: number) => void;
  tick: (dt: number, motionScale?: number) => void;
  destroy: () => void;
};

export function createSmokeEngine(
  canvas: HTMLCanvasElement,
  options: SmokeEngineOptions,
): SmokeEngine {
  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) {
    return {
      resize: () => {},
      draw: () => {},
      tick: () => {},
      destroy: () => {},
    };
  }

  let wisps: Wisp[] = [];
  let width = 0;
  let height = 0;

  const resize = (w: number, h: number, devicePixelRatio: number) => {
    width = w;
    height = h;
    const dpr = Math.min(devicePixelRatio, 2);
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    wisps = createWisps(w, h, wispCount(w, options.accent), options.accent);
    ctx.clearRect(0, 0, width, height);
  };

  const opacityScale = options.accent ? ACCENT_OPACITY_SCALE : 1;
  const fadeAlpha = options.accent ? FADE_ALPHA_ACCENT : FADE_ALPHA_FULL;
  const simpleDraw = options.simple ?? false;

  const drawFrame = (time: number, motionScale = 1) => {
    if (!width || !height) return;

    /* Accent overlay: no trail — prevents gray buildup sampled by backdrop-filter */
    if (options.accent) {
      ctx.clearRect(0, 0, width, height);
    } else {
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = `rgba(0, 0, 0, ${fadeAlpha})`;
      ctx.fillRect(0, 0, width, height);
    }

    ctx.globalCompositeOperation = "lighter";
    for (let layer = 0; layer <= 2; layer++) {
      for (const w of wisps) {
        if (w.layer === layer) {
          drawWisp(ctx, w, width, height, time, motionScale, opacityScale, simpleDraw);
        }
      }
    }

    ctx.globalCompositeOperation = "source-over";
  };

  const draw = (time: number, motionScale = 1) => drawFrame(time, motionScale);

  const tick = (dt: number, motionScale = 1) => {
    if (!options.reducedMotion) {
      updateWisps(wisps, width, height, dt, motionScale);
    }
  };

  return {
    resize,
    draw,
    tick,
    destroy: () => {
      wisps = [];
    },
  };
}
