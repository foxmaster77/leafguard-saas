import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ImageGallery from "./components/ImageGallery";
import ContactButtons from "./components/ContactButtons";
import { MOCK_PRODUCTS } from "../components/mockData";
import Link from "next/link";

// Per Next.js 15 docs: params is a Promise
type Props = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  return MOCK_PRODUCTS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = MOCK_PRODUCTS.find((p) => p.id === id);
  return {
    title: product
      ? `${product.title} – Marketplace`
      : "Product – Marketplace",
    description: product?.description ?? "View product details on CropGuard AI Marketplace.",
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = MOCK_PRODUCTS.find((p) => p.id === id);

  if (!product) notFound();

  const priceLabel = `${product.currency}${product.price.toLocaleString()}/${product.unit}`;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back link */}
      <Link
        href="/marketplace"
        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-green-400 transition-colors mb-6"
      >
        ← Back to Marketplace
      </Link>

      <div className="bg-gray-800/60 rounded-xl border border-gray-700 p-6">
        {/* Title row */}
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div>
            <div className="flex gap-2 mb-2">
              <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">
                {product.category}
              </span>
              {product.organic && (
                <span className="text-xs bg-emerald-800/60 text-emerald-300 px-2 py-0.5 rounded-full">
                  🌿 Organic Certified
                </span>
              )}
              {product.seller.verified && (
                <span className="text-xs bg-green-900/60 text-green-300 px-2 py-0.5 rounded-full">
                  ✓ Verified Seller
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
              {product.title}
            </h1>
          </div>
          <div className="text-right">
            <p className="text-3xl font-extrabold text-green-400">
              {priceLabel}
            </p>
            {product.quantity && (
              <p className="text-sm text-gray-500 mt-0.5">
                {product.quantity.toLocaleString()} {product.unit} available
              </p>
            )}
          </div>
        </div>

        {/* Image Gallery */}
        <div className="mb-6">
          <ImageGallery images={[product.image]} />
        </div>

        {/* Two-column layout */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Left — details */}
          <div className="md:col-span-2 space-y-4">
            {/* Product info table */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-900/50 rounded-lg p-3">
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Location
                </p>
                <p className="text-white font-medium mt-0.5">
                  📍 {product.location}
                </p>
              </div>
              {product.harvestDate && (
                <div className="bg-gray-900/50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Harvest Date
                  </p>
                  <p className="text-white font-medium mt-0.5">
                    📅{" "}
                    {new Date(product.harvestDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              )}
              <div className="bg-gray-900/50 rounded-lg p-3">
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Price
                </p>
                <p className="text-green-400 font-bold mt-0.5">{priceLabel}</p>
              </div>
              {product.quantity && (
                <div className="bg-gray-900/50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Quantity
                  </p>
                  <p className="text-white font-medium mt-0.5">
                    {product.quantity.toLocaleString()} {product.unit}
                  </p>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-2">
                Description
              </h2>
              <p className="text-gray-300 leading-relaxed">
                {product.description ??
                  "No description provided by the seller."}
              </p>
            </div>
          </div>

          {/* Right — seller + contact */}
          <div className="space-y-4">
            <div className="bg-gray-900/50 rounded-xl p-4">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
                Seller
              </h2>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-lg">
                  👨‍🌾
                </div>
                <div>
                  <p className="text-white font-semibold">
                    {product.seller.name}
                  </p>
                  <p className="text-xs text-yellow-400">
                    ⭐ {product.seller.rating} / 5.0
                  </p>
                </div>
              </div>
              <ContactButtons sellerName={product.seller.name} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
