import Link from "next/link";
import { Product } from "./mockData";

type Props = { product: Product };

export default function ProductCard({ product }: Props) {
  const priceLabel = `${product.currency}${product.price.toLocaleString()}/${product.unit}`;

  return (
    <article className="group bg-gray-800/60 rounded-xl overflow-hidden border border-gray-700 hover:border-green-400/50 transition-all duration-200 hover:shadow-lg hover:shadow-green-900/20 hover:-translate-y-0.5">
      <Link href={`/marketplace/${product.id}`} className="block h-full">
        {/* Image */}
        <div className="relative h-48 w-full bg-gray-900 flex items-center justify-center overflow-hidden">
          <img
            src={product.image}
            alt={product.title}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%231f2937'/%3E%3Ctext x='50' y='50' font-family='sans-serif' font-size='40' text-anchor='middle' dominant-baseline='middle' fill='%234b5563'%3E🌾%3C/text%3E%3C/svg%3E";
            }}
          />
          <div className="absolute top-2 left-2 flex gap-1.5">
            {product.seller.verified && (
              <span className="bg-green-500 text-gray-900 px-2 py-0.5 rounded-full text-xs font-semibold">
                ✓ Verified
              </span>
            )}
            {product.organic && (
              <span className="bg-emerald-600/90 text-white px-2 py-0.5 rounded-full text-xs font-semibold">
                🌿 Organic
              </span>
            )}
          </div>
          <span className="absolute top-2 right-2 bg-gray-900/80 text-gray-300 px-2 py-0.5 rounded-full text-xs">
            {product.category}
          </span>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-base text-white truncate leading-tight">
            {product.title}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
            📍 {product.location}
          </p>

          <p className="mt-3 text-xl font-bold text-green-400">{priceLabel}</p>

          {product.quantity && (
            <p className="text-xs text-gray-500 mt-0.5">
              {product.quantity.toLocaleString()} {product.unit} available
            </p>
          )}

          <div className="mt-3 flex items-center gap-1 text-xs text-gray-400">
            <span>⭐ {product.seller.rating}</span>
            <span className="text-gray-600">•</span>
            <span>{product.seller.name}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
