'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const S = {
  nav: (scrolled: boolean): React.CSSProperties => ({
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    background: scrolled ? 'rgba(9,9,11,0.98)' : 'rgba(9,9,11,0.92)',
    backdropFilter: 'blur(20px)',
    borderBottom: scrolled ? '1px solid rgba(34,197,94,0.15)' : '1px solid rgba(34,197,94,0.08)',
    transition: 'all 0.3s ease',
  }),
};

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/dashboard', label: 'KVK Dashboard' },
  { href: '/marketplace', label: 'Kisan Chaupal' },
  { href: '/analyze', label: 'Mandi Rates' },
];

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeLang, setActiveLang] = useState<'EN' | 'HI' | 'BN'>('EN');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <style>{`
        .nav-wrap { padding: 0 2rem; height: 60px; }
        .mobile-menu-btn { display: none; background: none; border: none; cursor: pointer; z-index: 1001; padding: 4px; }
        .mobile-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(9,9,11,0.99); backdrop-filter: blur(12px);
          z-index: 999; display: flex; flex-direction: column;
          justify-content: center; align-items: center; gap: 1.5rem;
          transform: translateX(100%); transition: transform 0.28s cubic-bezier(0.4,0,0.2,1);
        }
        .mobile-overlay.open { transform: translateX(0); }
        @media (max-width: 900px) {
          .nav-wrap { padding: 0 1rem; }
          .hide-mobile { display: none !important; }
          .mobile-menu-btn { display: flex; align-items: center; justify-content: center; }
        }
      `}</style>

      <nav className="nav-wrap" style={S.nav(scrolled)}>
        {/* ── LEFT: Logo + Badges ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => router.push('/')}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ position: 'relative', width: 28, height: 28 }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C8 2 4 5 4 9c0 5 8 13 8 13s8-8 8-13c0-4-3-7-8-7z" fill="#22C55E" opacity="0.9" />
                <path d="M12 2v20M8 6s2 2 4 6M16 6s-2 2-4 6" stroke="#052e16" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              {/* Green glow dot — System Active */}
              <span style={{
                position: 'absolute', bottom: -1, right: -1,
                width: 8, height: 8, borderRadius: '50%', background: '#22C55E',
                boxShadow: '0 0 6px 2px rgba(34,197,94,0.7)', border: '1.5px solid rgba(9,9,11,0.9)'
              }} />
            </div>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.25rem', fontStyle: 'italic', color: '#22C55E', letterSpacing: '0.06em' }}>
              CropGuard AI
            </span>
          </div>

          {/* SIH + Bhashini Badges */}
          <div className="hide-mobile" style={{ display: 'flex', gap: '6px' }}>
            <span style={{ fontSize: '0.6rem', fontFamily: 'monospace', fontWeight: 800, background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.4)', color: '#FBBF24', padding: '2px 7px', borderRadius: '3px', letterSpacing: '0.04em' }}>
              SIH 2026
            </span>
            <span style={{ fontSize: '0.6rem', fontFamily: 'monospace', fontWeight: 800, background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.35)', color: '#818CF8', padding: '2px 7px', borderRadius: '3px', letterSpacing: '0.04em' }}>
              BHASHINI ✓
            </span>
          </div>
        </div>

        {/* ── CENTER: Nav Links ── */}
        <div className="hide-mobile" style={{ display: 'flex', gap: '2rem' }}>
          {navLinks.map(l => (
            <Link key={l.href} href={l.href} style={{
              fontSize: '0.78rem', fontWeight: 500, textDecoration: 'none',
              color: pathname === l.href ? '#22C55E' : 'rgba(255,255,255,0.55)',
              transition: 'color 0.2s', letterSpacing: '0.02em',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = '#22C55E')}
              onMouseLeave={e => (e.currentTarget.style.color = pathname === l.href ? '#22C55E' : 'rgba(255,255,255,0.55)')}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* ── RIGHT: Language Toggle + Admin Login ── */}
        <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Language Toggle */}
          <div style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', overflow: 'hidden' }}>
            {[
              { id: 'EN', label: 'A' },
              { id: 'HI', label: 'अ' },
              { id: 'BN', label: 'অ' },
            ].map((lang, i) => (
              <button key={lang.id} onClick={() => setActiveLang(lang.id as any)} style={{
                background: activeLang === lang.id ? '#22C55E' : 'transparent',
                color: activeLang === lang.id ? '#052e16' : 'rgba(255,255,255,0.65)',
                border: 'none',
                borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                padding: '4px 10px', fontSize: '0.82rem', fontWeight: 800, cursor: 'pointer', transition: 'all 0.15s',
              }}>{lang.label}</button>
            ))}
          </div>

          {/* Admin Login */}
          <Link href="/login" style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.35)',
            color: '#22C55E', fontSize: '0.72rem', fontWeight: 700, fontFamily: 'monospace',
            padding: '6px 14px', borderRadius: '6px', textDecoration: 'none', letterSpacing: '0.04em',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(34,197,94,0.2)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(34,197,94,0.1)'; }}
          >
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="8" r="4" /><path d="M6 20v-1a6 6 0 0112 0v1" />
            </svg>
            ADMIN (FPO/GOVT)
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={menuOpen ? '#22C55E' : '#fff'} strokeWidth="2" strokeLinecap="round">
            {menuOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </nav>

      {/* Mobile Overlay */}
      <div className={`mobile-overlay ${menuOpen ? 'open' : ''}`}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.65rem', fontFamily: 'monospace', fontWeight: 800, background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.4)', color: '#FBBF24', padding: '3px 10px', borderRadius: '4px' }}>SIH 2026</span>
          <span style={{ fontSize: '0.65rem', fontFamily: 'monospace', fontWeight: 800, background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.35)', color: '#818CF8', padding: '3px 10px', borderRadius: '4px' }}>BHASHINI ✓</span>
        </div>
        {navLinks.map(l => (
          <Link key={`m-${l.href}`} href={l.href} onClick={() => setMenuOpen(false)} style={{
            fontSize: '1.15rem', fontWeight: 600, textDecoration: 'none',
            color: pathname === l.href ? '#22C55E' : 'rgba(255,255,255,0.8)',
          }}>{l.label}</Link>
        ))}
        <div style={{ display: 'flex', gap: '8px', marginTop: '0.5rem' }}>
          {[{ id: 'EN', label: 'A' }, { id: 'HI', label: 'अ' }, { id: 'BN', label: 'অ' }].map(lang => (
            <button key={lang.id} onClick={() => setActiveLang(lang.id as any)} style={{
              background: activeLang === lang.id ? '#22C55E' : 'rgba(255,255,255,0.1)',
              color: activeLang === lang.id ? '#052e16' : 'white',
              border: 'none', borderRadius: '6px', padding: '6px 16px',
              fontSize: '1rem', fontWeight: 800, cursor: 'pointer',
            }}>{lang.label}</button>
          ))}
        </div>
        <Link href="/login" onClick={() => setMenuOpen(false)} style={{ marginTop: '0.5rem', fontSize: '0.85rem', fontFamily: 'monospace', fontWeight: 700, color: '#22C55E', textDecoration: 'none', border: '1px solid rgba(34,197,94,0.35)', padding: '8px 20px', borderRadius: '6px' }}>
          ADMIN (FPO/GOVT)
        </Link>
      </div>
    </>
  );
}
