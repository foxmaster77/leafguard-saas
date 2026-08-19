"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Product } from "./mockData";
import { CheckCircle2, Star, MapPin, ArrowUpRight, Sparkles, ShieldCheck } from "lucide-react";

type Props = {
  product: Product;
  index?: number;
};

export default function ProductCard({ product, index = 0 }: Props) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const priceLabel = `${product.currency}${product.price.toLocaleString()}`;

  return (
    <article
      className="group relative rounded-2xl bg-gradient-to-b from-[#0D1409]/90 via-[#0A0F07]/90 to-[#060A04]/95 border border-white/[0.08] hover:border-[#C8F53E]/60 transition-all duration-300 hover:shadow-[0_16px_36px_rgba(200,245,62,0.14)] hover:-translate-y-1.5 flex flex-col overflow-hidden backdrop-blur-md"
      style={{
        animationDelay: `${index * 50}ms`,
      }}
    >
      <Link href={`/marketplace/${product.id}`} className="flex flex-col h-full">
        {/* Top Image Container */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-950">
          {/* Skeleton placeholder while loading */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-900 animate-pulse flex items-center justify-center">
              <span className="text-2xl opacity-40">🌾</span>
            </div>
          )}

          <img
            src={product.image}
            alt={product.title}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80";
              setImageLoaded(true);
            }}
            className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            loading="lazy"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#060A04]/90 via-transparent to-black/30 pointer-events-none" />

          {/* Top Left: Category & Organic Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-black/75 text-gray-200 border border-white/10 backdrop-blur-md">
              {product.category}
            </span>
            {product.organic && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/90 text-emerald-300 border border-emerald-400/40 backdrop-blur-md shadow-sm">
                🌿 Organic
              </span>
            )}
          </div>

          {/* Top Right: Verified Badge with Glow */}
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
            {product.seller.verified && (
              <div
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#060A04]/90 text-[#C8F53E] border border-[#C8F53E]/50 shadow-[0_0_12px_rgba(200,245,62,0.35)] backdrop-blur-md"
                title="Verified Farmer/Seller by CropGuard"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C8F53E]" />
                <span className="text-[11px] font-mono tracking-tight">VERIFIED</span>
              </div>
            )}
          </div>

          {/* Bottom of Image: Quick location tag */}
          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs text-gray-300 z-10">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[11px] font-mono">
              <MapPin className="w-3 h-3 text-[#C8F53E]" />
              {product.location}
            </span>
            {product.stockStatus && (
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-medium backdrop-blur-md ${
                product.stockStatus === "In Stock"
                  ? "bg-emerald-950/80 text-emerald-300 border border-emerald-500/30"
                  : "bg-amber-950/80 text-amber-300 border border-amber-500/30"
              }`}>
                {product.stockStatus}
              </span>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
          <div>
            {/* Title */}
            <h3 className="font-bold text-base text-white group-hover:text-[#C8F53E] transition-colors line-clamp-2 leading-snug">
              {product.title}
            </h3>

            {/* Description Snippet */}
            {product.description && (
              <p className="text-xs text-gray-400 line-clamp-2 mt-1.5 leading-relaxed">
                {product.description}
              </p>
            )}
          </div>

          <div className="mt-4 pt-3.5 border-t border-white/[0.06]">
            {/* Price Row */}
            <div className="flex items-baseline justify-between mb-2.5">
              <div>
                <span className="text-xs text-gray-400 uppercase font-mono block">Direct Price</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-[#C8F53E] font-mono tracking-tight">
                    {priceLabel}
                  </span>
                  <span className="text-xs text-gray-400 font-mono">
                    / {product.unit}
                  </span>
                </div>
              </div>

              {product.quantity && (
                <div className="text-right">
                  <span className="text-[11px] text-gray-500 font-mono block">Available</span>
                  <span className="text-xs font-mono text-gray-300">
                    {product.quantity.toLocaleString()} {product.unit}
                  </span>
                </div>
              )}
            </div>

            {/* Seller & Rating Row */}
            <div className="flex items-center justify-between pt-2 border-t border-white/[0.04] text-xs">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full overflow-hidden bg-gray-800 border border-white/10 flex-shrink-0">
                  <img
                    src={product.seller.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"}
                    alt={product.seller.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-gray-300 font-medium truncate max-w-[130px]">
                  {product.seller.name}
                </span>
              </div>

              <div className="flex items-center gap-1 font-mono text-amber-300 font-semibold bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/20">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{product.seller.rating}</span>
                {product.seller.reviewsCount && (
                  <span className="text-[10px] text-gray-400 font-normal">
                    ({product.seller.reviewsCount})
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
