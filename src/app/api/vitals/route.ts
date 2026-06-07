import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// ── GET /api/vitals ───────────────────────────────────────────────
// Fetches all vitals recorded for a specific patient
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get('patientId');

    if (!patientId) {
      return NextResponse.json({ success: false, error: 'patientId is required' }, { status: 400 });
    }

    const vitals = await db.vital.findMany({
      where: { patientId },
      orderBy: { recordedAt: 'desc' }
    });

    return NextResponse.json({ success: true, data: vitals });
  } catch (error) {
    console.error('[GET /api/vitals]', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch vitals' }, { status: 500 });
  }
}

// ── POST /api/vitals ──────────────────────────────────────────────
// Records new vital signs for a patient
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      patientId,
      bloodPressure,
      pulse,
      temperature,
      weight,
      height,
      oxygenSat,
      notes
    } = body;

    if (!patientId) {
      return NextResponse.json({ success: false, error: 'patientId is required' }, { status: 400 });
    }

    // Verify patient exists
    const patient = await db.patient.findUnique({ where: { id: patientId } });
    if (!patient) {
      return NextResponse.json({ success: false, error: 'Patient not found' }, { status: 404 });
    }

    const vital = await db.vital.create({
      data: {
        patientId,
        bloodPressure: bloodPressure || null,
        pulse: pulse ? parseInt(pulse, 10) : null,
        temperature: temperature ? parseFloat(temperature) : null,
        weight: weight ? parseFloat(weight) : null,
        height: height ? parseFloat(height) : null,
        oxygenSat: oxygenSat ? parseInt(oxygenSat, 10) : null,
        notes: notes || null
      }
    });

    return NextResponse.json({ success: true, data: vital }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/vitals]', error);
    return NextResponse.json({ success: false, error: 'Failed to save vital signs' }, { status: 500 });
  }
}
