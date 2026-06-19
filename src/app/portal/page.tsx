'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';

type Tab = 'dashboard' | 'appointments' | 'records' | 'prescriptions' | 'vitals';

const STATUS_BADGE: Record<string, string> = {
  'ACTIVE':      'badge-green',
  'CONFIRMED':   'badge-green',
  'PENDING':     'badge-gold',
  'COMPLETED':   'badge-blue',
  'DISCHARGED':  'badge-gray',
  'CANCELLED':   'badge-red',
};

export default function PortalPage() {
  const [tab, setTab] = useState<Tab>('dashboard');
  const [loggedIn, setLoggedIn] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [creds, setCreds] = useState({ phone: '', dob: '' });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Patient database state
  const [patient, setPatient] = useState<any | null>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [records, setRecords] = useState<any[]>([]);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [vitals, setVitals] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Auto-login if session exists in localStorage
  useEffect(() => {
    const saved = localStorage.getItem('jtho_patient_session');
    if (saved) {
      try {
        const p = JSON.parse(saved);
        setPatient(p);
        setLoggedIn(true);
      } catch (e) {
        localStorage.removeItem('jtho_patient_session');
      }
    }
  }, []);

  // Fetch patient data when logged in
  useEffect(() => {
    if (loggedIn && patient) {
      fetchPatientData(patient.id);
    }
  }, [loggedIn, patient]);

  const fetchPatientData = async (patientId: string) => {
    setLoadingData(true);
    try {
      const [resAppts, resRecords, resPrescr, resVitals] = await Promise.all([
        fetch(`/api/appointments?patientId=${patientId}`),
        fetch(`/api/records?patientId=${patientId}`),
        fetch(`/api/prescriptions?patientId=${patientId}`),
        fetch(`/api/vitals?patientId=${patientId}`),
      ]);

      const [jsonAppts, jsonRecords, jsonPrescr, jsonVitals] = await Promise.all([
        resAppts.json(),
        resRecords.json(),
        resPrescr.json(),
        resVitals.json(),
      ]);

      if (jsonAppts.success) setAppointments(jsonAppts.data);
      if (jsonRecords.success) setRecords(jsonRecords.data);
      if (jsonPrescr.success) setPrescriptions(jsonPrescr.data);
      if (jsonVitals.success) setVitals(jsonVitals.data);
    } catch (err) {
      console.error('[Error loading patient data]', err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!creds.phone || !creds.dob) {
      setErrorMessage('Please enter both your phone number and date of birth.');
      return;
    }

    setLoadingAuth(true);
    setErrorMessage(null);

    try {
      // Search patient by phone
      const res = await fetch(`/api/patients?search=${encodeURIComponent(creds.phone)}`);
      const json = await res.json();

      if (json.success && json.data.length > 0) {
        // Match Date of Birth (format of creds.dob is YYYY-MM-DD)
        const matched = json.data.find((p: any) => {
          if (!p.dateOfBirth) return false;
          const dbDate = new Date(p.dateOfBirth).toISOString().slice(0, 10);
          return dbDate === creds.dob;
        });

        if (matched) {
          setPatient(matched);
          localStorage.setItem('jtho_patient_session', JSON.stringify(matched));
          setLoggedIn(true);
        } else {
          setErrorMessage('Date of birth does not match our records.');
        }
      } else {
        setErrorMessage('No patient record found with this phone number.');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to connect to the server. Please try again.');
    } finally {
      setLoadingAuth(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('jtho_patient_session');
    setPatient(null);
    setLoggedIn(false);
    setAppointments([]);
    setRecords([]);
    setPrescriptions([]);
    setVitals([]);
  };

  // Simple login template
  if (!loggedIn) return (
    <>
      <Navbar />
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--cream)', padding: 20 }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: '48px', maxWidth: 420, width: '100%', border: '1px solid var(--border)', boxShadow: '0 12px 40px rgba(10,22,40,.08)' }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ width: 56, height: 56, background: 'var(--sky)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 24, margin: '0 auto 16px' }}>✚</div>
            <h2 className="serif" style={{ color: 'var(--navy)', fontSize: 26, marginBottom: 6 }}>Patient Portal</h2>
            <p style={{ color: 'var(--muted)', fontSize: 13 }}>Sign in with your phone number and date of birth.</p>
          </div>

          {errorMessage && (
            <div style={{ background: 'rgba(220,38,38,0.08)', color: 'var(--red)', padding: '12px', borderRadius: 6, fontSize: 12, marginBottom: 16, borderLeft: '3px solid var(--red)' }}>
              ⚠️ {errorMessage}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 16 }}>
              <label className="label">Phone Number</label>
              <input className="input" type="text" required placeholder="e.g. 08031234567" value={creds.phone} onChange={e => setCreds(c => ({ ...c, phone: e.target.value }))} />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label className="label">Date of Birth</label>
              <input type="date" required className="input" value={creds.dob} onChange={e => setCreds(c => ({ ...c, dob: e.target.value }))} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: 13 }}>
              {loadingAuth ? 'Signing In...' : 'Sign In to Portal'}
            </button>
          </form>
          <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 12, marginTop: 16 }}>
            Don't have an account? <Link href="/appointments" style={{ color: 'var(--sky)', fontWeight: 600 }}>Book an appointment</Link>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '80vh', background: 'var(--cream)' }}>
        {loadingData && appointments.length === 0 && records.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px', color: 'var(--muted)' }}>
            <div>🔄 Loading your medical history...</div>
          </div>
        ) : (
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '240px 1fr', gap: 28 }} className="portal-grid container-responsive-padding">
            {/* Sidebar */}
            <div>
              {/* Patient card */}
              <div style={{ background: 'var(--navy)', borderRadius: 10, padding: '20px', marginBottom: 16, color: '#fff' }}>
                <div style={{ width: 48, height: 48, background: 'var(--sky)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'DM Serif Display,serif', fontSize: 20, marginBottom: 12 }}>
                  {patient.firstName[0]}
                </div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 3 }}>{patient.firstName} {patient.lastName}</div>
                <div style={{ color: 'rgba(255,255,255,.55)', fontSize: 12 }}>ID: {patient.patientNumber}</div>
                <div style={{ color: 'rgba(255,255,255,.55)', fontSize: 12, marginTop: 2 }}>Blood: {patient.bloodGroup}</div>
              </div>

              {/* Nav */}
              <div style={{ background: '#fff', borderRadius: 10, padding: '8px', border: '1px solid var(--border)' }}>
                {TABS.map(t => (
                  <button key={t.key} onClick={() => setTab(t.key)}
                    className={`sidebar-item ${tab === t.key ? 'active' : ''}`}>
                    <span>{t.icon}</span> {t.label}
                  </button>
                ))}
                <div style={{ borderTop: '1px solid var(--border)', margin: '8px 0' }} />
                <button onClick={handleSignOut} className="sidebar-item" style={{ color: 'var(--red)' }}>
                  <span>🚪</span> Sign Out
                </button>
              </div>
            </div>

            {/* Main content */}
            <div>
              {/* Dashboard */}
              {tab === 'dashboard' && (
                <div>
                  <h2 className="serif" style={{ color: 'var(--navy)', fontSize: 28, marginBottom: 4 }}>Welcome back, {patient.firstName}!</h2>
                  <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 28 }}>Here's a summary of your health records.</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 28 }} className="portal-stats">
                    {[
                      { icon: '📅', label: 'Appointments',  val: appointments.length, color: 'var(--sky)' },
                      { icon: '📋', label: 'Records',        val: records.length,       color: 'var(--teal)' },
                      { icon: '💊', label: 'Prescriptions',  val: prescriptions.length, color: 'var(--gold)' },
                      { icon: '❤️', label: 'Vitals Logged',  val: vitals.length,        color: 'var(--red)' },
                    ].map((s, i) => (
                      <div key={i} className="stat-card">
                        <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
                        <div className="stat-value" style={{ color: s.color }}>{s.val}</div>
                        <div className="stat-label">{s.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Next appointment */}
                  {appointments.filter(a => a.status === 'CONFIRMED' || a.status === 'PENDING').length > 0 && (
                    <div style={{ background: 'var(--navy)', borderRadius: 10, padding: '24px', marginBottom: 20, color: '#fff' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: 'var(--teal-light)', textTransform: 'uppercase', marginBottom: 12 }}>Next Appointment</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                        <div>
                          <div style={{ fontSize: 20, fontFamily: 'DM Serif Display,serif', marginBottom: 4 }}>
                            {appointments.filter(a => a.status === 'CONFIRMED' || a.status === 'PENDING')[0].service}
                          </div>
                          <div style={{ color: 'rgba(255,255,255,.6)', fontSize: 13 }}>
                            {appointments.filter(a => a.status === 'CONFIRMED' || a.status === 'PENDING')[0].staff
                              ? `${appointments.filter(a => a.status === 'CONFIRMED' || a.status === 'PENDING')[0].staff.firstName} ${appointments.filter(a => a.status === 'CONFIRMED' || a.status === 'PENDING')[0].staff.lastName}`
                              : 'To be assigned'
                            } · {new Date(appointments.filter(a => a.status === 'CONFIRMED' || a.status === 'PENDING')[0].scheduledDate).toLocaleDateString()} · {appointments.filter(a => a.status === 'CONFIRMED' || a.status === 'PENDING')[0].scheduledTime}
                          </div>
                        </div>
                        <span className={`badge ${STATUS_BADGE[appointments.filter(a => a.status === 'CONFIRMED' || a.status === 'PENDING')[0].status]}`}>{appointments.filter(a => a.status === 'CONFIRMED' || a.status === 'PENDING')[0].status}</span>
                      </div>
                    </div>
                  )}

                  {/* Quick info */}
                  <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 10, padding: '20px 24px' }}>
                    <div style={{ fontWeight: 700, color: 'var(--navy)', marginBottom: 14 }}>Patient Information</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }} className="portal-info-grid">
                      {[
                        ['Patient ID', patient.patientNumber],
                        ['Phone Number', patient.phone],
                        ['Date of Birth', patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : 'N/A'],
                        ['Blood Group', patient.bloodGroup],
                        ['Allergies', patient.allergies || 'None logged']
                      ].map(([k, v]) => (
                        <div key={k}>
                          <div style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 3 }}>{k}</div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy)' }}>{v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Appointments */}
              {tab === 'appointments' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <h2 className="serif" style={{ color: 'var(--navy)', fontSize: 26 }}>My Appointments</h2>
                    <Link href="/appointments" className="btn btn-primary btn-sm">+ Book Appointment</Link>
                  </div>
                  {appointments.length === 0 ? (
                    <div style={{ padding: 40, background: '#fff', border: '1px solid var(--border)', borderRadius: 10, textAlign: 'center', color: 'var(--muted)' }}>
                      You have no appointments booked yet.
                    </div>
                  ) : (
                    <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
                      <table className="table">
                        <thead><tr><th>Ref</th><th>Service</th><th>Specialist</th><th>Date & Time</th><th>Status</th></tr></thead>
                        <tbody>
                          {appointments.map(a => (
                            <tr key={a.id}>
                              <td><code style={{ fontSize: 12, background: 'var(--light)', padding: '3px 8px', borderRadius: 4 }}>{a.appointmentRef}</code></td>
                              <td style={{ fontWeight: 500 }}>{a.service}</td>
                              <td style={{ color: 'var(--muted)', fontSize: 13 }}>
                                {a.staff ? `Dr. ${a.staff.firstName} ${a.staff.lastName}` : 'To be assigned'}
                              </td>
                              <td style={{ fontSize: 13 }}>{new Date(a.scheduledDate).toLocaleDateString()} · {a.scheduledTime}</td>
                              <td><span className={`badge ${STATUS_BADGE[a.status] ?? 'badge-gray'}`}>{a.status}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Records */}
              {tab === 'records' && (
                <div>
                  <h2 className="serif" style={{ color: 'var(--navy)', fontSize: 26, marginBottom: 24 }}>Medical Records</h2>
                  {records.length === 0 ? (
                    <div style={{ padding: 40, background: '#fff', border: '1px solid var(--border)', borderRadius: 10, textAlign: 'center', color: 'var(--muted)' }}>
                      No medical records found in your clinical profile.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      {records.map(r => (
                        <div key={r.id} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 10, padding: '22px 24px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                            <div>
                              <div style={{ fontFamily: 'DM Serif Display,serif', color: 'var(--navy)', fontSize: 18, marginBottom: 3 }}>{r.condition}</div>
                              <div style={{ color: 'var(--muted)', fontSize: 12 }}>
                                Attending Specialist: {r.staff ? `${r.staff.firstName} ${r.staff.lastName}` : 'System'} · Date: {new Date(r.admissionDate).toLocaleDateString()}
                              </div>
                            </div>
                            <span className={`badge ${STATUS_BADGE[r.status] ?? 'badge-gray'}`}>{r.status}</span>
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                            <div>
                              <div style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Diagnosis:</div>
                              <div style={{ fontSize: 13, fontWeight: 600 }}>{r.diagnosis || 'N/A'}</div>
                            </div>
                            <div>
                              <div style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Treatment Administered:</div>
                              <div style={{ fontSize: 13, fontWeight: 600 }}>{r.treatment || 'N/A'}</div>
                            </div>
                          </div>
                          <div style={{ background: 'var(--light)', borderLeft: '3px solid var(--sky)', padding: '10px 14px', borderRadius: 4 }}>
                            <p style={{ color: 'var(--navy)', fontSize: 13, lineHeight: 1.6 }}>{r.clinicalNotes}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Prescriptions */}
              {tab === 'prescriptions' && (
                <div>
                  <h2 className="serif" style={{ color: 'var(--navy)', fontSize: 26, marginBottom: 24 }}>My Prescriptions</h2>
                  {prescriptions.length === 0 ? (
                    <div style={{ padding: 40, background: '#fff', border: '1px solid var(--border)', borderRadius: 10, textAlign: 'center', color: 'var(--muted)' }}>
                      No active prescriptions logged.
                    </div>
                  ) : (
                    <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
                      <table className="table">
                        <thead><tr><th>Medication</th><th>Dosage</th><th>Frequency</th><th>Duration</th><th>Prescribing Doctor</th><th>Status</th></tr></thead>
                        <tbody>
                          {prescriptions.map(p => (
                            <tr key={p.id}>
                              <td style={{ fontWeight: 600 }}>{p.medication}</td>
                              <td>{p.dosage}</td>
                              <td style={{ fontSize: 13, color: 'var(--muted)' }}>{p.frequency}</td>
                              <td style={{ fontSize: 13 }}>{p.duration}</td>
                              <td style={{ fontSize: 12, color: 'var(--muted)' }}>
                                {p.staff ? `Dr. ${p.staff.firstName} ${p.staff.lastName}` : 'System'}
                              </td>
                              <td><span className={`badge ${p.status === 'ACTIVE' ? 'badge-green' : 'badge-gray'}`}>{p.status}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Vitals */}
              {tab === 'vitals' && (
                <div>
                  <h2 className="serif" style={{ color: 'var(--navy)', fontSize: 26, marginBottom: 24 }}>Vital Signs Log</h2>
                  {vitals.length === 0 ? (
                    <div style={{ padding: 40, background: '#fff', border: '1px solid var(--border)', borderRadius: 10, textAlign: 'center', color: 'var(--muted)' }}>
                      No vital signs logged yet.
                    </div>
                  ) : (
                    vitals.map(v => (
                      <div key={v.id} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 10, padding: '20px 24px', marginBottom: 16 }}>
                        <div style={{ fontWeight: 700, color: 'var(--navy)', marginBottom: 16, fontSize: 14 }}>📅 Recorded: {new Date(v.recordedAt).toLocaleString()}</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 12 }} className="vitals-grid">
                          {[
                            { icon: '🫀', label: 'Blood Pressure', val: v.bloodPressure || 'N/A', unit: 'mmHg' },
                            { icon: '💓', label: 'Pulse',          val: v.pulse || 'N/A',         unit: 'bpm'  },
                            { icon: '🌡️', label: 'Temperature',   val: v.temperature || 'N/A',   unit: '°C'   },
                            { icon: '⚖️', label: 'Weight',         val: v.weight || 'N/A',        unit: 'kg'   },
                            { icon: '📏', label: 'Height',          val: v.height || 'N/A',        unit: 'cm'   },
                            { icon: '🫁', label: 'O₂ Saturation',  val: v.oxygenSat || 'N/A',     unit: '%'    },
                          ].map(stat => (
                            <div key={stat.label} style={{ textAlign: 'center', background: 'var(--light)', borderRadius: 8, padding: '14px 8px' }}>
                              <div style={{ fontSize: 22, marginBottom: 6 }}>{stat.icon}</div>
                              <div style={{ fontFamily: 'DM Serif Display,serif', fontSize: 20, color: 'var(--navy)', lineHeight: 1 }}>{stat.val}</div>
                              <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 3 }}>{stat.unit}</div>
                              <div style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: .5, textTransform: 'uppercase', marginTop: 2, height: 24, overflow: 'hidden' }}>{stat.label}</div>
                            </div>
                          ))}
                        </div>
                        {v.notes && (
                          <div style={{ marginTop: 12, padding: 10, background: 'var(--light)', borderRadius: 6, fontSize: 12, color: 'var(--muted)' }}>
                            <strong>Notes:</strong> {v.notes}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
      <style>{`
        @media(max-width:900px){
          .portal-grid { grid-template-columns: 1fr!important; }
          .portal-stats { grid-template-columns: repeat(2,1fr)!important; }
          .vitals-grid { grid-template-columns: repeat(3,1fr)!important; }
        }
        @media(max-width:600px){
          .portal-info-grid { grid-template-columns: 1fr!important; }
          .vitals-grid { grid-template-columns: repeat(2,1fr)!important; }
        }
      `}</style>
    </>
  );
}

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: 'dashboard',    label: 'Dashboard',    icon: '🏠' },
  { key: 'appointments', label: 'Appointments', icon: '📅' },
  { key: 'records',      label: 'Medical Records', icon: '📋' },
  { key: 'prescriptions',label: 'Prescriptions', icon: '💊' },
  { key: 'vitals',       label: 'Vital Signs',  icon: '❤️' },
];
