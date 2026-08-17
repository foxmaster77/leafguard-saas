import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 30;

const LANGUAGE_NAMES: Record<string, string> = {
  'bn-IN': 'Bengali / Bangla (বাংলা)',
  'hi-IN': 'Hindi (हिंदी)',
  'en-IN': 'English',
  'bn': 'Bengali / Bangla (বাংলা)',
  'hi': 'Hindi (हिंदी)',
  'en': 'English'
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('image') as File | null;
    const transcript = (formData.get('transcript') as string || '').trim();
    const language = (formData.get('language') as string || 'bn-IN').trim();
    const pincode = (formData.get('pincode') as string || '712101').trim();
    const latitudeStr = formData.get('latitude') as string || '';
    const longitudeStr = formData.get('longitude') as string || '';

    if (!file && !transcript) {
      return NextResponse.json({ error: 'Please provide either a leaf image or a voice description.' }, { status: 400 });
    }

    const langName = LANGUAGE_NAMES[language] || LANGUAGE_NAMES['bn-IN'];

    let base64Image = '';
    let mimeType = 'image/jpeg';
    if (file) {
      const bytes = await file.arrayBuffer();
      base64Image = Buffer.from(bytes).toString('base64');
      mimeType = file.type || 'image/jpeg';
    }

    const promptText = `You are AgroGuard AI, an expert agricultural pathologist helping farmers in South Asia.
Analyze this crop diagnostic request.
${transcript ? `Farmer Voice Input / Description: "${transcript}"` : ''}
Target Response Language: ${langName}

Respond ONLY with a valid JSON object without any markdown syntax, code fences, or additional text.
IMPORTANT CONSTRAINTS:
- healthScore MUST be an integer between 0 and 100 (e.g. 72, not 0.72).
- confidence MUST be an integer between 0 and 100 (e.g. 85, not 0.85).
- voiceSummary MUST be written directly in ${langName} using simple, empathetic, farmer-friendly terms without jargon. Keep it to 2-3 sentences ideal for Text-to-Speech playback.

JSON Schema:
{
  "cropName": "string (e.g. Rice, Potato, Wheat, Soybean, Cotton)",
  "disease": "string (e.g. Late Blight, Rice Blast, Healthy, Rust)",
  "healthy": boolean,
  "healthScore": number (0-100),
  "riskLevel": "Low" | "Medium" | "High" | "Critical",
  "confidence": number (0-100),
  "pesticide": "string (recommended treatment or organic remedy)",
  "dosage": "string (e.g. 2ml per liter of water)",
  "actionPlan": ["step 1", "step 2", "step 3"],
  "funFact": "string",
  "severity": "Low" | "Medium" | "High",
  "treatment": "string",
  "voiceSummary": "string (Simple, spoken 2-3 sentence advice in ${langName})"
}`;

    let jsonResponseText = '';

    // Strategy 1: Try Gemini API if GEMINI_API_KEY is available
    // Model: gemini-3.7-flash — confirmed active & tested with multimodal generateContent
    // To verify current models: GET https://generativelanguage.googleapis.com/v1beta/models?key=YOUR_KEY
    const GEMINI_MODEL = 'gemini-3.7-flash';
    if (process.env.GEMINI_API_KEY) {
      console.log(`[AgroGuard] Using Gemini model: ${GEMINI_MODEL}`);
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`;
        const parts: any[] = [{ text: promptText }];
        if (base64Image) {
          parts.unshift({
            inline_data: {
              mime_type: mimeType,
              data: base64Image
            }
          });
        }

        const requestBody = JSON.stringify({
          contents: [{ parts }],
          generationConfig: { responseMimeType: "application/json" }
        });

        let geminiRes = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: requestBody
        });

        // Transient overload retry: on 503 specifically, wait 1.5s and retry once
        if (geminiRes.status === 503) {
          console.warn(`[AgroGuard] Gemini returned 503 (transient overload). Retrying in 1.5s...`);
          await new Promise((resolve) => setTimeout(resolve, 1500));
          geminiRes = await fetch(geminiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: requestBody
          });
        }

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          jsonResponseText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';
          if (jsonResponseText) console.log(`[AgroGuard] Gemini (${GEMINI_MODEL}) responded successfully.`);
        } else {
          const errBody = await geminiRes.text();
          console.warn(`[AgroGuard] Gemini (${GEMINI_MODEL}) non-200 (${geminiRes.status}), falling back to Groq. Error: ${errBody}`);
        }
      } catch (geminiErr: any) {
        console.warn(`[AgroGuard] Gemini (${GEMINI_MODEL}) call error:`, geminiErr?.message);
      }
    }

    // Strategy 2: Fallback to Groq API if Gemini wasn't available or failed
    // Model: qwen/qwen3.6-27b — vision-capable multimodal model listed in console.groq.com/docs/vision
    // To verify current models: GET https://api.groq.com/openai/v1/models (with Authorization: Bearer YOUR_KEY)
    const GROQ_MODEL = 'qwen/qwen3.6-27b';
    if (!jsonResponseText && process.env.GROQ_API_KEY) {
      console.log(`[AgroGuard] Using Groq model: ${GROQ_MODEL}`);
      try {
        const contentParts: any[] = [];
        if (base64Image) {
          contentParts.push({
            type: 'image_url',
            image_url: { url: `data:${mimeType};base64,${base64Image}` }
          });
        }
        contentParts.push({ type: 'text', text: promptText });

        const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: GROQ_MODEL,
            max_tokens: 1000,
            reasoning_effort: "none",
            response_format: { type: "json_object" },
            messages: [{ role: 'user', content: contentParts }]
          })
        });

        if (groqRes.ok) {
          const groqData = await groqRes.json();
          jsonResponseText = groqData.choices?.[0]?.message?.content || '';
          if (jsonResponseText) console.log(`[AgroGuard] Groq (${GROQ_MODEL}) responded successfully.`);
        } else {
          const errBody = await groqRes.text();
          console.error(`[AgroGuard] Groq (${GROQ_MODEL}) error (${groqRes.status}): ${errBody}`);
        }
      } catch (groqErr: any) {
        console.error(`[AgroGuard] Groq (${GROQ_MODEL}) call error:`, groqErr?.message);
      }
    }

    if (!jsonResponseText) {
      const geminiStatus = process.env.GEMINI_API_KEY ? `Gemini/${GEMINI_MODEL}` : 'Gemini (no key)';
      const groqStatus = process.env.GROQ_API_KEY ? `Groq/${GROQ_MODEL}` : 'Groq (no key)';
      throw new Error(`AI analysis providers failed to respond. Tried: ${geminiStatus}, ${groqStatus}. Check server logs for per-provider error details.`);
    }

    const clean = jsonResponseText
      .replace(/<think>[\s\S]*?<\/think>/gi, '')
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();
    const match = clean.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(match ? match[0] : clean);

    // Normalize healthScore and confidence to 0–100 integers
    if (typeof parsed.healthScore === 'number' && parsed.healthScore <= 1) {
      parsed.healthScore = Math.round(parsed.healthScore * 100);
    } else {
      parsed.healthScore = Math.round(parsed.healthScore ?? 75);
    }

    if (typeof parsed.confidence === 'number' && parsed.confidence <= 1) {
      parsed.confidence = Math.round(parsed.confidence * 100);
    } else {
      parsed.confidence = Math.round(parsed.confidence ?? 85);
    }

    // Default localized voice summary if missing
    if (!parsed.voiceSummary) {
      parsed.voiceSummary = parsed.treatment || `Found ${parsed.disease || 'crop issue'} in ${parsed.cropName || 'crop'}. Recommended treatment: ${parsed.pesticide || 'consult local expert'}.`;
    }

    // 1. Fetch nearest input dealers & relevant government schemes
    const { getNearestDealers } = await import('@/data/dealers');
    const { getRelevantSchemes } = await import('@/data/schemes');
    const nearestDealers = getNearestDealers(pincode, 3);
    const relevantSchemes = getRelevantSchemes(parsed.severity || 'Medium', 2);

    // 2. Fetch 5-Day Weather Forecast and Calculate Disease Spread Risk
    const { get5DayForecast } = await import('@/lib/weather');
    const { calculateDiseaseSpreadRisk } = await import('@/lib/diseaseRisk');
    const lat = latitudeStr ? parseFloat(latitudeStr) : 22.9031;
    const lng = longitudeStr ? parseFloat(longitudeStr) : 88.3908;
    const weatherData = await get5DayForecast(lat, lng, pincode);
    const diseaseRisk = calculateDiseaseSpreadRisk(parsed.disease, parsed.cropName, weatherData.forecast);

    // 3. Append dynamic Scheme spoken guidance to voiceSummary for TTS
    if (relevantSchemes.length > 0) {
      const topScheme = relevantSchemes[0];
      const schemeTip = language === 'hi-IN'
        ? topScheme.spokenTip_hi
        : language === 'en-IN'
        ? topScheme.spokenTip_en
        : topScheme.spokenTip_bn;

      if (schemeTip && !parsed.voiceSummary.includes(topScheme.name)) {
        parsed.voiceSummary = `${parsed.voiceSummary} ${schemeTip}`;
      }
    }

    // Attach enriched data to response
    parsed.dealers = nearestDealers;
    parsed.schemes = relevantSchemes;
    parsed.weather = weatherData;
    parsed.diseaseRisk = diseaseRisk;

    // Log anonymized detection asynchronously to Supabase
    try {
      const { supabase } = await import('@/lib/supabase');

      await supabase.from('detections').insert({
        disease_name: parsed.disease || 'Healthy',
        crop_type: parsed.cropName || 'Crop',
        confidence: parsed.confidence,
        severity: parsed.severity || 'Medium',
        pincode: pincode,
        latitude: lat,
        longitude: lng,
        created_at: new Date().toISOString()
      });
    } catch (dbErr: any) {
      console.warn('Anonymized detection logging skipped:', dbErr?.message || dbErr);
    }

    return NextResponse.json(parsed);

  } catch (error: any) {
    console.error('Analysis error:', error?.message);
    return NextResponse.json(
      { error: 'Analysis failed: ' + (error?.message || 'Unknown error') },
      { status: 500 }
    );
  }
}


