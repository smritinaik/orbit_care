"use client";

import { useState } from "react";
import { useTelemetry } from "@/components/providers/TelemetryProvider";

const OPTIONS = [
  { id: "day47", label: "Mission day 47" },
  { id: "isolation", label: "Isolation" },
] as const;

export default function ScenarioCard() {
  const { scenario, setScenario } = useTelemetry();
  const [choice, setChoice] = useState<(typeof OPTIONS)[number]["id"]>("day47");
  const running = scenario !== "earth";
  const runningLabel = OPTIONS.find((o) => o.id === scenario)?.label;

  return (
    <div className="relative flex min-h-[260px] flex-col overflow-hidden rounded-[26px] bg-[#242528] p-6 text-white">
      {/* decoration */}
      <div className="pointer-events-none absolute -bottom-4 -right-10 h-[76px] w-[120px] -rotate-[14deg] rounded-xl border border-white/20" />
      <div className="pointer-events-none absolute -bottom-8 -right-14 h-[76px] w-[120px] -rotate-[8deg] rounded-xl border border-white/20" />

      <h3 className="max-w-[12ch] text-xl font-bold leading-tight md:text-2xl">
        {running ? "Scenario running" : "Run a mission scenario"}
      </h3>
      <p className="mt-3 max-w-[30ch] text-sm leading-relaxed text-[#b9bcc6]">
        {running
          ? `${runningLabel}: readings drift away from your baseline over about 60 seconds.`
          : "Preview how ASTRA flags fatigue drift or isolation stress against your own baseline."}
      </p>

      {!running && (
        <div className="mt-4 flex flex-wrap gap-2">
          {OPTIONS.map((o) => (
            <button
              key={o.id}
              onClick={() => setChoice(o.id)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${choice === o.id ? "bg-white text-ink" : "bg-white/10 text-[#b9bcc6]"}`}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}

      <button
        onClick={() => setScenario(running ? "earth" : choice)}
        className="relative z-10 mt-auto self-start rounded-full bg-[#bbd7f6] px-6 py-3 text-sm font-bold text-ink shadow-[0_4px_0_rgba(141,180,238,0.35)] transition active:translate-y-px"
      >
        {running ? "Stop scenario" : "Start scenario"}
      </button>
    </div>
  );
}