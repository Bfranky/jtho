'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

type AdminTab = 'overview' | 'patients' | 'appointments' | 'doctors' | 'records' | 'messages';

const STATUS_COLOR: Record<string, string> = {
  'ACTIVE':      'badge-green',
  'CONFIRMED':   'badge-green',
  'COMPLETED':   'badge-blue',
  'IN_PROGRESS': 'badge-teal',
  'FOLLOW_UP':   'badge-gold',
  'PENDING':     'badge-gold',
  'DISCHARGED':  'badge-gray',
  'CANCELLED':   'badge-red',
};

export default function AdminPage() {
  const [tab, setTab] = useState<AdminTab>('overview');
  const [loggedIn, setLoggedIn] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [creds, setCreds] = useState({ email: '', password: '' });
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showStaffPassword, setShowStaffPassword] = useState(false);

  // Database lists
  const [patients, setPatients] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [records, setRecords] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modals visibility
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);

  // Modal forms state
  const [patientForm, setPatientForm] = useState({
    firstName: '', lastName: '', phone: '', email: '', dateOfBirth: '',
    gender: 'MALE', bloodGroup: 'UNKNOWN', address: '', allergies: '',
    emergencyContact: '', emergencyPhone: ''
  });

  const [staffForm, setStaffForm] = useState({
    email: '', password: '', firstName: '', lastName: '', phone: '',
    role: 'DOCTOR', specialty: '', qualifications: '', experience: '', bio: ''
  });

  const [recordForm, setRecordForm] = useState({
    patientId: '', staffId: '', condition: '', diagnosis: '',
    treatment: '', clinicalNotes: '', status: 'ACTIVE'
  });

  const [prescriptionForm, setPrescriptionForm] = useState({
    patientId: '', staffId: '', medication: '', dosage: '',
    frequency: '', duration: '', instructions: ''
  });

  useEffect(() => {
    checkSession();
  }, []);

  useEffect(() => {
    if (loggedIn) {
      fetchAllData();
    }
  }, [loggedIn]);

  const handleGoogleSignIn = async (response: any) => {
    setLoadingAuth(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: response.credential })
      });
      const json = await res.json();
      if (json.success) {
        if (json.data.role === 'ADMIN') {
          setSession(json.data);
          setLoggedIn(true);
        } else {
          setErrorMessage('Access Denied: Only administrators can access this portal.');
        }
      } else {
        setErrorMessage(json.error || 'Google login failed.');
      }
    } catch (err) {
      console.error('[Google login error]', err);
      setErrorMessage('Failed to sign in. Please check your connection.');
    } finally {
      setLoadingAuth(false);
    }
  };

  useEffect(() => {
    if (loggedIn) return;

    const initGoogleSignIn = () => {
      const google = (window as any).google;
      if (google) {
        google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: handleGoogleSignIn,
        });

        const btnParent = document.getElementById('google-signin-btn');
        if (btnParent) {
          google.accounts.id.renderButton(btnParent, {
            theme: 'outline',
            size: 'large',
            width: btnParent.clientWidth || 300,
          });
        }
      }
    };

    let script = document.getElementById('google-jssdk') as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.id = 'google-jssdk';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () => {
        initGoogleSignIn();
      };
    } else {
      const timer = setTimeout(initGoogleSignIn, 100);
      return () => clearTimeout(timer);
    }
  }, [loggedIn]);

  const checkSession = async () => {
    try {
      const res = await fetch('/api/auth/session');
      const json = await res.json();
      if (json.success && json.session && json.session.role === 'ADMIN') {
        setSession(json.session);
        setLoggedIn(true);
      } else {
        setSession(null);
        setLoggedIn(false);
      }
    } catch (err) {
      console.error('[Session check error]', err);
    } finally {
      setLoadingAuth(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingAuth(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/staff/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(creds)
      });
      const json = await res.json();
      if (json.success) {
        if (json.data.role === 'ADMIN') {
          setSession(json.data);
          setLoggedIn(true);
        } else {
          setErrorMessage('Access Denied: Only administrators can access this portal.');
        }
      } else {
        setErrorMessage(json.error || 'Invalid email or password.');
      }
    } catch (err) {
      console.error('[Login error]', err);
      setErrorMessage('Failed to sign in. Please check your connection.');
    } finally {
      setLoadingAuth(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setSession(null);
      setLoggedIn(false);
    } catch (err) {
      console.error('[Sign out error]', err);
    }
  };

  const fetchAllData = async () => {
    setLoadingData(true);
    try {
      const [resPatients, resAppointments, resMessages, resStaff, resRecords] = await Promise.all([
        fetch('/api/patients'),
        fetch('/api/appointments'),
        fetch('/api/contact'),
        fetch('/api/staff'),
        fetch('/api/records'),
      ]);

      const [jsonPatients, jsonAppointments, jsonMessages, jsonStaff, jsonRecords] = await Promise.all([
        resPatients.json(),
        resAppointments.json(),
        resMessages.json(),
        resStaff.json(),
        resRecords.json(),
      ]);

      if (jsonPatients.success) setPatients(jsonPatients.data);
      if (jsonAppointments.success) setAppointments(jsonAppointments.data);
      if (jsonMessages.success) setMessages(jsonMessages.data);
      if (jsonStaff.success) setStaffList(jsonStaff.data);
      if (jsonRecords.success) setRecords(jsonRecords.data);
    } catch (err) {
      console.error('[Error fetching data]', err);
    } finally {
      setLoadingData(false);
    }
  };

  // CSV Exporter
  const downloadPatientDataCSV = () => {
    if (patients.length === 0) {
      alert("No patient data available to download.");
      return;
    }

    const headers = [
      "Patient Number",
      "First Name",
      "Last Name",
      "Gender",
      "Date of Birth",
      "Phone",
      "Email",
      "Address",
      "Blood Group",
      "Allergies",
      "Emergency Contact",
      "Emergency Phone",
      "Registration Date"
    ];

    const rows = patients.map(p => [
      p.patientNumber,
      `"${p.firstName.replace(/"/g, '""')}"`,
      `"${p.lastName.replace(/"/g, '""')}"`,
      p.gender || "N/A",
      p.dateOfBirth ? new Date(p.dateOfBirth).toISOString().slice(0, 10) : "N/A",
      p.phone,
      p.email || "N/A",
      `"${(p.address || "").replace(/"/g, '""')}"`,
      p.bloodGroup || "UNKNOWN",
      `"${(p.allergies || "").replace(/"/g, '""')}"`,
      `"${(p.emergencyContact || "").replace(/"/g, '""')}"`,
      p.emergencyPhone || "N/A",
      new Date(p.createdAt).toLocaleDateString()
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `jtho_patients_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Actions
  const handleUpdateAppointmentStatus = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      const json = await res.json();
      if (json.success) {
        fetchAllData();
      } else {
        alert(json.error || 'Failed to update appointment.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkMessageRead = async (id: string) => {
    try {
      const res = await fetch('/api/contact', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const json = await res.json();
      if (json.success) {
        fetchAllData();
      } else {
        alert(json.error || 'Failed to mark message as read.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Form Submissions
  const handleRegisterPatientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patientForm)
      });
      const json = await res.json();
      if (json.success) {
        alert('Patient registered successfully!');
        setShowPatientModal(false);
        setPatientForm({
          firstName: '', lastName: '', phone: '', email: '', dateOfBirth: '',
          gender: 'MALE', bloodGroup: 'UNKNOWN', address: '', allergies: '',
          emergencyContact: '', emergencyPhone: ''
        });
        fetchAllData();
      } else {
        alert(json.error || 'Registration failed.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRegisterStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(staffForm)
      });
      const json = await res.json();
      if (json.success) {
        alert('Staff member registered successfully!');
        setShowStaffModal(false);
        setStaffForm({
          email: '', password: '', firstName: '', lastName: '', phone: '',
          role: 'DOCTOR', specialty: '', qualifications: '', experience: '', bio: ''
        });
        fetchAllData();
      } else {
        alert(json.error || 'Staff registration failed.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleNewRecordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recordForm)
      });
      const json = await res.json();
      if (json.success) {
        alert('Clinical record added successfully!');
        setShowRecordModal(false);
        setRecordForm({
          patientId: '', staffId: '', condition: '', diagnosis: '',
          treatment: '', clinicalNotes: '', status: 'ACTIVE'
        });
        fetchAllData();
      } else {
        alert(json.error || 'Failed to add record.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddPrescriptionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/prescriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prescriptionForm)
      });
      const json = await res.json();
      if (json.success) {
        alert('Prescription added successfully!');
        setShowPrescriptionModal(false);
        setPrescriptionForm({
          patientId: '', staffId: '', medication: '', dosage: '',
          frequency: '', duration: '', instructions: ''
        });
        fetchAllData();
      } else {
        alert(json.error || 'Failed to add prescription.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loadingAuth && !loggedIn) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--navy)', color: '#fff' }}>
        <div>Authenticating Administrator Session...</div>
      </div>
    );
  }

  if (!loggedIn) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--navy)', padding: 20 }}>
      <div style={{ background: '#fff', borderRadius: 12, padding: '48px', maxWidth: 400, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,.3)' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 56, height: 56, background: 'var(--sky)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 24, margin: '0 auto 16px' }}>✚</div>
          <h2 className="serif" style={{ color: 'var(--navy)', fontSize: 26, marginBottom: 6 }}>Admin Portal</h2>
          <p style={{ color: 'var(--muted)', fontSize: 13 }}>Sign in with your administrator credentials.</p>
        </div>
        {errorMessage && (
          <div style={{ background: 'rgba(220,38,38,0.1)', color: 'var(--red)', padding: '12px', borderRadius: 6, fontSize: 12, marginBottom: 16, borderLeft: '3px solid var(--red)' }}>
            ⚠️ {errorMessage}
          </div>
        )}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 16 }}>
            <label className="label">Email Address</label>
            <input className="input" type="email" required placeholder="admin@jesusthehealer.com" value={creds.email} onChange={e => setCreds(c => ({ ...c, email: e.target.value }))} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label className="label">Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                className="input" 
                type={showLoginPassword ? 'text' : 'password'} 
                required 
                placeholder="••••••••" 
                value={creds.password} 
                onChange={e => setCreds(c => ({ ...c, password: e.target.value }))} 
                style={{ paddingRight: '50px' }}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowLoginPassword(!showLoginPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px',
                  color: 'var(--sky)',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                title={showLoginPassword ? 'Hide Password' : 'Show Password'}
              >
                {showLoginPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: 13, marginBottom: 16 }}>
            {loadingAuth ? 'Signing In...' : 'Sign In to Admin'}
          </button>
          
          <div style={{ margin: '20px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }}></div>
            <span style={{ color: 'var(--muted)', fontSize: 12 }}>or</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }}></div>
          </div>
          
          <div 
            id="google-signin-btn" 
            style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              minHeight: 40,
              width: '100%'
            }}
          ></div>
        </form>
      </div>
    </div>
  );

  // Filters
  const filteredPatients = patients.filter(p =>
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    p.patientNumber.toLowerCase().includes(search.toLowerCase()) ||
    p.phone.includes(search)
  );

  const filteredAppointments = appointments.filter(a =>
    `${a.patient?.firstName} ${a.patient?.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    a.appointmentRef.toLowerCase().includes(search.toLowerCase())
  );

  const filteredRecords = records.filter(r =>
    `${r.patient?.firstName} ${r.patient?.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    r.patient?.patientNumber.toLowerCase().includes(search.toLowerCase()) ||
    r.condition.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Top bar */}
      <div style={{ background: 'var(--navy)', padding: '12px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, background: 'var(--sky)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 16 }}>✚</div>
          <div>
            <div style={{ fontFamily: 'DM Serif Display,serif', color: '#fff', fontSize: 14 }}>Jesus The Healer</div>
            <div style={{ color: 'rgba(255,255,255,.4)', fontSize: 9, letterSpacing: 3, textTransform: 'uppercase' }}>Admin Portal</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ color: 'rgba(255,255,255,.5)', fontSize: 13 }}>{session?.email}</span>
          <button onClick={handleSignOut} style={{ background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.15)', color: '#fff', padding: '6px 14px', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>Sign Out</button>
        </div>
      </div>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 54px)' }}>
        {/* Sidebar */}
        <div style={{ width: 220, background: 'var(--navy)', padding: '20px 12px', flexShrink: 0 }}>
          {[
            { key: 'overview',     label: 'Overview',      icon: '📊' },
            { key: 'patients',     label: 'Patients',      icon: '👥' },
            { key: 'appointments', label: 'Appointments',  icon: '📅' },
            { key: 'doctors',      label: 'Doctors',       icon: '👨‍⚕️' },
            { key: 'records',      label: 'Records',       icon: '📋' },
            { key: 'messages',     label: 'Messages',      icon: '💬' },
          ].map(t => (
            <button key={t.key} onClick={() => { setTab(t.key as AdminTab); setSearch(''); }}
              className={`sidebar-item ${tab === t.key ? 'active' : ''}`}
              style={{ color: tab === t.key ? 'var(--sky-light)' : 'rgba(255,255,255,.45)', marginBottom: 2 }}>
              <span>{t.icon}</span> {t.label}
              {t.key === 'messages' && messages.filter(m => !m.isRead).length > 0 && (
                <span style={{ marginLeft: 'auto', background: 'var(--red)', color: '#fff', fontSize: 10, fontWeight: 700, width: 18, height: 18, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {messages.filter(m => !m.isRead).length}
                </span>
              )}
            </button>
          ))}
          <div style={{ borderTop: '1px solid rgba(255,255,255,.07)', marginTop: 16, paddingTop: 16 }}>
            <Link href="/" className="sidebar-item" style={{ color: 'rgba(255,255,255,.35)' }}>
              <span>🌐</span> View Website
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, background: 'var(--cream)', padding: '32px 40px', overflowY: 'auto' }}>
          {loadingData ? (
            <div style={{ textAlign: 'center', padding: '100px', color: 'var(--muted)' }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>🔄</div>
              <div>Retrieving real-time hospital database records...</div>
            </div>
          ) : (
            <>
              {/* ── OVERVIEW TAB ── */}
              {tab === 'overview' && (
                <div>
                  <h2 className="serif" style={{ color: 'var(--navy)', fontSize: 28, marginBottom: 6 }}>Dashboard Overview</h2>
                  <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 28 }}>System Active (Database Connected)</p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 28 }}>
                    {[
                      { icon: '👥', label: 'Total Patients',       val: patients.length,     sub: 'Real patient count',          color: 'var(--sky)'  },
                      { icon: '📅', label: 'Scheduled Appointments', val: appointments.length, sub: 'Total booked visits',       color: 'var(--teal)' },
                      { icon: '👨‍⚕️', label: 'Active Specialists',     val: staffList.filter(s => s.role === 'DOCTOR').length, sub: 'Registered clinicians', color: 'var(--gold)' },
                      { icon: '💬', label: 'Unread Messages',      val: messages.filter(m => !m.isRead).length, sub: 'Awaiting response', color: 'var(--red)'  },
                    ].map((s, i) => (
                      <div key={i} className="stat-card" style={{ borderTop: `3px solid ${s.color}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                          <div style={{ fontSize: 28 }}>{s.icon}</div>
                          <div className="stat-value" style={{ color: s.color }}>{s.val}</div>
                        </div>
                        <div className="stat-label">{s.label}</div>
                        <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>{s.sub}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20 }}>
                    <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
                      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontWeight: 700, color: 'var(--navy)', fontSize: 15 }}>Recent Appointments</div>
                        <button onClick={() => setTab('appointments')} style={{ background: 'none', border: 'none', color: 'var(--sky)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>View all →</button>
                      </div>
                      {appointments.length === 0 ? (
                        <div style={{ padding: 40, textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>No appointments scheduled.</div>
                      ) : (
                        <table className="table">
                          <thead><tr><th>Patient</th><th>Doctor</th><th>Service</th><th>Time</th><th>Status</th></tr></thead>
                          <tbody>
                            {appointments.slice(0, 5).map(a => (
                              <tr key={a.id}>
                                <td style={{ fontWeight: 500, fontSize: 13 }}>{a.patient ? `${a.patient.firstName} ${a.patient.lastName}` : 'N/A'}</td>
                                <td style={{ color: 'var(--muted)', fontSize: 12 }}>{a.staff ? `Dr. ${a.staff.firstName} ${a.staff.lastName}` : 'Unassigned'}</td>
                                <td style={{ fontSize: 12 }}>{a.service}</td>
                                <td style={{ fontSize: 12 }}>{a.scheduledTime}</td>
                                <td><span className={`badge ${STATUS_COLOR[a.status] ?? 'badge-gray'}`} style={{ fontSize: 10 }}>{a.status}</span></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 10, padding: '20px' }}>
                        <div style={{ fontWeight: 700, color: 'var(--navy)', fontSize: 14, marginBottom: 16 }}>Patient Details Summary</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                            <span>Total Registered Patients:</span>
                            <strong style={{ color: 'var(--sky)' }}>{patients.length}</strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                            <span>Total Clinical Records:</span>
                            <strong style={{ color: 'var(--teal)' }}>{records.length}</strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                            <span>Total Staff/Clinicians:</span>
                            <strong style={{ color: 'var(--gold)' }}>{staffList.length}</strong>
                          </div>
                        </div>
                      </div>

                      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 10, padding: '20px', flex: 1 }}>
                        <div style={{ fontWeight: 700, color: 'var(--navy)', fontSize: 14, marginBottom: 14 }}>Latest Enquiries</div>
                        {messages.filter(m => !m.isRead).slice(0, 2).map((m, i) => (
                          <div key={m.id} style={{ padding: '10px 0', borderBottom: i === 0 && messages.filter(m => !m.isRead).length > 1 ? '1px solid var(--border)' : 'none' }}>
                            <div style={{ fontWeight: 600, color: 'var(--navy)', fontSize: 13 }}>{m.name}</div>
                            <div style={{ color: 'var(--muted)', fontSize: 12, marginTop: 2 }}>{m.message.substring(0, 50)}...</div>
                          </div>
                        ))}
                        {messages.filter(m => !m.isRead).length === 0 && (
                          <div style={{ padding: '10px 0', color: 'var(--muted)', fontSize: 12 }}>No unread enquiries.</div>
                        )}
                        <button onClick={() => setTab('messages')} style={{ background: 'none', border: 'none', color: 'var(--sky)', fontSize: 12, fontWeight: 600, cursor: 'pointer', marginTop: 10 }}>View messages →</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── PATIENTS TAB ── */}
              {tab === 'patients' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <div>
                      <h2 className="serif" style={{ color: 'var(--navy)', fontSize: 28 }}>Patient Database</h2>
                      <p style={{ color: 'var(--muted)', fontSize: 13 }}>{patients.length} records registered</p>
                    </div>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <button onClick={downloadPatientDataCSV} className="btn btn-teal btn-sm" style={{ gap: 6 }}>
                        📥 Download Patient Data (CSV)
                      </button>
                      <button onClick={() => setShowPatientModal(true)} className="btn btn-primary btn-sm">
                        + Register New Patient
                      </button>
                    </div>
                  </div>
                  <input className="input" placeholder="🔍 Search patients by name, ID or phone..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 360, marginBottom: 20 }} />

                  {filteredPatients.length === 0 ? (
                    <div style={{ padding: 60, background: '#fff', border: '1px solid var(--border)', borderRadius: 10, textAlign: 'center', color: 'var(--muted)' }}>
                      No patient files found. Click "+ Register New Patient" to input data.
                    </div>
                  ) : (
                    <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
                      <table className="table">
                        <thead>
                          <tr><th>Patient ID</th><th>Name</th><th>Phone</th><th>Gender</th><th>Blood Group</th><th>Latest Record</th><th>Created Date</th><th></th></tr>
                        </thead>
                        <tbody>
                          {filteredPatients.map(p => (
                            <>
                              <tr key={p.id} style={{ cursor: 'pointer' }} onClick={() => setExpanded(expanded === p.id ? null : p.id)}>
                                <td><code style={{ fontSize: 12, background: 'var(--light)', padding: '3px 8px', borderRadius: 4 }}>{p.patientNumber}</code></td>
                                <td style={{ fontWeight: 600, fontSize: 13 }}>{p.firstName} {p.lastName}</td>
                                <td style={{ color: 'var(--muted)', fontSize: 12 }}>{p.phone}</td>
                                <td style={{ fontSize: 13 }}>{p.gender || 'N/A'}</td>
                                <td style={{ fontSize: 13 }}>{p.bloodGroup}</td>
                                <td style={{ fontSize: 13, color: 'var(--muted)' }}>
                                  {p.records?.[0] ? p.records[0].condition : 'No active record'}
                                </td>
                                <td style={{ fontSize: 12, color: 'var(--muted)' }}>{new Date(p.createdAt).toLocaleDateString()}</td>
                                <td style={{ color: 'var(--muted)', fontSize: 12 }}>{expanded === p.id ? '▲' : '▼'}</td>
                              </tr>
                              {expanded === p.id && (
                                <tr>
                                  <td colSpan={8} style={{ background: 'var(--light)', padding: '16px 24px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
                                        <div>
                                          <div style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>Date of Birth</div>
                                          <div style={{ fontSize: 13, fontWeight: 600 }}>{p.dateOfBirth ? new Date(p.dateOfBirth).toLocaleDateString() : 'N/A'}</div>
                                        </div>
                                        <div>
                                          <div style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>Email Address</div>
                                          <div style={{ fontSize: 13, fontWeight: 600 }}>{p.email || 'N/A'}</div>
                                        </div>
                                        <div>
                                          <div style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>Allergies</div>
                                          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--red)' }}>{p.allergies || 'None recorded'}</div>
                                        </div>
                                        <div>
                                          <div style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>Emergency Contact</div>
                                          <div style={{ fontSize: 13, fontWeight: 600 }}>{p.emergencyContact ? `${p.emergencyContact} (${p.emergencyPhone})` : 'N/A'}</div>
                                        </div>
                                      </div>
                                      <div>
                                        <div style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>Residential Address</div>
                                        <div style={{ fontSize: 13 }}>{p.address || 'No address logged'}</div>
                                      </div>
                                      <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                                        <button onClick={() => { setRecordForm(f => ({ ...f, patientId: p.id })); setShowRecordModal(true); }} className="btn btn-teal btn-sm">📝 Add Clinical Record</button>
                                        <button onClick={() => { setPrescriptionForm(f => ({ ...f, patientId: p.id })); setShowPrescriptionModal(true); }} className="btn btn-outline btn-sm">💊 Add Prescription</button>
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
                  )}
                </div>
              )}

              {/* ── APPOINTMENTS TAB ── */}
              {tab === 'appointments' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <div>
                      <h2 className="serif" style={{ color: 'var(--navy)', fontSize: 28 }}>Visits & Appointments</h2>
                      <p style={{ color: 'var(--muted)', fontSize: 13 }}>{appointments.length} scheduled visits</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                    <input className="input" placeholder="🔍 Search by patient name or ref..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 360 }} />
                  </div>

                  {filteredAppointments.length === 0 ? (
                    <div style={{ padding: 60, background: '#fff', border: '1px solid var(--border)', borderRadius: 10, textAlign: 'center', color: 'var(--muted)' }}>
                      No appointments scheduled.
                    </div>
                  ) : (
                    <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
                      <table className="table">
                        <thead>
                          <tr><th>Reference</th><th>Patient</th><th>Phone</th><th>Service</th><th>Specialist</th><th>Date</th><th>Time</th><th>Status</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                          {filteredAppointments.map(a => (
                            <tr key={a.id}>
                              <td><code style={{ fontSize: 11, background: 'var(--light)', padding: '2px 7px', borderRadius: 4 }}>{a.appointmentRef}</code></td>
                              <td style={{ fontWeight: 600, fontSize: 13 }}>{a.patient ? `${a.patient.firstName} ${a.patient.lastName}` : 'N/A'}</td>
                              <td style={{ fontSize: 12, color: 'var(--muted)' }}>{a.patient?.phone}</td>
                              <td style={{ fontSize: 13 }}>{a.service}</td>
                              <td style={{ color: 'var(--muted)', fontSize: 12 }}>{a.staff ? `${a.staff.firstName} ${a.staff.lastName}` : 'Unassigned'}</td>
                              <td style={{ fontSize: 12 }}>{new Date(a.scheduledDate).toLocaleDateString()}</td>
                              <td style={{ fontSize: 12 }}>{a.scheduledTime}</td>
                              <td><span className={`badge ${STATUS_COLOR[a.status] ?? 'badge-gray'}`} style={{ fontSize: 10 }}>{a.status}</span></td>
                              <td>
                                {a.status === 'PENDING' && (
                                  <div style={{ display: 'flex', gap: 6 }}>
                                    <button onClick={() => handleUpdateAppointmentStatus(a.id, 'CONFIRMED')} className="btn btn-teal btn-sm" style={{ padding: '4px 8px', fontSize: 11 }}>Confirm</button>
                                    <button onClick={() => handleUpdateAppointmentStatus(a.id, 'CANCELLED')} className="btn btn-outline btn-sm" style={{ padding: '4px 8px', fontSize: 11, color: 'var(--red)', borderColor: 'var(--red)' }}>Cancel</button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* ── DOCTORS TAB ── */}
              {tab === 'doctors' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <div>
                      <h2 className="serif" style={{ color: 'var(--navy)', fontSize: 28 }}>Specialists & Clinical Staff</h2>
                      <p style={{ color: 'var(--muted)', fontSize: 13 }}>Registered medical staff accounts</p>
                    </div>
                    <button onClick={() => setShowStaffModal(true)} className="btn btn-primary btn-sm">+ Register Clinical Staff</button>
                  </div>

                  {staffList.length === 0 ? (
                    <div style={{ padding: 60, background: '#fff', border: '1px solid var(--border)', borderRadius: 10, textAlign: 'center', color: 'var(--muted)' }}>
                      No staff accounts registered. Click "+ Register Clinical Staff" to create an account.
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 16 }}>
                      {staffList.map((d, i) => (
                        <div key={d.id || i} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                          <div style={{ height: 140, position: 'relative', overflow: 'hidden', background: 'var(--navy)' }}>
                            {d.imageUrl && (
                              <img src={d.imageUrl} alt={`${d.firstName} ${d.lastName}`} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
                            )}
                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(10,22,40,.85),transparent)' }} />
                            <div style={{ position: 'absolute', bottom: 10, left: 12 }}>
                              <div style={{ fontFamily: 'DM Serif Display,serif', color: '#fff', fontSize: 16 }}>{d.role === 'DOCTOR' ? 'Dr. ' : ''}{d.firstName} {d.lastName}</div>
                              <div style={{ color: 'rgba(255,255,255,.65)', fontSize: 11, letterSpacing: 0.5 }}>{d.role}</div>
                            </div>
                            <div style={{ position: 'absolute', top: 10, right: 10 }}>
                              <span className="badge" style={{ background: d.isActive ? 'rgba(22,163,74,.85)' : 'rgba(100,116,139,.85)', color: '#fff', fontSize: 9 }}>{d.isActive ? 'Active' : 'Inactive'}</span>
                            </div>
                          </div>
                          <div style={{ padding: '14px 16px' }}>
                            <div style={{ color: 'var(--sky)', fontSize: 12, fontWeight: 600, marginBottom: 8 }}>{d.specialty || 'General Care'}</div>
                            <div style={{ fontSize: 12, color: 'var(--navy)', fontWeight: 500, marginBottom: 4 }}>🎓 {d.qualifications || 'No qualifications listed'}</div>
                            {d.experience && (
                              <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8 }}>⭐ {d.experience} Years Experience</div>
                            )}
                            <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 12 }}>📅 Days: {d.availableDays ? d.availableDays.join(', ') : 'Mon - Fri'}</div>
                            <p style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5, height: 45, overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.bio || 'No biography written.'}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── RECORDS TAB ── */}
              {tab === 'records' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <div>
                      <h2 className="serif" style={{ color: 'var(--navy)', fontSize: 28 }}>Clinical Records</h2>
                      <p style={{ color: 'var(--muted)', fontSize: 13 }}>Logged diagnoses & treatments</p>
                    </div>
                    <button onClick={() => setShowRecordModal(true)} className="btn btn-primary btn-sm">+ Add Clinical Record</button>
                  </div>
                  <input className="input" placeholder="🔍 Search records by patient name or condition..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 360, marginBottom: 20 }} />

                  {filteredRecords.length === 0 ? (
                    <div style={{ padding: 60, background: '#fff', border: '1px solid var(--border)', borderRadius: 10, textAlign: 'center', color: 'var(--muted)' }}>
                      No clinical history found.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                      {filteredRecords.map(r => (
                        <div key={r.id} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
                          <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', flexWrap: 'wrap', gap: 12 }}
                            onClick={() => setExpanded(expanded === `rec-${r.id}` ? null : `rec-${r.id}`)}>
                            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                              <code style={{ fontSize: 12, background: 'var(--light)', padding: '4px 10px', borderRadius: 4 }}>{r.patient?.patientNumber}</code>
                              <div>
                                <div style={{ fontWeight: 600, color: 'var(--navy)', fontSize: 14 }}>{r.patient?.firstName} {r.patient?.lastName}</div>
                                <div style={{ color: 'var(--muted)', fontSize: 12 }}>Condition: {r.condition} · Recorded by: {r.staff ? `${r.staff.firstName} ${r.staff.lastName}` : 'System'}</div>
                              </div>
                            </div>
                            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                              <span className={`badge ${STATUS_COLOR[r.status] ?? 'badge-gray'}`}>{r.status}</span>
                              <span style={{ color: 'var(--muted)', fontSize: 13 }}>{expanded === `rec-${r.id}` ? '▲' : '▼'}</span>
                            </div>
                          </div>
                          {expanded === `rec-${r.id}` && (
                            <div style={{ borderTop: '1px solid var(--border)', padding: '16px 20px', background: 'var(--light)' }}>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 16 }}>
                                <div><div style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>Admission Date</div><div style={{ fontSize: 13, fontWeight: 600 }}>{new Date(r.admissionDate).toLocaleDateString()}</div></div>
                                <div><div style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>Diagnosis</div><div style={{ fontSize: 13, fontWeight: 600 }}>{r.diagnosis || 'None'}</div></div>
                                <div><div style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>Treatment Plan</div><div style={{ fontSize: 13, fontWeight: 600 }}>{r.treatment || 'None'}</div></div>
                              </div>
                              <div style={{ background: '#fff', padding: '12px 14px', borderRadius: 6, borderLeft: '3px solid var(--sky)' }}>
                                <div style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 5 }}>Attending Notes</div>
                                <p style={{ color: 'var(--navy)', fontSize: 13, lineHeight: 1.6 }}>{r.clinicalNotes || 'No notes saved.'}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── MESSAGES TAB ── */}
              {tab === 'messages' && (
                <div>
                  <h2 className="serif" style={{ color: 'var(--navy)', fontSize: 28, marginBottom: 6 }}>Web Enquiries</h2>
                  <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 24 }}>{messages.filter(m => !m.isRead).length} unread contact submissions</p>

                  {messages.length === 0 ? (
                    <div style={{ padding: 60, background: '#fff', border: '1px solid var(--border)', borderRadius: 10, textAlign: 'center', color: 'var(--muted)' }}>
                      No contact messages received.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                      {messages.map(m => (
                        <div key={m.id} style={{ background: '#fff', border: `1px solid ${m.isRead ? 'var(--border)' : 'var(--sky)'}`, borderLeft: `4px solid ${m.isRead ? 'var(--border)' : 'var(--sky)'}`, borderRadius: 10, padding: '20px 24px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
                            <div>
                              <div style={{ fontWeight: 700, color: 'var(--navy)', fontSize: 15 }}>{m.name} {!m.isRead && <span className="badge badge-blue" style={{ fontSize: 9, marginLeft: 8 }}>New</span>}</div>
                              <div style={{ color: 'var(--muted)', fontSize: 12, marginTop: 2 }}>Phone: {m.phone} · Service Interested: {m.service || 'General'} · Date: {new Date(m.createdAt).toLocaleDateString()}</div>
                            </div>
                          </div>
                          <p style={{ color: 'var(--navy)', fontSize: 14, lineHeight: 1.7, marginBottom: 14 }}>{m.message}</p>
                          <div style={{ display: 'flex', gap: 10 }}>
                            <a href={`tel:${m.phone.replace(/\s/g,'')}`} className="btn btn-primary btn-sm">📞 Call Back</a>
                            <a href={`https://wa.me/${m.phone.replace(/\s/g,'').replace(/^0/,'234')}`} target="_blank" rel="noopener noreferrer" className="btn btn-teal btn-sm">💬 WhatsApp</a>
                            {!m.isRead && (
                              <button onClick={() => handleMarkMessageRead(m.id)} className="btn btn-outline btn-sm">Mark as Read</button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── MODALS ── */}

      {/* 1. Register Patient Modal */}
      {showPatientModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,22,40,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 32, width: '100%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 50px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 className="serif" style={{ fontSize: 24, color: 'var(--navy)' }}>Register New Patient</h3>
              <button onClick={() => setShowPatientModal(false)} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: 'var(--muted)' }}>&times;</button>
            </div>
            <form onSubmit={handleRegisterPatientSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label className="label">First Name *</label>
                  <input className="input" required value={patientForm.firstName} onChange={e => setPatientForm({ ...patientForm, firstName: e.target.value })} />
                </div>
                <div>
                  <label className="label">Last Name *</label>
                  <input className="input" required value={patientForm.lastName} onChange={e => setPatientForm({ ...patientForm, lastName: e.target.value })} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label className="label">Phone Number *</label>
                  <input className="input" required placeholder="e.g. 08031234567" value={patientForm.phone} onChange={e => setPatientForm({ ...patientForm, phone: e.target.value })} />
                </div>
                <div>
                  <label className="label">Email Address</label>
                  <input className="input" type="email" value={patientForm.email} onChange={e => setPatientForm({ ...patientForm, email: e.target.value })} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label className="label">Date of Birth</label>
                  <input className="input" type="date" value={patientForm.dateOfBirth} onChange={e => setPatientForm({ ...patientForm, dateOfBirth: e.target.value })} />
                </div>
                <div>
                  <label className="label">Gender</label>
                  <select className="select" value={patientForm.gender} onChange={e => setPatientForm({ ...patientForm, gender: e.target.value })}>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label className="label">Blood Group</label>
                  <select className="select" value={patientForm.bloodGroup} onChange={e => setPatientForm({ ...patientForm, bloodGroup: e.target.value })}>
                    <option value="UNKNOWN">Unknown</option>
                    <option value="A_POS">A+</option>
                    <option value="A_NEG">A-</option>
                    <option value="B_POS">B+</option>
                    <option value="B_NEG">B-</option>
                    <option value="AB_POS">AB+</option>
                    <option value="AB_NEG">AB-</option>
                    <option value="O_POS">O+</option>
                    <option value="O_NEG">O-</option>
                  </select>
                </div>
                <div>
                  <label className="label">Allergies</label>
                  <input className="input" placeholder="e.g. Penicillin" value={patientForm.allergies} onChange={e => setPatientForm({ ...patientForm, allergies: e.target.value })} />
                </div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label className="label">Address</label>
                <input className="input" value={patientForm.address} onChange={e => setPatientForm({ ...patientForm, address: e.target.value })} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
                <div>
                  <label className="label">Emergency Contact Name</label>
                  <input className="input" value={patientForm.emergencyContact} onChange={e => setPatientForm({ ...patientForm, emergencyContact: e.target.value })} />
                </div>
                <div>
                  <label className="label">Emergency Phone</label>
                  <input className="input" value={patientForm.emergencyPhone} onChange={e => setPatientForm({ ...patientForm, emergencyPhone: e.target.value })} />
                </div>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Register Patient</button>
            </form>
          </div>
        </div>
      )}

      {/* 2. Register Staff Modal */}
      {showStaffModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,22,40,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 32, width: '100%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 50px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 className="serif" style={{ fontSize: 24, color: 'var(--navy)' }}>Register Clinical Staff</h3>
              <button onClick={() => setShowStaffModal(false)} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: 'var(--muted)' }}>&times;</button>
            </div>
            <form onSubmit={handleRegisterStaffSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label className="label">First Name *</label>
                  <input className="input" required value={staffForm.firstName} onChange={e => setStaffForm({ ...staffForm, firstName: e.target.value })} />
                </div>
                <div>
                  <label className="label">Last Name *</label>
                  <input className="input" required value={staffForm.lastName} onChange={e => setStaffForm({ ...staffForm, lastName: e.target.value })} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label className="label">Work Email *</label>
                  <input className="input" type="email" required placeholder="doctor@jesusthehealer.com" value={staffForm.email} onChange={e => setStaffForm({ ...staffForm, email: e.target.value })} />
                </div>
                <div>
                  <label className="label">Password *</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      className="input" 
                      type={showStaffPassword ? 'text' : 'password'} 
                      required 
                      placeholder="Minimum 6 characters" 
                      value={staffForm.password} 
                      onChange={e => setStaffForm({ ...staffForm, password: e.target.value })} 
                      style={{ paddingRight: '50px' }}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowStaffPassword(!showStaffPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '16px',
                        color: 'var(--sky)',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      title={showStaffPassword ? 'Hide Password' : 'Show Password'}
                    >
                      {showStaffPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>
              </div>
              <div id="google-auth-container" style={{ marginBottom: 12 }}></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label className="label">Role *</label>
                  <select className="select" value={staffForm.role} onChange={e => setStaffForm({ ...staffForm, role: e.target.value })}>
                    <option value="DOCTOR">Doctor</option>
                    <option value="PHYSIOTHERAPIST">Physiotherapist</option>
                    <option value="NURSE">Nurse</option>
                    <option value="PHARMACIST">Pharmacist</option>
                    <option value="RECEPTIONIST">Receptionist</option>
                    <option value="ADMIN">Administrator</option>
                  </select>
                </div>
                <div>
                  <label className="label">Phone Number</label>
                  <input className="input" value={staffForm.phone} onChange={e => setStaffForm({ ...staffForm, phone: e.target.value })} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label className="label">Experience (Years)</label>
                  <input className="input" type="number" placeholder="Years" value={staffForm.experience} onChange={e => setStaffForm({ ...staffForm, experience: e.target.value })} />
                </div>
                <div>
                  <label className="label">Specialty / Focus</label>
                  <input className="input" placeholder="e.g. Spine Specialist" value={staffForm.specialty} onChange={e => setStaffForm({ ...staffForm, specialty: e.target.value })} />
                </div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label className="label">Qualifications</label>
                <input className="input" placeholder="e.g. MBBS, FRCS" value={staffForm.qualifications} onChange={e => setStaffForm({ ...staffForm, qualifications: e.target.value })} />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label className="label">Clinical Biography</label>
                <textarea className="input" rows={3} placeholder="Background and expertise..." value={staffForm.bio} onChange={e => setStaffForm({ ...staffForm, bio: e.target.value })} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Create Staff Account</button>
            </form>
          </div>
        </div>
      )}

      {/* 3. Add Clinical Record Modal */}
      {showRecordModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,22,40,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 32, width: '100%', maxWidth: 500, boxShadow: '0 20px 50px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 className="serif" style={{ fontSize: 22, color: 'var(--navy)' }}>Add Clinical Record</h3>
              <button onClick={() => setShowRecordModal(false)} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: 'var(--muted)' }}>&times;</button>
            </div>
            <form onSubmit={handleNewRecordSubmit}>
              <div style={{ marginBottom: 12 }}>
                <label className="label">Patient *</label>
                <select className="select" required value={recordForm.patientId} onChange={e => setRecordForm({ ...recordForm, patientId: e.target.value })}>
                  <option value="">-- Select Patient --</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.firstName} {p.lastName} ({p.patientNumber})</option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label className="label">Attending Specialist (Optional)</label>
                <select className="select" value={recordForm.staffId} onChange={e => setRecordForm({ ...recordForm, staffId: e.target.value })}>
                  <option value="">-- None / Select Doctor --</option>
                  {staffList.map(s => (
                    <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.role})</option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label className="label">Condition *</label>
                <input className="input" required placeholder="e.g. Knee Fracture" value={recordForm.condition} onChange={e => setRecordForm({ ...recordForm, condition: e.target.value })} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label className="label">Diagnosis</label>
                  <input className="input" value={recordForm.diagnosis} onChange={e => setRecordForm({ ...recordForm, diagnosis: e.target.value })} />
                </div>
                <div>
                  <label className="label">Treatment Plan</label>
                  <input className="input" value={recordForm.treatment} onChange={e => setRecordForm({ ...recordForm, treatment: e.target.value })} />
                </div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label className="label">Status</label>
                <select className="select" value={recordForm.status} onChange={e => setRecordForm({ ...recordForm, status: e.target.value })}>
                  <option value="ACTIVE">Active Treatment</option>
                  <option value="FOLLOW_UP">Follow Up Required</option>
                  <option value="DISCHARGED">Discharged</option>
                  <option value="REFERRED">Referred Out</option>
                </select>
              </div>
              <div style={{ marginBottom: 24 }}>
                <label className="label">Attending Clinical Notes</label>
                <textarea className="input" rows={3} placeholder="Write clinical notes..." value={recordForm.clinicalNotes} onChange={e => setRecordForm({ ...recordForm, clinicalNotes: e.target.value })} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Add Record</button>
            </form>
          </div>
        </div>
      )}

      {/* 4. Add Prescription Modal */}
      {showPrescriptionModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,22,40,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 32, width: '100%', maxWidth: 500, boxShadow: '0 20px 50px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 className="serif" style={{ fontSize: 22, color: 'var(--navy)' }}>Add Prescription</h3>
              <button onClick={() => setShowPrescriptionModal(false)} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: 'var(--muted)' }}>&times;</button>
            </div>
            <form onSubmit={handleAddPrescriptionSubmit}>
              <div style={{ marginBottom: 12 }}>
                <label className="label">Patient *</label>
                <select className="select" required value={prescriptionForm.patientId} onChange={e => setPrescriptionForm({ ...prescriptionForm, patientId: e.target.value })}>
                  <option value="">-- Select Patient --</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.firstName} {p.lastName} ({p.patientNumber})</option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label className="label">Prescribing Specialist (Optional)</label>
                <select className="select" value={prescriptionForm.staffId} onChange={e => setPrescriptionForm({ ...prescriptionForm, staffId: e.target.value })}>
                  <option value="">-- None / Select Doctor --</option>
                  {staffList.map(s => (
                    <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.role})</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label className="label">Medication *</label>
                  <input className="input" required placeholder="e.g. Ibuprofen" value={prescriptionForm.medication} onChange={e => setPrescriptionForm({ ...prescriptionForm, medication: e.target.value })} />
                </div>
                <div>
                  <label className="label">Dosage *</label>
                  <input className="input" required placeholder="e.g. 400mg" value={prescriptionForm.dosage} onChange={e => setPrescriptionForm({ ...prescriptionForm, dosage: e.target.value })} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label className="label">Frequency *</label>
                  <input className="input" required placeholder="e.g. 3 times daily" value={prescriptionForm.frequency} onChange={e => setPrescriptionForm({ ...prescriptionForm, frequency: e.target.value })} />
                </div>
                <div>
                  <label className="label">Duration *</label>
                  <input className="input" required placeholder="e.g. 2 weeks" value={prescriptionForm.duration} onChange={e => setPrescriptionForm({ ...prescriptionForm, duration: e.target.value })} />
                </div>
              </div>
              <div style={{ marginBottom: 24 }}>
                <label className="label">Special Instructions</label>
                <textarea className="input" rows={2} placeholder="Take with food, avoid alcohol, etc..." value={prescriptionForm.instructions} onChange={e => setPrescriptionForm({ ...prescriptionForm, instructions: e.target.value })} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Save Prescription</button>
            </form>
          </div>
        </div>
      )}

      <Footer />
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
