'use client';

export default function WhatsAppButton() {
  return (
    <>
      <a href="https://wa.me/2348023758036" target="_blank" rel="noopener noreferrer"
        title="Chat with us on WhatsApp" aria-label="WhatsApp"
        style={{
          position: 'fixed', bottom: 28, right: 28, zIndex: 1500,
          width: 56, height: 56, borderRadius: '50%',
          background: '#25D366',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          textDecoration: 'none', fontSize: 26,
          boxShadow: '0 4px 20px rgba(37,211,102,0.5)',
          animation: 'waFloat 3s ease-in-out infinite',
        }}>💬</a>
      <style>{`
        @keyframes waFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
      `}</style>
    </>
  );
}
