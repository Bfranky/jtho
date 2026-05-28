'use client';
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';

type Tab = 'dashboard'|'appointments'|'records'|'prescriptions'|'vitals';

// Sample demo data
const DEMO = {
  patient: { name:'Mrs. Adunola Fashola', id:'JTH-001', phone:'0803 111 2222', dob:'12 Mar 1974', blood:'O+', doctor:'Dr. Adebayo Olusola' },
  appointments: [
    { ref:'APT-001', doctor:'Dr. Adebayo Olusola', service:'Knee Review', date:'28 May 2025', time:'09:00 AM', status:'Confirmed' },
    { ref:'APT-002', doctor:'Mrs. Funmilayo Oke',  service:'Physiotherapy',date:'03 Jun 2025', time:'10:00 AM', status:'Pending'  },
    { ref:'APT-003', doctor:'Dr. Adebayo Olusola', service:'Follow-Up',    date:'18 Apr 2025', time:'11:00 AM', status:'Completed'},
  ],
  records: [
    { id:'REC-001', condition:'Knee Joint Arthritis',    doctor:'Dr. Adebayo Olusola', date:'10 Apr 2025', status:'Active',     notes:'Patient responding well to physiotherapy. Pain reduced from 8/10 to 3/10.' },
    { id:'REC-002', condition:'General Check-up',        doctor:'Dr. Ngozi Anyanwu',   date:'05 Feb 2025', status:'Discharged', notes:'All vitals normal. Recommended calcium supplements.' },
  ],
  prescriptions: [
    { medication:'Ibuprofen 400mg',    dosage:'400mg', freq:'3× daily with food', duration:'2 weeks', status:'Active',    doctor:'Dr. Adebayo Olusola', date:'10 Apr 2025' },
    { medication:'Calcium + Vit D3',   dosage:'500mg', freq:'Twice daily',         duration:'3 months',status:'Active',    doctor:'Dr. Adebayo Olusola', date:'10 Apr 2025' },
    { medication:'Diclofenac 50mg',    dosage:'50mg',  freq:'Twice daily',         duration:'10 days', status:'Completed', doctor:'Dr. Ngozi Anyanwu',   date:'05 Feb 2025' },
  ],
  vitals: [
    { date:'10 Apr 2025', bp:'128/82', pulse:74, temp:36.8, weight:72.5, height:162, o2:98 },
    { date:'05 Feb 2025', bp:'124/80', pulse:70, temp:36.5, weight:72.0, height:162, o2:99 },
  ],
};

const STATUS_BADGE: Record<string,string> = { Active:'badge-green', Confirmed:'badge-green', Pending:'badge-gold', Completed:'badge-blue', Discharged:'badge-gray' };

export default function PortalPage() {
  const [tab, setTab]     = useState<Tab>('dashboard');
  const [loggedIn, setLoggedIn] = useState(false);
  const [creds, setCreds] = useState({ phone:'', dob:'' });

  // Simple demo login
  if (!loggedIn) return (
    <>
      <Navbar />
      <div style={{ minHeight:'80vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--cream)', padding:20 }}>
        <div style={{ background:'#fff', borderRadius:12, padding:'48px', maxWidth:420, width:'100%', border:'1px solid var(--border)', boxShadow:'0 12px 40px rgba(10,22,40,.08)' }}>
          <div style={{ textAlign:'center', marginBottom:28 }}>
            <div style={{ width:56, height:56, background:'var(--sky)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:24, margin:'0 auto 16px' }}>✚</div>
            <h2 className="serif" style={{ color:'var(--navy)', fontSize:26, marginBottom:6 }}>Patient Portal</h2>
            <p style={{ color:'var(--muted)', fontSize:13 }}>Sign in with your phone number and date of birth.</p>
          </div>
          <div style={{ marginBottom:16 }}>
            <label className="label">Phone Number</label>
            <input className="input" placeholder="0803 111 2222" value={creds.phone} onChange={e => setCreds(c => ({ ...c, phone: e.target.value }))} />
          </div>
          <div style={{ marginBottom:24 }}>
            <label className="label">Date of Birth</label>
            <input type="date" className="input" value={creds.dob} onChange={e => setCreds(c => ({ ...c, dob: e.target.value }))} />
          </div>
          <button className="btn btn-primary" style={{ width:'100%', padding:13 }} onClick={() => setLoggedIn(true)}>
            Sign In to Portal
          </button>
          <p style={{ textAlign:'center', color:'var(--muted)', fontSize:12, marginTop:16 }}>
            Don't have an account? <Link href="/appointments" style={{ color:'var(--sky)', fontWeight:600 }}>Book an appointment</Link>
          </p>
          <p style={{ textAlign:'center', color:'var(--muted)', fontSize:11, marginTop:8 }}>
            Demo: use any phone + date to access
          </p>
        </div>
      </div>
      <Footer />
    </>
  );

  const TABS: { key:Tab; label:string; icon:string }[] = [
    { key:'dashboard',    label:'Dashboard',    icon:'🏠' },
    { key:'appointments', label:'Appointments', icon:'📅' },
    { key:'records',      label:'Medical Records', icon:'📋' },
    { key:'prescriptions',label:'Prescriptions', icon:'💊' },
    { key:'vitals',       label:'Vital Signs',  icon:'❤️' },
  ];

  return (
    <>
      <Navbar />
      <div style={{ minHeight:'80vh', background:'var(--cream)' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', padding:'40px', display:'grid', gridTemplateColumns:'240px 1fr', gap:28 }}>

          {/* Sidebar */}
          <div>
            {/* Patient card */}
            <div style={{ background:'var(--navy)', borderRadius:10, padding:'20px', marginBottom:16, color:'#fff' }}>
              <div style={{ width:48, height:48, background:'var(--sky)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'DM Serif Display,serif', fontSize:20, marginBottom:12 }}>
                {DEMO.patient.name[0]}
              </div>
              <div style={{ fontWeight:700, fontSize:15, marginBottom:3 }}>{DEMO.patient.name}</div>
              <div style={{ color:'rgba(255,255,255,.55)', fontSize:12 }}>ID: {DEMO.patient.id}</div>
              <div style={{ color:'rgba(255,255,255,.55)', fontSize:12, marginTop:2 }}>Blood: {DEMO.patient.blood}</div>
            </div>

            {/* Nav */}
            <div style={{ background:'#fff', borderRadius:10, padding:'8px', border:'1px solid var(--border)' }}>
              {TABS.map(t => (
                <button key={t.key} onClick={() => setTab(t.key)}
                  className={`sidebar-item ${tab === t.key ? 'active' : ''}`}>
                  <span>{t.icon}</span> {t.label}
                </button>
              ))}
              <div style={{ borderTop:'1px solid var(--border)', margin:'8px 0' }} />
              <button onClick={() => setLoggedIn(false)} className="sidebar-item" style={{ color:'var(--red)' }}>
                <span>🚪</span> Sign Out
              </button>
            </div>
          </div>

          {/* Main content */}
          <div>

            {/* Dashboard */}
            {tab === 'dashboard' && (
              <div>
                <h2 className="serif" style={{ color:'var(--navy)', fontSize:28, marginBottom:4 }}>Welcome back, {DEMO.patient.name.split(' ')[1]}!</h2>
                <p style={{ color:'var(--muted)', fontSize:14, marginBottom:28 }}>Here's a summary of your health records.</p>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:28 }}>
                  {[
                    { icon:'📅', label:'Appointments',  val: DEMO.appointments.length, color:'var(--sky)' },
                    { icon:'📋', label:'Records',        val: DEMO.records.length,       color:'var(--teal)' },
                    { icon:'💊', label:'Prescriptions',  val: DEMO.prescriptions.length, color:'var(--gold)' },
                    { icon:'❤️', label:'Vitals Logged',  val: DEMO.vitals.length,        color:'var(--red)' },
                  ].map((s,i) => (
                    <div key={i} className="stat-card">
                      <div style={{ fontSize:28, marginBottom:8 }}>{s.icon}</div>
                      <div className="stat-value" style={{ color:s.color }}>{s.val}</div>
                      <div className="stat-label">{s.label}</div>
                    </div>
                  ))}
                </div>
                {/* Next appointment */}
                <div style={{ background:'var(--navy)', borderRadius:10, padding:'24px', marginBottom:20, color:'#fff' }}>
                  <div style={{ fontSize:11, fontWeight:700, letterSpacing:3, color:'var(--teal-light)', textTransform:'uppercase', marginBottom:12 }}>Next Appointment</div>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
                    <div>
                      <div style={{ fontSize:20, fontFamily:'DM Serif Display,serif', marginBottom:4 }}>{DEMO.appointments[0].service}</div>
                      <div style={{ color:'rgba(255,255,255,.6)', fontSize:13 }}>{DEMO.appointments[0].doctor} · {DEMO.appointments[0].date} · {DEMO.appointments[0].time}</div>
                    </div>
                    <span className="badge badge-green">{DEMO.appointments[0].status}</span>
                  </div>
                </div>
                {/* Quick info */}
                <div style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:10, padding:'20px 24px' }}>
                  <div style={{ fontWeight:700, color:'var(--navy)', marginBottom:14 }}>Patient Information</div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                    {[['Patient ID',DEMO.patient.id],['Phone',DEMO.patient.phone],['Date of Birth',DEMO.patient.dob],['Blood Group',DEMO.patient.blood],['Primary Doctor',DEMO.patient.doctor]].map(([k,v]) => (
                      <div key={k}><div style={{ fontSize:10, color:'var(--muted)', letterSpacing:1, textTransform:'uppercase', marginBottom:3 }}>{k}</div><div style={{ fontSize:13, fontWeight:600, color:'var(--navy)' }}>{v}</div></div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Appointments */}
            {tab === 'appointments' && (
              <div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
                  <h2 className="serif" style={{ color:'var(--navy)', fontSize:26 }}>My Appointments</h2>
                  <Link href="/appointments" className="btn btn-primary btn-sm">+ New Appointment</Link>
                </div>
                <div style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:10, overflow:'hidden' }}>
                  <table className="table" style={{ width:'100%' }}>
                    <thead><tr><th>Ref</th><th>Service</th><th>Doctor</th><th>Date & Time</th><th>Status</th></tr></thead>
                    <tbody>
                      {DEMO.appointments.map(a => (
                        <tr key={a.ref}>
                          <td><code style={{ fontSize:12, background:'var(--light)', padding:'3px 8px', borderRadius:4 }}>{a.ref}</code></td>
                          <td style={{ fontWeight:500 }}>{a.service}</td>
                          <td style={{ color:'var(--muted)', fontSize:13 }}>{a.doctor}</td>
                          <td style={{ fontSize:13 }}>{a.date} · {a.time}</td>
                          <td><span className={`badge ${STATUS_BADGE[a.status] ?? 'badge-gray'}`}>{a.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Records */}
            {tab === 'records' && (
              <div>
                <h2 className="serif" style={{ color:'var(--navy)', fontSize:26, marginBottom:24 }}>Medical Records</h2>
                <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                  {DEMO.records.map(r => (
                    <div key={r.id} style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:10, padding:'22px 24px' }}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12, flexWrap:'wrap', gap:8 }}>
                        <div>
                          <div style={{ fontFamily:'DM Serif Display,serif', color:'var(--navy)', fontSize:18, marginBottom:3 }}>{r.condition}</div>
                          <div style={{ color:'var(--muted)', fontSize:12 }}>{r.doctor} · {r.date}</div>
                        </div>
                        <span className={`badge ${STATUS_BADGE[r.status] ?? 'badge-gray'}`}>{r.status}</span>
                      </div>
                      <div style={{ background:'var(--light)', borderLeft:'3px solid var(--sky)', padding:'10px 14px', borderRadius:4 }}>
                        <p style={{ color:'var(--navy)', fontSize:13, lineHeight:1.6 }}>{r.notes}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Prescriptions */}
            {tab === 'prescriptions' && (
              <div>
                <h2 className="serif" style={{ color:'var(--navy)', fontSize:26, marginBottom:24 }}>Prescriptions</h2>
                <div style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:10, overflow:'hidden' }}>
                  <table className="table">
                    <thead><tr><th>Medication</th><th>Dosage</th><th>Frequency</th><th>Duration</th><th>Doctor</th><th>Status</th></tr></thead>
                    <tbody>
                      {DEMO.prescriptions.map((p,i) => (
                        <tr key={i}>
                          <td style={{ fontWeight:600 }}>{p.medication}</td>
                          <td>{p.dosage}</td>
                          <td style={{ fontSize:13, color:'var(--muted)' }}>{p.freq}</td>
                          <td style={{ fontSize:13 }}>{p.duration}</td>
                          <td style={{ fontSize:12, color:'var(--muted)' }}>{p.doctor}</td>
                          <td><span className={`badge ${p.status === 'Active' ? 'badge-green' : 'badge-gray'}`}>{p.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Vitals */}
            {tab === 'vitals' && (
              <div>
                <h2 className="serif" style={{ color:'var(--navy)', fontSize:26, marginBottom:24 }}>Vital Signs</h2>
                {DEMO.vitals.map((v,i) => (
                  <div key={i} style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:10, padding:'20px 24px', marginBottom:16 }}>
                    <div style={{ fontWeight:700, color:'var(--navy)', marginBottom:16, fontSize:14 }}>📅 Recorded: {v.date}</div>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:12 }}>
                      {[
                        { icon:'🫀', label:'Blood Pressure', val:v.bp,          unit:'mmHg' },
                        { icon:'💓', label:'Pulse',          val:`${v.pulse}`,   unit:'bpm'  },
                        { icon:'🌡️', label:'Temperature',   val:`${v.temp}`,    unit:'°C'   },
                        { icon:'⚖️', label:'Weight',         val:`${v.weight}`,  unit:'kg'   },
                        { icon:'📏', label:'Height',          val:`${v.height}`,  unit:'cm'   },
                        { icon:'🫁', label:'O₂ Saturation',  val:`${v.o2}`,      unit:'%'    },
                      ].map(stat => (
                        <div key={stat.label} style={{ textAlign:'center', background:'var(--light)', borderRadius:8, padding:'14px 8px' }}>
                          <div style={{ fontSize:22, marginBottom:6 }}>{stat.icon}</div>
                          <div style={{ fontFamily:'DM Serif Display,serif', fontSize:22, color:'var(--navy)', lineHeight:1 }}>{stat.val}</div>
                          <div style={{ fontSize:10, color:'var(--muted)', marginTop:3 }}>{stat.unit}</div>
                          <div style={{ fontSize:10, color:'var(--muted)', letterSpacing:.5, textTransform:'uppercase', marginTop:2 }}>{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
      <style>{`@media(max-width:900px){div[style*="240px 1fr"]{grid-template-columns:1fr!important} div[style*="repeat(4,1fr)"]{grid-template-columns:repeat(2,1fr)!important} div[style*="repeat(6,1fr)"]{grid-template-columns:repeat(3,1fr)!important}}`}</style>
    </>
  );
}
