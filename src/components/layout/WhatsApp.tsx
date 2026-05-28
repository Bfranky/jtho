'use client';
export default function WhatsApp() {
  return (
    <>
      <a href="https://wa.me/2348023758036" target="_blank" rel="noopener noreferrer"
        style={{ position:'fixed', bottom:28, right:28, zIndex:1500, width:54, height:54, borderRadius:'50%', background:'#25D366', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, textDecoration:'none', boxShadow:'0 4px 20px rgba(37,211,102,.5)', animation:'waFloat 3s ease-in-out infinite' }}
        title="WhatsApp">💬</a>
      <style>{`@keyframes waFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}`}</style>
    </>
  );
}
