import { describe, expect, it } from 'vitest';
import { crearEsquemasLead, type CatalogoLead, type MensajesLead } from './lead';

// El dominio no conoce los catálogos reales: con uno inventado tiene que validar contra ESE.
const catalogo: CatalogoLead = {
  rubroIds: ['kiosco', 'otro'],
  rubroOtroId: 'otro',
  esObjetivoDeRubro: (rubro, objetivo) => rubro === 'kiosco' && objetivo === 'vender',
  moduloIds: ['caja'],
  necesidadIds: ['vender', 'nada_mas'],
  necesidadOtraId: 'nada_mas',
  paletaDemoIds: ['gris'],
  cocinaDemoIds: ['sushi'],
};

const mensajes = new Proxy({} as MensajesLead, {
  get: (_t, clave) => (clave === 'hastaCaracteres' ? (n: number) => `max:${n}` : String(clave)),
});

const { leadPayloadSchema, leadParcialSchema, LIMITES } = crearEsquemasLead(catalogo, mensajes);

const valido = {
  nombreNegocio: 'Kiosco Sol',
  nombre: 'Ana',
  whatsapp: '11 2345 6789',
  email: '',
  mensaje: '',
  rubro: 'kiosco',
  modulos: ['caja'],
  objetivos: ['vender'],
};

describe('crearEsquemasLead (catálogo inyectado)', () => {
  it('valida contra el catálogo recibido', () => {
    expect(leadPayloadSchema.safeParse(valido).success).toBe(true);
    expect(leadPayloadSchema.safeParse({ ...valido, rubro: 'gastronomia' }).success).toBe(false);
    expect(leadPayloadSchema.safeParse({ ...valido, modulos: ['turnos'] }).success).toBe(false);
    expect(
      leadPayloadSchema.safeParse({ ...valido, demo: { paleta: 'gris', cocina: 'sushi' } }).success,
    ).toBe(true);
    expect(
      leadPayloadSchema.safeParse({ ...valido, demo: { paleta: 'brasa', cocina: 'sushi' } })
        .success,
    ).toBe(false);
  });

  it('usa los mensajes recibidos y el límite de módulos sale del catálogo', () => {
    const r = leadPayloadSchema.safeParse({ ...valido, rubro: 'nada' });
    expect(r.error?.issues.map((i) => i.message)).toEqual(['rubroInexistente']);
    expect(LIMITES.modulos).toBe(1);
  });

  it('el lead parcial valida necesidades y la que abre el texto libre contra el catálogo', () => {
    const base = { whatsapp: '11 2345 6789' };
    expect(leadParcialSchema.safeParse({ ...base, necesidades: ['vender'] }).success).toBe(true);
    expect(leadParcialSchema.safeParse({ ...base, necesidades: ['turnos'] }).success).toBe(false);
    const sinTexto = leadParcialSchema.safeParse({ ...base, necesidades: ['nada_mas'] });
    expect(sinTexto.error?.issues.map((i) => i.message)).toEqual(['necesidadLibreVacia']);
  });
});
