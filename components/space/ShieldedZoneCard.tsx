"use client";

import React, { useState } from "react";

export function ShieldedZoneCard() {
  const [acknowledged, setAcknowledged] = useState(false);

  return (
    <div className="relative overflow-hidden bg-[#222222] text-white rounded-3xl p-6 shadow-xs flex flex-col justify-between min-h-[250px]">
      {/* Decorative wireframe corners */}
      <svg className="pointer-events-none absolute -bottom-8 -right-6 w-48 h-40 opacity-20" viewBox="0 0 200 160" fill="none">
        <rect x="35" y="35" width="130" height="110" rx="18" transform="rotate(-14 35 35)" stroke="#FFFFFF" strokeWidth="1.5" />
        <rect x="65" y="55" width="120" height="100" rx="16" transform="rotate(-14 65 55)" stroke="#FFFFFF" strokeWidth="1.2" />
      </svg>

      <div>
        <span className="inline-block px-3 py-0.5 rounded-full bg-[#DF5A46] text-white text-[11px] font-bold mb-3">
          {acknowledged ? "Acknowledged" : "Action needed"}
        </span>

        <h2 className="text-xl font-bold tracking-tight text-white">
          Move to the shielded zone
        </h2>
        <p className="mt-2 text-xs leading-relaxed text-neutral-300">
          Radiation is rising from live solar particle flux. Estimated peak in 38 minutes. Stay for about 2 hours.
        </p>
      </div>

      <div className="mt-6 relative z-10">
        <button
          onClick={() => setAcknowledged(true)}
          disabled={acknowledged}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
            acknowledged
              ? "bg-emerald-600 text-white cursor-default"
              : "bg-[#B9D2F3] hover:bg-[#a8c6ef] text-neutral-900 shadow-[0_3px_0_#7A99C2]"
          }`}
        >
          {acknowledged ? "Protocol Confirmed" : "Acknowledge"}
        </button>
      </div>
    </div>
  );
}