import React, { useEffect, useRef, useState } from "react";

/**
  Types its text out once it scrolls into view, with a block cursor. The full text is in the
  markup from the start (for search engines and screen readers); only the visible part animates.
*/
export default function Typed({
  text,
  speed = 28,
  className = "",
  cursor = true,
  keepCursor = false,
  start = true
}: {
  text: string;
  speed?: number;
  className?: string;
  cursor?: boolean;
  /** Keep the cursor blinking after the text is typed (otherwise it goes away). */
  keepCursor?: boolean;
  start?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState<number | null>(null); // null = not hydrated yet: show all
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setShown(0);
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(e => {
      if (e[0]?.isIntersecting) {
        setInView(true);
        io.disconnect();
      }
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || !start || shown === null || shown >= text.length) return;
    const id = window.setTimeout(() => setShown(s => (s ?? 0) + 1), speed);
    return () => window.clearTimeout(id);
  }, [inView, start, shown, text.length, speed]);

  const n = shown ?? text.length;
  const done = shown === null || shown >= text.length;
  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.slice(0, n)}
        <span className="invisible">{text.slice(n)}</span>
      </span>
      {cursor && (keepCursor || !done) && <span aria-hidden="true" className="cursor-block" />}
    </span>
  );
}
