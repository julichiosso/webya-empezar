/**
 * Interruptores de contenido que depende de un permiso o de un dato del dueño.
 * Apagar uno saca el bloque entero del sitio, sin tocar componentes.
 */
export const FLAGS = {
  /**
   * Franja "Confían en Webya" con los logos de los clientes. Permiso de todos los clientes confirmado
   * por Julián el 2026-11-24 (ver TRUST_CLAIMS.md). Si alguno lo retira, sacar su logo de
   * `CONFIAN.logos` en content/home.ts; si no hay permiso de ninguno, poner `false`.
   */
  logosConfian: true,
} as const;
