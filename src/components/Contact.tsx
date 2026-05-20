'use client';

import { useState } from 'react';

interface FormState { name: string; phone: string; email: string; service: string; message: string; }

export default function Contact() {
  const [form, setForm]     = useState<FormState>({ name: '', phone: '', email: '', service: '', message: '' });
  const [sent, setSent]     = useState(false);
  const [errors, setErrors] = useState<Partial<FormState>>({});

  const validate = () => {
    const e: Partial<FormState> = {};
    if (!form.name.trim())  e.name  = 'Required';
    if (!form.phone.trim()) e.phone = 'Required';
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSent(true);
    setTimeout(() => { setSent(false); setForm({ name: '', phone: '', email: '', service: '', message: '' }); }, 4500);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '13px 16px',
    border: '1px solid var(--border)',
    background: 'var(--white)',
    color: 'var(--navy)', fontSize: 14,
    fontFamily: 'DM Sans, sans-serif',
    outline: 'none', borderRadius: 4, transition: 'border-color 0.2s',
  };
  const labelStyle: React.CSSProperties = {
    color: 'var(--navy)', fontSize: 12, fontWeight: 600,
    letterSpacing: 0.5, display: 'block', marginBottom: 8,
  };

  return (
    <section id="contact" style={{ padding: '100px 40px', background: 'var(--cream)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, var(--border) 1px, transparent 0)', backgroundSize: '32px 32px', opacity: 0.6, pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div className="section-label" style={{ justifyContent: 'center' }}>Reach Us</div>
          <h2 className="serif" style={{ fontSize: 'clamp(36px,5vw,56px)', color: 'var(--navy)', marginBottom: 16 }}>
            Book Your Appointment
          </h2>
          <p style={{ color: 'var(--gray)', fontSize: 16, maxWidth: 500, margin: '0 auto' }}>
            Ready to start your healing journey? Reach out today — we'll get back to you promptly.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 60, alignItems: 'start' }}>

          {/* Info panel */}
          <div>
            <h3 className="serif" style={{ color: 'var(--navy)', fontSize: 24, marginBottom: 32 }}>Contact Information</h3>
            {[
              { icon: '📍', label: 'Address',  val: '5 Adebowale Street, Ojodu 101233, Lagos' },
              { icon: '📞', label: 'Phone',    val: '0802 375 8036' },
              { icon: '🕐', label: 'Hours',    val: 'Monday – Saturday · Closes 5:00 PM' },
              { icon: '🏥', label: 'Facility', val: 'Orthopaedic & General Medical Center' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 24, paddingBottom: 24, borderBottom: i < 3 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ fontSize: 20, minWidth: 32, paddingTop: 2 }}>{item.icon}</div>
                <div>
                  <div style={{ color: 'var(--teal)', fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 700, marginBottom: 5 }}>{item.label}</div>
                  <div style={{ color: 'var(--navy)', fontSize: 15, lineHeight: 1.5 }}>{item.val}</div>
                </div>
              </div>
            ))}

            {/* Map */}
            <div style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)', marginTop: 8 }}>
              <iframe
                title="Jesus The Healer Orthopaedic Home Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963!2d3.35!3d6.65!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sJesus+The+Healer+Orthopaedic+Home+Ojodu+Lagos!5e0!3m2!1sen!2sng!4v1"
                width="100%" height="200"
                style={{ border: 0, display: 'block' }}
                allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <a href="https://maps.google.com/?q=5+Adebowale+Street+Ojodu+Lagos" target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-block', marginTop: 10, color: 'var(--sky)', fontSize: 13, textDecoration: 'none', fontWeight: 600 }}>
              → Open in Google Maps
            </a>
          </div>

          {/* Form */}
          <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderTop: '3px solid var(--sky)', borderRadius: 8, padding: '40px' }}>
            {sent ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>✚</div>
                <h3 className="serif" style={{ color: 'var(--navy)', fontSize: 28, marginBottom: 12 }}>Appointment Request Received!</h3>
                <p style={{ color: 'var(--gray)', fontSize: 15, lineHeight: 1.7 }}>
                  Thank you, <strong>{form.name || 'patient'}</strong>. We will contact you on <strong>{form.phone}</strong> shortly to confirm your appointment. God bless you!
                </p>
              </div>
            ) : (
              <>
                <h3 className="serif" style={{ color: 'var(--navy)', fontSize: 24, marginBottom: 4 }}>Send a Message</h3>
                <p style={{ color: 'var(--gray)', fontSize: 14, marginBottom: 28 }}>Fill in your details and we'll be in touch soon.</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={labelStyle}>Full Name *</label>
                    <input style={inputStyle} placeholder="Your full name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      onFocus={(e) => (e.target.style.borderColor = 'var(--sky)')} onBlur={(e) => (e.target.style.borderColor = 'var(--border)')} />
                    {errors.name && <p style={{ color: '#e55', fontSize: 12, marginTop: 4 }}>{errors.name}</p>}
                  </div>
                  <div>
                    <label style={labelStyle}>Phone *</label>
                    <input style={inputStyle} placeholder="0803 000 0000" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                      onFocus={(e) => (e.target.style.borderColor = 'var(--sky)')} onBlur={(e) => (e.target.style.borderColor = 'var(--border)')} />
                    {errors.phone && <p style={{ color: '#e55', fontSize: 12, marginTop: 4 }}>{errors.phone}</p>}
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Email Address</label>
                  <input type="email" style={inputStyle} placeholder="your@email.com" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--sky)')} onBlur={(e) => (e.target.style.borderColor = 'var(--border)')} />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Service Needed</label>
                  <select style={inputStyle} value={form.service} onChange={(e) => setForm((f) => ({ ...f, service: e.target.value }))}
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
                    <option>Other</option>
                  </select>
                </div>

                <div style={{ marginBottom: 28 }}>
                  <label style={labelStyle}>Message / Symptoms</label>
                  <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={4} placeholder="Briefly describe your condition or reason for visit..."
                    value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--sky)')} onBlur={(e) => (e.target.style.borderColor = 'var(--border)')} />
                </div>

                <button className="btn-primary" onClick={handleSubmit} style={{ width: '100%', padding: '15px', fontSize: 14 }}>
                  Send Appointment Request ✚
                </button>

                <p style={{ textAlign: 'center', color: 'var(--gray)', fontSize: 13, marginTop: 14 }}>
                  Or call us directly:&nbsp;
                  <a href="tel:08023758036" style={{ color: 'var(--sky)', textDecoration: 'none', fontWeight: 600 }}>0802 375 8036</a>
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media(max-width:768px) { #contact > div > div:last-child { grid-template-columns:1fr!important; } }
        @media(max-width:600px) { #contact { padding:80px 20px!important; } div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns:1fr!important; } }
      `}</style>
    </section>
  );
}
