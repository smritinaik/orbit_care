import type { Mode, Reading, Scenario } from "./types";

type Store = {
  mode: Mode;
  scenario: Scenario;
  scenarioStart: number;
  history: Reading[];
  ibis: number[];
  lastLive: { hr: number; finger: boolean; t: number } | null;
  lastTick: number;
};

const g = globalThis as typeof globalThis & { __astra?: Store };
export const store: Store = (g.__astra ??= {
  mode: "simulated",
  scenario: "earth",
  scenarioStart: Date.now(),
  history: [],
  ibis: [],
  lastLive: null,
  lastTick: 0,
});

const noise = (a: number) => (Math.random() - 0.5) * a;

export function rmssd(ibis: number[]): number {
  if (ibis.length < 3) return 0;
  let s = 0;
  for (let i = 1; i < ibis.length; i++) s += (ibis[i] - ibis[i - 1]) ** 2;
  return Math.sqrt(s / (ibis.length - 1));
}

// Scenario drift ramps from 0 to full over 60 s so a demo shows change quickly.
function drift() {
  if (store.scenario === "earth") return 0;
  return Math.min((Date.now() - store.scenarioStart) / 60000, 1);
}

function push(r: Reading) {
  store.history.push(r);
  if (store.history.length > 600) store.history.shift();
}

// Called on every dashboard poll; creates at most one reading per second.
export function tick() {
  const now = Date.now();
  if (now - store.lastTick < 1000) return;
  store.lastTick = now;

  const d = drift();
  const hrOffset = (store.scenario === "day47" ? 14 : store.scenario === "isolation" ? 8 : 0) * d;
  const hrvDrop = (store.scenario === "day47" ? 25 : store.scenario === "isolation" ? 22 : 0) * d;

  if (store.mode === "simulated") {
    push({ t: now, hr: 62 + hrOffset + noise(4), hrv: Math.max(0, 65 - hrvDrop + noise(6)), source: "simulator", finger: true });
    return;
  }

  const live = store.lastLive;
  if (live && now - live.t < 3000 && live.finger && live.hr > 0) {
    const hrv = store.ibis.length >= 8 ? rmssd(store.ibis.slice(-30)) : 0;
    push({ t: now, hr: live.hr + hrOffset, hrv: hrv ? Math.max(0, hrv - hrvDrop) : 0, source: "esp32", finger: true });
  } else {
    push({ t: now, hr: 0, hrv: 0, source: "esp32", finger: false });
  }
}

// Called when the ESP32 posts a reading.
export function ingest(d: { heartRate: number; finger: boolean; ibis: number[] }) {
  store.lastLive = { hr: d.heartRate, finger: d.finger, t: Date.now() };
  if (!d.finger) store.ibis = [];
  for (const v of d.ibis) {
    if (v >= 333 && v <= 1500) {
      store.ibis.push(v);
      if (store.ibis.length > 60) store.ibis.shift();
    }
  }
}

export function setControl(c: { mode?: Mode; scenario?: Scenario }) {
  if ((c.mode === "live" || c.mode === "simulated") && c.mode !== store.mode) {
    store.mode = c.mode;
    store.history = [];
    store.ibis = [];
    store.lastLive = null;
  }
  if (c.scenario === "earth" || c.scenario === "day47" || c.scenario === "isolation") {
    store.scenario = c.scenario;
    store.scenarioStart = Date.now();
  }
}