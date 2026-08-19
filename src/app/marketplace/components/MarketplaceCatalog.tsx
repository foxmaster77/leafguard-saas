"use client";

import React, { useState, useMemo, useEffect } from "react";
import { MOCK_PRODUCTS, Product } from "./mockData";
import ProductCard from "./ProductCard";
import TrendingCarousel from "./TrendingCarousel";
import FilterBar, { FilterSidebarContent, FilterState, defaultFilters } from "./FilterBar";
import { Sparkles, SlidersHorizontal, Layers, ShieldCheck, Zap, RefreshCw, ShoppingBag } from "lucide-react";

function applyFilters(products: Product[], filters: FilterState): Product[] {
  let result = products.filter((p) => {
    // Search query matching title, location, category, description, seller
    if (filters.query) {
      const q = filters.query.toLowerCase().trim();
      const match =
        p.title.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        p.seller.name.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Category
    if (filters.category !== "All" && p.category !== filters.category) {
      return false;
    }

    // Location
    if (filters.location !== "All" && p.location !== filters.location) {
      return false;
    }

    // Min Price
    if (filters.priceMin !== "" && p.price < Number(filters.priceMin)) {
      return false;
    }

    // Max Price
    if (filters.priceMax !== "" && p.price > Number(filters.priceMax)) {
      return false;
    }

    // Organic
    if (filters.organic === true && !p.organic) {
      return false;
    }

    // Verified only
    if (filters.verifiedOnly && !p.seller.verified) {
      return false;
    }

    return true;
  });

  // Sorting
  if (filters.sortBy === "price-asc") {
    result = [...result].sort((a, b) => a.price - b.price);
  } else if (filters.sortBy === "price-desc") {
    result = [...result].sort((a, b) => b.price - a.price);
  } else if (filters.sortBy === "rating") {
    result = [...result].sort((a, b) => b.seller.rating - a.seller.rating);
  }

  return result;
}

export default function MarketplaceCatalog() {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [loading, setLoading] = useState(false);

  // Debounced feel for filter change
  const filteredProducts = useMemo(
    () => applyFilters(MOCK_PRODUCTS, filters),
    [filters]
  );

  const updateFilters = (partial: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
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
    <div className="space-y-8">
      {/* Top Search & Filter Bar */}
      <FilterBar
        filters={filters}
        onChange={setFilters}
        totalResults={filteredProducts.length}
      />

      {/* Trending & Featured Carousel (Only shown when not deeply searching/filtering) */}
      {!filters.query && filters.category === "All" && (
        <TrendingCarousel products={MOCK_PRODUCTS} />
      )}

      {/* Main Content Layout: Sticky Sidebar on Desktop + Product Grid */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Sticky Desktop Filter Sidebar */}
        <aside className="hidden lg:block w-72 flex-shrink-0 sticky top-28">
          <div className="p-5 rounded-2xl bg-[#0D1409]/90 border border-white/[0.08] backdrop-blur-xl shadow-xl space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-white/10 text-white font-bold text-sm">
              <SlidersHorizontal className="w-4 h-4 text-[#C8F53E]" />
              <span>Filters &amp; Preferences</span>
            </div>

            <FilterSidebarContent
              filters={filters}
              update={updateFilters}
              resetFilters={resetFilters}
              isFiltered={isFiltered}
            />

            {/* Direct Farm-to-Buyer Trust Badge */}
            <div className="pt-4 border-t border-white/[0.08]">
              <div className="p-3 rounded-xl bg-black/40 border border-[#C8F53E]/20 text-[11px] text-gray-300 space-y-1.5">
                <div className="flex items-center gap-1.5 text-[#C8F53E] font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>CropGuard Direct Escrow</span>
                </div>
                <p className="text-gray-400 leading-tight">
                  Zero hidden commissions. Direct communication with verified growers.
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="flex-1 w-full">
          {/* Results Summary Bar */}
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-gray-400 uppercase">
                Available Listings:
              </span>
              <span className="text-xs font-mono font-bold text-[#C8F53E] px-2 py-0.5 rounded bg-[#C8F53E]/10 border border-[#C8F53E]/20">
                {filteredProducts.length} {filteredProducts.length === 1 ? "Item" : "Items"}
              </span>
            </div>

            {isFiltered && (
              <button
                onClick={resetFilters}
                className="text-xs font-mono text-[#C8F53E] hover:underline flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                Clear Filters
              </button>
            )}
          </div>

          {/* Grid or Empty State */}
          {loading ? (
            /* Skeleton Loading State */
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={`skeleton-${i}`}
                  className="rounded-2xl bg-gray-900/60 border border-white/5 p-4 space-y-4 animate-pulse"
                >
                  <div className="aspect-[4/3] rounded-xl bg-gray-800/80" />
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-800 rounded w-3/4" />
                    <div className="h-3 bg-gray-800/60 rounded w-1/2" />
                  </div>
                  <div className="pt-3 border-t border-gray-800 flex justify-between">
                    <div className="h-6 bg-gray-800 rounded w-24" />
                    <div className="h-4 bg-gray-800 rounded w-16" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product, idx) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={idx}
                />
              ))}
            </div>
          ) : (
            /* Clean Empty State */
            <div className="text-center py-20 px-4 rounded-3xl bg-[#0D1409]/60 border border-white/5 backdrop-blur-md">
              <div className="w-16 h-16 rounded-full bg-gray-900 border border-white/10 flex items-center justify-center mx-auto mb-4 text-3xl">
                🌾
              </div>
              <h3 className="text-lg font-bold text-white mb-1">
                No matching agricultural listings found
              </h3>
              <p className="text-xs text-gray-400 max-w-md mx-auto mb-6">
                Try loosening your search query, price ranges, or removing category/organic filters.
              </p>
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#C8F53E] text-[#060A04] font-bold text-xs font-mono uppercase tracking-wider hover:bg-[#b8e52e] transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset All Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
