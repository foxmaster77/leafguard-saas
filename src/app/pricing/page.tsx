'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { 
  ShieldCheck, 
  Satellite, 
  Plane, 
  Scan, 
  Activity, 
  TrendingUp, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Check, 
  ArrowRight,
  HelpCircle,
  PhoneCall,
  Wheat,
  Sprout,
  Grape,
  Trees,
  Layers,
  BarChart3
} from 'lucide-react';

const css = `
  @keyframes radarSweep {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes pulseGlow {
    0%, 100% { opacity: 0.8; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.03); }
  }

  .radar-scan {
    animation: radarSweep 4s linear infinite;
    transform-origin: center;
  }

  .glass-card {
    background: rgba(10, 14, 7, 0.75);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(200, 245, 62, 0.15);
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5);
  }

  .glass-card-hover {
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .glass-card-hover:hover {
    border-color: rgba(200, 245, 62, 0.4);
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(200, 245, 62, 0.12);
  }

  .glow-text {
    text-shadow: 0 0 16px rgba(200, 245, 62, 0.55);
  }

  /* Custom Range Slider */
  input[type=range].agri-slider {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    background: transparent;
  }
  input[type=range].agri-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    height: 22px;
    width: 22px;
    border-radius: 50%;
    background: #C8F53E;
    cursor: pointer;
    margin-top: -9px;
    box-shadow: 0 0 15px rgba(200, 245, 62, 0.9), 0 0 2px #060A04;
    border: 2px solid #060A04;
    transition: transform 0.1s ease;
  }
  input[type=range].agri-slider::-webkit-slider-thumb:hover {
    transform: scale(1.15);
  }
  input[type=range].agri-slider::-webkit-slider-runnable-track {
    width: 100%;
    height: 5px;
    cursor: pointer;
    background: #1e2617;
    border-radius: 4px;
    border: 1px solid rgba(200, 245, 62, 0.2);
  }
  input[type=range].agri-slider:focus {
    outline: none;
  }

  .marquee-container {
    overflow: hidden;
    white-space: nowrap;
  }
  
  .marquee-content {
    display: inline-block;
    animation: marqueeScroll 25s linear infinite;
  }
  
  @keyframes marqueeScroll {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }

  .pricing-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.75rem;
    align-items: stretch;
  }

  @media (max-width: 960px) {
    .pricing-grid {
      grid-template-columns: 1fr !important;
      max-width: 520px;
      margin: 0 auto;
    }
  }
`;

const cropProfiles = [
  { id: 'field', label: 'Field Crops', sub: 'Wheat, Corn, Soy, Rice', icon: Wheat, multiplier: 1.0 },
  { id: 'row', label: 'Row Crops', sub: 'Cotton, Vegetables, Tubers', icon: Sprout, multiplier: 1.15 },
  { id: 'vineyard', label: 'Vineyard & Berry', sub: 'Grapes, Berries, High-Density', icon: Grape, multiplier: 1.3 },
  { id: 'plantation', label: 'Plantation', sub: 'Orchards, Palm, Coffee, Rubber', icon: Trees, multiplier: 1.25 },
];

const faqs = [
  {
    q: 'Can I upgrade, downgrade, or adjust acreage anytime?',
    a: 'Yes. You can scale your acreage or toggle add-on modules instantly through your mission control dashboard. Pro-rated adjustments are automatically reflected in your next invoice with zero penalties.'
  },
  {
    q: 'What drone and camera formats are supported for Multi-Spectral feeds?',
    a: 'We natively ingest raw telemetry, GeoTIFF, JPG, PNG, WEBP, and calibrated NIR/RE bands from DJI Agris/Mavic 3M, MicaSense RedEdge, Sentera, and standard multispectral payload drones.'
  },
  {
    q: 'How does the Live Field OS Estimator calculate estimated ROI?',
    a: 'ROI is calculated based on verified agricultural field data: averaging 14-28% reduction in chemical spend through targeted micro-spraying and preventing $24-$45/acre in yield loss through 72-hour early blight, rust, and pest identification.'
  },
  {
    q: 'Is our farm telemetry and geospatial data kept confidential?',
    a: '100% private and protected. Your farm boundary data, drone scans, and yield predictions are encrypted in transit and at rest with SOC2 compliance. We never monetize or distribute proprietary farm telemetry.'
  },
  {
    q: 'Do you offer air-gapped on-premise deployments for enterprise operations?',
    a: 'Yes — Global Enterprise packages include on-site edge GPU servers capable of processing drone multi-spectral feeds without any continuous internet connection.'
  },
  {
    q: 'What is included in Direct Agronomist Support?',
    a: 'Commercial subscribers receive priority in-app agronomist consultation within 2 business hours. Enterprise clients receive a dedicated agronomy team with scheduled weekly field analysis reviews.'
  }
];

export default function PricingPage() {
  const [acres, setAcres] = useState<number>(500);
  const [selectedCrop, setSelectedCrop] = useState<string>('field');
  const [droneEnabled, setDroneEnabled] = useState<boolean>(true);
  const [radarEnabled, setRadarEnabled] = useState<boolean>(true);
  const [variableRateEnabled, setVariableRateEnabled] = useState<boolean>(false);
  const [yearly, setYearly] = useState<boolean>(false);
  const [showTable, setShowTable] = useState<boolean>(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Calculations
  const currentCrop = cropProfiles.find(c => c.id === selectedCrop) || cropProfiles[0];
  const sqKm = (acres * 0.00404686).toFixed(2);
  const hectares = (acres * 0.404686).toFixed(0);

  // Pricing math
  const baseRatePerAcre = 0.50 * currentCrop.multiplier;
  const droneCost = droneEnabled ? acres * 0.45 : 0;
  const radarCost = radarEnabled ? 35 : 0;
  const vrateCost = variableRateEnabled ? acres * 0.20 : 0;

  let computedMonthly = (acres * baseRatePerAcre) + droneCost + radarCost + vrateCost;
  if (computedMonthly < 49) computedMonthly = 49;
  if (yearly) computedMonthly = computedMonthly * 0.8;

  const finalPrice = Math.round(computedMonthly);
  const perAcrePrice = (finalPrice / acres).toFixed(2);

  // Estimated ROI metrics
  const estLossPrevented = Math.round(acres * (22 + currentCrop.multiplier * 3.5));
  const estChemSavings = Math.round(acres * 14.2);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <Navigation />
      
      <div className="bg-[#060A04] text-white font-sans min-h-screen pt-20">
        
        {/* TOP LIVE TELEMETRY TICKER */}
        <div className="bg-[#0A0E07] border-b border-[#C8F53E]/20 py-2.5 marquee-container font-mono text-xs text-[#C8F53E]">
          <div className="marquee-content flex gap-8 items-center">
            <span>● SYSTEM: CROP_OS v4.2 ONLINE</span>
            <span>● SATELLITE RADAR: SENTINEL-2 + PLANET FEED ACTIVE</span>
            <span>● 142 COMMERCIAL FARMS MONITORED</span>
            <span>● 1.4M ACRES ANALYZED THIS HARVEST</span>
            <span>● THERMAL RECON RESOLUTION: 0.5M/PX</span>
            <span>● SYSTEM: CROP_OS v4.2 ONLINE</span>
            <span>● SATELLITE RADAR: SENTINEL-2 + PLANET FEED ACTIVE</span>
            <span>● 142 COMMERCIAL FARMS MONITORED</span>
            <span>● 1.4M ACRES ANALYZED THIS HARVEST</span>
            <span>● THERMAL RECON RESOLUTION: 0.5M/PX</span>
          </div>
        </div>

        {/* HERO HEADER */}
        <section className="relative overflow-hidden pt-12 pb-8 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#C8F53E]/10 border border-[#C8F53E]/40 px-3.5 py-1 rounded-full text-xs font-mono text-[#C8F53E] tracking-widest uppercase mb-4 shadow-[0_0_15px_rgba(200,245,62,0.2)]">
            <Sparkles className="w-3.5 h-3.5" /> PRECISION FIELD OS CONFIGURATOR
          </div>
          <h1 className="font-bebas text-4xl sm:text-6xl lg:text-7xl font-black italic tracking-wide text-white leading-none mb-4">
            DEPLOY YOUR FIELD INTELLIGENCE
          </h1>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Configure coverage scale, multi-spectral drone sync, and satellite risk radar for your exact operational footprint.
          </p>
        </section>

        {/* CONFIGURATOR & ESTIMATOR GRID */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: CONTROL PANEL */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Header Title */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[#C8F53E]" />
                  <h2 className="font-mono text-sm font-bold tracking-widest text-white uppercase">
                    FIELD SPECIFICATIONS
                  </h2>
                </div>
                <span className="bg-[#C8F53E]/15 border border-[#C8F53E]/50 text-[#C8F53E] px-2.5 py-0.5 rounded text-[11px] font-mono tracking-wider">
                  LIVE INTERACTIVE
                </span>
              </div>

              {/* ACREAGE SLIDER CARD */}
              <div className="glass-card p-6 rounded-xl relative overflow-hidden">
                <div className="flex justify-between items-center mb-2">
                  <label className="font-mono text-xs text-gray-400 uppercase tracking-wider">
                    OPERATIONAL MONITORING SCALE
                  </label>
                  <span className="font-mono text-xs text-[#C8F53E] bg-[#C8F53E]/10 px-2 py-0.5 rounded">
                    ~{hectares} Hectares
                  </span>
                </div>

                <div className="flex items-baseline gap-3 my-4">
                  <span className="font-bebas text-5xl sm:text-6xl text-[#C8F53E] glow-text leading-none">
                    {acres.toLocaleString()}
                  </span>
                  <span className="font-bebas text-2xl sm:text-3xl text-gray-300 tracking-wide">
                    ACRES MONITORED
                  </span>
                </div>

                <input
                  type="range"
                  min="10"
                  max="10000"
                  step="10"
                  value={acres}
                  onChange={(e) => setAcres(parseInt(e.target.value))}
                  className="agri-slider mb-4"
                />

                {/* Preset Quick Chips */}
                <div className="flex gap-2 flex-wrap mb-4">
                  {[50, 250, 500, 1500, 5000, 10000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAcres(preset)}
                      className={`text-[11px] font-mono px-2.5 py-1 rounded transition-all ${
                        acres === preset
                          ? 'bg-[#C8F53E] text-[#060A04] font-bold shadow-[0_0_10px_rgba(200,245,62,0.5)]'
                          : 'bg-[#182012] text-gray-400 hover:text-white hover:bg-[#222c1b] border border-white/5'
                      }`}
                    >
                      {preset >= 1000 ? `${preset / 1000}k AC` : `${preset} AC`}
                    </button>
                  ))}
                </div>

                <div className="flex justify-between font-mono text-xs text-gray-400 pt-3 border-t border-white/5">
                  <span>Coverage Footprint: <strong className="text-white">~{sqKm} sq km</strong></span>
                  <span>Scan Cadence: <strong className="text-[#C8F53E]">{acres > 2000 ? 'Real-Time + Daily' : 'Daily Pass'}</strong></span>
                </div>
              </div>

              {/* CROP PROFILE SELECTOR */}
              <div className="glass-card p-6 rounded-xl">
                <label className="font-mono text-xs text-gray-400 uppercase tracking-wider block mb-3">
                  PRIMARY CROP TAXONOMY
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {cropProfiles.map((crop) => {
                    const IconComponent = crop.icon;
                    const isSelected = selectedCrop === crop.id;
                    return (
                      <button
                        key={crop.id}
                        type="button"
                        onClick={() => setSelectedCrop(crop.id)}
                        className={`p-3.5 rounded-lg text-left transition-all border flex flex-col justify-between ${
                          isSelected
                            ? 'border-[#C8F53E] bg-[#C8F53E]/10 shadow-[0_0_15px_rgba(200,245,62,0.15)]'
                            : 'border-white/10 bg-[#0E140B]/60 hover:border-white/20 hover:bg-[#141C0F]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <IconComponent className={`w-5 h-5 ${isSelected ? 'text-[#C8F53E]' : 'text-gray-400'}`} />
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#C8F53E] animate-ping" />}
                        </div>
                        <div>
                          <div className={`font-mono text-xs font-bold ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                            {crop.label}
                          </div>
                          <div className="text-[11px] text-gray-500 truncate mt-0.5">
                            {crop.sub}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ADD-ON MODULES */}
              <div className="glass-card p-6 rounded-xl space-y-4">
                <label className="font-mono text-xs text-gray-400 uppercase tracking-wider block mb-1">
                  INTELLIGENCE & SENSOR MODULES
                </label>

                {/* Mobile AI Scan */}
                <div className="p-3.5 rounded-lg bg-[#0E140B]/80 border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-[#C8F53E]/10 text-[#C8F53E]">
                      <Scan className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-medium text-sm text-white">Mobile Offline Edge AI</div>
                      <div className="text-xs text-gray-400 font-mono">Cellular pathogen detection (Included base)</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono bg-[#C8F53E]/15 text-[#C8F53E] px-2 py-0.5 rounded font-bold">
                    INCLUDED
                  </span>
                </div>

                {/* Drone Multi-Spectral */}
                <div 
                  onClick={() => setDroneEnabled(!droneEnabled)}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                    droneEnabled 
                      ? 'border-[#C8F53E]/40 bg-[#C8F53E]/10' 
                      : 'border-white/5 bg-[#0E140B]/60 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded ${droneEnabled ? 'bg-[#C8F53E]/20 text-[#C8F53E]' : 'bg-white/5 text-gray-400'}`}>
                      <Plane className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-medium text-sm text-white">Drone Multi-Spectral Sync</div>
                      <div className="text-xs text-[#C8F53E] font-mono">+$0.45 / acre / mo</div>
                    </div>
                  </div>
                  <div className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${droneEnabled ? 'bg-[#C8F53E]' : 'bg-gray-800'}`}>
                    <div className={`bg-[#060A04] w-4 h-4 rounded-full shadow-md transform transition-transform ${droneEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                  </div>
                </div>

                {/* Satellite Risk Radar */}
                <div 
                  onClick={() => setRadarEnabled(!radarEnabled)}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                    radarEnabled 
                      ? 'border-[#C8F53E]/40 bg-[#C8F53E]/10' 
                      : 'border-white/5 bg-[#0E140B]/60 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded ${radarEnabled ? 'bg-[#C8F53E]/20 text-[#C8F53E]' : 'bg-white/5 text-gray-400'}`}>
                      <Satellite className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-medium text-sm text-white">Satellite Weather & Risk Radar</div>
                      <div className="text-xs text-[#C8F53E] font-mono">+$35.00 / month flat</div>
                    </div>
                  </div>
                  <div className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${radarEnabled ? 'bg-[#C8F53E]' : 'bg-gray-800'}`}>
                    <div className={`bg-[#060A04] w-4 h-4 rounded-full shadow-md transform transition-transform ${radarEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                  </div>
                </div>

                {/* Variable Nitrogen Mapping */}
                <div 
                  onClick={() => setVariableRateEnabled(!variableRateEnabled)}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                    variableRateEnabled 
                      ? 'border-[#C8F53E]/40 bg-[#C8F53E]/10' 
                      : 'border-white/5 bg-[#0E140B]/60 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded ${variableRateEnabled ? 'bg-[#C8F53E]/20 text-[#C8F53E]' : 'bg-white/5 text-gray-400'}`}>
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-medium text-sm text-white">Variable-Rate Nitrogen Prescription</div>
                      <div className="text-xs text-[#C8F53E] font-mono">+$0.20 / acre / mo</div>
                    </div>
                  </div>
                  <div className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${variableRateEnabled ? 'bg-[#C8F53E]' : 'bg-gray-800'}`}>
                    <div className={`bg-[#060A04] w-4 h-4 rounded-full shadow-md transform transition-transform ${variableRateEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                  </div>
                </div>

              </div>

            </div>

            {/* RIGHT COLUMN: VISUALIZER & PRICE HUD */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* LIVE SATELLITE HUD CARD */}
              <div className="glass-card rounded-xl overflow-hidden relative border border-[#C8F53E]/30 h-72 sm:h-80 group">
                <Image
                  src="/satellite-heatmap.jpg"
                  alt="Satellite Heat Map and NDVI Telemetry"
                  fill
                  className="object-cover opacity-75 mix-blend-screen scale-105 group-hover:scale-100 transition-transform duration-700"
                  priority
                />

                {/* Radar Overlay Grid */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] rounded-full border border-[#C8F53E]/25 relative">
                    <div className="absolute inset-0 rounded-full border border-[#C8F53E]/15 scale-75" />
                    <div className="absolute inset-0 rounded-full border border-[#C8F53E]/10 scale-50" />
                    <div className="absolute inset-0 rounded-full border border-dashed border-[#C8F53E]/20 scale-90" />
                    {/* Sweeping Beam */}
                    <div className="absolute top-1/2 left-1/2 w-1/2 h-[2px] bg-gradient-to-r from-transparent via-[#C8F53E]/50 to-[#C8F53E] radar-scan shadow-[0_0_16px_#C8F53E]" />
                  </div>
                </div>

                {/* HUD Telemetry Top Badges */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-center pointer-events-none">
                  <div className="flex gap-2">
                    <span className="bg-[#060A04]/90 border border-white/20 text-white px-2.5 py-1 rounded font-mono text-[11px] flex items-center gap-1.5 backdrop-blur-md">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                      LIVE ORBITAL FEED
                    </span>
                    <span className="bg-[#C8F53E]/20 text-[#C8F53E] border border-[#C8F53E]/50 px-2.5 py-1 rounded font-mono text-[11px] backdrop-blur-md">
                      SECTOR 4-B [{currentCrop.label.toUpperCase()}]
                    </span>
                  </div>
                  <span className="hidden sm:inline-block bg-[#060A04]/80 font-mono text-[11px] text-gray-300 px-2.5 py-1 rounded border border-white/10">
                    RES: 0.5M / PX
                  </span>
                </div>

                {/* Bottom telemetry indicators */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end font-mono text-[11px] text-gray-300 pointer-events-none">
                  <div className="bg-[#060A04]/85 px-3 py-1.5 rounded border border-white/10 backdrop-blur-md">
                    <div>LAT: 42.8291° N | LON: 87.2104° W</div>
                    <div className="text-[#C8F53E]">INDEX: NDVI + CHLOROPHYLL RE</div>
                  </div>
                  <div className="bg-[#060A04]/85 px-3 py-1.5 rounded border border-white/10 text-right backdrop-blur-md">
                    <div>ALT: 680 KM (LEO)</div>
                    <div className="text-[#C8F53E]">FOV: {acres.toLocaleString()} ACRES</div>
                  </div>
                </div>
              </div>

              {/* REAL-TIME PRICE INVESTMENT HUD */}
              <div className="glass-card p-6 sm:p-8 rounded-xl text-center relative overflow-hidden border-[#C8F53E]/30">
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#C8F53E]/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex justify-between items-center mb-4">
                  <span className="font-mono text-xs text-gray-400 tracking-wider uppercase">
                    TOTAL ESTIMATED INVESTMENT
                  </span>
                  
                  {/* Monthly / Annual Toggle */}
                  <div className="inline-flex items-center gap-1.5 bg-[#0E140B] border border-white/10 p-1 rounded-full">
                    <button
                      type="button"
                      onClick={() => setYearly(false)}
                      className={`font-mono text-[11px] px-3 py-1 rounded-full transition-all ${
                        !yearly ? 'bg-[#C8F53E] text-[#060A04] font-bold' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      MONTHLY
                    </button>
                    <button
                      type="button"
                      onClick={() => setYearly(true)}
                      className={`font-mono text-[11px] px-3 py-1 rounded-full transition-all flex items-center gap-1 ${
                        yearly ? 'bg-[#C8F53E] text-[#060A04] font-bold' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      ANNUAL <span className="bg-emerald-600 text-white text-[9px] px-1 py-0.2 rounded font-mono font-bold">-20%</span>
                    </button>
                  </div>
                </div>

                <div className="my-2">
                  <div className="font-bebas text-6xl sm:text-7xl text-white glow-text leading-none">
                    ${finalPrice.toLocaleString()} <span className="font-sans text-xl sm:text-2xl text-gray-400 font-normal">/ mo</span>
                  </div>
                  <div className="font-mono text-sm text-[#C8F53E] mt-2 font-medium">
                    ≈ ${perAcrePrice} / acre / month
                  </div>
                </div>

                {/* Sub-breakdown badges */}
                <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-white/5 font-mono text-[11px]">
                  <div className="bg-[#0E140B] p-2 rounded">
                    <div className="text-gray-400">BASE PLATFORM</div>
                    <div className="text-white font-bold">${Math.round(acres * baseRatePerAcre * (yearly ? 0.8 : 1))}</div>
                  </div>
                  <div className="bg-[#0E140B] p-2 rounded">
                    <div className="text-gray-400">DRONE & SENSOR</div>
                    <div className="text-white font-bold">${Math.round(droneCost * (yearly ? 0.8 : 1))}</div>
                  </div>
                  <div className="bg-[#0E140B] p-2 rounded">
                    <div className="text-gray-400">RADAR & ADDONS</div>
                    <div className="text-white font-bold">${Math.round((radarCost + vrateCost) * (yearly ? 0.8 : 1))}</div>
                  </div>
                </div>
              </div>

              {/* ROI & VALUE PREDICTION METRICS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="glass-card p-5 rounded-xl border-l-4 border-l-[#C8F53E]">
                  <div className="flex items-center justify-between text-gray-400 font-mono text-xs mb-1">
                    <span>EST. CROP LOSS PREVENTED</span>
                    <TrendingUp className="w-4 h-4 text-[#C8F53E]" />
                  </div>
                  <div className="font-bebas text-3xl text-white tracking-wide">
                    ~${estLossPrevented.toLocaleString()} <span className="font-sans text-xs text-gray-400 font-normal">/ season</span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1 font-mono">Based on 72h early pathogen intervention</p>
                </div>

                <div className="glass-card p-5 rounded-xl border-l-4 border-l-emerald-400">
                  <div className="flex items-center justify-between text-gray-400 font-mono text-xs mb-1">
                    <span>INPUT & PESTICIDE REDUCTION</span>
                    <BarChart3 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="font-bebas text-3xl text-white tracking-wide">
                    ~28% <span className="font-sans text-xs text-emerald-400 font-normal">(~${estChemSavings.toLocaleString()} saved)</span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1 font-mono">Variable rate target micro-spraying</p>
                </div>
              </div>

              {/* PRIMARY ACTION BUTTON */}
              <Link 
                href="/dashboard" 
                className="w-full bg-[#C8F53E] hover:bg-[#b5e02c] text-[#060A04] font-mono font-black text-sm tracking-wider py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-[0_0_25px_rgba(200,245,62,0.35)] hover:shadow-[0_0_35px_rgba(200,245,62,0.5)] transform hover:-translate-y-0.5 active:translate-y-0 text-center"
              >
                DEPLOY CROPGUARD TO YOUR FIELD <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="text-center font-mono text-xs text-gray-500">
                ⚡ Instant Setup · No Hardware Required · 14-Day Free Evaluation
              </div>

            </div>

          </div>
        </section>

        {/* BOTTOM SECTION: OPERATIONAL TIERS */}
        <section className="py-16 border-t border-white/5 bg-[#060A04]/90 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-14">
              <div className="font-mono text-xs text-[#C8F53E] tracking-widest uppercase mb-2">
                FIXED PLANS FOR FARMS & ENTERPRISES
              </div>
              <h2 className="font-bebas text-4xl sm:text-5xl lg:text-6xl text-white tracking-wide">
                SCALE YOUR INTELLIGENCE
              </h2>
              <p className="text-gray-400 text-base mt-2">
                Select the operational tier that matches your farm&apos;s scale, fleet size, and agronomy workflows.
              </p>
            </div>

            {/* 3 TIERS GRID */}
            <div className="pricing-grid mb-16">
              
              {/* TIER 1: KISAN / PILOT */}
              <div className="glass-card glass-card-hover p-8 rounded-2xl flex flex-col justify-between border-white/10 relative">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-mono text-xs text-gray-400 tracking-widest uppercase">
                      RESEARCH / KISAN
                    </span>
                    <span className="bg-white/10 text-gray-300 text-[10px] font-mono px-2 py-0.5 rounded">
                      FREE TIER
                    </span>
                  </div>
                  
                  <div className="font-bebas text-5xl text-white mb-1">
                    $0
                  </div>
                  <div className="font-mono text-xs text-gray-400 mb-6">
                    Free forever for smallholders & research
                  </div>

                  <div className="border-t border-white/10 pt-6 space-y-3.5 mb-8 font-mono text-xs text-gray-300">
                    <div className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-[#C8F53E] flex-shrink-0" />
                      <span>Up to <strong>50 Acres</strong> Monitored</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-[#C8F53E] flex-shrink-0" />
                      <span>Mobile AI Edge Leaf Scan</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-[#C8F53E] flex-shrink-0" />
                      <span>Standard RGB Pathogen ID</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-[#C8F53E] flex-shrink-0" />
                      <span>30-Day Crop Health History</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-[#C8F53E] flex-shrink-0" />
                      <span>Community Forum Support</span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/login"
                  className="w-full border border-white/20 hover:border-[#C8F53E] text-white hover:text-[#C8F53E] font-mono text-xs font-bold py-3.5 rounded-lg text-center transition-all bg-white/5 hover:bg-[#C8F53E]/10"
                >
                  START FREE PILOT →
                </Link>
              </div>

              {/* TIER 2: COMMERCIAL FLEET (HIGHLIGHTED) */}
              <div className="glass-card p-8 rounded-2xl flex flex-col justify-between border-2 border-[#C8F53E] relative transform md:-translate-y-3 shadow-[0_20px_50px_rgba(200,245,62,0.15)] bg-[#0C1308]">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#C8F53E] text-[#060A04] font-mono text-[11px] font-black px-4 py-0.5 rounded-full shadow-[0_0_15px_#C8F53E] tracking-wider uppercase">
                  MOST POPULAR
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4 mt-1">
                    <span className="font-mono text-xs text-[#C8F53E] tracking-widest uppercase font-bold">
                      COMMERCIAL FLEET
                    </span>
                    <span className="bg-[#C8F53E]/20 text-[#C8F53E] text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                      FULL SUITE
                    </span>
                  </div>

                  <div className="font-bebas text-6xl text-[#C8F53E] mb-1 glow-text">
                    {yearly ? '$399' : '$499'} <span className="font-sans text-lg text-gray-400 font-normal">/ mo</span>
                  </div>
                  <div className="font-mono text-xs text-gray-400 mb-6">
                    Billed {yearly ? 'annually (save $1,200/yr)' : 'monthly'}
                  </div>

                  <div className="border-t border-white/10 pt-6 space-y-3.5 mb-8 font-mono text-xs text-gray-200">
                    <div className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-[#C8F53E] flex-shrink-0" />
                      <span>Up to <strong>2,000 Acres</strong> Included</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-[#C8F53E] flex-shrink-0" />
                      <span>Drone Multi-Spectral Sync (NDVI/Thermal)</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-[#C8F53E] flex-shrink-0" />
                      <span>Orbital Sentinel & Radar Early Warning</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-[#C8F53E] flex-shrink-0" />
                      <span>Yield Forecasting & Spore Drift AI</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-[#C8F53E] flex-shrink-0" />
                      <span>API Access for 10 Farm Managers</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-[#C8F53E] flex-shrink-0" />
                      <span>24/7 Priority Agronomist Desk</span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/login"
                  className="w-full bg-[#C8F53E] hover:bg-[#b5e02c] text-[#060A04] font-mono text-xs font-black py-3.5 rounded-lg text-center transition-all shadow-[0_0_20px_rgba(200,245,62,0.4)]"
                >
                  DEPLOY COMMERCIAL FLEET →
                </Link>
              </div>

              {/* TIER 3: ENTERPRISE */}
              <div className="glass-card glass-card-hover p-8 rounded-2xl flex flex-col justify-between border-white/10 relative">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-mono text-xs text-amber-400 tracking-widest uppercase">
                      GLOBAL ENTERPRISE
                    </span>
                    <span className="bg-amber-400/10 text-amber-400 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                      CUSTOM DEPLOY
                    </span>
                  </div>

                  <div className="font-bebas text-5xl text-white mb-1">
                    CUSTOM
                  </div>
                  <div className="font-mono text-xs text-gray-400 mb-6">
                    For cooperatives, agri-enterprises & governments
                  </div>

                  <div className="border-t border-white/10 pt-6 space-y-3.5 mb-8 font-mono text-xs text-gray-300">
                    <div className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      <span><strong>Unlimited Acreage</strong> & Fleets</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      <span>Custom AI Model Fine-Tuning</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      <span>Air-Gapped On-Premise Deployment</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      <span>Satellite Swarm Tasking On-Demand</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      <span>Dedicated Lead Agronomist & SLA</span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/contact"
                  className="w-full border border-amber-400/40 hover:border-amber-400 text-amber-400 hover:bg-amber-400/10 font-mono text-xs font-bold py-3.5 rounded-lg text-center transition-all"
                >
                  TALK TO ENTERPRISE SALES →
                </Link>
              </div>

            </div>

            {/* FEATURE COMPARISON ACCORDION / TABLE */}
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-6">
                <button
                  type="button"
                  onClick={() => setShowTable(!showTable)}
                  className="inline-flex items-center gap-2 font-mono text-xs tracking-wider uppercase text-[#C8F53E] border border-[#C8F53E]/30 bg-[#C8F53E]/5 px-5 py-2.5 rounded-lg hover:bg-[#C8F53E]/15 transition-all"
                >
                  {showTable ? (
                    <>
                      HIDE FULL CAPABILITY MATRIX <ChevronUp className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      EXPAND FULL CAPABILITY MATRIX <ChevronDown className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {showTable && (
                <div className="glass-card rounded-xl overflow-x-auto p-4 sm:p-6 transition-all animate-in fade-in duration-300">
                  <table className="w-full min-w-[640px] text-left border-collapse font-mono text-xs">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="pb-3 text-gray-400">CAPABILITY</th>
                        <th className="pb-3 text-center text-gray-400">RESEARCH / KISAN</th>
                        <th className="pb-3 text-center text-[#C8F53E] bg-[#C8F53E]/5 rounded-t px-2">COMMERCIAL</th>
                        <th className="pb-3 text-center text-amber-400">ENTERPRISE</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {[
                        ['Monthly Scans', '50 Scans', 'Unlimited', 'Unlimited'],
                        ['Acreage Capacity', '50 Acres', 'Up to 2,000 Acres', 'Unlimited'],
                        ['Multi-Spectral Drone Sync', '—', 'NDVI + Thermal', 'Full 10-Band + LiDAR'],
                        ['Satellite Radar & Weather', 'Basic Forecast', 'Sentinel Daily Radar', 'Taskable Constellation'],
                        ['Pathogen Early Warning', 'Standard RGB', '72h Predictive AI', 'Custom Spore Modeling'],
                        ['Variable-Rate Nitrogen Prescriptions', '—', 'Included', 'Multi-zone Autonomous'],
                        ['API & Farm Management System Sync', '—', '10 Seats REST/Webhook', 'Unlimited + Custom SDK'],
                        ['Agronomist Support', 'Community Forum', '2h In-App Response', 'Dedicated On-Call Advisor'],
                        ['Deployment Model', 'Cloud SaaS', 'Cloud SaaS', 'Cloud or Air-Gapped On-Prem'],
                        ['Uptime & Data SLA Guarantee', 'Best Effort', '99.9% Uptime', '99.99% Financial SLA']
                      ].map(([feat, r, c, e], idx) => (
                        <tr key={idx} className="hover:bg-white/[0.02]">
                          <td className="py-3 font-medium text-white">{feat}</td>
                          <td className="py-3 text-center text-gray-400">{r}</td>
                          <td className="py-3 text-center text-[#C8F53E] font-bold bg-[#C8F53E]/5 px-2">{c}</td>
                          <td className="py-3 text-center text-amber-300">{e}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        </section>

        {/* SOCIAL PROOF & ENTERPRISE VALIDATION */}
        <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="font-mono text-xs text-[#C8F53E] tracking-widest uppercase mb-4">
            VALIDATED IN COMMERCIAL FIELDS ACROSS 23 COUNTRIES
          </div>
          
          <div className="flex justify-center gap-3 sm:gap-6 flex-wrap mb-10">
            {['AgriTech Labs', 'TerraYield Systems', 'FarmSense EU', 'CropChain Global', 'AgroPilot Robotics', 'Prairie Intel'].map((partner) => (
              <div 
                key={partner} 
                className="bg-[#0E140B] border border-white/10 hover:border-[#C8F53E]/40 px-5 py-2.5 rounded font-mono text-xs text-gray-300 font-bold tracking-wider transition-all"
              >
                {partner}
              </div>
            ))}
          </div>

          <div className="glass-card max-w-2xl mx-auto p-6 sm:p-8 rounded-2xl relative">
            <p className="text-base sm:text-lg italic text-gray-200 leading-relaxed mb-4">
              &ldquo;CropGuard AI detected early cercospora leaf spot in our sugar beet acreage four days before it was visible to scouts. The targeted fungicide spray saved over $84,000 across our northern parcel.&rdquo;
            </p>
            <div className="font-mono text-xs text-[#C8F53E]">
              — Jason Merritt · Operations Director, FarmSense EU (4,200 Acres)
            </div>
          </div>
        </section>

        {/* FREQUENTLY ASKED QUESTIONS */}
        <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="font-mono text-xs text-[#C8F53E] tracking-widest uppercase mb-2">
              CLARIFICATIONS & FAQ
            </div>
            <h2 className="font-bebas text-4xl sm:text-5xl text-white tracking-wide">
              FREQUENTLY ASKED QUESTIONS
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="glass-card rounded-xl border border-white/10 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left p-5 flex justify-between items-center gap-4 font-medium text-sm sm:text-base text-white hover:text-[#C8F53E] transition-colors"
                >
                  <span>{faq.q}</span>
                  <span className={`text-[#C8F53E] font-mono text-lg transition-transform duration-200 ${openFaq === i ? 'rotate-45' : ''}`}>
                    +
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-gray-400 text-xs sm:text-sm leading-relaxed border-t border-white/5 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* BOTTOM CTA: TALK TO AN AGRONOMIST */}
        <section className="bg-[#C8F53E] text-[#060A04] py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bebas text-[20vw] font-black opacity-10 select-none pointer-events-none whitespace-nowrap">
            CROPGUARD
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="font-bebas text-4xl sm:text-6xl font-black italic tracking-tight leading-none mb-3">
              NOT SURE WHICH PLAN FITS YOUR OPERATION?
            </h2>
            <p className="text-sm sm:text-base text-[#060A04]/80 max-w-xl mx-auto mb-8 font-medium">
              Schedule a 15-minute consultation with a certified CropGuard agronomist. We&apos;ll analyze your acreage, crop types, and drone telemetry requirements.
            </p>

            <div className="flex justify-center gap-4 flex-wrap">
              <Link
                href="/contact"
                className="bg-[#060A04] hover:bg-[#111A08] text-[#C8F53E] font-mono text-xs font-black py-3.5 px-6 rounded-lg transition-all flex items-center gap-2 shadow-lg"
              >
                <PhoneCall className="w-4 h-4" /> BOOK A FREE 15-MIN AGRONOMIST AUDIT
              </Link>
              <Link
                href="/dashboard"
                className="bg-transparent hover:bg-[#060A04]/10 text-[#060A04] border-2 border-[#060A04] font-mono text-xs font-black py-3.5 px-6 rounded-lg transition-all"
              >
                LAUNCH LIVE DASHBOARD DEMO →
              </Link>
            </div>
          </div>
        </section>

        <Footer />

      </div>
    </>
  );
}
