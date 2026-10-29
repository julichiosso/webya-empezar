import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MODULO_IDS } from '@/config/modulos';
import { ModuloArte } from './mini-web/ModuloArte';
import { PreviewPanel } from './PreviewPanel';

describe('PreviewPanel', () => {
  it('dibuja siempre los 7 módulos (altura estable) y enciende solo los activos', () => {
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

  it('sin rubro ni módulos muestra el estado vacío', () => {
    render(<PreviewPanel activos={[]} />);
    const panel = screen.getByTestId('negocio-preview-panel');
    expect(within(panel).getByText('Tu negocio')).toBeInTheDocument();
    expect(within(panel).getByText('Sin módulos todavía')).toBeInTheDocument();
  });

  it('es decorativa: está oculta a lectores de pantalla', () => {
    render(<PreviewPanel activos={['turnos']} />);
    expect(screen.getByTestId('negocio-preview-panel')).toHaveAttribute('aria-hidden', 'true');
  });
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
