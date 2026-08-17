'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import {
  Satellite, Radar, Network, Terminal as TerminalIcon,
  TrendingUp, Activity, CheckCircle2, ShieldAlert,
  ArrowUpRight, ArrowRight, Layers, Cpu, Database,
  Sparkles, Wifi, Radio, Maximize2, Zap
} from 'lucide-react';

const css = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700;900&family=JetBrains+Mono:wght@400;500;700&display=swap');

.font-bebas { font-family: 'Bebas Neue', sans-serif; }
.font-mono { font-family: 'JetBrains Mono', 'DM Mono', monospace; }
.font-sans { font-family: 'Inter', system-ui, sans-serif; }

.glass-panel {
  background: rgba(5, 7, 5, 0.75);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(163, 230, 53, 0.25);
  box-shadow: 0 0 25px rgba(16, 185, 129, 0.12), inset 0 0 15px rgba(163, 230, 53, 0.04);
}

.glass-panel:hover {
  border-color: rgba(163, 230, 53, 0.5);
  box-shadow: 0 0 35px rgba(163, 230, 53, 0.2), inset 0 0 20px rgba(163, 230, 53, 0.08);
}

.scanline {
  background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.25));
  background-size: 100% 4px;
  pointer-events: none;
}

.glow-text {
  text-shadow: 0 0 14px rgba(163, 230, 53, 0.7);
}

.glow-text-emerald {
  text-shadow: 0 0 14px rgba(16, 185, 129, 0.7);
}

.hex-grid {
  background-image: url("data:image/svg+xml,%3Csvg width='24' height='40' viewBox='0 0 24 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 40c5.523 0 10-4.477 10-10V10C10 4.477 5.523 0 0 0h24c-5.523 0-10 4.477-10 10v20c0 5.523 4.477 10 10 10H0z' fill='%2310B981' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E");
}

@keyframes pulseGlow {
  0%, 100% { box-shadow: 0 0 15px rgba(163, 230, 53, 0.4); }
  50% { box-shadow: 0 0 25px rgba(163, 230, 53, 0.8); }
}

.pulse-glow {
  animation: pulseGlow 2.5s infinite;
}

.detect-card:hover {
  border-left: 3px solid #A3E635 !important;
  box-shadow: 0 0 20px rgba(163, 230, 53, 0.15);
}

.tech-card:hover {
  border-color: rgba(163, 230, 53, 0.4) !important;
  transform: translateY(-3px);
}
`;

function Counter({ target, suffix = '', decimals = 0 }: { target: number; suffix?: string; decimals?: number }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const dur = 1800;
        const steps = 50;
        const inc = target / steps;
        let cur = 0;
        let count = 0;
        const t = setInterval(() => {
          cur += inc;
          count++;
          setVal(parseFloat(cur.toFixed(decimals)));
          if (count >= steps) {
            setVal(target);
            clearInterval(t);
          }
        }, dur / steps);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, decimals]);

  return <span ref={ref}>{val.toFixed(decimals)}{suffix}</span>;
}

const pipelineSteps = [
  { n: '01', icon: '🛰️', title: 'Orbital & Ground Capture', desc: 'Multi-spectral satellite telemetry, drone passes, and mobile leaf captures ingested in real-time.', stat: '< 2s INGESTION' },
  { n: '02', icon: '🔬', title: 'Spectral Segmentation', desc: 'Normalized Difference Vegetation Index (NDVI) mapping & multi-layer pathogen segmentation.', stat: '12 SPECTRAL LAYERS' },
  { n: '03', icon: '🧠', title: 'Neural Vision Core', desc: 'Multi-modal neural vision isolates disease signatures across 94 high-severity pathogen strains.', stat: '94 PATHOGENS' },
  { n: '04', icon: '⚡', title: 'Tactical Inference', desc: 'Ultra-fast agronomic reasoning engines generate regional dosage & chemical formulations.', stat: '500+ TOKENS/SEC' },
  { n: '05', icon: '📋', title: 'Prescription & Telemetry', desc: 'Actionable treatment, weather spread forecast, and verified dealer coordinates dispatched.', stat: 'INSTANT DISPATCH' },
];

const detections = [
  { icon: '🍃', name: 'Late Blight (Phytophthora)', acc: '98.4%', crops: 'Potato, Tomato, Eggplant' },
  { icon: '🍄', name: 'Yellow Rust (Puccinia)', acc: '97.1%', crops: 'Wheat, Barley, Rye' },
  { icon: '🌾', name: 'Rice Blast (Magnaporthe)', acc: '96.8%', crops: 'Paddy Rice, Millets' },
  { icon: '🪲', name: 'Aphid & Vector Infestation', acc: '94.5%', crops: 'Cotton, Mustard, Soybean' },
  { icon: '💧', name: 'Micro-Climatic Water Stress', acc: '92.3%', crops: 'All Crop Sectors' },
  { icon: '🌿', name: 'Soil Nutrient Deficiency', acc: '93.7%', crops: 'Rice, Maize, Legumes' },
  { icon: '🌱', name: 'Invasive Weed Biomass', acc: '95.2%', crops: 'Broadacre Fields' },
  { icon: '🧫', name: 'Bacterial Leaf Streak', acc: '91.8%', crops: 'Paddy, Citrus Orchards' },
];

const barData = [
  { label: 'NX-1', height: '40%', val: '40%' },
  { label: 'NX-2', height: '65%', val: '65%' },
  { label: 'NX-3', height: '92%', val: '92%', active: true },
  { label: 'NX-4', height: '35%', val: '35%' },
  { label: 'NX-5', height: '58%', val: '58%' },
];

const terminalLogs = [
  { text: '> INIT nexus_core.sh --galactic-sync', color: 'text-white/60' },
  { text: '[SYS] Establishing quantum entanglement... LOCKED', color: 'text-[#A3E635] glow-text' },
  { text: '[LLM] Analyzing spectral variance across Hemisphere Alpha...', color: 'text-white/80' },
  { text: '> WARNING: Micro-seismic humidity anomaly detected (delta: +0.04)', color: 'text-[#10B981]' },
  { text: '[SYS] Cross-referencing deep-strata pathogen models...', color: 'text-white/80' },
  { text: '[LLM] Match found: Sub-surface mycelial threat localized.', color: 'text-[#A3E635]' },
  { text: '> ACTION: Deploying automated precision recovery parameters.', color: 'text-[#A3E635] glow-text' },
  { text: '> VERIFYING UPLINK INTEGRITY... Node 7G encrypted.', color: 'text-white/60' },
];

export default function ProductPage() {
  const [selectedBar, setSelectedBar] = useState<number | null>(2);
  const [isLiveFeedExpanded, setIsLiveFeedExpanded] = useState(false);

  return (
    <div className="bg-[#050705] text-[#e0e4d6] font-sans selection:bg-[#A3E635] selection:text-[#050705] min-h-screen flex flex-col">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <Navigation />

      <main className="flex-grow">
        {/* ========================================================================= */}
        {/* HERO: GALACTIC NEURAL NEXUS */}
        {/* ========================================================================= */}
        <section className="relative w-full min-h-[92vh] flex items-center justify-center overflow-hidden pt-28 pb-16">
          {/* Background Media & Scanline Overlay */}
          <div className="absolute inset-0 z-0">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover opacity-25"
              src="/4329-178324572.mp4"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050705] via-[#050705]/60 to-[#050705]/85" />
            <div className="absolute inset-0 scanline z-10 opacity-60" />
          </div>

          <div className="relative z-20 w-full max-w-[1240px] px-6 mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Main Header Text */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#A3E635] animate-pulse" />
                <span className="font-mono text-xs text-[#A3E635] uppercase tracking-widest glow-text">
                  Crop OS v8.0 Core Online
                </span>
              </div>

              <h1 className="font-bebas text-5xl sm:text-7xl lg:text-8xl text-white uppercase leading-[0.9] tracking-tight">
                GALACTIC NEURAL <br />
                <span className="text-[#10B981] glow-text-emerald">NEXUS</span>
              </h1>

              <p className="text-base sm:text-lg text-white/70 max-w-xl leading-relaxed">
                Tactical planetary agronomic intelligence active. Synchronizing multi-orbital telemetry with ground-level autonomous diagnostics for real-time yield optimization and pathogenic neutralization.
              </p>

              <div className="flex flex-wrap gap-4 mt-2">
                <Link
                  href="/analyze"
                  className="bg-[#A3E635] text-[#050705] font-mono text-xs uppercase font-bold px-8 py-4 rounded hover:bg-white transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(163,230,53,0.45)] hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Radar size={18} className="animate-spin" style={{ animationDuration: '6s' }} />
                  INITIALIZE SCAN →
                </Link>
                <Link
                  href="/dashboard"
                  className="bg-transparent border border-white/20 hover:border-[#A3E635] text-white hover:text-[#A3E635] font-mono text-xs uppercase font-bold px-6 py-4 rounded transition-all flex items-center gap-2"
                >
                  <Satellite size={16} />
                  COMMAND CENTER
                </Link>
              </div>
            </div>

            {/* Floating HUD Telemetry Modules */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="glass-panel p-6 rounded-xl flex flex-col gap-4 transform hover:-translate-y-1 transition-all duration-300 relative">
                <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-80">
                  <span className="w-2 h-2 rounded-full bg-[#A3E635] animate-pulse" />
                  <span className="font-mono text-[10px] text-[#A3E635] uppercase tracking-wider">SECURE_UPLINK</span>
                </div>

                <div className="flex justify-between items-center border-b border-white/10 pb-2 mt-1">
                  <span className="font-mono text-[11px] text-white/60 uppercase tracking-wider">GALACTIC_SYNC_STATUS</span>
                  <span className="font-mono text-xs text-[#A3E635] glow-text font-bold">SYNCHRONIZED</span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="font-bebas text-5xl sm:text-6xl text-white leading-none glow-text">100%</span>
                  <span className="font-mono text-xs text-[#10B981] font-bold">OPERATIONAL</span>
                </div>

                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#A3E635] h-full w-full shadow-[0_0_12px_#A3E635]" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="glass-panel p-5 rounded-xl flex flex-col gap-2 relative">
                  <div className="absolute top-3 right-3 flex items-center gap-1 opacity-70">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A3E635] animate-pulse" />
                  </div>
                  <span className="font-mono text-[10px] text-white/50 uppercase tracking-wider">Satellite_Uplink</span>
                  <div className="flex items-center gap-2.5">
                    <Satellite className="text-[#A3E635] text-xl glow-text" size={24} />
                    <span className="font-bebas text-3xl sm:text-4xl text-white tracking-wide">
                      <Counter target={12840} suffix="" />
                    </span>
                  </div>
                </div>

                <div className="glass-panel p-5 rounded-xl flex flex-col gap-2 relative">
                  <div className="absolute top-3 right-3 flex items-center gap-1 opacity-70">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                  </div>
                  <span className="font-mono text-[10px] text-white/50 uppercase tracking-wider">Active_Nodes</span>
                  <div className="flex items-center gap-2.5">
                    <Network className="text-[#10B981] glow-text-emerald" size={24} />
                    <span className="font-bebas text-3xl sm:text-4xl text-white tracking-wide">
                      <Counter target={142.8} suffix="M" decimals={1} />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* CENTRAL MODULE: TACTICAL FIELD RECOVERY */}
        {/* ========================================================================= */}
        <section className="py-20 w-full max-w-[1240px] px-6 mx-auto">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/10 pb-6">
              <div>
                <h2 className="font-bebas text-4xl sm:text-5xl text-white uppercase glow-text-emerald tracking-wide">
                  Tactical Field Recovery
                </h2>
                <p className="font-mono text-xs sm:text-sm text-white/60 mt-1">
                  Real-time ground unit telemetry and pathogenic neutralization status.
                </p>
              </div>
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-[#A3E635]/30 shadow-[0_0_12px_rgba(163,230,53,0.15)]">
                <span className="w-2 h-2 rounded-full bg-[#A3E635] animate-pulse" />
                <span className="font-mono text-[11px] text-[#A3E635] uppercase font-bold tracking-wider">
                  Live Feed Active
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Image & Targeting Visual Module */}
              <div className="lg:col-span-8 relative rounded-2xl overflow-hidden border border-[#A3E635]/40 group shadow-[0_0_25px_rgba(16,185,129,0.2)] bg-black">
                <img
                  alt="Tactical Field Scan"
                  className="w-full h-[420px] sm:h-[500px] object-cover filter brightness-90 group-hover:brightness-100 transition-all duration-700"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKGkQK2Eb4nUHSaBXFm-KOi6w_GC19cRbvr4yp9sIOOxsJZ0Fky6g-O8b8YfY83cwKUs7WQPvQRA2xE-QrNquNarbWYSzoWxSekLPeGxtKgakvB42UM7UADNrRDohM0ODwFCavYPE0bN-v_ArHP2UtLR1EgTQhbDi_IYRheH5If9xL7F6eLyc5YB634wqseJSWWZXDLkVzzX3t8NZ3SLrdnxLwrZCPEfsYsxXT7LtE_PPn9q15NKHUyA"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050705] via-transparent to-transparent opacity-80" />
                <div className="absolute inset-0 scanline opacity-40" />

                {/* Overlay HUD */}
                <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end gap-4 z-20">
                  <div className="glass-panel p-4 rounded-xl border-l-4 border-l-[#10B981]">
                    <div className="font-mono text-[10px] text-[#10B981] mb-1 glow-text-emerald font-bold uppercase tracking-wider">
                      &gt; TARGET_LOCKED
                    </div>
                    <div className="font-bebas text-2xl sm:text-3xl text-white tracking-wide">
                      SECTOR 7G HOOGHLY GRID
                    </div>
                  </div>

                  <Link
                    href="/analyze"
                    className="bg-black/60 backdrop-blur border border-[#A3E635] text-[#A3E635] font-mono text-xs uppercase px-4 py-2.5 rounded-lg hover:bg-[#A3E635] hover:text-[#050705] transition-all font-bold flex items-center gap-1.5"
                  >
                    <Maximize2 size={13} />
                    DIAGNOSE SECTOR
                  </Link>
                </div>
              </div>

              {/* Telemetry Data Column */}
              <div className="lg:col-span-4 flex flex-col gap-4">
                <div className="glass-panel p-6 rounded-2xl flex-grow flex flex-col justify-between gap-6 relative">
                  <div className="absolute top-4 right-4 flex items-center gap-1 opacity-70">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A3E635] animate-pulse" />
                    <span className="font-mono text-[10px] text-[#A3E635] uppercase">PROBE_ONLINE</span>
                  </div>

                  <div>
                    <h3 className="font-mono text-xs text-[#A3E635] uppercase border-b border-white/10 pb-2 glow-text font-bold tracking-wider">
                      Probe Telemetry
                    </h3>

                    <div className="flex flex-col gap-4 mt-4">
                      <div>
                        <div className="flex justify-between items-center text-xs font-mono uppercase mb-1">
                          <span className="text-white/80">SOIL_PROFILE_SYNC</span>
                          <span className="text-[#A3E635] glow-text font-bold">98%</span>
                        </div>
                        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-[#A3E635] h-full shadow-[0_0_8px_#A3E635]" style={{ width: '98%' }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center text-xs font-mono uppercase mb-1">
                          <span className="text-white/80">MICROBIOME_DENSITY</span>
                          <span className="text-[#10B981] glow-text-emerald font-bold">OPTIMAL</span>
                        </div>
                        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-[#10B981] h-full shadow-[0_0_8px_#10B981]" style={{ width: '85%' }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center text-xs font-mono uppercase mb-1">
                          <span className="text-white/80">PATHOGEN_NEUTRALIZATION</span>
                          <span className="text-white font-bold">ACTIVE</span>
                        </div>
                        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-white h-full" style={{ width: '100%' }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/10">
                    <div className="font-mono text-[11px] text-[#10B981] mb-3 glow-text-emerald font-bold tracking-wider uppercase">
                      Neutralization Stats
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white/5 border border-white/10 p-3.5 rounded-xl text-center">
                        <div className="font-bebas text-3xl text-[#A3E635]">99.9%</div>
                        <div className="font-mono text-[10px] text-white/50 mt-0.5 uppercase tracking-wider">Eradication Rate</div>
                      </div>
                      <div className="bg-white/5 border border-white/10 p-3.5 rounded-xl text-center">
                        <div className="font-bebas text-3xl text-[#10B981]">Secured</div>
                        <div className="font-mono text-[10px] text-white/50 mt-0.5 uppercase tracking-wider">Zone Status</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* DEEP-TECH DASHBOARD DATA GRID */}
        {/* ========================================================================= */}
        <section className="py-20 bg-[#070B06] border-y border-[#A3E635]/20 relative">
          <div className="absolute inset-0 scanline z-0 opacity-40" />
          <div className="w-full max-w-[1240px] px-6 mx-auto relative z-10">
            <div className="mb-12">
              <p className="font-mono text-xs text-[#A3E635] uppercase tracking-widest mb-2 font-bold">
                MULTI-ORBITAL TELEMETRY & INFERENCE
              </p>
              <h2 className="font-bebas text-4xl sm:text-5xl text-white uppercase glow-text tracking-wide">
                Interactive Intelligence Grid
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Col 1: Spectral Sector Analysis / Neural Density Mapping */}
              <div className="glass-panel p-6 rounded-2xl flex flex-col hex-grid border-t-4 border-t-[#10B981] relative group hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all">
                <div className="absolute top-4 right-4 flex items-center gap-1 opacity-70">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                  <span className="font-mono text-[10px] text-[#10B981] uppercase">LIVE_SPECTRAL</span>
                </div>

                <div className="flex items-center gap-2 mb-6">
                  <Layers className="text-[#10B981] glow-text-emerald" size={20} />
                  <h3 className="font-mono text-xs text-white uppercase font-bold tracking-wider">
                    NEURAL DENSITY MAPPING
                  </h3>
                </div>

                <div className="flex-grow flex items-end justify-between gap-2 h-48 mt-4 pb-2">
                  {barData.map((bar, i) => (
                    <div
                      key={bar.label}
                      onClick={() => setSelectedBar(i)}
                      className="w-full bg-white/5 hover:bg-white/10 transition-all rounded-t relative cursor-pointer h-full flex items-end group/bar"
                    >
                      <div
                        className={`w-full rounded-t transition-all duration-500 ${
                          selectedBar === i || bar.active
                            ? 'bg-[#A3E635] shadow-[0_0_15px_rgba(163,230,53,0.7)]'
                            : 'bg-[#10B981] shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                        }`}
                        style={{ height: bar.height }}
                      />
                      <div className="opacity-0 group-hover/bar:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white font-mono text-[10px] px-2 py-1 rounded transition-opacity border border-[#10B981]/50 whitespace-nowrap z-20">
                        {bar.val}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between mt-4 border-t border-white/10 pt-4">
                  {barData.map((bar, i) => (
                    <span
                      key={bar.label}
                      className={`font-mono text-[11px] font-bold ${
                        selectedBar === i ? 'text-[#A3E635] glow-text' : 'text-white/50'
                      }`}
                    >
                      {bar.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Col 2: Inference Engine Status / Terminal Logs */}
              <div className="glass-panel p-6 rounded-2xl flex flex-col border-t-4 border-t-[#A3E635] bg-[#030403] relative hover:shadow-[0_0_30px_rgba(163,230,53,0.25)] transition-all">
                <div className="absolute top-4 right-4 flex items-center gap-1 opacity-70">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A3E635] animate-pulse" />
                  <span className="font-mono text-[10px] text-[#A3E635] uppercase">INFERENCE_LOGS</span>
                </div>

                <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-3">
                  <TerminalIcon className="text-[#A3E635] glow-text" size={20} />
                  <h3 className="font-mono text-xs text-white uppercase font-bold tracking-wider">
                    PLANETARY INFERENCE LOGS
                  </h3>
                </div>

                <div className="font-mono text-[11px] text-white/60 leading-relaxed overflow-y-auto flex flex-col gap-2 h-56 pr-1">
                  {terminalLogs.map((log, i) => (
                    <div key={i} className={log.color}>
                      {log.text}
                    </div>
                  ))}
                  <div className="animate-pulse text-[#10B981]">_ awaiting further field telemetry...</div>
                </div>
              </div>

              {/* Col 3: Global Quantum Yield Forecast */}
              <div className="glass-panel p-6 rounded-2xl flex flex-col border-t-4 border-t-white relative hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] transition-all">
                <div className="absolute top-4 right-4 flex items-center gap-1 opacity-70">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  <span className="font-mono text-[10px] text-white/70 uppercase">PROJECTION</span>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="text-[#A3E635]" size={20} />
                  <h3 className="font-mono text-xs text-white uppercase font-bold tracking-wider">
                    QUANTUM YIELD FORECAST
                  </h3>
                </div>

                <div className="flex items-baseline gap-2 mb-4">
                  <span className="font-bebas text-5xl sm:text-6xl text-white leading-none glow-text">+21.4%</span>
                  <span className="font-mono text-xs text-[#A3E635] font-bold flex items-center gap-0.5">
                    <ArrowUpRight size={14} /> YoY PROJECTED
                  </span>
                </div>

                {/* SVG Technical Yield Curve */}
                <div className="flex-grow relative h-32 w-full border-b border-l border-white/20 mt-2">
                  <svg
                    className="w-full h-full overflow-visible stroke-[#A3E635] fill-none stroke-[3px] opacity-90 drop-shadow-[0_0_8px_rgba(163,230,53,0.6)]"
                    preserveAspectRatio="none"
                    viewBox="0 0 100 50"
                  >
                    <path d="M0,45 C20,35 30,15 50,20 C70,25 80,5 100,2" />
                    <path
                      className="fill-[#A3E635]/20 stroke-none"
                      d="M0,45 C20,35 30,15 50,20 C70,25 80,5 100,2 L100,50 L0,50 Z"
                    />
                  </svg>
                  {/* Subtle Grid Lines */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                    <div className="w-full border-t border-white" />
                    <div className="w-full border-t border-white" />
                    <div className="w-full border-t border-white" />
                  </div>
                </div>

                <div className="flex justify-between mt-3 font-mono text-[10px] text-white/50 uppercase">
                  <span>CYC-1</span>
                  <span>CYC-2</span>
                  <span>CYC-3</span>
                  <span className="text-[#A3E635] font-bold">CYC-4 (PROJ)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* PIPELINE ARCHITECTURE (5-STEP PROCESS) */}
        {/* ========================================================================= */}
        <section className="py-24 w-full max-w-[1240px] px-6 mx-auto">
          <div className="text-center mb-16">
            <p className="font-mono text-xs text-[#A3E635] uppercase tracking-widest mb-2 font-bold">
              STEP-BY-STEP NEURAL PIPELINE
            </p>
            <h2 className="font-bebas text-4xl sm:text-6xl text-white uppercase tracking-wide">
              From Pixel to Prescription in 4.2s
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {pipelineSteps.map((p) => (
              <div
                key={p.n}
                className="bg-[#0F1409] border border-white/10 hover:border-[#A3E635]/40 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 group"
              >
                <div>
                  <div className="w-9 h-9 rounded-full bg-[#A3E635] text-[#050705] font-mono text-xs font-black flex items-center justify-center mb-4 shadow-[0_0_10px_rgba(163,230,53,0.5)]">
                    {p.n}
                  </div>
                  <div className="text-2xl mb-2">{p.icon}</div>
                  <h3 className="font-bold text-sm text-white mb-2 group-hover:text-[#A3E635] transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-xs text-white/60 leading-relaxed mb-4">
                    {p.desc}
                  </p>
                </div>
                <div className="font-mono text-[10px] text-[#A3E635] font-bold tracking-wider pt-3 border-t border-white/10 uppercase">
                  {p.stat}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* DETECTION MATRIX */}
        {/* ========================================================================= */}
        <section className="py-20 bg-[#070B06] border-y border-white/5">
          <div className="w-full max-w-[1240px] px-6 mx-auto">
            <div className="text-center mb-14">
              <p className="font-mono text-xs text-[#A3E635] uppercase tracking-widest mb-2 font-bold">
                DISEASE & PATHOGEN RECOGNITION
              </p>
              <h2 className="font-bebas text-4xl sm:text-6xl text-white uppercase tracking-wide">
                WHAT CROP OS RECOGNIZES
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {detections.map((d, i) => (
                <div
                  key={i}
                  className="detect-card bg-[#0F1409] border border-white/10 p-5 rounded-xl transition-all"
                >
                  <div className="text-2xl mb-2">{d.icon}</div>
                  <h3 className="font-bold text-sm text-white mb-1">{d.name}</h3>
                  <p className="font-mono text-sm text-[#A3E635] font-bold mb-1">{d.acc} Confidence</p>
                  <p className="font-mono text-[11px] text-white/40">{d.crops}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* COMPARISON MATRIX & FINAL ACTION */}
        {/* ========================================================================= */}
        <section className="py-20 w-full max-w-[1000px] px-6 mx-auto">
          <div className="text-center mb-12">
            <p className="font-mono text-xs text-[#A3E635] uppercase tracking-widest mb-2 font-bold">
              BENCHMARK COMPARISON
            </p>
            <h2 className="font-bebas text-4xl sm:text-5xl text-white uppercase tracking-wide">
              WHY CROP OS V8.0 OUTPERFORMS
            </h2>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#0F1409]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 font-mono text-[11px] text-white/50 uppercase">
                  <th className="p-4 sm:p-5">Feature</th>
                  <th className="p-4 sm:p-5 text-center">Traditional Scouting</th>
                  <th className="p-4 sm:p-5 text-center text-[#A3E635] bg-[#A3E635]/10 font-bold">
                    Crop OS v8.0
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs sm:text-sm">
                {[
                  ['Detection Speed', '3–7 days laboratory wait', '4.2 seconds instant uplink'],
                  ['Accuracy Rate', '60–70% visual estimation', '98.4% multi-modal neural AI'],
                  ['Coverage Frequency', 'Weekly manual scout visits', 'Continuous 24/7 drone/satellite sync'],
                  ['Cost per Hectare', '$15–40 per inspection', '$0.10–0.50 automated digital pass'],
                  ['Pathogen Library', '~20 standard diseases', '94 high-severity strains'],
                  ['Actionable Prescription', 'Generic chemical guide', 'Localized dosage, dealers & weather risk']
                ].map(([f, t, c], i) => (
                  <tr key={i} className="hover:bg-white/[0.02]">
                    <td className="p-4 sm:p-5 font-medium text-white">{f}</td>
                    <td className="p-4 sm:p-5 text-center text-white/50 font-mono text-xs">{t}</td>
                    <td className="p-4 sm:p-5 text-center text-[#A3E635] font-mono text-xs font-bold bg-[#A3E635]/[0.04]">
                      {c}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* BOTTOM CTA: ENGAGE UPLINK */}
        {/* ========================================================================= */}
        <section className="relative overflow-hidden bg-[#A3E635] text-[#050705] py-20 px-6 text-center">
          <div className="relative z-10 max-w-[700px] mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 bg-black/10 px-4 py-1 rounded-full font-mono text-xs uppercase font-bold tracking-wider">
              <Zap size={14} /> ZERO FRICTION FIELD ONBOARDING
            </div>
            <h2 className="font-bebas text-5xl sm:text-6xl uppercase tracking-tight leading-none">
              INITIALIZE YOUR PLANETARY TELEMETRY
            </h2>
            <p className="text-sm sm:text-base text-black/80 font-medium">
              Start with free real-time scans on your mobile or drone footage. No credit card required.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <Link
                href="/analyze"
                className="bg-[#050705] text-[#A3E635] font-mono text-xs font-black uppercase px-8 py-4 rounded hover:bg-white hover:text-[#050705] transition-all shadow-xl"
              >
                TEST SCAN LIVE →
              </Link>
              <Link
                href="/pricing"
                className="bg-transparent border-2 border-[#050705] text-[#050705] font-mono text-xs font-black uppercase px-8 py-4 rounded hover:bg-[#050705] hover:text-white transition-all"
              >
                VIEW COMMERCIAL TIERS
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
