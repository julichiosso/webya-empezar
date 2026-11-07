/**
 * Fila de la tabla `leads` (ver supabase/migrations). Es el contrato común de todas las
 * implementaciones de LeadRepository.
 *
 * TODO(multi-tenant): cuando WebYa sea plataforma, agregar `tenant_id uuid` acá, en la
 * migración y filtrar por tenant en cada consulta del repositorio.
 */
export interface LeadRow {
  id: string;
  created_at: string;
  /** Null solo en un lead parcial, o si al completarlo no dejó su nombre (es opcional). */
  nombre: string | null;
  email: string | null;
  /** E.164 normalizado, p. ej. +5491123456789. */
  whatsapp: string;
  /** Null solo mientras el lead es parcial. */
  nombre_negocio: string | null;
  /** Null solo mientras el lead es parcial. */
  rubro: string | null;
  rubro_otro: string | null;
  /** Ciudad o localidad, opcional (migración leads_ciudad). */
  ciudad?: string | null;
  /** Ids de módulos activados (content/modulos.ts). Mínimo 1 en el flujo de un solo envío. */
  modulos: string[];
  /** Opcionales: pueden venir vacíos. */
  objetivos: string[];
  /** Ids del paso "¿Qué necesitás?" (config/necesidades.ts). */
  necesidades: string[];
  /** Pedido libre "a medida" (saneado, 3 a 500 caracteres) o null. */
  necesidad_libre: string | null;
  mensaje: string | null;
  origen: string;
  /** Lo que armó en una demo ({ paleta, cocina }), si vino de ahí. */
  demo?: { paleta: string; cocina: string } | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  estado: string;
  ip_hash: string;
  user_agent: string | null;
  /** sha256 (hex) del token para completar un lead parcial. Se borra al completarlo. */
  token_hash: string | null;
  completado_at: string | null;
}

/** Columnas que agregó la migración leads_parcial_necesidades. */
type ColumnasParcial = 'necesidades' | 'necesidad_libre' | 'token_hash' | 'completado_at';

/**
 * Lo que aporta el servidor al crear un lead completo (flujo de un solo envío); id, fecha, estado
 * y origen los define el repositorio. No incluye las columnas del lead parcial: así sigue
 * funcionando aunque la migración nueva todavía no se haya aplicado.
 */
export type NuevoLead = Omit<
  LeadRow,
  | 'id'
  | 'created_at'
  | 'estado'
  | 'origen'
  | 'nombre'
  | 'nombre_negocio'
  | 'rubro'
  | ColumnasParcial
> & {
  nombre: string;
  nombre_negocio: string;
  rubro: string;
  origen?: string;
};

/** Lead parcial: solo el WhatsApp es obligatorio. El estado ('parcial') lo pone el repositorio. */
export type NuevoLeadParcial = Pick<
  LeadRow,
  | 'whatsapp'
  | 'nombre_negocio'
  | 'necesidades'
  | 'necesidad_libre'
  | 'rubro'
  | 'rubro_otro'
  | 'modulos'
  | 'objetivos'
  | 'demo'
  | 'utm_source'
  | 'utm_medium'
  | 'utm_campaign'
  | 'ip_hash'
  | 'user_agent'
> & {
  origen?: string;
  /** Solo si la dejó (columna opcional: sin la migración se guarda sin ella). */
  ciudad?: string | null;
  /** sha256 (hex) del token que se le devuelve a la persona. El token en claro nunca se guarda. */
  token_hash: string;
};

/** Lo que agrega la persona al completar un lead parcial. */
export interface DatosCompletar {
  nombre_negocio: string;
  nombre: string | null;
  email: string | null;
  mensaje: string | null;
}

export type ResultadoCompletar = 'ok' | 'no_encontrado';

/**
 * Lo que trae un reenvío del mismo lead parcial. Lo que llega vacío no pisa lo que ya estaba. Sin IP
 * ni navegador: el lead sigue siendo el del primer envío.
 */
export type CambiosParcial = Omit<NuevoLeadParcial, 'ip_hash' | 'user_agent'>;

/** Ventana en la que un nuevo envío del mismo WhatsApp actualiza el lead parcial en vez de duplicarlo. */
export const VENTANA_REENVIO_MS = 30 * 60 * 1000;

/** ¿Es el mismo negocio? Un nombre que falta de un lado no alcanza para decir que es otro. */
export function esMismoNegocio(a: string | null | undefined, b: string | null | undefined): boolean {
  if (!a || !b) return true;
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

/** Sin lo vacío: un reenvío no borra lo que la persona ya había dejado. */
export function soloConValor<T extends object>(cambios: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(cambios).filter(
      ([, v]) => v !== null && v !== undefined && !(Array.isArray(v) && v.length === 0),
    ),
  ) as Partial<T>;
}

/** Busca en memoria el lead parcial que un reenvío tiene que actualizar (memoria y archivo). */
export function indiceParcialReciente(
  filas: readonly LeadRow[],
  whatsapp: string,
  ipHash: string,
  desde: Date,
  negocio: string | null | undefined,
): number {
  return filas.findLastIndex(
    (l) =>
      l.whatsapp === whatsapp &&
      l.ip_hash === ipHash &&
      l.estado === ESTADO_PARCIAL &&
      new Date(l.created_at).getTime() >= desde.getTime() &&
      esMismoNegocio(l.nombre_negocio, negocio),
  );
}

export interface LeadRepository {
  crear(lead: NuevoLead): Promise<{ id: string }>;
  /** Guarda un lead con estado 'parcial' (solo WhatsApp y lo que haya elegido antes). */
  crearParcial(lead: NuevoLeadParcial): Promise<{ id: string }>;
  /**
   * Completa un lead parcial y lo pasa a 'nuevo'. Solo si sigue parcial, el hash del token
   * coincide, tiene menos de TTL_TOKEN_MS y ya tiene rubro (lo exige la base). Si no, 'no_encontrado'
   * (sin distinguir el motivo). Borra el token_hash: un token sirve una sola vez.
   */
  completar(
    id: string,
    tokenHash: string,
    datos: DatosCompletar,
    ahora: Date,
  ): Promise<ResultadoCompletar>;
  /**
   * Reenvío (doble toque, respuesta perdida, volvió atrás y cambió algo): si ese WhatsApp ya dejó un
   * lead parcial del mismo negocio desde `desde` y desde la misma IP, lo actualiza con el token nuevo
   * y devuelve su id. Si no hay ninguno, null y corresponde crear uno. La IP es parte de la condición:
   * conocer el número de alguien no alcanza para pisar su lead ni para invalidarle el token.
   */
  renovarParcial(
    whatsapp: string,
    ipHash: string,
    desde: Date,
    cambios: CambiosParcial,
  ): Promise<{ id: string } | null>;
  /** Cuántos leads guardó esa IP (hasheada) desde la fecha dada. Alimenta el rate limit. */
  contarRecientesPorIp(ipHash: string, desde: Date): Promise<number>;
}

export const ESTADO_INICIAL_LEAD = 'nuevo';
export const ESTADO_PARCIAL = 'parcial';
export const ORIGEN_POR_DEFECTO = 'instagram';

/** Cuánto dura el token para completar un lead parcial. */
export const TTL_TOKEN_MS = 6 * 60 * 60 * 1000;

/** Completa los campos que define el repositorio (comunes a memoria y archivo). */
export function aFila(lead: NuevoLead, id: string, ahora: Date): LeadRow {
  return {
    ...lead,
    necesidades: [],
    necesidad_libre: null,
    token_hash: null,
    completado_at: null,
    id,
    created_at: ahora.toISOString(),
    origen: lead.origen ?? ORIGEN_POR_DEFECTO,
    estado: ESTADO_INICIAL_LEAD,
  };
}

/** Igual que aFila, para un lead parcial. */
export function aFilaParcial(lead: NuevoLeadParcial, id: string, ahora: Date): LeadRow {
  return {
    ...lead,
    nombre: null,
    email: null,
    mensaje: null,
    completado_at: null,
    id,
    created_at: ahora.toISOString(),
    origen: lead.origen ?? ORIGEN_POR_DEFECTO,
    estado: ESTADO_PARCIAL,
  };
}

/**
 * Aplica la completitud sobre una fila en memoria (memoria y archivo). Devuelve la fila completa o
 * null si no corresponde. Son las mismas condiciones que el UPDATE de Supabase.
 */
export function completarFila(
  fila: LeadRow,
  tokenHash: string,
  datos: DatosCompletar,
  ahora: Date,
): LeadRow | null {
  const vigente = new Date(fila.created_at).getTime() >= ahora.getTime() - TTL_TOKEN_MS;
  if (
    fila.estado !== ESTADO_PARCIAL ||
    fila.token_hash === null ||
    fila.token_hash !== tokenHash ||
    !vigente ||
    fila.rubro === null
  ) {
    return null;
  }
  return {
    ...fila,
    ...datos,
    estado: ESTADO_INICIAL_LEAD,
    completado_at: ahora.toISOString(),
    token_hash: null,
  };
}
