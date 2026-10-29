import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { DemoCliente } from '../cliente/DemoCliente';
import { getEstadoDemo, reiniciarStoreDemo, simularPedido } from '../store';
import { PanelDuenio } from './PanelDuenio';

/** Las dos caras a la vez, como en la pantalla dividida de escritorio. */
function Ambas() {
  return (
    <>
      <DemoCliente />
      <PanelDuenio />
    </>
  );
}

const panel = () => screen.getByTestId('panel-duenio');
const columna = (nombre: string) =>
  within(panel()).getByRole('region', { name: new RegExp(nombre) });

async function pedirFaina(user: ReturnType<typeof userEvent.setup>) {
  const carta = screen.getByTestId('demo-cliente');
  await user.click(within(carta).getByRole('button', { name: /fainá/i }));
  await user.click(screen.getByRole('button', { name: /agregar/i }));
  await user.click(within(carta).getByRole('button', { name: /ver mi pedido/i }));
  await user.click(screen.getByRole('button', { name: 'Seguir' }));
  await user.type(screen.getByRole('textbox', { name: /tu nombre/i }), 'Julián');
  await user.click(screen.getByRole('button', { name: /confirmar/i }));
}

describe('PanelDuenio + DemoCliente: sincronización cliente ↔ dueño', () => {
  beforeEach(() => reiniciarStoreDemo());

  it('sin pedidos muestra el hueco del estado vacío', () => {
    render(<PanelDuenio />);
    expect(within(panel()).getByText('Acá encaja tu primer pedido.')).toBeInTheDocument();
  });

  it('el pedido del cliente aparece en "Nuevos", se anuncia, y el avance vuelve al cliente', async () => {
    const user = userEvent.setup();
    render(<Ambas />);
    await pedirFaina(user);

    const nuevo = within(columna('Nuevos')).getByRole('article', { name: '#1' });
    expect(nuevo).toHaveTextContent('Mesa 4 · Julián');
    expect(nuevo).toHaveTextContent('1× Fainá');
    // Anuncio para lectores de pantalla (región aria-live).
    expect(await within(panel()).findByText('Entró el pedido #1: Mesa 4.')).toBeInTheDocument();

    await user.click(
      within(nuevo).getByRole('button', { name: 'Empezar a preparar el pedido #1' }),
    );
    expect(within(columna('Preparando')).getByRole('article', { name: '#1' })).toBeInTheDocument();
    // El cliente lo ve en su seguimiento.
    const carta = screen.getByTestId('demo-cliente');
    expect(within(carta).getByText('Lo están preparando.')).toBeInTheDocument();
    expect(within(carta).getByRole('listitem', { current: 'step' })).toHaveTextContent(
      'En preparación',
    );
    expect(await within(panel()).findByText('Pedido #1: preparando.')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Marcar como listo el pedido #1' }));
    expect(within(carta).getByText('Está listo: ya te lo llevan a la mesa.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Marcar como entregado el pedido #1' }));
    expect(within(columna('Entregados')).getByRole('article', { name: '#1' })).toHaveTextContent(
      'Entregado',
    );
    expect(within(carta).getByText('¡Que lo disfrutes!')).toBeInTheDocument();
  });

  it('el resumen se calcula con los pedidos de la demo', async () => {
    render(<PanelDuenio />);
    act(() => {
      simularPedido();
      simularPedido();
    });
    const datos = within(panel())
      .getAllByRole('definition')
      .map((d) => d.textContent);
    expect(datos[0]).toBe('2');
    expect(datos[1]).toBe('2');
    expect(datos[2]).toBe('0');
    expect(
      within(panel()).getByText('Calculado con los pedidos de esta demo.'),
    ).toBeInTheDocument();
  });

  it('filtra por cómo se recibe', async () => {
    const user = userEvent.setup();
    render(<PanelDuenio />);
    act(() => {
      // Pizzería: delivery, retiro, mesa.
      simularPedido();
      simularPedido();
      simularPedido();
    });
    expect(within(panel()).getAllByRole('article')).toHaveLength(3);
    await user.click(within(panel()).getByRole('radio', { name: 'Delivery' }));
    const visibles = within(panel()).getAllByRole('article');
    expect(visibles).toHaveLength(1);
    expect(visibles[0]).toHaveTextContent('Delivery');
  });

  it('cancelar manda el pedido a terminados', async () => {
    const user = userEvent.setup();
    render(<PanelDuenio />);
    act(() => void simularPedido());
    await user.click(within(panel()).getByRole('button', { name: 'Cancelar el pedido #1' }));
    expect(within(columna('Entregados')).getByRole('article', { name: '#1' })).toHaveTextContent(
      'Cancelado',
    );
    expect(getEstadoDemo().pedidos[0]?.estado).toBe('cancelado');
  });

  it('la comanda se abre en una hoja, sin precios', async () => {
    const user = userEvent.setup();
    render(<PanelDuenio />);
    act(() => void simularPedido());
    await user.click(within(panel()).getByRole('button', { name: 'Ver la comanda del pedido #1' }));
    const hoja = screen.getByRole('dialog', { name: 'Comanda #1' });
    expect(hoja).toHaveTextContent('Muzzarella');
    expect(hoja).not.toHaveTextContent('$');
    expect(within(hoja).getByRole('button', { name: /imprimir/i })).toBeInTheDocument();
  });

  it('el sonido arranca apagado', () => {
    render(<PanelDuenio />);
    expect(within(panel()).getByRole('button', { name: /sonido/i })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });
});
