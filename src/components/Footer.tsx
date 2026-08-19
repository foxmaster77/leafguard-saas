'use client';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ background: '#030503', borderTop: '1px solid rgba(200,245,62,0.06)', padding: '3rem', position: 'relative', overflow: 'hidden' }}>
      <video autoPlay muted loop playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.07, zIndex: 0 }} src="/footer-bg.mp4" />
      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto' }}>
        {/* Top Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
          <div>
            <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.5rem', color: '#C8F53E', fontStyle: 'italic', letterSpacing: '0.08em', marginBottom: '0.6rem' }}>CropGuard AI</div>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem', lineHeight: 1.7, maxWidth: '280px' }}>Instant early pathogen detection via multi-spectral AI for Rice, Wheat & Potato belts.</p>
          </div>
          <div>
            <p style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: '#C8F53E', letterSpacing: '0.2em', marginBottom: '1rem', textTransform: 'uppercase' }}>PRODUCT</p>
            {[['AI Diagnostics', '/analyze'], ['Regional Radar', '/dashboard'], ['Marketplace', '/marketplace'], ['Enterprise Pricing', '/pricing']].map(([l, h]) => (
              <div key={l} style={{ marginBottom: '0.6rem' }}><Link href={h} style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => (e.currentTarget.style.color = '#C8F53E')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}>{l}</Link></div>
            ))}
          </div>
          <div>
            <p style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: '#C8F53E', letterSpacing: '0.2em', marginBottom: '1rem', textTransform: 'uppercase' }}>COMPANY</p>
            {[['About Us', '/product'], ['Contact', '/contact'], ['APIs', '/product']].map(([l, h]) => (
              <div key={l} style={{ marginBottom: '0.6rem' }}><Link href={h} style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => (e.currentTarget.style.color = '#C8F53E')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}>{l}</Link></div>
            ))}
          </div>
          <div>
            <p style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: '#C8F53E', letterSpacing: '0.2em', marginBottom: '1rem', textTransform: 'uppercase' }}>LEGAL</p>
            {[['Privacy Policy', '/contact'], ['Terms of Service', '/contact']].map(([l, h]) => (
              <div key={l} style={{ marginBottom: '0.6rem' }}><Link href={h} style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => (e.currentTarget.style.color = '#C8F53E')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}>{l}</Link></div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ borderTop: '1px solid rgba(200,245,62,0.04)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em' }}>© 2026 CropGuard AI. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '1.2rem' }}>
            {['𝕏', 'in', '⌥'].map((icon, i) => (
              <span key={i} style={{ color: 'rgba(255,255,255,0.35)', cursor: 'pointer', fontSize: '1rem', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#C8F53E')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}>
                {icon}
              </span>
            ))}
          </div>
          <p style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em' }}>POWERED BY NEXT.JS &amp; VERCEL</p>
        </div>
      </div>
    </footer>
  );
}
