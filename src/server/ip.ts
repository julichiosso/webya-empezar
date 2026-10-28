import { createHmac } from 'node:crypto';

/** IP del cliente según los headers del proxy (Vercel pone la real primero en x-forwarded-for). */
export function getClientIp(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return forwarded || headers.get('x-real-ip')?.trim() || 'desconocida';
}

/** HMAC-SHA256 con sal secreta: la IP en claro nunca se guarda ni se loguea. */
export function hashIp(ip: string, salt: string): string {
  return createHmac('sha256', salt).update(ip).digest('hex');
}
