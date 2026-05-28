'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsApp from '@/components/layout/WhatsApp';

const SERVICES = [
  { icon:'🦴', title:'Fracture Treatment',    href:'/services#fracture',    desc:'Expert management of all types of bone fractures with modern techniques.' },
  { icon:'🦵', title:'Joint Replacement',     href:'/services#joint',       desc:'Hip, knee, and shoulder replacement for improved mobility and pain relief.' },
  { icon:'🧠', title:'Spine Surgery',         href:'/services#spine',       desc:'Advanced treatment for herniated discs, scoliosis, and spinal stenosis.' },
  { icon:'⚡', title:'Sports Injury',         href:'/services#sports',      desc:'Fast diagnosis and rehabilitation for athletic and sports-related injuries.' },
  { icon:'🤲', title:'Physiotherapy',         href:'/services#physio',      desc:'Personalised recovery programs to restore strength, balance and mobility.' },
  { icon:'👶', title:'Paediatric Ortho',      href:'/services#paediatric',  desc:'Gentle expert care for children\'s bone and joint conditions.' },
];

const STATS = [
  { val:'95%',  label:'Recovery Rate',     icon:'🏆' },
  { val:'500+', label:'Patients Treated',  icon:'👥' },
  { val:'18+',  label:'Years Experience',  icon:'📅' },
  { val:'98%',  label:'Satisfaction',      icon:'❤️' },
];

const TESTIMONIALS = [
  { name:'Mrs. Adunola Fashola', condition:'Knee Joint Arthritis',    stars:5, text:'After my treatment at Jesus The Healer, I can now walk without any support. The doctors were patient, prayerful, and very professional.',  outcome:'Full mobility in 8 weeks' },
  { name:'Mr. Chukwuemeka Obi', condition:'Spinal Disc Herniation',  stars:5, text:'I came in unable to stand straight. Six weeks later I was back at work. I recommend this place to anyone with back problems in Lagos.',      outcome:'Back to work in 6 weeks' },
  { name:'Tunde Adesanya',      condition:'Ankle Ligament Tear',     stars:5, text:'The treatment was world-class. I was back on the pitch in record time. These people are the real deal!',                                     outcome:'Athletic recovery in 10 weeks' },
];

const WHY = [
  { icon:'🎓', title:'Certified Specialists',  desc:'Our team holds recognised orthopaedic certifications with decades of combined clinical experience.' },
  { icon:'🏥', title:'Modern Equipment',        desc:'We use up-to-date diagnostic and treatment technology for accurate results and effective care.' },
  { icon:'🚨', title:'Emergency Ready',         desc:'Urgent cases are attended to promptly — we prioritise emergencies and trauma patients.' },
  { icon:'📈', title:'High Success Rate',        desc:'95% of our patients achieve full or significant recovery, as measured by our clinical outcomes.' },
];

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let s = 0; const step = target / 60;
    const t = setInterval(() => { s += step; if (s >= target) { setV(target); clearInterval(t); } else setV(Math.floor(s)); }, 20);
    return () => clearInterval(t);
  }, [target]);
  return <>{v}{suffix}</>;
}

export default function HomePage() {
  const [tIdx, setTIdx] = useState(0);
  useEffect(() => { const t = setInterval(() => setTIdx(i => (i+1)%TESTIMONIALS.length), 5500); return () => clearInterval(t); }, []);

  return (
    <>
      <Navbar />

      {/* ── HERO ── */}
      <section id="home" style={{ position:'relative', minHeight:'92vh', display:'flex', alignItems:'center', overflow:'hidden', background:'var(--navy)' }}>
        <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1400&q=80" alt="Hospital" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', opacity:.2 }} />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(105deg,rgba(10,22,40,.97) 45%, rgba(10,22,40,.65) 100%)' }} />
        <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(circle,rgba(255,255,255,.03) 1px,transparent 0)', backgroundSize:'32px 32px' }} />

        <div style={{ position:'relative', zIndex:2, maxWidth:1200, margin:'0 auto', padding:'120px 40px 80px', width:'100%' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:80, alignItems:'center' }}>
            <div>
              <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(13,148,136,.15)', border:'1px solid rgba(13,148,136,.3)', padding:'7px 16px', borderRadius:40, marginBottom:28 }}>
                <span style={{ width:7, height:7, background:'var(--teal-light)', borderRadius:'50%', display:'block' }} />
                <span style={{ color:'var(--teal-light)', fontSize:12, fontWeight:600, letterSpacing:1 }}>Open Now · Closes 5 PM</span>
              </div>
              <h1 className="serif" style={{ fontSize:'clamp(38px,5vw,62px)', color:'#fff', lineHeight:1.1, marginBottom:16 }}>
                Expert Orthopaedic<br /><span style={{ color:'var(--sky-light)', fontStyle:'italic' }}>Care You Can Trust</span>
              </h1>
              <p style={{ color:'rgba(255,255,255,.6)', fontSize:17, lineHeight:1.8, maxWidth:480, marginBottom:40 }}>
                Specialist bone, joint and musculoskeletal care at 5 Adebowale Street, Ojodu, Lagos — delivered with clinical excellence and genuine compassion.
              </p>
              <div style={{ display:'flex', gap:14, flexWrap:'wrap', marginBottom:48 }}>
                <Link href="/appointments" className="btn btn-primary btn-lg">Book Appointment</Link>
                <Link href="/emergency" className="btn btn-red btn-lg">🚨 Emergency Help</Link>
              </div>
              <div style={{ display:'flex', gap:32, flexWrap:'wrap' }}>
                {STATS.map((s,i) => (
                  <div key={i}>
                    <div className="serif" style={{ fontSize:32, color:'var(--sky-light)', lineHeight:1 }}>{s.val}</div>
                    <div style={{ color:'rgba(255,255,255,.45)', fontSize:11, letterSpacing:1, textTransform:'uppercase', marginTop:5 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — floating info cards */}
            <div className="hide-mobile" style={{ position:'relative', height:420 }}>
              <div style={{ position:'absolute', top:0, right:0, background:'rgba(255,255,255,.05)', backdropFilter:'blur(12px)', border:'1px solid rgba(255,255,255,.1)', borderRadius:12, padding:'24px', width:280 }}>
                <div style={{ color:'var(--teal-light)', fontSize:11, letterSpacing:3, textTransform:'uppercase', fontWeight:700, marginBottom:16 }}>Today's Schedule</div>
                {[{ t:'09:00 AM', p:'Dr. Olusola — Knee Review' },{ t:'11:30 AM', p:'Dr. Anyanwu — Spine Follow-Up' },{ t:'02:00 PM', p:'Physio Oke — Rehab Session' }].map((s,i) => (
                  <div key={i} style={{ display:'flex', gap:12, marginBottom:12, paddingBottom:12, borderBottom:i<2?'1px solid rgba(255,255,255,.06)':'none' }}>
                    <div style={{ background:'rgba(37,99,235,.2)', color:'var(--sky-light)', padding:'4px 10px', borderRadius:6, fontSize:11, fontWeight:700, flexShrink:0 }}>{s.t}</div>
                    <div style={{ color:'rgba(255,255,255,.7)', fontSize:13 }}>{s.p}</div>
                  </div>
                ))}
              </div>
              <div style={{ position:'absolute', bottom:0, left:0, background:'rgba(220,38,38,.1)', border:'1px solid rgba(220,38,38,.3)', borderRadius:12, padding:'20px 24px', animation:'float 4s ease-in-out infinite' }}>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ width:44, height:44, background:'var(--red)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>🚨</div>
                  <div>
                    <div style={{ color:'#fff', fontWeight:700, fontSize:14 }}>Emergency Line</div>
                    <a href="tel:08023758036" style={{ color:'rgba(255,255,255,.6)', fontSize:13, textDecoration:'none' }}>0802 375 8036</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── QUICK SERVICES ── */}
      <section id="quick-services" style={{ padding:'80px 40px', background:'var(--cream)' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:52 }}>
            <div className="section-label" style={{ justifyContent:'center' }}>What We Treat</div>
            <h2 className="section-title" style={{ textAlign:'center' }}>Our Specialist Services</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:20 }}>
            {SERVICES.map((s,i) => (
              <Link key={i} href={s.href} style={{ textDecoration:'none' }}>
                <div className="card" style={{ padding:'28px 24px', cursor:'pointer' }}>
                  <div style={{ fontSize:38, marginBottom:14 }}>{s.icon}</div>
                  <h3 style={{ fontFamily:'DM Serif Display,serif', color:'var(--navy)', fontSize:19, marginBottom:8 }}>{s.title}</h3>
                  <p style={{ color:'var(--muted)', fontSize:13, lineHeight:1.7, marginBottom:16 }}>{s.desc}</p>
                  <span style={{ color:'var(--sky)', fontSize:13, fontWeight:600 }}>Learn more →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FIND A DOCTOR ── */}
      <section style={{ padding:'80px 40px', background:'#fff' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:80, alignItems:'center' }}>
          <div>
            <div className="section-label">Our Experts</div>
            <h2 className="section-title">Find the Right<br /><span style={{ color:'var(--sky)', fontStyle:'italic' }}>Specialist</span></h2>
            <p style={{ color:'var(--muted)', fontSize:15, lineHeight:1.8, marginBottom:32 }}>Search by specialty, condition, or doctor name to find the right expert for your needs.</p>
            <div style={{ display:'flex', gap:10, marginBottom:20, flexWrap:'wrap' }}>
              {['Orthopaedic Surgeon','Physiotherapist','Pharmacist','Spine Specialist'].map(tag => (
                <Link key={tag} href={`/doctors?specialty=${tag}`} style={{ padding:'8px 16px', background:'var(--light)', border:'1px solid var(--border)', borderRadius:20, fontSize:12, fontWeight:600, color:'var(--navy)', textDecoration:'none', transition:'all .2s' }}
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background='var(--sky)';(e.currentTarget as HTMLElement).style.color='#fff';}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background='var(--light)';(e.currentTarget as HTMLElement).style.color='var(--navy)';}}
                >{tag}</Link>
              ))}
            </div>
            <Link href="/doctors" className="btn btn-primary">View All Doctors</Link>
          </div>
          <div style={{ background:'var(--light)', borderRadius:12, padding:'32px', border:'1px solid var(--border)' }}>
            <div style={{ fontWeight:700, color:'var(--navy)', fontSize:15, marginBottom:20 }}>🔍 Search Doctors</div>
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <input className="input" placeholder="Search by name or condition..." />
              <select className="select">
                <option value="">All Specialties</option>
                <option>Orthopaedic Surgeon</option>
                <option>Physiotherapist</option>
                <option>Spine Specialist</option>
                <option>Paediatric Orthopaedics</option>
              </select>
              <Link href="/doctors" className="btn btn-primary" style={{ textAlign:'center' }}>Search Doctors</Link>
            </div>
          </div>
        </div>
        <style>{`@media(max-width:768px){section > div[style*="1fr 1fr"]{grid-template-columns:1fr!important;gap:40px!important}}`}</style>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section style={{ padding:'80px 40px', background:'var(--navy)', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', right:'-3%', top:'50%', transform:'translateY(-50%)', color:'rgba(255,255,255,.025)', fontSize:400, lineHeight:1, userSelect:'none' }}>✚</div>
        <div style={{ maxWidth:1200, margin:'0 auto', position:'relative' }}>
          <div style={{ textAlign:'center', marginBottom:52 }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, color:'var(--teal-light)', fontSize:11, fontWeight:700, letterSpacing:3, textTransform:'uppercase', marginBottom:12 }}>
              <span style={{ display:'block', width:20, height:2, background:'var(--teal-light)' }} /> Why Choose Us
            </div>
            <h2 className="serif" style={{ fontSize:'clamp(32px,4vw,48px)', color:'#fff' }}>Why Patients Trust Us</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:20 }}>
            {WHY.map((w,i) => (
              <div key={i} style={{ padding:'28px 24px', background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.07)', borderRadius:10, transition:'all .3s' }}
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background='rgba(37,99,235,.12)';(e.currentTarget as HTMLElement).style.borderColor='rgba(37,99,235,.3)';}}
                onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background='rgba(255,255,255,.04)';(e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,.07)';}}>
                <div style={{ fontSize:36, marginBottom:14 }}>{w.icon}</div>
                <h3 className="serif" style={{ color:'#fff', fontSize:19, marginBottom:10 }}>{w.title}</h3>
                <p style={{ color:'rgba(255,255,255,.5)', fontSize:13, lineHeight:1.7 }}>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding:'80px 40px', background:'var(--cream)' }}>
        <div style={{ maxWidth:900, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:52 }}>
            <div className="section-label" style={{ justifyContent:'center' }}>Patient Stories</div>
            <h2 className="section-title" style={{ textAlign:'center' }}>Lives Changed, Healing Received</h2>
          </div>
          <div style={{ background:'var(--navy)', borderRadius:12, padding:'48px', position:'relative', overflow:'hidden', marginBottom:24 }}>
            <div style={{ position:'absolute', top:-10, left:20, fontSize:150, color:'rgba(255,255,255,.04)', fontFamily:'Georgia,serif', lineHeight:1 }}>"</div>
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(13,148,136,.2)', border:'1px solid rgba(13,148,136,.3)', padding:'5px 14px', borderRadius:40, marginBottom:20 }}>
              <span style={{ color:'var(--teal-light)', fontSize:11, fontWeight:700, letterSpacing:2, textTransform:'uppercase' }}>{TESTIMONIALS[tIdx].condition}</span>
            </div>
            <p style={{ fontFamily:'DM Serif Display,serif', fontStyle:'italic', fontSize:'clamp(17px,2.5vw,22px)', color:'rgba(255,255,255,.88)', lineHeight:1.7, marginBottom:28, position:'relative', zIndex:1 }}>"{TESTIMONIALS[tIdx].text}"</p>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:44, height:44, borderRadius:'50%', background:'var(--sky)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontFamily:'DM Serif Display,serif', fontSize:18 }}>{TESTIMONIALS[tIdx].name[0]}</div>
                <div>
                  <div style={{ fontWeight:700, color:'#fff', fontSize:14 }}>{TESTIMONIALS[tIdx].name}</div>
                  <div style={{ color:'rgba(255,255,255,.45)', fontSize:12 }}>{TESTIMONIALS[tIdx].outcome}</div>
                </div>
              </div>
              <span style={{ color:'var(--gold)', fontSize:18 }}>{'★'.repeat(TESTIMONIALS[tIdx].stars)}</span>
            </div>
          </div>
          <div style={{ display:'flex', justifyContent:'center', gap:10 }}>
            {TESTIMONIALS.map((_,i) => (
              <button key={i} onClick={() => setTIdx(i)} style={{ width:i===tIdx?28:10, height:10, borderRadius:5, border:'none', cursor:'pointer', background:i===tIdx?'var(--sky)':'var(--border)', transition:'all .3s' }} />
            ))}
          </div>
        </div>
      </section>

      {/* ── EMERGENCY BANNER ── */}
      <div className="emergency-strip" style={{ textAlign:'center', flexDirection:'column', gap:16, padding:'32px 40px' }}>
        <div style={{ fontFamily:'DM Serif Display,serif', fontSize:'clamp(22px,3vw,32px)' }}>🚨 Medical Emergency? Don't Wait.</div>
        <p style={{ opacity:.8, fontSize:15 }}>Call us immediately — our team is ready to respond.</p>
        <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
          <a href="tel:08023758036" className="btn" style={{ background:'#fff', color:'var(--red)', fontWeight:700, fontSize:14, padding:'12px 28px', borderRadius:6 }}>📞 Call 0802 375 8036</a>
          <Link href="/emergency" className="btn btn-outline-white">Emergency Page</Link>
        </div>
      </div>

      <Footer />
      <WhatsApp />
    </>
  );
}
