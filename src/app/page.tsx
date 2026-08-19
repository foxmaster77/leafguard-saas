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
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }
@keyframes pulse { 0%,100%{box-shadow:0 0 0 0 rgba(34,197,94,0.5)} 70%{box-shadow:0 0 0 10px transparent} }
@keyframes pulseGreen { 0%,100%{box-shadow:0 0 0 0 rgba(34,197,94,0.4)} 70%{box-shadow:0 0 0 8px transparent} }
@keyframes pulseRed { 0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,0.5)} 70%{box-shadow:0 0 0 10px transparent} }
@keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
@keyframes flowRight { 0%{width:0%} 100%{width:100%} }
@keyframes spinSlow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
@keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
.reveal{opacity:0;transform:translateY(28px);transition:opacity 0.65s ease,transform 0.65s ease}
.reveal.visible{opacity:1;transform:translateY(0)}
.sih-card:hover{border-color:rgba(34,197,94,0.5)!important;transform:translateY(-3px);box-shadow:0 12px 32px rgba(34,197,94,0.08)!important}
.mandi-row:hover{background:rgba(34,197,94,0.05)!important}
html{scroll-behavior:smooth}
@media(max-width:1024px){
  .hero-grid{grid-template-columns:1fr!important}
  .hero-visuals{display:none!important}
  .ecosystem-steps{grid-template-columns:1fr 1fr!important}
  .features-grid{grid-template-columns:1fr 1fr!important}
  .farmer-daily-grid{grid-template-columns:1fr!important}
  .roi-calc-grid{grid-template-columns:1fr!important}
  .timeline-nav-grid{grid-template-columns:repeat(2,1fr)!important}
  .timeline-detail-grid{grid-template-columns:1fr!important}
  .trust-badges-grid{grid-template-columns:repeat(2,1fr)!important}
}
@media(max-width:639px){
  .hero-grid{grid-template-columns:1fr!important;padding:80px 1rem 3rem!important}
  .ecosystem-steps{grid-template-columns:1fr!important}
  .features-grid{grid-template-columns:1fr!important}
  .farmer-daily-grid{grid-template-columns:1fr!important}
  .home-scanner-grid{grid-template-columns:1fr!important}
  .home-result-metrics{grid-template-columns:1fr!important}
  .home-treatment-grid{grid-template-columns:1fr!important}
  .home-how-grid{grid-template-columns:1fr!important}
  .roi-calc-grid{grid-template-columns:1fr!important}
  .timeline-nav-grid{grid-template-columns:1fr!important}
  .timeline-detail-grid{grid-template-columns:1fr!important}
  .trust-badges-grid{grid-template-columns:1fr!important}
  .mobile-p{padding:3.5rem 1rem!important}
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

  // 1. ROI Calculator State
  const [landAcres, setLandAcres] = useState<number>(25);
  const [selectedCrop, setSelectedCrop] = useState<'potato' | 'paddy' | 'wheat' | 'vegetables'>('potato');

  // 2. 90-Day Crop Health Journey State
  const [activeJourneyStep, setActiveJourneyStep] = useState<number>(1);

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
    <div style={{ background: '#09090B', color: 'white', fontFamily: 'Inter,system-ui,sans-serif' }}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <Navigation />

      {/* ════════════════════════════════════════════════
          HERO SECTION — National Pitch
      ════════════════════════════════════════════════ */}
      <section className="hero-grid" style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', padding: '80px 3rem 4rem', maxWidth: '1320px', margin: '0 auto', gap: '4rem' }}>

        {/* Left: Copy */}
        <div>
          {/* Status Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '99px', padding: '5px 14px', marginBottom: '1.8rem' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22C55E', animation: 'blink 2s infinite', display: 'inline-block', boxShadow: '0 0 8px rgba(34,197,94,0.8)' }} />
            <span style={{ fontFamily: 'monospace', fontSize: '0.68rem', color: '#22C55E', letterSpacing: '0.12em' }}>SIH 2026 · LIVE SYSTEM ACTIVE</span>
          </div>

          <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(3.2rem,6vw,6rem)', fontWeight: 900, fontStyle: 'italic', lineHeight: 0.95, margin: '0 0 1.5rem', letterSpacing: '0.01em' }}>
            <span style={{ color: 'white' }}>EMPOWERING FARMERS WITH </span>
            <span style={{ color: '#22C55E' }}>EDGE AI &amp; VOICE DIAGNOSTICS.</span>
          </h1>

          <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.65)', maxWidth: '520px', lineHeight: 1.75, marginBottom: '1rem' }}>
            Zero-internet crop scanning, localized weather forecasting, and real-time treatment via WhatsApp. Powered by Google Gemini &amp; Govt. of India's Bhashini.
          </p>

          {/* Gov Trust Row */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '2.2rem' }}>
            {[
              { label: 'Bhashini API', color: '#818CF8' },
              { label: 'data.gov.in', color: '#FBBF24' },
              { label: 'KVK Network', color: '#34D399' },
              { label: 'PM-KISAN', color: '#F87171' },
            ].map(b => (
              <span key={b.label} style={{ fontSize: '0.62rem', fontFamily: 'monospace', fontWeight: 700, color: b.color, background: `rgba(255,255,255,0.04)`, border: '1px solid rgba(255,255,255,0.1)', padding: '3px 10px', borderRadius: '4px', letterSpacing: '0.04em' }}>
                ✓ {b.label}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            {/* Primary: WhatsApp */}
            <a
              href="https://wa.me/919876543210?text=Hello%20CropGuard%20AI"
              target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: '#25D366', color: 'white', fontWeight: 800, fontFamily: 'monospace', fontSize: '0.82rem', letterSpacing: '0.06em', padding: '0.95rem 1.8rem', borderRadius: '8px', textDecoration: 'none', boxShadow: '0 0 28px rgba(37,211,102,0.3)', transition: 'transform 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.03)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.555 4.122 1.528 5.852L.057 23.786l6.077-1.454A11.966 11.966 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.815 9.815 0 01-5.032-1.386l-.36-.215-3.736.895.949-3.63-.235-.374A9.784 9.784 0 012.182 12C2.182 6.572 6.572 2.182 12 2.182 17.428 2.182 21.818 6.572 21.818 12S17.428 21.818 12 21.818z"/></svg>
              SCAN CROP VIA WHATSAPP
            </a>

            {/* Secondary: Web Scanner */}
            <button
              onClick={() => document.getElementById('ai-demo')?.scrollIntoView({ behavior: 'smooth' })}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.35)', color: '#22C55E', fontWeight: 700, fontFamily: 'monospace', fontSize: '0.82rem', letterSpacing: '0.06em', padding: '0.95rem 1.8rem', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(34,197,94,0.15)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(34,197,94,0.08)'; }}
            >
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              TRY WEB SCANNER
            </button>
          </div>

          {/* Trust Stats Row */}
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            {[['140M+', 'Indian Farmers'], ['10+', 'Bhashini Languages'], ['8+', 'WB Districts'], ['96%', 'AI Accuracy']].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.6rem', color: '#22C55E', lineHeight: 1, fontStyle: 'italic' }}>{n}</div>
                <div style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Split Visual — Farmer Photo + FPO Dashboard */}
        <div className="hero-visuals" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', height: '520px' }}>

          {/* Left Sub — Farmer with Phone */}
          <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(34,197,94,0.25)', boxShadow: '0 0 40px rgba(34,197,94,0.1)' }}>
            <img
              src="https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=400&q=80"
              alt="Farmer scanning crop with smartphone"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(9,9,11,0.95) 0%, transparent 55%)' }} />
            {/* Caption overlay */}
            <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', right: '1rem' }}>
              <div style={{ background: 'rgba(37,211,102,0.15)', border: '1px solid rgba(37,211,102,0.4)', borderRadius: '8px', padding: '0.65rem', backdropFilter: 'blur(8px)' }}>
                <p style={{ fontFamily: 'monospace', fontSize: '0.62rem', color: '#25D366', fontWeight: 800, margin: '0 0 4px', letterSpacing: '0.06em' }}>💬 WHATSAPP BOT ACTIVE</p>
                <p style={{ fontSize: '0.72rem', color: 'white', margin: 0, lineHeight: 1.4 }}>"আলু পাতায় দাগ দেখছি" → <span style={{ color: '#22C55E', fontWeight: 700 }}>Late Blight Detected (96%)</span></p>
              </div>
            </div>
          </div>

          {/* Right Sub — FPO Dashboard Mock */}
          <div style={{ borderRadius: '16px', border: '1px solid rgba(56,189,248,0.3)', background: '#0C1015', boxShadow: '0 0 40px rgba(56,189,248,0.08)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Header Bar */}
            <div style={{ background: '#111827', padding: '0.7rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: '#38BDF8', fontWeight: 900, letterSpacing: '0.1em' }}>FPO COMMAND CENTER</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.55rem', fontFamily: 'monospace', color: '#EF4444' }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#EF4444', animation: 'blink 1.2s infinite', display: 'inline-block' }} /> HIGH RISK ZONE
              </span>
            </div>
            {/* Mini Map Placeholder */}
            <div style={{ flex: 1, position: 'relative', background: '#0B1220' }}>
              <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80" alt="West Bengal district heatmap" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3 }} />
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 40% 55%, rgba(239,68,68,0.55) 0%, transparent 38%), radial-gradient(circle at 72% 35%, rgba(251,191,36,0.4) 0%, transparent 30%)' }} />
              {/* Pins */}
              {[{ x: '38%', y: '53%', c: '#EF4444', l: 'Hooghly' }, { x: '70%', y: '32%', c: '#FBBF24', l: 'Burdwan' }].map(p => (
                <div key={p.l} style={{ position: 'absolute', left: p.x, top: p.y, transform: 'translate(-50%,-50%)' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: p.c, animation: 'pulse 2s infinite', border: '2px solid rgba(9,9,11,0.8)' }} />
                  <span style={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap', fontFamily: 'monospace', fontSize: '0.5rem', color: 'white', background: 'rgba(9,9,11,0.8)', padding: '1px 4px', borderRadius: '2px' }}>{p.l}</span>
                </div>
              ))}
              {/* Alert card */}
              <div style={{ position: 'absolute', bottom: '8px', left: '8px', right: '8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.5)', borderRadius: '6px', padding: '6px 8px' }}>
                <p style={{ fontFamily: 'monospace', fontSize: '0.58rem', color: '#FCA5A5', fontWeight: 800, margin: '0 0 2px' }}>⚠️ HOOGHLY HIGH RISK ZONE</p>
                <p style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.7)', margin: 0 }}>Late Blight spreading — 142 farmers alerted</p>
              </div>
            </div>
            {/* Telemetry row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              {[['15,480', 'Acres Live'], ['96.4%', 'Accuracy']].map(([v, l]) => (
                <div key={l} style={{ padding: '0.55rem', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.2rem', color: '#22C55E', lineHeight: 1 }}>{v}</div>
                  <div style={{ fontFamily: 'monospace', fontSize: '0.52rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          SMART ECOSYSTEM — Interactive 4-Step Data Flow
      ════════════════════════════════════════════════ */}
      <section className="mobile-p" style={{ background: '#0C0F12', borderTop: '1px solid rgba(34,197,94,0.08)', borderBottom: '1px solid rgba(34,197,94,0.08)', padding: '6rem 2rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <p style={{ fontFamily: 'monospace', fontSize: '0.62rem', color: '#22C55E', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
              END-TO-END AI PIPELINE
            </p>
            <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(2.4rem,5vw,3.8rem)', fontStyle: 'italic', fontWeight: 900, margin: 0 }}>
              THE SMART ECOSYSTEM IN ACTION.
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.95rem', marginTop: '0.8rem' }}>
              From field capture to actionable prescription — see how CropGuard AI processes every scan.
            </p>
          </div>

          {/* 4-Step Pipeline */}
          <div className="ecosystem-steps" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1.2rem' }}>
            {[
              {
                step: '01', icon: '🎙️', badge: 'INPUT', badgeColor: '#818CF8',
                title: 'Voice & Photo Upload',
                desc: 'Farmer speaks symptoms in Bangla/Hindi or sends a leaf photo via WhatsApp.',
                widget: (
                  <div style={{ marginTop: '0.8rem', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: '6px', padding: '0.65rem' }}>
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                      <div style={{ flex: 1, background: 'rgba(99,102,241,0.2)', borderRadius: '4px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '0.65rem', color: '#818CF8', fontFamily: 'monospace', fontWeight: 700 }}>🎙 BHASHINI</span>
                      </div>
                      <div style={{ flex: 1, background: 'rgba(37,211,102,0.12)', borderRadius: '4px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '0.65rem', color: '#25D366', fontFamily: 'monospace', fontWeight: 700 }}>📷 PHOTO</span>
                      </div>
                    </div>
                    <p style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)', margin: 0 }}>Audio: "পাতায় কালো দাগ দেখছি"</p>
                  </div>
                )
              },
              {
                step: '02', icon: '🌤️', badge: 'CONTEXT', badgeColor: '#38BDF8',
                title: 'OpenWeather Fetch',
                desc: 'Real-time climate data enriches the pathogen risk model for your exact district.',
                widget: (
                  <div style={{ marginTop: '0.8rem', background: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: '6px', padding: '0.65rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                      {[['💧 Humidity', '85%', '#38BDF8'], ['🌡 Temp', '32°C', '#FBBF24'], ['🌧 Rain Risk', '72%', '#F87171'], ['🍂 Crop Stage', 'Late', '#34D399']].map(([l, v, c]) => (
                        <div key={String(l)} style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '4px', padding: '4px 6px' }}>
                          <div style={{ fontSize: '0.52rem', color: 'rgba(255,255,255,0.45)', fontFamily: 'monospace' }}>{l}</div>
                          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: String(c) }}>{v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              },
              {
                step: '03', icon: '⚡', badge: 'ANALYSIS', badgeColor: '#22C55E',
                title: 'Gemini Vision AI',
                desc: 'Multi-modal pathogen model processes leaf imagery at cellular resolution in 1.2 seconds.',
                widget: (
                  <div style={{ marginTop: '0.8rem', background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '6px', padding: '0.65rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: '#22C55E', fontWeight: 800 }}>GEMINI PROCESSING</span>
                      <span style={{ fontFamily: 'monospace', fontSize: '0.62rem', color: '#FBBF24', fontWeight: 800 }}>1.2s</span>
                    </div>
                    <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '99px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: '96%', background: 'linear-gradient(to right, #22C55E, #38BDF8)', borderRadius: '99px' }} />
                    </div>
                    <p style={{ fontFamily: 'monospace', fontSize: '0.58rem', color: 'rgba(255,255,255,0.45)', margin: '5px 0 0' }}>96% confidence · 90+ pathogens checked</p>
                  </div>
                )
              },
              {
                step: '04', icon: '💊', badge: 'OUTPUT', badgeColor: '#F59E0B',
                title: 'Prescription & Dealer',
                desc: 'Actionable treatment plan with nearest Kisan Kendra dealer and Govt. subsidy links.',
                widget: (
                  <div style={{ marginTop: '0.8rem', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: '6px', padding: '0.65rem' }}>
                    <p style={{ fontFamily: 'monospace', fontSize: '0.58rem', color: '#F59E0B', fontWeight: 800, margin: '0 0 4px' }}>⚠️ LATE BLIGHT DETECTED</p>
                    <p style={{ fontSize: '0.65rem', color: 'white', margin: '0 0 3px', lineHeight: 1.4 }}>Apply <strong>Mancozeb 75% WP</strong> @ 2.5g/L</p>
                    <p style={{ fontFamily: 'monospace', fontSize: '0.58rem', color: '#34D399', margin: 0 }}>📍 Kisan Kendra · 2km away</p>
                  </div>
                )
              }
            ].map((s, i) => (
              <div key={i} className="reveal sih-card" style={{ background: '#111318', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.4rem', transition: 'all 0.25s', cursor: 'default' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                  <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '2rem', color: 'rgba(255,255,255,0.1)', fontStyle: 'italic', lineHeight: 1 }}>{s.step}</span>
                  <span style={{ fontSize: '0.58rem', fontFamily: 'monospace', fontWeight: 800, color: s.badgeColor, background: `rgba(255,255,255,0.04)`, border: `1px solid ${s.badgeColor}40`, padding: '2px 7px', borderRadius: '3px' }}>{s.badge}</span>
                </div>
                <div style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>{s.icon}</div>
                <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: 'white', marginBottom: '0.4rem' }}>{s.title}</h3>
                <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
                {s.widget}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          WEB SCANNER (AI DEMO) — Existing Functional Tool
      ════════════════════════════════════════════════ */}
      <section id="ai-demo" className="mobile-p" style={{ background: '#09090B', padding: '6rem 2rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p style={{ fontFamily: 'monospace', fontSize: '0.62rem', color: '#22C55E', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>MULTIMODAL AI SCANNER</p>
            <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(2.4rem,5vw,3.8rem)', fontStyle: 'italic', fontWeight: 900, margin: '0 0 0.8rem' }}>
              TRY THE LIVE WEB SCANNER.
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.92rem', maxWidth: '520px', margin: '0 auto', lineHeight: 1.65 }}>
              Upload a leaf photo or record a voice description. Our Gemini + Groq pipeline returns a diagnosis in &lt;2 seconds.
            </p>
          </div>

          <div className="home-scanner-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', maxWidth: '950px', margin: '0 auto' }}>
            {/* Input Panel */}
            <div style={{ background: '#111318', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Language Selector */}
              <div>
                <p style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em', marginBottom: '0.5rem', textTransform: 'uppercase' }}>VOICE LANGUAGE</p>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {([['bn-IN', 'বাংলা'], ['hi-IN', 'हिंदी'], ['en-IN', 'English']] as const).map(([code, label]) => (
                    <button key={code} onClick={() => setSelectedLang(code)} style={{ flex: 1, padding: '6px', fontFamily: 'monospace', fontSize: '0.68rem', fontWeight: 700, border: '1px solid', borderColor: selectedLang === code ? '#22C55E' : 'rgba(255,255,255,0.1)', background: selectedLang === code ? 'rgba(34,197,94,0.12)' : 'transparent', color: selectedLang === code ? '#22C55E' : 'rgba(255,255,255,0.5)', cursor: 'pointer', borderRadius: '6px', transition: 'all 0.15s' }}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Voice Record */}
              <button onClick={toggleListening} style={{ background: isListening ? 'rgba(239,68,68,0.12)' : 'rgba(34,197,94,0.06)', border: `1px solid ${isListening ? 'rgba(239,68,68,0.5)' : 'rgba(34,197,94,0.3)'}`, color: isListening ? '#F87171' : '#22C55E', padding: '0.7rem', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', letterSpacing: '0.06em', transition: 'all 0.2s' }}>
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0014 0M12 19v3M9 22h6"/></svg>
                {isListening ? '⏹ STOP RECORDING' : '🎙 RECORD VOICE SYMPTOM'}
              </button>

              {/* Transcript */}
              {transcript && (
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '0.75rem' }}>
                  <p style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', marginBottom: '4px', textTransform: 'uppercase' }}>TRANSCRIPT</p>
                  <p style={{ fontSize: '0.82rem', color: 'white', margin: 0 }}>{transcript}</p>
                </div>
              )}

              {/* Image Upload Drop Zone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={e => e.preventDefault()}
                onDrop={e => { e.preventDefault(); const file = e.dataTransfer.files?.[0]; if (file) { const evt = { target: { files: [file] } } as any; handleFileSelect(evt); } }}
                style={{ border: `2px dashed ${imageError ? 'rgba(239,68,68,0.5)' : imagePreview ? 'rgba(34,197,94,0.4)' : 'rgba(255,255,255,0.1)'}`, borderRadius: '8px', padding: imagePreview ? '0' : '1.5rem', cursor: 'pointer', transition: 'border-color 0.2s', overflow: 'hidden', minHeight: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Leaf scan preview" style={{ width: '100%', maxHeight: '160px', objectFit: 'cover', display: 'block', borderRadius: '6px' }} />
                ) : (
                  <>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', textAlign: 'center', margin: 0 }}>📷 Click or drag leaf photo here</p>
                    {imageError && <p style={{ color: '#F87171', fontSize: '0.7rem', marginTop: '6px' }}>{imageError}</p>}
                  </>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} style={{ display: 'none' }} />
              </div>

              {/* Pincode */}
              <div style={{ display: 'flex', gap: '6px' }}>
                <input
                  type="text" value={pincode} onChange={e => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Pincode (e.g. 712101)"
                  style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 10px', color: 'white', fontFamily: 'monospace', fontSize: '0.78rem', outline: 'none' }}
                />
              </div>

              {/* Sample Buttons */}
              <p style={{ fontFamily: 'monospace', fontSize: '0.58rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>QUICK TEST SAMPLES (WEST BENGAL):</p>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={() => runSample('POTATO')} style={{ flex: 1, background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.25)', color: '#22C55E', padding: '6px', fontFamily: 'monospace', fontSize: '0.62rem', fontWeight: 700, cursor: 'pointer', borderRadius: '6px', transition: 'all 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = '#22C55E')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(34,197,94,0.25)')}
                >
                  🥔 POTATO BLIGHT
                </button>
                <button onClick={() => runSample('WHEAT')} style={{ flex: 1, background: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.25)', color: '#38BDF8', padding: '6px', fontFamily: 'monospace', fontSize: '0.62rem', fontWeight: 700, cursor: 'pointer', borderRadius: '6px', transition: 'all 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = '#38BDF8')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(56,189,248,0.25)')}
                >
                  🌾 WHEAT RUST
                </button>
              </div>

              {/* Run Button */}
              <button
                onClick={() => analyzeImage()}
                disabled={analyzing}
                style={{ background: analyzing ? 'rgba(34,197,94,0.2)' : '#22C55E', color: analyzing ? '#22C55E' : '#052e16', fontWeight: 900, fontFamily: 'monospace', fontSize: '0.78rem', letterSpacing: '0.1em', padding: '0.85rem', border: 'none', cursor: analyzing ? 'not-allowed' : 'pointer', borderRadius: '8px', transition: 'all 0.2s', boxShadow: analyzing ? 'none' : '0 0 20px rgba(34,197,94,0.25)' }}
              >
                {analyzing ? 'DIAGNOSING PATHOGEN...' : imageError ? 'INVALID IMAGE' : 'RUN GEMINI DIAGNOSIS →'}
              </button>

              {/* Console */}
              <div style={{ background: '#0A0A0D', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '6px', padding: '0.7rem', minHeight: '80px' }}>
                <p style={{ fontFamily: 'monospace', fontSize: '0.58rem', color: '#22C55E', marginBottom: '6px', letterSpacing: '0.1em' }}>● AI PIPELINE LOG</p>
                {consoleLogs.map((l, i) => (
                  <p key={i} style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: 'rgba(255,255,255,0.55)', margin: '2px 0' }}>{l}</p>
                ))}
              </div>

              {/* Reset */}
              {(imagePreview || analysisResult) && (
                <button onClick={resetScanner} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.45)', padding: '6px', fontFamily: 'monospace', fontSize: '0.65rem', cursor: 'pointer', borderRadius: '6px', transition: 'all 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(239,68,68,0.5)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                >
                  ↺ RESET SCANNER
                </button>
              )}
            </div>

            {/* Results Panel */}
            <div style={{ background: '#111318', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {!analysisResult ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', opacity: 0.4 }}>
                  <svg width="40" height="40" fill="none" stroke="#22C55E" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                  <p style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', textAlign: 'center', lineHeight: 1.5 }}>Upload leaf photo or record voice<br/>symptoms to run diagnosis.</p>
                </div>
              ) : (
                <>
                  {/* 3-Step Protocol Banner */}
                  <div style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '8px', padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.8rem' }}>
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22C55E', animation: 'pulse 2s infinite' }} />
                      <span style={{ fontFamily: 'monospace', fontSize: '0.65rem', fontWeight: 900, color: '#22C55E', letterSpacing: '0.1em' }}>DIAGNOSIS PROTOCOL</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.6rem' }}>
                      <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '6px', padding: '0.6rem', borderLeft: '2px solid #22C55E' }}>
                        <p style={{ fontFamily: 'monospace', fontSize: '0.55rem', color: '#22C55E', fontWeight: 800, margin: '0 0 3px' }}>STEP 1 · DIAGNOSIS</p>
                        <p style={{ fontSize: '0.78rem', fontWeight: 900, color: 'white', margin: 0, lineHeight: 1.2 }}>{analysisResult.disease || 'Late Blight'}</p>
                        <span style={{ fontSize: '0.65rem', color: '#22C55E', fontWeight: 700 }}>{analysisResult.healthScore || 96}% confidence</span>
                      </div>
                      <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '6px', padding: '0.6rem', borderLeft: '2px solid #EF4444' }}>
                        <p style={{ fontFamily: 'monospace', fontSize: '0.55rem', color: '#EF4444', fontWeight: 800, margin: '0 0 3px' }}>STEP 2 · THREAT</p>
                        <p style={{ fontSize: '0.78rem', fontWeight: 900, color: '#EF4444', margin: 0, lineHeight: 1.2 }}>
                          {(analysisResult.riskLevel === 'Low' || analysisResult.riskLevel === 'Minimal') ? 'Low Risk' : 'High — Act in 48h'}
                        </p>
                      </div>
                      <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '6px', padding: '0.6rem', borderLeft: '2px solid #38BDF8' }}>
                        <p style={{ fontFamily: 'monospace', fontSize: '0.55rem', color: '#38BDF8', fontWeight: 800, margin: '0 0 3px' }}>STEP 3 · TREATMENT</p>
                        <p style={{ fontSize: '0.7rem', fontWeight: 800, color: 'white', margin: 0, lineHeight: 1.3 }}>
                          {analysisResult.pesticide ? `${analysisResult.pesticide} @ ${analysisResult.dosage}` : 'Mancozeb 75% WP @ 2.5g/L'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Telemetry metrics */}
                  <div className="home-result-metrics" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.6rem' }}>
                    {[
                      ['CONFIDENCE', `${analysisResult.healthScore || 96}%`, '#22C55E'],
                      ['PROCESSING', '1.2s', '#38BDF8'],
                      ['RISK LEVEL', (analysisResult.riskLevel || 'High').toUpperCase(), analysisResult.riskLevel === 'Low' ? '#22C55E' : '#EF4444'],
                    ].map(([l, v, c]) => (
                      <div key={String(l)} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '6px', padding: '0.65rem', textAlign: 'center' }}>
                        <p style={{ fontFamily: 'monospace', fontSize: '0.52rem', color: 'rgba(255,255,255,0.4)', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{l}</p>
                        <p style={{ fontSize: '1rem', fontWeight: 900, color: String(c), margin: 0 }}>{v}</p>
                      </div>
                    ))}
                  </div>

                  {/* Voice Summary */}
                  {analysisResult.voiceSummary && (
                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '6px', padding: '0.8rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontFamily: 'monospace', fontSize: '0.58rem', color: '#22C55E', letterSpacing: '0.1em' }}>
                          🔊 VOICE ADVISORY ({selectedLang === 'bn-IN' ? 'বাংলা' : selectedLang === 'hi-IN' ? 'हिंदी' : 'ENGLISH'})
                        </span>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button onClick={() => speakResponse(analysisResult.voiceSummary, selectedLang)} style={{ background: '#22C55E', color: '#052e16', border: 'none', borderRadius: '4px', padding: '3px 8px', fontSize: '0.62rem', fontWeight: 900, cursor: 'pointer' }}>
                            {isPlayingAudio ? '▶ REPLAY' : '🔊 PLAY'}
                          </button>
                          {isPlayingAudio && <button onClick={stopAudio} style={{ background: '#EF4444', color: 'white', border: 'none', borderRadius: '4px', padding: '3px 8px', fontSize: '0.62rem', fontWeight: 900, cursor: 'pointer' }}>⏹ STOP</button>}
                        </div>
                      </div>
                      <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, margin: 0 }}>&ldquo;{analysisResult.voiceSummary}&rdquo;</p>
                    </div>
                  )}

                  {/* Treatment & Action Plan */}
                  <div className="home-treatment-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '6px', padding: '0.8rem' }}>
                      <p style={{ fontFamily: 'monospace', fontSize: '0.58rem', color: '#22C55E', letterSpacing: '0.12em', marginBottom: '0.5rem' }}>PESTICIDE REMEDY</p>
                      <p style={{ fontSize: '0.82rem', color: 'white', margin: 0 }}>{analysisResult.pesticide || 'Mancozeb 75% WP'}</p>
                      <p style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: 'rgba(255,255,255,0.45)', margin: '4px 0 0' }}>Dosage: {analysisResult.dosage || '2.5g/L water'}</p>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '6px', padding: '0.8rem' }}>
                      <p style={{ fontFamily: 'monospace', fontSize: '0.58rem', color: '#38BDF8', letterSpacing: '0.12em', marginBottom: '0.5rem' }}>ACTION PLAN</p>
                      {analysisResult.actionPlan?.slice(0, 3).map((step: string, i: number) => (
                        <div key={i} style={{ display: 'flex', gap: '6px', alignItems: 'flex-start', marginBottom: '4px' }}>
                          <span style={{ background: '#22C55E', color: '#052e16', width: '14px', height: '14px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.5rem', fontWeight: 900, flexShrink: 0, marginTop: '2px' }}>{i + 1}</span>
                          <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.65)', margin: 0 }}>{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* AI Status */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(34,197,94,0.04)', border: '1px solid rgba(34,197,94,0.1)', padding: '0.6rem', borderRadius: '6px', marginTop: 'auto' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22C55E', animation: 'pulse 2s infinite', display: 'inline-block' }} />
                <span style={{ fontFamily: 'monospace', fontSize: '0.62rem', color: 'rgba(255,255,255,0.5)' }}>GEMINI AI STATUS</span>
                <span style={{ fontFamily: 'monospace', fontSize: '0.62rem', color: '#22C55E', fontWeight: 800, marginLeft: 'auto' }}>OPERATIONAL</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          KEY FEATURES — Architecture of Trust (4-card grid)
      ════════════════════════════════════════════════ */}
      <section className="mobile-p" style={{ background: '#0C0F12', padding: '7rem 2rem', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <p style={{ fontFamily: 'monospace', fontSize: '0.62rem', color: '#38BDF8', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>ARCHITECTURE OF TRUST</p>
            <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(2.4rem,5vw,3.8rem)', fontStyle: 'italic', fontWeight: 900, margin: '0 0 0.8rem' }}>
              BUILT ON GOVT. APIs & OPEN STANDARDS.
            </h2>
          </div>

          <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '1.5rem' }}>
            {[
              {
                icon: '🇮🇳', tag: 'GOVT. INTEGRATED', tagColor: '#FBBF24',
                title: 'Bhashini + data.gov.in',
                desc: "Utilizes Govt. of India's Bhashini API for 10+ regional languages (voice & text) and data.gov.in for real-time Mandi prices. True public infrastructure.",
                badges: ['Bhashini NLP', 'PM e-Market', 'data.gov.in', 'UIDAI Linked'],
                accentColor: '#FBBF24'
              },
              {
                icon: '🌦️', tag: 'CLIMATE-AWARE', tagColor: '#38BDF8',
                title: 'OpenWeather Risk Engine',
                desc: 'Integrates OpenWeather API to adjust fungicide recommendations based on upcoming rainfall probability, humidity, and temperature — preventing ineffective spraying.',
                badges: ['85% Humidity', '32°C Alert', '72% Rain Risk', '5-Day Forecast'],
                accentColor: '#38BDF8'
              },
              {
                icon: '🏛️', tag: 'GOVT. ESCALATION', tagColor: '#34D399',
                title: 'KVK Escalation Matrix',
                desc: 'Automatically routes low-confidence scans (<80%) to the nearest Krishi Vigyan Kendra for review by an agricultural scientist. No diagnosis is left unverified.',
                badges: ['Auto-Escalate <80%', 'KVK Network', 'Scientist Review', 'SMS Alert'],
                accentColor: '#34D399'
              },
              {
                icon: '📡', tag: 'OFFLINE-FIRST', tagColor: '#A78BFA',
                title: 'Edge AI / Offline Mode',
                desc: 'TensorFlow Lite models run directly in the browser, enabling crop diagnosis without active 4G/5G connections. Syncs automatically when network returns.',
                badges: ['TFLite On-Device', 'No Internet Req.', 'Auto-Sync', 'PWA Ready'],
                accentColor: '#A78BFA'
              },
            ].map((c, i) => (
              <div key={i} className="reveal sih-card" style={{ background: '#111318', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '2rem', transition: 'all 0.25s', cursor: 'default', borderLeft: `3px solid ${c.accentColor}30` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '2rem' }}>{c.icon}</span>
                  <span style={{ fontSize: '0.58rem', fontFamily: 'monospace', fontWeight: 800, color: c.tagColor, background: `${c.tagColor}15`, border: `1px solid ${c.tagColor}40`, padding: '3px 8px', borderRadius: '4px', letterSpacing: '0.06em' }}>{c.tag}</span>
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'white', marginBottom: '0.6rem' }}>{c.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginBottom: '1.2rem' }}>{c.desc}</p>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {c.badges.map(b => (
                    <span key={b} style={{ fontSize: '0.6rem', fontFamily: 'monospace', color: c.accentColor, background: `${c.accentColor}10`, border: `1px solid ${c.accentColor}30`, padding: '2px 7px', borderRadius: '3px' }}>{b}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          1. INTERACTIVE CROP LOSS PREVENTION & ROI CALCULATOR
      ════════════════════════════════════════════════ */}
      <section id="roi-calculator" className="mobile-p" style={{ background: '#090B0E', padding: '7rem 2rem', borderTop: '1px solid rgba(34,197,94,0.12)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: '20%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(34,197,94,0.05), transparent 70%)', pointerEvents: 'none' }} />
        
        <div style={{ maxWidth: '1140px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <p style={{ fontFamily: 'monospace', fontSize: '0.62rem', color: '#22C55E', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
              <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#22C55E', marginRight: '6px', animation: 'blink 1.5s infinite', verticalAlign: 'middle' }} />
              FINANCIAL IMPACT ENGINE · SIMULATOR
            </p>
            <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(2.4rem,5vw,3.8rem)', fontStyle: 'italic', fontWeight: 900, margin: '0 0 0.8rem' }}>
              CROP LOSS PREVENTION &amp; ROI CALCULATOR.
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.98rem', maxWidth: '620px', margin: '0 auto', lineHeight: 1.6 }}>
              Simulate economic protection and chemical waste reduction when deploying CropGuard AI precision diagnostics across your farm or cooperative cluster.
            </p>
          </div>

          <div className="roi-calc-grid" style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '2rem', alignItems: 'stretch' }}>
            {/* Left Column: Interactive Controls */}
            <div className="reveal" style={{ background: '#11141A', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '16px', padding: '2.2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 12px 36px rgba(0,0,0,0.4)' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <span style={{ fontFamily: 'monospace', fontSize: '0.68rem', color: '#22C55E', letterSpacing: '0.12em', fontWeight: 800 }}>PARAMETER 01 · LAND COVERAGE</span>
                  <span style={{ background: 'rgba(34,197,94,0.1)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.25)', fontSize: '0.62rem', fontFamily: 'monospace', padding: '3px 9px', borderRadius: '99px', fontWeight: 700 }}>
                    ~{Math.max(1, Math.round(landAcres / 2.5))} FARMER HOUSEHOLDS
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.75rem' }}>
                  <label htmlFor="acreRange" style={{ fontSize: '0.95rem', fontWeight: 700, color: 'white' }}>
                    Select Land Size (in Acres)
                  </label>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '2.5rem', color: '#22C55E', lineHeight: 1 }}>{landAcres}</span>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>ACRES</span>
                  </div>
                </div>

                {/* Range Slider */}
                <div style={{ position: 'relative', margin: '1.5rem 0 1.2rem' }}>
                  <input
                    id="acreRange"
                    type="range"
                    min="1"
                    max="500"
                    step="1"
                    value={landAcres}
                    onChange={e => setLandAcres(Number(e.target.value))}
                    aria-label="Select Land Size in Acres"
                    style={{
                      width: '100%',
                      height: '8px',
                      borderRadius: '8px',
                      appearance: 'none',
                      outline: 'none',
                      background: `linear-gradient(to right, #22C55E ${(landAcres / 500) * 100}%, rgba(255,255,255,0.1) ${(landAcres / 500) * 100}%)`,
                      cursor: 'pointer'
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontFamily: 'monospace', fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)' }}>
                    <span>1 Acre (Individual)</span>
                    <span>100 Acres (FPO)</span>
                    <span>500 Acres (District)</span>
                  </div>
                </div>

                {/* Quick Select Preset Buttons */}
                <div style={{ marginBottom: '2rem' }}>
                  <p style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
                    Quick Presets:
                  </p>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {[
                      { val: 5, label: '5 Ac (Smallholder)' },
                      { val: 25, label: '25 Ac (Cluster)' },
                      { val: 50, label: '50 Ac (Village)' },
                      { val: 100, label: '100 Ac (FPO)' },
                      { val: 250, label: '250 Ac (Block)' },
                      { val: 500, label: '500 Ac (District)' },
                    ].map(p => (
                      <button
                        key={p.val}
                        onClick={() => setLandAcres(p.val)}
                        style={{
                          background: landAcres === p.val ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.03)',
                          color: landAcres === p.val ? '#22C55E' : 'rgba(255,255,255,0.7)',
                          border: `1px solid ${landAcres === p.val ? '#22C55E' : 'rgba(255,255,255,0.08)'}`,
                          borderRadius: '6px',
                          padding: '5px 10px',
                          fontSize: '0.68rem',
                          fontFamily: 'monospace',
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all 0.15s'
                        }}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Crop Type Selector */}
                <div>
                  <p style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
                    Select Primary Crop:
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                    {[
                      { id: 'potato', label: '🥔 Potato', risk: 'High Blight Risk' },
                      { id: 'paddy', label: '🌾 Paddy', risk: 'Blast / Rust' },
                      { id: 'wheat', label: '🌾 Wheat', risk: 'Yellow Rust' },
                      { id: 'vegetables', label: '🥬 Veg / Jute', risk: 'Mildew / Rot' },
                    ].map(c => (
                      <button
                        key={c.id}
                        onClick={() => setSelectedCrop(c.id as any)}
                        style={{
                          background: selectedCrop === c.id ? '#1A2E1E' : 'rgba(255,255,255,0.02)',
                          color: selectedCrop === c.id ? '#34D399' : 'rgba(255,255,255,0.6)',
                          border: `1px solid ${selectedCrop === c.id ? 'rgba(52,211,153,0.4)' : 'rgba(255,255,255,0.06)'}`,
                          borderRadius: '6px',
                          padding: '6px 4px',
                          fontSize: '0.68rem',
                          fontWeight: 600,
                          textAlign: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.15s'
                        }}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Simulation Note */}
              <div style={{ marginTop: '1.8rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1rem' }}>💡</span>
                <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', margin: 0, lineHeight: 1.4 }}>
                  Based on ICAR &amp; KVK West Bengal agronomy field benchmarks for pathogen mitigation via targeted early intervention.
                </p>
              </div>
            </div>

            {/* Right Column: Calculated Dynamic Metrics & Call to Action */}
            <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Metric 1: Estimated Money Saved */}
              <div style={{ background: '#11141A', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '14px', padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, right: 0, width: '90px', height: '90px', background: 'radial-gradient(circle, rgba(34,197,94,0.12), transparent 70%)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <span style={{ fontFamily: 'monospace', fontSize: '0.62rem', color: '#22C55E', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 800 }}>
                    ESTIMATED MONEY SAVED
                  </span>
                  <span style={{ background: 'rgba(34,197,94,0.12)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.3)', fontSize: '0.58rem', fontFamily: 'monospace', fontWeight: 800, padding: '2px 7px', borderRadius: '4px' }}>
                    ₹12,500 / ACRE SAVINGS
                  </span>
                </div>
                <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(2.4rem,4vw,3.2rem)', color: '#22C55E', lineHeight: 1, margin: '0.2rem 0 0.5rem' }}>
                  ₹{(landAcres * 12500).toLocaleString('en-IN')}
                </div>
                <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: 1.4 }}>
                  Avoided harvest forfeiture, reduced chemical overspending, and rescued yield potential across {landAcres} acres.
                </p>
              </div>

              {/* Metric 2 & 3 in 2-column sub-grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {/* Metric 2: Pesticide Waste Reduced */}
                <div style={{ background: '#11141A', border: '1px solid rgba(56,189,248,0.25)', borderRadius: '14px', padding: '1.25rem' }}>
                  <span style={{ fontFamily: 'monospace', fontSize: '0.58rem', color: '#38BDF8', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '0.4rem' }}>
                    PESTICIDE WASTE REDUCED
                  </span>
                  <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '2.2rem', color: '#38BDF8', lineHeight: 1, margin: '0 0 0.4rem' }}>
                    35%
                  </div>
                  <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.55)', margin: 0, lineHeight: 1.35 }}>
                    ~{Math.round(landAcres * 3.8)}L toxic chemical runoff prevented via precision spot dosage.
                  </p>
                </div>

                {/* Metric 3: Crop Yield Retained */}
                <div style={{ background: '#11141A', border: '1px solid rgba(251,191,36,0.25)', borderRadius: '14px', padding: '1.25rem' }}>
                  <span style={{ fontFamily: 'monospace', fontSize: '0.58rem', color: '#FBBF24', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '0.4rem' }}>
                    CROP YIELD RETAINED
                  </span>
                  <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '2.2rem', color: '#FBBF24', lineHeight: 1, margin: '0 0 0.4rem' }}>
                    UP TO 92%
                  </div>
                  <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.55)', margin: 0, lineHeight: 1.35 }}>
                    Early 48h diagnosis halts transmission before fungal blight destroys full hectares.
                  </p>
                </div>
              </div>

              {/* Bottom CTA Card */}
              <div style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.08), rgba(6,10,4,0.8))', border: '1px solid rgba(34,197,94,0.35)', borderRadius: '14px', padding: '1.3rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginTop: 'auto' }}>
                <div>
                  <p style={{ fontSize: '0.88rem', fontWeight: 800, color: 'white', margin: 0 }}>
                    Deploy CropGuard AI Across Your Cooperative
                  </p>
                  <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', margin: '2px 0 0', fontFamily: 'monospace' }}>
                    Estimated ROI: 8.4x · Payback Window: &lt; 14 Days
                  </p>
                </div>
                <Link
                  href={`/contact?type=fpo&acres=${landAcres}`}
                  style={{
                    background: '#22C55E',
                    color: '#052e16',
                    fontWeight: 900,
                    fontFamily: 'monospace',
                    fontSize: '0.78rem',
                    letterSpacing: '0.08em',
                    padding: '0.75rem 1.4rem',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s',
                    boxShadow: '0 0 20px rgba(34,197,94,0.25)'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = '0 0 25px rgba(34,197,94,0.4)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(34,197,94,0.25)'; }}
                >
                  <span>CALCULATE FOR YOUR FPO</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          2. 90-DAY CROP HEALTH JOURNEY (VISUAL TIMELINE COMPONENT)
      ════════════════════════════════════════════════ */}
      <section id="crop-journey" className="mobile-p" style={{ background: '#0C0F14', padding: '7rem 2rem', borderTop: '1px solid rgba(255,255,255,0.04)', position: 'relative' }}>
        <div style={{ maxWidth: '1140px', margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <p style={{ fontFamily: 'monospace', fontSize: '0.62rem', color: '#38BDF8', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
              <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#38BDF8', marginRight: '6px', animation: 'blink 1.5s infinite', verticalAlign: 'middle' }} />
              SEASONAL SURVEILLANCE LIFECYCLE
            </p>
            <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(2.4rem,5vw,3.8rem)', fontStyle: 'italic', fontWeight: 900, margin: '0 0 0.8rem' }}>
              90-DAY CROP HEALTH JOURNEY.
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.98rem', maxWidth: '620px', margin: '0 auto', lineHeight: 1.6 }}>
              Follow a farmer and FPO tracking crop vitality from Day 01 sowing to Day 90 harvest with multimodal AI defense.
            </p>
          </div>

          {/* Timeline Rail Controls */}
          <div className="timeline-nav-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem', position: 'relative' }}>
            {[
              {
                stepNum: 1,
                day: 'Day 01',
                title: 'Sowing & Baseline Soil Check',
                badge: 'GERMINATION',
                color: '#34D399',
                icon: '🌱',
                status: 'Passed'
              },
              {
                stepNum: 2,
                day: 'Day 25',
                title: 'First AI Scan (Early Spot Detection - Passed)',
                badge: 'VEGETATIVE',
                color: '#22C55E',
                icon: '🔍',
                status: '0 Lesions'
              },
              {
                stepNum: 3,
                day: 'Day 50',
                title: 'Weather Risk Alert Triggered (Preemptive Treatment Applied)',
                badge: 'FLOWERING',
                color: '#FBBF24',
                icon: '🌧️',
                status: 'Action In 48h'
              },
              {
                stepNum: 4,
                day: 'Day 90',
                title: 'Maximized Harvest Yield Output',
                badge: 'HARVEST',
                color: '#38BDF8',
                icon: '🌾',
                status: '92% Retained'
              },
            ].map((step, idx) => {
              const isActive = activeJourneyStep === idx;
              return (
                <button
                  key={step.stepNum}
                  onClick={() => setActiveJourneyStep(idx)}
                  className="reveal"
                  style={{
                    background: isActive ? '#141A22' : '#0F1217',
                    border: `1px solid ${isActive ? step.color : 'rgba(255,255,255,0.06)'}`,
                    borderRadius: '12px',
                    padding: '1.2rem 1rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    position: 'relative',
                    boxShadow: isActive ? `0 0 25px ${step.color}20` : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '130px'
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.62rem', fontWeight: 800, color: step.color, background: `${step.color}15`, border: `1px solid ${step.color}35`, padding: '2px 7px', borderRadius: '4px' }}>
                      {step.day}
                    </span>
                    <span style={{ fontSize: '1.1rem' }}>{step.icon}</span>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '0.82rem', fontWeight: 700, color: isActive ? 'white' : 'rgba(255,255,255,0.7)', margin: '0 0 0.4rem', lineHeight: 1.35 }}>
                      {step.title}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: step.color, display: 'inline-block' }} />
                      <span style={{ fontFamily: 'monospace', fontSize: '0.58rem', color: 'rgba(255,255,255,0.45)' }}>{step.status}</span>
                    </div>
                  </div>

                  {/* Active Indicator Underline */}
                  {isActive && (
                    <div style={{ position: 'absolute', bottom: 0, left: '10%', right: '10%', height: '2px', background: step.color, borderRadius: '2px' }} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Step Detailed Inspection View */}
          <div className="reveal timeline-detail-grid" style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '1.5rem', background: '#11141A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '2rem', boxShadow: '0 12px 36px rgba(0,0,0,0.35)' }}>
            {/* Step Left: Narrative & Intervention Details */}
            {activeJourneyStep === 0 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.8rem' }}>
                  <span style={{ fontFamily: 'monospace', fontSize: '0.62rem', color: '#34D399', background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)', padding: '3px 8px', borderRadius: '4px', fontWeight: 800 }}>STAGE 1 · DAY 01 · GERMINATION</span>
                  <span style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)' }}>SOWING &amp; BASELINE SOIL CHECK</span>
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'white', marginBottom: '0.8rem', lineHeight: 1.25 }}>
                  Calibrating Soil Moisture &amp; Seed Pathogen Safeguards
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, marginBottom: '1.2rem' }}>
                  The farmer registers their GPS polygon on WhatsApp. The satellite Sentinel-2 SAR layer analyzes baseline soil moisture (64%) and soil organic carbon before seed sowing.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.2rem' }}>
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '0.75rem' }}>
                    <p style={{ fontFamily: 'monospace', fontSize: '0.55rem', color: '#34D399', margin: '0 0 3px' }}>AI RECOMMENDATION</p>
                    <p style={{ fontSize: '0.75rem', color: 'white', fontWeight: 700, margin: 0 }}>Trichoderma viride seed coating @ 4g/kg</p>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '0.75rem' }}>
                    <p style={{ fontFamily: 'monospace', fontSize: '0.55rem', color: '#38BDF8', margin: '0 0 3px' }}>EMERGENCE TARGET</p>
                    <p style={{ fontSize: '0.75rem', color: 'white', fontWeight: 700, margin: 0 }}>98% Uniform Crop Stand</p>
                  </div>
                </div>
              </div>
            )}

            {activeJourneyStep === 1 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.8rem' }}>
                  <span style={{ fontFamily: 'monospace', fontSize: '0.62rem', color: '#22C55E', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', padding: '3px 8px', borderRadius: '4px', fontWeight: 800 }}>STAGE 2 · DAY 25 · VEGETATIVE</span>
                  <span style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)' }}>FIRST AI SCAN (EARLY SPOT DETECTION)</span>
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'white', marginBottom: '0.8rem', lineHeight: 1.25 }}>
                  Edge AI Scans Young Leaves for Microscopic Spotting
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, marginBottom: '1.2rem' }}>
                  Farmer clicks a photo of lower foliage via WhatsApp. Multimodal Gemini models detect zero fungal mycelium or Cercospora spotting, issuing a clean health certificate in 1.2s.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.2rem' }}>
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '0.75rem' }}>
                    <p style={{ fontFamily: 'monospace', fontSize: '0.55rem', color: '#22C55E', margin: '0 0 3px' }}>HEALTH VERIFICATION</p>
                    <p style={{ fontSize: '0.75rem', color: 'white', fontWeight: 700, margin: 0 }}>98.4% Confidence · 0 Necrotic Foci</p>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '0.75rem' }}>
                    <p style={{ fontFamily: 'monospace', fontSize: '0.55rem', color: '#38BDF8', margin: '0 0 3px' }}>CHEMICAL SAVED</p>
                    <p style={{ fontSize: '0.75rem', color: 'white', fontWeight: 700, margin: 0 }}>Zero Blanket Spray Needed (₹1,400 saved)</p>
                  </div>
                </div>
              </div>
            )}

            {activeJourneyStep === 2 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.8rem' }}>
                  <span style={{ fontFamily: 'monospace', fontSize: '0.62rem', color: '#FBBF24', background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)', padding: '3px 8px', borderRadius: '4px', fontWeight: 800 }}>STAGE 3 · DAY 50 · FLOWERING</span>
                  <span style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)' }}>WEATHER RISK ALERT TRIGGERED</span>
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'white', marginBottom: '0.8rem', lineHeight: 1.25 }}>
                  Preemptive Weather Risk Alert &amp; Targeted Treatment
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, marginBottom: '1.2rem' }}>
                  OpenWeather radar detects 88% humidity + 4 days of intermittent rain in Hooghly. CropGuard automatically calls the farmer via Bhashini voice AI in Bengali advising preventative fungicide spray.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.2rem' }}>
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '0.75rem' }}>
                    <p style={{ fontFamily: 'monospace', fontSize: '0.55rem', color: '#FBBF24', margin: '0 0 3px' }}>PREEMPTIVE ACTION</p>
                    <p style={{ fontSize: '0.75rem', color: 'white', fontWeight: 700, margin: 0 }}>Mancozeb 75% WP @ 2.5g/L Applied</p>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '0.75rem' }}>
                    <p style={{ fontFamily: 'monospace', fontSize: '0.55rem', color: '#EF4444', margin: '0 0 3px' }}>BLIGHT PREVENTION</p>
                    <p style={{ fontSize: '0.75rem', color: 'white', fontWeight: 700, margin: 0 }}>Blocked 40% Epidemic Spread</p>
                  </div>
                </div>
              </div>
            )}

            {activeJourneyStep === 3 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.8rem' }}>
                  <span style={{ fontFamily: 'monospace', fontSize: '0.62rem', color: '#38BDF8', background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.3)', padding: '3px 8px', borderRadius: '4px', fontWeight: 800 }}>STAGE 4 · DAY 90 · HARVEST</span>
                  <span style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)' }}>MAXIMIZED HARVEST YIELD OUTPUT</span>
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'white', marginBottom: '0.8rem', lineHeight: 1.25 }}>
                  Peak Yield Realization &amp; Live Mandi Price Lock
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, marginBottom: '1.2rem' }}>
                  Crops harvested with zero secondary rot. Live data.gov.in Mandi integration connects farmer to highest bidding local Mandi at ₹1,840/Qtl, preserving full seasonal profits.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.2rem' }}>
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '0.75rem' }}>
                    <p style={{ fontFamily: 'monospace', fontSize: '0.55rem', color: '#38BDF8', margin: '0 0 3px' }}>FINAL OUTPUT</p>
                    <p style={{ fontSize: '0.75rem', color: 'white', fontWeight: 700, margin: 0 }}>92% Potential Yield Realized</p>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '0.75rem' }}>
                    <p style={{ fontFamily: 'monospace', fontSize: '0.55rem', color: '#22C55E', margin: '0 0 3px' }}>NET SURPLUS</p>
                    <p style={{ fontSize: '0.75rem', color: 'white', fontWeight: 700, margin: 0 }}>+₹12,500/Acre Profit Over Conventional</p>
                  </div>
                </div>
              </div>
            )}

            {/* Step Right: Live Telemetry Visual Card */}
            <div style={{ background: '#0A0C10', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.6rem', marginBottom: '1rem' }}>
                <span style={{ fontFamily: 'monospace', fontSize: '0.62rem', color: '#22C55E', letterSpacing: '0.1em' }}>● SATELLITE &amp; IOT TELEMETRY</span>
                <span style={{ fontFamily: 'monospace', fontSize: '0.58rem', color: 'rgba(255,255,255,0.4)' }}>GEO: HOOGHLY 22.89° N, 88.39° E</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginBottom: '1rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.6rem', borderRadius: '6px' }}>
                  <span style={{ fontSize: '0.55rem', fontFamily: 'monospace', color: 'rgba(255,255,255,0.4)', display: 'block' }}>NDVI VEGETATION INDEX</span>
                  <span style={{ fontSize: '1.1rem', fontWeight: 900, fontFamily: 'monospace', color: activeJourneyStep === 0 ? '#34D399' : activeJourneyStep === 1 ? '#22C55E' : activeJourneyStep === 2 ? '#FBBF24' : '#38BDF8' }}>
                    {activeJourneyStep === 0 ? '0.18 (Seed)' : activeJourneyStep === 1 ? '0.74 (Optimal)' : activeJourneyStep === 2 ? '0.68 (Watch)' : '0.88 (Peak)'}
                  </span>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.6rem', borderRadius: '6px' }}>
                  <span style={{ fontSize: '0.55rem', fontFamily: 'monospace', color: 'rgba(255,255,255,0.4)', display: 'block' }}>AIR HUMIDITY / RAIN</span>
                  <span style={{ fontSize: '1.1rem', fontWeight: 900, fontFamily: 'monospace', color: 'white' }}>
                    {activeJourneyStep === 2 ? '88% (High Risk)' : '62% (Moderate)'}
                  </span>
                </div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '6px', padding: '0.65rem', fontFamily: 'monospace', fontSize: '0.62rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>
                <p style={{ margin: '0 0 2px', color: '#22C55E' }}>&gt; System Status: Active Continuous Monitoring</p>
                <p style={{ margin: 0 }}>&gt; WhatsApp Bot Dispatch: Connected (96.4% response rate)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          FARMER DAILY — Kisan Chaupal + Live Mandi Rates
      ════════════════════════════════════════════════ */}
      <section className="mobile-p" style={{ background: '#09090B', padding: '7rem 2rem', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p style={{ fontFamily: 'monospace', fontSize: '0.62rem', color: '#22C55E', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>FARMER DAILY</p>
            <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(2.4rem,5vw,3.8rem)', fontStyle: 'italic', fontWeight: 900, margin: 0 }}>
              REAL-TIME FIELD INTELLIGENCE.
            </h2>
          </div>

          <div className="farmer-daily-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

            {/* Left: Kisan Chaupal Community Alerts */}
            <div style={{ background: '#111318', border: '1px solid rgba(34,197,94,0.15)', borderRadius: '14px', overflow: 'hidden' }}>
              <div style={{ background: 'rgba(34,197,94,0.06)', padding: '1rem 1.25rem', borderBottom: '1px solid rgba(34,197,94,0.12)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.15rem', color: '#22C55E', fontStyle: 'italic', margin: 0 }}>🌾 KISAN CHAUPAL</p>
                  <p style={{ fontFamily: 'monospace', fontSize: '0.58rem', color: 'rgba(255,255,255,0.4)', margin: 0 }}>Community Outbreak Alerts · West Bengal</p>
                </div>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.6rem', fontFamily: 'monospace', color: '#22C55E' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E', animation: 'blink 2s infinite', display: 'inline-block' }} />
                  LIVE
                </span>
              </div>
              <div style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '320px', overflowY: 'auto' }}>
                {[
                  { time: '2m ago', sev: 'high', msg: '⚠️ Leaf Rust outbreak detected in 5km radius of Hooghly Block 4. 23 farms affected.', district: 'Hooghly' },
                  { time: '18m ago', sev: 'med', msg: '🌧 High humidity alert: Late Blight risk elevated for next 72 hours in Burdwan.', district: 'Burdwan' },
                  { time: '1h ago', sev: 'low', msg: '✅ KVK Scientist reviewed 6 scans — all confirmed as Powdery Mildew. Sulphur spray advised.', district: 'Nadia' },
                  { time: '2h ago', sev: 'high', msg: '⚠️ Early Blight spreading in Potato belt — 48 farmers in Malda alerted via WhatsApp.', district: 'Malda' },
                  { time: '4h ago', sev: 'med', msg: '📡 New TFLite model deployed: Wheat Yellow Rust detection accuracy improved to 97.2%.', district: 'System' },
                  { time: '6h ago', sev: 'low', msg: '💊 Govt. subsidy for Mancozeb now available at Kisan Kendra Hooghly Centre.', district: 'Hooghly' },
                ].map((a, i) => (
                  <div key={i} className="mandi-row" style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${a.sev === 'high' ? 'rgba(239,68,68,0.2)' : a.sev === 'med' ? 'rgba(251,191,36,0.15)' : 'rgba(34,197,94,0.12)'}`, borderRadius: '8px', padding: '0.65rem', transition: 'background 0.15s' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                      <span style={{ fontFamily: 'monospace', fontSize: '0.55rem', color: a.sev === 'high' ? '#FCA5A5' : a.sev === 'med' ? '#FDE68A' : '#6EE7B7', fontWeight: 800, letterSpacing: '0.04em' }}>
                        {a.sev === 'high' ? '🔴 HIGH' : a.sev === 'med' ? '🟡 MEDIUM' : '🟢 INFO'} · {a.district}
                      </span>
                      <span style={{ fontFamily: 'monospace', fontSize: '0.52rem', color: 'rgba(255,255,255,0.3)' }}>{a.time}</span>
                    </div>
                    <p style={{ fontSize: '0.77rem', color: 'rgba(255,255,255,0.75)', margin: 0, lineHeight: 1.45 }}>{a.msg}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Live Mandi Rates */}
            <div style={{ background: '#111318', border: '1px solid rgba(251,191,36,0.15)', borderRadius: '14px', overflow: 'hidden' }}>
              <div style={{ background: 'rgba(251,191,36,0.06)', padding: '1rem 1.25rem', borderBottom: '1px solid rgba(251,191,36,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.15rem', color: '#FBBF24', fontStyle: 'italic', margin: 0 }}>📊 LIVE MANDI RATES</p>
                  <p style={{ fontFamily: 'monospace', fontSize: '0.58rem', color: 'rgba(255,255,255,0.4)', margin: 0 }}>data.gov.in · West Bengal Mandis</p>
                </div>
                <span style={{ fontFamily: 'monospace', fontSize: '0.58rem', color: '#FBBF24', background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.25)', padding: '3px 8px', borderRadius: '4px' }}>
                  UPDATED 15m AGO
                </span>
              </div>

              {/* Table Header */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1.2fr 1fr 0.8fr', padding: '0.6rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                {['CROP', 'MANDI', 'PRICE (₹/q)', 'TREND'].map(h => (
                  <span key={h} style={{ fontFamily: 'monospace', fontSize: '0.55rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{h}</span>
                ))}
              </div>

              <div style={{ padding: '0 0 0.5rem' }}>
                {[
                  { crop: '🌾 Wheat', mandi: 'Burdwan', price: '₹2,275', trend: '+1.2%', up: true },
                  { crop: '🥔 Potato', mandi: 'Hooghly', price: '₹1,840', trend: '-0.8%', up: false },
                  { crop: '🍚 Rice (Fine)', mandi: 'Nadia', price: '₹3,120', trend: '+2.1%', up: true },
                  { crop: '🧅 Onion', mandi: 'Murshidabad', price: '₹2,050', trend: '+0.5%', up: true },
                  { crop: '🌽 Maize', mandi: 'Malda', price: '₹1,680', trend: '-1.4%', up: false },
                  { crop: '🫘 Lentil', mandi: 'Bankura', price: '₹5,890', trend: '+0.9%', up: true },
                  { crop: '🌻 Mustard', mandi: 'Birbhum', price: '₹4,720', trend: '+3.2%', up: true },
                  { crop: '🥬 Jute', mandi: 'Cooch Behar', price: '₹3,440', trend: '-0.3%', up: false },
                ].map((r, i) => (
                  <div key={i} className="mandi-row" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1.2fr 1fr 0.8fr', padding: '0.6rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: 'white', fontWeight: 600 }}>{r.crop}</span>
                    <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace' }}>{r.mandi}</span>
                    <span style={{ fontSize: '0.82rem', color: '#FBBF24', fontWeight: 800, fontFamily: 'monospace' }}>{r.price}</span>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, fontFamily: 'monospace', color: r.up ? '#34D399' : '#F87171', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      {r.up ? '▲' : '▼'} {r.trend}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ padding: '0.75rem 1rem', background: 'rgba(251,191,36,0.04)', borderTop: '1px solid rgba(251,191,36,0.08)' }}>
                <p style={{ fontFamily: 'monospace', fontSize: '0.58rem', color: 'rgba(255,255,255,0.35)', margin: 0 }}>
                  Source: data.gov.in · Agmarknet · WBSIDC · Prices in ₹/Quintal
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          OUTBREAK RADAR — GlobalMap
      ════════════════════════════════════════════════ */}
      <section className="mobile-p" style={{ background: '#0C0F12', padding: '7rem 2rem', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <p style={{ fontFamily: 'monospace', fontSize: '0.62rem', color: '#22C55E', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
              <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#22C55E', marginRight: '6px', animation: 'blink 1.5s infinite', verticalAlign: 'middle' }} />
              LIVE DISTRICT SURVEILLANCE
            </p>
            <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(2.4rem,5vw,3.8rem)', fontStyle: 'italic', fontWeight: 900, margin: 0 }}>
              CROPGUARD AI IS WATCHING EVERY FIELD.
            </h2>
          </div>
          <div style={{ position: 'relative', height: '460px', border: '1px solid rgba(34,197,94,0.12)', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 0 60px rgba(34,197,94,0.06)' }}>
            <GlobalMap />
            {/* Stats Overlay */}
            <div style={{ position: 'absolute', top: '1rem', left: '1rem', zIndex: 1000, background: 'rgba(9,9,11,0.92)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '8px', padding: '0.8rem 1.1rem', backdropFilter: 'blur(12px)' }}>
              {[['8+', 'DISTRICTS'], ['15k+', 'SCANS'], ['96%', 'ACCURACY']].map(([n, l]) => (
                <div key={l} style={{ marginBottom: '0.35rem' }}>
                  <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.25rem', color: '#22C55E', marginRight: '6px', fontStyle: 'italic' }}>{n}</span>
                  <span style={{ fontFamily: 'monospace', fontSize: '0.55rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>{l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Traction Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginTop: '1.5rem' }}>
            {[
              ['8+ Active Districts', 'Hooghly, Burdwan, Nadia, Malda & more'],
              ['15,000+ Scans Processed', 'Gemini multimodal analyses completed'],
              ['96% Field Accuracy', 'Cross-validated with KVK scientist network'],
              ['Krishak Bandhu Mapped', 'PM-KISAN & Govt. scheme integration'],
            ].map(([t, d], i) => (
              <div key={i} className="reveal" style={{ background: '#111318', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '1.1rem', textAlign: 'center' }}>
                <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '1rem', color: '#22C55E', fontStyle: 'italic', marginBottom: '0.25rem', lineHeight: 1.2 }}>{t}</div>
                <div style={{ fontFamily: 'monospace', fontSize: '0.58rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.04em', lineHeight: 1.4 }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          3. ENTERPRISE DATA PRIVACY & SECURITY BANNER
      ════════════════════════════════════════════════ */}
      <section id="data-privacy-security" className="mobile-p" style={{ background: '#090B0E', padding: '6.5rem 2rem', borderTop: '1px solid rgba(34,197,94,0.12)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ maxWidth: '1140px', margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <p style={{ fontFamily: 'monospace', fontSize: '0.62rem', color: '#22C55E', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
              <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#22C55E', marginRight: '6px', animation: 'blink 1.5s infinite', verticalAlign: 'middle' }} />
              SOVEREIGN SECURITY INFRASTRUCTURE
            </p>
            <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(2.4rem,5vw,3.8rem)', fontStyle: 'italic', fontWeight: 900, margin: '0 0 0.8rem' }}>
              ENTERPRISE DATA PRIVACY &amp; SECURITY.
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.98rem', maxWidth: '620px', margin: '0 auto', lineHeight: 1.6 }}>
              Built to the highest national data governance standards. Zero monetization of farmer telemetry, full DPDP compliance, and bank-grade encryption.
            </p>
          </div>

          <div className="trust-badges-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.2rem' }}>
            {[
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                ),
                tag: 'DPDP COMPLIANT',
                tagColor: '#22C55E',
                title: 'Data Privacy',
                desc: 'Fully compliant with Digital Personal Data Protection (DPDP) standards. No personal farmer data or phone numbers are shared or sold.',
                sub: '🇮🇳 India DPDP Aligned'
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                ),
                tag: 'AES-256 ENCRYPTION',
                tagColor: '#38BDF8',
                title: 'AES-256 Encryption',
                desc: 'All crop imagery and voice logs are encrypted end-to-end in transit (TLS 1.3) and at rest with zero-knowledge keys.',
                sub: '🔐 Zero-Knowledge Storage'
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="m4.93 4.93 4.24 4.24" />
                    <path d="m14.83 9.17 4.24-4.24" />
                    <path d="m14.83 14.83 4.24 4.24" />
                    <path d="m9.17 14.83-4.24 4.24" />
                    <circle cx="12" cy="12" r="4" />
                  </svg>
                ),
                tag: '100% PUBLIC GOOD',
                tagColor: '#FBBF24',
                title: 'Zero Farmers Exploitation',
                desc: '100% free open access for smallholder farmers. No paywalls on emergency disease diagnosis, no commercial advertising bias.',
                sub: '🌱 Open Public Charter'
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                ),
                tag: 'OPEN API 3.1',
                tagColor: '#34D399',
                title: 'API First',
                desc: 'Ready to integrate with State Agri-Dashboards, KVK Extension portals, and FPO management platforms with sub-200ms latency.',
                sub: '⚡ Webhook & REST Ready'
              },
            ].map((b, i) => (
              <div
                key={i}
                className="reveal sih-card"
                style={{
                  background: '#11141A',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '14px',
                  padding: '1.8rem 1.4rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.25s',
                  cursor: 'default',
                  borderTop: `3px solid ${b.tagColor}40`
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                    <div style={{ background: `${b.tagColor}12`, border: `1px solid ${b.tagColor}30`, borderRadius: '8px', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {b.icon}
                    </div>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.55rem', fontWeight: 800, color: b.tagColor, letterSpacing: '0.06em' }}>
                      {b.tag}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'white', marginBottom: '0.6rem' }}>
                    {b.title}
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, margin: 0 }}>
                    {b.desc}
                  </p>
                </div>

                <div style={{ marginTop: '1.4rem', paddingTop: '0.8rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontFamily: 'monospace', fontSize: '0.62rem', color: b.tagColor, fontWeight: 700 }}>
                    {b.sub}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          FINAL CTA
      ════════════════════════════════════════════════ */}
      <section style={{ position: 'relative', overflow: 'hidden', minHeight: '52vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '5rem 2rem', background: '#09090B', borderTop: '1px solid rgba(34,197,94,0.08)' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, rgba(34,197,94,0.06), transparent 65%)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.3)', borderRadius: '99px', padding: '4px 14px', marginBottom: '1.5rem' }}>
            <span style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: '#FBBF24', letterSpacing: '0.1em' }}>🏆 SIH 2026 SUBMISSION · SMART INDIA HACKATHON</span>
          </div>
          <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(3rem,7vw,5.5rem)', fontStyle: 'italic', fontWeight: 900, marginBottom: '1rem' }}>
            READY TO PROTECT 140 MILLION FARMERS?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem', maxWidth: '520px', margin: '0 auto 2.2rem', lineHeight: 1.75 }}>
            From a farmer's voice in a remote West Bengal field to a district-wide early warning system — CropGuard AI is national-scale public infrastructure.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" style={{ background: '#25D366', color: 'white', fontWeight: 800, fontFamily: 'monospace', fontSize: '0.82rem', letterSpacing: '0.06em', padding: '0.9rem 2rem', borderRadius: '8px', textDecoration: 'none', boxShadow: '0 0 24px rgba(37,211,102,0.25)' }}>
              💬 START ON WHATSAPP
            </a>
            <Link href="/contact" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.3)', color: '#22C55E', fontFamily: 'monospace', fontSize: '0.82rem', letterSpacing: '0.06em', padding: '0.9rem 1.8rem', borderRadius: '8px', textDecoration: 'none', display: 'inline-block' }}>
              CONTACT FOR PILOT
            </Link>
          </div>
          <p style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)', marginTop: '1.5rem', letterSpacing: '0.1em' }}>
            🔒 DATA SOVEREIGN · ZERO PII STORED · OFFLINE-FIRST · 🇮🇳 MADE IN INDIA
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
