'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsApp from '@/components/layout/WhatsApp';

// Actual services offered by Jesus The Healer Orthopaedic Home
const SERVICES = [
  { icon: '🦴', label: 'Orthopaedics & Joint Care' },
  { icon: '💆', label: 'Machine & Manual Massage' },
  { icon: '🤲', label: 'Physiotherapy & Rehab' },
  { icon: '🦵', label: 'Fractures & Spinal Cord' },
  { icon: '🧠', label: 'Arthritis Treatment' },
  { icon: '⚡', label: 'Rheumatism Recovery' },
  { icon: '🏡', label: 'Home Visit / Domiciliary Care' },
  { icon: '🩹', label: 'Post-Surgery Rehabilitation' },
];

const TIME_SLOTS = [
  '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
  '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM',
];

interface BookingData {
  service: string;
  date: string;
  time: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  dob: string;
  gender: string;
  notes: string;
}

const STEPS = ['Service', 'Date & Time', 'Your Details', 'Confirm'];

export default function AppointmentsPage() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<BookingData>({
    service: '', date: '', time: '',
    firstName: '', lastName: '', phone: '',
    email: '', dob: '', gender: '', notes: '',
  });
  const [done, setDone]   = useState(false);
  const [ref,  setRef]    = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k: keyof BookingData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setData(d => ({ ...d, [k]: e.target.value }));

  const confirm = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName:  data.lastName,
          phone:     data.phone,
          email:     data.email,
          dob:       data.dob,
          gender:    data.gender,
          department: data.service,
          date:      data.date,
          time:      data.time,
          notes:     data.notes,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setRef(json.data?.appointmentRef || `APT-${Date.now().toString().slice(-8)}`);
        setDone(true);
      } else {
        alert(json.error || 'Booking failed. Please try again.');
      }
    } catch {
      alert('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Success screen ──────────────────────────────────────────────
  if (done) return (
    <>
      <Navbar />
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--cream)', padding: '40px 20px' }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: '60px 48px', maxWidth: 540, width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(10,22,40,.1)' }}>
          <div style={{ width: 72, height: 72, background: 'rgba(22,163,74,.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto 24px' }}>✅</div>
          <h2 className="serif" style={{ color: 'var(--navy)', fontSize: 32, marginBottom: 10 }}>Appointment Booked!</h2>
          <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 24, lineHeight: 1.7 }}>
            We will call <strong>{data.phone}</strong> to confirm your visit. Please be available. God bless you!
          </p>
          <div style={{ background: 'var(--light)', border: '1px solid var(--border)', borderRadius: 8, padding: '18px 24px', marginBottom: 24, textAlign: 'left' }}>
            <div className="form-grid-2col">
              {[
                ['Appointment ID', ref],
                ['Service',        data.service],
                ['Date',           data.date],
                ['Time',           data.time],
                ['Patient',        `${data.firstName} ${data.lastName}`],
                ['Phone',          data.phone],
              ].map(([label, val]) => (
                <div key={label}>
                  <div style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 3 }}>{label}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy)' }}>{val}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => window.print()} className="btn btn-outline btn-sm">🖨 Print</button>
            <Link href="/" className="btn btn-primary btn-sm">Back to Home</Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );

  // ── Main booking form ───────────────────────────────────────────
  return (
    <>
      <Navbar />

      <div className="page-hero">
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="section-label" style={{ color: 'var(--teal-light)' }}><span style={{ background: 'var(--teal-light)' }} />Book Now</div>
          <h1 className="serif" style={{ fontSize: 'clamp(34px,5vw,54px)', color: '#fff', marginBottom: 12 }}>Book an Appointment</h1>
          <p style={{ color: 'rgba(255,255,255,.6)', fontSize: 15 }}>Simple 4-step booking. We'll confirm your appointment by phone.</p>
        </div>
      </div>

      <section className="section-responsive-padding" style={{ background: 'var(--cream)' }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>

          {/* Step indicator */}
          <div style={{ display: 'flex', gap: 0, marginBottom: 40 }}>
            {STEPS.map((s, i) => (
              <div key={s} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: 8 }}>
                  {i > 0 && <div style={{ flex: 1, height: 2, background: step > i ? 'var(--sky)' : 'var(--border)', transition: 'background .3s' }} />}
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: step > i + 1 ? 'var(--teal)' : step === i + 1 ? 'var(--sky)' : 'var(--border)', color: step >= i + 1 ? '#fff' : 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0, transition: 'all .3s' }}>
                    {step > i + 1 ? '✓' : i + 1}
                  </div>
                  {i < STEPS.length - 1 && <div style={{ flex: 1, height: 2, background: step > i + 1 ? 'var(--sky)' : 'var(--border)', transition: 'background .3s' }} />}
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, color: step === i + 1 ? 'var(--sky)' : 'var(--muted)', letterSpacing: .5 }}>{s}</div>
              </div>
            ))}
          </div>

          {/* Form card */}
          <div className="card-responsive-padding" style={{ background: '#fff', border: '1px solid var(--border)', borderTop: '3px solid var(--sky)', borderRadius: 10 }}>

            {/* ── STEP 1: Service ── */}
            {step === 1 && (
              <>
                <h3 className="serif" style={{ color: 'var(--navy)', fontSize: 26, marginBottom: 8 }}>Select Service</h3>
                <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 28 }}>Choose the treatment or service that best matches your needs.</p>
                <div className="form-grid-2col" style={{ marginBottom: 32 }}>
                  {SERVICES.map(svc => (
                    <button key={svc.label} onClick={() => setData(d => ({ ...d, service: svc.label }))}
                      style={{
                        padding: '16px 18px',
                        border: `2px solid ${data.service === svc.label ? 'var(--sky)' : 'var(--border)'}`,
                        borderRadius: 10,
                        background: data.service === svc.label ? 'rgba(37,99,235,.06)' : '#fff',
                        color: 'var(--navy)',
                        fontSize: 14,
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'all .2s',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                      }}>
                      <span style={{ fontSize: 22, flexShrink: 0 }}>{svc.icon}</span>
                      <span>{svc.label}</span>
                    </button>
                  ))}
                </div>
                <button className="btn btn-primary" onClick={() => setStep(2)} disabled={!data.service} style={{ opacity: data.service ? 1 : .5 }}>
                  Continue →
                </button>
              </>
            )}

            {/* ── STEP 2: Date & Time ── */}
            {step === 2 && (
              <>
                <h3 className="serif" style={{ color: 'var(--navy)', fontSize: 26, marginBottom: 8 }}>Choose Date & Time</h3>
                <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 28 }}>Pick your preferred appointment date and available time slot.</p>

                {/* Date picker */}
                <div style={{ marginBottom: 28 }}>
                  <label className="label">Preferred Date</label>
                  <input
                    type="date"
                    className="input"
                    value={data.date}
                    onChange={set('date')}
                    min={new Date().toISOString().split('T')[0]}
                    style={{ maxWidth: 320 }}
                  />
                </div>

                {/* Time slots */}
                <div style={{ marginBottom: 32 }}>
                  <label className="label" style={{ marginBottom: 12 }}>Available Time Slots</label>
                  <div className="responsive-grid-4col" style={{ gap: 10 }}>
                    {TIME_SLOTS.map(slot => (
                      <button
                        key={slot}
                        onClick={() => setData(d => ({ ...d, time: slot }))}
                        style={{
                          padding: '12px 8px',
                          borderRadius: 8,
                          border: `2px solid ${data.time === slot ? 'var(--sky)' : 'var(--border)'}`,
                          background: data.time === slot ? 'var(--sky)' : '#fff',
                          color: data.time === slot ? '#fff' : 'var(--navy)',
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all .2s',
                          textAlign: 'center',
                        }}>
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                  <button className="btn btn-outline" onClick={() => setStep(1)}>← Back</button>
                  <button
                    className="btn btn-primary"
                    onClick={() => setStep(3)}
                    disabled={!data.date || !data.time}
                    style={{ opacity: data.date && data.time ? 1 : .5 }}>
                    Continue →
                  </button>
                </div>
              </>
            )}

            {/* ── STEP 3: Patient Details ── */}
            {step === 3 && (
              <>
                <h3 className="serif" style={{ color: 'var(--navy)', fontSize: 26, marginBottom: 8 }}>Your Details</h3>
                <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 28 }}>Please fill in your personal information accurately.</p>
                <div className="form-grid-2col">
                  <div><label className="label">First Name *</label><input className="input" value={data.firstName} onChange={set('firstName')} placeholder="First name" /></div>
                  <div><label className="label">Last Name *</label><input className="input" value={data.lastName} onChange={set('lastName')} placeholder="Last name" /></div>
                  <div><label className="label">Phone Number *</label><input className="input" value={data.phone} onChange={set('phone')} placeholder="0803 000 0000" /></div>
                  <div><label className="label">Email Address</label><input type="email" className="input" value={data.email} onChange={set('email')} placeholder="your@email.com" /></div>
                  <div><label className="label">Date of Birth</label><input type="date" className="input" value={data.dob} onChange={set('dob')} /></div>
                  <div>
                    <label className="label">Gender</label>
                    <select className="select" value={data.gender} onChange={set('gender')}>
                      <option value="">Select gender</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                <div style={{ marginBottom: 28 }}>
                  <label className="label">Symptoms / Notes</label>
                  <textarea className="input" rows={3} style={{ resize: 'vertical' }} value={data.notes} onChange={set('notes')} placeholder="Brief description of your condition or reason for visit..." />
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button className="btn btn-outline" onClick={() => setStep(2)}>← Back</button>
                  <button
                    className="btn btn-primary"
                    onClick={() => setStep(4)}
                    disabled={!data.firstName || !data.lastName || !data.phone}
                    style={{ opacity: data.firstName && data.lastName && data.phone ? 1 : .5 }}>
                    Continue →
                  </button>
                </div>
              </>
            )}

            {/* ── STEP 4: Confirm ── */}
            {step === 4 && (
              <>
                <h3 className="serif" style={{ color: 'var(--navy)', fontSize: 26, marginBottom: 8 }}>Confirm Booking</h3>
                <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 24 }}>Please review your appointment details before confirming.</p>
                <div style={{ background: 'var(--light)', border: '1px solid var(--border)', borderRadius: 8, padding: '20px 24px', marginBottom: 24 }}>
                  {[
                    ['Service',   data.service],
                    ['Date',      data.date],
                    ['Time',      data.time],
                    ['Patient',   `${data.firstName} ${data.lastName}`],
                    ['Phone',     data.phone],
                    ['Notes',     data.notes || 'None'],
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', gap: 16, paddingBottom: 10, marginBottom: 10, borderBottom: '1px solid var(--border)' }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', width: 80, flexShrink: 0, textTransform: 'uppercase', letterSpacing: .5, paddingTop: 1 }}>{k}</span>
                      <span style={{ fontSize: 14, color: 'var(--navy)', fontWeight: 500 }}>{v}</span>
                    </div>
                  ))}
                </div>
                <div style={{ background: 'rgba(13,148,136,.06)', border: '1px solid rgba(13,148,136,.2)', borderRadius: 8, padding: '12px 16px', marginBottom: 24, fontSize: 13, color: 'var(--teal)', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ flexShrink: 0 }}>📞</span>
                  <span>Our team will call <strong>{data.phone}</strong> shortly after booking to confirm your appointment slot.</span>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button className="btn btn-outline" onClick={() => setStep(3)}>← Back</button>
                  <button className="btn btn-teal btn-lg" onClick={confirm} disabled={loading}>
                    {loading ? 'Booking...' : '✚ Confirm Appointment'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <Footer />
      <WhatsApp />
    </>
  );
}
