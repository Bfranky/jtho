import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { setSessionCookie } from '@/lib/auth';
import crypto from 'crypto';

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
    let user = await db.user.findUnique({
      where: { email },
      include: { staff: true }
    });
    
    if (!user) {
      // Auto-register since this is a sign up / login from Google
      const isBlessedAdmin = email === 'blessedogobor@gmail.com';
      const userRole = isBlessedAdmin ? 'ADMIN' : 'STAFF';
      const staffRole = isBlessedAdmin ? 'ADMIN' : 'DOCTOR';
      
      let firstName = payload.given_name || '';
      let lastName = payload.family_name || '';
      const imageUrl = payload.picture || null;
      
      if (!firstName && !lastName && payload.name) {
        const parts = payload.name.split(' ');
        firstName = parts[0] || 'Google';
        lastName = parts.slice(1).join(' ') || 'User';
      } else {
        if (!firstName) firstName = 'Google';
        if (!lastName) lastName = 'User';
      }

      // Hash a random password for User model requirements
      const randomPassword = crypto.randomBytes(32).toString('hex');
      const hashedPassword = crypto.createHash('sha256').update(randomPassword).digest('hex');
      
      user = await db.$transaction(async (tx) => {
        const newUser = await tx.user.create({
          data: {
            email,
            password: hashedPassword,
            role: userRole,
          }
        });
        
        const newStaff = await tx.staff.create({
          data: {
            userId: newUser.id,
            firstName,
            lastName,
            role: staffRole,
            imageUrl,
            availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            isActive: true,
          }
        });
        
        return {
          ...newUser,
          staff: newStaff,
        };
      });
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
