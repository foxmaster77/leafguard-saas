import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const runtime = 'nodejs';
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const source = req.headers.get('x-source');
    const formData = await req.formData();
    const file = formData.get('image') as File;
    
    if (!file) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const base64Image = Buffer.from(bytes).toString('base64');
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

    let report;

    if (source === 'homepage') {
      const groqKey = process.env.GROQ_API_KEY;
      if (!groqKey) {
        console.error("GROQ API key not configured");
        return NextResponse.json({ error: "GROQ API key not configured" }, { status: 500 });
      }

      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${groqKey}`
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-4-scout-17b-16e-instruct',
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: prompt },
                { type: 'image_url', image_url: { url: `data:${file.type};base64,${base64Image}` } }
              ]
            }
          ],
          temperature: 0.1,
          max_tokens: 1024
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`Groq API error: ${errorData.error?.message || res.statusText}`);
      }

      const data = await res.json();
      const text = data.choices[0].message.content;
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Could not parse JSON from Groq response");
      report = JSON.parse(jsonMatch[0]);
    } else {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.error("GEMINI API key not configured");
        return NextResponse.json({ error: "GEMINI API key not configured" }, { status: 500 });
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

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
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Could not parse JSON from Gemini response");
      report = JSON.parse(jsonMatch[0]);
    }

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
