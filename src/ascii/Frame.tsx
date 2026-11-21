import React from "react";

const STYLES = {
  single: { tl: "┌", tr: "┐", bl: "└", br: "┘", h: "─", v: "│" },
  double: { tl: "╔", tr: "╗", bl: "╚", br: "╝", h: "═", v: "║" },
  rounded: { tl: "╭", tr: "╮", bl: "╰", br: "╯", h: "─", v: "│" },
  dashed: { tl: "┌", tr: "┐", bl: "└", br: "┘", h: "╌", v: "╎" },
  ascii: { tl: "+", tr: "+", bl: "+", br: "+", h: "-", v: "|" }
} as const;

const H_RUN = 400;
const V_RUN = 300;

/**
  A box drawn with real box-drawing characters that stretches to any size: corners are glyphs,
  the edges are long runs of ─ / │ clipped by overflow. An optional title (and meta on the right)
  sits in the top edge:  ┌─[ title ]───────[ meta ]─┐
*/
export default function Frame({
  title,
  meta,
  variant = "single",
  color = "var(--color-line)",
  titleColor,
  className = "",
  bodyClassName = "",
  as: Tag = "div",
  children
}: {
  title?: React.ReactNode;
  meta?: React.ReactNode;
  variant?: keyof typeof STYLES;
  color?: string;
  titleColor?: string;
  className?: string;
  bodyClassName?: string;
  as?: "div" | "article" | "section" | "li" | "form";
  children: React.ReactNode;
}) {
  const s = STYLES[variant];
  const run = (ch: string) => ch.repeat(H_RUN);
  return (
    <Tag className={`frame relative min-w-0 ${className}`} style={{ ["--frame" as string]: color }}>
      <div className="frame__edge flex" aria-hidden={title || meta ? undefined : true}>
        <span aria-hidden="true" className="shrink-0">{s.tl}{s.h}</span>
        {title && (
          <>
            <span aria-hidden="true" className="shrink-0" style={{ color: titleColor }}>[ </span>
            <span className="min-w-0 truncate" style={{ color: titleColor }}>{title}</span>
            <span aria-hidden="true" className="shrink-0" style={{ color: titleColor }}> ]</span>
          </>
        )}
        <span aria-hidden="true" className="w-0 min-w-[1ch] flex-1 overflow-hidden whitespace-nowrap">{run(s.h)}</span>
        {meta && (
          <span className="hidden shrink-0 whitespace-nowrap text-dim sm:inline">
            <span aria-hidden="true">[ </span>
            {meta}
            <span aria-hidden="true"> ]</span>
          </span>
        )}
        <span aria-hidden="true" className="shrink-0">{meta ? s.h : ""}{s.tr}</span>
      </div>
      <div className="relative">
        <span aria-hidden="true" className="frame__side left-0">{(s.v + "\n").repeat(V_RUN)}</span>
        <span aria-hidden="true" className="frame__side right-0">{(s.v + "\n").repeat(V_RUN)}</span>
        <div className={`px-[2.5ch] py-4 ${bodyClassName}`}>{children}</div>
      </div>
      <div className="frame__edge flex" aria-hidden="true">
        <span>{s.bl}</span>
        <span className="w-0 flex-1 overflow-hidden whitespace-nowrap">{run(s.h)}</span>
        <span>{s.br}</span>
      </div>
    </Tag>
  );
}
