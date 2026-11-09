import type { ReactNode } from "react";

export const toneStyles = {
  ok: "bg-[#d6f0dc] text-[#2d8a57]",
  warn: "bg-[#fbebc4] text-[#a97a0a]",
  bad: "bg-[#fbd9d5] text-[#d2473b]",
  neutral: "bg-[#e8e9ec] text-[#6b7080]",
  info: "bg-mist text-[#3b6bb5]",
} as const;

export type Tone = keyof typeof toneStyles;

export const toneText: Record<Tone, string> = {
  ok: "text-ok",
  warn: "text-[#a97a0a]",
  bad: "text-bad",
  neutral: "text-muted",
  info: "text-[#3b6bb5]",
};

export default function Pill({ tone = "ok", className = "", children }: { tone?: Tone; className?: string; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold ${toneStyles[tone]} ${className}`}>
      {children}
    </span>
  );
}