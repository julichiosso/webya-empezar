import { z } from 'zod';
import { NOMBRES_EVENTO } from '@/lib/analytics';
import { sanitizeLine } from '@/lib/sanitize';
import { getClientIp, hashIp } from '../ip';
import type { BurstLimiter } from '../rate-limit';

/** Un evento del embudo tal como se guarda. Sin datos personales: ni IP, ni teléfono, ni nombres. */
export interface FilaEvento {
  nombre: string;
  /** Azar por pestaña (sessionStorage): junta los pasos de una visita, no identifica a nadie. */
  sesion: string;
  ruta: string;
  props: Record<string, string | number | boolean>;
}

export interface EventoRepository {
  guardar(evento: FilaEvento): Promise<void>;
}

export interface EventosDeps {
  repo: EventoRepository;
  burst: BurstLimiter;
  salt: string;
}

/** Sobra para un evento: el embudo no manda texto libre. */
const MAX_BODY_BYTES = 2048;

const eventoSchema = z.object({
  nombre: z.enum(NOMBRES_EVENTO),
  sesion: z.string().regex(/^[a-z0-9]{8,32}$/),
  // Solo la ruta: nunca el query ni el hash (el borrador de /ver viaja en el hash).
  ruta: z
    .string()
    .max(80)
    .regex(/^\/[a-z0-9/_-]*$/i),
  props: z
    .record(
      z.string().max(32),
      z.union([z.string().max(80), z.number().finite(), z.boolean()]),
    )
    .refine((p) => Object.keys(p).length <= 8)
    .default({}),
});

const SIN_CONTENIDO = () => new Response(null, { status: 204 });

/**
 * POST /api/eventos: la medición del embudo, en nuestro propio dominio (sin scripts de terceros ni
 * cookies). Nunca le rompe nada a la persona: si la base falla o falta la tabla, responde 204 igual y
 * el motivo queda en el log.
 */
export async function handleEvento(request: Request, deps: EventosDeps): Promise<Response> {
  const tipo = request.headers.get('content-type')?.split(';')[0]?.trim().toLowerCase();
  if (tipo !== 'application/json') return new Response(null, { status: 415 });
  if (request.headers.get('sec-fetch-site') === 'cross-site') {
    return new Response(null, { status: 403 });
  }
  if (deps.burst.excede(hashIp(getClientIp(request.headers), deps.salt))) {
    return new Response(null, { status: 429, headers: { 'Retry-After': '60' } });
  }

  const texto = await request.text();
  if (new TextEncoder().encode(texto).length > MAX_BODY_BYTES) {
    return new Response(null, { status: 413 });
  }
  let crudo: unknown;
  try {
    crudo = JSON.parse(texto);
  } catch {
    return new Response(null, { status: 400 });
  }
  const validado = eventoSchema.safeParse(crudo);
  if (!validado.success) return new Response(null, { status: 400 });

  const d = validado.data;
  const props = Object.fromEntries(
    Object.entries(d.props).map(([k, v]) => [k, typeof v === 'string' ? sanitizeLine(v) : v]),
  );
  try {
    await deps.repo.guardar({ nombre: d.nombre, sesion: d.sesion, ruta: d.ruta, props });
  } catch (e) {
    console.error('[eventos] no se pudo guardar', e instanceof Error ? e.message : 'error');
  }
  return SIN_CONTENIDO();
}
