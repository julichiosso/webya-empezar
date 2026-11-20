import {
  ACTIVIDADES,
  ANIMALES,
  CAMPANA,
  SOCIOS,
  SOLICITUDES_INICIALES,
  type Animal,
  type Especie,
  type Socio,
  type Tamano,
  UI_PROTECTORA,
} from '@/content/demos/protectora';

export type EstadoSolicitud = 'recibida' | 'entrevista' | 'aprobada' | 'adoptado';

export interface Solicitud {
  id: string;
  animal: string;
  persona: string;
  estado: EstadoSolicitud;
}

export interface Carnet {
  nombre: string;
  cuota: string;
  numero: number;
}

export interface EstadoDemo {
  animales: Animal[];
  solicitudes: Solicitud[];
  socios: Socio[];
  recordados: string[];
  juntado: number;
  anotados: Record<string, number>;
  mias: string[];
  carnet: Carnet | null;
  /** Aviso al celular del equipo: la última solicitud que entró y todavía no se vio. */
  aviso: Solicitud | null;
  /** Para numerar sin azar (los tests y el servidor ven lo mismo). */
  siguiente: number;
}

export type Accion =
  | { tipo: 'solicitar'; animal: string; persona: string }
  | { tipo: 'avanzar'; id: string }
  | { tipo: 'publicar'; nombre: string; especie: Especie; tamano: Tamano; caracter: string }
  | { tipo: 'donar'; monto: number }
  | { tipo: 'anotarme'; actividad: string }
  | { tipo: 'asociarme'; nombre: string; cuota: string }
  | { tipo: 'recordar'; socio: string }
  | { tipo: 'verAviso' }
  | { tipo: 'reiniciar' };

export const ORDEN_SOLICITUD: readonly EstadoSolicitud[] = [
  'recibida',
  'entrevista',
  'aprobada',
  'adoptado',
];

export function estadoInicial(): EstadoDemo {
  return {
    animales: [...ANIMALES],
    solicitudes: [...SOLICITUDES_INICIALES],
    socios: [...SOCIOS],
    recordados: [],
    juntado: CAMPANA.juntado,
    anotados: Object.fromEntries(ACTIVIDADES.map((a) => [a.id, a.anotados])),
    mias: [],
    carnet: null,
    aviso: null,
    siguiente: 1,
  };
}

const limpiar = (t: string, largo: number) => t.replace(/\s+/g, ' ').trim().slice(0, largo);

export function reducir(e: EstadoDemo, a: Accion): EstadoDemo {
  switch (a.tipo) {
    case 'solicitar': {
      const persona = limpiar(a.persona, 40);
      if (!persona || !e.animales.some((x) => x.id === a.animal)) return e;
      const s: Solicitud = {
        id: `sol-${e.siguiente}`,
        animal: a.animal,
        persona,
        estado: 'recibida',
      };
      return {
        ...e,
        solicitudes: [s, ...e.solicitudes],
        animales: e.animales.map((x) =>
          x.id === a.animal && x.estado === 'disponible' ? { ...x, estado: 'proceso' } : x,
        ),
        aviso: s,
        siguiente: e.siguiente + 1,
      };
    }
    case 'avanzar': {
      const s = e.solicitudes.find((x) => x.id === a.id);
      if (!s) return e;
      const i = ORDEN_SOLICITUD.indexOf(s.estado);
      const nuevo = ORDEN_SOLICITUD[Math.min(i + 1, ORDEN_SOLICITUD.length - 1)]!;
      return {
        ...e,
        solicitudes: e.solicitudes.map((x) => (x.id === a.id ? { ...x, estado: nuevo } : x)),
        // El final feliz se ve en la vitrina pública.
        animales:
          nuevo === 'adoptado'
            ? e.animales.map((x) => (x.id === s.animal ? { ...x, estado: 'adoptado' } : x))
            : e.animales,
      };
    }
    case 'publicar': {
      const nombre = limpiar(a.nombre, 24);
      if (!nombre) return e;
      const nuevo: Animal = {
        id: `nuevo-${e.siguiente}`,
        nombre,
        especie: a.especie,
        edadMeses: 12,
        tamano: a.tamano,
        caracter: limpiar(a.caracter, 60) || UI_PROTECTORA.admin.nuevo.caracterPorDefecto,
        castrado: false,
        vacunado: true,
        estado: 'disponible',
        tono: 'cielo',
        historia: UI_PROTECTORA.admin.nuevo.historia,
      };
      return { ...e, animales: [nuevo, ...e.animales], siguiente: e.siguiente + 1 };
    }
    case 'donar':
      return a.monto > 0 ? { ...e, juntado: e.juntado + a.monto } : e;
    case 'anotarme': {
      const act = ACTIVIDADES.find((x) => x.id === a.actividad);
      const ya = e.anotados[a.actividad] ?? 0;
      if (!act || e.mias.includes(a.actividad) || ya >= act.cupo) return e;
      return {
        ...e,
        anotados: { ...e.anotados, [a.actividad]: ya + 1 },
        mias: [...e.mias, a.actividad],
      };
    }
    case 'asociarme': {
      const nombre = limpiar(a.nombre, 40);
      if (!nombre) return e;
      return {
        ...e,
        carnet: { nombre, cuota: a.cuota, numero: 140 + e.siguiente },
        siguiente: e.siguiente + 1,
      };
    }
    case 'recordar':
      return e.recordados.includes(a.socio) ? e : { ...e, recordados: [...e.recordados, a.socio] };
    case 'verAviso':
      return { ...e, aviso: null };
    case 'reiniciar':
      return estadoInicial();
  }
}
