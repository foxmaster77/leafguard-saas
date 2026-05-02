import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    wheat: { price: 2150, change: +2.4 },
    maize: { price: 1840, change: -1.2 },
    soybean: { price: 4200, change: +0.8 },
  });
}
