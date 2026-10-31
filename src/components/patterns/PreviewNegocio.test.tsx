import { render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PREVIEW } from '@/content/empezar/preview';
import { getModulo } from '@/content/modulos';
import { getPaletaCurada, PALETAS_CURADAS } from '@/content/paletas';
import { getPlantilla, RUBRO_OTRO_ID, RUBROS_CON_VISTA_PREVIA } from '@/content/rubros';
import type { Dispositivo } from './MarcoDispositivo';
import { PreviewNegocio } from './PreviewNegocio';
import { precargarPreviewNegocio, PreviewNegocioDiferido } from './PreviewNegocioDiferido';

const DISPOSITIVOS: Dispositivo[] = ['celular', 'escritorio'];

const casos = RUBROS_CON_VISTA_PREVIA.flatMap((r) =>
  DISPOSITIVOS.map((d) => [r.id, d, r] as const),
);

const vista = () => screen.getByTestId('preview-negocio');
const huecos = () => vista().querySelectorAll('[data-hueco]');

describe.each(casos)('PreviewNegocio — %s en %s', (id, dispositivo, rubro) => {
  const plantilla = rubro.plantilla!;
  const dibujar = (extra: Partial<Parameters<typeof PreviewNegocio>[0]> = {}) =>
    render(
      <PreviewNegocio
        rubro={id}
        nombre="Luna Peluquería"
        dispositivo={dispositivo}
        modulos={rubro.modulosSugeridos}
        {...extra}
      />,
    );

  it('dibuja el nombre, la portada y cada sección dentro del marco del dispositivo', () => {
    dibujar();
    const v = vista();
    expect(v).toHaveAttribute('data-dispositivo', dispositivo);
    expect(v.querySelector(`[data-marco="${dispositivo}"]`)).not.toBeNull();
    expect(within(v).getAllByText('Luna Peluquería', { exact: true }).length).toBeGreaterThan(0);
    expect(within(v).getByText(plantilla.portada.bajada)).toBeInTheDocument();
    expect(within(v).getByText(plantilla.portada.accion.texto)).toBeInTheDocument();
    for (const s of plantilla.secciones) {
      expect(within(v).getAllByText(s.titulo).length, s.titulo).toBeGreaterThan(0);
    }
    // Una pieza por la portada y una por sección.
    expect(v.querySelectorAll('[data-pieza]')).toHaveLength(plantilla.secciones.length + 1);
  });

  it('es decorativa, avisa que los textos son de ejemplo y no tiene nada enfocable', () => {
    dibujar();
    const v = vista();
    expect(v).toHaveAttribute('aria-hidden', 'true');
    expect(within(v).getByText(PREVIEW.deEjemplo)).toBeInTheDocument();
    expect(v.querySelectorAll('a, button, input, select, textarea, [tabindex]')).toHaveLength(0);
  });

  it('con los módulos sugeridos no queda ningún hueco', () => {
    dibujar();
    expect(huecos()).toHaveLength(0);
    expect(vista().querySelectorAll('[data-on="false"]')).toHaveLength(0);
  });

  it('sin módulos, lo que depende de uno queda como hueco "Acá encaja…" (el resto sigue)', () => {
    dibujar({ modulos: [] });
    const v = vista();
    expect(within(v).getByText(plantilla.portada.accionSinModulo)).toBeInTheDocument();
    expect(within(v).queryByText(plantilla.portada.accion.texto)).toBeNull();
    const conModulo = plantilla.secciones.filter((s) => s.modulo).length;
    expect(huecos().length).toBeGreaterThanOrEqual(conModulo);
    for (const s of plantilla.secciones.filter((x) => x.modulo)) {
      const nombre = getModulo(s.modulo!).nombre;
      expect(within(v).getAllByText(PREVIEW.hueco(nombre)).length, s.titulo).toBeGreaterThan(0);
    }
    // El contenido del hueco sigue ahí, invisible: mismo tamaño, nada se mueve.
    for (const h of huecos()) {
      expect(h.previousElementSibling?.className).toContain('invisible');
    }
  });

  it('sin nombre usa el de ejemplo de la plantilla', () => {
    dibujar({ nombre: '   ' });
    expect(within(vista()).getAllByText(plantilla.portada.tituloDeEjemplo).length).toBeGreaterThan(
      0,
    );
  });

  it('las piezas encajan una vez, escalonadas; con movimiento reducido, quietas', () => {
    const { unmount } = dibujar();
    const piezas = [...vista().querySelectorAll<HTMLElement>('[data-pieza]')];
    expect(piezas.every((p) => p.classList.contains('snap'))).toBe(true);
    expect(piezas.map((p) => p.style.getPropertyValue('--i'))).toEqual(
      piezas.map((_, i) => String(i)),
    );
    unmount();
    dibujar({ animar: false });
    expect(vista()).toHaveAttribute('data-animado', 'false');
    expect(vista().querySelectorAll('.snap, .pieza-escalonada')).toHaveLength(0);
    expect(vista().querySelectorAll('[style*="--i"]')).toHaveLength(0);
  });
});

describe('PreviewNegocio — paleta, ciudad y casos borde', () => {
  const base = {
    rubro: 'gastronomia',
    nombre: 'La Esquina',
    dispositivo: 'celular' as const,
    modulos: getPlantilla('gastronomia') ? (['carta_qr', 'pedidos'] as const) : [],
  };

  it.each(PALETAS_CURADAS.map((p) => p.id))(
    'aplica la paleta %s con variables CSS en el contenedor',
    (id) => {
      render(<PreviewNegocio {...base} paleta={id} />);
      const v = vista();
      expect(v).toHaveAttribute('data-paleta', id);
      expect(v.style.getPropertyValue('--accent')).toBe(getPaletaCurada(id).accent);
      // Ninguna pieza lleva colores en línea: solo el contenedor redefine las variables.
      for (const el of v.querySelectorAll<HTMLElement>('[style]')) {
        expect(el.getAttribute('style')).not.toMatch(/#|rgb/);
      }
    },
  );

  it('una paleta desconocida cae en la por defecto', () => {
    render(<PreviewNegocio {...base} paleta="gris" />);
    expect(vista()).toHaveAttribute('data-paleta', 'brasa');
  });

  it('la ciudad reemplaza el "Cómo llegar" del contacto', () => {
    render(<PreviewNegocio {...base} ciudad="San Jorge" />);
    expect(within(vista()).getByText('San Jorge')).toBeInTheDocument();
  });

  it('"otro" no tiene vista previa', () => {
    const { container } = render(<PreviewNegocio {...base} rubro={RUBRO_OTRO_ID} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('un módulo apagado deja su hueco y el resto encendido', () => {
    render(<PreviewNegocio {...base} />);
    const v = vista();
    // Pagos y avisos apagados: sus detalles son huecos; la carta y los "+" de pedido, no.
    expect(within(v).getByText(PREVIEW.hueco(getModulo('pagos').nombre))).toBeInTheDocument();
    expect(v.querySelectorAll('[data-modulo="pedidos"][data-on="true"]').length).toBe(3);
    expect(v.querySelector('[data-modulo="carta_qr"][data-on="true"]')).not.toBeNull();
  });
});

describe('PreviewNegocioDiferido', () => {
  afterEach(() => vi.unstubAllGlobals());

  const props = {
    rubro: 'comercio',
    nombre: 'Tienda Sol',
    dispositivo: 'escritorio' as const,
    modulos: ['catalogo'] as const,
  };

  function movimientoReducido(reducido: boolean) {
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockImplementation((q: string) => ({
        matches: reducido && q.includes('reduce'),
        media: q,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    );
  }

  it('precargar pide el módulo una sola vez', () => {
    expect(precargarPreviewNegocio()).toBe(precargarPreviewNegocio());
  });

  it('llega descargada aparte y anima por defecto', async () => {
    movimientoReducido(false);
    render(<PreviewNegocioDiferido {...props} />);
    const v = await screen.findByTestId('preview-negocio');
    expect(v).toHaveAttribute('data-animado', 'true');
    expect(within(v).getAllByText('Tienda Sol').length).toBeGreaterThan(0);
  });

  it('con prefers-reduced-motion las piezas aparecen quietas', async () => {
    movimientoReducido(true);
    render(<PreviewNegocioDiferido {...props} />);
    const v = await screen.findByTestId('preview-negocio');
    expect(v).toHaveAttribute('data-animado', 'false');
    expect(v.querySelectorAll('.snap')).toHaveLength(0);
  });
});
