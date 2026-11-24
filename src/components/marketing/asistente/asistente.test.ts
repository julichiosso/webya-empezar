// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { ASISTENTE } from '@/content/asistente';
import { responder } from './PanelAsistente';

describe('asistente: qué contesta', () => {
  it('entiende el problema y propone el producto con su demo', () => {
    const r = responder('me reservan turnos y no vienen');
    expect(r.destinos?.map((d) => d.id)).toEqual(['turnero', 'demo-turnos']);
  });
  it('reconoce el rubro y el producto aunque no nombre un problema', () => {
    expect(responder('tengo una heladeria y quiero pedidos online').destinos?.[0]?.id).toBe(
      'pedidos',
    );
  });
  it('responde las preguntas de siempre sin red', () => {
    expect(responder('¿Qué hacen?').destinos).toHaveLength(4);
    expect(responder('¿Dónde atienden?').link?.href).toBe('/zona');
    expect(responder('Quiero hablar con una persona').contacto).toBe(
      'Quiero hablar con una persona',
    );
  });
  it('si no entiende, ofrece seguir por WhatsApp con la pregunta', () => {
    const r = responder('zxqw plorf');
    expect(r.texto).toBe(ASISTENTE.noEntendi);
    expect(r.contacto).toBe('zxqw plorf');
  });
  it('cada pregunta rápida tiene respuesta útil', () => {
    for (const q of ASISTENTE.rapidas) {
      const r = responder(q);
      expect(r.texto, q).not.toBe(ASISTENTE.noEntendi);
    }
  });
});
