'use client';

import { useState } from 'react';

const reasons = [
  { icon: '🤲', title: 'Compassionate Team',           desc: 'Every patient is treated with kindness, prayer, and genuine concern — never just as a number.' },
  { icon: '🎓', title: 'Specialist Orthopaedic Focus',  desc: 'Deep expertise in bones, joints, and musculoskeletal health where generalised care falls short.' },
  { icon: '📍', title: 'Accessible Location',           desc: 'Centrally located at 5 Adebowale Street, Ojodu — easy to reach from across Lagos.' },
  { icon: '💰', title: 'Affordable Quality Care',       desc: 'Excellent healthcare accessible to everyone. Our pricing reflects our commitment to the community.' },
  { icon: '🔄', title: 'End-to-End Care Journey',       desc: 'From first diagnosis through to full rehabilitation — your entire journey managed under one roof.' },
  { icon: '✝️', title: 'Faith-Rooted Mission',          desc: 'Driven by a higher purpose — to be genuine instruments of healing in every patient\'s life.' },
];

export default function WhyUs() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="why-us" style={{ position: 'relative', overflow: 'hidden', padding: '120px 40px' }}>

      {/* Background image */}
      <img
        src="https://images.unsplash.com/photo-1551190822-a9333d879b1f?auto=format&fit=crop&w=1400&q=80"
        alt="Medical background"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
      />

      {/* Deep overlay — navy tint */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(10,22,40,0.97) 0%, rgba(11,36,94,0.92) 50%, rgba(10,22,40,0.96) 100%)' }} />

      {/* Subtle grid pattern */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />

      {/* Glow orbs */}
      <div style={{ position: 'absolute', top: '-10%', right: '5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(46,107,176,0.18) 0%, transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-10%', left: '5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(26,127,110,0.12) 0%, transparent 65%)', pointerEvents: 'none' }} />

      {/* Large watermark cross */}
      <div style={{ position: 'absolute', right: '-2%', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.025)', fontSize: 520, fontWeight: 100, lineHeight: 1, userSelect: 'none', pointerEvents: 'none' }}>✚</div>

      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 2 }}>

        {/* Top heading row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center', marginBottom: 80 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, color: 'var(--gold)', fontSize: 11, fontWeight: 700, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 16 }}>
              <span style={{ display: 'block', width: 28, height: 2, background: 'var(--gold)' }} />
              Why Choose Us
            </div>
            <h2 className="serif" style={{ fontSize: 'clamp(36px,5vw,60px)', color: '#fff', lineHeight: 1.1, marginBottom: 0 }}>
              The Healer's<br />
              <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Difference</span>
            </h2>
          </div>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 16, lineHeight: 1.9, marginBottom: 28 }}>
              There are many medical centers in Lagos. Here is why our patients keep coming back — and why they confidently send their loved ones to us.
            </p>
            {/* Mini stats row */}
            <div style={{ display: 'flex', gap: 32 }}>
              {[
                { val: '100%', label: 'Patient Dedication' },
                { val: '5★',   label: 'Care Standard' },
                { val: '24h',  label: 'Response Time' },
              ].map((s, i) => (
                <div key={i} style={{ borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.1)' : 'none', paddingLeft: i > 0 ? 32 : 0 }}>
                  <div className="serif" style={{ fontSize: 28, color: 'var(--gold)', lineHeight: 1 }}>{s.val}</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, letterSpacing: 1, marginTop: 5, textTransform: 'uppercase' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reasons grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
          {reasons.map((r, i) => (
            <div key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                padding: '36px 28px',
                border: '1px solid rgba(255,255,255,0.06)',
                background: hovered === i ? 'rgba(46,107,176,0.18)' : 'rgba(255,255,255,0.03)',
                transition: 'all 0.35s ease',
                cursor: 'default',
                borderColor: hovered === i ? 'rgba(46,107,176,0.4)' : 'rgba(255,255,255,0.06)',
              }}>
              <div style={{
                width: 52, height: 52, borderRadius: '12px',
                background: hovered === i ? 'var(--sky)' : 'rgba(255,255,255,0.07)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24, marginBottom: 20,
                transition: 'background 0.3s',
                border: `1px solid ${hovered === i ? 'var(--sky)' : 'rgba(255,255,255,0.1)'}`,
              }}>
                {r.icon}
              </div>
              <h3 className="serif" style={{ color: '#fff', fontSize: 19, marginBottom: 12, lineHeight: 1.2 }}>{r.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, lineHeight: 1.8 }}>{r.desc}</p>
              {hovered === i && (
                <div style={{ marginTop: 20, height: 2, background: 'linear-gradient(90deg, var(--sky), var(--teal))', borderRadius: 1 }} />
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA strip */}
        <div style={{ marginTop: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '32px 40px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, flexWrap: 'wrap', gap: 20 }}>
          <div>
            <h4 className="serif" style={{ color: '#fff', fontSize: 22, marginBottom: 6 }}>Ready to experience the difference?</h4>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14 }}>Join hundreds of patients on their road to recovery.</p>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <a href="#contact">
              <button style={{ background: 'var(--gold)', color: 'var(--navy)', border: 'none', padding: '13px 28px', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: 14, cursor: 'pointer', borderRadius: 4, transition: 'all 0.3s' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.88'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1'; (e.currentTarget as HTMLElement).style.transform = 'none'; }}>
                Book Appointment
              </button>
            </a>
            <a href="tel:08023758036">
              <button style={{ background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.25)', padding: '13px 28px', fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: 14, cursor: 'pointer', borderRadius: 4, transition: 'all 0.3s' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#fff'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.25)'; }}>
                📞 Call Us
              </button>
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @media(max-width:900px) {
          #why-us > div > div:first-child { grid-template-columns:1fr!important; gap:32px!important; }
          #why-us > div > div:nth-child(2) { grid-template-columns:1fr 1fr!important; }
        }
        @media(max-width:600px) {
          #why-us { padding:80px 20px!important; }
          #why-us > div > div:nth-child(2) { grid-template-columns:1fr!important; }
          #why-us > div > div:last-child { flex-direction:column!important; }
        }
      `}</style>
    </section>
  );
}
