import { describe, expect, it } from 'vitest';
import { formatPhoneInput, parsePhoneAR } from './phone';

describe('parsePhoneAR — válidos', () => {
  it.each([
    ['11 2345 6789', '5491123456789'],
    ['1123456789', '5491123456789'],
    ['011 2345-6789', '5491123456789'],
    ['011 15 2345 6789', '5491123456789'],
    ['15 2345 6789 sin área no sirve', null],
    ['+54 9 11 2345 6789', '5491123456789'],
    ['+54 11 2345 6789', '5491123456789'],
    ['5491123456789', '5491123456789'],
    ['54 9 11 2345-6789', '5491123456789'],
    ['(11) 2345-6789', '5491123456789'],
    ['351 123 4567', '5493511234567'],
    ['0351 15 123 4567', '5493511234567'],
    ['+54 9 351 123 4567', '5493511234567'],
    ['2966 15 123456', '5492966123456'],
    ['0 2966 123456', '5492966123456'],
    ['00 54 9 11 2345 6789', '5491123456789'],
  ])('%s', (input, wa) => {
    const r = parsePhoneAR(input);
    if (wa === null) {
      expect(r.ok).toBe(false);
    } else {
      expect(r).toMatchObject({ ok: true, wa, e164: `+${wa}` });
    }
  });
});

describe('parsePhoneAR — inválidos', () => {
  it.each([
    '',
    'hola',
    '123',
    '11 2345 678', // un dígito de menos
    '11 2345 67890', // un dígito de más
    '+1 415 555 2671', // EE.UU.
    '+54 9 5 1234 5678', // código de área que no existe
    '911 2345 6789',
    '0000000000',
  ])('rechaza "%s"', (input) => {
    expect(parsePhoneAR(input).ok).toBe(false);
  });
});

describe('formatPhoneInput', () => {
  it('formatea de a poco mientras se escribe', () => {
    expect(formatPhoneInput('')).toBe('');
    expect(formatPhoneInput('1')).toBe('1');
    expect(formatPhoneInput('112')).toBe('11 2');
    expect(formatPhoneInput('1123456')).toBe('11 2345 6');
    expect(formatPhoneInput('1123456789')).toBe('11 2345 6789');
  });

  it('quita el 0 y el 15 al llegar a 12 dígitos', () => {
    // Mientras tiene menos de 12 dígitos no se toca: "1115…" podría ser un número real.
    expect(formatPhoneInput('0111523456')).toBe('11 1523 456');
    expect(formatPhoneInput('01115 2345 6789')).toBe('11 2345 6789');
  });

  it('conserva el formato internacional si arranca con +54', () => {
    expect(formatPhoneInput('+')).toBe('+');
    expect(formatPhoneInput('+54')).toBe('+54');
    expect(formatPhoneInput('+549')).toBe('+54 9');
    expect(formatPhoneInput('+5491123456789')).toBe('+54 9 11 2345 6789');
  });

  it('corta a un número válido cuando se pega basura de más de 12 dígitos', () => {
    expect(formatPhoneInput('11234567890000')).toBe('11 2345 6789');
  });
});

// Simula al usuario tipeando tecla por tecla, con el reformateo en vivo del input
// (en el navegador, cada cambio reescribe el valor antes de la próxima tecla).
function tipear(texto: string): string {
  let valor = '';
  for (const tecla of texto) valor = formatPhoneInput(valor + tecla);
  return valor;
}

describe('tipeo en vivo (tecla por tecla)', () => {
  it.each([
    ['11 2345 6789', '11 2345 6789'],
    ['011 15 2345 6789', '11 2345 6789'],
    ['011 2345-6789', '11 2345 6789'],
    ['0351 15 123 4567', '351 123 4567'],
    ['351 123 4567', '351 123 4567'],
    ['+54 9 11 2345 6789', '+54 9 11 2345 6789'],
    ['+54 11 2345 6789', '+54 9 11 2345 6789'],
    ['+5491123456789', '+54 9 11 2345 6789'],
    ['5491123456789', '+54 9 11 2345 6789'],
  ])('%s → %s', (escrito, mostrado) => {
    const resultado = tipear(escrito);
    expect(resultado).toBe(mostrado);
    expect(parsePhoneAR(resultado).ok).toBe(true);
  });

  it('el valor mostrado y el original dan el mismo número', () => {
    expect(parsePhoneAR(tipear('011 15 2345 6789'))).toEqual(parsePhoneAR('011 15 2345 6789'));
  });
});
