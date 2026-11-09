"use client";

import { useState } from "react";
import { useTelemetry } from "@/components/providers/TelemetryProvider";

const WINDOWS = [
  { label: "30s", n: 30 },
  { label: "2m", n: 120 },
  { label: "5m", n: 300 },
];
const W = 300;
const H = 100;

export default function HeartRateCard() {
  const { history, latest, base, mode, setMode } = useTelemetry();
  const [win, setWin] = useState(1);

  const data = history.slice(-WINDOWS[win].n).filter((r) => r.hr > 0);
  const vals = data.map((r) => r.hr);
  const band = base ? Math.max(base.hrStd, 2) * 2 : 0;
  const lo = Math.min(...vals, base ? base.hr - 8 : 55) - 2;
  const hi = Math.max(...vals, base ? base.hr + 8 : 70) + 2;
  const y = (v: number) => H - ((v - lo) / (hi - lo)) * H;
  const pts = data.map((r, i) => [(i / Math.max(data.length - 1, 1)) * W, y(r.hr)] as const);
  const last = pts[pts.length - 1];

  const noSignal = mode === "live" && latest && !latest.finger;

  return (
    <div className="flex h-full flex-col rounded-[22px] bg-mist p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[26px] font-bold leading-tight md:text-[32px]">
            {latest?.finger ? Math.round(latest.hr) : "--"} bpm
          </div>
          <div className="text-xs text-muted md:text-sm">
            {mode === "live" ? "Live from ESP32" : "Simulated data"}
          </div>
        </div>

        {/* Data source switch */}
        <div className="flex rounded-full bg-white/60 p-0.5 text-[11px] font-semibold">
          {(["simulated", "live"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-full px-2.5 py-1 transition-colors ${mode === m ? "bg-shell text-white" : "text-muted"}`}
            >
              {m === "live" ? "Live" : "Sim"}
            </button>
          ))}
        </div>
      </div>

      <div className="relative mt-3 min-h-28 flex-1 md:min-h-32">
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
          {base && <rect x={0} y={y(base.hr + band)} width={W} height={y(base.hr - band) - y(base.hr + band)} fill="white" opacity={0.55} />}
          {pts.length > 1 && (
            <polyline
              points={pts.map((p) => p.join(",")).join(" ")}
              fill="none"
              stroke="#4e86d6"
              strokeWidth={2}
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          )}
        </svg>

        {base && <span className="absolute bottom-0 left-1 text-[10px] text-[#6f93c8]">Your baseline</span>}

        {last && !noSignal && (
          <>
            <span
              className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-brand"
              style={{ left: `${(last[0] / W) * 100}%`, top: `${(last[1] / H) * 100}%` }}
            />
            <span
              className="absolute -translate-x-full -translate-y-[calc(100%+10px)] whitespace-nowrap rounded-full bg-[#1d1e21] px-3 py-1 text-[11px] font-semibold text-white"
              style={{ left: `${(last[0] / W) * 100}%`, top: `${(last[1] / H) * 100}%` }}
            >
              {Math.round(latest!.hr)} bpm
            </span>
          </>
        )}

        {(noSignal || data.length < 2) && (
          <div className="absolute inset-0 flex items-center justify-center text-center text-xs text-muted">
            {noSignal ? "Place a fingertip lightly on the sensor" : "Waiting for data..."}
          </div>
        )}
      </div>

      <div className="mt-3 flex gap-4 text-xs">
        {WINDOWS.map((w, i) => (
          <button
            key={w.label}
            onClick={() => setWin(i)}
            className={i === win ? "font-bold text-ink" : "text-muted"}
          >
            {w.label}
          </button>
        ))}
      </div>
    </div>
  );
}