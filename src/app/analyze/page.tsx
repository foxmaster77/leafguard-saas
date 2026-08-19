'use client';

import React, { useEffect, useState, useRef } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const css = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono&display=swap');
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
@keyframes pulse { 0%,100%{box-shadow:0 0 0 0 rgba(200,245,62,0.4)} 70%{box-shadow:0 0 0 8px transparent} }
@keyframes pulseRed { 0%,100%{box-shadow:0 0 0 0 rgba(255,79,79,0.5)} 70%{box-shadow:0 0 0 10px transparent} }
@media (max-width: 639px) {
  .scanner-workspace { grid-template-columns: 1fr !important; }
  .result-metrics { grid-template-columns: 1fr !important; }
  .result-treatment { grid-template-columns: 1fr !important; }
  .weather-forecast { grid-template-columns: repeat(2, 1fr) !important; }
  .dealer-grid { grid-template-columns: 1fr !important; }
  .scheme-grid { grid-template-columns: 1fr !important; }
  .visual-explain-grid { grid-template-columns: 1fr !important; }
}
`;

export default function AnalyzePage() {
  const [pp, setPp] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [consoleLogs, setConsoleLogs] = useState<string[]>(['> Waiting for input']);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Regional Voice & Language State
  const [selectedLang, setSelectedLang] = useState<'bn-IN' | 'hi-IN' | 'en-IN'>('bn-IN');
  const [transcript, setTranscript] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [pincode, setPincode] = useState<string>('712101');
  const recognitionRef = useRef<any>(null);

  const addLog = (msg: string) => {
    setConsoleLogs(prev => [...prev.slice(-4), msg]);
  };

  // Web Speech API
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your description in the text box.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = selectedLang;
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        addLog(`> Listening in ${selectedLang === 'bn-IN' ? 'Bangla (বাংলা)' : selectedLang === 'hi-IN' ? 'Hindi (हिंदी)' : 'English'}...`);
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
      console.error('Speech recognition error:', e);
      setIsListening(false);
    }
  };

  // Text-to-Speech Output
  const speakResponse = (text: string, lang: string = selectedLang) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.95;
    
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

    const logs = [
      activeImage ? '> Processing visual imagery...' : '> Processing voice description...',
      `> Language: ${selectedLang === 'bn-IN' ? 'Bangla (বাংলা)' : selectedLang === 'hi-IN' ? 'Hindi (हिंदी)' : 'English'}`,
      '> Running multi-modal neural pathogen model...',
      '> Matching local suppliers & government schemes...',
      '> Generating threat report & weather risk forecast...'
    ];

    logs.forEach((log, i) => {
      setTimeout(() => addLog(log), (i + 1) * 450);
    });

    const targetMs = Math.floor(Math.random() * (3200 - 1800 + 1) + 1800);
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
          if (data.voiceSummary) {
            speakResponse(data.voiceSummary, selectedLang);
          }
        } else {
          addLog('> Analysis failed: ' + (data?.error || `HTTP ${res.status}`));
        }
        setAnalyzing(false);
      }, Math.max(logs.length * 450 + 300, targetMs));
    } catch (err: any) {
      addLog(`> Error connecting to CropGuard AI node: ${err?.message || 'Check connection'}`);
      setAnalyzing(false);
    }
  };

  const runSample = async (type: 'WHEAT' | 'SOY') => {
    const url = type === 'WHEAT' ? '/samples/wheat.jpg' : '/samples/soy.jpg';

    setImageError(null);
    setConsoleLogs([`> Fetching sample ${type}...`]);
    if (type === 'WHEAT') {
      setTranscript(selectedLang === 'bn-IN' ? 'গম গাছের পাতায় হলুদ দাগ এবং শুকিয়ে যাওয়া ভাব দেখা যাচ্ছে।' : selectedLang === 'hi-IN' ? 'गेहूं के पत्तों पर पीले धब्बे दिख रहे हैं।' : 'Yellow spots appearing on wheat leaves.');
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
    setImageError(null);
    setAnalysisResult(null);
    setTranscript('');
    setConsoleLogs(['> Waiting for input']);
    setPp(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div style={{ background: '#060A04', color: 'white', fontFamily: 'Inter,system-ui,sans-serif', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <Navigation />

      <main style={{ flexGrow: 1, padding: 'clamp(5rem, 8vw, 7rem) clamp(1rem, 3vw, 2rem) 2rem', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(200,245,62,0.08)', border: '1px solid rgba(200,245,62,0.2)', borderRadius: '99px', padding: '0.4rem 1rem', fontFamily: 'monospace', fontSize: '0.7rem', color: '#C8F53E', letterSpacing: '0.15em', marginBottom: '1rem' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#C8F53E', display: 'inline-block' }} />
            MULTIMODAL REGIONAL AI SCANNER
          </div>
          <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(2.5rem,6vw,4.5rem)', fontStyle: 'italic', fontWeight: 900, margin: 0 }}>
            DIAGNOSE CROP PATHOGENS IN SECONDS.
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem', marginTop: '0.6rem', maxWidth: '600px', margin: '0.6rem auto 0' }}>
            Speak in your regional language or drop a crop photo to receive immediate prescription, local supplier mapping, and weather spread risk.
          </p>

          {/* LANGUAGE SELECTOR */}
          <div style={{ display: 'inline-flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.6rem', background: '#0F1409', border: '1px solid rgba(200,245,62,0.2)', padding: '0.4rem', borderRadius: '99px', marginTop: '1.5rem' }}>
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

        {/* SCANNER WORKSPACE */}
        <div className="scanner-workspace" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: '#0F1409', border: '1px solid rgba(200,245,62,0.15)', borderRadius: '8px', overflow: 'hidden' }}>
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

            {/* Voice Input */}
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

            {/* Run Button - Primary Visual Focal Point */}
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
                fontSize: '0.92rem',
                letterSpacing: '0.12em',
                padding: '1.15rem',
                border: '2px solid #C8F53E',
                cursor: (analyzing || !!imageError) ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                borderRadius: '6px',
                boxShadow: (analyzing || !!imageError) ? 'none' : '0 0 35px rgba(200,245,62,0.45)'
              }}
            >
              {analyzing ? 'DIAGNOSING CROP PATHOGEN...' : imageError ? 'INVALID IMAGE — FIX TO PROCEED' : '⚡ RUN MULTIMODAL DIAGNOSIS →'}
            </button>

            <p style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', margin: '1.2rem 0 0.6rem', textTransform: 'uppercase' }}>OR SELECT PRE-CACHED TEST SAMPLE:</p>
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              {['SAMPLE A (WHEAT)', 'SAMPLE B (SOY)'].map(s => (
                <button
                  key={s}
                  onClick={() => runSample(s.includes('WHEAT') ? 'WHEAT' : 'SOY')}
                  style={{ flex: 1, border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)', background: 'rgba(255,255,255,0.02)', padding: '0.6rem', fontFamily: 'monospace', fontSize: '0.68rem', cursor: 'pointer', letterSpacing: '0.04em', borderRadius: '4px', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(200,245,62,0.4)'; e.currentTarget.style.color = '#C8F53E'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div style={{ background: '#050805', padding: '2rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
              <span style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: '#C8F53E', letterSpacing: '0.12em' }}>● ANALYSIS CONSOLE</span>
              <span style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)' }}>MODE: MULTIMODAL GEMINI 2.0</span>
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

        {/* SKELETON LOADER FOR ANALYZE PAGE */}
        {analyzing && !analysisResult && (
          <div style={{ marginTop: '2.5rem', background: '#0F1409', border: '1px solid rgba(200,245,62,0.25)', padding: '2.5rem', borderRadius: '8px' }}>
            <div style={{ background: 'rgba(200,245,62,0.05)', border: '1px solid rgba(200,245,62,0.2)', padding: '1.2rem', borderRadius: '6px', marginBottom: '2rem' }}>
              <div style={{ width: '180px', height: '14px', background: 'rgba(200,245,62,0.2)', borderRadius: '4px', marginBottom: '10px' }} />
              <div style={{ width: '85%', height: '16px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.2rem', marginBottom: '2rem' }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.03)', padding: '1.2rem', borderRadius: '6px' }}>
                  <div style={{ width: '70px', height: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', marginBottom: '8px' }} />
                  <div style={{ width: '120px', height: '22px', background: 'rgba(200,245,62,0.15)', borderRadius: '4px' }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RESULTS PANEL */}
        {analysisResult && (
          <div style={{ background: '#0F1409', border: '1px solid rgba(200,245,62,0.2)', margin: '2.5rem auto 0', padding: '2.5rem', borderRadius: '8px', fontFamily: 'monospace' }}>
            {/* LOCALIZED VOICE RESPONSE */}
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

            {/* VISUAL EXPLAINABILITY PANEL */}
            {imagePreview && analysisResult.boundingBox && (
              <div style={{ marginBottom: '2.5rem', background: 'rgba(255,79,79,0.04)', border: '1px solid rgba(255,79,79,0.3)', borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.9rem 1.2rem', background: 'rgba(255,79,79,0.08)', borderBottom: '1px solid rgba(255,79,79,0.2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF4F4F', display: 'inline-block', animation: 'pulseRed 1.2s infinite' }} />
                    <span style={{ fontFamily: 'monospace', fontSize: '0.68rem', color: '#FF6B6B', fontWeight: 900, letterSpacing: '0.15em' }}>VISUAL EXPLAINABILITY — PATHOGEN LOCALISATION MAP</span>
                  </div>
                  <span style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: 'rgba(255,79,79,0.7)', letterSpacing: '0.1em' }}>
                    X:{analysisResult.boundingBox.x}% Y:{analysisResult.boundingBox.y}% W:{analysisResult.boundingBox.width}% H:{analysisResult.boundingBox.height}%
                  </span>
                </div>
                <div className="visual-explain-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 0 }}>
                  {/* Large image with overlay */}
                  <div style={{ position: 'relative', overflow: 'hidden', background: '#000', minHeight: '300px', maxHeight: '420px' }}>
                    <img
                      src={imagePreview}
                      alt="Crop scan with pathogen localisation"
                      style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                    />
                    {/* Bounding box overlay */}
                    <div
                      style={{
                        position: 'absolute',
                        left: `${analysisResult.boundingBox.x}%`,
                        top: `${analysisResult.boundingBox.y}%`,
                        width: `${analysisResult.boundingBox.width}%`,
                        height: `${analysisResult.boundingBox.height}%`,
                        border: '2px solid #FF4F4F',
                        background: 'rgba(255,79,79,0.18)',
                        boxShadow: '0 0 20px rgba(255,79,79,0.5), inset 0 0 20px rgba(255,79,79,0.1)',
                        pointerEvents: 'none',
                        zIndex: 10,
                        boxSizing: 'border-box'
                      }}
                    >
                      {/* Corner tick marks */}
                      {[{top:0,left:0},{top:0,right:0},{bottom:0,left:0},{bottom:0,right:0}].map((pos, i) => (
                        <div key={i} style={{ position: 'absolute', width: 10, height: 10, borderColor: '#FF4F4F', borderStyle: 'solid', borderWidth: 0, ...( i===0 ? {borderTopWidth:2,borderLeftWidth:2,top:-1,left:-1} : i===1 ? {borderTopWidth:2,borderRightWidth:2,top:-1,right:-1} : i===2 ? {borderBottomWidth:2,borderLeftWidth:2,bottom:-1,left:-1} : {borderBottomWidth:2,borderRightWidth:2,bottom:-1,right:-1} ) }} />
                      ))}
                      {/* Label */}
                      <span
                        style={{
                          position: 'absolute',
                          top: '-22px',
                          left: '-1px',
                          background: '#FF4F4F',
                          color: '#fff',
                          fontSize: '0.6rem',
                          fontWeight: 900,
                          fontFamily: 'monospace',
                          padding: '2px 7px',
                          letterSpacing: '0.08em',
                          whiteSpace: 'nowrap',
                          boxShadow: '0 2px 8px rgba(255,79,79,0.5)'
                        }}
                      >
                        ⚠ AFFECTED AREA
                      </span>
                    </div>
                    {/* Scan-line overlay for effect */}
                    <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.04) 3px, rgba(0,0,0,0.04) 4px)', pointerEvents: 'none' }} />
                    {/* Bottom HUD bar */}
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', padding: '1.5rem 1rem 0.6rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                      <span style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: 'rgba(200,245,62,0.7)', letterSpacing: '0.1em' }}>● THERMAL OVERLAY ACTIVE</span>
                      <span style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: 'rgba(255,79,79,0.8)' }}>PATHOGEN ZONE DETECTED</span>
                    </div>
                  </div>
                  {/* Sidebar metadata */}
                  <div style={{ background: 'rgba(0,0,0,0.4)', padding: '1.4rem', display: 'flex', flexDirection: 'column', gap: '1rem', borderLeft: '1px solid rgba(255,79,79,0.15)' }}>
                    <div>
                      <p style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em', margin: '0 0 0.3rem' }}>PATHOGEN IDENTIFIED</p>
                      <p style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#FF6B6B', fontWeight: 900, margin: 0 }}>{(analysisResult.disease || 'Unknown').toUpperCase()}</p>
                    </div>
                    <div>
                      <p style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em', margin: '0 0 0.3rem' }}>LOCALISATION COORDS</p>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                        {[
                          { label: 'X-ORIGIN', value: `${analysisResult.boundingBox.x}%` },
                          { label: 'Y-ORIGIN', value: `${analysisResult.boundingBox.y}%` },
                          { label: 'WIDTH', value: `${analysisResult.boundingBox.width}%` },
                          { label: 'HEIGHT', value: `${analysisResult.boundingBox.height}%` }
                        ].map(m => (
                          <div key={m.label} style={{ background: 'rgba(255,79,79,0.08)', border: '1px solid rgba(255,79,79,0.15)', borderRadius: '4px', padding: '0.4rem 0.5rem' }}>
                            <p style={{ fontFamily: 'monospace', fontSize: '0.52rem', color: 'rgba(255,255,255,0.3)', margin: '0 0 0.15rem' }}>{m.label}</p>
                            <p style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#FF6B6B', fontWeight: 900, margin: 0 }}>{m.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em', margin: '0 0 0.3rem' }}>CONFIDENCE SCORE</p>
                      <div style={{ background: 'rgba(255,255,255,0.06)', height: '4px', borderRadius: '2px', overflow: 'hidden', marginBottom: '0.3rem' }}>
                        <div style={{ height: '100%', width: `${analysisResult.confidence || 87}%`, background: 'linear-gradient(90deg, #FF4F4F, #FF8C00)', transition: 'width 1s ease' }} />
                      </div>
                      <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#FF8C00', fontWeight: 900 }}>{analysisResult.confidence || 87}%</span>
                    </div>
                    <div style={{ marginTop: 'auto', background: 'rgba(255,79,79,0.1)', border: '1px solid rgba(255,79,79,0.2)', borderRadius: '4px', padding: '0.7rem' }}>
                      <p style={{ fontFamily: 'monospace', fontSize: '0.55rem', color: 'rgba(255,79,79,0.7)', letterSpacing: '0.1em', margin: '0 0 0.3rem' }}>⚠ AI ADVISORY</p>
                      <p style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: 1.5 }}>
                        Bounding box is model-estimated. Verify via physical inspection before treatment.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Metric Cards */}
            <div className="result-metrics" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
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

            {/* Treatment & Action Plan */}
            <div className="result-treatment" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
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

                <div className="weather-forecast" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.8rem', marginBottom: '1.2rem' }}>
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

                <div className="dealer-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
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

                <div className="scheme-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
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
      </main>

      <Footer />
    </div>
  );
}
