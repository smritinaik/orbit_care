"use client";

import React, { useState, useMemo } from "react";

export interface TelemetryPoint {
  timestamp?: number;
  heartRate: number;
  finger?: boolean;
  ibis?: number[];
}

interface LiveHeartRateCardProps {
  history: TelemetryPoint[];
  baselineBpm: number;
}

type Timeframe = "30s" | "2m" | "10m";

export function LiveHeartRateCard({
  history,
  baselineBpm,
}: LiveHeartRateCardProps) {
  const [timeframe, setTimeframe] = useState<Timeframe>("2m");

  const sliceCount = timeframe === "30s" ? 30 : timeframe === "2m" ? 120 : 300;
  const points = useMemo(() => {
    const sliced = history.slice(-sliceCount);
    return sliced.length > 0 ? sliced : [{ heartRate: baselineBpm || 63 }];
  }, [history, sliceCount, baselineBpm]);

  const currentBpm = Math.round(points[points.length - 1]?.heartRate ?? 63);

  // SVG Chart dimensions
  const width = 640;
  const height = 190;
  const padLeft = 36;
  const padRight = 24;
  const padTop = 28;
  const padBottom = 26;
  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  // Safe Y-axis domain bounds with absolute fallbacks
  const validPoints = points.map((p) => p.heartRate).filter(Number.isFinite);
  const rawMin = validPoints.length > 0 ? Math.min(...validPoints) : 60;
  const rawMax = validPoints.length > 0 ? Math.max(...validPoints) : 70;
  const minVal = Math.min(50, rawMin - 2);
  const maxVal = Math.max(80, rawMax + 4);
  const valueSpread = maxVal - minVal === 0 ? 1 : maxVal - minVal;

  const yTicks = [80, 70, 60, 50].filter((v) => v >= minVal && v <= maxVal);

  // Strict Y coordinate generator that guarantees a finite number
  const getY = (val: number) => {
    if (!Number.isFinite(val)) return padTop + chartH / 2;
    const computed = padTop + chartH - ((val - minVal) / valueSpread) * chartH;
    return Number.isFinite(computed) ? computed : padTop + chartH / 2;
  };

  const getX = (idx: number) => {
    if (points.length <= 1) return padLeft + chartW;
    const computed = padLeft + (idx / (points.length - 1)) * chartW;
    return Number.isFinite(computed) ? computed : padLeft;
  };

  const pathData = useMemo(() => {
    return points
      .map((pt, i) => `${i === 0 ? "M" : "L"} ${getX(i).toFixed(1)} ${getY(pt.heartRate).toFixed(1)}`)
      .join(" ");
  }, [points, minVal, maxVal]);

  const lastX = getX(points.length - 1);
  const lastY = getY(currentBpm);

  // Baseline band (+/- 3.5 bpm around baseline) with strict finite fallbacks
  const targetBaseline = Number.isFinite(baselineBpm) ? baselineBpm : currentBpm;
  const bandTop = getY(targetBaseline + 3.5);
  const bandBottom = getY(targetBaseline - 3.5);
  const safeRectY = Number.isFinite(bandTop) && Number.isFinite(bandBottom) ? Math.min(bandTop, bandBottom) : padTop;
  const safeRectHeight = Number.isFinite(bandTop) && Number.isFinite(bandBottom) ? Math.max(6, Math.abs(bandBottom - bandTop)) : 20;

  const xLabels =
    timeframe === "30s"
      ? ["30 sec ago", "15 sec ago", "now"]
      : timeframe === "2m"
      ? ["2 min ago", "1 min ago", "now"]
      : ["10 min ago", "5 min ago", "now"];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xs border border-black/[0.04] flex flex-col justify-between">
      {/* Header Row */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-400">Heart rate</p>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-4xl font-bold tracking-tight text-neutral-900">
              {currentBpm} bpm
            </span>
          </div>
          <p className="mt-1 text-xs text-neutral-400">
            Live, 1 reading per second
          </p>
        </div>

        {/* Timeframe Segmented Control */}
        <div className="inline-flex items-center rounded-full bg-neutral-100 p-1">
          {(["30s", "2m", "10m"] as Timeframe[]).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                timeframe === tf
                  ? "bg-neutral-900 text-white shadow-xs"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Line Chart */}
      <div className="relative mt-4 w-full">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-48 overflow-visible"
        >
          {/* Horizontal Grid Lines & Y-Axis Labels */}
          {yTicks.map((tick) => {
            const y = getY(tick);
            return (
              <g key={tick}>
                <text
                  x={12}
                  y={y + 4}
                  className="fill-neutral-400 text-[11px]"
                >
                  {tick}
                </text>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={width - padRight}
                  y2={y}
                  stroke="#F1F3F5"
                  strokeWidth="1"
                />
              </g>
            );
          })}

          {/* Shaded Baseline Zone */}
          <rect
            x={padLeft}
            y={safeRectY}
            width={chartW}
            height={safeRectHeight}
            fill="#6C9BF2"
            fillOpacity={0.12}
            rx={4}
          />
          <text
            x={padLeft + 6}
            y={safeRectY + safeRectHeight + 13}
            className="fill-[#5B8DEF] text-[11px] font-medium"
          >
            Your baseline
          </text>

          {/* Waveform Path */}
          <path
            d={pathData}
            fill="none"
            stroke="#5B8DEF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Live Point Dot */}
          <circle
            cx={Number.isFinite(lastX) ? lastX : padLeft}
            cy={Number.isFinite(lastY) ? lastY : padTop + chartH / 2}
            r="4.5"
            fill="#7AA7F7"
            stroke="#FFFFFF"
            strokeWidth="1.5"
          />

          {/* Floating Dark Pill Badge */}
          <g
            transform={`translate(${Math.min(
              width - padRight - 64,
              Math.max(padLeft, (Number.isFinite(lastX) ? lastX : padLeft) - 34)
            )}, ${Math.max(2, (Number.isFinite(lastY) ? lastY : padTop) - 30)})`}
          >
            <rect width="64" height="22" rx="11" fill="#1E1E1E" />
            <text
              x="32"
              y="14.5"
              textAnchor="middle"
              className="fill-white text-[11px] font-semibold"
            >
              {currentBpm} bpm
            </text>
          </g>

          {/* X-Axis Labels */}
          <text
            x={padLeft}
            y={height - 2}
            className="fill-neutral-400 text-[11px]"
          >
            {xLabels[0]}
          </text>
          <text
            x={padLeft + chartW / 2}
            y={height - 2}
            textAnchor="middle"
            className="fill-neutral-400 text-[11px]"
          >
            {xLabels[1]}
          </text>
          <text
            x={width - padRight}
            y={height - 2}
            textAnchor="end"
            className="fill-neutral-400 text-[11px]"
          >
            {xLabels[2]}
          </text>
        </svg>
      </div>
    </div>
  );
}