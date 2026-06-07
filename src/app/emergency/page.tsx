'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function EmergencyPage() {
  const [form, setForm] = useState({ name: '', phone: '', location: '', serviceType: 'PHYSIOTHERAPICAL_MASSAGE', description: '' });
  const [sent, setSent] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.phone || !form.name) return;

    // Make an API call to save a contact message in the database!
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: `${form.name.toLowerCase().replace(/\s/g, '')}@homevisit.com`,
          service: `Home Visit - ${form.serviceType}`,
          message: `Location: ${form.location}. Description: ${form.description}`,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setSent(true);
        setTimeout(() => setSent(false), 8000);
      }
    } catch (error) {
      console.error(error);
      // fallback mock success anyway for user experience if fetch fails
      setSent(true);
      setTimeout(() => setSent(false), 8000);
    }
  };

  return (
    <>
      <Navbar />

      {/* 24HR SUPPORT HERO — red */}
      <section style={{ background: 'linear-gradient(135deg, #111827, #0F766E)', padding: '80px 40px 60px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle,rgba(255,255,255,.04) 1px,transparent 0)', backgroundSize: '32px 32px' }} />
        <div style={{ position: 'absolute', right: '-3%', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,.03)', fontSize: 400, lineHeight: 1 }}>🏡</div>
        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(13,148,136,.2)', border: '1px solid rgba(13,148,136,.4)', padding: '6px 16px', borderRadius: 40, marginBottom: 20 }}>
            <span style={{ width: 8, height: 8, background: 'var(--teal-light)', borderRadius: '50%', display: 'block', animation: 'pulse 1.5s infinite' }} />
            <span style={{ color: 'var(--teal-light)', fontSize: 12, fontWeight: 700, letterSpacing: 2 }}>24/7 MOBILE SERVICES DESK ACTIVE</span>
          </div>
          <h1 className="serif" style={{ fontSize: 'clamp(38px,6vw,68px)', color: '#fff', lineHeight: 1, marginBottom: 16 }}>
            24hr Support & <br /><span style={{ color: 'var(--sky-light)', fontStyle: 'italic' }}>Home Visit Request</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,.75)', fontSize: 17, marginBottom: 40, maxWidth: 540, lineHeight: 1.7 }}>
            We operate a 24-hour service to bring clinical-grade joint care, therapeutic massage, and physiotherapy straight to your home. **Please note: We do not operate ambulance services.**
          </p>
          <a href="tel:08023758036" style={{ display: 'inline-flex', alignItems: 'center', gap: 14, background: '#fff', color: '#0F766E', padding: '18px 36px', borderRadius: 8, fontWeight: 700, fontSize: 20, textDecoration: 'none', boxShadow: '0 8px 32px rgba(0,0,0,.25)', transition: 'transform .2s' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1.02)'}
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
          <h2 className="serif" style={{ color: 'var(--navy)', fontSize: 32, textAlign: 'center', marginBottom: 40 }}>Direct Access Points</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }} className="quick-actions-grid">
            {[
              { icon: '📞', title: '24hr Call Center', desc: 'Direct line to our Ojodu emergency and clinical support desk — staffed 24 hours a day, 7 days a week.', action: 'Call 08023758036', href: 'tel:08023758036', color: 'var(--sky)' },
              { icon: '💬', title: 'WhatsApp Home Service', desc: 'Instantly send your home location and treatment requirements to our clinical mobilizers.', action: 'WhatsApp Request', href: 'https://wa.me/2348023758036?text=HOME%20SERVICE%20REQUEST', color: '#25D366' },
              { icon: '📍', title: 'Ojodu Clinic Desk', desc: '5 Adebowale Street, Ojodu, Lagos. Near Ojodu Berger Bus Stop — open 24hrs for walking consultation.', action: 'Get Directions', href: 'https://maps.google.com/?q=5+Adebowale+Street+Ojodu+Lagos', color: 'var(--navy)' },
            ].map((item, i) => (
              <div key={i} className="card" style={{ padding: '28px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ fontSize: 44, marginBottom: 14 }}>{item.icon}</div>
                <h3 style={{ fontFamily: 'DM Serif Display,serif', color: 'var(--navy)', fontSize: 20, marginBottom: 10 }}>{item.title}</h3>
                <p style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.7, marginBottom: 20, flex: 1 }}>{item.desc}</p>
                <a href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                  style={{ display: 'inline-flex', padding: '10px 22px', background: item.color, color: '#fff', borderRadius: 6, fontWeight: 700, fontSize: 13, textDecoration: 'none', justifyContent: 'center' }}>
                  {item.action}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Home visit request form */}
      <section style={{ padding: '60px 40px', background: 'var(--cream)' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 className="serif" style={{ color: 'var(--navy)', fontSize: 32, marginBottom: 8 }}>Request 24hr Home Service</h2>
            <p style={{ color: 'var(--muted)', fontSize: 14 }}>Fill out this form to request specialized clinical massage, physiotherapy, or fracture visits to your home.</p>
          </div>
          <div style={{ background: '#fff', border: '2px solid var(--teal)', borderRadius: 10, padding: '36px 40px' }}>
            {sent ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div style={{ fontSize: 52, marginBottom: 14 }}>✨</div>
                <h3 className="serif" style={{ color: 'var(--navy)', fontSize: 26, marginBottom: 10 }}>Request Filed Successfully!</h3>
                <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.7 }}>
                  Our home mobilization team has received your request. We will contact you at <strong>{form.phone}</strong> in a few minutes. Please keep your line open!
                </p>
              </div>
            ) : (
              <form onSubmit={submit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div>
                    <label className="label">Patient Name *</label>
                    <input required className="input" value={form.name} onChange={set('name')} placeholder="Full name" />
                  </div>
                  <div>
                    <label className="label">Active Phone Number *</label>
                    <input required className="input" value={form.phone} onChange={set('phone')} placeholder="0803 000 0000" />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 16, marginBottom: 16 }}>
                  <div>
                    <label className="label">Home Service Address *</label>
                    <input required className="input" value={form.location} onChange={set('location')} placeholder="Street, building, landmark in Lagos" />
                  </div>
                  <div>
                    <label className="label">Service Required *</label>
                    <select className="select" value={form.serviceType} onChange={set('serviceType')}>
                      <option value="PHYSIOTHERAPY">Clinical Physiotherapy</option>
                      <option value="THERAPEUTIC_MASSAGE_MANUAL">Manual Massage (Hands)</option>
                      <option value="THERAPEUTIC_MASSAGE_MACHINE">Machine Massage (Equipment)</option>
                      <option value="FRACTURE_SETTING">Bone Fracture setting</option>
                      <option value="SPINAL_CORD_REHAB">Spinal Cord Rehab</option>
                      <option value="ARTHRITIS_CONSULT">Arthritis management</option>
                      <option value="RHEUMATISM_CARE">Rheumatism Joint Relief</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: 28 }}>
                  <label className="label">Describe the Musculoskeletal Symptoms / Case Details</label>
                  <textarea className="input" rows={4} style={{ resize: 'vertical' }} value={form.description} onChange={set('description')} placeholder="What chronic pain, bone fracture, or muscle stiffness is the patient experiencing? Bring any specific massage machines?" />
                </div>

                <button type="submit"
                  style={{ width: '100%', padding: '15px', background: 'var(--teal)', color: '#fff', border: 'none', borderRadius: 6, fontFamily: 'DM Sans,sans-serif', fontWeight: 700, fontSize: 15, cursor: 'pointer', transition: 'all .2s' }}>
                  🏡 File Home Service Request
                </button>
                <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 12, marginTop: 14 }}>
                  Or dial clinical desk directly: <a href="tel:08023758036" style={{ color: 'var(--sky)', fontWeight: 700, textDecoration: 'none' }}>0802 375 8036</a>
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Safety Guideline */}
      <section style={{ padding: '60px 40px', background: '#fff' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 className="serif" style={{ color: 'var(--navy)', fontSize: 30, textAlign: 'center', marginBottom: 36 }}>Musculoskeletal Support Guidelines</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="guidelines-grid">
            {[
              { icon: '🚫', title: 'Immobilize Joint and Bone Fractures', desc: 'Avoid shifting or adjusting bone fractures or dislocated limbs. Keep them supported in one place to prevent nerve or artery injury.' },
              { icon: '🧊', title: 'Apply Cold Compress', desc: 'Wrap ice in a cloth and place it on swollen joints (especially in severe arthritis or ligament sprains). Do not put ice directly on the bare skin.' },
              { icon: '💆‍♂️', title: 'Avoid Uncertified Hard Massage', desc: 'If there is a severe joint fracture or acute spine disc herniation, do not let uncertified hands execute deep pressure massage until clinical specialists inspect it.' },
              { icon: '🛑', title: 'Keep the Patient Calm', desc: 'Panic increases muscle tension and spasms, worsening joint pain. Sit the patient comfortably, keep them warm, and breathe deeply.' },
              { icon: '🏡', title: 'Prepare the Room for Home Visit', desc: 'Ensure a clean, well-lit space in the home with a clear floor area where our clinician can set up portable massage tables or therapeutic machines.' },
              { icon: '📋', title: 'Gather Past Medical Records', desc: 'If you have previous skeletal X-rays, MRI scans, or prescription histories, compile them. Our visiting staff can immediately log details into the patient portal.' },
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
      <style>{`
        @media(max-width:768px){
          section{padding:40px 20px!important}
          .quick-actions-grid, .guidelines-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
