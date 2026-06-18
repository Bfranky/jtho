'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';

type Tab = 'patients' | 'records' | 'vitals';

interface StaffProfile {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  specialty: string | null;
  qualifications: string | null;
  experience: number | null;
  bio: string | null;
  imageUrl: string | null;
}

interface UserSession {
  userId: string;
  email: string;
  role: string;
  staffProfile: StaffProfile;
}

export default function StaffPortalPage() {
  // Auth state
  const [session, setSession] = useState<UserSession | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Login form
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  // Register form
  const [registerForm, setRegisterForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'DOCTOR',
    specialty: '',
    qualifications: '',
    experience: '',
    bio: '',
  });

  // Dashboard state
  const [activeTab, setActiveTab] = useState<Tab>('patients');
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  const [vitalsHistory, setVitalsHistory] = useState<any[]>([]);
  const [notesHistory, setNotesHistory] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Action modals / forms
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [newPatient, setNewPatient] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    dateOfBirth: '',
    gender: 'MALE',
    bloodGroup: 'UNKNOWN',
    allergies: '',
    emergencyContact: '',
    emergencyPhone: '',
  });

  const [newNote, setNewNote] = useState({
    condition: '',
    diagnosis: '',
    treatment: '',
    clinicalNotes: '',
    status: 'ACTIVE',
  });

  const [newVital, setNewVital] = useState({
    bloodPressure: '',
    pulse: '',
    temperature: '',
    weight: '',
    height: '',
    oxygenSat: '',
    notes: '',
  });

  // Check session on mount (both localStorage and verify with server)
  useEffect(() => {
    const checkStaffSession = async () => {
      const savedSession = localStorage.getItem('jtho_staff_session');
      if (savedSession) {
        try {
          setSession(JSON.parse(savedSession));
        } catch (e) {
          localStorage.removeItem('jtho_staff_session');
        }
      }

      try {
        const res = await fetch('/api/auth/session');
        const json = await res.json();
        if (json.success && json.session && (json.session.role === 'STAFF' || json.session.role === 'ADMIN')) {
          setSession(json.session);
          localStorage.setItem('jtho_staff_session', JSON.stringify(json.session));
        } else {
          setSession(null);
          localStorage.removeItem('jtho_staff_session');
        }
      } catch (err) {
        console.error('[Session verify error]', err);
      }
    };

    checkStaffSession();
  }, []);

  // Fetch patients when logged in
  useEffect(() => {
    if (session) {
      fetchPatients();
    }
  }, [session]);

  // Fetch patient details (vitals, notes) when a patient is selected
  useEffect(() => {
    if (selectedPatient) {
      fetchVitals(selectedPatient.id);
      fetchNotes(selectedPatient.id);
    }
  }, [selectedPatient]);

  const handleGoogleSignIn = async (response: any) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: response.credential }),
      });
      const json = await res.json();
      if (json.success) {
        setSession(json.data);
        localStorage.setItem('jtho_staff_session', JSON.stringify(json.data));
        flashMessage('Welcome back to your workspace!', 'success');
      } else {
        flashMessage(json.error || 'Google login failed', 'error');
      }
    } catch (err) {
      console.error(err);
      flashMessage('Connection error. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authMode !== 'login' || session) return;

    const initGoogleSignIn = () => {
      const google = (window as any).google;
      if (google) {
        google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '119927695510-6tafvslk7sea63pjc57c16f0hdd1fkmv.apps.googleusercontent.com',
          callback: handleGoogleSignIn,
        });

        const btnParent = document.getElementById('google-signin-btn');
        if (btnParent) {
          google.accounts.id.renderButton(btnParent, {
            theme: 'outline',
            size: 'large',
            width: btnParent.clientWidth || 360,
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
  }, [authMode, session]);

  const flashMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  };

  const fetchPatients = async () => {
    try {
      const res = await fetch('/api/patients');
      const json = await res.json();
      if (json.success) {
        setPatients(json.data);
      }
    } catch (err) {
      console.error(err);
      flashMessage('Failed to load patients list', 'error');
    }
  };

  const fetchVitals = async (patientId: string) => {
    try {
      const res = await fetch(`/api/vitals?patientId=${patientId}`);
      const json = await res.json();
      if (json.success) {
        setVitalsHistory(json.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchNotes = async (patientId: string) => {
    try {
      const res = await fetch(`/api/records?patientId=${patientId}`);
      const json = await res.json();
      if (json.success) {
        setNotesHistory(json.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) {
      flashMessage('Please enter both email and password', 'error');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/staff/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      });
      const json = await res.json();
      if (json.success) {
        setSession(json.data);
        localStorage.setItem('jtho_staff_session', JSON.stringify(json.data));
        flashMessage('Welcome back to your workspace!', 'success');
      } else {
        flashMessage(json.error || 'Invalid credentials', 'error');
      }
    } catch (err) {
      console.error(err);
      flashMessage('Connection error. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const { email, password, firstName, lastName, role } = registerForm;
    if (!email || !password || !firstName || !lastName || !role) {
      flashMessage('All starred (*) fields are required', 'error');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerForm),
      });
      const json = await res.json();
      if (json.success) {
        flashMessage('Staff registration successful! You can now log in.', 'success');
        setAuthMode('login');
        setLoginForm({ email, password });
      } else {
        flashMessage(json.error || 'Registration failed', 'error');
      }
    } catch (err) {
      console.error(err);
      flashMessage('Server error during registration', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error(err);
    }
    localStorage.removeItem('jtho_staff_session');
    setSession(null);
    setSelectedPatient(null);
    flashMessage('Signed out successfully', 'success');
  };

  const handleRegisterPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatient.firstName || !newPatient.lastName || !newPatient.phone) {
      flashMessage('First name, last name, and phone number are required', 'error');
      return;
    }
    try {
      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPatient),
      });
      const json = await res.json();
      if (json.success) {
        flashMessage('Patient registered successfully!', 'success');
        fetchPatients();
        setShowAddPatient(false);
        setNewPatient({
          firstName: '',
          lastName: '',
          phone: '',
          email: '',
          dateOfBirth: '',
          gender: 'MALE',
          bloodGroup: 'UNKNOWN',
          allergies: '',
          emergencyContact: '',
          emergencyPhone: '',
        });
      } else {
        flashMessage(json.error || 'Failed to register patient', 'error');
      }
    } catch (err) {
      console.error(err);
      flashMessage('Connection error while registering patient', 'error');
    }
  };

  const handleSaveNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.condition) {
      flashMessage('Condition is required to write a clinical note', 'error');
      return;
    }
    try {
      const res = await fetch('/api/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newNote,
          patientId: selectedPatient.id,
          staffId: session?.staffProfile?.id,
        }),
      });
      const json = await res.json();
      if (json.success) {
        flashMessage('Clinical note added successfully!', 'success');
        fetchNotes(selectedPatient.id);
        // Refresh patient status in master list
        fetchPatients();
        // Reset note form
        setNewNote({
          condition: '',
          diagnosis: '',
          treatment: '',
          clinicalNotes: '',
          status: 'ACTIVE',
        });
      } else {
        flashMessage(json.error || 'Failed to save note', 'error');
      }
    } catch (err) {
      console.error(err);
      flashMessage('Connection error while saving clinical note', 'error');
    }
  };

  const handleSaveVital = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/vitals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newVital,
          patientId: selectedPatient.id,
        }),
      });
      const json = await res.json();
      if (json.success) {
        flashMessage('Vital signs recorded successfully!', 'success');
        fetchVitals(selectedPatient.id);
        // Reset form
        setNewVital({
          bloodPressure: '',
          pulse: '',
          temperature: '',
          weight: '',
          height: '',
          oxygenSat: '',
          notes: '',
        });
      } else {
        flashMessage(json.error || 'Failed to record vitals', 'error');
      }
    } catch (err) {
      console.error(err);
      flashMessage('Connection error while recording vitals', 'error');
    }
  };

  const filteredPatients = patients.filter(
    (p) =>
      `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.patientNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.includes(searchQuery)
  );

  return (
    <>
      <Navbar />

      {/* ── RICH ANNOUNCEMENT TOAST ── */}
      {message && (
        <div
          style={{
            position: 'fixed',
            top: 24,
            right: 24,
            zIndex: 9999,
            background: message.type === 'success' ? '#0F766E' : '#BE123C',
            color: '#fff',
            padding: '16px 24px',
            borderRadius: 8,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            fontSize: 14,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            borderLeft: '4px solid rgba(255,255,255,0.4)',
            animation: 'slideIn 0.3s ease-out forwards',
          }}
        >
          <span>{message.type === 'success' ? '✨' : '🚨'}</span>
          <span>{message.text}</span>
        </div>
      )}

      {/* ── MAIN CONTENT AREA ── */}
      <div style={{ minHeight: '88vh', background: 'var(--cream)', display: 'flex', flexDirection: 'column' }}>
        
        {!session ? (
          /* ── AUTHORIZATION MODE SCREEN (SPLIT DESIGN) ── */
          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', flex: 1, minHeight: '88vh' }} className="auth-split-grid">
            
            {/* Left Column - Branding and Trust Statements */}
            <div
              style={{
                background: 'linear-gradient(135deg, #0A1628, #1E3A8A)',
                padding: '80px 60px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                color: '#fff',
                position: 'relative',
                overflow: 'hidden',
              }}
              className="hide-mobile"
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: 'radial-gradient(circle,rgba(255,255,255,.03) 1px,transparent 0)',
                  backgroundSize: '32px 32px',
                }}
              />
              <div style={{ position: 'relative', zIndex: 2, maxWidth: 540 }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    background: 'rgba(13,148,136,.2)',
                    border: '1px solid rgba(13,148,136,.3)',
                    padding: '6px 14px',
                    borderRadius: 40,
                    marginBottom: 28,
                  }}
                >
                  <span style={{ width: 7, height: 7, background: 'var(--teal-light)', borderRadius: '50%' }} />
                  <span style={{ color: 'var(--teal-light)', fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>
                    24/7 SPECIALIST CLINICAL WORKSPACE
                  </span>
                </div>
                <h1 className="serif" style={{ fontSize: 48, lineHeight: 1.15, marginBottom: 20 }}>
                  Clinical Excellence, <br />
                  <span style={{ color: 'var(--sky-light)', fontStyle: 'italic' }}>Seamless Collaboration.</span>
                </h1>
                <p style={{ color: 'rgba(255,255,255,.65)', fontSize: 16, lineHeight: 1.8, marginBottom: 40 }}>
                  Welcome to the medical portal of Jesus The Healer Orthopaedic Home. Register or sign in to document clinical findings, view patient recovery progress, and write medical records.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {[
                    { title: 'Home-Service Optimized', desc: 'Manage mobile treatment records for physiotherapy and machine massage visits.' },
                    { title: 'Secure Clinical Seeding', desc: 'Patient history logs, vitals, and doctor instructions strictly audited.' },
                    { title: '24 Hour Operational Support', desc: 'Real-time patient check-ins and clinical team communication.' },
                  ].map((x, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: 14 }}>
                      <div
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          background: 'rgba(56,189,248,.15)',
                          color: 'var(--sky-light)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: 12,
                          flexShrink: 0,
                        }}
                      >
                        ✓
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14, color: '#fff' }}>{x.title}</div>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,.5)' }}>{x.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Form Area */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '60px 40px',
                background: '#fff',
              }}
            >
              <div style={{ maxWidth: 440, width: '100%' }}>
                {authMode === 'login' ? (
                  /* Login Block */
                  <form onSubmit={handleLogin}>
                    <div style={{ textAlign: 'center', marginBottom: 32 }}>
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          background: 'var(--sky)',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontSize: 20,
                          margin: '0 auto 16px',
                        }}
                      >
                        🏥
                      </div>
                      <h2 className="serif" style={{ color: 'var(--navy)', fontSize: 28, marginBottom: 6 }}>
                        Staff Portal Sign In
                      </h2>
                      <p style={{ color: 'var(--muted)', fontSize: 13 }}>
                        Access your clinical dashboard to write patient records.
                      </p>
                    </div>

                    <div style={{ marginBottom: 16 }}>
                      <label className="label">Work Email Address</label>
                      <input
                        type="email"
                        required
                        className="input"
                        placeholder="doctor@jesusthehealer.com"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm((l) => ({ ...l, email: e.target.value }))}
                      />
                    </div>

                    <div style={{ marginBottom: 28 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <label className="label">Secure Password</label>
                      </div>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showLoginPassword ? 'text' : 'password'}
                          required
                          className="input"
                          placeholder="••••••••"
                          value={loginForm.password}
                          onChange={(e) => setLoginForm((l) => ({ ...l, password: e.target.value }))}
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

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary"
                      style={{ width: '100%', padding: '14px', borderRadius: 6, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer' }}
                    >
                      {loading ? 'Authenticating...' : 'Sign In to Portal'}
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
                        width: '100%',
                        marginBottom: 16
                      }}
                    ></div>

                    <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 13, marginTop: 24 }}>
                      New medical staff?{' '}
                      <button
                        type="button"
                        onClick={() => setAuthMode('register')}
                        style={{ color: 'var(--sky)', fontWeight: 700, border: 'none', background: 'none', cursor: 'pointer' }}
                      >
                        Create an Account
                      </button>
                    </p>
                  </form>
                ) : (
                  /* Registration Block */
                  <form onSubmit={handleRegister} style={{ maxHeight: '80vh', overflowY: 'auto', paddingRight: 8 }}>
                    <div style={{ textAlign: 'center', marginBottom: 24 }}>
                      <h2 className="serif" style={{ color: 'var(--navy)', fontSize: 26, marginBottom: 4 }}>
                        Staff Registration
                      </h2>
                      <p style={{ color: 'var(--muted)', fontSize: 13 }}>
                        Register to join the active orthopaedic care team.
                      </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                      <div>
                        <label className="label">First Name *</label>
                        <input
                          required
                          className="input"
                          placeholder="e.g. Funmi"
                          value={registerForm.firstName}
                          onChange={(e) => setRegisterForm((r) => ({ ...r, firstName: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="label">Last Name *</label>
                        <input
                          required
                          className="input"
                          placeholder="e.g. Benson"
                          value={registerForm.lastName}
                          onChange={(e) => setRegisterForm((r) => ({ ...r, lastName: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div style={{ marginBottom: 12 }}>
                      <label className="label">Phone Number</label>
                      <input
                        className="input"
                        placeholder="0803 123 4567"
                        value={registerForm.phone}
                        onChange={(e) => setRegisterForm((r) => ({ ...r, phone: e.target.value }))}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 12, marginBottom: 12 }}>
                      <div>
                        <label className="label">Role *</label>
                        <select
                          className="select"
                          value={registerForm.role}
                          onChange={(e) => setRegisterForm((r) => ({ ...r, role: e.target.value }))}
                        >
                          <option value="DOCTOR">Doctor</option>
                          <option value="PHYSIOTHERAPIST">Physiotherapist</option>
                          <option value="NURSE">Nurse</option>
                          <option value="PHARMACIST">Pharmacist</option>
                          <option value="RECEPTIONIST">Receptionist</option>
                          <option value="ADMIN">Administrator</option>
                        </select>
                      </div>
                      <div>
                        <label className="label">Specialty / Category</label>
                        <input
                          className="input"
                          placeholder="e.g. Machine Massage"
                          value={registerForm.specialty}
                          onChange={(e) => setRegisterForm((r) => ({ ...r, specialty: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 12, marginBottom: 12 }}>
                      <div>
                        <label className="label">Qualifications</label>
                        <input
                          className="input"
                          placeholder="e.g. MBBS, MPT (Ortho)"
                          value={registerForm.qualifications}
                          onChange={(e) => setRegisterForm((r) => ({ ...r, qualifications: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="label">Experience (Yrs)</label>
                        <input
                          type="number"
                          className="input"
                          placeholder="Years"
                          value={registerForm.experience}
                          onChange={(e) => setRegisterForm((r) => ({ ...r, experience: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div style={{ marginBottom: 12 }}>
                      <label className="label">Bio / Profile Description</label>
                      <textarea
                        className="input"
                        rows={2}
                        placeholder="Brief background..."
                        value={registerForm.bio}
                        onChange={(e) => setRegisterForm((r) => ({ ...r, bio: e.target.value }))}
                      />
                    </div>

                    <div style={{ marginBottom: 12 }}>
                      <label className="label">Work Email *</label>
                      <input
                        type="email"
                        required
                        className="input"
                        placeholder="e.g. funmi.b@jtho.com"
                        value={registerForm.email}
                        onChange={(e) => setRegisterForm((r) => ({ ...r, email: e.target.value }))}
                      />
                    </div>

                    <div style={{ marginBottom: 20 }}>
                      <label className="label">Create Password *</label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showRegisterPassword ? 'text' : 'password'}
                          required
                          className="input"
                          placeholder="At least 6 characters"
                          value={registerForm.password}
                          onChange={(e) => setRegisterForm((r) => ({ ...r, password: e.target.value }))}
                          style={{ paddingRight: '50px' }}
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegisterPassword(!showRegisterPassword)}
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
                          title={showRegisterPassword ? 'Hide Password' : 'Show Password'}
                        >
                          {showRegisterPassword ? '🙈' : '👁️'}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary"
                      style={{ width: '100%', padding: '12px', borderRadius: 6, fontWeight: 700 }}
                    >
                      {loading ? 'Creating Profile...' : 'Complete Staff Registration'}
                    </button>

                    <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 13, marginTop: 18 }}>
                      Already registered?{' '}
                      <button
                        type="button"
                        onClick={() => setAuthMode('login')}
                        style={{ color: 'var(--sky)', fontWeight: 700, border: 'none', background: 'none', cursor: 'pointer' }}
                      >
                        Sign In here
                      </button>
                    </p>
                  </form>
                )}
              </div>
            </div>

          </div>
        ) : (
          /* ── LOGGED IN CLINICAL WORKSPACE ── */
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            
            {/* Top Workspace Header Bar */}
            <div
              style={{
                background: 'var(--navy)',
                color: '#fff',
                padding: '16px 40px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid rgba(255,255,255,.05)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: 'var(--sky)',
                    backgroundImage: session.staffProfile?.imageUrl ? `url(${session.staffProfile.imageUrl})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'top',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontFamily: 'DM Serif Display,serif',
                    fontSize: 20,
                  }}
                >
                  {!session.staffProfile?.imageUrl && session.staffProfile?.firstName[0]}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <h3 className="serif" style={{ fontSize: 18, color: '#fff' }}>
                      {session.staffProfile?.firstName} {session.staffProfile?.lastName}
                    </h3>
                    <span
                      style={{
                        background: 'rgba(56,189,248,.15)',
                        color: 'var(--sky-light)',
                        fontSize: 10,
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: 20,
                        letterSpacing: .5,
                      }}
                    >
                      {session.staffProfile?.role}
                    </span>
                  </div>
                  <div style={{ color: 'rgba(255,255,255,.45)', fontSize: 12 }}>
                    Specialty: {session.staffProfile?.specialty || 'General Practitioner'} · {session.staffProfile?.qualifications || ''}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <div style={{ textAlign: 'right' }} className="hide-mobile">
                  <div style={{ color: 'rgba(255,255,255,.3)', fontSize: 10, letterSpacing: 1, textTransform: 'uppercase' }}>
                    Operational Hours
                  </div>
                  <div style={{ color: 'var(--teal-light)', fontSize: 12, fontWeight: 600 }}>
                    🟢 Always Active (24/7 Operations)
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    color: '#F87171',
                    padding: '8px 16px',
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Sign Out
                </button>
              </div>
            </div>

            {/* Split Screen Workspace Area */}
            <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', flex: 1 }} className="workspace-split-grid">
              
              {/* Left Column: Patient Selection & Search */}
              <div
                style={{
                  background: '#fff',
                  borderRight: '1px solid var(--border)',
                  display: 'flex',
                  flexDirection: 'column',
                  maxHeight: 'calc(100vh - 146px)',
                  overflowY: 'auto',
                }}
              >
                <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div style={{ fontWeight: 800, color: 'var(--navy)', fontSize: 16 }}>Patients Master List</div>
                    <button
                      onClick={() => setShowAddPatient(true)}
                      style={{
                        background: 'var(--sky)',
                        color: '#fff',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: 6,
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      + Register Patient
                    </button>
                  </div>

                  <input
                    className="input"
                    placeholder="🔍 Search name, phone, or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ fontSize: 13, padding: 10 }}
                  />
                </div>

                {/* Patient list container */}
                <div style={{ flex: 1, overflowY: 'auto' }}>
                  {filteredPatients.length === 0 ? (
                    <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
                      No patients found.
                    </div>
                  ) : (
                    filteredPatients.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => setSelectedPatient(p)}
                        style={{
                          padding: '16px 20px',
                          borderBottom: '1px solid var(--border)',
                          cursor: 'pointer',
                          background: selectedPatient?.id === p.id ? 'var(--light)' : 'transparent',
                          borderLeft: selectedPatient?.id === p.id ? '4px solid var(--sky)' : '4px solid transparent',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontWeight: 700, color: 'var(--navy)', fontSize: 14 }}>
                            {p.firstName} {p.lastName}
                          </span>
                          <code style={{ fontSize: 10, background: 'var(--border)', padding: '2px 6px', borderRadius: 4 }}>
                            {p.patientNumber}
                          </code>
                        </div>
                        <div style={{ color: 'var(--muted)', fontSize: 12, display: 'flex', justifyContent: 'space-between' }}>
                          <span>📞 {p.phone}</span>
                          <span>🩸 {p.bloodGroup}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Right Column: Work Desk */}
              <div
                style={{
                  padding: '32px 40px',
                  maxHeight: 'calc(100vh - 146px)',
                  overflowY: 'auto',
                }}
                className="workspace-desk"
              >
                {showAddPatient ? (
                  /* ── REGISTER NEW PATIENT FORM ── */
                  <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 10, padding: 36, maxWidth: 640 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>
                      <h2 className="serif" style={{ color: 'var(--navy)', fontSize: 24 }}>Register New Patient</h2>
                      <button onClick={() => setShowAddPatient(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 16 }}>✕</button>
                    </div>

                    <form onSubmit={handleRegisterPatient}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                        <div>
                          <label className="label">First Name *</label>
                          <input
                            required
                            className="input"
                            value={newPatient.firstName}
                            onChange={(e) => setNewPatient((n) => ({ ...n, firstName: e.target.value }))}
                          />
                        </div>
                        <div>
                          <label className="label">Last Name *</label>
                          <input
                            required
                            className="input"
                            value={newPatient.lastName}
                            onChange={(e) => setNewPatient((n) => ({ ...n, lastName: e.target.value }))}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                        <div>
                          <label className="label">Phone Number *</label>
                          <input
                            required
                            className="input"
                            placeholder="0803..."
                            value={newPatient.phone}
                            onChange={(e) => setNewPatient((n) => ({ ...n, phone: e.target.value }))}
                          />
                        </div>
                        <div>
                          <label className="label">Email Address</label>
                          <input
                            type="email"
                            className="input"
                            value={newPatient.email}
                            onChange={(e) => setNewPatient((n) => ({ ...n, email: e.target.value }))}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 0.8fr 1.2fr', gap: 16, marginBottom: 16 }}>
                        <div>
                          <label className="label">Date of Birth</label>
                          <input
                            type="date"
                            className="input"
                            value={newPatient.dateOfBirth}
                            onChange={(e) => setNewPatient((n) => ({ ...n, dateOfBirth: e.target.value }))}
                          />
                        </div>
                        <div>
                          <label className="label">Gender</label>
                          <select
                            className="select"
                            value={newPatient.gender}
                            onChange={(e) => setNewPatient((n) => ({ ...n, gender: e.target.value }))}
                          >
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                            <option value="OTHER">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="label">Blood Group</label>
                          <select
                            className="select"
                            value={newPatient.bloodGroup}
                            onChange={(e) => setNewPatient((n) => ({ ...n, bloodGroup: e.target.value }))}
                          >
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
                      </div>

                      <div style={{ marginBottom: 16 }}>
                        <label className="label">Allergies / Special Conditions</label>
                        <input
                          className="input"
                          placeholder="e.g. Penicillin, Asthma"
                          value={newPatient.allergies}
                          onChange={(e) => setNewPatient((n) => ({ ...n, allergies: e.target.value }))}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>
                        <div>
                          <label className="label">Emergency Contact Name</label>
                          <input
                            className="input"
                            value={newPatient.emergencyContact}
                            onChange={(e) => setNewPatient((n) => ({ ...n, emergencyContact: e.target.value }))}
                          />
                        </div>
                        <div>
                          <label className="label">Emergency contact Phone</label>
                          <input
                            className="input"
                            value={newPatient.emergencyPhone}
                            onChange={(e) => setNewPatient((n) => ({ ...n, emergencyPhone: e.target.value }))}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: 12 }}>
                        <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: 12 }}>
                          Save & Register Patient
                        </button>
                        <button type="button" onClick={() => setShowAddPatient(false)} className="btn btn-outline" style={{ flex: 0.4 }}>
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                ) : selectedPatient ? (
                  /* ── PATIENT WORKSTATION DESK (Vitals, Write Notes, History) ── */
                  <div>
                    {/* Patient Overview Header */}
                    <div
                      style={{
                        background: '#fff',
                        border: '1px solid var(--border)',
                        borderRadius: 10,
                        padding: '24px 32px',
                        marginBottom: 28,
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
                            <h2 className="serif" style={{ fontSize: 24, color: 'var(--navy)' }}>
                              {selectedPatient.firstName} {selectedPatient.lastName}
                            </h2>
                            <code style={{ fontSize: 11, background: 'var(--light)', padding: '3px 8px', borderRadius: 4 }}>
                              {selectedPatient.patientNumber}
                            </code>
                          </div>
                          <div style={{ color: 'var(--muted)', fontSize: 13, display: 'flex', gap: 20 }}>
                            <span>📞 {selectedPatient.phone}</span>
                            {selectedPatient.email && <span>✉️ {selectedPatient.email}</span>}
                            <span>📅 Born: {selectedPatient.dateOfBirth ? new Date(selectedPatient.dateOfBirth).toLocaleDateString() : 'N/A'}</span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: 12 }} className="hide-mobile">
                          <div style={{ textAlign: 'center', padding: '6px 14px', background: 'var(--cream)', borderRadius: 6 }}>
                            <div style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: .5 }}>BLOOD GROUP</div>
                            <div style={{ fontWeight: 800, color: 'var(--navy)', fontSize: 15 }}>{selectedPatient.bloodGroup}</div>
                          </div>
                          <div style={{ textAlign: 'center', padding: '6px 14px', background: 'var(--cream)', borderRadius: 6 }}>
                            <div style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: .5 }}>GENDER</div>
                            <div style={{ fontWeight: 800, color: 'var(--navy)', fontSize: 15 }}>{selectedPatient.gender}</div>
                          </div>
                        </div>
                      </div>

                      {selectedPatient.allergies && (
                        <div style={{ marginTop: 16, background: '#FFF1F2', borderLeft: '3px solid #F43F5E', padding: '8px 16px', borderRadius: 4, color: '#9F1239', fontSize: 12, fontWeight: 600 }}>
                          ⚠️ Critical Allergy Alert: {selectedPatient.allergies}
                        </div>
                      )}
                    </div>

                    {/* Console Tab Selector */}
                    <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid var(--border)', marginBottom: 28 }}>
                      {[
                        { key: 'patients', label: 'Write Clinical Notes', icon: '📝' },
                        { key: 'records', label: 'Notes & Case History', icon: '📋' },
                        { key: 'vitals', label: 'Vital Signs Monitor', icon: '🩺' },
                      ].map((t) => (
                        <button
                          key={t.key}
                          onClick={() => setActiveTab(t.key as Tab)}
                          style={{
                            padding: '12px 24px',
                            background: activeTab === t.key ? '#fff' : 'transparent',
                            color: activeTab === t.key ? 'var(--sky)' : 'var(--muted)',
                            border: '1px solid transparent',
                            borderBottom: activeTab === t.key ? '2px solid var(--sky)' : '1px solid transparent',
                            fontWeight: 700,
                            fontSize: 13,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                          }}
                        >
                          <span>{t.icon}</span> {t.label}
                        </button>
                      ))}
                    </div>

                    {/* console components */}
                    
                    {/* ── WRITE CLINICAL NOTES TAB ── */}
                    {activeTab === 'patients' && (
                      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 10, padding: 32 }}>
                        <h3 className="serif" style={{ color: 'var(--navy)', fontSize: 18, marginBottom: 6 }}>Write Consultation Notes</h3>
                        <p style={{ color: 'var(--muted)', fontSize: 12, marginBottom: 20 }}>Document diagnosis, machines or manual massage treatments, and specify clinical outcomes.</p>

                        <form onSubmit={handleSaveNote}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 16, marginBottom: 16 }}>
                            <div>
                              <label className="label">Primary Condition / Concern *</label>
                              <input
                                required
                                className="input"
                                placeholder="e.g. Knee Rheumatism, Spinal Disc Herniation"
                                value={newNote.condition}
                                onChange={(e) => setNewNote((n) => ({ ...n, condition: e.target.value }))}
                              />
                            </div>
                            <div>
                              <label className="label">Patient Recovery Status</label>
                              <select
                                className="select"
                                value={newNote.status}
                                onChange={(e) => setNewNote((n) => ({ ...n, status: e.target.value }))}
                              >
                                <option value="ACTIVE">Active (In treatment)</option>
                                <option value="FOLLOW_UP">Follow-Up (Scheduled)</option>
                                <option value="DISCHARGED">Discharged (Healed)</option>
                                <option value="REFERRED">Referred (Outsource)</option>
                              </select>
                            </div>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                            <div>
                              <label className="label">Diagnosis & Findings</label>
                              <textarea
                                className="input"
                                rows={2}
                                placeholder="Detail structural findings, bone fracture locations..."
                                value={newNote.diagnosis}
                                onChange={(e) => setNewNote((n) => ({ ...n, diagnosis: e.target.value }))}
                              />
                            </div>
                            <div>
                              <label className="label">Treatment Plan / Prescription</label>
                              <textarea
                                className="input"
                                rows={2}
                                placeholder="Manual deep-tissue massage, machine stimulation therapy..."
                                value={newNote.treatment}
                                onChange={(e) => setNewNote((n) => ({ ...n, treatment: e.target.value }))}
                              />
                            </div>
                          </div>

                          <div style={{ marginBottom: 24 }}>
                            <label className="label">Clinical Consultation Notes</label>
                            <textarea
                              className="input"
                              rows={5}
                              placeholder="Write comprehensive notes here regarding musculoskeletal states, flexion degrees, or progress notes..."
                              value={newNote.clinicalNotes}
                              onChange={(e) => setNewNote((n) => ({ ...n, clinicalNotes: e.target.value }))}
                            />
                          </div>

                          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: 12 }}>
                            ✓ Securely Save & Write Note
                          </button>
                        </form>
                      </div>
                    )}

                    {/* ── NOTES & CASE HISTORY TAB ── */}
                    {activeTab === 'records' && (
                      <div>
                        <h3 className="serif" style={{ color: 'var(--navy)', fontSize: 18, marginBottom: 16 }}>Clinical History & Consultation Logs</h3>
                        
                        {notesHistory.length === 0 ? (
                          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 10, padding: 40, textAlign: 'center', color: 'var(--muted)' }}>
                            No past clinical logs exist for this patient.
                          </div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {notesHistory.map((n) => (
                              <div key={n.id} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 10, padding: 24 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
                                  <div>
                                    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--navy)' }}>{n.condition}</div>
                                    <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                                      Attending: {n.staff ? `${n.staff.firstName} ${n.staff.lastName} (${n.staff.role})` : 'System Seeding'} · {new Date(n.createdAt).toLocaleString()}
                                    </div>
                                  </div>
                                  <span
                                    className={`badge ${
                                      n.status === 'DISCHARGED'
                                        ? 'badge-gray'
                                        : n.status === 'FOLLOW_UP'
                                        ? 'badge-gold'
                                        : 'badge-green'
                                    }`}
                                  >
                                    {n.status}
                                  </span>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 14, background: 'var(--light)', padding: 14, borderRadius: 6 }}>
                                  <div>
                                    <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 700, letterSpacing: .5 }}>DIAGNOSIS</div>
                                    <div style={{ fontSize: 12, color: 'var(--navy)', marginTop: 3 }}>{n.diagnosis || 'None entered'}</div>
                                  </div>
                                  <div>
                                    <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 700, letterSpacing: .5 }}>TREATMENT PLAN</div>
                                    <div style={{ fontSize: 12, color: 'var(--navy)', marginTop: 3 }}>{n.treatment || 'None entered'}</div>
                                  </div>
                                </div>

                                {n.clinicalNotes && (
                                  <div>
                                    <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 700, letterSpacing: .5, marginBottom: 4 }}>CLINICAL NOTES</div>
                                    <p style={{ fontSize: 13, color: 'var(--navy)', lineHeight: 1.6 }}>{n.clinicalNotes}</p>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* ── VITALS MONITOR TAB ── */}
                    {activeTab === 'vitals' && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 24 }} className="vitals-split-grid">
                        
                        {/* Recorded Vitals List */}
                        <div>
                          <h3 className="serif" style={{ color: 'var(--navy)', fontSize: 18, marginBottom: 16 }}>Vitals Signs Log</h3>
                          {vitalsHistory.length === 0 ? (
                            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 10, padding: 40, textAlign: 'center', color: 'var(--muted)' }}>
                              No vital signs registered yet. Use the right form to register.
                            </div>
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                              {vitalsHistory.map((v) => (
                                <div key={v.id} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 10, padding: 20 }}>
                                  <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700, marginBottom: 12 }}>
                                    📅 LOGGED: {new Date(v.recordedAt).toLocaleString()}
                                  </div>
                                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 10 }}>
                                    {[
                                      { l: 'B.P. (mmHg)', v: v.bloodPressure || 'N/A' },
                                      { l: 'Pulse (bpm)', v: v.pulse || 'N/A' },
                                      { l: 'Temp (°C)', v: v.temperature ? `${v.temperature}°C` : 'N/A' },
                                      { l: 'O₂ Sat (%)', v: v.oxygenSat ? `${v.oxygenSat}%` : 'N/A' },
                                      { l: 'Weight (kg)', v: v.weight ? `${v.weight} kg` : 'N/A' },
                                      { l: 'Height (cm)', v: v.height ? `${v.height} cm` : 'N/A' },
                                    ].map((stat, idx) => (
                                      <div key={idx} style={{ background: 'var(--light)', padding: 10, borderRadius: 6, textAlign: 'center' }}>
                                        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--navy)' }}>{stat.v}</div>
                                        <div style={{ fontSize: 9, color: 'var(--muted)', marginTop: 2 }}>{stat.l}</div>
                                      </div>
                                    ))}
                                  </div>
                                  {v.notes && (
                                    <div style={{ fontSize: 12, color: 'var(--muted)', background: 'var(--light)', padding: 10, borderRadius: 6, borderLeft: '3px solid var(--sky)' }}>
                                      <strong>Notes:</strong> {v.notes}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Add Vitals Form */}
                        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 10, padding: 24, alignSelf: 'flex-start' }}>
                          <h4 className="serif" style={{ color: 'var(--navy)', fontSize: 16, marginBottom: 14 }}>Add Vital Signs</h4>
                          
                          <form onSubmit={handleSaveVital}>
                            <div style={{ marginBottom: 12 }}>
                              <label className="label">Blood Pressure</label>
                              <input className="input" placeholder="e.g. 120/80" value={newVital.bloodPressure} onChange={(e) => setNewVital(n => ({ ...n, bloodPressure: e.target.value }))} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                              <div>
                                <label className="label">Pulse (bpm)</label>
                                <input type="number" className="input" placeholder="72" value={newVital.pulse} onChange={(e) => setNewVital(n => ({ ...n, pulse: e.target.value }))} />
                              </div>
                              <div>
                                <label className="label">Temp (°C)</label>
                                <input type="number" step="0.1" className="input" placeholder="36.5" value={newVital.temperature} onChange={(e) => setNewVital(n => ({ ...n, temperature: e.target.value }))} />
                              </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                              <div>
                                <label className="label">Weight (kg)</label>
                                <input type="number" step="0.1" className="input" placeholder="75" value={newVital.weight} onChange={(e) => setNewVital(n => ({ ...n, weight: e.target.value }))} />
                              </div>
                              <div>
                                <label className="label">Height (cm)</label>
                                <input type="number" className="input" placeholder="175" value={newVital.height} onChange={(e) => setNewVital(n => ({ ...n, height: e.target.value }))} />
                              </div>
                            </div>
                            <div style={{ marginBottom: 12 }}>
                              <label className="label">Oxygen Saturation (%)</label>
                              <input type="number" className="input" placeholder="98" value={newVital.oxygenSat} onChange={(e) => setNewVital(n => ({ ...n, oxygenSat: e.target.value }))} />
                            </div>
                            <div style={{ marginBottom: 20 }}>
                              <label className="label">Short Notes</label>
                              <textarea className="input" rows={2} placeholder="Observations..." value={newVital.notes} onChange={(e) => setNewVital(n => ({ ...n, notes: e.target.value }))} />
                            </div>

                            <button type="submit" className="btn btn-teal" style={{ width: '100%', padding: 10 }}>
                              ✓ Record Vitals
                            </button>
                          </form>
                        </div>

                      </div>
                    )}

                  </div>
                ) : (
                  /* Initial State before Selecting Patient */
                  <div
                    style={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--muted)',
                      padding: 60,
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: 64, marginBottom: 16 }}>📂</div>
                    <h3 className="serif" style={{ color: 'var(--navy)', fontSize: 22, marginBottom: 8 }}>
                      Clinical Workstation Open
                    </h3>
                    <p style={{ maxWidth: 360, fontSize: 13, lineHeight: 1.7 }}>
                      Please select a patient from the master sidebar list to write logs, review histories, or document vital signs.
                    </p>
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

      </div>

      <Footer />

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @media(max-width: 900px) {
          .auth-split-grid {
            grid-template-columns: 1fr !important;
          }
          .workspace-split-grid {
            grid-template-columns: 1fr !important;
          }
          .workspace-desk {
            max-height: none !important;
            overflow-y: visible !important;
            padding: 20px !important;
          }
          .vitals-split-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
