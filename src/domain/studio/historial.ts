/**
 * Historial de un estado editable (Demo Studio): deshacer, rehacer y reiniciar sobre cualquier reducer puro.
 * Cada acción que cambia el estado guarda el anterior; las que no lo cambian no ensucian el historial.
 */

/** Cuántos pasos atrás se recuerdan (más es memoria sin uso real). */
export const MAX_PASOS = 60;

export interface Historial<E> {
  pasado: readonly E[];
  presente: E;
  futuro: readonly E[];
}

export type AccionHistorial<A, E> =
  | { tipo: 'aplicar'; accion: A }
  | { tipo: 'deshacer' }
  | { tipo: 'rehacer' }
  | { tipo: 'reiniciar'; estado: E }
  /** Reemplaza todo (al abrir una demo guardada o compartida): no se puede deshacer hacia atrás de eso. */
  | { tipo: 'cargar'; estado: E };

export const historialDe = <E>(presente: E): Historial<E> => ({ pasado: [], presente, futuro: [] });

export function conHistorial<E, A>(reducir: (e: E, a: A) => E) {
  return function reducirHistorial(h: Historial<E>, a: AccionHistorial<A, E>): Historial<E> {
    switch (a.tipo) {
      case 'aplicar': {
        const nuevo = reducir(h.presente, a.accion);
        if (Object.is(nuevo, h.presente)) return h;
        return {
          pasado: [...h.pasado, h.presente].slice(-MAX_PASOS),
          presente: nuevo,
          futuro: [],
        };
      }
      case 'deshacer': {
        const previo = h.pasado.at(-1);
        if (previo === undefined) return h;
        return {
          pasado: h.pasado.slice(0, -1),
          presente: previo,
          futuro: [h.presente, ...h.futuro],
        };
      }
      case 'rehacer': {
        const [siguiente, ...resto] = h.futuro;
        if (siguiente === undefined) return h;
        return { pasado: [...h.pasado, h.presente], presente: siguiente, futuro: resto };
      }
      case 'reiniciar':
        // Reiniciar también se puede deshacer: nadie pierde lo que armó por un toque.
        return {
          pasado: [...h.pasado, h.presente].slice(-MAX_PASOS),
          presente: a.estado,
          futuro: [],
        };
      case 'cargar':
        return historialDe(a.estado);
    }
  };
}
