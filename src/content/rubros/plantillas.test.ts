import { describe, expect, it } from 'vitest';
import { DURACIONES_MS, entraEnPresupuesto, PRESUPUESTO } from '@/brand/motion/presets';
import { PROHIBIDAS } from '@/brand/voz/diccionario';
import {
  getPlantilla,
  modulosDePlantilla,
  RUBRO_OTRO_ID,
  RUBROS,
  RUBROS_CON_VISTA_PREVIA,
  textosDePlantilla,
} from './index';
import { LIMITES_PLANTILLA as L, type PlantillaRubro, type SeccionPlantilla } from './types';

// Genéricos: validan la plantilla de CADA rubro, así que sumar uno no requiere tests nuevos.
const ID_VALIDO = /^[a-z][a-z0-9]*(_[a-z0-9]+)*$/;

const entre = (n: number, min: number, max: number) => n >= min && n <= max;

/** Cada texto con su límite, para que el error diga cuál se pasó. */
function largos(p: PlantillaRubro): [string, number][] {
  const { portada } = p;
  const salida: [string, number][] = [
    [portada.tituloDeEjemplo, L.tituloDeEjemplo],
    [portada.bajada, L.bajada],
    [portada.accion.texto, L.accion],
    [portada.accionSinModulo, L.accion],
  ];
  if (portada.detalle) salida.push([portada.detalle.texto, L.detalle]);
  const porSeccion = (s: SeccionPlantilla): [string, number][] => {
    const base: [string, number][] = [[s.titulo, L.tituloSeccion]];
    if (s.detalle) base.push([s.detalle.texto, L.detalle]);
    switch (s.tipo) {
      case 'lista':
        return [
          ...base,
          ...s.items.flatMap((i): [string, number][] => [
            [i.nombre, L.item],
            [i.detalle ?? '', L.detalleItem],
          ]),
        ];
      case 'agenda':
        return [
          ...base,
          ...s.dias.map((d): [string, number] => [d, L.dia]),
          ...s.franjas.map((f): [string, number] => [f, L.franja]),
        ];
      case 'formulario':
        return [
          ...base,
          ...s.campos.map((c): [string, number] => [c, L.campo]),
          [s.accion, L.accion],
        ];
      case 'horarios':
        return [
          ...base,
          ...s.filas.flatMap((f): [string, number][] => [
            [f.dias, L.horarioDias],
            [f.horario, L.horario],
          ]),
        ];
      case 'contacto':
        return [...base, [s.whatsapp, L.contacto], [s.ubicacion, L.contacto]];
    }
  };
  return [...salida, ...p.secciones.flatMap(porSeccion)];
}

describe('plantillas de la vista previa', () => {
  it('los 6 rubros con vista previa tienen plantilla; "otro" no (se arma a medida)', () => {
    expect(RUBROS_CON_VISTA_PREVIA.map((r) => r.id)).toEqual([
      'peluqueria_estetica',
      'gastronomia',
      'comercio',
      'profesionales',
      'gimnasio_deportes',
      'servicios_tecnicos',
    ]);
    for (const r of RUBROS) expect(Boolean(r.plantilla), r.id).toBe(r.id !== RUBRO_OTRO_ID);
    expect(getPlantilla(RUBRO_OTRO_ID)).toBeUndefined();
    expect(getPlantilla('inexistente')).toBeUndefined();
  });

  describe.each(RUBROS_CON_VISTA_PREVIA.map((r) => [r.id, r] as const))('%s', (_id, rubro) => {
    const p = rubro.plantilla!;

    it('marca sus textos como de ejemplo y nombra su ilustración', () => {
      expect(p.deEjemplo).toBe(true);
      expect(p.ilustracion).toMatch(ID_VALIDO);
    });

    it('arma entre 3 y 5 secciones, sin títulos repetidos y dentro del presupuesto de animación', () => {
      expect(entre(p.secciones.length, L.minSecciones, L.maxSecciones)).toBe(true);
      const titulos = p.secciones.map((s) => s.titulo);
      expect(new Set(titulos).size).toBe(titulos.length);
      // Piezas que encajan: la portada y cada sección.
      const piezas = p.secciones.length + 1;
      expect(piezas).toBeLessThanOrEqual(PRESUPUESTO.maxPiezas);
      expect(entraEnPresupuesto(piezas, DURACIONES_MS.base)).toBe(true);
    });

    it('cada sección respeta sus cantidades', () => {
      for (const s of p.secciones) {
        if (s.tipo === 'lista')
          expect(entre(s.items.length, L.minItems, L.maxItems), s.titulo).toBe(true);
        if (s.tipo === 'agenda') {
          expect(entre(s.dias.length, L.minDias, L.maxDias), s.titulo).toBe(true);
          expect(entre(s.franjas.length, L.minFranjas, L.maxFranjas), s.titulo).toBe(true);
        }
        if (s.tipo === 'formulario') expect(s.campos.length, s.titulo).toBe(L.campos);
        if (s.tipo === 'horarios')
          expect(entre(s.filas.length, L.minFilas, L.maxFilas), s.titulo).toBe(true);
      }
      for (const tipo of ['horarios', 'contacto'] as const) {
        expect(p.secciones.filter((s) => s.tipo === tipo).length, tipo).toBeLessThanOrEqual(1);
      }
    });

    it('solo usa módulos que el rubro sugiere (así, por defecto, no queda ningún hueco)', () => {
      const usados = modulosDePlantilla(p);
      expect(usados.length).toBeGreaterThan(0);
      for (const m of usados) expect(rubro.modulosSugeridos, m).toContain(m);
    });

    it('respeta los límites de texto', () => {
      for (const [texto, max] of largos(p)) {
        expect(texto.length, texto).toBeLessThanOrEqual(max);
      }
      for (const t of textosDePlantilla(p)) expect(t.trim(), t).toBe(t);
    });

    it('sin cifras, precios, promesas ni superlativos', () => {
      for (const t of textosDePlantilla(p)) {
        expect(t).not.toMatch(/\d|\$|USD|ARS|gratis|garant/i);
        for (const r of PROHIBIDAS) expect(t, String(r)).not.toMatch(r);
      }
    });
  });
});

describe('helpers de plantilla', () => {
  it('modulosDePlantilla junta portada, secciones, ítems y detalles sin repetir', () => {
    expect(modulosDePlantilla(getPlantilla('gastronomia')!)).toEqual([
      'carta_qr',
      'pagos',
      'notificaciones',
      'pedidos',
    ]);
  });

  it('textosDePlantilla incluye los de cada tipo de sección', () => {
    const textos = textosDePlantilla(getPlantilla('peluqueria_estetica')!);
    expect(textos).toEqual(
      expect.arrayContaining(['Tu peluquería', 'Servicios', 'Mar', 'Mañana', 'Martes a sábado']),
    );
  });
});
