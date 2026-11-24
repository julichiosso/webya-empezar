// @vitest-environment node
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { archivosDeCodigo, rel } from '../arquitectura/analisis';

/**
 * Datos que faltan (precio, plazos, testimonios): en el código van como `null` con un comentario
 * `[COMPLETAR: id]` y se listan en TODO-contenido.md. Este test mantiene las dos listas iguales y evita que
 * un `[COMPLETAR` quede dentro de un texto, donde se publicaría.
 */
const MARCA = /\[COMPLETAR: ([a-z0-9-]+)\]/g;

const ids = (texto: string) => [...texto.matchAll(MARCA)].map((m) => m[1] ?? '');

const archivos = archivosDeCodigo();
const enCodigo = new Map<string, string>();
for (const a of archivos) for (const id of ids(readFileSync(a, 'utf8'))) enCodigo.set(id, rel(a));

const enLista = new Set(ids(readFileSync(join(process.cwd(), 'TODO-contenido.md'), 'utf8')));

describe('pendientes de contenido', () => {
  it('cada [COMPLETAR] del código figura en TODO-contenido.md', () => {
    const faltan = [...enCodigo].filter(([id]) => !enLista.has(id)).map(([id, a]) => `${id} (${a})`);
    expect(faltan).toEqual([]);
  });

  it('TODO-contenido.md no lista pendientes que ya no están en el código (si se completó, se borra)', () => {
    expect([...enLista].filter((id) => !enCodigo.has(id))).toEqual([]);
  });

  it('ningún texto lleva un [COMPLETAR adentro (solo en comentarios, al lado de un null)', () => {
    const dentroDeTexto = /['"`][^'"`\n]*\[COMPLETAR/;
    const malos = archivos.filter((a) => dentroDeTexto.test(readFileSync(a, 'utf8'))).map(rel);
    expect(malos).toEqual([]);
  });
});
