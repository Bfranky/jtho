import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title:       'Jesus The Healer Orthopaedic Home | Medical Center · Ojodu, Lagos',
  description: 'Jesus The Healer Orthopaedic Home — specialist orthopaedic and medical care in Ojodu, Lagos. Compassionate healing for bones, joints, and mobility.',
  keywords:    'orthopaedic Lagos, bone specialist Ojodu, Jesus The Healer, medical center Ojodu, orthopaedic home Lagos',
  openGraph: {
    title:       'Jesus The Healer Orthopaedic Home',
    description: 'Compassionate orthopaedic and medical care in Ojodu, Lagos.',
    type:        'website',
    locale:      'en_NG',
    siteName:    'Jesus The Healer Orthopaedic Home',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=DM+Serif+Display:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
