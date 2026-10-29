import { beforeEach, describe, expect, it } from 'vitest';
import { COCINAS, MODULOS_DEMO, NOMBRES_COCINA } from '@/config/demos/gastronomia';
import {
  datosParaWizard,
  linkWhatsAppDemo,
  personalizacionDeUrl,
  urlCompartible,
} from './compartir';
import {
  agregarAlCarrito,
  ESTADO_INICIAL_DEMO,
  getEstadoDemo,
  personalizar,
  reiniciarStoreDemo,
} from './store';

describe('personalización por URL (QR y WhatsApp)', () => {
  it('ida y vuelta: lo que se comparte es lo que se lee', () => {
    const url = urlCompartible('https://webya.ar', {
      nombreLocal: 'Lo de Tito & Cía',
      paletaId: 'pileta',
      cocinaId: 'parrilla',
    });
    expect(url).toMatch(/^https:\/\/webya\.ar\/demo\/gastronomia\?/);
    expect(personalizacionDeUrl(new URL(url).search)).toEqual({
      nombreLocal: 'Lo de Tito & Cía',
      paletaId: 'pileta',
      cocinaId: 'parrilla',
    });
  });

  it('ignora valores desconocidos y recorta el nombre', () => {
    expect(personalizacionDeUrl('?paleta=arcoiris&cocina=sushi')).toEqual({});
    expect(personalizacionDeUrl(`?local=${'x'.repeat(100)}`).nombreLocal).toHaveLength(40);
    expect(personalizacionDeUrl('?local=%20%20')).toEqual({});
  });

  it('el link de WhatsApp no lleva número (la persona elige a quién) y aclara que es demo', () => {
    const link = linkWhatsAppDemo('https://webya.ar/demo/gastronomia?paleta=brasa', 'Lo de Tito');
    expect(link.startsWith('https://wa.me/?text=')).toBe(true);
    const texto = decodeURIComponent(link.split('text=')[1] ?? '');
    expect(texto).toContain('Lo de Tito');
    expect(texto).toContain('demo con datos de ejemplo');
    expect(texto).toContain('https://webya.ar/demo/gastronomia?paleta=brasa');
  });

  it('el CTA lleva rubro, módulos, nombre, origen y lo armado; sin nombre no inventa uno', () => {
    expect(
      datosParaWizard({ nombreLocal: 'Lo de Tito', paletaId: 'ciruela', cocinaId: 'cafe' }),
    ).toEqual({
      origen: 'demo_gastronomia',
      rubro: 'gastronomia',
      modulos: MODULOS_DEMO,
      nombreNegocio: 'Lo de Tito',
      demo: { paleta: 'ciruela', cocina: 'cafe' },
    });
    expect(datosParaWizard(ESTADO_INICIAL_DEMO).nombreNegocio).toBe('');
  });

  it('los nombres livianos de las cocinas coinciden con la config', () => {
    for (const [id, nombre] of Object.entries(NOMBRES_COCINA)) {
      expect(COCINAS[id as keyof typeof COCINAS].nombre).toBe(nombre);
    }
  });
});

describe('personalizar', () => {
  beforeEach(() => reiniciarStoreDemo());

  it('cambia nombre, paleta y cocina; ignora lo desconocido', () => {
    personalizar({ nombreLocal: 'Lo de Tito', paletaId: 'pileta', cocinaId: 'cafe' });
    expect(getEstadoDemo()).toMatchObject({
      nombreLocal: 'Lo de Tito',
      paletaId: 'pileta',
      cocinaId: 'cafe',
    });
    personalizar({ paletaId: 'arcoiris' });
    expect(getEstadoDemo().paletaId).toBe('pileta');
  });

  it('un nombre vacío vuelve al nombre por defecto', () => {
    personalizar({ nombreLocal: 'Lo de Tito' });
    personalizar({ nombreLocal: '   ' });
    expect(getEstadoDemo().nombreLocal).toBeNull();
  });

  it('cambiar de cocina vacía el carrito (los platos de otra carta no existen)', () => {
    agregarAlCarrito({ productoId: 'faina', cantidad: 1, modificadores: [] });
    personalizar({ cocinaId: 'pizzeria' }); // misma cocina: no toca nada
    expect(getEstadoDemo().carrito).toHaveLength(1);
    personalizar({ cocinaId: 'parrilla' });
    expect(getEstadoDemo().carrito).toEqual([]);
  });
});
