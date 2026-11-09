import type { ReactNode } from "react";
import { Bell, ChevronDown, Search } from "lucide-react";

export default function PageHeader({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <header className="flex items-start justify-between gap-3 md:items-center">
      {/* On phone the chip sits above the title; on desktop it sits beside it */}
      <div className="flex flex-col-reverse items-start gap-1.5 md:flex-row md:items-center md:gap-5">
        <h1 className="text-2xl font-bold md:text-[34px] md:leading-none">{title}</h1>
        {children}
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <button aria-label="Search" className="hidden h-10 w-10 items-center justify-center rounded-full bg-black/[0.04] md:flex">
          <Search size={18} />
        </button>
        <button aria-label="Notifications" className="flex h-10 w-10 items-center justify-center rounded-full bg-black/[0.04]">
          <Bell size={18} />
        </button>
        <div className="flex h-10 items-center gap-2 rounded-full bg-black/[0.04] px-1.5 md:pr-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#c9d7f0] text-[11px] font-bold">C1</span>
          <span className="hidden text-sm font-semibold md:inline">Crew 01</span>
          <ChevronDown size={16} className="hidden md:block" />
        </div>
      </div>
    </header>
  );
}