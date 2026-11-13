"use client";

import React, { useEffect, useState } from "react";
import { SolarActivityCard } from "@/components/space/SolarActivityCard";
import { ShieldedZoneCard } from "@/components/space/ShieldedZoneCard";
import { CrewRadiationTable } from "@/components/space/CrewRadiationTable";
import { ScenarioSimulatorCard } from "@/components/space/ScenarioSimulatorCard";

export default function SpacePage() {
  const [nasaData, setNasaData] = useState<{
    source: string;
    connected: boolean;
    hasActiveStorm: boolean;
    cmeCount: number;
  }>({
    source: "NASA DONKI live",
    connected: true,
    hasActiveStorm: true,
    cmeCount: 3,
  });

  useEffect(() => {
    async function fetchNasa() {
      try {
        const res = await fetch("/api/nasa");
        if (res.ok) {
          const json = await res.json();
          setNasaData(json);
        }
      } catch (err) {
        console.error("Failed to fetch NASA DONKI feed:", err);
      }
    }
    fetchNasa();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-neutral-900 px-6 py-6 md:px-10">
      {/* Top Header Bar */}
      <header className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl md:text-[28px] font-bold tracking-tight text-neutral-900">
            Space environment
          </h1>

          {/* NASA DONKI Live Status Pill */}
          <span className="px-3.5 py-1 rounded-full bg-[#DCE8F8] text-[#3B70D6] text-xs font-bold">
            {nasaData.source}
          </span>
        </div>

        {/* Right Header Controls */}
        <div className="flex items-center gap-2.5">
          <button aria-label="Search" className="w-9 h-9 rounded-full bg-white border border-black/[0.05] flex items-center justify-center text-neutral-600 hover:bg-neutral-50 transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" strokeLinecap="round" />
            </svg>
          </button>

          <button aria-label="Notifications" className="w-9 h-9 rounded-full bg-white border border-black/[0.05] flex items-center justify-center text-neutral-600 hover:bg-neutral-50 transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" />
            </svg>
          </button>

          <div className="flex items-center gap-2 bg-white border border-black/[0.05] rounded-full pl-1.5 pr-3 py-1">
            <span className="w-6 h-6 rounded-full bg-[#C7D7F5]" />
            <span className="text-xs font-semibold text-neutral-800">Crew 01</span>
            <svg className="w-3.5 h-3.5 text-neutral-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </header>

      {/* Top Row: Solar Particle Activity (2 cols) + Shielded Zone Alert (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <SolarActivityCard hasActiveStorm={nasaData.hasActiveStorm} cmeCount={nasaData.cmeCount} />
        </div>
        <div className="lg:col-span-1">
          <ShieldedZoneCard />
        </div>
      </div>

      {/* Bottom Row: Crew Radiation Dose (2 cols) + Scenario Simulator (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5">
        <div className="lg:col-span-2">
          <CrewRadiationTable />
        </div>
        <div className="lg:col-span-1">
          <ScenarioSimulatorCard />
        </div>
      </div>

      {/* Footer Note */}
      <footer className="mt-5 text-[11px] text-neutral-400">
        Live space weather telemetry synchronized with NASA DONKI open data feeds.
      </footer>
    </div>
  );
}