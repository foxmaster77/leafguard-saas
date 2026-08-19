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
            <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.6rem', color: '#C8F53E', fontStyle: 'italic', letterSpacing: '0.08em', marginBottom: '0.6rem' }}>CropGuard AI</div>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', lineHeight: 1.7, maxWidth: '300px', marginBottom: '1.2rem' }}>
              Instant early pathogen detection via multi-spectral AI, WhatsApp bots, and regional outbreak surveillance for Indian agriculture.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(200,245,62,0.08)', border: '1px solid rgba(200,245,62,0.2)', padding: '0.4rem 0.8rem', borderRadius: '6px' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#C8F53E', display: 'inline-block' }} />
              <span style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: '#C8F53E', letterSpacing: '0.05em' }}>WHATSAPP &amp; WEB PLATFORM</span>
            </div>
          </div>
          <div>
            <p style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: '#C8F53E', letterSpacing: '0.2em', marginBottom: '1rem', textTransform: 'uppercase' }}>PRODUCT</p>
            {[['Instant Diagnostics', '/analyze'], ['Regional Heatmap', '/dashboard'], ['Farmer Marketplace', '/marketplace'], ['Enterprise Pricing', '/pricing']].map(([l, h]) => (
              <div key={l} style={{ marginBottom: '0.6rem' }}><Link href={h} style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => (e.currentTarget.style.color = '#C8F53E')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}>{l}</Link></div>
            ))}
          </div>
          <div>
            <p style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: '#C8F53E', letterSpacing: '0.2em', marginBottom: '1rem', textTransform: 'uppercase' }}>COMPANY</p>
            {[['About Us', '/product'], ['Contact & Support', '/contact'], ['Developer APIs', '/product']].map(([l, h]) => (
              <div key={l} style={{ marginBottom: '0.6rem' }}><Link href={h} style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => (e.currentTarget.style.color = '#C8F53E')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}>{l}</Link></div>
            ))}
          </div>
          <div>
            <p style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: '#C8F53E', letterSpacing: '0.2em', marginBottom: '1rem', textTransform: 'uppercase' }}>LEGAL &amp; PRIVACY</p>
            {[['Privacy Policy', '/contact'], ['Terms of Service', '/contact'], ['Data Sovereignty', '/contact']].map(([l, h]) => (
              <div key={l} style={{ marginBottom: '0.6rem' }}><Link href={h} style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => (e.currentTarget.style.color = '#C8F53E')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}>{l}</Link></div>
            ))}
          </div>
        </div>

        {/* Middle Trust & Regions Row */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '1.5rem 0', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: '#C8F53E', letterSpacing: '0.15em', textTransform: 'uppercase', marginRight: '0.8rem' }}>SUPPORTED REGIONS:</span>
              <span style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)' }}>
                West Bengal · Punjab · Uttar Pradesh · Maharashtra · Andhra Pradesh · Bihar
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'monospace', fontSize: '0.65rem', color: '#38BDF8', background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.25)', padding: '0.3rem 0.6rem', borderRadius: '4px' }}>
                🛡️ Krishak Bandhu &amp; PM-KISAN Compatible
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'monospace', fontSize: '0.65rem', color: '#10B981', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', padding: '0.3rem 0.6rem', borderRadius: '4px' }}>
                🔒 Anonymized Telemetry · Zero PII Stored
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em' }}>© 2026 CropGuard AI. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '1.2rem' }}>
            {['𝕏', 'in', '⌥'].map((icon, i) => (
              <span key={i} style={{ color: 'rgba(255,255,255,0.35)', cursor: 'pointer', fontSize: '1rem', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#C8F53E')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}>
                {icon}
              </span>
            ))}
          </div>
          <p style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em' }}>POWERED BY NEXT.JS, TAILWIND &amp; VERCEL</p>
        </div>
      </div>
    </footer>
  );
}
