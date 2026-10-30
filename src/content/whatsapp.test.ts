import { describe, expect, it } from 'vitest';
import { MENSAJE_WHATSAPP } from './whatsapp';

describe('mensaje precargado de WhatsApp', () => {
  it('con todos los datos del lead', () => {
    expect(
      MENSAJE_WHATSAPP.lead({
        nombre: 'Ana',
        nombreNegocio: 'Luna',
        rubro: 'Peluquería y estética',
        modulos: ['Turnos y reservas', 'Pagos online'],
        objetivos: ['Recibir turnos online'],
        necesidadLibre: 'Controlar el stock de tinturas',
      }),
    ).toBe(
      [
        'Hola, WebYa. Soy Ana, de Luna (Peluquería y estética).',
        'Quiero activar: Turnos y reservas, Pagos online.',
        'Quiero lograr: Recibir turnos online.',
        'También necesito esto: Controlar el stock de tinturas.',
        'Dejé mis datos en webya.ar/empezar. ¿Hablamos?',
      ].join('\n'),
    );
  });

  it('con el lead parcial (sin nombre): no inventa datos', () => {
    expect(MENSAJE_WHATSAPP.lead({ nombreNegocio: 'Luna', modulos: [] })).toBe(
      'Hola, WebYa. Escribo de Luna.\nDejé mis datos en webya.ar/empezar. ¿Hablamos?',
    );
    expect(MENSAJE_WHATSAPP.lead({})).toBe(
      'Hola, WebYa.\nDejé mis datos en webya.ar/empezar. ¿Hablamos?',
    );
  });

  it('los mensajes fijos dejan lugar para que la persona siga escribiendo', () => {
    expect(MENSAJE_WHATSAPP.contacto).toMatch(/:$/);
    expect(MENSAJE_WHATSAPP.aMedida).toMatch(/a medida/);
  });
});
