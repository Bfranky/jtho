import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import crypto from 'crypto';

// ONE-TIME ADMIN SETUP ENDPOINT
// This creates/updates blessedogobor@gmail.com as the system administrator.
// DELETE this file after your first successful login.

const SETUP_SECRET = process.env.SETUP_SECRET || 'JTHO-SETUP-2025';

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Require a secret so random people can't call this
    if (body.secret !== SETUP_SECRET) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const email = 'blessedogobor@gmail.com';
    const password = body.password;

    if (!password || password.length < 6) {
      return NextResponse.json({ success: false, error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const hashedPassword = hashPassword(password);

    // Upsert: update if exists, create if not
    const existingUser = await db.user.findUnique({ where: { email } });

    if (existingUser) {
      await db.user.update({
        where: { email },
        data: { password: hashedPassword, role: 'ADMIN' }
      });
      return NextResponse.json({ success: true, message: `Admin updated: ${email}` });
    }

    // Create new admin user
    await db.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'ADMIN',
      }
    });

    return NextResponse.json({ success: true, message: `Admin created: ${email}` });
  } catch (error) {
    console.error('[POST /api/admin/setup]', error);
    return NextResponse.json({ success: false, error: 'Setup failed' }, { status: 500 });
  }
}
