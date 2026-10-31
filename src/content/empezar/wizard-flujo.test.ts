import { describe, expect, it } from 'vitest';
import { LIMITES } from '@/content/leads';
import { COMO_TRABAJAMOS } from './como-trabajamos';
import { CTA_FINAL } from './cta-final';
import { FLUJO } from './wizard-flujo';

const palabras = (t: string) => t.trim().split(/\s+/).length;

describe('copy del flujo de /empezar', () => {
  it('los titulares de las pantallas y de las secciones tienen hasta 8 palabras', () => {
    const titulos = [
      FLUJO.rubro.titulo,
      FLUJO.aMedida.titulo,
      FLUJO.negocio.titulo,
      FLUJO.resultado.titulo('Lo de Tito'),
      FLUJO.resultado.tituloSinNombre,
      FLUJO.resultado.aMedida.titulo,
      FLUJO.completar.titulo,
      FLUJO.listo.titulo,
      COMO_TRABAJAMOS.titulo,
      CTA_FINAL.titulo,
    ];
    for (const t of titulos) expect(palabras(t), t).toBeLessThanOrEqual(8);
  });

  it('la pantalla 1 y la 2 dicen lo que pidió el brief, tal cual', () => {
    expect(FLUJO.rubro.titulo).toBe('¿Qué negocio tenés?');
    expect(FLUJO.rubro.bajada).toBe('Elegí el tuyo y en menos de un minuto ves cómo te queda.');
    expect(FLUJO.negocio.promesa).toBe('Completalo y en segundos ves cómo te quedaría.');
    expect(FLUJO.resultado.cta).toBe('Quiero esto para mi negocio');
  });

  it('el contador del pedido a medida usa el límite real del esquema', () => {
    expect(LIMITES.necesidadLibre).toBe(500);
    expect(FLUJO.aMedida.contador(120, LIMITES.necesidadLibre)).toBe('120 de 500');
    expect(FLUJO.aMedida.contadorAccesible(1)).toBe('Te queda 1 carácter.');
    expect(FLUJO.aMedida.contadorAccesible(20)).toBe('Te quedan 20 caracteres.');
  });
});
