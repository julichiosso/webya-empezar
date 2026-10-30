import { PALETAS_DEMO } from '@/content/demos/gastronomia/paletas';
import { COCINA_IDS } from '@/content/demos/gastronomia/types';
import { esOrigen, type Origen } from '@/config/origenes';
import { WIZARD } from '@/content/empezar/wizard';
import type { DatosForm } from '@/content/leads';
import { MENSAJES_LEAD } from '@/content/leads-mensajes';
import { getNecesidad, NECESIDAD_OTRA_ID } from '@/content/necesidades';
import { getRubro, RUBRO_OTRO_ID } from '@/content/rubros';
// Sin zod: este módulo viaja en el JS inicial (el store de módulos del hero lo usa).
import { LIMITES_BASE as LIMITES, TOKEN_LEAD_REGEX } from '@/domain/leads/limites';

/** Lo que la persona armó en una demo (paleta y tipo de cocina), si vino de ahí. */
export interface DesdeDemo {
  paleta: string;
  cocina: string;
}

/**
 * Pasos del wizard (docs/plan-sprint.md §6):
 * 1 necesidad (con "Otra cosa") → 2 rubro → 3 módulos → 4 solo WhatsApp (guarda el lead parcial)
 * → 5 completar (solo el nombre del negocio es obligatorio) → 6 confirmación.
 *
 * Quien viene de una demo ya eligió rubro y nombre del local: entra en 3 (módulos) y el 4 es el
 * formulario completo de un solo envío (no hay 5).
 */
export type Paso = 1 | 2 | 3 | 4 | 5 | 6;
export const PASO_CONFIRMACION: Paso = 6;
export const STORAGE_KEY = 'webya:empezar:v2';

/** El lead parcial ya guardado: con el token se completa después (PATCH /api/leads/[id]). */
export interface LeadGuardado {
  id: string;
  token: string;
}

/** Cómo terminó: completo (mandó sus datos) o parcial (dejó solo el WhatsApp). */
export type Confirmacion = 'completo' | 'parcial';

export interface WizardState {
  paso: Paso;
  /** 1 = avanzó, -1 = volvió. Solo orienta la animación; no se guarda. */
  direccion: 1 | -1;
  necesidades: string[];
  /** Texto de "Otra cosa / a medida" (se manda solo si "Otra cosa" está marcada). */
  necesidadLibre: string;
  rubro: string | null;
  rubroOtro: string;
  objetivos: string[];
  datos: DatosForm;
  lead: LeadGuardado | null;
  confirmacion: Confirmacion | null;
  /** Ya se leyó sessionStorage. Hasta entonces no se persiste nada (evita pisar lo guardado). No se guarda. */
  hidratado: boolean;
  /** La persona ya navegó el flujo: recién ahí se mueve el foco al cambiar de paso. No se guarda. */
  interactuo: boolean;
  /** De dónde viene (lista cerrada). null = el de siempre (Instagram). */
  origen: Origen | null;
  /** Personalización traída de la demo, si vino de ahí. */
  demo: DesdeDemo | null;
}

export const DATOS_VACIOS: DatosForm = {
  nombreNegocio: '',
  nombre: '',
  whatsapp: '',
  email: '',
  mensaje: '',
};

export const ESTADO_INICIAL: WizardState = {
  paso: 1,
  direccion: 1,
  necesidades: [],
  necesidadLibre: '',
  rubro: null,
  rubroOtro: '',
  objetivos: [],
  datos: DATOS_VACIOS,
  lead: null,
  confirmacion: null,
  hidratado: false,
  interactuo: false,
  origen: null,
  demo: null,
};

export type Accion =
  | { tipo: 'hidratar'; estado: WizardState | null }
  | { tipo: 'toggleNecesidad'; id: string }
  | { tipo: 'necesidadLibre'; texto: string }
  | { tipo: 'elegirRubro'; id: string }
  | { tipo: 'rubroOtro'; texto: string }
  | { tipo: 'toggleObjetivo'; id: string }
  | { tipo: 'datos'; datos: Partial<DatosForm> }
  | { tipo: 'leadParcial'; lead: LeadGuardado; whatsapp: string }
  | { tipo: 'irA'; paso: Paso }
  | { tipo: 'confirmar'; como: Confirmacion }
  | { tipo: 'reiniciar' };

const alternar = (lista: string[], id: string) =>
  lista.includes(id) ? lista.filter((x) => x !== id) : [...lista, id];

export function reducer(state: WizardState, accion: Accion): WizardState {
  switch (accion.tipo) {
    case 'hidratar':
      return { ...(accion.estado ?? state), hidratado: true };
    case 'toggleNecesidad':
      return { ...state, necesidades: alternar(state.necesidades, accion.id) };
    case 'necesidadLibre':
      return { ...state, necesidadLibre: accion.texto };
    case 'elegirRubro': {
      if (state.rubro === accion.id) return state;
      // Al cambiar de rubro se conservan solo los objetivos que el nuevo rubro también ofrece.
      const validos = new Set(getRubro(accion.id)?.objetivos.map((o) => o.id));
      return {
        ...state,
        rubro: accion.id,
        objetivos: state.objetivos.filter((o) => validos.has(o)),
      };
    }
    case 'rubroOtro':
      return { ...state, rubroOtro: accion.texto };
    case 'toggleObjetivo':
      return { ...state, objetivos: alternar(state.objetivos, accion.id) };
    case 'datos':
      return { ...state, datos: { ...state.datos, ...accion.datos } };
    case 'leadParcial':
      return {
        ...state,
        lead: accion.lead,
        datos: { ...state.datos, whatsapp: accion.whatsapp },
      };
    case 'irA':
      return {
        ...state,
        paso: accion.paso,
        direccion: accion.paso >= state.paso ? 1 : -1,
        interactuo: true,
      };
    case 'confirmar':
      return { ...state, confirmacion: accion.como };
    case 'reiniciar':
      return { ...ESTADO_INICIAL, direccion: -1, hidratado: true, interactuo: true };
  }
}

/** Vino de una demo: flujo corto (módulos → formulario completo → confirmación). */
export const esFlujoDemo = (state: Pick<WizardState, 'origen'>) => state.origen !== null;

/** Paso y total que se muestran ("Paso 3 de 5"). La confirmación cuenta como el último. */
export function progreso(state: Pick<WizardState, 'paso' | 'origen'>): {
  paso: number;
  total: number;
} {
  const total = esFlujoDemo(state) ? 4 : 5;
  return { paso: Math.min(state.paso, total), total };
}

/** Marcó "Otra cosa": se manda el texto libre y la confirmación lo menciona. */
export const marcoOtraCosa = (state: Pick<WizardState, 'necesidades'>) =>
  state.necesidades.includes(NECESIDAD_OTRA_ID);

/**
 * Mensaje amable si todavía no se puede avanzar desde ese paso; null si se puede.
 * `cantidadModulos`: módulos activos (viven en modulos-store, no en este estado).
 */
export function errorParaAvanzar(
  state: WizardState,
  desde: 1 | 2 | 3,
  cantidadModulos: number,
): string | null {
  if (desde === 1) {
    if (state.necesidades.length === 0) return WIZARD.errores.sinNecesidad;
    if (marcoOtraCosa(state)) {
      const libre = state.necesidadLibre.trim();
      if (libre === '') return MENSAJES_LEAD.necesidadLibreVacia;
      if (libre.length < LIMITES.necesidadLibreMin) return MENSAJES_LEAD.necesidadLibreCorta;
    }
    return null;
  }
  if (desde === 2) {
    if (!state.rubro) return WIZARD.errores.sinRubro;
    if (state.rubro === RUBRO_OTRO_ID && state.rubroOtro.trim().length < 2) {
      return WIZARD.errores.sinRubroOtro;
    }
    return null;
  }
  // Los módulos son opcionales en el lead parcial; el envío completo (desde la demo) pide uno.
  return esFlujoDemo(state) && cantidadModulos === 0 ? WIZARD.errores.sinModulos : null;
}

/** ¿Hay algo avanzado en el wizard guardado? */
export function hayProgresoGuardado(storage: StorageLike): boolean {
  const estado = leerEstadoGuardado(storage);
  return (
    estado !== null && (estado.rubro !== null || estado.paso > 1 || estado.necesidades.length > 0)
  );
}

/** Nombre del rubro para mostrar y para el mensaje de WhatsApp (si es "Otro", lo que escribió). */
export function nombreRubroVisible(state: Pick<WizardState, 'rubro' | 'rubroOtro'>): string {
  if (state.rubro === RUBRO_OTRO_ID) return state.rubroOtro.trim() || WIZARD.rubroOtroSinTexto;
  return getRubro(state.rubro)?.nombre ?? '';
}

// --- Persistencia (sessionStorage) -------------------------------------------------------------

type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

export function guardarEstado(state: WizardState, storage: StorageLike): void {
  try {
    const persistible = {
      paso: state.paso,
      necesidades: state.necesidades,
      necesidadLibre: state.necesidadLibre,
      rubro: state.rubro,
      rubroOtro: state.rubroOtro,
      objetivos: state.objetivos,
      datos: state.datos,
      // El token vive en sessionStorage como el resto del flujo: se va al cerrar la pestaña y la
      // API lo acepta una sola vez y por 6 horas.
      lead: state.lead,
      confirmacion: state.confirmacion,
      origen: state.origen,
      demo: state.demo,
    };
    storage.setItem(STORAGE_KEY, JSON.stringify(persistible));
  } catch {
    // sessionStorage puede fallar (cuota, navegador in-app, modo privado): se sigue sin persistir
  }
}

export function borrarEstado(storage: StorageLike): void {
  try {
    storage.removeItem(STORAGE_KEY);
  } catch {
    // ver arriba
  }
}

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.slice(0, max) : '');

/** Solo paletas y cocinas que existen en la demo; cualquier otra cosa se descarta. */
export function sanearDemo(v: unknown): DesdeDemo | null {
  if (!v || typeof v !== 'object') return null;
  const { paleta, cocina } = v as Record<string, unknown>;
  const paletaOk = PALETAS_DEMO.some((p) => p.id === paleta);
  const cocinaOk = (COCINA_IDS as readonly unknown[]).includes(cocina);
  return paletaOk && cocinaOk ? { paleta: paleta as string, cocina: cocina as string } : null;
}

const ID_LEAD = /^[A-Za-z0-9-]{1,64}$/;

function sanearLead(v: unknown): LeadGuardado | null {
  if (!v || typeof v !== 'object') return null;
  const { id, token } = v as Record<string, unknown>;
  return typeof id === 'string' && ID_LEAD.test(id) && typeof token === 'string'
    ? TOKEN_LEAD_REGEX.test(token)
      ? { id, token }
      : null
    : null;
}

/** El paso guardado, corregido para que nunca quede en uno al que no se pudo haber llegado. */
function pasoCoherente(
  d: Record<string, unknown>,
  e: Pick<WizardState, 'necesidades' | 'rubro' | 'lead' | 'confirmacion' | 'origen'>,
): Paso {
  const demo = esFlujoDemo(e);
  let paso = [1, 2, 3, 4, 5, 6].includes(d.paso as number) ? (d.paso as Paso) : 1;
  if (e.confirmacion && e.rubro) return 6;
  if (paso === 6) paso = demo ? 4 : e.lead ? 5 : 4;
  if (demo && paso === 5) paso = 4;
  if (!demo && paso === 5 && !e.lead) paso = 4;
  if (paso >= 3 && !e.rubro) paso = 2;
  if (paso >= 2 && !demo && e.necesidades.length === 0) paso = 1;
  return paso;
}

/** Lee y SANEA lo guardado: nunca se confía en lo que haya en storage. */
export function leerEstadoGuardado(storage: StorageLike): WizardState | null {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const d = JSON.parse(raw) as Record<string, unknown>;
    const rubro = typeof d.rubro === 'string' && getRubro(d.rubro) ? d.rubro : null;
    const validos = new Set(getRubro(rubro)?.objetivos.map((o) => o.id));
    const objetivos = Array.isArray(d.objetivos)
      ? d.objetivos.filter((o): o is string => typeof o === 'string' && validos.has(o))
      : [];
    const necesidades = Array.isArray(d.necesidades)
      ? [...new Set(d.necesidades)].filter(
          (n): n is string => typeof n === 'string' && getNecesidad(n) !== undefined,
        )
      : [];
    const datos = (d.datos ?? {}) as Record<string, unknown>;
    const lead = sanearLead(d.lead);
    const confirmacion: Confirmacion | null =
      d.confirmacion === 'completo' || d.confirmacion === 'parcial' ? d.confirmacion : null;
    const origen = esOrigen(d.origen) ? d.origen : null;
    const base = { necesidades, rubro, lead, confirmacion: rubro ? confirmacion : null, origen };
    return {
      ...base,
      paso: pasoCoherente(d, base),
      direccion: 1,
      necesidadLibre: str(d.necesidadLibre, LIMITES.necesidadLibre),
      rubroOtro: str(d.rubroOtro, LIMITES.rubroOtro),
      objetivos,
      datos: {
        nombreNegocio: str(datos.nombreNegocio, LIMITES.nombreNegocio),
        nombre: str(datos.nombre, LIMITES.nombre),
        whatsapp: str(datos.whatsapp, 30),
        email: str(datos.email, LIMITES.email),
        mensaje: str(datos.mensaje, LIMITES.mensaje),
      },
      hidratado: false,
      interactuo: false,
      demo: sanearDemo(d.demo),
    };
  } catch {
    return null;
  }
}
