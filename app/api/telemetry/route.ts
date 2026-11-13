import { store, tick, ingest, setControl } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  tick();
  return Response.json({
    mode: store.mode,
    scenario: store.scenario,
    overlay: (store as any).overlay ?? false,
    baseline: (store as any).baseline ?? null,
    history: store.history.slice(-300),
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body.action === "control") {
      setControl({
        mode: body.mode,
        scenario: body.scenario,
        ...(typeof body.overlay === "boolean" ? { overlay: body.overlay } : {}),
        ...(body.recalibrate ? { recalibrate: true } : {}),
      } as any);
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