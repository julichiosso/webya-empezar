import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Acordeon } from './Acordeon';

const ITEMS = [
  { id: 'precio', pregunta: '¿Cuánto cuesta?', respuesta: 'Te armamos un presupuesto.' },
  { id: 'plazo', pregunta: '¿Cuándo está?', respuesta: 'Te escribimos por WhatsApp.' },
];

const details = (pregunta: string) => screen.getByText(pregunta).closest('details')!;

describe('Acordeon — estados', () => {
  it('default: <details>/<summary> nativos, todos cerrados', () => {
    render(<Acordeon items={ITEMS} />);
    expect(document.querySelectorAll('details')).toHaveLength(2);
    expect(details('¿Cuánto cuesta?')).not.toHaveAttribute('open');
    expect(screen.getByText('¿Cuánto cuesta?').closest('summary')!.className).toContain(
      'min-h-tap',
    );
  });

  it('hover: la pregunta cambia de tono bajo el puntero', () => {
    render(<Acordeon items={ITEMS} />);
    expect(screen.getByText('¿Cuánto cuesta?').closest('summary')!.className).toContain(
      'hover:text-muted',
    );
  });

  it('focus: cada pregunta se alcanza con Tab', async () => {
    const user = userEvent.setup();
    render(<Acordeon items={ITEMS} />);
    await user.tab();
    expect(screen.getByText('¿Cuánto cuesta?').closest('summary')).toHaveFocus();
    await user.tab();
    expect(screen.getByText('¿Cuándo está?').closest('summary')).toHaveFocus();
  });

  it('active: tocar la pregunta abre y cierra la respuesta', async () => {
    const user = userEvent.setup();
    render(<Acordeon items={ITEMS} />);
    await user.click(screen.getByText('¿Cuánto cuesta?'));
    expect(details('¿Cuánto cuesta?')).toHaveAttribute('open');
    await user.click(screen.getByText('¿Cuánto cuesta?'));
    expect(details('¿Cuánto cuesta?')).not.toHaveAttribute('open');
  });

  it('disabled: no se abre ni entra en el orden de Tab', async () => {
    const user = userEvent.setup();
    render(<Acordeon items={[{ ...ITEMS[0]!, deshabilitado: true, abierto: true }, ITEMS[1]!]} />);
    const summary = screen.getByText('¿Cuánto cuesta?').closest('summary')!;
    expect(summary).toHaveAttribute('aria-disabled', 'true');
    expect(details('¿Cuánto cuesta?')).not.toHaveAttribute('open');
    await user.tab();
    expect(summary).not.toHaveFocus();
  });

  it('abierto y exclusivo: arranca abierto y comparte `name` para abrir de a una', () => {
    render(<Acordeon exclusivo="faq" items={[{ ...ITEMS[0]!, abierto: true }, ITEMS[1]!]} />);
    expect(details('¿Cuánto cuesta?')).toHaveAttribute('open');
    expect(details('¿Cuándo está?')).toHaveAttribute('name', 'faq');
  });
});
