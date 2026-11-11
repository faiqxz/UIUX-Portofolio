import React, { useRef, useEffect, useCallback, useMemo, useState } from 'react';
import { gsap } from 'gsap';
import './DotGrid.css';

interface DotProps {
  cx: number;
  cy: number;
  xOffset: number;
  yOffset: number;
  _inertiaApplied: boolean;
}

interface DotGridProps {
  dotSize?: number;
  gap?: number;
  baseColor?: string;
  activeColor?: string;
  proximity?: number;
  speedTrigger?: number;
  shockRadius?: number;
  shockStrength?: number;
  maxSpeed?: number;
  resistance?: number;
  returnDuration?: number;
  className?: string;
  style?: React.CSSProperties;
}

function hexToRgb(hex: string) {
  const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!m) return { r: 0, g: 0, b: 0 };
  return {
    r: parseInt(m[1], 16),
    g: parseInt(m[2], 16),
    b: parseInt(m[3], 16)
  };
}

const INTERACTIVE_QUERY = '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)';

/** True only on mouse/trackpad devices that haven't asked for reduced motion. */
function useInteractivePointer() {
  const [interactive, setInteractive] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(INTERACTIVE_QUERY).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(INTERACTIVE_QUERY);
    const onChange = () => setInteractive(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return interactive;
}

const DotGrid: React.FC<DotGridProps> = ({
  dotSize = 16,
  gap = 32,
  baseColor = '#5227FF',
  activeColor = '#5227FF',
  proximity = 150,
  speedTrigger = 100,
  shockRadius = 250,
  shockStrength = 5,
  maxSpeed = 5000,
  returnDuration = 1.5,
  className = '',
  style
}) => {
  const interactive = useInteractivePointer();

  // Touch / reduced-motion devices get a static CSS dot pattern: identical look, zero JS or canvas cost.
  if (!interactive) {
    const cell = dotSize + gap;
    return (
      <div
        className={`dot-grid ${className}`}
        style={{
          ...style,
          backgroundImage: `radial-gradient(circle, ${baseColor} ${dotSize / 2}px, transparent ${dotSize / 2 + 0.5}px)`,
          backgroundSize: `${cell}px ${cell}px`,
          backgroundPosition: 'center center'
        }}
      />
    );
  }

  return (
    <InteractiveDotGrid
      dotSize={dotSize}
      gap={gap}
      baseColor={baseColor}
      activeColor={activeColor}
      proximity={proximity}
      speedTrigger={speedTrigger}
      shockRadius={shockRadius}
      shockStrength={shockStrength}
      maxSpeed={maxSpeed}
      returnDuration={returnDuration}
      className={className}
      style={style}
    />
  );
};

const InteractiveDotGrid: React.FC<Required<Omit<DotGridProps, 'resistance' | 'style'>> & { style?: React.CSSProperties }> = ({
  dotSize,
  gap,
  baseColor,
  activeColor,
  proximity,
  speedTrigger,
  shockRadius,
  shockStrength,
  maxSpeed,
  returnDuration,
  className,
  style
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<DotProps[]>([]);
  const sizeRef = useRef({ width: 0, height: 0 });
  const pointerRef = useRef({
    x: -9999,
    y: -9999,
    lastTime: 0,
    lastX: 0,
    lastY: 0
  });
  // Render-on-demand state: we only run rAF while something is actually moving.
  const rafRef = useRef(0);
  const activeUntilRef = useRef(0);
  const inViewRef = useRef(false);

  const baseRgb = useMemo(() => hexToRgb(baseColor), [baseColor]);
  const activeRgb = useMemo(() => hexToRgb(activeColor), [activeColor]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { width, height } = sizeRef.current;
    ctx.clearRect(0, 0, width, height);

    const { x: px, y: py } = pointerRef.current;
    const proxSq = proximity * proximity;
    const r = dotSize / 2;
    const highlighted: { x: number; y: number; t: number }[] = [];

    // One batched path for every base-coloured dot instead of ~2000 save/fill/restore calls.
    ctx.beginPath();
    for (const dot of dotsRef.current) {
      const ox = dot.cx + dot.xOffset;
      const oy = dot.cy + dot.yOffset;
      const dx = dot.cx - px;
      const dy = dot.cy - py;
      const dsq = dx * dx + dy * dy;
      if (dsq <= proxSq) {
        highlighted.push({ x: ox, y: oy, t: 1 - Math.sqrt(dsq) / proximity });
        continue;
      }
      ctx.moveTo(ox + r, oy);
      ctx.arc(ox, oy, r, 0, Math.PI * 2);
    }
    ctx.fillStyle = baseColor;
    ctx.fill();

    for (const h of highlighted) {
      const cr = Math.round(baseRgb.r + (activeRgb.r - baseRgb.r) * h.t);
      const cg = Math.round(baseRgb.g + (activeRgb.g - baseRgb.g) * h.t);
      const cb = Math.round(baseRgb.b + (activeRgb.b - baseRgb.b) * h.t);
      ctx.beginPath();
      ctx.arc(h.x, h.y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgb(${cr},${cg},${cb})`;
      ctx.fill();
    }
  }, [proximity, dotSize, baseColor, baseRgb, activeRgb]);

  const tick = useCallback(() => {
    rafRef.current = 0;
    draw();
    if (inViewRef.current && performance.now() < activeUntilRef.current) {
      rafRef.current = requestAnimationFrame(tick);
    }
  }, [draw]);

  /** Keep animating for `ms` from now (covers elastic return tweens), then go idle. */
  const wake = useCallback(
    (ms: number) => {
      activeUntilRef.current = Math.max(activeUntilRef.current, performance.now() + ms);
      if (!rafRef.current && inViewRef.current) {
        rafRef.current = requestAnimationFrame(tick);
      }
    },
    [tick]
  );

  const buildGrid = useCallback(() => {
    const wrap = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const { width, height } = wrap.getBoundingClientRect();
    // Cap DPR: a 3x phone-sized canvas is 9x the pixels for no visible gain on tiny dots.
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    sizeRef.current = { width, height };

    const cell = dotSize + gap;
    const cols = Math.floor((width + gap) / cell);
    const rows = Math.floor((height + gap) / cell);

    const gridW = cell * cols - gap;
    const gridH = cell * rows - gap;

    const startX = (width - gridW) / 2 + dotSize / 2;
    const startY = (height - gridH) / 2 + dotSize / 2;

    const dots: DotProps[] = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        dots.push({ cx: startX + x * cell, cy: startY + y * cell, xOffset: 0, yOffset: 0, _inertiaApplied: false });
      }
    }
    dotsRef.current = dots;
    draw();
  }, [dotSize, gap, draw]);

  useEffect(() => {
    buildGrid();
    const wrap = wrapperRef.current;
    if (!wrap) return;
    const ro = new ResizeObserver(buildGrid);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [buildGrid]);

  // Pause entirely while the section is off-screen.
  useEffect(() => {
    const wrap = wrapperRef.current;
    if (!wrap) return;
    const io = new IntersectionObserver(([entry]) => {
      inViewRef.current = entry.isIntersecting;
      if (entry.isIntersecting) wake(0);
    });
    io.observe(wrap);
    return () => {
      io.disconnect();
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    };
  }, [wake]);

  useEffect(() => {
    const settleMs = (returnDuration + 0.5) * 1000;

    const pushDot = (dot: DotProps, pushX: number, pushY: number, duration: number) => {
      dot._inertiaApplied = true;
      gsap.killTweensOf(dot);
      gsap.to(dot, {
        xOffset: pushX,
        yOffset: pushY,
        duration,
        ease: 'power2.out',
        onComplete: () => {
          gsap.to(dot, {
            xOffset: 0,
            yOffset: 0,
            duration: returnDuration,
            ease: 'elastic.out(1, 0.75)'
          });
          dot._inertiaApplied = false;
        }
      });
    };

    let pending: MouseEvent | null = null;
    let moveRaf = 0;

    const processMove = () => {
      moveRaf = 0;
      const e = pending;
      pending = null;
      const canvas = canvasRef.current;
      if (!e || !canvas || !inViewRef.current) return;

      const now = performance.now();
      const pr = pointerRef.current;
      const dt = pr.lastTime ? Math.max(now - pr.lastTime, 1) : 16;
      let vx = ((e.clientX - pr.lastX) / dt) * 1000;
      let vy = ((e.clientY - pr.lastY) / dt) * 1000;
      let speed = Math.hypot(vx, vy);
      if (speed > maxSpeed) {
        const scale = maxSpeed / speed;
        vx *= scale;
        vy *= scale;
        speed = maxSpeed;
      }
      pr.lastTime = now;
      pr.lastX = e.clientX;
      pr.lastY = e.clientY;

      const rect = canvas.getBoundingClientRect();
      pr.x = e.clientX - rect.left;
      pr.y = e.clientY - rect.top;

      if (speed > speedTrigger) {
        const proxSq = proximity * proximity;
        for (const dot of dotsRef.current) {
          if (dot._inertiaApplied) continue;
          const dx = dot.cx - pr.x;
          const dy = dot.cy - pr.y;
          if (dx * dx + dy * dy < proxSq) {
            pushDot(dot, dx + vx * 0.005, dy + vy * 0.005, 0.3);
          }
        }
      }
      wake(settleMs);
    };

    const onMove = (e: MouseEvent) => {
      if (!inViewRef.current) return;
      pending = e;
      if (!moveRaf) moveRaf = requestAnimationFrame(processMove);
    };

    const onClick = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas || !inViewRef.current) return;
      const rect = canvas.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      if (cx < 0 || cy < 0 || cx > rect.width || cy > rect.height) return;
      const shockSq = shockRadius * shockRadius;
      for (const dot of dotsRef.current) {
        if (dot._inertiaApplied) continue;
        const dx = dot.cx - cx;
        const dy = dot.cy - cy;
        const dsq = dx * dx + dy * dy;
        if (dsq < shockSq) {
          const falloff = Math.max(0, 1 - Math.sqrt(dsq) / shockRadius);
          pushDot(dot, dx * shockStrength * falloff, dy * shockStrength * falloff, 0.4);
        }
      }
      wake(settleMs);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('click', onClick);

    return () => {
      cancelAnimationFrame(moveRaf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('click', onClick);
      for (const dot of dotsRef.current) gsap.killTweensOf(dot);
    };
  }, [maxSpeed, speedTrigger, proximity, returnDuration, shockRadius, shockStrength, wake]);

  return (
    <div className={`dot-grid ${className}`} style={style}>
      <div ref={wrapperRef} className="dot-grid__wrap">
        <canvas ref={canvasRef} className="dot-grid__canvas" />
      </div>
    </div>
  );
};

export default DotGrid;
