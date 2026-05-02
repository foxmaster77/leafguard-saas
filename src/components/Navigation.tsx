'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const S = {
  nav: (scrolled: boolean): React.CSSProperties => ({
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '1rem 3rem',
    background: scrolled ? 'rgba(6,10,4,0.97)' : 'rgba(6,10,4,0.85)',
    backdropFilter: 'blur(20px)',
    borderBottom: scrolled ? '1px solid rgba(200,245,62,0.1)' : '1px solid transparent',
    transition: 'all 0.3s ease',
  }),
  logo: { display:'flex', alignItems:'center', gap:'0.5rem', cursor:'pointer', textDecoration:'none' } as React.CSSProperties,
  logoText: { fontFamily:"'Bebas Neue',sans-serif", fontSize:'1.35rem', fontWeight:700, color:'#C8F53E', letterSpacing:'0.08em', fontStyle:'italic' } as React.CSSProperties,
  centerLinks: { display:'flex', alignItems:'center', gap:'2.5rem' } as React.CSSProperties,
  rightActions: { display:'flex', alignItems:'center', gap:'1.5rem' } as React.CSSProperties,
  liveBtn: { background:'#C8F53E', color:'#060A04', fontWeight:900, fontFamily:'monospace', fontSize:'0.72rem', letterSpacing:'0.15em', padding:'0.6rem 1.4rem', border:'none', cursor:'pointer', transition:'transform 0.2s ease', textDecoration:'none', display:'inline-block' } as React.CSSProperties,
};

const links = [
  { href:'/', label:'HOME' }, { href:'/product', label:'PRODUCT' },
  { href:'/dashboard', label:'DASHBOARD' }, { href:'/pricing', label:'PRICING' },
  { href:'/contact', label:'CONTACT' }, { href:'/analyze', label:'ANALYZE' },
];

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav style={S.nav(scrolled)}>
      {/* Left: Brand */}
      <div style={S.logo} onClick={() => router.push('/')}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M12 2C8 2 4 5 4 9c0 5 8 13 8 13s8-8 8-13c0-4-3-7-8-7z" fill="#C8F53E" opacity="0.9"/>
          <path d="M12 2v20M8 6s2 2 4 6M16 6s-2 2-4 6" stroke="#060A04" strokeWidth="1" strokeLinecap="round"/>
        </svg>
        <span style={S.logoText}>AGROGUARD AI</span>
      </div>

      {/* Center: Links */}
      <div style={S.centerLinks}>
        {links.map(l => (
          <Link key={l.href} href={l.href} style={{
            fontFamily:'monospace', fontSize:'0.72rem', letterSpacing:'0.18em',
            textTransform:'uppercase' as const, textDecoration:'none',
            color: pathname === l.href || hovered === l.href ? '#C8F53E' : 'rgba(255,255,255,0.45)',
            transition:'color 0.2s', fontWeight: pathname === l.href ? 700 : 400,
          }} onMouseEnter={() => setHovered(l.href)} onMouseLeave={() => setHovered('')}>
            {l.label}
          </Link>
        ))}
      </div>

      {/* Right: Actions */}
      <div style={S.rightActions}>
        <Link href="/login" style={{ fontFamily:'monospace', fontSize:'0.72rem', letterSpacing:'0.15em', color:'rgba(255,255,255,0.4)', textDecoration:'none', transition:'color 0.2s' }}>LOGIN</Link>
        <Link href="/dashboard" style={S.liveBtn} onMouseEnter={e => (e.currentTarget.style.transform='scale(1.04)')} onMouseLeave={e => (e.currentTarget.style.transform='scale(1)')}>LIVE DEMO</Link>
      </div>
    </nav>
  );
}
