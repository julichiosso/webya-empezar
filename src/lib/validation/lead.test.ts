import { describe, expect, it } from 'vitest';
import { sanitizeLine, sanitizeMultiline } from '../sanitize';
import { captureUtm, parseUtm } from '../utm';
import { datosFormSchema, LIMITES, leadPayloadSchema } from './lead';

const valido = {
  nombreNegocio: 'Peluquería Luna',
  nombre: 'Ana Pérez',
  whatsapp: '11 2345 6789',
  email: '',
  mensaje: '',
  rubro: 'peluqueria_estetica',
  modulos: ['turnos', 'catalogo'],
  objetivos: ['recibir_turnos'],
};

function mensajes(result: { success: boolean; error?: { issues: { message: string }[] } }) {
  return result.error?.issues.map((i) => i.message) ?? [];
}

describe('datosFormSchema', () => {
  it('acepta datos válidos, con email y mensaje opcionales vacíos', () => {
    expect(datosFormSchema.safeParse(valido).success).toBe(true);
  });

  it('acepta email y mensaje cuando vienen', () => {
    const r = datosFormSchema.safeParse({ ...valido, email: 'ana@luna.com', mensaje: 'Hola' });
    expect(r.success).toBe(true);
  });

  it('exige nombre del negocio, nombre y WhatsApp', () => {
    const r = datosFormSchema.safeParse({ ...valido, nombreNegocio: '', nombre: '', whatsapp: '' });
    expect(r.success).toBe(false);
    expect(mensajes(r)).toHaveLength(3);
  });

  it('da un mensaje específico para un WhatsApp inválido', () => {
    const r = datosFormSchema.safeParse({ ...valido, whatsapp: '12345' });
    expect(mensajes(r)).toEqual([
      'Revisá el número: tiene que ser de Argentina, por ejemplo 11 2345 6789.',
    ]);
  });

  it('rechaza emails mal formados y textos demasiado largos', () => {
    expect(datosFormSchema.safeParse({ ...valido, email: 'ana@' }).success).toBe(false);
    expect(
      datosFormSchema.safeParse({ ...valido, mensaje: 'x'.repeat(LIMITES.mensaje + 1) }).success,
    ).toBe(false);
    expect(
      datosFormSchema.safeParse({ ...valido, nombre: 'x'.repeat(LIMITES.nombre + 1) }).success,
    ).toBe(false);
  });

  it('recorta espacios antes de validar', () => {
    expect(datosFormSchema.safeParse({ ...valido, nombre: '   ' }).success).toBe(false);
  });
});

describe('leadPayloadSchema', () => {
  it('acepta un lead completo con UTM', () => {
    const r = leadPayloadSchema.safeParse({
      ...valido,
      utm_source: 'instagram',
      utm_medium: 'bio',
      utm_campaign: 'lanzamiento',
    });
    expect(r.success).toBe(true);
  });

  it('rechaza rubros y objetivos inexistentes o que no corresponden al rubro', () => {
    expect(leadPayloadSchema.safeParse({ ...valido, rubro: 'astronauta' }).success).toBe(false);
    expect(leadPayloadSchema.safeParse({ ...valido, objetivos: ['cobrar_cuotas'] }).success).toBe(
      false,
    );
    expect(
      leadPayloadSchema.safeParse({ ...valido, objetivos: ['recibir_turnos', 'recibir_turnos'] })
        .success,
    ).toBe(false);
  });

  it('exige rubroOtro cuando el rubro es "otro"', () => {
    const otro = { ...valido, rubro: 'otro', objetivos: ['que_me_contacten'] };
    expect(leadPayloadSchema.safeParse(otro).success).toBe(false);
    expect(leadPayloadSchema.safeParse({ ...otro, rubroOtro: 'Floristería' }).success).toBe(true);
  });

  it('exige al menos un módulo y que sean del catálogo, sin repetir', () => {
    expect(leadPayloadSchema.safeParse({ ...valido, modulos: [] }).success).toBe(false);
    expect(leadPayloadSchema.safeParse({ ...valido, modulos: ['hackeo'] }).success).toBe(false);
    expect(leadPayloadSchema.safeParse({ ...valido, modulos: ['turnos', 'turnos'] }).success).toBe(
      false,
    );
    expect(leadPayloadSchema.safeParse({ ...valido, modulos: ['catalogo'] }).success).toBe(true);
  });

  it('los objetivos son opcionales (pueden venir vacíos)', () => {
    expect(leadPayloadSchema.safeParse({ ...valido, objetivos: [] }).success).toBe(true);
  });

  it('limita la cantidad de objetivos', () => {
    const muchos = Array.from({ length: LIMITES.objetivos + 1 }, (_, i) => `o${i}`);
    expect(leadPayloadSchema.safeParse({ ...valido, objetivos: muchos }).success).toBe(false);
  });
});

describe('sanitize', () => {
  it('quita etiquetas HTML, control y espacios repetidos', () => {
    expect(sanitizeLine('  <b>Hola</b>\u0000   mundo<script>alert(1)</script> ')).toBe(
      'Hola mundoalert(1)',
    );
  });

  it('conserva saltos de línea razonables en texto multilínea', () => {
    expect(sanitizeMultiline('Hola\r\n\n\n\nQué   tal <i>x</i>')).toBe('Hola\n\nQué tal x');
  });
});

describe('utm', () => {
  it('parsea los tres UTM y descarta valores raros o largos', () => {
    expect(parseUtm('?utm_source=ig&utm_medium=bio&utm_campaign=lanzamiento_1')).toEqual({
      utm_source: 'ig',
      utm_medium: 'bio',
      utm_campaign: 'lanzamiento_1',
    });
    expect(parseUtm('?utm_source=<script>')).toEqual({});
    expect(parseUtm(`?utm_source=${'a'.repeat(300)}`).utm_source).toHaveLength(100);
  });

  it('guarda y recupera los UTM de sessionStorage tras una recarga sin parámetros', () => {
    const data = new Map<string, string>();
    const storage = {
      getItem: (k: string) => data.get(k) ?? null,
      setItem: (k: string, v: string) => void data.set(k, v),
    };
    captureUtm('?utm_source=ig&utm_medium=bio', storage);
    expect(captureUtm('', storage)).toEqual({ utm_source: 'ig', utm_medium: 'bio' });
  });
});
