'use client';

import { useState, useEffect } from 'react';

interface HeroProps { onBook: () => void; }

export default function Hero({ onBook }: HeroProps) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 80); return () => clearTimeout(t); }, []);

  return (
    <section id="home" style={{ position: 'relative', minHeight: '92vh', display: 'flex', alignItems: 'center', overflow: 'hidden', background: 'var(--cream)' }}>

      {/* Background image */}
      <img
        src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1400&q=80"
        alt="Medical care"
        style={{ position: 'absolute', right: 0, top: 0, width: '55%', height: '100%', objectFit: 'cover', opacity: 0.9 }}
      />

      {/* Left gradient fade */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, var(--cream) 42%, rgba(250,248,244,0.6) 65%, transparent 85%)' }} />

      {/* Bottom fade */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%', background: 'linear-gradient(to top, var(--cream), transparent)' }} />

      {/* Decorative cross watermark */}
      <div style={{ position: 'absolute', top: '8%', left: '3%', color: 'var(--border)', fontSize: 200, opacity: 0.4, fontWeight: 100, lineHeight: 1, userSelect: 'none' }}>✚</div>

      {/* Dot grid */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, var(--border) 1px, transparent 0)', backgroundSize: '32px 32px', opacity: 0.5, pointerEvents: 'none' }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2, padding: '80px 40px', maxWidth: 660 }}>

        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'var(--mint)', border: '1px solid rgba(26,127,110,0.2)',
          padding: '7px 16px', borderRadius: 40, marginBottom: 28,
          opacity: loaded ? 1 : 0, animation: loaded ? 'fadeUp 0.5s ease both' : 'none',
        }}>
          <span style={{ width: 8, height: 8, background: 'var(--teal)', borderRadius: '50%', display: 'block' }} />
          <span style={{ color: 'var(--teal)', fontSize: 12, fontWeight: 600, letterSpacing: 1 }}>Open Now · Closes 5 PM</span>
        </div>

        <h1 className="serif" style={{
          fontSize: 'clamp(38px,5.5vw,68px)', color: 'var(--navy)', lineHeight: 1.1,
          marginBottom: 8,
          opacity: loaded ? 1 : 0, animation: loaded ? 'fadeUp 0.6s 0.1s ease both' : 'none',
        }}>
          Jesus The Healer
        </h1>
        <h2 className="serif" style={{
          fontSize: 'clamp(22px,3.5vw,40px)', color: 'var(--sky)', lineHeight: 1.2,
          fontStyle: 'italic', marginBottom: 28,
          opacity: loaded ? 1 : 0, animation: loaded ? 'fadeUp 0.6s 0.2s ease both' : 'none',
        }}>
          Orthopaedic Home
        </h2>

        <div style={{
          width: 60, height: 3, background: 'var(--gold)', borderRadius: 2, marginBottom: 28,
          opacity: loaded ? 1 : 0, animation: loaded ? 'fadeUp 0.6s 0.28s ease both' : 'none',
        }} />

        <p style={{
          fontSize: 17, lineHeight: 1.8, color: 'var(--gray)', maxWidth: 500, marginBottom: 40,
          opacity: loaded ? 1 : 0, animation: loaded ? 'fadeUp 0.6s 0.35s ease both' : 'none',
        }}>
          Specialist orthopaedic and medical care rooted in compassion and faith. We treat bones, joints, and mobility conditions — restoring your quality of life in Ojodu, Lagos.
        </p>

        {/* CTAs */}
        <div style={{
          display: 'flex', gap: 16, flexWrap: 'wrap',
          opacity: loaded ? 1 : 0, animation: loaded ? 'fadeUp 0.6s 0.45s ease both' : 'none',
        }}>
          <button className="btn-primary" onClick={onBook}>Book Appointment</button>
          <a href="#services"><button className="btn-outline">Our Services</button></a>
        </div>

        {/* Quick stats */}
        <div style={{
          display: 'flex', gap: 32, marginTop: 52, flexWrap: 'wrap',
          opacity: loaded ? 1 : 0, animation: loaded ? 'fadeUp 0.6s 0.55s ease both' : 'none',
        }}>
          {[
            { val: 'Specialist', sub: 'Orthopaedic Care' },
            { val: '5 PM',       sub: 'Open Until' },
            { val: 'Ojodu',      sub: 'Lagos' },
          ].map((s, i) => (
            <div key={i} style={{ borderLeft: i > 0 ? '1px solid var(--border)' : 'none', paddingLeft: i > 0 ? 32 : 0 }}>
              <div className="baskerville" style={{ fontSize: 22, color: 'var(--navy)', fontWeight: 700, lineHeight: 1 }}>{s.val}</div>
              <div style={{ color: 'var(--gray)', fontSize: 12, letterSpacing: 1, marginTop: 4 }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating card */}
      <div style={{
        position: 'absolute', bottom: 48, right: '5%', zIndex: 3,
        background: 'var(--white)', border: '1px solid var(--border)',
        borderRadius: 12, padding: '20px 24px',
        boxShadow: '0 20px 48px rgba(10,22,40,0.12)',
        animation: 'float 4s ease-in-out infinite',
        maxWidth: 220,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <div style={{ width: 36, height: 36, background: 'var(--mint)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🦴</div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--navy)' }}>Orthopaedic</div>
            <div style={{ color: 'var(--teal)', fontSize: 11 }}>Specialist Care</div>
          </div>
        </div>
        <p style={{ color: 'var(--gray)', fontSize: 12, lineHeight: 1.5 }}>Bones · Joints · Mobility · Rehabilitation</p>
      </div>

      <style>{`
        @keyframes fadeUp  { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @media(max-width:768px) {
          section#home img { width:100%!important; opacity:0.15!important; }
          section#home > div:nth-child(2) { background: linear-gradient(90deg, var(--cream) 0%, var(--cream) 100%) !important; }
          section#home > div:last-child { display:none!important; }
          section#home > div[style*="zIndex: 2"] { padding: 60px 20px !important; }
        }
      `}</style>
    </section>
  );
}
