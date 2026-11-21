import React, { useEffect, useRef, useState } from "react";
import { AsciiRenderer, Grid, clamp01, sampleImage } from "./engine.ts";

/**
  An image that first appears as an ASCII halftone of itself, then a scanline sweeps down and
  reveals the real picture once it has been on screen for a moment. With a mouse, hovering
  brings the ASCII version back over it.
*/
export default function AsciiImage({
  src,
  alt,
  width,
  height,
  cell = 6,
  fit = "contain",
  className = "",
  imgClassName = ""
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  cell?: number;
  fit?: "contain" | "cover";
  className?: string;
  imgClassName?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!wrap || !canvas || !img) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let disposed = false;
    let timer = 0;

    const paint = () => {
      if (disposed || !img.naturalWidth) return;
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (!w || !h) return;
      const r = new AsciiRenderer(canvas, { cell, dots: [0.14, 0.27, 0.44] });
      const { cols, rows } = r.resize(w, h, window.devicePixelRatio || 1);
      const cs = r.s / r.dpr;
      // Work out where the image sits inside the box (object-fit), in cells.
      const ar = img.naturalWidth / img.naturalHeight;
      let iw = w, ih = h;
      if ((fit === "contain") === (w / h > ar)) iw = h * ar;
      else ih = w / ar;
      const cw = Math.max(1, Math.round(iw / cs));
      const ch = Math.max(1, Math.round(ih / cs));
      const ox = Math.round((cols - cw) / 2);
      const oy = Math.round((rows - ch) / 2);
      const sp = sampleImage(img, cw, ch);
      const grid = new Grid(cols, rows);
      for (let y = 0; y < ch; y++) {
        const gy = y + oy;
        if (gy < 0 || gy >= rows) continue;
        for (let x = 0; x < cw; x++) {
          const gx = x + ox;
          if (gx < 0 || gx >= cols) continue;
          const k = y * cw + x;
          const a = sp.a[k];
          if (a < 0.2) continue;
          const R = sp.r[k], G = sp.g[k], B = sp.b[k];
          const l = 0.299 * R + 0.587 * G + 0.114 * B;
          // lift dark pixels a little so dark UI still reads as dots
          grid.set(gy * cols + gx, Math.max(R, 0.18), Math.max(G, 0.22), Math.max(B, 0.32), clamp01((0.22 + 0.85 * l) * a));
        }
      }
      r.render(grid);
    };

    const onLoad = () => paint();
    if (img.complete && img.naturalWidth) paint();
    else img.addEventListener("load", onLoad);

    const ro = new ResizeObserver(() => paint());
    ro.observe(wrap);

    const io = new IntersectionObserver(
      entries => {
        const e = entries[0];
        if (e?.isIntersecting) {
          window.clearTimeout(timer);
          timer = window.setTimeout(() => setRevealed(true), reduce ? 0 : 650);
          io.disconnect();
        }
      },
      { threshold: 0.45 }
    );
    io.observe(wrap);

    return () => {
      disposed = true;
      window.clearTimeout(timer);
      img.removeEventListener("load", onLoad);
      ro.disconnect();
      io.disconnect();
    };
  }, [src, cell, fit]);

  return (
    <div ref={wrapRef} className={`ascii-img group/ai relative ${className}`} data-revealed={revealed || undefined} style={{ aspectRatio: `${width} / ${height}` }}>
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        className={`ascii-img__photo absolute inset-0 h-full w-full ${fit === "cover" ? "object-cover" : "object-contain"} ${imgClassName}`}
      />
      <canvas ref={canvasRef} className="ascii-img__dots pointer-events-none absolute left-0 top-0 block" aria-hidden="true" />
      <span className="ascii-img__scan pointer-events-none absolute inset-x-0 top-0 h-px" aria-hidden="true" />
    </div>
  );
}
