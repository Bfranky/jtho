import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// ── GET /api/testimonials ─────────────────────────────────────────
export async function GET() {
  try {
    const testimonials = await db.testimonial.findMany({
      where:   { isPublished: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success:true, data: testimonials });
  } catch (error) {
    console.error('[GET /api/testimonials]', error);
    return NextResponse.json({ success:false, error:'Failed to fetch testimonials' }, { status:500 });
  }
}

// ── POST /api/testimonials ────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { patientName, condition, review, rating, outcome, location } = body;

    if (!patientName || !review) {
      return NextResponse.json({ success:false, error:'patientName and review are required' }, { status:400 });
    }

    const testimonial = await db.testimonial.create({
      data: {
        patientName,
        condition:   condition ?? 'General',
        review,
        rating:      rating    ?? 5,
        outcome:     outcome   ?? undefined,
        location:    location  ?? undefined,
        isPublished: false, // Admin must approve before publishing
      },
    });

    return NextResponse.json({ success:true, data: testimonial, message:'Thank you! Your review has been submitted for approval.' }, { status:201 });
  } catch (error) {
    console.error('[POST /api/testimonials]', error);
    return NextResponse.json({ success:false, error:'Failed to submit testimonial' }, { status:500 });
  }
}
