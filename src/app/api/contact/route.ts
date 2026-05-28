import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// ── POST /api/contact ─────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, service, message } = body;

    if (!name || !phone || !message) {
      return NextResponse.json({ success:false, error:'name, phone, and message are required' }, { status:400 });
    }

    const msg = await db.contactMessage.create({
      data: { name, phone, email: email ?? undefined, service: service ?? undefined, message },
    });

    return NextResponse.json({ success:true, data: msg }, { status:201 });
  } catch (error) {
    console.error('[POST /api/contact]', error);
    return NextResponse.json({ success:false, error:'Failed to save message' }, { status:500 });
  }
}

// ── GET /api/contact ──────────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const unreadOnly = searchParams.get('unread') === 'true';

    const messages = await db.contactMessage.findMany({
      where:   unreadOnly ? { isRead: false } : undefined,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success:true, data: messages });
  } catch (error) {
    console.error('[GET /api/contact]', error);
    return NextResponse.json({ success:false, error:'Failed to fetch messages' }, { status:500 });
  }
}

// ── PATCH /api/contact — mark as read ────────────────────────────
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;
    if (!id) return NextResponse.json({ success:false, error:'id is required' }, { status:400 });

    const updated = await db.contactMessage.update({
      where: { id },
      data:  { isRead: true },
    });

    return NextResponse.json({ success:true, data: updated });
  } catch (error) {
    console.error('[PATCH /api/contact]', error);
    return NextResponse.json({ success:false, error:'Failed to update message' }, { status:500 });
  }
}
