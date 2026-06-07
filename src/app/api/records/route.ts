import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// ── GET /api/records ──────────────────────────────────────────────
// Fetches records, optionally filtered by patientId
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get('patientId');

    const records = await db.patientRecord.findMany({
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

    return NextResponse.json({ success: true, data: records });
  } catch (error) {
    console.error('[GET /api/records]', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch medical records' }, { status: 500 });
  }
}

// ── POST /api/records ─────────────────────────────────────────────
// Creates a new patient record (clinical notes/diagnosis)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      patientId,
      staffId,
      condition,
      diagnosis,
      treatment,
      clinicalNotes,
      status
    } = body;

    // Validation
    if (!patientId || !condition) {
      return NextResponse.json(
        { success: false, error: 'patientId and condition are required' },
        { status: 400 }
      );
    }

    // Verify patient exists
    const patient = await db.patient.findUnique({ where: { id: patientId } });
    if (!patient) {
      return NextResponse.json({ success: false, error: 'Patient not found' }, { status: 404 });
    }

    // Create the record
    const record = await db.patientRecord.create({
      data: {
        patientId,
        staffId: staffId || null,
        condition,
        diagnosis: diagnosis || null,
        treatment: treatment || null,
        clinicalNotes: clinicalNotes || null,
        status: status || 'ACTIVE',
        admissionDate: new Date()
      },
      include: {
        staff: {
          select: { firstName: true, lastName: true, role: true }
        }
      }
    });

    return NextResponse.json({ success: true, data: record }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/records]', error);
    return NextResponse.json({ success: false, error: 'Failed to save patient record' }, { status: 500 });
  }
}
