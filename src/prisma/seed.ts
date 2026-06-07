import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Cleaning and seeding database for Jesus The Healer Orthopaedic Home...\n');

  // Clear existing tables in correct order of dependency
  console.log('Clearing old records...');
  
  // 1. Delete records with foreign keys first
  await prisma.vital.deleteMany();
  await prisma.prescription.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.patientRecord.deleteMany();
  
  // 2. Delete main models
  await prisma.patient.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.blogPost.deleteMany();
  
  // 3. Delete staff and users
  await prisma.staff.deleteMany();
  await prisma.user.deleteMany();

  console.log('Database cleared.');

  // Create Admin user
  const admin = await prisma.user.create({
    data: {
      email:    'admin@jesusthehealer.com',
      // bcrypt hash of "Admin@JTHO2025" — change immediately after first login
      password: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMUBqE2.9hn8gHDHHnFh0s5I.S',
      role:     UserRole.ADMIN,
    },
  });
  console.log('✅ Admin user created:', admin.email);
  console.log('\n🎉 Database seeding complete!');
  console.log('─────────────────────────────────────');
  console.log('Admin login:  admin@jesusthehealer.com');
  console.log('Password:     Admin@JTHO2025  (change immediately!)');
  console.log('─────────────────────────────────────');
}

main()
  .catch(e => { console.error('❌ Seed error:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
