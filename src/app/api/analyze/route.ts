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
    if (process.env.GEMINI_API_KEY) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
        const parts: any[] = [{ text: promptText }];
        if (base64Image) {
          parts.unshift({
            inline_data: {
              mime_type: mimeType,
              data: base64Image
            }
          });
        }

        const geminiRes = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts }],
            generationConfig: { responseMimeType: "application/json" }
          })
        });

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          jsonResponseText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';
        } else {
          console.warn('Gemini API non-200, trying Groq fallback:', await geminiRes.text());
        }
      } catch (geminiErr: any) {
        console.warn('Gemini call error:', geminiErr?.message);
      }
    }

    // Strategy 2: Fallback to Groq API if Gemini wasn't available or failed
    if (!jsonResponseText && process.env.GROQ_API_KEY) {
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
            model: 'meta-llama/llama-4-scout-17b-16e-instruct',
            max_tokens: 1000,
            messages: [{ role: 'user', content: contentParts }]
          })
        });

        if (groqRes.ok) {
          const groqData = await groqRes.json();
          jsonResponseText = groqData.choices?.[0]?.message?.content || '';
        } else {
          console.error('Groq API error:', await groqRes.text());
        }
      } catch (groqErr: any) {
        console.error('Groq call error:', groqErr?.message);
      }
    }

    if (!jsonResponseText) {
      throw new Error('AI analysis providers failed to respond.');
    }

    const clean = jsonResponseText.replace(/```json/gi, '').replace(/```/g, '').trim();
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

    // Log anonymized detection asynchronously to Supabase
    try {
      const { supabase } = await import('@/lib/supabase');
      const lat = latitudeStr ? parseFloat(latitudeStr) : 22.9868;
      const lng = longitudeStr ? parseFloat(longitudeStr) : 87.8550;

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

