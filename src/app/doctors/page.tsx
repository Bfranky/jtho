'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsApp from '@/components/layout/WhatsApp';

interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  specialty: string | null;
  qualifications: string | null;
  experience: number | null;
  bio: string | null;
  imageUrl: string | null;
  availableDays: string[];
}

export default function DoctorsPage() {
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const res = await fetch('/api/staff');
      const json = await res.json();
      if (json.success && json.data.length > 0) {
        setStaffList(json.data);
      }
      // If empty, staffList stays [] and we show the register CTA below
    } catch (err) {
      console.error('Error fetching staff:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = staffList.filter(d => {
    const matchRole = roleFilter === 'All' || d.role === roleFilter;
    const fullName = `${d.firstName} ${d.lastName}`.toLowerCase();
    const specialtyText = (d.specialty || '').toLowerCase();
    const matchSearch = fullName.includes(search.toLowerCase()) || specialtyText.includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'DOCTOR': return 'Orthopaedic Specialist';
      case 'PHYSIOTHERAPIST': return 'Physiotherapist & Rehab Expert';
      case 'NURSE': return 'Nursing Officer & Massage Therapist';
      case 'PHARMACIST': return 'Clinical Pharmacist';
      case 'RECEPTIONIST': return 'Clinical Administrator';
      case 'ADMIN': return 'System Administrator';
      default: return role;
    }
  };

  return (
    <>
      <Navbar />

      {/* Hero Header */}
      <div className="page-hero" style={{ background: 'linear-gradient(135deg, var(--navy), #0F766E)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="section-label" style={{ color: 'var(--teal-light)' }}>
            <span style={{ background: 'var(--teal-light)' }} /> Professional Medical Team
          </div>
          <h1 className="serif" style={{ fontSize: 'clamp(36px,5vw,56px)', color: '#fff', lineHeight: 1.1, marginBottom: 16 }}>
            Our Medical Specialists
          </h1>
          <p style={{ color: 'rgba(255,255,255,.65)', fontSize: 16, maxWidth: 540 }}>
            Highly qualified clinical doctors, massage therapists, and physiotherapists — dedicated to restoring your mobility.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="container-responsive-padding" style={{ background: '#fff', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', flex: 1 }}>
            <input className="input" placeholder="🔍 Search name or specialty..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 280 }} />
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['All', 'DOCTOR', 'PHYSIOTHERAPIST', 'NURSE', 'PHARMACIST'].map(role => (
                <button key={role} onClick={() => setRoleFilter(role)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 20,
                    border: '1px solid var(--border)',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all .2s',
                    background: roleFilter === role ? 'var(--sky)' : '#fff',
                    color: roleFilter === role ? '#fff' : 'var(--muted)'
                  }}>
                  {role === 'All' ? 'All Roles' : role}
                </button>
              ))}
            </div>
          </div>

          <Link href="/staff" className="btn btn-outline btn-sm" style={{ fontWeight: 700 }}>
            💼 Medical Staff Register / Login
          </Link>
        </div>
      </div>

      {/* Team grid */}
      <section className="section-responsive-padding" style={{ background: 'var(--cream)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px', color: 'var(--muted)', fontSize: 16 }}>Loading our clinical specialists...</div>
          ) : staffList.length === 0 ? (
            /* No doctors at all — prompt registration */
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <div style={{ display: 'inline-block', background: '#fff', border: '1px dashed var(--border)', borderRadius: 16, padding: '60px 48px', maxWidth: 520 }}>
                <div style={{ fontSize: 56, marginBottom: 20 }}>🏥</div>
                <h2 className="serif" style={{ color: 'var(--navy)', fontSize: 28, marginBottom: 12 }}>No Doctors Registered Yet</h2>
                <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.8, marginBottom: 28 }}>
                  Our doctors section is powered by real registered clinicians.<br />
                  Are you a specialist at Jesus The Healer Orthopaedic Home?<br />
                  <strong>Register via the Staff Portal</strong> to appear here.
                </p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Link href="/staff" className="btn btn-primary">Register as a Doctor</Link>
                  <Link href="/appointments" className="btn btn-outline">Book Appointment</Link>
                </div>
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px', color: 'var(--muted)', fontSize: 16 }}>No clinical staff found matching your criteria.</div>

          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 24 }}>
              {filtered.map(d => (
                <div key={d.id} className="card" style={{ overflow: 'hidden', background: '#fff', display: 'flex', flexDirection: 'column', height: '100%' }}>
                  
                  {/* Photo */}
                  <div style={{ height: 240, position: 'relative', overflow: 'hidden', background: 'var(--light)' }}>
                    <img src={d.imageUrl || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80'} alt={`${d.firstName} ${d.lastName}`} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block', transition: 'transform .5s ease' }}
                      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
                      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(10,22,40,.65),transparent)' }} />
                    
                    {/* Role badge */}
                    <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(15,118,110,.95)', color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', padding: '5px 12px', borderRadius: 20 }}>
                      {d.role}
                    </div>

                    <div style={{ position: 'absolute', bottom: 14, left: 14 }}>
                      <div style={{ fontFamily: 'DM Serif Display,serif', color: '#fff', fontSize: 18, lineHeight: 1.1 }}>{d.role === 'DOCTOR' ? 'Dr.' : ''} {d.firstName} {d.lastName}</div>
                      <div style={{ color: 'rgba(255,255,255,.75)', fontSize: 11, letterSpacing: 1, marginTop: 4 }}>{d.qualifications || ''}</div>
                    </div>
                  </div>

                  {/* Info */}
                  <div style={{ padding: '20px 22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ color: 'var(--sky)', fontSize: 12, fontWeight: 700, letterSpacing: .5, marginBottom: 8 }}>
                      {getRoleLabel(d.role)}
                    </div>
                    
                    {d.specialty && (
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy)', marginBottom: 12 }}>
                        Focus: {d.specialty}
                      </div>
                    )}

                    {d.experience && (
                      <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 12 }}>
                        ⭐ {d.experience} Years Musculoskeletal Experience
                      </div>
                    )}

                    <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 16 }}>
                      📅 Available: {d.availableDays ? d.availableDays.join(', ') : 'Mon - Fri'}
                    </div>

                    {/* Expand bio */}
                    <button onClick={() => setExpanded(expanded === d.id ? null : d.id)}
                      style={{ background: 'none', border: 'none', color: 'var(--sky)', fontSize: 12, fontWeight: 600, cursor: 'pointer', padding: 0, marginBottom: 16, textAlign: 'left' }}>
                      {expanded === d.id ? '▲ Hide clinical biography' : '▼ Read clinical biography'}
                    </button>

                    {expanded === d.id && d.bio && (
                      <div style={{ background: 'var(--light)', padding: '14px', borderRadius: 8, marginBottom: 16 }}>
                        <p style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.7 }}>{d.bio}</p>
                      </div>
                    )}

                    <Link href={`/appointments?doctor=${d.id}`} className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center', marginTop: 'auto' }}>
                      Book Consultation / Home Service
                    </Link>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      <Footer />
      <WhatsApp />
    </>
  );
}
