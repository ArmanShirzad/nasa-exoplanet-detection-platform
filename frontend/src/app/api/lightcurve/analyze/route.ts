import { NextRequest, NextResponse } from 'next/server';

const BACKEND_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const resp = await fetch(`${BACKEND_BASE}/v1/lightcurve/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await resp.json();
    return NextResponse.json(data, { status: resp.status });
  } catch (err) {
    console.error('Proxy lightcurve/analyze error:', err);
    return NextResponse.json({ error: 'Failed to proxy request' }, { status: 500 });
  }
}


