import React, { useEffect, useRef } from "react";
import { AsciiRenderer, Grid } from "./engine.ts";

export interface SceneInput {
  /** 0..1, e.g. scroll progress through the section (from getProgress). */
  progress: number;
  /** Pointer position in cells, or null when the pointer isn't over the canvas. */
  pointer: { x: number; y: number } | null;
}

export interface Scene {
  draw(grid: Grid, t: number, input: SceneInput): void;
}

export interface SceneSetup {
  cols: number;
  rows: number;
  /** Decoded images requested through the `images` prop, keyed by name. */
  images: Record<string, HTMLImageElement>;
  narrow: boolean;
}

export type SceneFactory = (setup: SceneSetup) => Scene;

const loaded = new Map<string, Promise<HTMLImageElement>>();
function loadImage(src: string) {
  let p = loaded.get(src);
  if (!p) {
    p = new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
    loaded.set(src, p);
  }
  return p;
}

/**
  Full-bleed animated ASCII canvas. Animates only while on screen and while the tab is visible,
  draws a single still frame for people who prefer reduced motion, and rebuilds the scene on resize.
*/
export default function AsciiCanvas({
  scene,
  cell = 7,
  fps = 15,
  images,
  getProgress,
  interactive = false,
  className = "",
  style
}: {
  scene: SceneFactory;
  /** Cell size in CSS px, or a function of the container width. */
  cell?: number | ((width: number) => number);
  fps?: number;
  images?: Record<string, string>;
  getProgress?: () => number;
  interactive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(getProgress);
  progressRef.current = getProgress;

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let renderer: AsciiRenderer | null = null;
    let grid: Grid | null = null;
    let instance: Scene | null = null;
    let imgs: Record<string, HTMLImageElement> = {};
    let raf = 0;
    let last = 0;
    let visible = false;
    let disposed = false;
    let lastProgress = -1;
    let pointer: { x: number; y: number } | null = null;
    const start = performance.now();
    const frameMs = 1000 / fps;

    const drawOnce = (now: number) => {
      if (!renderer || !grid || !instance) return;
      const progress = progressRef.current ? progressRef.current() : 0;
      lastProgress = progress;
      // Reduced motion: a still frame, but scroll-driven scenes still follow the scroll.
      const t = reduce ? 4 : (now - start) / 1000;
      instance.draw(grid, t, { progress, pointer });
      renderer.render(grid);
    };

    const loop = (now: number) => {
      raf = 0;
      if (!visible || document.hidden || disposed) return;
      if (reduce) {
        const p = progressRef.current ? progressRef.current() : 0;
        if (Math.abs(p - lastProgress) > 0.002) drawOnce(now);
      } else if (now - last >= frameMs) {
        last = now - ((now - last) % frameMs);
        drawOnce(now);
      }
      raf = requestAnimationFrame(loop);
    };

    const kick = () => {
      if (!raf && visible && !document.hidden) raf = requestAnimationFrame(loop);
    };

    const build = () => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (!w || !h) return;
      const c = typeof cell === "function" ? cell(w) : cell;
      if (!renderer || renderer.cell !== c) renderer = new AsciiRenderer(canvas, { cell: c });
      const { cols, rows } = renderer.resize(w, h, window.devicePixelRatio || 1);
      grid = new Grid(cols, rows);
      instance = scene({ cols, rows, images: imgs, narrow: w < 768 });
      drawOnce(performance.now());
      kick();
    };

    let resizeTimer = 0;
    const ro = new ResizeObserver(() => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(build, renderer ? 120 : 0);
    });

    const io = new IntersectionObserver(
      entries => {
        visible = entries[0]?.isIntersecting ?? false;
        kick();
      },
      { rootMargin: "100px" }
    );

    const onVis = () => kick();
    const onScroll = () => {
      if (reduce && progressRef.current) kick();
    };
    const onMove = (e: PointerEvent) => {
      if (!renderer) return;
      const rect = canvas.getBoundingClientRect();
      const cs = renderer.s / renderer.dpr;
      pointer = { x: (e.clientX - rect.left) / cs, y: (e.clientY - rect.top) / cs };
    };
    const onLeave = () => {
      pointer = null;
    };

    Promise.all(Object.entries(images ?? {}).map(([k, src]) => loadImage(src).then(img => [k, img] as const)))
      .then(entries => {
        if (disposed) return;
        imgs = Object.fromEntries(entries);
      })
      .catch(() => {})
      .finally(() => {
        if (disposed) return;
        ro.observe(wrap);
        io.observe(wrap);
      });

    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("scroll", onScroll, { passive: true });
    if (interactive) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerleave", onLeave);
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
    // The scene factory and options are fixed per mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={wrapRef} className={`overflow-hidden ${className}`} style={style} aria-hidden="true">
      <canvas ref={canvasRef} className="block" />
    </div>
  );
}
