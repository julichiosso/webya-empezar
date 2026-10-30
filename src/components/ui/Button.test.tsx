import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState, type FormEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Button, ButtonLink, buttonClasses } from './Button';

describe('Button — estados', () => {
  it('default: botón real (type=button), variante primaria por tokens y alto táctil de 48 px', () => {
    render(<Button>Empezar</Button>);
    const b = screen.getByRole('button', { name: 'Empezar' });
    expect(b).toHaveAttribute('type', 'button');
    expect(b.className).toContain('bg-boton-primario-fondo');
    expect(b.className).toContain('text-boton-primario-texto');
    expect(b.className).toContain('min-h-tap');
    expect(b).not.toHaveAttribute('aria-busy');
    expect(b).not.toHaveAttribute('data-estado');
  });

  it('hover: cada variante tiene su hover (Tailwind lo limita a punteros con hover real)', () => {
    for (const variante of ['primario', 'secundario', 'texto', 'pastilla'] as const) {
      const { unmount } = render(<Button variante={variante}>Ver</Button>);
      expect(screen.getByRole('button').className).toMatch(/(^|\s)hover:/);
      unmount();
    }
    render(<Button variante="icono" etiquetaAccesible="Cerrar" />);
    expect(screen.getByRole('button', { name: 'Cerrar' }).className).toContain('hover:bg-surface-2');
  });

  it('focus: se alcanza con Tab y no apaga el anillo de foco global', async () => {
    const user = userEvent.setup();
    render(<Button>Empezar</Button>);
    await user.tab();
    const b = screen.getByRole('button', { name: 'Empezar' });
    expect(b).toHaveFocus();
    expect(b.className).not.toMatch(/outline-none/);
  });

  it('active: responde al toque con la escala única y ejecuta la acción (también con teclado)', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Empezar</Button>);
    const b = screen.getByRole('button');
    expect(b.className).toContain('active:scale-[0.98]');
    expect(b.className).toContain('motion-reduce:transition-none');
    await user.click(b);
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it('disabled: no se puede tocar ni enfocar con Tab', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Siguiente
      </Button>,
    );
    const b = screen.getByRole('button', { name: 'Siguiente' });
    expect(b).toBeDisabled();
    await user.click(b);
    await user.tab();
    expect(onClick).not.toHaveBeenCalled();
    expect(b).not.toHaveFocus();
  });

  it('loading: aria-busy, spinner, mantiene el nombre y el foco, y no envía dos veces', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((e: FormEvent) => e.preventDefault());
    function Formulario() {
      const [cargando, setCargando] = useState(false);
      return (
        <form
          onSubmit={(e) => {
            onSubmit(e);
            setCargando(true);
          }}
        >
          <input aria-label="WhatsApp" />
          <Button type="submit" cargando={cargando}>
            Enviar
          </Button>
        </form>
      );
    }
    render(<Formulario />);
    const b = screen.getByRole('button', { name: 'Enviar' });
    await user.click(b);
    expect(b).toHaveAttribute('aria-busy', 'true');
    expect(b).toHaveAttribute('aria-disabled', 'true');
    expect(b).toHaveAttribute('data-estado', 'cargando');
    expect(b.querySelector('[data-spinner]')).not.toBeNull();
    expect(b).toHaveFocus();
    // Segundo toque, Enter sobre el botón y submit implícito desde el campo: ninguno envía de nuevo.
    await user.click(b);
    await user.keyboard('{Enter}');
    await user.type(screen.getByLabelText('WhatsApp'), '1{Enter}');
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('error: queda habilitado para reintentar y se asocia al mensaje que explica el fallo', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <>
        <Button idError="err" onClick={onClick}>
          Enviar
        </Button>
        <p id="err">No pudimos enviarlo. Probá de nuevo.</p>
      </>,
    );
    const b = screen.getByRole('button', { name: 'Enviar' });
    expect(b).toHaveAccessibleDescription('No pudimos enviarlo. Probá de nuevo.');
    expect(b).toHaveAttribute('data-estado', 'error');
    expect(b).toBeEnabled();
    await user.click(b);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('success: muestra el check, conserva el nombre y no acepta otro toque', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button exito onClick={onClick}>
        Enviar
      </Button>,
    );
    const b = screen.getByRole('button', { name: 'Enviar' });
    expect(b).toHaveAttribute('data-estado', 'exito');
    expect(b).toHaveAttribute('aria-disabled', 'true');
    expect(b).not.toHaveAttribute('aria-busy');
    expect(b.querySelector('svg.ic-draw')).not.toBeNull();
    await user.click(b);
    expect(onClick).not.toHaveBeenCalled();
  });
});

describe('Button — variantes', () => {
  it('icono: sin texto visible, el nombre sale de etiquetaAccesible y mide 48 px', () => {
    render(<Button variante="icono" etiquetaAccesible="Cerrar" />);
    const b = screen.getByRole('button', { name: 'Cerrar' });
    expect(b.className).toContain('size-12');
    expect(b.className).toContain('rounded-full');
  });

  it('pastilla, secundario y texto usan sus tokens', () => {
    expect(buttonClasses('secundario')).toContain('border-boton-secundario-borde');
    expect(buttonClasses('pastilla')).toContain('rounded-full');
    expect(buttonClasses('texto')).toContain('text-muted');
  });
});

describe('Button — API anterior (compatibilidad)', () => {
  it('buttonClasses acepta primary/secondary/ghost, ancho completo y compacto', () => {
    expect(buttonClasses()).toBe(buttonClasses('primario'));
    expect(buttonClasses('primary', true)).toContain('w-full');
    expect(buttonClasses('secondary', false, 'compacto')).toContain('px-4 text-small');
    expect(buttonClasses('ghost')).toBe(buttonClasses('texto'));
  });

  it('variant, fullWidth y status siguen funcionando', () => {
    const { rerender } = render(
      <Button variant="secondary" fullWidth status="loading">
        Enviar
      </Button>,
    );
    const b = screen.getByRole('button', { name: 'Enviar' });
    expect(b.className).toContain('border-boton-secundario-borde');
    expect(b.className).toContain('w-full');
    expect(b).toHaveAttribute('aria-busy', 'true');
    rerender(<Button status="success">Enviar</Button>);
    expect(b).toHaveAttribute('data-estado', 'exito');
  });

  it('ButtonLink es un enlace con forma de botón', () => {
    render(
      <ButtonLink href="#wizard" variant="secondary">
        Empezar
      </ButtonLink>,
    );
    const a = screen.getByRole('link', { name: 'Empezar' });
    expect(a).toHaveAttribute('href', '#wizard');
    expect(a.className).toContain('border-boton-secundario-borde');
  });
});
