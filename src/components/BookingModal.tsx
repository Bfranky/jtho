'use client';

import { useState } from 'react';

interface BookingModalProps { open: boolean; onClose: () => void; }
interface BookingData { service: string; date: string; name: string; phone: string; note: string; }

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 14px',
  border: '1px solid var(--border)', background: 'var(--white)',
  color: 'var(--navy)', fontSize: 14, fontFamily: 'DM Sans, sans-serif',
  outline: 'none', borderRadius: 4, transition: 'border-color 0.2s',
};
const labelStyle: React.CSSProperties = {
  color: 'var(--navy)', fontSize: 11, fontWeight: 700,
  letterSpacing: 0.5, textTransform: 'uppercase',
  display: 'block', marginBottom: 8,
};

export default function BookingModal({ open, onClose }: BookingModalProps) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<BookingData>({ service: '', date: '', name: '', phone: '', note: '' });
  const [done, setDone] = useState(false);

  if (!open) return null;

  const reset = () => { setDone(false); setStep(1); setData({ service: '', date: '', name: '', phone: '', note: '' }); onClose(); };
  const confirm = () => {
    if (!data.name || !data.phone) return;
    setDone(true);
    setTimeout(reset, 4000);
  };
  const set = (k: keyof BookingData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setData((d) => ({ ...d, [k]: e.target.value }));

  return (
    <div onClick={(e) => e.target === e.currentTarget && reset()}
      style={{ position: 'fixed', inset: 0, background: 'rgba(10,22,40,0.7)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, backdropFilter: 'blur(6px)', animation: 'lbIn 0.3s ease' }}>
      <div onClick={(e) => e.stopPropagation()}
        style={{ background: 'var(--white)', width: '100%', maxWidth: 520, borderRadius: 12, overflow: 'hidden', boxShadow: '0 32px 80px rgba(10,22,40,0.25)', animation: 'lbUp 0.35s ease' }}>

        {/* Header */}
        <div style={{ background: 'var(--navy)', padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 className="serif" style={{ color: 'var(--white)', fontSize: 22 }}>Book Appointment</h3>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12, marginTop: 4 }}>Jesus The Healer Orthopaedic Home · Ojodu, Lagos</p>
          </div>
          <button onClick={reset} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: 22, cursor: 'pointer' }}>✕</button>
        </div>

        {/* Progress */}
        <div style={{ display: 'flex', gap: 4, padding: '16px 32px 0' }}>
          {[1,2].map((s) => (
            <div key={s} style={{ flex: 1, height: 3, borderRadius: 2, background: step >= s ? 'var(--sky)' : 'var(--border)', transition: 'background 0.3s' }} />
          ))}
        </div>

        <div style={{ padding: '24px 32px 32px' }}>
          {done ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{ fontSize: 56, marginBottom: 12, color: 'var(--sky)' }}>✚</div>
              <h3 className="serif" style={{ color: 'var(--navy)', fontSize: 28, marginBottom: 10 }}>Appointment Booked!</h3>
              <p style={{ color: 'var(--gray)', fontSize: 15, lineHeight: 1.7 }}>
                Thank you, <strong>{data.name}</strong>. We will call <strong>{data.phone}</strong> to confirm. God bless you!
              </p>
            </div>
          ) : step === 1 ? (
            <>
              <p style={{ color: 'var(--gray)', fontSize: 12, marginBottom: 20, letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600 }}>Step 1 of 2 — Appointment Details</p>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Service Needed</label>
                <select style={inputStyle} value={data.service} onChange={set('service')}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--sky)')} onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}>
                  <option value="">Select a service</option>
                  <option>Orthopaedic Treatment</option>
                  <option>Joint Care & Therapy</option>
                  <option>Fracture Management</option>
                  <option>Physiotherapy</option>
                  <option>Spine & Back Care</option>
                  <option>Paediatric Orthopaedics</option>
                  <option>General Medical Care</option>
                  <option>Rehabilitation Services</option>
                </select>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Preferred Date</label>
                <input type="date" style={inputStyle} value={data.date} onChange={set('date')}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--sky)')} onBlur={(e) => (e.target.style.borderColor = 'var(--border)')} />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}>Brief Note (optional)</label>
                <textarea style={{ ...inputStyle, resize: 'none' }} rows={3} placeholder="Describe your symptoms or condition..." value={data.note} onChange={set('note')} />
              </div>
              <button className="btn-primary" onClick={() => setStep(2)} style={{ width: '100%', padding: 14 }}>Continue →</button>
            </>
          ) : (
            <>
              <p style={{ color: 'var(--gray)', fontSize: 12, marginBottom: 20, letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600 }}>Step 2 of 2 — Your Details</p>
              <div style={{ background: 'var(--light)', border: '1px solid var(--border)', padding: '12px 16px', borderRadius: 6, marginBottom: 20 }}>
                <p style={{ color: 'var(--gray)', fontSize: 13 }}>
                  Service: <strong style={{ color: 'var(--navy)' }}>{data.service || 'General Consultation'}</strong>
                  {data.date && <> &nbsp;·&nbsp; Date: <strong style={{ color: 'var(--navy)' }}>{data.date}</strong></>}
                </p>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Full Name *</label>
                <input style={inputStyle} placeholder="Your full name" value={data.name} onChange={set('name')}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--sky)')} onBlur={(e) => (e.target.style.borderColor = 'var(--border)')} />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}>Phone Number *</label>
                <input style={inputStyle} placeholder="0803 000 0000" value={data.phone} onChange={set('phone')}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--sky)')} onBlur={(e) => (e.target.style.borderColor = 'var(--border)')} />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button className="btn-outline" onClick={() => setStep(1)} style={{ flexShrink: 0, padding: '13px 18px' }}>← Back</button>
                <button className="btn-primary" onClick={confirm} style={{ flex: 1, padding: 13 }}>Confirm Appointment ✚</button>
              </div>
            </>
          )}
        </div>
      </div>
      <style>{`
        @keyframes lbIn  { from{opacity:0} to{opacity:1} }
        @keyframes lbUp  { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  );
}
