import { PALETAS_DEMO } from '@/content/demos/gastronomia/paletas';
import { COCINA_IDS } from '@/content/demos/gastronomia/types';
import { esOrigen, type Origen } from '@/config/origenes';
import { WIZARD } from '@/content/empezar/wizard';
import type { DatosForm } from '@/content/leads';
import { getModulo, type ModuloId } from '@/content/modulos';
import { getRubro, RUBRO_OTRO_ID } from '@/content/rubros';
// Sin zod: el estado es lo primero que se descarga al tocar un rubro (zod viene con los formularios).
import { LIMITES_BASE as LIMITES, TOKEN_LEAD_REGEX } from '@/domain/leads/limites';
import { alternarModulo, modulosSeleccionados, sanearManual, type ModulosManual } from './modulos';

/** Lo que la persona armó en una demo (paleta y tipo de cocina), si vino de ahí. */
export interface DesdeDemo {
  paleta: string;
  cocina: string;
}

/**
 * Pantallas del flujo "tu negocio, armado en 60 segundos":
 * rubro → (solo "Otro": aMedida, el pedido libre) → negocio (nombre, WhatsApp y ciudad: guarda el
 * lead parcial) → resultado ("Así te queda", o "Lo armamos a medida") → completar (opcional) → listo.
 *
 * Quien viene de una demo ya eligió rubro y nombre del local: entra en `negocio`, con el nombre
 * cargado.
 */
export const PASOS = ['rubro', 'aMedida', 'negocio', 'resultado', 'completar', 'listo'] as const;
export type Paso = (typeof PASOS)[number];
export const STORAGE_KEY = 'webya:empezar:v3';

/** El lead parcial ya guardado: con el token se completa después (PATCH /api/leads/[id]). */
export interface LeadGuardado {
  id: string;
  token: string;
}

/** Datos que se piden: los de la pantalla 2 (negocio, WhatsApp, ciudad) y los de completar. */
export interface DatosFlujo extends DatosForm {
  ciudad: string;
}

export interface WizardState {
  paso: Paso;
  /** 1 = avanzó, -1 = volvió. Solo orienta la animación; no se guarda. */
  direccion: 1 | -1;
  rubro: string | null;
  /** Pedido libre de "Otro / a medida" (hasta 500 caracteres). */
  necesidadLibre: string;
  /** Decisiones a mano sobre los módulos del rubro (en la vista previa). */
  modulosManual: ModulosManual;
  datos: DatosFlujo;
  lead: LeadGuardado | null;
  /** Mandó los datos de "completar" (la pantalla final lo agradece). */
  completo: boolean;
  /** Ya se leyó sessionStorage. Hasta entonces no se persiste nada (evita pisar lo guardado). No se guarda. */
  hidratado: boolean;
  /** La persona ya navegó el flujo: recién ahí se mueve el foco al cambiar de paso. No se guarda. */
  interactuo: boolean;
  /** De dónde viene (lista cerrada). null = el de siempre (Instagram). */
  origen: Origen | null;
  /** Personalización traída de la demo, si vino de ahí. */
  demo: DesdeDemo | null;
}

export const DATOS_VACIOS: DatosFlujo = {
  nombreNegocio: '',
  nombre: '',
  whatsapp: '',
  email: '',
  mensaje: '',
  ciudad: '',
};

export const ESTADO_INICIAL: WizardState = {
  paso: 'rubro',
  direccion: 1,
  rubro: null,
  necesidadLibre: '',
  modulosManual: {},
  datos: DATOS_VACIOS,
  lead: null,
  completo: false,
  hidratado: false,
  interactuo: false,
  origen: null,
  demo: null,
};

export type Accion =
  | { tipo: 'hidratar'; estado: WizardState | null }
  | { tipo: 'elegirRubro'; id: string }
  | { tipo: 'necesidadLibre'; texto: string }
  | { tipo: 'alternarModulo'; id: ModuloId }
  | { tipo: 'datos'; datos: Partial<DatosFlujo> }
  | { tipo: 'leadParcial'; lead: LeadGuardado }
  | { tipo: 'irA'; paso: Paso }
  | { tipo: 'completado' }
  | { tipo: 'reiniciar' };

const indice = (p: Paso) => PASOS.indexOf(p);

export function reducer(state: WizardState, accion: Accion): WizardState {
  switch (accion.tipo) {
    case 'hidratar':
      return { ...(accion.estado ?? state), hidratado: true };
    case 'elegirRubro':
      // Cambiar de rubro descarta lo decidido a mano sobre los módulos del anterior.
      return state.rubro === accion.id
        ? state
        : { ...state, rubro: accion.id, modulosManual: {} };
    case 'necesidadLibre':
      return { ...state, necesidadLibre: accion.texto };
    case 'alternarModulo':
      return {
        ...state,
        modulosManual: alternarModulo(state.rubro, state.modulosManual, accion.id),
      };
    case 'datos':
      return { ...state, datos: { ...state.datos, ...accion.datos } };
    case 'leadParcial':
      return { ...state, lead: accion.lead };
    case 'irA':
      return {
        ...state,
        paso: accion.paso,
        direccion: indice(accion.paso) >= indice(state.paso) ? 1 : -1,
        interactuo: true,
      };
    case 'completado':
      return { ...state, completo: true };
    case 'reiniciar':
      return { ...ESTADO_INICIAL, direccion: -1, hidratado: true, interactuo: true };
  }
}

/** Eligió "Otro": no hay vista previa, se arma a medida. */
export const esAMedida = (state: Pick<WizardState, 'rubro'>) => state.rubro === RUBRO_OTRO_ID;

/** Módulos activos: los del rubro (sin los "próximamente") más lo decidido a mano. */
export const modulosDe = (state: Pick<WizardState, 'rubro' | 'modulosManual'>): ModuloId[] =>
  esAMedida(state) ? [] : modulosSeleccionados(state.rubro, state.modulosManual);

/** Las 3 pantallas que se cuentan ("Paso 2 de 3"): el pedido a medida es parte de la primera. */
export const TOTAL_PANTALLAS = 3;

export function pantallaDe(paso: Paso): number {
  if (paso === 'rubro' || paso === 'aMedida') return 1;
  return paso === 'negocio' ? 2 : 3;
}

/** A qué pantalla se vuelve con "Atrás" (null = no hay atrás). */
export function pasoAnterior(state: Pick<WizardState, 'paso' | 'rubro'>): Paso | null {
  switch (state.paso) {
    case 'aMedida':
      return 'rubro';
    case 'negocio':
      return esAMedida(state) ? 'aMedida' : 'rubro';
    case 'completar':
      return 'resultado';
    // Con el lead ya guardado no se vuelve al formulario: se completa o se sigue por WhatsApp.
    default:
      return null;
  }
}

/** Mensaje amable si todavía no se puede dejar el pedido a medida; null si se puede. */
export function errorAMedida(texto: string): string | null {
  const libre = texto.trim();
  if (libre === '') return WIZARD.errores.necesidadLibreVacia;
  return libre.length < LIMITES.necesidadLibreMin ? WIZARD.errores.necesidadLibreCorta : null;
}

/** ¿Hay algo avanzado en el flujo guardado? */
export function hayProgresoGuardado(storage: StorageLike): boolean {
  const estado = leerEstadoGuardado(storage);
  return estado !== null && (estado.rubro !== null || estado.paso !== 'rubro');
}

/** Nombre del rubro para mostrar y para el mensaje de WhatsApp. */
export function nombreRubroVisible(state: Pick<WizardState, 'rubro'>): string {
  return getRubro(state.rubro)?.nombre ?? '';
}

/** Nombres de los módulos activos (para el mensaje de WhatsApp). */
export const nombresModulos = (ids: readonly ModuloId[]) => ids.map((id) => getModulo(id).nombre);

// --- Persistencia (sessionStorage) -------------------------------------------------------------

type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

export function guardarEstado(state: WizardState, storage: StorageLike): void {
  try {
    const persistible = {
      paso: state.paso,
      rubro: state.rubro,
      necesidadLibre: state.necesidadLibre,
      modulosManual: state.modulosManual,
      datos: state.datos,
      // El token vive en sessionStorage como el resto del flujo: se va al cerrar la pestaña y la
      // API lo acepta una sola vez y por 6 horas.
      lead: state.lead,
      completo: state.completo,
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
export function pasoCoherente(
  paso: unknown,
  e: Pick<WizardState, 'rubro' | 'necesidadLibre' | 'lead' | 'completo'>,
): Paso {
  const p: Paso = (PASOS as readonly unknown[]).includes(paso) ? (paso as Paso) : 'rubro';
  if (!e.rubro) return 'rubro';
  const aMedida = esAMedida(e);
  if (p === 'aMedida') return aMedida ? 'aMedida' : 'negocio';
  if (aMedida && p !== 'rubro' && errorAMedida(e.necesidadLibre)) return 'aMedida';
  if (p === 'resultado' || p === 'completar' || p === 'listo') {
    if (!e.lead) return 'negocio';
    if (p === 'listo' && !e.completo) return 'resultado';
  }
  return p;
}

/** Lee y SANEA lo guardado: nunca se confía en lo que haya en storage. */
export function leerEstadoGuardado(storage: StorageLike): WizardState | null {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const d = JSON.parse(raw) as Record<string, unknown>;
    if (!d || typeof d !== 'object') return null;
    const rubro = typeof d.rubro === 'string' && getRubro(d.rubro) ? d.rubro : null;
    const datos = (d.datos ?? {}) as Record<string, unknown>;
    const lead = sanearLead(d.lead);
    const necesidadLibre = str(d.necesidadLibre, LIMITES.necesidadLibre);
    const completo = d.completo === true && lead !== null;
    return {
      paso: pasoCoherente(d.paso, { rubro, necesidadLibre, lead, completo }),
      direccion: 1,
      rubro,
      necesidadLibre,
      modulosManual: sanearManual(d.modulosManual),
      datos: {
        nombreNegocio: str(datos.nombreNegocio, LIMITES.nombreNegocio),
        nombre: str(datos.nombre, LIMITES.nombre),
        whatsapp: str(datos.whatsapp, 30),
        email: str(datos.email, LIMITES.email),
        mensaje: str(datos.mensaje, LIMITES.mensaje),
        ciudad: str(datos.ciudad, LIMITES.ciudad),
      },
      lead,
      completo,
      hidratado: false,
      interactuo: false,
      origen: esOrigen(d.origen) ? d.origen : null,
      demo: sanearDemo(d.demo),
    };
  } catch {
    return null;
  }
}
