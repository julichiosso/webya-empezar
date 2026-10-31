import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MODULO_IDS } from '@/content/modulos';
import { ModuloArte } from '@/brand/ilustracion/modulos/ModuloArte';
import { MarcoDispositivo } from './MarcoDispositivo';
import { PreviewPanel } from './PreviewPanel';

describe('PreviewPanel', () => {
  it('dibuja siempre todos los módulos (altura estable) y enciende solo los activos', () => {
    render(
      <PreviewPanel
        rubroNombre="Comercio y tienda"
        rubroIcono="tienda"
        activos={['catalogo', 'pagos']}
      />,
    );
    const panel = screen.getByTestId('negocio-preview-panel');
    const items = within(panel).getAllByRole('listitem', { hidden: true });
    expect(items).toHaveLength(MODULO_IDS.length);
    expect(items.filter((li) => li.getAttribute('data-on') === 'true')).toHaveLength(2);
    expect(within(panel).getByText('Comercio y tienda')).toBeInTheDocument();
    expect(within(panel).getByText('2 módulos')).toBeInTheDocument();
  });

  it('sin rubro ni módulos muestra el estado vacío: huecos punteados esperando sus piezas', () => {
    render(<PreviewPanel activos={[]} />);
    const panel = screen.getByTestId('negocio-preview-panel');
    expect(within(panel).getByText('Tu negocio')).toBeInTheDocument();
    expect(within(panel).getByText('Acá encajan tus módulos')).toBeInTheDocument();
    const items = within(panel).getAllByRole('listitem', { hidden: true });
    expect(items.every((li) => li.className.includes('border-dashed'))).toBe(true);
  });

  it('un módulo encendido deja de ser hueco', () => {
    render(<PreviewPanel activos={['pagos']} />);
    const items = within(screen.getByTestId('negocio-preview-panel')).getAllByRole('listitem', {
      hidden: true,
    });
    const pagos = items.find((li) => li.getAttribute('data-on') === 'true');
    expect(pagos?.className).not.toContain('border-dashed');
    expect(pagos?.className).toContain('border-accent');
  });

  it('es decorativa: está oculta a lectores de pantalla', () => {
    render(<PreviewPanel activos={['turnos']} />);
    expect(screen.getByTestId('negocio-preview-panel')).toHaveAttribute('aria-hidden', 'true');
  });
});

describe('MarcoDispositivo', () => {
  it.each(['celular', 'escritorio'] as const)(
    '%s: proporción fija (el marco vacío mide lo mismo que el lleno) y su leyenda',
    (d) => {
      const { container } = render(
        <MarcoDispositivo dispositivo={d} leyenda="Textos de ejemplo" />,
      );
      expect(container.querySelector(`[data-marco="${d}"]`)).not.toBeNull();
      expect(container.querySelector('[class*="aspect-"]')).not.toBeNull();
      expect(screen.getByText('Textos de ejemplo')).toBeInTheDocument();
    },
  );
});

describe('ModuloArte', () => {
  it.each(MODULO_IDS)('%s: SVG decorativo, sin texto', (id) => {
    const { container } = render(<ModuloArte id={id} activo />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg?.textContent).toBe('');
    expect(svg?.querySelectorAll('rect, circle').length).toBeGreaterThan(2);
  });
});
