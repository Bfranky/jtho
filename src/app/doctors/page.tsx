'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsApp from '@/components/layout/WhatsApp';

const DOCTORS = [
  {
    id: 'd1',
    name: 'Dr. Adebayo Olusola',
    role: 'Chief Orthopaedic Surgeon',
    specialty: 'Orthopaedic Surgeon',
    qualifications: 'MBBS, FRCS (Ortho)',
    experience: 18,
    rating: 4.9,
    reviews: 142,
    availability: ['Monday', 'Wednesday', 'Friday'],
    tags: ['Joint Replacement', 'Fractures', 'Trauma Surgery'],
    bio: 'Dr. Olusola is our chief orthopaedic surgeon with 18 years of specialist experience in joint replacement, complex fracture management, and orthopaedic trauma. He holds fellowship qualifications from the Royal College of Surgeons and is deeply committed to evidence-based, patient-centred care.',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80',
    slots: ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'],
  },
  {
    id: 'd2',
    name: 'Dr. Ngozi Anyanwu',
    role: 'Consultant Orthopaedist',
    specialty: 'Spine Specialist',
    qualifications: 'MBBS, MWACS (Ortho)',
    experience: 12,
    rating: 4.8,
    reviews: 98,
    availability: ['Tuesday', 'Thursday', 'Saturday'],
    tags: ['Spine Care', 'Paediatric Ortho', 'Scoliosis'],
    bio: 'Dr. Anyanwu specialises in spinal conditions and paediatric orthopaedics, combining precise diagnosis with a compassionate, patient-first approach. She has a particular interest in minimally invasive techniques for spine surgery and developmental conditions in children.',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
    slots: ['09:30 AM', '11:30 AM', '02:30 PM'],
  },
  {
    id: 'd3',
    name: 'Mrs. Funmilayo Oke',
    role: 'Lead Physiotherapist',
    specialty: 'Physiotherapist',
    qualifications: 'BPT, MPT (Ortho)',
    experience: 11,
    rating: 4.9,
    reviews: 87,
    availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    tags: ['Physiotherapy', 'Sports Rehab', 'Mobility'],
    bio: 'Mrs. Oke leads our physiotherapy department with a focus on personalised recovery programs. She has extensive experience in sports injury rehabilitation, post-surgical recovery, and chronic pain management, combining manual therapy with evidence-based exercise protocols.',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=400&q=80',
    slots: ['08:00 AM', '10:00 AM', '12:00 PM', '02:00 PM', '04:00 PM'],
  },
  {
    id: 'd4',
    name: 'Pharm. Taiwo Adeyemi',
    role: 'Clinical Pharmacist',
    specialty: 'Pharmacist',
    qualifications: 'B.Pharm, RPh',
    experience: 9,
    rating: 4.7,
    reviews: 54,
    availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    tags: ['Drug Therapy', 'Pain Management', 'Counselling'],
    bio: 'Pharm. Adeyemi manages all clinical pharmacy services, ensuring safe and effective medication management for our patients. He provides expert drug therapy counselling and works closely with the medical team to optimise treatment outcomes.',
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=400&q=80',
    slots: ['09:00 AM', '11:00 AM', '01:00 PM', '03:00 PM'],
  },
];

const SPECIALTIES = ['All', 'Orthopaedic Surgeon', 'Spine Specialist', 'Physiotherapist', 'Pharmacist'];

export default function DoctorsPage() {
  const [specialty, setSpecialty] = useState('All');
  const [search,    setSearch]    = useState('');
  const [expanded,  setExpanded]  = useState<string | null>(null);

  const filtered = DOCTORS.filter(d => {
    const matchSpec   = specialty === 'All' || d.specialty === specialty;
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
                        d.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchSpec && matchSearch;
  });

  return (
    <>
      <Navbar />

      <div className="page-hero">
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="section-label" style={{ color: 'var(--teal-light)' }}>
            <span style={{ background: 'var(--teal-light)' }} /> Meet The Team
          </div>
          <h1 className="serif" style={{ fontSize: 'clamp(36px,5vw,56px)', color: '#fff', lineHeight: 1.1, marginBottom: 16 }}>
            Our Medical Specialists
          </h1>
          <p style={{ color: 'rgba(255,255,255,.6)', fontSize: 16, maxWidth: 500 }}>
            Qualified, experienced, and compassionate — our team is dedicated to your recovery.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ background: '#fff', borderBottom: '1px solid var(--border)', padding: '20px 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <input className="input" placeholder="🔍 Search by name or specialty..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 280 }} />
          <div style={{ display: 'flex', gap: 8 }}>
            {SPECIALTIES.map(s => (
              <button key={s} onClick={() => setSpecialty(s)}
                style={{ padding: '8px 16px', borderRadius: 20, border: '1px solid var(--border)', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all .2s', background: specialty === s ? 'var(--sky)' : '#fff', color: specialty === s ? '#fff' : 'var(--muted)' }}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Doctors grid */}
      <section style={{ padding: '60px 40px', background: 'var(--cream)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px', color: 'var(--muted)', fontSize: 16 }}>No doctors found matching your search.</div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 24 }}>
            {filtered.map(d => (
              <div key={d.id} className="card" style={{ overflow: 'hidden', background: '#fff' }}>
                {/* Photo */}
                <div style={{ height: 220, position: 'relative', overflow: 'hidden', background: 'var(--light)' }}>
                  <img src={d.image} alt={d.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block', transition: 'transform .5s ease' }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.06)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(10,22,40,.65),transparent)' }} />
                  {/* Availability badge */}
                  <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(22,163,74,.9)', color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', padding: '5px 10px', borderRadius: 20 }}>
                    {d.availability.length === 6 ? 'Mon–Sat' : d.availability.slice(0,2).map(a => a.slice(0,3)).join(', ')}
                  </div>
                  <div style={{ position: 'absolute', bottom: 14, left: 14 }}>
                    <div style={{ fontFamily: 'DM Serif Display,serif', color: '#fff', fontSize: 17, lineHeight: 1.1 }}>{d.name}</div>
                    <div style={{ color: 'rgba(255,255,255,.7)', fontSize: 11, letterSpacing: 1 }}>{d.qualifications}</div>
                  </div>
                </div>

                {/* Info */}
                <div style={{ padding: '20px 22px' }}>
                  <div style={{ color: 'var(--sky)', fontSize: 12, fontWeight: 700, letterSpacing: .5, marginBottom: 4 }}>{d.role}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <span style={{ color: '#F59E0B', fontSize: 13 }}>{'★'.repeat(Math.floor(d.rating))}</span>
                    <span style={{ color: 'var(--navy)', fontSize: 13, fontWeight: 700 }}>{d.rating}</span>
                    <span style={{ color: 'var(--muted)', fontSize: 12 }}>({d.reviews} reviews)</span>
                    <span style={{ color: 'var(--muted)', fontSize: 12, marginLeft: 'auto' }}>{d.experience} yrs</span>
                  </div>
                  {/* Tags */}
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                    {d.tags.map(tag => (
                      <span key={tag} className="badge badge-blue" style={{ fontSize: 10 }}>{tag}</span>
                    ))}
                  </div>

                  {/* Expand bio */}
                  <button onClick={() => setExpanded(expanded === d.id ? null : d.id)}
                    style={{ background: 'none', border: 'none', color: 'var(--sky)', fontSize: 12, fontWeight: 600, cursor: 'pointer', padding: 0, marginBottom: 12 }}>
                    {expanded === d.id ? '▲ Hide profile' : '▼ View full profile'}
                  </button>

                  {expanded === d.id && (
                    <div style={{ background: 'var(--light)', padding: '14px', borderRadius: 8, marginBottom: 14 }}>
                      <p style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.7, marginBottom: 12 }}>{d.bio}</p>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--navy)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Available Slots</div>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {d.slots.map(slot => (
                          <span key={slot} style={{ padding: '5px 12px', background: '#fff', border: '1px solid var(--border)', borderRadius: 6, fontSize: 12, fontWeight: 600, color: 'var(--navy)' }}>{slot}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  <Link href={`/appointments?doctor=${d.id}`} className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                    Book with {d.name.split(' ')[0]} {d.name.split(' ')[1]}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <WhatsApp />
      <style>{`@media(max-width:600px){section,div[style*="padding: '20px 40px'"]{padding:20px!important}}`}</style>
    </>
  );
}
