'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { 
  Sprout, 
  Landmark, 
  Cpu, 
  Mic, 
  Send, 
  CheckCircle2, 
  Phone, 
  Radio, 
  Activity, 
  Globe, 
  Terminal, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight,
  ShieldCheck,
  Clock,
  MapPin,
  Layers,
  Zap,
  PhoneCall,
  MessageSquare
} from 'lucide-react';
import * as THREE from 'three';

const inquiryTypes = [
  { id: 'commercial', label: 'Commercial Farm', icon: Sprout, desc: '500+ acres, drone fleets & enterprise OS' },
  { id: 'govt', label: 'Govt & Regional Co-op', icon: Landmark, desc: 'State agricultural subsidies & bulk pilots' },
  { id: 'dev', label: 'Developer / API Access', icon: Cpu, desc: 'REST, Webhooks & Edge AI model SDKs' },
  { id: 'voice', label: 'Regional Voice Support', icon: Mic, desc: 'Bangla, Hindi & regional dial-in access' },
];

const hubs = [
  { name: 'Kolkata Regional Hub', loc: 'Salt Lake Sec V, West Bengal, India', coords: '22.5726° N, 88.3639° E', status: 'ACTIVE · HARVEST DISPATCH' },
  { name: 'San Francisco HQ', loc: 'Mission Bay Cyber-Agri Center, CA, USA', coords: '37.7749° N, 122.4194° W', status: 'ACTIVE · AI CORE LAB' },
  { name: 'Munich Bio-Agri Hub', loc: 'Bavaria Precision Tech Park, Germany', coords: '48.1351° N, 11.5820° E', status: 'ACTIVE · EU SPECTRAL' },
];

const faqs = [
  {
    q: 'How fast can we onboard a 5,000-acre commercial farm or cooperative?',
    a: 'Within 24 hours. Our technical team configures regional disease surveillance parameters, sets up district/block boundary mappings, and activates multi-language farmer advisory channels for your cooperative or region.'
  },
  {
    q: 'How do government pilot programs & farmer collective subsidies work?',
    a: 'We partner directly with State Departments of Agriculture, Krishi Vigyan Kendras (KVKs), and cooperatives. We provide dedicated localized voice support in Bangla, Hindi, and regional dialects, subsidizing tier deployments for smallholder clusters.'
  },
  {
    q: 'Can CropGuard AI integrate with existing tractor ISOBUS and drone hardware?',
    a: 'Yes. Our platform provides standard REST APIs and ISOBUS XML output to stream variable-rate prescription maps directly to John Deere Operations Center, DJI Agras, Climate FieldView, and custom spray controllers.'
  },
  {
    q: 'What languages does the Regional Voice AI hotline support?',
    a: 'The voice AI system supports native Bangla (বাংলা), Hindi (हिन्दी), Marathi, and English. Farmers can dial directly to describe crop leaf symptoms, receive treatment audio instructions, or connect to human agronomists.'
  },
  {
    q: 'What data security, air-gapped on-premise, and privacy guarantees exist?',
    a: 'Farm geospatial boundaries and crop health datasets are encrypted at rest with AES-256 and never shared or sold. For defense or sensitive agricultural reserves, we provide containerized, air-gapped on-premise server deployment.'
  },
  {
    q: 'Do you offer a free evaluation for agronomists and university researchers?',
    a: 'Yes. Academic institutions, student agronomists, and non-profit research stations qualify for full access to our Research Pilot tier with zero license costs.'
  }
];

// Interactive 3D Wireframe / Multi-Spectral Orb Component
function SpectralOrbCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 360;
    const height = container.clientHeight || 240;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Inner Icosahedron Wireframe
    const icoGeo = new THREE.IcosahedronGeometry(1.6, 2);
    const icoMat = new THREE.MeshBasicMaterial({
      color: 0x10B981,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const icoMesh = new THREE.Mesh(icoGeo, icoMat);
    scene.add(icoMesh);

    // Outer Spectral Ring 1
    const ring1Geo = new THREE.TorusGeometry(2.3, 0.02, 16, 100);
    const ring1Mat = new THREE.MeshBasicMaterial({ color: 0xA3E635, transparent: true, opacity: 0.7 });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    scene.add(ring1);

    // Outer Spectral Ring 2 (Cyan)
    const ring2Geo = new THREE.TorusGeometry(2.7, 0.02, 16, 100);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0x06B6D4, transparent: true, opacity: 0.5 });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = Math.PI / 3;
    scene.add(ring2);

    // Organic Floating Canopy Particles
    const particleCount = 180;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      const radius = 1.8 + Math.random() * 1.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      pPos[i] = radius * Math.sin(phi) * Math.cos(theta);
      pPos[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pPos[i + 2] = radius * Math.cos(phi);
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      size: 0.06,
      color: 0xA3E635,
      transparent: true,
      opacity: 0.85,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    let frameId: number;
    let mouseX = 0;
    let mouseY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / width) * 2 - 1;
      mouseY = -(((e.clientY - rect.top) / height) * 2 - 1);
    };

    window.addEventListener('mousemove', onMouseMove);

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      icoMesh.rotation.x += 0.003;
      icoMesh.rotation.y += 0.005;

      ring1.rotation.z += 0.008;
      ring1.rotation.x += 0.004;

      ring2.rotation.y -= 0.006;
      ring2.rotation.z += 0.003;

      particles.rotation.y += 0.002;

      camera.position.x += (mouseX * 1.5 - camera.position.x) * 0.05;
      camera.position.y += (mouseY * 1.5 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      icoGeo.dispose();
      icoMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      pGeo.dispose();
      pMat.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full min-h-[220px]" />;
}

export default function ContactPage() {
  const [selectedType, setSelectedType] = useState<string>('commercial');
  const [name, setName] = useState<string>('');
  const [organization, setOrganization] = useState<string>('');
  const [contactInfo, setContactInfo] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [acres, setAcres] = useState<number>(500);
  const [message, setMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1200);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setName('');
    setOrganization('');
    setContactInfo('');
    setLocation('');
    setMessage('');
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700;900&family=JetBrains+Mono:wght@400;500;700&display=swap');
          
          .font-bebas { font-family: 'Bebas Neue', sans-serif; }
          .font-mono { font-family: 'JetBrains Mono', monospace; }

          /* Abstract Crop Canopy Mesh Grid Background */
          .cyber-mesh-bg {
            background-color: #04070D;
            background-image: 
              radial-gradient(ellipse at 50% 0%, rgba(16, 185, 129, 0.12) 0%, transparent 60%),
              radial-gradient(ellipse at 90% 40%, rgba(6, 182, 212, 0.08) 0%, transparent 50%),
              radial-gradient(ellipse at 10% 70%, rgba(163, 230, 53, 0.07) 0%, transparent 50%),
              linear-gradient(rgba(16, 185, 129, 0.035) 1px, transparent 1px),
              linear-gradient(90deg, rgba(16, 185, 129, 0.035) 1px, transparent 1px);
            background-size: 100% 100%, 100% 100%, 100% 100%, 48px 48px, 48px 48px;
            background-position: center, center, center, -1px -1px, -1px -1px;
          }

          .bento-glass {
            background: rgba(15, 23, 42, 0.55);
            backdrop-filter: blur(24px);
            -webkit-backdrop-filter: blur(24px);
            border: 1px solid rgba(16, 185, 129, 0.18);
            box-shadow: 0 16px 48px 0 rgba(0, 0, 0, 0.6);
          }

          .bento-glass:hover {
            border-color: rgba(163, 230, 53, 0.35);
          }

          .neon-glow-lime {
            text-shadow: 0 0 20px rgba(163, 230, 53, 0.5);
          }

          .neon-glow-emerald {
            box-shadow: 0 0 35px rgba(16, 185, 129, 0.25);
          }

          /* Floating label group styling */
          .input-group {
            position: relative;
          }
          .input-group input:focus ~ label,
          .input-group input:not(:placeholder-shown) ~ label {
            top: 6px;
            font-size: 10px;
            color: #A3E635;
          }

          /* Agritech slider */
          input[type=range].form-slider {
            -webkit-appearance: none;
            appearance: none;
            width: 100%;
            background: transparent;
          }
          input[type=range].form-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: #A3E635;
            cursor: pointer;
            margin-top: -8px;
            box-shadow: 0 0 12px rgba(163, 230, 53, 0.9);
            border: 2px solid #04070D;
          }
          input[type=range].form-slider::-webkit-slider-runnable-track {
            width: 100%;
            height: 4px;
            cursor: pointer;
            background: #1e293b;
            border-radius: 2px;
            border: 1px solid rgba(16, 185, 129, 0.25);
          }

          @keyframes pulseTelemetry {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.4; transform: scale(1.15); }
          }
          .pulse-dot-active {
            animation: pulseTelemetry 2s infinite ease-in-out;
          }
        `
      }} />

      <Navigation />

      <div className="cyber-mesh-bg text-slate-100 min-h-screen pt-28 pb-20 font-sans selection:bg-[#A3E635] selection:text-[#04070D]">
        
        {/* 1. ABSTRACT HERO HEADER */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 text-center">
          
          {/* Floating Live Status Pill */}
          <div className="inline-flex items-center gap-2.5 bg-[#0F172A]/80 border border-emerald-500/30 px-4 py-1.5 rounded-full text-xs font-mono text-emerald-400 mb-6 backdrop-blur-md shadow-[0_0_20px_rgba(16,185,129,0.15)]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#A3E635] pulse-dot-active" />
            <span className="tracking-widest font-semibold uppercase">
              REGIONAL HUB ACTIVE ● WEST BENGAL & GLOBAL PILOTS
            </span>
          </div>

          <h1 className="font-bebas text-5xl sm:text-7xl lg:text-8xl tracking-tight text-white italic leading-none mb-4">
            CONNECT WITH <span className="text-[#A3E635] neon-glow-lime">CROPGUARD OS</span>
          </h1>

          <p className="text-slate-400 text-base sm:text-xl max-w-3xl mx-auto font-normal leading-relaxed">
            Direct lines to our field agronomists, regional cooperative dispatchers, and enterprise machine-learning engineers.
          </p>

        </section>

        {/* 2. ASYMMETRIC BENTO GRID */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT BENTO CARD: ABSTRACT HIGH-TECH CONTACT FORM (60% / col-span-7) */}
            <div className="lg:col-span-7 bento-glass rounded-3xl p-6 sm:p-10 relative overflow-hidden">
              
              {/* Subtle ambient corner light */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              {!isSubmitted ? (
                <div>
                  
                  {/* Form Header */}
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-5 h-5 text-[#A3E635]" />
                      <span className="font-mono text-xs text-slate-300 font-bold uppercase tracking-widest">
                        TRANSMISSION CONSOLE // DISPATCH
                      </span>
                    </div>
                    <span className="font-mono text-[11px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded">
                      ENCRYPTED 256-BIT
                    </span>
                  </div>

                  {/* Inquiry Type Selector Pills */}
                  <div className="mb-8">
                    <label className="font-mono text-xs text-slate-400 uppercase tracking-wider block mb-3">
                      1. SELECT INQUIRY CHANNEL
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {inquiryTypes.map((type) => {
                        const IconComponent = type.icon;
                        const isSelected = selectedType === type.id;
                        return (
                          <button
                            key={type.id}
                            type="button"
                            onClick={() => setSelectedType(type.id)}
                            className={`p-3.5 rounded-2xl border text-left transition-all duration-200 flex items-start gap-3 ${
                              isSelected
                                ? 'bg-emerald-950/50 border-[#A3E635] shadow-[0_0_20px_rgba(163,230,53,0.2)]'
                                : 'bg-[#0B111E]/60 border-slate-800 hover:border-slate-700 hover:bg-[#0F172A]'
                            }`}
                          >
                            <div className={`p-2 rounded-xl mt-0.5 ${isSelected ? 'bg-[#A3E635] text-[#04070D]' : 'bg-slate-800 text-slate-400'}`}>
                              <IconComponent className="w-4 h-4" />
                            </div>
                            <div>
                              <div className={`text-xs font-mono font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                                {type.label}
                              </div>
                              <div className="text-[11px] text-slate-400 leading-tight mt-0.5">
                                {type.desc}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* High Tech Form Fields */}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      
                      {/* Full Name */}
                      <div className="input-group bg-[#080E1A]/80 border border-slate-800 focus-within:border-[#A3E635] rounded-2xl px-4 pt-5 pb-2 transition-all">
                        <input
                          id="name"
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder=" "
                          className="w-full bg-transparent text-sm text-white focus:outline-none font-mono"
                        />
                        <label
                          htmlFor="name"
                          className="absolute left-4 top-4 text-xs font-mono text-slate-400 transition-all pointer-events-none uppercase tracking-wider"
                        >
                          Full Name *
                        </label>
                      </div>

                      {/* Organization / Farm Name */}
                      <div className="input-group bg-[#080E1A]/80 border border-slate-800 focus-within:border-[#A3E635] rounded-2xl px-4 pt-5 pb-2 transition-all">
                        <input
                          id="org"
                          type="text"
                          required
                          value={organization}
                          onChange={(e) => setOrganization(e.target.value)}
                          placeholder=" "
                          className="w-full bg-transparent text-sm text-white focus:outline-none font-mono"
                        />
                        <label
                          htmlFor="org"
                          className="absolute left-4 top-4 text-xs font-mono text-slate-400 transition-all pointer-events-none uppercase tracking-wider"
                        >
                          Farm / Entity Name *
                        </label>
                      </div>

                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      
                      {/* Phone or Email */}
                      <div className="input-group bg-[#080E1A]/80 border border-slate-800 focus-within:border-[#A3E635] rounded-2xl px-4 pt-5 pb-2 transition-all">
                        <input
                          id="contact"
                          type="text"
                          required
                          value={contactInfo}
                          onChange={(e) => setContactInfo(e.target.value)}
                          placeholder=" "
                          className="w-full bg-transparent text-sm text-white focus:outline-none font-mono"
                        />
                        <label
                          htmlFor="contact"
                          className="absolute left-4 top-4 text-xs font-mono text-slate-400 transition-all pointer-events-none uppercase tracking-wider"
                        >
                          Phone / Email *
                        </label>
                      </div>

                      {/* Location / District */}
                      <div className="input-group bg-[#080E1A]/80 border border-slate-800 focus-within:border-[#A3E635] rounded-2xl px-4 pt-5 pb-2 transition-all">
                        <input
                          id="location"
                          type="text"
                          required
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder=" "
                          className="w-full bg-transparent text-sm text-white focus:outline-none font-mono"
                        />
                        <label
                          htmlFor="location"
                          className="absolute left-4 top-4 text-xs font-mono text-slate-400 transition-all pointer-events-none uppercase tracking-wider"
                        >
                          Location / District / State *
                        </label>
                      </div>

                    </div>

                    {/* Acres Managed Slider */}
                    <div className="bg-[#080E1A]/60 border border-slate-800/80 rounded-2xl p-5">
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-mono text-xs text-slate-400 uppercase tracking-wider">
                          ACRES MANAGED (OPTIONAL)
                        </span>
                        <span className="font-mono text-xs font-bold text-[#A3E635] bg-[#A3E635]/10 px-2.5 py-0.5 rounded border border-[#A3E635]/30">
                          {acres.toLocaleString()} ACRES
                        </span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="10000"
                        step="20"
                        value={acres}
                        onChange={(e) => setAcres(parseInt(e.target.value))}
                        className="form-slider mb-2"
                      />
                      <div className="flex justify-between font-mono text-[10px] text-slate-500">
                        <span>Smallholder / 20 AC</span>
                        <span>Commercial Fleet / 2,500 AC</span>
                        <span>Enterprise / 10,000+ AC</span>
                      </div>
                    </div>

                    {/* Console-Styled Message Input */}
                    <div className="bg-[#04070D] border border-slate-800 focus-within:border-emerald-400 rounded-2xl p-4 transition-all">
                      <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500 mb-2 pb-1 border-b border-slate-900">
                        <span className="text-[#A3E635]">&gt;</span> OPERATIONAL PARAMETERS & QUESTIONS
                      </div>
                      <textarea
                        required
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="> Enter crop variety, pathogen symptoms, API requirements, or pilot timeframe..."
                        className="w-full bg-transparent text-sm text-slate-200 font-mono focus:outline-none placeholder:text-slate-600 resize-none leading-relaxed"
                      />
                    </div>

                    {/* Submit Button */}
                    <div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-[#A3E635] via-[#10B981] to-[#06B6D4] hover:opacity-95 text-[#04070D] font-mono font-black text-sm tracking-wider py-4 px-6 rounded-2xl transition-all duration-200 flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(163,230,53,0.35)] hover:shadow-[0_0_45px_rgba(163,230,53,0.5)] transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <Activity className="w-5 h-5 animate-spin" />
                            <span>ENCRYPTING & TRANSMITTING TELEMETRY...</span>
                          </>
                        ) : (
                          <>
                            <span>TRANSMIT INQUIRY</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>

                      <div className="flex justify-between items-center mt-3 font-mono text-[11px] text-slate-400 px-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#A3E635]" /> Avg Response Time: <strong>&lt; 2 Hours</strong>
                        </span>
                        <span className="flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Non-Disclosure Guaranteed
                        </span>
                      </div>
                    </div>

                  </form>

                </div>
              ) : (
                /* Success Screen */
                <div className="py-12 text-center flex flex-col items-center justify-center">
                  <div className="w-20 h-20 rounded-3xl bg-[#A3E635]/15 border border-[#A3E635] flex items-center justify-center text-[#A3E635] mb-6 shadow-[0_0_35px_rgba(163,230,53,0.4)]">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  
                  <div className="font-mono text-xs text-[#A3E635] tracking-widest uppercase mb-2">
                    TELEMETRY RECEIVED // ACKNOWLEDGED
                  </div>

                  <h2 className="font-bebas text-4xl sm:text-5xl text-white italic tracking-wide mb-3">
                    TRANSMISSION LOGGED TO CROPGUARD OS
                  </h2>

                  <p className="text-slate-400 text-sm max-w-md mx-auto mb-8 font-mono leading-relaxed">
                    Your inquiry packet has been assigned ticket <strong className="text-white">#CG-{(Math.random() * 90000 + 10000).toFixed(0)}</strong> and routed to our regional agronomy dispatch team.
                  </p>

                  <div className="bg-[#080E1A] border border-slate-800 rounded-2xl p-4 w-full max-w-md text-left font-mono text-xs text-slate-400 mb-8 space-y-1.5">
                    <div><span className="text-slate-600">CLIENT:</span> {name} ({organization})</div>
                    <div><span className="text-slate-600">CHANNEL:</span> {selectedType.toUpperCase()}</div>
                    <div><span className="text-slate-600">LOCATION:</span> {location}</div>
                    <div><span className="text-slate-600">SCALE:</span> {acres.toLocaleString()} ACRES</div>
                    <div className="text-emerald-400 pt-1">STATUS: DISPATCH QUEUED (PRIORITY 1)</div>
                  </div>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="border border-[#A3E635]/40 hover:border-[#A3E635] text-[#A3E635] font-mono text-xs font-bold py-2.5 px-6 rounded-xl transition-all hover:bg-[#A3E635]/10"
                  >
                    SEND ANOTHER INQUIRY →
                  </button>
                </div>
              )}

            </div>

            {/* RIGHT BENTO CARDS: ABSTRACT VISUALIZERS & TELEMETRY (40% / col-span-5) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* CARD 1: 3D INTERACTIVE SPECTRAL ORB & TELEMETRY WIDGET */}
              <div className="bento-glass rounded-3xl p-6 relative overflow-hidden">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                    <span className="font-mono text-xs text-slate-300 font-bold tracking-widest uppercase">
                      MULTI-SPECTRAL SENSOR FEED
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded">
                    ORBIT: SENTINEL-2A
                  </span>
                </div>

                {/* 3D Wireframe Canvas Container */}
                <div className="relative h-56 rounded-2xl overflow-hidden bg-[#060B14] border border-slate-800/80 flex items-center justify-center">
                  <SpectralOrbCanvas />

                  {/* Overlaid Live Badges */}
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <div className="bg-[#04070D]/85 border border-white/10 px-2.5 py-1 rounded font-mono text-[10px] text-slate-300 backdrop-blur-md">
                      📍 LAT: 22.5726° N, LONG: 88.3639° E
                    </div>
                  </div>

                  <div className="absolute top-3 right-3 pointer-events-none">
                    <div className="bg-[#04070D]/85 border border-emerald-500/30 px-2.5 py-1 rounded font-mono text-[10px] text-[#A3E635] backdrop-blur-md">
                      NETWORK SLA: 99.98%
                    </div>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center pointer-events-none font-mono text-[10px]">
                    <div className="bg-[#04070D]/85 px-2.5 py-1 rounded border border-white/10 text-emerald-400 backdrop-blur-md">
                      NDVI: 0.82 [OPTIMAL]
                    </div>
                    <div className="bg-[#04070D]/85 px-2.5 py-1 rounded border border-white/10 text-cyan-300 backdrop-blur-md">
                      CHLOROPHYLL RE: 94.2%
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex justify-between font-mono text-[11px] text-slate-500">
                  <span>Sensor: Multispectral RedEdge</span>
                  <span className="text-[#A3E635]">Thermal Ground Truth: Calibrated</span>
                </div>
              </div>

              {/* CARD 2: DIRECT AGRONOMIST & VOICE HOTLINE */}
              <div className="bento-glass rounded-3xl p-6 border-emerald-500/30 relative overflow-hidden bg-gradient-to-br from-emerald-950/30 via-[#0F172A]/80 to-[#0F172A]/90">
                <div className="flex items-center gap-2 mb-3">
                  <PhoneCall className="w-4 h-4 text-[#A3E635]" />
                  <span className="font-mono text-xs text-[#A3E635] font-bold tracking-widest uppercase">
                    DIRECT AGRONOMIST HOTLINES
                  </span>
                </div>

                <h3 className="font-bebas text-2xl sm:text-3xl text-white italic tracking-wide mb-3">
                  SPEAK TO A CERTIFIED AGRONOMIST
                </h3>

                <p className="text-xs text-slate-400 font-mono mb-4 leading-relaxed">
                  Real-time audio support for crop disease diagnosis, pesticide recommendations, and pilot setup.
                </p>

                <div className="space-y-2.5">
                  
                  {/* Bangla Voice AI Hotline */}
                  <a
                    href="tel:+9103324905323"
                    className="p-3 rounded-xl bg-[#080E1A] border border-emerald-500/20 hover:border-emerald-400 flex items-center justify-between transition-all group"
                  >
                    <div>
                      <div className="text-xs font-mono font-bold text-white group-hover:text-[#A3E635] flex items-center gap-1.5">
                        <span>+91 (033) 2490-LEAF</span>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-sans">বাংলা ভয়েস</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">West Bengal & Eastern India Regional Hub</div>
                    </div>
                    <Mic className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                  </a>

                  {/* Global English Line */}
                  <a
                    href="tel:+18004922767"
                    className="p-3 rounded-xl bg-[#080E1A] border border-slate-800 hover:border-slate-700 flex items-center justify-between transition-all group"
                  >
                    <div>
                      <div className="text-xs font-mono font-bold text-white group-hover:text-cyan-400">
                        +1 (800) 492-CROP [2767]
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">North America & Global Enterprise Line</div>
                    </div>
                    <Phone className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 group-hover:scale-110 transition-transform" />
                  </a>

                </div>
              </div>

              {/* CARD 3: GLOBAL REGIONAL HUBS */}
              <div className="bento-glass rounded-3xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-cyan-400" />
                    <span className="font-mono text-xs text-slate-300 font-bold tracking-widest uppercase">
                      GLOBAL HUBS
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400">
                    3 HUBS WORLDWIDE
                  </span>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  {hubs.map((hub) => (
                    <div key={hub.name} className="p-3 rounded-xl bg-[#080E1A]/80 border border-slate-800/80">
                      <div className="flex justify-between items-start mb-1">
                        <strong className="text-white text-xs">{hub.name}</strong>
                        <span className="text-[9px] text-[#A3E635] bg-[#A3E635]/10 px-1.5 py-0.5 rounded">
                          {hub.status}
                        </span>
                      </div>
                      <div className="text-slate-400 text-[11px]">{hub.loc}</div>
                      <div className="text-slate-600 text-[10px] mt-0.5 font-mono">COORD: {hub.coords}</div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </main>

        {/* 3. ABSTRACT FAQ & RESPONSE GUARANTEE ACCORDION */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="text-center mb-10">
            <div className="font-mono text-xs text-[#A3E635] tracking-widest uppercase mb-2">
              OPERATIONAL FAQ & PROTOCOLS
            </div>
            <h2 className="font-bebas text-4xl sm:text-5xl text-white italic tracking-wide">
              FREQUENTLY ASKED QUESTIONS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bento-glass rounded-2xl overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left p-5 flex justify-between items-start gap-3 font-mono text-xs sm:text-sm font-semibold text-white hover:text-[#A3E635] transition-colors"
                >
                  <span className="leading-snug">{faq.q}</span>
                  <span className={`text-[#A3E635] font-mono text-base transition-transform duration-200 flex-shrink-0 ${openFaq === i ? 'rotate-45' : ''}`}>
                    +
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-slate-400 font-sans text-xs sm:text-sm leading-relaxed border-t border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* SLA Response Guarantee Banner */}
          <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900/60 to-cyan-950/40 border border-emerald-500/20 text-center font-mono text-xs text-slate-300 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-8">
            <span className="flex items-center gap-2 text-[#A3E635]">
              <Zap className="w-4 h-4" /> 2-HOUR RESPONSE SLA FOR HARVEST CRISIS
            </span>
            <span className="hidden sm:inline text-slate-700">|</span>
            <span className="flex items-center gap-2 text-cyan-400">
              <ShieldCheck className="w-4 h-4" /> AIR-GAPPED DATA PRIVACY ASSURED
            </span>
          </div>
        </section>

      </div>

      <Footer />
    </>
  );
}
