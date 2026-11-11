import React, { useEffect, useId, useRef } from "react";

/*
  RocketJourney — a traveler that flies down a dotted flight path through every section and
  morphs into that section's symbol as it crosses each boundary:
    rocket (hero) → phone (work) → sparkle (about) → bolt (experience) → heart (orgs) → rocket (launch pad)
  The last section is the launch pad: the path swings to the centre, and the little rocket shrinks and
  fades out as it "docks" into the big 3D rocket there.

  Performance notes (this has to stay smooth on low-end phones):
  - The flight path is built from measured section positions only when layout changes, and sampled
    analytically into a lookup table. Per scroll frame we do a binary search, nothing else.
  - The traveler moves with a single compositor-only transform on a fixed element.
  - The morph rewrites one ~96-point path on a 64px SVG, and only while inside a transition zone.
*/

const NS = "http://www.w3.org/2000/svg";
const POINTS = 96;

type Pt = [number, number];
type Rgb = [number, number, number];

interface Form {
  d: string;
  from: string;
  to: string;
  /** Base rotation. 180 = nose points along the direction of travel (down the page). */
  face: number;
  /** How strongly the form leans into the path's curves (1 = fully follows the tangent). */
  follow: number;
}

// Single-contour silhouettes in a 100×100 box, one per section in page order.
const FORMS: Form[] = [
  { d: "M50 3C61 13 67 28 67 48L67 63L81 76L81 90L66 83L61 91L39 91L34 83L19 90L19 76L33 63L33 48C33 28 39 13 50 3Z", from: "#FF3D81", to: "#FF9F43", face: 180, follow: 1 },
  { d: "M38 5L62 5Q73 5 73 16L73 84Q73 95 62 95L38 95Q27 95 27 84L27 16Q27 5 38 5Z", from: "#6C5CFF", to: "#3DE3F2", face: 0, follow: 0.3 },
  { d: "M50 3C53 33 67 47 97 50C67 53 53 67 50 97C47 67 33 53 3 50C33 47 47 33 50 3Z", from: "#FFC93C", to: "#FF9F43", face: 0, follow: 0.3 },
  { d: "M61 3L21 56L46 56L37 97L80 40L54 40L64 3Z", from: "#3DE3F2", to: "#6C5CFF", face: 0, follow: 0.3 },
  { d: "M50 90C21 69 5 52 5 33C5 18 16 8 30 8C39 8 46 13 50 21C54 13 61 8 70 8C84 8 95 18 95 33C95 52 79 69 50 90Z", from: "#FF3D81", to: "#B86CFF", face: 0, follow: 0.3 },
  { d: "M50 3C61 13 67 28 67 48L67 63L81 76L81 90L66 83L61 91L39 91L34 83L19 90L19 76L33 63L33 48C33 28 39 13 50 3Z", from: "#FF3D81", to: "#FFC93C", face: 180, follow: 1 }
];

const hex = (h: string): Rgb => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const mix = (a: Rgb, b: Rgb, t: number) =>
  `rgb(${Math.round(a[0] + (b[0] - a[0]) * t)},${Math.round(a[1] + (b[1] - a[1]) * t)},${Math.round(a[2] + (b[2] - a[2]) * t)})`;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** Sample a closed path into evenly spaced points, clockwise, starting nearest the top-centre,
    so any two forms can be morphed point-by-point without twisting. */
function sampleForm(d: string, host: SVGSVGElement): Pt[] {
  const path = document.createElementNS(NS, "path");
  path.setAttribute("d", d);
  host.appendChild(path);
  const len = path.getTotalLength();
  const pts: Pt[] = [];
  for (let i = 0; i < POINTS; i++) {
    const p = path.getPointAtLength((len * i) / POINTS);
    pts.push([p.x, p.y]);
  }
  host.removeChild(path);

  let area = 0;
  for (let i = 0; i < POINTS; i++) {
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[(i + 1) % POINTS];
    area += x1 * y2 - x2 * y1;
  }
  if (area < 0) pts.reverse();

  let best = 0;
  let bestD = Infinity;
  pts.forEach(([x, y], i) => {
    const dd = (x - 50) ** 2 + (y + 20) ** 2;
    if (dd < bestD) {
      bestD = dd;
      best = i;
    }
  });
  return pts.slice(best).concat(pts.slice(0, best));
}

function morphPath(a: Pt[], b: Pt[], t: number) {
  let s = "";
  for (let i = 0; i < POINTS; i++) {
    const x = a[i][0] + (b[i][0] - a[i][0]) * t;
    const y = a[i][1] + (b[i][1] - a[i][1]) * t;
    s += (i ? "L" : "M") + x.toFixed(1) + " " + y.toFixed(1);
  }
  return s + "Z";
}

export default function RocketJourney({
  rootRef,
  sectionIds
}: {
  rootRef: React.RefObject<HTMLDivElement | null>;
  sectionIds: string[];
}) {
  const uid = useId().replace(/:/g, "");
  const trailSvgRef = useRef<SVGSVGElement>(null);
  const trailRef = useRef<SVGPathElement>(null);
  const waypointsRef = useRef<SVGGElement>(null);
  const travelerRef = useRef<HTMLDivElement>(null);
  const shapeRef = useRef<SVGPathElement>(null);
  const stopARef = useRef<SVGStopElement>(null);
  const stopBRef = useRef<SVGStopElement>(null);
  const flameRef = useRef<SVGGElement>(null);
  const windowRef = useRef<SVGGElement>(null);
  const notchRef = useRef<SVGGElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root: HTMLDivElement | null = rootRef.current;
    const traveler = travelerRef.current;
    const shape = shapeRef.current;
    const trail = trailRef.current;
    const trailSvg = trailSvgRef.current;
    if (!root || !traveler || !shape || !trail || !trailSvg) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Sample all forms once.
    const scratch = document.createElementNS(NS, "svg") as SVGSVGElement;
    scratch.setAttribute("width", "0");
    scratch.setAttribute("height", "0");
    scratch.style.position = "absolute";
    scratch.style.visibility = "hidden";
    document.body.appendChild(scratch);
    const forms = FORMS.map(f => sampleForm(f.d, scratch));
    scratch.remove();
    const fromRgb = FORMS.map(f => hex(f.from));
    const toRgb = FORMS.map(f => hex(f.to));

    // Flight-path lookup table (filled by layout()).
    let xs = new Float32Array(0);
    let ys = new Float32Array(0);
    let as = new Float32Array(0);
    let count = 0;
    let bounds: number[] = [];
    let zone = 180;
    let size = 64;
    let anchor = 0.56;
    let rootTop = 0;

    let fadeFrom = Infinity;
    let fadeTo = Infinity;

    let lastStage = -1;
    let lastIdx = -1;
    let lastOp = -1;
    let raf = 0;
    let layoutRaf = 0;

    const layout = () => {
      layoutRaf = 0;
      const rootRect = root.getBoundingClientRect();
      rootTop = rootRect.top + window.scrollY;
      const W = root.clientWidth;
      const H = root.offsetHeight;
      const els = sectionIds.map(id => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
      const tops = els.map(el => el.getBoundingClientRect().top + window.scrollY - rootTop);
      if (tops.length < 2) return;
      const lastI = tops.length - 1;

      const desktop = W >= 1024;
      const tablet = W >= 768;
      size = desktop ? 64 : tablet ? 46 : 34;
      anchor = desktop ? 0.56 : 0.5;
      zone = desktop ? 200 : 140;
      // Gutter distance of the traveler's centre: wide enough that the wiggle (amp) plus the morph
      // pulse (scale 1.3) never push it past the viewport edge.
      const inset = desktop ? Math.min(100, Math.max(64, W * 0.05)) : tablet ? 34 : 23;
      // Desktop weaves between the left and right gutters; narrow screens keep to the right edge.
      // The launch pad (last section) pulls the path to the centre, where the big rocket stands.
      const side = (i: number) => (i === lastI ? W / 2 : desktop && i % 2 === 1 ? inset : W - inset);
      const amp = desktop ? 16 : 0;
      const stepLen = 420;
      bounds = tops.slice(1);
      // Dock point a third of the way into the launch pad; the traveler fades out on the way there.
      const dockY = tops[lastI] + Math.min(els[lastI].offsetHeight * 0.32, 340);
      fadeFrom = bounds[lastI - 1] + zone * 0.4;
      fadeTo = Math.max(dockY, fadeFrom + 1);

      // Vertical-tangent cubic segments: always smooth at the joints and monotonic in y.
      const segs: [number, number, number, number][] = [];
      let cx = side(0);
      let cy = tops[0] + (desktop ? 150 : 110);
      const start: Pt = [cx, cy];
      const to = (x: number, y: number) => {
        if (y <= cy + 1) return;
        segs.push([cx, cy, x, y]);
        cx = x;
        cy = y;
      };
      for (let i = 0; i < tops.length; i++) {
        const sx = side(i);
        const end = i < lastI ? bounds[i] - zone : Math.min(dockY, H - 120);
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
          const bx = u * u * u + 3 * u * u * t; // weight of x0 (both first control points share x0)
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

      trailSvg.setAttribute("width", String(W));
      trailSvg.setAttribute("height", String(H));
      trailSvg.setAttribute("viewBox", `0 0 ${W} ${H}`);
      trail.setAttribute("d", d);

      // Waypoint markers where the path crosses each section boundary.
      const g = waypointsRef.current;
      if (g) {
        g.innerHTML = "";
        bounds.forEach((b, i) => {
          const x = (side(i) + side(i + 1)) / 2;
          const c = document.createElementNS(NS, "circle");
          c.setAttribute("cx", x.toFixed(1));
          c.setAttribute("cy", b.toFixed(1));
          c.setAttribute("r", desktop ? "6" : "4");
          c.setAttribute("fill", "#0A0915");
          c.setAttribute("stroke", FORMS[i + 1].from);
          c.setAttribute("stroke-width", "2.5");
          g.appendChild(c);
        });
      }

      traveler.style.width = `${size}px`;
      traveler.style.height = `${size}px`;
      lastStage = -1;
      update();
    };

    const update = () => {
      raf = 0;
      if (!count) return;
      const scroll = window.scrollY - rootTop;
      const target = scroll + window.innerHeight * anchor;

      let x: number;
      let y: number;
      let a: number;
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

      // Which form are we in, and how far through the morph to the next one?
      let stage = 0;
      for (let i = 0; i < bounds.length; i++) {
        const b = bounds[i];
        if (y >= b + zone) {
          stage = i + 1;
          continue;
        }
        if (y > b - zone) {
          const u = clamp01((y - (b - zone)) / (2 * zone));
          stage = i + u * u * (3 - 2 * u);
        }
        break;
      }
      const last = FORMS.length - 1;
      const k = Math.min(Math.floor(stage), last);
      const k2 = Math.min(k + 1, last);
      const f = stage - k;

      if (Math.abs(stage - lastStage) > 0.0004) {
        lastStage = stage;
        shape.setAttribute("d", morphPath(forms[k], forms[k2], f));
        const cA = mix(fromRgb[k], fromRgb[k2], f);
        stopARef.current?.setAttribute("stop-color", cA);
        stopBRef.current?.setAttribute("stop-color", mix(toRgb[k], toRgb[k2], f));
        traveler.style.setProperty("--rj-glow", cA.replace("rgb(", "rgba(").replace(")", ",0.42)"));
        const weight = (idx: number) => clamp01(1 - Math.abs(stage - idx) * 2.2);
        const rocket = Math.max(weight(0), weight(last));
        if (flameRef.current) {
          flameRef.current.style.opacity = String(rocket);
          flameRef.current.style.animationPlayState = rocket > 0.02 && !reduceMotion ? "running" : "paused";
        }
        if (windowRef.current) windowRef.current.style.opacity = String(rocket);
        if (notchRef.current) notchRef.current.style.opacity = String(weight(1));
      }

      // Docking: shrink and fade out into the launch pad.
      const op = y <= fadeFrom ? 1 : clamp01(1 - (y - fadeFrom) / (fadeTo - fadeFrom));
      if (Math.abs(op - lastOp) > 0.005) {
        lastOp = op;
        traveler.style.opacity = op.toFixed(3);
        traveler.style.visibility = op < 0.01 ? "hidden" : "";
      }

      const rot = lerp(FORMS[k].face, FORMS[k2].face, f) + (a - 90) * lerp(FORMS[k].follow, FORMS[k2].follow, f);
      const pulse = (1 + 0.3 * Math.sin(Math.PI * f)) * (0.45 + 0.55 * op);
      traveler.style.transform = `translate3d(${(x - size / 2).toFixed(1)}px,${(y - scroll - size / 2).toFixed(1)}px,0) rotate(${rot.toFixed(1)}deg) scale(${pulse.toFixed(3)})`;

      // Little shockwave each time a new form fully lands.
      const idx = Math.round(stage);
      if (lastIdx === -1) lastIdx = idx;
      else if (idx !== lastIdx && Math.abs(stage - idx) < 0.12) {
        lastIdx = idx;
        if (!reduceMotion && ringRef.current?.animate) {
          ringRef.current.animate(
            [
              { transform: "scale(0.5)", opacity: 0.9 },
              { transform: "scale(2.4)", opacity: 0 }
            ],
            { duration: 650, easing: "cubic-bezier(.2,.7,.2,1)" }
          );
        }
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const scheduleLayout = () => {
      if (!layoutRaf) layoutRaf = requestAnimationFrame(layout);
    };

    const ro = new ResizeObserver(scheduleLayout);
    ro.observe(root);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    layout();

    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
      cancelAnimationFrame(layoutRaf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [rootRef, sectionIds]);

  return (
    <>
      {/* Dotted flight path drawn behind the traveler, in page coordinates */}
      <svg ref={trailSvgRef} className="pointer-events-none absolute left-0 top-0 z-[20]" aria-hidden="true">
        <path
          ref={trailRef}
          fill="none"
          stroke="rgba(124,108,255,0.5)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="0.5 12"
        />
        <g ref={waypointsRef} />
      </svg>

      {/* The traveler itself (fixed; moved with a single transform) */}
      <div
        ref={travelerRef}
        className="pointer-events-none fixed left-0 top-0 z-[25] will-change-transform"
        style={{ width: 64, height: 64, transform: "translate3d(-200px,-200px,0)" }}
        aria-hidden="true"
      >
        <div
          className="absolute left-1/2 top-1/2 h-[240%] w-[240%] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "radial-gradient(circle, var(--rj-glow, rgba(255,61,129,.42)) 0%, transparent 62%)" }}
        />
        <div ref={ringRef} className="absolute inset-0 rounded-full border-2 border-cream/80 opacity-0" />
        <svg viewBox="0 0 100 130" className="absolute left-0 top-0 h-[130%] w-full overflow-visible">
          <defs>
            <linearGradient id={`g${uid}`} x1="0" y1="0" x2="0" y2="1">
              <stop ref={stopARef} offset="0" stopColor="#FF3D81" />
              <stop ref={stopBRef} offset="1" stopColor="#FF9F43" />
            </linearGradient>
          </defs>
          <g ref={flameRef} className="rj-flame">
            <path d="M39 89C40 106 46 117 50 128C54 117 60 106 61 89Z" fill="#FF9F43" />
            <path d="M44 89C45 100 48 108 50 115C52 108 55 100 56 89Z" fill="#FFE29A" />
          </g>
          <path ref={shapeRef} d={FORMS[0].d} fill={`url(#g${uid})`} stroke="#0A0915" strokeWidth="3" strokeLinejoin="round" />
          <g ref={windowRef}>
            <circle cx="50" cy="42" r="8.5" fill="#0A0915" stroke="#F6F1E7" strokeWidth="3" />
          </g>
          <g ref={notchRef} style={{ opacity: 0 }}>
            <rect x="33" y="17" width="34" height="66" rx="5" fill="#0A0915" opacity="0.35" />
            <rect x="42" y="9" width="16" height="4" rx="2" fill="#0A0915" />
          </g>
        </svg>
      </div>
    </>
  );
}
