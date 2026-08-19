"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { Product } from "./mockData";
import { Sparkles, TrendingUp, ChevronLeft, ChevronRight, CheckCircle2, Star, MapPin } from "lucide-react";

type Props = {
  products: Product[];
};

export default function TrendingCarousel({ products }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const trendingItems = products.filter((p) => p.trending || p.featured);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -360 : 360;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (trendingItems.length === 0) return null;

  return (
    <section className="mb-10">
      {/* Header with Nav buttons */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#C8F53E]/10 border border-[#C8F53E]/20 text-[#C8F53E]">
            <TrendingUp className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
              Curated Farm Highlights
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#C8F53E]/15 text-[#C8F53E] border border-[#C8F53E]/30">
                TRENDING &amp; VERIFIED
              </span>
            </h2>
            <p className="text-xs text-gray-400">
              Direct from top-rated organic growers and agricultural equipment suppliers
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            className="p-2 rounded-xl bg-gray-900/80 border border-gray-800 text-gray-400 hover:text-white hover:border-[#C8F53E]/40 hover:bg-gray-800 transition-all cursor-pointer"
            aria-label="Previous items"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-2 rounded-xl bg-gray-900/80 border border-gray-800 text-gray-400 hover:text-white hover:border-[#C8F53E]/40 hover:bg-gray-800 transition-all cursor-pointer"
            aria-label="Next items"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scrollbar-none no-scrollbar"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {trendingItems.map((product) => {
          const priceLabel = `${product.currency}${product.price.toLocaleString()}`;
          return (
            <div
              key={`trending-${product.id}`}
              className="flex-shrink-0 w-[290px] sm:w-[330px] snap-start"
            >
              <Link
                href={`/marketplace/${product.id}`}
                className="group block relative rounded-2xl bg-gradient-to-b from-gray-800/80 to-gray-900/90 border border-gray-700/70 hover:border-[#C8F53E]/60 p-3 transition-all duration-300 hover:shadow-[0_10px_30px_rgba(200,245,62,0.14)] hover:-translate-y-1 overflow-hidden"
              >
                {/* Image Container */}
                <div className="relative h-44 w-full rounded-xl overflow-hidden bg-gray-950">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                  {/* Overlaid Badges */}
                  <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#C8F53E] text-black shadow-md flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      {product.trending ? "TRENDING" : "FEATURED"}
                    </span>
                    {product.organic && (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 backdrop-blur-sm">
                        🌿 Organic
                      </span>
                    )}
                  </div>

                  {product.discountPercent && (
                    <div className="absolute top-2.5 right-2.5 z-10">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-red-500/90 text-white shadow-md">
                        {product.discountPercent}% OFF
                      </span>
                    </div>
                  )}

                  {/* Bottom Image Stats */}
                  <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-xs text-white/90 z-10">
                    <span className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md text-[11px]">
                      <MapPin className="w-3 h-3 text-[#C8F53E]" />
                      {product.location}
                    </span>
                    <span className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md text-[11px] text-amber-300 font-medium">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {product.seller.rating}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="mt-3 px-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">
                      {product.category}
                    </span>
                    {product.seller.verified && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-[#C8F53E] font-medium">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified Grower
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-semibold text-white group-hover:text-[#C8F53E] transition-colors line-clamp-1 mt-1">
                    {product.title}
                  </h3>

                  <div className="mt-2.5 pt-2.5 border-t border-gray-800 flex items-baseline justify-between">
                    <div>
                      <span className="text-lg font-extrabold text-[#C8F53E] font-mono">
                        {priceLabel}
                      </span>
                      <span className="text-xs text-gray-400 ml-1">
                        / {product.unit}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 font-mono">
                      {product.quantity?.toLocaleString()} {product.unit} left
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
