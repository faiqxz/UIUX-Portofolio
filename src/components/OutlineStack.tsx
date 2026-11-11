import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

/* Stacked giant headline: the same phrase repeated on several rows, mixing outline and solid words.
   Rows drift sideways in opposite directions as you scroll (transform-only, so it stays cheap). */

export type StackWord = { t: string; fill?: string };

export default function OutlineStack({
  rows,
  className = "",
  children
}: {
  rows: StackWord[][];
  className?: string;
  children?: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const right = useTransform(scrollYProgress, [0, 1], ["-7%", "7%"]);
  const left = useTransform(scrollYProgress, [0, 1], ["7%", "-7%"]);

  return (
    <div ref={ref} className={`relative overflow-x-clip select-none ${className}`} aria-hidden="true">
      {rows.map((row, i) => (
        <motion.div
          key={i}
          style={{ x: i % 2 ? left : right }}
          className="flex justify-center gap-[0.22em] whitespace-nowrap font-display uppercase leading-[0.9] text-[clamp(3.25rem,12.5vw,10.5rem)]"
        >
          {row.map((w, j) =>
            w.fill ? (
              <span key={j} style={{ color: w.fill }}>
                {w.t}
              </span>
            ) : (
              <span key={j} className="text-outline">
                {w.t}
              </span>
            )
          )}
        </motion.div>
      ))}
      {children}
    </div>
  );
}
