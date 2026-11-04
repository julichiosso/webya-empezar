import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CLASES_SECCION, Seccion, type FondoSeccion } from '@/components/patterns/Seccion';

const CONTRATO: Record<FondoSeccion, string[]> = {
  tinta: ['bg-seccion-tinta', 'text-seccion-tinta-fg'],
  crema: ['bg-seccion-crema', 'text-seccion-crema-fg', 'papel'],
  brasa: ['bg-seccion-brasa', 'text-seccion-brasa-fg'],
};

function seccion(fondo: FondoSeccion) {
  return render(
    <Seccion fondo={fondo} aria-labelledby="t">
      <h2 id="t">Muestra</h2>
    </Seccion>,
  );
}

describe('Seccion: las 3 variantes aplican las clases del contrato', () => {
  it.each(Object.keys(CONTRATO) as FondoSeccion[])('%s', (fondo) => {
    seccion(fondo);
    const raiz = screen.getByRole('region', { name: 'Muestra' });
    expect(raiz).toHaveAttribute('data-fondo', fondo);
    expect(raiz).toHaveClass(...CONTRATO[fondo]);
  });

  it('secundario y línea del contrato, para el contenido', () => {
    expect(CLASES_SECCION.tinta.secundario).toBe('text-seccion-tinta-muted');
    expect(CLASES_SECCION.crema.linea).toBe('border-seccion-crema-linea');
    expect(CLASES_SECCION.brasa.secundario).toBe('text-seccion-brasa-muted');
    expect(CLASES_SECCION.brasa.linea).toBe('border-seccion-brasa-linea');
  });
});

describe('Seccion: pantalla completa sin scroll horizontal', () => {
  it('rompe el contenedor con w-screen y márgenes negativos; el contenido queda al ancho de página', () => {
    const { container } = seccion('tinta');
    const raiz = container.firstElementChild as HTMLElement;
    expect(raiz).toHaveClass('w-screen', 'mx-[calc(50%-50vw)]', 'overflow-hidden');
    expect(raiz.lastElementChild).toHaveClass('max-w-page', 'mx-auto');
  });

  it('el foco se adapta al fondo (Brasa sobre Brasa oscura no contrasta)', () => {
    expect(CLASES_SECCION.brasa.foco).toContain('outline-seccion-brasa-fg');
  });
});
