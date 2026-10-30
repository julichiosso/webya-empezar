import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState, type ComponentProps } from 'react';
import { beforeAll, describe, expect, it } from 'vitest';
import { Dialogo } from './Dialogo';

// jsdom no implementa el modal nativo: lo mínimo para abrir y cerrar.
beforeAll(() => {
  const proto = HTMLDialogElement.prototype;
  if (typeof proto.showModal !== 'function') {
    proto.showModal = function (this: HTMLDialogElement) {
      this.setAttribute('open', '');
    };
    proto.close = function (this: HTMLDialogElement) {
      this.removeAttribute('open');
      this.dispatchEvent(new Event('close'));
    };
  }
});

type Extra = Partial<Omit<ComponentProps<typeof Dialogo>, 'abierto' | 'onCerrar' | 'children'>>;

function Prueba(props: Extra) {
  const [abierto, setAbierto] = useState(false);
  return (
    <div>
      <button type="button" onClick={() => setAbierto(true)}>
        Abrir
      </button>
      <Dialogo
        titulo="Tu pedido"
        presentacion="centro"
        etiquetaCerrar="Cerrar"
        abierto={abierto}
        onCerrar={() => setAbierto(false)}
        {...props}
      >
        <button type="button">Primero</button>
        <button type="button">Último</button>
      </Dialogo>
    </div>
  );
}

async function abrir(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: 'Abrir' }));
  return screen.getByRole('dialog', { name: 'Tu pedido' });
}

describe('Dialogo — estados', () => {
  it('default: cerrado no se muestra ni monta el contenido', () => {
    render(<Prueba />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Primero' })).not.toBeInTheDocument();
  });

  it('hover: el botón cerrar (ícono de 48 px) tiene su hover', async () => {
    const user = userEvent.setup();
    render(<Prueba />);
    await abrir(user);
    const cerrar = screen.getByRole('button', { name: 'Cerrar' });
    expect(cerrar.className).toContain('size-12');
    expect(cerrar.className).toContain('hover:bg-surface-2');
  });

  it('focus: al abrir el foco va al diálogo (con nombre) y Tab da la vuelta adentro', async () => {
    const user = userEvent.setup();
    render(<Prueba />);
    const dialogo = await abrir(user);
    expect(dialogo.tagName).toBe('DIALOG');
    expect(dialogo).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Cerrar' })).toHaveFocus();
    await user.tab();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Último' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Cerrar' })).toHaveFocus();
    await user.tab({ shift: true });
    expect(screen.getByRole('button', { name: 'Último' })).toHaveFocus();
  });

  it('active: Escape, el botón cerrar y el fondo lo cierran; el foco vuelve a lo que lo abrió', async () => {
    const user = userEvent.setup();
    render(<Prueba />);
    const boton = screen.getByRole('button', { name: 'Abrir' });

    await abrir(user);
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(boton).toHaveFocus();

    await abrir(user);
    await user.click(screen.getByRole('button', { name: 'Cerrar' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(boton).toHaveFocus();

    const dialogo = await abrir(user);
    await user.click(dialogo); // el ::backdrop llega como toque sobre el propio <dialog>
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('loading: el contenido queda aria-busy', async () => {
    const user = userEvent.setup();
    render(<Prueba cargando />);
    await abrir(user);
    expect(screen.getByRole('button', { name: 'Primero' }).parentElement).toHaveAttribute(
      'aria-busy',
      'true',
    );
  });

  it('error: el mensaje se anuncia en una región viva con color de error', async () => {
    const user = userEvent.setup();
    render(<Prueba mensaje={{ tipo: 'error', texto: 'No pudimos mandar el pedido.' }} />);
    await abrir(user);
    const msg = screen.getByText('No pudimos mandar el pedido.');
    expect(msg.parentElement).toHaveAttribute('aria-live', 'polite');
    expect(msg.className).toContain('text-control-error');
  });

  it('success: el mensaje de éxito se anuncia en la misma región', async () => {
    const user = userEvent.setup();
    render(<Prueba mensaje={{ tipo: 'exito', texto: 'Pedido enviado.' }} />);
    await abrir(user);
    const msg = screen.getByText('Pedido enviado.');
    expect(msg).toHaveAttribute('data-tipo', 'exito');
    expect(msg.parentElement).toHaveAttribute('aria-live', 'polite');
  });
});

describe('Dialogo — presentaciones', () => {
  it('hoja: el mismo diálogo, pegado abajo y con la animación de hoja', async () => {
    const user = userEvent.setup();
    render(<Prueba presentacion="hoja" descripcion="Revisá antes de confirmar" pie={<p>Pie</p>} />);
    const dialogo = await abrir(user);
    expect(dialogo).toHaveAttribute('data-presentacion', 'hoja');
    expect(dialogo.className).toContain('hoja');
    expect(dialogo.className).toContain('mt-auto');
    expect(dialogo).toHaveAccessibleDescription('Revisá antes de confirmar');
    expect(screen.getByText('Pie')).toBeInTheDocument();
  });

  it('centro: cuadro centrado que entra con opacity', async () => {
    const user = userEvent.setup();
    render(<Prueba />);
    const dialogo = await abrir(user);
    expect(dialogo.className).toContain('fade-in');
    expect(dialogo.className).toContain('m-auto');
  });
});
