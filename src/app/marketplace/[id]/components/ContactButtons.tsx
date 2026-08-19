"use client";

import React, { useState } from "react";
import { MessageSquare, Phone, Send, ShieldCheck, Zap, Heart, Share2, Check } from "lucide-react";

type Props = {
  sellerName: string;
  phone?: string;
  productTitle: string;
  priceFormatted: string;
};

export default function ContactButtons({
  sellerName,
  phone = "+919876543210",
  productTitle,
  priceFormatted,
}: Props) {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);

  const cleanPhone = phone.replace(/\D/g, "");
  const whatsappMsg = `Hello ${sellerName}, I am interested in buying "${productTitle}" (${priceFormatted}) listed on CropGuard AI Marketplace. Is it available for immediate dispatch?`;
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappMsg)}`;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-3">
      {/* Primary Action: Direct WhatsApp Order */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm tracking-wide shadow-[0_4px_20px_rgba(37,211,102,0.25)] transition-all cursor-pointer text-center"
      >
        <span className="text-lg">💬</span>
        <span>Chat &amp; Order on WhatsApp</span>
      </a>

      {/* Secondary Action: Call Seller */}
      <a
        href={`tel:${phone}`}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gray-900 border border-white/10 hover:border-[#C8F53E]/50 text-white font-mono text-xs font-semibold hover:bg-gray-800 transition-all cursor-pointer text-center"
      >
        <Phone className="w-4 h-4 text-[#C8F53E]" />
        <span>Call Grower ({phone})</span>
      </a>

      {/* Quick Action: In-app chat simulated */}
      <button
        onClick={() => alert(`Starting encrypted chat session with ${sellerName}... (CropGuard Messenger)`)}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-transparent border border-white/10 text-gray-300 hover:text-white hover:border-white/20 text-xs font-mono transition-all cursor-pointer"
      >
        <MessageSquare className="w-3.5 h-3.5 text-gray-400" />
        <span>Send In-App Inquiry</span>
      </button>

      {/* Share and Wishlist Bar */}
      <div className="flex items-center justify-between pt-2 border-t border-white/[0.08] text-xs text-gray-400 font-mono">
        <button
          onClick={() => setLiked(!liked)}
          className={`flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer ${
            liked ? "text-red-400 font-bold" : ""
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${liked ? "fill-red-400" : ""}`} />
          <span>{liked ? "Saved" : "Save Listing"}</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-[#C8F53E]" /> : <Share2 className="w-3.5 h-3.5" />}
          <span>{copied ? "Link Copied!" : "Share"}</span>
        </button>
      </div>
    </div>
  );
}
