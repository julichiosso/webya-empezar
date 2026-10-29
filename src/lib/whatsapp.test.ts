import { describe, expect, it } from 'vitest';
import { buildWhatsAppLink, buildWhatsAppMessage } from './whatsapp';

const datos = {
  nombre: 'Ana',
  nombreNegocio: 'Peluquería Luna',
  rubro: 'Peluquería y estética',
  modulos: ['Turnos y reservas', 'Tienda y catálogo'],
  objetivos: ['Recibir turnos online', 'Mostrar mis trabajos'],
};

describe('buildWhatsAppMessage', () => {
  it('incluye nombre, negocio, rubro, módulos y objetivos', () => {
    const msg = buildWhatsAppMessage(datos);
    expect(msg).toContain('Soy Ana, de Peluquería Luna (Peluquería y estética)');
    expect(msg).toContain('Quiero activar: Turnos y reservas, Tienda y catálogo.');
    expect(msg).toContain('Quiero lograr: Recibir turnos online, Mostrar mis trabajos.');
  });

  it('omite la línea de objetivos si no hay', () => {
    expect(buildWhatsAppMessage({ ...datos, objetivos: [] })).not.toContain('Quiero lograr');
  });
});

describe('buildWhatsAppLink', () => {
  it('arma un link wa.me con el mensaje codificado', () => {
    const link = buildWhatsAppLink('5491123456789', 'Hola & chau\n¿Qué tal?');
    expect(link).toBe(
      `https://wa.me/5491123456789?text=${encodeURIComponent('Hola & chau\n¿Qué tal?')}`,
    );
    expect(link).not.toContain('\n');
    expect(link).toContain('%26');
  });

  it('limpia el número (+, espacios, guiones)', () => {
    expect(buildWhatsAppLink('+54 9 11 2345-6789', 'x')).toMatch(
      /^https:\/\/wa\.me\/5491123456789\?/,
    );
  });

  it('devuelve null si el número no está configurado o es inválido', () => {
    expect(buildWhatsAppLink('', 'x')).toBeNull();
    expect(buildWhatsAppLink(undefined, 'x')).toBeNull();
    expect(buildWhatsAppLink('123', 'x')).toBeNull();
  });
});
