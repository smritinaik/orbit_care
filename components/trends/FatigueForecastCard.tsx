"use client";

import React from "react";

interface FatigueForecastCardProps {
  readinessScore: number;
  onSeeCountermeasures: () => void;
}

export function FatigueForecastCard({
  readinessScore,
  onSeeCountermeasures,
}: FatigueForecastCardProps) {
  const isHighRisk = readinessScore < 45;
  const isModerate = readinessScore >= 45 && readinessScore < 68;

  const riskLabel = isHighRisk
    ? "High risk"
    : isModerate
    ? "Moderate risk"
    : "Nominal";

  const riskBadgeStyle = isHighRisk
    ? "bg-[#DF5A46] text-white"
    : isModerate
    ? "bg-amber-500 text-white"
    : "bg-emerald-600 text-white";

  const description = isHighRisk
    ? "Without rest, readiness may fall below 30 within about 3 days."
    : isModerate
    ? "Mild circadian drift detected. Maintain scheduled recovery blocks."
    : "Crew readiness is stable across the current mission window.";

  return (
    <div className="relative overflow-hidden bg-[#222222] text-white rounded-3xl p-6 shadow-xs flex flex-col justify-between min-h-[260px]">
      {/* Decorative Wireframe Rounded Rectangles in Bottom Right */}
      <svg
        className="pointer-events-none absolute -bottom-8 -right-6 w-48 h-40 opacity-20"
        viewBox="0 0 200 160"
        fill="none"
      >
        <rect
          x="35"
          y="35"
          width="130"
          height="110"
          rx="18"
          transform="rotate(-14 35 35)"
          stroke="#FFFFFF"
          strokeWidth="1.5"
        />
        <rect
          x="65"
          y="55"
          width="120"
          height="100"
          rx="16"
          transform="rotate(-14 65 55)"
          stroke="#FFFFFF"
          strokeWidth="1.2"
        />
      </svg>

      <div>
        <h2 className="text-xl font-bold tracking-tight text-white">
          Fatigue forecast
        </h2>
        <p className="mt-2 text-xs leading-relaxed text-neutral-300 max-w-[240px]">
          {description}
        </p>

        <div className="mt-4">
          <span
            className={`inline-block px-3.5 py-1 rounded-full text-xs font-semibold ${riskBadgeStyle}`}
          >
            {riskLabel}
          </span>
        </div>
      </div>

      <div className="mt-8 relative z-10">
        <button
          onClick={onSeeCountermeasures}
          className="px-5 py-2.5 rounded-full bg-[#B9D2F3] hover:bg-[#a8c6ef] active:scale-[0.99] text-neutral-900 text-xs font-bold shadow-[0_3px_0_#7A99C2] transition-all cursor-pointer"
        >
          See countermeasures
        </button>
      </div>
    </div>
  );
}