"use client";

import React, { useState } from "react";
import { Search, SlidersHorizontal, X, Check, Sparkles, ShieldCheck, MapPin, RefreshCw } from "lucide-react";

export type FilterState = {
  query: string;
  category: string;
  location: string;
  priceMin: number | "";
  priceMax: number | "";
  organic: boolean | "";
  verifiedOnly: boolean;
  sortBy: "featured" | "price-asc" | "price-desc" | "rating";
};

export const defaultFilters: FilterState = {
  query: "",
  category: "All",
  location: "All",
  priceMin: "",
  priceMax: "",
  organic: "",
  verifiedOnly: false,
  sortBy: "featured",
};

const categories = [
  { id: "All", label: "All Items", icon: "🌱" },
  { id: "Crops", label: "Crops & Produce", icon: "🌾" },
  { id: "Machinery", label: "Machinery & Tools", icon: "🚜" },
  { id: "Seeds", label: "Seeds & Saplings", icon: "🌱" },
  { id: "Fertilizers", label: "Fertilizers & Bio", icon: "🧪" },
];

const locations = [
  "All",
  "Coimbatore",
  "Pune",
  "Hyderabad",
  "Mysore",
  "Ratnagiri",
];

const pricePresets = [
  { label: "All Prices", min: "", max: "" },
  { label: "< ₹100", min: 0, max: 100 },
  { label: "₹100 - ₹1,000", min: 100, max: 1000 },
  { label: "> ₹1,000", min: 1000, max: "" },
];

type Props = {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  totalResults: number;
};

export default function FilterBar({ filters, onChange, totalResults }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const update = (partial: Partial<FilterState>) => {
    const updated = { ...filters, ...partial };
    onChange(updated);
  };

  const resetFilters = () => {
    onChange(defaultFilters);
  };

  const isFiltered =
    filters.query !== "" ||
    filters.category !== "All" ||
    filters.location !== "All" ||
    filters.priceMin !== "" ||
    filters.priceMax !== "" ||
    filters.organic !== "" ||
    filters.verifiedOnly;

  return (
    <>
      {/* Top Main Search & Quick Controls Bar */}
      <div className="mb-6 space-y-4">
        {/* Search Bar + Sort & Mobile Filter Trigger */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          {/* Main Search Input */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search rice, tractors, seeds, mangoes, fertilizers..."
              value={filters.query}
              onChange={(e) => update({ query: e.target.value })}
              className="w-full pl-11 pr-10 py-3 rounded-xl bg-gray-900/90 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#C8F53E]/70 focus:ring-2 focus:ring-[#C8F53E]/20 transition-all text-sm font-sans shadow-inner"
            />
            {filters.query && (
              <button
                onClick={() => update({ query: "" })}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-white rounded-full hover:bg-gray-800 transition-colors"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={filters.sortBy}
              onChange={(e) => update({ sortBy: e.target.value as any })}
              className="px-3.5 py-3 rounded-xl bg-gray-900/90 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-[#C8F53E]/70 transition-all cursor-pointer"
            >
              <option value="featured">Sort: Featured</option>
              <option value="rating">Sort: Highest Rated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>

            {/* Mobile Filter Sheet Toggle Button */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-3 rounded-xl bg-gray-900 border border-white/15 text-white hover:border-[#C8F53E]/60 text-xs font-mono font-medium transition-all"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#C8F53E]" />
              <span>Filters</span>
              {isFiltered && (
                <span className="w-2 h-2 rounded-full bg-[#C8F53E] animate-ping" />
              )}
            </button>
          </div>
        </div>

        {/* Horizontal Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
          {categories.map((cat) => {
            const active = filters.category === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => update({ category: cat.id })}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                  active
                    ? "bg-[#C8F53E] text-[#060A04] font-bold shadow-[0_0_16px_rgba(200,245,62,0.4)] scale-[1.02]"
                    : "bg-gray-900/80 text-gray-300 border border-white/10 hover:border-white/30 hover:text-white"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Slide-over / Sheet Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0D1409] border-t border-white/15 rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto space-y-6 animate-slide-up">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-[#C8F53E]" />
                <h3 className="text-base font-bold text-white">Filter Listings</h3>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 text-gray-400 hover:text-white rounded-full bg-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content for mobile filters */}
            <FilterSidebarContent
              filters={filters}
              update={update}
              resetFilters={resetFilters}
              isFiltered={isFiltered}
            />

            <div className="pt-2">
              <button
                onClick={() => setMobileOpen(false)}
                className="w-full py-3.5 rounded-xl bg-[#C8F53E] text-[#060A04] font-bold text-sm tracking-wide shadow-lg shadow-[#C8F53E]/20"
              >
                Apply Filters ({totalResults} Results)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function FilterSidebarContent({
  filters,
  update,
  resetFilters,
  isFiltered,
}: {
  filters: FilterState;
  update: (partial: Partial<FilterState>) => void;
  resetFilters: () => void;
  isFiltered: boolean;
}) {
  return (
    <div className="space-y-6">
      {/* Header with Reset */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono uppercase tracking-wider text-gray-400">
          Refine Search
        </span>
        {isFiltered && (
          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-1 text-xs font-mono text-[#C8F53E] hover:underline"
          >
            <RefreshCw className="w-3 h-3" />
            Reset All
          </button>
        )}
      </div>

      {/* Location Filter Pills */}
      <div>
        <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-[#C8F53E]" />
          Location
        </label>
        <div className="flex flex-wrap gap-1.5">
          {locations.map((loc) => {
            const active = filters.location === loc;
            return (
              <button
                key={loc}
                onClick={() => update({ location: loc })}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  active
                    ? "bg-[#C8F53E] text-[#060A04] font-bold shadow-[0_0_12px_rgba(200,245,62,0.3)]"
                    : "bg-gray-900/90 text-gray-400 border border-white/10 hover:border-white/20 hover:text-white"
                }`}
              >
                {loc}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Presets & Range Inputs */}
      <div>
        <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2.5">
          Price Range
        </label>
        <div className="grid grid-cols-2 gap-1.5 mb-3">
          {pricePresets.map((preset, idx) => {
            const active =
              filters.priceMin === preset.min &&
              filters.priceMax === preset.max;
            return (
              <button
                key={idx}
                onClick={() =>
                  update({
                    priceMin: preset.min as any,
                    priceMax: preset.max as any,
                  })
                }
                className={`py-1.5 px-2 rounded-lg text-[11px] font-mono transition-all text-center cursor-pointer ${
                  active
                    ? "bg-[#C8F53E]/20 text-[#C8F53E] border border-[#C8F53E]/60 font-bold"
                    : "bg-gray-900 text-gray-400 border border-white/10 hover:border-white/20 hover:text-white"
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min ₹"
            min={0}
            value={filters.priceMin}
            onChange={(e) =>
              update({
                priceMin: e.target.value ? Number(e.target.value) : "",
              })
            }
            className="w-1/2 px-3 py-2 rounded-lg bg-gray-900 border border-white/10 text-white placeholder-gray-600 text-xs font-mono focus:outline-none focus:border-[#C8F53E]/60"
          />
          <span className="text-gray-500 text-xs">-</span>
          <input
            type="number"
            placeholder="Max ₹"
            min={0}
            value={filters.priceMax}
            onChange={(e) =>
              update({
                priceMax: e.target.value ? Number(e.target.value) : "",
              })
            }
            className="w-1/2 px-3 py-2 rounded-lg bg-gray-900 border border-white/10 text-white placeholder-gray-600 text-xs font-mono focus:outline-none focus:border-[#C8F53E]/60"
          />
        </div>
      </div>

      {/* Premium Toggle 1: Organic Only */}
      <div className="pt-2 border-t border-white/[0.08]">
        <div className="flex items-center justify-between cursor-pointer py-1">
          <div>
            <span className="text-xs font-bold text-white block">
              🌿 Organic Certified Only
            </span>
            <span className="text-[11px] text-gray-400">
              Show only pesticide-free crops
            </span>
          </div>

          {/* Premium Animated Switch */}
          <button
            type="button"
            role="switch"
            aria-checked={filters.organic === true}
            onClick={() =>
              update({ organic: filters.organic === true ? "" : true })
            }
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              filters.organic === true ? "bg-[#C8F53E]" : "bg-gray-800"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-[#060A04] shadow-lg ring-0 transition duration-200 ease-in-out ${
                filters.organic === true ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Premium Toggle 2: Verified Sellers Only */}
      <div className="pt-2 border-t border-white/[0.08]">
        <div className="flex items-center justify-between cursor-pointer py-1">
          <div>
            <span className="text-xs font-bold text-white block">
              ✓ Verified Farmers Only
            </span>
            <span className="text-[11px] text-gray-400">
              Identity &amp; field-audited growers
            </span>
          </div>

          {/* Premium Animated Switch */}
          <button
            type="button"
            role="switch"
            aria-checked={filters.verifiedOnly}
            onClick={() => update({ verifiedOnly: !filters.verifiedOnly })}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              filters.verifiedOnly ? "bg-[#C8F53E]" : "bg-gray-800"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-[#060A04] shadow-lg ring-0 transition duration-200 ease-in-out ${
                filters.verifiedOnly ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
