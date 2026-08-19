"use client";

import { useState } from "react";

type Props = { onResult: (text: string) => void };

export default function VoiceInput({ onResult }: Props) {
  const [listening, setListening] = useState(false);

  const handleClick = () => {
    if (
      !("SpeechRecognition" in window) &&
      !("webkitSpeechRecognition" in window)
    ) {
      alert("Voice input is not supported in this browser.");
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR: any =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    const recognizer = new SR();
    recognizer.lang = "en-IN";
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
    <button
      type="button"
      onClick={handleClick}
      title={listening ? "Listening… speak now" : "Click to use voice input"}
      aria-label="Voice input"
      className={`flex-shrink-0 p-2.5 rounded-lg transition-all ${
        listening
          ? "bg-green-500 text-gray-900 animate-pulse"
          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
      }`}
    >
      🎤
    </button>
  );
}
