"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

const grayPages = ["/vitals", "/space"];

export default function Panel({ children }: { children: ReactNode }) {
  const path = usePathname();
  const bg = grayPages.includes(path) ? "bg-soft" : "bg-white";

  return (
    <main
      className={`${bg} min-h-screen px-5 pb-28 pt-6 md:h-full md:min-h-0 md:overflow-y-auto md:rounded-[26px] md:px-8 md:pb-8`}
    >
      {children}
    </main>
  );
}