import { NextRequest, NextResponse } from 'next/server';

const BACKEND_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    const incoming = await request.json();

    // Accept either { features: {...}, mission, object_id } or raw top-level features
    const features = incoming.features ?? incoming;
    const mission = incoming.mission ?? 'KEPLER';
    const object_id = incoming.object_id ?? 'UI-CLIENT';

    const resp = await fetch(`${BACKEND_BASE}/v1/tabular/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mission, object_id, features }),
    });

    const data = await resp.json();
    return NextResponse.json(data, { status: resp.status });
  } catch (err) {
    console.error('Proxy tabular/predict error:', err);
    return NextResponse.json({ error: 'Failed to proxy request' }, { status: 500 });
  }
}


