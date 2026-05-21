'use client';

import { useState } from 'react';

interface PatientRecord {
  id:        string;
  name:      string;
  phone:     string;
  dob:       string;
  condition: string;
  doctor:    string;
  visitDate: string;
  status:    'Active' | 'Follow-Up' | 'Discharged';
  notes:     string;
}

interface FormData {
  name: string; phone: string; dob: string; gender: string;
  address: string; condition: string; doctor: string;
  visitDate: string; notes: string;
}

const DEMO_RECORDS: PatientRecord[] = [
  { id: 'JTH-001', name: 'Mrs. Adunola Fashola',    phone: '0803 111 2222', dob: '1974-03-12', condition: 'Knee Joint Arthritis',    doctor: 'Dr. Adebayo Olusola',   visitDate: '2025-04-10', status: 'Active',     notes: 'Responding well to physiotherapy. Review in 2 weeks.' },
  { id: 'JTH-002', name: 'Mr. Chukwuemeka Obi',     phone: '0805 333 4444', dob: '1986-07-25', condition: 'Lumbar Disc Herniation',   doctor: 'Dr. Ngozi Anyanwu',     visitDate: '2025-03-28', status: 'Follow-Up',  notes: 'Post-treatment follow-up. MRI results pending.' },
  { id: 'JTH-003', name: 'Tunde Adesanya',           phone: '0901 555 6666', dob: '1992-11-04', condition: 'Ankle Ligament Tear',      doctor: 'Mrs. Funmilayo Oke',    visitDate: '2025-04-22', status: 'Active',     notes: 'Physiotherapy ongoing. Week 3 of 8-week program.' },
  { id: 'JTH-004', name: 'Pastor Emmanuel Dada',     phone: '0702 777 8888', dob: '1968-01-18', condition: 'Bilateral Knee Arthritis', doctor: 'Dr. Adebayo Olusola',   visitDate: '2025-02-14', status: 'Discharged', notes: 'Full recovery achieved. Discharged with home exercises.' },
];

const statusColor: Record<string, { bg: string; text: string }> = {
  'Active':     { bg: 'rgba(26,127,110,0.12)',  text: 'var(--teal)' },
  'Follow-Up':  { bg: 'rgba(200,150,62,0.12)',  text: 'var(--gold)' },
  'Discharged': { bg: 'rgba(107,114,128,0.12)', text: 'var(--gray)' },
};

export default function PatientRecords() {
  const [tab,        setTab]        = useState<'register' | 'records'>('register');
  const [records,    setRecords]    = useState<PatientRecord[]>(DEMO_RECORDS);
  const [form,       setForm]       = useState<FormData>({ name: '', phone: '', dob: '', gender: '', address: '', condition: '', doctor: '', visitDate: '', notes: '' });
  const [saved,      setSaved]      = useState(false);
  const [search,     setSearch]     = useState('');
  const [filter,     setFilter]     = useState<string>('All');
  const [expanded,   setExpanded]   = useState<string | null>(null);

  const set = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleRegister = () => {
    if (!form.name || !form.phone || !form.condition) return;
    const newRec: PatientRecord = {
      id:        `JTH-${String(records.length + 1).padStart(3, '0')}`,
      name:      form.name,
      phone:     form.phone,
      dob:       form.dob,
      condition: form.condition,
      doctor:    form.doctor || 'To be assigned',
      visitDate: form.visitDate || new Date().toISOString().split('T')[0],
      status:    'Active',
      notes:     form.notes || 'Newly registered patient.',
    };
    setRecords((r) => [newRec, ...r]);
    setSaved(true);
    setTimeout(() => { setSaved(false); setForm({ name: '', phone: '', dob: '', gender: '', address: '', condition: '', doctor: '', visitDate: '', notes: '' }); setTab('records'); }, 2500);
  };

  const filtered = records.filter((r) => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase()) || r.condition.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || r.status === filter;
    return matchSearch && matchFilter;
  });

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '11px 14px',
    border: '1px solid var(--border)', background: 'var(--white)',
    color: 'var(--navy)', fontSize: 13, fontFamily: 'DM Sans, sans-serif',
    outline: 'none', borderRadius: 4, transition: 'border-color 0.2s',
  };
  const labelStyle: React.CSSProperties = { color: 'var(--navy)', fontSize: 11, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', display: 'block', marginBottom: 7 };

  return (
    <section id="records" style={{ padding: '100px 40px', background: 'var(--white)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Heading */}
        <div style={{ marginBottom: 48 }}>
          <div className="section-label">Patient Management</div>
          <h2 className="serif" style={{ fontSize: 'clamp(34px,4vw,52px)', color: 'var(--navy)', lineHeight: 1.1, marginBottom: 12 }}>
            Patient Records <span style={{ color: 'var(--sky)', fontStyle: 'italic' }}>Portal</span>
          </h2>
          <p style={{ color: 'var(--gray)', fontSize: 15, maxWidth: 560, lineHeight: 1.8 }}>
            Easily register new patients and manage ongoing care records. Keep everything organised in one secure, accessible place.
          </p>
        </div>

        {/* Tab switcher */}
        <div style={{ display: 'flex', gap: 2, marginBottom: 36, background: 'var(--light)', padding: 4, borderRadius: 8, width: 'fit-content' }}>
          {(['register', 'records'] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              style={{ padding: '10px 28px', fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: 13, cursor: 'pointer', borderRadius: 6, border: 'none', transition: 'all 0.25s', background: tab === t ? 'var(--white)' : 'transparent', color: tab === t ? 'var(--sky)' : 'var(--gray)', boxShadow: tab === t ? '0 2px 8px rgba(10,22,40,0.08)' : 'none' }}>
              {t === 'register' ? '➕ Register Patient' : `📋 View Records (${records.length})`}
            </button>
          ))}
        </div>

        {/* ── REGISTER FORM ── */}
        {tab === 'register' && (
          <div style={{ background: 'var(--light)', border: '1px solid var(--border)', borderTop: '3px solid var(--sky)', borderRadius: 8, padding: '40px' }}>
            {saved ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div style={{ fontSize: 56, marginBottom: 12 }}>✅</div>
                <h3 className="serif" style={{ color: 'var(--navy)', fontSize: 28, marginBottom: 10 }}>Patient Registered!</h3>
                <p style={{ color: 'var(--gray)', fontSize: 15 }}>Record created successfully. Switching to records view...</p>
              </div>
            ) : (
              <>
                <h3 className="serif" style={{ color: 'var(--navy)', fontSize: 22, marginBottom: 4 }}>New Patient Registration</h3>
                <p style={{ color: 'var(--gray)', fontSize: 13, marginBottom: 28 }}>Fill in the patient's details to create their medical record.</p>

                {/* Personal info */}
                <div style={{ marginBottom: 8 }}>
                  <div style={{ color: 'var(--sky)', fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>Personal Information</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <div>
                      <label style={labelStyle}>Full Name *</label>
                      <input style={inputStyle} placeholder="Patient's full name" value={form.name} onChange={set('name')}
                        onFocus={(e) => (e.target.style.borderColor = 'var(--sky)')} onBlur={(e) => (e.target.style.borderColor = 'var(--border)')} />
                    </div>
                    <div>
                      <label style={labelStyle}>Phone Number *</label>
                      <input style={inputStyle} placeholder="0803 000 0000" value={form.phone} onChange={set('phone')}
                        onFocus={(e) => (e.target.style.borderColor = 'var(--sky)')} onBlur={(e) => (e.target.style.borderColor = 'var(--border)')} />
                    </div>
                    <div>
                      <label style={labelStyle}>Date of Birth</label>
                      <input type="date" style={inputStyle} value={form.dob} onChange={set('dob')}
                        onFocus={(e) => (e.target.style.borderColor = 'var(--sky)')} onBlur={(e) => (e.target.style.borderColor = 'var(--border)')} />
                    </div>
                    <div>
                      <label style={labelStyle}>Gender</label>
                      <select style={inputStyle} value={form.gender} onChange={set('gender')}
                        onFocus={(e) => (e.target.style.borderColor = 'var(--sky)')} onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}>
                        <option value="">Select gender</option>
                        <option>Male</option><option>Female</option><option>Other</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ marginBottom: 24 }}>
                    <label style={labelStyle}>Home Address</label>
                    <input style={inputStyle} placeholder="Patient's home address" value={form.address} onChange={set('address')}
                      onFocus={(e) => (e.target.style.borderColor = 'var(--sky)')} onBlur={(e) => (e.target.style.borderColor = 'var(--border)')} />
                  </div>
                </div>

                {/* Medical info */}
                <div style={{ color: 'var(--sky)', fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>Medical Information</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={labelStyle}>Presenting Condition *</label>
                    <select style={inputStyle} value={form.condition} onChange={set('condition')}
                      onFocus={(e) => (e.target.style.borderColor = 'var(--sky)')} onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}>
                      <option value="">Select condition</option>
                      <option>Fracture</option>
                      <option>Joint Pain / Arthritis</option>
                      <option>Spine / Back Pain</option>
                      <option>Sports Injury</option>
                      <option>Post-Surgical Rehabilitation</option>
                      <option>Paediatric Orthopaedic</option>
                      <option>General Musculoskeletal</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Assigned Doctor</label>
                    <select style={inputStyle} value={form.doctor} onChange={set('doctor')}
                      onFocus={(e) => (e.target.style.borderColor = 'var(--sky)')} onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}>
                      <option value="">Assign doctor</option>
                      <option>Dr. Adebayo Olusola</option>
                      <option>Dr. Ngozi Anyanwu</option>
                      <option>Mrs. Funmilayo Oke</option>
                      <option>Pharm. Taiwo Adeyemi</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Visit / Admission Date</label>
                    <input type="date" style={inputStyle} value={form.visitDate} onChange={set('visitDate')}
                      onFocus={(e) => (e.target.style.borderColor = 'var(--sky)')} onBlur={(e) => (e.target.style.borderColor = 'var(--border)')} />
                  </div>
                </div>
                <div style={{ marginBottom: 28 }}>
                  <label style={labelStyle}>Clinical Notes</label>
                  <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={3} placeholder="Initial assessment notes, symptoms description..."
                    value={form.notes} onChange={set('notes')}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--sky)')} onBlur={(e) => (e.target.style.borderColor = 'var(--border)')} />
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                  <button className="btn-primary" onClick={handleRegister} style={{ flex: 1, padding: '14px' }}>
                    ✚ Register Patient
                  </button>
                  <button onClick={() => setForm({ name: '', phone: '', dob: '', gender: '', address: '', condition: '', doctor: '', visitDate: '', notes: '' })}
                    style={{ padding: '14px 20px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--gray)', fontFamily: 'DM Sans, sans-serif', fontSize: 13, cursor: 'pointer', borderRadius: 4 }}>
                    Clear
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── RECORDS VIEW ── */}
        {tab === 'records' && (
          <div>
            {/* Search + filter bar */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
              <input style={{ ...inputStyle, flex: 2, minWidth: 220, background: 'var(--light)' }} placeholder="🔍 Search by name, ID or condition..." value={search} onChange={(e) => setSearch(e.target.value)} />
              {(['All', 'Active', 'Follow-Up', 'Discharged'] as const).map((f) => (
                <button key={f} onClick={() => setFilter(f)}
                  style={{ padding: '10px 18px', fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: 12, cursor: 'pointer', borderRadius: 4, border: '1px solid var(--border)', background: filter === f ? 'var(--sky)' : 'var(--white)', color: filter === f ? '#fff' : 'var(--gray)', transition: 'all 0.2s' }}>
                  {f} {f === 'All' ? `(${records.length})` : `(${records.filter(r => r.status === f).length})`}
                </button>
              ))}
            </div>

            {/* Summary cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 24 }}>
              {[
                { label: 'Total Patients', val: records.length, icon: '👥', color: 'var(--sky)' },
                { label: 'Active',         val: records.filter(r => r.status === 'Active').length, icon: '🏥', color: 'var(--teal)' },
                { label: 'Follow-Up',      val: records.filter(r => r.status === 'Follow-Up').length, icon: '📅', color: 'var(--gold)' },
                { label: 'Discharged',     val: records.filter(r => r.status === 'Discharged').length, icon: '✅', color: 'var(--gray)' },
              ].map((s, i) => (
                <div key={i} style={{ background: 'var(--light)', border: '1px solid var(--border)', borderRadius: 8, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ fontSize: 24 }}>{s.icon}</span>
                  <div>
                    <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 28, color: s.color, lineHeight: 1 }}>{s.val}</div>
                    <div style={{ color: 'var(--gray)', fontSize: 11, letterSpacing: 0.5, marginTop: 3 }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Records list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filtered.length === 0 && (
                <div style={{ textAlign: 'center', padding: '48px', color: 'var(--gray)', fontSize: 15 }}>
                  No records found matching your search.
                </div>
              )}
              {filtered.map((rec) => (
                <div key={rec.id}
                  onClick={() => setExpanded(expanded === rec.id ? null : rec.id)}
                  style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden', cursor: 'pointer', transition: 'border-color 0.2s', borderColor: expanded === rec.id ? 'var(--sky)' : 'var(--border)' }}>

                  {/* Row */}
                  <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: 'auto 1fr auto auto auto', gap: 20, alignItems: 'center' }}>
                    {/* ID */}
                    <div style={{ background: 'var(--light)', padding: '6px 12px', borderRadius: 4, fontFamily: 'DM Serif Display, serif', color: 'var(--sky)', fontSize: 13 }}>{rec.id}</div>
                    {/* Name + condition */}
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--navy)', fontSize: 14 }}>{rec.name}</div>
                      <div style={{ color: 'var(--gray)', fontSize: 12, marginTop: 2 }}>{rec.condition} · {rec.doctor}</div>
                    </div>
                    {/* Date */}
                    <div style={{ color: 'var(--gray)', fontSize: 12, whiteSpace: 'nowrap' }}>{rec.visitDate}</div>
                    {/* Status badge */}
                    <div style={{ background: statusColor[rec.status].bg, color: statusColor[rec.status].text, fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', padding: '5px 12px', borderRadius: 20, whiteSpace: 'nowrap' }}>
                      {rec.status}
                    </div>
                    {/* Chevron */}
                    <div style={{ color: 'var(--gray)', fontSize: 12, transition: 'transform 0.2s', transform: expanded === rec.id ? 'rotate(180deg)' : 'none' }}>▼</div>
                  </div>

                  {/* Expanded notes */}
                  {expanded === rec.id && (
                    <div style={{ padding: '0 20px 18px', borderTop: '1px solid var(--border)' }}>
                      <div style={{ paddingTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 12 }}>
                        <div><div style={{ color: 'var(--gray)', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>Phone</div><div style={{ color: 'var(--navy)', fontSize: 13 }}>{rec.phone}</div></div>
                        <div><div style={{ color: 'var(--gray)', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>Date of Birth</div><div style={{ color: 'var(--navy)', fontSize: 13 }}>{rec.dob || '—'}</div></div>
                        <div><div style={{ color: 'var(--gray)', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>Visit Date</div><div style={{ color: 'var(--navy)', fontSize: 13 }}>{rec.visitDate}</div></div>
                      </div>
                      <div style={{ background: 'var(--light)', padding: '12px 16px', borderRadius: 6, borderLeft: '3px solid var(--sky)' }}>
                        <div style={{ color: 'var(--gray)', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>Clinical Notes</div>
                        <p style={{ color: 'var(--navy)', fontSize: 13, lineHeight: 1.6 }}>{rec.notes}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <p style={{ textAlign: 'center', color: 'var(--gray)', fontSize: 12, marginTop: 24, fontStyle: 'italic' }}>
              📌 This is a demonstration portal. A full implementation would include secure authentication, database integration, and encrypted storage.
            </p>
          </div>
        )}
      </div>

      <style>{`
        @media(max-width:768px) {
          #records > div > div:nth-child(4) { grid-template-columns:repeat(2,1fr)!important; }
          #records .rec-row { grid-template-columns:auto 1fr auto!important; }
        }
        @media(max-width:600px) { #records { padding:80px 20px!important; } #records > div > div:nth-child(4) { grid-template-columns:1fr 1fr!important; } }
      `}</style>
    </section>
  );
}
