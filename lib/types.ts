export type Mode = "simulated" | "live";
export type Scenario = "earth" | "day47" | "isolation";

export type Reading = {
  t: number;
  hr: number; // bpm (0 = no signal)
  hrv: number; // RMSSD in ms (0 = not available)
  source: "esp32" | "simulator";
  finger: boolean;
};

export type Baseline = { hr: number; hrStd: number; hrv: number };

export type Level = "normal" | "watch" | "alert" | "nosignal" | "calibrating";

export type Analysis = {
  level: Level;
  readiness: number | null;
  title: string;
  message: string;
  source: string;
  hr: number | null;
  hrv: number | null;
  hrDelta: number; // bpm above (+) or below (-) baseline
  hrvDropPct: number; // % below baseline (positive = lower)
};