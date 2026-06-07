'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const NAV = [
  { label: 'Home',           href: '/' },
  { label: 'Services',       href: '/services' },
  { label: 'Blog',           href: '/blog' },
  { label: 'Appointments',   href: '/appointments' },
  { label: 'Patient Portal', href: '/portal' },
  { label: 'Contact',        href: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open,     setOpen]     = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <>
      {/* Top info bar */}
      <div style={{ background: 'var(--navy)', padding: '7px 40px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', gap: 24 }}>
          <a href="tel:08023758036" style={{ color: 'rgba(255,255,255,.65)', fontSize: 12, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }}>📞 0802 375 8036</a>
          <span style={{ color: 'rgba(255,255,255,.65)', fontSize: 12 }}>📍 5 Adebowale St, Ojodu, Lagos</span>
        </div>
        <span style={{ color: 'rgba(255,255,255,.5)', fontSize: 12 }}>Operates 24hrs · Always Open (24/7)</span>
      </div>

      {/* Main nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 1000, background: scrolled ? 'rgba(255,255,255,.97)' : '#fff', borderBottom: '1px solid var(--border)', boxShadow: scrolled ? '0 4px 20px rgba(10,22,40,.08)' : 'none', backdropFilter: scrolled ? 'blur(12px)' : 'none', transition: 'all .3s ease' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 38, height: 38, background: 'var(--sky)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 18, fontWeight: 700, flexShrink: 0 }}>✚</div>
            <div>
              <div style={{ fontFamily: 'DM Serif Display,serif', color: 'var(--navy)', fontSize: 15, lineHeight: 1.1 }}>Jesus The Healer</div>
              <div style={{ color: 'var(--sky)', fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 600 }}>Orthopaedic Home</div>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hide-mobile" style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            {NAV.map((n) => (
              <Link key={n.href} href={n.href}
                style={{ padding: '6px 12px', color: 'var(--navy)', textDecoration: 'none', fontSize: 13, fontWeight: 500, borderRadius: 6, transition: 'all .2s' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--sky)'; (e.currentTarget as HTMLElement).style.background = 'var(--light)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--navy)'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >{n.label}</Link>
            ))}
          </div>

          {/* Right buttons */}
          <div className="hide-mobile" style={{ display: 'flex', gap: 10 }}>
            <Link href="/appointments" className="btn btn-primary btn-sm">Book Appointment</Link>
          </div>

          {/* Hamburger */}
          <button onClick={() => setOpen(!open)} className="hamburger" style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', flexDirection: 'column', gap: 5, padding: 4 }}>
            {[0,1,2].map(i => <span key={i} style={{ display: 'block', width: 24, height: 2, background: 'var(--navy)' }} />)}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div style={{ position: 'fixed', top: 113, left: 0, right: 0, background: '#fff', borderBottom: '2px solid var(--sky)', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 4, zIndex: 999, boxShadow: '0 8px 24px rgba(10,22,40,.1)' }}>
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} onClick={() => setOpen(false)} style={{ padding: '10px 12px', color: 'var(--navy)', textDecoration: 'none', fontSize: 15, fontWeight: 500, borderRadius: 6 }}>{n.label}</Link>
          ))}
          <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
            <Link href="/appointments" className="btn btn-primary btn-sm" onClick={() => setOpen(false)}>Book Appointment</Link>
          </div>
        </div>
      )}

      <style>{`@media(max-width:900px){.hide-mobile{display:none!important}.hamburger{display:flex!important}}`}</style>
    </>
  );
}
