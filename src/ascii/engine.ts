/*
  Tiny ASCII "halftone" engine, written for this portfolio.

  A scene fills a Grid with a colour (r,g,b in 0..1) and an intensity (v in 0..1) per cell.
  The renderer turns intensity into a dot glyph ( · • ● ) with ordered (Bayer) dithering,
  snaps the colour to the nearest palette entry through a 32×32×32 lookup table, and blits
  pre-rendered glyph sprites from an atlas onto a canvas. Only cells that changed since the
  last frame are redrawn, so static parts of a scene (mountains, a rocket on its pad) cost nothing.

  A scene may also force a specific glyph in a cell (stars, launch tower, sparks) via `gl`.
*/

export type RGB = [number, number, number];

export const hexToRgb = (h: string): RGB => {
  const n = parseInt(h.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

/** Theme palette: ink blues, aurora greens and teals, violets, warm lamp light and rose. */
export const PALETTE = [
  // night blues and slates (0-11)
  "#070b16", "#0c1426", "#111d36", "#182848", "#22355c", "#2f4570", "#405887", "#566e9e",
  "#7489b5", "#9aabcf", "#c3cfe6", "#e9eefb",
  // aurora greens (12-18)
  "#0d332c", "#104c3b", "#156c48", "#1e9157", "#35bf6c", "#74eb9b", "#c2fbd6",
  // teals (19-22)
  "#0d5653", "#147d76", "#27ab9c", "#79e3d3",
  // violets (23-28)
  "#251a4c", "#3c2670", "#5f3896", "#8a52c0", "#b985e0", "#ddc2f5",
  // rose and reds (29-33)
  "#46131c", "#7a1f34", "#b8325b", "#ff5c9a", "#ffa6c8",
  // warm light (34-38)
  "#7a3a12", "#c8611c", "#ffa743", "#ffd27a", "#fff3cf",
  // snow and smoke (39-41)
  "#b9c2d6", "#dde3ef", "#f7f9ff"
];

/** Glyphs in the atlas. 0-3 are halftone dots drawn as circles; the rest are drawn as text. */
export const GLYPHS = [" ", "·", "•", "●", "+", "*", "|", "/", "\\", "_", "-", "=", "#", "^", "o", ".", "'", "<", ">", "[", "]", "▲", "█", "░", "▒", "~", ":", "✦"];
export const G: Record<string, number> = Object.fromEntries(GLYPHS.map((g, i) => [g, i]));

// 4×4 Bayer matrix centred on 0, scaled to ±0.47 of a level.
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map(v => v / 16 - 0.47);

const lutCache = new Map<string, Uint8Array>();

/** 32×32×32 nearest-colour lookup (perceptually weighted RGB distance). Built once per palette. */
export function paletteLut(palette: string[]): Uint8Array {
  const key = palette.join();
  const hit = lutCache.get(key);
  if (hit) return hit;
  const pal = palette.map(hexToRgb);
  const lut = new Uint8Array(32768);
  for (let r = 0; r < 32; r++) {
    for (let g = 0; g < 32; g++) {
      for (let b = 0; b < 32; b++) {
        // centre of each 8-step bin
        const R = r * 8 + 4, Gc = g * 8 + 4, B = b * 8 + 4;
        let best = 0;
        let bestD = Infinity;
        for (let i = 0; i < pal.length; i++) {
          const dr = R - pal[i][0], dg = Gc - pal[i][1], db = B - pal[i][2];
          const rm = (R + pal[i][0]) / 2;
          const d = (2 + rm / 256) * dr * dr + 4 * dg * dg + (2 + (255 - rm) / 256) * db * db;
          if (d < bestD) {
            bestD = d;
            best = i;
          }
        }
        lut[(r << 10) | (g << 5) | b] = best;
      }
    }
  }
  lutCache.set(key, lut);
  return lut;
}

export class Grid {
  cols: number;
  rows: number;
  n: number;
  r: Float32Array;
  g: Float32Array;
  b: Float32Array;
  v: Float32Array;
  /** Forced glyph per cell (-1 = choose a dot from v). */
  gl: Int8Array;

  constructor(cols: number, rows: number) {
    this.cols = cols;
    this.rows = rows;
    this.n = cols * rows;
    this.r = new Float32Array(this.n);
    this.g = new Float32Array(this.n);
    this.b = new Float32Array(this.n);
    this.v = new Float32Array(this.n);
    this.gl = new Int8Array(this.n).fill(-1);
  }

  clear() {
    this.v.fill(0);
    this.gl.fill(-1);
  }

  set(i: number, r: number, g: number, b: number, v: number) {
    this.r[i] = r;
    this.g[i] = g;
    this.b[i] = b;
    this.v[i] = v;
    this.gl[i] = -1;
  }

  glyph(i: number, glyph: number, r: number, g: number, b: number) {
    this.r[i] = r;
    this.g[i] = g;
    this.b[i] = b;
    this.v[i] = 1;
    this.gl[i] = glyph;
  }
}

export interface RendererOptions {
  palette?: string[];
  /** Cell size in CSS pixels (cells are square). */
  cell: number;
  /** Dot radius per level, as a fraction of the cell. */
  dots?: [number, number, number];
  font?: string;
}

export class AsciiRenderer {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  palette: string[];
  lut: Uint8Array;
  cell: number;
  dots: [number, number, number];
  font: string;
  s = 1; // device pixels per cell
  dpr = 1;
  cols = 0;
  rows = 0;
  atlas: HTMLCanvasElement | null = null;
  prev = new Int32Array(0);

  constructor(canvas: HTMLCanvasElement, opts: RendererOptions) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d", { alpha: true })!;
    this.palette = opts.palette ?? PALETTE;
    this.lut = paletteLut(this.palette);
    this.cell = opts.cell;
    this.dots = opts.dots ?? [0.13, 0.25, 0.4];
    this.font = opts.font ?? '"JetBrains Mono", ui-monospace, monospace';
  }

  /** Size the canvas to cover cssW × cssH and return the grid dimensions. */
  resize(cssW: number, cssH: number, dpr: number) {
    this.dpr = Math.min(dpr || 1, 2);
    this.s = Math.max(2, Math.round(this.cell * this.dpr));
    const cssCell = this.s / this.dpr;
    this.cols = Math.max(1, Math.ceil(cssW / cssCell));
    this.rows = Math.max(1, Math.ceil(cssH / cssCell));
    this.canvas.width = this.cols * this.s;
    this.canvas.height = this.rows * this.s;
    this.canvas.style.width = `${(this.cols * this.s) / this.dpr}px`;
    this.canvas.style.height = `${(this.rows * this.s) / this.dpr}px`;
    this.buildAtlas();
    this.prev = new Int32Array(this.cols * this.rows).fill(-1);
    return { cols: this.cols, rows: this.rows };
  }

  private buildAtlas() {
    const s = this.s;
    const atlas = document.createElement("canvas");
    atlas.width = GLYPHS.length * s;
    atlas.height = this.palette.length * s;
    const a = atlas.getContext("2d")!;
    a.textAlign = "center";
    a.textBaseline = "middle";
    a.font = `${Math.round(s * 0.92)}px ${this.font}`;
    this.palette.forEach((hex, ci) => {
      a.fillStyle = hex;
      GLYPHS.forEach((ch, gi) => {
        const x = gi * s;
        const y = ci * s;
        if (gi === 0) return;
        if (gi <= 3) {
          a.beginPath();
          a.arc(x + s / 2, y + s / 2, Math.max(0.6, s * this.dots[gi - 1]), 0, Math.PI * 2);
          a.fill();
        } else if (ch === "█") {
          a.fillRect(x, y, s, s);
        } else {
          a.fillText(ch, x + s / 2, y + s / 2 + s * 0.04);
        }
      });
    });
    this.atlas = atlas;
  }

  /** Redraw everything on the next render (after the canvas was cleared externally). */
  invalidate() {
    this.prev.fill(-1);
  }

  render(grid: Grid, levelBias = 0) {
    const { ctx, s, lut, atlas, prev } = this;
    if (!atlas) return;
    const cols = Math.min(grid.cols, this.cols);
    const rows = Math.min(grid.rows, this.rows);
    const P = this.palette.length;
    for (let y = 0; y < rows; y++) {
      const by = (y & 3) * 4;
      for (let x = 0; x < cols; x++) {
        const i = y * grid.cols + x;
        let gi = grid.gl[i];
        if (gi < 0) {
          const v = grid.v[i] + levelBias;
          gi = v <= 0 ? 0 : Math.floor(v * 3.999 + 0.5 + BAYER[by + (x & 3)]);
          if (gi < 0) gi = 0;
          else if (gi > 3) gi = 3;
        }
        let key = 0;
        let ci = 0;
        if (gi > 0) {
          const r = grid.r[i], g = grid.g[i], b = grid.b[i];
          ci = lut[((r >= 1 ? 31 : r <= 0 ? 0 : (r * 32) | 0) << 10) | ((g >= 1 ? 31 : g <= 0 ? 0 : (g * 32) | 0) << 5) | (b >= 1 ? 31 : b <= 0 ? 0 : (b * 32) | 0)];
          key = gi * P + ci + 1;
        }
        const pi = y * this.cols + x;
        if (prev[pi] === key) continue;
        prev[pi] = key;
        ctx.clearRect(x * s, y * s, s, s);
        if (key) ctx.drawImage(atlas, gi * s, ci * s, s, s, x * s, y * s, s, s);
      }
    }
  }
}

/* ───────────── small math helpers shared by scenes ───────────── */

export function hash2(x: number, y: number): number {
  let h = Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

export function noise2(x: number, y: number): number {
  const xi = Math.floor(x), yi = Math.floor(y);
  const fx = x - xi, fy = y - yi;
  const u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy);
  const a = hash2(xi, yi), b = hash2(xi + 1, yi), c = hash2(xi, yi + 1), d = hash2(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

export function fbm(x: number, y: number, oct = 4): number {
  let s = 0, a = 0.5, f = 1, n = 0;
  for (let i = 0; i < oct; i++) {
    s += a * noise2(x * f, y * f);
    n += a;
    a *= 0.5;
    f *= 2.03;
  }
  return s / n;
}

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
export const smooth = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
export const mixc = (a: RGB, b: RGB, t: number): RGB => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
export const rgb = (h: string): RGB => {
  const [r, g, b] = hexToRgb(h);
  return [r / 255, g / 255, b / 255];
};

/** A sprite sampled from an image into cells: colour and alpha per cell. */
export interface CellSprite {
  w: number;
  h: number;
  r: Float32Array;
  g: Float32Array;
  b: Float32Array;
  a: Float32Array;
}

/** Sample an image into a w×h cell sprite (box-filtered by the browser's downscale). */
export function sampleImage(img: CanvasImageSource & { width: number; height: number }, w: number, h: number): CellSprite {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const x = c.getContext("2d", { willReadFrequently: true })!;
  x.imageSmoothingEnabled = true;
  x.imageSmoothingQuality = "high";
  x.drawImage(img, 0, 0, w, h);
  const d = x.getImageData(0, 0, w, h).data;
  const n = w * h;
  const sp: CellSprite = { w, h, r: new Float32Array(n), g: new Float32Array(n), b: new Float32Array(n), a: new Float32Array(n) };
  for (let i = 0; i < n; i++) {
    const a = d[i * 4 + 3] / 255;
    sp.a[i] = a;
    // un-premultiply so edge cells keep their true colour
    sp.r[i] = a > 0 ? d[i * 4] / 255 : 0;
    sp.g[i] = a > 0 ? d[i * 4 + 1] / 255 : 0;
    sp.b[i] = a > 0 ? d[i * 4 + 2] / 255 : 0;
  }
  return sp;
}
