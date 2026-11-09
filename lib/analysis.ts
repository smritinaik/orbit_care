import type { Analysis, Baseline, Reading } from "./types";

const mean = (a: number[]) => a.reduce((s, v) => s + v, 0) / a.length;

export function makeBaseline(rs: Reading[]): Baseline | null {
  const v = rs.filter((r) => r.finger && r.hr > 0).slice(-30);
  if (v.length < 30) return null;
  const hr = mean(v.map((r) => r.hr));
  const hrStd = Math.sqrt(mean(v.map((r) => (r.hr - hr) ** 2)));
  const hv = v.filter((r) => r.hrv > 0).map((r) => r.hrv);
  return { hr, hrStd, hrv: hv.length ? mean(hv) : 0 };
}

const SOURCE = "NASA Human Research Program: sleep loss, circadian desynchronization and work overload risk";
const blank = { hr: null, hrv: null, hrDelta: 0, hrvDropPct: 0 };

export function analyze(rs: Reading[], base: Baseline | null): Analysis {
  const recent = rs.slice(-10).filter((r) => r.finger && r.hr > 0);
  if (!recent.length)
    return { ...blank, level: "nosignal", readiness: null, title: "No signal", message: "Place a fingertip lightly on the sensor and keep still.", source: "" };
  if (!base)
    return { ...blank, level: "calibrating", readiness: null, title: "Learning your baseline", message: "Collecting 30 seconds of readings. Stay relaxed.", source: "" };

  const hr = mean(recent.map((r) => r.hr));
  const hv = recent.filter((r) => r.hrv > 0).map((r) => r.hrv);
  const hrv = hv.length ? mean(hv) : 0;
  const hrDelta = hr - base.hr;
  const hrvDropPct = base.hrv && hrv ? ((base.hrv - hrv) / base.hrv) * 100 : 0;
  const common = { hr, hrv: hrv || null, hrDelta, hrvDropPct };

  const penalty = Math.min(40, Math.max(0, hrDelta) * 2.5) + Math.min(40, Math.max(0, hrvDropPct) * 0.8);
  const readiness = Math.round(100 - penalty);

  if (readiness >= 80)
    return { ...common, level: "normal", readiness, title: "Within your baseline", message: "Heart rate and HRV match your personal normal.", source: "" };

  const parts: string[] = [];
  if (hrDelta >= 3) parts.push(`heart rate is ${Math.round(hrDelta)} bpm above your baseline`);
  if (hrvDropPct >= 10) parts.push(`HRV is ${Math.round(hrvDropPct)}% below your baseline`);
  const what = parts.length ? parts.join(" and ") : "readings are drifting from your baseline";
  const message =
    what[0].toUpperCase() + what.slice(1) +
    ". Sleep loss, workload and isolation stress can shift a crew member's readings this way, and NASA lists fatigue as a risk to performance and health.";

  return readiness >= 60
    ? { ...common, level: "watch", readiness, title: "Early fatigue pattern", message, source: SOURCE }
    : { ...common, level: "alert", readiness, title: "High fatigue risk", message, source: SOURCE };
}