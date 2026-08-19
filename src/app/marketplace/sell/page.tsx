"use client";

import { useState } from "react";
import VoiceInput from "./components/VoiceInput";

const categories = ["Crops", "Machinery", "Seeds", "Fertilizers"];
const units = ["kg", "ton", "piece"];
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
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Listing Published!
        </h2>
        <p className="text-gray-400 mb-6">
          Your product has been listed on the marketplace.
        </p>
        <div className="flex gap-3 justify-center">
          <a
            href="/marketplace"
            className="bg-green-500 hover:bg-green-400 text-gray-900 font-bold px-6 py-2.5 rounded-xl transition-colors"
          >
            Browse Marketplace
          </a>
          <button
            onClick={() => {
              setData(initialData);
              setSubmitted(false);
            }}
            className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2.5 rounded-xl transition-colors"
          >
            List Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">List an Item</h1>
        <p className="text-gray-400 text-sm mt-1">
          Fill in the details below to list your product on the marketplace.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-800/60 rounded-xl border border-gray-700 p-6 space-y-5"
      >
        {/* Product Title + Voice */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Product Title <span className="text-red-400">*</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              name="title"
              value={data.title}
              onChange={handleChange}
              required
              placeholder="e.g. Organic Basmati Rice"
              className="flex-1 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-600 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            />
            <VoiceInput
              onResult={(txt) => setData((prev) => ({ ...prev, title: txt }))}
            />
          </div>
        </div>

        {/* Category + Unit */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Category <span className="text-red-400">*</span>
            </label>
            <select
              name="category"
              value={data.category}
              onChange={handleChange}
              required
              className="w-full rounded-lg bg-gray-900 border border-gray-700 text-white px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Unit
            </label>
            <select
              name="unit"
              value={data.unit}
              onChange={handleChange}
              className="w-full rounded-lg bg-gray-900 border border-gray-700 text-white px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            >
              {units.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quantity + Price */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Quantity Available <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              name="quantity"
              min={0}
              placeholder="e.g. 500"
              value={data.quantity}
              onChange={handleChange}
              required
              className="w-full rounded-lg bg-gray-900 border border-gray-700 text-white px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Price per unit <span className="text-red-400">*</span>
            </label>
            <div className="flex gap-2">
              <select
                name="currency"
                value={data.currency}
                onChange={handleChange}
                className="w-16 rounded-lg bg-gray-900 border border-gray-700 text-white px-2 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
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
                placeholder="0"
                value={data.price}
                onChange={handleChange}
                required
                className="flex-1 rounded-lg bg-gray-900 border border-gray-700 text-white px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              />
            </div>
          </div>
        </div>

        {/* Harvest Date */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Harvest / Available Date
          </label>
          <input
            type="date"
            name="harvestDate"
            value={data.harvestDate}
            onChange={handleChange}
            className="w-full rounded-lg bg-gray-900 border border-gray-700 text-white px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Location / District <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            name="location"
            placeholder="e.g. Coimbatore, Tamil Nadu"
            value={data.location}
            onChange={handleChange}
            required
            className="w-full rounded-lg bg-gray-900 border border-gray-700 text-white px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Description
          </label>
          <textarea
            name="description"
            rows={3}
            placeholder="Describe your product — quality, certification, packaging, etc."
            value={data.description}
            onChange={handleChange}
            className="w-full rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-600 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-400 transition resize-none"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-400 disabled:bg-green-800 disabled:text-green-500 text-gray-900 font-bold py-3 rounded-xl transition-colors duration-150 text-base"
        >
          {loading ? "Publishing…" : "Publish Listing"}
        </button>
      </form>
    </div>
  );
}
