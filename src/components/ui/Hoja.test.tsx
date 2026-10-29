import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRef, useState } from 'react';
import { describe, expect, it } from 'vitest';
import { Hoja } from './Hoja';

function Prueba() {
  const [abierta, setAbierta] = useState(false);
  const fondo = useRef<HTMLDivElement>(null);
  return (
    <div>
      <div ref={fondo} data-testid="fondo">
        <button type="button" onClick={() => setAbierta(true)}>
          Abrir
        </button>
      </div>
      <Hoja abierta={abierta} onCerrar={() => setAbierta(false)} titulo="Tu pedido" fondo={fondo}>
        <button type="button">Primero</button>
        <button type="button">Último</button>
      </Hoja>
    </div>
  );
}

/** Abre la hoja y espera el foco (se mueve en el cuadro siguiente para no forzar layout). */
async function abrir(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: 'Abrir' }));
  await waitFor(() => expect(screen.getByRole('dialog')).toHaveFocus());
}

describe('Hoja (bottom sheet accesible)', () => {
  it('es un diálogo modal con nombre, toma el foco y deja inerte el fondo', async () => {
    const user = userEvent.setup();
    render(<Prueba />);
    await abrir(user);
    const dialogo = screen.getByRole('dialog', { name: 'Tu pedido' });
    expect(dialogo).toHaveAttribute('aria-modal', 'true');
    expect(dialogo).toHaveFocus();
    expect(screen.getByTestId('fondo')).toHaveAttribute('inert');
  });

  it('atrapa el foco: Tab da la vuelta dentro de la hoja', async () => {
    const user = userEvent.setup();
    render(<Prueba />);
    await abrir(user);
    await user.tab(); // Cerrar
    expect(screen.getByRole('button', { name: 'Cerrar' })).toHaveFocus();
    await user.tab();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Último' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Cerrar' })).toHaveFocus();
    await user.tab({ shift: true });
    expect(screen.getByRole('button', { name: 'Último' })).toHaveFocus();
  });

  it('Escape la cierra, libera el fondo y devuelve el foco a lo que la abrió', async () => {
    const user = userEvent.setup();
    render(<Prueba />);
    const boton = screen.getByRole('button', { name: 'Abrir' });
    await abrir(user);
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByTestId('fondo')).not.toHaveAttribute('inert');
    expect(boton).toHaveFocus();
  });

  it('el botón Cerrar también la cierra', async () => {
    const user = userEvent.setup();
    render(<Prueba />);
    await abrir(user);
    await user.click(screen.getByRole('button', { name: 'Cerrar' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
