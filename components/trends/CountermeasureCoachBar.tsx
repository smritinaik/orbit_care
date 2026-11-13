"use client";

import React, { useState } from "react";

interface CoachAction {
  id: string;
  label: string;
  icon: "pulse" | "moon" | "user";
}

const DEFAULT_ACTIONS: CoachAction[] = [
  { id: "cardio", label: "Light cardio, 30 min today", icon: "pulse" },
  { id: "sleep", label: "Lights out 1 hour earlier", icon: "moon" },
  { id: "eva", label: "Delay spacewalk until readiness recovers", icon: "user" },
];

export function CountermeasureCoachBar({
  highlighted,
}: {
  highlighted?: boolean;
}) {
  const [acknowledged, setAcknowledged] = useState<Record<string, boolean>>({});

  const toggleAction = (id: string) => {
    setAcknowledged((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div
      id="countermeasure-coach"
      className={`bg-[#F1F1F0] rounded-3xl p-5 transition-all duration-300 ${
        highlighted ? "ring-2 ring-[#467CE6]" : ""
      }`}
    >
      <h2 className="text-sm font-bold text-neutral-900 mb-3.5 px-1">
        Countermeasure coach
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {DEFAULT_ACTIONS.map((item) => {
          const isDone = !!acknowledged[item.id];
          return (
            <button
              key={item.id}
              onClick={() => toggleAction(item.id)}
              className={`flex items-center gap-3 bg-white hover:bg-neutral-50 rounded-full p-2 pr-4 text-left shadow-2xs border transition-all cursor-pointer ${
                isDone
                  ? "border-emerald-400 bg-emerald-50/40"
                  : "border-black/[0.03]"
              }`}
            >
              <span
                className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center transition-colors ${
                  isDone
                    ? "bg-emerald-600 text-white"
                    : "bg-[#222222] text-white"
                }`}
              >
                {item.icon === "pulse" && (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M3 12h4l3-7 4 14 3-7h4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                {item.icon === "moon" && (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                {item.icon === "user" && (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M5 20a7 7 0 0 1 14 0" strokeLinecap="round" />
                  </svg>
                )}
              </span>

              <span
                className={`text-xs font-bold leading-snug ${
                  isDone ? "line-through text-neutral-400" : "text-neutral-900"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}