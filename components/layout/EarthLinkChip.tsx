"use client";

import { useTelemetry } from "@/components/providers/TelemetryProvider";

export default function EarthLinkChip() {
  const { linkUp, queued, toggleLink } = useTelemetry();
  return (
    <button
      onClick={toggleLink}
      title="Click to simulate losing the link to Earth"
      className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold ${
        linkUp ? "bg-[#d6f0dc] text-[#2d8a57]" : "bg-[#fbebc4] text-[#a97a0a]"
      }`}
    >
      <span className={`h-2 w-2 rounded-full ${linkUp ? "bg-ok" : "bg-warn"}`} />
      {linkUp ? "Earth link up" : `Earth link down${queued ? `, ${queued} queued` : ""}`}
    </button>
  );
}