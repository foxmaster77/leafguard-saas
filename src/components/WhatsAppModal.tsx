'use client';

import React, { useState, useEffect } from 'react';
import { X, CheckCheck, Play, Pause, ExternalLink, ArrowLeft, Phone, Video, MoreVertical, Mic, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WhatsAppModal({ isOpen, onClose }: WhatsAppModalProps) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isTyping, setIsTyping] = useState(true);
  const [audioProgress, setAudioProgress] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen) {
      setIsTyping(true);
      setIsPlayingAudio(false);
      setAudioProgress(0);
      timer = setTimeout(() => {
        setIsTyping(false);
      }, 1100);
    }
    return () => {
      clearTimeout(timer);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isOpen]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlayingAudio) {
      interval = setInterval(() => {
        setAudioProgress((prev) => {
          if (prev >= 100) {
            setIsPlayingAudio(false);
            return 0;
          }
          return prev + 7.14; // ~14 seconds total
        });
      }, 1000);
    } else {
      setAudioProgress(0);
    }
    return () => clearInterval(interval);
  }, [isPlayingAudio]);

  const togglePlayAudio = () => {
    const nextState = !isPlayingAudio;
    setIsPlayingAudio(nextState);
    if (nextState && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance('CropGuard AI telemetry report: Potato late blight pathogen detected with 96 percent confidence. Apply Mancozeb 75 WP at 2.5 grams per liter of water immediately.');
      u.lang = 'en-IN';
      u.rate = 0.95;
      u.onend = () => {
        setIsPlayingAudio(false);
        setAudioProgress(0);
      };
      window.speechSynthesis.speak(u);
    } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setAudioProgress(0);
    }
  };

  if (!isOpen) return null;

  const waveformHeights = [6, 12, 18, 10, 16, 22, 14, 8, 20, 15, 9, 17, 21, 13, 8, 16, 11, 19, 7];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[2000] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          className="bg-[#0B141A] border border-[#22C55E]/30 rounded-3xl w-full max-w-md shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden text-white flex flex-col max-h-[92vh]"
        >
          {/* Authentic WhatsApp Dark Header */}
          <div className="bg-[#202C33] px-3.5 py-3 flex items-center justify-between border-b border-white/5 select-none">
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={onClose}
                className="text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                title="Back"
              >
                <ArrowLeft size={19} />
              </button>
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#166534] to-[#22C55E] flex items-center justify-center text-[#060A04] font-black text-sm shadow-[0_0_12px_rgba(34,197,94,0.4)]">
                  🌱
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#22C55E] border-2 border-[#202C33]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-semibold text-[13.5px] text-[#E9EDEF] tracking-tight">CropGuard AI Bot</h4>
                  <span className="w-3.5 h-3.5 rounded-full bg-[#22C55E] text-[#060A04] text-[9px] flex items-center justify-center font-black">
                    ✓
                  </span>
                </div>
                <p className="text-[11px] text-[#22C55E] font-sans font-medium">
                  {isTyping ? 'typing...' : 'online'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-white/70">
              <span className="p-1.5 hover:text-white hover:bg-white/10 rounded-full cursor-pointer transition-colors hidden sm:inline-block">
                <Video size={17} />
              </span>
              <span className="p-1.5 hover:text-white hover:bg-white/10 rounded-full cursor-pointer transition-colors hidden sm:inline-block">
                <Phone size={16} />
              </span>
              <button
                onClick={onClose}
                className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                title="Close"
              >
                <X size={19} />
              </button>
            </div>
          </div>

          {/* Chat Body with WhatsApp Pattern Wallpaper */}
          <div className="p-3 sm:p-4 flex-grow overflow-y-auto space-y-3.5 bg-[#0B141A] font-sans text-xs custom-scroll min-h-[380px]">
            {/* Timestamp & Security pill */}
            <div className="text-center my-1">
              <span className="bg-[#182229] text-[#8696A0] text-[9.5px] px-3 py-1 rounded-lg font-mono uppercase tracking-wider shadow-sm">
                🔒 Verified 256-Bit Encrypted Uplink
              </span>
            </div>

            {/* Farmer Outgoing Message */}
            <div className="flex flex-col items-end">
              <div className="bg-[#005C4B] rounded-2xl rounded-tr-sm p-2 max-w-[85%] shadow-md border border-[#22C55E]/20 space-y-2">
                <div className="w-full h-36 rounded-xl overflow-hidden relative bg-black/40">
                  <img
                    src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500"
                    alt="Potato Leaf Disease"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 left-2 bg-black/75 text-[9px] font-mono text-[#C8F53E] px-2 py-0.5 rounded backdrop-blur-sm">
                    IMG_KUFRI_084.JPG
                  </span>
                </div>
                <p className="text-[#E9EDEF] text-xs px-1 leading-relaxed">
                  Namaskar, potato leaf has black fungal lesions. What spray is recommended?
                </p>
                <div className="flex justify-end items-center gap-1 text-[9.5px] text-white/60 pr-1 font-mono">
                  <span>10:42 AM</span>
                  <CheckCheck size={14} className="text-[#53BDEB]" />
                </div>
              </div>
            </div>

            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 bg-[#202C33] px-3.5 py-2.5 rounded-2xl rounded-tl-sm w-fit shadow-md border border-white/5"
              >
                <span className="text-[11px] text-[#8696A0] font-sans">CropGuard AI is typing</span>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </motion.div>
            )}

            {/* AI Bot Response Message Card */}
            {!isTyping && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="flex flex-col items-start space-y-1"
              >
                <div className="bg-[#202C33] rounded-2xl rounded-tl-sm p-3.5 max-w-[94%] shadow-lg border border-white/10 space-y-3">
                  <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                    <span className="text-lg">🔬</span>
                    <div>
                      <p className="font-bold text-[#E9EDEF] text-[13px]">Potato Late Blight Detected</p>
                      <p className="text-[10px] text-[#C8F53E] font-mono font-bold">96.4% CONFIDENCE · SEVERITY: HIGH</p>
                    </div>
                  </div>

                  {/* Interactive Audio Voice Note Player */}
                  <div className="bg-[#111B21] rounded-xl p-2.5 flex items-center gap-3 border border-white/5">
                    <button
                      onClick={togglePlayAudio}
                      className="w-9 h-9 rounded-full bg-[#22C55E] hover:bg-[#1eb354] text-[#060A04] flex items-center justify-center shrink-0 hover:scale-105 transition-transform shadow-[0_0_12px_rgba(34,197,94,0.4)] cursor-pointer"
                      title={isPlayingAudio ? 'Pause Voice Note' : 'Play Voice Note'}
                    >
                      {isPlayingAudio ? <Pause size={15} /> : <Play size={15} className="ml-0.5" />}
                    </button>

                    <div className="flex-grow space-y-1.5">
                      {/* Animated Waveform */}
                      <div className="flex items-center gap-0.5 h-6">
                        {waveformHeights.map((height, idx) => {
                          const isActive = (idx / waveformHeights.length) * 100 <= (isPlayingAudio ? audioProgress : 35);
                          return (
                            <div
                              key={idx}
                              className={`w-1 rounded-full transition-all duration-200 ${
                                isActive ? 'bg-[#22C55E]' : 'bg-white/20'
                              }`}
                              style={{
                                height: isPlayingAudio ? `${Math.max(4, (height * (1 + Math.sin(idx + audioProgress / 10) * 0.4)))}px` : `${height}px`
                              }}
                            />
                          );
                        })}
                      </div>

                      <div className="flex justify-between items-center text-[9.5px] text-[#8696A0] font-mono">
                        <span className="flex items-center gap-1">
                          <Volume2 size={11} className={isPlayingAudio ? 'text-[#22C55E] animate-pulse' : 'text-white/40'} />
                          {isPlayingAudio ? 'Playing Voice Advisory...' : 'Voice Summary (Audio)'}
                        </span>
                        <span>{isPlayingAudio ? `0:${String(Math.floor((audioProgress / 100) * 14)).padStart(2, '0')}` : '0:14'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Prescription & Dosage Card */}
                  <div className="bg-[#182229] p-2.5 rounded-xl border border-white/5 space-y-1.5 font-mono text-[11.5px]">
                    <p className="text-[#C8F53E] font-bold">💊 PRESCRIPTION &amp; DOSAGE:</p>
                    <p className="text-[#E9EDEF]">• Spray Mancozeb 75% WP @ 2.5g/L water immediately.</p>
                    <p className="text-[#8696A0]">• Nearest stockist: Ghosh Krishi Bhandar (Chinsurah - 3.2km).</p>
                  </div>

                  <div className="flex justify-end text-[9.5px] text-[#8696A0] font-mono">
                    <span>10:42 AM</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Action Footer */}
          <div className="bg-[#202C33] p-3 sm:p-3.5 border-t border-white/10 flex flex-col sm:flex-row gap-2">
            <a
              href="https://wa.me/919831200000?text=Hi%20CropGuard%20AI%2C%20I%20want%20to%20scan%20my%20crop%20leaf%20for%20disease%20diagnosis"
              target="_blank"
              rel="noreferrer"
              className="flex-1 bg-[#22C55E] hover:bg-[#1eb354] text-[#060A04] font-black py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(34,197,94,0.35)]"
            >
              <span>OPEN LIVE WHATSAPP BOT</span>
              <ExternalLink size={14} />
            </a>
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-white/10 text-white/70 hover:text-white text-xs font-mono uppercase tracking-wider hover:bg-white/5 transition-colors cursor-pointer"
            >
              CLOSE
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}