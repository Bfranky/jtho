import {
  PrismaClient,
  Gender, BloodGroup, StaffRole, UserRole,
  RecordStatus, AppointmentStatus, PrescriptionStatus,
} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database for Jesus The Healer Orthopaedic Home...\n');

  // ── 1. Admin user ─────────────────────────────────────────────
  const admin = await prisma.user.upsert({
    where:  { email: 'admin@jesusthehealer.com' },
    update: {},
    create: {
      email:    'admin@jesusthehealer.com',
      // bcrypt hash of "Admin@JTHO2025" — change immediately after first login
      password: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMUBqE2.9hn8gHDHHnFh0s5I.S',
      role:     UserRole.ADMIN,
    },
  });
  console.log('✅ Admin user:', admin.email);

  // ── 2. Staff users ────────────────────────────────────────────
  const u1 = await prisma.user.upsert({
    where:  { email: 'dr.olusola@jesusthehealer.com' },
    update: {},
    create: { email:'dr.olusola@jesusthehealer.com', password:'$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMUBqE2.9hn8gHDHHnFh0s5I.S', role:UserRole.STAFF },
  });
  const u2 = await prisma.user.upsert({
    where:  { email: 'dr.anyanwu@jesusthehealer.com' },
    update: {},
    create: { email:'dr.anyanwu@jesusthehealer.com', password:'$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMUBqE2.9hn8gHDHHnFh0s5I.S', role:UserRole.STAFF },
  });
  const u3 = await prisma.user.upsert({
    where:  { email: 'physio.oke@jesusthehealer.com' },
    update: {},
    create: { email:'physio.oke@jesusthehealer.com', password:'$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMUBqE2.9hn8gHDHHnFh0s5I.S', role:UserRole.STAFF },
  });
  const u4 = await prisma.user.upsert({
    where:  { email: 'pharm.adeyemi@jesusthehealer.com' },
    update: {},
    create: { email:'pharm.adeyemi@jesusthehealer.com', password:'$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMUBqE2.9hn8gHDHHnFh0s5I.S', role:UserRole.STAFF },
  });

  // ── 3. Staff profiles ─────────────────────────────────────────
  const doctor1 = await prisma.staff.upsert({
    where:  { userId: u1.id },
    update: {},
    create: {
      firstName:'Adebayo', lastName:'Olusola', phone:'08031112222',
      role:StaffRole.DOCTOR, specialty:'Joint Replacement & Fracture Management',
      qualifications:'MBBS, FRCS (Ortho)', experience:18,
      bio:'Dr. Olusola is our chief orthopaedic surgeon with 18 years of specialist experience in joint replacement, complex fracture management, and orthopaedic trauma.',
      availableDays:['Monday','Wednesday','Friday'], isActive:true,
      userId: u1.id,
    },
  });

  const doctor2 = await prisma.staff.upsert({
    where:  { userId: u2.id },
    update: {},
    create: {
      firstName:'Ngozi', lastName:'Anyanwu', phone:'08053334444',
      role:StaffRole.DOCTOR, specialty:'Spine & Paediatric Orthopaedics',
      qualifications:'MBBS, MWACS (Ortho)', experience:12,
      bio:'Dr. Anyanwu specialises in spinal conditions and paediatric orthopaedics, combining precise diagnosis with a compassionate, patient-first approach.',
      availableDays:['Tuesday','Thursday','Saturday'], isActive:true,
      userId: u2.id,
    },
  });

  const physio = await prisma.staff.upsert({
    where:  { userId: u3.id },
    update: {},
    create: {
      firstName:'Funmilayo', lastName:'Oke', phone:'09015556666',
      role:StaffRole.PHYSIOTHERAPIST, specialty:'Rehabilitation & Sports Injury Recovery',
      qualifications:'BPT, MPT (Ortho)', experience:11,
      bio:'Mrs. Oke leads our physiotherapy department with personalised recovery programs that restore strength, mobility, and quality of life.',
      availableDays:['Monday','Tuesday','Wednesday','Thursday','Friday'], isActive:true,
      userId: u3.id,
    },
  });

  await prisma.staff.upsert({
    where:  { userId: u4.id },
    update: {},
    create: {
      firstName:'Taiwo', lastName:'Adeyemi', phone:'08027778888',
      role:StaffRole.PHARMACIST, specialty:'Drug Therapy & Patient Counselling',
      qualifications:'B.Pharm, RPh', experience:9,
      bio:'Pharm. Adeyemi manages all clinical pharmacy services, ensuring safe and effective medication management for our patients.',
      availableDays:['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'], isActive:true,
      userId: u4.id,
    },
  });

  console.log('✅ Staff profiles seeded');

  // ── 4. Patients ───────────────────────────────────────────────
  const p1 = await prisma.patient.upsert({
    where:  { patientNumber:'JTH-001' },
    update: {},
    create: {
      patientNumber:'JTH-001', firstName:'Adunola', lastName:'Fashola',
      dateOfBirth:new Date('1974-03-12'), gender:Gender.FEMALE,
      phone:'08031112222', email:'adunola@email.com',
      address:'12 Abeokuta Street, Ojodu, Lagos',
      bloodGroup:BloodGroup.O_POS,
      emergencyContact:'Mr. Fashola', emergencyPhone:'08037778888',
    },
  });
  const p2 = await prisma.patient.upsert({
    where:  { patientNumber:'JTH-002' },
    update: {},
    create: {
      patientNumber:'JTH-002', firstName:'Chukwuemeka', lastName:'Obi',
      dateOfBirth:new Date('1986-07-25'), gender:Gender.MALE,
      phone:'08053334444', address:'5 Orile Road, Agege, Lagos',
      bloodGroup:BloodGroup.A_POS,
    },
  });
  const p3 = await prisma.patient.upsert({
    where:  { patientNumber:'JTH-003' },
    update: {},
    create: {
      patientNumber:'JTH-003', firstName:'Tunde', lastName:'Adesanya',
      dateOfBirth:new Date('1992-11-04'), gender:Gender.MALE,
      phone:'09015556666', address:'8 Omole Phase 1, Lagos',
      bloodGroup:BloodGroup.B_POS,
    },
  });
  const p4 = await prisma.patient.upsert({
    where:  { patientNumber:'JTH-004' },
    update: {},
    create: {
      patientNumber:'JTH-004', firstName:'Emmanuel', lastName:'Dada',
      dateOfBirth:new Date('1968-01-18'), gender:Gender.MALE,
      phone:'08027778888', address:'3 Church Street, Ojodu Berger, Lagos',
      bloodGroup:BloodGroup.AB_POS,
    },
  });

  console.log('✅ Patients seeded');

  // ── 5. Patient records ────────────────────────────────────────
  const rec1 = await prisma.patientRecord.create({
    data: {
      patientId:p1.id, staffId:doctor1.id,
      condition:'Knee Joint Arthritis',
      diagnosis:'Bilateral osteoarthritis of the knee, Grade III',
      treatment:'Physiotherapy, NSAIDs, knee replacement evaluation',
      clinicalNotes:'Patient responding well to physiotherapy. Pain reduced from 8/10 to 3/10. Review in 2 weeks.',
      status:RecordStatus.ACTIVE, admissionDate:new Date('2025-04-10'),
    },
  });
  const rec2 = await prisma.patientRecord.create({
    data: {
      patientId:p2.id, staffId:doctor2.id,
      condition:'Lumbar Disc Herniation',
      diagnosis:'L4-L5 disc herniation with radiculopathy',
      treatment:'Conservative management, physiotherapy, epidural steroid injection',
      clinicalNotes:'Post-treatment follow-up. MRI results pending. Significant improvement in walking distance.',
      status:RecordStatus.FOLLOW_UP, admissionDate:new Date('2025-03-28'),
    },
  });
  await prisma.patientRecord.create({
    data: {
      patientId:p3.id, staffId:physio.id,
      condition:'Ankle Ligament Tear',
      diagnosis:'Grade II anterior talofibular ligament tear',
      treatment:'RICE protocol, physiotherapy, ankle brace',
      clinicalNotes:'Week 3 of 8-week physiotherapy program. Dorsiflexion improving. No surgery needed.',
      status:RecordStatus.ACTIVE, admissionDate:new Date('2025-04-22'),
    },
  });
  await prisma.patientRecord.create({
    data: {
      patientId:p4.id, staffId:doctor1.id,
      condition:'Bilateral Knee Arthritis',
      diagnosis:'Bilateral knee osteoarthritis, conservative management completed',
      treatment:'Pain management, physiotherapy, home exercise program',
      clinicalNotes:'Full recovery achieved. Patient discharged with home exercise plan.',
      status:RecordStatus.DISCHARGED,
      admissionDate:new Date('2025-01-10'), dischargeDate:new Date('2025-03-15'),
    },
  });

  console.log('✅ Patient records seeded');

  // ── 6. Appointments ───────────────────────────────────────────
  await prisma.appointment.createMany({
    skipDuplicates: true,
    data: [
      { appointmentRef:'APT-20250528-001', patientId:p1.id, staffId:doctor1.id, service:'Orthopaedic Consultation', scheduledDate:new Date('2025-05-28'), scheduledTime:'09:00 AM', status:AppointmentStatus.CONFIRMED, notes:'Knee review — bring previous X-ray' },
      { appointmentRef:'APT-20250529-001', patientId:p2.id, staffId:doctor2.id, service:'Spine Follow-Up', scheduledDate:new Date('2025-05-29'), scheduledTime:'11:30 AM', status:AppointmentStatus.PENDING },
      { appointmentRef:'APT-20250527-001', patientId:p3.id, staffId:physio.id,  service:'Physiotherapy Session', scheduledDate:new Date('2025-05-27'), scheduledTime:'02:00 PM', status:AppointmentStatus.CONFIRMED, notes:'Session 5 of 8' },
      { appointmentRef:'APT-20250530-001', patientId:p1.id, staffId:physio.id,  service:'Physiotherapy Assessment', scheduledDate:new Date('2025-05-30'), scheduledTime:'10:00 AM', status:AppointmentStatus.PENDING },
    ],
  });

  console.log('✅ Appointments seeded');

  // ── 7. Prescriptions ──────────────────────────────────────────
  await prisma.prescription.createMany({
    skipDuplicates: true,
    data: [
      { patientId:p1.id, staffId:doctor1.id, recordId:rec1.id, medication:'Ibuprofen 400mg', dosage:'400mg', frequency:'3 times daily with food', duration:'2 weeks', instructions:'Take with food. Do not exceed 1200mg/day.', status:PrescriptionStatus.ACTIVE },
      { patientId:p1.id, staffId:doctor1.id, recordId:rec1.id, medication:'Calcium + Vitamin D3', dosage:'500mg/400IU', frequency:'Twice daily', duration:'3 months', instructions:'Take with meals for best absorption.', status:PrescriptionStatus.ACTIVE },
      { patientId:p2.id, staffId:doctor2.id, recordId:rec2.id, medication:'Diclofenac Sodium 50mg', dosage:'50mg', frequency:'Twice daily after meals', duration:'10 days', instructions:'Avoid alcohol. Take after meals.', status:PrescriptionStatus.ACTIVE },
      { patientId:p4.id, staffId:doctor1.id, medication:'Paracetamol 1000mg', dosage:'1000mg', frequency:'As needed — max 4× daily', duration:'PRN', status:PrescriptionStatus.COMPLETED },
    ],
  });

  console.log('✅ Prescriptions seeded');

  // ── 8. Vitals ─────────────────────────────────────────────────
  await prisma.vital.createMany({
    data: [
      { patientId:p1.id, bloodPressure:'128/82', pulse:74, temperature:36.8, weight:72.5, height:162.0, oxygenSat:98, notes:'BP slightly elevated — monitor', recordedAt:new Date('2025-04-10') },
      { patientId:p2.id, bloodPressure:'120/78', pulse:68, temperature:36.6, weight:81.0, height:175.0, oxygenSat:99, recordedAt:new Date('2025-03-28') },
      { patientId:p3.id, bloodPressure:'118/76', pulse:72, temperature:36.5, weight:75.0, height:170.0, oxygenSat:99, recordedAt:new Date('2025-04-22') },
      { patientId:p1.id, bloodPressure:'122/80', pulse:71, temperature:36.7, weight:72.0, height:162.0, oxygenSat:98, recordedAt:new Date('2025-05-10') },
    ],
  });

  console.log('✅ Vital signs seeded');

  // ── 9. Testimonials ───────────────────────────────────────────
  await prisma.testimonial.createMany({
    skipDuplicates: true,
    data: [
      { patientName:'Mrs. Adunola Fashola', condition:'Knee Joint Arthritis', review:'I had been living with severe knee pain for over three years. After my treatment at Jesus The Healer, I can now walk without any support. The doctors were patient, prayerful, and very professional.', rating:5, outcome:'Full mobility restored in 8 weeks', location:'Ojodu, Lagos', isPublished:true },
      { patientName:'Mr. Chukwuemeka Obi', condition:'Spinal Disc Herniation', review:'I came in unable to stand straight from back pain. Six weeks later I was back at work. I recommend this place to anyone suffering from back or spine problems in Lagos.', rating:5, outcome:'Returned to full activity in 6 weeks', location:'Agege, Lagos', isPublished:true },
      { patientName:'Tunde Adesanya', condition:'Ankle Ligament Tear', review:'The treatment I received here was world-class. I was back on the pitch in record time. These people are the real deal!', rating:5, outcome:'Full athletic recovery in 10 weeks', location:'Omole Estate, Lagos', isPublished:true },
      { patientName:'Pastor Emmanuel Dada', condition:'Bilateral Knee Arthritis', review:'As a pastor I stand for hours every Sunday. The arthritis was threatening my ministry. The doctors here prescribed a management plan that truly worked. Jesus truly is the Healer!', rating:5, outcome:'Pain-free ministry restored', location:'Ojodu Berger, Lagos', isPublished:true },
    ],
  });

  console.log('✅ Testimonials seeded');
  console.log('\n🎉 Database seeding complete!');
  console.log('─────────────────────────────────────');
  console.log('Admin login:  admin@jesusthehealer.com');
  console.log('Password:     Admin@JTHO2025  (change immediately!)');
  console.log('─────────────────────────────────────');
}

main()
  .catch(e => { console.error('❌ Seed error:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
