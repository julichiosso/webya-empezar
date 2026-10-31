import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FLAGS } from '@/config/flags';
import { CASO_REAL } from '@/content/empezar/caso-real';
import { CasoReal } from './CasoReal';

describe('CasoReal (Micio\'s)', () => {
  it('está APAGADO: no se publica sin el permiso escrito de Micio\'s', () => {
    // Si este test falla es porque se prendió el flag: hacerlo SOLO con el permiso por escrito,
    // y en el mismo commit cambiar esta expectativa.
    expect(FLAGS.casoMicios).toBe(false);
  });

  it('muestra qué incluye y, mientras falten, los TODO del permiso, la dirección y las capturas', () => {
    render(<CasoReal />);
    expect(screen.getByRole('heading', { level: 2, name: CASO_REAL.titulo })).toBeInTheDocument();
    for (const item of CASO_REAL.incluye) expect(screen.getByText(item)).toBeInTheDocument();
    for (const todo of Object.values(CASO_REAL.pendientes)) {
      expect(screen.getByText(todo)).toHaveAttribute('data-todo');
    }
    // Sin dirección no hay botón a un sitio que no existe.
    expect(screen.queryByRole('link', { name: CASO_REAL.cta })).toBeNull();
  });

  it('sin cifras, testimonios ni resultados: solo lo que incluye', () => {
    const { container } = render(<CasoReal />);
    const texto = (container.textContent ?? '').replace(/TODO:[^.]*\./g, '');
    expect(texto).not.toMatch(/\d/);
    expect(texto).not.toMatch(/["“].+["”]/);
  });
});
