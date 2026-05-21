'use client';

import { useState, useEffect, useRef } from 'react';

const stats = [
  { value: 95,  suffix: '%', label: 'Recovery Success Rate',      desc: 'of our patients achieve full or significant recovery',   icon: '🏆' },
  { value: 500, suffix: '+', label: 'Patients Treated',           desc: 'lives improved through specialist orthopaedic care',     icon: '👥' },
  { value: 8,   suffix: 'wk', label: 'Average Recovery Time',     desc: 'from admission to independent mobility for most cases',   icon: '⏱️' },
  { value: 98,  suffix: '%', label: 'Patient Satisfaction',       desc: 'would recommend our services to family and friends',     icon: '❤️' },
];

const conditions = [
  { name: 'Fractures & Breaks',          rate: 97, color: 'var(--sky)' },
  { name: 'Joint Replacement Recovery',  rate: 93, color: 'var(--teal)' },
  { name: 'Spine & Disc Conditions',     rate: 89, color: 'var(--gold)' },
  { name: 'Sports Injury Rehabilitation',rate: 96, color: '#7C3AED' },
  { name: 'Paediatric Orthopaedics',     rate: 99, color: 'var(--sky)' },
  { name: 'Arthritis Management',        rate: 91, color: 'var(--teal)' },
];

function AnimatedCount({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let start = 0;
        const step = target / 60;
        const timer = setInterval(() => {
          start += step;
          if (start >= target) { setCount(target); clearInterval(timer); }
          else setCount(Math.floor(start));
        }, 24);
      }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);

  return <div ref={ref} className="serif" style={{ fontSize: 'clamp(44px,6vw,72px)', color: 'var(--navy)', lineHeight: 1, fontWeight: 700 }}>{count}{suffix}</div>;
}

function ProgressBar({ rate, color }: { rate: number; color: string }) {
  const [width, setWidth] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setTimeout(() => setWidth(rate), 200);
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [rate]);

  return (
    <div ref={ref} style={{ height: 8, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${width}%`, background: color, borderRadius: 4, transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1)' }} />
    </div>
  );
}

export default function RecoveryStats() {
  return (
    <section id="outcomes" style={{ padding: '100px 40px', background: 'var(--cream)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, var(--border) 1px, transparent 0)', backgroundSize: '32px 32px', opacity: 0.5, pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative' }}>

        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: 72 }}>
          <div className="section-label" style={{ justifyContent: 'center' }}>Our Outcomes</div>
          <h2 className="serif" style={{ fontSize: 'clamp(36px,5vw,56px)', color: 'var(--navy)', marginBottom: 16 }}>
            Results That <span style={{ color: 'var(--teal)', fontStyle: 'italic' }}>Speak for Themselves</span>
          </h2>
          <p style={{ color: 'var(--gray)', fontSize: 16, maxWidth: 520, margin: '0 auto', lineHeight: 1.8 }}>
            Our commitment to clinical excellence shows in every metric. These figures represent real patients, real recoveries, and real lives transformed.
          </p>
        </div>

        {/* Big stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 2, marginBottom: 72 }}>
          {stats.map((s, i) => (
            <div key={i} style={{
              padding: '36px 24px', textAlign: 'center',
              background: 'var(--white)',
              border: '1px solid var(--border)',
              borderLeft: i === 0 ? '4px solid var(--sky)' : undefined,
              position: 'relative', overflow: 'hidden',
              transition: 'box-shadow 0.3s',
            }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(10,22,40,0.1)')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.boxShadow = 'none')}
            >
              <div style={{ fontSize: 36, marginBottom: 12 }}>{s.icon}</div>
              <AnimatedCount target={s.value} suffix={s.suffix} />
              <div style={{ fontWeight: 700, color: 'var(--navy)', fontSize: 14, marginTop: 8, marginBottom: 6 }}>{s.label}</div>
              <div style={{ color: 'var(--gray)', fontSize: 12, lineHeight: 1.6 }}>{s.desc}</div>
            </div>
          ))}
        </div>

        {/* Recovery rates by condition */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>

          {/* Left — bars */}
          <div>
            <h3 className="serif" style={{ color: 'var(--navy)', fontSize: 28, marginBottom: 8 }}>Recovery Rates by Condition</h3>
            <p style={{ color: 'var(--gray)', fontSize: 14, marginBottom: 36, lineHeight: 1.7 }}>
              Consistently high recovery rates across all major orthopaedic conditions treated at our facility.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
              {conditions.map((c, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ color: 'var(--navy)', fontSize: 14, fontWeight: 500 }}>{c.name}</span>
                    <span style={{ fontFamily: 'DM Serif Display, serif', color: c.color, fontSize: 18, fontWeight: 700 }}>{c.rate}%</span>
                  </div>
                  <ProgressBar rate={c.rate} color={c.color} />
                </div>
              ))}
            </div>
          </div>

          {/* Right — visual infographic card */}
          <div style={{ background: 'var(--navy)', borderRadius: 12, padding: '40px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -30, right: -30, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(46,107,176,0.3) 0%, transparent 70%)' }} />
            <div style={{ fontFamily: 'DM Serif Display, serif', color: 'rgba(255,255,255,0.06)', fontSize: 120, position: 'absolute', bottom: -20, right: 10, lineHeight: 1 }}>✚</div>

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ color: 'var(--gold)', fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 16 }}>Our Promise</div>
              <h3 className="serif" style={{ color: '#fff', fontSize: 28, lineHeight: 1.2, marginBottom: 24 }}>
                Every Patient<br />Deserves to <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Heal</span>
              </h3>

              {[
                { icon: '✅', text: 'Evidence-based orthopaedic treatment protocols' },
                { icon: '✅', text: 'Personalised recovery plan for every patient' },
                { icon: '✅', text: 'Regular progress reviews and follow-ups' },
                { icon: '✅', text: 'Faith, compassion, and clinical excellence combined' },
                { icon: '✅', text: 'Transparent communication with patients & families' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 14, alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--teal)', flexShrink: 0, marginTop: 1 }}>{item.icon}</span>
                  <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, lineHeight: 1.5 }}>{item.text}</span>
                </div>
              ))}

              <a href="#contact" style={{ display: 'block', marginTop: 28 }}>
                <button style={{ background: 'var(--gold)', color: 'var(--navy)', border: 'none', width: '100%', padding: '13px', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: 14, cursor: 'pointer', borderRadius: 4, transition: 'opacity 0.2s' }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = '0.88')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = '1')}>
                  Start Your Recovery →
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media(max-width:900px) {
          #outcomes > div > div:nth-child(2) { grid-template-columns:repeat(2,1fr)!important; }
          #outcomes > div > div:last-child { grid-template-columns:1fr!important; gap:40px!important; }
        }
        @media(max-width:600px) { #outcomes { padding:80px 20px!important; } #outcomes > div > div:nth-child(2) { grid-template-columns:1fr!important; } }
      `}</style>
    </section>
  );
}
