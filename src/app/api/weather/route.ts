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
    console.warn('[CropGuard Weather] Weather lookup fallback triggered:', err?.message);
    return NextResponse.json({
      temperature: '28°C',
      temp: 28,
      condition: 'Clear Sky / High Humidity',
      humidity: '78%',
      avgHumidity: 76,
      maxRainChance: 35,
      wind: 12,
      uv_index: 6,
      pressure: '1012 hPa',
      source: 'CropGuard Telemetry Fallback (West Bengal Regional)',
      locationName: 'Hooghly & Indo-Gangetic Basin',
      forecast: [
        { day: 'Today', temp: 28, humidity: 78, condition: 'Partly Cloudy', rainChance: 35, spreadRisk: 'HIGH' },
        { day: 'Tomorrow', temp: 29, humidity: 82, condition: 'Humid & Overcast', rainChance: 45, spreadRisk: 'CRITICAL' },
        { day: 'Day 3', temp: 27, humidity: 74, condition: 'Scattered Showers', rainChance: 50, spreadRisk: 'HIGH' },
        { day: 'Day 4', temp: 30, humidity: 70, condition: 'Clear Sky', rainChance: 20, spreadRisk: 'MODERATE' },
        { day: 'Day 5', temp: 31, humidity: 68, condition: 'Sunny', rainChance: 15, spreadRisk: 'LOW' }
      ]
    });
  }
}

