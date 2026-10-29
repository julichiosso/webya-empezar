import { describe, expect, it } from 'vitest';
import { sanitizeMultiline, sanitizeRecord } from '@/lib/sanitize';
import { completarLeadSchema, LIMITES, leadParcialSchema, MENSAJES_LEAD } from './leads';

const WHATSAPP = '11 2345 6789';
const TOKEN = 'a'.repeat(43);

function mensajes(result: { success: boolean; error?: { issues: { message: string }[] } }) {
  return result.error?.issues.map((i) => i.message) ?? [];
}

describe('leadParcialSchema', () => {
  it('acepta un lead parcial con solo el WhatsApp (el resto queda vacío)', () => {
    const r = leadParcialSchema.safeParse({ whatsapp: WHATSAPP });
    expect(r.success).toBe(true);
    expect(r.data).toMatchObject({ necesidades: [], modulos: [], objetivos: [] });
  });

  it('exige un WhatsApp argentino válido', () => {
    expect(leadParcialSchema.safeParse({}).success).toBe(false);
    expect(mensajes(leadParcialSchema.safeParse({ whatsapp: '12345' }))).toEqual([
      MENSAJES_LEAD.whatsappInvalido,
    ]);
  });

  it('acepta necesidades, texto libre, rubro y módulos válidos', () => {
    const r = leadParcialSchema.safeParse({
      whatsapp: WHATSAPP,
      necesidades: ['vender', 'otra'],
      necesidadLibre: 'Necesito controlar el stock de las dos sucursales',
      rubro: 'comercio',
      modulos: ['catalogo', 'pagos'],
      objetivos: ['vender_online'],
      origen: 'instagram',
      utm_source: 'ig',
    });
    expect(r.success).toBe(true);
  });

  it('"Otra cosa" sin texto falla con un mensaje claro', () => {
    const r = leadParcialSchema.safeParse({ whatsapp: WHATSAPP, necesidades: ['otra'] });
    expect(mensajes(r)).toEqual([MENSAJES_LEAD.necesidadLibreVacia]);
    const corto = leadParcialSchema.safeParse({
      whatsapp: WHATSAPP,
      necesidades: ['otra'],
      necesidadLibre: 'ab',
    });
    expect(mensajes(corto)).toEqual([MENSAJES_LEAD.necesidadLibreCorta]);
  });

  it('el texto libre admite hasta 500 caracteres', () => {
    const base = { whatsapp: WHATSAPP, necesidades: ['otra'] };
    expect(LIMITES.necesidadLibre).toBe(500);
    expect(leadParcialSchema.safeParse({ ...base, necesidadLibre: 'x'.repeat(500) }).success).toBe(
      true,
    );
    const largo = leadParcialSchema.safeParse({ ...base, necesidadLibre: 'x'.repeat(501) });
    expect(mensajes(largo)).toEqual([MENSAJES_LEAD.hastaCaracteres(500)]);
  });

  it('el texto libre se sanea antes de validar (HTML y caracteres de control)', () => {
    const crudo = {
      whatsapp: WHATSAPP,
      necesidades: ['otra'],
      necesidadLibre: '<script>alert(1)</script>Facturar\u0000 electrónico\n\n\n\n<b>ya</b>',
    };
    const limpio = sanitizeRecord(crudo, ['necesidadLibre']);
    expect(limpio.necesidadLibre).toBe('alert(1)Facturar electrónico\n\nya');
    expect(leadParcialSchema.safeParse(limpio).success).toBe(true);
    // Sin el saneado, el HTML puro queda vacío: no cuenta como texto.
    expect(sanitizeMultiline('<b></b>')).toBe('');
    expect(
      leadParcialSchema.safeParse(
        sanitizeRecord({ ...crudo, necesidadLibre: '<i></i>' }, ['necesidadLibre']),
      ).success,
    ).toBe(false);
  });

  it('rechaza necesidades inexistentes, repetidas o demasiadas', () => {
    const base = { whatsapp: WHATSAPP };
    expect(leadParcialSchema.safeParse({ ...base, necesidades: ['volar'] }).success).toBe(false);
    expect(
      leadParcialSchema.safeParse({ ...base, necesidades: ['vender', 'vender'] }).success,
    ).toBe(false);
    expect(
      leadParcialSchema.safeParse({ ...base, necesidades: Array(9).fill('vender') }).success,
    ).toBe(false);
  });

  it('rubro y módulos: opcionales, pero válidos si vienen', () => {
    const base = { whatsapp: WHATSAPP };
    expect(leadParcialSchema.safeParse({ ...base, rubro: 'astronauta' }).success).toBe(false);
    expect(leadParcialSchema.safeParse({ ...base, rubro: 'otro' }).success).toBe(false);
    expect(
      leadParcialSchema.safeParse({ ...base, rubro: 'otro', rubroOtro: 'Floristería' }).success,
    ).toBe(true);
    expect(leadParcialSchema.safeParse({ ...base, modulos: ['hackeo'] }).success).toBe(false);
    expect(leadParcialSchema.safeParse({ ...base, modulos: ['pagos', 'pagos'] }).success).toBe(
      false,
    );
    // Objetivos sin rubro no se pueden validar: se rechazan.
    expect(leadParcialSchema.safeParse({ ...base, objetivos: ['vender_online'] }).success).toBe(
      false,
    );
    expect(leadParcialSchema.safeParse({ ...base, origen: 'facebook' }).success).toBe(false);
  });
});

describe('completarLeadSchema', () => {
  it('solo exige el token y el nombre del negocio', () => {
    expect(completarLeadSchema.safeParse({ token: TOKEN, nombreNegocio: 'Luna' }).success).toBe(
      true,
    );
    expect(
      completarLeadSchema.safeParse({
        token: TOKEN,
        nombreNegocio: 'Luna',
        nombre: '',
        email: '',
        mensaje: '',
      }).success,
    ).toBe(true);
  });

  it('sin nombre del negocio no se completa', () => {
    const r = completarLeadSchema.safeParse({ token: TOKEN, nombreNegocio: '' });
    expect(mensajes(r)).toEqual([MENSAJES_LEAD.nombreNegocioCorto]);
  });

  it('valida lo opcional cuando viene', () => {
    const base = { token: TOKEN, nombreNegocio: 'Luna' };
    expect(completarLeadSchema.safeParse({ ...base, nombre: 'A' }).success).toBe(false);
    expect(completarLeadSchema.safeParse({ ...base, email: 'ana@' }).success).toBe(false);
    expect(completarLeadSchema.safeParse({ ...base, mensaje: 'x'.repeat(1001) }).success).toBe(
      false,
    );
  });

  it('el token tiene que ser base64url de 43 caracteres', () => {
    const base = { nombreNegocio: 'Luna' };
    expect(completarLeadSchema.safeParse({ ...base, token: 'a'.repeat(42) }).success).toBe(false);
    expect(completarLeadSchema.safeParse({ ...base, token: `${'a'.repeat(42)}=` }).success).toBe(
      false,
    );
    expect(completarLeadSchema.safeParse({ ...base, token: `${'-_'.repeat(21)}A` }).success).toBe(
      true,
    );
  });
});
