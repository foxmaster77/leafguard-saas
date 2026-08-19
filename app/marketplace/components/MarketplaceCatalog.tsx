"use client";

import { useState, useMemo } from "react";
import FilterBar, { FilterState, defaultFilters } from "./FilterBar";
import ProductCard from "./ProductCard";
import { MOCK_PRODUCTS, Product } from "./mockData";

function applyFilters(products: Product[], filters: FilterState): Product[] {
  return products.filter((p) => {
    if (
      filters.query &&
      !p.title.toLowerCase().includes(filters.query.toLowerCase()) &&
      !p.location.toLowerCase().includes(filters.query.toLowerCase())
    )
      return false;
    if (filters.category !== "All" && p.category !== filters.category)
      return false;
    if (filters.location !== "All" && p.location !== filters.location)
      return false;
    if (filters.priceMin !== "" && p.price < Number(filters.priceMin))
      return false;
    if (filters.priceMax !== "" && p.price > Number(filters.priceMax))
      return false;
    if (filters.organic === true && !p.organic) return false;
    return true;
  });
}

export default function MarketplaceCatalog() {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const filtered = useMemo(
    () => applyFilters(MOCK_PRODUCTS, filters),
    [filters]
  );

  return (
    <>
      <FilterBar onChange={setFilters} />

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-gray-400 text-lg">No products match your search.</p>
          <p className="text-gray-600 text-sm mt-1">
            Try adjusting the filters above.
          </p>
        </div>
      )}
    </>
  );
}
