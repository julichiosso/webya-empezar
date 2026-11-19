import {
  MODULOS_CONFIG,
  MODULOS_POR_DEFECTO,
  RUBROS_CONFIG,
  mensajePedido,
  modulosDe,
} from '@/content/configurador';
import { getServicio, type TipoId } from '@/content/servicios';

/** Estado del configurador. Vive en el cliente: nada viaja hasta que la persona toca "Mandar". */
export interface EstadoConfigurador {
  tipo: TipoId | null;
  rubro: string | null;
  rubroOtro: string;
  negocio: string;
  /** Ids marcados. Puede tener módulos que no aplican al tipo actual (llegan del bento): no se envían. */
  modulos: readonly string[];
}

export type Accion =
  | { tipo: 'elegirTipo'; valor: TipoId }
  | { tipo: 'elegirRubro'; valor: string }
  | { tipo: 'escribirRubroOtro'; valor: string }
  | { tipo: 'escribirNegocio'; valor: string }
  | { tipo: 'alternarModulo'; valor: string }
  | { tipo: 'preseleccionar'; tipoSistema?: string; modulo?: string }
  | { tipo: 'reiniciar' };

export const ESTADO_INICIAL: EstadoConfigurador = {
  tipo: null,
  rubro: null,
  rubroOtro: '',
  negocio: '',
  modulos: [],
};

const esTipo = (v: string | undefined): v is TipoId => !!v && !!getServicio(v);
const esModulo = (v: string | undefined) => !!v && MODULOS_CONFIG.some((m) => m.id === v);
const unir = (a: readonly string[], b: readonly string[]) => [...new Set([...a, ...b])];

/** Al elegir un tipo: lo más pedido viene marcado, y se conserva lo ya elegido que siga aplicando. */
function conTipo(e: EstadoConfigurador, tipo: TipoId): EstadoConfigurador {
  if (e.tipo === tipo) return e;
  const aplican = new Set(modulosDe(tipo).map((m) => m.id));
  const previos = e.modulos.filter((m) => aplican.has(m));
  return { ...e, tipo, modulos: unir(MODULOS_POR_DEFECTO[tipo], previos) };
}

export function reducir(e: EstadoConfigurador, a: Accion): EstadoConfigurador {
  switch (a.tipo) {
    case 'elegirTipo':
      return conTipo(e, a.valor);
    case 'elegirRubro':
      return RUBROS_CONFIG.some((r) => r.id === a.valor) ? { ...e, rubro: a.valor } : e;
    case 'escribirRubroOtro':
      return { ...e, rubroOtro: a.valor.slice(0, 60) };
    case 'escribirNegocio':
      return { ...e, negocio: a.valor.slice(0, 60) };
    case 'alternarModulo':
      if (!esModulo(a.valor)) return e;
      return {
        ...e,
        modulos: e.modulos.includes(a.valor)
          ? e.modulos.filter((m) => m !== a.valor)
          : [...e.modulos, a.valor],
      };
    case 'preseleccionar': {
      let s = e;
      if (esModulo(a.modulo) && !s.modulos.includes(a.modulo!))
        s = { ...s, modulos: [...s.modulos, a.modulo!] };
      if (esTipo(a.tipoSistema)) s = conTipo(s, a.tipoSistema);
      return s;
    }
    case 'reiniciar':
      return ESTADO_INICIAL;
  }
}

/** Lo que se muestra en el resumen y se manda: solo módulos que aplican al tipo elegido. */
export function resumen(e: EstadoConfigurador) {
  const servicio = e.tipo ? getServicio(e.tipo) : undefined;
  const rubro = RUBROS_CONFIG.find((r) => r.id === e.rubro);
  const nombreRubro = rubro?.id === 'otro' ? e.rubroOtro.trim() || rubro.nombre : rubro?.nombre;
  const modulos = modulosDe(e.tipo).filter((m) => e.modulos.includes(m.id));
  return {
    listo: Boolean(servicio),
    tipo: servicio?.nombre,
    rubro: nombreRubro,
    negocio: e.negocio.trim() || undefined,
    modulos: modulos.map((m) => m.nombre),
    demo: rubro?.demo,
  };
}

export function mensajeDe(e: EstadoConfigurador): string | null {
  const r = resumen(e);
  if (!r.tipo) return null;
  return mensajePedido({ tipo: r.tipo, rubro: r.rubro, negocio: r.negocio, modulos: r.modulos });
}
