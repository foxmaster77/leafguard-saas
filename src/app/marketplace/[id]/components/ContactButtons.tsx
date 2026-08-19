"use client";

type Props = { sellerName: string; phone?: string };

export default function ContactButtons({
  sellerName,
  phone = "+919876543210",
}: Props) {
  const whatsappLink = `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(
    `Hello ${sellerName}, I am interested in your product listed on CropGuard AI Marketplace.`
  )}`;

  return (
    <div className="flex flex-col gap-3 w-full">
      <button
        className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-gray-900 font-semibold py-2.5 px-4 rounded-xl transition-colors duration-150"
        onClick={() => alert("In-app chat coming soon!")}
      >
        💬 Chat with Seller
      </button>

      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5a] text-white font-semibold py-2.5 px-4 rounded-xl transition-colors duration-150"
      >
        📱 WhatsApp
      </a>

      <a
        href={`tel:${phone}`}
        className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors duration-150"
      >
        📞 Call Seller
      </a>
    </div>
  );
}
