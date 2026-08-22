'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { User, LogOut, LayoutDashboard, History, ChevronDown, MessageSquare, Globe } from 'lucide-react';

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
  centerLinks: { display: 'flex', alignItems: 'center', gap: '2.2rem' } as React.CSSProperties,
  rightActions: { display: 'flex', alignItems: 'center', gap: '0.9rem' } as React.CSSProperties,
  liveBtn: { background: '#C8F53E', color: '#060A04', fontWeight: 900, fontFamily: 'DM Mono, monospace', fontSize: '0.72rem', letterSpacing: '0.12em', padding: '0.55rem 1.2rem', border: 'none', cursor: 'pointer', transition: 'transform 0.2s ease', textDecoration: 'none', display: 'inline-block', borderRadius: '4px' } as React.CSSProperties,
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
  const { user, profile, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<'EN' | 'BN' | 'HI'>('BN');
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // Click outside to close profile dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const getInitials = (name: string) => {
    if (!name) return 'OP';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <>
      <style>{`
        .nav-container { padding: 1rem 3rem; }
        .mobile-menu-btn {
          display: none; background: none; border: none; cursor: pointer;
          z-index: 1001; padding: 0.5rem; margin: -0.5rem;
          min-width: 44px; min-height: 44px;
          align-items: center; justify-content: center;
        }
        .mobile-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(6, 10, 4, 0.99);
          backdrop-filter: blur(10px);
          z-index: 999;
          display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 1.5rem;
          transform: translateX(100%);
          transition: transform 0.3s ease-in-out;
          overflow-y: auto;
          padding: 4rem 2rem;
        }
        .mobile-overlay.open { transform: translateX(0); }
        .mobile-nav-link {
          font-family: 'DM Mono', monospace;
          font-size: 1.35rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          text-decoration: none;
          padding: 0.4rem 1rem;
          min-height: 44px;
          display: flex;
          align-items: center;
        }
        @media (max-width: 900px) {
          .nav-container { padding: 0.75rem 1.25rem; }
          .hide-on-mobile { display: none !important; }
          .mobile-menu-btn { display: flex; }
        }
        @media (max-width: 380px) {
          .nav-container { padding: 0.75rem 1rem; }
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
            fontFamily: 'DM Mono, monospace', fontSize: '0.72rem', letterSpacing: '0.15em',
            textTransform: 'uppercase' as const, textDecoration: 'none',
            color: pathname === l.href || hovered === l.href ? '#C8F53E' : 'rgba(255,255,255,0.5)',
            transition: 'color 0.2s', fontWeight: pathname === l.href ? 800 : 500,
          }} onMouseEnter={() => setHovered(l.href)} onMouseLeave={() => setHovered('')}>
            {l.label}
          </Link>
        ))}
      </div>

      {/* Right: Actions / Auth User Profile */}
      <div className="hide-on-mobile" style={S.rightActions}>
        {/* Bhashini Regional Language Switcher Pill */}
        <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,245,62,0.2)', borderRadius: '99px', padding: '2px', gap: '2px' }}>
          {[
            { id: 'EN', label: 'EN' },
            { id: 'BN', label: 'বাং' },
            { id: 'HI', label: 'हिं' }
          ].map(lang => (
            <button
              key={lang.id}
              onClick={() => setCurrentLang(lang.id as any)}
              style={{
                background: currentLang === lang.id ? '#C8F53E' : 'transparent',
                color: currentLang === lang.id ? '#060A04' : 'rgba(255,255,255,0.6)',
                border: 'none',
                borderRadius: '99px',
                padding: '0.25rem 0.6rem',
                fontSize: '0.65rem',
                fontFamily: 'DM Mono, monospace',
                fontWeight: currentLang === lang.id ? 900 : 600,
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
              title={`Bhashini AI Language Uplink: ${lang.id}`}
            >
              {lang.label}
            </button>
          ))}
        </div>

        {user ? (
          <div ref={dropdownRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(200,245,62,0.08)',
                border: '1px solid rgba(200,245,62,0.25)',
                borderRadius: '99px',
                padding: '0.35rem 0.8rem 0.35rem 0.45rem',
                cursor: 'pointer',
                color: 'white',
                fontFamily: 'DM Mono, monospace',
                fontSize: '0.75rem',
                fontWeight: 700,
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8F53E'; e.currentTarget.style.background = 'rgba(200,245,62,0.14)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(200,245,62,0.25)'; e.currentTarget.style.background = 'rgba(200,245,62,0.08)'; }}
            >
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: '#C8F53E',
                color: '#060A04',
                fontWeight: 900,
                fontSize: '0.68rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {getInitials(profile.name)}
              </div>
              <span style={{ maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {profile.name.split(' ')[0]}
              </span>
              <ChevronDown size={14} style={{ color: '#C8F53E', transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>

            {/* User Profile Dropdown Menu */}
            {dropdownOpen && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '220px',
                background: '#0A0E07',
                border: '1px solid rgba(200,245,62,0.25)',
                borderRadius: '10px',
                padding: '0.8rem',
                boxShadow: '0 20px 40px rgba(0,0,0,0.8), 0 0 20px rgba(200,245,62,0.1)',
                zIndex: 1002
              }}>
                <div style={{ paddingBottom: '0.6rem', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '0.6rem' }}>
                  <p style={{ margin: 0, color: 'white', fontWeight: 800, fontSize: '0.85rem' }}>{profile.name}</p>
                  <p style={{ margin: '2px 0 0', color: 'rgba(255,255,255,0.45)', fontSize: '0.68rem', fontFamily: 'DM Mono, monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{profile.email}</p>
                  <span style={{ display: 'inline-block', marginTop: '4px', background: 'rgba(200,245,62,0.12)', color: '#C8F53E', fontSize: '0.6rem', padding: '1px 6px', borderRadius: '4px', fontFamily: 'DM Mono, monospace', fontWeight: 700 }}>
                    🌾 {profile.landSize}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <Link
                    href="/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '0.5rem 0.6rem',
                      color: 'rgba(255,255,255,0.8)',
                      textDecoration: 'none',
                      fontSize: '0.75rem',
                      fontFamily: 'DM Mono, monospace',
                      borderRadius: '6px',
                      transition: 'background 0.15s'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(200,245,62,0.1)'; e.currentTarget.style.color = '#C8F53E'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }}
                  >
                    <LayoutDashboard size={14} />
                    <span>Farmer Dashboard</span>
                  </Link>

                  <Link
                    href="/dashboard#recent-scans-tracker"
                    onClick={() => setDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '0.5rem 0.6rem',
                      color: 'rgba(255,255,255,0.8)',
                      textDecoration: 'none',
                      fontSize: '0.75rem',
                      fontFamily: 'DM Mono, monospace',
                      borderRadius: '6px',
                      transition: 'background 0.15s'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(200,245,62,0.1)'; e.currentTarget.style.color = '#C8F53E'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }}
                  >
                    <History size={14} />
                    <span>Scan History &amp; Todos</span>
                  </Link>

                  <button
                    onClick={() => { logout(); setDropdownOpen(false); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '0.5rem 0.6rem',
                      color: '#FF4F4F',
                      background: 'none',
                      border: 'none',
                      width: '100%',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      fontFamily: 'DM Mono, monospace',
                      borderRadius: '6px',
                      marginTop: '4px',
                      borderTop: '1px solid rgba(255,255,255,0.06)'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,79,79,0.1)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link href="/login" style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.72rem', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#C8F53E'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>
              LOGIN
            </Link>
            <Link href="/dashboard" style={S.liveBtn} onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')} onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}>
              DASHBOARD
            </Link>
          </>
        )}
      </div>

      {/* Mobile Hamburger */}
      <button
        className="mobile-menu-btn"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
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
    <div className={`mobile-overlay ${menuOpen ? 'open' : ''}`} aria-hidden={!menuOpen}>
      {/* Mobile User Profile Card */}
      {user && (
        <div style={{
          background: 'rgba(200,245,62,0.06)',
          border: '1px solid rgba(200,245,62,0.25)',
          borderRadius: '12px',
          padding: '1rem',
          width: '100%',
          maxWidth: '280px',
          textAlign: 'center',
          marginBottom: '0.5rem'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: '#C8F53E',
            color: '#060A04',
            fontWeight: 900,
            fontSize: '1rem',
            margin: '0 auto 0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {getInitials(profile.name)}
          </div>
          <p style={{ margin: 0, fontWeight: 800, color: 'white', fontSize: '1rem' }}>{profile.name}</p>
          <p style={{ margin: '2px 0 0', color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem', fontFamily: 'DM Mono, monospace' }}>{profile.region}</p>
        </div>
      )}

      {links.map(l => (
        <Link key={`mobile-${l.href}`} href={l.href} onClick={closeMenu} className="mobile-nav-link" style={{
          color: pathname === l.href ? '#C8F53E' : 'rgba(255,255,255,0.85)',
          fontWeight: pathname === l.href ? 800 : 400,
        }}>
          {l.label}
        </Link>
      ))}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', alignItems: 'center', marginTop: '0.5rem', width: '100%', maxWidth: '280px' }}>
        {user ? (
          <button
            onClick={() => { logout(); closeMenu(); }}
            style={{
              width: '100%',
              background: 'rgba(255,79,79,0.15)',
              border: '1px solid #FF4F4F',
              color: '#FF4F4F',
              fontFamily: 'DM Mono, monospace',
              fontSize: '0.85rem',
              fontWeight: 800,
              padding: '0.75rem',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            SIGN OUT ({profile.name.split(' ')[0]})
          </button>
        ) : (
          <>
            <Link href="/login" onClick={closeMenu} style={{ fontFamily: 'DM Mono, monospace', fontSize: '1rem', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', minHeight: '44px', display: 'flex', alignItems: 'center' }}>
              LOGIN
            </Link>
            <Link href="/dashboard" onClick={closeMenu} style={{ ...S.liveBtn, width: '100%', textAlign: 'center', padding: '0.8rem', fontSize: '0.85rem' }}>
              DASHBOARD
            </Link>
          </>
        )}
      </div>
    </div>
    </>
  );
}

