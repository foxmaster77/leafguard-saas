import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('image') as File;
    if (!file) return NextResponse.json({ error: 'No image' }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString('base64');
    const mimeType = file.type || 'image/jpeg';

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: `data:${mimeType};base64,${base64}`
              }
            },
            {
              type: 'text',
              text: 'You are an expert agricultural pathologist. Analyze this crop image. Respond ONLY with valid JSON no markdown no extra text: {"cropName":"string","disease":"string","healthy":boolean,"healthScore":number,"riskLevel":"Low or Medium or High or Critical","confidence":number,"pesticide":"string","dosage":"string","actionPlan":["step1","step2","step3"],"funFact":"string","severity":"string","treatment":"string"}'
            }
          ]
        }]
      })
    });

    const data = await response.json();
    console.log('Groq response:', JSON.stringify(data));
    
    const text = data.choices?.[0]?.message?.content || '';
    const clean = text.replace(/```json/g,'').replace(/```/g,'').trim();
    const match = clean.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(match ? match[0] : clean);
    return NextResponse.json(parsed);

  } catch (error: any) {
    console.error('Error:', error?.message);
    return NextResponse.json(
      { error: 'Analysis failed: ' + error?.message }, 
      { status: 500 }
    );
  }
}
