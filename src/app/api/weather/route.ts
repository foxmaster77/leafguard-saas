import { NextRequest, NextResponse } from 'next/server';
import { get5DayForecast } from '@/lib/weather';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pincode = searchParams.get('pincode') || '712101';
  const lat = parseFloat(searchParams.get('lat') || '22.9031');
  const lng = parseFloat(searchParams.get('lng') || '88.3908');

  try {
    const data = await get5DayForecast(lat, lng, pincode);
    const today = data.forecast[0] || { temp: 30, humidity: 75, condition: 'Partly Cloudy' };

    return NextResponse.json({
      temperature: `${today.temp}°C`,
      temp: today.temp,
      condition: today.condition,
      humidity: `${today.humidity}%`,
      avgHumidity: data.avgHumidity,
      maxRainChance: data.maxRainChance,
      wind: 14,
      uv_index: 7,
      pressure: '1010 hPa',
      source: data.source,
      locationName: data.locationName,
      forecast: data.forecast
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch weather: ' + err.message }, { status: 500 });
  }
}

