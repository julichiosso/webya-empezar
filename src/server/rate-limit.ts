import type { LeadRepository } from './repositories/types';

/**
 * Rate limit por IP hasheada, en dos capas:
 *  1. Persistente: cuántos leads guardó esa IP en la ventana (consulta al repositorio, por eso
 *     funciona igual en serverless). Es el límite "de verdad".
 *  2. Ráfagas en memoria: frena a quien martilla la API con requests inválidos, que no se guardan.
 *     Es por instancia (best effort): alcanza para cortar el abuso burdo sin infraestructura extra.
 */
export async function excedeLimiteDeLeads(
  repo: LeadRepository,
  ipHash: string,
  max: number,
  ventanaSegundos: number,
  ahora: Date,
): Promise<boolean> {
  const desde = new Date(ahora.getTime() - ventanaSegundos * 1000);
  return (await repo.contarRecientesPorIp(ipHash, desde)) >= max;
}

export interface BurstLimiter {
  /** Registra un intento y devuelve true si esa IP ya pasó el máximo de la ventana. */
  excede(clave: string, ahoraMs?: number): boolean;
}

export function crearBurstLimiter(max: number, ventanaMs: number): BurstLimiter {
  const intentos = new Map<string, number[]>();
  return {
    excede(clave, ahoraMs = Date.now()) {
      const recientes = (intentos.get(clave) ?? []).filter((t) => ahoraMs - t < ventanaMs);
      recientes.push(ahoraMs);
      intentos.set(clave, recientes);
      // Evita crecimiento sin límite si llegan muchas IPs distintas.
      if (intentos.size > 5000) {
        for (const [k, v] of intentos) {
          if (v.every((t) => ahoraMs - t >= ventanaMs)) intentos.delete(k);
        }
      }
      return recientes.length > max;
    },
  };
}
