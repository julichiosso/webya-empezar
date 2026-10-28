/**
 * Teléfonos argentinos (celulares). Acepta las formas en que la gente los escribe:
 *   11 2345 6789 · 011 2345-6789 · 011 15 2345 6789 · +54 9 11 2345 6789 · 5491123456789
 *   351 123 4567 · 0351 15 123 4567 · +54 9 351 123 4567
 * Un número nacional válido tiene 10 dígitos: código de área (11, o 2xx/3xx) + abonado.
 */

export type ParsedPhone = { ok: true; national: string; e164: string; wa: string } | { ok: false };

const NATIONAL_RE = /^(11\d{8}|[23]\d{9})$/;

/** Quita el prefijo país/móvil, el 0 de discado y el 15 de celular; devuelve los dígitos locales. */
function toNationalDigits(raw: string): string {
  let d = raw.replace(/\D/g, '');
  if (d.startsWith('00')) d = d.slice(2);
  if (d.startsWith('54')) {
    d = d.slice(2);
    if (d.startsWith('9')) d = d.slice(1); // móvil; ningún código de área empieza con 9
  }
  if (d.startsWith('0')) d = d.slice(1);
  // "15" de celular después del código de área: 11 15 xxxx xxxx / 351 15 xxx xxxx / 2966 15 xxxxxx
  if (d.length === 12) {
    const areaLengths = d.startsWith('11') ? [2] : [3, 4];
    for (const len of areaLengths) {
      if (d.slice(len, len + 2) === '15') {
        d = d.slice(0, len) + d.slice(len + 2);
        break;
      }
    }
  }
  return d;
}

export function parsePhoneAR(input: string): ParsedPhone {
  const national = toNationalDigits(input);
  if (!NATIONAL_RE.test(national)) return { ok: false };
  const wa = `549${national}`;
  return { ok: true, national, e164: `+${wa}`, wa };
}

/** Agrupa 11 xxxx xxxx o xxx xxx xxxx. Si hay dígitos de más (11 o 12), quedan en un último grupo. */
function groupNational(d: string): string {
  const sizes = d.startsWith('11') ? [2, 4, 4] : [3, 3, 4];
  const groups: string[] = [];
  let i = 0;
  for (const size of sizes) {
    groups.push(d.slice(i, i + size));
    i += size;
  }
  groups.push(d.slice(i));
  return groups.filter(Boolean).join(' ');
}

/**
 * Formatea mientras se escribe. Si el usuario arranca con +54 / 54 se conserva "+54 9 …";
 * si no, muestra el formato nacional ("11 2345 6789").
 */
export function formatPhoneInput(raw: string): string {
  const digitsOnly = raw.replace(/\D/g, '');
  if (digitsOnly === '') return raw.trim().startsWith('+') ? '+' : '';
  const hasPlus = raw.trim().startsWith('+');
  const international = hasPlus || digitsOnly.startsWith('54');
  // Mientras se tipea el prefijo (5 → 54 → 549) todavía no hay nada que formatear.
  if (international && digitsOnly.length <= 3 && '549'.startsWith(digitsOnly)) {
    return `${hasPlus ? '+' : ''}${digitsOnly.length === 3 ? '54 9' : digitsOnly}`;
  }
  let national = toNationalDigits(digitsOnly);
  // Se admiten hasta 12 dígitos mientras se tipea: el "15" de celular recién se puede reconocer
  // (y sacar) cuando está completo. Más de 12 es basura pegada: se corta a un número válido.
  if (national.length > 12) national = national.slice(0, 10);
  if (international) return `+54 9 ${groupNational(national)}`.trim();
  return groupNational(national);
}
