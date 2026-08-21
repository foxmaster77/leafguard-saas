'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { 
  ShieldCheck, 
  Sparkles, 
  Check, 
  ArrowRight,
  PhoneCall,
  Sprout, 
  Building2, 
  ShoppingBag, 
  Activity, 
  ChevronDown, 
  ChevronUp, 
  HeartHandshake,
  Bot,
  Leaf
} from 'lucide-react';

const css = `
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
    animation: marqueeScroll 28s linear infinite;
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

  @media (max-width: 1024px) {
    .pricing-grid {
      grid-template-columns: 1fr !important;
      max-width: 580px;
      margin: 0 auto;
    }
  }
`;

const faqs = [
  {
    q: 'Why is the core crop diagnosis completely free for farmers?',
    a: 'We believe agricultural disease diagnostics and food security should never be behind a paywall for smallholder farmers. Individual growers and smallholders can diagnose crop diseases, view IPM-based treatments, and listen to voice advisories without any subscription or hidden fees.'
  },
  {
    q: 'How does the platform sustain its cloud AI and development costs?',
    a: 'LeafGuard operates on a proven dual-monetization model: (1) B2G and institutional licensing with State Agriculture Departments, Krishi Vigyan Kendras (KVKs), and Farmer Producer Organizations (FPOs) for regional outbreak surveillance dashboards, and (2) a small, transparent platform commission on verified organic remedies and inputs purchased through our marketplace.'
  },
  {
    q: 'What AI technology powers the disease detection?',
    a: 'LeafGuard utilizes state-of-the-art multimodal vision models (Google Gemini and Groq LPU cloud inference) to evaluate leaf photos, identify pathogen signatures, and generate detailed agronomic remediation plans aligned with ICAR standards.'
  },
  {
    q: 'Does LeafGuard require any drone, satellite, or specialized hardware?',
    a: 'No. LeafGuard is designed to be accessible on standard smartphones directly through the browser. Farmers simply snap a photo of an affected leaf using their phone camera — no external sensors, drones, or costly hardware required.'
  },
  {
    q: 'How do State Departments of Agriculture and Cooperatives partner with LeafGuard?',
    a: 'Institutional partners can deploy custom regional surveillance portals to monitor disease clusters, forecast seasonal pathogen vectors across districts, and broadcast real-time preventive advisories to thousands of registered farmers.'
  },
  {
    q: 'Are treatment recommendations biased toward sponsored products?',
    a: 'Never. Our AI strictly prioritizes Integrated Pest Management (IPM), cultural practices, and organic bio-controls first. Chemical interventions are recommended strictly according to official dosage guidelines when necessary.'
  }
];

export default function PricingPage() {
  const [farmerCount, setFarmerCount] = useState<number>(1200);
  const [showTable, setShowTable] = useState<boolean>(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Impact Calculations (Based on average smallholder metrics: ~2.5 acres per farm, ~3-4 scans/season)
  const estScansPerSeason = farmerCount * 4;
  const estAcreageProtected = Math.round(farmerCount * 2.5);
  const estOutbreaksMitigated = Math.round(farmerCount * 0.35);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <Navigation />
      
      <div className="bg-[#060A04] text-white font-sans min-h-screen pt-20">
        
        {/* TOP STATUS TICKER */}
        <div className="bg-[#0A0E07] border-b border-[#C8F53E]/20 py-2.5 marquee-container font-mono text-xs text-[#C8F53E]">
          <div className="marquee-content flex gap-8 items-center">
            <span>● SUSTAINABLE AGRI-TECH MODEL</span>
            <span>● 100% FREE CORE DIAGNOSTICS FOR FARMERS</span>
            <span>● B2G REGIONAL OUTBREAK MONITORING</span>
            <span>● ETHICAL MARKETPLACE COMMERCE</span>
            <span>● POWERED BY GEMINI & GROQ CLOUD AI</span>
            <span>● SUSTAINABLE AGRI-TECH MODEL</span>
            <span>● 100% FREE CORE DIAGNOSTICS FOR FARMERS</span>
            <span>● B2G REGIONAL OUTBREAK MONITORING</span>
            <span>● ETHICAL MARKETPLACE COMMERCE</span>
            <span>● POWERED BY GEMINI & GROQ CLOUD AI</span>
          </div>
        </div>

        {/* HERO HEADER */}
        <section className="relative overflow-hidden pt-14 pb-10 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#C8F53E]/10 border border-[#C8F53E]/40 px-3.5 py-1 rounded-full text-xs font-mono text-[#C8F53E] tracking-widest uppercase mb-4 shadow-[0_0_15px_rgba(200,245,62,0.2)]">
            <Sparkles className="w-3.5 h-3.5" /> TRANSPARENT & MISSION-DRIVEN BUSINESS MODEL
          </div>
          <h1 className="font-bebas text-4xl sm:text-6xl lg:text-7xl font-black italic tracking-wide text-white leading-none mb-4">
            FREE FOR FARMERS. SUSTAINED BY THE ECOSYSTEM.
          </h1>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            We believe crop health intelligence is a fundamental utility for smallholders. Our platform is sustained through institutional public-sector partnerships and ethical agri-marketplace commerce.
          </p>
        </section>

        {/* 3 PILLARS REVENUE MODEL GRID */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="pricing-grid mb-16">
            
            {/* PILLAR 1: SMALLHOLDER FARMERS (100% FREE FOREVER) */}
            <div className="glass-card glass-card-hover p-8 rounded-2xl flex flex-col justify-between border-white/10 relative">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="font-mono text-xs text-gray-400 tracking-widest uppercase flex items-center gap-1.5">
                    <Sprout className="w-4 h-4 text-[#C8F53E]" /> SMALLHOLDERS & GROWERS
                  </span>
                  <span className="bg-[#C8F53E]/15 text-[#C8F53E] border border-[#C8F53E]/30 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                    FREE FOREVER
                  </span>
                </div>
                
                <div className="font-bebas text-5xl sm:text-6xl text-white mb-1">
                  ₹0 <span className="font-sans text-lg text-gray-400 font-normal">/ month</span>
                </div>
                <div className="font-mono text-xs text-gray-400 mb-6">
                  Zero barrier to entry for individual farmers & researchers
                </div>

                <div className="border-t border-white/10 pt-6 space-y-3.5 mb-8 font-mono text-xs text-gray-300">
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#C8F53E] flex-shrink-0 mt-0.5" />
                    <span><strong>Unlimited Leaf Disease Scans</strong> via smartphone camera</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#C8F53E] flex-shrink-0 mt-0.5" />
                    <span><strong>Cloud AI Multimodal Vision</strong> (Gemini / Groq)</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#C8F53E] flex-shrink-0 mt-0.5" />
                    <span><strong>Organic & IPM Treatment Guides</strong> (Step-by-step)</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#C8F53E] flex-shrink-0 mt-0.5" />
                    <span><strong>Regional Voice Advisory</strong> in native languages</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#C8F53E] flex-shrink-0 mt-0.5" />
                    <span><strong>Community Outbreak Alerts</strong> & seasonal warnings</span>
                  </div>
                </div>
              </div>

              <Link
                href="/analyze"
                className="w-full bg-[#C8F53E] hover:bg-[#b5e02c] text-[#060A04] font-mono text-xs font-black py-3.5 rounded-lg text-center transition-all shadow-[0_0_20px_rgba(200,245,62,0.3)] flex items-center justify-center gap-2"
              >
                START FREE CROP DIAGNOSIS <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* PILLAR 2: B2G & COOPERATIVES (CORE REVENUE - HIGHLIGHTED) */}
            <div className="glass-card p-8 rounded-2xl flex flex-col justify-between border-2 border-[#C8F53E] relative transform md:-translate-y-3 shadow-[0_20px_50px_rgba(200,245,62,0.15)] bg-[#0C1308]">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#C8F53E] text-[#060A04] font-mono text-[11px] font-black px-4 py-0.5 rounded-full shadow-[0_0_15px_#C8F53E] tracking-wider uppercase">
                PRIMARY REVENUE PILLAR
              </div>

              <div>
                <div className="flex justify-between items-center mb-4 mt-1">
                  <span className="font-mono text-xs text-[#C8F53E] tracking-widest uppercase font-bold flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-[#C8F53E]" /> B2G & COOPERATIVES
                  </span>
                  <span className="bg-[#C8F53E]/20 text-[#C8F53E] text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                    INSTITUTIONAL
                  </span>
                </div>

                <div className="font-bebas text-5xl sm:text-6xl text-[#C8F53E] mb-1 glow-text">
                  PILOT LICENSING
                </div>
                <div className="font-mono text-xs text-gray-400 mb-6">
                  For State Agri-Depts, KVKs, FPOs & Research Boards
                </div>

                <div className="border-t border-white/10 pt-6 space-y-3.5 mb-8 font-mono text-xs text-gray-200">
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#C8F53E] flex-shrink-0 mt-0.5" />
                    <span><strong>District-Wide Outbreak Surveillance</strong> live heatmaps</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#C8F53E] flex-shrink-0 mt-0.5" />
                    <span><strong>Epidemic Vector Forecasting</strong> & spread velocity</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#C8F53E] flex-shrink-0 mt-0.5" />
                    <span><strong>Broadcast Advisory Integration</strong> (SMS / Regional Dial)</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#C8F53E] flex-shrink-0 mt-0.5" />
                    <span><strong>Aggregated Anonymized Telemetry</strong> for policy planning</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#C8F53E] flex-shrink-0 mt-0.5" />
                    <span><strong>Custom Crop Taxonomy & ICAR Alignment</strong> rule-sets</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#C8F53E] flex-shrink-0 mt-0.5" />
                    <span><strong>Dedicated Technical & Onboarding SLA</strong> for field officers</span>
                  </div>
                </div>
              </div>

              <Link
                href="/contact"
                className="w-full bg-[#C8F53E] hover:bg-[#b5e02c] text-[#060A04] font-mono text-xs font-black py-3.5 rounded-lg text-center transition-all shadow-[0_0_20px_rgba(200,245,62,0.4)] flex items-center justify-center gap-2"
              >
                REQUEST INSTITUTIONAL PILOT <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* PILLAR 3: ETHICAL MARKETPLACE & SERVICES */}
            <div className="glass-card glass-card-hover p-8 rounded-2xl flex flex-col justify-between border-white/10 relative">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="font-mono text-xs text-amber-400 tracking-widest uppercase flex items-center gap-1.5">
                    <ShoppingBag className="w-4 h-4 text-amber-400" /> INPUT VENDORS & EXPERTS
                  </span>
                  <span className="bg-amber-400/10 text-amber-400 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                    COMMISSION
                  </span>
                </div>

                <div className="font-bebas text-5xl sm:text-6xl text-white mb-1">
                  FAIR SHARE <span className="font-sans text-lg text-gray-400 font-normal">model</span>
                </div>
                <div className="font-mono text-xs text-gray-400 mb-6">
                  Small transaction commission on verified organic products
                </div>

                <div className="border-t border-white/10 pt-6 space-y-3.5 mb-8 font-mono text-xs text-gray-300">
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Certified Organic & Bio-Input Marketplace</strong></span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Transparent Take-Rate</strong> on completed orders</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Strict Quality & Efficacy Verification</strong> (No unverified chemicals)</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Direct Agronomist Booking Desk</strong> for complex consultations</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Zero Price Markup for Farmers</strong> over standard retail</span>
                  </div>
                </div>
              </div>

              <Link
                href="/marketplace"
                className="w-full border border-amber-400/40 hover:border-amber-400 text-amber-400 hover:bg-amber-400/10 font-mono text-xs font-bold py-3.5 rounded-lg text-center transition-all flex items-center justify-center gap-2"
              >
                EXPLORE AGRI-MARKETPLACE <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </section>

        {/* INTERACTIVE IMPACT & COMMUNITY REACH CALCULATOR */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="glass-card p-6 sm:p-10 rounded-2xl relative overflow-hidden border-[#C8F53E]/25">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div>
                <div className="inline-flex items-center gap-2 bg-[#C8F53E]/10 border border-[#C8F53E]/30 px-3 py-1 rounded text-xs font-mono text-[#C8F53E] uppercase mb-2">
                  <Activity className="w-3.5 h-3.5" /> ECOSYSTEM IMPACT ESTIMATOR
                </div>
                <h2 className="font-bebas text-3xl sm:text-4xl text-white tracking-wide">
                  COMMUNITY SCALE & DISEASE SURVEILLANCE CAPACITY
                </h2>
              </div>
              <span className="font-mono text-xs text-gray-400 bg-[#0E140B] px-3 py-1.5 rounded border border-white/5">
                Simulate your cooperative or district scale
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Slider Controls */}
              <div className="lg:col-span-6 space-y-5">
                <div className="flex justify-between items-center">
                  <label className="font-mono text-xs text-gray-400 uppercase tracking-wider">
                    REGISTERED FARMER COHORT
                  </label>
                  <span className="font-mono text-xs text-[#C8F53E] bg-[#C8F53E]/10 px-2.5 py-0.5 rounded font-bold">
                    {farmerCount.toLocaleString()} Farmers
                  </span>
                </div>

                <div className="flex items-baseline gap-3">
                  <span className="font-bebas text-5xl sm:text-6xl text-[#C8F53E] glow-text leading-none">
                    {farmerCount.toLocaleString()}
                  </span>
                  <span className="font-bebas text-2xl text-gray-300">
                    GROWERS CONNECTED
                  </span>
                </div>

                <input
                  type="range"
                  min="100"
                  max="25000"
                  step="100"
                  value={farmerCount}
                  onChange={(e) => setFarmerCount(parseInt(e.target.value))}
                  className="agri-slider"
                />

                {/* Preset Chips */}
                <div className="flex gap-2 flex-wrap pt-2">
                  {[250, 1000, 2500, 5000, 10000, 25000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setFarmerCount(preset)}
                      className={`text-[11px] font-mono px-3 py-1 rounded transition-all ${
                        farmerCount === preset
                          ? 'bg-[#C8F53E] text-[#060A04] font-bold shadow-[0_0_10px_rgba(200,245,62,0.4)]'
                          : 'bg-[#182012] text-gray-400 hover:text-white hover:bg-[#222c1b] border border-white/5'
                      }`}
                    >
                      {preset >= 1000 ? `${preset / 1000}k Farmers` : `${preset} Farmers`}
                    </button>
                  ))}
                </div>

                <p className="font-mono text-xs text-gray-500 leading-relaxed pt-2">
                  * Based on field deployment metrics across smallholder agricultural clusters in Eastern India.
                </p>
              </div>

              {/* Impact Display Metrics */}
              <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#0E140B] p-5 rounded-xl border border-white/10">
                  <div className="flex items-center justify-between text-gray-400 font-mono text-xs mb-1">
                    <span>EST. SEASONAL SCANS</span>
                    <Bot className="w-4 h-4 text-[#C8F53E]" />
                  </div>
                  <div className="font-bebas text-3xl sm:text-4xl text-white tracking-wide">
                    ~{estScansPerSeason.toLocaleString()}
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1 font-mono">100% free cloud AI evaluations</p>
                </div>

                <div className="bg-[#0E140B] p-5 rounded-xl border border-white/10">
                  <div className="flex items-center justify-between text-gray-400 font-mono text-xs mb-1">
                    <span>EST. PROTECTED FARMLAND</span>
                    <Leaf className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="font-bebas text-3xl sm:text-4xl text-white tracking-wide">
                    ~{estAcreageProtected.toLocaleString()} <span className="font-sans text-xs text-gray-400 font-normal">Acres</span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1 font-mono">Monitored through active scans</p>
                </div>

                <div className="bg-[#0E140B] p-5 rounded-xl border border-white/10">
                  <div className="flex items-center justify-between text-gray-400 font-mono text-xs mb-1">
                    <span>POTENTIAL OUTBREAKS BLUNTED</span>
                    <ShieldCheck className="w-4 h-4 text-[#C8F53E]" />
                  </div>
                  <div className="font-bebas text-3xl sm:text-4xl text-white tracking-wide">
                    ~{estOutbreaksMitigated.toLocaleString()}
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1 font-mono">Via early 48h leaf symptom detection</p>
                </div>

                <div className="bg-[#0E140B] p-5 rounded-xl border border-white/10">
                  <div className="flex items-center justify-between text-gray-400 font-mono text-xs mb-1">
                    <span>FARMER ADVISORY SAVINGS</span>
                    <HeartHandshake className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="font-bebas text-3xl sm:text-4xl text-white tracking-wide">
                    ₹0 COST
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1 font-mono">Zero paywalls for growers</p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* COMPARISON MATRIX */}
        <section className="py-12 border-t border-white/5 bg-[#060A04]/90 relative">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <div className="font-mono text-xs text-[#C8F53E] tracking-widest uppercase mb-2">
                DETAILED BREAKDOWN
              </div>
              <h2 className="font-bebas text-3xl sm:text-5xl text-white tracking-wide">
                CAPABILITY & ACCESS MATRIX
              </h2>
            </div>

            <div className="text-center mb-6">
              <button
                type="button"
                onClick={() => setShowTable(!showTable)}
                className="inline-flex items-center gap-2 font-mono text-xs tracking-wider uppercase text-[#C8F53E] border border-[#C8F53E]/30 bg-[#C8F53E]/5 px-5 py-2.5 rounded-lg hover:bg-[#C8F53E]/15 transition-all"
              >
                {showTable ? (
                  <>
                    HIDE FULL MATRIX <ChevronUp className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    EXPAND CAPABILITY MATRIX <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {showTable && (
              <div className="glass-card rounded-xl overflow-x-auto p-4 sm:p-6 transition-all animate-in fade-in duration-300">
                <table className="w-full min-w-[640px] text-left border-collapse font-mono text-xs">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="pb-3 text-gray-400">FEATURE & CAPABILITY</th>
                      <th className="pb-3 text-center text-[#C8F53E] bg-[#C8F53E]/5 rounded-t px-2">FARMER TIER (FREE)</th>
                      <th className="pb-3 text-center text-white">B2G & COOPERATIVES</th>
                      <th className="pb-3 text-center text-amber-400">INPUT PARTNERS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {[
                      ['Leaf Disease Photo Diagnosis', 'Unlimited (Free)', 'Unlimited (All Members)', 'Access to Trends'],
                      ['AI Vision Engine', 'Cloud Gemini & Groq', 'Cloud Gemini & Groq', 'API Verification'],
                      ['Organic & IPM Treatment Guides', 'Full Access', 'Full Customization', 'Product Matching'],
                      ['Regional Voice & Audio Output', 'Bangla, Hindi, English', 'Custom Regional Dialects', '—'],
                      ['District Outbreak Surveillance Map', 'Local Alerts', 'Full Interactive Heatmap', 'Regional Demand Trends'],
                      ['SMS / Voice Broadcast Advisories', 'Receive Alerts', 'Broadcast to All Farmers', '—'],
                      ['ICAR / State Agronomy Rulesets', 'Standard Rules', 'Custom Policy Config', 'Certified Cataloging'],
                      ['Marketplace Input Purchases', 'Transparent Retail', 'Bulk Group Purchasing', 'Verified Listing'],
                      ['Technical Support', 'Community Forum', 'Dedicated SLA & Officer Desk', 'Vendor Onboarding Desk'],
                      ['Pricing Model', '₹0 Free Forever', 'Institutional Pilot License', 'Transparent Transaction Fee']
                    ].map(([feat, r, c, e], idx) => (
                      <tr key={idx} className="hover:bg-white/[0.02]">
                        <td className="py-3 font-medium text-white">{feat}</td>
                        <td className="py-3 text-center text-[#C8F53E] font-bold bg-[#C8F53E]/5 px-2">{r}</td>
                        <td className="py-3 text-center text-white">{c}</td>
                        <td className="py-3 text-center text-amber-300">{e}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        {/* FREQUENTLY ASKED QUESTIONS */}
        <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="font-mono text-xs text-[#C8F53E] tracking-widest uppercase mb-2">
              HONEST ANSWERS & TRANSPARENCY
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

        {/* BOTTOM CTA: PARTNER WITH US */}
        <section className="bg-[#C8F53E] text-[#060A04] py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bebas text-[18vw] font-black opacity-10 select-none pointer-events-none whitespace-nowrap">
            LEAFGUARD AI
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="font-bebas text-4xl sm:text-6xl font-black italic tracking-tight leading-none mb-3">
              READY TO BRING AI CROP PROTECTION TO YOUR REGION?
            </h2>
            <p className="text-sm sm:text-base text-[#060A04]/80 max-w-xl mx-auto mb-8 font-medium">
              Join agricultural departments, farmer producer organizations, and agronomists deploying accessible, zero-cost AI diagnostics to smallholder communities.
            </p>

            <div className="flex justify-center gap-4 flex-wrap">
              <Link
                href="/contact"
                className="bg-[#060A04] hover:bg-[#111A08] text-[#C8F53E] font-mono text-xs font-black py-3.5 px-6 rounded-lg transition-all flex items-center gap-2 shadow-lg"
              >
                <PhoneCall className="w-4 h-4" /> DISCUSS AN INSTITUTIONAL PILOT
              </Link>
              <Link
                href="/analyze"
                className="bg-transparent hover:bg-[#060A04]/10 text-[#060A04] border-2 border-[#060A04] font-mono text-xs font-black py-3.5 px-6 rounded-lg transition-all"
              >
                TRY FREE LEAF DIAGNOSTIC →
              </Link>
            </div>
          </div>
        </section>

        <Footer />

      </div>
    </>
  );
}
