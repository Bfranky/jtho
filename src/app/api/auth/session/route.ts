import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getAuthSession();
    
    if (!session) {
      return NextResponse.json({ success: true, session: null });
    }
    
    // Retrieve full up-to-date user details and staff profile from database
    const user = await db.user.findUnique({
      where: { id: session.userId },
      include: { staff: true }
    });
    
    if (!user) {
      return NextResponse.json({ success: true, session: null });
    }
    
    return NextResponse.json({
      success: true,
      session: {
        userId: user.id,
        email: user.email,
        role: user.role,
        staffProfile: user.staff
      }
    });
  } catch (error) {
    console.error('[GET /api/auth/session]', error);
    return NextResponse.json({ success: false, error: 'Failed to retrieve session status' }, { status: 500 });
  }
}
