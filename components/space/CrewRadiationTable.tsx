"use client";

import React from "react";

const CREW_DOSES = [
  { id: "C1", name: "Crew 01", role: "Commander", msv: "31.4 mSv", pct: 65 },
  { id: "C2", name: "Crew 02", role: "Flight engineer", msv: "30.9 mSv", pct: 63 },
  { id: "C3", name: "Crew 03", role: "Medical officer", msv: "29.8 mSv", pct: 60 },
  { id: "C4", name: "Crew 04", role: "Pilot", msv: "32.1 mSv", pct: 68 },
];

export function CrewRadiationTable() {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-xs border border-black/[0.04] flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-neutral-400">Crew radiation dose</h2>
        <span className="text-xs text-neutral-400">Mission total</span>
      </div>

      <div className="space-y-4">
        {CREW_DOSES.map((crew) => (
          <div key={crew.id} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-[140px]">
              <div className="w-8 h-8 rounded-full bg-[#E4ECF9] text-neutral-800 font-bold text-xs flex items-center justify-center shrink-0">
                {crew.id}
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-900">{crew.name}</p>
                <p className="text-[10px] text-neutral-400">{crew.role}</p>
              </div>
            </div>

            <div className="flex-1 max-w-[200px] hidden sm:block">
              <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                <div style={{ width: `${crew.pct}%` }} className="h-full bg-[#7AA7F7] rounded-full" />
              </div>
            </div>

            <span className="text-xs font-bold text-neutral-900 min-w-[64px] text-right">
              {crew.msv}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}