'use client';

import { useState } from 'react';

import Navbar         from '@/components/Navbar';
import Hero           from '@/components/Hero';
import Services       from '@/components/Services';
import About          from '@/components/About';
import WhyUs          from '@/components/WhyUs';
import Contact        from '@/components/Contact';
import Footer         from '@/components/Footer';
import BookingModal   from '@/components/BookingModal';
import WhatsAppButton from '@/components/WhatsAppButton';

export default function HomePage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Navbar        onBook={() => setModalOpen(true)} />
      <Hero          onBook={() => setModalOpen(true)} />
      <Services />
      <About />
      <WhyUs />
      <Contact />
      <Footer />
      <WhatsAppButton />
      <BookingModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
