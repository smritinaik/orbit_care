"use client";

import { Activity, Orbit, Waves, type LucideIcon } from "lucide-react";
import { useTelemetry } from "@/components/providers/TelemetryProvider";
import { toneText, type Tone } from "@/components/ui/Pill";

const sign = (n: number) => `${n >= 0 ? "+" : ""}${n.toFixed(1)}%`;
const byAbs = (v: number, a: number, b: number): Tone => (Math.abs(v) < a ? "ok" : Math.abs(v) < b ? "warn" : "bad");

function Card({ bg, value, unit, label, icon: Icon, note, tone }: {
  bg: string; value: string; unit: string; label: string; icon: LucideIcon; note: string; tone: Tone;
}) {
  return (
    <div className={`flex min-h-[112px] flex-col justify-between rounded-[20px] p-3.5 md:rounded-[22px] md:p-5 ${bg}`}>
      <div>
        <div className="text-xl font-bold leading-tight md:text-2xl">
          {value} <span className="text-[10px] font-normal text-muted md:text-sm">{unit}</span>
        </div>
        <div className="text-[10px] text-muted md:text-sm">{label}</div>
      </div>
      <div className="flex items-end justify-between">
        <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-white md:h-11 md:w-11 md:rounded-xl">
          <Icon size={18} />
        </span>
        <span className={`text-[10.5px] font-bold md:text-sm ${toneText[tone]}`}>{note}</span>
      </div>
    </div>
  );
}

export default function VitalCards() {
  const { latest, base, analysis: a } = useTelemetry();

  const hrPct = base && a.hr ? ((a.hr - base.hr) / base.hr) * 100 : null;
  const levelText = { normal: "Normal", watch: "Watch", alert: "High risk", nosignal: "No signal", calibrating: "Learning" }[a.level];
  const levelTone: Tone = a.level === "normal" ? "ok" : a.level === "watch" ? "warn" : a.level === "alert" ? "bad" : "neutral";

  return (
    <div className="grid h-full grid-cols-3 gap-2.5 md:gap-4">
      <Card
        bg="bg-lilac" icon={Activity} label="Heart rate" unit="bpm"
        value={latest?.finger ? String(Math.round(latest.hr)) : "--"}
        note={hrPct === null ? "--" : sign(hrPct)} tone={hrPct === null ? "neutral" : byAbs(hrPct, 8, 16)}
      />
      <Card
        bg="bg-mint" icon={Waves} label="HRV, rough" unit="ms"
        value={latest && latest.hrv > 0 ? String(Math.round(latest.hrv)) : "--"}
        note={a.hrv ? sign(-a.hrvDropPct) : "--"} tone={a.hrv ? byAbs(a.hrvDropPct, 15, 30) : "neutral"}
      />
      <Card
        bg="bg-sand" icon={Orbit} label="Readiness" unit="/ 100"
        value={a.readiness === null ? "--" : String(a.readiness)}
        note={levelText} tone={levelTone}
      />
    </div>
  );
}