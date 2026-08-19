'use client';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-[#030503] border-t border-[#C8F53E]/10 py-10 px-4 sm:px-8 lg:px-12 relative overflow-hidden">
      <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover opacity-5 pointer-events-none z-0" src="/footer-bg.mp4" />
      <div className="relative z-10 max-w-7xl mx-auto w-full">
        {/* Top Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div className="sm:col-span-2">
            <div className="font-bebas text-2xl md:text-3xl text-[#C8F53E] italic tracking-wider mb-2">CropGuard AI</div>
            <p className="text-white/40 text-xs sm:text-sm leading-relaxed max-w-sm">
              Built for Bengal&apos;s farmers. Voice-first crop intelligence.
            </p>
          </div>
          <div>
            <p className="font-mono text-[10px] font-bold text-[#C8F53E] tracking-widest mb-3 uppercase">PRODUCT</p>
            {[['How it Works', '/product'], ['Marketplace', '/marketplace'], ['Live Dashboard', '/dashboard'], ['Pricing', '/pricing'], ['AI Diagnostic', '/analyze']].map(([l, h]) => (
              <div key={l} className="mb-2">
                <Link href={h} className="text-white/40 hover:text-[#C8F53E] text-xs sm:text-sm no-underline transition-colors font-mono">
                  {l}
                </Link>
              </div>
            ))}
          </div>
          <div>
            <p className="font-mono text-[10px] font-bold text-[#C8F53E] tracking-widest mb-3 uppercase">COMPANY</p>
            {[['Product Overview', '/product'], ['Contact & Support', '/contact'], ['Terms & Privacy', '#']].map(([l, h]) => (
              <div key={l} className="mb-2">
                <Link href={h} className="text-white/40 hover:text-[#C8F53E] text-xs sm:text-sm no-underline transition-colors font-mono">
                  {l}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#C8F53E]/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <p className="font-mono text-[10px] text-white/30 tracking-wider">
            © 2026 CropGuard AI · ALL RIGHTS RESERVED
          </p>
          <div className="flex gap-4">
            {['𝕏', 'in', 'GitHub'].map((icon, i) => (
              <span key={i} className="text-white/30 hover:text-[#C8F53E] cursor-pointer text-xs font-mono transition-colors">
                {icon}
              </span>
            ))}
          </div>
          <p className="font-mono text-[10px] text-white/30 tracking-wider">
            POWERED BY NEXT.JS 16 &amp; VERCEL
          </p>
        </div>
      </div>
    </footer>
  );
}

