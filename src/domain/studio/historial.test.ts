import { describe, expect, it } from 'vitest';
import { MAX_PASOS, conHistorial, historialDe } from './historial';

const reducir = (n: number, a: { suma: number }) => (a.suma === 0 ? n : n + a.suma);
const r = conHistorial(reducir);

describe('historial del estudio', () => {
  it('deshace y rehace en orden', () => {
    let h = historialDe(0);
    h = r(h, { tipo: 'aplicar', accion: { suma: 1 } });
    h = r(h, { tipo: 'aplicar', accion: { suma: 2 } });
    expect(h.presente).toBe(3);
    h = r(h, { tipo: 'deshacer' });
    expect(h.presente).toBe(1);
    h = r(h, { tipo: 'rehacer' });
    expect(h.presente).toBe(3);
  });

  it('una acción nueva borra lo que se podía rehacer', () => {
    let h = historialDe(0);
    h = r(h, { tipo: 'aplicar', accion: { suma: 1 } });
    h = r(h, { tipo: 'deshacer' });
    h = r(h, { tipo: 'aplicar', accion: { suma: 5 } });
    expect(h.futuro).toEqual([]);
    expect(h.presente).toBe(5);
  });

  it('lo que no cambia nada no entra al historial', () => {
    const h = r(historialDe(4), { tipo: 'aplicar', accion: { suma: 0 } });
    expect(h.pasado).toEqual([]);
  });

  it('reiniciar se puede deshacer', () => {
    let h = r(historialDe(0), { tipo: 'aplicar', accion: { suma: 7 } });
    h = r(h, { tipo: 'reiniciar', estado: 0 });
    expect(h.presente).toBe(0);
    h = r(h, { tipo: 'deshacer' });
    expect(h.presente).toBe(7);
  });

  it('deshacer sin pasado no hace nada y el pasado tiene tope', () => {
    expect(r(historialDe(1), { tipo: 'deshacer' }).presente).toBe(1);
    let h = historialDe(0);
    for (let i = 0; i < MAX_PASOS + 10; i++) h = r(h, { tipo: 'aplicar', accion: { suma: 1 } });
    expect(h.pasado.length).toBe(MAX_PASOS);
  });

  it('cargar empieza un historial limpio', () => {
    let h = r(historialDe(0), { tipo: 'aplicar', accion: { suma: 1 } });
    h = r(h, { tipo: 'cargar', estado: 9 });
    expect(h).toEqual({ pasado: [], presente: 9, futuro: [] });
  });
});
