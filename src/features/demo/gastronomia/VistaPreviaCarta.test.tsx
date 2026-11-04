import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PREVIEW } from '@/content/empezar/preview';
import { VistaPreviaCarta } from './VistaPreviaCarta';

describe('VistaPreviaCarta', () => {
  it('usa la carta real con el nombre escrito y avisa que los platos son de ejemplo', () => {
    render(<VistaPreviaCarta nombre="Lo de Tito" paleta="ciruela" />);
    expect(screen.getAllByText('Lo de Tito').length).toBeGreaterThan(0);
    expect(screen.getByText(PREVIEW.deEjemplo)).toBeInTheDocument();
    expect(screen.getByTestId('vista-previa-carta').firstElementChild).toHaveAttribute(
      'style',
      expect.stringContaining('--'),
    );
  });

  it('sin nombre usa el de ejemplo de la cocina', () => {
    render(<VistaPreviaCarta nombre="  " />);
    expect(screen.getByTestId('vista-previa-carta')).toHaveTextContent(/tu /i);
  });
});
