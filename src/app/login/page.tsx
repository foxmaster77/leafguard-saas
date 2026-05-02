'use client';
import React, { useState, useEffect, useMemo, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Navigation from '@/components/Navigation';

const css = `
@keyframes floatUp {
  0%{transform:translateY(100vh);opacity:0}
  10%{opacity:0.5} 90%{opacity:0.5}
  100%{transform:translateY(-100px);opacity:0}
}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
.login-input:focus{border-color:#C8F53E!important;outline:none}
`;

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<'signin'|'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const appUrl = useMemo(() => typeof window !== 'undefined' ? window.location.origin : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000', []);

  const inp: React.CSSProperties = { width:'100%', background:'#080C05', border:'1px solid rgba(200,245,62,0.15)', color:'white', padding:'0.75rem 1rem', fontSize:'0.85rem', fontFamily:'monospace', boxSizing:'border-box' as const, marginBottom:'0.8rem' };
  const lbl: React.CSSProperties = { fontFamily:'monospace', fontSize:'0.6rem', color:'#C8F53E', letterSpacing:'0.15em', textTransform:'uppercase' as const, display:'block', marginBottom:'0.3rem' };

  const handleMagicLink = async (e: FormEvent) => {
    e.preventDefault(); setLoading(true); setError(''); setMessage('');
    try {
      const { error: err } = await supabase.auth.signInWithOtp({ email, options:{ emailRedirectTo:`${appUrl}/dashboard` } });
      if (err) throw err;
      setMessage('Magic link sent! Check your email.');
    } catch(err:any) { setError(err?.message||'Unable to send link.'); }
    finally { setLoading(false); }
  };

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) throw err;
      router.push('/dashboard');
    } catch(err:any) { setError(err?.message||'Invalid credentials.'); }
    finally { setLoading(false); }
  };

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      const { error: err } = await supabase.auth.signUp({ email, password, options:{ data:{full_name:name}, emailRedirectTo:`${appUrl}/dashboard` } });
      if (err) throw err;
      setMessage('Account created! Check your email.');
    } catch(err:any) { setError(err?.message||'Unable to create account.'); }
    finally { setLoading(false); }
  };

  const particles = Array.from({length:20},(_,i)=>i);

  return (
    <>
      <style dangerouslySetInnerHTML={{__html:css}}/>
      <Navigation/>
      <main style={{ minHeight:'100vh', background:'#060A04', display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem', position:'relative', overflow:'hidden' }}>
        <video autoPlay muted loop playsInline style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', opacity:0.1, zIndex:0 }} src="/238827.mp4"/>
        <div style={{ position:'absolute', inset:0, background:'rgba(6,10,4,0.92)', zIndex:1 }}/>

        {/* Particles */}
        {particles.map(i => (
          <div key={i} style={{
            position:'absolute', width:'3px', height:'3px', borderRadius:'50%', background:'#C8F53E',
            left:`${(i*7+3)%100}%`, animation:`floatUp ${8+(i%8)*1.5}s ${i*0.4}s linear infinite`, zIndex:1, opacity:0,
          }}/>
        ))}

        {/* Card */}
        <div style={{ position:'relative', zIndex:2, background:'#0F1409', border:`1px solid ${error?'rgba(255,79,79,0.4)':'rgba(200,245,62,0.2)'}`, padding:'3rem', width:'420px', maxWidth:'100%', boxShadow: error ? '0 0 40px rgba(255,79,79,0.1)' : '0 0 80px rgba(200,245,62,0.05)' }}>
          {/* Header */}
          <div style={{ textAlign:'center', marginBottom:'2rem' }}>
            <div style={{ fontSize:'2rem', marginBottom:'0.5rem' }}>🛡️</div>
            <p style={{ fontFamily:'monospace', fontSize:'0.65rem', color:'#C8F53E', letterSpacing:'0.25em', textTransform:'uppercase', marginBottom:'0.5rem' }}>SECURE ACCESS</p>
            <h1 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'2rem', fontStyle:'italic', fontWeight:900, margin:'0 0 0.5rem' }}>AGROGUARD COMMAND</h1>
            <p style={{ color:'rgba(255,255,255,0.45)', fontSize:'0.82rem', lineHeight:1.6 }}>Use your operator credentials to access the command center.</p>
          </div>

          {/* Tabs */}
          <div style={{ display:'flex', marginBottom:'1.5rem' }}>
            {(['signin','signup'] as const).map(t => (
              <button key={t} onClick={()=>{setTab(t);setError('');setMessage('');}} style={{ flex:1, padding:'0.7rem', border: t===tab ? 'none' : '1px solid rgba(255,255,255,0.1)', background: t===tab ? '#C8F53E' : 'transparent', color: t===tab ? '#060A04' : 'rgba(255,255,255,0.45)', fontWeight: t===tab ? 900 : 400, fontFamily:'monospace', fontSize:'0.7rem', letterSpacing:'0.12em', textTransform:'uppercase', cursor:'pointer', transition:'all 0.2s' }}>
                {t==='signin'?'SIGN IN':'CREATE ACCOUNT'}
              </button>
            ))}
          </div>

          {/* Success State */}
          {message && (
            <div style={{ textAlign:'center', padding:'2rem 0' }}>
              <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>✅</div>
              <p style={{ color:'#C8F53E', fontFamily:'monospace', fontWeight:700, fontSize:'0.9rem', letterSpacing:'0.1em', marginBottom:'0.5rem' }}>MAGIC LINK SENT.</p>
              <p style={{ color:'rgba(255,255,255,0.45)', fontSize:'0.85rem' }}>{message}</p>
            </div>
          )}

          {/* Sign In Form */}
          {!message && tab==='signin' && (
            <form onSubmit={handleSignIn}>
              <label style={lbl}>EMAIL</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="operator@farm.ai" className="login-input" style={inp}/>
              <label style={lbl}>PASSWORD</label>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required placeholder="••••••••" className="login-input" style={inp}/>
              <button type="submit" disabled={loading} style={{ width:'100%', background:'#C8F53E', color:'#060A04', border:'none', padding:'1rem', fontFamily:'monospace', fontWeight:900, fontSize:'0.82rem', letterSpacing:'0.15em', textTransform:'uppercase', cursor:'pointer', marginTop:'0.5rem', opacity:loading?0.7:1 }}>{loading?'SIGNING IN...':'SIGN IN →'}</button>
              <div style={{ display:'flex', alignItems:'center', gap:'1rem', margin:'1rem 0' }}>
                <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.08)' }}/><span style={{ color:'rgba(255,255,255,0.3)', fontSize:'0.75rem' }}>OR</span><div style={{ flex:1, height:1, background:'rgba(255,255,255,0.08)' }}/>
              </div>
              <button type="button" disabled={!email||loading} onClick={handleMagicLink} style={{ width:'100%', background:'transparent', border:'1px solid rgba(200,245,62,0.3)', color:'#C8F53E', padding:'0.8rem', fontFamily:'monospace', fontSize:'0.78rem', letterSpacing:'0.1em', textTransform:'uppercase', cursor:'pointer', opacity:(!email||loading)?0.4:1 }}>SEND MAGIC LINK</button>
            </form>
          )}

          {/* Sign Up Form */}
          {!message && tab==='signup' && (
            <form onSubmit={handleSignUp}>
              <label style={lbl}>FULL NAME</label>
              <input type="text" value={name} onChange={e=>setName(e.target.value)} required placeholder="Jane Doe" className="login-input" style={inp}/>
              <label style={lbl}>EMAIL</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="operator@farm.ai" className="login-input" style={inp}/>
              <label style={lbl}>PASSWORD</label>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required placeholder="Min 8 characters" className="login-input" style={inp}/>
              <button type="submit" disabled={loading} style={{ width:'100%', background:'#C8F53E', color:'#060A04', border:'none', padding:'1rem', fontFamily:'monospace', fontWeight:900, fontSize:'0.82rem', letterSpacing:'0.15em', textTransform:'uppercase', cursor:'pointer', marginTop:'0.5rem', opacity:loading?0.7:1 }}>{loading?'CREATING...':'CREATE ACCOUNT →'}</button>
            </form>
          )}

          {error && <p style={{ color:'#FF4F4F', fontFamily:'monospace', fontSize:'0.75rem', marginTop:'0.8rem', textAlign:'center' }}>{error}</p>}

          <div style={{ display:'flex', justifyContent:'space-between', marginTop:'1.5rem' }}>
            <Link href="/" style={{ color:'rgba(255,255,255,0.35)', fontSize:'0.8rem', textDecoration:'none' }}>← Back to Home</Link>
            <button onClick={()=>router.push('/dashboard')} style={{ background:'none', border:'none', color:'#C8F53E', fontSize:'0.8rem', cursor:'pointer', fontFamily:'monospace' }}>Continue as demo →</button>
          </div>
        </div>
      </main>
    </>
  );
}
