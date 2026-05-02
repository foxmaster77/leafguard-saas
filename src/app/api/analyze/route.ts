import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const runtime = 'nodejs';
export const maxDuration = 30;

const PROMPT = `You are an expert agricultural pathologist. 
Analyze this crop image and respond ONLY with valid JSON, 
no markdown, no explanation, just the JSON object:
{
  "cropName": "crop name here",
  "disease": "disease name or None Detected",
  "healthy": true or false,
  "healthScore": number 0-100,
  "riskLevel": "Low" or "Medium" or "High" or "Critical",
  "confidence": number 0-100,
  "pesticide": "recommended pesticide name",
  "dosage": "dosage and timing",
  "actionPlan": ["step 1", "step 2", "step 3"],
  "funFact": "interesting fact about this crop or disease",
  "severity": "Low" or "Medium" or "High",
  "treatment": "treatment description"
}`;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No image provided' }, 
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' }, 
        { status: 500 }
      );
    }

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString('base64');
    const mimeType = file.type || 'image/jpeg';

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash' 
    });

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: mimeType as any,
          data: base64,
        },
      },
      { text: PROMPT }
    ]);

    const text = result.response.text();
    const clean = text
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    const parsed = JSON.parse(clean);
    return NextResponse.json(parsed);

  } catch (error: any) {
    console.error('Analyze error:', error?.message || error);
    return NextResponse.json(
      { error: 'Analysis failed: ' + (error?.message || 'Unknown error') },
      { status: 500 }
    );
  }
}
