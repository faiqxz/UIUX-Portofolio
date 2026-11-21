import React, { useEffect, useRef } from "react";
import { AsciiRenderer, Grid, clamp01, hash2, hexToRgb, noise2, smooth } from "./engine.ts";

export interface AsciiLine {
  text: string;
  /** Left-to-right gradient stops for this line. */
  colors: string[];
  /** Draw only the outline of the letters. */
  outline?: boolean;
}

/**
  Display type rendered as a halftone of dots: the text is rasterised with a real font (Anton)
  onto a tiny canvas, one pixel per cell, and each cell becomes a dithered dot. The dots assemble
  when the heading scrolls into view, then a slow shimmer runs while it's on screen.
  The wrapper reserves its height in CSS (lines × lineHeight em), so there's no layout shift.
  Decorative: pass the real text to a screen-reader/SEO element next to it.
*/
export default function AsciiText({
  lines,
  size,
  lineHeight = 0.92,
  align = "left",
  font = "Anton",
  className = "",
  play = true,
  cellRatio = 22
}: {
  lines: AsciiLine[];
  /** CSS font-size, e.g. "clamp(3rem, 12vw, 10rem)". */
  size: string;
  lineHeight?: number;
  align?: "left" | "center" | "right";
  font?: string;
  className?: string;
  /** Start the assemble animation (e.g. after an intro finishes). */
  play?: boolean;
  /** Cells per em: higher = finer dots. */
  cellRatio?: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playRef = useRef(play);
  playRef.current = play;
  const key = JSON.stringify(lines);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer: AsciiRenderer | null = null;
    let grid: Grid | null = null;
    let cover = new Float32Array(0);
    let edgeMask = new Uint8Array(0);
    let colR = new Float32Array(0), colG = new Float32Array(0), colB = new Float32Array(0);
    let delay = new Float32Array(0);
    let raf = 0;
    let visible = false;
    let startedAt = -1;
    let disposed = false;
    let lastDraw = 0;

    const build = () => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (!w || !h) return;
      const fontPx = parseFloat(getComputedStyle(wrap).fontSize) || 64;
      const cellPx = Math.max(3.2, Math.min(8, fontPx / cellRatio));
      renderer = new AsciiRenderer(canvas, { cell: cellPx, dots: [0.16, 0.3, 0.46] });
      const { cols, rows } = renderer.resize(w, h, window.devicePixelRatio || 1);
      const cs = renderer.s / renderer.dpr; // actual css px per cell
      grid = new Grid(cols, rows);

      // Rasterise at 4× per cell and box-filter down for clean coverage values.
      const SS = 4;
      const off = document.createElement("canvas");
      off.width = cols * SS;
      off.height = rows * SS;
      const ctx = off.getContext("2d", { willReadFrequently: true })!;
      const fpx = (fontPx / cs) * SS;
      ctx.font = `${fpx}px "${font}", Impact, sans-serif`;
      ctx.textBaseline = "alphabetic";
      ctx.fillStyle = "#fff";
      const lh = (fontPx * lineHeight) / cs * SS;
      const spans: [number, number][] = [];
      lines.forEach((ln, li) => {
        const text = ln.text.toUpperCase();
        let width = ctx.measureText(text).width;
        let scale = 1;
        if (width > off.width) {
          scale = off.width / width;
          width = off.width;
        }
        const x = align === "center" ? (off.width - width) / 2 : align === "right" ? off.width - width : 0;
        const baseline = li * lh + lh * 0.86;
        ctx.save();
        ctx.translate(x, baseline);
        ctx.scale(scale, scale);
        ctx.fillText(text, 0, 0);
        ctx.restore();
        spans.push([x / SS, (x + width) / SS]);
      });
      const data = ctx.getImageData(0, 0, off.width, off.height).data;
      const n = cols * rows;
      cover = new Float32Array(n);
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          let s = 0;
          for (let yy = 0; yy < SS; yy++) for (let xx = 0; xx < SS; xx++) s += data[((y * SS + yy) * off.width + x * SS + xx) * 4 + 3];
          cover[y * cols + x] = s / (SS * SS * 255);
        }
      }
      edgeMask = new Uint8Array(n);
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          if (cover[i] < 0.35) continue;
          const lo = (xx: number, yy: number) => xx < 0 || yy < 0 || xx >= cols || yy >= rows || cover[yy * cols + xx] < 0.35;
          if (lo(x - 1, y) || lo(x + 1, y) || lo(x, y - 1) || lo(x, y + 1)) edgeMask[i] = 1;
        }
      }
      // colours: per-line gradient across that line's own extent
      colR = new Float32Array(n);
      colG = new Float32Array(n);
      colB = new Float32Array(n);
      delay = new Float32Array(n);
      const rowsPerLine = (lh / SS);
      for (let y = 0; y < rows; y++) {
        const li = Math.min(lines.length - 1, Math.floor(y / rowsPerLine));
        const stops = lines[li].colors.map(hexToRgb);
        const [a, b] = spans[li];
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          const u = clamp01((x - a) / Math.max(1, b - a)) * (stops.length - 1);
          const k = Math.min(stops.length - 2, Math.floor(u));
          const f = stops.length > 1 ? u - k : 0;
          const s0 = stops[Math.max(0, k)], s1 = stops[Math.min(stops.length - 1, k + 1)];
          colR[i] = (s0[0] + (s1[0] - s0[0]) * f) / 255;
          colG[i] = (s0[1] + (s1[1] - s0[1]) * f) / 255;
          colB[i] = (s0[2] + (s1[2] - s0[2]) * f) / 255;
          delay[i] = (x / cols) * 0.55 + hash2(x, y) * 0.45 + li * 0.15;
        }
      }
      if (startedAt < 0 && (reduce || !playRef.current)) {
        // not started yet: draw nothing (or the final frame for reduced motion)
      }
      draw(performance.now(), true);
    };

    const draw = (now: number, force = false) => {
      if (!grid || !renderer) return;
      const t = now / 1000;
      const el = startedAt < 0 ? -1 : (now - startedAt) / 1000;
      const cols = grid.cols;
      for (let i = 0; i < grid.n; i++) {
        let c = cover[i];
        const li = Math.min(lines.length - 1, Math.floor((i / cols) / Math.max(1, grid.rows / lines.length)));
        if (lines[li]?.outline) c = edgeMask[i] ? 1 : 0;
        if (c < 0.2) {
          grid.v[i] = 0;
          grid.gl[i] = -1;
          continue;
        }
        const x = i % cols, y = (i / cols) | 0;
        let v = clamp01(c * 1.15) * (0.78 + 0.22 * noise2(x * 0.35, y * 0.35));
        if (!reduce) {
          const appear = el < 0 ? 0 : smooth(delay[i], delay[i] + 0.35, el);
          v *= appear;
          v *= 0.86 + 0.14 * Math.sin(x * 0.12 - t * 2.4 + y * 0.05);
        } else if (el < 0 && !force) v = 0;
        grid.set(i, colR[i], colG[i], colB[i], v);
      }
      renderer.render(grid);
      lastDraw = now;
    };

    const loop = (now: number) => {
      raf = 0;
      if (disposed || !visible || document.hidden) return;
      if (startedAt < 0 && playRef.current) startedAt = now;
      if (now - lastDraw > 66) draw(now);
      if (!reduce) raf = requestAnimationFrame(loop);
    };
    const kick = () => {
      if (!raf && visible && !document.hidden) raf = requestAnimationFrame(loop);
    };

    if (reduce) startedAt = 0;

    const ro = new ResizeObserver(() => build());
    const io = new IntersectionObserver(e => {
      visible = e[0]?.isIntersecting ?? false;
      kick();
    });
    const onVis = () => kick();
    // Build once the display font is ready so the raster uses Anton, not a fallback.
    const ready = document.fonts?.load ? document.fonts.load(`64px "${font}"`).catch(() => {}) : Promise.resolve();
    ready.then(() => {
      if (disposed) return;
      ro.observe(wrap);
      io.observe(wrap);
    });
    document.addEventListener("visibilitychange", onVis);
    const poll = window.setInterval(() => {
      if (playRef.current) kick();
    }, 200);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.clearInterval(poll);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, size, lineHeight, align, font, cellRatio]);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className={`relative w-full overflow-hidden ${className}`}
      style={{ fontSize: size, height: `${lines.length * lineHeight}em` }}
    >
      <canvas ref={canvasRef} className="absolute left-0 top-0 block" />
    </div>
  );
}
