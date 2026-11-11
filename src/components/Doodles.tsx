import React, { useId } from "react";

/* Playful hand-drawn style accents (squiggles, rings, zigzags...) used across the dark redesign.
   All are tiny inline SVGs; motion comes from cheap CSS transform animations (see .bob in index.css). */

type DoodleProps = { color?: string; size?: number; stroke?: number; className?: string };

export const Squiggle = ({ color = "#3DE3F2", size = 72, stroke = 5, className = "" }: DoodleProps) => (
  <svg className={className} width={size} height={size * 0.4} viewBox="0 0 66 28" fill="none" aria-hidden="true">
    <path d="M3 14c5-9 10-9 15 0s10 9 15 0 10-9 15 0 10 9 15 0" stroke={color} strokeWidth={stroke} strokeLinecap="round" />
  </svg>
);

export const Zigzag = ({ color = "#FFC93C", size = 64, stroke = 5, className = "" }: DoodleProps) => (
  <svg className={className} width={size} height={size * 0.5} viewBox="0 0 56 28" fill="none" aria-hidden="true">
    <path d="M3 23 14 5l11 18L36 5l11 18" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Ring = ({ color = "#FF3D81", size = 44, stroke = 5, className = "" }: DoodleProps) => (
  <svg className={className} width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
    <circle cx="20" cy="20" r="14" stroke={color} strokeWidth={stroke} />
  </svg>
);

export const Square = ({ color = "#6C5CFF", size = 40, stroke = 5, className = "" }: DoodleProps) => (
  <svg className={className} width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
    <rect x="8" y="8" width="24" height="24" rx="3" stroke={color} strokeWidth={stroke} />
  </svg>
);

export const Arc = ({ color = "#FF3D81", size = 48, stroke = 5, className = "" }: DoodleProps) => (
  <svg className={className} width={size} height={size * 0.6} viewBox="0 0 44 26" fill="none" aria-hidden="true">
    <path d="M5 22a17 17 0 0 1 34 0" stroke={color} strokeWidth={stroke} strokeLinecap="round" />
  </svg>
);

export const Plus = ({ color = "#3DE3F2", size = 30, stroke = 5, className = "" }: DoodleProps) => (
  <svg className={className} width={size} height={size} viewBox="0 0 30 30" fill="none" aria-hidden="true">
    <path d="M15 4v22M4 15h22" stroke={color} strokeWidth={stroke} strokeLinecap="round" />
  </svg>
);

export const Dot = ({ color = "#FFC93C", size = 14, className = "" }: DoodleProps) => (
  <svg className={className} width={size} height={size} viewBox="0 0 10 10" aria-hidden="true">
    <circle cx="5" cy="5" r="5" fill={color} />
  </svg>
);

/** Comic "BOOM" burst sticker. */
export const Burst = ({ color = "#FF3D81", size = 90, className = "", children }: DoodleProps & { children?: React.ReactNode }) => {
  const pts: string[] = [];
  for (let i = 0; i < 24; i++) {
    const r = i % 2 ? 31 : 48;
    const a = (Math.PI * 2 * i) / 24 - Math.PI / 2;
    pts.push(`${(50 + r * Math.cos(a)).toFixed(1)},${(50 + r * Math.sin(a)).toFixed(1)}`);
  }
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
        <polygon points={pts.join(" ")} fill={color} stroke="#0A0915" strokeWidth="3" strokeLinejoin="round" />
      </svg>
      {children && <div className="absolute inset-0 flex items-center justify-center text-center">{children}</div>}
    </div>
  );
};

/** Absolutely positioned wrapper that gently bobs (compositor-only; paused for reduced motion). */
export const Floaty = ({
  className = "",
  duration = 7,
  delay = 0,
  rotate = 0,
  children
}: {
  className?: string;
  duration?: number;
  delay?: number;
  rotate?: number;
  children: React.ReactNode;
}) => (
  <div className={`absolute pointer-events-none ${className}`} style={{ transform: `rotate(${rotate}deg)` }} aria-hidden="true">
    <div className="bob" style={{ animationDuration: `${duration}s`, animationDelay: `${delay}s` }}>
      {children}
    </div>
  </div>
);

/** Circular rotating text sticker. */
export const SpinBadge = ({
  text,
  size = 132,
  bg = "#FFC93C",
  fg = "#0A0915",
  children,
  className = ""
}: {
  text: string;
  size?: number;
  bg?: string;
  fg?: string;
  children?: React.ReactNode;
  className?: string;
}) => {
  const id = useId().replace(/:/g, "");
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }} aria-hidden="true">
      <svg className="spin-slow absolute inset-0" viewBox="0 0 200 200" width={size} height={size}>
        <defs>
          <path id={`c${id}`} d="M100 100m-74 0a74 74 0 1 1 148 0a74 74 0 1 1-148 0" />
        </defs>
        <circle cx="100" cy="100" r="98" fill={bg} stroke="#0A0915" strokeWidth="4" />
        <text fill={fg} fontFamily="JetBrains Mono, monospace" fontWeight="700" fontSize="17" letterSpacing="3.5">
          <textPath href={`#c${id}`}>{text}</textPath>
        </text>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center" style={{ color: fg }}>
        {children}
      </div>
    </div>
  );
};

/** Rounded capsule stroke (a chunky "dash" accent). */
export const Capsule = ({ color = "#3DE3F2", size = 70, className = "" }: DoodleProps) => (
  <svg className={className} width={size} height={size} viewBox="0 0 70 70" fill="none" aria-hidden="true">
    <path d="M18 52 52 18" stroke={color} strokeWidth="13" strokeLinecap="round" />
  </svg>
);

// Deterministic pseudo-random so the cloud bank is organic but identical on every render.
const seeded = (seed: number) => () => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};

// The cloud bank is drawn on a very wide canvas (aspect 6.67:1) and anchored bottom-centre with "slice".
// As long as the element is no wider than 6.67× its height, the artwork is only ever cropped at the
// sides and never at the top, so the bubbles can't be sliced off into a hard horizontal line.
// Give the element a height of at least ~15vw (see App.tsx) to keep that true on wide screens.
const CLOUD_W = 2400;
const CLOUD_H = 360;

type Puff = [number, number, number];
const puffRow = (seed: number, step: number, y: [number, number], r: [number, number], from = -60, to = CLOUD_W + 60): Puff[] => {
  const rnd = seeded(seed);
  const out: Puff[] = [];
  for (let x = from; x <= to; x += step * (0.75 + rnd() * 0.5)) {
    out.push([Math.round(x), Math.round(y[0] + rnd() * (y[1] - y[0])), Math.round(r[0] + rnd() * (r[1] - r[0]))]);
  }
  return out;
};

// Computed once at module load (not per render).
const CLOUD_SPECKS = puffRow(11, 70, [40, 150], [5, 16]);
const CLOUD_BACK = puffRow(23, 62, [150, 215], [34, 72]);
const CLOUD_MID = puffRow(37, 78, [205, 255], [48, 92]);
const CLOUD_FRONT = puffRow(53, 96, [262, 292], [62, 102]);

type CloudTone = [color: string, opacity: number];
const LIGHT_TONES: CloudTone[] = [["#FFFFFF", 0.22], ["#E4E1FF", 0.34], ["#ECEAFF", 0.55]];

/** Soft cloud bank: translucent bubble layers (specks, back, mid) in front of the sky, then a solid
    front layer in `front` that melts seamlessly into the next section's background. */
export const CloudBank = ({
  front = "#F6F1E7",
  tones = LIGHT_TONES,
  className = ""
}: {
  front?: string;
  tones?: CloudTone[];
  className?: string;
}) => (
  <svg className={className} viewBox={`0 0 ${CLOUD_W} ${CLOUD_H}`} preserveAspectRatio="xMidYMax slice" aria-hidden="true">
    <g fill={tones[0][0]} opacity={tones[0][1]}>
      {CLOUD_SPECKS.map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} />)}
    </g>
    <g fill={tones[1][0]} opacity={tones[1][1]}>
      {CLOUD_BACK.map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} />)}
    </g>
    <g fill={tones[2][0]} opacity={tones[2][1]}>
      {CLOUD_MID.map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} />)}
    </g>
    <g fill={front}>
      {CLOUD_FRONT.map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} />)}
      <rect x="-80" y="296" width={CLOUD_W + 160} height="70" />
    </g>
  </svg>
);
