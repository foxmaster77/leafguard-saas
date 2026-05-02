import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const runtime = 'nodejs';
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("API key not configured");
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const formData = await req.formData();
    const file = formData.get('image') as File;
    
    if (!file) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const base64Image = Buffer.from(bytes).toString('base64');

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Analyze this crop image. Return ONLY valid JSON, no markdown:
    {
      "cropName": "name",
      "disease": "name",
      "healthy": boolean,
      "healthScore": number,
      "riskLevel": "level",
      "confidence": number,
      "pesticide": "name",
      "dosage": "dosage",
      "actionPlan": ["step1", "step2"],
      "funFact": "fact",
      "severity": "level",
      "treatment": "action"
    }`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Image,
          mimeType: file.type
        }
      }
    ]);

    const response = await result.response;
    const text = response.text();
    
    // Clean potential markdown if Gemini includes it despite the prompt
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not parse JSON from AI response");
    }

    const report = JSON.parse(jsonMatch[0]);

    return NextResponse.json({
      success: true,
      report
    });

  } catch (error: any) {
    console.error("Analysis error:", error);
    return NextResponse.json({
      success: false,
      error: error.message || "Failed to analyze image"
    }, { status: 500 });
  }
}
