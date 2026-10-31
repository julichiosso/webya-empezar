import { describe, expect, it } from 'vitest';
import { ordenDeUrl } from '@/config/experimentos';
import { MENSAJE_WHATSAPP } from '@/content/whatsapp';
import { urlDemoConDatos } from '@/domain/traspaso/demo-wizard';
import {
  ESTADO_INICIAL,
  modulosDe,
  pantallaDe,
  pasoAnterior,
  pasoCoherente,
  reducer,
  type WizardState,
} from './state';

const LEAD = { id: 'abc-123', token: 'a'.repeat(43) };
const base = { rubro: 'comercio', necesidadLibre: '', lead: null, completo: false };

describe('pasoCoherente: nunca un paso al que no se pudo haber llegado', () => {
  it('sin rubro, siempre la pantalla 1', () => {
    expect(pasoCoherente('resultado', { ...base, rubro: null })).toBe('rubro');
    expect(pasoCoherente('cualquiera', base)).toBe('rubro');
  });

  it('la vista previa, completar y gracias exigen el lead guardado', () => {
    expect(pasoCoherente('resultado', base)).toBe('negocio');
    expect(pasoCoherente('completar', { ...base, lead: LEAD })).toBe('completar');
    expect(pasoCoherente('listo', { ...base, lead: LEAD })).toBe('resultado');
    expect(pasoCoherente('listo', { ...base, lead: LEAD, completo: true })).toBe('listo');
  });

  it('orden B: la vista previa sale sin lead; contacto solo sin lead y nunca con "Otro"', () => {
    const b = { ...base, orden: 'b' as const };
    expect(pasoCoherente('resultado', b)).toBe('resultado');
    expect(pasoCoherente('contacto', b)).toBe('contacto');
    expect(pasoCoherente('contacto', { ...b, lead: LEAD })).toBe('resultado');
    expect(pasoCoherente('completar', b)).toBe('resultado');
    expect(pasoCoherente('contacto', base)).toBe('resultado');
    expect(pasoCoherente('resultado', { ...b, rubro: 'otro', necesidadLibre: 'Turnos' })).toBe(
      'negocio',
    );
  });

  it('"Otro" sin pedido a medida vuelve a pedirlo; otro rubro no pasa por ahí', () => {
    const otro = { ...base, rubro: 'otro' };
    expect(pasoCoherente('negocio', otro)).toBe('aMedida');
    expect(pasoCoherente('negocio', { ...otro, necesidadLibre: 'Turnos' })).toBe('negocio');
    expect(pasoCoherente('aMedida', base)).toBe('negocio');
  });
});

describe('navegación', () => {
  it('cuenta 3 pantallas: el pedido a medida es parte de la primera', () => {
    expect(pantallaDe('rubro')).toBe(1);
    expect(pantallaDe('aMedida')).toBe(1);
    expect(pantallaDe('negocio')).toBe(2);
    expect(pantallaDe('resultado')).toBe(3);
    expect(pantallaDe('listo')).toBe(3);
  });

  it('"Atrás" no vuelve al formulario después de guardar el lead', () => {
    expect(pasoAnterior({ paso: 'rubro', rubro: null })).toBeNull();
    expect(pasoAnterior({ paso: 'negocio', rubro: 'comercio' })).toBe('rubro');
    expect(pasoAnterior({ paso: 'negocio', rubro: 'otro' })).toBe('aMedida');
    expect(pasoAnterior({ paso: 'resultado', rubro: 'comercio' })).toBeNull();
    expect(pasoAnterior({ paso: 'completar', rubro: 'comercio' })).toBe('resultado');
  });

  it('cambiar de rubro descarta lo decidido a mano sobre los módulos', () => {
    let s: WizardState = reducer(ESTADO_INICIAL, { tipo: 'elegirRubro', id: 'gastronomia' });
    s = reducer(s, { tipo: 'alternarModulo', id: 'carta_qr' });
    expect(modulosDe(s)).not.toContain('carta_qr');
    s = reducer(s, { tipo: 'elegirRubro', id: 'comercio' });
    expect(s.modulosManual).toEqual({});
    expect(modulosDe({ rubro: 'otro', modulosManual: {} })).toEqual([]);
  });
});

describe('salidas del flujo', () => {
  it('la demo se abre con el nombre y la paleta ya cargados', () => {
    expect(urlDemoConDatos({ local: ' Lo de Tito ', paleta: 'pileta' })).toBe(
      '/demo/gastronomia?local=Lo+de+Tito&paleta=pileta',
    );
    expect(urlDemoConDatos({})).toBe('/demo/gastronomia');
  });

  it('el mensaje del CTA lleva rubro, nombre y módulos (o el pedido a medida)', () => {
    const conPreview = MENSAJE_WHATSAPP.quieroEsto({
      nombreNegocio: 'Lo de Tito',
      rubro: 'Gastronomía',
      modulos: ['Carta con QR', 'Pedidos online'],
    });
    expect(conPreview).toContain('Lo de Tito (Gastronomía)');
    expect(conPreview).toContain('Me interesa: Carta con QR, Pedidos online.');
    const aMedida = MENSAJE_WHATSAPP.quieroEsto({
      nombreNegocio: 'Lavadero Sol',
      necesidadLibre: 'Turnos por WhatsApp',
    });
    expect(aMedida).toContain('Necesito esto: Turnos por WhatsApp.');
    expect(aMedida).not.toContain('Me interesa');
  });

  it('el orden del experimento sale de la URL solo si es válido', () => {
    expect(ordenDeUrl('?orden=b')).toBe('b');
    expect(ordenDeUrl('?orden=z')).toBe('a');
    expect(ordenDeUrl('')).toBe('a');
  });
});
