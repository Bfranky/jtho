'use client';

import { useState } from 'react';

const navLinks = ['Services', 'About', 'Why Us', 'Contact'];
const services = ['Orthopaedic Treatment','Joint Care','Fracture Management','Physiotherapy','Spine Care','Rehabilitation'];

export default function Footer() {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  return (
    <footer style={{ background: 'var(--navy)', borderTop: '1px solid rgba(255,255,255,0.08)' }}>

      {/* CTA banner */}
      <div style={{ background: 'var(--sky)', padding: '48px 40px', textAlign: 'center' }}>
        <h3 className="serif" style={{ color: 'var(--white)', fontSize: 'clamp(26px,4vw,40px)', marginBottom: 12 }}>
          Ready to Begin Your Healing Journey?
        </h3>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 15, marginBottom: 28 }}>
          Call us or book an appointment online. We are here to help.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="tel:08023758036">
            <button style={{ background: 'var(--white)', color: 'var(--sky)', border: 'none', padding: '13px 32px', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: 14, cursor: 'pointer', borderRadius: 4, transition: 'all 0.2s' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--cream)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--white)'; }}>
              📞 Call 0802 375 8036
            </button>
          </a>
          <a href="#contact">
            <button style={{ background: 'transparent', color: 'var(--white)', border: '2px solid rgba(255,255,255,0.5)', padding: '11px 32px', fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: 14, cursor: 'pointer', borderRadius: 4, transition: 'all 0.2s' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'white'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.5)'; }}>
              Book Appointment
            </button>
          </a>
        </div>
      </div>

      {/* Footer body */}
      <div style={{ padding: '60px 40px 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 48 }}>

            {/* Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{ width: 42, height: 42, background: 'var(--sky)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 20 }}>✚</div>
                <div>
                  <div style={{ fontFamily: 'DM Serif Display, serif', color: 'var(--white)', fontSize: 17, lineHeight: 1.1 }}>Jesus The Healer</div>
                  <div style={{ color: 'var(--gold)', fontSize: 9, letterSpacing: 3, textTransform: 'uppercase' }}>Orthopaedic Home</div>
                </div>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, lineHeight: 1.8, maxWidth: 280 }}>
                Compassionate, faith-centred orthopaedic and medical care at 5 Adebowale Street, Ojodu, Lagos.
              </p>
              <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                {[{ l: 'FB', h: '#' }, { l: 'WA', h: 'https://wa.me/2348023758036' }].map((s, i) => (
                  <a key={i} href={s.h} target="_blank" rel="noopener noreferrer"
                    style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)', fontSize: 11, fontFamily: 'DM Sans, sans-serif', fontWeight: 700, textDecoration: 'none', transition: 'all 0.2s' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--sky)'; (e.currentTarget as HTMLElement).style.color = '#fff'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--sky)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)'; }}
                  >{s.l}</a>
                ))}
              </div>
            </div>

            {/* Nav */}
            <div>
              <h4 style={{ color: 'var(--gold)', fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 20, fontWeight: 700 }}>Navigate</h4>
              {navLinks.map((l) => (
                <a key={l} href={`#${l.toLowerCase().replace(/\s+/g,'-')}`}
                  onMouseEnter={() => setHoveredLink(l)} onMouseLeave={() => setHoveredLink(null)}
                  style={{ display: 'block', color: hoveredLink === l ? 'var(--white)' : 'rgba(255,255,255,0.45)', fontSize: 14, textDecoration: 'none', marginBottom: 10, transition: 'color 0.2s' }}
                >{l}</a>
              ))}
            </div>

            {/* Services */}
            <div>
              <h4 style={{ color: 'var(--gold)', fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 20, fontWeight: 700 }}>Services</h4>
              {services.map((s) => (
                <div key={s} style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, marginBottom: 9 }}>{s}</div>
              ))}
            </div>

            {/* Contact */}
            <div>
              <h4 style={{ color: 'var(--gold)', fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 20, fontWeight: 700 }}>Contact</h4>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, lineHeight: 2 }}>
                <a href="tel:08023758036" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>0802 375 8036</a><br />
                5 Adebowale Street<br />
                Ojodu, Lagos 101233<br />
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>Mon–Sat · Closes 5 PM</span>
              </p>
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 13 }}>© 2025 Jesus The Healer Orthopaedic Home · All rights reserved</p>
            <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 13 }}>Ojodu, Lagos, Nigeria 🇳🇬</p>
          </div>
        </div>
      </div>

      <style>{`
        @media(max-width:900px) { footer div[style*="grid-template-columns: 2fr"] { grid-template-columns:1fr 1fr!important; } }
        @media(max-width:600px) { footer div[style*="grid-template-columns: 2fr"] { grid-template-columns:1fr!important; } footer { padding: 0; } }
      `}</style>
    </footer>
  );
}
