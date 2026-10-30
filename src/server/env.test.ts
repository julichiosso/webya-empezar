// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { EnvError, loadEnv } from './env';

const SALT = 'una-sal-bastante-larga-123';
const KEY = 'x'.repeat(40);

describe('loadEnv', () => {
  it('en desarrollo funciona sin nada: repositorio en memoria y sal de desarrollo', () => {
    const env = loadEnv({ NODE_ENV: 'development' });
    expect(env.LEAD_REPOSITORY).toBe('memory');
    expect(env.IP_HASH_SALT.length).toBeGreaterThanOrEqual(16);
    expect(env.RATE_LIMIT_MAX).toBe(5);
    expect(env.RATE_LIMIT_WINDOW_SECONDS).toBe(600);
    expect(env.RATE_LIMIT_BURST_PER_MINUTE).toBe(20);
  });

  it('trata las variables vacías como no definidas', () => {
    const env = loadEnv({ NODE_ENV: 'development', SUPABASE_URL: '', LEAD_REPOSITORY: '' });
    expect(env.LEAD_REPOSITORY).toBe('memory');
  });

  describe('pnpm dev nunca escribe en Supabase real sin confirmación', () => {
    const real = { SUPABASE_URL: 'https://abc.supabase.co', SUPABASE_SERVICE_ROLE_KEY: KEY };

    it('con credenciales en el .env pero sin LEAD_REPOSITORY, usa memoria', () => {
      expect(loadEnv({ NODE_ENV: 'development', ...real }).LEAD_REPOSITORY).toBe('memory');
      expect(loadEnv({ NODE_ENV: 'test', ...real }).LEAD_REPOSITORY).toBe('memory');
    });

    it('falla si el .env pide supabase en desarrollo o tests', () => {
      for (const NODE_ENV of ['development', 'test']) {
        expect(() => loadEnv({ NODE_ENV, ...real, LEAD_REPOSITORY: 'supabase' })).toThrow(
          /ALLOW_SUPABASE_IN_DEV=1/,
        );
      }
    });

    it('solo acepta la confirmación explícita "1"', () => {
      const pedido = { NODE_ENV: 'development', ...real, LEAD_REPOSITORY: 'supabase' };
      expect(() => loadEnv({ ...pedido, ALLOW_SUPABASE_IN_DEV: 'true' })).toThrow(EnvError);
      expect(loadEnv({ ...pedido, ALLOW_SUPABASE_IN_DEV: '1' }).LEAD_REPOSITORY).toBe('supabase');
    });

    it('en Vercel sigue usando supabase sin confirmación', () => {
      const env = loadEnv({
        NODE_ENV: 'production',
        VERCEL: '1',
        IP_HASH_SALT: SALT,
        ...real,
        LEAD_REPOSITORY: 'supabase',
      });
      expect(env.LEAD_REPOSITORY).toBe('supabase');
    });

    it('`next start` local con credenciales en el .env usa archivo, no la base real', () => {
      const env = loadEnv({ NODE_ENV: 'production', IP_HASH_SALT: SALT, ...real });
      expect(env.LEAD_REPOSITORY).toBe('file');
    });

    it('`next start` local que pide supabase falla sin la confirmación', () => {
      const pedido = {
        NODE_ENV: 'production',
        IP_HASH_SALT: SALT,
        ...real,
        LEAD_REPOSITORY: 'supabase',
      };
      expect(() => loadEnv(pedido)).toThrow(/ALLOW_SUPABASE_IN_DEV=1/);
      expect(loadEnv({ ...pedido, ALLOW_SUPABASE_IN_DEV: '1' }).LEAD_REPOSITORY).toBe('supabase');
    });
  });

  it('en Vercel usa supabase por defecto si hay credenciales', () => {
    const env = loadEnv({
      NODE_ENV: 'production',
      VERCEL: '1',
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
