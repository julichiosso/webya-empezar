import { getRubro, RUBRO_OTRO_ID } from '@/config/rubros';
import type { DatosForm } from '@/lib/validation/lead';

export const TOTAL_PASOS = 4;
export type Paso = 1 | 2 | 3 | 4;
export const STORAGE_KEY = 'webya:empezar:v1';

export interface WizardState {
  paso: Paso;
  /** 1 = avanzó, -1 = volvió. Solo orienta la animación; no se guarda. */
  direccion: 1 | -1;
  rubro: string | null;
  rubroOtro: string;
  objetivos: string[];
  datos: DatosForm;
  enviado: boolean;
  /** Ya se leyó sessionStorage. Hasta entonces no se persiste nada (evita pisar lo guardado). No se guarda. */
  hidratado: boolean;
  /** La persona ya navegó el flujo: recién ahí se mueve el foco al cambiar de paso. No se guarda. */
  interactuo: boolean;
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
  rubro: null,
  rubroOtro: '',
  objetivos: [],
  datos: DATOS_VACIOS,
  enviado: false,
  hidratado: false,
  interactuo: false,
};

export type Accion =
  | { tipo: 'hidratar'; estado: WizardState | null }
  | { tipo: 'elegirRubro'; id: string }
  | { tipo: 'rubroOtro'; texto: string }
  | { tipo: 'toggleObjetivo'; id: string }
  | { tipo: 'datos'; datos: Partial<DatosForm> }
  | { tipo: 'irA'; paso: Paso }
  | { tipo: 'enviado' }
  | { tipo: 'reiniciar' };

export function reducer(state: WizardState, accion: Accion): WizardState {
  switch (accion.tipo) {
    case 'hidratar':
      return { ...(accion.estado ?? state), hidratado: true };
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
      return {
        ...state,
        objetivos: state.objetivos.includes(accion.id)
          ? state.objetivos.filter((o) => o !== accion.id)
          : [...state.objetivos, accion.id],
      };
    case 'datos':
      return { ...state, datos: { ...state.datos, ...accion.datos } };
    case 'irA':
      return {
        ...state,
        paso: accion.paso,
        direccion: accion.paso >= state.paso ? 1 : -1,
        interactuo: true,
      };
    case 'enviado':
      return { ...state, enviado: true };
    case 'reiniciar':
      return { ...ESTADO_INICIAL, direccion: -1, hidratado: true, interactuo: true };
  }
}

/** Mensaje amable si todavía no se puede avanzar desde ese paso; null si se puede. */
export function errorParaAvanzar(state: WizardState, desde: 1 | 2): string | null {
  if (desde === 1) {
    if (!state.rubro) return 'Elegí el rubro que más se parezca a tu negocio.';
    if (state.rubro === RUBRO_OTRO_ID && state.rubroOtro.trim().length < 2) {
      return 'Contanos a qué se dedica tu negocio.';
    }
    return null;
  }
  return state.objetivos.length === 0 ? 'Elegí al menos una cosa que quieras lograr.' : null;
}

/** Nombre del rubro para mostrar y para el mensaje de WhatsApp (si es "Otro", lo que escribió). */
export function nombreRubroVisible(state: Pick<WizardState, 'rubro' | 'rubroOtro'>): string {
  if (state.rubro === RUBRO_OTRO_ID) return state.rubroOtro.trim() || 'Otro';
  return getRubro(state.rubro)?.nombre ?? '';
}

// --- Persistencia (sessionStorage) -------------------------------------------------------------

type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

export function guardarEstado(state: WizardState, storage: StorageLike): void {
  try {
    const persistible = {
      paso: state.paso,
      rubro: state.rubro,
      rubroOtro: state.rubroOtro,
      objetivos: state.objetivos,
      datos: state.datos,
      enviado: state.enviado,
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
    const datos = (d.datos ?? {}) as Record<string, unknown>;
    const enviado = d.enviado === true && rubro !== null;
    let paso = [1, 2, 3, 4].includes(d.paso as number) ? (d.paso as Paso) : 1;
    if (!rubro) paso = 1;
    else if (paso > 2 && objetivos.length === 0) paso = 2;
    if (enviado) paso = 4;
    else if (paso === 4) paso = 3;
    return {
      paso,
      direccion: 1,
      rubro,
      rubroOtro: str(d.rubroOtro, 80),
      objetivos,
      datos: {
        nombreNegocio: str(datos.nombreNegocio, 100),
        nombre: str(datos.nombre, 80),
        whatsapp: str(datos.whatsapp, 30),
        email: str(datos.email, 254),
        mensaje: str(datos.mensaje, 1000),
      },
      enviado,
      hidratado: false,
      interactuo: false,
    };
  } catch {
    return null;
  }
}
