"use client";

import React, { useState } from "react";
import Link from "next/link";
import VoiceInput from "./components/VoiceInput";
import { PlusCircle, CheckCircle2, ArrowLeft, UploadCloud, Sparkles, ShieldCheck, HelpCircle } from "lucide-react";

const categories = ["Crops", "Machinery", "Seeds", "Fertilizers"];
const units = ["kg", "ton", "piece", "liter", "bag"];
const currencies = ["₹", "$"];

type FormData = {
  title: string;
  category: string;
  quantity: string;
  unit: string;
  price: string;
  currency: string;
  harvestDate: string;
  location: string;
  organic: boolean;
  minOrder: string;
  description: string;
};

const initialData: FormData = {
  title: "",
  category: "",
  quantity: "",
  unit: "kg",
  price: "",
  currency: "₹",
  harvestDate: "",
  location: "",
  organic: false,
  minOrder: "",
  description: "",
};

export default function SellPage() {
  const [data, setData] = useState<FormData>(initialData);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate backend listing submission
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16 px-4">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#0D1409]/90 border border-[#C8F53E]/40 backdrop-blur-xl shadow-2xl space-y-6">
          <div className="w-20 h-20 rounded-full bg-[#C8F53E]/10 border-2 border-[#C8F53E] flex items-center justify-center mx-auto text-4xl shadow-[0_0_24px_rgba(200,245,62,0.3)] animate-bounce">
            🌾
          </div>
          <div className="space-y-2">
            <span className="text-xs font-mono text-[#C8F53E] uppercase tracking-wider">
              SUCCESSFULLY REGISTERED
            </span>
            <h2 className="text-3xl font-extrabold text-white">
              Listing Published to Network!
            </h2>
            <p className="text-sm text-gray-300 max-w-md mx-auto">
              Your product <span className="text-[#C8F53E] font-bold">"{data.title}"</span> is now visible to thousands of verified buyers and agribusinesses.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Link
              href="/marketplace"
              className="px-6 py-3.5 rounded-xl bg-[#C8F53E] text-[#060A04] font-bold text-xs font-mono uppercase tracking-wider hover:bg-[#b8e52e] transition-all shadow-lg"
            >
              Browse Marketplace
            </Link>
            <button
              onClick={() => {
                setData(initialData);
                setSubmitted(false);
              }}
              className="px-6 py-3.5 rounded-xl bg-gray-900 border border-white/10 text-white font-mono text-xs hover:border-[#C8F53E]/40 transition-all cursor-pointer"
            >
              + List Another Item
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Back Link */}
      <div>
        <Link
          href="/marketplace"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-gray-400 hover:text-[#C8F53E] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </Link>
      </div>

      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0D1409] to-[#060A04] border border-[#C8F53E]/20 space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#C8F53E]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>ZERO BROKER COMMISSION</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          List Your Produce / Agricultural Item
        </h1>
        <p className="text-xs sm:text-sm text-gray-400">
          Sell directly to institutional buyers, traders, and fellow farmers. Use voice typing in regional languages if preferred.
        </p>
      </div>

      {/* Main Form */}
      <form
        onSubmit={handleSubmit}
        className="p-6 sm:p-8 rounded-3xl bg-[#0D1409]/80 border border-white/[0.08] backdrop-blur-xl shadow-xl space-y-6"
      >
        {/* Product Title with Voice Dictation */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-gray-300 mb-2 flex items-center justify-between">
            <span>
              Product Title <span className="text-[#C8F53E]">*</span>
            </span>
            <span className="text-[11px] text-gray-500 font-normal">
              Click 🎤 for Regional Voice Input
            </span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              name="title"
              value={data.title}
              onChange={handleChange}
              required
              placeholder="e.g. Organic Sharbati Wheat (Grade A) or 45HP Tractor"
              className="flex-1 px-4 py-3 rounded-xl bg-gray-900 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-[#C8F53E]/70 text-sm font-sans"
            />
            <VoiceInput
              onResult={(txt) => setData((prev) => ({ ...prev, title: txt }))}
            />
          </div>
        </div>

        {/* Category + Unit */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-gray-300 mb-2">
              Category <span className="text-[#C8F53E]">*</span>
            </label>
            <select
              name="category"
              value={data.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-white/10 text-white focus:outline-none focus:border-[#C8F53E]/70 text-sm cursor-pointer"
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-gray-300 mb-2">
              Quantity Unit <span className="text-[#C8F53E]">*</span>
            </label>
            <select
              name="unit"
              value={data.unit}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-white/10 text-white focus:outline-none focus:border-[#C8F53E]/70 text-sm cursor-pointer"
            >
              {units.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quantity + Direct Price */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-gray-300 mb-2">
              Available Quantity <span className="text-[#C8F53E]">*</span>
            </label>
            <input
              type="number"
              name="quantity"
              min={0}
              placeholder="e.g. 1000"
              value={data.quantity}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-[#C8F53E]/70 text-sm font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-gray-300 mb-2">
              Price per Unit <span className="text-[#C8F53E]">*</span>
            </label>
            <div className="flex gap-2">
              <select
                name="currency"
                value={data.currency}
                onChange={handleChange}
                className="w-20 px-2.5 py-3 rounded-xl bg-gray-900 border border-white/10 text-white focus:outline-none focus:border-[#C8F53E]/70 text-sm font-mono cursor-pointer"
              >
                {currencies.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <input
                type="number"
                name="price"
                min={0}
                placeholder="Amount"
                value={data.price}
                onChange={handleChange}
                required
                className="flex-1 px-4 py-3 rounded-xl bg-gray-900 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-[#C8F53E]/70 text-sm font-mono"
              />
            </div>
          </div>
        </div>

        {/* Location + Harvest Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-gray-300 mb-2">
              Farm Location / District <span className="text-[#C8F53E]">*</span>
            </label>
            <input
              type="text"
              name="location"
              placeholder="e.g. Coimbatore, Tamil Nadu"
              value={data.location}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-[#C8F53E]/70 text-sm font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-gray-300 mb-2">
              Harvest / Ready Date
            </label>
            <input
              type="date"
              name="harvestDate"
              value={data.harvestDate}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-white/10 text-white focus:outline-none focus:border-[#C8F53E]/70 text-sm font-mono cursor-pointer"
            />
          </div>
        </div>

        {/* Organic Certification Checkbox / Switch */}
        <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-white block">
              🌿 Certified Organic Produce
            </span>
            <span className="text-[11px] text-gray-400">
              Grown without chemical pesticides or synthetic NPK
            </span>
          </div>

          <input
            type="checkbox"
            name="organic"
            checked={data.organic}
            onChange={handleChange}
            className="w-5 h-5 accent-[#C8F53E] cursor-pointer"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-gray-300 mb-2">
            Quality Details &amp; Packaging Specs
          </label>
          <textarea
            name="description"
            rows={3}
            placeholder="Mention variety, grain length, moisture content, packaging type (jute bag / box), minimum order quantity..."
            value={data.description}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-[#C8F53E]/70 text-sm font-sans resize-none"
          />
        </div>

        {/* Submit CTA */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-xl bg-[#C8F53E] hover:bg-[#b8e52e] text-[#060A04] font-black text-sm font-mono uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-[0_0_24px_rgba(200,245,62,0.3)] disabled:opacity-50"
        >
          {loading ? "Publishing to Network…" : "🚀 Publish Listing to Marketplace"}
        </button>
      </form>
    </div>
  );
}
