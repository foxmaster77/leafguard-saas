'use client';
import Link from 'next/link';

const TECH_STACK = [
  { name: 'Next.js', color: '#fff' },
  { name: 'Supabase', color: '#3ECF8E' },
  { name: 'Google Gemini', color: '#4285F4' },
  { name: 'Groq', color: '#F55036' },
  { name: 'Twilio (WhatsApp)', color: '#25D366' },
  { name: 'Bhashini', color: '#FF9933' },
  { name: 'OpenWeather', color: '#E8B84B' },
  { name: 'TensorFlow Lite', color: '#FF6F00' },
  { name: 'Next.js', color: '#fff' },
  { name: 'Supabase', color: '#3ECF8E' },
  { name: 'Google Gemini', color: '#4285F4' },
  { name: 'Groq', color: '#F55036' },
  { name: 'Twilio (WhatsApp)', color: '#25D366' },
  { name: 'Bhashini', color: '#FF9933' },
  { name: 'OpenWeather', color: '#E8B84B' },
  { name: 'TensorFlow Lite', color: '#FF6F00' },
];

export default function Footer() {
  return (
    <footer style={{ background: '#030712', borderTop: '1px solid rgba(34,197,94,0.1)', position: 'relative', overflow: 'hidden' }}>

      {/* ── Tech Stack Marquee Banner ── */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '1.2rem 0', overflow: 'hidden', background: 'rgba(0,0,0,0.4)' }}>
        <p style={{ textAlign: 'center', fontFamily: 'monospace', fontSize: '0.58rem', color: 'rgba(34,197,94,0.7)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.8rem' }}>POWERED BY</p>
        <div style={{ display: 'flex', overflow: 'hidden', WebkitMaskImage: 'linear-gradient(to right,transparent,black 8%,black 92%,transparent)', maskImage: 'linear-gradient(to right,transparent,black 8%,black 92%,transparent)' }}>
          <div style={{ display: 'flex', gap: '0', animation: 'marquee 30s linear infinite', width: 'max-content' }}>
            {TECH_STACK.map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0 1.5rem', borderRight: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: t.color, display: 'inline-block', boxShadow: `0 0 6px ${t.color}` }} />
                <span style={{ fontFamily: 'monospace', fontSize: '0.72rem', fontWeight: 700, color: t.color, letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{t.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Footer Content ── */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1fr', gap: '2.5rem', marginBottom: '2.5rem' }}>

          {/* Brand Column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.8rem' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C8 2 4 5 4 9c0 5 8 13 8 13s8-8 8-13c0-4-3-7-8-7z" fill="#22C55E" />
              </svg>
              <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.4rem', color: '#22C55E', fontStyle: 'italic', letterSpacing: '0.06em' }}>CropGuard AI</span>
            </div>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.58rem', fontFamily: 'monospace', fontWeight: 800, background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.35)', color: '#FBBF24', padding: '2px 7px', borderRadius: '3px' }}>SIH 2026 SUBMISSION</span>
              <span style={{ fontSize: '0.58rem', fontFamily: 'monospace', fontWeight: 800, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', color: '#818CF8', padding: '2px 7px', borderRadius: '3px' }}>BHASHINI INTEGRATED</span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem', lineHeight: 1.7, maxWidth: '300px' }}>
              Edge AI crop diagnostics via WhatsApp & web. Built for 140M Indian farmers with Govt. API integration, offline support, and 10+ regional languages.
            </p>
            <div style={{ display: 'flex', gap: '8px', marginTop: '1.2rem' }}>
              {['🛡️ Data Sovereign', '🔒 Zero PII', '🇮🇳 Made in India'].map((b, i) => (
                <span key={i} style={{ fontSize: '0.6rem', fontFamily: 'monospace', color: 'rgba(34,197,94,0.8)', background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)', padding: '2px 6px', borderRadius: '3px', whiteSpace: 'nowrap' }}>{b}</span>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <p style={{ fontFamily: 'monospace', fontSize: '0.62rem', color: '#22C55E', letterSpacing: '0.18em', marginBottom: '1rem', textTransform: 'uppercase' }}>PRODUCT</p>
            {[
              ['AI Diagnostics', '/analyze'],
              ['KVK Dashboard', '/dashboard'],
              ['Kisan Chaupal', '/marketplace'],
              ['Mandi Rates', '/analyze'],
              ['Enterprise Plans', '/pricing'],
            ].map(([l, h]) => (
              <div key={l} style={{ marginBottom: '0.55rem' }}>
                <Link href={h} style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#22C55E')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}>
                  {l}
                </Link>
              </div>
            ))}
          </div>

          {/* Govt & Regions */}
          <div>
            <p style={{ fontFamily: 'monospace', fontSize: '0.62rem', color: '#22C55E', letterSpacing: '0.18em', marginBottom: '1rem', textTransform: 'uppercase' }}>SUPPORTED REGIONS</p>
            {['West Bengal', 'Punjab', 'Uttar Pradesh', 'Maharashtra', 'Bihar', 'Andhra Pradesh', 'Tamil Nadu'].map(r => (
              <div key={r} style={{ marginBottom: '0.45rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(34,197,94,0.5)', display: 'inline-block' }} />
                <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem' }}>{r}</span>
              </div>
            ))}
          </div>

          {/* Legal */}
          <div>
            <p style={{ fontFamily: 'monospace', fontSize: '0.62rem', color: '#22C55E', letterSpacing: '0.18em', marginBottom: '1rem', textTransform: 'uppercase' }}>LEGAL & COMPLIANCE</p>
            {[
              ['Privacy Policy', '/contact'],
              ['Terms of Service', '/contact'],
              ['Data Sovereignty', '/contact'],
              ['API Documentation', '/product'],
              ['KVK Partnership', '/contact'],
              ['Govt. API Usage', '/product'],
            ].map(([l, h]) => (
              <div key={l} style={{ marginBottom: '0.55rem' }}>
                <Link href={h} style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#22C55E')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}>
                  {l}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Compliance Row */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.5rem', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
          {[
            { icon: '🛡️', text: 'Krishak Bandhu & PM-KISAN Compatible', color: '#60A5FA' },
            { icon: '📡', text: 'Bhashini API · 10+ Languages', color: '#818CF8' },
            { icon: '🌾', text: 'data.gov.in Mandi Rates Integration', color: '#FBBF24' },
            { icon: '⚡', text: 'Offline Edge AI · TFLite', color: '#34D399' },
          ].map((b, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: 'monospace', fontSize: '0.62rem', color: b.color, background: `rgba(255,255,255,0.04)`, border: '1px solid rgba(255,255,255,0.08)', padding: '4px 10px', borderRadius: '4px' }}>
              {b.icon} {b.text}
            </span>
          ))}
        </div>

        {/* Bottom Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ fontFamily: 'monospace', fontSize: '0.62rem', color: 'rgba(255,255,255,0.3)' }}>
            © 2026 CropGuard AI. Built for Smart India Hackathon. All rights reserved.
          </p>
          <p style={{ fontFamily: 'monospace', fontSize: '0.62rem', color: 'rgba(255,255,255,0.25)' }}>
            Powered by Next.js · Supabase · Google Gemini · Bhashini
          </p>
        </div>
      </div>
    </footer>
  );
}
