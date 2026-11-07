import { describe, expect, it } from 'vitest';
import {
  borradorVacio,
  codificarBorrador,
  decodificarBorrador,
  LIMITES_BORRADOR,
  sanearBorrador,
  whatsappDeBorrador,
} from './borrador';

const completo = {
  ...borradorVacio('peluqueria_estetica'),
  nombre: 'Barbería Ñandú',
  bajada: 'Cortes y barba',
  whatsapp: '11 2345 6789',
  paleta: 'pileta' as const,
  items: [{ nombre: 'Corte', precio: '$ 12.000' }],
};

describe('borrador del sitio', () => {
  it('ida y vuelta por el link, con acentos y eñes', () => {
    const c = codificarBorrador(completo);
    expect(c).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(decodificarBorrador(c)).toEqual(completo);
  });

  it('un link roto, vacío o gigante no abre nada', () => {
    expect(decodificarBorrador('')).toBeNull();
    expect(decodificarBorrador('%%%no-es-base64')).toBeNull();
    expect(decodificarBorrador(btoa('{no es json'))).toBeNull();
    expect(decodificarBorrador('a'.repeat(LIMITES_BORRADOR.codificado + 1))).toBeNull();
  });

  it('un rubro sin plantilla no es un borrador', () => {
    expect(sanearBorrador({ rubro: 'otro' })).toBeNull();
    expect(sanearBorrador({ rubro: 'inventado' })).toBeNull();
    expect(sanearBorrador('hola')).toBeNull();
  });

  it('todo lo que llega de un link se limpia y se recorta', () => {
    const b = sanearBorrador({
      rubro: 'comercio',
      nombre: '<img src=x onerror=alert(1)>Tienda' + 'x'.repeat(200),
      paleta: 'javascript:alert(1)',
      whatsapp: { raro: true },
      items: [
        { nombre: '<script>x</script>Pan', precio: 5 },
        { nombre: '   ' },
        'no soy un objeto',
        ...Array.from({ length: 20 }, () => ({ nombre: 'Algo' })),
      ],
    })!;
    expect(b.nombre).not.toContain('<');
    expect(b.nombre.length).toBeLessThanOrEqual(LIMITES_BORRADOR.nombre);
    expect(b.paleta).toBe('brasa');
    expect(b.whatsapp).toBe('');
    expect(b.items.length).toBeLessThanOrEqual(LIMITES_BORRADOR.items);
    expect(b.items[0]).toEqual({ nombre: 'xPan', precio: '' });
  });

  it('el botón de WhatsApp sale solo con un número válido', () => {
    expect(whatsappDeBorrador({ whatsapp: '11 2345 6789' })).toBe('5491123456789');
    expect(whatsappDeBorrador({ whatsapp: '123' })).toBeNull();
    expect(whatsappDeBorrador({ whatsapp: '' })).toBeNull();
  });
});
