"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { LiveHeartRateCard, TelemetryPoint } from "@/components/vitals/LiveHeartRateCard";
import { SensorStatusCard } from "@/components/vitals/SensorStatusCard";
import { BeatGapsCard } from "@/components/vitals/BeatGapsCard";
import { BaselineCard } from "@/components/vitals/BaselineCard";
import { DataModeCard } from "@/components/vitals/DataModeCard";

export default function VitalsPage() {
  const [history, setHistory] = useState<TelemetryPoint[]>([]);
  const [mode, setMode] = useState<"simulated" | "live">("live");
  const [scenario, setScenario] = useState<string>("nominal");
  const [overlay, setOverlay] = useState<boolean>(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<number | null>(null);

  // Baseline calibration state (30s learning window)
  const [calibrationStartIdx, setCalibrationStartIdx] = useState<number>(0);
  const totalSeenRef = useRef<number>(0);

  const fetchTelemetry = useCallback(async () => {
    try {
      const res = await fetch("/api/telemetry", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();

      if (data.mode) {
        setMode(data.mode === "simulated" ? "simulated" : "live");
      }
      if (data.scenario) setScenario(data.scenario);
      if (typeof data.overlay === "boolean") setOverlay(data.overlay);

      if (Array.isArray(data.history)) {
        setHistory(data.history);
        totalSeenRef.current = data.history.length;
        setLastUpdatedAt(Date.now());
      }
    } catch (err) {
      console.error("Telemetry poll failed:", err);
    }
  }, []);

  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 1000);
    return () => clearInterval(interval);
  }, [fetchTelemetry]);

  const postControl = async (payload: Record<string, unknown>) => {
    try {
      await fetch("/api/telemetry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "control", ...payload }),
      });
      await fetchTelemetry();
    } catch (err) {
      console.error("Failed to send control:", err);
    }
  };

  const handleModeChange = (newMode: "simulated" | "live") => {
    setMode(newMode);
    postControl({ mode: newMode, scenario, overlay });
  };

  const handleOverlayChange = (enabled: boolean) => {
    setOverlay(enabled);
    postControl({ mode, scenario, overlay: enabled });
  };

  const handleRecalibrate = () => {
    setCalibrationStartIdx(Math.max(0, history.length - 1));
    postControl({ mode, scenario, overlay, recalibrate: true });
  };

  // Derive latest reading & baseline stats
  const latest = history[history.length - 1];
  const fingerDetected = latest?.finger ?? true;
  const recentIbis = history.flatMap((h) => h.ibis ?? []).slice(-20);

  const calibrationSlice = history.slice(calibrationStartIdx);
  const samplesCollected = Math.min(30, calibrationSlice.length);
  const isLocked = samplesCollected >= 30 || history.length >= 30;
  const progressPct = Math.min(100, Math.round((samplesCollected / 30) * 100));

  const baselineBpm =
    calibrationSlice.length > 0
      ? Math.round(
          calibrationSlice.reduce((sum, p) => sum + p.heartRate, 0) /
            calibrationSlice.length
        )
      : 62;

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-neutral-900 px-6 py-6 md:px-10">
      {/* Top Header Bar */}
      <header className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl md:text-[28px] font-bold tracking-tight text-neutral-900">
            Live vitals
          </h1>

          {/* Connection Status Pill */}
          <span
            className={`px-3.5 py-1 rounded-full text-xs font-semibold ${
              mode === "live" && history.length > 0
                ? "bg-[#DDF3E4] text-[#217A42]"
                : "bg-amber-100 text-amber-800"
            }`}
          >
            {mode === "live" ? "ESP32 connected" : "Simulated feed"}
          </span>
        </div>

        {/* Right Header Controls (Search, Alert Bell, Crew Selector) */}
        <div className="flex items-center gap-2.5">
          <button
            aria-label="Search vitals"
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

      {/* Top Row: Heart Rate Chart (2 cols) + Sensor Status (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <LiveHeartRateCard history={history} baselineBpm={baselineBpm} />
        </div>
        <div className="lg:col-span-1">
          <SensorStatusCard
            fingerDetected={fingerDetected}
            lastUpdatedAt={lastUpdatedAt}
            hasData={history.length > 0}
          />
        </div>
      </div>

      {/* Bottom Row: Beat Gaps + Baseline + Data Mode */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
        <BeatGapsCard
          ibis={recentIbis}
          fallbackBpm={latest?.heartRate ?? baselineBpm}
        />
        <BaselineCard
          baselineBpm={baselineBpm}
          baselineHrv={65}
          isLocked={isLocked}
          progressPct={progressPct}
          onRecalibrate={handleRecalibrate}
        />
        <DataModeCard
          mode={mode}
          overlay={overlay}
          onModeChange={handleModeChange}
          onOverlayChange={handleOverlayChange}
        />
      </div>

      {/* Footer Note */}
      <footer className="mt-5 text-[11px] text-neutral-400">
        {mode === "live"
          ? "Streaming live ESP32 MAX30102 telemetry at 1 Hz."
          : "Sample data for mission simulation."}
      </footer>
    </div>
  );
}