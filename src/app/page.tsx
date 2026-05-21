'use client';

import { useState } from 'react';

import Navbar          from '@/components/Navbar';
import Hero            from '@/components/Hero';
import Services        from '@/components/Services';
import RecoveryStats   from '@/components/RecoveryStats';
import About           from '@/components/About';
import DoctorProfiles  from '@/components/DoctorProfiles';
import WhyUs           from '@/components/WhyUs';
import Testimonials    from '@/components/Testimonials';
import PatientRecords  from '@/components/PatientRecords';
import Contact         from '@/components/Contact';
import Footer          from '@/components/Footer';
import BookingModal    from '@/components/BookingModal';
import WhatsAppButton  from '@/components/WhatsAppButton';

export default function HomePage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Navbar         onBook={() => setModalOpen(true)} />
      <Hero           onBook={() => setModalOpen(true)} />
      <Services />
      <RecoveryStats />
      <About />
      <DoctorProfiles />
      <WhyUs />
      <Testimonials />
      <PatientRecords />
      <Contact />
      <Footer />
      <WhatsAppButton />
      <BookingModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
