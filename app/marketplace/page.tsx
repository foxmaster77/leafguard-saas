import type { Metadata } from "next";
import Link from "next/link";
import MarketplaceCatalog from "./components/MarketplaceCatalog";

export const metadata: Metadata = {
  title: "Farmer Marketplace – CropGuard AI",
  description:
    "Buy & sell produce, equipment & inputs directly with trusted farmers.",
};

export default function MarketplacePage() {
  return (
    <div>
      {/* Hero Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">
            🌾 Farmer Marketplace
          </h1>
          <p className="text-gray-400 mt-1">
            Buy &amp; sell produce, equipment, and inputs directly — no
            middlemen.
          </p>
        </div>
        <Link
          href="/marketplace/sell"
          className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-gray-900 font-bold px-5 py-2.5 rounded-xl transition-colors duration-150 text-sm whitespace-nowrap"
        >
          + List an Item
        </Link>
      </div>

      {/* Client-rendered catalog with filters */}
      <MarketplaceCatalog />
    </div>
  );
}
