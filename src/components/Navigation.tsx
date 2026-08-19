'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const S = {
  nav: (scrolled: boolean): React.CSSProperties => ({
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    background: scrolled ? 'rgba(6,10,4,0.97)' : 'rgba(6,10,4,0.85)',
    backdropFilter: 'blur(20px)',
    borderBottom: scrolled ? '1px solid rgba(200,245,62,0.1)' : '1px solid transparent',
    transition: 'all 0.3s ease',
  }),
  logo: { display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', textDecoration: 'none' } as React.CSSProperties,
  logoText: { fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.35rem', fontWeight: 700, color: '#C8F53E', letterSpacing: '0.08em', fontStyle: 'italic' } as React.CSSProperties,
  centerLinks: { display: 'flex', alignItems: 'center', gap: '2.5rem' } as React.CSSProperties,
  rightActions: { display: 'flex', alignItems: 'center', gap: '1.5rem' } as React.CSSProperties,
  liveBtn: { background: '#C8F53E', color: '#060A04', fontWeight: 900, fontFamily: 'monospace', fontSize: '0.72rem', letterSpacing: '0.15em', padding: '0.6rem 1.4rem', border: 'none', cursor: 'pointer', transition: 'transform 0.2s ease', textDecoration: 'none', display: 'inline-block' } as React.CSSProperties,
};

const links = [
  { href: '/', label: 'HOME' }, { href: '/product', label: 'PRODUCT' },
  { href: '/marketplace', label: 'MARKETPLACE' },
  { href: '/dashboard', label: 'DASHBOARD' }, { href: '/pricing', label: 'PRICING' },
  { href: '/contact', label: 'CONTACT' }, { href: '/analyze', label: 'ANALYZE' },
];

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeLang, setActiveLang] = useState<'EN' | 'HI' | 'BN'>('EN');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(
    'Hello CropGuard AI, I would like to test the WhatsApp leaf diagnosis bot for my farm / FPO.'
  )}`;

  return (
    <>
      <style>{`
        .nav-container { padding: 0.9rem 2.5rem; }
        .mobile-menu-btn { display: none; background: none; border: none; cursor: pointer; z-index: 1001; }
        .mobile-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(6, 10, 4, 0.98);
          backdrop-filter: blur(10px);
          z-index: 999;
          display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 1.5rem;
          transform: translateX(100%);
          transition: transform 0.3s ease-in-out;
        }
        .mobile-overlay.open { transform: translateX(0); }
        @media (max-width: 1024px) {
          .nav-container { padding: 0.9rem 1.25rem; }
          .hide-on-mobile { display: none !important; }
          .mobile-menu-btn { display: block; }
        }
      `}</style>
      <nav className="nav-container" style={S.nav(scrolled)}>
      {/* Left: Brand */}
      <div style={S.logo} onClick={() => router.push('/')}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M12 2C8 2 4 5 4 9c0 5 8 13 8 13s8-8 8-13c0-4-3-7-8-7z" fill="#C8F53E" opacity="0.9" />
          <path d="M12 2v20M8 6s2 2 4 6M16 6s-2 2-4 6" stroke="#060A04" strokeWidth="1" strokeLinecap="round" />
        </svg>
        <span style={S.logoText}>CropGuard AI</span>
      </div>

      {/* Center: Links */}
      <div className="hide-on-mobile" style={S.centerLinks}>
        {links.map(l => (
          <Link key={l.href} href={l.href} style={{
            fontFamily: 'monospace', fontSize: '0.72rem', letterSpacing: '0.16em',
            textTransform: 'uppercase' as const, textDecoration: 'none',
            color: pathname === l.href || hovered === l.href ? '#C8F53E' : 'rgba(255,255,255,0.45)',
            transition: 'color 0.2s', fontWeight: pathname === l.href ? 700 : 400,
          }} onMouseEnter={() => setHovered(l.href)} onMouseLeave={() => setHovered('')}>
            {l.label}
          </Link>
        ))}
      </div>

      {/* Right: Language Toggle & Actions */}
      <div className="hide-on-mobile" style={S.rightActions}>
        {/* Language Toggle Segmented Pill */}
        <div style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '99px', padding: '2px' }}>
          {[
            { id: 'EN', label: 'EN' },
            { id: 'HI', label: 'हिंदी' },
            { id: 'BN', label: 'বাংলা' }
          ].map(lang => (
            <button
              key={lang.id}
              onClick={() => setActiveLang(lang.id as any)}
              style={{
                background: activeLang === lang.id ? '#C8F53E' : 'transparent',
                color: activeLang === lang.id ? '#060A04' : 'rgba(255,255,255,0.6)',
                border: 'none',
                borderRadius: '99px',
                padding: '0.25rem 0.6rem',
                fontSize: '0.65rem',
                fontFamily: 'monospace',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              {lang.label}
            </button>
          ))}
        </div>

        <Link href="/login" style={{ fontFamily: 'monospace', fontSize: '0.72rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', transition: 'color 0.2s', padding: '0.4rem 0.6rem' }} onMouseEnter={e => (e.currentTarget.style.color = '#C8F53E')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}>
          LOGIN
        </Link>

        {/* Secondary CTA: WhatsApp */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: '#25D366',
            color: 'white',
            fontWeight: 800,
            fontFamily: 'monospace',
            fontSize: '0.68rem',
            letterSpacing: '0.08em',
            padding: '0.55rem 1rem',
            borderRadius: '8px',
            textDecoration: 'none',
            transition: 'transform 0.2s, opacity 0.2s',
            boxShadow: '0 0 16px rgba(37,211,102,0.25)'
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.03)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <span>💬</span>
          <span>WHATSAPP BOT</span>
        </a>

        {/* Primary CTA: Try the Demo */}
        <Link
          href="/#ai-demo"
          style={S.liveBtn}
          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
          TRY THE DEMO →
        </Link>
      </div>

      {/* Mobile Hamburger */}
      <button 
        className="mobile-menu-btn" 
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={menuOpen ? "#C8F53E" : "#fff"} strokeWidth="2" strokeLinecap="round">
          {menuOpen ? (
            <path d="M18 6L6 18M6 6l12 12" />
          ) : (
            <path d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>
    </nav>

    {/* Mobile Menu Overlay */}
    <div className={`mobile-overlay ${menuOpen ? 'open' : ''}`}>
      {/* Mobile Language Selector */}
      <div style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '99px', padding: '4px', marginBottom: '0.5rem' }}>
        {[
          { id: 'EN', label: 'English' },
          { id: 'HI', label: 'हिंदी' },
          { id: 'BN', label: 'বাংলা' }
        ].map(lang => (
          <button
            key={lang.id}
            onClick={() => setActiveLang(lang.id as any)}
            style={{
              background: activeLang === lang.id ? '#C8F53E' : 'transparent',
              color: activeLang === lang.id ? '#060A04' : 'rgba(255,255,255,0.7)',
              border: 'none',
              borderRadius: '99px',
              padding: '0.4rem 1rem',
              fontSize: '0.75rem',
              fontFamily: 'monospace',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            {lang.label}
          </button>
        ))}
      </div>

      {links.map(l => (
        <Link key={`mobile-${l.href}`} href={l.href} onClick={closeMenu} style={{
          fontFamily: 'monospace', fontSize: '1.1rem', letterSpacing: '0.18em',
          textTransform: 'uppercase', textDecoration: 'none',
          color: pathname === l.href ? '#C8F53E' : 'rgba(255,255,255,0.8)',
          fontWeight: pathname === l.href ? 700 : 400,
        }}>
          {l.label}
        </Link>
      ))}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', marginTop: '1rem', width: '100%', maxWidth: '280px' }}>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={closeMenu}
          style={{
            width: '100%',
            textAlign: 'center',
            background: '#25D366',
            color: 'white',
            fontWeight: 800,
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            padding: '0.8rem',
            borderRadius: '8px',
            textDecoration: 'none'
          }}
        >
          💬 CONNECT VIA WHATSAPP
        </a>
        <Link href="/#ai-demo" onClick={closeMenu} style={{ ...S.liveBtn, width: '100%', textAlign: 'center', padding: '0.8rem' }}>
          TRY THE DEMO →
        </Link>
        <Link href="/login" onClick={closeMenu} style={{ fontFamily: 'monospace', fontSize: '0.85rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', marginTop: '0.4rem' }}>
          LOGIN
        </Link>
      </div>
    </div>
    </>
  );
}
