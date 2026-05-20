'use client';

const pillars = [
  { icon: '✝️', title: 'Faith-Centred Care',    desc: 'Our name reflects our belief — healing begins with faith. Every patient is treated with prayer, compassion, and excellence.' },
  { icon: '🎓', title: 'Expert Practitioners',   desc: 'Our medical team brings deep orthopaedic expertise, continuous training, and a dedication to the best clinical outcomes.' },
  { icon: '❤️', title: 'Patient-First Always',   desc: 'We listen, we care, and we treat every patient as family. Your comfort and recovery are our highest priority.' },
  { icon: '🏡', title: 'Homely Environment',     desc: 'As an orthopaedic "home", we provide the warmth and personal attention of home care with the rigour of clinical medicine.' },
];

export default function About() {
  return (
    <section id="about" style={{ padding: '100px 40px', background: 'var(--light)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center', marginBottom: 80 }}>

          {/* Image stack */}
          <div style={{ position: 'relative', height: 480 }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 40, bottom: 40, borderRadius: 8, overflow: 'hidden', boxShadow: '0 20px 60px rgba(10,22,40,0.12)' }}>
              <img src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=700&q=80"
                alt="Medical team" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ position: 'absolute', bottom: 0, right: 0, width: '52%', borderRadius: 8, overflow: 'hidden', border: '4px solid var(--white)', boxShadow: '0 16px 40px rgba(10,22,40,0.15)' }}>
              <img src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=500&q=80"
                alt="Patient care" style={{ width: '100%', height: 200, objectFit: 'cover' }} />
            </div>
            {/* Cross badge */}
            <div style={{ position: 'absolute', top: 20, right: 20, background: 'var(--sky)', width: 56, height: 56, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 24, boxShadow: '0 8px 24px rgba(46,107,176,0.4)', animation: 'float 4s ease-in-out infinite' }}>✚</div>
            {/* Stat card */}
            <div style={{ position: 'absolute', bottom: 20, left: 12, background: 'var(--navy)', color: 'white', padding: '14px 20px', borderRadius: 8, boxShadow: '0 10px 30px rgba(10,22,40,0.3)' }}>
              <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 28, color: 'var(--gold)', lineHeight: 1 }}>Ojodu</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', letterSpacing: 2, marginTop: 4, textTransform: 'uppercase' }}>Lagos, Nigeria</div>
            </div>
          </div>

          {/* Text */}
          <div>
            <div className="section-label">Who We Are</div>
            <h2 className="serif" style={{ fontSize: 'clamp(34px,4vw,50px)', color: 'var(--navy)', lineHeight: 1.15, marginBottom: 24 }}>
              Healing Through<br />
              <span style={{ color: 'var(--sky)', fontStyle: 'italic' }}>Faith & Medicine</span>
            </h2>
            <p style={{ color: 'var(--gray)', fontSize: 16, lineHeight: 1.9, marginBottom: 18 }}>
              Jesus The Healer Orthopaedic Home is a specialist medical center on <strong style={{ color: 'var(--navy)' }}>5 Adebowale Street, Ojodu, Lagos</strong> — dedicated to providing exceptional orthopaedic and general medical care to our community.
            </p>
            <p style={{ color: 'var(--gray)', fontSize: 16, lineHeight: 1.9, marginBottom: 32 }}>
              We believe that true healing encompasses the body, mind, and spirit. Our team of experienced practitioners brings clinical excellence and genuine compassion to every consultation — treating patients not as cases, but as valued members of our family.
            </p>
            <div style={{ display: 'flex', gap: 16 }}>
              <a href="#contact"><button className="btn-primary">Get In Touch</button></a>
              <a href="#services"><button className="btn-outline">Our Services</button></a>
            </div>
          </div>
        </div>

        {/* Pillars */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 24 }}>
          {pillars.map((p, i) => (
            <div key={i} className="card" style={{ padding: '28px 24px', background: 'var(--white)' }}>
              <div style={{ fontSize: 32, marginBottom: 14 }}>{p.icon}</div>
              <h3 style={{ fontFamily: 'DM Serif Display, serif', color: 'var(--navy)', fontSize: 18, marginBottom: 10 }}>{p.title}</h3>
              <p style={{ color: 'var(--gray)', fontSize: 14, lineHeight: 1.7 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @media(max-width:768px) {
          #about > div > div:first-child { grid-template-columns:1fr!important; gap:40px!important; }
          #about > div > div:first-child > div:first-child { height:300px!important; }
        }
        @media(max-width:600px) { #about { padding:80px 20px!important; } }
      `}</style>
    </section>
  );
}
