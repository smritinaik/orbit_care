import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const apiKey = process.env.NASA_API_KEY || "DEMO_KEY";
  
  // Calculate date range for the past 7 days
  const endDate = new Date().toISOString().split("T")[0];
  const startDateObj = new Date();
  startDateObj.setDate(startDateObj.getDate() - 7);
  const startDate = startDateObj.toISOString().split("T")[0];

  try {
    // Fetch Solar Flare (FLR) or CME reports from NASA DONKI
    const [cmeRes, flrRes] = await Promise.all([
      fetch(`https://api.nasa.gov/DONKI/CME?startDate=${startDate}&endDate=${endDate}&api_key=${apiKey}`, { next: { revalidate: 3600 } }),
      fetch(`https://api.nasa.gov/DONKI/FLR?startDate=${startDate}&endDate=${endDate}&api_key=${apiKey}`, { next: { revalidate: 3600 } })
    ]);

    const cmeData = cmeRes.ok ? await cmeRes.json() : [];
    const flrData = flrRes.ok ? await flrRes.json() : [];

    // Determine current activity level based on recent solar flares / CMEs
    const hasActiveStorm = (cmeData.length > 2) || (flrData.some((f: any) => f.classType?.startsWith("M") || f.classType?.startsWith("X")));

    return NextResponse.json({
      source: "NASA DONKI live",
      connected: true,
      hasActiveStorm,
      cmeCount: cmeData.length,
      flareCount: flrData.length,
      recentFlares: flrData.slice(-5),
      recentCmes: cmeData.slice(-5),
    });
  } catch (error) {
    return NextResponse.json({
      source: "NASA DONKI fallback",
      connected: false,
      hasActiveStorm: true,
      cmeCount: 3,
      flareCount: 5,
      recentFlares: [],
      recentCmes: [],
    });
  }
}