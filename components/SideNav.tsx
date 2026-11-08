"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, LayoutGrid, LogOut, Orbit, TrendingUp, User } from "lucide-react";

const items = [
  { href: "/", label: "Overview", icon: LayoutGrid },
  { href: "/vitals", label: "Vitals", icon: Activity },
  { href: "/trends", label: "Trends", icon: TrendingUp },
  { href: "/space", label: "Space", icon: Orbit },
  { href: "/crew", label: "Crew", icon: User },
];

export default function SideNav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));

  const label = (text: string) => (
    <span
      className={`whitespace-nowrap text-sm font-medium transition-opacity duration-150 ${
        open ? "opacity-100 delay-100" : "opacity-0"
      }`}
    >
      {text}
    </span>
  );

  return (
    <>
      {/* Desktop: narrow rail that expands over the page on hover */}
      <div className="relative hidden w-[72px] shrink-0 md:block">
        <aside
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          className={`absolute inset-y-0 left-0 z-40 flex flex-col overflow-hidden bg-shell py-6 transition-[width,box-shadow] duration-200 ease-out ${
            open ? "w-[200px] rounded-r-3xl shadow-2xl shadow-black/30" : "w-[72px]"
          }`}
        >
          {/* Logo */}
          <div className="flex items-center gap-3 pl-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[13px] bg-cream text-xl font-bold text-shell">
              A
            </div>
            <span
              className={`whitespace-nowrap text-lg font-bold tracking-wide text-white transition-opacity duration-150 ${
                open ? "opacity-100 delay-100" : "opacity-0"
              }`}
            >
              ASTRA
            </span>
          </div>

          {/* Tabs */}
          <nav className="mt-12 flex flex-1 flex-col gap-3 px-2">
            {items.map(({ href, label: name, icon: Icon }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-label={name}
                  onClick={() => setOpen(false)}
                  className={`relative flex h-11 w-full items-center gap-4 rounded-xl pl-4 transition-colors ${
                    active ? "text-white" : "text-[#8d8f96] hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {active && (
                    <span className="absolute -left-2 top-1/2 h-[26px] w-1 -translate-y-1/2 rounded-full bg-white" />
                  )}
                  <Icon size={24} strokeWidth={1.8} className="shrink-0" />
                  {label(name)}
                </Link>
              );
            })}
          </nav>

          {/* Log out */}
          <div className="px-2">
            <button
              aria-label="Log out"
              onClick={() => setOpen(false)}
              className="flex h-11 w-full items-center gap-4 rounded-xl pl-4 text-[#8d8f96] transition-colors hover:bg-white/5 hover:text-white"
            >
              <LogOut size={24} strokeWidth={1.8} className="shrink-0" />
              {label("Log out")}
            </button>
          </div>
        </aside>
      </div>

      {/* Phone: floating bottom bar (unchanged) */}
      <nav className="fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-50 flex h-16 items-center justify-around rounded-full bg-shell px-2 md:hidden">
        {items.map(({ href, label: name, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              aria-label={name}
              className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors ${
                active ? "bg-cream text-shell" : "text-[#8d8f96]"
              }`}
            >
              <Icon size={22} strokeWidth={1.8} />
            </Link>
          );
        })}
      </nav>
    </>
  );
}