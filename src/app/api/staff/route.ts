import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import crypto from 'crypto';

// Simple native SHA-256 password hashing helper
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// ── GET /api/staff ────────────────────────────────────────────────
// Fetches all active medical staff to display on the Team page
export async function GET(req: NextRequest) {
  try {
    const staff = await db.staff.findMany({
      where: { isActive: true },
      include: {
        user: {
          select: { email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, data: staff });
  } catch (error) {
    console.error('[GET /api/staff]', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch staff list' }, { status: 500 });
  }
}

// ── POST /api/staff ───────────────────────────────────────────────
// Registers a new staff member (creates both User and Staff records)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      role,
      specialty,
      qualifications,
      experience,
      bio,
      availableDays
    } = body;

    // Validation
    if (!email || !password || !firstName || !lastName || !role) {
      return NextResponse.json(
        { success: false, error: 'Email, password, first name, last name, and role are required' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'A staff account with this email already exists' },
        { status: 409 }
      );
    }

    // Hash the password securely
    const hashedPassword = hashPassword(password);

    // Create User and Staff in a transaction
    const newStaff = await db.$transaction(async (tx) => {
      // 1. Create User
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          role: 'STAFF', // Set user role to STAFF
        }
      });

      // 2. Create Staff Profile
      const staffProfile = await tx.staff.create({
        data: {
          userId: user.id,
          firstName,
          lastName,
          phone: phone || null,
          role,
          specialty: specialty || null,
          qualifications: qualifications || null,
          experience: experience ? parseInt(experience, 10) : null,
          bio: bio || null,
          imageUrl: `https://images.unsplash.com/photo-${role === 'DOCTOR' ? '1612349317150-e413f6a5b16d' : '1594824476967-48c8b964273f'}?auto=format&fit=crop&w=400&q=80`, // nice default images based on role
          availableDays: availableDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          isActive: true
        }
      });

      return staffProfile;
    });

    return NextResponse.json(
      { success: true, message: 'Staff registration successful', data: newStaff },
      { status: 201 }
    );
  } catch (error) {
    console.error('[POST /api/staff]', error);
    return NextResponse.json({ success: false, error: 'Failed to register staff' }, { status: 500 });
  }
}
