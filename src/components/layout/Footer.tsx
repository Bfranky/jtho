import Link from 'next/link';

const SERVICES = [
  'Orthopaedics & Joint Care',
  'Massaging (Hand & Machine)',
  'Physiotherapy',
  'Bone Fractures & Spinal Cord',
  'Arthritis Management',
  'Rheumatism Treatment'
];
const LINKS    = [
  { l:'Home',href:'/'},
  { l:'Services',href:'/services'},
  { l:'Blog',href:'/blog'},
  { l:'Appointments',href:'/appointments'},
  { l:'Contact',href:'/contact'}
];

export default function Footer() {
  return (
    <footer>

      <div className="section-responsive-padding" style={{ background:'var(--navy)', padding:'60px 40px 28px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div className="footer-grid">

            {/* Brand */}
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:18 }}>
                <div style={{ width:40, height:40, background:'var(--sky)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:18 }}>✚</div>
                <div>
                  <div style={{ fontFamily:'DM Serif Display,serif', color:'#fff', fontSize:17, lineHeight:1.1 }}>Jesus The Healer</div>
                  <div style={{ color:'var(--sky-light)', fontSize:9, letterSpacing:3, textTransform:'uppercase' }}>Orthopaedic Home</div>
                </div>
              </div>
              <p style={{ color:'rgba(255,255,255,.45)', fontSize:14, lineHeight:1.8, maxWidth:260 }}>
                Compassionate, faith-centred orthopaedic and general medical care at 5 Adebowale Street, Ojodu, Lagos.
              </p>
              <div style={{ display:'flex', gap:10, marginTop:20 }}>
                {[{l:'FB',h:'#'},{l:'WA',h:'https://wa.me/2348023758036'},{l:'IG',h:'#'}].map((s,i) => (
                  <a key={i} href={s.h} target="_blank" rel="noopener noreferrer" style={{ width:34, height:34, borderRadius:'50%', border:'1px solid rgba(255,255,255,.15)', display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,.5)', fontSize:11, fontWeight:700, textDecoration:'none', transition:'all .2s' }}
                    onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background='var(--sky)';(e.currentTarget as HTMLElement).style.color='#fff';}}
                    onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background='transparent';(e.currentTarget as HTMLElement).style.color='rgba(255,255,255,.5)';}}
                  >{s.l}</a>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div>
              <h4 style={{ color:'rgba(255,255,255,.9)', fontSize:13, fontWeight:700, marginBottom:18, letterSpacing:.5 }}>Navigate</h4>
              {LINKS.map(l => (
                <Link key={l.l} href={l.href} style={{ display:'block', color:'rgba(255,255,255,.45)', fontSize:13, textDecoration:'none', marginBottom:9, transition:'color .2s' }}
                  onMouseEnter={e=>(e.currentTarget as HTMLElement).style.color='#fff'}
                  onMouseLeave={e=>(e.currentTarget as HTMLElement).style.color='rgba(255,255,255,.45)'}
                >{l.l}</Link>
              ))}
            </div>

            {/* Services */}
            <div>
              <h4 style={{ color:'rgba(255,255,255,.9)', fontSize:13, fontWeight:700, marginBottom:18, letterSpacing:.5 }}>Services</h4>
              {SERVICES.map(s => <div key={s} style={{ color:'rgba(255,255,255,.4)', fontSize:13, marginBottom:9 }}>{s}</div>)}
            </div>

            {/* Contact */}
            <div>
              <h4 style={{ color:'rgba(255,255,255,.9)', fontSize:13, fontWeight:700, marginBottom:18, letterSpacing:.5 }}>Contact</h4>
              <div style={{ color:'rgba(255,255,255,.45)', fontSize:13, lineHeight:2 }}>
                <a href="tel:08023758036" style={{ color:'rgba(255,255,255,.7)', textDecoration:'none', display:'block' }}>📞 0802 375 8036</a>
                <span>📍 5 Adebowale St</span><br/>
                <span>Ojodu, Lagos 101233</span><br/>
                <span>📧 info@jesusthehealer.com</span><br/>
                <span style={{ color:'rgba(255,255,255,.3)', fontSize:12 }}>Mon–Sat · 8AM–5PM</span>
              </div>
            </div>
          </div>

          <div style={{ borderTop:'1px solid rgba(255,255,255,.07)', paddingTop:24, display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
            <p style={{ color:'rgba(255,255,255,.25)', fontSize:12 }}>© 2025 Jesus The Healer Orthopaedic Home. All rights reserved.</p>
            <p style={{ color:'rgba(255,255,255,.25)', fontSize:12 }}>Ojodu, Lagos, Nigeria 🇳🇬</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
