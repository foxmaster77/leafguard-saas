import { NextResponse } from 'next/server';

export async function GET() {
  // Simulate live data updates
  const randomFactor = Math.random() * 0.1 - 0.05; // +/- 5%
  
  return NextResponse.json({
    active_monitors: Math.floor(124 * (1 + randomFactor)),
    threats_detected: Math.max(0, Math.floor(3 + (Math.random() * 4 - 2))),
    avg_health: Math.min(100, Math.max(0, Math.floor(92 * (1 + randomFactor)))),
    scans_today: Math.floor(45 + (Math.random() * 10)),
    telemetry_latency: (Math.random() * 5 + 2).toFixed(2) + 'ms',
    system_status: 'NOMINAL',
    last_uplink: new Date().toISOString()
  });
}
