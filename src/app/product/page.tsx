'use client';
import React, { useEffect, useState, useRef } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const css = `
@keyframes fadeUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
.reveal{opacity:0;transform:translateY(30px);transition:opacity 0.7s ease,transform 0.7s ease}
.reveal.visible{opacity:1;transform:translateY(0)}
.detect-card:hover{border-left:3px solid #C8F53E!important;box-shadow:0 0 20px rgba(200,245,62,0.08)}
.tech-card:hover{border-color:rgba(200,245,62,0.3)!important;transform:translateY(-3px)}
.input-card:hover{border-color:rgba(200,245,62,0.25)!important}
`;

function Counter({ target, suffix='', decimals=0 }: { target:number; suffix?:string; decimals?:number }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const dur = 2000; const steps = 60; const inc = target / steps;
        let cur = 0; let count = 0;
        const t = setInterval(() => {
          cur += inc; count++;
          setVal(parseFloat(cur.toFixed(decimals)));
          if (count >= steps) { setVal(target); clearInterval(t); }
        }, dur / steps);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, decimals]);
  return <div ref={ref}>{val.toFixed(decimals)}{suffix}</div>;
}

const pipeline = [
  { n:'01', icon:'📷', title:'Image Capture', desc:'Multi-spectral drone imagery or mobile photos ingested in real-time.', stat:'< 2s UPLOAD' },
  { n:'02', icon:'🔬', title:'Preprocessing', desc:'Image normalization, enhancement, and multi-layer segmentation pipeline.', stat:'12 LAYERS' },
  { n:'03', icon:'🧠', title:'Gemini Vision', desc:'Google Gemini 1.5 Flash identifies disease signatures across 94 pathogen types.', stat:'94 DISEASES' },
  { n:'04', icon:'⚡', title:'Groq Inference', desc:'Groq-powered LLM generates agronomic prescriptions at 500+ tokens/sec.', stat:'4.2s TOTAL' },
  { n:'05', icon:'📋', title:'Prescription', desc:'Actionable field report delivered: what to spray, when, and where.', stat:'1 REPORT' },
];

const detections = [
  { icon:'🍃', name:'Leaf Blight', acc:'96%', crops:'Wheat, Rice, Maize' },
  { icon:'🍄', name:'Fungal Rust', acc:'94%', crops:'Soybean, Coffee, Wheat' },
  { icon:'🪲', name:'Pest Infestation', acc:'91%', crops:'Cotton, Maize, Paddy' },
  { icon:'💧', name:'Water Stress', acc:'88%', crops:'All crops' },
  { icon:'🌿', name:'Nutrient Deficiency', acc:'89%', crops:'Rice, Wheat, Vegetable' },
  { icon:'🔥', name:'Heat Stress', acc:'85%', crops:'Tomato, Pepper, Cotton' },
  { icon:'🌱', name:'Weed Detection', acc:'92%', crops:'Field crops' },
  { icon:'🧫', name:'Bacterial Canker', acc:'87%', crops:'Citrus, Stone fruit' },
];

const tech = [
  { icon:'🔮', name:'Gemini Vision', desc:'Google Gemini 1.5 Flash for multi-modal crop disease image analysis and pathogen identification.' },
  { icon:'⚡', name:'Groq LLaMA 3', desc:'Ultra-fast inference engine delivering agronomic prescriptions in under 2 seconds.' },
  { icon:'🌦️', name:'OpenWeather API', desc:'Real-time and 14-day forecast data for disease pressure modeling and risk alerts.' },
  { icon:'🛰️', name:'NDVI Processing', desc:'Normalized Difference Vegetation Index mapping from satellite and drone imagery.' },
];

export default function ProductPage() {
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const [lineWidths, setLineWidths] = useState([0,0,0,0]);
  const pipeRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        [0,1,2,3].forEach(i => setTimeout(() => setLineWidths(w => { const n=[...w]; n[i]=100; return n; }), i*200));
      }
    }, { threshold: 0.3 });
    if (pipeRef.current) obs.observe(pipeRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{__html:css}}/>
      <Navigation/>
      <div style={{ background:'#060A04', color:'white', fontFamily:'Inter,system-ui,sans-serif' }}>

        {/* HERO */}
        <section style={{ position:'relative', overflow:'hidden', paddingTop:'160px', paddingBottom:'6rem', textAlign:'center', padding:'160px 3rem 6rem' }}>
          <video autoPlay muted loop playsInline style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', opacity:0.12, zIndex:0 }} src="/4329-178324572.mp4"/>
          <div style={{ position:'absolute', inset:0, background:'rgba(6,10,4,0.85)', zIndex:1 }}/>
          <div style={{ position:'relative', zIndex:2, maxWidth:'900px', margin:'0 auto' }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:'6px', background:'rgba(200,245,62,0.08)', border:'1px solid rgba(200,245,62,0.2)', borderRadius:'99px', padding:'0.4rem 1.2rem', fontFamily:'monospace', fontSize:'0.7rem', color:'#C8F53E', letterSpacing:'0.15em', marginBottom:'1.5rem' }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:'#C8F53E', display:'inline-block', animation:'blink 1s infinite' }}/>
              AI PIPELINE · POWERED BY GEMINI + GROQ
            </div>
            <h1 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(3rem,7vw,6rem)', fontStyle:'italic', fontWeight:900, lineHeight:1.05, margin:'0 0 1.5rem' }}>From Pixel to Prescription<br/>in 4.2 Seconds.</h1>
            {/* Counters */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1.5rem', maxWidth:'600px', margin:'0 auto 2.5rem' }}>
              {[{ t:14000, s:'+', l:'Fields Scanned', fmt:'14,000' }, { t:94, s:'%', l:'Detection Accuracy', fmt:null }, { t:4.2, s:'s', l:'Avg Processing Time', fmt:null, dec:1 }].map((c,i) => (
                <div key={i} style={{ background:'#0F1409', border:'1px solid rgba(200,245,62,0.1)', padding:'1.5rem 1rem', textAlign:'center' }}>
                  <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'2.8rem', color:'#C8F53E', fontStyle:'italic', lineHeight:1 }}>
                    {c.fmt ? c.fmt+c.s : <Counter target={c.t} suffix={c.s} decimals={c.dec||0}/>}
                  </div>
                  <div style={{ fontFamily:'monospace', fontSize:'0.62rem', color:'rgba(255,255,255,0.4)', letterSpacing:'0.12em', textTransform:'uppercase', marginTop:'0.4rem' }}>{c.l}</div>
                </div>
              ))}
            </div>
            <div style={{ display:'flex', gap:'1rem', justifyContent:'center' }}>
              <button style={{ background:'#C8F53E', color:'#060A04', border:'none', padding:'0.9rem 2rem', fontFamily:'monospace', fontSize:'0.82rem', fontWeight:900, letterSpacing:'0.12em', textTransform:'uppercase', cursor:'pointer' }}>Try Live Demo →</button>
              <button style={{ background:'transparent', border:'1px solid rgba(255,255,255,0.25)', color:'white', padding:'0.9rem 1.8rem', fontFamily:'monospace', fontSize:'0.82rem', letterSpacing:'0.1em', textTransform:'uppercase', cursor:'pointer' }}>View Pricing</button>
            </div>
          </div>
        </section>

        {/* PIPELINE TIMELINE */}
        <section style={{ background:'#0A0E07', padding:'8rem 3rem' }}>
          <div className="reveal" style={{ textAlign:'center', marginBottom:'4rem' }}>
            <p style={{ fontFamily:'monospace', fontSize:'0.62rem', color:'#C8F53E', letterSpacing:'0.25em', textTransform:'uppercase', marginBottom:'0.8rem' }}>STEP BY STEP</p>
            <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(2.5rem,5vw,4rem)', fontStyle:'italic', fontWeight:900 }}>THE INTELLIGENCE PIPELINE</h2>
          </div>
          <div ref={pipeRef} style={{ display:'flex', gap:0, alignItems:'stretch', maxWidth:'1200px', margin:'0 auto', position:'relative' }}>
            {pipeline.map((p, i) => (
              <React.Fragment key={i}>
                <div style={{ flex:1, background:'#0F1409', border:'1px solid rgba(200,245,62,0.08)', padding:'2rem 1.5rem', textAlign:'center', position:'relative' }}>
                  <div style={{ width:'36px', height:'36px', borderRadius:'50%', background:'#C8F53E', color:'#060A04', fontFamily:'monospace', fontSize:'0.75rem', fontWeight:900, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1rem' }}>{p.n}</div>
                  <div style={{ fontSize:'1.8rem', marginBottom:'0.75rem' }}>{p.icon}</div>
                  <h3 style={{ fontWeight:700, fontSize:'0.95rem', marginBottom:'0.6rem' }}>{p.title}</h3>
                  <p style={{ color:'rgba(255,255,255,0.45)', fontSize:'0.8rem', lineHeight:1.7, marginBottom:'0.8rem' }}>{p.desc}</p>
                  <p style={{ color:'#C8F53E', fontFamily:'monospace', fontSize:'0.7rem', fontWeight:700, letterSpacing:'0.1em' }}>{p.stat}</p>
                </div>
                {i < 4 && (
                  <div style={{ width:'40px', display:'flex', alignItems:'center', flexShrink:0 }}>
                    <div style={{ height:'2px', width:`${lineWidths[i]}%`, background:'linear-gradient(to right,#C8F53E,rgba(200,245,62,0.2))', transition:'width 1s ease', maxWidth:'40px' }}/>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </section>

        {/* DETECTION GRID */}
        <section style={{ background:'#060A04', padding:'8rem 3rem' }}>
          <div className="reveal" style={{ textAlign:'center', marginBottom:'3rem' }}>
            <p style={{ fontFamily:'monospace', fontSize:'0.62rem', color:'#C8F53E', letterSpacing:'0.25em', textTransform:'uppercase', marginBottom:'0.8rem' }}>CAPABILITIES</p>
            <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(2.5rem,5vw,4rem)', fontStyle:'italic', fontWeight:900 }}>WHAT AGROGUARD SEES</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1rem', maxWidth:'1100px', margin:'0 auto' }}>
            {detections.map((d,i) => (
              <div key={i} className="detect-card" style={{ background:'#0F1409', border:'1px solid rgba(200,245,62,0.08)', borderLeft:'1px solid rgba(200,245,62,0.08)', padding:'1.5rem', transition:'all 0.25s', cursor:'default' }}>
                <div style={{ fontSize:'1.8rem', marginBottom:'0.8rem' }}>{d.icon}</div>
                <h3 style={{ fontWeight:700, fontSize:'0.92rem', marginBottom:'0.4rem' }}>{d.name}</h3>
                <p style={{ color:'#C8F53E', fontFamily:'monospace', fontSize:'0.85rem', fontWeight:700, marginBottom:'0.4rem' }}>{d.acc}</p>
                <p style={{ color:'rgba(255,255,255,0.35)', fontSize:'0.72rem', fontFamily:'monospace' }}>{d.crops}</p>
              </div>
            ))}
          </div>
        </section>

        {/* TECH STACK */}
        <section style={{ background:'#0A0E07', padding:'8rem 3rem' }}>
          <div className="reveal" style={{ textAlign:'center', marginBottom:'3rem' }}>
            <p style={{ fontFamily:'monospace', fontSize:'0.62rem', color:'#C8F53E', letterSpacing:'0.25em', textTransform:'uppercase', marginBottom:'0.8rem' }}>INFRASTRUCTURE</p>
            <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(2.5rem,5vw,4rem)', fontStyle:'italic', fontWeight:900 }}>BUILT ON WORLD-CLASS INFRASTRUCTURE</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'1.5rem', maxWidth:'900px', margin:'0 auto' }}>
            {tech.map((t,i) => (
              <div key={i} className="tech-card" style={{ background:'#0F1409', border:'1px solid rgba(200,245,62,0.08)', padding:'2rem', transition:'all 0.25s' }}>
                <div style={{ fontSize:'2rem', marginBottom:'1rem' }}>{t.icon}</div>
                <h3 style={{ fontWeight:700, fontSize:'1.1rem', marginBottom:'0.6rem', color:'#C8F53E' }}>{t.name}</h3>
                <p style={{ color:'rgba(255,255,255,0.45)', fontSize:'0.88rem', lineHeight:1.7 }}>{t.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SUPPORTED INPUTS */}
        <section style={{ background:'#060A04', padding:'6rem 3rem' }}>
          <div className="reveal" style={{ textAlign:'center', marginBottom:'3rem' }}>
            <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(2rem,4vw,3.5rem)', fontStyle:'italic', fontWeight:900 }}>SUPPORTED INPUT TYPES</h2>
          </div>
          <div style={{ display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap', maxWidth:'900px', margin:'0 auto' }}>
            {[['📱','Mobile'],['🚁','Drone'],['🛰️','Satellite'],['🌡️','Thermal'],['📡','IoT Sensor'],['🗺️','GIS Data']].map(([icon,label],i) => (
              <div key={i} className="input-card" style={{ background:'#0F1409', border:'1px solid rgba(200,245,62,0.1)', padding:'1.5rem 2rem', textAlign:'center', minWidth:'130px', transition:'all 0.25s' }}>
                <div style={{ fontSize:'2rem', marginBottom:'0.5rem' }}>{icon}</div>
                <div style={{ fontFamily:'monospace', fontSize:'0.72rem', color:'rgba(255,255,255,0.6)', letterSpacing:'0.1em', textTransform:'uppercase' }}>{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* COMPARISON TABLE */}
        <section style={{ background:'#0A0E07', padding:'6rem 3rem' }}>
          <div className="reveal" style={{ textAlign:'center', marginBottom:'3rem' }}>
            <p style={{ fontFamily:'monospace', fontSize:'0.62rem', color:'#C8F53E', letterSpacing:'0.25em', textTransform:'uppercase', marginBottom:'0.8rem' }}>COMPARISON</p>
            <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(2rem,4vw,3.5rem)', fontStyle:'italic', fontWeight:900 }}>WHY AGROGUARD WINS</h2>
          </div>
          <table style={{ width:'100%', maxWidth:'900px', margin:'0 auto', borderCollapse:'collapse' }}>
            <thead><tr>
              {['FEATURE','TRADITIONAL SCOUTING','AGROGUARD AI'].map((h,i) => (
                <th key={h} style={{ padding:'1rem', textAlign:i===0?'left':'center', fontFamily:'monospace', fontSize:'0.65rem', letterSpacing:'0.12em', color: i===2?'#C8F53E':'rgba(255,255,255,0.4)', background: i===2?'rgba(200,245,62,0.06)':'transparent', borderBottom:'1px solid rgba(200,245,62,0.08)' }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {[['Detection Speed','3-7 days','4.2 seconds'],['Accuracy','60-70%','94%'],['Coverage','Per-scout visit','Continuous 24/7'],['Cost per Ha','$15-40','$2-5'],['Disease Types','~20 known','94 pathogens'],['Weather Integration','Manual','Automated'],['Report Generation','2-3 days','Real-time']].map((row,ri) => (
                <tr key={ri} style={{ background:ri%2?'rgba(255,255,255,0.01)':'transparent', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                  {row.map((cell,ci) => (
                    <td key={ci} style={{ padding:'0.85rem 1rem', textAlign:ci===0?'left':'center', fontSize:'0.88rem', color: ci===2?'#C8F53E':'rgba(255,255,255,0.55)', fontFamily:ci===0?'inherit':'monospace', background: ci===2?'rgba(200,245,62,0.03)':'transparent' }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* BOTTOM CTA */}
        <section style={{ background:'#C8F53E', padding:'6rem 3rem', textAlign:'center', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', fontSize:'15vw', fontWeight:900, color:'rgba(6,10,4,0.07)', whiteSpace:'nowrap', pointerEvents:'none' }}>AGROGUARD</div>
          <div style={{ position:'relative', zIndex:1 }}>
            <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(2.5rem,5vw,4rem)', color:'#060A04', fontStyle:'italic', fontWeight:900, marginBottom:'0.8rem' }}>Seen enough? Your first 50 scans are free.</h2>
            <p style={{ color:'rgba(6,10,4,0.6)', fontSize:'1rem', marginBottom:'2rem' }}>No credit card required. Full access to the detection engine.</p>
            <div style={{ display:'flex', gap:'1rem', justifyContent:'center' }}>
              <button style={{ background:'#060A04', color:'#C8F53E', border:'none', padding:'1rem 2rem', fontFamily:'monospace', fontSize:'0.82rem', fontWeight:900, letterSpacing:'0.12em', textTransform:'uppercase', cursor:'pointer' }}>START FREE TRIAL →</button>
              <button style={{ background:'transparent', border:'1px solid rgba(6,10,4,0.3)', color:'#060A04', padding:'1rem 2rem', fontFamily:'monospace', fontSize:'0.82rem', letterSpacing:'0.1em', textTransform:'uppercase', cursor:'pointer' }}>VIEW PRICING</button>
            </div>
          </div>
        </section>

        <Footer/>
      </div>
    </>
  );
}
