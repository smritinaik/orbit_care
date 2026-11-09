"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { analyze, makeBaseline } from "@/lib/analysis";
import type { Analysis, Baseline, Level, Mode, Reading, Scenario } from "@/lib/types";

type Telemetry = {
  history: Reading[];
  latest: Reading | undefined;
  mode: Mode;
  scenario: Scenario;
  base: Baseline | null;
  analysis: Analysis;
  connected: boolean;
  linkUp: boolean;
  queued: number;
  setMode: (m: Mode) => Promise<void>;
  setScenario: (s: Scenario) => Promise<void>;
  recalibrate: () => void;
  toggleLink: () => void;
};

const Ctx = createContext<Telemetry | null>(null);

export function useTelemetry() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useTelemetry must be used inside <TelemetryProvider>");
  return v;
}

async function control(body: { mode?: Mode; scenario?: Scenario }) {
  await fetch("/api/telemetry", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "control", ...body }),
  });
}

export default function TelemetryProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<Reading[]>([]);
  const [mode, setModeState] = useState<Mode>("simulated");
  const [scenario, setScenarioState] = useState<Scenario>("earth");
  const [base, setBase] = useState<Baseline | null>(null);
  const [connected, setConnected] = useState(false);
  const [linkUp, setLinkUp] = useState(true);
  const [queued, setQueued] = useState(0);

  // Poll the server once per second
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/telemetry", { cache: "no-store" });
        const j = await res.json();
        setHistory(j.history);
        setModeState(j.mode);
        setScenarioState(j.scenario);
        setConnected(true);
      } catch {
        setConnected(false);
      }
    };
    load();
    const id = setInterval(load, 1000);
    return () => clearInterval(id);
  }, []);

  // Learn the baseline from the first 30 good readings
  useEffect(() => {
    if (!base) {
      const b = makeBaseline(history);
      if (b) setBase(b);
    }
  }, [history, base]);

  const analysis = useMemo(() => analyze(history, base), [history, base]);

  // Offline mode: queue alerts while the Earth link is down
  const prev = useRef<Level>("normal");
  useEffect(() => {
    if (analysis.level === "alert" && prev.current !== "alert" && !linkUp) setQueued((q) => q + 1);
    prev.current = analysis.level;
  }, [analysis.level, linkUp]);

  const setMode = useCallback(async (m: Mode) => {
    await control({ mode: m });
    setModeState(m);
    setHistory([]);
    setBase(null);
  }, []);

  const setScenario = useCallback(async (s: Scenario) => {
    await control({ scenario: s });
    setScenarioState(s);
  }, []);

  const toggleLink = useCallback(() => {
    setLinkUp((up) => {
      if (!up) setQueued(0); // alerts "sync to Earth" when the link returns
      return !up;
    });
  }, []);

  const value: Telemetry = {
    history,
    latest: history[history.length - 1],
    mode,
    scenario,
    base,
    analysis,
    connected,
    linkUp,
    queued,
    setMode,
    setScenario,
    recalibrate: () => setBase(null),
    toggleLink,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}