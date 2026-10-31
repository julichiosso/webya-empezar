import { duracionEstimadaMs, PAUSA_ENTRE_ESCENAS_MS } from './narracion';

/**
 * Subtítulos WebVTT del video de presentación, generados desde el guion (content/explicativo/flujo):
 * un bloque por escena, con los mismos tiempos estimados que usa la animación en código. Así el
 * MP4 (cuando exista) y la animación dicen exactamente lo mismo. Si el MP4 grabado tiene otro ritmo,
 * se ajustan los tiempos del .vtt a mano: el test solo exige que los TEXTOS coincidan con el guion.
 */
export function tiempoVtt(ms: number): string {
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  const s = Math.floor((ms % 60_000) / 1000);
  const r = ms % 1000;
  const dos = (n: number) => String(n).padStart(2, '0');
  return `${dos(h)}:${dos(m)}:${dos(s)}.${String(r).padStart(3, '0')}`;
}

export function subtitulosVtt(escenas: readonly { id: string; narracion: string }[]): string {
  let inicio = 0;
  const bloques = escenas.map((e) => {
    const fin = inicio + duracionEstimadaMs(e.narracion);
    const bloque = `${e.id}\n${tiempoVtt(inicio)} --> ${tiempoVtt(fin)}\n${e.narracion}`;
    inicio = fin + PAUSA_ENTRE_ESCENAS_MS;
    return bloque;
  });
  return `WEBVTT\n\n${bloques.join('\n\n')}\n`;
}

/** Los textos de un .vtt, en orden (sin cabecera, ids ni tiempos). Para comparar con el guion. */
export function textosDeVtt(vtt: string): string[] {
  return vtt
    .replace(/\r\n/g, '\n')
    .split(/\n{2,}/)
    .slice(1)
    .map((bloque) => {
      const lineas = bloque.split('\n');
      const i = lineas.findIndex((l) => l.includes('-->'));
      return lineas
        .slice(i + 1)
        .join(' ')
        .trim();
    })
    .filter(Boolean);
}
