// @vitest-environment node
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  archivosDeCodigo,
  capaDe,
  importPermitido,
  importsInternos,
  rel,
  textosHardcodeados,
} from './analisis';
import { EXCEPCIONES_CAPAS, EXCEPCIONES_COPY } from './excepciones';

/**
 * Fronteras del frontend (ver docs/plan-sprint.md §1):
 *   app > features > marketing > patterns > ui > content > brand > domain > config > lib
 * Solo se importa hacia abajo; las features no se importan entre sí; server solo desde app.
 * Los componentes no escriben copy: lo leen de src/content.
 * Las excepciones viven en excepciones.ts y SOLO pueden achicarse (un test falla si sobra alguna).
 */
const archivos = archivosDeCodigo();

describe('capas: dependencias solo hacia abajo', () => {
  const violaciones = archivos
    .flatMap(importsInternos)
    .filter((i) => !importPermitido(i.desde, i.hacia))
    .map((i) => `${i.desde} -> ${i.hacia}`);

  it('ningún import sube de capa ni cruza features (salvo excepciones registradas)', () => {
    const nuevas = [...new Set(violaciones)].filter((v) => !(v in EXCEPCIONES_CAPAS));
    expect(nuevas).toEqual([]);
  });

  it('cada excepción de capas sigue haciendo falta (si no, se borra)', () => {
    const sobrantes = Object.keys(EXCEPCIONES_CAPAS).filter((e) => !violaciones.includes(e));
    expect(sobrantes).toEqual([]);
  });

  it('domain no importa React ni nada de UI', () => {
    const conReact = archivos
      .filter((f) => capaDe(rel(f)) === 'domain')
      .filter((f) => /from 'react'|\.tsx$/.test(readFileSync(f, 'utf8') + f));
    expect(conReact.map(rel)).toEqual([]);
  });
});

describe('copy: cero texto hardcodeado en componentes y páginas', () => {
  const conCopy = archivos
    .filter((f) => /^(components|features)\//.test(rel(f)) || /^app\/.*\.tsx$/.test(rel(f)))
    .map((f) => ({ archivo: rel(f), textos: textosHardcodeados(f) }))
    .filter((r) => r.textos.length > 0);

  it('todo el texto visible sale de src/content (salvo excepciones registradas)', () => {
    const nuevos = conCopy
      .filter((r) => !(r.archivo in EXCEPCIONES_COPY))
      .flatMap((r) => r.textos.map((t) => `${t.archivo}:${t.linea} «${t.texto}»`));
    expect(nuevos).toEqual([]);
  });

  it('cada excepción de copy sigue haciendo falta (si no, se borra)', () => {
    const conTexto = new Set(conCopy.map((r) => r.archivo));
    const sobrantes = Object.keys(EXCEPCIONES_COPY).filter((e) => !conTexto.has(e));
    expect(sobrantes).toEqual([]);
  });
});
