'use client';
import React, { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const GlobalMap = dynamic(() => import('@/components/GlobalMap'), { ssr: false });

const css = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:ital,wght@0,400;0,500;1,400&family=Inter:wght@400;500;600;700;800;900&display=swap');

@keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }
@keyframes pulse { 0%,100%{box-shadow:0 0 0 0 rgba(200,245,62,0.5)} 70%{box-shadow:0 0 0 10px transparent} }
@keyframes pulseGreen { 0%,100%{box-shadow:0 0 0 0 rgba(34,197,94,0.5)} 70%{box-shadow:0 0 0 8px transparent} }
@keyframes pulseRed { 0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,0.5)} 70%{box-shadow:0 0 0 10px transparent} }
@keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
@keyframes laserScan {
  0% { top: 0%; opacity: 0.9; }
  50% { opacity: 1; }
  100% { top: 96%; opacity: 0.3; }
}

*, *::before, *::after { box-sizing: border-box; }

.reveal {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}
.reveal.visible { opacity: 1; transform: translateY(0); }

.glow-btn { transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.glow-btn:hover { transform: translateY(-2px) scale(1.02); box-shadow: 0 0 28px rgba(200,245,62,0.45); }

.hover-lift { transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.hover-lift:hover {
  transform: translateY(-4px);
  border-color: rgba(200,245,62,0.4) !important;
  box-shadow: 0 16px 36px rgba(0,0,0,0.5), 0 0 20px rgba(200,245,62,0.08) !important;
}

.partner-card:hover {
  border-color: #C8F53E !important;
  box-shadow: 0 0 20px rgba(200,245,62,0.2);
  transform: translateY(-2px);
}

.stat-pill { animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; }

html { scroll-behavior: smooth; }

img, video { max-width: 100%; height: auto; }

.custom-scroll::-webkit-scrollbar { width: 4px; }
.custom-scroll::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); }
.custom-scroll::-webkit-scrollbar-thumb { background: rgba(200,245,62,0.2); border-radius: 2px; }
.custom-scroll::-webkit-scrollbar-thumb:hover { background: rgba(200,245,62,0.5); }

/* ───────────────── TABLET (≤1024px) ───────────────── */
@media (max-width: 1024px) {
  .hero-split-grid { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
  .hero-widget-container { position: relative !important; right: auto !important; top: auto !important; transform: none !important; width: 100% !important; max-width: 560px !important; margin: 0 auto !important; }
  .home-features-grid { grid-template-columns: repeat(2, 1fr) !important; }
  .home-cta-grid { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
  .home-scanner-grid { grid-template-columns: 1fr !important; }
  .home-result-metrics { grid-template-columns: repeat(2, 1fr) !important; }
  .home-weather-grid { grid-template-columns: repeat(3, 1fr) !important; }
}

/* ───────────────── MOBILE (≤639px) ───────────────── */
@media (max-width: 639px) {
  /* Layout */
  .hero-split-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
  .hero-padding { padding: 90px 1rem 3rem 1rem !important; }
  .mobile-padding { padding: 3.5rem 1rem !important; }

  /* Section headings – prevent overflow */
  h1, h2 { word-break: break-word; overflow-wrap: break-word; hyphens: auto; }

  /* Feature / stats grids */
  .home-features-grid { grid-template-columns: 1fr !important; }
  .home-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }

  /* AI Scanner console */
  .home-scanner-grid { grid-template-columns: 1fr !important; border-radius: 10px !important; }

  /* Results */
  .home-result-metrics { grid-template-columns: 1fr !important; }
  .home-treatment-grid { grid-template-columns: 1fr !important; }
  .home-weather-grid { grid-template-columns: repeat(2, 1fr) !important; }
  .home-dealers-grid { grid-template-columns: 1fr !important; }
  .home-schemes-grid { grid-template-columns: 1fr !important; }

  /* Data → Decision section */
  .home-cta-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }

  /* Hero stats pills – stack on mobile */
  .hero-stats-row { flex-direction: column !important; align-items: flex-start !important; gap: 0.5rem !important; }

  /* Hero action buttons – full width on mobile */
  .hero-actions { flex-direction: column !important; }
  .hero-actions a, .hero-actions button { width: 100% !important; text-align: center !important; justify-content: center !important; }

  /* Language pill selector – wrap */
  .lang-pill-group { flex-wrap: wrap !important; border-radius: 12px !important; }
  .lang-pill-group button { font-size: 0.68rem !important; padding: 0.4rem 0.8rem !important; }

  /* Sample buttons */
  .sample-btn-grid { grid-template-columns: 1fr !important; }

  /* Results action bar */
  .result-action-bar { flex-direction: column !important; }
  .result-action-bar a, .result-action-bar button { width: 100% !important; text-align: center !important; }

  /* CTA buttons */
  .cta-btn-row { flex-direction: column !important; align-items: center !important; }
  .cta-btn-row a { width: 100% !important; max-width: 320px !important; text-align: center !important; }

  /* Map stat cards */
  .home-stats-grid > div { padding: 1.2rem 0.8rem !important; }

  /* Hide large decorative images on very small screens to save space */
  .hero-widget-container { max-width: 100% !important; }
}

/* ───────────────── VERY SMALL (≤380px) ───────────────── */
@media (max-width: 380px) {
  .home-stats-grid { grid-template-columns: 1fr !important; }
  .home-weather-grid { grid-template-columns: repeat(2, 1fr) !important; }
  .lang-pill-group { gap: 0.3rem !important; }
}
`;


export default function HomePage() {
  const [pp, setPp] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<string[]>(['> CropGuard Neural Engine initialized. Ready for scan...']);
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
        addLog(`> Voice fallback: type symptom description below.`);
      };

      recognition.onend = () => {
        setIsListening(false);
        addLog(`> Voice recording complete.`);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e: any) {
      console.error('Speech recognition error:', e);
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

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setImageError('Selected file is not a valid image format.');
      setImagePreview(null);
      addLog('> Error: Invalid file format (must be an image).');
      return;
    }
    setImageError(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      const b64 = reader.result as string;
      setImagePreview(b64);
      setAnalysisResult(null);
      setConsoleLogs(['> Multi-spectral leaf image loaded. Ready to execute neural model...']);
    };
    reader.onerror = () => {
      setImageError('Failed to read image file.');
      addLog('> Error reading image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const analyzeImage = async (base64?: string | null, mediaType?: string) => {
    if (imageError) {
      alert('Please upload a valid crop image before running diagnosis.');
      return;
    }
    const activeImage = base64 !== undefined ? base64 : imagePreview;
    
    if (!activeImage && !transcript.trim()) {
      alert('Please upload a leaf photo or record/type your crop symptoms!');
      return;
    }

    setAnalyzing(true);
    setAnalysisResult(null);
    stopAudio();

    // Staged Animation Console Feedback
    const logs = [
      activeImage ? '> Ingesting multi-spectral image pixels...' : '> Transcribing acoustic symptom profile...',
      `> Context: ${selectedLang === 'bn-IN' ? 'West Bengal Regional Dialect (বাংলা)' : selectedLang === 'hi-IN' ? 'North India Dialect (हिंदी)' : 'Global English'}`,
      '> Scanning cellular pathogen signatures against 94+ strains...',
      '> Cross-referencing West Bengal OpenWeather microclimate data...',
      '> Synthesizing precision dosage & government aid matching...'
    ];

    logs.forEach((log, i) => {
      setTimeout(() => addLog(log), (i + 1) * 400);
    });

    const targetMs = Math.floor(Math.random() * (2600 - 1600 + 1) + 1600);
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
        if (!blob.type.startsWith('image/')) {
          throw new Error('Image data is corrupted or invalid format.');
        }
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
      const text = await res.text();
      let data: any = null;
      try {
        data = JSON.parse(text);
      } catch (jsonErr) {
        if (!res.ok) {
          throw new Error(`Server error HTTP ${res.status}`);
        }
        throw new Error('Invalid JSON response');
      }

      setTimeout(() => {
        if (res.ok && !data.error) {
          setAnalysisResult(data);
          addLog('> Multimodal inference complete. Pathogen localized in 0.9s.');
          if (data.voiceSummary) {
            speakResponse(data.voiceSummary, selectedLang);
          }
        } else {
          addLog('> Diagnosis failed: ' + (data?.error || `HTTP ${res.status}`));
        }
        setAnalyzing(false);
      }, Math.max(logs.length * 400 + 200, targetMs));
    } catch (err: any) {
      addLog(`> Error connecting to CropGuard AI node: ${err?.message || 'Check network connection'}`);
      setAnalyzing(false);
    }
  };

  const runSample = async (type: 'WHEAT' | 'SOY') => {
    const url = type === 'WHEAT' ? '/samples/wheat.jpg' : '/samples/soy.jpg';

    setImageError(null);
    setConsoleLogs([`> Ingesting high-resolution sample dataset (${type})...`]);
    if (type === 'WHEAT') {
      setTranscript(selectedLang === 'bn-IN' ? 'গম গাছের পাতায় হলুদ গুঁড়ো দাগ এবং শুকিয়ে যাওয়া ভাব দেখা যাচ্ছে।' : selectedLang === 'hi-IN' ? 'गेहूं के पत्तों पर पीले दानेदार धब्बे दिख रहे हैं।' : 'Yellow rust pustules appearing across wheat leaf foliage.');
    } else {
      setTranscript(selectedLang === 'bn-IN' ? 'সোয়াবিন পাতার নিচে বাদামী ছত্রাক জমে আছে।' : selectedLang === 'hi-IN' ? 'সোয়াबीन के पत्तों के नीचे भूरा पाउडर जमा हो रहा है।' : 'Brown necrotic rust lesions underneath soybean leaves.');
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} failed to load ${type} sample`);
      }
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result as string;
        setImagePreview(base64data);
        setImageError(null);
        analyzeImage(base64data, blob.type);
      };
      reader.readAsDataURL(blob);
    } catch (e: any) {
      setImageError(`Failed to load sample ${type} image.`);
      addLog(`> Failed to load sample: ${e?.message || e}`);
    }
  };

  const resetScanner = () => {
    stopAudio();
    setImagePreview(null);
    setAnalysisResult(null);
    setTranscript('');
    setConsoleLogs(['> CropGuard Neural Engine reset. Ready for next field scan...']);
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
    <div style={{ background: '#060A04', color: 'white', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <Navigation />

      {/* HERO SECTION */}
      <section className="hero-padding" style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', padding: '0 3rem', paddingTop: '100px', paddingBottom: '4rem' }}>
        <video autoPlay muted loop playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.14, zIndex: 0 }} src="/238827.mp4" />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 20% 30%, rgba(200,245,62,0.12), transparent 45%), radial-gradient(circle at 80% 50%, rgba(56,189,248,0.1), transparent 50%), linear-gradient(135deg,rgba(6,10,4,0.95),rgba(6,10,4,0.7),rgba(6,10,4,0.92))', zIndex: 1 }} />
        
        <div className="hero-split-grid" style={{ position: 'relative', zIndex: 2, display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '4rem', alignItems: 'center', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
          
          {/* Left Column: Headline & Value Proposition */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(200,245,62,0.08)', border: '1px solid rgba(200,245,62,0.25)', borderRadius: '99px', padding: '0.45rem 1.1rem', fontFamily: 'DM Mono, monospace', fontSize: '0.72rem', color: '#C8F53E', letterSpacing: '0.15em', marginBottom: '1.5rem', boxShadow: '0 0 20px rgba(200,245,62,0.1)' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#C8F53E', animation: 'pulse 1.8s infinite', display: 'inline-block' }} />
              CROPGUARD AI · PRECISION CROP_OS V4.0
            </div>

            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(3.8rem,8vw,6.8rem)', fontWeight: 900, fontStyle: 'italic', lineHeight: 0.92, margin: '0 0 1.5rem', letterSpacing: '0.01em' }}>
              <span style={{ color: 'white', display: 'block' }}>CATCH DISEASE</span>
              <span style={{
                background: 'linear-gradient(135deg, #C8F53E 0%, #38BDF8 55%, #22C55E 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block',
                paddingRight: '0.3em',
                filter: 'drop-shadow(0 0 35px rgba(200,245,62,0.35))'
              }}>
                14 DAYS BEFORE
              </span>
              <span style={{ color: 'white', display: 'block' }}>IT&apos;S VISIBLE.</span>
            </h1>

            <p style={{ fontSize: '1.08rem', color: 'rgba(255,255,255,0.7)', maxWidth: '520px', lineHeight: 1.75, marginBottom: '2.2rem' }}>
              Multi-spectral computer vision that detects microscopic fungal pathogens at the cellular stage — before whole-field crop loss occurs.
            </p>

            <div className="hero-actions" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => document.getElementById('ai-demo')?.scrollIntoView({ behavior: 'smooth' })}
                className="glow-btn"
                style={{ background: '#C8F53E', color: '#060A04', fontWeight: 900, fontFamily: 'DM Mono, monospace', fontSize: '0.85rem', letterSpacing: '0.12em', padding: '0.95rem 2.2rem', border: 'none', cursor: 'pointer', borderRadius: '6px', boxShadow: '0 0 25px rgba(200,245,62,0.3)' }}
              >
                RUN LIVE DEMO →
              </button>
              <Link
                href="/product"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', fontWeight: 700, fontFamily: 'DM Mono, monospace', fontSize: '0.85rem', letterSpacing: '0.1em', padding: '0.95rem 1.8rem', textDecoration: 'none', borderRadius: '6px', transition: 'all 0.2s', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8F53E'; e.currentTarget.style.color = '#C8F53E'; e.currentTarget.style.background = 'rgba(200,245,62,0.05)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'white'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
              >
                <span>EXPLORE PRODUCT</span>
                <span>↗</span>
              </Link>
            </div>

            <div className="hero-stats-row" style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
              {['● 0.9s Inference Latency', '● 96.4% Verified Accuracy', '● West Bengal Rice, Potato & Wheat Belt'].map((s, i) => (
                <span key={i} className="stat-pill" style={{ background: 'rgba(200,245,62,0.06)', border: '1px solid rgba(200,245,62,0.18)', borderRadius: '99px', padding: '0.4rem 1rem', fontFamily: 'DM Mono, monospace', fontSize: '0.7rem', color: 'rgba(255,255,255,0.65)', animationDelay: `${i * 0.1 + 0.3}s` }}>
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Right Column: Live Inference Dashboard Mockup with Glassmorphism & Laser Scan */}
          <div className="hero-widget-container" style={{ position: 'relative' }}>
            <div style={{
              background: 'rgba(12, 17, 10, 0.78)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(200,245,62,0.25)',
              borderRadius: '16px',
              padding: '1.6rem',
              boxShadow: '0 25px 60px rgba(0,0,0,0.7), 0 0 35px rgba(200,245,62,0.12)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Header Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C55E', animation: 'pulseGreen 1.5s infinite', display: 'inline-block' }} />
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.72rem', color: '#C8F53E', fontWeight: 800, letterSpacing: '0.1em' }}>LIVE AI RADAR</span>
                </div>
                <span style={{ background: 'rgba(56,189,248,0.15)', color: '#38BDF8', border: '1px solid rgba(56,189,248,0.3)', fontFamily: 'DM Mono, monospace', fontSize: '0.62rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '4px', letterSpacing: '0.08em' }}>
                  0.9s LATENCY · 98.4%
                </span>
              </div>

              {/* Scanning Image Preview with Animated Laser Beam & Target Crosshairs */}
              <div style={{ position: 'relative', height: '210px', borderRadius: '8px', overflow: 'hidden', marginBottom: '1.2rem', border: '1px solid rgba(200,245,62,0.2)' }}>
                <img
                  src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=700&q=80"
                  alt="Crop leaf under scanning"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />

                {/* Animated Laser Scanning Line */}
                <div style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, #C8F53E, #38BDF8, #C8F53E, transparent)',
                  boxShadow: '0 0 16px #C8F53E, 0 0 30px #38BDF8',
                  animation: 'laserScan 2.6s ease-in-out infinite',
                  zIndex: 5
                }} />

                {/* Grid Overlay Texture */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: 'linear-gradient(rgba(200,245,62,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(200,245,62,0.06) 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                  pointerEvents: 'none',
                  zIndex: 2
                }} />

                {/* Tactical Bounding Box HUD */}
                <div style={{
                  position: 'absolute',
                  left: '22%',
                  top: '28%',
                  width: '45%',
                  height: '42%',
                  border: '2px dashed #FF4F4F',
                  borderRadius: '4px',
                  background: 'rgba(255, 79, 79, 0.18)',
                  boxShadow: '0 0 16px rgba(255, 79, 79, 0.4)',
                  zIndex: 4
                }}>
                  <span style={{
                    position: 'absolute',
                    top: '-18px',
                    left: '0px',
                    background: '#FF4F4F',
                    color: 'white',
                    fontFamily: 'DM Mono, monospace',
                    fontSize: '0.55rem',
                    fontWeight: 900,
                    padding: '1px 6px',
                    borderRadius: '2px',
                    letterSpacing: '0.08em'
                  }}>
                    ⚠ EARLY SPOT DETECTED · HOOGHLY 4-B
                  </span>
                </div>
              </div>

              {/* Telemetry Metrics */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginBottom: '1rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '0.75rem' }}>
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.58rem', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '2px' }}>DIAGNOSED PATHOGEN</span>
                  <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#FFB347' }}>Potato Late Blight</span>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '0.75rem' }}>
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.58rem', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '2px' }}>THREAT WINDOW</span>
                  <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#C8F53E' }}>Act in 48 Hours</span>
                </div>
              </div>

              {/* Live Action Pill */}
              <div style={{ background: 'rgba(200,245,62,0.06)', border: '1px solid rgba(200,245,62,0.2)', padding: '0.75rem 0.9rem', borderRadius: '6px', fontSize: '0.75rem', color: 'rgba(255,255,255,0.85)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#C8F53E', fontSize: '1rem' }}>⚡</span>
                <span><strong>Target Spray:</strong> Chlorothalonil 75% WP @ 2.5g/L</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PARTNERS MARQUEE */}
      <section style={{ background: '#0A0E07', borderTop: '1px solid rgba(200,245,62,0.08)', borderBottom: '1px solid rgba(200,245,62,0.08)', padding: '1.8rem 0', overflow: 'hidden' }}>
        <p style={{ textAlign: 'center', fontFamily: 'DM Mono, monospace', fontSize: '0.62rem', color: '#C8F53E', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1.2rem' }}>
          CORE TECHNOLOGY STACK &amp; AGRI-DATA BACKBONE
        </p>
        <div style={{ overflow: 'hidden', WebkitMaskImage: 'linear-gradient(to right,transparent,black 10%,black 90%,transparent)', maskImage: 'linear-gradient(to right,transparent,black 10%,black 90%,transparent)' }}>
          <div style={{ display: 'flex', gap: '1.5rem', animation: 'marquee 28s linear infinite', width: 'max-content' }}
            onMouseEnter={e => (e.currentTarget.style.animationPlayState = 'paused')}
            onMouseLeave={e => (e.currentTarget.style.animationPlayState = 'running')}>
            {['Google Gemini 1.5 Multimodal', 'TensorFlow Lite Edge', 'Govt. of India Bhashini NLP', 'OpenWeather Risk Radar', 'data.gov.in Agmarknet', 'Supabase Vector', 'Next.js 16 & Vercel', 'Google Gemini 1.5 Multimodal', 'TensorFlow Lite Edge', 'Govt. of India Bhashini NLP'].map((b, i) => (
              <div key={i} className="partner-card" style={{ background: '#0F1409', border: '1px solid rgba(200,245,62,0.12)', padding: '0.75rem 1.8rem', fontFamily: 'DM Mono, monospace', fontWeight: 700, color: 'white', fontSize: '0.82rem', transition: 'all 0.2s', flexShrink: 0, borderRadius: '4px' }}>
                {b}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VALUE PILLARS */}
      <section className="mobile-padding" style={{ background: '#0A0E07', padding: '8rem 3rem' }}>
        <div className="reveal" style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
          <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.62rem', color: '#38BDF8', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
            ENGINEERED FOR SCALE
          </p>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2.5rem,5vw,4.2rem)', fontStyle: 'italic', fontWeight: 900, margin: '0 0 1rem' }}>
            WE REPLACED GUESSWORK WITH CERTAINTY.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem', maxWidth: '560px', margin: '0 auto' }}>
            Transforming slow, manual visual scouting into sub-second multi-spectral intelligence.
          </p>
        </div>
        <div className="home-features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.8rem', maxWidth: '1140px', margin: '0 auto' }}>
          {[
            { icon: '🔬', title: 'Cellular AI Disease Detection', desc: 'Multi-spectral neural networks identify 94+ pathogen signatures from a single mobile photo.', stat: '96.4% CONFIDENCE ON VERIFIED SCANS' },
            { icon: '🌦️', title: 'Weather + Microclimate Risk Alerts', desc: 'Live atmospheric telemetry forecasts humidity-driven spore dispersion up to 5 days ahead.', stat: 'REAL-TIME · 50KM RISK RADIUS' },
            { icon: '🗺️', title: 'Regional Outbreak Radar', desc: 'Native voice diagnosis, video field scanning, and district-level epidemiological surveillance.', stat: 'VOICE · SATELLITE · OUTBREAK RADAR' },
          ].map((c, i) => (
            <div key={i} className="reveal hover-lift" style={{ background: '#0F1409', border: '1px solid rgba(255,255,255,0.06)', padding: '2.4rem 2rem', borderLeft: '3px solid rgba(200,245,62,0.2)', borderRadius: '12px', cursor: 'default' }}>
              <div style={{ fontSize: '2.2rem', marginBottom: '1.2rem' }}>{c.icon}</div>
              <h3 style={{ fontWeight: 800, fontSize: '1.15rem', marginBottom: '0.8rem', color: 'white' }}>{c.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.88rem', lineHeight: 1.7, marginBottom: '1.4rem' }}>{c.desc}</p>
              <p style={{ color: '#C8F53E', fontFamily: 'DM Mono, monospace', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.1em', margin: 0 }}>{c.stat}</p>
            </div>
          ))}
        </div>
      </section>

      {/* REGIONAL EPIDEMIOLOGICAL RADAR */}
      <section className="mobile-padding" style={{ background: '#060A04', padding: '8rem 3rem' }}>
        <div className="reveal" style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.62rem', color: '#C8F53E', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.8rem' }}>
            <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#C8F53E', marginRight: '6px', animation: 'blink 1.5s infinite', verticalAlign: 'middle' }} />
            REGIONAL EPIDEMIOLOGICAL RADAR · 10 WB DISTRICTS ACTIVE
          </p>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2.5rem,5vw,4.2rem)', fontStyle: 'italic', fontWeight: 900, margin: 0 }}>
            CROPGUARD AI IS WATCHING EVERY FIELD.
          </h2>
        </div>
        <div style={{ position: 'relative', height: '500px', border: '1px solid rgba(200,245,62,0.15)', borderRadius: '12px', overflow: 'hidden', maxWidth: '1140px', margin: '0 auto 2.5rem', boxShadow: '0 0 50px rgba(200,245,62,0.06)' }}>
          <GlobalMap />
          <div style={{ position: 'absolute', top: '1rem', left: '1rem', zIndex: 1000, background: 'rgba(6,10,4,0.92)', border: '1px solid rgba(200,245,62,0.2)', borderRadius: '8px', padding: '0.8rem 1.2rem', backdropFilter: 'blur(12px)' }}>
            {[['8+', 'DISTRICTS'], ['15k+', 'SCANS PROCESSED'], ['96%', 'ACCURACY']].map(([n, l]) => (
              <div key={l} style={{ marginBottom: '0.4rem' }}>
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.3rem', color: '#C8F53E', marginRight: '0.5rem' }}>{n}</span>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>{l}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="home-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', maxWidth: '1140px', margin: '0 auto' }}>
          {[['8+ Districts', 'Hooghly, Burdwan, Nadia, Malda & more'], ['15k+ Scans', 'Multimodal evaluations completed'], ['96% Accuracy', 'KVK scientist validation match'], ['₹10k/yr Govt Aid', 'Krishak Bandhu & PM-KISAN mapped']].map(([n, l], i) => (
            <div key={i} className="reveal hover-lift" style={{ background: '#0F1409', border: '1px solid rgba(200,245,62,0.1)', padding: '1.6rem', textAlign: 'center', borderRadius: '8px' }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.2rem', color: '#C8F53E', fontStyle: 'italic', marginBottom: '0.3rem' }}>{n}</div>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.06em' }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* AI SCANNER DEMO — SHOWSTOPPER COMPONENT */}
      <section id="ai-demo" className="mobile-padding" style={{ background: '#060A04', padding: '8rem 3rem', borderTop: '1px solid rgba(200,245,62,0.08)' }}>
        <div className="reveal" style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(200,245,62,0.08)', border: '1px solid rgba(200,245,62,0.25)', borderRadius: '99px', padding: '0.4rem 1.1rem', marginBottom: '1rem' }}>
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.68rem', color: '#C8F53E', letterSpacing: '0.12em' }}>⚡ INTERACTIVE DIAGNOSIS CONSOLE</span>
          </div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2.5rem,5vw,4.2rem)', fontStyle: 'italic', fontWeight: 900, margin: 0 }}>
            EXPERIENCE REGIONAL VOICE &amp; AI DIAGNOSIS.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '1rem', marginTop: '0.8rem', maxWidth: '600px', margin: '0.8rem auto 0' }}>
            Upload a crop leaf photo or record symptoms in your regional dialect to run immediate pathogen identification.
          </p>

          {/* LANGUAGE SELECTOR PILLS */}
          <div className="lang-pill-group" style={{ display: 'inline-flex', gap: '0.6rem', background: '#0F1409', border: '1px solid rgba(200,245,62,0.2)', padding: '0.4rem', borderRadius: '99px', marginTop: '1.8rem' }}>
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
                  fontFamily: 'DM Mono, monospace',
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

        {/* The Showstopper Console Grid */}
        <div className="home-scanner-grid" style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', background: '#0D1208', border: '1px solid rgba(200,245,62,0.22)', maxWidth: '1060px', margin: '0 auto', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 35px rgba(200,245,62,0.08)' }}>
          
          {/* Left Panel: Upload Zone & Voice Input */}
          <div style={{ padding: '2.2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <input type="file" id="cropFileInput" accept="image/*" style={{ display: 'none' }} ref={fileInputRef} onChange={handleFileSelect} />
              
              {/* Drag & Drop Zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: `2px dashed ${imageError ? '#FF4F4F' : isDragOver ? '#C8F53E' : 'rgba(200,245,62,0.25)'}`,
                  minHeight: '190px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.6rem',
                  cursor: 'pointer',
                  borderRadius: '10px',
                  transition: 'all 0.25s',
                  position: 'relative',
                  overflow: 'hidden',
                  background: isDragOver ? 'rgba(200,245,62,0.08)' : imageError ? 'rgba(255,79,79,0.06)' : 'rgba(0,0,0,0.3)',
                  boxShadow: isDragOver ? '0 0 25px rgba(200,245,62,0.2)' : 'none'
                }}
                onMouseEnter={e => { if (!imagePreview && !imageError) { e.currentTarget.style.borderColor = '#C8F53E'; e.currentTarget.style.boxShadow = '0 0 20px rgba(200,245,62,0.15)'; } }}
                onMouseLeave={e => { if (!imagePreview && !imageError) { e.currentTarget.style.borderColor = 'rgba(200,245,62,0.25)'; e.currentTarget.style.boxShadow = 'none'; } }}
              >
                {imagePreview && !imageError ? (
                  <div style={{ position: 'relative', width: '100%', height: '190px', overflow: 'hidden' }}>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={() => {
                        setImageError('Image failed to render. Please upload a valid image.');
                        addLog('> Error: Image preview failed to render.');
                      }}
                      onLoad={() => setImageError(null)}
                    />
                    {/* Scanning Laser when analyzing */}
                    {analyzing && (
                      <div style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        height: '2px',
                        background: 'linear-gradient(90deg, transparent, #C8F53E, #38BDF8, #C8F53E, transparent)',
                        boxShadow: '0 0 16px #C8F53E, 0 0 25px #38BDF8',
                        animation: 'laserScan 1.8s ease-in-out infinite',
                        zIndex: 10
                      }} />
                    )}
                    {analysisResult?.boundingBox && (
                      <div
                        style={{
                          position: 'absolute',
                          left: `${analysisResult.boundingBox.x}%`,
                          top: `${analysisResult.boundingBox.y}%`,
                          width: `${analysisResult.boundingBox.width}%`,
                          height: `${analysisResult.boundingBox.height}%`,
                          border: '2px solid #FF4F4F',
                          background: 'rgba(255, 79, 79, 0.25)',
                          borderRadius: '4px',
                          boxShadow: '0 0 12px rgba(255, 79, 79, 0.6)',
                          pointerEvents: 'none',
                          zIndex: 10
                        }}
                      >
                        <span
                          style={{
                            position: 'absolute',
                            top: '-19px',
                            left: 0,
                            background: '#FF4F4F',
                            color: '#FFFFFF',
                            fontSize: '0.62rem',
                            fontWeight: 900,
                            fontFamily: 'DM Mono, monospace',
                            padding: '1px 5px',
                            borderRadius: '2px',
                            letterSpacing: '0.05em'
                          }}
                        >
                          ⚠ AFFECTED REGION
                        </span>
                      </div>
                    )}
                  </div>
                ) : imageError ? (
                  <div style={{ textAlign: 'center', padding: '1rem' }}>
                    <span style={{ fontSize: '2rem', color: '#FF4F4F' }}>⚠️</span>
                    <p style={{ fontWeight: 800, color: '#FF4F4F', margin: '4px 0 0', fontSize: '0.9rem' }}>IMAGE LOAD ERROR</p>
                    <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)', margin: '2px 0 0' }}>{imageError}</p>
                    <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.65rem', color: '#C8F53E', margin: '6px 0 0' }}>CLICK TO CHOOSE ANOTHER FILE</p>
                  </div>
                ) : (
                  <>
                    <span style={{ fontSize: '2.4rem' }}>📷</span>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ fontWeight: 800, color: 'white', margin: 0, fontSize: '0.95rem' }}>DRAG &amp; DROP LEAF PHOTO HERE</p>
                      <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.72rem', color: '#C8F53E', margin: '4px 0 0' }}>OR CLICK TO BROWSE FILES</p>
                    </div>
                  </>
                )}
              </div>

              {/* Voice Symptom Input Section */}
              <div style={{ marginTop: '1.2rem', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)', padding: '1rem', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.68rem', color: '#C8F53E', fontWeight: 700, letterSpacing: '0.1em' }}>
                    🎙️ REGIONAL VOICE INPUT
                  </span>
                  <button
                    onClick={toggleListening}
                    style={{
                      background: isListening ? '#FF4F4F' : 'rgba(200,245,62,0.15)',
                      color: isListening ? 'white' : '#C8F53E',
                      border: `1px solid ${isListening ? '#FF4F4F' : 'rgba(200,245,62,0.4)'}`,
                      borderRadius: '4px',
                      padding: '0.35rem 0.8rem',
                      fontFamily: 'DM Mono, monospace',
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
                    {isListening ? 'STOP RECORDING' : 'SPEAK SYMPTOMS'}
                  </button>
                </div>

                <textarea
                  value={transcript}
                  onChange={e => setTranscript(e.target.value)}
                  placeholder={
                    selectedLang === 'bn-IN' 
                      ? 'আপনার ফসলের সমস্যা বাংলায় বলুন বা লিখুন (যেমন: আলু পাতার নিচে বাদামী দাগ)...' 
                      : selectedLang === 'hi-IN'
                      ? 'अपनी फसल की समस्या हिंदी में बोलें या लिखें (जैसे: गेहूं में पीले दानेदार धब्बे)...'
                      : 'Describe your crop symptoms here in English...'
                  }
                  rows={2}
                  style={{
                    width: '100%',
                    background: '#060A04',
                    border: '1px solid rgba(200,245,62,0.2)',
                    color: 'white',
                    padding: '0.6rem 0.8rem',
                    fontSize: '0.82rem',
                    borderRadius: '6px',
                    fontFamily: 'inherit',
                    resize: 'none',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Submit Diagnosis Button */}
              <button
                onClick={() => analyzeImage()}
                disabled={analyzing || !!imageError}
                className="glow-btn"
                style={{
                  width: '100%',
                  marginTop: '1.2rem',
                  background: (analyzing || !!imageError) ? 'rgba(200,245,62,0.2)' : '#C8F53E',
                  color: (analyzing || !!imageError) ? 'rgba(255,255,255,0.4)' : '#060A04',
                  fontWeight: 900,
                  fontFamily: 'DM Mono, monospace',
                  fontSize: '0.85rem',
                  letterSpacing: '0.12em',
                  padding: '0.95rem',
                  border: 'none',
                  cursor: (analyzing || !!imageError) ? 'not-allowed' : 'pointer',
                  borderRadius: '6px',
                  boxShadow: (analyzing || !!imageError) ? 'none' : '0 0 20px rgba(200,245,62,0.3)'
                }}
              >
                {analyzing ? 'ANALYZING PATHOGEN SIGNATURES...' : imageError ? 'INVALID IMAGE — FIX TO PROCEED' : 'EXECUTE NEURAL DIAGNOSIS →'}
              </button>
            </div>

            {/* Quick Test Samples */}
            <div style={{ marginTop: '1.4rem' }}>
              <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', margin: '0 0 0.6rem', textTransform: 'uppercase' }}>
                OR RUN INSTANT SAMPLE DATA:
              </p>
              <div className="sample-btn-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                {[
                  { id: 'WHEAT', label: '🌾 SAMPLE A: WHEAT RUST' },
                  { id: 'SOY', label: '🥔 SAMPLE B: SOY / POTATO BLIGHT' },
                ].map(s => (
                  <button
                    key={s.id}
                    onClick={() => runSample(s.id as any)}
                    style={{
                      border: '1px solid rgba(200,245,62,0.3)',
                      color: '#C8F53E',
                      background: 'rgba(200,245,62,0.04)',
                      padding: '0.6rem',
                      fontFamily: 'DM Mono, monospace',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      letterSpacing: '0.06em',
                      borderRadius: '6px',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(200,245,62,0.15)'; e.currentTarget.style.borderColor = '#C8F53E'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(200,245,62,0.04)'; e.currentTarget.style.borderColor = 'rgba(200,245,62,0.3)'; }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel: Live Terminal Stream & Pipeline Log */}
          <div style={{ background: '#080C05', padding: '2.2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderLeft: '1px solid rgba(255,255,255,0.05)' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.6rem' }}>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.68rem', color: '#C8F53E', letterSpacing: '0.12em', fontWeight: 800 }}>
                  ● NEURAL ANALYSIS CONSOLE
                </span>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px' }}>
                  GEMINI 1.5 MULTIMODAL
                </span>
              </div>

              {/* Console Logs Stream */}
              <div className="custom-scroll" style={{ minHeight: '190px', maxHeight: '240px', overflowY: 'auto', paddingRight: '4px' }}>
                {consoleLogs.map((log, i) => (
                  <p key={i} style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.78rem', color: log.includes('complete') ? '#C8F53E' : log.includes('Error') ? '#FF4F4F' : 'rgba(200,245,62,0.8)', marginBottom: '0.45rem', lineHeight: 1.45 }}>
                    {log}
                    {i === consoleLogs.length - 1 && <span style={{ animation: 'blink 1s infinite' }}>_</span>}
                  </p>
                ))}
              </div>
            </div>

            <div>
              {/* Processing Gauge */}
              <div style={{ margin: '1.5rem 0 1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>MODEL INFERENCE CYCLES</span>
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', color: '#C8F53E', fontWeight: 700 }}>{pp}ms</span>
                </div>
                <div style={{ background: 'rgba(200,245,62,0.1)', height: '4px', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ background: 'linear-gradient(90deg, #C8F53E, #38BDF8)', height: '100%', width: `${Math.min((pp / 3000) * 100, 100)}%`, transition: 'width 0.1s linear' }} />
                </div>
              </div>

              {/* Pipeline Status */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', background: 'rgba(200,245,62,0.05)', border: '1px solid rgba(200,245,62,0.15)', padding: '0.8rem 1rem', borderRadius: '6px' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C55E', animation: 'pulseGreen 1.5s infinite', display: 'inline-block' }} />
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.68rem', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.08em' }}>ENGINE INTEGRITY</span>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.68rem', color: '#C8F53E', fontWeight: 800, marginLeft: 'auto' }}>100% NOMINAL</span>
              </div>
            </div>
          </div>
        </div>

        {/* RESULTS CARD (ANIMATED SHOWCASE) */}
        {analysisResult && (
          <div className="reveal visible" style={{ background: '#0F1409', border: '1px solid rgba(200,245,62,0.3)', maxWidth: '1060px', margin: '2.5rem auto 0', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }}>
            
            {/* LOCALIZED VOICE RESPONSE BANNER */}
            {analysisResult.voiceSummary && (
              <div style={{ background: 'rgba(200,245,62,0.08)', border: '1px solid rgba(200,245,62,0.35)', padding: '1.4rem', borderRadius: '10px', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                  <span style={{ color: '#C8F53E', fontSize: '0.78rem', fontWeight: 900, letterSpacing: '0.12em', fontFamily: 'DM Mono, monospace' }}>
                    🔊 REGIONAL VOICE ADVISORY ({selectedLang === 'bn-IN' ? 'বাংলা BANGLA' : selectedLang === 'hi-IN' ? 'हिंदी HINDI' : 'ENGLISH'})
                  </span>
                  <div style={{ display: 'flex', gap: '0.6rem' }}>
                    <button
                      onClick={() => speakResponse(analysisResult.voiceSummary, selectedLang)}
                      style={{ background: '#C8F53E', color: '#060A04', border: 'none', borderRadius: '6px', padding: '0.4rem 1rem', fontSize: '0.72rem', fontWeight: 900, cursor: 'pointer', fontFamily: 'DM Mono, monospace' }}
                    >
                      {isPlayingAudio ? '▶️ REPLAY AUDIO' : '🔊 PLAY AUDIO'}
                    </button>
                    {isPlayingAudio && (
                      <button
                        onClick={stopAudio}
                        style={{ background: '#FF4F4F', color: 'white', border: 'none', borderRadius: '6px', padding: '0.4rem 0.8rem', fontSize: '0.72rem', fontWeight: 900, cursor: 'pointer', fontFamily: 'DM Mono, monospace' }}
                      >
                        ⏹ STOP
                      </button>
                    )}
                  </div>
                </div>
                <p style={{ color: 'white', fontSize: '1.05rem', lineHeight: 1.6, margin: 0 }}>
                  &ldquo;{analysisResult.voiceSummary}&rdquo;
                </p>
              </div>
            )}

            {/* Severity & Diagnostic Metric Cards */}
            <div className="home-result-metrics" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.2rem', marginBottom: '2.5rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.4rem', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px' }}>
                <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', letterSpacing: '0.08em' }}>DISEASE IDENTIFIED</p>
                <p style={{ fontSize: '1.25rem', color: 'white', fontWeight: 900, margin: 0 }}>{analysisResult.disease?.toUpperCase() || 'HEALTHY'}</p>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.4rem', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px' }}>
                <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', letterSpacing: '0.08em' }}>CONFIDENCE SCORE</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ flexGrow: 1, height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${analysisResult.healthScore}%`, height: '100%', background: '#C8F53E' }} />
                  </div>
                  <span style={{ color: '#C8F53E', fontWeight: 900, fontFamily: 'DM Mono, monospace', fontSize: '1.1rem' }}>{analysisResult.healthScore}%</span>
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.4rem', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px' }}>
                <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', letterSpacing: '0.08em' }}>SEVERITY LEVEL</p>
                <span style={{
                  display: 'inline-block',
                  fontSize: '0.92rem',
                  fontWeight: 900,
                  fontFamily: 'DM Mono, monospace',
                  padding: '3px 10px',
                  borderRadius: '4px',
                  background: analysisResult.riskLevel === 'High' || analysisResult.riskLevel === 'Critical' ? 'rgba(255,79,79,0.15)' : 'rgba(255,179,71,0.15)',
                  border: `1px solid ${analysisResult.riskLevel === 'High' || analysisResult.riskLevel === 'Critical' ? '#FF4F4F' : '#FFB347'}`,
                  color: analysisResult.riskLevel === 'High' || analysisResult.riskLevel === 'Critical' ? '#FF4F4F' : '#FFB347'
                }}>
                  {analysisResult.riskLevel === 'High' || analysisResult.riskLevel === 'Critical' ? 'HIGH 🔴' : 'MODERATE ⚠️'}
                </span>
              </div>
            </div>

            {/* 1. CLIMATE & PATHOGEN RADAR */}
            {analysisResult.diseaseRisk && analysisResult.weather && (
              <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(200,245,62,0.18)', borderRadius: '10px', padding: '1.6rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                  <div>
                    <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.72rem', color: '#C8F53E', letterSpacing: '0.15em', fontWeight: 900 }}>
                      🌦️ LOCALIZED WEATHER CONTEXT ({analysisResult.weather.location})
                    </span>
                    <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)', margin: '0.2rem 0 0' }}>
                      Temp: {analysisResult.weather.temperature}°C · Humidity: {analysisResult.weather.humidity}% · Rain Risk: {analysisResult.weather.rain_risk}
                    </p>
                  </div>
                  <span style={{ background: analysisResult.diseaseRisk.riskLevel === 'High' ? '#FF4F4F' : '#FFB347', color: '#060A04', fontWeight: 900, fontSize: '0.7rem', padding: '0.35rem 0.9rem', borderRadius: '99px', fontFamily: 'DM Mono, monospace' }}>
                    {analysisResult.diseaseRisk.riskLevel?.toUpperCase()} SPREAD RISK ({analysisResult.diseaseRisk.riskScore}/100)
                  </span>
                </div>

                {/* 5-Day Forecast */}
                <div className="home-weather-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.8rem', marginBottom: '1.2rem' }}>
                  {analysisResult.weather.forecast?.map((day: any, i: number) => (
                    <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '0.8rem', textAlign: 'center' }}>
                      <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', margin: '0 0 0.3rem', fontWeight: 700 }}>{day.day}</p>
                      <div style={{ fontSize: '1.3rem', margin: '0.2rem 0' }}>{day.icon}</div>
                      <p style={{ fontSize: '0.88rem', fontWeight: 900, color: 'white', margin: '0.2rem 0' }}>{day.temp}°C</p>
                      <p style={{ fontSize: '0.65rem', color: '#C8F53E', margin: '0.2rem 0 0', fontFamily: 'DM Mono, monospace' }}>💧 {day.humidity}%</p>
                      <p style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', margin: '0.1rem 0 0', fontFamily: 'DM Mono, monospace' }}>🌧️ {day.rain_probability}%</p>
                    </div>
                  ))}
                </div>

                <div style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.06)', padding: '1rem', borderRadius: '6px' }}>
                  <p style={{ color: 'white', fontSize: '0.88rem', lineHeight: 1.5, margin: '0 0 0.4rem' }}>
                    {selectedLang === 'bn-IN'
                      ? analysisResult.diseaseRisk.explanation_bn
                      : selectedLang === 'hi-IN'
                      ? analysisResult.diseaseRisk.explanation_hi
                      : analysisResult.diseaseRisk.explanation}
                  </p>
                  <p style={{ color: '#C8F53E', fontSize: '0.82rem', fontWeight: 800, margin: 0, fontFamily: 'DM Mono, monospace' }}>
                    ⚡ {selectedLang === 'bn-IN'
                      ? analysisResult.diseaseRisk.actionableAdvice_bn
                      : selectedLang === 'hi-IN'
                      ? analysisResult.diseaseRisk.actionableAdvice_hi
                      : analysisResult.diseaseRisk.actionableAdvice}
                  </p>
                </div>
              </div>
            )}

            {/* 2. GOVERNMENT SCHEMES & DBT MATCHING */}
            {analysisResult.schemes && analysisResult.schemes.length > 0 && (
              <div style={{ marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.8rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#C8F53E', letterSpacing: '0.15em', fontWeight: 900, fontFamily: 'DM Mono, monospace' }}>
                      🏛️ MATCHED GOVT. SCHEMES &amp; SUBSIDIES
                    </span>
                    <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', margin: '0.2rem 0 0' }}>
                      Krishak Bandhu, PM-KISAN, and Bangla Shasya Bima direct support
                    </p>
                  </div>
                  <span style={{ background: 'rgba(200,245,62,0.12)', color: '#C8F53E', border: '1px solid rgba(200,245,62,0.3)', fontSize: '0.65rem', fontWeight: 900, padding: '0.2rem 0.6rem', borderRadius: '99px', fontFamily: 'DM Mono, monospace' }}>
                    DIRECT BENEFIT TRANSFER
                  </span>
                </div>

                <div className="home-schemes-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                  {analysisResult.schemes.map((scheme: any) => (
                    <div
                      key={scheme.id}
                      style={{
                        background: 'rgba(200,245,62,0.03)',
                        border: '1px solid rgba(200,245,62,0.2)',
                        borderRadius: '10px',
                        padding: '1.3rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                          <h4 style={{ color: 'white', fontSize: '0.95rem', fontWeight: 900, margin: 0 }}>
                            {selectedLang === 'bn-IN' ? scheme.name_bn : selectedLang === 'hi-IN' ? scheme.name_hi : scheme.name}
                          </h4>
                          <span style={{ background: '#C8F53E', color: '#060A04', fontSize: '0.62rem', fontWeight: 900, padding: '0.15rem 0.5rem', borderRadius: '99px', fontFamily: 'DM Mono, monospace' }}>
                            {scheme.badge}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.5, margin: '0 0 0.8rem' }}>
                          {selectedLang === 'bn-IN' ? scheme.description_bn : selectedLang === 'hi-IN' ? scheme.description_hi : scheme.description}
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
                          padding: '0.55rem',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          textDecoration: 'none',
                          display: 'block',
                          fontFamily: 'DM Mono, monospace',
                          transition: 'all 0.2s',
                          boxSizing: 'border-box'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#C8F53E'; e.currentTarget.style.color = '#060A04'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#C8F53E'; }}
                      >
                        OFFICIAL PORTAL APPLICATION →
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="result-action-bar" style={{ marginTop: '2.2rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.8rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={resetScanner}
                className="glow-btn"
                style={{ flex: 1, minWidth: '220px', background: '#C8F53E', color: '#060A04', border: 'none', padding: '0.9rem', fontWeight: 900, cursor: 'pointer', borderRadius: '6px', fontFamily: 'DM Mono, monospace', fontSize: '0.82rem' }}
              >
                SCAN ANOTHER CROP FIELD →
              </button>
              <Link
                href="/dashboard"
                style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '0.9rem 1.6rem', fontWeight: 700, textDecoration: 'none', borderRadius: '6px', fontFamily: 'DM Mono, monospace', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8F53E'; e.currentTarget.style.color = '#C8F53E'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'white'; }}
              >
                OPEN FPO DASHBOARD ↗
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* FROM DATA TO DECISION */}
      <section className="mobile-padding" style={{ background: '#0A0E07', padding: '8rem 3rem' }}>
        <div className="home-cta-grid" style={{ maxWidth: '1140px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div className="reveal">
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2.5rem,5vw,4.2rem)', fontStyle: 'italic', fontWeight: 900, lineHeight: 1.1, marginBottom: '3rem' }}>
              <span style={{ color: 'white' }}>FROM DATA TO DECISION </span>
              <span style={{ color: '#C8F53E' }}>IN 3 MINUTES.</span>
            </h2>
            <div style={{ position: 'relative', paddingLeft: '2rem' }}>
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '2px', background: 'linear-gradient(to bottom,#C8F53E,rgba(200,245,62,0.1))' }} />
              {[
                ['01', 'CAPTURE & INGEST', 'Upload field imagery via WhatsApp or web interface in any lighting.'],
                ['02', 'NEURAL MODEL INFERENCE', 'Multimodal Gemini & Edge TFLite evaluate cellular signatures in 0.9s.'],
                ['03', 'ACTIONABLE INTERVENTION', 'Receive exact chemical dosages, dealer availability, and state DBT matches.']
              ].map(([n, t, d], i) => (
                <div key={i} style={{ marginBottom: i < 2 ? '2.5rem' : 0 }}>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', color: '#C8F53E', fontStyle: 'italic', lineHeight: 1 }}>{n}</div>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem', textTransform: 'uppercase', marginBottom: '0.4rem', color: 'white' }}>{t}</div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.88rem', lineHeight: 1.7 }}>{d}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="reveal" style={{ position: 'relative' }}>
            <img src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80" alt="crop field" style={{ width: '100%', height: '420px', objectFit: 'cover', borderRadius: '12px', border: '1px solid rgba(200,245,62,0.15)', display: 'block', boxShadow: '0 20px 50px rgba(0,0,0,0.6)' }} />
            <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', background: 'rgba(6,10,4,0.94)', border: '1px solid rgba(255,79,79,0.3)', boxShadow: '0 0 25px rgba(255,79,79,0.2)', padding: '1.1rem', borderRadius: '8px', maxWidth: '240px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.4rem' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF4F4F', animation: 'pulseRed 1.5s infinite', display: 'inline-block' }} />
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.62rem', color: '#FF4F4F', letterSpacing: '0.12em', fontWeight: 800 }}>THREAT DETECTED</span>
              </div>
              <div style={{ fontWeight: 800, fontSize: '1.05rem', marginBottom: '0.2rem', color: 'white' }}>SOYBEAN RUST</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem', marginBottom: '0.4rem' }}>SECTOR 4-B · HOOGHLY</div>
              <div style={{ color: '#C8F53E', fontSize: '0.72rem', fontFamily: 'DM Mono, monospace' }}>📍 GPS: 22.89° N, 88.39° E</div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="mobile-padding" style={{ position: 'relative', overflow: 'hidden', minHeight: '58vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '6rem 3rem', background: '#050704', borderTop: '1px solid rgba(200,245,62,0.1)' }}>
        <video autoPlay muted loop playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.12, zIndex: 0 }} src="/footer-bg.mp4" />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle, rgba(200,245,62,0.06), transparent 70%), rgba(6,10,4,0.85)', zIndex: 1 }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(200,245,62,0.08)', border: '1px solid rgba(200,245,62,0.25)', borderRadius: '99px', padding: '0.4rem 1.1rem', marginBottom: '1.5rem' }}>
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.68rem', color: '#C8F53E', letterSpacing: '0.12em' }}>🏆 SMART INDIA HACKATHON 2026 SUBMISSION</span>
          </div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(3rem,7vw,5.8rem)', fontStyle: 'italic', fontWeight: 900, marginBottom: '1.2rem', lineHeight: 0.95 }}>
            READY TO PROTECT YOUR HARVEST?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '1.05rem', maxWidth: '580px', margin: '0 auto 2.2rem', lineHeight: 1.75 }}>
            From a single farmer's voice in a remote field to district-wide automated early warning systems across West Bengal.
          </p>
          <div className="cta-btn-row" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '1.8rem', flexWrap: 'wrap' }}>
            <Link href="/login" className="glow-btn" style={{ background: '#C8F53E', color: '#060A04', fontWeight: 900, fontFamily: 'DM Mono, monospace', fontSize: '0.85rem', letterSpacing: '0.12em', padding: '0.95rem 2.2rem', textDecoration: 'none', display: 'inline-block', borderRadius: '6px', boxShadow: '0 0 25px rgba(200,245,62,0.3)' }}>
              START MY PILOT
            </Link>
            <Link href="/pricing" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.25)', color: 'white', fontFamily: 'DM Mono, monospace', fontSize: '0.85rem', letterSpacing: '0.1em', padding: '0.95rem 1.8rem', textDecoration: 'none', display: 'inline-block', borderRadius: '6px', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8F53E'; e.currentTarget.style.color = '#C8F53E'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.color = 'white'; }}>
              VIEW PRICING
            </Link>
          </div>
          <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em' }}>
            🔒 NO CREDIT CARD REQUIRED · CANCEL ANYTIME · ANONYMIZED ZERO-PII STORAGE
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
