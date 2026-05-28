import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// ── GET /api/patients ─────────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') ?? '';
    const status = searchParams.get('status') ?? '';

    const patients = await db.patient.findMany({
      where: {
        OR: search ? [
          { firstName:     { contains: search, mode:'insensitive' } },
          { lastName:      { contains: search, mode:'insensitive' } },
          { phone:         { contains: search } },
          { patientNumber: { contains: search, mode:'insensitive' } },
        ] : undefined,
      },
      include: {
        records: {
          where:   status ? { status: status as any } : undefined,
          orderBy: { createdAt: 'desc' },
          take:    1,
          include: { staff: { select: { firstName:true, lastName:true } } },
        },
        appointments: {
          orderBy: { scheduledDate: 'desc' },
          take: 1,
        },
        _count: {
          select: { appointments:true, records:true, prescriptions:true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success:true, data: patients });
  } catch (error) {
    console.error('[GET /api/patients]', error);
    return NextResponse.json({ success:false, error:'Failed to fetch patients' }, { status:500 });
  }
}

// ── POST /api/patients ────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      firstName, lastName, phone, email, dateOfBirth,
      gender, address, bloodGroup, allergies,
      emergencyContact, emergencyPhone,
    } = body;

    if (!firstName || !lastName || !phone) {
      return NextResponse.json({ success:false, error:'firstName, lastName, and phone are required' }, { status:400 });
    }

    // Check duplicate phone
    const existing = await db.patient.findFirst({ where: { phone } });
    if (existing) {
      return NextResponse.json({ success:false, error:'A patient with this phone number already exists', patientId: existing.patientNumber }, { status:409 });
    }

    const count      = await db.patient.count();
    const patientNum = `JTH-${String(count + 1).padStart(3, '0')}`;

    const patient = await db.patient.create({
      data: {
        patientNumber:   patientNum,
        firstName,
        lastName,
        phone,
        email:           email            ?? undefined,
        dateOfBirth:     dateOfBirth      ? new Date(dateOfBirth) : undefined,
        gender:          gender           ?? undefined,
        address:         address          ?? undefined,
        bloodGroup:      bloodGroup       ?? 'UNKNOWN',
        allergies:       allergies        ?? undefined,
        emergencyContact:emergencyContact ?? undefined,
        emergencyPhone:  emergencyPhone   ?? undefined,
      },
    });

    return NextResponse.json({ success:true, data: patient }, { status:201 });
  } catch (error) {
    console.error('[POST /api/patients]', error);
    return NextResponse.json({ success:false, error:'Failed to create patient' }, { status:500 });
  }
}

// ── PATCH /api/patients ───────────────────────────────────────────
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success:false, error:'Patient id is required' }, { status:400 });
    }

    const patient = await db.patient.update({
      where: { id },
      data:  {
        ...updates,
        dateOfBirth: updates.dateOfBirth ? new Date(updates.dateOfBirth) : undefined,
      },
    });

    return NextResponse.json({ success:true, data: patient });
  } catch (error) {
    console.error('[PATCH /api/patients]', error);
    return NextResponse.json({ success:false, error:'Failed to update patient' }, { status:500 });
  }
}
