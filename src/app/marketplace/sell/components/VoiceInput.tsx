"use client";

import React, { useState } from "react";
import { Mic, MicOff } from "lucide-react";

type Props = { onResult: (text: string) => void };

export default function VoiceInput({ onResult }: Props) {
  const [listening, setListening] = useState(false);
  const [lang, setLang] = useState<string>("en-IN");

  const handleClick = () => {
    if (
      !("SpeechRecognition" in window) &&
      !("webkitSpeechRecognition" in window)
    ) {
      alert("Voice input is not supported in this browser. Please type your title.");
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR: any =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    const recognizer = new SR();
    recognizer.lang = lang;
    recognizer.interimResults = false;
    recognizer.maxAlternatives = 1;

    recognizer.onstart = () => setListening(true);
    recognizer.onend = () => setListening(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognizer.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };
    recognizer.onerror = () => setListening(false);
    recognizer.start();
  };

  return (
    <div className="flex items-center gap-1">
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value)}
        className="px-2 py-3 rounded-xl bg-gray-900 border border-white/10 text-gray-300 text-[11px] font-mono focus:outline-none cursor-pointer"
        title="Select Voice Language"
      >
        <option value="en-IN">EN</option>
        <option value="hi-IN">हिन्दी</option>
        <option value="bn-IN">বাংলা</option>
        <option value="mr-IN">मराठी</option>
        <option value="ta-IN">தமிழ்</option>
        <option value="te-IN">తెలుగు</option>
      </select>

      <button
        type="button"
        onClick={handleClick}
        title={listening ? "Listening... speak now" : "Click to speak product title"}
        aria-label="Voice input"
        className={`p-3 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
          listening
            ? "bg-[#C8F53E] text-[#060A04] shadow-[0_0_16px_rgba(200,245,62,0.6)] animate-pulse font-bold"
            : "bg-gray-900 border border-white/10 text-gray-300 hover:text-[#C8F53E] hover:border-[#C8F53E]/40"
        }`}
      >
        {listening ? <Mic className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
      </button>
    </div>
  );
}
