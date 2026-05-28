import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// ── GET /api/appointments ─────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status    = searchParams.get('status')   ?? undefined;
    const patientId = searchParams.get('patientId') ?? undefined;
    const staffId   = searchParams.get('staffId')   ?? undefined;
    const date      = searchParams.get('date')      ?? undefined;

    const appointments = await db.appointment.findMany({
      where: {
        ...(status    && { status:    status    as any }),
        ...(patientId && { patientId }),
        ...(staffId   && { staffId   }),
        ...(date      && { scheduledDate: { gte: new Date(date), lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)) } }),
      },
      include: {
        patient: { select: { id:true, firstName:true, lastName:true, phone:true, patientNumber:true } },
        staff:   { select: { id:true, firstName:true, lastName:true, role:true, specialty:true } },
      },
      orderBy: { scheduledDate: 'asc' },
    });

    return NextResponse.json({ success:true, data: appointments });
  } catch (error) {
    console.error('[GET /api/appointments]', error);
    return NextResponse.json({ success:false, error:'Failed to fetch appointments' }, { status:500 });
  }
}

// ── POST /api/appointments ────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, phone, email, dob, gender, department, doctorId, date, time, notes, isEmergency } = body;

    // Validate required fields
    if (!firstName || !lastName || !phone || !date || !time) {
      return NextResponse.json({ success:false, error:'Missing required fields: firstName, lastName, phone, date, time' }, { status:400 });
    }

    // Find or create patient
    let patient = await db.patient.findFirst({ where: { phone } });

    if (!patient) {
      // Auto-generate patient number
      const count      = await db.patient.count();
      const patientNum = `JTH-${String(count + 1).padStart(3, '0')}`;

      patient = await db.patient.create({
        data: {
          patientNumber: patientNum,
          firstName,
          lastName,
          phone,
          email:       email   ?? undefined,
          dateOfBirth: dob     ? new Date(dob) : undefined,
          gender:      gender  ?? undefined,
        },
      });
    }

    // Generate appointment reference
    const apptCount = await db.appointment.count();
    const apptRef   = `APT-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${String(apptCount + 1).padStart(3,'0')}`;

    const appointment = await db.appointment.create({
      data: {
        appointmentRef: apptRef,
        patientId:      patient.id,
        staffId:        doctorId   ?? undefined,
        service:        department ?? 'General Consultation',
        scheduledDate:  new Date(date),
        scheduledTime:  time,
        notes:          notes       ?? undefined,
        isEmergency:    isEmergency ?? false,
        status:         'PENDING',
      },
      include: {
        patient: true,
        staff:   { select: { firstName:true, lastName:true, specialty:true } },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        appointmentRef: appointment.appointmentRef,
        patient: `${patient.firstName} ${patient.lastName}`,
        patientId: patient.patientNumber,
        doctor:  appointment.staff ? `${appointment.staff.firstName} ${appointment.staff.lastName}` : 'To be assigned',
        date:    appointment.scheduledDate,
        time:    appointment.scheduledTime,
        service: appointment.service,
        status:  appointment.status,
      },
    }, { status: 201 });

  } catch (error) {
    console.error('[POST /api/appointments]', error);
    return NextResponse.json({ success:false, error:'Failed to create appointment' }, { status:500 });
  }
}

// ── PATCH /api/appointments ───────────────────────────────────────
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ success:false, error:'id and status are required' }, { status:400 });
    }

    const updated = await db.appointment.update({
      where: { id },
      data:  { status },
    });

    return NextResponse.json({ success:true, data: updated });
  } catch (error) {
    console.error('[PATCH /api/appointments]', error);
    return NextResponse.json({ success:false, error:'Failed to update appointment' }, { status:500 });
  }
}
