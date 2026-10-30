import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MODULO_IDS, type ModuloId } from '@/content/modulos';
import { ARTES_MODULO, esArteModulo, type ArteModulo } from './ids';
import { ModuloArte } from './ModuloArte';

// Chequeo de tipos: un id de módulo del catálogo se puede pasar directo como arte (así los callers
// no cambian). Si content suma un módulo sin arte, esto deja de compilar.
const _compatible: ArteModulo = '' as ModuloId;
void _compatible;

describe('ModuloArte: ids propios de brand', () => {
  it.each(MODULO_IDS)('el módulo %s tiene arte', (id) => {
    expect(esArteModulo(id)).toBe(true);
  });

  it.each(ARTES_MODULO)('%s: decorativo, sin texto, apagado sin acento', (id) => {
    const { container, rerender } = render(<ModuloArte id={id} activo={false} />);
    const svg = container.querySelector('svg')!;
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg.textContent).toBe('');
    expect(svg.innerHTML).not.toMatch(/accent/);
    // Encendido: la pieza clave pasa al acento.
    rerender(<ModuloArte id={id} activo />);
    expect(container.querySelector('svg')!.innerHTML).toMatch(/(fill|stroke)-accent\b/);
  });
});
