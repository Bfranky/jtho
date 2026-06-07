import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthSession } from '@/lib/auth';
import crypto from 'crypto';

// Simple native SHA-256 password hashing helper
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// ── GET /api/staff ────────────────────────────────────────────────
// Fetches staff members. Administrators can view all; public visitors view only active staff.
export async function GET(req: NextRequest) {
  try {
    const session = await getAuthSession();
    const isAdmin = session?.role === 'ADMIN';

    const staff = await db.staff.findMany({
      where: isAdmin ? {} : { isActive: true },
      include: {
        user: {
          select: { email: true, role: true }
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
// Registers a new staff member (creates both User and Staff records). Restricted to ADMIN.
export async function POST(req: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Access denied: Administrators only' }, { status: 403 });
    }

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
          role: role === 'ADMIN' ? 'ADMIN' : 'STAFF',
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
          imageUrl: `https://images.unsplash.com/photo-${role === 'DOCTOR' ? '1612349317150-e413f6a5b16d' : '1594824476967-48c8b964273f'}?auto=format&fit=crop&w=400&q=80`,
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

// ── PATCH /api/staff ──────────────────────────────────────────────
// Updates an existing staff member. Restricted to ADMIN.
export async function PATCH(req: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Access denied: Administrators only' }, { status: 403 });
    }

    const body = await req.json();
    const {
      id,
      email,
      firstName,
      lastName,
      phone,
      role,
      specialty,
      qualifications,
      experience,
      bio,
      availableDays,
      isActive
    } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Staff ID is required' }, { status: 400 });
    }

    const staff = await db.staff.findUnique({
      where: { id },
      include: { user: true }
    });

    if (!staff) {
      return NextResponse.json({ success: false, error: 'Staff member not found' }, { status: 404 });
    }

    const updatedStaff = await db.$transaction(async (tx) => {
      // Update User email and user role if changed
      if (email && email !== staff.user.email) {
        const existingUser = await tx.user.findUnique({ where: { email } });
        if (existingUser) {
          throw new Error('Email already exists in the system');
        }
        await tx.user.update({
          where: { id: staff.userId },
          data: { email }
        });
      }

      if (role) {
        await tx.user.update({
          where: { id: staff.userId },
          data: { role: role === 'ADMIN' ? 'ADMIN' : 'STAFF' }
        });
      }

      // Update Staff profile
      const profile = await tx.staff.update({
        where: { id },
        data: {
          firstName: firstName !== undefined ? firstName : undefined,
          lastName: lastName !== undefined ? lastName : undefined,
          phone: phone !== undefined ? phone : undefined,
          role: role !== undefined ? role : undefined,
          specialty: specialty !== undefined ? specialty : undefined,
          qualifications: qualifications !== undefined ? qualifications : undefined,
          experience: experience !== undefined ? (experience ? parseInt(experience, 10) : null) : undefined,
          bio: bio !== undefined ? bio : undefined,
          availableDays: availableDays !== undefined ? availableDays : undefined,
          isActive: isActive !== undefined ? isActive : undefined
        }
      });

      return profile;
    });

    return NextResponse.json({ success: true, message: 'Staff profile updated successfully', data: updatedStaff });
  } catch (error: any) {
    console.error('[PATCH /api/staff]', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to update staff' }, { status: 500 });
  }
}

// ── DELETE /api/staff ─────────────────────────────────────────────
// Deactivates or deletes a staff member. Restricted to ADMIN.
export async function DELETE(req: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Access denied: Administrators only' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Staff ID is required' }, { status: 400 });
    }

    const staff = await db.staff.findUnique({
      where: { id },
      include: { appointments: true, records: true }
    });

    if (!staff) {
      return NextResponse.json({ success: false, error: 'Staff member not found' }, { status: 404 });
    }

    // Safely toggle inactive if staff member has reference records in appointments or patient files
    if (staff.appointments.length > 0 || staff.records.length > 0) {
      const deactivatedStaff = await db.staff.update({
        where: { id },
        data: { isActive: false }
      });
      return NextResponse.json({
        success: true,
        message: 'Staff member has active appointments or records and was deactivated instead of deleted',
        data: deactivatedStaff
      });
    }

    // Otherwise fully delete User, which cascades to Staff
    await db.user.delete({
      where: { id: staff.userId }
    });

    return NextResponse.json({ success: true, message: 'Staff member deleted successfully' });
  } catch (error) {
    console.error('[DELETE /api/staff]', error);
    return NextResponse.json({ success: false, error: 'Failed to delete staff member' }, { status: 500 });
  }
}
