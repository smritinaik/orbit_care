"use client";

import { Activity, Moon, Radiation, Waves, type LucideIcon } from "lucide-react";
import { useTelemetry } from "@/components/providers/TelemetryProvider";
import Pill, { toneText, type Tone } from "@/components/ui/Pill";

type Status = "normal" | "watch" | "alert" | "na";
const STATUS: Record<Status, { label: string; tone: Tone }> = {
  normal: { label: "Normal", tone: "ok" },
  watch: { label: "Watch", tone: "warn" },
  alert: { label: "High risk", tone: "bad" },
  na: { label: "No signal", tone: "neutral" },
};
const grade = (v: number, a: number, b: number): Status => (Math.abs(v) < a ? "normal" : Math.abs(v) < b ? "watch" : "alert");
const sign = (n: number) => `${n >= 0 ? "+" : ""}${n.toFixed(1)}%`;

type Row = { icon: LucideIcon; name: string; sub: string; reading: string; vs: string; status: Status; source: string };

const COLS = "md:grid-cols-[2.4fr_1fr_1fr_1.1fr_1fr]";

export default function SignalsTable() {
  const { base, mode, analysis: a } = useTelemetry();
  const live = mode === "live";

  const hrPct = base && a.hr ? ((a.hr - base.hr) / base.hr) * 100 : null;
  const rows: Row[] = [
    {
      icon: Activity, name: "Heart rate", sub: live ? "ESP32 live" : "Simulated",
      reading: a.hr ? `${Math.round(a.hr)} bpm` : "--", vs: hrPct === null ? "--" : sign(hrPct),
      status: hrPct === null ? "na" : grade(hrPct, 8, 16), source: live ? "Live" : "Simulated",
    },
    {
      icon: Waves, name: "HRV", sub: "From beat gaps",
      reading: a.hrv ? `${Math.round(a.hrv)} ms` : "--", vs: a.hrv ? sign(-a.hrvDropPct) : "--",
      status: a.hrv ? grade(a.hrvDropPct, 15, 30) : "na", source: live ? "Rough" : "Simulated",
    },
    { icon: Moon, name: "Sleep quality", sub: "Last night", reading: "86%", vs: "-2.0%", status: "normal", source: "Simulated" },
    { icon: Radiation, name: "Radiation dose", sub: "Per day", reading: "0.5 mSv", vs: "+0.1", status: "normal", source: "Simulated" },
  ];

  const issues = rows.filter((r) => r.status === "watch" || r.status === "alert").length;
  const title =
    a.level === "calibrating" ? "Learning your baseline"
    : a.level === "nosignal" ? "Waiting for a signal"
    : issues === 0 ? "All signals within baseline"
    : `${issues} signal${issues > 1 ? "s" : ""} need attention`;

  return (
    <section>
      <h2 className="text-lg font-bold md:text-xl">{title}</h2>

      <div className={`mt-4 hidden px-0 text-xs text-muted md:grid ${COLS}`}>
        <span>Signal</span><span>Reading</span><span>Vs baseline</span><span>Status</span><span>Source</span>
      </div>

      <div className="mt-3 space-y-3 md:mt-2 md:space-y-2">
        {rows.map((r) => {
          const s = STATUS[r.status];
          const Icon = r.icon;
          return (
            <div key={r.name} className={`grid grid-cols-[1fr_auto] items-center gap-3 md:py-1 ${COLS}`}>
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-shell text-white md:h-11 md:w-11">
                  <Icon size={18} />
                </span>
                <div>
                  <div className="text-sm font-bold">{r.name}</div>
                  <div className="text-xs text-muted">{r.sub}</div>
                </div>
              </div>

              {/* Phone: reading + status stacked on the right */}
              <div className="flex flex-col items-end gap-1 md:hidden">
                <span className="text-sm font-bold">{r.reading}</span>
                <Pill tone={s.tone} className="px-2.5 py-0.5 text-[11px]">{s.label}</Pill>
              </div>

              {/* Desktop: separate columns */}
              <span className="hidden text-sm font-bold md:block">{r.reading}</span>
              <span className={`hidden text-sm font-semibold md:block ${r.status === "normal" ? "text-muted" : toneText[s.tone]}`}>{r.vs}</span>
              <span className="hidden md:block"><Pill tone={s.tone}>{s.label}</Pill></span>
              <span className="hidden text-sm text-muted md:block">{r.source}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}