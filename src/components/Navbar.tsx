'use client';

import { useState, useEffect } from 'react';

interface NavbarProps { onBook: () => void; }

const links = ['Services', 'About', 'Why Us', 'Contact'];

export default function Navbar({ onBook }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <>
      {/* Top bar */}
      <div style={{ background: 'var(--navy)', padding: '8px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <a href="tel:08023758036" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>📞</span> 0802 375 8036
          </a>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>📍</span> 5 Adebowale St, Ojodu, Lagos
          </span>
        </div>
        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>Mon – Sat · Open till 5 PM</span>
      </div>

      {/* Main nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 1000,
        height: '72px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 40px',
        background: scrolled ? 'rgba(255,255,255,0.97)' : 'var(--white)',
        borderBottom: '1px solid var(--border)',
        boxShadow: scrolled ? '0 4px 24px rgba(10,22,40,0.08)' : 'none',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        transition: 'all 0.3s ease',
      }}>
        {/* Logo */}
        <a href="#home" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ position: 'relative', width: 40, height: 40, background: 'var(--sky)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'white', fontSize: 20, fontWeight: 700, lineHeight: 1 }}>✚</span>
          </div>
          <div>
            <div style={{ fontFamily: 'DM Serif Display, serif', color: 'var(--navy)', fontSize: 16, lineHeight: 1.1 }}>Jesus The Healer</div>
            <div style={{ color: 'var(--sky)', fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 600 }}>Orthopaedic Home</div>
          </div>
        </a>

        {/* Desktop links */}
        <div className="nav-desktop" style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          {links.map((l) => (
            <a key={l} href={`#${l.toLowerCase().replace(/\s+/g, '-')}`}
              style={{ color: 'var(--navy)', textDecoration: 'none', fontSize: 14, fontWeight: 500, transition: 'color 0.2s' }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = 'var(--sky)')}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = 'var(--navy)')}
            >{l}</a>
          ))}
          <button className="btn-primary" onClick={onBook} style={{ padding: '10px 22px', fontSize: 13 }}>Book Appointment</button>
        </div>

        {/* Hamburger */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="hamburger"
          style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', flexDirection: 'column', gap: 5, padding: 4 }}>
          {[0,1,2].map((i) => (
            <span key={i} style={{ display: 'block', width: 24, height: 2, background: 'var(--navy)', transition: 'all 0.3s' }} />
          ))}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ position: 'fixed', top: 113, left: 0, right: 0, background: 'var(--white)', borderBottom: '2px solid var(--sky)', padding: '24px 40px', display: 'flex', flexDirection: 'column', gap: 20, zIndex: 999, boxShadow: '0 8px 24px rgba(10,22,40,0.1)' }}>
          {links.map((l) => (
            <a key={l} href={`#${l.toLowerCase().replace(/\s+/g, '-')}`} onClick={() => setMenuOpen(false)}
              style={{ color: 'var(--navy)', textDecoration: 'none', fontFamily: 'DM Serif Display, serif', fontSize: 24 }}>
              {l}
            </a>
          ))}
          <button className="btn-primary" onClick={() => { setMenuOpen(false); onBook(); }} style={{ width: 'fit-content' }}>Book Appointment</button>
        </div>
      )}

      <style>{`
        @media(max-width:768px) { .nav-desktop{display:none!important} .hamburger{display:flex!important} }
        @media(max-width:600px) { nav { padding: 0 20px !important; } }
      `}</style>
    </>
  );
}
