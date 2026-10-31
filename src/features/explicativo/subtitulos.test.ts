// @vitest-environment node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { VIDEO_PRESENTACION_CONFIG } from '@/config/video';
import { ESCENAS_FLUJO } from '@/content/explicativo/flujo';
import { subtitulosVtt, textosDeVtt, tiempoVtt } from './subtitulos';

/**
 * El .vtt del video de presentación sale del guion. Para regenerarlo después de cambiar el guion:
 *   ACTUALIZAR_SUBTITULOS=1 pnpm exec vitest run src/features/explicativo/subtitulos.test.ts
 */
const ARCHIVO = resolve(process.cwd(), 'public', VIDEO_PRESENTACION_CONFIG.subtitulos.slice(1));

describe('subtítulos del video de presentación (es-AR)', () => {
  it('formatea los tiempos como WebVTT', () => {
    expect(tiempoVtt(0)).toBe('00:00:00.000');
    expect(tiempoVtt(61_250)).toBe('00:01:01.250');
  });

  it('un bloque por escena, en orden, que no se pisan', () => {
    const vtt = subtitulosVtt(ESCENAS_FLUJO);
    expect(vtt.startsWith('WEBVTT\n\n')).toBe(true);
    expect(textosDeVtt(vtt)).toEqual(ESCENAS_FLUJO.map((e) => e.narracion));
    const tiempos = [...vtt.matchAll(/(\S+) --> (\S+)/g)].map((m) => ({
      desde: m[1]!,
      hasta: m[2]!,
    }));
    expect(tiempos).toHaveLength(ESCENAS_FLUJO.length);
    for (let i = 1; i < tiempos.length; i++) {
      // Formato de ancho fijo: la comparación de textos ordena igual que la de tiempos.
      expect(tiempos[i]!.desde > tiempos[i - 1]!.hasta).toBe(true);
    }
  });

  it('el archivo público dice exactamente lo que dice el guion', () => {
    if (process.env.ACTUALIZAR_SUBTITULOS) {
      mkdirSync(dirname(ARCHIVO), { recursive: true });
      writeFileSync(ARCHIVO, subtitulosVtt(ESCENAS_FLUJO));
    }
    expect(existsSync(ARCHIVO), `falta ${ARCHIVO}`).toBe(true);
    const vtt = readFileSync(ARCHIVO, 'utf8');
    expect(vtt.startsWith('WEBVTT')).toBe(true);
    // Los tiempos se pueden ajustar al audio real del MP4; los textos, no.
    expect(textosDeVtt(vtt)).toEqual(ESCENAS_FLUJO.map((e) => e.narracion));
  });
});
