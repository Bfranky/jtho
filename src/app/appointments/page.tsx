'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsApp from '@/components/layout/WhatsApp';

// Departments focused on the hospital's bone & spinal cord specialisation
const DEPARTMENTS = [
  'Orthopaedic Surgery',
  'Spinal Cord & Neurosurgery',
  'Bone Fracture & Trauma',
  'Spinal Rehabilitation',
  'Paediatric Orthopaedics',
  'Physiotherapy & Rehab',
  'Joint Replacement',
  'Bone Tumour & Oncology',
];

const DEFAULT_SLOTS = ['08:00 AM','09:00 AM','10:00 AM','11:00 AM','12:00 PM','02:00 PM','03:00 PM','04:00 PM'];

interface RegisteredDoctor {
  id: string;
  name: string;
  dept: string;
  slots: string[];
}

interface BookingData {
  department: string; doctorId: string; date: string; time: string;
  firstName: string; lastName: string; phone: string; email: string; dob: string; gender: string; notes: string;
}

const STEPS = ['Department','Doctor & Time','Your Details','Confirm'];

export default function AppointmentsPage() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<BookingData>({ department:'', doctorId:'', date:'', time:'', firstName:'', lastName:'', phone:'', email:'', dob:'', gender:'', notes:'' });
  const [done, setDone] = useState(false);
  const [ref,  setRef]  = useState('');
  const [doctorsList, setDoctorsList] = useState<RegisteredDoctor[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  useEffect(() => {
    fetch('/api/staff')
      .then(r => r.json())
      .then(json => {
        if (json.success && json.data?.length > 0) {
          const mapped: RegisteredDoctor[] = json.data
            .filter((s: { role: string }) => s.role === 'DOCTOR' || s.role === 'PHYSIOTHERAPIST')
            .map((s: { id: string; firstName: string; lastName: string; role: string; specialty: string | null }) => ({
              id: s.id,
              name: `${s.role === 'DOCTOR' ? 'Dr.' : 'Mrs.'} ${s.firstName} ${s.lastName}`,
              dept: s.specialty || 'Orthopaedic Surgery',
              slots: DEFAULT_SLOTS,
            }));
          setDoctorsList(mapped);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingDoctors(false));
  }, []);

  const set = (k: keyof BookingData) => (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) =>
    setData(d => ({ ...d, [k]: e.target.value }));

  const filteredDoctors = doctorsList.filter(d => !data.department || d.dept === data.department);
  const selectedDoctor  = doctorsList.find(d => d.id === data.doctorId);

  const confirm = async () => {
    const newRef = `APT-${Date.now().toString().slice(-8)}`;
    setRef(newRef);
    // In production: await fetch('/api/appointments', { method:'POST', body: JSON.stringify(data) })
    setDone(true);
  };

  if (done) return (
    <>
      <Navbar />
      <div style={{ minHeight:'80vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--cream)', padding:'40px 20px' }}>
        <div style={{ background:'#fff', borderRadius:16, padding:'60px 48px', maxWidth:540, width:'100%', textAlign:'center', boxShadow:'0 20px 60px rgba(10,22,40,.1)' }}>
          <div style={{ width:72, height:72, background:'rgba(22,163,74,.1)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:36, margin:'0 auto 24px' }}>✅</div>
          <h2 className="serif" style={{ color:'var(--navy)', fontSize:32, marginBottom:10 }}>Appointment Booked!</h2>
          <div style={{ background:'var(--light)', border:'1px solid var(--border)', borderRadius:8, padding:'18px 24px', marginBottom:24, textAlign:'left' }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              {[
                ['Appointment ID', ref],
                ['Doctor', selectedDoctor?.name ?? '—'],
                ['Date', data.date],
                ['Time', data.time],
                ['Patient', `${data.firstName} ${data.lastName}`],
                ['Department', data.department],
              ].map(([label, val]) => (
                <div key={label}>
                  <div style={{ fontSize:10, color:'var(--muted)', letterSpacing:1, textTransform:'uppercase', marginBottom:3 }}>{label}</div>
                  <div style={{ fontSize:13, fontWeight:600, color:'var(--navy)' }}>{val}</div>
                </div>
              ))}
            </div>
          </div>
          <p style={{ color:'var(--muted)', fontSize:14, marginBottom:28, lineHeight:1.7 }}>
            We will call <strong>{data.phone}</strong> to confirm your appointment. Please arrive 15 minutes early. God bless you!
          </p>
          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            <button onClick={() => window.print()} className="btn btn-outline btn-sm">🖨 Print</button>
            <Link href="/" className="btn btn-primary btn-sm">Back to Home</Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );

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

      <section style={{ padding: '60px 40px', background: 'var(--cream)' }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>

          {/* Step indicator */}
          <div style={{ display: 'flex', gap: 0, marginBottom: 40 }}>
            {STEPS.map((s, i) => (
              <div key={s} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: 8 }}>
                  {i > 0 && <div style={{ flex: 1, height: 2, background: step > i ? 'var(--sky)' : 'var(--border)', transition: 'background .3s' }} />}
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: step > i+1 ? 'var(--teal)' : step === i+1 ? 'var(--sky)' : 'var(--border)', color: step >= i+1 ? '#fff' : 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0, transition: 'all .3s' }}>
                    {step > i+1 ? '✓' : i+1}
                  </div>
                  {i < STEPS.length-1 && <div style={{ flex: 1, height: 2, background: step > i+1 ? 'var(--sky)' : 'var(--border)', transition: 'background .3s' }} />}
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, color: step === i+1 ? 'var(--sky)' : 'var(--muted)', letterSpacing: .5 }}>{s}</div>
              </div>
            ))}
          </div>

          {/* Form card */}
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderTop: '3px solid var(--sky)', borderRadius: 10, padding: '40px' }}>

            {/* Step 1 — Department */}
            {step === 1 && (
              <>
                <h3 className="serif" style={{ color: 'var(--navy)', fontSize: 26, marginBottom: 8 }}>Select Department</h3>
                <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 28 }}>Choose the department that best matches your condition.</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 32 }}>
                  {DEPARTMENTS.map(dept => (
                    <button key={dept} onClick={() => setData(d => ({ ...d, department: dept }))}
                      style={{ padding: '16px', border: `2px solid ${data.department === dept ? 'var(--sky)' : 'var(--border)'}`, borderRadius: 8, background: data.department === dept ? 'rgba(37,99,235,.06)' : '#fff', color: 'var(--navy)', fontSize: 14, fontWeight: 500, cursor: 'pointer', transition: 'all .2s', textAlign: 'left' }}>
                      {dept}
                    </button>
                  ))}
                </div>
                <button className="btn btn-primary" onClick={() => setStep(2)} disabled={!data.department} style={{ opacity: data.department ? 1 : .5 }}>Continue →</button>
              </>
            )}

            {/* Step 2 — Doctor & Time */}
            {step === 2 && (
              <>
                <h3 className="serif" style={{ color: 'var(--navy)', fontSize: 26, marginBottom: 8 }}>Choose Doctor & Time</h3>
                <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 28 }}>Select your preferred doctor and appointment slot.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
                  {loadingDoctors ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)', fontSize: 14 }}>Loading available doctors…</div>
                  ) : filteredDoctors.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 20px', background: 'var(--light)', borderRadius: 10, border: '1px dashed var(--border)' }}>
                      <div style={{ fontSize: 36, marginBottom: 12 }}>🩺</div>
                      <div style={{ fontWeight: 700, color: 'var(--navy)', marginBottom: 8 }}>No doctors registered yet</div>
                      <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 16, lineHeight: 1.6 }}>
                        Doctors for <strong>{data.department}</strong> have not yet registered on the platform.<br />
                        Please call us directly or check back soon.
                      </p>
                      <Link href="/staff" className="btn btn-outline btn-sm">Doctors — Register Here</Link>
                    </div>
                  ) : (
                    filteredDoctors.map(doc => (
                      <div key={doc.id} onClick={() => setData(d => ({ ...d, doctorId: doc.id, time: '' }))}
                        style={{ padding: '16px 18px', border: `2px solid ${data.doctorId === doc.id ? 'var(--sky)' : 'var(--border)'}`, borderRadius: 8, cursor: 'pointer', background: data.doctorId === doc.id ? 'rgba(37,99,235,.04)' : '#fff', transition: 'all .2s' }}>
                        <div style={{ fontWeight: 600, color: 'var(--navy)', marginBottom: 4 }}>{doc.name}</div>
                        <div style={{ color: 'var(--muted)', fontSize: 12, marginBottom: data.doctorId === doc.id ? 14 : 0 }}>{doc.dept}</div>
                        {data.doctorId === doc.id && (
                          <div>
                            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--sky)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Available Slots</div>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                              {doc.slots.map(slot => (
                                <button key={slot} onClick={e => { e.stopPropagation(); setData(d => ({ ...d, time: slot })); }}
                                  style={{ padding: '6px 14px', borderRadius: 6, border: `1.5px solid ${data.time === slot ? 'var(--sky)' : 'var(--border)'}`, background: data.time === slot ? 'var(--sky)' : '#fff', color: data.time === slot ? '#fff' : 'var(--navy)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                                  {slot}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
                <div style={{ marginBottom: 28 }}>
                  <label className="label">Preferred Date</label>
                  <input type="date" className="input" value={data.date} onChange={set('date')} min={new Date().toISOString().split('T')[0]} />
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button className="btn btn-outline" onClick={() => setStep(1)}>← Back</button>
                  <button className="btn btn-primary" onClick={() => setStep(3)} disabled={!data.doctorId || !data.time || !data.date} style={{ opacity: data.doctorId && data.time && data.date ? 1 : .5 }}>Continue →</button>
                </div>
              </>
            )}

            {/* Step 3 — Patient Details */}
            {step === 3 && (
              <>
                <h3 className="serif" style={{ color: 'var(--navy)', fontSize: 26, marginBottom: 8 }}>Your Details</h3>
                <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 28 }}>Please fill in your information accurately.</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div><label className="label">First Name *</label><input className="input" value={data.firstName} onChange={set('firstName')} placeholder="First name" /></div>
                  <div><label className="label">Last Name *</label><input className="input" value={data.lastName} onChange={set('lastName')} placeholder="Last name" /></div>
                  <div><label className="label">Phone *</label><input className="input" value={data.phone} onChange={set('phone')} placeholder="0803 000 0000" /></div>
                  <div><label className="label">Email</label><input type="email" className="input" value={data.email} onChange={set('email')} placeholder="your@email.com" /></div>
                  <div><label className="label">Date of Birth</label><input type="date" className="input" value={data.dob} onChange={set('dob')} /></div>
                  <div><label className="label">Gender</label>
                    <select className="select" value={data.gender} onChange={set('gender')}>
                      <option value="">Select</option><option>Male</option><option>Female</option><option>Other</option>
                    </select>
                  </div>
                </div>
                <div style={{ marginBottom: 28 }}>
                  <label className="label">Symptoms / Notes</label>
                  <textarea className="input" rows={3} style={{ resize: 'vertical' }} value={data.notes} onChange={set('notes')} placeholder="Brief description of your symptoms or reason for visit..." />
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button className="btn btn-outline" onClick={() => setStep(2)}>← Back</button>
                  <button className="btn btn-primary" onClick={() => setStep(4)} disabled={!data.firstName || !data.lastName || !data.phone} style={{ opacity: data.firstName && data.lastName && data.phone ? 1 : .5 }}>Continue →</button>
                </div>
              </>
            )}

            {/* Step 4 — Confirm */}
            {step === 4 && (
              <>
                <h3 className="serif" style={{ color: 'var(--navy)', fontSize: 26, marginBottom: 8 }}>Confirm Booking</h3>
                <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 24 }}>Please review your appointment details before confirming.</p>
                <div style={{ background: 'var(--light)', border: '1px solid var(--border)', borderRadius: 8, padding: '20px 24px', marginBottom: 24 }}>
                  {[
                    ['Department',    data.department],
                    ['Doctor',        selectedDoctor?.name ?? '—'],
                    ['Date',          data.date],
                    ['Time',          data.time],
                    ['Patient',       `${data.firstName} ${data.lastName}`],
                    ['Phone',         data.phone],
                    ['Notes',         data.notes || 'None'],
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', gap: 16, paddingBottom: 10, marginBottom: 10, borderBottom: '1px solid var(--border)' }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', width: 110, flexShrink: 0, textTransform: 'uppercase', letterSpacing: .5, paddingTop: 1 }}>{k}</span>
                      <span style={{ fontSize: 14, color: 'var(--navy)', fontWeight: 500 }}>{v}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button className="btn btn-outline" onClick={() => setStep(3)}>← Back</button>
                  <button className="btn btn-teal btn-lg" onClick={confirm}>✚ Confirm Appointment</button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <Footer />
      <WhatsApp />
      <style>{`@media(max-width:600px){section{padding:40px 20px!important} div[style*="grid-template-columns: 1fr 1fr"]{grid-template-columns:1fr!important}}`}</style>
    </>
  );
}
