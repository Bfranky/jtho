'use client';

const reasons = [
  { num: '01', title: 'Compassionate Team',          desc: 'Our practitioners treat every patient with kindness, patience, and deep respect — never rushing a consultation.' },
  { num: '02', title: 'Specialist Orthopaedic Focus', desc: 'We specialise in bones, joints, and musculoskeletal health — bringing focused expertise where it matters most.' },
  { num: '03', title: 'Accessible Location',          desc: 'Conveniently located at 5 Adebowale Street, Ojodu — easy to reach from across Lagos.' },
  { num: '04', title: 'Affordable Quality Care',      desc: 'We believe excellent healthcare should be accessible to everyone. Our pricing reflects our commitment to the community.' },
  { num: '05', title: 'Holistic Approach',            desc: 'From diagnosis through to full rehabilitation, we manage your entire care journey under one roof.' },
  { num: '06', title: 'Faith-Rooted Mission',         desc: 'Our name says it all. We are driven by a higher purpose — to be instruments of healing in our patients\' lives.' },
];

export default function WhyUs() {
  return (
    <section id="why-us" style={{ padding: '100px 40px', background: 'var(--navy)', position: 'relative', overflow: 'hidden' }}>

      {/* Background cross watermark */}
      <div style={{ position: 'absolute', right: '-5%', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.03)', fontSize: 480, fontWeight: 100, lineHeight: 1, userSelect: 'none', pointerEvents: 'none' }}>✚</div>

      {/* Dot grid */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 0)', backgroundSize: '32px 32px', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative' }}>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 80, alignItems: 'start' }}>

          {/* Left */}
          <div style={{ position: 'sticky', top: 100 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, color: 'var(--gold)', fontSize: 11, fontWeight: 600, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 14 }}>
              <span style={{ display: 'block', width: 24, height: 2, background: 'var(--gold)' }} />
              Why Choose Us
            </div>
            <h2 className="serif" style={{ fontSize: 'clamp(34px,4vw,52px)', color: 'var(--white)', lineHeight: 1.15, marginBottom: 20 }}>
              The Healer's<br />
              <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Difference</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 15, lineHeight: 1.8, marginBottom: 32 }}>
              There are many medical centers in Lagos. Here is why our patients keep coming back — and why they send their loved ones to us.
            </p>
            <a href="#contact">
              <button style={{ background: 'var(--gold)', color: 'var(--navy)', border: 'none', padding: '14px 32px', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: 14, cursor: 'pointer', borderRadius: 4, transition: 'all 0.3s' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.85'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1'; (e.currentTarget as HTMLElement).style.transform = 'none'; }}>
                Book Appointment
              </button>
            </a>
          </div>

          {/* Right */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            {reasons.map((r, i) => (
              <div key={i} style={{ padding: '32px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)', borderRight: i % 2 === 0 ? '1px solid rgba(255,255,255,0.07)' : 'none', transition: 'background 0.3s' }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
              >
                <div style={{ fontFamily: 'DM Serif Display, serif', color: 'rgba(255,255,255,0.15)', fontSize: 40, lineHeight: 1, marginBottom: 16 }}>{r.num}</div>
                <h3 style={{ fontFamily: 'DM Serif Display, serif', color: 'var(--white)', fontSize: 18, marginBottom: 10 }}>{r.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, lineHeight: 1.7 }}>{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media(max-width:900px) {
          #why-us > div > div { grid-template-columns:1fr!important; gap:40px!important; }
          #why-us > div > div > div:first-child { position:static!important; }
          #why-us > div > div > div:last-child { grid-template-columns:1fr!important; }
        }
        @media(max-width:600px) { #why-us { padding:80px 20px!important; } }
      `}</style>
    </section>
  );
}
