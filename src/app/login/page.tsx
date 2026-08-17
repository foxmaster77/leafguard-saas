'use client';

import React, { useState, useEffect, useMemo, useRef, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
  Shield, Fingerprint, Terminal as TerminalIcon, KeyRound,
  Lock, ArrowRight, CheckCircle2, AlertCircle, Eye, EyeOff,
  Activity, Satellite, Wifi, Cpu, Globe, RefreshCw, Sparkles,
  Zap, CornerRightDown
} from 'lucide-react';

const css = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700;900&family=JetBrains+Mono:wght@400;500;700&display=swap');

.font-bebas { font-family: 'Bebas Neue', sans-serif; }
.font-mono { font-family: 'JetBrains Mono', 'DM Mono', monospace; }
.font-sans { font-family: 'Inter', system-ui, sans-serif; }

.tactical-border {
  border: 1px solid #c8f53e;
}

.tactical-border-subtle {
  border: 1px solid rgba(200, 245, 62, 0.25);
}

.tactical-shadow {
  box-shadow: 0 0 40px rgba(200, 245, 62, 0.2), inset 0 0 30px rgba(200, 245, 62, 0.05);
}

.glow-text {
  text-shadow: 0 0 16px rgba(200, 245, 62, 0.8);
}

.glow-text-emerald {
  text-shadow: 0 0 16px rgba(16, 185, 129, 0.8);
}

@keyframes glitch {
  0%, 100% { opacity: 1; transform: translate(0); }
  5% { opacity: 0.85; transform: translate(-2px, 1px); }
  10% { opacity: 1; transform: translate(2px, -1px); }
  15% { opacity: 0.9; transform: translate(-1px, 2px); }
  20% { opacity: 1; transform: translate(0); }
}

.glitch-text {
  animation: glitch 4s infinite;
}

.scanline {
  background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(200, 245, 62, 0.04) 50%, rgba(200, 245, 62, 0.04));
  background-size: 100% 4px;
  animation: scan 15s linear infinite;
}

@keyframes scan {
  0% { background-position: 0 0; }
  100% { background-position: 0 100vh; }
}

.crt-overlay {
  background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.04), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.04));
  background-size: 100% 2px, 3px 100%;
  pointer-events: none;
  position: absolute;
  inset: 0;
  z-index: 10;
  opacity: 0.2;
}

@keyframes quantum-pulse {
  0%, 100% { transform: scale(1); box-shadow: 0 0 15px rgba(200, 245, 62, 0.35), inset 0 0 10px rgba(200, 245, 62, 0.1); }
  50% { transform: scale(1.015); box-shadow: 0 0 35px rgba(200, 245, 62, 0.75), inset 0 0 20px rgba(200, 245, 62, 0.3); }
}

.animate-quantum-pulse {
  animation: quantum-pulse 2.2s ease-in-out infinite;
}

.terminal-scroll {
  mask-image: linear-gradient(to bottom, transparent, black 12%, black 88%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, transparent, black 12%, black 88%, transparent);
}
`;

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<'signin' | 'signup' | 'magic'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [zuluTime, setZuluTime] = useState('00:00:00 ZULU');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const appUrl = useMemo(() => {
    if (typeof window !== 'undefined') return window.location.origin;
    return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  }, []);

  // Zulu Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setZuluTime(now.toISOString().split('T')[1].split('.')[0] + ' ZULU');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // WebGL Interactive Neural Field Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle nodes
    const particleCount = Math.min(width < 768 ? 40 : 85, 100);
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.5 + 0.2
    }));

    let mouseX = width / 2;
    let mouseY = height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    let t = 0;
    const render = () => {
      t += 0.015;
      ctx.fillStyle = '#060905';
      ctx.fillRect(0, 0, width, height);

      // Central Quantum Core Glow
      const grad = ctx.createRadialGradient(
        width / 2 + Math.sin(t * 0.5) * 30,
        height / 2 + Math.cos(t * 0.5) * 20,
        10,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.55
      );
      grad.addColorStop(0, 'rgba(200, 245, 62, 0.08)');
      grad.addColorStop(0.5, 'rgba(16, 185, 129, 0.03)');
      grad.addColorStop(1, 'rgba(6, 9, 5, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Draw Neural Connections
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < 0) p1.x = width;
        if (p1.x > width) p1.x = 0;
        if (p1.y < 0) p1.y = height;
        if (p1.y > height) p1.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 245, 62, ${p1.alpha})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(200, 245, 62, ${(1 - dist / 120) * 0.15})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }

        // Connect to mouse
        const mdx = p1.x - mouseX;
        const mdy = p1.y - mouseY;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 140) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(mouseX, mouseY);
          ctx.strokeStyle = `rgba(200, 245, 62, ${(1 - mdist / 140) * 0.25})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) throw err;
      router.push('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Invalid authorization hash or access key.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const { error: err } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name }, emailRedirectTo: `${appUrl}/dashboard` }
      });
      if (err) throw err;
      setMessage('Neural operator profile provisioned! Confirmation uplink dispatched to your email.');
    } catch (err: any) {
      setError(err?.message || 'Unable to register singularity hash.');
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const { error: err } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${appUrl}/dashboard` }
      });
      if (err) throw err;
      setMessage('Singularity OTP dispatched! Check your email inbox to authenticate.');
    } catch (err: any) {
      setError(err?.message || 'Unable to dispatch OTP frequency.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#050705] text-[#e0e4d6] h-screen w-screen overflow-hidden flex flex-col font-mono selection:bg-[#c8f53e]/30 selection:text-[#c8f53e] relative">
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* Dynamic Interactive Neural Background */}
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full z-0 pointer-events-none" />
      <div className="fixed inset-0 scanline pointer-events-none z-10 opacity-30" />

      {/* ========================================================================= */}
      {/* TOP STATUS BAR */}
      {/* ========================================================================= */}
      <header className="w-full flex justify-between items-center px-6 py-3.5 tactical-border border-t-0 border-x-0 bg-[#050705]/80 backdrop-blur-xl z-50 relative">
        <Link href="/" className="flex items-center gap-3 group text-decoration-none">
          <Shield size={18} className="text-[#c8f53e] group-hover:rotate-12 transition-transform" />
          <span className="text-lg md:text-xl tracking-widest text-[#c8f53e] font-bebas drop-shadow-[0_0_10px_rgba(200,245,62,0.6)]">
            CROP OS v12.0 // SINGULARITY CORE
          </span>
        </Link>

        <div className="flex items-center gap-6 text-[11px] text-[#c8f53e]/80 tracking-widest flex-wrap justify-end">
          <span className="hidden lg:flex items-center gap-1.5 font-bold">
            <Activity size={13} />
            THROUGHPUT: 48.2 PB/s
          </span>
          <span className="hidden xl:flex items-center gap-1.5 font-bold">
            <Cpu size={13} />
            SYNAPTIC_LATENCY: 0.001ms
          </span>
          <span className="hidden md:flex items-center gap-2 font-bold">
            <span className="w-2 h-2 rounded-full bg-[#c8f53e] animate-pulse shadow-[0_0_8px_rgba(200,245,62,0.9)]" />
            SINGULARITY SYNC: 100%
          </span>
          <span className="flex items-center gap-1.5 font-bold text-white/90">
            <Wifi size={13} className="text-[#c8f53e]" />
            ENTROPY: NOMINAL
          </span>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* ORBITAL TELEMETRY CORNERS */}
      {/* ========================================================================= */}
      <div className="absolute top-20 left-6 tactical-border border-y-0 border-r-0 pl-4 text-[10px] text-[#c8f53e]/70 z-40 hidden md:block tracking-widest bg-[#050705]/60 backdrop-blur-md py-3 pr-4 rounded-r">
        <div className="mb-1 text-white/90 font-bold">SYS_CHK: SINGULARITY OPTIMAL</div>
        <div className="mb-1">MEM_ALC: 8192 YB</div>
        <div className="mb-1">BIO_SENSE: PLANETARY ACTIVE</div>
        <div className="mb-1 text-[#10B981]">NEURAL_SYNC: 100.0%</div>
        <div className="mt-2 text-[#c8f53e] animate-pulse">&gt; Calibrating singularity-matrix...</div>
      </div>

      <div className="absolute top-20 right-6 tactical-border border-y-0 border-l-0 pr-4 text-right text-[10px] text-[#c8f53e]/70 z-40 hidden md:block tracking-widest bg-[#050705]/60 backdrop-blur-md py-3 pl-4 rounded-l">
        <div className="mb-1 text-white/90 font-bold">ORB_TRK: SAT-S12 (GEO)</div>
        <div className="mb-1">LAT: 22.90 N / LON: 88.39 E</div>
        <div className="mb-1">ALT: 35,786 KM</div>
        <div className="mb-1 text-[#10B981]">TRAJECTORY: SINGULARITY LOCKED</div>
        <div className="mt-2 text-white font-bold">{zuluTime}</div>
      </div>

      {/* ========================================================================= */}
      {/* TERMINAL TELEMETRY LOGS (BOTTOM LEFT) */}
      {/* ========================================================================= */}
      <div className="absolute bottom-12 left-6 w-80 bg-[#050705]/75 backdrop-blur-xl tactical-border-subtle p-3.5 text-[10px] text-[#c8f53e]/80 terminal-scroll overflow-hidden h-36 flex flex-col justify-end z-40 hidden xl:flex hover:tactical-border transition-all">
        <div className="crt-overlay" />
        <div className="flex items-center gap-2 mb-1.5 text-[#c8f53e] font-bold">
          <TerminalIcon size={12} />
          <span>SYSTEM TELEMETRY LOGS</span>
        </div>
        <div className="space-y-0.5 text-white/60">
          <p>&gt; initializing planetary-neural subroutines...</p>
          <p>&gt; deep-void core connection established [0.001ms]</p>
          <p>&gt; routing 48.2 PB/s through neural matrix...</p>
          <p className="text-[#c8f53e] font-bold animate-pulse">&gt; terminal status: ready for authorization</p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SINGULARITY CORE PREVIEW (BOTTOM RIGHT) */}
      {/* ========================================================================= */}
      <div className="absolute bottom-12 right-6 w-80 bg-[#050705]/75 backdrop-blur-xl tactical-border-subtle p-2 z-40 hidden xl:block hover:tactical-border transition-all">
        <div className="text-[10px] text-[#c8f53e]/90 mb-1.5 flex items-center justify-between tracking-widest font-bold px-2">
          <span>SINGULARITY CORE FEED</span>
          <span className="flex items-center gap-1 text-[9px] text-[#10B981]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" /> LIVE
          </span>
        </div>
        <div className="relative w-full aspect-video overflow-hidden tactical-border rounded bg-black">
          <img
            alt="Crop OS Singularity Core"
            className="object-cover w-full h-full opacity-80 mix-blend-screen"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCEy5rSSowbGONgswAn7JZ5hvgtQlLD4iuhgBdTBAqlhDZtdVe4rigTALLSo-vNKnKlH9aNiRQkxyP5_pQudmoM1l3hL1odEk6-wpNdVF0WlvuP4D3sFQV9LmnWjHfarTBpZCMzgangaqhO6YtDkB7hJ_l072S2_5holH0wVbZn6pGeY0Xs2uOeo3rHaFUH2tkZBTXiTnqoYKxZb4dbpN9LFatyWU7DPKc9QD-VARBVSEYaIE5LLxslTw"
          />
          <div className="absolute inset-0 bg-[#c8f53e]/10 mix-blend-overlay" />
          <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-[#c8f53e]" />
          <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-[#c8f53e]" />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MAIN LOGIN CARD */}
      {/* ========================================================================= */}
      <main className="flex-1 w-full flex items-center justify-center relative z-30 px-4 py-8 overflow-y-auto">
        <div className="w-full max-w-lg my-auto">
          <div className="text-center mb-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl text-white tracking-[0.15em] mb-1 font-bebas drop-shadow-[0_0_25px_rgba(200,245,62,0.8)]">
              NEURAL SINGULARITY GATEWAY
            </h1>
            <p className="text-xs sm:text-sm text-[#c8f53e]/90 glitch-text tracking-widest uppercase font-bold">
              Planetary Authorization Matrix Required
            </p>
          </div>

          {/* Form Card with Crosshairs */}
          <div className="bg-[#0A0E07]/80 backdrop-blur-3xl tactical-border p-6 sm:p-8 relative overflow-hidden tactical-shadow transition-all rounded-xl">
            <div className="crt-overlay" />
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#c8f53e] to-transparent opacity-90" />

            {/* Corner Crosshairs */}
            <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t border-l border-[#c8f53e] z-20" />
            <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t border-r border-[#c8f53e] z-20" />
            <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b border-l border-[#c8f53e] z-20" />
            <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b border-r border-[#c8f53e] z-20" />

            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-3 gap-1 bg-black/50 p-1 rounded-lg border border-white/10 mb-6 relative z-20">
              {[
                { id: 'signin', label: 'SIGN IN' },
                { id: 'signup', label: 'NEW OPERATOR' },
                { id: 'magic', label: 'MAGIC LINK' }
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setTab(item.id as any);
                    setError('');
                    setMessage('');
                  }}
                  className={`py-2 text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase rounded transition-all ${
                    tab === item.id
                      ? 'bg-[#c8f53e] text-[#050705] shadow-[0_0_12px_rgba(200,245,62,0.6)]'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Success Message Banner */}
            {message && (
              <div className="mb-6 p-4 rounded-lg bg-[#c8f53e]/10 border border-[#c8f53e] text-center relative z-20">
                <CheckCircle2 size={28} className="text-[#c8f53e] mx-auto mb-2" />
                <p className="text-xs font-bold text-[#c8f53e] uppercase tracking-wider">{message}</p>
              </div>
            )}

            {/* Error Message Banner */}
            {error && (
              <div className="mb-6 p-4 rounded-lg bg-[#FF4F4F]/10 border border-[#FF4F4F] text-center relative z-20">
                <AlertCircle size={24} className="text-[#FF4F4F] mx-auto mb-1.5" />
                <p className="text-xs font-bold text-[#FF4F4F] tracking-wide">{error}</p>
              </div>
            )}

            {/* Form */}
            <form
              onSubmit={tab === 'signin' ? handleSignIn : tab === 'signup' ? handleSignUp : handleMagicLink}
              className="space-y-4 relative z-20"
            >
              {tab === 'signup' && (
                <div className="space-y-1.5">
                  <label className="block text-[11px] text-[#c8f53e]/90 flex items-center justify-between tracking-widest font-bold">
                    <span>OPERATOR DESIGNATION / FULL NAME</span>
                    <Globe size={13} className="text-[#c8f53e]/70" />
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="CHIEF AGRONOMIST DOE"
                    className="w-full bg-[#050705]/90 tactical-border-subtle p-3.5 text-xs text-white focus:border-[#c8f53e] focus:outline-none transition-all placeholder:text-[#c8f53e]/30 tracking-wider rounded"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-[11px] text-[#c8f53e]/90 flex items-center justify-between tracking-widest font-bold">
                  <span>NEURAL HASH INDEX (EMAIL)</span>
                  <Fingerprint size={14} className="text-[#c8f53e]/70" />
                </label>
                <div className="relative group">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="operator@cropguard.ai"
                    className="w-full bg-[#050705]/90 tactical-border-subtle p-3.5 text-xs text-white focus:border-[#c8f53e] focus:outline-none transition-all placeholder:text-[#c8f53e]/30 tracking-wider rounded"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity">
                    <Lock size={14} className="text-[#c8f53e] animate-pulse" />
                  </div>
                </div>
              </div>

              {tab !== 'magic' && (
                <div className="space-y-1.5">
                  <label className="block text-[11px] text-[#c8f53e]/90 flex items-center justify-between tracking-widest font-bold">
                    <span>DEEP-VOID ACCESS FREQUENCY (PASSWORD)</span>
                    <KeyRound size={14} className="text-[#c8f53e]/70" />
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••••••••••"
                      className="w-full bg-[#050705]/90 tactical-border-subtle p-3.5 pr-10 text-xs text-[#c8f53e] focus:border-[#c8f53e] focus:outline-none transition-all placeholder:text-[#c8f53e]/30 tracking-[0.25em] rounded"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-white/50 hover:text-[#c8f53e] transition-colors"
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
              )}

              <div className="pt-3 flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#c8f53e] text-[#050705] text-xs py-4 px-6 font-bold hover:bg-white transition-all flex items-center justify-center gap-2 group relative overflow-hidden animate-quantum-pulse tracking-widest uppercase cursor-pointer rounded"
                >
                  <span className="relative z-10 font-mono font-black">
                    {loading
                      ? 'SYNCHRONIZING MATRIX...'
                      : tab === 'signin'
                      ? 'INITIATE SINGULARITY UPLINK'
                      : tab === 'signup'
                      ? 'REGISTER NEURAL OPERATOR'
                      : 'TRANSMIT QUANTUM OTP'}
                  </span>
                  <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-white/30 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                </button>

                {/* 1-Click Demo / Manual Override */}
                <button
                  type="button"
                  onClick={() => router.push('/dashboard')}
                  className="w-full bg-transparent tactical-border-subtle hover:tactical-border text-[#c8f53e]/80 hover:text-[#c8f53e] hover:bg-[#c8f53e]/10 text-xs py-3 px-4 transition-all flex items-center justify-center gap-2 tracking-widest uppercase font-bold rounded cursor-pointer"
                >
                  <Sparkles size={14} className="text-[#c8f53e]" />
                  MANUAL OVERRIDE PROTOCOL (DEMO ACCESS)
                </button>
              </div>

              {/* Navigation Back */}
              <div className="flex justify-between items-center pt-2 text-[11px] text-white/50 border-t border-white/10 mt-4">
                <Link href="/" className="hover:text-[#c8f53e] transition-colors flex items-center gap-1">
                  ← Planetary Gateway
                </Link>
                <Link href="/pricing" className="hover:text-[#c8f53e] transition-colors">
                  Commercial Uplink Tiers →
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* FOOTER STATUS */}
      {/* ========================================================================= */}
      <footer className="w-full flex justify-between items-center px-6 py-2.5 tactical-border border-b-0 border-x-0 bg-[#050705]/80 backdrop-blur-xl z-50 text-[10px] text-[#c8f53e]/70 tracking-widest relative">
        <div className="flex items-center gap-2">
          <KeyRound size={12} className="text-[#c8f53e]" />
          ENCRYPTION: SINGULARITY AES-4096 // QUANTUM ENTANGLED
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#c8f53e] shadow-[0_0_8px_rgba(200,245,62,0.9)] animate-pulse" />
          CORE STATUS: NOMINAL
        </div>
      </footer>
    </div>
  );
}
