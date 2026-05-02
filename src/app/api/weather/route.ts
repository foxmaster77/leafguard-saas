import { NextResponse } from 'next/server';

export async function GET() {
  const baseTemp = 28;
  const variance = Math.random() * 4 - 2;
  const currentTemp = Math.round(baseTemp + variance);
  
  return NextResponse.json({
    temperature: `${currentTemp}°C`,
    temp: currentTemp,
    condition: Math.random() > 0.8 ? 'Partly Cloudy' : 'Sunny',
    humidity: `${Math.round(45 + Math.random() * 10)}%`,
    wind: Math.round(10 + Math.random() * 15),
    uv_index: Math.round(6 + Math.random() * 4),
    pressure: '1012 hPa',
    forecast: [
      { day: 'Mon', temp: 29 + Math.round(Math.random() * 2) },
      { day: 'Tue', temp: 30 + Math.round(Math.random() * 2) },
      { day: 'Wed', temp: 27 + Math.round(Math.random() * 2) },
      { day: 'Thu', temp: 28 + Math.round(Math.random() * 2) },
      { day: 'Fri', temp: 31 + Math.round(Math.random() * 2) },
    ]
  });
}
