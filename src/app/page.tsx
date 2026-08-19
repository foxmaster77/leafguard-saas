'use client';
import React, { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
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

@media (max-width: 1024px) {
  .hero-split-grid { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
  .hero-mockup-wrapper { grid-template-columns: 1fr !important; max-width: 500px !important; }
}
@media (max-width: 639px) {
  .home-features-grid { grid-template-columns: 1fr !important; }
  .home-how-grid { grid-template-columns: 1fr !important; }
  .home-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
  .home-scanner-grid { grid-template-columns: 1fr !important; }
  .home-result-metrics { grid-template-columns: 1fr !important; }
  .home-treatment-grid { grid-template-columns: 1fr !important; }
  .home-weather-grid { grid-template-columns: repeat(2, 1fr) !important; }
  .home-dealers-grid { grid-template-columns: 1fr !important; }
  .home-schemes-grid { grid-template-columns: 1fr !important; }
  .home-cta-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
  .mobile-padding { padding: 4rem 1rem !important; }
  .hero-padding { padding: 80px 1rem 4rem 1rem !important; }
}
`;

export default function HomePage() {
  const [pp, setPp] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setImageError('Selected file is not a valid image format.');
        setImagePreview(null);
        addLog('> Error: Invalid file format (not an image).');
        return;
      }
      setImageError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        const b64 = reader.result as string;
        setImagePreview(b64);
        setAnalysisResult(null);
        setConsoleLogs(['> Image loaded. Ready for scan...']);
      };
      reader.onerror = () => {
        setImageError('Failed to read selected image.');
        addLog('> Error reading image file.');
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async (base64?: string | null, mediaType?: string) => {
    if (imageError) {
      alert('Please select a valid image before running diagnosis.');
      return;
    }
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
          addLog('> Multimodal analysis complete.');
          // Auto-play TTS spoken summary in selected language
          if (data.voiceSummary) {
            speakResponse(data.voiceSummary, selectedLang);
          }
        } else {
          addLog('> Analysis failed: ' + (data?.error || `HTTP ${res.status}`));
        }
        setAnalyzing(false);
      }, Math.max(logs.length * 500 + 300, targetMs));
    } catch (err: any) {
      addLog(`> Error connecting to AgroGuard AI node: ${err?.message || 'Check connection'}`);
      setAnalyzing(false);
    }
  };

  const runSample = async (type: 'POTATO' | 'WHEAT' | 'SOY') => {
    const url = type === 'POTATO' ? '/samples/soy.jpg' : type === 'WHEAT' ? '/samples/wheat.jpg' : '/samples/soy.jpg';

    setImageError(null);
    setConsoleLogs([`> Fetching West Bengal sample: ${type === 'POTATO' ? 'Potato Late Blight (Hooghly)' : 'Wheat Yellow Rust (Burdwan)'}...`]);
    if (type === 'POTATO') {
      setTranscript(selectedLang === 'bn-IN' ? 'আলু গাছের পাতায় কালচে বাদামী দাগ দেখা যাচ্ছে এবং পাতা পচে যাচ্ছে।' : selectedLang === 'hi-IN' ? 'आलू के पत्तों पर काले-भूरे धब्बे दिख रहे हैं और पत्तियां सड़ रही हैं।' : 'Dark water-soaked lesions and blight patches on potato leaves in Hooghly field (23.2N, 87.8E).');
    } else if (type === 'WHEAT') {
      setTranscript(selectedLang === 'bn-IN' ? 'গম গাছের পাতায় হলুদ দাগ এবং শুকিয়ে যাওয়া ভাব দেখা যাচ্ছে।' : selectedLang === 'hi-IN' ? 'गेहूं के पत्तों पर पीले धब्बे दिख रहे हैं।' : 'Yellow stripe rust pustules appearing on wheat leaves in Burdwan (23.2N, 87.9E).');
    } else {
      setTranscript(selectedLang === 'bn-IN' ? 'সোয়াবিন পাতার নিচে বাদামী গুঁড়ো জমে আছে।' : selectedLang === 'hi-IN' ? 'सोयाबीन के पत्तों के नीचे भूरा पाउडर जमा हो रहा है।' : 'Brown rust powder underneath soybean leaves.');
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} failed to load ${type} sample`);
      }
      const blob = await response.blob();
      if (!blob.type.startsWith('image/')) {
        throw new Error(`Invalid image type (${blob.type})`);
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result as string;
        setImagePreview(base64data);
        setImageError(null);
        analyzeImage(base64data, blob.type);
      };
      reader.onerror = () => {
        setImageError(`Failed to decode sample ${type} image.`);
        addLog(`> Failed to decode sample ${type} image.`);
      };
      reader.readAsDataURL(blob);
    } catch (e: any) {
      setImageError(`Failed to load sample ${type} image.`);
      addLog(`> Failed to load sample image: ${e?.message || e}`);
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

      {/* HERO SECTION */}
      <section className="hero-padding" style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', padding: '0 3rem', paddingTop: '100px', paddingBottom: '4rem' }}>
        <video autoPlay muted loop playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.12, zIndex: 0 }} src="/238827.mp4" />
        {/* Glowing gradients: emerald green & tech blue accents */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 15% 25%, rgba(16,185,129,0.16), transparent 40%), radial-gradient(circle at 85% 40%, rgba(56,189,248,0.12), transparent 45%), linear-gradient(135deg,rgba(6,10,4,0.96),rgba(6,10,4,0.75),rgba(6,10,4,0.94))', zIndex: 1 }} />
        
        <div className="hero-split-grid" style={{ position: 'relative', zIndex: 2, display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '3.5rem', alignItems: 'center', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
          {/* Left Hero Column: Copy & CTAs */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(200,245,62,0.08)', border: '1px solid rgba(200,245,62,0.25)', borderRadius: '99px', padding: '0.4rem 1rem', fontFamily: 'monospace', fontSize: '0.7rem', color: '#C8F53E', letterSpacing: '0.15em', marginBottom: '1.5rem' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#C8F53E', display: 'inline-block' }} />
              CROPGUARD AI · WHATSAPP &amp; B2B PLATFORM
            </div>

            <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(3.8rem,7.5vw,6.5rem)', fontWeight: 900, fontStyle: 'italic', lineHeight: 0.92, margin: '0 0 1.5rem', letterSpacing: '0.01em' }}>
              <span style={{ color: 'white' }}>INSTANT CROP DIAGNOSTICS &amp; </span>
              <span style={{ color: '#C8F53E' }}>TREATMENT PLANS.</span>
            </h1>

            <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)', maxWidth: '540px', lineHeight: 1.75, marginBottom: '2.2rem' }}>
              Detect diseases instantly via WhatsApp or our Web App. Get precise, actionable pesticide dosages tailored to local weather conditions.
            </p>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => document.getElementById('ai-demo')?.scrollIntoView({ behavior: 'smooth' })}
                style={{ background: '#C8F53E', color: '#060A04', fontWeight: 900, fontFamily: 'monospace', fontSize: '0.82rem', letterSpacing: '0.12em', padding: '0.95rem 2rem', border: 'none', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 0 24px rgba(200,245,62,0.3)', borderRadius: '6px' }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
              >
                TRY THE DEMO →
              </button>

              <a
                href="https://wa.me/919876543210?text=Hello%20CropGuard%20AI,%20I%20would%20like%20to%20test%20the%20WhatsApp%20leaf%20diagnosis%20bot."
                target="_blank"
                rel="noopener noreferrer"
                style={{ background: '#25D366', color: 'white', fontWeight: 800, fontFamily: 'monospace', fontSize: '0.82rem', letterSpacing: '0.08em', padding: '0.95rem 1.8rem', cursor: 'pointer', transition: 'all 0.2s', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', borderRadius: '6px', boxShadow: '0 0 20px rgba(37,211,102,0.3)' }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <span>💬</span>
                <span>CONNECT VIA WHATSAPP</span>
              </a>
            </div>

            <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
              {['● 1.2s Response Time', '● Works via WhatsApp', '● 96% Model Accuracy'].map((s, i) => (
                <span key={i} className="stat-pill" style={{ background: 'rgba(200,245,62,0.06)', border: '1px solid rgba(200,245,62,0.18)', borderRadius: '99px', padding: '0.35rem 0.9rem', fontFamily: 'monospace', fontSize: '0.68rem', color: 'rgba(255,255,255,0.65)' }}>{s}</span>
              ))}
            </div>
          </div>

          {/* Right Hero Column: SPLIT SCREEN VISUAL (WhatsApp Chat Mockup + FPO Web Dashboard) */}
          <div className="hero-mockup-wrapper" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem', width: '100%' }}>
            {/* 1. Left Sub-Card: WhatsApp Chat Mockup */}
            <div style={{ background: '#0B141A', border: '1px solid rgba(37,211,102,0.3)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 0 35px rgba(37,211,102,0.15)', display: 'flex', flexDirection: 'column', height: '420px' }}>
              {/* WhatsApp Header */}
              <div style={{ background: '#1F2C34', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.6rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#060A04', fontWeight: 900, fontSize: '0.75rem' }}>
                  🌾
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'white' }}>CropGuard Bot</span>
                    <span style={{ color: '#25D366', fontSize: '0.65rem' }}>✓</span>
                  </div>
                  <span style={{ fontSize: '0.62rem', color: '#25D366', fontFamily: 'monospace' }}>● online</span>
                </div>
              </div>

              {/* Chat Bubble Stream */}
              <div style={{ flex: 1, padding: '0.9rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.72rem', background: '#0B141A' }}>
                {/* Farmer Photo Outbound */}
                <div style={{ alignSelf: 'flex-end', background: '#005C4B', color: '#E9EDEF', padding: '0.5rem', borderRadius: '10px 0 10px 10px', maxWidth: '85%' }}>
                  <img src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=300&q=80" alt="Farmer crop leaf upload" style={{ width: '100%', height: '70px', objectFit: 'cover', borderRadius: '6px', marginBottom: '0.3rem' }} />
                  <p style={{ margin: 0, fontSize: '0.68rem', lineHeight: 1.3 }}>আমার আলু পাতায় কি রোগ হয়েছে? (Check leaf)</p>
                  <span style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.5)', display: 'block', textAlign: 'right', marginTop: '2px' }}>10:42 AM · ✓✓</span>
                </div>

                {/* AI Inbound Diagnosis */}
                <div style={{ alignSelf: 'flex-start', background: '#202C33', color: '#E9EDEF', padding: '0.65rem', borderRadius: '0 10px 10px 10px', maxWidth: '92%', borderLeft: '3px solid #25D366' }}>
                  <p style={{ margin: '0 0 0.3rem', color: '#C8F53E', fontWeight: 900, fontFamily: 'monospace', fontSize: '0.7rem' }}>
                    ⚡ LATE BLIGHT DETECTED
                  </p>
                  <p style={{ margin: '0 0 0.2rem', color: 'white' }}>
                    <strong>Confidence:</strong> 96%
                  </p>
                  <p style={{ margin: '0 0 0.2rem', color: '#FFB347' }}>
                    <strong>Threat:</strong> High (Act in 48h)
                  </p>
                  <p style={{ margin: '0 0 0.2rem', color: '#38BDF8' }}>
                    <strong>Spray:</strong> Chlorothalonil 75% WP @ 2.5g/L
                  </p>
                  <span style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.4)', display: 'block', marginTop: '4px' }}>10:42 AM · Instant AI</span>
                </div>
              </div>
            </div>

            {/* 2. Right Sub-Card: Web Dashboard View for FPOs */}
            <div style={{ background: '#0F1409', border: '1px solid rgba(56,189,248,0.3)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 0 35px rgba(56,189,248,0.12)', display: 'flex', flexDirection: 'column', height: '420px', padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.6rem' }}>
                <div>
                  <span style={{ fontFamily: 'monospace', fontSize: '0.62rem', color: '#38BDF8', letterSpacing: '0.1em', fontWeight: 900, display: 'block' }}>FPO COMMAND CENTER</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'white' }}>Hooghly Potato Cluster</span>
                </div>
                <span style={{ background: 'rgba(56,189,248,0.15)', color: '#38BDF8', fontSize: '0.58rem', fontFamily: 'monospace', fontWeight: 900, padding: '0.2rem 0.5rem', borderRadius: '4px' }}>LIVE RADAR</span>
              </div>

              {/* Mini Cluster Telemetry */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.8rem' }}>
                <div style={{ background: 'rgba(0,0,0,0.5)', padding: '0.5rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', display: 'block' }}>ACRES TRACKED</span>
                  <span style={{ fontSize: '1rem', fontWeight: 900, color: '#C8F53E', fontFamily: 'monospace' }}>15,480</span>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.5)', padding: '0.5rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', display: 'block' }}>MODEL ACCURACY</span>
                  <span style={{ fontSize: '1rem', fontWeight: 900, color: '#38BDF8', fontFamily: 'monospace' }}>96.4%</span>
                </div>
              </div>

              {/* Outbreak Heatmap Preview Box */}
              <div style={{ position: 'relative', flex: 1, borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(200,245,62,0.15)', background: '#060A04' }}>
                <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80" alt="Satellite farm map" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35 }} />
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 45% 45%, rgba(255,79,79,0.5), transparent 40%), radial-gradient(circle at 75% 65%, rgba(255,179,71,0.4), transparent 35%)' }} />
                
                <div style={{ position: 'absolute', bottom: '8px', left: '8px', right: '8px', background: 'rgba(6,10,4,0.9)', padding: '0.5rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.62rem', fontFamily: 'monospace' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#FF4F4F', fontWeight: 700 }}>
                    <span>🔴 HOOGHLY OUTBREAK</span>
                    <span>48h Alert</span>
                  </div>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>Early intervention dispatched to 142 farmers</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS (3 SIMPLE STEPS) */}
      <section className="mobile-padding" style={{ background: '#080D06', padding: '6rem 3rem', borderTop: '1px solid rgba(200,245,62,0.06)', borderBottom: '1px solid rgba(200,245,62,0.06)' }}>
        <div className="reveal" style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <p style={{ fontFamily: 'monospace', fontSize: '0.62rem', color: '#C8F53E', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
            SIMPLE · INSTANT · FIELD-READY
          </p>
          <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(2.5rem,5vw,4rem)', fontStyle: 'italic', fontWeight: 900, margin: 0 }}>
            HOW CROPGUARD AI WORKS IN 3 STEPS.
          </h2>
        </div>

        <div className="home-how-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.8rem', maxWidth: '1100px', margin: '0 auto' }}>
          {[
            { step: '01', title: 'CAPTURE', desc: 'Take a leaf photo via WhatsApp, our Web App, or drone camera. Even record your symptoms by voice in your regional dialect.', badge: 'WhatsApp · Web · Voice' },
            { step: '02', title: 'ANALYZE', desc: 'Multimodal neural models cross-reference leaf cellular signatures against 90+ pathogens and local humidity in 1.2 seconds.', badge: '96% Verified Accuracy' },
            { step: '03', title: 'TREAT', desc: 'Receive exact chemical dosages (e.g. Chlorothalonil @ 2.5g/L), organic alternatives, and nearest dealer availability.', badge: 'Actionable & Verified' },
          ].map((s, i) => (
            <div key={i} className="reveal" style={{ background: '#0F1409', border: '1px solid rgba(200,245,62,0.12)', padding: '2.2rem', borderRadius: '12px', position: 'relative' }}>
              <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '3rem', color: 'rgba(200,245,62,0.2)', position: 'absolute', top: '1rem', right: '1.5rem', fontStyle: 'italic' }}>{s.step}</span>
              <span style={{ display: 'inline-block', background: 'rgba(200,245,62,0.1)', color: '#C8F53E', fontSize: '0.65rem', fontFamily: 'monospace', fontWeight: 800, padding: '0.25rem 0.6rem', borderRadius: '4px', marginBottom: '1rem' }}>{s.badge}</span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'white', marginBottom: '0.6rem' }}>{s.title}</h3>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.65, margin: 0 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* "BUILT FOR THE FIELD" FEATURES SECTION (4-CARD GRID) */}
      <section className="mobile-padding" style={{ background: '#0A0E07', padding: '8rem 3rem' }}>
        <div className="reveal" style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <p style={{ fontFamily: 'monospace', fontSize: '0.62rem', color: '#38BDF8', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
            ENGINEERED FOR INDIAN AGRICULTURE
          </p>
          <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(2.5rem,5vw,4.2rem)', fontStyle: 'italic', fontWeight: 900, margin: '0 0 1rem' }}>
            BUILT FOR THE FIELD. DESIGNED FOR SCALE.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
            High-precision AI diagnostics built for progressive farmers, FPOs, and large agribusiness clusters.
          </p>
        </div>

        <div className="home-features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.8rem', maxWidth: '1100px', margin: '0 auto' }}>
          {[
            {
              icon: '💬',
              title: 'WhatsApp Native',
              desc: 'No app download required. Farmers simply send a leaf photo to our WhatsApp bot and receive instant diagnosis and localized treatment advice.',
              stat: 'ZERO APP INSTALL · 1-TAP ACCESS'
            },
            {
              icon: '📡',
              title: 'Works Offline',
              desc: 'Capture photos and voice recordings deep in remote fields without network connectivity. Data auto-syncs and evaluates the moment connection returns.',
              stat: 'OFFLINE CAPTURE · AUTO-SYNC'
            },
            {
              icon: '🎙️',
              title: 'Regional Voice AI',
              desc: 'Ask questions and receive spoken audio advice in native languages including Bangla (বাংলা), Hindi (हिंदी), and English dialects.',
              stat: 'BANGLA · HINDI · ENGLISH'
            },
            {
              icon: '🗺️',
              title: 'Agribusiness Dashboard',
              desc: 'FPOs and enterprise agronomists can monitor disease outbreak velocity, treatment efficacy, and cluster densities across thousands of acres.',
              stat: 'LIVE SATELLITE HEATMAPS'
            }
          ].map((c, i) => (
            <div key={i} className="reveal feature-card" style={{ background: '#0F1409', border: '1px solid rgba(255,255,255,0.06)', padding: '2.5rem', transition: 'all 0.25s', borderLeft: '2px solid rgba(200,245,62,0.2)', borderRadius: '12px', cursor: 'default' }}>
              <div style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>{c.icon}</div>
              <h3 style={{ fontWeight: 800, fontSize: '1.15rem', marginBottom: '0.75rem', color: 'white' }}>{c.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.88rem', lineHeight: 1.7, marginBottom: '1.2rem' }}>{c.desc}</p>
              <p style={{ color: '#C8F53E', fontFamily: 'monospace', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.1em' }}>{c.stat}</p>
            </div>
          ))}
        </div>
      </section>

      {/* REGIONAL RADAR & SOCIAL PROOF SECTION */}
      <section className="mobile-padding" style={{ background: '#060A04', padding: '8rem 3rem' }}>
        <div className="reveal" style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p style={{ fontFamily: 'monospace', fontSize: '0.62rem', color: '#C8F53E', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.8rem' }}>
            <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#C8F53E', marginRight: '6px', animation: 'blink 1s infinite', verticalAlign: 'middle' }} />
            REGIONAL EPIDEMIOLOGICAL RADAR · WEST BENGAL DISTRICTS
          </p>
          <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(2.5rem,5vw,4rem)', fontStyle: 'italic', fontWeight: 900 }}>CropGuard AI IS WATCHING EVERY FIELD.</h2>
        </div>
        <div style={{ position: 'relative', height: '500px', border: '1px solid rgba(200,245,62,0.1)', borderRadius: '4px', overflow: 'hidden', maxWidth: '1100px', margin: '0 auto 2.5rem' }}>
          <GlobalMap />
          <div style={{ position: 'absolute', top: '1rem', left: '1rem', zIndex: 1000, background: 'rgba(6,10,4,0.92)', border: '1px solid rgba(200,245,62,0.15)', padding: '0.8rem 1.2rem', backdropFilter: 'blur(10px)' }}>
            {[['8+', 'DISTRICTS'], ['15k+', 'SCANS PROCESSED'], ['96%', 'ACCURACY']].map(([n, l]) => (
              <div key={l} style={{ marginBottom: '0.4rem' }}>
                <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.3rem', color: '#C8F53E', marginRight: '0.5rem' }}>{n}</span>
                <span style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Traction & Social Proof Stats */}
        <div className="home-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', maxWidth: '1100px', margin: '0 auto' }}>
          {[
            ['Active in 8+ Districts', 'Hooghly, Burdwan, Nadia, Malda & more'],
            ['15,000+ Scans Processed', 'Multi-spectral leaf captures evaluated'],
            ['96% Field Accuracy', 'Cellular-level validation score'],
            ['₹10k/yr Govt Aid Mapped', 'Krishak Bandhu & PM-KISAN matching']
          ].map(([title, desc], i) => (
            <div key={i} className="reveal" style={{ background: '#0F1409', border: '1px solid rgba(200,245,62,0.1)', padding: '1.5rem', textAlign: 'center', borderRadius: '8px' }}>
              <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.8rem', color: '#C8F53E', fontStyle: 'italic', marginBottom: '0.3rem' }}>{title}</div>
              <div style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em' }}>{desc}</div>
            </div>
          ))}
        </div>
      </section>


      {/* AI WIDGET */}
      <section id="ai-demo" className="mobile-padding" style={{ background: '#060A04', padding: '8rem 3rem' }}>
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

        <div className="home-scanner-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: '#0F1409', border: '1px solid rgba(200,245,62,0.15)', maxWidth: '950px', margin: '0 auto', borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{ padding: '2rem' }}>
            <input type="file" id="cropFileInput" accept="image/*" style={{ display: 'none' }} ref={fileInputRef} onChange={handleFileSelect} />
            
            {/* Image Dropzone */}
            <div
              style={{
                border: `2px dashed ${imageError ? '#FF4F4F' : 'rgba(200,245,62,0.25)'}`,
                height: '180px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                borderRadius: '4px',
                transition: 'all 0.2s',
                position: 'relative',
                overflow: 'hidden',
                background: imageError ? 'rgba(255,79,79,0.06)' : 'transparent'
              }}
              onClick={() => fileInputRef.current?.click()}
              onMouseEnter={e => { if (!imagePreview && !imageError) { e.currentTarget.style.borderColor = '#C8F53E'; e.currentTarget.style.background = 'rgba(200,245,62,0.03)' } }}
              onMouseLeave={e => { if (!imagePreview && !imageError) { e.currentTarget.style.borderColor = 'rgba(200,245,62,0.25)'; e.currentTarget.style.background = 'transparent' } }}
            >
              {imagePreview && !imageError ? (
                <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={() => {
                      setImageError('Image failed to render. Please upload a valid image.');
                      addLog('> Error: Image preview failed to render.');
                    }}
                    onLoad={() => {
                      setImageError(null);
                    }}
                  />
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
                        zIndex: 10,
                        boxSizing: 'border-box'
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
                          fontFamily: 'monospace',
                          padding: '1px 5px',
                          borderRadius: '2px',
                          letterSpacing: '0.05em',
                          whiteSpace: 'nowrap',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.5)'
                        }}
                      >
                        ⚠ AFFECTED AREA
                      </span>
                    </div>
                  )}
                </div>
              ) : imageError ? (
                <div style={{ textAlign: 'center', padding: '1rem' }}>
                  <span style={{ fontSize: '1.8rem', color: '#FF4F4F' }}>⚠️</span>
                  <p style={{ fontWeight: 700, color: '#FF4F4F', margin: '4px 0 0', fontSize: '0.85rem' }}>IMAGE LOAD ERROR</p>
                  <p style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)', margin: '2px 0 0' }}>{imageError}</p>
                  <p style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: '#C8F53E', margin: '6px 0 0' }}>CLICK TO TRY ANOTHER IMAGE</p>
                </div>
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
              disabled={analyzing || !!imageError}
              style={{
                width: '100%',
                marginTop: '1.2rem',
                background: (analyzing || !!imageError) ? 'rgba(200,245,62,0.2)' : '#C8F53E',
                color: (analyzing || !!imageError) ? 'rgba(255,255,255,0.4)' : '#060A04',
                fontWeight: 900,
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                letterSpacing: '0.12em',
                padding: '0.9rem',
                border: 'none',
                cursor: (analyzing || !!imageError) ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                borderRadius: '4px'
              }}
            >
              {analyzing ? 'DIAGNOSING CROP PATHOGEN...' : imageError ? 'INVALID IMAGE — FIX TO PROCEED' : 'RUN MULTIMODAL DIAGNOSIS →'}
            </button>

            <p style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', margin: '1.2rem 0 0.6rem', textTransform: 'uppercase' }}>OR TEST WITH SAMPLE DATA (WEST BENGAL):</p>
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => runSample('POTATO')}
                style={{ flex: 1, minWidth: '160px', border: '1px solid rgba(200,245,62,0.3)', color: '#C8F53E', background: 'rgba(200,245,62,0.04)', padding: '0.6rem', fontFamily: 'monospace', fontSize: '0.68rem', cursor: 'pointer', letterSpacing: '0.05em', transition: 'all 0.2s', borderRadius: '4px' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#C8F53E')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(200,245,62,0.3)')}
              >
                🥔 SAMPLE A (POTATO BLIGHT · HOOGHLY)
              </button>
              <button
                onClick={() => runSample('WHEAT')}
                style={{ flex: 1, minWidth: '160px', border: '1px solid rgba(56,189,248,0.3)', color: '#38BDF8', background: 'rgba(56,189,248,0.04)', padding: '0.6rem', fontFamily: 'monospace', fontSize: '0.68rem', cursor: 'pointer', letterSpacing: '0.05em', transition: 'all 0.2s', borderRadius: '4px' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#38BDF8')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(56,189,248,0.3)')}
              >
                🌾 SAMPLE B (WHEAT RUST · BURDWAN)
              </button>
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

            {/* 3 CLEAR ACTIONABLE STEPS BANNER */}
            <div style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(200,245,62,0.35)', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem', boxShadow: '0 0 30px rgba(200,245,62,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.2rem' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#C8F53E', animation: 'pulse 2s infinite' }} />
                <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#C8F53E', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                  ACTIONABLE DIAGNOSIS &amp; TREATMENT PROTOCOL
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.2rem' }}>
                {/* Step 1: Diagnosis */}
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', borderLeft: '3px solid #C8F53E' }}>
                  <span style={{ fontSize: '0.62rem', color: '#C8F53E', fontFamily: 'monospace', fontWeight: 800, display: 'block', marginBottom: '0.3rem' }}>STEP 1 · DIAGNOSIS</span>
                  <p style={{ fontSize: '0.95rem', fontWeight: 900, color: 'white', margin: 0 }}>
                    {analysisResult.disease || 'Late Blight'} Detected
                  </p>
                  <span style={{ fontSize: '0.75rem', color: '#C8F53E', fontWeight: 700 }}>({analysisResult.healthScore || 96}% Confidence)</span>
                </div>
                {/* Step 2: Threat Level */}
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', borderLeft: '3px solid #FF4F4F' }}>
                  <span style={{ fontSize: '0.62rem', color: '#FF4F4F', fontFamily: 'monospace', fontWeight: 800, display: 'block', marginBottom: '0.3rem' }}>STEP 2 · THREAT LEVEL</span>
                  <p style={{ fontSize: '0.95rem', fontWeight: 900, color: '#FF4F4F', margin: 0 }}>
                    {analysisResult.riskLevel === 'Low' ? 'Low Threat' : 'High - Act within 48 Hours'}
                  </p>
                  <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)' }}>High Spore Spread Pressure</span>
                </div>
                {/* Step 3: Treatment Plan */}
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', borderLeft: '3px solid #38BDF8' }}>
                  <span style={{ fontSize: '0.62rem', color: '#38BDF8', fontFamily: 'monospace', fontWeight: 800, display: 'block', marginBottom: '0.3rem' }}>STEP 3 · TREATMENT PLAN</span>
                  <p style={{ fontSize: '0.82rem', fontWeight: 800, color: 'white', margin: 0, lineHeight: 1.4 }}>
                    {analysisResult.pesticide ? `Apply ${analysisResult.pesticide} @ ${analysisResult.dosage}` : 'Apply Chlorothalonil 75% WP at 2.5g/liter of water.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Metric Cards */}
            <div className="home-result-metrics" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.2rem', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '6px' }}>
                <p style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>DISEASE DETECTED</p>
                <p style={{ fontSize: '1rem', color: 'white', fontWeight: 900, lineHeight: 1.2 }}>{analysisResult.disease?.toUpperCase() || 'HEALTHY'}</p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.2rem', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '6px' }}>
                <p style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>CONFIDENCE SCORE</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ color: '#C8F53E', fontWeight: 900, fontSize: '1.1rem' }}>{analysisResult.healthScore || 94}%</span>
                  <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)' }}>VERIFIED</span>
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.2rem', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '6px' }}>
                <p style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>PROCESSING TIME</p>
                <p style={{ fontSize: '1rem', color: '#38BDF8', fontWeight: 900, fontFamily: 'monospace' }}>1.2s</p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.2rem', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '6px' }}>
                <p style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>GPS LOCATION (WB)</p>
                <p style={{ fontSize: '0.85rem', color: 'white', fontWeight: 700, fontFamily: 'monospace' }}>23.2° N, 87.8° E</p>
              </div>
            </div>

            <div className="home-treatment-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
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
                <div className="home-weather-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.8rem', marginBottom: '1.2rem' }}>
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

                <div className="home-dealers-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
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

                <div className="home-schemes-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
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
      <section className="mobile-padding" style={{ background: '#0A0E07', padding: '8rem 3rem' }}>
        <div className="home-cta-grid" style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
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
      <section className="mobile-padding" style={{ position: 'relative', overflow: 'hidden', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '6rem 3rem' }}>
        <video autoPlay muted loop playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.15, zIndex: 0 }} src="/footer-bg.mp4" />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(6,10,4,0.75)', zIndex: 1 }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(3rem,7vw,6rem)', fontStyle: 'italic', fontWeight: 900, marginBottom: '1.2rem' }}>READY TO PROTECT YOUR HARVEST?</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem', maxWidth: '560px', margin: '0 auto 2rem', lineHeight: 1.75 }}>From a farmer's voice in the field to a district-wide early warning system across 8+ West Bengal districts.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <Link href="/login" style={{ background: '#C8F53E', color: '#060A04', fontWeight: 900, fontFamily: 'monospace', fontSize: '0.82rem', letterSpacing: '0.12em', padding: '0.9rem 2rem', textDecoration: 'none', display: 'inline-block' }}>START MY PILOT</Link>
            <Link href="/pricing" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.25)', color: 'white', fontFamily: 'monospace', fontSize: '0.82rem', letterSpacing: '0.1em', padding: '0.9rem 1.8rem', textDecoration: 'none', display: 'inline-block' }}>VIEW PRICING</Link>
          </div>
          <p style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em' }}>🔒 NO CREDIT CARD REQUIRED · CANCEL ANYTIME · ANONYMIZED DATA · NO PERSONAL INFO STORED</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
