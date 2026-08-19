import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import ImageGallery from "./components/ImageGallery";
import ContactButtons from "./components/ContactButtons";
import { MOCK_PRODUCTS, Product } from "../components/mockData";
import ProductCard from "../components/ProductCard";
import {
  CheckCircle2,
  Star,
  MapPin,
  Calendar,
  Package,
  ShieldCheck,
  Truck,
  Sparkles,
  ArrowLeft,
  Clock,
  Award,
  Layers,
  Leaf
} from "lucide-react";

type Props = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  return MOCK_PRODUCTS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = MOCK_PRODUCTS.find((p) => p.id === id);
  return {
    title: product
      ? `${product.title} – CropGuard Farmer Marketplace`
      : "Agricultural Listing – CropGuard Marketplace",
    description:
      product?.description ??
      "View direct farm prices, grower verification, and specifications on CropGuard AI Marketplace.",
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = MOCK_PRODUCTS.find((p) => p.id === id);

  if (!product) notFound();

  const priceLabel = `${product.currency}${product.price.toLocaleString()}`;
  const galleryImages =
    product.images && product.images.length > 0
      ? product.images
      : [product.image];

  const relatedProducts = MOCK_PRODUCTS.filter(
    (p) => p.id !== product.id && p.category === product.category
  ).slice(0, 3);

  return (
    <div className="space-y-10">
      {/* Top Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
        <Link
          href="/marketplace"
          className="inline-flex items-center gap-1 hover:text-[#C8F53E] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Marketplace</span>
        </Link>
        <span>/</span>
        <span className="text-gray-500">{product.category}</span>
        <span>/</span>
        <span className="text-white truncate max-w-xs">{product.title}</span>
      </div>

      {/* Main 2-Column Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left Column: Gallery, Overview & Technical Specs (7 Cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Gallery */}
          <ImageGallery images={galleryImages} title={product.title} />

          {/* Badges & Title (Mobile visible & desktop clean) */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-gray-900 text-gray-200 border border-white/10">
                {product.category}
              </span>
              {product.organic && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 shadow-sm flex items-center gap-1">
                  <Leaf className="w-3.5 h-3.5" />
                  Organic Certified
                </span>
              )}
              {product.stockStatus && (
                <span className="px-3 py-1 rounded-full text-xs font-mono text-emerald-300 bg-emerald-950/60 border border-emerald-500/30">
                  ● {product.stockStatus}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {product.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-gray-400 pt-1">
              <span className="flex items-center gap-1 text-gray-300">
                <MapPin className="w-4 h-4 text-[#C8F53E]" />
                {product.location}, India
              </span>
              {product.harvestDate && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  Harvest: {new Date(product.harvestDate).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="p-6 rounded-2xl bg-[#0D1409]/80 border border-white/[0.08] backdrop-blur-md space-y-3">
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#C8F53E]">
              Product Overview
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              {product.description ||
                "High quality produce/agricultural item sourced directly from audited growers registered on the CropGuard AI network."}
            </p>
          </div>

          {/* Technical Specifications Table */}
          {product.specs && Object.keys(product.specs).length > 0 && (
            <div className="p-6 rounded-2xl bg-[#0D1409]/80 border border-white/[0.08] backdrop-blur-md space-y-4">
              <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#C8F53E] flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Specification &amp; Quality Parameters
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div
                    key={key}
                    className="p-3 rounded-xl bg-black/40 border border-white/5 flex flex-col justify-between"
                  >
                    <span className="text-[11px] font-mono uppercase text-gray-400">
                      {key}
                    </span>
                    <span className="text-xs font-bold text-white mt-1">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Direct Grower Trust Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <ShieldCheck className="w-5 h-5 text-[#C8F53E]" />
              <p className="text-xs font-bold text-white">Direct Farm Gate</p>
              <p className="text-[11px] text-gray-400">No agent commissions or middleman inflation.</p>
            </div>
            <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <Award className="w-5 h-5 text-[#C8F53E]" />
              <p className="text-xs font-bold text-white">Quality Inspected</p>
              <p className="text-[11px] text-gray-400">Verified moisture, purity and grade checks.</p>
            </div>
            <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <Truck className="w-5 h-5 text-[#C8F53E]" />
              <p className="text-xs font-bold text-white">Pan-India Freight</p>
              <p className="text-[11px] text-gray-400">Logistics assistance for bulk tractor/crop dispatch.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Purchase & Seller Profile Card (5 Cols) */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
          {/* Price & Purchase Action Card */}
          <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-[#0D1409] to-[#060A04] border border-[#C8F53E]/30 shadow-2xl backdrop-blur-xl space-y-6">
            <div>
              <span className="text-xs font-mono uppercase text-gray-400 block mb-1">
                Direct Farm Price
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-[#C8F53E] font-mono tracking-tight">
                  {priceLabel}
                </span>
                <span className="text-sm text-gray-400 font-mono">
                  / {product.unit}
                </span>
              </div>
              {product.discountPercent && (
                <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                  {product.discountPercent}% OFF Standard Market Rate
                </span>
              )}
            </div>

            {/* Availability info */}
            <div className="grid grid-cols-2 gap-2.5 py-3 border-y border-white/[0.08] text-xs font-mono">
              <div>
                <span className="text-gray-500 block">Total Quantity</span>
                <span className="text-white font-bold">
                  {product.quantity ? `${product.quantity.toLocaleString()} ${product.unit}` : "Available on request"}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block">Min. Order</span>
                <span className="text-white font-bold">
                  {product.minOrder || `1 ${product.unit}`}
                </span>
              </div>
            </div>

            {/* CTAs */}
            <ContactButtons
              sellerName={product.seller.name}
              productTitle={product.title}
              priceFormatted={`${priceLabel} / ${product.unit}`}
            />
          </div>

          {/* Seller Profile Mini-Card */}
          <div className="p-5 rounded-2xl bg-[#0D1409]/80 border border-white/[0.08] backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-gray-400">
                Verified Seller
              </span>
              {product.seller.verified && (
                <span className="inline-flex items-center gap-1 text-xs text-[#C8F53E] font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Audited Grower
                </span>
              )}
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-800 border-2 border-[#C8F53E]/40 flex-shrink-0">
                <img
                  src={product.seller.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
                  alt={product.seller.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  {product.seller.name}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-amber-300 font-mono mt-0.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-bold">{product.seller.rating}</span>
                  <span className="text-gray-500">
                    ({product.seller.reviewsCount || 48} reviews)
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/[0.06] text-xs font-mono text-gray-300">
              <div className="p-2 rounded-lg bg-black/30">
                <span className="text-gray-500 block text-[10px]">Member Since</span>
                <span className="text-white">{product.seller.memberSince || "2023"}</span>
              </div>
              <div className="p-2 rounded-lg bg-black/30">
                <span className="text-gray-500 block text-[10px]">Active Listings</span>
                <span className="text-white">{product.seller.activeListings || 8} items</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] font-mono text-gray-400 bg-gray-900/50 p-2 rounded-lg">
              <Clock className="w-3.5 h-3.5 text-[#C8F53E]" />
              <span>{product.seller.responseTime || "Replies in ~15 minutes"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Carousel / Grid */}
      {relatedProducts.length > 0 && (
        <section className="pt-10 border-t border-white/[0.08] space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">
                Similar In {product.category}
              </h2>
              <p className="text-xs text-gray-400">
                Explore more agricultural listings in this category
              </p>
            </div>
            <Link
              href="/marketplace"
              className="text-xs font-mono text-[#C8F53E] hover:underline"
            >
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((relProduct, i) => (
              <ProductCard key={relProduct.id} product={relProduct} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
