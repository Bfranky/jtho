'use client';
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsApp from '@/components/layout/WhatsApp';

export default function ContactPage() {
  const [form, setForm] = useState({ name:'', phone:'', email:'', service:'', message:'' });
  const [sent, setSent] = useState(false);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    if (!form.name || !form.phone) return;
    // In production: await fetch('/api/contact', { method:'POST', body:JSON.stringify(form) })
    setSent(true);
    setTimeout(() => { setSent(false); setForm({ name:'', phone:'', email:'', service:'', message:'' }); }, 4000);
  };

  return (
    <>
      <Navbar />

      <div className="page-hero">
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div className="section-label" style={{ color:'var(--teal-light)' }}><span style={{ background:'var(--teal-light)' }} />Reach Us</div>
          <h1 className="serif" style={{ fontSize:'clamp(36px,5vw,56px)', color:'#fff', marginBottom:12 }}>Contact Us</h1>
          <p style={{ color:'rgba(255,255,255,.6)', fontSize:15, maxWidth:480 }}>
            Have questions? Need to book? We're here for you Monday to Saturday, 8AM to 5PM.
          </p>
        </div>
      </div>

      <section style={{ padding:'80px 40px', background:'var(--cream)' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1.4fr', gap:60 }}>

          {/* Info */}
          <div>
            <h2 className="serif" style={{ color:'var(--navy)', fontSize:28, marginBottom:28 }}>Get In Touch</h2>
            {[
              { icon:'📍', label:'Address',        val:'5 Adebowale Street, Ojodu 101233, Lagos' },
              { icon:'📞', label:'Phone',          val:'0802 375 8036' },
              { icon:'📧', label:'Email',          val:'info@jesusthehealer.com' },
              { icon:'🕐', label:'Working Hours',  val:'Monday – Saturday · 8:00 AM – 5:00 PM' },
              { icon:'🚨', label:'Emergency',      val:'Call 0802 375 8036 (urgent cases prioritised)' },
            ].map((item, i) => (
              <div key={i} style={{ display:'flex', gap:16, marginBottom:22, paddingBottom:22, borderBottom:i<4?'1px solid var(--border)':'none' }}>
                <div style={{ fontSize:20, minWidth:30, paddingTop:2 }}>{item.icon}</div>
                <div>
                  <div style={{ color:'var(--teal)', fontSize:10, fontWeight:700, letterSpacing:3, textTransform:'uppercase', marginBottom:4 }}>{item.label}</div>
                  <div style={{ color:'var(--navy)', fontSize:14, fontWeight:500, lineHeight:1.5 }}>{item.val}</div>
                </div>
              </div>
            ))}

            {/* Map */}
            <div style={{ borderRadius:8, overflow:'hidden', border:'1px solid var(--border)', marginTop:8 }}>
              <iframe title="Location" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963!2d3.35!3d6.65!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sJesus+The+Healer!5e0!3m2!1sen!2sng!4v1"
                width="100%" height="200" style={{ border:0, display:'block' }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
            <a href="https://maps.google.com/?q=5+Adebowale+Street+Ojodu+Lagos" target="_blank" rel="noopener noreferrer"
              style={{ display:'inline-block', marginTop:10, color:'var(--sky)', fontSize:13, textDecoration:'none', fontWeight:600 }}>
              → Open in Google Maps
            </a>
          </div>

          {/* Form */}
          <div style={{ background:'#fff', border:'1px solid var(--border)', borderTop:'3px solid var(--sky)', borderRadius:10, padding:'40px' }}>
            {sent ? (
              <div style={{ textAlign:'center', padding:'40px 0' }}>
                <div style={{ fontSize:52, marginBottom:14 }}>✚</div>
                <h3 className="serif" style={{ color:'var(--navy)', fontSize:28, marginBottom:10 }}>Message Received!</h3>
                <p style={{ color:'var(--muted)', fontSize:14, lineHeight:1.7 }}>Thank you, {form.name}. We will respond to <strong>{form.phone}</strong> shortly. God bless you!</p>
              </div>
            ) : (
              <>
                <h3 className="serif" style={{ color:'var(--navy)', fontSize:24, marginBottom:6 }}>Send a Message</h3>
                <p style={{ color:'var(--muted)', fontSize:13, marginBottom:28 }}>We'll get back to you within a few hours.</p>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
                  <div><label className="label">Full Name *</label><input className="input" value={form.name} onChange={set('name')} placeholder="Your name" /></div>
                  <div><label className="label">Phone *</label><input className="input" value={form.phone} onChange={set('phone')} placeholder="0803 000 0000" /></div>
                </div>
                <div style={{ marginBottom:16 }}>
                  <label className="label">Email</label>
                  <input type="email" className="input" value={form.email} onChange={set('email')} placeholder="your@email.com" />
                </div>
                <div style={{ marginBottom:16 }}>
                  <label className="label">Subject / Service Needed</label>
                  <select className="select" value={form.service} onChange={set('service')}>
                    <option value="">Select a topic</option>
                    <option>General Enquiry</option>
                    <option>Book Appointment</option>
                    <option>Orthopaedic Treatment</option>
                    <option>Physiotherapy</option>
                    <option>Spine & Back Care</option>
                    <option>Emergency Enquiry</option>
                    <option>Other</option>
                  </select>
                </div>
                <div style={{ marginBottom:28 }}>
                  <label className="label">Message</label>
                  <textarea className="input" rows={4} style={{ resize:'vertical' }} value={form.message} onChange={set('message')} placeholder="How can we help you?" />
                </div>
                <button className="btn btn-primary" onClick={submit} disabled={!form.name||!form.phone} style={{ width:'100%', padding:14, opacity:form.name&&form.phone?1:.6 }}>
                  Send Message ✚
                </button>
                <p style={{ textAlign:'center', color:'var(--muted)', fontSize:12, marginTop:14 }}>
                  Or call: <a href="tel:08023758036" style={{ color:'var(--sky)', fontWeight:700, textDecoration:'none' }}>0802 375 8036</a>
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      <Footer />
      <WhatsApp />
      <style>{`@media(max-width:768px){section>div[style*="1.4fr"]{grid-template-columns:1fr!important;gap:40px!important}} @media(max-width:600px){section{padding:60px 20px!important} div[style*="1fr 1fr"]{grid-template-columns:1fr!important}}`}</style>
    </>
  );
}
