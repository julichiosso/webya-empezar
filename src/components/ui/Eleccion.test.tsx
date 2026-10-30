import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Eleccion, GrupoEleccion } from './Eleccion';

/** La forma visible de la opción (hermana del input oculto). */
const forma = (input: HTMLElement) => input.nextElementSibling as HTMLElement;

function Rubros({ onCambio = () => {} }: { onCambio?: (v: string) => void }) {
  const [valor, setValor] = useState('comercio');
  return (
    <GrupoEleccion tipo="unica" leyenda="Rubro">
      {['comercio', 'gastronomia', 'peluqueria'].map((v) => (
        <Eleccion
          key={v}
          tipo="unica"
          forma="tarjeta"
          name="rubro"
          value={v}
          etiqueta={v}
          checked={valor === v}
          onCambio={(nuevo) => {
            setValor(nuevo);
            onCambio(nuevo);
          }}
        />
      ))}
    </GrupoEleccion>
  );
}

describe('Eleccion — estados', () => {
  it('default: input nativo con nombre = etiqueta; la descripción se asocia aparte', () => {
    render(
      <Eleccion
        tipo="multiple"
        forma="fila"
        value="turnos"
        etiqueta="Turnos y reservas"
        descripcion="Tus clientes reservan solos"
        checked={false}
        onCambio={() => {}}
      />,
    );
    const c = screen.getByRole('checkbox', { name: 'Turnos y reservas' });
    expect(c).not.toBeChecked();
    expect(c).toHaveAccessibleDescription('Tus clientes reservan solos');
    expect(forma(c).className).toContain('border-tarjeta-borde');
    expect(forma(c)).toHaveAttribute('data-on', 'false');
  });

  it('hover: borde más fuerte bajo el puntero (solo si se puede elegir)', () => {
    const { rerender } = render(
      <Eleccion
        tipo="multiple"
        forma="chip"
        value="a"
        etiqueta="Vender"
        checked={false}
        onCambio={() => {}}
      />,
    );
    expect(forma(screen.getByRole('checkbox')).className).toContain(
      'group-hover:border-line-strong',
    );
    rerender(
      <Eleccion
        tipo="multiple"
        forma="chip"
        value="a"
        etiqueta="Vender"
        checked={false}
        deshabilitado
        onCambio={() => {}}
      />,
    );
    expect(forma(screen.getByRole('checkbox')).className).not.toContain('group-hover:');
  });

  it('focus: Tab llega al input y la forma muestra el anillo de foco (peer-focus-visible)', async () => {
    const user = userEvent.setup();
    render(<Rubros />);
    await user.tab();
    const actual = screen.getByRole('radio', { name: 'comercio' });
    expect(actual).toHaveFocus();
    expect(forma(actual).className).toContain('peer-focus-visible:outline-foco');
  });

  it('active: tocar la tarjeta elige; las flechas recorren el grupo (radio nativo)', async () => {
    const user = userEvent.setup();
    const onCambio = vi.fn();
    render(<Rubros onCambio={onCambio} />);
    const gastro = screen.getByRole('radio', { name: 'gastronomia' });
    expect(forma(gastro).className).toContain('group-active:scale-[0.98]');
    await user.click(screen.getByText('gastronomia'));
    expect(gastro).toBeChecked();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('radio', { name: 'peluqueria' })).toBeChecked();
    expect(onCambio).toHaveBeenLastCalledWith('peluqueria');
    expect(screen.getByRole('radiogroup', { name: 'Rubro' })).toBeInTheDocument();
  });

  it('disabled: no se puede elegir, sale del recorrido y se ve atenuada', async () => {
    const user = userEvent.setup();
    const onCambio = vi.fn();
    render(
      <Eleccion
        tipo="multiple"
        forma="fila"
        value="a"
        etiqueta="Pagos"
        checked={false}
        deshabilitado
        onCambio={onCambio}
      />,
    );
    const c = screen.getByRole('checkbox', { name: 'Pagos' });
    expect(c).toBeDisabled();
    await user.click(screen.getByText('Pagos'));
    expect(onCambio).not.toHaveBeenCalled();
    expect(forma(c).className).toContain('opacity-45');
  });

  it('loading: aria-busy, spinner en lugar de la pieza y no acepta cambios', async () => {
    const user = userEvent.setup();
    const onCambio = vi.fn();
    render(
      <Eleccion
        tipo="multiple"
        forma="fila"
        value="a"
        etiqueta="Pagos"
        checked={false}
        cargando
        onCambio={onCambio}
      />,
    );
    const c = screen.getByRole('checkbox', { name: 'Pagos' });
    expect(c).toHaveAttribute('aria-busy', 'true');
    expect(forma(c).querySelector('[data-spinner]')).not.toBeNull();
    expect(forma(c).querySelector('.encaje')).toBeNull();
    await user.click(screen.getByText('Pagos'));
    expect(onCambio).not.toHaveBeenCalled();
  });

  it('error: aria-invalid, el mensaje describe la opción y el borde cambia (no solo color)', () => {
    render(
      <Eleccion
        tipo="multiple"
        forma="fila"
        value="a"
        etiqueta="Pagos"
        checked={false}
        error="Este módulo necesita una cuenta de Mercado Pago."
        onCambio={() => {}}
      />,
    );
    const c = screen.getByRole('checkbox', { name: 'Pagos' });
    expect(c).toHaveAttribute('aria-invalid', 'true');
    expect(c).toHaveAccessibleDescription('Este módulo necesita una cuenta de Mercado Pago.');
    expect(forma(c).className).toContain('border-control-error');
  });

  it('success: elegida, la pieza encaja (borde y fondo de selección)', async () => {
    const user = userEvent.setup();
    function Uno() {
      const [on, setOn] = useState(false);
      return (
        <Eleccion
          tipo="multiple"
          forma="chip"
          value="a"
          etiqueta="Vender"
          checked={on}
          onCambio={(_, v) => setOn(v)}
        />
      );
    }
    render(<Uno />);
    const c = screen.getByRole('checkbox', { name: 'Vender' });
    await user.click(c);
    expect(c).toBeChecked();
    expect(forma(c)).toHaveAttribute('data-on', 'true');
    expect(forma(c).className).toContain('border-seleccion-borde');
    expect(forma(c).querySelector('.encaje')).toHaveAttribute('data-on', 'true');
  });
});

describe('Eleccion — estado del módulo e insignia', () => {
  it('proximamente: deshabilitada, como hueco punteado y explica por qué', async () => {
    const user = userEvent.setup();
    const onCambio = vi.fn();
    render(
      <Eleccion
        tipo="multiple"
        forma="fila"
        value="pagos"
        etiqueta="Pagos online"
        estadoModulo="proximamente"
        textoEstado="Próximamente"
        checked
        onCambio={onCambio}
      />,
    );
    const c = screen.getByRole('checkbox', { name: 'Pagos online' });
    expect(c).toBeDisabled();
    expect(c).not.toBeChecked();
    expect(c).toHaveAccessibleDescription('Próximamente');
    expect(forma(c).className).toContain('border-dashed');
    await user.click(screen.getByText('Pagos online'));
    expect(onCambio).not.toHaveBeenCalled();
  });

  it('insignia: se ve y describe la opción', () => {
    render(
      <Eleccion
        tipo="multiple"
        forma="fila"
        value="turnos"
        etiqueta="Turnos"
        insignia="Sugerido para tu rubro"
        estadoModulo="en_demo"
        checked
        onCambio={() => {}}
      />,
    );
    const c = screen.getByRole('checkbox', { name: 'Turnos' });
    expect(c).toHaveAccessibleDescription('Sugerido para tu rubro');
    expect(c.closest('label')).toHaveAttribute('data-estado-modulo', 'en_demo');
  });
});

describe('GrupoEleccion', () => {
  it('nombra el grupo con la leyenda y anuncia el error en una región viva', () => {
    const { rerender } = render(
      <GrupoEleccion tipo="multiple" leyenda="Módulos">
        <span />
      </GrupoEleccion>,
    );
    const grupo = screen.getByRole('group', { name: 'Módulos' });
    const region = grupo.querySelector('[aria-live="polite"]');
    expect(region).toBeEmptyDOMElement();
    rerender(
      <GrupoEleccion tipo="multiple" leyenda="Módulos" error="Activá al menos un módulo.">
        <span />
      </GrupoEleccion>,
    );
    expect(region).toHaveTextContent('Activá al menos un módulo.');
    expect(grupo).toHaveAccessibleDescription('Activá al menos un módulo.');
  });
});
