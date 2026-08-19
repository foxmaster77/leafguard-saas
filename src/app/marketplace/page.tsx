import type { Metadata } from "next";
import Link from "next/link";
import MarketplaceCatalog from "./components/MarketplaceCatalog";
import { PlusCircle, ShieldCheck, Users, Truck, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Farmer Marketplace – CropGuard AI",
  description:
    "Direct-to-buyer agricultural marketplace. Trade organic produce, certified seeds, machinery, and bio-fertilizers with verified growers.",
};

export default function MarketplacePage() {
  return (
    <div className="space-y-8">
      {/* Hero Header Section */}
      <div className="relative rounded-3xl overflow-hidden p-6 sm:p-10 bg-gradient-to-r from-[#0D1409] via-[#121A0C] to-[#0A0F07] border border-[#C8F53E]/20 shadow-2xl">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#C8F53E]/10 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C8F53E]/10 border border-[#C8F53E]/30 text-xs font-mono text-[#C8F53E]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>DIRECT FARM-TO-BUYER ECOSYSTEM</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              AgriTech <span className="text-[#C8F53E]">Marketplace</span>
            </h1>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              Buy and sell verified organic produce, high-yield seeds, smart irrigation, and equipment directly with certified agricultural growers across India.
            </p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 pt-2 max-w-lg">
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                <p className="text-xs font-mono text-gray-400">Farmers</p>
                <p className="text-base font-bold text-white font-mono">1,240+</p>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                <p className="text-xs font-mono text-gray-400">Commission</p>
                <p className="text-base font-bold text-[#C8F53E] font-mono">0.0%</p>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                <p className="text-xs font-mono text-gray-400">Escrow</p>
                <p className="text-base font-bold text-white font-mono">100% Safe</p>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 flex-shrink-0">
            <Link
              href="/marketplace/sell"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#C8F53E] text-[#060A04] font-black text-sm font-mono tracking-wider hover:bg-[#b8e52e] hover:shadow-[0_0_24px_rgba(200,245,62,0.4)] hover:scale-[1.02] transition-all cursor-pointer shadow-lg"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ LIST AN ITEM</span>
            </Link>

            <Link
              href="/analyze"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gray-900/90 border border-white/10 text-gray-300 hover:text-white hover:border-[#C8F53E]/40 text-xs font-mono tracking-wider transition-all"
            >
              <span>🔬 AI Crop Health Scan</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Catalog & Filter Experience */}
      <MarketplaceCatalog />
    </div>
  );
}
