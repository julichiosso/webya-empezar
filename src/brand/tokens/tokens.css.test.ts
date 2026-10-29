// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { generarTokensCss } from './css';

describe('tokens.css', () => {
  it('está al día con las 3 capas de tokens (si falla: `pnpm tokens`)', async () => {
    await expect(generarTokensCss()).toMatchFileSnapshot('./tokens.css');
  });
});
