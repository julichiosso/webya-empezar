import { createHash } from 'node:crypto';
import { z } from 'zod';

/**
 * Variables de entorno del SERVIDOR, validadas una sola vez al arrancar (ver src/instrumentation.ts).
 * Si falta algo crítico en producción el proceso no levanta: mejor eso que perder leads en silencio.
 * Las NEXT_PUBLIC_* viven en lib/site-config.ts.
 */

// Vercel/.env dejan "" cuando una variable está declarada sin valor: se trata como no definida.
const opcional = <T extends z.ZodType>(schema: T) =>
  z.preprocess((v) => (v === '' ? undefined : v), schema.optional());

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  LEAD_REPOSITORY: opcional(z.enum(['file', 'memory', 'supabase', 'postgres'])),
  // Neon creado desde Vercel → Storage: Vercel carga DATABASE_URL (y POSTGRES_URL) solo.
  DATABASE_URL: opcional(
    z.string().regex(/^postgres(ql)?:\/\//, 'DATABASE_URL debe ser postgres://…'),
  ),
  POSTGRES_URL: opcional(
    z.string().regex(/^postgres(ql)?:\/\//, 'POSTGRES_URL debe ser postgres://…'),
  ),
  LEADS_FILE_PATH: opcional(z.string().min(1)),
  SUPABASE_URL: opcional(z.url()),
  SUPABASE_SERVICE_ROLE_KEY: opcional(z.string().min(20)),
  IP_HASH_SALT: opcional(z.string().min(16, 'IP_HASH_SALT debe tener al menos 16 caracteres')),
  TELEGRAM_BOT_TOKEN: opcional(z.string().min(10)),
  TELEGRAM_CHAT_ID: opcional(z.string().min(1)),
  RESEND_API_KEY: opcional(z.string().min(10)),
  NOTIFY_TO_EMAIL: opcional(z.email()),
  NOTIFY_FROM_EMAIL: opcional(z.string().min(3)),
  RATE_LIMIT_MAX: z.coerce.number().int().min(1).max(100).default(5),
  RATE_LIMIT_BURST_PER_MINUTE: z.coerce.number().int().min(1).max(10_000).default(20),
  RATE_LIMIT_WINDOW_SECONDS: z.coerce.number().int().min(10).max(86_400).default(600),
});

export interface ServerEnv {
  NODE_ENV: 'development' | 'test' | 'production';
  /** 'memory' en Vercel = sin base: el contacto llega solo por el aviso (Telegram o mail). */
  LEAD_REPOSITORY: 'file' | 'memory' | 'supabase' | 'postgres';
  /** Postgres (Neon) para leads y eventos. */
  DATABASE_URL?: string;
  LEADS_FILE_PATH: string;
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  IP_HASH_SALT: string;
  RATE_LIMIT_MAX: number;
  /** Intentos (válidos o no) por minuto y por IP, en memoria por instancia. */
  RATE_LIMIT_BURST_PER_MINUTE: number;
  RATE_LIMIT_WINDOW_SECONDS: number;
  /** Avisos de leads (server/notifications.ts). Sin ninguno, solo queda la línea en el log. */
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
  RESEND_API_KEY?: string;
  NOTIFY_TO_EMAIL?: string;
  NOTIFY_FROM_EMAIL: string;
}

export class EnvError extends Error {
  constructor(public readonly problemas: string[]) {
    super(`Configuración inválida:\n - ${problemas.join('\n - ')}`);
    this.name = 'EnvError';
  }
}

/** Sal de desarrollo: NUNCA se usa en producción (ahí IP_HASH_SALT es obligatoria). */
const DEV_SALT = 'webya-dev-salt-no-usar-en-produccion';

export function loadEnv(source: Record<string, string | undefined> = process.env): ServerEnv {
  const parsed = envSchema.safeParse(source);
  if (!parsed.success) {
    throw new EnvError(parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`));
  }
  const e = parsed.data;
  const problemas: string[] = [];
  const produccion = e.NODE_ENV === 'production';
  const desplegado = Boolean(source.VERCEL); // corriendo en Vercel, no en `next start` local

  const tieneSupabase = Boolean(e.SUPABASE_URL && e.SUPABASE_SERVICE_ROLE_KEY);
  const databaseUrl = e.DATABASE_URL ?? e.POSTGRES_URL;
  const conAvisos = Boolean(
    (e.TELEGRAM_BOT_TOKEN && e.TELEGRAM_CHAT_ID) || (e.RESEND_API_KEY && e.NOTIFY_TO_EMAIL),
  );
  // Fuera de Vercel (pnpm dev, tests, `next start` local) nunca se elige Supabase por defecto aunque
  // haya credenciales en el .env: probar el formulario no tiene que escribir en la base real por
  // accidente. Pasó con un `next start` local para medir: los E2E mandaron leads a la base real.
  // En Vercel sin base, 'memory': el contacto no se guarda, pero el aviso lo lleva completo.
  const porDefectoDesplegado = tieneSupabase ? 'supabase' : databaseUrl ? 'postgres' : 'memory';
  const repositorio =
    e.LEAD_REPOSITORY ?? (desplegado ? porDefectoDesplegado : produccion ? 'file' : 'memory');

  if (repositorio === 'supabase' && !tieneSupabase) {
    problemas.push('LEAD_REPOSITORY=supabase requiere SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY');
  }
  if (repositorio === 'supabase' && !desplegado && source.ALLOW_SUPABASE_IN_DEV !== '1') {
    problemas.push(
      `LEAD_REPOSITORY=supabase fuera de Vercel (${e.NODE_ENV}) escribiría en la base real: ` +
        'sacalo del .env o confirmalo con ALLOW_SUPABASE_IN_DEV=1',
    );
  }
  if (repositorio === 'postgres' && !databaseUrl) {
    problemas.push('LEAD_REPOSITORY=postgres requiere DATABASE_URL (o POSTGRES_URL)');
  }
  if (
    repositorio === 'postgres' &&
    !desplegado &&
    source.ALLOW_SUPABASE_IN_DEV !== '1' &&
    source.ALLOW_DB_IN_DEV !== '1'
  ) {
    problemas.push(
      `LEAD_REPOSITORY=postgres fuera de Vercel (${e.NODE_ENV}) escribiría en la base real: ` +
        'confirmalo con ALLOW_DB_IN_DEV=1',
    );
  }
  // Sin IP_HASH_SALT se deriva una sal de un secreto que ya existe en el servidor: una variable menos.
  const secretoBase =
    databaseUrl ?? e.SUPABASE_SERVICE_ROLE_KEY ?? e.TELEGRAM_BOT_TOKEN ?? e.RESEND_API_KEY;
  const sal =
    e.IP_HASH_SALT ??
    (secretoBase
      ? createHash('sha256').update(`webya:ip:${secretoBase}`).digest('hex')
      : undefined);
  if (produccion && !sal) {
    problemas.push('IP_HASH_SALT es obligatoria en producción (para hashear la IP)');
  }
  if (desplegado && repositorio === 'file') {
    problemas.push('LEAD_REPOSITORY=file no persiste en Vercel (el disco es efímero)');
  }
  if (desplegado && repositorio === 'memory' && !conAvisos) {
    problemas.push(
      'Sin base ni avisos los contactos se perderían: conectá Neon (Vercel → Storage) o ' +
        'configurá TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID',
    );
  }
  if (problemas.length > 0) throw new EnvError(problemas);

  if (desplegado && !conAvisos) {
    console.warn(
      '[leads] Sin canal de avisos: los leads se guardan pero nadie se entera. ' +
        'Configurá TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID o RESEND_API_KEY + NOTIFY_TO_EMAIL.',
    );
  }

  return {
    NODE_ENV: e.NODE_ENV,
    LEAD_REPOSITORY: repositorio,
    LEADS_FILE_PATH: e.LEADS_FILE_PATH ?? '.data/leads.json',
    DATABASE_URL: databaseUrl,
    SUPABASE_URL: e.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: e.SUPABASE_SERVICE_ROLE_KEY,
    IP_HASH_SALT: sal ?? DEV_SALT,
    RATE_LIMIT_MAX: e.RATE_LIMIT_MAX,
    RATE_LIMIT_BURST_PER_MINUTE: e.RATE_LIMIT_BURST_PER_MINUTE,
    RATE_LIMIT_WINDOW_SECONDS: e.RATE_LIMIT_WINDOW_SECONDS,
    TELEGRAM_BOT_TOKEN: e.TELEGRAM_BOT_TOKEN,
    TELEGRAM_CHAT_ID: e.TELEGRAM_CHAT_ID,
    RESEND_API_KEY: e.RESEND_API_KEY,
    NOTIFY_TO_EMAIL: e.NOTIFY_TO_EMAIL,
    NOTIFY_FROM_EMAIL: e.NOTIFY_FROM_EMAIL ?? 'WebYa <onboarding@resend.dev>',
  };
}

let cache: ServerEnv | undefined;

export function getEnv(): ServerEnv {
  cache ??= loadEnv();
  return cache;
}
