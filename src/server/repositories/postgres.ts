import { neon } from '@neondatabase/serverless';
import { ESQUEMA_POSTGRES } from './postgres-esquema';
import {
  ESTADO_INICIAL_LEAD,
  ESTADO_PARCIAL,
  esMismoNegocio,
  soloConValor,
  TTL_TOKEN_MS,
  type CambiosParcial,
  type DatosCompletar,
  type LeadRepository,
  type NuevoLead,
  type NuevoLeadParcial,
  type ResultadoCompletar,
} from './types';

/** Una consulta con parámetros ($1, $2…) que devuelve filas. En los tests se reemplaza por un doble. */
export type Consulta = (
  texto: string,
  params?: readonly unknown[],
) => Promise<Record<string, unknown>[]>;

/** Las columnas que el servidor puede escribir. Nada que llegue de afuera arma SQL. */
const COLUMNAS = new Set([
  'nombre',
  'email',
  'whatsapp',
  'nombre_negocio',
  'rubro',
  'rubro_otro',
  'ciudad',
  'modulos',
  'objetivos',
  'necesidades',
  'necesidad_libre',
  'mensaje',
  'origen',
  'demo',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'estado',
  'ip_hash',
  'user_agent',
  'token_hash',
]);

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** jsonb: el objeto va como texto JSON; el resto (texto, arrays de texto, null) tal cual. */
function valor(columna: string, v: unknown): unknown {
  return columna === 'demo' && v !== null && v !== undefined ? JSON.stringify(v) : v;
}

function columnasDe(fila: Record<string, unknown>) {
  return Object.entries(fila).filter(([c, v]) => COLUMNAS.has(c) && v !== undefined);
}

export function consultaNeon(url: string): Consulta {
  const sql = neon(url);
  return (texto, params) => sql.query(texto, params ? [...params] : []);
}

/**
 * Repositorio sobre Postgres (Neon, creado desde Vercel → Storage). La URL de la base vive solo en el
 * servidor. Las tablas se crean solas antes de la primera consulta de cada instancia.
 */
export class PostgresLeadRepository implements LeadRepository {
  private esquema: Promise<void> | undefined;

  constructor(private readonly consulta: Consulta) {}

  /** Corre el esquema una vez. Si falla, la próxima consulta lo reintenta (y la consulta igual sigue). */
  private preparar(): Promise<void> {
    this.esquema ??= (async () => {
      for (const sentencia of ESQUEMA_POSTGRES) await this.consulta(sentencia);
    })().catch((e: unknown) => {
      this.esquema = undefined;
      console.error(
        '[leads] no se pudo preparar la base',
        e instanceof Error ? e.message : 'error',
      );
    });
    return this.esquema;
  }

  private async q(texto: string, params?: readonly unknown[]) {
    await this.preparar();
    return this.consulta(texto, params);
  }

  private async insertar(fila: Record<string, unknown>): Promise<{ id: string }> {
    const cols = columnasDe(fila);
    const texto =
      `insert into leads (${cols.map(([c]) => c).join(', ')}) ` +
      `values (${cols.map((_, i) => `$${i + 1}`).join(', ')}) returning id`;
    const filas = await this.q(
      texto,
      cols.map(([c, v]) => valor(c, v)),
    );
    return { id: String(filas[0]?.id) };
  }

  crear(lead: NuevoLead): Promise<{ id: string }> {
    return this.insertar({ ...lead, estado: ESTADO_INICIAL_LEAD });
  }

  crearParcial(lead: NuevoLeadParcial): Promise<{ id: string }> {
    return this.insertar({ ...lead, estado: ESTADO_PARCIAL });
  }

  async completar(
    id: string,
    tokenHash: string,
    datos: DatosCompletar,
    ahora: Date,
  ): Promise<ResultadoCompletar> {
    if (!UUID.test(id)) return 'no_encontrado';
    // Un solo UPDATE condicionado, igual que en Supabase: un token sirve una vez y vence.
    const filas = await this.q(
      `update leads
         set nombre_negocio = $1, nombre = $2, email = $3, mensaje = $4,
             estado = $5, completado_at = $6, token_hash = null
       where id = $7 and token_hash = $8 and estado = $9 and created_at >= $10 and rubro is not null
       returning id`,
      [
        datos.nombre_negocio,
        datos.nombre,
        datos.email,
        datos.mensaje,
        ESTADO_INICIAL_LEAD,
        ahora.toISOString(),
        id,
        tokenHash,
        ESTADO_PARCIAL,
        new Date(ahora.getTime() - TTL_TOKEN_MS).toISOString(),
      ],
    );
    return filas.length > 0 ? 'ok' : 'no_encontrado';
  }

  async renovarParcial(
    whatsapp: string,
    ipHash: string,
    desde: Date,
    cambios: CambiosParcial,
  ): Promise<{ id: string } | null> {
    const filas = await this.q(
      `select id, nombre_negocio from leads
       where whatsapp = $1 and ip_hash = $2 and estado = $3 and created_at >= $4
       order by created_at desc limit 1`,
      [whatsapp, ipHash, ESTADO_PARCIAL, desde.toISOString()],
    );
    const previo = filas[0] as { id: string; nombre_negocio: string | null } | undefined;
    if (!previo || !esMismoNegocio(previo.nombre_negocio, cambios.nombre_negocio)) return null;

    const cols = columnasDe(soloConValor(cambios) as Record<string, unknown>);
    if (cols.length === 0) return { id: previo.id };
    const asignar = cols.map(([c], i) => `${c} = $${i + 1}`).join(', ');
    const n = cols.length;
    const actualizadas = await this.q(
      `update leads set ${asignar} where id = $${n + 1} and estado = $${n + 2} returning id`,
      [...cols.map(([c, v]) => valor(c, v)), previo.id, ESTADO_PARCIAL],
    );
    return actualizadas.length > 0 ? { id: previo.id } : null;
  }

  async contarRecientesPorIp(ipHash: string, desde: Date): Promise<number> {
    const filas = await this.q(
      'select count(*)::int as n from leads where ip_hash = $1 and created_at >= $2',
      [ipHash, desde.toISOString()],
    );
    return Number(filas[0]?.n ?? 0);
  }

  /** Para el embudo (/api/eventos): misma base, misma preparación. */
  async guardarEvento(e: {
    nombre: string;
    sesion: string;
    ruta: string;
    props: Record<string, unknown>;
  }): Promise<void> {
    await this.q('insert into eventos (nombre, sesion, ruta, props) values ($1, $2, $3, $4)', [
      e.nombre,
      e.sesion,
      e.ruta,
      JSON.stringify(e.props),
    ]);
  }
}
