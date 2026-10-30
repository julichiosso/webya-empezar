import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Campo, CampoArea } from './Campo';
import { Input, Textarea } from './Field';

describe('Campo — estados', () => {
  it('default: etiqueta asociada, ayuda como descripción y "Opcional" visible', () => {
    render(<Campo etiqueta="Tu nombre" ayuda="Como querés que te llamemos" opcional />);
    const input = screen.getByLabelText(/tu nombre/i);
    expect(input).toHaveAccessibleDescription('Como querés que te llamemos');
    expect(input).not.toHaveAttribute('aria-invalid');
    expect(input.className).toContain('border-control-borde');
    expect(input.className).toContain('text-body');
    expect(input.className).toContain('h-14');
    expect(screen.getByText('Opcional')).toBeInTheDocument();
  });

  it('hover: el borde se refuerza bajo el puntero', () => {
    render(<Campo etiqueta="Tu nombre" />);
    expect(screen.getByLabelText('Tu nombre').className).toContain('hover:border-muted');
  });

  it('focus: Tab llega al campo y el borde pasa al color de foco', async () => {
    const user = userEvent.setup();
    render(<Campo etiqueta="Tu nombre" />);
    await user.tab();
    const input = screen.getByLabelText('Tu nombre');
    expect(input).toHaveFocus();
    expect(input.className).toContain('focus:border-foco');
    expect(input.className).not.toMatch(/outline-none/);
  });

  it('active: tocar la etiqueta enfoca el control y se puede escribir', async () => {
    const user = userEvent.setup();
    render(<Campo etiqueta="Tu nombre" />);
    await user.click(screen.getByText('Tu nombre'));
    const input = screen.getByLabelText('Tu nombre');
    expect(input).toHaveFocus();
    await user.keyboard('Ana');
    expect(input).toHaveValue('Ana');
  });

  it('disabled: no se puede escribir ni enfocar', async () => {
    const user = userEvent.setup();
    render(<Campo etiqueta="Tu nombre" disabled />);
    const input = screen.getByLabelText('Tu nombre');
    expect(input).toBeDisabled();
    await user.type(input, 'Ana');
    expect(input).toHaveValue('');
  });

  it('loading: aria-busy y spinner donde iría el check', () => {
    render(<Campo etiqueta="WhatsApp" cargando valido />);
    const input = screen.getByLabelText('WhatsApp');
    expect(input).toHaveAttribute('aria-busy', 'true');
    expect(input.parentElement?.querySelector('[data-spinner]')).not.toBeNull();
    expect(screen.queryByRole('img', { name: 'Válido' })).not.toBeInTheDocument();
  });

  it('error: aria-invalid, el mensaje se asocia y se anuncia en una región viva', () => {
    const { rerender } = render(<Campo etiqueta="WhatsApp" ayuda="Con código de área" />);
    const input = screen.getByLabelText('WhatsApp');
    const region = document.getElementById(`${input.id}-error`);
    expect(region).toHaveAttribute('aria-live', 'polite');
    expect(region).toBeEmptyDOMElement();
    const mensaje = 'Revisá el número: tiene que ser de Argentina, por ejemplo 11 2345 6789';
    rerender(<Campo etiqueta="WhatsApp" ayuda="Con código de área" error={mensaje} />);
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription(`Con código de área ${mensaje}`);
    expect(region).toHaveTextContent(mensaje);
    expect(input.className).toContain('border-control-error');
  });

  it('success: válido muestra el check con nombre accesible', () => {
    render(<Campo etiqueta="WhatsApp" valido />);
    expect(screen.getByRole('img', { name: 'Válido' })).toBeInTheDocument();
  });
});

describe('Campo — contador con máximo', () => {
  it('limita, cuenta lo escrito y lo asocia al campo', async () => {
    const user = userEvent.setup();
    render(
      <CampoArea
        etiqueta="Otra cosa"
        maximo={10}
        etiquetaContador={(n, max) => `${n} de ${max} caracteres`}
      />,
    );
    const area = screen.getByLabelText('Otra cosa');
    expect(area).toHaveAttribute('maxLength', '10');
    expect(area).toHaveAccessibleDescription('0 de 10 caracteres');
    await user.type(area, 'Floristería y más');
    expect(area).toHaveValue('Floristerí');
    expect(area).toHaveAccessibleDescription('10 de 10 caracteres');
    expect(screen.getByText('10/10')).toHaveAttribute('aria-hidden', 'true');
  });

  it('en un campo controlado cuenta desde value', () => {
    render(<Campo etiqueta="Nombre" maximo={40} value="Ana" onChange={() => {}} />);
    expect(screen.getByText('3/40')).toBeInTheDocument();
  });
});

describe('Field (API anterior)', () => {
  it('Input y Textarea mapean label/hint/error/optional/valid y reenvían la ref', () => {
    const ref = createRef<HTMLInputElement>();
    render(
      <>
        <Input ref={ref} label="Nombre" hint="Ayuda" error="Falta el nombre" optional valid />
        <Textarea label="Mensaje" maxLength={500} />
      </>,
    );
    const input = screen.getByLabelText(/nombre/i);
    expect(ref.current).toBe(input);
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Ayuda Falta el nombre');
    expect(screen.getByLabelText('Mensaje')).toHaveAttribute('maxLength', '500');
  });
});
