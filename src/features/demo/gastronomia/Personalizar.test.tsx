import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { DemoCliente } from './cliente/DemoCliente';
import { PanelDuenio } from './duenio/PanelDuenio';
import { Personalizar } from './Personalizar';
import { getEstadoDemo, reiniciarStoreDemo } from './store';

describe('Personalizá tu demo', () => {
  beforeEach(() => reiniciarStoreDemo());

  it('el nombre, la cocina y la paleta se ven al instante en la carta y en el panel', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Personalizar />
        <DemoCliente />
        <PanelDuenio />
      </>,
    );
    await user.type(screen.getByRole('textbox', { name: 'Nombre de tu local' }), 'Lo de Tito');
    const carta = screen.getByTestId('demo-cliente');
    expect(within(carta).getByRole('heading', { name: 'Lo de Tito' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Pedidos de Lo de Tito' })).toBeInTheDocument();

    await user.click(screen.getByRole('radio', { name: 'Parrilla' }));
    expect(within(carta).getByRole('button', { name: /bife de chorizo/i })).toBeInTheDocument();

    await user.click(screen.getByRole('radio', { name: 'Pileta' }));
    expect(getEstadoDemo().paletaId).toBe('pileta');
  });

  it('ofrece las 6 paletas y las 3 cocinas, y compartir por WhatsApp', async () => {
    render(<Personalizar />);
    const paletas = screen.getByRole('group', { name: 'Paleta' });
    expect(within(paletas).getAllByRole('radio')).toHaveLength(6);
    expect(within(paletas).getByRole('radio', { name: 'Brasa' })).toBeChecked();
    expect(
      within(screen.getByRole('group', { name: 'Tipo de cocina' })).getAllByRole('radio'),
    ).toHaveLength(3);
    // El link se arma cuando se conoce el origen (en el navegador, después de montar).
    const wa = await screen.findByRole('link', { name: /mandame esta demo por whatsapp/i });
    expect(wa.getAttribute('href')).toMatch(/^https:\/\/wa\.me\/\?text=/);
  });
});
