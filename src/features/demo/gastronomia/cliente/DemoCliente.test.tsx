import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { getEstadoDemo, reiniciarStoreDemo } from '../store';
import { DemoCliente } from './DemoCliente';

// Intl usa espacio duro entre el signo y el número.
const plata = (s: string) => new RegExp(s.replace('$ ', '\\$\\s'));

describe('DemoCliente: la carta del cliente', () => {
  beforeEach(() => reiniciarStoreDemo());

  it('muestra el local, las categorías y los platos con precio, y avisa que son de ejemplo', () => {
    render(<DemoCliente />);
    expect(screen.getByRole('heading', { name: 'Tu pizzería' })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Categorías de la carta' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /muzzarella.*13\.500/i })).toBeInTheDocument();
    expect(screen.getByText('Carta y precios de ejemplo.')).toBeInTheDocument();
  });

  it('el buscador filtra sin importar tildes y avisa si no hay resultados', async () => {
    const user = userEvent.setup();
    render(<DemoCliente />);
    const buscar = screen.getByRole('searchbox', { name: 'Buscar en la carta' });
    await user.type(buscar, 'faina');
    expect(screen.getByRole('button', { name: /fainá/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /muzzarella/i })).not.toBeInTheDocument();
    await user.clear(buscar);
    await user.type(buscar, 'sushi');
    expect(screen.getByRole('status')).toHaveTextContent('No encontramos “sushi”');
  });

  it('recorrido completo: plato con opciones → pedido → seguimiento', async () => {
    const user = userEvent.setup();
    render(<DemoCliente />);

    await user.click(screen.getByRole('button', { name: /^muzzarella/i }));
    const plato = screen.getByRole('dialog', { name: 'Muzzarella' });

    // Sin elegir el tamaño obligatorio, avisa y no agrega.
    await user.click(within(plato).getByRole('button', { name: /agregar/i }));
    expect(within(plato).getByText('Falta elegir tamaño.')).toBeInTheDocument();
    expect(within(plato).getByRole('radio', { name: /mediana/i })).toHaveFocus();

    await user.click(within(plato).getByRole('radio', { name: /grande/i }));
    await user.click(within(plato).getByRole('checkbox', { name: /extra queso/i }));
    await user.click(within(plato).getByRole('button', { name: 'Sumar uno de Muzzarella' }));
    // (13.500 + 3.500 + 2.500) × 2
    expect(within(plato).getByRole('button', { name: /agregar/i })).toHaveTextContent(
      plata('$ 39.000'),
    );
    await user.click(within(plato).getByRole('button', { name: /agregar/i }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /ver mi pedido/i }));
    const pedido = screen.getByRole('dialog', { name: 'Tu pedido' });
    expect(within(pedido).getByText('Grande (8 porciones) · Extra queso')).toBeInTheDocument();
    await user.click(within(pedido).getByRole('radio', { name: '10 %' }));
    expect(within(pedido).getByText(plata('$ 42.900'))).toBeInTheDocument();
    await user.click(within(pedido).getByRole('button', { name: 'Seguir' }));

    const datos = screen.getByRole('dialog', { name: '¿Cómo lo querés?' });
    // Arranca en la mesa del QR.
    expect(within(datos).getByRole('radio', { name: /en la mesa/i })).toBeChecked();
    expect(within(datos).getByRole('textbox', { name: 'Número de mesa' })).toHaveValue('4');
    await user.click(within(datos).getByRole('button', { name: /confirmar/i }));
    expect(
      within(datos).getByText('Decinos tu nombre para llamarte cuando esté listo.'),
    ).toBeInTheDocument();

    await user.type(within(datos).getByRole('textbox', { name: /tu nombre/i }), 'Julián');
    await user.click(within(datos).getByRole('radio', { name: /mercado pago \(simulado\)/i }));
    await user.click(within(datos).getByRole('button', { name: /confirmar/i }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Pedido #1' })).toHaveFocus();
    expect(screen.getByText('El local recibió tu pedido.')).toBeInTheDocument();
    expect(screen.getByRole('listitem', { current: 'step' })).toHaveTextContent('Recibido');

    const [p] = getEstadoDemo().pedidos;
    expect(p).toMatchObject({ numero: 1, modalidad: 'mesa', mesa: '4', medioPago: 'mercado_pago' });
    expect(p?.totales.total).toBe(4_290_000);
    expect(getEstadoDemo().carrito).toEqual([]);
  });

  it('delivery pide dirección y suma el envío de ejemplo', async () => {
    const user = userEvent.setup();
    render(<DemoCliente />);
    await user.click(screen.getByRole('button', { name: /fainá/i }));
    await user.click(screen.getByRole('button', { name: /agregar/i }));
    await user.click(screen.getByRole('button', { name: /ver mi pedido/i }));
    await user.click(screen.getByRole('button', { name: 'Seguir' }));
    const datos = screen.getByRole('dialog', { name: '¿Cómo lo querés?' });
    await user.click(within(datos).getByRole('radio', { name: /delivery/i }));
    expect(within(datos).getByText('Envío')).toBeInTheDocument();
    await user.type(within(datos).getByRole('textbox', { name: /tu nombre/i }), 'Ana');
    await user.click(within(datos).getByRole('button', { name: /confirmar/i }));
    expect(within(datos).getByText('Decinos a dónde te lo llevamos.')).toBeInTheDocument();
  });

  it('quitar todo del pedido deja el hueco del estado vacío', async () => {
    const user = userEvent.setup();
    render(<DemoCliente />);
    await user.click(screen.getByRole('button', { name: /fainá/i }));
    await user.click(screen.getByRole('button', { name: /agregar/i }));
    await user.click(screen.getByRole('button', { name: /ver mi pedido/i }));
    await user.click(screen.getByRole('button', { name: 'Quitar Fainá' }));
    expect(screen.getByText('Tu pedido quedó vacío.')).toBeInTheDocument();
  });
});
