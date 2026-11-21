/*
  Original ASCII scenes for the portfolio (all procedural; the rocket is sampled from the
  Blender render in public/images/rocket-hero.webp).

  - auroraLaunch: night sky with aurora curtains over two mountain ranges and a still lake;
    a rocket waits on a launch tower on the right shore and lifts off as you scroll the hero.
  - liftoff: dusk above a sea of clouds; the rocket climbs out of the clouds as you scroll.
  - field: a quiet dotted field that ripples around the pointer (section background).
*/
import { CellSprite, G, Grid, RGB, clamp01, fbm, hash2, mixc, noise2, rgb, sampleImage, smooth } from "./engine.ts";
import type { SceneFactory } from "./AsciiCanvas.tsx";

const C = {
  void: rgb("#070b16"),
  night: rgb("#0c1426"),
  navy: rgb("#111d36"),
  dusk: rgb("#182848"),
  slate: rgb("#2f4570"),
  slate2: rgb("#405887"),
  steel: rgb("#566e9e"),
  mist: rgb("#9aabcf"),
  snow: rgb("#dde3ef"),
  white: rgb("#f7f9ff"),
  g1: rgb("#156c48"),
  g2: rgb("#35bf6c"),
  g3: rgb("#74eb9b"),
  g4: rgb("#c2fbd6"),
  teal: rgb("#27ab9c"),
  teal2: rgb("#79e3d3"),
  v1: rgb("#3c2670"),
  v2: rgb("#5f3896"),
  v3: rgb("#8a52c0"),
  v4: rgb("#b985e0"),
  rose: rgb("#ff5c9a"),
  rose2: rgb("#ffa6c8"),
  wine: rgb("#7a1f34"),
  ember: rgb("#c8611c"),
  amber: rgb("#ffa743"),
  gold: rgb("#ffd27a"),
  cream: rgb("#fff3cf")
};

const lum = (r: number, g: number, b: number) => 0.299 * r + 0.587 * g + 0.114 * b;

/** Fallback rocket if the image can't load: a white capsule with a pink nose and fins. */
function syntheticRocket(w: number, h: number): CellSprite {
  const n = w * h;
  const sp: CellSprite = { w, h, r: new Float32Array(n), g: new Float32Array(n), b: new Float32Array(n), a: new Float32Array(n) };
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const u = (x + 0.5) / w - 0.5;
      const v = (y + 0.5) / h;
      const half = v < 0.3 ? 0.32 * Math.sqrt(v / 0.3) : v < 0.85 ? 0.32 : 0.32 - (v - 0.85) * 0.8;
      const fin = v > 0.62 && v < 0.96 && Math.abs(u) < 0.5 && Math.abs(u) > 0.25;
      const i = y * w + x;
      if (Math.abs(u) < half || fin) {
        const col = v < 0.28 || fin ? C.rose : Math.abs(v - 0.45) < 0.05 && Math.abs(u) < 0.12 ? C.teal2 : C.white;
        sp.r[i] = col[0];
        sp.g[i] = col[1];
        sp.b[i] = col[2];
        sp.a[i] = 1;
      }
    }
  }
  return sp;
}

function rocketSprite(img: HTMLImageElement | undefined, h: number): CellSprite {
  const w = Math.max(3, Math.round(h * (434 / 1100)));
  return img ? sampleImage(img, w, h) : syntheticRocket(w, h);
}

/** Paint a sprite with its bottom-centre at (cx, bottom). Returns nothing; clips to the grid. */
function drawSprite(grid: Grid, sp: CellSprite, cx: number, bottom: number, shade = 1) {
  const x0 = Math.round(cx - sp.w / 2);
  const y0 = Math.round(bottom - sp.h);
  for (let sy = 0; sy < sp.h; sy++) {
    const y = y0 + sy;
    if (y < 0 || y >= grid.rows) continue;
    for (let sx = 0; sx < sp.w; sx++) {
      const x = x0 + sx;
      if (x < 0 || x >= grid.cols) continue;
      const k = sy * sp.w + sx;
      const a = sp.a[k];
      if (a < 0.35) continue;
      const r = sp.r[k], g = sp.g[k], b = sp.b[k];
      grid.set(y * grid.cols + x, r * shade, g * shade, b * shade, clamp01((0.4 + 0.65 * lum(r, g, b)) * a * shade));
    }
  }
}

/** Flame under a nozzle: hot core to rose edges, flickering. */
function drawFlame(grid: Grid, cx: number, top: number, width: number, length: number, t: number) {
  for (let dy = 0; dy < length; dy++) {
    const y = Math.round(top + dy);
    if (y < 0 || y >= grid.rows) continue;
    const k = dy / length;
    const half = width * (1 - k * 0.85) * 0.5;
    for (let x = Math.floor(cx - half - 1); x <= Math.ceil(cx + half + 1); x++) {
      if (x < 0 || x >= grid.cols) continue;
      const e = Math.abs(x + 0.5 - cx) / (half + 0.5);
      if (e > 1) continue;
      const flick = noise2(x * 0.7, (y - t * 30) * 0.5);
      const heat = (1 - k) * (1 - e * 0.7) * (0.65 + 0.5 * flick);
      if (heat < 0.18) continue;
      const col = heat > 0.75 ? C.cream : heat > 0.55 ? C.gold : heat > 0.38 ? C.amber : C.rose;
      grid.set(y * grid.cols + x, col[0], col[1], col[2], clamp01(heat + 0.25));
    }
  }
}

/** Billowing smoke: a column from the nozzle down to `ground`, spreading as it sinks. */
function drawSmoke(grid: Grid, cx: number, from: number, ground: number, spread: number, amount: number, t: number, tint: RGB = C.snow) {
  if (amount <= 0.01) return;
  const yTop = Math.max(0, Math.floor(from));
  const yBot = Math.min(grid.rows - 1, Math.ceil(ground));
  for (let y = yTop; y <= yBot; y++) {
    const d = y - from;
    const nearGround = smooth(ground - 8, ground, y);
    const half = 1.5 + d * 0.22 + nearGround * spread;
    for (let x = Math.floor(cx - half); x <= Math.ceil(cx + half); x++) {
      if (x < 0 || x >= grid.cols) continue;
      const e = Math.abs(x - cx) / half;
      if (e > 1) continue;
      const n = fbm(x * 0.16 + t * 0.15, y * 0.2 + t * 0.6, 3);
      const dens = (n * 1.4 - 0.25) * (1 - e * e) * amount;
      if (dens < 0.12) continue;
      const i = y * grid.cols + x;
      const col = mixc(C.mist, tint, clamp01(n * 1.3 - 0.2));
      grid.set(i, col[0], col[1], col[2], clamp01(dens + 0.2));
    }
  }
}

/* ───────────────────────────── aurora launch (hero) ───────────────────────────── */

export const auroraLaunch: SceneFactory = ({ cols: W, rows: H, images, narrow }) => {
  const WL = Math.round(H * (narrow ? 0.84 : 0.72)); // waterline
  const mh = narrow ? 0.55 : 1; // mountain height scale (phones keep the land low, under the copy)
  const padX = Math.round(W * (narrow ? 0.7 : 0.78));
  const rocket = rocketSprite(images.rocket, Math.max(10, Math.round(H * (narrow ? 0.17 : 0.3))));
  const padHalf = Math.round(rocket.w * 1.6 + 6);

  // Static land: mountains, shore, tower. Stored once; copied in every frame.
  const land = new Grid(W, H);
  const isLand = new Uint8Array(W * H);
  const farTop = new Float32Array(W);
  const nearTop = new Float32Array(W);
  for (let x = 0; x < W; x++) {
    farTop[x] = WL - (H * 0.12 + Math.pow(fbm(x * 0.03, 1.3, 4), 1.3) * H * 0.42) * mh;
    const flat = smooth(padHalf + 6, padHalf - 2, Math.abs(x - padX)); // flatten near the pad
    const peak = (H * 0.03 + Math.pow(fbm(x * 0.045 + 9, 4.1, 4), 1.7) * H * 0.38) * mh;
    nearTop[x] = WL - (peak * (1 - flat) + 1.5 * flat);
  }
  for (let x = 0; x < W; x++) {
    const slopeF = farTop[Math.min(W - 1, x + 1)] - farTop[Math.max(0, x - 1)];
    const slopeN = nearTop[Math.min(W - 1, x + 1)] - nearTop[Math.max(0, x - 1)];
    for (let y = 0; y < WL; y++) {
      const i = y * W + x;
      if (y >= nearTop[x]) {
        const depth = y - nearTop[x];
        const snowLine = 1.5 + noise2(x * 0.3, 5) * 2.5;
        const high = nearTop[x] < WL - H * 0.16;
        const lit = slopeN > 0 ? 0.12 : 0;
        if (high && depth < snowLine) land.set(i, C.mist[0], C.mist[1], C.mist[2], 0.55 + lit);
        else {
          const c = mixc(C.navy, C.dusk, noise2(x * 0.2, y * 0.2));
          land.set(i, c[0], c[1], c[2], 0.42 + lit + noise2(x * 0.5, y * 0.5) * 0.12);
        }
        isLand[i] = 2;
      } else if (y >= farTop[x]) {
        const depth = y - farTop[x];
        const snowLine = 2 + noise2(x * 0.25, 1) * 4;
        const lit = slopeF > 0 ? 0.14 : 0;
        if (depth < snowLine && farTop[x] < WL - H * 0.3) land.set(i, C.snow[0], C.snow[1], C.snow[2], 0.62 + lit);
        else {
          const c = mixc(C.slate, C.slate2, noise2(x * 0.15, y * 0.15) + lit);
          land.set(i, c[0], c[1], c[2], 0.3 + lit + noise2(x * 0.4, y * 0.4) * 0.12);
        }
        isLand[i] = 1;
      }
    }
  }
  // Launch tower: a lattice column to the left of the pad, with arms reaching the rocket.
  const towerX = padX - Math.round(rocket.w / 2) - 3;
  const towerTop = WL - 1 - Math.round(rocket.h * 1.05);
  for (let y = towerTop; y < WL; y++) {
    for (const [dx, ch] of [
      [0, "|"],
      [1, y % 2 ? "\\" : "/"],
      [2, "|"]
    ] as const) {
      const x = towerX - 1 + dx;
      if (x < 0 || x >= W || y < 0) continue;
      land.glyph(y * W + x, G[ch], C.steel[0], C.steel[1], C.steel[2]);
      isLand[y * W + x] = 3;
    }
  }
  for (const arm of [0.3, 0.62]) {
    const y = WL - 1 - Math.round(rocket.h * arm);
    for (let x = towerX + 2; x < padX - rocket.w / 2 + 1; x++) {
      if (x >= 0 && x < W && y >= 0) {
        land.glyph(y * W + x, G["="], C.steel[0], C.steel[1], C.steel[2]);
        isLand[y * W + x] = 3;
      }
    }
  }
  // Pad deck
  for (let x = padX - padHalf; x <= padX + padHalf; x++) {
    if (x < 0 || x >= W) continue;
    land.glyph((WL - 1) * W + x, G["="], C.mist[0], C.mist[1], C.mist[2]);
    isLand[(WL - 1) * W + x] = 3;
  }
  const lamps = [
    [towerX, towerTop - 1],
    [padX - padHalf, WL - 2],
    [padX + padHalf, WL - 2]
  ];

  // Stars
  const stars: number[] = [];
  for (let y = 0; y < WL - 2; y++) for (let x = 0; x < W; x++) if (hash2(x, y) < 0.011) stars.push(y * W + x);

  // Per-column aurora parameters (filled per frame).
  const edge = new Float32Array(W);
  const height = new Float32Array(W);
  const amp = new Float32Array(W);
  const edge2 = new Float32Array(W);
  const amp2 = new Float32Array(W);

  return {
    draw(grid, t, { progress }) {
      const lift = Math.pow(smooth(0.04, 0.95, progress), 1.7);
      const alt = lift * (WL + rocket.h + 4);
      const rocketBottom = WL - 1 - alt;

      for (let x = 0; x < W; x++) {
        edge[x] = H * 0.3 + (fbm(x * 0.012 + t * 0.03, t * 0.02, 3) - 0.5) * H * 0.34;
        height[x] = H * (0.1 + 0.22 * noise2(x * 0.05 + t * 0.12, 2.2));
        amp[x] = smooth(0.32, 0.68, fbm(x * 0.018 - t * 0.05, 7.7, 3));
        edge2[x] = H * 0.16 + (fbm(x * 0.02 - t * 0.025, 3.3, 3) - 0.5) * H * 0.2;
        amp2[x] = smooth(0.45, 0.75, fbm(x * 0.025 + t * 0.04, 11.1, 3)) * 0.7;
      }

      // Sky, aurora, land
      for (let y = 0; y < WL; y++) {
        const sky = mixc(C.void, C.navy, y / WL);
        const skyV = 0.07 + 0.09 * (y / WL);
        for (let x = 0; x < W; x++) {
          const i = y * W + x;
          if (isLand[i]) {
            grid.r[i] = land.r[i];
            grid.g[i] = land.g[i];
            grid.b[i] = land.b[i];
            grid.v[i] = land.v[i];
            grid.gl[i] = land.gl[i];
            continue;
          }
          let r = sky[0], g = sky[1], b = sky[2], v = skyV;
          // main curtain: bright lower edge, rays fading upward, soft glow below
          const d = edge[x] - y; // >0 above the edge
          let A = 0;
          let k = 0;
          if (d >= 0 && d < height[x]) {
            k = d / height[x];
            const ray = 0.5 + 0.5 * noise2(x * 0.32 + t * 0.5, y * 0.05 - t * 0.2);
            A = Math.pow(1 - k, 1.4) * ray;
          } else if (d < 0) A = Math.exp(-(d * d) / 3) * 0.7;
          A *= amp[x];
          // second, higher and more violet curtain
          const d2 = edge2[x] - y;
          let A2 = 0;
          if (d2 >= 0 && d2 < H * 0.12) A2 = Math.pow(1 - d2 / (H * 0.12), 1.6) * (0.5 + 0.5 * noise2(x * 0.4 - t * 0.4, 1.7));
          else if (d2 < 0) A2 = Math.exp(-(d2 * d2) / 2.5) * 0.5;
          A2 *= amp2[x];
          if (A > 0.04 || A2 > 0.04) {
            let col: RGB;
            if (A >= A2) col = k < 0.18 ? mixc(C.g3, C.g4, clamp01(A - 0.5)) : k < 0.55 ? mixc(C.g2, C.teal, (k - 0.18) / 0.37) : mixc(C.teal, C.v3, (k - 0.55) / 0.45);
            else col = mixc(C.v3, C.v4, A2);
            const a = Math.max(A, A2);
            const m = clamp01(a * 1.3);
            r = r + (col[0] - r) * m;
            g = g + (col[1] - g) * m;
            b = b + (col[2] - b) * m;
            v = Math.max(v, a * 0.95);
          }
          grid.r[i] = r;
          grid.g[i] = g;
          grid.b[i] = b;
          grid.v[i] = v;
          grid.gl[i] = -1;
        }
      }

      // Stars twinkle where the aurora is faint
      for (const i of stars) {
        if (grid.v[i] > 0.3) continue;
        const tw = 0.5 + 0.5 * Math.sin(t * 1.7 + (i % 97));
        if (tw < 0.25) continue;
        const big = hash2(i, 7) > 0.88 && tw > 0.8;
        grid.glyph(i, big ? G["+"] : G["·"], C.mist[0] * tw + 0.2, C.mist[1] * tw + 0.2, C.mist[2] * tw + 0.25);
      }

      // Lamps blink
      lamps.forEach(([lx, ly], k) => {
        if (lx < 0 || lx >= W || ly < 0 || ly >= H) return;
        const on = Math.sin(t * 3 + k * 2) > -0.3;
        grid.glyph(ly * W + lx, G["•"], on ? C.gold[0] : C.ember[0], on ? C.gold[1] : C.ember[1], on ? C.gold[2] : C.ember[2]);
      });

      // Smoke on the pad, the flame and the rocket
      if (lift > 0.002) {
        drawSmoke(grid, padX, rocketBottom + rocket.h * 0.05, WL - 1, padHalf * 1.2, smooth(0, 0.25, lift) * (1 - smooth(0.7, 1, lift) * 0.6), t);
        drawFlame(grid, padX, rocketBottom - 0.5, rocket.w * 0.5, rocket.h * (0.32 + 0.06 * Math.sin(t * 22)), t);
      }
      drawSprite(grid, rocket, padX, rocketBottom);

      // Water: a rippled, darker mirror of everything above the waterline
      for (let y = WL; y < H; y++) {
        const dy = y - WL;
        const srcY = WL - 1 - Math.round(dy * 1.15);
        const wob = 0.6 + dy * 0.09;
        for (let x = 0; x < W; x++) {
          const i = y * W + x;
          if (srcY < 0) {
            grid.set(i, C.night[0], C.night[1], C.night[2], 0.05);
            continue;
          }
          const sx = Math.min(W - 1, Math.max(0, x + Math.round(Math.sin(dy * 0.9 + t * 1.6 + x * 0.04) * wob)));
          const s = srcY * W + sx;
          const broken = noise2(x * 0.22, dy * 1.3 + t * 0.8) < 0.32 ? 0.35 : 1;
          const fade = 0.62 - dy / (H - WL) * 0.2;
          grid.set(i, grid.r[s] * 0.7 + 0.02, grid.g[s] * 0.72 + 0.03, grid.b[s] * 0.78 + 0.06, Math.max(0.05, grid.v[s] * fade * broken));
        }
      }
    }
  };
};

/* ───────────────────────────── liftoff above the clouds (launch section) ───────────────────────────── */

export const liftoff: SceneFactory = ({ cols: W, rows: H, images, narrow }) => {
  const rocket = rocketSprite(images.rocket, Math.max(12, Math.round(H * (narrow ? 0.28 : 0.36))));
  const cx = Math.round(W / 2);
  const horizon = Math.round(H * 0.66);
  const sunX = Math.round(W * (narrow ? 0.3 : 0.26));
  const sunR = Math.max(5, H * 0.1);
  const stars: number[] = [];
  for (let y = 0; y < horizon * 0.6; y++) for (let x = 0; x < W; x++) if (hash2(x + 31, y) < 0.01) stars.push(y * W + x);

  const top = new Float32Array(W);
  const top2 = new Float32Array(W);

  return {
    draw(grid, t, { progress }) {
      for (let x = 0; x < W; x++) {
        top[x] = horizon + (fbm(x * 0.035 + t * 0.02, 2.1, 3) - 0.5) * H * 0.16;
        top2[x] = horizon - H * 0.07 + (fbm(x * 0.025 - t * 0.012, 5.4, 3) - 0.5) * H * 0.1;
      }
      // sky and sun
      for (let y = 0; y < H; y++) {
        const k = y / horizon;
        const sky = k < 0.5 ? mixc(C.night, C.v1, k / 0.5) : k < 0.85 ? mixc(C.v1, C.wine, (k - 0.5) / 0.35) : mixc(C.wine, C.ember, clamp01((k - 0.85) / 0.2));
        const skyV = 0.08 + 0.3 * clamp01(k - 0.35);
        for (let x = 0; x < W; x++) {
          const i = y * W + x;
          const dx = x - sunX, dy = (y - horizon + H * 0.04) * 1.1;
          const dist = Math.sqrt(dx * dx + dy * dy);
          let r = sky[0], g = sky[1], b = sky[2], v = skyV;
          if (dist < sunR) {
            const c = mixc(C.cream, C.gold, dist / sunR);
            r = c[0];
            g = c[1];
            b = c[2];
            v = 0.95;
          } else if (dist < sunR * 4) {
            const glow = Math.pow(1 - (dist - sunR) / (sunR * 3), 2);
            const c = mixc(sky, C.amber, glow * 0.85);
            r = c[0];
            g = c[1];
            b = c[2];
            v = Math.max(v, glow * 0.7);
          }
          grid.set(i, r, g, b, v);
        }
      }
      for (const i of stars) {
        const tw = 0.5 + 0.5 * Math.sin(t * 1.5 + (i % 53));
        if (tw > 0.3) grid.glyph(i, G["·"], 0.55 * tw + 0.2, 0.6 * tw + 0.2, 0.75 * tw + 0.2);
      }

      // far cloud bank
      for (let x = 0; x < W; x++) {
        for (let y = Math.max(0, Math.floor(top2[x])); y < H; y++) {
          const d = y - top2[x];
          const n = fbm(x * 0.06 + t * 0.015, y * 0.12, 3);
          const v = clamp01(0.35 + n * 0.4 - d * 0.004);
          const c = d < 2 ? mixc(C.rose2, C.v4, n) : mixc(C.v3, C.v2, clamp01(d / 12));
          grid.set(y * W + x, c[0], c[1], c[2], v);
        }
      }

      // rocket climbs out of the clouds
      const climb = smooth(0, 1, progress);
      const bob = Math.sin(t * 1.6) * 0.6;
      const rocketBottom = top[cx] + rocket.h * 0.45 - climb * (H * 0.62 + rocket.h * 0.3) + bob;
      drawSmoke(grid, cx, rocketBottom + rocket.h * 0.25, H, 2 + climb * 6, 0.9, t, C.rose2);
      drawFlame(grid, cx, rocketBottom - 0.5, rocket.w * 0.5, rocket.h * (0.36 + 0.07 * Math.sin(t * 24)), t);
      drawSprite(grid, rocket, cx, rocketBottom);

      // near cloud sea, lit from the low sun (drawn last so the rocket sinks into it)
      for (let x = 0; x < W; x++) {
        for (let y = Math.max(0, Math.floor(top[x])); y < H; y++) {
          const d = y - top[x];
          const n = fbm(x * 0.045 + t * 0.03, y * 0.09 - t * 0.01, 4);
          if (d < 1 && n < 0.45) continue; // ragged tops
          const sunSide = clamp01(1 - Math.abs(x - sunX) / (W * 0.6));
          const lit = clamp01(1 - d / 6) * (0.5 + 0.5 * sunSide);
          const c = lit > 0.25 ? mixc(C.rose2, C.gold, lit * sunSide) : mixc(C.v4, C.v2, clamp01(d / 14 + (1 - n) * 0.4));
          grid.set(y * W + x, c[0], c[1], c[2], clamp01(0.5 + n * 0.45 + lit * 0.2 - d * 0.006));
        }
      }
    }
  };
};

/* ───────────────────────────── quiet field with a pointer ripple ───────────────────────────── */

export const field: SceneFactory = ({ cols: W, rows: H }) => ({
  draw(grid, t, { pointer }) {
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const i = y * W + x;
        const wave = 0.5 + 0.5 * Math.sin(x * 0.18 + y * 0.07 - t * 0.9 + noise2(x * 0.05, y * 0.05) * 4);
        let v = 0.14 + wave * 0.1;
        let c: RGB = C.dusk;
        if (pointer) {
          const dx = x - pointer.x, dy = y - pointer.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 9) {
            const k = 1 - d / 9;
            const ring = 0.5 + 0.5 * Math.sin(d * 1.3 - t * 7);
            v = Math.max(v, k * (0.45 + 0.4 * ring));
            c = mixc(C.slate, k > 0.6 ? C.g3 : C.teal, k);
            if (k > 0.75) {
              grid.glyph(i, G["+"], c[0], c[1], c[2]);
              continue;
            }
          }
        }
        grid.set(i, c[0], c[1], c[2], v);
      }
    }
  }
});
