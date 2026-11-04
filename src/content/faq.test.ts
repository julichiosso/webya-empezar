import { describe, expect, it } from 'vitest';
import { FAQ } from './faq';

describe('FAQ de /empezar', () => {
  it('responde precio, plazo, dominio y datos', () => {
    const preguntas = FAQ.map((f) => f.pregunta);
    expect(preguntas).toEqual(
      expect.arrayContaining([
        '¿Cuánto cuesta?',
        '¿Cuánto tarda?',
        '¿Puedo usar mi propio dominio?',
        '¿Qué hacen con mis datos?',
      ]),
    );
  });

  it('no deja textos internos a la vista', () => {
    for (const f of FAQ) expect(`${f.pregunta} ${f.respuesta}`).not.toMatch(/TODO|pendiente de/);
  });
});
