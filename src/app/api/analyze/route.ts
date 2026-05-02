import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || '' });

const FALLBACK_ANALYSIS = {
  health_score: 70,
  disease_name: "Unknown / Needs Review",
  severity: "Low",
  condition: "Stability check required",
  confidence: "N/A",
  zone: "Zone A",
  risk_level: "Moderate",
  pests_detected: 0,
  pesticides: [
    { name: "Broad-spectrum Organic Spray", dose: "Standard", timing: "Dusk" }
  ],
  actions: {
    immediate: "Inspect the field manually to verify health status.",
    long_term: "Implement regular soil testing and crop rotation."
  },
  action_plan: ["Manual inspection", "Soil nutrient analysis", "Irrigation audit"],
  prevention: "Maintain balanced nitrogen levels and avoid over-irrigation.",
  expert_opinion: "The automated analysis encountered a technical issue. Please rely on field observations."
};

const PROMPT = `Analyze this crop field image and return ONLY valid JSON. 
Be precise and technical.
JSON shape:
{
  "health_score": number (0-100),
  "disease_name": string,
  "severity": "Low" | "Moderate" | "High",
  "condition": string,
  "confidence": string (e.g. "92%"),
  "zone": string,
  "risk_level": "Low" | "Moderate" | "High",
  "pests_detected": number,
  "pesticides": [
    { "name": string, "dose": string, "timing": string }
  ],
  "actions": {
    "immediate": string,
    "long_term": string
  },
  "action_plan": string[],
  "prevention": string,
  "expert_opinion": string
}`;

export async function POST(req: Request) {
  try {
    const { image, imageBase64, mediaType } = await req.json();
    const inputImage = imageBase64 || image;

    if (!inputImage) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const base64Data = inputImage.split(',')[1] || inputImage;
    const mimeType = mediaType || 'image/jpeg';

    let analysis = null;
    let source = 'none';

    // 1. Try Gemini Primary
    if (process.env.GEMINI_API_KEY) {
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        const result = await model.generateContent([
          PROMPT,
          {
            inlineData: {
              data: base64Data,
              mimeType
            }
          }
        ]);
        const text = await result.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          analysis = JSON.parse(jsonMatch[0]);
          source = 'gemini';
          console.log('Analysis successful via Gemini');
        }
      } catch (e) {
        console.error('Gemini analysis failed, falling back to Groq:', e);
      }
    }

    // 2. Try Groq Fallback
    if (!analysis && process.env.GROQ_API_KEY) {
      try {
        const completion = await groq.chat.completions.create({
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: PROMPT },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:${mimeType};base64,${base64Data}`,
                  },
                },
              ],
            },
          ],
          model: "llama-3.2-11b-vision-preview",
          response_format: { type: "json_object" }
        });

        const content = completion.choices[0].message.content;
        if (content) {
          analysis = JSON.parse(content);
          source = 'groq';
          console.log('Analysis successful via Groq');
        }
      } catch (e) {
        console.error('Groq analysis failed, using final fallback:', e);
      }
    }

    // 3. Final Fallback
    if (!analysis) {
      analysis = FALLBACK_ANALYSIS;
      source = 'fallback';
      console.log('Using final fallback analysis');
    }

    // Standardize report for frontend compatibility
    const report = {
      healthScore: analysis.health_score ?? 70,
      riskLevel: analysis.risk_level ?? 'Moderate',
      diagnosis: analysis.disease_name || analysis.condition || 'Unknown',
      pesticideRecommendation: analysis.pesticides?.[0]?.name || 'No specific recommendation',
      expertOpinion: analysis.expert_opinion || 'Standard monitoring recommended',
      pestsDetected: analysis.pests_detected ?? 0,
      confidence: analysis.confidence || 'N/A',
      zone: analysis.zone || 'Field A'
    };

    return NextResponse.json({
      success: true,
      source,
      report,
      analysis // Provide full analysis for advanced UI features
    });

  } catch (error: any) {
    console.error('Critical Analysis API Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      report: {
        healthScore: 0,
        riskLevel: 'Unknown',
        diagnosis: 'System error',
        pesticideRecommendation: 'Check connection',
        expertOpinion: 'API route encountered a critical failure.',
        pestsDetected: 0,
        confidence: '0%',
        zone: 'N/A'
      },
      source: 'error'
    }, { status: 500 });
  }
}

