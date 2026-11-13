"use client";

import React from "react";

interface BaselineCardProps {
  baselineBpm: number;
  baselineHrv: number;
  isLocked: boolean;
  progressPct: number;
  onRecalibrate: () => void;
}

export function BaselineCard({
  baselineBpm,
  baselineHrv,
  isLocked,
  progressPct,
  onRecalibrate,
}: BaselineCardProps) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-xs border border-black/[0.04] flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-neutral-400">Baseline</h2>
          <span
            className={`px-3 py-0.5 rounded-full text-xs font-semibold ${
              isLocked
                ? "bg-emerald-100/80 text-emerald-700"
                : "bg-amber-100/80 text-amber-700"
            }`}
          >
            {isLocked ? "Locked" : "Learning..."}
          </span>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-neutral-400">Heart rate</span>
            <span className="font-bold text-neutral-900">
              {baselineBpm} bpm
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-400">HRV</span>
            <span className="font-bold text-neutral-900">{baselineHrv} ms</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-400">Learned over</span>
            <span className="font-bold text-neutral-900">30 s</span>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
          <div
            style={{ width: `${progressPct}%` }}
            className="h-full bg-[#7AA7F7] rounded-full transition-all duration-500"
          />
        </div>

        <button
          onClick={onRecalibrate}
          className="px-5 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 active:scale-[0.99] text-white text-xs font-semibold transition-all cursor-pointer"
        >
          Recalibrate
        </button>
      </div>
    </div>
  );
}