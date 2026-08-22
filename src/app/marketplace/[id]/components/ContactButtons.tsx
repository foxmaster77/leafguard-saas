"use client";

import React, { useState } from "react";
import { Product } from "../../components/mockData";
import BuyNowModal from "./BuyNowModal";
import {
  MessageSquare,
  Phone,
  Send,
  ShieldCheck,
  Zap,
  Heart,
  Share2,
  Check,
  ShoppingBag,
  ArrowRight
} from "lucide-react";

type Props = {
  product: Product;
  sellerName?: string;
  phone?: string;
  productTitle?: string;
  priceFormatted?: string;
};

export default function ContactButtons({
  product,
  sellerName,
  phone,
  productTitle,
  priceFormatted,
}: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);

  const finalSellerName = sellerName || product?.seller?.name || "Grower";
  const finalProductTitle = productTitle || product?.title || "Item";
  const finalPriceFormatted =
    priceFormatted || (product ? `${product.currency}${product.price.toLocaleString()} / ${product.unit}` : "");

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      <div className="space-y-3">
        {/* Primary Action: "Buy Now" Button (Opens Mock Checkout Modal) */}
        <button
          onClick={() => setModalOpen(true)}
          className="w-full flex items-center justify-center gap-2 py-4 px-5 rounded-2xl bg-[#C8F53E] hover:bg-[#b8e52e] text-[#060A04] font-black text-xs font-mono uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-[0_0_24px_rgba(200,245,62,0.35)] hover:scale-[1.02]"
        >
          <Zap className="w-4 h-4 fill-current" />
          <span>Buy Now / Direct Order</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        {/* Secondary Action: Call Seller if available */}
        {phone && (
          <a
            href={`tel:${phone.replace(/\s+/g, '')}`}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gray-900 border border-white/10 hover:border-[#C8F53E]/50 text-white font-mono text-xs font-semibold hover:bg-gray-800 transition-all cursor-pointer text-center"
          >
            <Phone className="w-3.5 h-3.5 text-[#C8F53E]" />
            <span>Call Seller</span>
          </a>
        )}

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

      {/* Mock Checkout Modal */}
      {product && (
        <BuyNowModal
          product={product}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
