// Cryptographically secure admin session management using Web Crypto API
// Compatible with Next.js Edge Runtime (Middleware) and Node.js Serverless runtime.

const COOKIE_NAME = 'challenges_admin_session';

function getSessionSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    'challenges-center-session-secret-key-2026-prod'
  );
}

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function base64UrlDecode(str: string): Uint8Array {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function getSigningKey(): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    'raw',
    enc.encode(getSessionSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

export interface AdminSessionPayload {
  role: 'admin';
  email: string;
  exp: number;
}

export async function createAdminSessionToken(email: string): Promise<string> {
  const key = await getSigningKey();
  const enc = new TextEncoder();

  const payload: AdminSessionPayload = {
    role: 'admin',
    email,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days valid
  };

  const payloadStr = JSON.stringify(payload);
  const payloadB64 = base64UrlEncode(enc.encode(payloadStr));

  const signatureBuffer = await crypto.subtle.sign(
    'HMAC',
    key,
    enc.encode(payloadB64)
  );

  const signatureB64 = base64UrlEncode(new Uint8Array(signatureBuffer));
  return `${payloadB64}.${signatureB64}`;
}

export async function verifyAdminSessionToken(
  token: string | undefined | null
): Promise<{ valid: boolean; email?: string }> {
  if (!token || typeof token !== 'string') {
    return { valid: false };
  }

  const parts = token.split('.');
  if (parts.length !== 2) {
    return { valid: false };
  }

  const [payloadB64, signatureB64] = parts;

  try {
    const key = await getSigningKey();
    const enc = new TextEncoder();
    const signatureBytes = base64UrlDecode(signatureB64);

    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      signatureBytes as unknown as BufferSource,
      enc.encode(payloadB64) as unknown as BufferSource
    );

    if (!isValid) {
      return { valid: false };
    }

    const payloadBytes = base64UrlDecode(payloadB64);
    const payloadStr = new TextDecoder().decode(payloadBytes);
    const payload = JSON.parse(payloadStr) as AdminSessionPayload;

    if (payload.role !== 'admin') {
      return { valid: false };
    }

    if (typeof payload.exp !== 'number' || Date.now() > payload.exp) {
      return { valid: false };
    }

    return { valid: true, email: payload.email };
  } catch {
    return { valid: false };
  }
}

export { COOKIE_NAME };
