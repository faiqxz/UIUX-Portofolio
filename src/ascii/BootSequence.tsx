import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import AsciiText from "./AsciiText.tsx";

/*
  Boot intro, played once per browser session before the landing page:
    1. a BIOS screen and a systemd-style boot log,
    2. a terminal login as "guest" that runs ./welcome.sh,
    3. a WELCOME screen in halftone type that waits for the visitor: Enter, any key, a click or a tap
       wipes it up to reveal the site.
  During the boot log any key or click jumps to the welcome screen; the [skip] button goes straight in.

  Whether it plays is decided by a tiny inline script in index.html (before first paint), which adds
  `booting` to <html>. It is skipped for reduced motion, for crawlers and link-preview bots, and
  after the first visit in a session. `?boot` forces it, `?noboot` turns it off.
*/

const KEY = "faiq:booted";
const useIso = typeof window === "undefined" ? useEffect : useLayoutEffect;

type Kind = "head" | "plain" | "dim" | "ok" | "warn" | "blank";
interface Line {
  at: number;
  kind: Kind;
  text: string;
}

const SERVICES: [Kind, string][] = [
  ["ok", "Started Figma design daemon."],
  ["ok", "Mounted /home/faiq/projects (7 case studies)."],
  ["ok", "Loaded React 19 + TypeScript runtime."],
  ["ok", "Started Tailwind v4 style compiler."],
  ["ok", "Connected Gemini and Claude services."],
  ["ok", "Reached target usability-tested.target."],
  ["warn", "Coffee level low. Continuing anyway."],
  ["ok", "Started aurora renderer on tty1."],
  ["ok", "Reached target portfolio.target."]
];

const MEM_FROM = 220;
const MEM_TO = 760;

function buildLog() {
  const lines: Line[] = [
    { at: 0, kind: "head", text: "FAIQ-BIOS v2.6   (c) 2026 Al Ikhsan Faiq" },
    { at: 80, kind: "dim", text: "CPU0: human-centered design core, 4 threads (research, ui, frontend, ai)" },
    { at: MEM_FROM, kind: "plain", text: "Memory test: " },
    { at: 840, kind: "plain", text: "Detecting devices ... figma0  react0  gemini0  claude0" },
    { at: 1000, kind: "plain", text: "Booting faiq-os 26.11 ..." },
    { at: 1120, kind: "blank", text: "" }
  ];
  let t = 1180;
  SERVICES.forEach(([kind, text], i) => {
    lines.push({ at: t, kind, text });
    t += 105 + ((i * 37) % 60); // a little irregular, like a real boot
  });
  lines.push({ at: t + 60, kind: "blank", text: "" });
  lines.push({ at: t + 80, kind: "dim", text: "faiq-os 26.11 faiq-portfolio tty1" });
  lines.push({ at: t + 100, kind: "blank", text: "" });
  return { lines, loginAt: t + 260 };
}

const LOG = buildLog();
const USER = "guest";
const CMD = "./welcome.sh";
const T_LOGIN = LOG.loginAt; // "login: " prompt appears
const T_USER = T_LOGIN + 260; // starts typing "guest"
const CHAR = 75;
const T_LAST = T_USER + USER.length * CHAR + 220; // "Last login" line
const T_SHELL = T_LAST + 260; // shell prompt
const T_CMD = T_SHELL + 200; // starts typing ./welcome.sh
const T_WELCOME = T_CMD + CMD.length * CHAR + 380;
const OUT_MS = 720;

function lastLogin(d: Date) {
  const day = d.toLocaleDateString("en-US", { weekday: "short" });
  const mon = d.toLocaleDateString("en-US", { month: "short" });
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `Last login: ${day} ${mon} ${d.getDate()} ${hh}:${mm} ${d.getFullYear()} on tty1`;
}

const bar = (p: number, n: number) => {
  const k = Math.round(p * n);
  return "#".repeat(k) + ".".repeat(n - k);
};

export function bootWillPlay() {
  return typeof document !== "undefined" && document.documentElement.classList.contains("booting");
}

export default function BootSequence({ onReveal, onDone }: { onReveal: () => void; onDone: () => void }) {
  const [t, setT] = useState(0);
  const [out, setOut] = useState(false);
  const base = useRef(0);
  const outRef = useRef(false);
  const logRef = useRef<HTMLDivElement>(null);
  const continueRef = useRef<HTMLButtonElement>(null);
  const loginDate = useRef(new Date());

  const leave = () => {
    if (outRef.current) return;
    outRef.current = true;
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {
      /* private mode: it will just play again next time */
    }
    document.documentElement.classList.remove("booting");
    setOut(true);
    onReveal();
    window.setTimeout(onDone, OUT_MS);
  };

  // Clock: one state update per ~30ms while the boot log runs; it stops at the welcome screen,
  // which stays until the visitor continues.
  useEffect(() => {
    (window as unknown as { __bootStarted?: boolean }).__bootStarted = true;
    base.current = performance.now();
    let raf = 0;
    let last = 0;
    const tick = (now: number) => {
      if (outRef.current) return;
      const el = now - base.current;
      if (el >= T_WELCOME) {
        setT(T_WELCOME);
        return;
      }
      if (now - last > 30) {
        last = now;
        setT(el);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Any key / click: boot log → welcome screen → site.
  const advance = () => {
    const el = performance.now() - base.current;
    if (el < T_WELCOME) {
      base.current = performance.now() - T_WELCOME;
      setT(T_WELCOME);
    } else leave();
  };
  const advanceRef = useRef(advance);
  advanceRef.current = advance;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Tab" || e.metaKey || e.ctrlKey || e.altKey) return;
      e.preventDefault();
      advanceRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Keep the newest log line in view on short screens.
  useIso(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [t]);

  const welcome = t >= T_WELCOME;

  // Put keyboard focus on the continue button once the welcome screen is up.
  useEffect(() => {
    if (welcome) continueRef.current?.focus({ preventScroll: true });
  }, [welcome]);
  const mem = Math.round(16384 * Math.min(1, Math.max(0, (t - MEM_FROM) / (MEM_TO - MEM_FROM))));
  const typed = (from: number, s: string) => s.slice(0, Math.max(0, Math.min(s.length, Math.floor((t - from) / CHAR))));
  const loadP = Math.min(1, t / T_LOGIN);

  return (
    <div className="boot" data-out={out || undefined} onClick={advance}>
      <div className="boot__crt" aria-hidden="true" />

      {!welcome && (
      <button
        type="button"
        onClick={e => {
          e.stopPropagation();
          leave();
        }}
        className="absolute right-3 top-3 z-10 px-2 py-1 font-mono text-xs text-dim transition-colors hover:text-aurora focus-visible:text-aurora md:right-6 md:top-5"
      >
        [ skip <span aria-hidden="true">⏎</span> ]
      </button>
      )}

      {!welcome ? (
        <div ref={logRef} className="boot__log h-full overflow-hidden px-4 pb-16 pt-12 font-mono text-[11px] leading-[1.55] md:px-10 md:pt-14 md:text-[13px]">
          {LOG.lines.map((ln, i) =>
            t < ln.at ? null : (
              <div key={i} className={ln.kind === "head" ? "text-bright" : ln.kind === "dim" ? "text-dim" : "text-fg"}>
                {ln.kind === "ok" && (
                  <span className="whitespace-pre text-fg">
                    [<span className="text-aurora">  OK  </span>]{" "}
                  </span>
                )}
                {ln.kind === "warn" && (
                  <span className="whitespace-pre text-fg">
                    [<span className="text-amber"> WARN </span>]{" "}
                  </span>
                )}
                {ln.text || " "}
                {ln.at === MEM_FROM && (
                  <span className={mem >= 16384 ? "text-aurora" : "text-bright"}>
                    {mem}K{mem >= 16384 ? " OK" : ""}
                  </span>
                )}
              </div>
            )
          )}
          {t >= T_LOGIN && (
            <div className="text-fg">
              faiq-portfolio login: <span className="text-bright">{typed(T_USER, USER)}</span>
              {t < T_LAST && <span className="cursor-block" />}
            </div>
          )}
          {t >= T_LAST && <div className="text-dim">{lastLogin(loginDate.current)}</div>}
          {t >= T_SHELL && (
            <div className="text-fg">
              <span className="text-aurora">guest@faiq-portfolio</span>:<span className="text-teal">~</span>$ <span className="text-bright">{typed(T_CMD, CMD)}</span>
              <span className="cursor-block" />
            </div>
          )}
          {t < T_LOGIN && (
            <div className="absolute inset-x-4 bottom-6 font-mono text-[11px] text-dim md:inset-x-10 md:text-[13px]" aria-hidden="true">
              loading portfolio [<span className="text-aurora">{bar(loadP, 24)}</span>] {String(Math.round(loadP * 100)).padStart(3, " ")}%
            </div>
          )}
        </div>
      ) : (
        <div className="flex h-full flex-col items-center justify-center px-5 text-center">
          <p className="font-mono text-xs text-dim md:text-sm">
            <span className="text-aurora">guest@faiq-portfolio</span>:<span className="text-teal">~</span>$ ./welcome.sh
          </p>
          <div className="mt-6 w-full max-w-5xl">
            <AsciiText
              lines={[{ text: "Welcome", colors: ["#74eb9b", "#79e3d3", "#b985e0", "#ff5c9a"] }]}
              size="clamp(4rem, 19vw, 13rem)"
              align="center"
              cellRatio={20}
            />
          </div>
          <p className="mt-6 max-w-xl font-mono text-sm leading-relaxed text-fg md:text-base">
            to the portfolio of <span className="text-bright">Al Ikhsan Faiq</span>
            <br />
            <span className="text-dim">UI/UX · Frontend · AI-native design engineering</span>
          </p>
          <button
            ref={continueRef}
            type="button"
            onClick={e => {
              e.stopPropagation();
              leave();
            }}
            className="boot__hint mt-10 px-3 py-2 font-mono text-xs text-aurora md:text-sm"
          >
            <span className="[@media(pointer:coarse)]:hidden">[ press enter or click to continue ]</span>
            <span className="hidden [@media(pointer:coarse)]:inline">[ tap anywhere to continue ]</span>
          </button>
        </div>
      )}
    </div>
  );
}
