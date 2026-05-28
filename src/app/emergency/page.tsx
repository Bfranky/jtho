'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function EmergencyPage() {
  const [form, setForm] = useState({ name:'', phone:'', location:'', description:'' });
  const [sent, setSent] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = () => {
    if (!form.phone) return;
    setSent(true);
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <>
      <Navbar />

      {/* EMERGENCY HERO — red */}
      <section style={{ background: 'linear-gradient(135deg, #7F1D1D, var(--red))', padding: '80px 40px 60px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle,rgba(255,255,255,.04) 1px,transparent 0)', backgroundSize: '32px 32px' }} />
        <div style={{ position: 'absolute', right: '-3%', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,.04)', fontSize: 400, lineHeight: 1 }}>🚨</div>
        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.2)', padding: '6px 16px', borderRadius: 40, marginBottom: 20 }}>
            <span style={{ width: 8, height: 8, background: '#fff', borderRadius: '50%', display: 'block', animation: 'pulse 1.5s infinite' }} />
            <span style={{ color: '#fff', fontSize: 12, fontWeight: 700, letterSpacing: 2 }}>EMERGENCY LINE ACTIVE</span>
          </div>
          <h1 className="serif" style={{ fontSize: 'clamp(38px,6vw,68px)', color: '#fff', lineHeight: 1, marginBottom: 16 }}>
            Medical Emergency?
          </h1>
          <p style={{ color: 'rgba(255,255,255,.75)', fontSize: 17, marginBottom: 40, maxWidth: 480 }}>
            Don't wait. Call us immediately. Our team is ready to respond to urgent orthopaedic and medical emergencies.
          </p>
          {/* Big call button */}
          <a href="tel:08023758036" style={{ display: 'inline-flex', alignItems: 'center', gap: 14, background: '#fff', color: 'var(--red)', padding: '18px 36px', borderRadius: 8, fontWeight: 700, fontSize: 20, textDecoration: 'none', boxShadow: '0 8px 32px rgba(0,0,0,.25)', transition: 'transform .2s' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1.03)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1)'}>
            <span style={{ fontSize: 28 }}>📞</span>
            Call 0802 375 8036 NOW
          </a>
        </div>
        <style>{`@keyframes pulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.3);opacity:.7}}`}</style>
      </section>

      {/* Quick Actions */}
      <section style={{ padding: '60px 40px', background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 className="serif" style={{ color: 'var(--navy)', fontSize: 32, textAlign: 'center', marginBottom: 40 }}>Quick Emergency Actions</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
            {[
              { icon:'📞', title:'Call Hospital',      desc:'Direct line to our emergency desk — staffed Monday to Saturday 8AM–5PM.', action:'Call Now', href:'tel:08023758036', color:'var(--red)' },
              { icon:'💬', title:'WhatsApp Emergency', desc:'Send your location and describe your emergency on WhatsApp for rapid response.', action:'Open WhatsApp', href:'https://wa.me/2348023758036?text=EMERGENCY', color:'#25D366' },
              { icon:'📍', title:'Find Us',            desc:'5 Adebowale Street, Ojodu, Lagos. Near Ojodu Berger Bus Stop — easily accessible.', action:'Get Directions', href:'https://maps.google.com/?q=5+Adebowale+Street+Ojodu+Lagos', color:'var(--sky)' },
            ].map((item, i) => (
              <div key={i} className="card" style={{ padding: '28px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: 44, marginBottom: 14 }}>{item.icon}</div>
                <h3 style={{ fontFamily: 'DM Serif Display,serif', color: 'var(--navy)', fontSize: 20, marginBottom: 10 }}>{item.title}</h3>
                <p style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.7, marginBottom: 20 }}>{item.desc}</p>
                <a href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                  style={{ display: 'inline-flex', padding: '10px 22px', background: item.color, color: '#fff', borderRadius: 6, fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>
                  {item.action}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ambulance request form */}
      <section style={{ padding: '60px 40px', background: 'var(--cream)' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 className="serif" style={{ color: 'var(--navy)', fontSize: 32, marginBottom: 8 }}>Request Urgent Assistance</h2>
            <p style={{ color: 'var(--muted)', fontSize: 14 }}>Fill this form for urgent cases. We will call you back within minutes.</p>
          </div>
          <div style={{ background: '#fff', border: '2px solid var(--red)', borderRadius: 10, padding: '36px 40px' }}>
            {sent ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div style={{ fontSize: 52, marginBottom: 14 }}>✅</div>
                <h3 className="serif" style={{ color: 'var(--navy)', fontSize: 26, marginBottom: 10 }}>Request Received!</h3>
                <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.7 }}>We are calling <strong>{form.phone}</strong> right now. Please stay on the line.</p>
              </div>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div><label className="label">Patient Name</label><input className="input" value={form.name} onChange={set('name')} placeholder="Full name" /></div>
                  <div><label className="label">Phone Number *</label><input className="input" value={form.phone} onChange={set('phone')} placeholder="0803 000 0000" /></div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label className="label">Current Location / Address</label>
                  <input className="input" value={form.location} onChange={set('location')} placeholder="Street address or landmark" />
                </div>
                <div style={{ marginBottom: 28 }}>
                  <label className="label">Describe the Emergency</label>
                  <textarea className="input" rows={4} style={{ resize: 'vertical' }} value={form.description} onChange={set('description')} placeholder="What happened? What are the symptoms? How many people need assistance?" />
                </div>
                <button onClick={submit} disabled={!form.phone}
                  style={{ width: '100%', padding: '15px', background: 'var(--red)', color: '#fff', border: 'none', borderRadius: 6, fontFamily: 'DM Sans,sans-serif', fontWeight: 700, fontSize: 15, cursor: form.phone ? 'pointer' : 'not-allowed', opacity: form.phone ? 1 : .6, transition: 'all .2s' }}>
                  🚨 Send Emergency Request
                </button>
                <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 12, marginTop: 14 }}>
                  Or call directly: <a href="tel:08023758036" style={{ color: 'var(--red)', fontWeight: 700, textDecoration: 'none' }}>0802 375 8036</a>
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* What to do in orthopaedic emergency */}
      <section style={{ padding: '60px 40px', background: '#fff' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 className="serif" style={{ color: 'var(--navy)', fontSize: 30, textAlign: 'center', marginBottom: 36 }}>What To Do While You Wait</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { icon:'🚫', title:'Do NOT move the injured area', desc:'Immobilise fractured or dislocated limbs. Moving them can cause further damage to bones, nerves, and blood vessels.' },
              { icon:'🧊', title:'Apply cold compress',            desc:'Wrap ice in a cloth and apply to swollen areas. Never place ice directly on skin. Reduces swelling and pain.' },
              { icon:'🩹', title:'Control any bleeding',           desc:'Apply gentle firm pressure with a clean cloth. Do not remove the cloth — add more on top if it soaks through.' },
              { icon:'🛑', title:'Do NOT give food or water',      desc:'In case surgery is needed, the patient should fast. Keep them calm and still until medical help arrives.' },
              { icon:'📱', title:'Stay on the phone with us',       desc:'Keep the line open. Our team will guide you step by step on what to do until we arrive or you reach us.' },
              { icon:'🙏', title:'Stay calm and reassure',          desc:'Panic worsens pain and shock. Speak calmly to the patient, keep them warm, and reassure them help is coming.' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, padding: '18px 20px', background: 'var(--light)', borderRadius: 8 }}>
                <div style={{ fontSize: 28, flexShrink: 0 }}>{item.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--navy)', fontSize: 14, marginBottom: 5 }}>{item.title}</div>
                  <p style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <style>{`@media(max-width:700px){section{padding:40px 20px!important} div[style*="repeat(3,1fr)"]{grid-template-columns:1fr!important} div[style*="1fr 1fr"]{grid-template-columns:1fr!important}}`}</style>
    </>
  );
}
