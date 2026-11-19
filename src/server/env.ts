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
  LEAD_REPOSITORY: opcional(z.enum(['file', 'memory', 'supabase'])),
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
  LEAD_REPOSITORY: 'file' | 'memory' | 'supabase';
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
  // Fuera de Vercel (pnpm dev, tests, `next start` local) nunca se elige Supabase por defecto aunque
  // haya credenciales en el .env: probar el formulario no tiene que escribir en la base real por
  // accidente. Pasó con un `next start` local para medir: los E2E mandaron leads a la base real.
  const repositorio =
    e.LEAD_REPOSITORY ??
    (desplegado && tieneSupabase ? 'supabase' : produccion ? 'file' : 'memory');

  if (repositorio === 'supabase' && !tieneSupabase) {
    problemas.push('LEAD_REPOSITORY=supabase requiere SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY');
  }
  if (repositorio === 'supabase' && !desplegado && source.ALLOW_SUPABASE_IN_DEV !== '1') {
    problemas.push(
      `LEAD_REPOSITORY=supabase fuera de Vercel (${e.NODE_ENV}) escribiría en la base real: ` +
        'sacalo del .env o confirmalo con ALLOW_SUPABASE_IN_DEV=1',
    );
  }
  if (produccion && !e.IP_HASH_SALT) {
    problemas.push('IP_HASH_SALT es obligatoria en producción (para hashear la IP)');
  }
  if (desplegado && repositorio !== 'supabase') {
    problemas.push(
      `LEAD_REPOSITORY=${repositorio} no persiste en Vercel (el disco es efímero): usá supabase`,
    );
  }
  if (problemas.length > 0) throw new EnvError(problemas);

  const conAvisos =
    (e.TELEGRAM_BOT_TOKEN && e.TELEGRAM_CHAT_ID) || (e.RESEND_API_KEY && e.NOTIFY_TO_EMAIL);
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
    SUPABASE_URL: e.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: e.SUPABASE_SERVICE_ROLE_KEY,
    IP_HASH_SALT: e.IP_HASH_SALT ?? DEV_SALT,
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
