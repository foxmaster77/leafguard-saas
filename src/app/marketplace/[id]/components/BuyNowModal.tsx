"use client";

import React, { useState } from "react";
import { Product } from "../../components/mockData";
import { supabase } from "@/lib/supabase";
import {
  X,
  CheckCircle2,
  ShieldCheck,
  Truck,
  Sparkles,
  Phone,
  MessageSquare,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Leaf
} from "lucide-react";

type Props = {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
};

export default function BuyNowModal({ product, isOpen, onClose }: Props) {
  // Extract initial minimum quantity from product or default to 1
  const parseMinQty = () => {
    if (product.minOrder) {
      const match = product.minOrder.match(/\d+/);
      if (match) return parseInt(match[0], 10);
    }
    return 1;
  };

  const minQty = parseMinQty();
  const [quantity, setQuantity] = useState<number>(minQty);
  const [buyerName, setBuyerName] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [buyerNote, setBuyerNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderId, setOrderId] = useState("");

  if (!isOpen) return null;

  const totalAmount = quantity * product.price;
  const priceFormatted = `${product.currency}${product.price.toLocaleString()}`;
  const totalFormatted = `${product.currency}${totalAmount.toLocaleString()}`;

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    setQuantity((prev) => (prev > minQty ? prev - 1 : minQty));
  };

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const generatedId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderId(generatedId);

    // Optional safe logging to Supabase (inquiries table)
    try {
      if (supabase) {
        await supabase.from("inquiries").insert({
          item_id: product.id,
          item_title: product.title,
          seller_name: product.seller.name,
          buyer_name: buyerName,
          buyer_phone: buyerPhone,
          quantity: quantity,
          unit: product.unit,
          total_price: totalAmount,
          currency: product.currency,
          delivery_address: deliveryAddress,
          buyer_note: buyerNote,
          created_at: new Date().toISOString(),
        });
      }
    } catch (err) {
      // Safe fallback — no error displayed to user for mock flow
      console.log("Mock inquiry logged locally (Supabase table optional)");
    }

    // Simulate network submission delay
    await new Promise((r) => setTimeout(r, 900));

    setIsSubmitting(false);
    setOrderConfirmed(true);
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0D1409] border border-[#C8F53E]/30 shadow-[0_0_50px_rgba(200,245,62,0.15)] text-white p-6 sm:p-8 space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-gray-900/80 border border-white/10 text-gray-400 hover:text-white hover:bg-gray-800 transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {orderConfirmed ? (
          /* SUCCESS CONFIRMATION STATE (Requirement 2 & 4) */
          <div className="text-center py-4 space-y-6 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-[#C8F53E]/15 border-2 border-[#C8F53E] text-[#C8F53E] flex items-center justify-center mx-auto text-3xl shadow-[0_0_24px_rgba(200,245,62,0.4)]">
              ✓
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-[#C8F53E] uppercase tracking-wider px-3 py-1 rounded-full bg-[#C8F53E]/10 border border-[#C8F53E]/20">
                ORDER REQUEST SENT TO GROWER
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Order Placed Successfully!
              </h2>
              <p className="text-xs font-mono text-gray-400">
                Reference ID: <span className="text-[#C8F53E] font-bold">{orderId}</span>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-left space-y-2 text-xs font-mono">
              <div className="flex justify-between text-gray-300">
                <span>Item:</span>
                <span className="text-white font-bold truncate max-w-[200px]">{product.title}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Quantity:</span>
                <span className="text-[#C8F53E] font-bold">{quantity} {product.unit}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Estimated Total:</span>
                <span className="text-white font-bold">{totalFormatted}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Seller:</span>
                <span className="text-white">{product.seller.name}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#C8F53E]/10 border border-[#C8F53E]/20 text-xs text-gray-300 leading-relaxed">
              <p>
                <strong className="text-[#C8F53E]">{product.seller.name}</strong> will contact you at{" "}
                <strong className="text-white">{buyerPhone}</strong> to arrange dispatch logistics and delivery schedule. No advance payment needed.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center pt-2">
              <button
                onClick={onClose}
                className="w-full py-3.5 px-6 rounded-xl bg-[#C8F53E] text-[#060A04] hover:bg-[#b8e52e] text-xs font-mono font-black uppercase tracking-wider transition-all cursor-pointer shadow-lg"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* ORDER SUMMARY & CHECKOUT FORM */
          <form onSubmit={handleConfirmOrder} className="space-y-5">
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#C8F53E]/10 border border-[#C8F53E]/20 text-[11px] font-mono text-[#C8F53E] mb-1.5">
                <Sparkles className="w-3 h-3" />
                <span>DIRECT FARM CHECKOUT</span>
              </div>
              <h2 className="text-xl font-bold text-white">
                Place Order Request
              </h2>
              <p className="text-xs text-gray-400">
                Order directly from verified grower with zero middleman markup.
              </p>
            </div>

            {/* Product Mini Preview */}
            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex items-center gap-3.5">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-900 flex-shrink-0">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[10px] font-mono uppercase text-gray-400">
                    {product.category}
                  </span>
                  {product.organic && (
                    <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
                      <Leaf className="w-2.5 h-2.5" /> Organic
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-bold text-white truncate">
                  {product.title}
                </h3>
                <p className="text-xs text-[#C8F53E] font-mono font-bold mt-0.5">
                  {priceFormatted} / {product.unit}
                </p>
              </div>
            </div>

            {/* Quantity Selector & Live Total */}
            <div className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-mono uppercase text-gray-300 block">
                    Quantity ({product.unit})
                  </label>
                  {product.minOrder && (
                    <span className="text-[10px] text-gray-500 font-mono">
                      Min. Order: {product.minOrder}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 bg-gray-900 border border-white/10 rounded-xl p-1">
                  <button
                    type="button"
                    onClick={handleDecrement}
                    className="p-1.5 rounded-lg bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>

                  <input
                    type="number"
                    min={minQty}
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(minQty, parseInt(e.target.value, 10) || minQty))
                    }
                    className="w-16 text-center bg-transparent text-white font-mono font-bold text-sm focus:outline-none"
                  />

                  <button
                    type="button"
                    onClick={handleIncrement}
                    className="p-1.5 rounded-lg bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Total Calculation Row */}
              <div className="pt-3 border-t border-white/[0.08] flex items-baseline justify-between">
                <span className="text-xs font-mono uppercase text-gray-400">
                  Estimated Order Total
                </span>
                <span className="text-2xl font-black text-[#C8F53E] font-mono">
                  {totalFormatted}
                </span>
              </div>
            </div>

            {/* Buyer Contact Form */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-gray-400">
                Delivery &amp; Contact Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-gray-300 mb-1">
                    Your Full Name <span className="text-[#C8F53E]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-900 border border-white/10 text-white placeholder-gray-600 text-xs focus:outline-none focus:border-[#C8F53E]/70"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-gray-300 mb-1">
                    Contact Number <span className="text-[#C8F53E]">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Enter contact number"
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-900 border border-white/10 text-white placeholder-gray-600 text-xs font-mono focus:outline-none focus:border-[#C8F53E]/70"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-gray-300 mb-1">
                  Delivery District &amp; State <span className="text-[#C8F53E]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hooghly, West Bengal (PIN: 712101)"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-900 border border-white/10 text-white placeholder-gray-600 text-xs focus:outline-none focus:border-[#C8F53E]/70"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-gray-300 mb-1">
                  Special Instructions / Quality Preferences (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Prefer delivery on Saturday, require moisture certificate"
                  value={buyerNote}
                  onChange={(e) => setBuyerNote(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-900 border border-white/10 text-white placeholder-gray-600 text-xs focus:outline-none focus:border-[#C8F53E]/70"
                />
              </div>
            </div>

            {/* Escrow & Payment Notice */}
            <div className="flex items-start gap-2 p-3 rounded-xl bg-black/40 border border-[#C8F53E]/20 text-[11px] text-gray-300">
              <ShieldCheck className="w-4 h-4 text-[#C8F53E] flex-shrink-0 mt-0.5" />
              <p className="leading-tight text-gray-400">
                <strong className="text-white">Pay-on-Inspection:</strong> No online payment is charged now. You arrange final settlement with the grower after verifying produce quality.
              </p>
            </div>

            {/* Confirm Order CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl bg-[#C8F53E] hover:bg-[#b8e52e] text-[#060A04] font-black text-xs font-mono uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-[0_0_24px_rgba(200,245,62,0.3)] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Submitting Order Request…</span>
                </>
              ) : (
                <>
                  <span>Confirm Order Request ({totalFormatted})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
