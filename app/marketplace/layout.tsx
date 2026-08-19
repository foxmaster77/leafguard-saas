import type { ReactNode } from "react";

export default function MarketplaceLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-900 text-white antialiased">
      {/* Marketplace-scoped nav breadcrumb */}
      <div className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="container mx-auto px-4 py-3 flex items-center gap-2 text-sm text-gray-400">
          <a href="/" className="hover:text-green-400 transition-colors">
            Home
          </a>
          <span>/</span>
          <span className="text-white">Marketplace</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">{children}</div>
    </div>
  );
}
