"use client";

import { useState } from "react";

export type FilterState = {
  query: string;
  category: string;
  location: string;
  priceMin: number | "";
  priceMax: number | "";
  organic: boolean | "";
};

type Props = {
  onChange: (filters: FilterState) => void;
};

const categories = ["All", "Crops", "Machinery", "Seeds", "Fertilizers"];
const locations = [
  "All",
  "Coimbatore",
  "Pune",
  "Hyderabad",
  "Mysore",
  "Ratnagiri",
];

export const defaultFilters: FilterState = {
  query: "",
  category: "All",
  location: "All",
  priceMin: "",
  priceMax: "",
  organic: "",
};

export default function FilterBar({ onChange }: Props) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const handleUpdate = (partial: Partial<FilterState>) => {
    const newState = { ...filters, ...partial };
    setFilters(newState);
    onChange(newState);
  };

  return (
    <section className="bg-gray-800/75 backdrop-blur-sm rounded-xl p-4 mb-6 border border-gray-700">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* Search */}
        <input
          type="text"
          placeholder="Search products…"
          value={filters.query}
          onChange={(e) => handleUpdate({ query: e.target.value })}
          className="col-span-1 sm:col-span-2 lg:col-span-1 w-full rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-500 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
        />

        {/* Category */}
        <select
          value={filters.category}
          onChange={(e) => handleUpdate({ category: e.target.value })}
          className="w-full rounded-lg bg-gray-900 border border-gray-700 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* Location */}
        <select
          value={filters.location}
          onChange={(e) => handleUpdate({ location: e.target.value })}
          className="w-full rounded-lg bg-gray-900 border border-gray-700 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
        >
          {locations.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>

        {/* Price Range */}
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min price"
            min={0}
            value={filters.priceMin}
            onChange={(e) =>
              handleUpdate({
                priceMin: e.target.value ? Number(e.target.value) : "",
              })
            }
            className="w-1/2 rounded-lg bg-gray-900 border border-gray-700 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          />
          <input
            type="number"
            placeholder="Max price"
            min={0}
            value={filters.priceMax}
            onChange={(e) =>
              handleUpdate({
                priceMax: e.target.value ? Number(e.target.value) : "",
              })
            }
            className="w-1/2 rounded-lg bg-gray-900 border border-gray-700 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          />
        </div>

        {/* Organic filter */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.organic === true}
            onChange={(e) =>
              handleUpdate({ organic: e.target.checked ? true : "" })
            }
            className="w-4 h-4 rounded accent-green-400"
          />
          <span className="text-sm text-gray-300">Organic Only</span>
        </label>
      </div>
    </section>
  );
}
