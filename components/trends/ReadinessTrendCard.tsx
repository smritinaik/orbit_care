"use client";

import React, { useState, useMemo } from "react";

export type TrendTimeframe = "1W" | "2W" | "Mission";

export interface DailyTrendPoint {
  dayLabel: string;
  readiness: number;
  restingHr: number;
  hrv: number;
  sleepHours: number;
}

interface ReadinessTrendCardProps {
  dailySeries: DailyTrendPoint[];
  liveScoreAdjustment?: number;
}

export function ReadinessTrendCard({
  dailySeries,
  liveScoreAdjustment = 0,
}: ReadinessTrendCardProps) {
  const [timeframe, setTimeframe] = useState<TrendTimeframe>("2W");

  const visibleSeries = useMemo(() => {
    const count = timeframe === "1W" ? 7 : timeframe === "2W" ? 14 : dailySeries.length;
    const sliced = dailySeries.slice(-count);
    return sliced.length > 0
      ? sliced
      : [{ dayLabel: "Day 47", readiness: 38, restingHr: 77, hrv: 41, sleepHours: 5.9 }];
  }, [dailySeries, timeframe]);

  const currentScore = Math.max(
    5,
    Math.min(100, Math.round(visibleSeries[visibleSeries.length - 1].readiness + liveScoreAdjustment))
  );
  const startScore = Math.round(visibleSeries[0].readiness);
  const delta = currentScore - startScore;

  // 3-day forecast projection
  const forecastPoints = useMemo(() => {
    const slope =
      visibleSeries.length > 1
        ? (currentScore - visibleSeries[Math.max(0, visibleSeries.length - 4)].readiness) / 3
        : -2.5;
    const clampedSlope = Math.max(-5, Math.min(2, slope || -2.5));
    return [1, 2, 3].map((step) => ({
      dayLabel: `Day ${47 + step}`,
      readiness: Math.max(10, Math.min(100, Math.round(currentScore + clampedSlope * step))),
    }));
  }, [visibleSeries, currentScore]);

  // SVG dimensions
  const width = 620;
  const height = 185;
  const padLeft = 36;
  const padRight = 28;
  const padTop = 34;
  const padBottom = 26;
  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  const totalPoints = visibleSeries.length + forecastPoints.length;
  const getX = (idx: number) => {
    if (totalPoints <= 1) return padLeft + chartW / 2;
    const val = padLeft + (idx / (totalPoints - 1)) * chartW;
    return Number.isFinite(val) ? val : padLeft;
  };

  const getY = (score: number) => {
    const safeScore = Number.isFinite(score) ? score : 50;
    const val = padTop + chartH - (safeScore / 100) * chartH;
    return Number.isFinite(val) ? val : padTop + chartH / 2;
  };

  const historyPath = useMemo(() => {
    return visibleSeries
      .map((pt, idx) => {
        const val = idx === visibleSeries.length - 1 ? currentScore : pt.readiness;
        return `${idx === 0 ? "M" : "L"} ${getX(idx).toFixed(1)} ${getY(val).toFixed(1)}`;
      })
      .join(" ");
  }, [visibleSeries, currentScore, totalPoints]);

  const currentIdx = visibleSeries.length - 1;
  const currentX = getX(currentIdx);
  const currentY = getY(currentScore);

  const forecastPath = useMemo(() => {
    const start = `M ${currentX.toFixed(1)} ${currentY.toFixed(1)}`;
    const rest = forecastPoints
      .map((fp, idx) => `L ${getX(currentIdx + 1 + idx).toFixed(1)} ${getY(fp.readiness).toFixed(1)}`)
      .join(" ");
    return `${start} ${rest}`;
  }, [currentX, currentY, forecastPoints, currentIdx, totalPoints]);

  const lastForecastX = getX(totalPoints - 1);
  const lastForecastY = getY(forecastPoints[forecastPoints.length - 1].readiness);

  // Alert zone below score 45
  const alertTopY = getY(45);
  const alertBottomY = getY(0);

  const midIdx = Math.floor(visibleSeries.length / 2);

  return (
    <div className="bg-[#DCE8F8] rounded-3xl p-6 shadow-xs border border-black/[0.03] flex flex-col justify-between">
      {/* Header Row */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900">
              {currentScore} / 100
            </span>
          </div>
          <p className="mt-1 text-xs text-neutral-500">
            {delta <= 0
              ? `Down ${Math.abs(delta)} points in ${visibleSeries.length} days`
              : `Up ${delta} points in ${visibleSeries.length} days`}
          </p>
        </div>

        {/* Timeframe Controls + Menu */}
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1 text-xs">
            {(["1W", "2W", "Mission"] as TrendTimeframe[]).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
                  timeframe === tf
                    ? "font-bold text-neutral-900"
                    : "font-medium text-neutral-400 hover:text-neutral-700"
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          <button
            aria-label="Chart options"
            className="p-1 text-neutral-400 hover:text-neutral-700 transition"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="5" r="1.75" />
              <circle cx="12" cy="12" r="1.75" />
              <circle cx="12" cy="19" r="1.75" />
            </svg>
          </button>
        </div>
      </div>

      {/* SVG Trend & Forecast Chart */}
      <div className="relative mt-4 w-full">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-48 overflow-visible">
          {/* Shaded Pink Alert Zone */}
          <rect
            x={padLeft}
            y={alertTopY}
            width={chartW}
            height={Math.max(10, alertBottomY - alertTopY)}
            fill="#E5B8C4"
            fillOpacity={0.38}
          />
          <text
            x={padLeft + 8}
            y={alertTopY + 14}
            className="fill-[#D4533B] text-[10px] font-medium"
          >
            Alert zone
          </text>

          {/* Vertical Dashed Marker at Current Day */}
          <line
            x1={currentX}
            y1={currentY}
            x2={currentX}
            y2={alertBottomY}
            stroke="#5B8DEF"
            strokeWidth="1.2"
            strokeDasharray="3 3"
          />

          {/* Solid Historical Line */}
          <path
            d={historyPath}
            fill="none"
            stroke="#467CE6"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Dashed Forecast Line */}
          <path
            d={forecastPath}
            fill="none"
            stroke="#467CE6"
            strokeWidth="2"
            strokeDasharray="4 4"
            strokeLinecap="round"
          />

          <text
            x={lastForecastX - 6}
            y={lastForecastY - 10}
            textAnchor="end"
            className="fill-[#5B8DEF] text-[10px] font-medium"
          >
            Forecast
          </text>

          {/* Current Point Ring */}
          <circle
            cx={currentX}
            cy={currentY}
            r="4.5"
            fill="#FFFFFF"
            stroke="#467CE6"
            strokeWidth="2.5"
          />

          {/* End Forecast Ring */}
          <circle
            cx={lastForecastX}
            cy={lastForecastY}
            r="4"
            fill="#FFFFFF"
            stroke="#467CE6"
            strokeWidth="2"
          />

          {/* Floating Dark Pill Badge */}
          <g transform={`translate(${currentX - 22}, ${Math.max(2, currentY - 34)})`}>
            <rect width="44" height="22" rx="11" fill="#1E1E1E" />
            <text
              x="22"
              y="14.5"
              textAnchor="middle"
              className="fill-white text-[11px] font-bold"
            >
              {currentScore}
            </text>
          </g>

          {/* X-Axis Day Labels */}
          <text x={padLeft} y={height - 4} className="fill-neutral-400 text-[10px]">
            {visibleSeries[0]?.dayLabel ?? "Day 33"}
          </text>
          <text
            x={getX(midIdx)}
            y={height - 4}
            textAnchor="middle"
            className="fill-neutral-400 text-[10px]"
          >
            {visibleSeries[midIdx]?.dayLabel ?? "Day 40"}
          </text>
          <text
            x={currentX}
            y={height - 4}
            textAnchor="middle"
            className="fill-neutral-400 text-[10px]"
          >
            {visibleSeries[currentIdx]?.dayLabel ?? "Day 47"}
          </text>
          <text
            x={lastForecastX}
            y={height - 4}
            textAnchor="end"
            className="fill-neutral-400 text-[10px]"
          >
            Day 50
          </text>
        </svg>
      </div>
    </div>
  );
}