"use client";

import React from "react";

interface DataModeCardProps {
  mode: "simulated" | "live";
  overlay: boolean;
  onModeChange: (newMode: "simulated" | "live") => void;
  onOverlayChange: (enabled: boolean) => void;
}

export function DataModeCard({
  mode,
  overlay,
  onModeChange,
  onOverlayChange,
}: DataModeCardProps) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-xs border border-black/[0.04] flex flex-col justify-between">
      <div>
        <h2 className="text-sm font-medium text-neutral-400 mb-3">Data mode</h2>

        {/* Pill Toggle */}
        <div className="grid grid-cols-2 rounded-full bg-neutral-100 p-1">
          <button
            onClick={() => onModeChange("simulated")}
            className={`py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              mode === "simulated"
                ? "bg-neutral-900 text-white shadow-xs"
                : "text-neutral-400 hover:text-neutral-700"
            }`}
          >
            Simulated
          </button>
          <button
            onClick={() => onModeChange("live")}
            className={`py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              mode === "live"
                ? "bg-neutral-900 text-white shadow-xs"
                : "text-neutral-400 hover:text-neutral-700"
            }`}
          >
            Live ESP32
          </button>
        </div>

        <div className="mt-3.5 text-xs leading-relaxed">
          <p className="font-medium text-neutral-800">
            {mode === "live"
              ? "Live mode measures heart rate and HRV."
              : "Simulated mode generates mission telemetry."}
          </p>
          <p className="text-neutral-400">
            Sleep and radiation stay simulated.
          </p>
        </div>
      </div>

      {/* Scenario Overlay Switch */}
      <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-neutral-900">Scenario overlay</p>
          <p className="text-[11px] text-neutral-400 mt-0.5">
            Adds mission drift to live data
          </p>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={overlay}
          onClick={() => onOverlayChange(!overlay)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
            overlay ? "bg-neutral-900" : "bg-neutral-200"
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
              overlay ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>
    </div>
  );
}