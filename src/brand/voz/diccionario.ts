/**
 * Diccionario de voz de WebYa (ver .claude/skills/webya-copy-comercial). Lo usa el test de copy
 * (tests/copy/copy.test.ts) sobre todo src/content.
 */

/** Expresiones que no se usan nunca: superlativos vacíos, promesas que no podemos sostener, restos de marca. */
export const PROHIBIDAS: readonly RegExp[] = [
  /\b(el|la|los|las) mejor(es)?\b/i,
  /\brevolucionari[oa]s?\b/i,
  /\blíder(es)?\b/i,
  /\bincreíble(s)?\b/i,
  /\búnic[oa]s? en\b/i,
  /\bnúmero uno\b/i,
  /\bgarantizad[oa]s?\b/i,
  /\b100 ?%/i,
  /\bprueba gratis\b/i,
  /\bmenta\b/i,
  /\bsolución integral\b/i,
  /\bend-to-end\b/i,
  /\bomnicanal\b/i,
];

/** "Tenemos todo" solo va acompañado de su salvedad honesta. */
export const PROMESA_SIN_SALVEDAD = /\btenemos todo\b/i;
export const SALVEDAD = /a medida/i;

/** Palabras preferidas (guía; no se testean). */
export const PREFERIDAS = {
  'gestión de turnos': 'que tus clientes reserven solos',
  'nuestro equipo se pondrá en contacto': 'te escribimos por WhatsApp',
  dashboard: 'panel',
  features: 'lo que podés activar',
  onboarding: 'arrancar',
} as const;
