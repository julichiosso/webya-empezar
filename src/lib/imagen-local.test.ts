import { describe, expect, it } from 'vitest';
import { LADO_MAXIMO, medidasAjustadas, prepararImagen } from './imagen-local';

describe('imágenes locales de las demos', () => {
  it('achica respetando la proporción y nunca agranda', () => {
    expect(medidasAjustadas(4000, 3000)).toEqual({ ancho: LADO_MAXIMO, alto: 960 });
    expect(medidasAjustadas(800, 600)).toEqual({ ancho: 800, alto: 600 });
  });

  it('rechaza lo que no es imagen', async () => {
    const pdf = new File(['x'], 'menu.pdf', { type: 'application/pdf' });
    expect(await prepararImagen(pdf)).toEqual({ error: 'tipo' });
  });
});
