'use client';
import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const css = `
@keyframes shimmer{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
.pricing-card{transition:transform 0.3s ease,box-shadow 0.3s ease}
.pricing-card:hover{transform:translateY(-6px)}
.faq-item{background:#0F1409;border:1px solid rgba(255,255,255,0.06);margin-bottom:0.5rem}
.partner-tag:hover{border-color:#C8F53E!important;box-shadow:0 0 16px rgba(200,245,62,0.15)}
`;

const faqs = [
  ['Can I upgrade or downgrade anytime?','Yes. Plan changes take effect at your next billing cycle. Upgrades are instant.'],
  ['What image formats are supported?','JPG, PNG, WEBP, TIFF, RAW, and MP4 video on Commercial and Enterprise tiers.'],
  ['Is my farm data shared with third parties?','Never. All farm data is encrypted and private. We do not sell or share your data.'],
  ['How accurate is the AI on low-resolution footage?','We maintain 85%+ accuracy on standard 1080p footage. 4K is optimal.'],
  ['Do you offer on-premise deployment?','Yes — Enterprise plan includes air-gapped on-site server deployment options.'],
  ['What does agronomist support include?','Commercial: direct chat/email. Enterprise: dedicated advisor with weekly video calls.'],
];

export default function PricingPage() {
  const [yearly, setYearly] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [openFaq, setOpenFaq] = useState<number|null>(null);
  const [pills, setPills] = useState([false,false,false]);

  useEffect(()=>{
    const t1=setTimeout(()=>setPills([true,false,false]),300);
    const t2=setTimeout(()=>setPills([true,true,false]),500);
    const t3=setTimeout(()=>setPills([true,true,true]),700);
    return()=>{clearTimeout(t1);clearTimeout(t2);clearTimeout(t3);};
  },[]);
  useEffect(()=>{
    const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible');}),{threshold:0.1});
    document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));
    return()=>obs.disconnect();
  },[]);

  const tiers = [
    { name:'RESEARCH PILOT', tag:'FREE FOREVER', tagColor:'rgba(255,255,255,0.3)', price:'$0', period:'forever', color:'rgba(255,255,255,0.06)', glow:'none', scale:1, btnStyle:{ background:'transparent', border:'1px solid rgba(255,255,255,0.25)', color:'white' }, cta:'Start Free Trial →', features:['50 scans / month','Standard RGB analysis','Basic pest identification','Community support','1 user license','30-day data history'] },
    { name:'COMMERCIAL FLEET', tag:'MOST POPULAR', tagColor:'#060A04', price: yearly?'$399':'$499', period:'/month', color:'#C8F53E', glow:'0 0 60px rgba(200,245,62,0.15),0 0 120px rgba(200,245,62,0.06)', scale:1.04, btnStyle:{ background:'#C8F53E', border:'none', color:'#060A04', fontWeight:900 }, cta:'DEPLOY FLEET →', features:['Unlimited scans','Multi-spectral drone support','NDVI & Thermal integration','API access for 10 users','Direct agronomist support','Automated risk forecasting'] },
    { name:'GLOBAL ENTERPRISE', tag:'ENTERPRISE', tagColor:'#F5C842', price:'Custom', period:'', color:'rgba(245,200,66,0.25)', glow:'0 0 40px rgba(245,200,66,0.06)', scale:1, btnStyle:{ background:'transparent', border:'1px solid #F5C842', color:'#F5C842' }, cta:'Talk to Sales →', features:['Satellite swarm integration','Custom model fine-tuning','White-label reporting','On-site deployment','SLA uptime guarantees','Unlimited users'] },
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{__html:css}}/>
      <Navigation/>
      <div style={{ background:'#060A04', color:'white', fontFamily:'Inter,system-ui,sans-serif', minHeight:'100vh' }}>
        {/* HERO */}
        <section style={{ position:'relative', overflow:'hidden', paddingTop:'140px', paddingBottom:'4rem', textAlign:'center', padding:'140px 3rem 4rem' }}>
          <video autoPlay muted loop playsInline style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', opacity:0.12, zIndex:0 }} src="/249448.mp4"/>
          <div style={{ position:'absolute', inset:0, background:'rgba(6,10,4,0.85)', zIndex:1 }}/>
          <div style={{ position:'relative', zIndex:2 }}>
            <p style={{ fontFamily:'monospace', fontSize:'0.62rem', color:'#C8F53E', letterSpacing:'0.25em', textTransform:'uppercase', marginBottom:'1rem' }}>PRICING · TRANSPARENT & SCALABLE</p>
            <h1 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(3rem,6vw,5.5rem)', fontWeight:900, fontStyle:'italic', lineHeight:0.92, margin:'0 auto 1rem', maxWidth:'800px' }}>CHOOSE YOUR INTELLIGENCE LEVEL</h1>
            <p style={{ color:'rgba(255,255,255,0.45)', fontSize:'1rem', marginBottom:'1.5rem' }}>Start free. Scale to satellite. Cancel anytime.</p>
            <div style={{ display:'flex', justifyContent:'center', gap:'1rem', marginBottom:'2rem', flexWrap:'wrap' }}>
              {['⚡ Setup in 2 minutes','🔒 No credit card for free tier','📈 ROI positive in first season'].map((p,i)=>(
                <span key={i} style={{ background:'rgba(200,245,62,0.07)', border:'1px solid rgba(200,245,62,0.2)', borderRadius:'99px', padding:'0.45rem 1.1rem', fontFamily:'monospace', fontSize:'0.72rem', color:'rgba(255,255,255,0.7)', opacity:pills[i]?1:0, transform:pills[i]?'translateY(0)':'translateY(20px)', transition:'all 0.4s ease' }}>{p}</span>
              ))}
            </div>
            {/* Toggle */}
            <div style={{ display:'inline-flex', alignItems:'center', gap:'0.8rem', background:'#0A0E07', border:'1px solid rgba(200,245,62,0.1)', padding:'0.35rem', borderRadius:'99px' }}>
              <button onClick={()=>setYearly(false)} style={{ padding:'0.5rem 1.2rem', borderRadius:'99px', border:'none', background:!yearly?'#C8F53E':'transparent', color:!yearly?'#060A04':'rgba(255,255,255,0.45)', fontFamily:'monospace', fontSize:'0.72rem', cursor:'pointer', transition:'all 0.2s', fontWeight:!yearly?900:400 }}>MONTHLY</button>
              <button onClick={()=>setYearly(true)} style={{ padding:'0.5rem 1.2rem', borderRadius:'99px', border:'none', background:yearly?'#C8F53E':'transparent', color:yearly?'#060A04':'rgba(255,255,255,0.45)', fontFamily:'monospace', fontSize:'0.72rem', cursor:'pointer', transition:'all 0.2s', fontWeight:yearly?900:400, display:'flex', alignItems:'center', gap:'0.5rem' }}>
                YEARLY <span style={{ background:'#22c55e', color:'white', fontSize:'0.55rem', padding:'0.15rem 0.4rem', borderRadius:'99px', fontWeight:900 }}>SAVE 20%</span>
              </button>
            </div>
          </div>
        </section>

        {/* CARDS */}
        <section style={{ padding:'0 3rem 6rem', maxWidth:'1200px', margin:'0 auto' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1.5rem', alignItems:'start' }}>
            {tiers.map((t,i)=>(
              <div key={i} className="pricing-card" style={{ background: i===1?'#111A08':'#0A0E07', border:`1px solid ${t.color}`, boxShadow:t.glow, transform:`scale(${t.scale})`, padding:'2rem', position:'relative', boxSizing:'border-box' as const }}>
                {i===1&&<div style={{ position:'absolute', top:'-14px', left:'50%', transform:'translateX(-50%)', background:'#C8F53E', color:'#060A04', fontFamily:'monospace', fontSize:'0.65rem', fontWeight:900, padding:'0.3rem 1rem', letterSpacing:'0.1em', whiteSpace:'nowrap' as const }}>MOST POPULAR</div>}
                <span style={{ fontFamily:'monospace', fontSize:'0.62rem', color:t.tagColor, letterSpacing:'0.15em', textTransform:'uppercase' as const, background:'rgba(255,255,255,0.06)', padding:'0.3rem 0.8rem', borderRadius:'99px', display:'inline-block', marginBottom:'1.2rem' }}>{t.tag}</span>
                <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize: i===1?'5.5rem':'4.5rem', fontStyle:'italic', color: i===1?'#C8F53E': i===2?'#F5C842':'white', lineHeight:1, marginBottom:'0.3rem' }}>{t.price}</div>
                {t.period&&<div style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.85rem', marginBottom:'1.2rem', fontFamily:'monospace' }}>{t.period}</div>}
                <div style={{ borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:'1.2rem', marginBottom:'1.5rem' }}>
                  {t.features.map(f=>(
                    <div key={f} style={{ display:'flex', gap:'0.6rem', marginBottom:'0.6rem', fontSize:'0.85rem', color:'rgba(255,255,255,0.65)' }}>
                      <span style={{ color:'#C8F53E', flexShrink:0 }}>✓</span>{f}
                    </div>
                  ))}
                </div>
                <button style={{ width:'100%', padding:'1rem', fontFamily:'monospace', fontSize:'0.78rem', letterSpacing:'0.12em', textTransform:'uppercase' as const, cursor:'pointer', transition:'all 0.2s', ...t.btnStyle }}>{t.cta}</button>
              </div>
            ))}
          </div>
        </section>

        {/* COMPARISON TABLE */}
        <section className="reveal" style={{ padding:'0 3rem 6rem', maxWidth:'1100px', margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:'2rem' }}>
            <p style={{ fontFamily:'monospace', fontSize:'0.62rem', color:'#C8F53E', letterSpacing:'0.25em', textTransform:'uppercase', marginBottom:'0.6rem' }}>FULL FEATURE BREAKDOWN</p>
            <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(2rem,4vw,3rem)', fontStyle:'italic', fontWeight:900, marginBottom:'1.5rem' }}>SEE EVERYTHING INCLUDED</h2>
            <button onClick={()=>setShowTable(!showTable)} style={{ background:'transparent', border:'1px solid rgba(200,245,62,0.3)', color:'#C8F53E', fontFamily:'monospace', fontSize:'0.72rem', letterSpacing:'0.12em', textTransform:'uppercase', padding:'0.7rem 1.5rem', cursor:'pointer' }}>
              {showTable?'HIDE COMPARISON ▲':'SHOW FULL COMPARISON ▼'}
            </button>
          </div>
          <div style={{ maxHeight:showTable?'2000px':'0', overflow:'hidden', transition:'max-height 0.6s ease' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead><tr style={{ borderBottom:'1px solid rgba(200,245,62,0.1)' }}>
                {['FEATURE','RESEARCH','COMMERCIAL','ENTERPRISE'].map((h,i)=>(
                  <th key={h} style={{ padding:'0.8rem 1rem', textAlign: i===0?'left':'center', fontFamily:'monospace', fontSize:'0.65rem', color: i===2?'#C8F53E':'rgba(255,255,255,0.4)', letterSpacing:'0.12em', background: i===2?'rgba(200,245,62,0.06)':undefined }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {[['Monthly Scans','50','Unlimited','Unlimited'],['Multi-spectral','❌','✅','✅'],['API Access','❌','✅','✅'],['Agronomist Support','Community','Direct','Dedicated'],['Data History','30 Days','Forever','Forever'],['Risk Forecast','❌','5 Days','14 Days'],['Drone Integration','Manual','Direct Sync','Fleet Command'],['NDVI Mapping','❌','✅','✅ Advanced'],['White Label','❌','❌','✅'],['On-Premise','❌','❌','✅'],['SLA Guarantee','❌','❌','✅'],['Custom AI Training','❌','❌','✅']].map((row,ri)=>(
                  <tr key={ri} style={{ background: ri%2===0?'rgba(255,255,255,0.01)':'transparent', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                    {row.map((cell,ci)=>(
                      <td key={ci} style={{ padding:'0.7rem 1rem', textAlign:ci===0?'left':'center', fontSize:'0.82rem', color: cell==='✅'?'#C8F53E': cell==='❌'?'rgba(255,79,79,0.6)':'rgba(255,255,255,0.6)', fontFamily:'monospace', background: ci===2?'rgba(200,245,62,0.04)':undefined }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* SOCIAL PROOF */}
        <section className="reveal" style={{ padding:'0 3rem 6rem', textAlign:'center' }}>
          <p style={{ fontFamily:'monospace', fontSize:'0.62rem', color:'#C8F53E', letterSpacing:'0.2em', textTransform:'uppercase', marginBottom:'1.5rem' }}>TRUSTED BY EARLY PARTNERS IN US, INDIA & EUROPE</p>
          <div style={{ display:'flex', justifyContent:'center', gap:'1rem', flexWrap:'wrap', marginBottom:'2rem' }}>
            {['AgriTech Labs','FarmSense','CropChain','TerraYield','AgroPilot'].map(p=>(
              <div key={p} className="partner-tag" style={{ background:'#0F1409', border:'1px solid rgba(200,245,62,0.1)', padding:'0.8rem 2rem', fontFamily:'monospace', fontWeight:700, fontSize:'0.82rem', cursor:'pointer', transition:'all 0.2s' }}>{p}</div>
            ))}
          </div>
          <p style={{ fontStyle:'italic', color:'rgba(255,255,255,0.5)', maxWidth:'600px', margin:'0 auto 0.8rem', fontSize:'1rem', lineHeight:1.75 }}>&ldquo;LEAFGUARD paid for itself in the first harvest season. The ROI was immediate.&rdquo;</p>
          <p style={{ color:'rgba(255,255,255,0.3)', fontSize:'0.8rem', fontFamily:'monospace' }}>— Jason Merritt, Operations Director, FarmSense</p>
        </section>

        {/* FAQ */}
        <section style={{ padding:'0 3rem 6rem', maxWidth:'800px', margin:'0 auto' }}>
          <div className="reveal" style={{ textAlign:'center', marginBottom:'2.5rem' }}>
            <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(2rem,4vw,3rem)', fontStyle:'italic', fontWeight:900 }}>EVERYTHING YOU NEED TO KNOW</h2>
          </div>
          {faqs.map(([q,a],i)=>(
            <div key={i} className="faq-item" onClick={()=>setOpenFaq(openFaq===i?null:i)} style={{ cursor:'pointer' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'1.2rem 1.5rem' }}>
                <span style={{ fontWeight:700, fontSize:'0.92rem' }}>{q}</span>
                <span style={{ color:'#C8F53E', fontSize:'1.2rem', transition:'transform 0.2s', transform:openFaq===i?'rotate(45deg)':'none', flexShrink:0, marginLeft:'1rem' }}>+</span>
              </div>
              <div style={{ maxHeight:openFaq===i?'500px':'0', overflow:'hidden', transition:'max-height 0.4s ease' }}>
                <p style={{ padding:'0 1.5rem 1.2rem', color:'rgba(255,255,255,0.5)', fontSize:'0.88rem', lineHeight:1.75, margin:0 }}>{a}</p>
              </div>
            </div>
          ))}
        </section>

        {/* BOTTOM CTA */}
        <section style={{ background:'#C8F53E', padding:'6rem 3rem', textAlign:'center', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', fontSize:'18vw', fontWeight:900, color:'rgba(6,10,4,0.07)', whiteSpace:'nowrap', pointerEvents:'none', letterSpacing:'-0.02em' }}>LEAFGUARD</div>
          <div style={{ position:'relative', zIndex:1 }}>
            <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(2.5rem,5vw,4rem)', color:'#060A04', fontStyle:'italic', fontWeight:900, marginBottom:'0.5rem' }}>NOT SURE WHICH PLAN?</h2>
            <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(2.5rem,5vw,4rem)', color:'#060A04', fontStyle:'italic', fontWeight:900, marginBottom:'1rem' }}>TALK TO A REAL AGRONOMIST.</h2>
            <p style={{ color:'rgba(6,10,4,0.6)', fontSize:'1rem', marginBottom:'2rem' }}>We&apos;ll help you audit your scouting process and find the best plan for your season.</p>
            <div style={{ display:'flex', justifyContent:'center', gap:'1rem', flexWrap:'wrap' }}>
              <button style={{ background:'#060A04', color:'#C8F53E', border:'none', padding:'1rem 2rem', fontFamily:'monospace', fontSize:'0.78rem', fontWeight:900, letterSpacing:'0.12em', textTransform:'uppercase', cursor:'pointer' }}>BOOK A FREE 15-MIN CALL →</button>
              <button style={{ background:'transparent', border:'1px solid rgba(6,10,4,0.3)', color:'#060A04', padding:'1rem 2rem', fontFamily:'monospace', fontSize:'0.78rem', letterSpacing:'0.12em', textTransform:'uppercase', cursor:'pointer' }}>VIEW FULL DOCS →</button>
            </div>
          </div>
        </section>

        <Footer/>
      </div>
    </>
  );
}
