"use client";

import React, { useState } from "react";
import { ZoomIn } from "lucide-react";

type Props = {
  images: string[];
  title: string;
};

export default function ImageGallery({ images, title }: Props) {
  const [selectedIdx, setSelectedIdx] = useState(0);

  const fallbackImage =
    "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80";

  const validImages = images && images.length > 0 ? images : [fallbackImage];
  const currentImage = validImages[selectedIdx] || validImages[0];

  return (
    <div className="space-y-3">
      {/* Main Large Display Image */}
      <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl overflow-hidden bg-gray-950 border border-white/10 group">
        <img
          src={currentImage}
          alt={`${title} - view ${selectedIdx + 1}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = fallbackImage;
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

        <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-xs font-mono text-gray-300">
          Photo {selectedIdx + 1} of {validImages.length}
        </div>
      </div>

      {/* Thumbnail Selector Strip */}
      {validImages.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
          {validImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIdx(idx)}
              className={`relative flex-shrink-0 w-20 h-16 rounded-xl overflow-hidden bg-gray-950 border-2 transition-all cursor-pointer ${
                selectedIdx === idx
                  ? "border-[#C8F53E] shadow-[0_0_12px_rgba(200,245,62,0.4)] scale-105"
                  : "border-white/10 opacity-60 hover:opacity-100 hover:border-white/30"
              }`}
            >
              <img
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = fallbackImage;
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
