'use client';

import { useState } from 'react';

const staff = [
  {
    name:       'Dr. Adebayo Olusola',
    title:      'Chief Orthopaedic Surgeon',
    specialty:  'Joint Replacement & Fracture Management',
    experience: '18 Years Experience',
    quals:      'MBBS, FRCS (Ortho)',
    image:      'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80',
    tags:       ['Hip & Knee', 'Fractures', 'Trauma Surgery'],
    available:  'Mon, Wed, Fri',
  },
  {
    name:       'Dr. Ngozi Anyanwu',
    title:      'Consultant Orthopaedist',
    specialty:  'Spine & Paediatric Orthopaedics',
    experience: '12 Years Experience',
    quals:      'MBBS, MWACS (Ortho)',
    image:      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
    tags:       ['Spine Care', 'Paediatrics', 'Scoliosis'],
    available:  'Tue, Thu, Sat',
  },
  {
    name:       'Pharm. Taiwo Adeyemi',
    title:      'Clinical Pharmacist',
    specialty:  'Medication Management & Patient Counselling',
    experience: '9 Years Experience',
    quals:      'B.Pharm, RPh',
    image:      'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=400&q=80',
    tags:       ['Drug Therapy', 'Pain Management', 'Counselling'],
    available:  'Mon – Sat',
  },
  {
    name:       'Mrs. Funmilayo Oke',
    title:      'Lead Physiotherapist',
    specialty:  'Rehabilitation & Sports Injury Recovery',
    experience: '11 Years Experience',
    quals:      'BPT, MPT (Ortho)',
    image:      'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=400&q=80',
    tags:       ['Physiotherapy', 'Sports Rehab', 'Mobility'],
    available:  'Mon – Fri',
  },
];

export default function DoctorProfiles() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="team" style={{ padding: '100px 40px', background: 'var(--light)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Heading */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 56, flexWrap: 'wrap', gap: 24 }}>
          <div>
            <div className="section-label">Meet The Team</div>
            <h2 className="serif" style={{ fontSize: 'clamp(36px,5vw,56px)', color: 'var(--navy)', lineHeight: 1.1 }}>
              Expert Hands,<br />
              <span style={{ color: 'var(--sky)', fontStyle: 'italic' }}>Caring Hearts</span>
            </h2>
          </div>
          <p style={{ color: 'var(--gray)', fontSize: 15, maxWidth: 360, lineHeight: 1.8 }}>
            Our team of qualified, experienced specialists are dedicated to your recovery — bringing both clinical excellence and compassionate care to every patient.
          </p>
        </div>

        {/* Staff grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px,1fr))', gap: 24 }}>
          {staff.map((s, i) => (
            <div key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="card"
              style={{ borderRadius: 10, overflow: 'hidden', background: 'var(--white)' }}>

              {/* Photo */}
              <div style={{ height: 220, position: 'relative', overflow: 'hidden', background: '#e0e8f4' }}>
                <img src={s.image} alt={s.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block', transition: 'transform 0.5s ease', transform: hovered === i ? 'scale(1.06)' : 'scale(1)' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,22,40,0.65) 0%, transparent 55%)' }} />
                {/* Available tag */}
                <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(26,127,110,0.9)', color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', padding: '5px 10px', borderRadius: 20 }}>
                  {s.available}
                </div>
                <div style={{ position: 'absolute', bottom: 14, left: 16 }}>
                  <div style={{ fontFamily: 'DM Serif Display, serif', color: '#fff', fontSize: 17, lineHeight: 1.1 }}>{s.name}</div>
                  <div style={{ color: 'var(--gold)', fontSize: 11, letterSpacing: 1, marginTop: 3 }}>{s.quals}</div>
                </div>
              </div>

              {/* Info */}
              <div style={{ padding: '20px' }}>
                <div style={{ color: 'var(--sky)', fontSize: 12, fontWeight: 700, letterSpacing: 0.5, marginBottom: 4 }}>{s.title}</div>
                <div style={{ color: 'var(--gray)', fontSize: 13, marginBottom: 4 }}>{s.specialty}</div>
                <div style={{ color: 'var(--teal)', fontSize: 12, fontWeight: 600, marginBottom: 14 }}>📅 {s.experience}</div>

                {/* Specialty tags */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                  {s.tags.map((tag) => (
                    <span key={tag} style={{ background: 'var(--light)', border: '1px solid var(--border)', color: 'var(--navy)', fontSize: 10, fontWeight: 600, letterSpacing: 0.5, padding: '4px 10px', borderRadius: 20 }}>
                      {tag}
                    </span>
                  ))}
                </div>

                <a href="#contact">
                  <button style={{ width: '100%', background: hovered === i ? 'var(--sky)' : 'transparent', color: hovered === i ? '#fff' : 'var(--sky)', border: '1.5px solid var(--sky)', padding: '10px', fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: 13, cursor: 'pointer', borderRadius: 4, transition: 'all 0.3s' }}>
                    Book with {s.name.split(' ')[0]} {s.name.split(' ')[1]}
                  </button>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media(max-width:600px) { #team { padding:80px 20px!important; } #team > div > div:first-child { flex-direction:column!important; } }
      `}</style>
    </section>
  );
}
