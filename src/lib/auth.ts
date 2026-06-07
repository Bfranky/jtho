import crypto from 'crypto';
import { cookies } from 'next/headers';

function base64UrlEncode(str: string | Buffer): string {
  const buf = Buffer.isBuffer(str) ? str : Buffer.from(str);
  return buf.toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return Buffer.from(base64, 'base64').toString('utf8');
}

export function signJWT(payload: any, secret: string, expiresInSeconds: number = 86400): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const base64UrlHeader = base64UrlEncode(JSON.stringify(header));
  
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const fullPayload = { ...payload, exp };
  const base64UrlPayload = base64UrlEncode(JSON.stringify(fullPayload));
  
  const signatureInput = `${base64UrlHeader}.${base64UrlPayload}`;
  const signature = crypto.createHmac('sha256', secret)
    .update(signatureInput)
    .digest();
  const base64UrlSignature = base64UrlEncode(signature);
  
  return `${signatureInput}.${base64UrlSignature}`;
}

export function verifyJWT(token: string, secret: string): any | null {
  try {
    if (!token) return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const [headerB64, payloadB64, signatureB64] = parts;
    
    const signatureInput = `${headerB64}.${payloadB64}`;
    const calculatedSignature = crypto.createHmac('sha256', secret)
      .update(signatureInput)
      .digest();
    const calculatedSignatureB64 = base64UrlEncode(calculatedSignature);
    
    if (signatureB64 !== calculatedSignatureB64) {
      return null;
    }
    
    const payload = JSON.parse(base64UrlDecode(payloadB64));
    if (payload.exp && Date.now() / 1000 > payload.exp) {
      return null; // Expired
    }
    
    return payload;
  } catch (e) {
    return null;
  }
}

export async function getAuthSession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('jtho_session')?.value;
    if (!token) return null;
    
    const secret = process.env.JWT_SECRET || 'super-secret-admin-session-signing-key-for-jtho-jwt';
    return verifyJWT(token, secret);
  } catch (e) {
    return null;
  }
}

export async function setSessionCookie(payload: any, expiresInSeconds: number = 86400) {
  const secret = process.env.JWT_SECRET || 'super-secret-admin-session-signing-key-for-jtho-jwt';
  const token = signJWT(payload, secret, expiresInSeconds);
  const cookieStore = await cookies();
  cookieStore.set('jtho_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: expiresInSeconds,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('jtho_session');
}
