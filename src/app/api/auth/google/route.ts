import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { setSessionCookie } from '@/lib/auth';

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const { credential } = await req.json();
    
    if (!credential) {
      return NextResponse.json({ success: false, error: 'Credential token is required' }, { status: 400 });
    }
    
    // Verify Google ID token using Google TokenInfo API
    const tokenInfoUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`;
    const googleRes = await fetch(tokenInfoUrl);
    
    if (!googleRes.ok) {
      const errText = await googleRes.text();
      console.error('[Google Token Verification Failed]', errText);
      return NextResponse.json({ success: false, error: 'Google authentication failed' }, { status: 401 });
    }
    
    const payload = await googleRes.json();
    const email = payload.email;
    const emailVerified = payload.email_verified === 'true' || payload.email_verified === true;
    
    // Privacy & Security: Verify that the audience (aud) matches our Google Client ID
    const clientAudience = payload.aud;
    const expectedClientId = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    
    if (clientAudience !== expectedClientId) {
      console.error('[Google Auth Error] Audience mismatch:', { clientAudience, expectedClientId });
      return NextResponse.json({ success: false, error: 'Unauthorized client application' }, { status: 401 });
    }
    
    if (!email || !emailVerified) {
      return NextResponse.json({ success: false, error: 'Unverified Google account' }, { status: 401 });
    }
    
    // Query database for pre-registered administrator user
    const user = await db.user.findUnique({
      where: { email },
      include: { staff: true }
    });
    
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        error: 'Access denied: This email is not pre-registered in the system' 
      }, { status: 403 });
    }
    
    // Check if the user is authorized as ADMIN or STAFF
    // The requirement says: "only those authorised can edit info or add doctors ... make the admin standard no demo"
    if (user.role !== 'ADMIN' && user.role !== 'STAFF') {
      return NextResponse.json({ success: false, error: 'Access denied: unauthorized role' }, { status: 403 });
    }
    
    // Create session cookie
    await setSessionCookie({
      userId: user.id,
      email: user.email,
      role: user.role
    });
    
    return NextResponse.json({
      success: true,
      message: 'Logged in with Google successfully',
      data: {
        userId: user.id,
        email: user.email,
        role: user.role,
        staffProfile: user.staff
      }
    });
  } catch (error) {
    console.error('[POST /api/auth/google]', error);
    return NextResponse.json({ success: false, error: 'Google auth system error' }, { status: 500 });
  }
}
