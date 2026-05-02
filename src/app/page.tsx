'use client';
import React, { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const GlobalMap = dynamic(() => import('@/components/GlobalMap'), { ssr: false });

const css = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono&display=swap');
@keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
@keyframes pulse { 0%,100%{box-shadow:0 0 0 0 rgba(200,245,62,0.4)} 70%{box-shadow:0 0 0 8px transparent} }
@keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
.reveal{opacity:0;transform:translateY(30px);transition:opacity 0.7s ease,transform 0.7s ease}
.reveal.visible{opacity:1;transform:translateY(0)}
.partner-card:hover{border-color:#C8F53E!important;box-shadow:0 0 16px rgba(200,245,62,0.15)}
.feature-card:hover{border-left:3px solid #C8F53E!important;transform:translateY(-4px);box-shadow:0 8px 32px rgba(200,245,62,0.06)}
.stat-pill{animation:fadeUp 0.6s ease both}
html { scroll-behavior: smooth; }
`;

export default function HomePage() {
  const [pp, setPp] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [consoleLogs, setConsoleLogs] = useState<string[]>(['> Waiting for input']);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addLog = (msg: string) => {
    setConsoleLogs(prev => [...prev.slice(-4), msg]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const b64 = reader.result as string;
        setImagePreview(b64);
        setAnalysisResult(null);
        setConsoleLogs(['> Image loaded. Initializing scan...']);
        analyzeImage(b64, file.type);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async (base64: string, mediaType: string) => {
    setAnalyzing(true);
    setAnalysisResult(null);

    // Animate console
    const logs = [
      '> Uploading field image...',
      '> Running neural pathogen detection...',
      '> Analyzing spectral signatures...',
      '> Generating threat report...'
    ];

    logs.forEach((log, i) => {
      setTimeout(() => addLog(log), (i + 1) * 600);
    });

    // Animate Processing Power
    const targetMs = Math.floor(Math.random() * (4200 - 2000 + 1) + 2000);
    let start = 0;
    const duration = targetMs;
    const startTime = performance.now();

    const animatePP = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setPp(Math.floor(progress * targetMs));
      if (progress < 1) requestAnimationFrame(animatePP);
    };
    requestAnimationFrame(animatePP);

    try {
      // Convert base64 to Blob to send as FormData
      const res_fetch = await fetch(base64);
      const blob = await res_fetch.blob();
      const file = new File([blob], 'capture.jpg', { type: mediaType });

      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch('/api/analyze', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();

      setTimeout(() => {
        if (data.success) {
          setAnalysisResult(data.report);
          addLog('> Analysis complete.');
        } else {
          addLog('> Analysis failed.');
        }
        setAnalyzing(false);
      }, Math.max(logs.length * 600 + 500, targetMs)); // Ensure animations finish
    } catch (err) {
      addLog('> Error connecting to AI node.');
      setAnalyzing(false);
    }
  };

  const runSample = async (type: 'WHEAT' | 'SOY') => {
    const url = type === 'WHEAT'
      ? 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&q=80'
      : 'https://images.unsplash.com/photo-1595113316349-9fa4ee24f884?w=800&q=80';

    setConsoleLogs([`> Fetching sample ${type}...`]);
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result as string;
        setImagePreview(base64data);
        analyzeImage(base64data, blob.type);
      };
      reader.readAsDataURL(blob);
    } catch (e) {
      addLog('> Failed to load sample image.');
    }
  };

  const resetScanner = () => {
    setImagePreview(null);
    setAnalysisResult(null);
    setConsoleLogs(['> Waiting for input']);
    setPp(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div style={{ background: '#060A04', color: 'white', fontFamily: 'Inter,system-ui,sans-serif' }}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <Navigation />

      {/* HERO */}
      <section style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', padding: '0 3rem', paddingTop: '80px' }}>
        <video autoPlay muted loop playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.15, zIndex: 0 }} src="/238827.mp4" />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(6,10,4,0.92),rgba(6,10,4,0.6),rgba(6,10,4,0.88))', zIndex: 1 }} />
        <svg style={{ position: 'absolute', right: '20%', top: '50%', transform: 'translateY(-50%)', opacity: 0.07, zIndex: 1 }} width="500" height="500" viewBox="0 0 100 100" fill="none" stroke="#C8F53E" strokeWidth="0.5">
          <circle cx="50" cy="50" r="40" /><circle cx="50" cy="50" r="20" /><line x1="10" y1="50" x2="90" y2="50" /><line x1="50" y1="10" x2="50" y2="90" />
        </svg>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '650px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(200,245,62,0.08)', border: '1px solid rgba(200,245,62,0.2)', borderRadius: '99px', padding: '0.4rem 1rem', fontFamily: 'monospace', fontSize: '0.7rem', color: '#C8F53E', letterSpacing: '0.15em', marginBottom: '1.2rem' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#C8F53E', display: 'inline-block' }} />
            LEAF_OS V4.0 PLATFORM
          </div>
          <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(4rem,10vw,8rem)', fontWeight: 900, fontStyle: 'italic', lineHeight: 0.88, margin: '0 0 1.2rem' }}>
            <span style={{ color: 'white' }}>CATCH DISEASE<br /></span>
            <span style={{ color: '#C8F53E' }}>14 DAYS<br />BEFORE<br /></span>
            <span style={{ color: 'white' }}>IT&apos;S VISIBLE.</span>
          </h1>
          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.5)', maxWidth: '480px', lineHeight: 1.75, marginBottom: '2rem' }}>Precision AI that identifies pathogens at the cellular level before they destroy your harvest.</p>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
            <button
              onClick={() => document.getElementById('ai-demo')?.scrollIntoView({ behavior: 'smooth' })}
              style={{ background: '#C8F53E', color: '#060A04', fontWeight: 900, fontFamily: 'monospace', fontSize: '0.82rem', letterSpacing: '0.12em', padding: '0.9rem 2rem', border: 'none', cursor: 'pointer', transition: 'transform 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            >
              RUN LIVE DEMO →
            </button>
            <button style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.25)', color: 'white', fontWeight: 700, fontFamily: 'monospace', fontSize: '0.82rem', letterSpacing: '0.1em', padding: '0.9rem 1.8rem', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8F53E'; e.currentTarget.style.color = '#C8F53E' }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.color = 'white' }}>ENTERPRISE PILOT</button>
          </div>
          <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
            {['● 4.2s avg detection time', '● 14,000+ fields scanned', '● 94% detection accuracy'].map((s, i) => (
              <span key={i} className="stat-pill" style={{ background: 'rgba(200,245,62,0.06)', border: '1px solid rgba(200,245,62,0.18)', borderRadius: '99px', padding: '0.4rem 1rem', fontFamily: 'monospace', fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', animationDelay: `${i * 0.1 + 0.3}s` }}>{s}</span>
            ))}
          </div>
        </div>
        <div style={{ position: 'absolute', right: '3rem', top: '50%', transform: 'translateY(-50%)', zIndex: 2, width: '360px', background: '#0F1409', border: '1px solid rgba(200,245,62,0.15)', padding: '1.5rem', borderRadius: '4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>⚡ Crop Health Report</span>
            <span style={{ background: '#C8F53E', color: '#060A04', fontFamily: 'monospace', fontSize: '0.6rem', fontWeight: 900, padding: '0.2rem 0.6rem', letterSpacing: '0.1em' }}>LIVE INFERENCE</span>
          </div>
          <img src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&q=80" alt="field" style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '4px', marginBottom: '1rem' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>Disease Risk</span>
            <span style={{ color: '#FFB347', fontWeight: 700 }}>Moderate ⚠️</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>Confidence</span>
            <span style={{ color: '#C8F53E', fontWeight: 900, fontSize: '1.1rem' }}>94%</span>
          </div>
          <div style={{ background: 'rgba(200,245,62,0.08)', border: '1px solid rgba(200,245,62,0.15)', padding: '0.8rem', borderRadius: '4px', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>
            ● Apply fungicide in 3–5 days. Targeted sector 4-B coverage recommended.
          </div>
        </div>
      </section>

      {/* PARTNERS MARQUEE */}
      <section style={{ background: '#0A0E07', borderTop: '1px solid rgba(200,245,62,0.06)', borderBottom: '1px solid rgba(200,245,62,0.06)', padding: '1.5rem 0', overflow: 'hidden' }}>
        <p style={{ textAlign: 'center', fontFamily: 'monospace', fontSize: '0.6rem', color: '#C8F53E', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1rem' }}>GLOBAL INFRASTRUCTURE PARTNERS</p>
        <div style={{ overflow: 'hidden', WebkitMaskImage: 'linear-gradient(to right,transparent,black 10%,black 90%,transparent)', maskImage: 'linear-gradient(to right,transparent,black 10%,black 90%,transparent)' }}>
          <div style={{ display: 'flex', gap: '1.5rem', animation: 'marquee 25s linear infinite', width: 'max-content' }}
            onMouseEnter={e => (e.currentTarget.style.animationPlayState = 'paused')}
            onMouseLeave={e => (e.currentTarget.style.animationPlayState = 'running')}>
            {['AGRITECH', 'FARMSENSE', 'TERRAYIELD', 'CROPCHAIN', 'AGROPILOT', 'AGRITECH', 'FARMSENSE', 'TERRAYIELD', 'CROPCHAIN', 'AGROPILOT'].map((b, i) => (
              <div key={i} className="partner-card" style={{ background: '#0F1409', border: '1px solid rgba(200,245,62,0.1)', padding: '0.8rem 2rem', fontFamily: 'monospace', fontWeight: 700, color: 'white', fontSize: '0.85rem', transition: 'all 0.2s', flexShrink: 0 }}>{b}</div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ background: '#0A0E07', padding: '8rem 3rem' }}>
        <div className="reveal" style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(2.5rem,5vw,4rem)', fontStyle: 'italic', fontWeight: 900, margin: '0 0 1rem' }}>WE REPLACED GUESSWORK WITH CERTAINTY.</h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '1rem', maxWidth: '540px', margin: '0 auto' }}>We replaced slow visual scouting with instant multi-spectral analysis.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
          {[
            { icon: '🔬', title: 'AI Disease Detection', desc: 'Multi-spectral neural networks detect 94 disease signatures from a single image.', stat: '90%+ CONFIDENCE ON ALL SCANS' },
            { icon: '🌦️', title: 'Weather + Risk Alerts', desc: 'Live weather integration forecasts disease pressure up to 5 days in advance.', stat: 'REAL-TIME · 50KM RISK RADIUS' },
            { icon: '🗺️', title: 'Global Farm Dashboard', desc: 'Monitor every field, every scan, and every alert from a single command center.', stat: '142+ FARMS MONITORED GLOBALLY' },
          ].map((c, i) => (
            <div key={i} className="reveal feature-card" style={{ background: '#0F1409', border: '1px solid rgba(255,255,255,0.05)', padding: '2rem', transition: 'all 0.25s', borderLeft: '1px solid rgba(255,255,255,0.05)', cursor: 'default' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{c.icon}</div>
              <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.75rem' }}>{c.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', lineHeight: 1.7, marginBottom: '1rem' }}>{c.desc}</p>
              <p style={{ color: '#C8F53E', fontFamily: 'monospace', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em' }}>{c.stat}</p>
            </div>
          ))}
        </div>
      </section>

      {/* GLOBAL MAP SECTION */}
      <section style={{ background: '#060A04', padding: '8rem 3rem' }}>
        <div className="reveal" style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p style={{ fontFamily: 'monospace', fontSize: '0.62rem', color: '#C8F53E', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.8rem' }}>
            <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#C8F53E', marginRight: '6px', animation: 'blink 1s infinite', verticalAlign: 'middle' }} />
            LIVE NETWORK · 23 COUNTRIES ACTIVE
          </p>
          <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(2.5rem,5vw,4rem)', fontStyle: 'italic', fontWeight: 900 }}>CropGuard IS WATCHING EVERY FIELD.</h2>
        </div>
        <div style={{ position: 'relative', height: '500px', border: '1px solid rgba(200,245,62,0.1)', borderRadius: '4px', overflow: 'hidden', maxWidth: '1100px', margin: '0 auto 2.5rem' }}>
          <GlobalMap />
          <div style={{ position: 'absolute', top: '1rem', left: '1rem', zIndex: 1000, background: 'rgba(6,10,4,0.92)', border: '1px solid rgba(200,245,62,0.15)', padding: '0.8rem 1.2rem', backdropFilter: 'blur(10px)' }}>
            {[['14,000+', 'FIELDS'], ['23', 'COUNTRIES'], ['94%', 'ACCURACY']].map(([n, l]) => (
              <div key={l} style={{ marginBottom: '0.4rem' }}>
                <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.3rem', color: '#C8F53E', marginRight: '0.5rem' }}>{n}</span>
                <span style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>{l}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', maxWidth: '1100px', margin: '0 auto' }}>
          {[['23', 'Countries Active'], ['14,000+', 'Fields Monitored'], ['94%', 'Detection Accuracy'], ['3,200', 'Farmers Served']].map(([n, l], i) => (
            <div key={i} className="reveal" style={{ background: '#0F1409', border: '1px solid rgba(200,245,62,0.08)', padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '2.5rem', color: '#C8F53E', fontStyle: 'italic' }}>{n}</div>
              <div style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* AI WIDGET */}
      <section id="ai-demo" style={{ background: '#060A04', padding: '8rem 3rem' }}>
        <div className="reveal" style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(2.5rem,5vw,4rem)', fontStyle: 'italic', fontWeight: 900 }}>EXPERIENCE THE AI NOW.</h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '1rem', marginTop: '0.8rem' }}>No account required. Upload a field photo to see our neural network in action.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: '#0F1409', border: '1px solid rgba(200,245,62,0.1)', maxWidth: '900px', margin: '0 auto', borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{ padding: '2rem' }}>
            <input type="file" id="cropFileInput" accept="image/*" style={{ display: 'none' }} ref={fileInputRef} onChange={handleFileSelect} />
            <div
              style={{ border: '2px dashed rgba(200,245,62,0.2)', height: '220px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', cursor: 'pointer', borderRadius: '4px', transition: 'all 0.2s', position: 'relative', overflow: 'hidden' }}
              onClick={() => fileInputRef.current?.click()}
              onMouseEnter={e => { if (!imagePreview) { e.currentTarget.style.borderColor = '#C8F53E'; e.currentTarget.style.background = 'rgba(200,245,62,0.03)' } }}
              onMouseLeave={e => { if (!imagePreview) { e.currentTarget.style.borderColor = 'rgba(200,245,62,0.2)'; e.currentTarget.style.background = 'transparent' } }}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <>
                  <span style={{ fontSize: '2.5rem', opacity: 0.5 }}>⚡</span>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontWeight: 700, color: 'white', margin: 0 }}>DROP YOUR FIELD IMAGE.</p>
                    <p style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: '#C8F53E', margin: 0 }}>GET INSTANT DIAGNOSIS</p>
                    <p style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', margin: 0 }}>JPG · PNG · WEBP</p>
                  </div>
                </>
              )}
            </div>

            <p style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', margin: '1.2rem 0 0.6rem', textTransform: 'uppercase' }}>TEST WITH SAMPLE DATA:</p>
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              {['SAMPLE A (WHEAT)', 'SAMPLE B (SOY)'].map(s => (
                <button
                  key={s}
                  onClick={() => runSample(s.includes('WHEAT') ? 'WHEAT' : 'SOY')}
                  style={{ flex: 1, border: '1px solid rgba(200,245,62,0.3)', color: '#C8F53E', background: 'transparent', padding: '0.5rem', fontFamily: 'monospace', fontSize: '0.7rem', cursor: 'pointer', letterSpacing: '0.08em', transition: 'all 0.2s' }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div style={{ background: '#050805', padding: '2rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
              <span style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: '#C8F53E', letterSpacing: '0.12em' }}>● ANALYSIS CONSOLE</span>
              <span style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)' }}>NODE: ALPHA-V4</span>
            </div>

            <div style={{ flexGrow: 1, minHeight: '150px' }}>
              {consoleLogs.map((log, i) => (
                <p key={i} style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: log.includes('complete') ? '#C8F53E' : 'rgba(200,245,62,0.7)', marginBottom: '0.4rem' }}>
                  {log}{i === consoleLogs.length - 1 && <span style={{ animation: 'blink 1s infinite' }}>|</span>}
                </p>
              ))}
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>PROCESSING POWER</span>
                <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#C8F53E', fontWeight: 700 }}>{pp}ms</span>
              </div>
              <div style={{ background: 'rgba(200,245,62,0.1)', height: '3px', borderRadius: '2px' }}>
                <div style={{ background: '#C8F53E', height: '100%', width: `${Math.min((pp / 4200) * 100, 100)}%`, transition: 'width 0.1s linear' }} />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', background: 'rgba(200,245,62,0.06)', border: '1px solid rgba(200,245,62,0.12)', padding: '0.8rem', borderRadius: '4px', marginTop: 'auto' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#C8F53E', animation: 'pulse 2s infinite', display: 'inline-block' }} />
              <span style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.1em' }}>AI STATUS</span>
              <span style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: 'white', fontWeight: 700, marginLeft: 'auto' }}>OPERATIONAL</span>
            </div>
          </div>
        </div>

        {/* RESULTS PANEL */}
        {analysisResult && (
          <div className="reveal visible" style={{ background: '#0F1409', border: '1px solid rgba(200,245,62,0.15)', maxWidth: '900px', margin: '2rem auto 0', padding: '3rem', borderRadius: '8px', fontFamily: 'monospace' }}>
            {/* Metric Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.8rem' }}>DISEASE NAME</p>
                <p style={{ fontSize: '1rem', color: 'white', fontWeight: 900 }}>{analysisResult.disease.toUpperCase()}</p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.8rem' }}>HEALTH SCORE</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ flexGrow: 1, height: '4px', background: 'rgba(255,255,255,0.1)' }}>
                    <div style={{ width: `${analysisResult.healthScore}%`, height: '100%', background: '#C8F53E' }} />
                  </div>
                  <span style={{ color: '#C8F53E', fontWeight: 900 }}>{analysisResult.healthScore}%</span>
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.8rem' }}>RISK LEVEL</p>
                <p style={{
                  fontSize: '1rem',
                  fontWeight: 900,
                  color: analysisResult.riskLevel === 'High' || analysisResult.riskLevel === 'Critical' ? '#FF4F4F' : analysisResult.riskLevel === 'Moderate' || analysisResult.riskLevel === 'Medium' ? '#FFB347' : '#C8F53E'
                }}>
                  {analysisResult.riskLevel.toUpperCase()}
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
              {/* Treatment Info */}
              <div>
                <p style={{ fontSize: '0.7rem', color: '#C8F53E', letterSpacing: '0.2em', marginBottom: '1.5rem' }}>// RECOMMENDED TREATMENT</p>
                <div style={{ spaceY: '1.5rem' }}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', marginBottom: '0.4rem' }}>PESTICIDE</p>
                    <p style={{ fontSize: '0.85rem', color: 'white' }}>{analysisResult.pesticide}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', marginBottom: '0.4rem' }}>DOSAGE</p>
                    <p style={{ fontSize: '0.85rem', color: 'white' }}>{analysisResult.dosage}</p>
                  </div>
                </div>
              </div>

              {/* Action Plan */}
              <div>
                <p style={{ fontSize: '0.7rem', color: '#C8F53E', letterSpacing: '0.2em', marginBottom: '1.5rem' }}>// ACTION PLAN</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  {analysisResult.actionPlan.map((step: string, i: number) => (
                    <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <span style={{ background: '#C8F53E', color: '#060A04', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 900 }}>{i + 1}</span>
                      <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ marginTop: '3rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem' }}>
              <div style={{ marginBottom: '2rem' }}>
                <p style={{ fontSize: '0.7rem', color: '#C8F53E', letterSpacing: '0.2em', marginBottom: '1rem' }}>// IMMEDIATE ACTION</p>
                <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>{analysisResult.treatment}</p>
              </div>
              <div style={{ marginBottom: '3rem' }}>
                <p style={{ fontSize: '0.7rem', color: '#C8F53E', letterSpacing: '0.2em', marginBottom: '1rem' }}>// FUN FACT</p>
                <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>{analysisResult.funFact}</p>
              </div>
              <button
                onClick={resetScanner}
                style={{ width: '100%', background: 'transparent', border: '1px solid #C8F53E', color: '#C8F53E', padding: '1rem', fontWeight: 900, cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#C8F53E'; e.currentTarget.style.color = '#060A04' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#C8F53E' }}
              >
                SCAN ANOTHER FIELD →
              </button>
            </div>
          </div>
        )}
      </section>


      {/* DATA TO DECISION */}
      <section style={{ background: '#0A0E07', padding: '8rem 3rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div className="reveal">
            <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(2.5rem,5vw,4rem)', fontStyle: 'italic', fontWeight: 900, lineHeight: 1.1, marginBottom: '3rem' }}>
              <span style={{ color: 'white' }}>FROM DATA TO DECISION </span>
              <span style={{ color: '#C8F53E' }}>IN 3 MINUTES.</span>
            </h2>
            <div style={{ position: 'relative', paddingLeft: '2rem' }}>
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '2px', background: 'linear-gradient(to bottom,#C8F53E,rgba(200,245,62,0.1))' }} />
              {[['01', 'CAPTURE & UPLOAD', 'Ingest field imagery from drones, sensors, or mobile devices instantly.'], ['02', 'CLOUD PROCESSING', 'Multi-modal AI models analyze pathogen signatures at pixel-level scale.'], ['03', 'RECEIVE INSIGHTS', 'Get prioritized threat reports and treatment prescriptions in seconds.']].map(([n, t, d], i) => (
                <div key={i} style={{ marginBottom: i < 2 ? '2.5rem' : 0 }}>
                  <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.8rem', color: '#C8F53E', fontStyle: 'italic', lineHeight: 1 }}>{n}</div>
                  <div style={{ fontWeight: 700, fontSize: '1rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>{t}</div>
                  <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', lineHeight: 1.7 }}>{d}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="reveal" style={{ position: 'relative' }}>
            <img src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80" alt="crop field" style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '8px', border: '1px solid rgba(200,245,62,0.1)', display: 'block' }} />
            <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', background: 'rgba(6,10,4,0.92)', border: '1px solid rgba(255,79,79,0.25)', boxShadow: '0 0 20px rgba(255,79,79,0.15)', padding: '1rem', borderRadius: '4px', maxWidth: '220px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.4rem' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF4F4F', animation: 'pulse 1.5s infinite', display: 'inline-block' }} />
                <span style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: '#FF4F4F', letterSpacing: '0.12em' }}>THREAT DETECTED</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.2rem' }}>SOYBEAN RUST</div>
              <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.75rem', marginBottom: '0.4rem' }}>SECTOR 4-B</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem' }}>📍 GPS: 42.8N, 87.2W</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ position: 'relative', overflow: 'hidden', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '6rem 3rem' }}>
        <video autoPlay muted loop playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.15, zIndex: 0 }} src="/footer-bg.mp4" />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(6,10,4,0.75)', zIndex: 1 }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(3rem,7vw,6rem)', fontStyle: 'italic', fontWeight: 900, marginBottom: '1.2rem' }}>READY TO PROTECT YOUR HARVEST?</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem', maxWidth: '560px', margin: '0 auto 2rem', lineHeight: 1.75 }}>Protecting harvests across 23 countries. Trusted by commercial farms, agri-corporations, and government pilot programs.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <button style={{ background: '#C8F53E', color: '#060A04', fontWeight: 900, fontFamily: 'monospace', fontSize: '0.82rem', letterSpacing: '0.12em', padding: '0.9rem 2rem', border: 'none', cursor: 'pointer' }}>START MY PILOT</button>
            <button style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.25)', color: 'white', fontFamily: 'monospace', fontSize: '0.82rem', letterSpacing: '0.1em', padding: '0.9rem 1.8rem', cursor: 'pointer' }}>VIEW PRICING</button>
          </div>
          <p style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em' }}>🔒 NO CREDIT CARD REQUIRED · CANCEL ANYTIME · GDPR COMPLIANT</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
