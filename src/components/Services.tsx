'use client';

import { useState } from 'react';

const services = [
  { icon: '🦴', title: 'Orthopaedic Treatment',   desc: 'Expert diagnosis and treatment of bone fractures, dislocations, and musculoskeletal injuries using modern orthopaedic techniques.',      color: '#EEF4FF' },
  { icon: '🦵', title: 'Joint Care & Therapy',     desc: 'Comprehensive management of joint pain, arthritis, and degenerative conditions to restore mobility and improve quality of life.',       color: '#F0FBF8' },
  { icon: '🏥', title: 'Fracture Management',      desc: 'Skilled care for all types of fractures — from closed reduction to post-operative rehabilitation, ensuring proper healing.',               color: '#FFF8EE' },
  { icon: '🤲', title: 'Physiotherapy',            desc: 'Personalised physiotherapy programs to strengthen muscles, restore function, and help patients return to daily activities safely.',       color: '#EEF4FF' },
  { icon: '🧠', title: 'Spine & Back Care',        desc: 'Specialist management of spinal conditions including herniated discs, sciatica, scoliosis, and chronic back pain.',                     color: '#F0FBF8' },
  { icon: '👶', title: 'Paediatric Orthopaedics',  desc: 'Gentle, expert orthopaedic care for children — treating developmental conditions, growth-related deformities, and childhood injuries.',  color: '#FFF8EE' },
  { icon: '🩺', title: 'General Medical Care',     desc: 'Holistic primary healthcare including diagnosis, treatment, and referral for a wide range of general medical conditions.',                color: '#EEF4FF' },
  { icon: '♿', title: 'Rehabilitation Services',  desc: 'Structured recovery programs following surgery, injury, or illness — helping patients regain strength, balance, and independence.',      color: '#F0FBF8' },
];

export default function Services() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="services" style={{ padding: '100px 40px', background: 'var(--white)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 80, alignItems: 'start', marginBottom: 64 }}>
          <div style={{ position: 'sticky', top: 100 }}>
            <div className="section-label">What We Offer</div>
            <h2 className="serif" style={{ fontSize: 'clamp(36px,4vw,52px)', color: 'var(--navy)', lineHeight: 1.15, marginBottom: 20 }}>
              Our Medical Services
            </h2>
            <p style={{ color: 'var(--gray)', fontSize: 15, lineHeight: 1.8, marginBottom: 32 }}>
              We provide compassionate, faith-centred orthopaedic and general medical care — combining clinical expertise with genuine concern for every patient's wellbeing.
            </p>
            <a href="#contact">
              <button className="btn-teal">Book a Consultation</button>
            </a>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {services.map((s, i) => (
              <div key={i} className="card"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{ padding: '24px', background: hovered === i ? s.color : 'var(--white)', transition: 'all 0.3s' }}>
                <div style={{ fontSize: 32, marginBottom: 14 }}>{s.icon}</div>
                <h3 style={{ fontFamily: 'DM Serif Display, serif', color: 'var(--navy)', fontSize: 18, marginBottom: 10, lineHeight: 1.3 }}>{s.title}</h3>
                <p style={{ color: 'var(--gray)', fontSize: 13, lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media(max-width:900px) {
          #services > div > div { grid-template-columns:1fr!important; gap:40px!important; }
          #services > div > div > div:first-child { position:static!important; }
          #services > div > div > div:last-child { grid-template-columns:1fr!important; }
        }
        @media(max-width:600px) { #services { padding:80px 20px!important; } }
      `}</style>
    </section>
  );
}
