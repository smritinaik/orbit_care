"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  ReadinessTrendCard,
  DailyTrendPoint,
} from "@/components/trends/ReadinessTrendCard";
import { FatigueForecastCard } from "@/components/trends/FatigueForecastCard";
import { MetricSparklineCard } from "@/components/trends/MetricSparklineCard";
import { CountermeasureCoachBar } from "@/components/trends/CountermeasureCoachBar";

// 21-day mission baseline dataset culminating at Day 47 (matching design)
const BASE_MISSION_SERIES: DailyTrendPoint[] = [
  { dayLabel: "Day 27", readiness: 94, restingHr: 61, hrv: 67, sleepHours: 7.5 },
  { dayLabel: "Day 28", readiness: 93, restingHr: 61, hrv: 66, sleepHours: 7.4 },
  { dayLabel: "Day 29", readiness: 92, restingHr: 62, hrv: 66, sleepHours: 7.4 },
  { dayLabel: "Day 30", readiness: 92, restingHr: 62, hrv: 65, sleepHours: 7.3 },
  { dayLabel: "Day 31", readiness: 91, restingHr: 62, hrv: 65, sleepHours: 7.3 },
  { dayLabel: "Day 32", readiness: 91, restingHr: 62, hrv: 65, sleepHours: 7.3 },
  { dayLabel: "Day 33", readiness: 91, restingHr: 62, hrv: 65, sleepHours: 7.3 },
  { dayLabel: "Day 34", readiness: 91, restingHr: 63, hrv: 64, sleepHours: 7.2 },
  { dayLabel: "Day 35", readiness: 86, restingHr: 62, hrv: 63, sleepHours: 7.0 },
  { dayLabel: "Day 36", readiness: 83, restingHr: 64, hrv: 61, sleepHours: 6.9 },
  { dayLabel: "Day 37", readiness: 78, restingHr: 66, hrv: 58, sleepHours: 6.7 },
  { dayLabel: "Day 38", readiness: 73, restingHr: 68, hrv: 54, sleepHours: 6.4 },
  { dayLabel: "Day 39", readiness: 67, restingHr: 71, hrv: 50, sleepHours: 6.2 },
  { dayLabel: "Day 40", readiness: 60, restingHr: 73, hrv: 47, sleepHours: 6.0 },
  { dayLabel: "Day 41", readiness: 54, restingHr: 75, hrv: 44, sleepHours: 5.9 },
  { dayLabel: "Day 42", readiness: 51, restingHr: 76, hrv: 42, sleepHours: 5.9 },
  { dayLabel: "Day 43", readiness: 47, restingHr: 77, hrv: 41, sleepHours: 5.9 },
  { dayLabel: "Day 47", readiness: 38, restingHr: 77, hrv: 41, sleepHours: 5.9 },
];

export default function TrendsPage() {
  const [liveBpm, setLiveBpm] = useState<number | null>(null);
  const [liveHrv, setLiveHrv] = useState<number | null>(null);
  const [highlightCoach, setHighlightCoach] = useState(false);

  // Poll /api/telemetry so live ESP32 data dynamically nudges Day 47 metrics
  useEffect(() => {
    let active = true;
    const poll = async () => {
      try {
        const res = await fetch("/api/telemetry", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (!active || !Array.isArray(data.history) || data.history.length === 0) return;

        const latest = data.history[data.history.length - 1];
        if (Number.isFinite(latest.heartRate)) {
          setLiveBpm(Math.round(latest.heartRate));
        }
        if (Array.isArray(latest.ibis) && latest.ibis.length > 2) {
          let sqSum = 0;
          for (let i = 1; i < latest.ibis.length; i++) {
            const d = latest.ibis[i] - latest.ibis[i - 1];
            sqSum += d * d;
          }
          setLiveHrv(Math.round(Math.sqrt(sqSum / (latest.ibis.length - 1))));
        }
      } catch {
        // Fallback to mission baseline silently
      }
    };

    poll();
    const id = setInterval(poll, 2000);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, []);

  const series = useMemo(() => {
    const copy = [...BASE_MISSION_SERIES];
    const lastIdx = copy.length - 1;
    if (liveBpm !== null) {
      // Blend live heart rate softly with Day 47 resting baseline
      copy[lastIdx] = {
        ...copy[lastIdx],
        restingHr: Math.round((copy[lastIdx].restingHr + liveBpm) / 2),
      };
    }
    if (liveHrv !== null) {
      copy[lastIdx] = {
        ...copy[lastIdx],
        hrv: Math.round((copy[lastIdx].hrv + liveHrv) / 2),
      };
    }
    return copy;
  }, [liveBpm, liveHrv]);

  const latestDay = series[series.length - 1];
  const baselineHr = 62;
  const baselineHrv = 65;
  const baselineSleep = 7.3;

  const hrDelta = latestDay.restingHr - baselineHr;
  const hrvDelta = latestDay.hrv - baselineHrv;
  const sleepDelta = +(latestDay.sleepHours - baselineSleep).toFixed(1);

  const handleSeeCountermeasures = () => {
    setHighlightCoach(true);
    document
      .getElementById("countermeasure-coach")
      ?.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => setHighlightCoach(false), 1800);
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-neutral-900 px-6 py-6 md:px-10">
      {/* Top Header Bar */}
      <header className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl md:text-[28px] font-bold tracking-tight text-neutral-900">
            Trends
          </h1>

          <span className="px-3.5 py-1 rounded-full bg-[#E6E6E4] text-neutral-600 text-xs font-semibold">
            Crew 01, last 14 days
          </span>
        </div>

        {/* Right Header Controls */}
        <div className="flex items-center gap-2.5">
          <button
            aria-label="Search trends"
            className="w-9 h-9 rounded-full bg-white border border-black/[0.05] flex items-center justify-center text-neutral-600 hover:bg-neutral-50 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" strokeLinecap="round" />
            </svg>
          </button>

          <button
            aria-label="Notifications"
            className="w-9 h-9 rounded-full bg-white border border-black/[0.05] flex items-center justify-center text-neutral-600 hover:bg-neutral-50 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" />
            </svg>
          </button>

          <div className="flex items-center gap-2 bg-white border border-black/[0.05] rounded-full pl-1.5 pr-3 py-1">
            <span className="w-6 h-6 rounded-full bg-[#C7D7F5]" />
            <span className="text-xs font-semibold text-neutral-800">Crew 01</span>
            <svg className="w-3.5 h-3.5 text-neutral-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </header>

      {/* Top Row: Readiness Trend Chart (2 cols) + Fatigue Forecast (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <ReadinessTrendCard dailySeries={series} />
        </div>
        <div className="lg:col-span-1">
          <FatigueForecastCard
            readinessScore={latestDay.readiness}
            onSeeCountermeasures={handleSeeCountermeasures}
          />
        </div>
      </div>

      {/* Middle Row: 3 Pastel Metric Sparkline Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
        <MetricSparklineCard
          valueText={`${latestDay.restingHr} bpm`}
          subtitle="Resting heart rate"
          deltaText={`${hrDelta >= 0 ? `+${hrDelta}` : hrDelta} vs baseline`}
          deltaTone={hrDelta > 8 ? "danger" : "good"}
          bgColor="#E6DDF7"
          strokeColor="#8766D6"
          values={series.slice(-10).map((d) => d.restingHr)}
        />

        <MetricSparklineCard
          valueText={`${latestDay.hrv} ms`}
          subtitle="HRV, rough"
          deltaText={`${hrvDelta >= 0 ? `+${hrvDelta}` : hrvDelta} vs baseline`}
          deltaTone={hrvDelta < -10 ? "danger" : "good"}
          bgColor="#D7EEDD"
          strokeColor="#3A965B"
          values={series.slice(-10).map((d) => d.hrv)}
        />

        <MetricSparklineCard
          valueText={`${latestDay.sleepHours.toFixed(1)} h`}
          subtitle="Sleep, simulated"
          deltaText={`${sleepDelta >= 0 ? `+${sleepDelta}` : sleepDelta} h vs baseline`}
          deltaTone={sleepDelta < -0.8 ? "warning" : "good"}
          bgColor="#F6ECC6"
          strokeColor="#B88B14"
          values={series.slice(-10).map((d) => d.sleepHours)}
        />
      </div>

      {/* Bottom Row: Countermeasure Coach */}
      <div className="mt-5">
        <CountermeasureCoachBar highlighted={highlightCoach} />
      </div>

      {/* Footer Note */}
      <footer className="mt-5 text-[11px] text-neutral-400">
        {liveBpm !== null
          ? "Live ESP32 heart rate synced with 14-day mission readiness model."
          : "Sample data for design preview."}
      </footer>
    </div>
  );
}