/**
 * Lógica pura de la narración del video: elegir la voz y estimar cuánto dura cada escena.
 * La voz es la del propio dispositivo (Web Speech API): cero descargas. Si no hay una voz en
 * español, el video sigue con subtítulos y los tiempos estimados.
 */

/** Ritmo de lectura para estimar la duración cuando no hay voz (palabras por segundo). */
const PALABRAS_POR_SEGUNDO = 2.6;
/** Pausa al final de cada escena para que la animación respire. */
export const PAUSA_ENTRE_ESCENAS_MS = 700;
const MINIMO_ESCENA_MS = 4_000;

export function duracionEstimadaMs(texto: string): number {
  const palabras = texto.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(MINIMO_ESCENA_MS, Math.round((palabras / PALABRAS_POR_SEGUNDO) * 1000) + 1_200);
}

/** Duración total estimada (para mostrar "1 min" en el botón). */
export function duracionTotalMs(textos: readonly string[]): number {
  return textos.reduce((t, x) => t + duracionEstimadaMs(x) + PAUSA_ENTRE_ESCENAS_MS, 0);
}

/** "≈ 1 min", "≈ 2 min"… redondeado al minuto más cercano (mínimo 1). */
export function etiquetaDuracion(ms: number): string {
  return `${Math.max(1, Math.round(ms / 60_000))} min`;
}

interface VozLike {
  lang: string;
  name: string;
  localService?: boolean;
}

/** Preferencia de acento: rioplatense primero, después latinoamericano y, al final, cualquier español. */
const PREFERENCIAS = ['es-AR', 'es-UY', 'es-419', 'es-US', 'es-MX', 'es-CO', 'es-CL', 'es-ES'];

export function elegirVoz<V extends VozLike>(voces: readonly V[]): V | null {
  const norm = (l: string) => l.replace('_', '-').toLowerCase();
  for (const pref of PREFERENCIAS) {
    const candidatas = voces.filter((v) => norm(v.lang) === pref.toLowerCase());
    // Entre iguales, las locales (sin red) suenan antes y no fallan sin conexión.
    const voz = candidatas.find((v) => v.localService) ?? candidatas[0];
    if (voz) return voz;
  }
  return voces.find((v) => norm(v.lang).startsWith('es')) ?? null;
}
