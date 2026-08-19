import type { ReactNode } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function MarketplaceLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#060A04] text-white antialiased flex flex-col justify-between">
      <Navigation />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-7xl">{children}</div>
      </main>
      <Footer />
    </div>
  );
}
