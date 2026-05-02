import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const PROMPT = `Analyze this crop image as an expert plant pathologist. Return ONLY valid JSON no markdown:
{"health_score":85,"disease_name":"Healthy or disease name","severity":"None","condition":"one line","confidence":"94%","zone":"Zone A","risk_level":"Low","pests_detected":0,"pesticides":[{"name":"product","dose":"2ml/L","timing":"every 7 days"}],"actions":{"immediate":"what to do now","long_term":"what to do over weeks"},"action_plan":["step1","step2","step3","step4"],"prevention":"2 sentences","expert_opinion":"2-3 sentence summary"}`;

const FALLBACK = { healthScore:68, riskLevel:'Moderate', diseaseName:'Unavailable', severity:'Unknown', diagnosis:'Analysis temporarily unavailable', pesticideRecommendation:'Retry with a clearer image', expertOpinion:'AI fallback activated.', pestsDetected:0, confidence:'N/A', zone:'Zone A', pesticides:[], actionPlan:[], prevention:'' };

async function callGemini(b64: string, mime: string) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  const result = await model.generateContent([PROMPT, { inlineData: { data: b64, mimeType: mime } }]);
  const match = result.response.text().match(/\{[\s\S]*\}/);
  if (!match) throw new Error('No JSON');
  return JSON.parse(match[0]);
}

async function callGroq(b64: string, mime: string) {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + process.env.GROQ_API_KEY },
    body: JSON.stringify({ model: 'meta-llama/llama-4-scout-17b-16e-instruct', messages: [{ role: 'user', content: [{ type: 'image_url', image_url: { url: 'data:' + mime + ';base64,' + b64 } }, { type: 'text', text: PROMPT }] }], temperature: 0.2, max_tokens: 1024 })
  });
  if (!res.ok) throw new Error('Groq error');
  const match = (await res.json()).choices?.[0]?.message?.content?.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('No JSON');
  return JSON.parse(match[0]);
}

function buildReport(a: any) {
  const score = Number(a.health_score) || 0;
  return { healthScore: score, riskLevel: a.risk_level || (score>=80?'Low':score>=60?'Moderate':'High'), diseaseName: a.disease_name||'Unknown', severity: a.severity||'Unknown', diagnosis: a.condition||'Unknown', pesticideRecommendation: a.actions?.immediate||'None', expertOpinion: a.expert_opinion||'N/A', pestsDetected: Number(a.pests_detected)||0, confidence: a.confidence||'N/A', zone: a.zone||'Zone A', pesticides: a.pesticides||[], actionPlan: a.action_plan||[], prevention: a.prevention||'' };
}

export async function POST(req: Request) {
  try {
    const { image, imageBase64, mediaType } = await req.json();
    const input = imageBase64 || image;
    if (!input) return NextResponse.json({ error: 'No image' }, { status: 400 });
    const b64 = input.includes(',') ? input.split(',')[1] : input;
    const mime = mediaType || 'image/jpeg';
    let analysis = null, source = '';
    if (process.env.GEMINI_API_KEY) { try { analysis = await callGemini(b64, mime); source = 'gemini'; } catch(e) { console.error('Gemini failed:', e); } }
    if (!analysis && process.env.GROQ_API_KEY) { try { analysis = await callGroq(b64, mime); source = 'groq'; } catch(e) { console.error('Groq failed:', e); } }
    if (!analysis) return NextResponse.json({ success: true, report: FALLBACK, source: 'fallback' });
    return NextResponse.json({ success: true, report: buildReport(analysis), analysis, source });
  } catch (e: any) {
    return NextResponse.json({ success: true, report: FALLBACK, source: 'fallback', warning: e.message });
  }
}
