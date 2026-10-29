import { describe, expect, it } from 'vitest';
import { pesos } from './dinero';
import { calcularTotales, subtotalItem } from './totales';

const items = [
  { precioUnitario: pesos(13_500), cantidad: 2 }, // 27.000
  { precioUnitario: pesos(1_800), cantidad: 3 }, // 5.400
];

describe('totales del pedido', () => {
  it('subtotal de línea = unitario × cantidad', () => {
    expect(subtotalItem({ precioUnitario: pesos(1_900), cantidad: 6 })).toBe(pesos(11_400));
  });

  it('sin propina ni envío, el total es el subtotal', () => {
    const t = calcularTotales(items, {
      propinaPorcentaje: 0,
      modalidad: 'retiro',
      costoEnvio: pesos(2_000),
    });
    expect(t).toEqual({ subtotal: pesos(32_400), propina: 0, envio: 0, total: pesos(32_400) });
  });

  it('la propina se calcula sobre el subtotal, no sobre el envío', () => {
    const t = calcularTotales(items, {
      propinaPorcentaje: 10,
      modalidad: 'delivery',
      costoEnvio: pesos(2_000),
    });
    expect(t.propina).toBe(pesos(3_240));
    expect(t.envio).toBe(pesos(2_000));
    expect(t.total).toBe(pesos(32_400 + 3_240 + 2_000));
  });

  it('el envío solo se cobra en delivery', () => {
    for (const modalidad of ['retiro', 'mesa'] as const) {
      expect(
        calcularTotales(items, { propinaPorcentaje: 0, modalidad, costoEnvio: pesos(2_000) }).envio,
      ).toBe(0);
    }
  });

  it('redondea la propina al centavo (15 % de $ 10,05 = $ 1,51)', () => {
    const t = calcularTotales([{ precioUnitario: 1_005, cantidad: 1 }], {
      propinaPorcentaje: 15,
      modalidad: 'retiro',
      costoEnvio: 0,
    });
    expect(t.propina).toBe(151);
    expect(Number.isInteger(t.total)).toBe(true);
  });
});
