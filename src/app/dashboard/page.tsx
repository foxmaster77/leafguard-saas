'use client';

import React, { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import {
  ShieldCheck, Terminal, Search, Map as MapIcon, Activity, Database, Settings,
  LogOut, Bell, Clock, User, Upload, AlertTriangle, Thermometer, CloudRain,
  Wind, Globe, ArrowRight, RotateCcw, Target, CheckCircle, XCircle,
  Film, Video, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Dynamically import the heatmap with no SSR (it manages its own Leaflet CSS)
const OutbreakHeatmap = dynamic(() => import('@/components/OutbreakHeatmap'), { ssr: false });

const Ticker = () => (
  <div className="bg-black/40 rounded-xl p-4 overflow-hidden relative border border-white/5">
    <div className="ticker-container flex whitespace-nowrap">
      <div className="ticker-text text-[9px] font-black text-[#C8F53E] uppercase tracking-widest animate-ticker">
        RICE PRICES UP 12% · OUTBREAK ALERT: HOOGHLY & BURDWAN · SUBSIDY PROGRAM OPEN · PADDY SOWING: 48H ·
        RICE PRICES UP 12% · OUTBREAK ALERT: HOOGHLY & BURDWAN · SUBSIDY PROGRAM OPEN · PADDY SOWING: 48H ·
      </div>
    </div>
  </div>
);

type FrameResult = {
  frameIndex: number;
  timestamp: string;
  thumbUrl: string;
  status: 'analyzing' | 'done' | 'failed';
  data: any | null;
  error?: string;
};

export default function Dashboard() {
  const [time, setTime] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [daysFilter, setDaysFilter] = useState<7 | 30>(7);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Video multi-frame scan state
  const [isVideoScan, setIsVideoScan] = useState(false);
  const [frameScanMsg, setFrameScanMsg] = useState('');
  const [videoFrameResults, setVideoFrameResults] = useState<FrameResult[]>([]);

  // Outbreak Heatmap Data State with rich initial West Bengal seed data
  const [outbreakData, setOutbreakData] = useState<{
    topOutbreakZones: any[];
    pincodeClusters: any[];
    totalDetections: number;
  }>({
    topOutbreakZones: [
      { rank: 1, district: 'Hooghly (Chinsurah)', pincode: '712101', topDisease: 'Late Blight', cropType: 'Potato', cases48h: 6, totalCases: 8, outbreakLevel: 'RED' },
      { rank: 2, district: 'Burdwan (Purba Bardhaman)', pincode: '713101', topDisease: 'Rice Blast', cropType: 'Paddy Rice', cases48h: 5, totalCases: 7, outbreakLevel: 'RED' },
      { rank: 3, district: 'Murshidabad (Baharampur)', pincode: '742101', topDisease: 'Yellow Rust', cropType: 'Wheat', cases48h: 3, totalCases: 4, outbreakLevel: 'YELLOW' }
    ],
    pincodeClusters: [
      { pincode: '712101', district: 'Hooghly', latitude: 22.9031, longitude: 88.3908, topDisease: 'Late Blight', cropType: 'Potato', totalCases: 8, cases48h: 6, outbreakLevel: 'RED', latestTimestamp: new Date().toISOString() },
      { pincode: '713101', district: 'Burdwan', latitude: 23.2324, longitude: 87.8615, topDisease: 'Rice Blast', cropType: 'Paddy Rice', totalCases: 7, cases48h: 5, outbreakLevel: 'RED', latestTimestamp: new Date().toISOString() },
      { pincode: '742101', district: 'Murshidabad', latitude: 24.1025, longitude: 88.2484, topDisease: 'Yellow Rust', cropType: 'Wheat', totalCases: 4, cases48h: 3, outbreakLevel: 'YELLOW', latestTimestamp: new Date().toISOString() },
      { pincode: '732101', district: 'Malda', latitude: 25.0044, longitude: 88.1458, topDisease: 'Aphid Vector', cropType: 'Mustard', totalCases: 2, cases48h: 2, outbreakLevel: 'GREEN', latestTimestamp: new Date().toISOString() },
      { pincode: '741101', district: 'Nadia', latitude: 23.4013, longitude: 88.4975, topDisease: 'Cercospora Leaf Spot', cropType: 'Jute', totalCases: 2, cases48h: 1, outbreakLevel: 'GREEN', latestTimestamp: new Date().toISOString() },
      { pincode: '722101', district: 'Bankura', latitude: 23.2313, longitude: 87.0784, topDisease: 'Stem Rot', cropType: 'Groundnut', totalCases: 1, cases48h: 1, outbreakLevel: 'GREEN', latestTimestamp: new Date().toISOString() },
      { pincode: '721101', district: 'Paschim Medinipur', latitude: 22.4257, longitude: 87.3199, topDisease: 'Bacterial Blight', cropType: 'Paddy Rice', totalCases: 3, cases48h: 2, outbreakLevel: 'YELLOW', latestTimestamp: new Date().toISOString() },
      { pincode: '734001', district: 'Siliguri', latitude: 26.7271, longitude: 88.3953, topDisease: 'Blister Blight', cropType: 'Tea', totalCases: 2, cases48h: 2, outbreakLevel: 'GREEN', latestTimestamp: new Date().toISOString() }
    ],
    totalDetections: 29
  });


  const [recentUploads, setRecentUploads] = useState([
    { name: 'Hooghly Field 12', time: '8m ago', dot: 'bg-[#FF4F4F]' },
    { name: 'Burdwan Zone 4', time: '2m ago', dot: 'bg-[#FF4F4F]' },
    { name: 'Murshidabad Plot 8', time: '31m ago', dot: 'bg-[#FFB347]' }
  ]);

  const [recentScans, setRecentScans] = useState([
    { field: 'Hooghly Pincode 712101', cropName: 'Potato', disease: '🔴 LATE BLIGHT DETECTED', confidence: '96%', time: '2m ago' },
    { field: 'Burdwan Pincode 713101', cropName: 'Paddy Rice', disease: '🔴 RICE BLAST DETECTED', confidence: '94%', time: '8m ago' },
    { field: 'Murshidabad Pincode 742101', cropName: 'Wheat', disease: '🟡 YELLOW RUST DETECTED', confidence: '88%', time: '15m ago' },
    { field: 'Malda Pincode 732101', cropName: 'Mustard', disease: '🟢 HEALTHY', confidence: '95%', time: '31m ago' },
    { field: 'Nadia Pincode 741101', cropName: 'Jute', disease: '🟢 HEALTHY', confidence: '97%', time: '1h ago' }
  ]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Terminal Animation Logic
  const [terminalIndex, setTerminalIndex] = useState(0);
  const lines = [
    "> Uploading field source...",
    "> Extracting visual data...",
    "> Running pathogen detection...",
    "> Generating report..."
  ];

  const fetchDetections = async (days: number) => {
    try {
      const res = await fetch(`/api/detections?days=${days}`);
      const data = await res.json();
      if (data.pincodeClusters) {
        setOutbreakData({
          topOutbreakZones: data.topOutbreakZones || [],
          pincodeClusters: data.pincodeClusters || [],
          totalDetections: data.totalDetections || 0
        });
      }
    } catch (e) {
      console.warn('Failed to fetch outbreak detections:', e);
    }
  };

  useEffect(() => {
    fetchDetections(daysFilter);
  }, [daysFilter]);

  useEffect(() => {
    if (uploadState === 'uploading') {
      const timer = setInterval(() => {
        setTerminalIndex(prev => (prev < lines.length ? prev + 1 : prev));
      }, 700);
      return () => clearInterval(timer);
    } else {
      setTerminalIndex(0);
    }
  }, [uploadState]);

  useEffect(() => {
    setIsMounted(true);
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-GB'));
    }, 1000);
    return () => clearInterval(interval);
  }, []);


  const resetUpload = () => {
    setUploadState('idle');
    setPreview(null);
    setResult(null);
    setErrorMsg('');
    setIsVideoScan(false);
    setFrameScanMsg('');
    setVideoFrameResults([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ─── IMAGE FRAME UTILITY ────────────────────────────────────────────────────
  const resizeImageFile = async (file: File): Promise<{ blob: Blob; previewUrl: string }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const maxDim = 1600;
        let w = img.naturalWidth || img.width;
        let h = img.naturalHeight || img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) { h = Math.round((h * maxDim) / w); w = maxDim; }
          else { w = Math.round((w * maxDim) / h); h = maxDim; }
        }
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d')?.drawImage(img, 0, 0, w, h);
        canvas.toBlob((blob) => {
          if (blob) resolve({ blob, previewUrl: canvas.toDataURL('image/jpeg', 0.85) });
          else reject(new Error('Failed to process image.'));
        }, 'image/jpeg', 0.85);
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Image could not be loaded. Please choose a valid JPG/PNG.')); };
      img.src = url;
    });
  };

  // ─── VIDEO FRAME EXTRACTION ─────────────────────────────────────────────────
  const extractVideoFrames = async (
    file: File,
    onFrame: (idx: number, total: number, thumbUrl: string, blob: Blob, tsSec: number) => void
  ): Promise<void> => {
    const MAX_DURATION = 30; // seconds
    const MAX_SIZE_MB = 30;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      throw new Error(`Video is too large (max ${MAX_SIZE_MB}MB). Please trim it first.`);
    }
    const RATIOS = [0.2, 0.4, 0.6, 0.8];
    const url = URL.createObjectURL(file);
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.src = url;
      video.muted = true;
      video.playsInline = true;
      video.preload = 'metadata';
      const masterTimeout = setTimeout(() => {
        URL.revokeObjectURL(url);
        reject(new Error('Video loading timed out. Try a shorter clip.'));
      }, 20000);

      video.onloadedmetadata = async () => {
        clearTimeout(masterTimeout);
        const duration = Math.min(video.duration || 10, MAX_DURATION);
        const maxW = 1024;
        let vw = video.videoWidth || 800;
        let vh = video.videoHeight || 600;
        if (vw > maxW) { vh = Math.round((vh * maxW) / vw); vw = maxW; }

        const canvas = document.createElement('canvas');
        canvas.width = vw; canvas.height = vh;
        const ctx = canvas.getContext('2d')!;

        const seekAndCapture = (ratio: number): Promise<{ blob: Blob; thumbUrl: string; tsSec: number }> =>
          new Promise((res, rej) => {
            const tsSec = duration * ratio;
            const seekTimer = setTimeout(() => rej(new Error(`Seek timed out at ${tsSec.toFixed(1)}s`)), 8000);
            video.onseeked = () => {
              clearTimeout(seekTimer);
              ctx.drawImage(video, 0, 0, vw, vh);
              canvas.toBlob((b) => {
                if (b) res({ blob: b, thumbUrl: canvas.toDataURL('image/jpeg', 0.75), tsSec });
                else rej(new Error('Canvas blob failed'));
              }, 'image/jpeg', 0.80);
            };
            video.currentTime = tsSec;
          });

        try {
          for (let i = 0; i < RATIOS.length; i++) {
            const { blob, thumbUrl, tsSec } = await seekAndCapture(RATIOS[i]);
            onFrame(i, RATIOS.length, thumbUrl, blob, tsSec);
          }
          URL.revokeObjectURL(url);
          resolve();
        } catch (e: any) {
          URL.revokeObjectURL(url);
          reject(e);
        }
      };
      video.onerror = () => {
        clearTimeout(masterTimeout);
        URL.revokeObjectURL(url);
        reject(new Error('Video format not supported. Please use MP4 or MOV.'));
      };
      video.load();
    });
  };

  // ─── ANALYZE A SINGLE FRAME BLOB VIA EXISTING /api/analyze ─────────────────
  const analyzeFrameBlob = async (blob: Blob, frameLabel: string): Promise<any> => {
    const formData = new FormData();
    formData.append('image', new File([blob], `${frameLabel}.jpg`, { type: 'image/jpeg' }));
    formData.append('language', 'en-IN');
    formData.append('transcript', `Video field scan – ${frameLabel}`);
    formData.append('pincode', '712101');
    const res = await fetch('/api/analyze', { method: 'POST', body: formData });
    const text = await res.text();
    let data: any;
    try { data = JSON.parse(text); } catch {
      throw new Error(res.ok ? 'Invalid JSON from server' : `HTTP ${res.status}`);
    }
    if (!res.ok || data.error) throw new Error(data?.error || `HTTP ${res.status}`);
    return data;
  };

  // ─── FULL VIDEO SCAN PIPELINE ────────────────────────────────────────────────
  const handleVideoScan = async (file: File) => {
    setIsVideoScan(true);
    setUploadState('uploading');
    setVideoFrameResults([]);
    setFrameScanMsg('> Loading video metadata...');

    // Collected frames in order; we fill placeholders first
    const collected: { blob: Blob; thumbUrl: string; tsSec: number }[] = [];
    const placeholders: FrameResult[] = [];

    try {
      await extractVideoFrames(file, (idx, total, thumbUrl, blob, tsSec) => {
        collected.push({ blob, thumbUrl, tsSec });
        const placeholder: FrameResult = {
          frameIndex: idx,
          timestamp: `${tsSec.toFixed(1)}s`,
          thumbUrl,
          status: 'analyzing',
          data: null
        };
        placeholders.push(placeholder);
        setVideoFrameResults([...placeholders]);
        setFrameScanMsg(`> Extracting frames... (${idx + 1}/${total})`);
        setPreview(thumbUrl);
      });
    } catch (err: any) {
      setErrorMsg(err?.message || 'Frame extraction failed.');
      setUploadState('error');
      return;
    }

    // Analyze frames with concurrency=2
    const results: FrameResult[] = [...placeholders];
    const CONCURRENCY = 2;
    for (let batch = 0; batch < collected.length; batch += CONCURRENCY) {
      const slice = collected.slice(batch, batch + CONCURRENCY);
      const idxSlice = Array.from({ length: slice.length }, (_, k) => batch + k);
      setFrameScanMsg(
        idxSlice.length === 1
          ? `> Analyzing frame ${batch + 1} of ${collected.length}...`
          : `> Analyzing frames ${batch + 1}–${batch + slice.length} of ${collected.length}...`
      );
      await Promise.all(slice.map(async ({ blob, tsSec }, k) => {
        const globalIdx = batch + k;
        try {
          const data = await analyzeFrameBlob(blob, `frame_${globalIdx + 1}_at_${tsSec.toFixed(1)}s`);
          results[globalIdx] = { ...results[globalIdx], status: 'done', data };
        } catch (e: any) {
          results[globalIdx] = { ...results[globalIdx], status: 'failed', error: e?.message || 'Inconclusive' };
        }
        setVideoFrameResults([...results]);
      }));
    }

    // Compute primary finding: highest-severity done frame
    const SEVERITY_ORDER = ['Critical', 'High', 'Medium', 'Low', 'Healthy'];
    const doneFrames = results.filter(r => r.status === 'done' && r.data);
    const primaryFrame = doneFrames.sort((a, b) => {
      const ai = SEVERITY_ORDER.indexOf(a.data.riskLevel || 'Healthy');
      const bi = SEVERITY_ORDER.indexOf(b.data.riskLevel || 'Healthy');
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    })[0];

    if (!primaryFrame) {
      setErrorMsg('All frames were inconclusive. Please try a different video.');
      setUploadState('error');
      return;
    }

    setResult(primaryFrame.data);
    setPreview(primaryFrame.thumbUrl);
    setUploadState('success');
    setFrameScanMsg(`> Analysis complete. Primary finding from frame at ${primaryFrame.timestamp}.`);

    // Update recents
    const d = primaryFrame.data;
    setRecentUploads(prev => [{ name: file.name, time: 'Just now', dot: 'bg-[#C8F53E]' }, ...prev.slice(0, 2)]);
    setRecentScans(prev => [{
      field: file.name,
      cropName: d.cropName || 'Unknown',
      disease: (d.disease || 'HEALTHY').toUpperCase(),
      confidence: typeof d.confidence === 'number' ? `${d.confidence}%` : (d.confidence || '—'),
      time: 'Just now'
    }, ...prev.slice(0, 4)]);
  };

  // ─── IMAGE SCAN PIPELINE ─────────────────────────────────────────────────────
  const handleImageScan = async (file: File) => {
    setIsVideoScan(false);
    setUploadState('uploading');
    setErrorMsg('');
    try {
      const { blob, previewUrl } = await resizeImageFile(file);
      setPreview(previewUrl);
      const formData = new FormData();
      formData.append('image', new File([blob], 'field_capture.jpg', { type: 'image/jpeg' }));
      formData.append('language', 'en-IN');
      formData.append('transcript', 'Field scan diagnosis');
      formData.append('pincode', '712101');
      const res = await fetch('/api/analyze', { method: 'POST', body: formData });
      const text = await res.text();
      let data: any = null;
      try { data = JSON.parse(text); } catch {
        throw new Error(res.ok ? 'Invalid JSON from server' : `HTTP ${res.status}`);
      }
      if (res.ok && !data.error) {
        setResult(data);
        setUploadState('success');
        setRecentUploads(prev => [{ name: file.name, time: 'Just now', dot: 'bg-[#C8F53E]' }, ...prev.slice(0, 2)]);
        setRecentScans(prev => [{
          field: file.name,
          cropName: data.cropName,
          disease: (data.disease || 'HEALTHY').toUpperCase(),
          confidence: typeof data.confidence === 'number' ? `${data.confidence}%` : (data.confidence || '90%'),
          time: 'Just now'
        }, ...prev.slice(0, 4)]);
      } else {
        setErrorMsg(data?.error || `Analysis failed (HTTP ${res.status})`);
        setUploadState('error');
      }
    } catch (err: any) {
      console.error('Image scan error:', err);
      setErrorMsg(err?.message || 'Network error occurred');
      setUploadState('error');
    }
  };

  // ─── DISPATCH HANDLER ────────────────────────────────────────────────────────
  const handleFileSelect = (file: File) => {
    setErrorMsg('');
    setVideoFrameResults([]);
    if (file.type.startsWith('video/')) {
      handleVideoScan(file);
    } else if (file.type.startsWith('image/')) {
      handleImageScan(file);
    } else {
      setErrorMsg('Unsupported file type. Please upload a JPG/PNG photo or MP4/MOV video.');
      setUploadState('error');
    }
  };

  const markers = [
    { pos: [20.5, 78.9], name: "India Hub" },
    { pos: [37.1, -95.7], name: "USA North" },
    { pos: [51.2, 10.4], name: "Europe Central" },
    { pos: [-14.2, -51.9], name: "Brazil Sector" },
    { pos: [-25.3, 133.8], name: "Australia South" }
  ];

  return (
    <div className="flex bg-[#060A04] text-white font-sans selection:bg-[#C8F53E] selection:text-[#060A04] min-h-screen">

      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;700;900&family=DM+Mono&display=swap');
        
        .font-bebas { font-family: 'Bebas Neue', sans-serif; }
        .font-mono { font-family: 'DM Mono', monospace; }

        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          animation: ticker 20s linear infinite;
        }

        @keyframes scan-line {
          0% { transform: translateY(0); }
          100% { transform: translateY(320px); }
        }
        .scan-line {
          height: 2px;
          background: #C8F53E;
          box-shadow: 0 0 15px 5px rgba(200, 245, 62, 0.5);
          width: 100%;
          position: absolute;
          z-index: 10;
          animation: scan-line 4s linear infinite;
        }

        @keyframes sweep {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .sweep-animation {
          position: absolute;
          left: 0;
          width: 100%;
          height: 2px;
          background: #C8F53E;
          box-shadow: 0 0 10px #C8F53E;
          z-index: 20;
          animation: sweep 3s infinite linear;
        }

        @keyframes draw-path {
          from { stroke-dashoffset: 400; }
          to { stroke-dashoffset: 0; }
        }
        .animate-path {
          stroke-dasharray: 400;
          stroke-dashoffset: 400;
          animation: draw-path 3s ease-out forwards;
        }

        .leaflet-container {
          background: #060A04 !important;
          border-radius: 2rem;
        }
      `}} />

      {/* SIDEBAR PRESERVED */}
      <aside className={`w-full lg:w-[260px] fixed h-screen bg-[#0A0E07] border-r border-[#C8F53E]/10 z-50 flex-col p-8 ${mobileMenuOpen ? 'flex' : 'hidden lg:flex'}`}>
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#C8F53E] flex items-center justify-center rounded-xl">
              <ShieldCheck className="text-[#060A04] w-6 h-6" />
            </div>
            <span className="font-bebas text-2xl tracking-widest text-[#C8F53E]">LEAF_OS V4</span>
          </div>
          <button className="lg:hidden text-white" onClick={() => setMobileMenuOpen(false)}>
            <XCircle size={24} />
          </button>
        </div>

        <nav className="flex-grow space-y-2">
          {[
            { label: 'COMMAND CENTER', icon: <Terminal size={18} />, active: true },
            { label: 'NEURAL SCANNER', icon: <Search size={18} /> },
            { label: 'GRID GEOGRAPHY', icon: <MapIcon size={18} /> },
            { label: 'VITALITY FEED', icon: <Activity size={18} /> },
            { label: 'BACKBONE INFRA', icon: <Database size={18} /> },
            { label: 'SYSTEM CONFIG', icon: <Settings size={18} /> }
          ].map((item, i) => (
            <div
              key={i}
              className={`flex items-center gap-4 px-6 py-4 rounded-xl cursor-pointer transition-all ${item.active ? 'bg-[#C8F53E]/10 text-[#C8F53E] border-l-[3px] border-l-[#C8F53E]' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}
            >
              {item.icon}
              <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
            </div>
          ))}
        </nav>

        <div className="mt-auto space-y-6">
          <Ticker />
          <div className="flex items-center justify-between px-4 py-2 bg-white/5 rounded-xl">
            <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">SYSTEM ALERTS</span>
            <span className="bg-[#FF4F4F] text-white text-[9px] font-black px-2 py-0.5 rounded-full">03</span>
          </div>
          <button className="w-full flex items-center justify-center gap-3 text-[#FF4F4F] hover:bg-[#FF4F4F]/10 py-4 rounded-xl transition-all border border-transparent hover:border-[#FF4F4F]/20">
            <LogOut size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">TERMINATE SESSION</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-grow ml-0 lg:ml-[260px] p-4 md:p-8 lg:p-12">
        {/* MOBILE HEADER BAR */}
        <div className="lg:hidden flex justify-between items-center mb-6 border-b border-white/5 pb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-[#C8F53E]" />
            <span className="font-bebas text-xl tracking-widest text-[#C8F53E]">LEAF_OS V4</span>
          </div>
          <button onClick={() => setMobileMenuOpen(true)}>
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        </div>

        {/* HEADER BAR PRESERVED */}
        <header className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-12 border-b border-white/5 pb-8">
          <div className="flex items-center gap-4">
            <ShieldCheck size={24} className="text-[#C8F53E]" />
            <div>
              <h1 className="font-bebas text-3xl tracking-wide italic">LEAFGUARD COMMAND</h1>
              <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">STATION: GRID-ALPHA-4 · SECURE</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 md:gap-10">
            <div className="px-4 py-2 rounded-full bg-[#C8F53E]/10 border border-[#C8F53E]/30 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#C8F53E] rounded-full animate-pulse" />
              <span className="text-[9px] font-black text-[#C8F53E] uppercase tracking-widest">SYSTEM NOMINAL</span>
            </div>

            <div className="hidden sm:flex items-center gap-3 text-white/60">
              <Clock size={16} className="text-[#C8F53E]" />
              <span className="font-mono text-xl font-black tracking-tighter">{time}</span>
            </div>

            <div className="hidden sm:flex items-center gap-6 md:pl-10 md:border-l border-white/5">
              <div className="relative cursor-pointer hover:scale-110 transition-transform">
                <Bell size={20} className="text-white/60" />
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#FF4F4F] rounded-full text-[8px] font-black flex items-center justify-center border-2 border-[#060A04]">3</span>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-black uppercase tracking-tight">OPERATOR@LEAFGUARD.AI</p>
                <p className="text-[9px] font-bold text-[#C8F53E] uppercase tracking-[0.3em]">LEVEL 4 OPERATOR</p>
              </div>
              <div className="w-10 h-10 bg-[#0F1409] rounded-xl flex items-center justify-center border border-white/10">
                <User size={20} className="text-[#C8F53E]" />
              </div>
              <LogOut size={18} className="text-white/20 hover:text-[#FF4F4F] cursor-pointer transition-colors" />
            </div>
          </div>
        </header>

        {/* TOP 3 OUTBREAK ZONES SUMMARY CARDS */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-black italic tracking-wide">🚨 TOP 3 OUTBREAK ZONES THIS WEEK</h2>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">REAL-TIME EPIDEMIOLOGICAL SURVEILLANCE · WEST BENGAL REGION</p>
            </div>
            <div className="flex items-center gap-2 bg-[#0F1409] p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setDaysFilter(7)}
                className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${daysFilter === 7 ? 'bg-[#C8F53E] text-[#060A04]' : 'text-white/40 hover:text-white'}`}
              >
                LAST 7 DAYS
              </button>
              <button
                onClick={() => setDaysFilter(30)}
                className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${daysFilter === 30 ? 'bg-[#C8F53E] text-[#060A04]' : 'text-white/40 hover:text-white'}`}
              >
                LAST 30 DAYS
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {outbreakData.topOutbreakZones.slice(0, 3).map((zone, idx) => {
              const isRed = zone.outbreakLevel === 'RED';
              const isYellow = zone.outbreakLevel === 'YELLOW';
              const borderColor = isRed ? 'border-[#FF4F4F]/40' : isYellow ? 'border-[#FFB347]/40' : 'border-[#C8F53E]/40';
              const badgeBg = isRed ? 'bg-[#FF4F4F]' : isYellow ? 'bg-[#FFB347]' : 'bg-[#C8F53E]';
              const badgeText = isRed ? 'OUTBREAK ALERT' : isYellow ? 'MODERATE RISK' : 'LOW RISK';

              return (
                <div
                  key={zone.pincode || idx}
                  className={`bg-[#0F1409] p-6 rounded-3xl border ${borderColor} relative overflow-hidden group hover:scale-[1.02] transition-all`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-[9px] font-black text-[#C8F53E] uppercase tracking-widest">
                        RANK #{idx + 1} · PIN {zone.pincode}
                      </span>
                      <h3 className="text-lg font-black text-white mt-1">{zone.district}</h3>
                    </div>
                    <span className={`${badgeBg} text-[#060A04] text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider`}>
                      {badgeText}
                    </span>
                  </div>

                  <div className="space-y-2 font-mono text-[11px] border-t border-white/5 pt-3">
                    <div className="flex justify-between">
                      <span className="text-white/40">Primary Disease:</span>
                      <span className="font-bold text-white">{zone.topDisease}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40">Affected Crop:</span>
                      <span className="font-bold text-white">{zone.cropType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40">48h Detection Density:</span>
                      <span className={`font-black ${isRed ? 'text-[#FF4F4F]' : 'text-[#C8F53E]'}`}>
                        {zone.cases48h} cases
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* HEATMAP MAP + UPLOAD ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 mb-12">
          {/* Outbreak Heatmap Map Column — dynamic(ssr:false) handles client-only safely */}
          <div className="bg-[#0F1409] rounded-[3rem] border border-white/5 relative overflow-hidden h-[280px] md:h-[450px]">
            <OutbreakHeatmap clusters={outbreakData.pincodeClusters} />


            <div className="absolute top-6 right-6 z-[1000] flex items-center gap-3 px-4 py-2 bg-[#060A04]/80 backdrop-blur-md rounded-full border border-[#C8F53E]/30">
              <span className="w-2 h-2 bg-[#FF4F4F] rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-[#C8F53E] uppercase tracking-widest">PUBLIC HEALTH SURVEILLANCE</span>
            </div>

            <div className="absolute bottom-6 left-6 z-[1000] bg-[#060A04]/85 backdrop-blur-md p-4 rounded-2xl border border-white/10 font-mono text-[10px]">
              <p className="font-black text-white/40 uppercase tracking-widest mb-2">Outbreak Intensity Legend</p>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-[#FF4F4F] rounded-full" />
                  <span className="font-bold text-white">Outbreak Level (5+ cases in 48h)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-[#FFB347] rounded-full" />
                  <span className="font-bold text-white/80">Moderate Clusters (3-4 cases)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-[#C8F53E] rounded-full" />
                  <span className="font-bold text-white/60">Low Density (1-2 cases)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Upload Column */}
          <div className="bg-[#0F1409] rounded-[3rem] border border-white/5 flex flex-col relative overflow-hidden group">
            <input 
              type="file" 
              accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/mov" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={(e) => { 
                const f = e.target.files?.[0]; if(f) handleFileSelect(f); 
              }}
            />
            
            {/* Background Layer */}
            <div className="absolute inset-0 z-0">
              {preview ? (
                <div className="w-full h-full relative">
                  <img src={preview} className="w-full h-full object-cover opacity-30" />
                  {uploadState === 'uploading' && <div className="scan-line" />}
                </div>
              ) : (
                <video 
                  autoPlay muted loop playsInline 
                  className="w-full h-full object-cover opacity-20"
                >
                  <source src="/238827.mp4" type="video/mp4" />
                </video>
              )}
              {/* Grid Overlay */}
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
              <div 
                className="absolute inset-0" 
                style={{ backgroundImage: 'linear-gradient(rgba(200,245,62,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(200,245,62,0.05) 1px, transparent 1px)', backgroundSize: '20px 20px' }} 
              />
            </div>

            {/* UI Content Layer */}
            <div className="relative z-10 flex-grow flex flex-col p-8">
              {uploadState === 'idle' && (
                <div 
                  className="flex-grow flex flex-col items-center justify-center text-center cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {/* Targeting Brackets */}
                  <div className="absolute top-10 left-10 w-8 h-8 border-t-2 border-l-2 border-[#C8F53E]" />
                  <div className="absolute top-10 right-10 w-8 h-8 border-t-2 border-r-2 border-[#C8F53E]" />
                  <div className="absolute bottom-40 left-10 w-8 h-8 border-b-2 border-l-2 border-[#C8F53E]" />
                  <div className="absolute bottom-40 right-10 w-8 h-8 border-b-2 border-r-2 border-[#C8F53E]" />

                  <div className="w-16 h-16 rounded-full bg-[#C8F53E]/10 flex items-center justify-center text-[#C8F53E] mb-6 animate-pulse">
                    <Upload size={28} />
                  </div>
                  <h3 className="text-xl font-black mb-2 uppercase tracking-tight">INITIALIZE SCAN</h3>
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-3">PHOTO OR VIDEO</p>
                  <div className="flex items-center gap-2 mb-8 text-[8px] font-mono text-white/20 uppercase">
                    <span className="flex items-center gap-1"><Upload size={9} /> JPG · PNG</span>
                    <span className="text-white/10">|</span>
                    <span className="flex items-center gap-1"><Film size={9} /> MP4 · MOV · MAX 30MB</span>
                  </div>
                  <button className="bg-[#C8F53E] text-[#060A04] px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-2xl">UPLOAD SOURCE</button>
                </div>
              )}

              {uploadState === 'uploading' && (
                <div className="flex-grow flex flex-col justify-center font-mono text-[10px] space-y-3 px-2">
                  <div className="sweep-animation" />
                  {isVideoScan ? (
                    <>
                      <div className="flex items-center gap-3 mb-2">
                        <Film size={16} className="text-[#C8F53E] animate-pulse" />
                        <span className="text-[#C8F53E] font-black uppercase tracking-widest text-[9px]">VIDEO SCAN IN PROGRESS</span>
                      </div>
                      <p className="text-[#C8F53E]/80 tracking-wide self-start">{frameScanMsg}<span className="animate-pulse">_</span></p>
                      {videoFrameResults.length > 0 && (
                        <div className="grid grid-cols-2 gap-2 pt-2">
                          {videoFrameResults.map((fr) => (
                            <div key={fr.frameIndex} className="relative rounded-xl overflow-hidden border border-white/10 aspect-video">
                              <img src={fr.thumbUrl} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                {fr.status === 'analyzing' && <span className="w-4 h-4 border-2 border-[#C8F53E] border-t-transparent rounded-full animate-spin" />}
                                {fr.status === 'done' && <CheckCircle size={14} className="text-[#C8F53E]" />}
                                {fr.status === 'failed' && <XCircle size={14} className="text-[#FF4F4F]" />}
                              </div>
                              <span className="absolute bottom-1 left-1 text-[8px] font-mono text-white/60 bg-black/60 px-1 rounded">{fr.timestamp}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    lines.slice(0, terminalIndex).map((line, i) => (
                      <p key={i} className="text-[#C8F53E] tracking-widest uppercase self-start">
                        {line}
                        {i === terminalIndex - 1 && <span className="animate-pulse">_</span>}
                      </p>
                    ))
                  )}
                </div>
              )}

              {uploadState === 'success' && (
                <div className="flex-grow flex flex-col justify-center gap-4">
                  {/* Primary Finding Card */}
                  <div className="bg-black/80 backdrop-blur-md p-5 rounded-3xl border border-[#C8F53E]/30 space-y-3">
                    <div className="flex items-center gap-2 text-[#C8F53E]">
                      <CheckCircle size={14} />
                      <span className="text-[9px] font-black uppercase tracking-widest">
                        {isVideoScan ? 'VIDEO SCAN COMPLETE' : 'ANALYSIS COMPLETE'}
                      </span>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-white/30 uppercase mb-1">PRIMARY FINDING</p>
                      <p className="text-base font-black italic text-white uppercase leading-tight">{result?.disease}</p>
                      {result?.cropName && <p className="text-[10px] text-white/40 mt-0.5">{result.cropName}</p>}
                    </div>
                    <button
                      onClick={resetUpload}
                      className="w-full bg-[#C8F53E] text-[#060A04] py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                    >
                      NEW SCAN
                    </button>
                  </div>

                  {/* Video frame thumbnails */}
                  {isVideoScan && videoFrameResults.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-[8px] font-black text-white/30 uppercase tracking-widest">FRAME RESULTS</p>
                      <div className="grid grid-cols-2 gap-2">
                        {videoFrameResults.map((fr) => {
                          const riskLevel = fr.data?.riskLevel || '';
                          const borderCol = riskLevel === 'Critical' || riskLevel === 'High'
                            ? 'border-[#FF4F4F]/60'
                            : riskLevel === 'Medium'
                            ? 'border-[#FFB347]/60'
                            : fr.status === 'failed'
                            ? 'border-white/10'
                            : 'border-[#C8F53E]/30';
                          return (
                            <div key={fr.frameIndex} className={`relative rounded-xl overflow-hidden border ${borderCol} aspect-video bg-black/60`}>
                              <img src={fr.thumbUrl} className="w-full h-full object-cover opacity-80" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                              <div className="absolute bottom-0 left-0 right-0 p-1.5">
                                {fr.status === 'done' ? (
                                  <>
                                    <p className="text-[8px] font-black text-white leading-tight truncate">{fr.data?.disease || '—'}</p>
                                    <p className="text-[7px] text-[#C8F53E] font-mono">
                                      {typeof fr.data?.confidence === 'number' ? `${fr.data.confidence}%` : fr.data?.confidence || ''} · {fr.timestamp}
                                    </p>
                                  </>
                                ) : (
                                  <p className="text-[8px] text-white/40">Inconclusive · {fr.timestamp}</p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {uploadState === 'error' && (
                <div className="flex-grow flex flex-col items-center justify-center text-center">
                  <XCircle size={40} className="text-[#FF4F4F] mb-4" />
                  <p className="text-sm font-black uppercase mb-2">SYSTEM ERROR</p>
                  <p className="text-[10px] text-white/40 mb-6 px-4">{errorMsg}</p>
                  <button onClick={resetUpload} className="bg-[#FF4F4F] text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest">RETRY UPLINK</button>
                </div>
              )}

              {/* Recent Uploads Footer */}
              <div className="mt-auto pt-8 border-t border-white/5">
                <p className="text-[9px] font-black text-white/40 uppercase tracking-widest flex items-center gap-2 mb-4"><RotateCcw size={12} /> RECENT UPLOADS</p>
                <div className="space-y-3">
                  {recentUploads.map((up, i) => (
                    <div key={i} className="flex justify-between items-center px-4 py-3 bg-black/40 rounded-xl border border-white/5">
                      <div className="flex items-center gap-3">
                        <span className={`w-1.5 h-1.5 rounded-full ${up.dot}`} />
                        <span className="text-[10px] font-bold text-white/60">{up.name}</span>
                      </div>
                      <span className="text-[8px] font-mono text-white/20 uppercase">{up.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Results Section */}
        {uploadState === 'success' && result && (
          <div className="mt-12 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
              {[
                { label: 'CROP NAME', val: result.cropName },
                { label: 'DISEASE DETECTED', val: result.disease },
                { label: 'RISK LEVEL', val: result.riskLevel, color: 
                  result.riskLevel === 'Critical' ? 'text-[#FF4F4F]' :
                  result.riskLevel === 'High' ? 'text-orange-400' :
                  result.riskLevel === 'Medium' ? 'text-yellow-400' : 'text-[#C8F53E]'
                }
              ].map((item, i) => (
                <div key={i} className="bg-[#0F1409] p-6 rounded-2xl border border-[#C8F53E]/10">
                  <p className="text-[10px] font-black text-[#C8F53E]/40 uppercase mb-2 tracking-widest">{item.label}</p>
                  <p className={`text-xl font-bold font-mono uppercase ${item.color || 'text-white'}`}>{item.val}</p>
                </div>
              ))}
            </div>
            
            <div className="bg-[#0F1409] p-8 rounded-3xl border border-[#C8F53E]/10">
              <p className="text-[10px] font-black text-[#C8F53E]/40 uppercase mb-4 tracking-widest">HEALTH SCORE</p>
              <div className="h-3 bg-white/5 rounded-full overflow-hidden mb-3">
                <div 
                  className="h-full bg-[#C8F53E] transition-all duration-1000 shadow-[0_0_15px_#C8F53E]" 
                  style={{ width: `${Math.min(100, Math.max(0, Number(result.healthScore)))}%` }} 
                />
              </div>
              <p className="text-right font-mono text-xl font-bold text-[#C8F53E]">{Math.min(100, Math.max(0, Number(result.healthScore)))}%</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#0F1409] p-8 rounded-3xl border border-[#C8F53E]/10 space-y-6">
                <div>
                  <p className="text-[10px] font-black text-[#C8F53E]/40 uppercase mb-4 tracking-widest">RECOMMENDED TREATMENT</p>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                    <p className="text-[11px] text-[#C8F53E] font-bold uppercase mb-1">PESTICIDE</p>
                    <p className="font-mono text-white/90">{result.pesticide}</p>
                  </div>
                </div>
                <div>
                  <p className="text-[11px] text-[#C8F53E] font-bold uppercase mb-1">DOSAGE & TIMING</p>
                  <p className="font-mono text-white/90">{result.dosage}</p>
                </div>
              </div>
              
              <div className="bg-[#0F1409] p-8 rounded-3xl border border-[#C8F53E]/10">
                <p className="text-[10px] font-black text-[#C8F53E]/40 uppercase mb-6 tracking-widest">ACTION PLAN</p>
                <div className="space-y-4">
                  {result.actionPlan.map((step: string, i: number) => (
                    <div key={i} className="flex gap-4 items-start">
                      <span className="w-6 h-6 rounded-lg bg-[#C8F53E]/10 text-[#C8F53E] flex items-center justify-center font-mono text-xs border border-[#C8F53E]/20">{i + 1}</span>
                      <p className="text-sm text-white/70 font-medium pt-0.5">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* WEATHER SPREAD RISK FORECAST */}
            {result.diseaseRisk && result.weather && (
              <div className="bg-[#0F1409] p-8 rounded-3xl border border-[#C8F53E]/20 space-y-4">
                <div className="flex justify-between items-center flex-wrap gap-4">
                  <div>
                    <p className="text-[10px] font-black text-[#C8F53E] uppercase tracking-widest">🌦️ 5-DAY WEATHER & SPREAD RISK FORECAST</p>
                    <p className="text-xs text-white/50">{result.weather.locationName}</p>
                  </div>
                  <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${
                    result.diseaseRisk.riskLevel === 'High' ? 'bg-[#FF4F4F] text-white' :
                    result.diseaseRisk.riskLevel === 'Moderate' ? 'bg-[#FFB347] text-[#060A04]' : 'bg-[#C8F53E] text-[#060A04]'
                  }`}>
                    {result.diseaseRisk.riskLevel} SPREAD RISK ({result.diseaseRisk.riskScore}/100)
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {result.weather.forecast?.map((f: any, i: number) => (
                    <div key={i} className="bg-white/5 p-3 rounded-xl border border-white/5 text-center">
                      <p className="text-[10px] font-bold text-white/60">{f.day}</p>
                      <p className="text-xl my-1">{f.icon}</p>
                      <p className="text-xs font-bold text-white">{f.temp}°C</p>
                      <p className="text-[9px] text-[#C8F53E] mt-1">💧 {f.humidity}%</p>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-white/80 font-mono bg-black/40 p-4 rounded-xl border border-white/5">
                  ⚠️ {result.diseaseRisk.explanation}
                </p>
              </div>
            )}

            {/* NEAREST AGRI-SUPPLIERS & DEALERS */}
            {result.dealers && result.dealers.length > 0 && (
              <div className="bg-[#0F1409] p-8 rounded-3xl border border-[#C8F53E]/10 space-y-4">
                <p className="text-[10px] font-black text-[#C8F53E] uppercase tracking-widest">📍 NEAREST VERIFIED AGRI-INPUT SUPPLIERS</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {result.dealers.map((d: any) => (
                    <div key={d.id} className="bg-white/5 p-4 rounded-2xl border border-white/5 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-sm font-bold text-white">{d.name}</p>
                          <span className="text-[9px] bg-[#C8F53E]/20 text-[#C8F53E] font-bold px-2 py-0.5 rounded">★ {d.rating}</span>
                        </div>
                        <p className="text-[11px] text-white/50 mb-2">📍 {d.address}</p>
                        <p className="text-[10px] text-[#C8F53E] font-mono mb-3">🏷️ {d.specialization}</p>
                      </div>
                      <a href={`tel:${d.phone.replace(/\s+/g, '')}`} className="w-full text-center bg-[#C8F53E] text-[#060A04] py-2 rounded-xl text-[10px] font-black uppercase tracking-wider block">
                        📞 {d.phone}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* GOVERNMENT SCHEMES */}
            {result.schemes && result.schemes.length > 0 && (
              <div className="bg-[#0F1409] p-8 rounded-3xl border border-[#C8F53E]/10 space-y-4">
                <p className="text-[10px] font-black text-[#C8F53E] uppercase tracking-widest">🏛️ APPLICABLE GOVERNMENT RELIEF & SCHEMES</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.schemes.map((s: any) => (
                    <div key={s.id} className="bg-white/5 p-5 rounded-2xl border border-white/5 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-sm font-bold text-white">{s.name}</p>
                          <span className="text-[8px] bg-[#C8F53E] text-[#060A04] font-black px-2 py-0.5 rounded-full">{s.badge}</span>
                        </div>
                        <p className="text-xs text-white/70 mb-3">{s.description}</p>
                        <p className="text-[10px] text-white/40 mb-3"><strong>Eligibility:</strong> {s.eligibility_note}</p>
                      </div>
                      <a href={s.official_link} target="_blank" rel="noreferrer" className="w-full text-center border border-[#C8F53E] text-[#C8F53E] hover:bg-[#C8F53E] hover:text-[#060A04] transition-colors py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider block">
                        OFFICIAL PORTAL →
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-[#C8F53E]/5 p-8 rounded-3xl border border-[#C8F53E]/10 flex gap-6 items-center">
              <div className="w-12 h-12 rounded-full bg-[#C8F53E] flex items-center justify-center shrink-0">
                <ShieldCheck className="text-[#060A04] w-6 h-6" />
              </div>
              <p className="text-sm text-white/60 font-medium">
                <span className="text-[#C8F53E] font-bold uppercase tracking-wider mr-2 font-mono">FUN FACT:</span>
                {result.funFact}
              </p>
            </div>

            <button 
              onClick={resetUpload}
              className="w-full bg-[#C8F53E] text-[#060A04] py-6 rounded-2xl font-black text-xs uppercase tracking-[0.4em] hover:scale-[1.01] active:scale-[0.99] transition-all shadow-2xl shadow-[#C8F53E]/10"
            >
              SCAN ANOTHER FIELD →
            </button>
          </div>
        )}

        {/* STATS ROW PRESERVED */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6 mb-12">
          {[
            { label: 'AMBIENT TEMP', val: '15°C', icon: <Thermometer size={14} /> },
            { label: 'SOIL HUMIDITY', val: '54%', icon: <CloudRain size={14} /> },
            { label: 'CROP STAGE', val: 'Flowering', icon: <Wind size={14} />, color: 'text-[#C8F53E]' },
            { label: 'ACTIVE ALERTS', val: '3 Critical', icon: <AlertTriangle size={14} />, color: 'text-[#FF4F4F]' },
            { label: 'DRONES ACTIVE', val: '2/5', icon: <Activity size={14} />, color: 'text-[#C8F53E]' },
            { label: 'SECTOR COVERAGE', val: '142.5 Ha', icon: <Globe size={14} /> }
          ].map((stat, i) => (
            <div key={i} className="bg-[#0F1409] p-4 md:p-8 rounded-xl md:rounded-[2rem] border border-white/5 hover:border-[#C8F53E]/30 transition-all group">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">{stat.label}</span>
                <div className="text-[#C8F53E]/30 group-hover:text-[#C8F53E] transition-colors">{stat.icon}</div>
              </div>
              <p className={`font-bebas text-3xl md:text-5xl italic ${stat.color || 'text-white'}`}>{stat.val}</p>
            </div>
          ))}
        </div>

        {/* SCAN RESULT + RECENT SCANS ROW */}
        <div className="grid grid-cols-1 xl:grid-cols-[450px_1fr] gap-8 mb-12">
          {/* Scan Panel */}
          <div className="bg-[#0F1409] rounded-[3rem] border border-white/5 p-6 md:p-10 flex flex-col h-full relative overflow-hidden">
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full ${uploadState === 'uploading' ? 'bg-[#FFB347]' : 'bg-[#C8F53E]'} animate-pulse`} />
                <p className="text-[10px] font-black text-[#C8F53E] uppercase tracking-[0.4em]">{uploadState === 'uploading' ? 'SCANNING IN PROGRESS' : 'NEURAL SCAN RESULT'}</p>
              </div>
              <span className="text-[9px] text-white/30 uppercase tracking-widest">LIVE UPLINK</span>
            </div>

            <div className="relative flex-grow bg-black/60 rounded-[2.5rem] border border-white/10 overflow-hidden mb-10 min-h-[320px]">
              <img src={preview || "https://images.unsplash.com/photo-1595113316349-9fa4ee24f884?w=800&q=80"} className={`w-full h-full object-cover ${preview ? 'opacity-100' : 'grayscale opacity-20'}`} alt="Field Scan" />
              {uploadState === 'uploading' && <div className="scan-line" />}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Target className={`text-[#C8F53E] w-32 h-32 ${uploadState === 'uploading' ? 'opacity-100 scale-110' : 'opacity-20'} transition-all duration-500 animate-pulse`} />
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-2 font-mono">FIELD HEALTH SCORE</p>
                  <p className="text-8xl font-bebas italic text-[#C8F53E] leading-none">{result?.healthScore || 78}<span className="text-2xl text-white/10 ml-2 font-sans not-italic">/100</span></p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { l: 'DETECTED', v: result?.disease?.toUpperCase() || 'MODERATE FUNGAL STRESS', c: 'text-white' },
                  { l: 'CROP', v: result?.cropName?.toUpperCase() || 'RICE', c: 'text-white' }
                ].map((row, i) => (
                  <div key={i} className="flex justify-between items-center p-4 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] font-mono">{row.l}</span>
                    <span className={`text-[10px] font-black uppercase italic ${row.c}`}>{row.v}</span>
                  </div>
                ))}
              </div>

              <button className="w-full bg-[#C8F53E] text-[#060A04] py-6 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-2xl">
                VIEW FULL REPORT <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Table Panel */}
          <div className="bg-[#0F1409] rounded-[3rem] border border-white/5 p-10 flex flex-col">
            <div className="flex justify-between items-center mb-12">
              <h2 className="font-bebas text-4xl italic tracking-wide">RECENT SCANS</h2>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-[#C8F53E]/30 text-[#C8F53E] px-8 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#C8F53E]/5 transition-all"
              >
                + NEW SCAN
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-white/5">
                  <tr>
                    {['FIELD', 'CROP', 'DISEASE', 'CONF', 'TIME'].map((h, i) => (
                      <th key={i} className="pb-6 text-[9px] font-black text-white/30 uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {recentScans.map((row, i) => (
                    <tr key={i} className="group hover:bg-[#C8F53E]/[0.03] transition-all">
                      <td className="py-6 font-bold text-white text-xs">{row.field}</td>
                      <td className="py-6 text-[10px] text-white/50">{row.cropName}</td>
                      <td className="py-6 text-[10px] text-white/50">{row.disease}</td>
                      <td className="py-6 text-[11px] font-black text-[#C8F53E]">{row.confidence}</td>
                      <td className="py-6 text-[10px] text-white/30">{row.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* INFRASTRUCTURE MONITORING */}
        <section className="bg-[#0F1409] rounded-[3rem] border border-white/5 p-6 md:p-12 overflow-hidden">
          <div className="flex justify-between items-center mb-12">
            <h2 className="font-bebas text-4xl italic tracking-wide">INFRASTRUCTURE MONITORING</h2>
            <button className="bg-[#C8F53E]/10 text-[#C8F53E] px-8 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border border-[#C8F53E]/20 hover:bg-[#C8F53E]/20 transition-all">+ ADD MONITOR</button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[min(400px,100%)_1fr] gap-12">
            <div className="space-y-4">
              <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-6">ACTIVE ENDPOINTS</p>
              {[
                { name: 'API Gateway', url: 'api.CropGuard.ai', ping: '42ms' },
                { name: 'AI Model Server', url: 'model.CropGuard.ai', ping: '118ms' },
                { name: 'Drone Uplink', url: 'drone.CropGuard.ai', ping: '67ms' }
              ].map((node, i) => (
                <div key={i} className="bg-black/40 border border-white/5 p-6 rounded-[2rem] flex items-center justify-between group hover:border-[#C8F53E]/30 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-[#C8F53E] rounded-full animate-pulse shadow-[0_0_10px_#C8F53E]" />
                    <div>
                      <p className="text-xs font-black italic">{node.name}</p>
                      <p className="text-[9px] font-mono text-white/30">{node.url}</p>
                    </div>
                  </div>
                  <span className="font-mono text-xl text-[#C8F53E] italic font-black">{node.ping}</span>
                </div>
              ))}
            </div>

            <div className="bg-black/40 border border-white/5 rounded-[3rem] p-10 relative flex flex-col justify-end min-h-[300px]">
              <div className="absolute top-10 left-10">
                <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-2">RESPONSE TIME HISTORY</p>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#C8F53E] rounded-full" />
                    <span className="text-[8px] font-black text-white/40 uppercase">Latency (ms)</span>
                  </div>
                </div>
              </div>

              <div className="relative h-40 w-full">
                {/* Subtle Grid Lines */}
                <div className="absolute inset-0 flex flex-col justify-between opacity-5">
                  {[0, 1, 2, 3].map(i => <div key={i} className="h-px w-full bg-white" />)}
                </div>

                <svg className="h-full w-full overflow-visible" viewBox="0 0 400 100" preserveAspectRatio="none">
                  <motion.path
                    d="M0,80 L40,60 L80,90 L120,40 L160,70 L200,30 L240,50 L280,20 L320,60 L360,40 L400,50"
                    fill="none"
                    stroke="#C8F53E"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="animate-path"
                  />
                  <path
                    d="M0,80 L40,60 L80,90 L120,40 L160,70 L200,30 L240,50 L280,20 L320,60 L360,40 L400,50 V100 H0 Z"
                    fill="url(#gradient-infra)"
                    className="opacity-10"
                  />
                  <defs>
                    <linearGradient id="gradient-infra" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#C8F53E" />
                      <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div className="flex justify-between pt-8 text-[9px] font-black text-white/20 uppercase tracking-widest font-mono">
                <span>5m ago</span>
                <span>4m ago</span>
                <span>3m ago</span>
                <span>2m ago</span>
                <span>1m ago</span>
                <span className="text-[#C8F53E]">Now</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
