"use client";

import React, { useState } from "react";

export function ScenarioSimulatorCard() {
  const [selectedScenario, setSelectedScenario] = useState("solar");
  const [isRunning, setIsRunning] = useState(false);

  const scenarios = [
    { id: "earth", label: "Earth", icon: "earth" },
    { id: "mission", label: "Mission day 47", icon: "pulse" },
    { id: "isolation", label: "Isolation", icon: "user" },
    { id: "solar", label: "Solar storm", icon: "sun" },
  ];

  const handleRun = () => {
    setIsRunning(true);
    setTimeout(() => setIsRunning(false), 2000);
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xs border border-black/[0.04] flex flex-col justify-between">
      <div>
        <h2 className="text-sm font-medium text-neutral-400">Scenario simulator</h2>
        <p className="text-xs text-neutral-400 mt-0.5">Demo only, simulated data</p>

        <div className="grid grid-cols-2 gap-2.5 mt-4">
          {scenarios.map((s) => {
            const isSelected = selectedScenario === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setSelectedScenario(s.id)}
                className={`flex items-center gap-2.5 p-2.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#87B2F8] text-neutral-900 border-transparent shadow-xs"
                    : "bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border-black/[0.03]"
                }`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${isSelected ? "bg-neutral-900 text-white" : "bg-white text-neutral-800"}`}>
                  {s.icon === "sun" ? "☀" : "•"}
                </span>
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={handleRun}
          disabled={isRunning}
          className="w-full py-3 rounded-full bg-neutral-900 hover:bg-neutral-800 active:scale-[0.99] text-white text-xs font-semibold transition-all cursor-pointer"
        >
          {isRunning ? "Simulating space environment..." : "Run for 60 seconds"}
        </button>
      </div>
    </div>
  );
}