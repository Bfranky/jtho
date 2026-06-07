'use client';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsApp from '@/components/layout/WhatsApp';
import { useState } from 'react';

const SERVICES = [
  {
    id: 'ortho',
    icon: '🦴',
    title: 'Orthopaedics & Joint Care',
    image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=700&q=80',
    overview: 'Specialized clinical assessment, diagnostic imaging, and advanced treatments for skeletal bone alignment, joint degradation, and orthopaedic health.',
    symptoms: ['Severe joint friction and pain', 'Reduced range of motion', 'Warmth or swelling in major joints', 'Difficulty climbing stairs or standing', 'Skeletal discomfort at rest'],
    procedure: 'Our orthopaedic team reviews joint X-rays and MRI scans, designs pain management protocols, provides brace or alignment support, and organizes minimally invasive surgical or non-surgical corrections.',
    recovery: 'Varies by clinical status — usually 4 to 12 weeks with active joint monitoring.',
    doctor: 'Orthopaedic Specialists',
  },
  {
    id: 'massage',
    icon: '💆‍♂️',
    title: 'Machine & Manual Massage',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=700&q=80',
    overview: 'Professional therapeutic massage combining high-precision machine muscle vibration stimulation with expert manual hands-on deep-tissue manipulation.',
    symptoms: ['Chronic muscular tension and knots', 'Lactic acid buildup and soreness', 'Poor circulation in limbs', 'Stiff neck and shoulder fatigue', 'High stress and systemic fatigue'],
    procedure: 'Using targeted percussion massage machines alongside direct manual pressure points, we loosen tight myofascial systems, enhance tissue oxygenation, and restore muscular elasticity.',
    recovery: 'Immediate relief — recommended weekly sessions for chronic stiffness.',
    doctor: 'Massage Therapists',
  },
  {
    id: 'physio',
    icon: '🤲',
    title: 'Physiotherapy & Rehabilitation',
    image: 'https://images.unsplash.com/photo-1576089172869-4f5f6f315620?auto=format&fit=crop&w=700&q=80',
    overview: 'Evidence-based customized physical rehabilitation programs designed to restore physical mobility, increase strength, and build motor coordination.',
    symptoms: ['Post-surgical muscle weakness', 'Stiffness and joint freezing', 'Gait and balance imbalance', 'Loss of physical independence', 'Post-stroke motor limitations'],
    procedure: 'Sessions combine manual range-of-motion stretching, clinical exercise programs, electrical nerve stimulation where required, and highly detailed home exercise programs.',
    recovery: 'Ongoing programs — typically 6 to 12 week tracks with measurable mobility markers.',
    doctor: 'Certified Physiotherapists',
  },
  {
    id: 'spinal',
    icon: '🦵',
    title: 'Bone Fracture & Spinal Cord Care',
    image: 'https://images.unsplash.com/photo-1581595219315-a187dd40c322?auto=format&fit=crop&w=700&q=80',
    overview: 'Highly specialized traction, setting, and rehabilitation services for bone fractures and complex spinal cord recovery.',
    symptoms: ['Acute fractures or bone breaks', 'Spinal cord compression discomfort', 'Numbness or radiating limb pain (radiculopathy)', 'Motor weakness from spinal trauma', 'Immobility due to recent bone injuries'],
    procedure: 'We support precise non-surgical bone-setting, alignment casting, traction, and progressive spinal cord rehabilitation sessions to preserve nerve health and rebuild muscular support.',
    recovery: '8 to 24 weeks depending on fracture density and spinal cord injury level.',
    doctor: 'Spine & Trauma Specialists',
  },
  {
    id: 'arthritis',
    icon: '🧠',
    title: 'Arthritis Management',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=700&q=80',
    overview: 'Targeted rheumatologic care for osteoarthritis and rheumatoid arthritis to preserve joint cartilage and reduce systemic chronic pain.',
    symptoms: ['Morning joint stiffness lasting hours', 'Symmetrical joint swelling and pain', 'Cartilage wear and grating sounds', 'Inflammation in fingers, knees, or hips', 'Deformity in joint structures over time'],
    procedure: 'We utilize anti-inflammatory counseling, machine massage relief, mild physiotherapy exercise to preserve joint lubrication, and pharmacologic pain management plans.',
    recovery: 'Chronic condition management — ongoing care designed to sustain active life quality.',
    doctor: 'Rheumatology & Joint Specialists',
  },
  {
    id: 'rheumatism',
    icon: '⚡',
    title: 'Rheumatism Recovery',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=700&q=80',
    overview: 'Advanced physical and therapeutic techniques specifically formulated to treat rheumatism, relieving severe chronic back, muscle, and soft tissue pains.',
    symptoms: ['Chronic deep bone and muscle stiffness', 'Widespread musculoskeletal aches', 'Weather-sensitive joint pain', 'Persistent fibrous tissue inflammation', 'General fatigue and heavy limbs'],
    procedure: 'Using manual massage mobilization, local heating therapies, and gentle physiotherapy exercises, we alleviate chronic muscular stiffness and joint aches associated with rheumatism.',
    recovery: 'Sustained relief — usually requires 4 to 8 weeks of clinical treatment cycles.',
    doctor: 'Joint Specialists',
  },
  {
    id: 'home-service',
    icon: '🏡',
    title: 'Clinical Home Service Visits',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=700&q=80',
    overview: 'Bring our certified clinical specialists, portable massage machines, and manual physical therapist protocols straight to the comfort of your home.',
    symptoms: ['Inability or difficulty to travel to the clinic', 'Severe acute back, neck, or fracture pains', 'Post-surgery homebound rehabilitation needs', 'Preference for home-based private care', 'Desire for family-inclusive rehab sessions'],
    procedure: 'Request a visit online or by phone. Our certified doctors, physiotherapists, or massage specialists arrive fully equipped with portable treatment tables and machines to conduct sessions in your home.',
    recovery: 'Covers all home massage, physiotherapy, and orthopaedic consultation schedules.',
    doctor: 'Mobile Clinical Team',
  },
];

export default function ServicesPage() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <>
      <Navbar />

      {/* Page hero */}
      <div className="page-hero" style={{ background: 'linear-gradient(135deg, var(--navy), #1E3A8A)', padding: '80px 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="section-label" style={{ color: 'var(--teal-light)' }}>
            <span style={{ background: 'var(--teal-light)' }} />
            24hr Specialized Clinical Services
          </div>
          <h1 className="serif" style={{ fontSize: 'clamp(36px,5vw,58px)', color: '#fff', lineHeight: 1.1, marginBottom: 16 }}>
            Specialist Clinical Scope
          </h1>
          <p style={{ color: 'rgba(255,255,255,.65)', fontSize: 16, maxWidth: 580 }}>
            Comprehensive orthopaedics, manual & machine massage, and physiotherapy — delivered in our Ojodu clinic or directly in your home. **Note: We do not operate ambulance transport services.**
          </p>
        </div>
      </div>

      {/* Service grid */}
      <section style={{ padding: '80px 40px', background: 'var(--cream)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 24 }}>
            {SERVICES.map((s) => (
              <div key={s.id} id={s.id}>
                <div className="card" style={{ overflow: 'hidden', background: '#fff', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ height: 200, overflow: 'hidden', position: 'relative' }}>
                    <img src={s.image} alt={s.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform .5s ease', transform: active === s.id ? 'scale(1.05)' : 'scale(1)' }}
                      onMouseEnter={() => setActive(s.id)} onMouseLeave={() => setActive(null)} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(10,22,40,.6),transparent)' }} />
                    <div style={{ position: 'absolute', top: 14, left: 14, fontSize: 32 }}>{s.icon}</div>
                    <div style={{ position: 'absolute', bottom: 14, left: 14, color: '#fff', fontFamily: 'DM Serif Display,serif', fontSize: 18 }}>{s.title}</div>
                  </div>
                  <div style={{ padding: '22px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <p style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.7, marginBottom: 16 }}>{s.overview}</p>

                    {/* Expandable detail */}
                    <button onClick={() => setActive(active === s.id ? null : s.id)}
                      style={{ background: 'none', border: 'none', color: 'var(--sky)', fontSize: 13, fontWeight: 600, cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 6, marginBottom: active === s.id ? 20 : 16 }}>
                      {active === s.id ? '▲ Hide treatment details' : '▼ View treatment details'}
                    </button>

                    {active === s.id && (
                      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 18, marginBottom: 16 }}>
                        <div style={{ marginBottom: 16 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--sky)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>Symptoms Target</div>
                          {s.symptoms.map((sym, i) => (
                            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6, alignItems: 'flex-start' }}>
                              <span style={{ color: 'var(--teal)', flexShrink: 0, marginTop: 1 }}>✓</span>
                              <span style={{ color: 'var(--muted)', fontSize: 13 }}>{sym}</span>
                            </div>
                          ))}
                        </div>
                        <div style={{ marginBottom: 16 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--sky)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>How We Treat</div>
                          <p style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.7 }}>{s.procedure}</p>
                        </div>
                        <div style={{ marginBottom: 18, background: 'var(--light)', padding: '12px 14px', borderRadius: 6 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--teal)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>⏱ Clinical Recovery Phase</div>
                          <div style={{ color: 'var(--navy)', fontSize: 13, fontWeight: 500 }}>{s.recovery}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--sky)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'DM Serif Display,serif', fontSize: 14 }}>
                            {s.doctor[0]}
                          </div>
                          <div>
                            <div style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: 1 }}>SPECIALIST CLASS</div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy)' }}>{s.doctor}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    <Link href="/appointments" className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center', marginTop: 'auto' }}>
                      Request Home Service / Visit
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
