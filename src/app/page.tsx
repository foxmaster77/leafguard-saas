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
@keyframes pulseRed { 0%,100%{box-shadow:0 0 0 0 rgba(255,79,79,0.5)} 70%{box-shadow:0 0 0 10px transparent} }
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

  // Feature 2 State: Language, Voice Input & TTS
  const [selectedLang, setSelectedLang] = useState<'bn-IN' | 'hi-IN' | 'en-IN'>('bn-IN');
  const [transcript, setTranscript] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [pincode, setPincode] = useState<string>('712101'); // Default West Bengal Pincode (Hooghly)
  const recognitionRef = useRef<any>(null);

  const addLog = (msg: string) => {
    setConsoleLogs(prev => [...prev.slice(-4), msg]);
  };

  // Web Speech API - Voice Recognition
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your description in the text box below.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = selectedLang;
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        addLog(`> Listening in ${selectedLang === 'bn-IN' ? 'Bangla' : selectedLang === 'hi-IN' ? 'Hindi' : 'English'}...`);
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        addLog(`> Voice input fallback active: type text below.`);
      };

      recognition.onend = () => {
        setIsListening(false);
        addLog(`> Voice capture complete.`);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e: any) {
      console.error('Speech recognition start error:', e);
      setIsListening(false);
    }
  };

  // Text-to-Speech Output
  const speakResponse = (text: string, lang: string = selectedLang) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel(); // Stop ongoing speech
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.95; // Slightly slower for clear regional pronunciation
    
    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopAudio = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const b64 = reader.result as string;
        setImagePreview(b64);
        setAnalysisResult(null);
        setConsoleLogs(['> Image loaded. Ready for scan...']);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async (base64?: string | null, mediaType?: string) => {
    const activeImage = base64 !== undefined ? base64 : imagePreview;
    
    if (!activeImage && !transcript.trim()) {
      alert('Please upload a leaf photo or record/type a voice description!');
      return;
    }

    setAnalyzing(true);
    setAnalysisResult(null);
    stopAudio();

    // Animate console
    const logs = [
      activeImage ? '> Processing visual image...' : '> Processing voice transcript...',
      `> Language: ${selectedLang === 'bn-IN' ? 'Bangla (বাংলা)' : selectedLang === 'hi-IN' ? 'Hindi (हिंदी)' : 'English'}`,
      '> Running multi-modal neural pathogen model...',
      '> Generating threat report & voice summary...'
    ];

    logs.forEach((log, i) => {
      setTimeout(() => addLog(log), (i + 1) * 500);
    });

    // Animate Processing Power
    const targetMs = Math.floor(Math.random() * (3500 - 1800 + 1) + 1800);
    const startTime = performance.now();

    const animatePP = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / targetMs, 1);
      setPp(Math.floor(progress * targetMs));
      if (progress < 1) requestAnimationFrame(animatePP);
    };
    requestAnimationFrame(animatePP);

    try {
      const formData = new FormData();
      if (activeImage) {
        const res_fetch = await fetch(activeImage);
        const blob = await res_fetch.blob();
        const file = new File([blob], 'crop_capture.jpg', { type: mediaType || blob.type || 'image/jpeg' });
        formData.append('image', file);
      }
      formData.append('transcript', transcript);
      formData.append('language', selectedLang);
      formData.append('pincode', pincode);

      const res = await fetch('/api/analyze', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();

      setTimeout(() => {
        if (!data.error) {
          setAnalysisResult(data);
          addLog('> Multimodal analysis complete.');
          // Auto-play TTS spoken summary in selected language
          if (data.voiceSummary) {
            speakResponse(data.voiceSummary, selectedLang);
          }
        } else {
          addLog('> Analysis failed: ' + data.error);
        }
        setAnalyzing(false);
      }, Math.max(logs.length * 500 + 300, targetMs));
    } catch (err) {
      addLog('> Error connecting to AgroGuard AI node.');
      setAnalyzing(false);
    }
  };

  const runSample = async (type: 'WHEAT' | 'SOY') => {
    const url = type === 'WHEAT'
      ? 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&q=80'
      : 'https://images.unsplash.com/photo-1595113316349-9fa4ee24f884?w=800&q=80';

    setConsoleLogs([`> Fetching sample ${type}...`]);
    if (type === 'WHEAT') {
      setTranscript(selectedLang === 'bn-IN' ? 'গম গাছের পাতায় হলুদ দাগ এবং শুকিয়ে যাওয়া ভাব দেখা যাচ্ছে।' : selectedLang === 'hi-IN' ? 'गेहूं के पत्तों पर पीले धब्बे दिख रहे हैं।' : 'Yellow spots appearing on wheat leaves.');
    } else {
      setTranscript(selectedLang === 'bn-IN' ? 'সোয়াবিন পাতার নিচে বাদামী গুঁড়ো জমে আছে।' : selectedLang === 'hi-IN' ? 'सोयाबीन के पत्तों के नीचे भूरा पाउडर जमा हो रहा है।' : 'Brown rust powder underneath soybean leaves.');
    }

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
    stopAudio();
    setImagePreview(null);
    setAnalysisResult(null);
    setTranscript('');
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
            CROP_OS V4.0 PLATFORM
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
          <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(2.5rem,5vw,4rem)', fontStyle: 'italic', fontWeight: 900, margin: 0 }}>
            EXPERIENCE REGIONAL VOICE & AI DIAGNOSIS.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem', marginTop: '0.8rem' }}>
            Speak in your regional language or upload a leaf photo to diagnose crop disease in real-time.
          </p>

          {/* LANGUAGE SELECTOR PILLS */}
          <div style={{ display: 'inline-flex', gap: '0.6rem', background: '#0F1409', border: '1px solid rgba(200,245,62,0.2)', padding: '0.4rem', borderRadius: '99px', marginTop: '1.5rem' }}>
            {[
              { code: 'bn-IN', label: '🇧🇩/🇮🇳 বাংলা (Bangla)' },
              { code: 'hi-IN', label: '🇮🇳 हिंदी (Hindi)' },
              { code: 'en-IN', label: '🌐 English' }
            ].map(l => (
              <button
                key={l.code}
                onClick={() => setSelectedLang(l.code as any)}
                style={{
                  background: selectedLang === l.code ? '#C8F53E' : 'transparent',
                  color: selectedLang === l.code ? '#060A04' : 'rgba(255,255,255,0.7)',
                  border: 'none',
                  borderRadius: '99px',
                  padding: '0.5rem 1.2rem',
                  fontFamily: 'monospace',
                  fontWeight: 800,
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: '#0F1409', border: '1px solid rgba(200,245,62,0.15)', maxWidth: '950px', margin: '0 auto', borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{ padding: '2rem' }}>
            <input type="file" id="cropFileInput" accept="image/*" style={{ display: 'none' }} ref={fileInputRef} onChange={handleFileSelect} />
            
            {/* Image Dropzone */}
            <div
              style={{ border: '2px dashed rgba(200,245,62,0.25)', height: '180px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer', borderRadius: '4px', transition: 'all 0.2s', position: 'relative', overflow: 'hidden' }}
              onClick={() => fileInputRef.current?.click()}
              onMouseEnter={e => { if (!imagePreview) { e.currentTarget.style.borderColor = '#C8F53E'; e.currentTarget.style.background = 'rgba(200,245,62,0.03)' } }}
              onMouseLeave={e => { if (!imagePreview) { e.currentTarget.style.borderColor = 'rgba(200,245,62,0.25)'; e.currentTarget.style.background = 'transparent' } }}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <>
                  <span style={{ fontSize: '2rem', opacity: 0.7 }}>⚡</span>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontWeight: 700, color: 'white', margin: 0, fontSize: '0.9rem' }}>UPLOAD CROP PHOTO (OPTIONAL)</p>
                    <p style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: '#C8F53E', margin: '2px 0 0' }}>CLICK TO BROWSE IMAGE</p>
                  </div>
                </>
              )}
            </div>

            {/* Voice Input Section */}
            <div style={{ marginTop: '1.2rem', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)', padding: '1rem', borderRadius: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                <span style={{ fontFamily: 'monospace', fontSize: '0.68rem', color: '#C8F53E', fontWeight: 700, letterSpacing: '0.1em' }}>
                  🎙️ VOICE INPUT ({selectedLang === 'bn-IN' ? 'BANGLA' : selectedLang === 'hi-IN' ? 'HINDI' : 'ENGLISH'})
                </span>
                <button
                  onClick={toggleListening}
                  style={{
                    background: isListening ? '#FF4F4F' : 'rgba(200,245,62,0.15)',
                    color: isListening ? 'white' : '#C8F53E',
                    border: `1px solid ${isListening ? '#FF4F4F' : 'rgba(200,245,62,0.4)'}`,
                    borderRadius: '4px',
                    padding: '0.35rem 0.8rem',
                    fontFamily: 'monospace',
                    fontSize: '0.7rem',
                    fontWeight: 900,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    animation: isListening ? 'pulseRed 1s infinite' : 'none'
                  }}
                >
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: isListening ? 'white' : '#C8F53E', display: 'inline-block' }} />
                  {isListening ? 'STOP LISTENING' : 'SPEAK NOW'}
                </button>
              </div>

              <textarea
                value={transcript}
                onChange={e => setTranscript(e.target.value)}
                placeholder={
                  selectedLang === 'bn-IN' 
                    ? 'আপনার ফসলের সমস্যা বাংলায় বলুন বা লিখুন (যেমন: ধান পাতায় বাদামী দাগ)...' 
                    : selectedLang === 'hi-IN'
                    ? 'अपनी फसल की समस्या हिंदी में बोलें या लिखें (जैसे: गेहूं में पीले धब्बे)...'
                    : 'Describe your crop symptoms here in English...'
                }
                rows={3}
                style={{
                  width: '100%',
                  background: '#060A04',
                  border: '1px solid rgba(200,245,62,0.2)',
                  color: 'white',
                  padding: '0.6rem',
                  fontSize: '0.85rem',
                  borderRadius: '4px',
                  fontFamily: 'inherit',
                  resize: 'none',
                  outline: 'none'
                }}
              />
            </div>

            {/* Submit Diagnosis Button */}
            <button
              onClick={() => analyzeImage()}
              disabled={analyzing}
              style={{
                width: '100%',
                marginTop: '1.2rem',
                background: analyzing ? 'rgba(200,245,62,0.3)' : '#C8F53E',
                color: '#060A04',
                fontWeight: 900,
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                letterSpacing: '0.12em',
                padding: '0.9rem',
                border: 'none',
                cursor: analyzing ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                borderRadius: '4px'
              }}
            >
              {analyzing ? 'DIAGNOSING CROP PATHOGEN...' : 'RUN MULTIMODAL DIAGNOSIS →'}
            </button>

            <p style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', margin: '1.2rem 0 0.6rem', textTransform: 'uppercase' }}>OR TEST WITH SAMPLE DATA:</p>
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
              <span style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)' }}>MODE: MULTIMODAL</span>
            </div>

            <div style={{ flexGrow: 1, minHeight: '180px' }}>
              {consoleLogs.map((log, i) => (
                <p key={i} style={{ fontFamily: 'monospace', fontSize: '0.82rem', color: log.includes('complete') ? '#C8F53E' : 'rgba(200,245,62,0.7)', marginBottom: '0.4rem' }}>
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
          <div className="reveal visible" style={{ background: '#0F1409', border: '1px solid rgba(200,245,62,0.2)', maxWidth: '950px', margin: '2rem auto 0', padding: '2.5rem', borderRadius: '8px', fontFamily: 'monospace' }}>
            {/* LOCALIZED VOICE RESPONSE BANNER */}
            {analysisResult.voiceSummary && (
              <div style={{ background: 'rgba(200,245,62,0.08)', border: '1px solid rgba(200,245,62,0.3)', padding: '1.2rem', borderRadius: '6px', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                  <span style={{ color: '#C8F53E', fontSize: '0.75rem', fontWeight: 900, letterSpacing: '0.12em' }}>
                    🔊 REGIONAL VOICE ADVISORY ({selectedLang === 'bn-IN' ? 'বাংলা BANGLA' : selectedLang === 'hi-IN' ? 'हिंदी HINDI' : 'ENGLISH'})
                  </span>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => speakResponse(analysisResult.voiceSummary, selectedLang)}
                      style={{ background: '#C8F53E', color: '#060A04', border: 'none', borderRadius: '4px', padding: '0.3rem 0.8rem', fontSize: '0.7rem', fontWeight: 900, cursor: 'pointer' }}
                    >
                      {isPlayingAudio ? '▶️ REPLAY' : '🔊 PLAY AUDIO'}
                    </button>
                    {isPlayingAudio && (
                      <button
                        onClick={stopAudio}
                        style={{ background: '#FF4F4F', color: 'white', border: 'none', borderRadius: '4px', padding: '0.3rem 0.8rem', fontSize: '0.7rem', fontWeight: 900, cursor: 'pointer' }}
                      >
                        ⏹ STOP
                      </button>
                    )}
                  </div>
                </div>
                <p style={{ color: 'white', fontSize: '1rem', fontFamily: 'sans-serif', lineHeight: 1.6, margin: 0 }}>
                  &ldquo;{analysisResult.voiceSummary}&rdquo;
                </p>
              </div>
            )}

            {/* Metric Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.2rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.6rem' }}>DISEASE DETECTED</p>
                <p style={{ fontSize: '1.1rem', color: 'white', fontWeight: 900 }}>{analysisResult.disease?.toUpperCase() || 'HEALTHY'}</p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.2rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.6rem' }}>HEALTH SCORE</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ flexGrow: 1, height: '4px', background: 'rgba(255,255,255,0.1)' }}>
                    <div style={{ width: `${analysisResult.healthScore}%`, height: '100%', background: '#C8F53E' }} />
                  </div>
                  <span style={{ color: '#C8F53E', fontWeight: 900 }}>{analysisResult.healthScore}%</span>
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.2rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.6rem' }}>RISK LEVEL</p>
                <p style={{
                  fontSize: '1.1rem',
                  fontWeight: 900,
                  color: analysisResult.riskLevel === 'High' || analysisResult.riskLevel === 'Critical' ? '#FF4F4F' : analysisResult.riskLevel === 'Moderate' || analysisResult.riskLevel === 'Medium' ? '#FFB347' : '#C8F53E'
                }}>
                  {(analysisResult.riskLevel || 'LOW').toUpperCase()}
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
              {/* Treatment Info */}
              <div>
                <p style={{ fontSize: '0.7rem', color: '#C8F53E', letterSpacing: '0.2em', marginBottom: '1.2rem' }}>// RECOMMENDED TREATMENT</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  <div>
                    <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', marginBottom: '0.3rem' }}>PESTICIDE / REMEDY</p>
                    <p style={{ fontSize: '0.85rem', color: 'white' }}>{analysisResult.pesticide}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', marginBottom: '0.3rem' }}>DOSAGE</p>
                    <p style={{ fontSize: '0.85rem', color: 'white' }}>{analysisResult.dosage}</p>
                  </div>
                </div>
              </div>

              {/* Action Plan */}
              <div>
                <p style={{ fontSize: '0.7rem', color: '#C8F53E', letterSpacing: '0.2em', marginBottom: '1.2rem' }}>// ACTION PLAN</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {analysisResult.actionPlan?.map((step: string, i: number) => (
                    <div key={i} style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                      <span style={{ background: '#C8F53E', color: '#060A04', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 900, flexShrink: 0 }}>{i + 1}</span>
                      <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', margin: 0 }}>{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 1. WEATHER SPREAD RISK FORECAST */}
            {analysisResult.diseaseRisk && analysisResult.weather && (
              <div style={{ marginTop: '2.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.8rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.8rem' }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: '#C8F53E', letterSpacing: '0.2em', fontWeight: 900 }}>
                      🌦️ 5-DAY WEATHER & PATHOGEN SPREAD RISK FORECAST
                    </span>
                    <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', margin: '0.2rem 0 0' }}>
                      Location: {analysisResult.weather.locationName || `Pincode ${pincode}`}
                    </p>
                  </div>

                  <span style={{
                    background: analysisResult.diseaseRisk.riskLevel === 'High' ? '#FF4F4F' : analysisResult.diseaseRisk.riskLevel === 'Moderate' ? '#FFB347' : '#C8F53E',
                    color: '#060A04',
                    fontWeight: 900,
                    fontSize: '0.75rem',
                    padding: '0.35rem 0.9rem',
                    borderRadius: '99px',
                    letterSpacing: '0.08em',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    animation: analysisResult.diseaseRisk.riskLevel === 'High' ? 'pulseRed 1.5s infinite' : 'none'
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#060A04', display: 'inline-block' }} />
                    {analysisResult.diseaseRisk.riskLevel?.toUpperCase()} SPREAD RISK ({analysisResult.diseaseRisk.riskScore}/100)
                  </span>
                </div>

                {/* 5-Day Weather Forecast Strip */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.8rem', marginBottom: '1.2rem' }}>
                  {analysisResult.weather.forecast?.map((day: any, i: number) => (
                    <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '6px', padding: '0.8rem', textAlign: 'center' }}>
                      <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', margin: '0 0 0.4rem', fontWeight: 700 }}>{day.day}</p>
                      <div style={{ fontSize: '1.4rem', margin: '0.2rem 0' }}>{day.icon}</div>
                      <p style={{ fontSize: '0.85rem', fontWeight: 900, color: 'white', margin: '0.2rem 0' }}>{day.temp}°C</p>
                      <p style={{ fontSize: '0.65rem', color: '#C8F53E', margin: '0.2rem 0 0' }}>💧 {day.humidity}%</p>
                      <p style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', margin: '0.1rem 0 0' }}>🌧️ {day.rain_probability}%</p>
                    </div>
                  ))}
                </div>

                {/* Localized Risk Explanation & Spray Advice */}
                <div style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${analysisResult.diseaseRisk.riskLevel === 'High' ? 'rgba(255,79,79,0.3)' : 'rgba(200,245,62,0.15)'}`, padding: '1rem', borderRadius: '6px' }}>
                  <p style={{ color: 'white', fontSize: '0.85rem', lineHeight: 1.5, margin: '0 0 0.5rem', fontFamily: 'sans-serif' }}>
                    {selectedLang === 'bn-IN'
                      ? analysisResult.diseaseRisk.explanation_bn
                      : selectedLang === 'hi-IN'
                      ? analysisResult.diseaseRisk.explanation_hi
                      : analysisResult.diseaseRisk.explanation}
                  </p>
                  <p style={{ color: '#C8F53E', fontSize: '0.8rem', fontWeight: 700, margin: 0 }}>
                    ⚡ {selectedLang === 'bn-IN'
                      ? analysisResult.diseaseRisk.actionableAdvice_bn
                      : selectedLang === 'hi-IN'
                      ? analysisResult.diseaseRisk.actionableAdvice_hi
                      : analysisResult.diseaseRisk.actionableAdvice}
                  </p>
                </div>
              </div>
            )}

            {/* 2. NEAREST AGRI-SUPPLIERS & DEALERS */}
            {analysisResult.dealers && analysisResult.dealers.length > 0 && (
              <div style={{ marginTop: '2.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.8rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: '#C8F53E', letterSpacing: '0.2em', fontWeight: 900 }}>
                      📍 NEAREST AGRI-SUPPLIERS & INPUT DEALERS
                    </span>
                    <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', margin: '0.2rem 0 0' }}>
                      Certified suppliers stocking recommended treatments in {analysisResult.dealers[0]?.district}
                    </p>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#C8F53E', fontFamily: 'monospace' }}>● STOCKED & VERIFIED</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                  {analysisResult.dealers.map((dealer: any) => (
                    <div
                      key={dealer.id}
                      style={{
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(200,245,62,0.15)',
                        borderRadius: '6px',
                        padding: '1.2rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                          <h4 style={{ color: 'white', fontSize: '0.9rem', fontWeight: 800, margin: 0, fontFamily: 'sans-serif' }}>
                            {dealer.name}
                          </h4>
                          <span style={{ background: 'rgba(200,245,62,0.15)', color: '#C8F53E', fontSize: '0.65rem', fontWeight: 900, padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                            ★ {dealer.rating}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', margin: '0 0 0.6rem', fontFamily: 'sans-serif', lineHeight: 1.4 }}>
                          📍 {dealer.address}
                        </p>
                        <p style={{ fontSize: '0.7rem', color: '#C8F53E', margin: '0 0 0.8rem', fontFamily: 'monospace' }}>
                          🏷️ {dealer.specialization}
                        </p>
                      </div>

                      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>
                          🕒 {dealer.openHours}
                        </span>
                        <a
                          href={`tel:${dealer.phone.replace(/\s+/g, '')}`}
                          style={{
                            background: '#C8F53E',
                            color: '#060A04',
                            fontWeight: 900,
                            fontSize: '0.7rem',
                            padding: '0.35rem 0.7rem',
                            borderRadius: '4px',
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem'
                          }}
                        >
                          📞 {dealer.phone}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. GOVERNMENT SCHEMES & FINANCIAL SUPPORT */}
            {analysisResult.schemes && analysisResult.schemes.length > 0 && (
              <div style={{ marginTop: '2.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.8rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: '#C8F53E', letterSpacing: '0.2em', fontWeight: 900 }}>
                      🏛️ GOVERNMENT SCHEMES & FINANCIAL RELIEF
                    </span>
                    <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', margin: '0.2rem 0 0' }}>
                      Applicable subsidies & crop insurance relief for your diagnosis
                    </p>
                  </div>
                  <span style={{ background: 'rgba(200,245,62,0.15)', color: '#C8F53E', fontSize: '0.65rem', fontWeight: 900, padding: '0.2rem 0.6rem', borderRadius: '99px' }}>
                    DIRECT BENEFIT TRANSFER
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                  {analysisResult.schemes.map((scheme: any) => (
                    <div
                      key={scheme.id}
                      style={{
                        background: 'rgba(200,245,62,0.03)',
                        border: '1px solid rgba(200,245,62,0.2)',
                        borderRadius: '6px',
                        padding: '1.3rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                          <h4 style={{ color: 'white', fontSize: '0.95rem', fontWeight: 900, margin: 0, fontFamily: 'sans-serif' }}>
                            {selectedLang === 'bn-IN' ? scheme.name_bn : selectedLang === 'hi-IN' ? scheme.name_hi : scheme.name}
                          </h4>
                          <span style={{ background: '#C8F53E', color: '#060A04', fontSize: '0.65rem', fontWeight: 900, padding: '0.15rem 0.5rem', borderRadius: '99px' }}>
                            {scheme.badge}
                          </span>
                        </div>

                        <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.5, margin: '0 0 0.8rem', fontFamily: 'sans-serif' }}>
                          {selectedLang === 'bn-IN' ? scheme.description_bn : selectedLang === 'hi-IN' ? scheme.description_hi : scheme.description}
                        </p>

                        <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.45)', margin: '0 0 1rem', fontFamily: 'sans-serif' }}>
                          <strong>Eligibility:</strong> {selectedLang === 'bn-IN' ? scheme.eligibility_note_bn : selectedLang === 'hi-IN' ? scheme.eligibility_note_hi : scheme.eligibility_note}
                        </p>
                      </div>

                      <a
                        href={scheme.official_link}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          width: '100%',
                          textAlign: 'center',
                          background: 'transparent',
                          border: '1px solid #C8F53E',
                          color: '#C8F53E',
                          padding: '0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          textDecoration: 'none',
                          display: 'block',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#C8F53E'; e.currentTarget.style.color = '#060A04'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#C8F53E'; }}
                      >
                        OFFICIAL PORTAL & APPLICATION →
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ marginTop: '2.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.8rem' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ fontSize: '0.7rem', color: '#C8F53E', letterSpacing: '0.2em', marginBottom: '0.6rem' }}>// IMMEDIATE ACTION</p>
                <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, margin: 0 }}>{analysisResult.treatment}</p>
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ fontSize: '0.7rem', color: '#C8F53E', letterSpacing: '0.2em', marginBottom: '0.6rem' }}>// FUN FACT</p>
                <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, margin: 0 }}>{analysisResult.funFact}</p>
              </div>
              <button
                onClick={resetScanner}
                style={{ width: '100%', background: 'transparent', border: '1px solid #C8F53E', color: '#C8F53E', padding: '0.9rem', fontWeight: 900, cursor: 'pointer', transition: 'all 0.2s', borderRadius: '4px' }}
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
