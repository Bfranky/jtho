import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'Jesus The Healer Orthopaedic Home', template: '%s | Jesus The Healer' },
  description: 'Specialist orthopaedic and medical care in Ojodu, Lagos. Expert treatment for bones, joints, fractures, spine conditions and rehabilitation.',
  keywords: 'orthopaedic Lagos, bone doctor Ojodu, joint replacement Lagos, physiotherapy Ojodu, Jesus The Healer, fracture treatment Lagos',
  openGraph: {
    title: 'Jesus The Healer Orthopaedic Home',
    description: 'Expert orthopaedic and medical care in Ojodu, Lagos.',
    type: 'website', locale: 'en_NG',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
