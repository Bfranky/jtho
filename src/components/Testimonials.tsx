'use client';

import { useState, useEffect } from 'react';

const testimonials = [
  {
    name:      'Mrs. Adunola Fashola',
    condition: 'Knee Joint Replacement',
    avatar:    'A',
    stars:     5,
    location:  'Ojodu, Lagos',
    text:      'I had been living with severe knee pain for over three years. After my treatment at Jesus The Healer Orthopaedic Home, I can now walk without any support. The doctors were patient, prayerful, and very professional. God truly heals through their hands.',
    outcome:   'Full mobility restored in 8 weeks',
    time:      '3 months ago',
  },
  {
    name:      'Mr. Chukwuemeka Obi',
    condition: 'Spinal Disc Herniation',
    avatar:    'C',
    stars:     5,
    location:  'Agege, Lagos',
    text:      'I came in unable to stand straight from back pain. The team here diagnosed the problem quickly and put me on a recovery plan. Six weeks later I was back at work. I recommend this place to anyone suffering from back or spine problems in Lagos.',
    outcome:   'Returned to full activity in 6 weeks',
    time:      '5 months ago',
  },
  {
    name:      'Auntie Bisi Lawal',
    condition: 'Hip Fracture Rehabilitation',
    avatar:    'B',
    stars:     5,
    location:  'Berger, Lagos',
    text:      'My mother fractured her hip and we were referred here. From the first day, the staff were warm and attentive. The physiotherapy sessions were thorough and my mother recovered faster than we expected. We are so grateful to God and this team.',
    outcome:   'Independent walking restored at 70 years',
    time:      '2 months ago',
  },
  {
    name:      'Tunde Adesanya',
    condition: 'Sports Injury — Ankle Ligament',
    avatar:    'T',
    stars:     5,
    location:  'Omole Estate, Lagos',
    text:      'I tore my ankle ligament during a football match. The treatment I received here was world-class. They handled everything from diagnosis to rehabilitation. I was back on the pitch in record time. These people are the real deal!',
    outcome:   'Full athletic recovery in 10 weeks',
    time:      '1 month ago',
  },
  {
    name:      'Pastor Emmanuel Dada',
    condition: 'Arthritis Management',
    avatar:    'E',
    stars:     5,
    location:  'Ojodu Berger, Lagos',
    text:      'As a pastor I stand for hours every Sunday. The arthritis in my knees was threatening my ministry. The doctors here prescribed a management plan that truly worked. I now stand, walk, and minister without pain. Jesus truly is the Healer!',
    outcome:   'Pain-free ministry restored',
    time:      '4 months ago',
  },
];

function StarRating({ count }: { count: number }) {
  return <span style={{ color: 'var(--gold)', fontSize: 14 }}>{'★'.repeat(count)}{'☆'.repeat(5 - count)}</span>;
}

export default function Testimonials() {
  const [current,   setCurrent]   = useState(0);
  const [animating, setAnimating] = useState(false);

  const go = (idx: number) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => { setCurrent(idx); setAnimating(false); }, 280);
  };

  useEffect(() => {
    const t = setInterval(() => go((current + 1) % testimonials.length), 6000);
    return () => clearInterval(t);
  }, [current]);

  const r = testimonials[current];

  return (
    <section id="testimonials" style={{ padding: '100px 40px', background: 'var(--white)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Heading */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'end', marginBottom: 64 }}>
          <div>
            <div className="section-label">Patient Stories</div>
            <h2 className="serif" style={{ fontSize: 'clamp(36px,5vw,56px)', color: 'var(--navy)', lineHeight: 1.1 }}>
              Lives Changed,<br />
              <span style={{ color: 'var(--teal)', fontStyle: 'italic' }}>Healing Received</span>
            </h2>
          </div>
          <div>
            <p style={{ color: 'var(--gray)', fontSize: 15, lineHeight: 1.8 }}>
              Real recovery stories from real patients. These are the moments that remind us why we do what we do — bringing healing, hope, and restored lives to our community in Ojodu.
            </p>
            {/* Overall rating badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginTop: 20, background: 'var(--mint)', border: '1px solid rgba(26,127,110,0.2)', padding: '10px 20px', borderRadius: 40 }}>
              <StarRating count={5} />
              <span style={{ color: 'var(--teal)', fontWeight: 700, fontSize: 14 }}>5.0 Patient Satisfaction</span>
            </div>
          </div>
        </div>

        {/* Main testimonial card */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 32 }}>

          {/* Featured quote */}
          <div style={{
            background: 'var(--navy)', borderRadius: 12, padding: '52px 48px',
            position: 'relative', overflow: 'hidden',
            opacity: animating ? 0 : 1, transition: 'opacity 0.28s ease',
          }}>
            {/* Watermark quote */}
            <div style={{ position: 'absolute', top: -10, left: 20, fontFamily: 'Georgia, serif', fontSize: 180, color: 'rgba(255,255,255,0.04)', lineHeight: 1, userSelect: 'none' }}>"</div>

            {/* Condition badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(26,127,110,0.2)', border: '1px solid rgba(26,127,110,0.3)', padding: '6px 14px', borderRadius: 40, marginBottom: 24 }}>
              <span style={{ width: 6, height: 6, background: 'var(--teal)', borderRadius: '50%', display: 'block' }} />
              <span style={{ color: 'var(--teal)', fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>{r.condition}</span>
            </div>

            <p className="baskerville" style={{ fontSize: 'clamp(16px,2vw,20px)', color: 'rgba(255,255,255,0.88)', lineHeight: 1.8, fontStyle: 'italic', marginBottom: 36, position: 'relative', zIndex: 1 }}>
              "{r.text}"
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--sky)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'DM Serif Display, serif', fontSize: 20, color: '#fff', flexShrink: 0 }}>
                  {r.avatar}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: '#fff', fontSize: 15 }}>{r.name}</div>
                  <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12 }}>{r.location} · {r.time}</div>
                </div>
              </div>
              <StarRating count={r.stars} />
            </div>

            {/* Recovery outcome */}
            <div style={{ marginTop: 28, padding: '14px 20px', background: 'rgba(26,127,110,0.15)', border: '1px solid rgba(26,127,110,0.25)', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 18 }}>✅</span>
              <span style={{ color: 'var(--teal)', fontSize: 13, fontWeight: 600 }}>{r.outcome}</span>
            </div>
          </div>

          {/* Side cards — other testimonials mini preview */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {testimonials.filter((_, i) => i !== current).slice(0, 3).map((t, i) => {
              const origIdx = testimonials.indexOf(t);
              return (
                <div key={i} onClick={() => go(origIdx)}
                  style={{
                    background: 'var(--light)', border: '1px solid var(--border)',
                    borderRadius: 8, padding: '16px 18px', cursor: 'pointer',
                    transition: 'all 0.25s ease', flex: 1,
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--sky)'; (e.currentTarget as HTMLElement).style.background = '#EEF4FF'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.background = 'var(--light)'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--sky)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                      {t.avatar}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--navy)', fontSize: 13 }}>{t.name}</div>
                      <div style={{ color: 'var(--teal)', fontSize: 10, letterSpacing: 1, textTransform: 'uppercase' }}>{t.condition}</div>
                    </div>
                  </div>
                  <p style={{ color: 'var(--gray)', fontSize: 12, lineHeight: 1.6 }}>"{t.text.substring(0, 72)}..."</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dot navigation */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
          {testimonials.map((_, i) => (
            <button key={i} onClick={() => go(i)}
              style={{ width: i === current ? 28 : 10, height: 10, borderRadius: 5, border: 'none', cursor: 'pointer', background: i === current ? 'var(--sky)' : 'var(--border)', transition: 'all 0.3s' }} />
          ))}
        </div>
      </div>

      <style>{`
        @media(max-width:900px) {
          #testimonials > div > div:nth-child(2) { grid-template-columns:1fr!important; }
          #testimonials > div > div:nth-child(2) > div:last-child { display:none!important; }
        }
        @media(max-width:600px) { #testimonials { padding:80px 20px!important; } #testimonials > div > div:first-child { grid-template-columns:1fr!important; gap:24px!important; } }
      `}</style>
    </section>
  );
}
