import { describe, expect, it } from 'vitest';
import { esIlustracion } from '@/brand/ilustracion/dibujos/ids';
import { combinaciones } from '@/brand/tokens/colores';
import { MODULO_IDS } from '@/content/modulos';
import { getRubro } from '@/content/rubros';
import { esCentavos } from '@/domain/pedidos/dinero';
import { armarPedido } from '@/domain/pedidos/schemas';
import { contraste } from '@/lib/color';
import {
  COCINA_IDS,
  COCINA_POR_DEFECTO,
  COCINAS,
  getCocina,
  getPaletaDemo,
  LOCAL_DEMO,
  MODULOS_DEMO,
  PALETA_DEMO_POR_DEFECTO,
  PALETAS_DEMO,
  RUBRO_DEMO,
  TENANT_DEMO,
} from '@/content/demos/gastronomia';

const duplicados = (xs: string[]) => xs.filter((x, i) => xs.indexOf(x) !== i);

describe.each(COCINA_IDS.map((id) => [id, COCINAS[id]] as const))('cocina %s', (id, cocina) => {
  const { categorias, productos } = cocina.menu;

  it('tiene id coherente, nombres y una carta de tamaño razonable', () => {
    expect(cocina.id).toBe(id);
    expect(cocina.nombre.length).toBeGreaterThan(0);
    expect(cocina.nombreLocalPorDefecto).toMatch(/^Tu /);
    expect(categorias.length).toBeGreaterThanOrEqual(3);
    expect(productos.length).toBeGreaterThanOrEqual(8);
  });

  it('ids únicos y cada plato en una categoría existente; ninguna categoría vacía', () => {
    expect(duplicados(categorias.map((c) => c.id))).toEqual([]);
    expect(duplicados(productos.map((p) => p.id))).toEqual([]);
    const ids = new Set(categorias.map((c) => c.id));
    for (const p of productos) expect(ids.has(p.categoriaId), p.id).toBe(true);
    for (const c of categorias) {
      expect(
        productos.some((p) => p.categoriaId === c.id),
        c.id,
      ).toBe(true);
    }
  });

  it('precios en centavos enteros: platos > 0, opciones ≥ 0, envío ≥ 0', () => {
    expect(esCentavos(cocina.costoEnvio) && cocina.costoEnvio >= 0).toBe(true);
    for (const p of productos) {
      expect(esCentavos(p.precio) && p.precio > 0, p.id).toBe(true);
      for (const g of p.modificadores) {
        for (const o of g.opciones) {
          expect(esCentavos(o.precio) && o.precio >= 0, `${p.id}/${g.id}/${o.id}`).toBe(true);
        }
      }
    }
  });

  it('modificadores bien formados', () => {
    for (const p of productos) {
      expect(duplicados(p.modificadores.map((g) => g.id)), p.id).toEqual([]);
      for (const g of p.modificadores) {
        expect(g.opciones.length, `${p.id}/${g.id}`).toBeGreaterThanOrEqual(2);
        expect(duplicados(g.opciones.map((o) => o.id)), `${p.id}/${g.id}`).toEqual([]);
        // "Obligatorio" solo tiene sentido en grupos de una sola opción.
        if (g.obligatorio) expect(g.tipo, `${p.id}/${g.id}`).toBe('unico');
      }
    }
  });

  it('cada plato tiene una ilustración propia existente', () => {
    for (const p of productos)
      expect(esIlustracion(p.ilustracion), `${p.id}: ${p.ilustracion}`).toBe(true);
  });

  it('los pedidos de ejemplo pasan la misma validación que uno real', () => {
    expect(cocina.pedidosEjemplo.length).toBeGreaterThanOrEqual(3);
    // Al menos uno por modalidad, para que el panel muestre las tres.
    expect(new Set(cocina.pedidosEjemplo.map((p) => p.modalidad))).toEqual(
      new Set(['retiro', 'delivery', 'mesa']),
    );
    for (const entrada of cocina.pedidosEjemplo) {
      const r = armarPedido(cocina.menu, entrada, {
        tenantId: TENANT_DEMO,
        localId: LOCAL_DEMO,
        costoEnvio: cocina.costoEnvio,
      });
      expect(r.ok ? [] : r.errores).toEqual([]);
    }
  });
});

describe('paletas de la demo', () => {
  it('son 6, con ids únicos, y la por defecto es Brasa', () => {
    expect(PALETAS_DEMO).toHaveLength(6);
    expect(duplicados(PALETAS_DEMO.map((p) => p.id))).toEqual([]);
    expect(PALETA_DEMO_POR_DEFECTO).toBe('brasa');
    expect(getPaletaDemo('no-existe').id).toBe('brasa');
  });

  it.each(PALETAS_DEMO.map((p) => [p.nombre, p] as const))(
    '%s pasa AA en todas las combinaciones',
    (_n, p) => {
      for (const c of combinaciones(p)) {
        expect(contraste(c.texto, c.fondo), `${p.nombre}: ${c.nombre}`).toBeGreaterThanOrEqual(
          c.minimo,
        );
      }
    },
  );

  it('el error nunca se parece al acento', () => {
    // Si el acento es rosado, el error pasa a naranja (y viceversa): tienen que diferir bastante.
    for (const p of PALETAS_DEMO) expect(p.danger, p.nombre).not.toBe(p.accent);
    expect(getPaletaDemo('frutilla').danger).not.toBe(getPaletaDemo('brasa').danger);
  });
});

describe('conexión con /empezar', () => {
  it('el rubro y los módulos del CTA existen', () => {
    expect(getRubro(RUBRO_DEMO)?.id).toBe('gastronomia');
    for (const m of MODULOS_DEMO) expect(MODULO_IDS).toContain(m);
  });

  it('una cocina desconocida cae en la por defecto', () => {
    expect(getCocina('sushi').id).toBe(COCINA_POR_DEFECTO);
    expect(getCocina(null).id).toBe(COCINA_POR_DEFECTO);
  });

  it('el tenant de la demo no parece un id real', () => {
    expect(TENANT_DEMO).toBe('demo');
  });
});
