import { createHash, randomBytes } from 'node:crypto';

/**
 * Token para completar un lead parcial: 32 bytes aleatorios en base64url (43 caracteres).
 * Se le devuelve a la persona una sola vez; en la base solo queda su sha256. Nunca se loguea.
 */
export function generarToken(): string {
  return randomBytes(32).toString('base64url');
}

/** sha256 en hex (64 caracteres): lo único que se guarda del token. */
export function hashToken(token: string): string {
  return createHash('sha256').update(token, 'utf8').digest('hex');
}
