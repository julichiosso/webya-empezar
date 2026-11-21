// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { keyframesRodillo } from './rodillo';

describe('keyframesRodillo', () => {
  it('arma un turno por localidad y termina en la copia de la primera', () => {
    const k = keyframesRodillo(4);
    expect(k).toContain('@keyframes e-rodillo{0.000%');
    expect(k).toContain('100%{transform:translate3d(0,-4.6em,0)}');
    expect(k).toContain('@keyframes e-zona-pulso{0%,20.000%');
  });
});
