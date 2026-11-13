"use client";

import React, { useMemo } from "react";

interface MetricSparklineCardProps {
  valueText: string;
  subtitle: string;
  deltaText: string;
  deltaTone: "danger" | "warning" | "good";
  bgColor: string;
  strokeColor: string;
  values: number[];
}

export function MetricSparklineCard({
  valueText,
  subtitle,
  deltaText,
  deltaTone,
  bgColor,
  strokeColor,
  values,
}: MetricSparklineCardProps) {
  const pathData = useMemo(() => {
    const safeVals = values.length > 1 ? values : [50, 52];
    const min = Math.min(...safeVals);
    const max = Math.max(...safeVals);
    const spread = max - min === 0 ? 1 : max - min;

    const w = 260;
    const h = 44;
    const padY = 6;

    return safeVals
      .map((v, idx) => {
        const x = (idx / (safeVals.length - 1)) * w;
        const y = padY + (h - padY * 2) - ((v - min) / spread) * (h - padY * 2);
        return `${idx === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(" ");
  }, [values]);

  const deltaColor =
    deltaTone === "danger"
      ? "text-[#DF4D38]"
      : deltaTone === "warning"
      ? "text-[#B68214]"
      : "text-emerald-700";

  return (
    <div
      style={{ backgroundColor: bgColor }}
      className="rounded-3xl p-6 shadow-xs border border-black/[0.03] flex flex-col justify-between min-h-[165px]"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-2xl font-bold tracking-tight text-neutral-900">
            {valueText}
          </p>
          <p className="text-xs text-neutral-500 mt-0.5">{subtitle}</p>
        </div>
        <span className={`text-xs font-bold ${deltaColor}`}>{deltaText}</span>
      </div>

      <div className="mt-6 w-full">
        <svg viewBox="0 0 260 44" className="w-full h-11 overflow-visible">
          <path
            d={pathData}
            fill="none"
            stroke={strokeColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}