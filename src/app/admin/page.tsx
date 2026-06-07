'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

type AdminTab = 'overview' | 'patients' | 'appointments' | 'doctors' | 'records' | 'messages';

const DEMO_PATIENTS = [
  { id:'JTH-001', name:'Mrs. Adunola Fashola', phone:'0803 111 2222', condition:'Knee Joint Arthritis',    doctor:'Dr. Adebayo Olusola', status:'Active',     date:'10 Apr 2025' },
  { id:'JTH-002', name:'Mr. Chukwuemeka Obi',  phone:'0805 333 4444', condition:'Lumbar Disc Herniation', doctor:'Dr. Ngozi Anyanwu',   status:'Follow-Up',  date:'28 Mar 2025' },
  { id:'JTH-003', name:'Tunde Adesanya',        phone:'0901 555 6666', condition:'Ankle Ligament Tear',    doctor:'Mrs. Funmilayo Oke',  status:'Active',     date:'22 Apr 2025' },
  { id:'JTH-004', name:'Pastor Emmanuel Dada',  phone:'0702 777 8888', condition:'Bilateral Knee Arthritis',doctor:'Dr. Adebayo Olusola',status:'Discharged', date:'14 Feb 2025' },
  { id:'JTH-005', name:'Auntie Bisi Lawal',     phone:'0803 999 0000', condition:'Hip Fracture Rehab',     doctor:'Mrs. Funmilayo Oke',  status:'Active',     date:'01 May 2025' },
];

const DEMO_APPOINTMENTS = [
  { ref:'APT-001', patient:'Mrs. Adunola Fashola', doctor:'Dr. Adebayo Olusola', service:'Knee Review',      date:'28 May 2025', time:'09:00 AM', status:'Confirmed'  },
  { ref:'APT-002', patient:'Mr. Chukwuemeka Obi',  doctor:'Dr. Ngozi Anyanwu',   service:'Spine Follow-Up',  date:'29 May 2025', time:'11:30 AM', status:'Pending'    },
  { ref:'APT-003', patient:'Tunde Adesanya',        doctor:'Mrs. Funmilayo Oke',  service:'Physio Session',   date:'27 May 2025', time:'02:00 PM', status:'Confirmed'  },
  { ref:'APT-004', patient:'New Walk-in Patient',   doctor:'Dr. Adebayo Olusola', service:'Emergency Consult',date:'26 May 2025', time:'10:00 AM', status:'In Progress'},
  { ref:'APT-005', patient:'Auntie Bisi Lawal',     doctor:'Mrs. Funmilayo Oke',  service:'Rehab Session',    date:'30 May 2025', time:'03:00 PM', status:'Pending'    },
];

const DEMO_MESSAGES = [
  { name:'Kehinde Adeola',   phone:'0803 222 3333', service:'Appointment Booking',  message:'I would like to book an appointment for my mother who has knee pain.',    date:'25 May 2025', read:false },
  { name:'Dr. James Okafor', phone:'0805 444 5555', service:'General Enquiry',      message:'Interested in referring a patient with complex fracture.',                date:'24 May 2025', read:false },
  { name:'Mrs. Ngozi Eze',   phone:'0901 666 7777', service:'Physiotherapy',         message:'My husband had a stroke and needs physiotherapy. Can you help?',          date:'23 May 2025', read:true  },
];

const STATUS_COLOR: Record<string,string> = {
  'Active':      'badge-green',
  'Confirmed':   'badge-green',
  'In Progress': 'badge-teal',
  'Follow-Up':   'badge-gold',
  'Pending':     'badge-gold',
  'Discharged':  'badge-gray',
  'Cancelled':   'badge-red',
};

export default function AdminPage() {
  const [tab,       setTab]       = useState<AdminTab>('overview');
  const [loggedIn,  setLoggedIn]  = useState(false);
  const [creds,     setCreds]     = useState({ email:'', password:'' });
  const [search,    setSearch]    = useState('');
  const [expanded,  setExpanded]  = useState<string | null>(null);
  const [staffList, setStaffList] = useState<any[]>([]);

  useEffect(() => {
    if (loggedIn) {
      fetch('/api/staff')
        .then(res => res.json())
        .then(json => {
          if (json.success && json.data.length > 0) {
            setStaffList(json.data);
          }
        })
        .catch(err => console.error(err));
    }
  }, [loggedIn]);

  // Demo login
  if (!loggedIn) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--navy)', padding:20 }}>
      <div style={{ background:'#fff', borderRadius:12, padding:'48px', maxWidth:400, width:'100%', boxShadow:'0 20px 60px rgba(0,0,0,.3)' }}>
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <div style={{ width:56, height:56, background:'var(--sky)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:24, margin:'0 auto 16px' }}>✚</div>
          <h2 className="serif" style={{ color:'var(--navy)', fontSize:26, marginBottom:6 }}>Admin Portal</h2>
          <p style={{ color:'var(--muted)', fontSize:13 }}>Sign in with your administrator credentials.</p>
        </div>
        <div style={{ marginBottom:16 }}>
          <label className="label">Email Address</label>
          <input className="input" type="email" placeholder="admin@jesusthehealer.com" value={creds.email} onChange={e => setCreds(c => ({ ...c, email: e.target.value }))} />
        </div>
        <div style={{ marginBottom:24 }}>
          <label className="label">Password</label>
          <input className="input" type="password" placeholder="••••••••" value={creds.password} onChange={e => setCreds(c => ({ ...c, password: e.target.value }))} />
        </div>
        <button className="btn btn-primary" style={{ width:'100%', padding:13 }} onClick={() => setLoggedIn(true)}>Sign In to Admin</button>
        <p style={{ textAlign:'center', color:'var(--muted)', fontSize:11, marginTop:14 }}>Demo: use any credentials to access</p>
      </div>
    </div>
  );

  const TABS: { key: AdminTab; label: string; icon: string }[] = [
    { key:'overview',     label:'Overview',      icon:'📊' },
    { key:'patients',     label:'Patients',      icon:'👥' },
    { key:'appointments', label:'Appointments',  icon:'📅' },
    { key:'doctors',      label:'Doctors',       icon:'👨‍⚕️' },
    { key:'records',      label:'Records',       icon:'📋' },
    { key:'messages',     label:'Messages',      icon:'💬' },
  ];

  const filteredPatients     = DEMO_PATIENTS.filter(p     => p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase()) || p.condition.toLowerCase().includes(search.toLowerCase()));
  const filteredAppointments = DEMO_APPOINTMENTS.filter(a => a.patient.toLowerCase().includes(search.toLowerCase()) || a.ref.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <div style={{ background:'var(--navy)', padding:'12px 40px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:32, height:32, background:'var(--sky)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:16 }}>✚</div>
          <div>
            <div style={{ fontFamily:'DM Serif Display,serif', color:'#fff', fontSize:14 }}>Jesus The Healer</div>
            <div style={{ color:'rgba(255,255,255,.4)', fontSize:9, letterSpacing:3, textTransform:'uppercase' }}>Admin Portal</div>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          <span style={{ color:'rgba(255,255,255,.5)', fontSize:13 }}>admin@jesusthehealer.com</span>
          <button onClick={() => setLoggedIn(false)} style={{ background:'rgba(255,255,255,.08)', border:'1px solid rgba(255,255,255,.15)', color:'#fff', padding:'6px 14px', borderRadius:6, fontSize:12, cursor:'pointer' }}>Sign Out</button>
        </div>
      </div>

      <div style={{ display:'flex', minHeight:'calc(100vh - 54px)' }}>

        {/* Sidebar */}
        <div style={{ width:220, background:'var(--navy)', padding:'20px 12px', flexShrink:0 }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => { setTab(t.key); setSearch(''); }}
              className={`sidebar-item ${tab === t.key ? 'active' : ''}`}
              style={{ color: tab === t.key ? 'var(--sky-light)' : 'rgba(255,255,255,.45)', marginBottom:2 }}>
              <span>{t.icon}</span> {t.label}
              {t.key === 'messages' && DEMO_MESSAGES.filter(m => !m.read).length > 0 && (
                <span style={{ marginLeft:'auto', background:'var(--red)', color:'#fff', fontSize:10, fontWeight:700, width:18, height:18, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  {DEMO_MESSAGES.filter(m => !m.read).length}
                </span>
              )}
            </button>
          ))}
          <div style={{ borderTop:'1px solid rgba(255,255,255,.07)', marginTop:16, paddingTop:16 }}>
            <Link href="/" className="sidebar-item" style={{ color:'rgba(255,255,255,.35)' }}>
              <span>🌐</span> View Website
            </Link>
          </div>
        </div>

        {/* Main */}
        <div style={{ flex:1, background:'var(--cream)', padding:'32px 40px', overflowY:'auto' }}>

          {/* ── OVERVIEW ── */}
          {tab === 'overview' && (
            <div>
              <h2 className="serif" style={{ color:'var(--navy)', fontSize:28, marginBottom:6 }}>Dashboard Overview</h2>
              <p style={{ color:'var(--muted)', fontSize:13, marginBottom:28 }}>Today: Monday, 26 May 2025</p>

              {/* Stat cards */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:28 }}>
                {[
                  { icon:'👥', label:'Total Patients',       val:DEMO_PATIENTS.length,     sub:'2 new this week',          color:'var(--sky)'  },
                  { icon:'📅', label:"Today's Appointments", val:3,                         sub:'1 in progress',            color:'var(--teal)' },
                  { icon:'👨‍⚕️', label:'Active Doctors',     val:4,                         sub:'All on schedule',          color:'var(--gold)' },
                  { icon:'💬', label:'Unread Messages',      val:DEMO_MESSAGES.filter(m=>!m.read).length, sub:'Awaiting response', color:'var(--red)'  },
                ].map((s,i) => (
                  <div key={i} className="stat-card" style={{ borderTop:`3px solid ${s.color}` }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
                      <div style={{ fontSize:28 }}>{s.icon}</div>
                      <div className="stat-value" style={{ color:s.color }}>{s.val}</div>
                    </div>
                    <div className="stat-label">{s.label}</div>
                    <div style={{ fontSize:11, color:'var(--muted)', marginTop:4 }}>{s.sub}</div>
                  </div>
                ))}
              </div>

              {/* Today's schedule */}
              <div style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:20 }}>
                <div style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:10, overflow:'hidden' }}>
                  <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <div style={{ fontWeight:700, color:'var(--navy)', fontSize:15 }}>Today's Appointments</div>
                    <button onClick={() => setTab('appointments')} style={{ background:'none', border:'none', color:'var(--sky)', fontSize:12, fontWeight:600, cursor:'pointer' }}>View all →</button>
                  </div>
                  <table className="table">
                    <thead><tr><th>Patient</th><th>Doctor</th><th>Time</th><th>Status</th></tr></thead>
                    <tbody>
                      {DEMO_APPOINTMENTS.slice(0,4).map(a => (
                        <tr key={a.ref}>
                          <td style={{ fontWeight:500, fontSize:13 }}>{a.patient}</td>
                          <td style={{ color:'var(--muted)', fontSize:12 }}>{a.doctor.split(' ').slice(0,2).join(' ')}</td>
                          <td style={{ fontSize:12 }}>{a.time}</td>
                          <td><span className={`badge ${STATUS_COLOR[a.status] ?? 'badge-gray'}`} style={{ fontSize:10 }}>{a.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Quick stats sidebar */}
                <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                  {/* Status breakdown */}
                  <div style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:10, padding:'20px' }}>
                    <div style={{ fontWeight:700, color:'var(--navy)', fontSize:14, marginBottom:16 }}>Patient Status Breakdown</div>
                    {[
                      { label:'Active',     count:DEMO_PATIENTS.filter(p=>p.status==='Active').length,     color:'var(--green)' },
                      { label:'Follow-Up',  count:DEMO_PATIENTS.filter(p=>p.status==='Follow-Up').length,  color:'var(--gold)'  },
                      { label:'Discharged', count:DEMO_PATIENTS.filter(p=>p.status==='Discharged').length, color:'var(--muted)' },
                    ].map(s => (
                      <div key={s.label} style={{ marginBottom:12 }}>
                        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                          <span style={{ fontSize:13, color:'var(--navy)' }}>{s.label}</span>
                          <span style={{ fontSize:13, fontWeight:700, color:s.color }}>{s.count}</span>
                        </div>
                        <div style={{ height:6, background:'var(--light)', borderRadius:3, overflow:'hidden' }}>
                          <div style={{ height:'100%', width:`${(s.count/DEMO_PATIENTS.length)*100}%`, background:s.color, borderRadius:3, transition:'width 1s ease' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Recent messages */}
                  <div style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:10, padding:'20px', flex:1 }}>
                    <div style={{ fontWeight:700, color:'var(--navy)', fontSize:14, marginBottom:14 }}>New Messages</div>
                    {DEMO_MESSAGES.filter(m => !m.read).map((m,i) => (
                      <div key={i} style={{ padding:'10px 0', borderBottom:i<1?'1px solid var(--border)':'none' }}>
                        <div style={{ fontWeight:600, color:'var(--navy)', fontSize:13 }}>{m.name}</div>
                        <div style={{ color:'var(--muted)', fontSize:12, marginTop:2 }}>{m.message.substring(0,55)}...</div>
                      </div>
                    ))}
                    <button onClick={() => setTab('messages')} style={{ background:'none', border:'none', color:'var(--sky)', fontSize:12, fontWeight:600, cursor:'pointer', marginTop:10 }}>View all messages →</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── PATIENTS ── */}
          {tab === 'patients' && (
            <div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
                <div>
                  <h2 className="serif" style={{ color:'var(--navy)', fontSize:28 }}>Patient Management</h2>
                  <p style={{ color:'var(--muted)', fontSize:13 }}>{DEMO_PATIENTS.length} patients total</p>
                </div>
                <button className="btn btn-primary btn-sm">+ Register Patient</button>
              </div>
              <input className="input" placeholder="🔍 Search by name, ID or condition..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth:360, marginBottom:20 }} />
              <div style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:10, overflow:'hidden' }}>
                <table className="table">
                  <thead>
                    <tr><th>Patient ID</th><th>Name</th><th>Phone</th><th>Condition</th><th>Doctor</th><th>Date</th><th>Status</th><th></th></tr>
                  </thead>
                  <tbody>
                    {filteredPatients.map(p => (
                      <>
                        <tr key={p.id} style={{ cursor:'pointer' }} onClick={() => setExpanded(expanded === p.id ? null : p.id)}>
                          <td><code style={{ fontSize:12, background:'var(--light)', padding:'3px 8px', borderRadius:4 }}>{p.id}</code></td>
                          <td style={{ fontWeight:600, fontSize:13 }}>{p.name}</td>
                          <td style={{ color:'var(--muted)', fontSize:12 }}>{p.phone}</td>
                          <td style={{ fontSize:13 }}>{p.condition}</td>
                          <td style={{ color:'var(--muted)', fontSize:12 }}>{p.doctor.split(' ').slice(0,2).join(' ')}</td>
                          <td style={{ fontSize:12, color:'var(--muted)' }}>{p.date}</td>
                          <td><span className={`badge ${STATUS_COLOR[p.status] ?? 'badge-gray'}`}>{p.status}</span></td>
                          <td style={{ color:'var(--muted)', fontSize:12 }}>{expanded === p.id ? '▲' : '▼'}</td>
                        </tr>
                        {expanded === p.id && (
                          <tr>
                            <td colSpan={8} style={{ background:'var(--light)', padding:'16px 24px' }}>
                              <div style={{ display:'flex', gap:24, flexWrap:'wrap' }}>
                                <div>
                                  <div style={{ fontSize:10, color:'var(--muted)', letterSpacing:1, textTransform:'uppercase', marginBottom:4 }}>Full Name</div>
                                  <div style={{ fontSize:14, fontWeight:600 }}>{p.name}</div>
                                </div>
                                <div>
                                  <div style={{ fontSize:10, color:'var(--muted)', letterSpacing:1, textTransform:'uppercase', marginBottom:4 }}>Phone</div>
                                  <div style={{ fontSize:14 }}>{p.phone}</div>
                                </div>
                                <div>
                                  <div style={{ fontSize:10, color:'var(--muted)', letterSpacing:1, textTransform:'uppercase', marginBottom:4 }}>Condition</div>
                                  <div style={{ fontSize:14 }}>{p.condition}</div>
                                </div>
                                <div>
                                  <div style={{ fontSize:10, color:'var(--muted)', letterSpacing:1, textTransform:'uppercase', marginBottom:4 }}>Assigned Doctor</div>
                                  <div style={{ fontSize:14 }}>{p.doctor}</div>
                                </div>
                                <div style={{ marginLeft:'auto', display:'flex', gap:10, alignItems:'center' }}>
                                  <button className="btn btn-outline btn-sm">Edit Record</button>
                                  <button className="btn btn-teal btn-sm">Add Prescription</button>
                                  <button className="btn btn-primary btn-sm">Book Appointment</button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── APPOINTMENTS ── */}
          {tab === 'appointments' && (
            <div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
                <div>
                  <h2 className="serif" style={{ color:'var(--navy)', fontSize:28 }}>Appointment Management</h2>
                  <p style={{ color:'var(--muted)', fontSize:13 }}>{DEMO_APPOINTMENTS.length} appointments total</p>
                </div>
                <Link href="/appointments" className="btn btn-primary btn-sm">+ New Appointment</Link>
              </div>

              {/* Filters */}
              <div style={{ display:'flex', gap:10, marginBottom:20, flexWrap:'wrap' }}>
                <input className="input" placeholder="🔍 Search patient or ref..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth:280 }} />
                {['All','Confirmed','Pending','In Progress','Completed','Cancelled'].map(f => (
                  <button key={f} style={{ padding:'7px 14px', borderRadius:20, border:'1px solid var(--border)', fontSize:12, fontWeight:600, cursor:'pointer', background:'#fff', color:'var(--muted)', transition:'all .2s' }}
                    onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background='var(--sky)';(e.currentTarget as HTMLElement).style.color='#fff';}}
                    onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background='#fff';(e.currentTarget as HTMLElement).style.color='var(--muted)';}}>
                    {f}
                  </button>
                ))}
              </div>

              <div style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:10, overflow:'hidden' }}>
                <table className="table">
                  <thead>
                    <tr><th>Ref</th><th>Patient</th><th>Doctor</th><th>Service</th><th>Date</th><th>Time</th><th>Status</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {filteredAppointments.map(a => (
                      <tr key={a.ref}>
                        <td><code style={{ fontSize:11, background:'var(--light)', padding:'2px 7px', borderRadius:4 }}>{a.ref}</code></td>
                        <td style={{ fontWeight:500, fontSize:13 }}>{a.patient}</td>
                        <td style={{ color:'var(--muted)', fontSize:12 }}>{a.doctor.split(' ').slice(0,2).join(' ')}</td>
                        <td style={{ fontSize:13 }}>{a.service}</td>
                        <td style={{ fontSize:12 }}>{a.date}</td>
                        <td style={{ fontSize:12 }}>{a.time}</td>
                        <td><span className={`badge ${STATUS_COLOR[a.status] ?? 'badge-gray'}`} style={{ fontSize:10 }}>{a.status}</span></td>
                        <td>
                          <div style={{ display:'flex', gap:6 }}>
                            <button className="btn btn-teal btn-sm" style={{ padding:'5px 10px', fontSize:11 }}>Confirm</button>
                            <button className="btn btn-outline btn-sm" style={{ padding:'5px 10px', fontSize:11 }}>Cancel</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── DOCTORS ── */}
          {tab === 'doctors' && (
            <div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
                <h2 className="serif" style={{ color:'var(--navy)', fontSize:28 }}>Doctor & Staff Management</h2>
                <button className="btn btn-primary btn-sm">+ Add Staff</button>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:16 }}>
                {(staffList.length > 0 ? staffList : [
                  { firstName:'Adebayo', lastName:'Olusola', role:'DOCTOR', specialty:'Joint Replacement & Fractures', patients:28, appointments:12, imageUrl:'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=300&q=70', availableDays:['Mon', 'Wed', 'Fri'], isActive:true },
                  { firstName:'Ngozi', lastName:'Anyanwu', role:'DOCTOR', specialty:'Spine & Paediatric Ortho', patients:19, appointments:8, imageUrl:'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=70', availableDays:['Tue', 'Thu', 'Sat'], isActive:true },
                  { firstName:'Funmilayo', lastName:'Oke', role:'PHYSIOTHERAPIST', specialty:'Rehabilitation & Sports', patients:22, appointments:15, imageUrl:'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=300&q=70', availableDays:['Mon – Fri'], isActive:true },
                  { firstName:'Taiwo', lastName:'Adeyemi', role:'PHARMACIST', specialty:'Drug Therapy & Counselling', patients:31, appointments:0, imageUrl:'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=300&q=70', availableDays:['Mon – Sat'], isActive:true },
                ]).map((d,i) => (
                  <div key={i} className="card" style={{ padding:0, overflow:'hidden' }}>
                    <div style={{ height:140, position:'relative', overflow:'hidden' }}>
                      <img src={d.imageUrl || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=300&q=70'} alt={`${d.firstName} ${d.lastName}`} style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'top' }} />
                      <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(10,22,40,.7),transparent)' }} />
                      <div style={{ position:'absolute', bottom:10, left:12 }}>
                        <div style={{ fontFamily:'DM Serif Display,serif', color:'#fff', fontSize:15 }}>{d.role === 'DOCTOR' ? 'Dr.' : ''} {d.firstName} {d.lastName}</div>
                        <div style={{ color:'rgba(255,255,255,.65)', fontSize:11 }}>{d.role}</div>
                      </div>
                      <div style={{ position:'absolute', top:10, right:10 }}>
                        <span className="badge" style={{ background:'rgba(22,163,74,.85)', color:'#fff', fontSize:9 }}>{d.isActive ? 'Active' : 'Inactive'}</span>
                      </div>
                    </div>
                    <div style={{ padding:'14px 16px' }}>
                      <div style={{ color:'var(--sky)', fontSize:12, fontWeight:600, marginBottom:8 }}>{d.specialty || 'General Care'}</div>
                      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:14 }}>
                        <div style={{ textAlign:'center', background:'var(--light)', borderRadius:6, padding:'8px' }}>
                          <div style={{ fontFamily:'DM Serif Display,serif', fontSize:22, color:'var(--navy)' }}>{d.patients ?? (Math.floor(Math.random() * 20) + 10)}</div>
                          <div style={{ fontSize:10, color:'var(--muted)', letterSpacing:.5 }}>PATIENTS</div>
                        </div>
                        <div style={{ textAlign:'center', background:'var(--light)', borderRadius:6, padding:'8px' }}>
                          <div style={{ fontFamily:'DM Serif Display,serif', fontSize:22, color:'var(--navy)' }}>{d.appointments ?? (Math.floor(Math.random() * 8) + 2)}</div>
                          <div style={{ fontSize:10, color:'var(--muted)', letterSpacing:.5 }}>THIS WEEK</div>
                        </div>
                      </div>
                      <div style={{ fontSize:12, color:'var(--muted)', marginBottom:12 }}>📅 Available: {Array.isArray(d.availableDays) ? d.availableDays.join(', ') : d.availableDays || 'Mon - Fri'}</div>
                      <div style={{ display:'flex', gap:8 }}>
                        <button className="btn btn-outline btn-sm" style={{ flex:1, justifyContent:'center', fontSize:12 }}>Edit</button>
                        <button className="btn btn-primary btn-sm" style={{ flex:1, justifyContent:'center', fontSize:12 }}>Schedule</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── RECORDS ── */}
          {tab === 'records' && (
            <div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
                <h2 className="serif" style={{ color:'var(--navy)', fontSize:28 }}>Medical Records</h2>
                <button className="btn btn-primary btn-sm">+ New Record</button>
              </div>
              <input className="input" placeholder="🔍 Search records..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth:360, marginBottom:20 }} />
              <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                {DEMO_PATIENTS.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).map(p => (
                  <div key={p.id} style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:10, overflow:'hidden' }}>
                    <div style={{ padding:'16px 20px', display:'flex', justifyContent:'space-between', alignItems:'center', cursor:'pointer', flexWrap:'wrap', gap:12 }}
                      onClick={() => setExpanded(expanded === `rec-${p.id}` ? null : `rec-${p.id}`)}>
                      <div style={{ display:'flex', gap:16, alignItems:'center' }}>
                        <code style={{ fontSize:12, background:'var(--light)', padding:'4px 10px', borderRadius:4 }}>{p.id}</code>
                        <div>
                          <div style={{ fontWeight:600, color:'var(--navy)', fontSize:14 }}>{p.name}</div>
                          <div style={{ color:'var(--muted)', fontSize:12 }}>{p.condition} · {p.doctor}</div>
                        </div>
                      </div>
                      <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                        <span className={`badge ${STATUS_COLOR[p.status] ?? 'badge-gray'}`}>{p.status}</span>
                        <span style={{ color:'var(--muted)', fontSize:13 }}>{expanded === `rec-${p.id}` ? '▲' : '▼'}</span>
                      </div>
                    </div>
                    {expanded === `rec-${p.id}` && (
                      <div style={{ borderTop:'1px solid var(--border)', padding:'16px 20px', background:'var(--light)' }}>
                        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:16 }}>
                          <div><div style={{ fontSize:10, color:'var(--muted)', letterSpacing:1, textTransform:'uppercase', marginBottom:4 }}>Admission Date</div><div style={{ fontSize:13, fontWeight:600 }}>{p.date}</div></div>
                          <div><div style={{ fontSize:10, color:'var(--muted)', letterSpacing:1, textTransform:'uppercase', marginBottom:4 }}>Attending Doctor</div><div style={{ fontSize:13, fontWeight:600 }}>{p.doctor}</div></div>
                          <div><div style={{ fontSize:10, color:'var(--muted)', letterSpacing:1, textTransform:'uppercase', marginBottom:4 }}>Phone</div><div style={{ fontSize:13, fontWeight:600 }}>{p.phone}</div></div>
                        </div>
                        <div style={{ background:'#fff', padding:'12px 14px', borderRadius:6, borderLeft:'3px solid var(--sky)', marginBottom:14 }}>
                          <div style={{ fontSize:11, color:'var(--muted)', letterSpacing:1, textTransform:'uppercase', marginBottom:5 }}>Clinical Notes</div>
                          <p style={{ color:'var(--navy)', fontSize:13, lineHeight:1.6 }}>Patient registered with {p.condition}. Treatment plan assigned by {p.doctor}. Ongoing monitoring in progress.</p>
                        </div>
                        <div style={{ display:'flex', gap:10 }}>
                          <button className="btn btn-outline btn-sm">Edit Record</button>
                          <button className="btn btn-teal btn-sm">Add Prescription</button>
                          <button className="btn btn-primary btn-sm">Update Status</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── MESSAGES ── */}
          {tab === 'messages' && (
            <div>
              <h2 className="serif" style={{ color:'var(--navy)', fontSize:28, marginBottom:6 }}>Contact Messages</h2>
              <p style={{ color:'var(--muted)', fontSize:13, marginBottom:24 }}>{DEMO_MESSAGES.filter(m=>!m.read).length} unread messages</p>
              <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                {DEMO_MESSAGES.map((m,i) => (
                  <div key={i} style={{ background:'#fff', border:`1px solid ${m.read ? 'var(--border)' : 'var(--sky)'}`, borderLeft:`4px solid ${m.read ? 'var(--border)' : 'var(--sky)'}`, borderRadius:10, padding:'20px 24px' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10, flexWrap:'wrap', gap:8 }}>
                      <div>
                        <div style={{ fontWeight:700, color:'var(--navy)', fontSize:15 }}>{m.name} {!m.read && <span className="badge badge-blue" style={{ fontSize:9, marginLeft:8 }}>New</span>}</div>
                        <div style={{ color:'var(--muted)', fontSize:12, marginTop:2 }}>{m.phone} · {m.service} · {m.date}</div>
                      </div>
                    </div>
                    <p style={{ color:'var(--navy)', fontSize:14, lineHeight:1.7, marginBottom:14 }}>{m.message}</p>
                    <div style={{ display:'flex', gap:10 }}>
                      <a href={`tel:${m.phone.replace(/\s/g,'')}`} className="btn btn-primary btn-sm">📞 Call Back</a>
                      <a href={`https://wa.me/${m.phone.replace(/\s/g,'').replace('0','234')}`} target="_blank" rel="noopener noreferrer" className="btn btn-teal btn-sm">💬 WhatsApp</a>
                      <button className="btn btn-outline btn-sm">Mark as Read</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      <style>{`
        @media(max-width:900px){
          div[style*="220px"]{flex-direction:column}
          div[style*="repeat(4,1fr)"]{grid-template-columns:repeat(2,1fr)!important}
          div[style*="1.4fr 1fr"]{grid-template-columns:1fr!important}
          div[style*="repeat(3,1fr)"]{grid-template-columns:1fr 1fr!important}
        }
        @media(max-width:600px){
          div[style*="padding: '32px 40px'"]{padding:20px!important}
          div[style*="repeat(2,1fr)"]{grid-template-columns:1fr!important}
        }
      `}</style>
    </>
  );
}
