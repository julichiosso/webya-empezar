import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Interruptor } from './Interruptor';

function Voz({ onCambio = () => {} }: { onCambio?: (v: boolean) => void }) {
  const [on, setOn] = useState(false);
  return (
    <Interruptor
      etiqueta="Voz"
      presionado={on}
      conEncaje
      onCambio={(v) => {
        setOn(v);
        onCambio(v);
      }}
    />
  );
}

describe('Interruptor — estados', () => {
  it('default: botón con aria-pressed=false y alto táctil de 48 px', () => {
    render(<Voz />);
    const b = screen.getByRole('button', { name: 'Voz' });
    expect(b).toHaveAttribute('type', 'button');
    expect(b).toHaveAttribute('aria-pressed', 'false');
    expect(b.className).toContain('min-h-tap');
    expect(b.className).toContain('border-tarjeta-borde');
  });

  it('hover: el borde y el texto se refuerzan (solo sin presionar)', () => {
    render(<Voz />);
    expect(screen.getByRole('button').className).toContain('hover:border-line-strong');
  });

  it('focus: se alcanza con Tab', async () => {
    const user = userEvent.setup();
    render(<Voz />);
    await user.tab();
    expect(screen.getByRole('button', { name: 'Voz' })).toHaveFocus();
  });

  it('active: tocar o Espacio alterna; la etiqueta no cambia con el estado', async () => {
    const user = userEvent.setup();
    const onCambio = vi.fn();
    render(<Voz onCambio={onCambio} />);
    const b = screen.getByRole('button', { name: 'Voz' });
    expect(b.className).toContain('active:scale-[0.98]');
    await user.click(b);
    expect(b).toHaveAttribute('aria-pressed', 'true');
    await user.keyboard(' ');
    expect(b).toHaveAttribute('aria-pressed', 'false');
    expect(onCambio.mock.calls).toEqual([[true], [false]]);
    expect(b).toHaveAccessibleName('Voz');
  });

  it('disabled: no alterna ni se enfoca', async () => {
    const user = userEvent.setup();
    const onCambio = vi.fn();
    render(<Interruptor etiqueta="Voz" presionado={false} disabled onCambio={onCambio} />);
    const b = screen.getByRole('button', { name: 'Voz' });
    expect(b).toBeDisabled();
    await user.click(b);
    expect(onCambio).not.toHaveBeenCalled();
  });

  it('loading: aria-busy, spinner y el toque se ignora sin perder el foco', async () => {
    const user = userEvent.setup();
    const onCambio = vi.fn();
    render(
      <Interruptor etiqueta="Voz" presionado={false} conEncaje cargando onCambio={onCambio} />,
    );
    const b = screen.getByRole('button', { name: 'Voz' });
    expect(b).toHaveAttribute('aria-busy', 'true');
    expect(b.querySelector('[data-spinner]')).not.toBeNull();
    b.focus();
    await user.keyboard(' ');
    expect(onCambio).not.toHaveBeenCalled();
    expect(b).toHaveFocus();
  });

  it('error: se asocia al mensaje visible y cambia el borde', () => {
    render(
      <>
        <Interruptor etiqueta="Voz" presionado={false} idError="e" onCambio={() => {}} />
        <p id="e">Tu navegador no tiene voz en castellano.</p>
      </>,
    );
    const b = screen.getByRole('button', { name: 'Voz' });
    expect(b).toHaveAccessibleDescription('Tu navegador no tiene voz en castellano.');
    expect(b).toHaveAttribute('data-estado', 'error');
    expect(b.className).toContain('border-control-error');
  });

  it('success: presionado, la pieza encaja (borde, fondo y check, no solo color)', async () => {
    const user = userEvent.setup();
    render(<Voz />);
    const b = screen.getByRole('button', { name: 'Voz' });
    await user.click(b);
    expect(b.className).toContain('border-seleccion-borde');
    expect(b.className).toContain('bg-seleccion-fondo');
    expect(b.querySelector('.encaje')).toHaveAttribute('data-on', 'true');
  });
});
