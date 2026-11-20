// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { ACTIVIDADES, CAMPANA } from '@/content/demos/protectora';
import { estadoInicial, reducir } from './estado';

describe('demo protectora', () => {
  it('una solicitud entra recibida, avisa al equipo y pone al animal en proceso', () => {
    const e = reducir(estadoInicial(), { tipo: 'solicitar', animal: 'luna', persona: '  Ana  ' });
    expect(e.solicitudes[0]).toMatchObject({ animal: 'luna', persona: 'Ana', estado: 'recibida' });
    expect(e.aviso?.persona).toBe('Ana');
    expect(e.animales.find((a) => a.id === 'luna')?.estado).toBe('proceso');
  });

  it('sin nombre o con un animal que no existe no hace nada', () => {
    const e0 = estadoInicial();
    expect(reducir(e0, { tipo: 'solicitar', animal: 'luna', persona: '   ' })).toBe(e0);
    expect(reducir(e0, { tipo: 'solicitar', animal: 'nadie', persona: 'Ana' })).toBe(e0);
  });

  it('la solicitud avanza hasta adoptado y la vitrina lo muestra', () => {
    let e = reducir(estadoInicial(), { tipo: 'solicitar', animal: 'luna', persona: 'Ana' });
    const id = e.solicitudes[0]!.id;
    for (let i = 0; i < 5; i++) e = reducir(e, { tipo: 'avanzar', id });
    expect(e.solicitudes[0]!.estado).toBe('adoptado');
    expect(e.animales.find((a) => a.id === 'luna')?.estado).toBe('adoptado');
  });

  it('publicar un animal lo suma primero en la vitrina, disponible', () => {
    const e = reducir(estadoInicial(), {
      tipo: 'publicar',
      nombre: 'Coco',
      especie: 'perro',
      tamano: 'chico',
      caracter: 'Alegre',
    });
    expect(e.animales[0]).toMatchObject({ nombre: 'Coco', estado: 'disponible' });
  });

  it('donar suma a la campaña', () => {
    const e = reducir(estadoInicial(), { tipo: 'donar', monto: 5000 });
    expect(e.juntado).toBe(CAMPANA.juntado + 5000);
  });

  it('anotarse respeta el cupo y no se anota dos veces', () => {
    const lleno = ACTIVIDADES.find((a) => a.anotados >= a.cupo)!;
    const e0 = estadoInicial();
    expect(reducir(e0, { tipo: 'anotarme', actividad: lleno.id })).toBe(e0);
    const e1 = reducir(e0, { tipo: 'anotarme', actividad: 'paseos' });
    expect(e1.anotados.paseos).toBe(e0.anotados.paseos! + 1);
    expect(reducir(e1, { tipo: 'anotarme', actividad: 'paseos' })).toBe(e1);
  });

  it('asociarse da un carnet y reiniciar vuelve todo al principio', () => {
    const e = reducir(estadoInicial(), { tipo: 'asociarme', nombre: 'Ana', cuota: 'amigo' });
    expect(e.carnet?.nombre).toBe('Ana');
    expect(reducir(e, { tipo: 'reiniciar' }).carnet).toBeNull();
  });
});
