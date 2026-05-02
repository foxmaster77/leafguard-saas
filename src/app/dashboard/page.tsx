'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  ShieldCheck, Terminal, Search, Map as MapIcon, Activity, Database, Settings,
  LogOut, Bell, Clock, User, Upload, AlertTriangle, Thermometer, CloudRain,
  Wind, Globe, ArrowRight, RotateCcw, Target, CheckCircle, XCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Dynamically import Leaflet with no SSR
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const CircleMarker = dynamic(() => import('react-leaflet').then(mod => mod.CircleMarker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

import 'leaflet/dist/leaflet.css';

const Ticker = () => (
  <div className="bg-black/40 rounded-xl p-4 overflow-hidden relative border border-white/5">
    <div className="ticker-container flex whitespace-nowrap">
      <div className="ticker-text text-[9px] font-black text-[#C8F53E] uppercase tracking-widest animate-ticker">
        RICE PRICES UP 12% · SWARM WARNING: NORTH · SUBSIDY PROGRAM OPEN · PADDY SOWING: 48H ·
        RICE PRICES UP 12% · SWARM WARNING: NORTH · SUBSIDY PROGRAM OPEN · PADDY SOWING: 48H ·
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const [time, setTime] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [preview, setPreview] = useState<string | null>(null);
  
  // New States for Task
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [recentUploads, setRecentUploads] = useState([
    { name: 'North Block', time: '8m ago', dot: 'bg-[#C8F53E]' },
    { name: 'Zone 7', time: '2m ago', dot: 'bg-[#FFB347]' },
    { name: 'Sector 4-B', time: '31m ago', dot: 'bg-[#FF4F4F]' }
  ]);
  const [recentScans, setRecentScans] = useState([
    { f: 'Sector 4-B', c: 'Soybean', s: '🔴 RUST DETECTED', co: '94%', t: '2m ago' },
    { f: 'North Block', c: 'Wheat', s: '🟢 HEALTHY', co: '97%', t: '8m ago' },
    { f: 'Zone 7', c: 'Cotton', s: '🟡 MOISTURE STRESS', co: '88%', t: '15m ago' },
    { f: 'East Grid', c: 'Maize', s: '🔴 APHID RISK', co: '91%', t: '31m ago' },
    { f: 'South Field', c: 'Rice', s: '🟢 HEALTHY', co: '95%', t: '1h ago' }
  ]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

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
    setScanResult(null);
    setErrorMsg(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadState('uploading');
    setPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      
      if (data.success) {
        setScanResult(data.report);
        setUploadState('success');
        // Update Recents
        setRecentUploads(prev => [{ name: file.name, time: 'Just now', dot: 'bg-[#C8F53E]' }, ...prev.slice(0, 2)]);
      } else {
        setErrorMsg(data.error || 'Analysis failed');
        setUploadState('error');
      }
    } catch (err) {
      setErrorMsg('Network error occurred');
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

  if (!isMounted) return <div className="bg-[#060A04] min-h-screen" />;

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
      <aside className="w-[260px] fixed h-screen bg-[#0A0E07] border-r border-[#C8F53E]/10 z-50 flex flex-col p-8">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-[#C8F53E] flex items-center justify-center rounded-xl">
            <ShieldCheck className="text-[#060A04] w-6 h-6" />
          </div>
          <span className="font-bebas text-2xl tracking-widest text-[#C8F53E]">LEAF_OS V4</span>
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
      <main className="flex-grow ml-[260px] p-12">
        {/* HEADER BAR PRESERVED */}
        <header className="flex justify-between items-center mb-12 border-b border-white/5 pb-8">
          <div className="flex items-center gap-4">
            <ShieldCheck size={24} className="text-[#C8F53E]" />
            <div>
              <h1 className="font-bebas text-3xl tracking-wide italic">LEAFGUARD COMMAND</h1>
              <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">STATION: GRID-ALPHA-4 · SECURE</p>
            </div>
          </div>

          <div className="flex items-center gap-10">
            <div className="px-4 py-2 rounded-full bg-[#C8F53E]/10 border border-[#C8F53E]/30 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#C8F53E] rounded-full animate-pulse" />
              <span className="text-[9px] font-black text-[#C8F53E] uppercase tracking-widest">SYSTEM NOMINAL</span>
            </div>

            <div className="flex items-center gap-3 text-white/60">
              <Clock size={16} className="text-[#C8F53E]" />
              <span className="font-mono text-xl font-black tracking-tighter">{time}</span>
            </div>

            <div className="flex items-center gap-6 pl-10 border-l border-white/5">
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

        {/* MAP + UPLOAD ROW */}
        <div className="grid lg:grid-cols-[1fr_320px] gap-8 mb-12">
          {/* Map Column PRESERVED */}
          <div className="bg-[#0F1409] rounded-[3rem] border border-white/5 relative overflow-hidden h-[380px]">
            {isMounted && (
              <MapContainer center={[20, 0]} zoom={2} scrollWheelZoom={false} className="h-full w-full">
                <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                {markers.map((m, i) => (
                  <CircleMarker
                    key={i}
                    center={m.pos as any}
                    radius={6}
                    pathOptions={{ color: '#C8F53E', fillColor: '#C8F53E', fillOpacity: 0.6 }}
                  >
                    <Popup className="bg-[#0F1409] text-white">
                      <p className="font-bebas text-lg italic">{m.name}</p>
                      <p className="text-[10px] font-black uppercase text-[#C8F53E]">Status: Active</p>
                    </Popup>
                  </CircleMarker>
                ))}
              </MapContainer>
            )}

            <div className="absolute top-6 right-6 z-[1000] flex items-center gap-3 px-4 py-2 bg-[#060A04]/80 backdrop-blur-md rounded-full border border-[#C8F53E]/30">
              <span className="w-2 h-2 bg-[#C8F53E] rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-[#C8F53E] uppercase tracking-widest">DRONE ACTIVE</span>
            </div>

            <div className="absolute bottom-6 left-6 z-[1000] bg-[#060A04]/80 backdrop-blur-md p-4 rounded-2xl border border-white/10">
              <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-3">Satellite Overlay</p>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-[#C8F53E] rounded-full" />
                  <span className="text-[10px] font-black uppercase text-white/60">Active Sensor Hub</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-[#FF4F4F] rounded-full" />
                  <span className="text-[10px] font-black uppercase text-white/60">Maintenance Required</span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Upload Column */}
          <div className="bg-[#0F1409] rounded-[3rem] border border-white/5 flex flex-col relative overflow-hidden group">
            <input 
              type="file" 
              accept="image/*,video/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileSelect} 
            />
            
            {/* Background Layer */}
            <div className="absolute inset-0 z-0">
              {preview ? (
                <img src={preview} className="w-full h-full object-cover opacity-30" />
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
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-8">DRONE FEED · PHOTO · VIDEO</p>
                  <button className="bg-[#C8F53E] text-[#060A04] px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-2xl">UPLOAD SOURCE</button>
                </div>
              )}

              {uploadState === 'uploading' && (
                <div className="flex-grow flex flex-col items-center justify-center">
                  <div className="sweep-animation" />
                  <Activity size={40} className="text-[#C8F53E] animate-pulse mb-4" />
                  <p className="font-mono text-[10px] text-[#C8F53E] animate-pulse tracking-[0.2em] uppercase font-black">NEURAL ANALYSIS IN PROGRESS...</p>
                </div>
              )}

              {uploadState === 'success' && (
                <div className="flex-grow flex flex-col justify-center">
                  <div className="bg-black/80 backdrop-blur-md p-6 rounded-3xl border border-[#C8F53E]/30 space-y-4">
                    <div className="flex items-center gap-3 text-[#C8F53E]">
                      <CheckCircle size={18} />
                      <span className="text-[10px] font-black uppercase tracking-widest">THREAT IDENTIFIED</span>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-white/30 uppercase mb-1">DISEASE</p>
                      <p className="text-xl font-black italic text-white uppercase">{scanResult?.diseaseName}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[9px] font-black text-white/30 uppercase mb-1">CONFIDENCE</p>
                        <p className="text-lg font-black text-[#C8F53E]">{scanResult?.confidence}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-white/30 uppercase mb-1">SEVERITY</p>
                        <p className="text-lg font-black text-[#FF4F4F]">{scanResult?.riskLevel}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-white/30 uppercase mb-1">TREATMENT</p>
                      <p className="text-[10px] font-bold text-white/70 leading-relaxed line-clamp-2">{scanResult?.pesticides?.[0]?.name}: {scanResult?.pesticides?.[0]?.dose}</p>
                    </div>
                    <button 
                      onClick={resetUpload}
                      className="w-full bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border border-white/10 transition-all mt-2"
                    >
                      SCAN ANOTHER FIELD
                    </button>
                  </div>
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
            <div key={i} className="bg-[#0F1409] p-8 rounded-[2rem] border border-white/5 hover:border-[#C8F53E]/30 transition-all group">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">{stat.label}</span>
                <div className="text-[#C8F53E]/30 group-hover:text-[#C8F53E] transition-colors">{stat.icon}</div>
              </div>
              <p className={`font-bebas text-5xl italic ${stat.color || 'text-white'}`}>{stat.val}</p>
            </div>
          ))}
        </div>

        {/* SCAN RESULT + RECENT SCANS ROW */}
        <div className="grid xl:grid-cols-[450px_1fr] gap-8 mb-12">
          {/* Scan Panel */}
          <div className="bg-[#0F1409] rounded-[3rem] border border-white/5 p-10 flex flex-col h-full relative overflow-hidden">
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full ${analyzing ? 'bg-[#FFB347]' : 'bg-[#C8F53E]'} animate-pulse`} />
                <p className="text-[10px] font-black text-[#C8F53E] uppercase tracking-[0.4em]">{analyzing ? 'SCANNIG IN PROGRESS' : 'NEURAL SCAN RESULT'}</p>
              </div>
              <span className="text-[9px] text-white/30 uppercase tracking-widest">LIVE UPLINK</span>
            </div>

            <div className="relative flex-grow bg-black/60 rounded-[2.5rem] border border-white/10 overflow-hidden mb-10 min-h-[320px]">
              <img src={preview || "https://images.unsplash.com/photo-1595113316349-9fa4ee24f884?w=800&q=80"} className={`w-full h-full object-cover ${preview ? 'opacity-100' : 'grayscale opacity-20'}`} alt="Field Scan" />
              {analyzing && <div className="scan-line" />}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Target className={`text-[#C8F53E] w-32 h-32 ${analyzing ? 'opacity-100 scale-110' : 'opacity-20'} transition-all duration-500 animate-pulse`} />
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-2 font-mono">FIELD HEALTH SCORE</p>
                  <p className="text-8xl font-bebas italic text-[#C8F53E] leading-none">{scanResult?.healthScore || 78}<span className="text-2xl text-white/10 ml-2 font-sans not-italic">/100</span></p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { l: 'DETECTED', v: scanResult?.diseaseName.toUpperCase() || 'MODERATE FUNGAL STRESS', c: 'text-white' },
                  { l: 'CONFIDENCE', v: scanResult?.confidence || '91%', c: 'text-[#C8F53E]' },
                  { l: 'ZONE', v: scanResult?.zone || 'SECTOR 4-B, NORTH GRID', c: 'text-white' }
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
                    {['FIELD', 'CROP', 'STATUS', 'CONF', 'TIME'].map((h, i) => (
                      <th key={i} className="pb-6 text-[9px] font-black text-white/30 uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {recentScans.map((row, i) => (
                    <tr key={i} className="group hover:bg-[#C8F53E]/[0.03] transition-all">
                      <td className="py-6 font-bold text-white text-xs">{row.f}</td>
                      <td className="py-6 text-[10px] text-white/50">{row.c}</td>
                      <td className="py-6"><span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-white/5 border border-white/5">{row.s}</span></td>
                      <td className="py-6 text-[11px] font-black text-[#C8F53E]">{row.co}</td>
                      <td className="py-6 text-[10px] text-white/30">{row.t}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* INFRASTRUCTURE MONITORING */}
        <section className="bg-[#0F1409] rounded-[3rem] border border-white/5 p-12 overflow-hidden">
          <div className="flex justify-between items-center mb-12">
            <h2 className="font-bebas text-4xl italic tracking-wide">INFRASTRUCTURE MONITORING</h2>
            <button className="bg-[#C8F53E]/10 text-[#C8F53E] px-8 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border border-[#C8F53E]/20 hover:bg-[#C8F53E]/20 transition-all">+ ADD MONITOR</button>
          </div>

          <div className="grid lg:grid-cols-[400px_1fr] gap-12">
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
