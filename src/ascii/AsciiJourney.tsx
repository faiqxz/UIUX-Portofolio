import React, { useEffect, useRef } from "react";

/*
  AsciiJourney: a little ASCII traveler that flies down a dotted flight path through every section
  and scrambles into that section's symbol as it crosses each boundary:
    rocket (hero) → phone (work) → sparkle (about) → git graph (experience) → heart (orgs) → rocket (launch)
  On the launch section the path swings to the centre and the traveler fades out, "docking" into the
  big ASCII rocket there.

  Performance: the path is rebuilt from measured section positions only when layout changes and is
  sampled into a lookup table; per scroll frame there is one binary search, one transform, and (only
  inside a transition zone) a rewrite of five short text rows.
*/

const W = 9; // sprite width in characters
const H = 5; // sprite height in rows

interface Form {
  rows: string[];
  color: string;
  /** Row index drawn in the flame colour (rockets only). */
  flame?: number;
}

const pad = (s: string) => (s + " ".repeat(W)).slice(0, W);
const ROCKET = ["    ^    ", "   / \\   ", "   |o|   ", "  /|_|\\  ", "   vVv   "];

const FORMS: Form[] = [
  { rows: ROCKET, color: "#FF6FA8", flame: 4 },
  { rows: ["  .---.  ", "  |:::|  ", "  |   |  ", "  |   |  ", "  '-o-'  "], color: "#6FE3D2" },
  { rows: ["    |    ", "  \\ | /  ", " -- * -- ", "  / | \\  ", "    |    "], color: "#FFC86B" },
  { rows: ["   *     ", "   |\\    ", "   | *   ", "   |/    ", "   *     "], color: "#C08CF0" },
  { rows: [" .-. .-. ", "(   v   )", " \\     / ", "  \\   /  ", "   `v'   "], color: "#FF6FA8" },
  { rows: ROCKET, color: "#7CF0A0", flame: 4 }
].map(f => ({ ...f, rows: f.rows.map(pad) }));

const FLAMES = ["   vVv   ", "   VvV   ", "   v'v   "];
const NOISE = "#%*+=:-.~";
const FLAME_COLOR = "#FFC86B";

const hexRgb = (h: string): [number, number, number] => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const mix = (a: string, b: string, t: number) => {
  const A = hexRgb(a), B = hexRgb(b);
  return `rgb(${Math.round(A[0] + (B[0] - A[0]) * t)},${Math.round(A[1] + (B[1] - A[1]) * t)},${Math.round(A[2] + (B[2] - A[2]) * t)})`;
};
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const hash = (n: number) => {
  let h = Math.imul(n ^ 0x9e3779b9, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};

export default function AsciiJourney({ rootRef, sectionIds }: { rootRef: React.RefObject<HTMLDivElement | null>; sectionIds: string[] }) {
  const trailSvgRef = useRef<SVGSVGElement>(null);
  const trailRef = useRef<SVGPathElement>(null);
  const waypointsRef = useRef<SVGGElement>(null);
  const travelerRef = useRef<HTMLDivElement>(null);
  const rowsRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    const root: HTMLDivElement | null = rootRef.current;
    const traveler = travelerRef.current;
    const trail = trailRef.current;
    const trailSvg = trailSvgRef.current;
    const rowEls = rowsRef.current;
    if (!root || !traveler || !trail || !trailSvg || rowEls.length < H) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let xs = new Float32Array(0);
    let ys = new Float32Array(0);
    let as = new Float32Array(0);
    let count = 0;
    let bounds: number[] = [];
    let zone = 180;
    let fs = 12; // font size of the sprite
    let sw = 0; // sprite box in px
    let sh = 0;
    let anchor = 0.56;
    let rootTop = 0;
    let fadeFrom = Infinity;
    let fadeTo = Infinity;

    let stage = 0;
    let lastStage = -1;
    let flameFrame = 0;
    let lastOp = -1;
    let raf = 0;
    let layoutRaf = 0;
    const shown: string[] = [];
    const shownColor: string[] = [];

    const paint = () => {
      const last = FORMS.length - 1;
      const k = Math.min(Math.floor(stage), last);
      const k2 = Math.min(k + 1, last);
      const f = stage - k;
      const A = FORMS[k], B = FORMS[k2];
      const tick = Math.floor(f * 18);
      const color = mix(A.color, B.color, f);
      for (let r = 0; r < H; r++) {
        const isFlameA = A.flame === r, isFlameB = B.flame === r;
        const src = isFlameA ? FLAMES[flameFrame] : A.rows[r];
        const dst = isFlameB ? FLAMES[flameFrame] : B.rows[r];
        let s = "";
        if (f < 0.001) s = src;
        else if (f > 0.999) s = dst;
        else {
          for (let c = 0; c < W; c++) {
            const a = src[c], b = dst[c];
            if (a === " " && b === " ") {
              s += " ";
              continue;
            }
            const h = 0.12 + hash(r * 31 + c * 7) * 0.76;
            if (f < h - 0.1) s += a;
            else if (f > h + 0.1) s += b;
            else s += NOISE[Math.floor(hash(r * 131 + c * 17 + tick * 977) * NOISE.length)];
          }
        }
        // flame row keeps its warm colour while it's (mostly) a flame
        const flameW = (isFlameA ? 1 - f : 0) + (isFlameB ? f : 0);
        const col = flameW > 0.5 ? FLAME_COLOR : color;
        if (shown[r] !== s) {
          shown[r] = s;
          rowEls[r].textContent = s;
        }
        if (shownColor[r] !== col) {
          shownColor[r] = col;
          rowEls[r].style.color = col;
        }
      }
    };

    const layout = () => {
      layoutRaf = 0;
      const rootRect = root.getBoundingClientRect();
      rootTop = rootRect.top + window.scrollY;
      const Wd = root.clientWidth;
      const Ht = root.offsetHeight;
      const els = sectionIds.map(id => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
      const tops = els.map(el => el.getBoundingClientRect().top + window.scrollY - rootTop);
      if (tops.length < 2) return;
      const lastI = tops.length - 1;

      const desktop = Wd >= 1024;
      const tablet = Wd >= 768;
      fs = desktop ? 12 : tablet ? 9 : 7;
      sw = W * fs * 0.6;
      sh = H * fs;
      anchor = desktop ? 0.56 : 0.5;
      zone = desktop ? 200 : 140;
      const inset = desktop ? Math.min(100, Math.max(64, Wd * 0.05)) : tablet ? 34 : 22;
      const side = (i: number) => (i === lastI ? Wd / 2 : desktop && i % 2 === 1 ? inset : Wd - inset);
      const amp = desktop ? 16 : 0;
      const stepLen = 420;
      bounds = tops.slice(1);
      const dockY = tops[lastI] + Math.min(els[lastI].offsetHeight * 0.32, 340);
      fadeFrom = bounds[lastI - 1] + zone * 0.4;
      fadeTo = Math.max(dockY, fadeFrom + 1);

      const segs: [number, number, number, number][] = [];
      let cx = side(0);
      let cy = tops[0] + (desktop ? 150 : 110);
      const start: [number, number] = [cx, cy];
      const to = (x: number, y: number) => {
        if (y <= cy + 1) return;
        segs.push([cx, cy, x, y]);
        cx = x;
        cy = y;
      };
      for (let i = 0; i < tops.length; i++) {
        const sx = side(i);
        const end = i < lastI ? bounds[i] - zone : Math.min(dockY, Ht - 120);
        const y0 = cy;
        const span = end - y0;
        if (span > 0) {
          const n = Math.max(1, Math.round(span / stepLen));
          for (let k = 1; k <= n; k++) to(k === n ? sx : sx + (k % 2 ? amp : -amp), y0 + (span * k) / n);
        }
        if (i < tops.length - 1) to(side(i + 1), bounds[i] + zone);
      }

      let d = `M${start[0].toFixed(1)} ${start[1].toFixed(1)}`;
      const px: number[] = [start[0]];
      const py: number[] = [start[1]];
      for (const [x0, y0, x1, y1] of segs) {
        const m = (y0 + y1) / 2;
        d += `C${x0.toFixed(1)} ${m.toFixed(1)} ${x1.toFixed(1)} ${m.toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)}`;
        const steps = Math.max(4, Math.ceil(Math.hypot(x1 - x0, y1 - y0) / 12));
        for (let s = 1; s <= steps; s++) {
          const t = s / steps;
          const u = 1 - t;
          const bx = u * u * u + 3 * u * u * t;
          px.push(x0 * bx + x1 * (1 - bx));
          py.push(u * u * u * y0 + 3 * u * t * m + t * t * t * y1);
        }
      }
      count = px.length;
      xs = Float32Array.from(px);
      ys = Float32Array.from(py);
      as = new Float32Array(count);
      for (let j = 0; j < count; j++) {
        const a = Math.max(0, j - 1);
        const b = Math.min(count - 1, j + 1);
        as[j] = (Math.atan2(ys[b] - ys[a], xs[b] - xs[a]) * 180) / Math.PI;
      }

      trailSvg.setAttribute("width", String(Wd));
      trailSvg.setAttribute("height", String(Ht));
      trailSvg.setAttribute("viewBox", `0 0 ${Wd} ${Ht}`);
      trail.setAttribute("d", d);

      const g = waypointsRef.current;
      if (g) {
        g.innerHTML = "";
        bounds.forEach((b, i) => {
          const x = (side(i) + side(i + 1)) / 2;
          const t = document.createElementNS("http://www.w3.org/2000/svg", "text");
          t.setAttribute("x", x.toFixed(1));
          t.setAttribute("y", b.toFixed(1));
          t.setAttribute("fill", FORMS[i + 1].color);
          t.setAttribute("font-size", desktop ? "14" : "11");
          t.setAttribute("text-anchor", "middle");
          t.setAttribute("dominant-baseline", "central");
          t.textContent = "[+]";
          g.appendChild(t);
        });
      }

      traveler.style.fontSize = `${fs}px`;
      traveler.style.width = `${sw}px`;
      traveler.style.height = `${sh}px`;
      lastStage = -1;
      update();
    };

    const update = () => {
      raf = 0;
      if (!count) return;
      const scroll = window.scrollY - rootTop;
      const target = scroll + window.innerHeight * anchor;

      let x: number, y: number, a: number;
      if (target <= ys[0]) {
        x = xs[0];
        y = ys[0];
        a = as[0];
      } else if (target >= ys[count - 1]) {
        x = xs[count - 1];
        y = ys[count - 1];
        a = as[count - 1];
      } else {
        let lo = 0;
        let hi = count - 1;
        while (hi - lo > 1) {
          const mid = (lo + hi) >> 1;
          if (ys[mid] <= target) lo = mid;
          else hi = mid;
        }
        const t = (target - ys[lo]) / (ys[hi] - ys[lo] || 1);
        x = xs[lo] + (xs[hi] - xs[lo]) * t;
        y = target;
        a = as[lo] + (as[hi] - as[lo]) * t;
      }

      let s = 0;
      for (let i = 0; i < bounds.length; i++) {
        const b = bounds[i];
        if (y >= b + zone) {
          s = i + 1;
          continue;
        }
        if (y > b - zone) s = i + clamp01((y - (b - zone)) / (2 * zone));
        break;
      }
      stage = s;
      if (Math.abs(stage - lastStage) > 0.0004) {
        lastStage = stage;
        paint();
      }

      const op = y <= fadeFrom ? 1 : clamp01(1 - (y - fadeFrom) / (fadeTo - fadeFrom));
      if (Math.abs(op - lastOp) > 0.005) {
        lastOp = op;
        traveler.style.opacity = op.toFixed(3);
        traveler.style.visibility = op < 0.01 ? "hidden" : "";
      }

      const f = stage - Math.floor(stage);
      const lean = Math.max(-24, Math.min(24, (a - 90) * 0.4));
      const pulse = (1 + 0.18 * Math.sin(Math.PI * f)) * (0.5 + 0.5 * op);
      traveler.style.transform = `translate3d(${(x - sw / 2).toFixed(1)}px,${(y - scroll - sh / 2).toFixed(1)}px,0) rotate(${lean.toFixed(1)}deg) scale(${pulse.toFixed(3)})`;
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const scheduleLayout = () => {
      if (!layoutRaf) layoutRaf = requestAnimationFrame(layout);
    };

    // Flame flicker, only while a rocket is showing and on screen.
    const flicker = reduce
      ? 0
      : window.setInterval(() => {
          const near = stage < 0.6 || stage > FORMS.length - 1.6;
          if (!near || document.hidden || lastOp < 0.02) return;
          flameFrame = (flameFrame + 1) % FLAMES.length;
          paint();
        }, 140);

    const ro = new ResizeObserver(scheduleLayout);
    ro.observe(root);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    paint();
    layout();

    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
      cancelAnimationFrame(layoutRaf);
      window.clearInterval(flicker);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [rootRef, sectionIds]);

  return (
    <>
      <svg ref={trailSvgRef} className="journey-trail pointer-events-none absolute left-0 top-0 z-[20]" aria-hidden="true">
        <path ref={trailRef} fill="none" stroke="rgba(124,240,160,0.32)" strokeWidth="2" strokeLinecap="round" strokeDasharray="0.5 11" />
        <g ref={waypointsRef} className="font-mono" />
      </svg>

      <div
        ref={travelerRef}
        className="journey-traveler pointer-events-none fixed left-0 top-0 z-[25] font-mono will-change-transform"
        style={{ transform: "translate3d(-200px,-200px,0)" }}
        aria-hidden="true"
      >
        {Array.from({ length: H }, (_, r) => (
          <span
            key={r}
            ref={el => {
              if (el) rowsRef.current[r] = el;
            }}
            className="block whitespace-pre leading-none"
          >
            {FORMS[0].rows[r]}
          </span>
        ))}
      </div>
    </>
  );
}
