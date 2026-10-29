// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { PROHIBIDAS, PROMESA_SIN_SALVEDAD, SALVEDAD } from '@/brand/voz/diccionario';
import { CIFRAS_PERMITIDAS, EXCEPCIONES_CIFRAS } from './excepciones';

/**
 * Test de copy: recorre TODOS los textos exportados por src/content (también los que devuelven las funciones
 * de interpolación, llamadas con argumentos de ejemplo) y aplica las reglas de webya-copy-comercial.
 */
const modulos = import.meta.glob(['/src/content/**/*.ts', '!/src/content/**/*.test.ts'], {
  eager: true,
}) as Record<string, Record<string, unknown>>;

interface Texto {
  donde: string;
  texto: string;
}

function recolectar(valor: unknown, donde: string, salida: Texto[], profundidad = 0): void {
  if (profundidad > 12 || valor == null) return;
  if (typeof valor === 'string') salida.push({ donde, texto: valor });
  else if (typeof valor === 'function') {
    try {
      // Argumentos marcadores: lo que la función agrega por su cuenta queda a la vista; lo interpolado, no.
      const r = (valor as (...a: unknown[]) => unknown)('⟨a⟩', '⟨b⟩');
      recolectar(
        typeof r === 'string' ? r.replace(/⟨[ab]⟩/g, '') : r,
        `${donde}()`,
        salida,
        profundidad + 1,
      );
    } catch {
      // Funciones que no son de texto (helpers con otros argumentos): se ignoran.
    }
  } else if (Array.isArray(valor))
    valor.forEach((v, i) => recolectar(v, `${donde}[${i}]`, salida, profundidad + 1));
  else if (typeof valor === 'object')
    for (const [k, v] of Object.entries(valor))
      recolectar(v, `${donde}.${k}`, salida, profundidad + 1);
}

const textos: Texto[] = [];
for (const [archivo, exportado] of Object.entries(modulos)) {
  recolectar(exportado, archivo.replace('/src/content/', ''), textos);
}

describe('copy de src/content', () => {
  it('hay contenido para revisar', () => {
    expect(textos.length).toBeGreaterThan(200);
  });

  it('sin palabras prohibidas (superlativos vacíos, promesas, restos de marca)', () => {
    const malos = textos.filter((t) => PROHIBIDAS.some((r) => r.test(t.texto)));
    expect(malos.map((t) => `${t.donde}: «${t.texto}»`)).toEqual([]);
  });

  it('"tenemos todo" siempre con su salvedad "a medida"', () => {
    const malos = textos.filter(
      (t) => PROMESA_SIN_SALVEDAD.test(t.texto) && !SALVEDAD.test(t.texto),
    );
    expect(malos.map((t) => `${t.donde}: «${t.texto}»`)).toEqual([]);
  });

  it('sin cifras inventadas: todo número lleva TODO: o es un formato permitido', () => {
    const conCifra = textos.filter(
      (t) =>
        /\d/.test(t.texto.replace(/TODO:.*/s, '').replace(CIFRAS_PERMITIDAS, '')) &&
        !EXCEPCIONES_CIFRAS.some((e) => t.donde.startsWith(e.prefijo)),
    );
    expect(conCifra.map((t) => `${t.donde}: «${t.texto}»`)).toEqual([]);
  });

  it('cada excepción de cifras sigue haciendo falta (si no, se borra)', () => {
    const sobrantes = EXCEPCIONES_CIFRAS.filter(
      (e) => !textos.some((t) => t.donde.startsWith(e.prefijo) && /\d/.test(t.texto)),
    );
    expect(sobrantes.map((e) => e.prefijo)).toEqual([]);
  });
});
