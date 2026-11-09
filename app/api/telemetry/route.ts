import { store, tick, ingest, setControl } from "@/lib/store";

export const dynamic = "force-dynamic";

// The dashboard polls this every second.
export async function GET() {
  tick();
  return Response.json({
    mode: store.mode,
    scenario: store.scenario,
    history: store.history.slice(-300),
  });
}

// The ESP32 posts readings here. The dashboard posts {action:"control"} here.
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body.action === "control") {
      setControl({ mode: body.mode, scenario: body.scenario });
      return Response.json({ ok: true });
    }

    const heartRate = Number(body.heartRate);
    if (!Number.isFinite(heartRate)) {
      return Response.json({ error: "Invalid heartRate" }, { status: 400 });
    }
    ingest({
      heartRate,
      finger: !!body.finger,
      ibis: Array.isArray(body.ibis) ? body.ibis.map(Number) : [],
    });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
}