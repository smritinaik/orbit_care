"use client";

import React from "react";

interface SolarActivityCardProps {
  hasActiveStorm: boolean;
  cmeCount: number;
}

export function SolarActivityCard({ hasActiveStorm, cmeCount }: SolarActivityCardProps) {
  // 7-day sparkline data points
  const points = [42, 45, 41, 43, 44, 42, 43, 41, 44, 42, 45, 48, 56, hasActiveStorm ? 88 : 50];
  
  const width = 640;
  const height = 180;
  const padLeft = 36;
  const padRight = 28;
  const padTop = 32;
  const padBottom = 26;
  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  const minVal = 30;
  const maxVal = 100;

  const getX = (idx: number) => padLeft + (idx / (points.length - 1)) * chartW;
  const getY = (val: number) => padTop + chartH - ((val - minVal) / (maxVal - minVal)) * chartH;

  const pathData = points
    .map((v, i) => `${i === 0 ? "M" : "L"} ${getX(i).toFixed(1)} ${getY(v).toFixed(1)}`)
    .join(" ");

  const advisoryY = getY(62);
  const peakX = getX(points.length - 1);
  const peakY = getY(points[points.length - 1]);

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xs border border-black/[0.04] flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-sm font-medium text-neutral-400">Solar particle activity</h2>
          <p className="mt-0.5 text-xs text-neutral-400">
            Last 7 days, relative level {cmeCount > 0 ? `(${cmeCount} CMEs recorded)` : ""}
          </p>
        </div>
      </div>

      <div className="relative mt-4 w-full">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-44 overflow-visible">
          {/* Advisory Level Dashed Line */}
          <line
            x1={padLeft}
            y1={advisoryY}
            x2={width - padRight}
            y2={advisoryY}
            stroke="#B88B14"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <text x={padLeft + 4} y={advisoryY - 6} className="fill-[#B88B14] text-[10px] font-semibold">
            Advisory level
          </text>

          {/* Solar Particle Activity Curve */}
          <path
            d={pathData}
            fill="none"
            stroke="#467CE6"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Peak Warning Dot */}
          <circle cx={peakX} cy={peakY} r="5" fill="#DF4D38" stroke="#FFFFFF" strokeWidth="2" />

          {/* Event in Progress Floating Badge */}
          {hasActiveStorm && (
            <g transform={`translate(${peakX - 105}, ${Math.max(4, peakY - 32)})`}>
              <rect width="102" height="24" rx="12" fill="#1E1E1E" />
              <circle cx="14" cy="12" r="3.5" fill="#DF4D38" />
              <text x="26" y="15.5" className="fill-white text-[10px] font-bold">
                Event in progress
              </text>
            </g>
          )}

          {/* X-Axis Days */}
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, idx, arr) => {
            const x = padLeft + (idx / (arr.length - 1)) * chartW;
            return (
              <text key={day} x={x} y={height - 2} textAnchor="middle" className="fill-neutral-400 text-[10px]">
                {day}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
}