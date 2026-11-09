import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SideNav from "../components/SideNav";
import Panel from "../components/Panel";
import TelemetryProvider from "@/components/providers/TelemetryProvider";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ASTRA crew health",
  description: "Offline-first astronaut health monitor (prototype)",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
  <div className="md:flex md:h-screen md:w-full md:overflow-hidden md:bg-shell">
    <SideNav />
    <div className="md:h-full md:min-w-0 md:flex-1 md:p-3 md:pl-0">
<div className="md:h-full md:min-w-0 md:flex-1 md:p-3 md:pl-0">
  <TelemetryProvider>
    <Panel>{children}</Panel>
  </TelemetryProvider>
</div>    </div>
  </div>
</body>
    </html>
  );
}