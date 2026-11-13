"use client";

import React, { useEffect, useState } from "react";

interface SensorStatusCardProps {
  fingerDetected: boolean;
  lastUpdatedAt: number | null;
  hasData: boolean;
}

export function SensorStatusCard({
  fingerDetected,
  lastUpdatedAt,
  hasData,
}: SensorStatusCardProps) {
  const [secondsAgo, setSecondsAgo] = useState<string>("0.4 s ago");

  useEffect(() => {
    const updateTimer = () => {
      if (!lastUpdatedAt) {
        setSecondsAgo("Waiting...");
        return;
      }
      const diff = Math.max(0.1, (Date.now() - lastUpdatedAt) / 1000);
      setSecondsAgo(`${diff.toFixed(1)} s ago`);
    };

    updateTimer();
    const id = setInterval(updateTimer, 200);
    return () => clearInterval(id);
  }, [lastUpdatedAt]);

  const qualityBars = !hasData ? 0 : fingerDetected ? 4 : 2;
  const qualityLabel = !hasData
    ? "No signal"
    : fingerDetected
    ? "Good"
    : "Weak";

  const rows = [
    { label: "Device", value: "ESP32 DevKit" },
    { label: "Sensor", value: "MAX30102" },
    {
      label: "Fingertip",
      value: fingerDetected ? "Detected" : "Not detected",
      highlight: !fingerDetected,
    },
    {
      label: "Signal quality",
      custom: (
        <div className="flex items-center gap-2">
          <div className="flex items-end gap-0.5 h-3">
            {[1, 2, 3, 4, 5].map((bar) => (
              <span
                key={bar}
                style={{ height: `${bar * 20}%` }}
                className={`w-1 rounded-full transition-colors ${
                  bar <= qualityBars ? "bg-emerald-500" : "bg-neutral-200"
                }`}
              />
            ))}
          </div>
          <span className="font-semibold text-neutral-900">{qualityLabel}</span>
        </div>
      ),
    },
    { label: "Sample rate", value: "1 per second" },
    { label: "Last reading", value: secondsAgo },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xs border border-black/[0.04] flex flex-col justify-between">
      <h2 className="text-sm font-medium text-neutral-400 mb-3">
        Sensor status
      </h2>

      <div className="divide-y divide-neutral-100">
        {rows.map((row) => (
          <div
            key={row.label}
            className="py-2.5 first:pt-1 last:pb-1 flex items-center justify-between text-xs"
          >
            <span className="text-neutral-400">{row.label}</span>
            {row.custom ? (
              row.custom
            ) : (
              <span
                className={`font-semibold ${
                  row.highlight ? "text-amber-600" : "text-neutral-900"
                }`}
              >
                {row.value}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}