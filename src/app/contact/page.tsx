'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Mail, MapPin, Zap, ArrowRight, CheckCircle2, 
  MessageSquare, Loader2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ContactPage() {
  const [formState, setFormState] = useState<'idle' | 'loading' | 'success'>('idle');
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('reveal-visible');
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('loading');
    setTimeout(() => {
      setFormState('success');
    }, 2000);
  };

  return (
    <div className="bg-[#060A04] text-white font-sans selection:bg-[#C8F53E] selection:text-[#060A04] min-h-screen">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;700;900&family=DM+Mono&display=swap');
        .font-bebas { font-family: 'Bebas Neue', sans-serif; }
        .font-mono { font-family: 'DM Mono', monospace; }
        .reveal { opacity: 0; transform: translateY(30px); transition: all 0.7s ease; }
        .reveal-visible { opacity: 1; transform: translateY(0); }
      `}} />

      {/* Background Video */}
      <div className="fixed inset-0 z-0">
        <video 
          autoPlay loop muted playsInline 
          className="w-full h-full object-cover opacity-10"
          src="/footer-bg.mp4"
        />
        <div className="absolute inset-0 bg-[#060A04]/60 backdrop-blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-12 pt-40 pb-40 grid lg:grid-cols-2 gap-32 items-start">
        {/* LEFT COLUMN */}
        <div className="reveal">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C8F53E]/10 border border-[#C8F53E]/20 mb-8"
          >
            <span className="text-[10px] font-black text-[#C8F53E] uppercase tracking-[0.5em] font-mono">CONTACT · GET IN TOUCH</span>
          </motion.div>

          <h1 className="font-bebas text-[clamp(4rem,7vw,7rem)] leading-[0.85] italic mb-12 uppercase tracking-tighter">
            TALK TO A REAL<br/>AGRONOMIST.
          </h1>

          <p className="text-xl text-white/40 mb-16 leading-relaxed max-w-lg">
            Share your acreage, crop type, and what you want to improve. We&apos;ll reply within 24 hours with a custom pilot plan.
          </p>

          <div className="space-y-6 mb-20">
            {[
              { icon: <Mail size={20}/>, title: "pilot@LEAFGUARD.ai", sub: "Official inquiry channel" },
              { icon: <MapPin size={20}/>, title: "Serving US, India & Europe", sub: "Global deployment capability" },
              { icon: <Zap size={20}/>, title: "Response within 24 hours", sub: "Priority agronomic support" }
            ].map((card, i) => (
              <div key={i} className="flex items-center gap-6 bg-[#0F1409] border border-[#C8F53E]/10 p-8 rounded-[2.5rem] hover:border-[#C8F53E]/40 transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-[#C8F53E]/10 flex items-center justify-center text-[#C8F53E] group-hover:scale-110 transition-transform">
                  {card.icon}
                </div>
                <div>
                   <p className="text-xl font-bold italic text-white uppercase tracking-tight">{card.title}</p>
                   <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mt-1">{card.sub}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-10 rounded-[3rem] bg-white/5 border border-white/10 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-8 text-white/5 font-bebas text-9xl leading-none italic pointer-events-none select-none">&ldquo;</div>
             <p className="text-xl text-white/60 leading-relaxed italic relative z-10">
               &ldquo;We don&apos;t do generic demos. We build you a custom pilot plan based on your actual farm.&rdquo;
             </p>
          </div>
        </div>

        {/* RIGHT COLUMN: Form */}
        <div className="reveal" style={{ transitionDelay: '0.2s' }}>
           <div className="bg-[#0F1409] border border-[#C8F53E]/20 rounded-[4rem] p-16 relative shadow-2xl">
              <AnimatePresence mode="wait">
                {formState !== 'success' ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="mb-12">
                      <p className="text-[10px] font-black text-[#C8F53E] uppercase tracking-[0.5em] font-mono mb-4">SEND A PILOT REQUEST</p>
                      <h2 className="font-bebas text-5xl italic uppercase tracking-tighter text-white">PILOT FORM</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] font-mono ml-4">Full Name</label>
                          <input 
                            required
                            type="text" 
                            className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-sm focus:border-[#C8F53E] focus:outline-none transition-all placeholder:text-white/10"
                            placeholder="John Doe"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] font-mono ml-4">Farm Name</label>
                          <input 
                            required
                            type="text" 
                            className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-sm focus:border-[#C8F53E] focus:outline-none transition-all placeholder:text-white/10"
                            placeholder="Blue Valley Estates"
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] font-mono ml-4">Location</label>
                          <input 
                            required
                            type="text" 
                            className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-sm focus:border-[#C8F53E] focus:outline-none transition-all placeholder:text-white/10"
                            placeholder="State, Country"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] font-mono ml-4">Acreage (hectares)</label>
                          <input 
                            required
                            type="number" 
                            className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-sm focus:border-[#C8F53E] focus:outline-none transition-all placeholder:text-white/10"
                            placeholder="e.g. 150"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] font-mono ml-4">Crop Type</label>
                        <select className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-sm focus:border-[#C8F53E] focus:outline-none transition-all appearance-none cursor-pointer">
                          <option value="wheat">Wheat</option>
                          <option value="rice">Rice</option>
                          <option value="cotton">Cotton</option>
                          <option value="soybean">Soybean</option>
                          <option value="lemongrass">Lemongrass</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] font-mono ml-4">Message</label>
                        <textarea 
                          required
                          rows={4}
                          className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-sm focus:border-[#C8F53E] focus:outline-none transition-all placeholder:text-white/10 resize-none"
                          placeholder="What do you want to improve? (e.g. yield, disease detection speed, fertilizer cost)"
                        />
                      </div>

                      <button 
                        disabled={formState === 'loading'}
                        type="submit" 
                        className="w-full bg-[#C8F53E] text-[#060A04] py-6 rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-2xl disabled:opacity-50"
                      >
                        {formState === 'loading' ? (
                          <Loader2 className="animate-spin" size={18} />
                        ) : (
                          <>SEND REQUEST <ArrowRight size={18} /></>
                        )}
                      </button>

                      <p className="text-center text-[10px] font-black text-white/20 uppercase tracking-widest mt-8">
                        🔒 Your data is never shared with third parties
                      </p>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center text-center py-20"
                  >
                    <div className="w-24 h-24 rounded-full bg-[#C8F53E] flex items-center justify-center text-[#060A04] mb-10 shadow-[0_0_50px_rgba(200,245,62,0.4)]">
                      <CheckCircle2 size={48} />
                    </div>
                    <h2 className="font-bebas text-6xl italic uppercase tracking-tighter text-[#C8F53E] mb-6">REQUEST RECEIVED.</h2>
                    <p className="text-xl font-bold uppercase italic text-white mb-12">WE&apos;LL REPLY WITHIN 24 HOURS.</p>
                    <button 
                      onClick={() => setFormState('idle')}
                      className="text-[#C8F53E] text-[10px] font-black uppercase tracking-widest border-b border-[#C8F53E]/30 pb-1 hover:border-[#C8F53E] transition-all"
                    >
                      SEND ANOTHER MESSAGE
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
           </div>
        </div>
      </div>
    </div>
  );
}
