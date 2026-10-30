import { describe, expect, it } from 'vitest';
import { LIMITES } from '@/content/leads';
import { A_MEDIDA } from './a-medida';
import { COMO_TRABAJAMOS } from './como-trabajamos';
import { CTA_FINAL } from './cta-final';
import { FLUJO } from './wizard-flujo';

const palabras = (t: string) => t.trim().split(/\s+/).length;

describe('copy del wizard nuevo', () => {
  it('tiene los 5 pasos en el orden confirmado', () => {
    expect(FLUJO.nombresPasos).toEqual(['Qué necesitás', 'Rubro', 'Módulos', 'WhatsApp', 'Tus datos']);
  });

  it('los titulares de los pasos y de las secciones nuevas tienen hasta 8 palabras', () => {
    const titulos = [
      FLUJO.necesidad.titulo,
      FLUJO.rubro.titulo,
      FLUJO.modulos.titulo,
      FLUJO.whatsapp.titulo,
      FLUJO.completar.titulo,
      FLUJO.confirmacion.completo.titulo,
      FLUJO.confirmacion.parcial.titulo,
      A_MEDIDA.titulo,
      COMO_TRABAJAMOS.titulo,
      CTA_FINAL.titulo,
    ];
    for (const t of titulos) expect(palabras(t), t).toBeLessThanOrEqual(8);
  });

  it('el paso de WhatsApp dice qué pasa después y que el resto es opcional', () => {
    expect(FLUJO.whatsapp.bajada).toMatch(/opcional/);
    expect(FLUJO.whatsapp.queSigue.items.length).toBeGreaterThan(0);
  });

  it('el contador de "Otra cosa" usa el límite real del esquema', () => {
    expect(LIMITES.necesidadLibre).toBe(500);
    expect(FLUJO.otra.contador(120, LIMITES.necesidadLibre)).toBe('120 de 500');
    expect(FLUJO.otra.contadorAccesible(1)).toBe('Te queda 1 carácter.');
    expect(FLUJO.otra.contadorAccesible(20)).toBe('Te quedan 20 caracteres.');
  });
});
