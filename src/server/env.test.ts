// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { EnvError, loadEnv } from './env';

const SALT = 'una-sal-bastante-larga-123';
const KEY = 'x'.repeat(40);

describe('loadEnv', () => {
  it('en desarrollo funciona sin nada: repositorio en archivo y sal de desarrollo', () => {
    const env = loadEnv({ NODE_ENV: 'development' });
    expect(env.LEAD_REPOSITORY).toBe('file');
    expect(env.IP_HASH_SALT.length).toBeGreaterThanOrEqual(16);
    expect(env.RATE_LIMIT_MAX).toBe(5);
    expect(env.RATE_LIMIT_WINDOW_SECONDS).toBe(600);
  });

  it('trata las variables vacías como no definidas', () => {
    const env = loadEnv({ NODE_ENV: 'development', SUPABASE_URL: '', LEAD_REPOSITORY: '' });
    expect(env.LEAD_REPOSITORY).toBe('file');
  });

  it('usa supabase por defecto si hay credenciales', () => {
    const env = loadEnv({
      NODE_ENV: 'production',
      IP_HASH_SALT: SALT,
      SUPABASE_URL: 'https://abc.supabase.co',
      SUPABASE_SERVICE_ROLE_KEY: KEY,
    });
    expect(env.LEAD_REPOSITORY).toBe('supabase');
  });

  it('falla en producción si falta IP_HASH_SALT', () => {
    expect(() => loadEnv({ NODE_ENV: 'production' })).toThrow(EnvError);
    expect(() => loadEnv({ NODE_ENV: 'production' })).toThrow(/IP_HASH_SALT/);
  });

  it('falla si pide supabase sin credenciales', () => {
    expect(() => loadEnv({ NODE_ENV: 'development', LEAD_REPOSITORY: 'supabase' })).toThrow(
      /SUPABASE_URL/,
    );
  });

  it('falla en Vercel si el repositorio no persiste (archivo o memoria)', () => {
    const base = { NODE_ENV: 'production', IP_HASH_SALT: SALT, VERCEL: '1' };
    expect(() => loadEnv({ ...base, LEAD_REPOSITORY: 'file' })).toThrow(/no persiste/);
    expect(() => loadEnv(base)).toThrow(/no persiste/);
  });

  it('permite `next start` local en producción con repositorio en archivo', () => {
    const env = loadEnv({ NODE_ENV: 'production', IP_HASH_SALT: SALT, LEAD_REPOSITORY: 'file' });
    expect(env.LEAD_REPOSITORY).toBe('file');
  });

  it('valida formato y rangos', () => {
    expect(() => loadEnv({ IP_HASH_SALT: 'corta' })).toThrow(/16 caracteres/);
    expect(() => loadEnv({ SUPABASE_URL: 'no-es-url' })).toThrow(EnvError);
    expect(() => loadEnv({ RATE_LIMIT_MAX: '0' })).toThrow(EnvError);
    expect(() => loadEnv({ LEAD_REPOSITORY: 'mongo' })).toThrow(EnvError);
  });
});
