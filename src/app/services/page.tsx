'use client';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsApp from '@/components/layout/WhatsApp';
import { useState } from 'react';

const SERVICES = [
  {
    id: 'fracture',
    icon: '🦴',
    title: 'Bone Fracture Treatment',
    image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=700&q=80',
    overview: 'Expert diagnosis and management of all fracture types — from simple breaks to complex multi-fragment injuries — using the latest orthopaedic techniques.',
    symptoms: ['Severe pain at injury site','Swelling and bruising','Deformity or abnormal shape','Inability to bear weight','Numbness or tingling'],
    procedure: 'We begin with digital X-ray imaging for precise diagnosis. Treatment may include closed reduction (non-surgical repositioning), casting or bracing, or surgical fixation with plates, screws, or rods depending on fracture severity.',
    recovery: '4–12 weeks depending on fracture type and location. Physiotherapy is included to restore full function.',
    doctor: 'Dr. Adebayo Olusola',
  },
  {
    id: 'joint',
    icon: '🦵',
    title: 'Joint Replacement',
    image: 'https://images.unsplash.com/photo-1581595219315-a187dd40c322?auto=format&fit=crop&w=700&q=80',
    overview: 'Total and partial hip, knee, and shoulder joint replacement for patients suffering chronic pain, arthritis, or joint degeneration that limits daily activity.',
    symptoms: ['Chronic joint pain not relieved by medication','Stiffness limiting movement','Joint swelling and warmth','Difficulty walking, climbing stairs or standing','Persistent pain at rest'],
    procedure: 'After thorough assessment including X-rays and MRI, we perform joint replacement surgery using prosthetic implants. Post-op physiotherapy begins within 24–48 hours to speed recovery.',
    recovery: '6–12 weeks for most patients. Most return to normal activities within 3 months.',
    doctor: 'Dr. Adebayo Olusola',
  },
  {
    id: 'spine',
    icon: '🧠',
    title: 'Spine Care & Surgery',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=700&q=80',
    overview: 'Comprehensive diagnosis and treatment of spinal conditions — from conservative therapy to minimally invasive surgical intervention for complex cases.',
    symptoms: ['Persistent back or neck pain','Pain radiating down arm or leg (radiculopathy)','Numbness, weakness, or tingling in limbs','Difficulty standing or walking','Loss of bladder or bowel control (emergency)'],
    procedure: 'We evaluate with X-ray, MRI, and CT scans. Treatment ranges from physiotherapy and steroid injections to discectomy, spinal fusion, or decompression surgery based on severity.',
    recovery: '6–16 weeks. Most disc conditions resolve with conservative treatment within 8 weeks.',
    doctor: 'Dr. Ngozi Anyanwu',
  },
  {
    id: 'sports',
    icon: '⚡',
    title: 'Sports Injury Treatment',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=700&q=80',
    overview: 'Rapid diagnosis and evidence-based treatment for sports and exercise-related injuries — helping athletes return to peak performance safely.',
    symptoms: ['Sudden joint pain during activity','Swelling and instability','Popping or snapping sensation','Muscle weakness or inability to bear load','Reduced range of motion'],
    procedure: 'Injuries are assessed with imaging. Treatment includes RICE protocol, bracing, physiotherapy, PRP injections where appropriate, and arthroscopic surgery for ligament and meniscal injuries.',
    recovery: '4–16 weeks depending on injury type. Sports-specific rehabilitation included in recovery plan.',
    doctor: 'Mrs. Funmilayo Oke',
  },
  {
    id: 'physio',
    icon: '🤲',
    title: 'Physiotherapy & Rehabilitation',
    image: 'https://images.unsplash.com/photo-1576089172869-4f5f6f315620?auto=format&fit=crop&w=700&q=80',
    overview: 'Personalised physiotherapy programs designed to restore mobility, build strength, reduce pain, and help patients return to full independent living.',
    symptoms: ['Post-surgical weakness','Reduced joint mobility','Chronic musculoskeletal pain','Balance and coordination problems','Difficulty with daily activities after injury or illness'],
    procedure: 'Initial assessment followed by a customised exercise program. Sessions include manual therapy, electrotherapy, hydrotherapy exercises, strengthening protocols, and home exercise guidance.',
    recovery: 'Ongoing — typically 6–12 week programs with measurable milestones reviewed regularly.',
    doctor: 'Mrs. Funmilayo Oke',
  },
  {
    id: 'paediatric',
    icon: '👶',
    title: 'Paediatric Orthopaedics',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=700&q=80',
    overview: 'Gentle, expert orthopaedic care for infants, children, and teenagers — treating developmental conditions, growth-related deformities, and childhood injuries.',
    symptoms: ['Limping or abnormal gait','Uneven limb length','Club foot or bow legs','Scoliosis (curved spine)','Fractures and growth plate injuries'],
    procedure: 'Child-friendly assessment including gentle imaging. Treatment uses age-appropriate bracing, casting, and when necessary, minimally invasive surgical correction. Parents are guided through every step.',
    recovery: 'Varies widely by condition — ongoing monitoring through growth phases ensures best long-term outcomes.',
    doctor: 'Dr. Ngozi Anyanwu',
  },
];

export default function ServicesPage() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <>
      <Navbar />

      {/* Page hero */}
      <div className="page-hero">
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="section-label" style={{ color: 'var(--teal-light)' }}>
            <span style={{ background: 'var(--teal-light)' }} />
            What We Offer
          </div>
          <h1 className="serif" style={{ fontSize: 'clamp(36px,5vw,58px)', color: '#fff', lineHeight: 1.1, marginBottom: 16 }}>
            Orthopaedic Services
          </h1>
          <p style={{ color: 'rgba(255,255,255,.6)', fontSize: 16, maxWidth: 520 }}>
            Comprehensive specialist care for bones, joints, muscles, and the spine — from diagnosis through to full recovery.
          </p>
        </div>
      </div>

      {/* Service grid */}
      <section style={{ padding: '80px 40px', background: 'var(--cream)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 24 }}>
            {SERVICES.map((s) => (
              <div key={s.id} id={s.id}>
                <div className="card" style={{ overflow: 'hidden' }}>
                  <div style={{ height: 200, overflow: 'hidden', position: 'relative' }}>
                    <img src={s.image} alt={s.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform .5s ease', transform: active === s.id ? 'scale(1.05)' : 'scale(1)' }}
                      onMouseEnter={() => setActive(s.id)} onMouseLeave={() => setActive(null)} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(10,22,40,.6),transparent)' }} />
                    <div style={{ position: 'absolute', top: 14, left: 14, fontSize: 32 }}>{s.icon}</div>
                    <div style={{ position: 'absolute', bottom: 14, left: 14, color: '#fff', fontFamily: 'DM Serif Display,serif', fontSize: 18 }}>{s.title}</div>
                  </div>
                  <div style={{ padding: '22px 24px' }}>
                    <p style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.7, marginBottom: 16 }}>{s.overview}</p>

                    {/* Expandable detail */}
                    <button onClick={() => setActive(active === s.id ? null : s.id)}
                      style={{ background: 'none', border: 'none', color: 'var(--sky)', fontSize: 13, fontWeight: 600, cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 6, marginBottom: active === s.id ? 20 : 0 }}>
                      {active === s.id ? '▲ Hide details' : '▼ View details'}
                    </button>

                    {active === s.id && (
                      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 18 }}>
                        <div style={{ marginBottom: 16 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--sky)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>Symptoms Treated</div>
                          {s.symptoms.map((sym, i) => (
                            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6, alignItems: 'flex-start' }}>
                              <span style={{ color: 'var(--teal)', flexShrink: 0, marginTop: 1 }}>✓</span>
                              <span style={{ color: 'var(--muted)', fontSize: 13 }}>{sym}</span>
                            </div>
                          ))}
                        </div>
                        <div style={{ marginBottom: 16 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--sky)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>Procedure</div>
                          <p style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.7 }}>{s.procedure}</p>
                        </div>
                        <div style={{ marginBottom: 18, background: 'var(--light)', padding: '12px 14px', borderRadius: 6 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--teal)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>⏱ Recovery Timeline</div>
                          <div style={{ color: 'var(--navy)', fontSize: 13, fontWeight: 500 }}>{s.recovery}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--sky)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'DM Serif Display,serif', fontSize: 14 }}>
                            {s.doctor.split(' ')[1]?.[0] ?? 'D'}
                          </div>
                          <div>
                            <div style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: 1 }}>ASSIGNED DOCTOR</div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy)' }}>{s.doctor}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    <Link href="/appointments" className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                      Book This Service
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <WhatsApp />
      <style>{`@media(max-width:600px){section{padding:60px 20px!important}}`}</style>
    </>
  );
}
