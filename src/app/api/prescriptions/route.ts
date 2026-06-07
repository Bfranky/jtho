import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// ── GET /api/prescriptions ─────────────────────────────────────────
// Fetches prescriptions, optionally filtered by patientId
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get('patientId') ?? undefined;

    const prescriptions = await db.prescription.findMany({
      where: patientId ? { patientId } : undefined,
      include: {
        staff: {
          select: { firstName: true, lastName: true, role: true }
        },
        patient: {
          select: { firstName: true, lastName: true, patientNumber: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, data: prescriptions });
  } catch (error) {
    console.error('[GET /api/prescriptions]', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch prescriptions' }, { status: 500 });
  }
}

// ── POST /api/prescriptions ────────────────────────────────────────
// Creates a new prescription for a patient
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      patientId,
      staffId,
      recordId,
      medication,
      dosage,
      frequency,
      duration,
      instructions
    } = body;

    // Validation
    if (!patientId || !medication || !dosage || !frequency || !duration) {
      return NextResponse.json(
        { success: false, error: 'patientId, medication, dosage, frequency, and duration are required' },
        { status: 400 }
      );
    }

    // Verify patient exists
    const patient = await db.patient.findUnique({ where: { id: patientId } });
    if (!patient) {
      return NextResponse.json({ success: false, error: 'Patient not found' }, { status: 404 });
    }

    // Create prescription
    const prescription = await db.prescription.create({
      data: {
        patientId,
        staffId: staffId || null,
        recordId: recordId || null,
        medication,
        dosage,
        frequency,
        duration,
        instructions: instructions || null,
        status: 'ACTIVE'
      },
      include: {
        staff: {
          select: { firstName: true, lastName: true, role: true }
        }
      }
    });

    return NextResponse.json({ success: true, data: prescription }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/prescriptions]', error);
    return NextResponse.json({ success: false, error: 'Failed to save prescription' }, { status: 500 });
  }
}

// ── PATCH /api/prescriptions ───────────────────────────────────────
// Updates prescription status (ACTIVE, COMPLETED, CANCELLED)
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'id and status are required' }, { status: 400 });
    }

    const updated = await db.prescription.update({
      where: { id },
      data: { status }
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('[PATCH /api/prescriptions]', error);
    return NextResponse.json({ success: false, error: 'Failed to update prescription' }, { status: 500 });
  }
}
