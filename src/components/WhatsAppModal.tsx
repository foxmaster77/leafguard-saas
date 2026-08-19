'use client';

import React, { useState } from 'react';
import { X, CheckCheck, ShieldCheck, Play, Pause, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WhatsAppModal({ isOpen, onClose }: WhatsAppModalProps) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const togglePlayAudio = () => {
    setIsPlayingAudio(!isPlayingAudio);
    if (!isPlayingAudio && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance('Potato late blight pathogen detected. Spray Mancozeb 75 WP at 2.5 grams per liter.');
      u.lang = 'en-IN';
      u.rate = 0.95;
      window.speechSynthesis.speak(u);
    } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[2000] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          className="bg-[#111B21] border border-[#22C55E]/30 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden text-white flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="bg-[#202C33] px-4 py-3 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#22C55E] flex items-center justify-center text-[#060A04] font-bold text-base shadow-[0_0_12px_rgba(34,197,94,0.4)]">
                <ShieldCheck size={22} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-sm text-white">CropGuard AI Bot</h4>
                  <span className="w-3.5 h-3.5 rounded-full bg-[#22C55E] text-[#060A04] text-[9px] flex items-center justify-center font-black">✓</span>
                </div>
                <p className="text-[10px] text-[#22C55E] font-mono">● Verified Diagnostic Uplink</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Chat Stream */}
          <div className="p-4 flex-grow overflow-y-auto space-y-4 bg-[#0B141A] font-sans text-xs">
            <div className="text-center">
              <span className="bg-[#182229] text-white/40 text-[9px] px-3 py-1 rounded-full font-mono uppercase">
                Today · Verified 256-bit Encrypted
              </span>
            </div>

            {/* Farmer Outgoing */}
            <div className="flex flex-col items-end">
              <div className="bg-[#005C4B] rounded-2xl rounded-tr-sm p-2 max-w-[85%] shadow-md border border-[#22C55E]/20 space-y-2">
                <div className="w-full h-36 rounded-xl overflow-hidden relative bg-black/40">
                  <img
                    src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500"
                    alt="Potato Leaf Disease"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 left-2 bg-black/70 text-[9px] font-mono text-[#C8F53E] px-2 py-0.5 rounded">
                    IMG_KUFRI_084.JPG
                  </span>
                </div>
                <p className="text-white/90 text-xs px-1">
                  Namaskar, potato leaf has black fungal lesions. What spray is recommended?
                </p>
                <div className="flex justify-end items-center gap-1 text-[9px] text-white/50 pr-1">
                  <span>10:42 AM</span>
                  <CheckCheck size={13} className="text-[#53BDEB]" />
                </div>
              </div>
            </div>

            {/* Bot Response */}
            <div className="flex flex-col items-start">
              <div className="bg-[#202C33] rounded-2xl rounded-tl-sm p-3.5 max-w-[92%] shadow-md border border-white/10 space-y-3">
                <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                  <span className="text-base">🔬</span>
                  <div>
                    <p className="font-bold text-white text-xs">Potato Late Blight Detected</p>
                    <p className="text-[9px] text-[#C8F53E] font-mono font-bold">96.4% CONFIDENCE · SEVERITY: HIGH</p>
                  </div>
                </div>

                {/* Voice note */}
                <div className="bg-[#111B21] rounded-xl p-2.5 flex items-center gap-2.5 border border-white/5">
                  <button
                    onClick={togglePlayAudio}
                    className="w-8 h-8 rounded-full bg-[#22C55E] text-[#060A04] flex items-center justify-center shrink-0 hover:scale-105 transition-transform shadow-[0_0_10px_rgba(34,197,94,0.4)] cursor-pointer"
                  >
                    {isPlayingAudio ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
                  </button>
                  <div className="flex-grow space-y-1">
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#22C55E] transition-all duration-300"
                        style={{ width: isPlayingAudio ? '85%' : '35%' }}
                      />
                    </div>
                    <div className="flex justify-between text-[9px] text-white/40 font-mono">
                      <span>{isPlayingAudio ? 'Playing Voice Note...' : 'Voice Summary (Audio)'}</span>
                      <span>0:14</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#182229] p-2.5 rounded-xl border border-white/5 space-y-1.5 font-mono text-[11px]">
                  <p className="text-[#C8F53E] font-bold">💊 PRESCRIPTION &amp; DOSAGE:</p>
                  <p className="text-white/80">• Spray Mancozeb 75% WP @ 2.5g/L water immediately.</p>
                  <p className="text-white/80">• Nearest stockist: Ghosh Krishi Bhandar (Chinsurah - 3.2km).</p>
                </div>

                <div className="flex justify-end text-[9px] text-white/40 font-mono">
                  <span>10:42 AM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-[#202C33] p-3.5 border-t border-white/10 flex flex-col sm:flex-row gap-2">
            <a
              href="https://wa.me/919831245678?text=Hi%20CropGuard%20AI%20-%20I%20want%20to%20scan%20my%20crop%20leaf"
              target="_blank"
              rel="noreferrer"
              className="flex-1 bg-[#22C55E] hover:bg-[#1eb354] text-[#060A04] font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(34,197,94,0.3)]"
            >
              <span>OPEN LIVE WHATSAPP BOT</span>
              <ExternalLink size={14} />
            </a>
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-white/10 text-white/60 hover:text-white text-xs font-mono uppercase tracking-wider hover:bg-white/5 transition-colors cursor-pointer"
            >
              CLOSE
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}