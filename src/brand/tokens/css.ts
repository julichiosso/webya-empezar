import { COMPONENTES } from './componentes';
import { COLOR, ESPACIO, FUENTE_SANS, TIPO } from './primitivos';
import {
  LINEA_FUERTE_PAPEL,
  MOVIMIENTO,
  RADIOS,
  SOMBRA_ELEVADA,
  SUPERFICIES,
  TEMA_CLARO,
  TEMA_OSCURO,
  TEMA_PAPEL,
  type ValorToken,
} from './semanticos';

/**
 * Genera src/brand/tokens/tokens.css a partir de las 3 capas. No se edita a mano: `pnpm tokens`
 * lo reescribe y `pnpm test` falla si quedó desactualizado (tokens.css.test.ts).
 */
export function generarTokensCss(): string {
  const decl = (nombre: string, valor: string) => `  --${nombre}: ${valor};`;
  const semantico = (t: ValorToken) => (t.ref ? `var(${t.ref})` : t.valor);

  const primitivos = Object.entries(COLOR).flatMap(([material, tonos]) =>
    Object.entries(tonos).map(([tono, hex]) => decl(`${material}-${tono}`, hex)),
  );
  const espacios = Object.entries(ESPACIO).map(([k, v]) => decl(`espacio-${k}`, v));
  const oscuro = Object.entries(TEMA_OSCURO).map(([k, t]) => decl(k, semantico(t)));
  const claro = Object.entries(TEMA_CLARO).map(([k, t]) => decl(k, semantico(t)));
  const papel = [
    ...Object.entries(TEMA_PAPEL).map(([k, v]) => decl(k, `var(--${v})`)),
    decl('line-strong', LINEA_FUERTE_PAPEL.valor),
    // Texto de error: el rosa claro del oscuro no llega a AA sobre crema.
    decl('danger', 'var(--rosa-700)'),
  ];
  const movimiento = Object.entries(MOVIMIENTO).map(([k, v]) => decl(k, v));
  const componentes = Object.entries(COMPONENTES).map(([k, v]) => decl(k, `var(--${v})`));
  const superficies = Object.entries(SUPERFICIES).flatMap(([clase, tokens]) => [
    '',
    `.${clase} {`,
    '  color-scheme: dark;',
    ...Object.entries(tokens).map(([k, v]) =>
      decl(k, typeof v === 'string' ? `var(--${v})` : semantico(v)),
    ),
    '  /* Componente otra vez (ver .papel). */',
    ...componentes,
    '}',
  ]);

  const temaColores = [...Object.keys(TEMA_OSCURO), ...Object.keys(COMPONENTES)].map((k) =>
    decl(`color-${k}`, `var(--${k})`),
  );
  const tipo = Object.entries(TIPO).flatMap(([k, [tam, interlineado, tracking]]) => [
    decl(`text-${k}`, tam),
    decl(`text-${k}--line-height`, interlineado),
    ...(tracking ? [decl(`text-${k}--letter-spacing`, tracking)] : []),
  ]);

  return [
    '/* GENERADO desde src/brand/tokens (primitivos → semánticos → componente). No editar a mano: `pnpm tokens`. */',
    '',
    ':root {',
    '  color-scheme: dark;',
    '',
    '  /* Capa 1: primitivos */',
    ...primitivos,
    ...espacios,
    '',
    '  /* Capa 2: semánticos (tema oscuro, por defecto) */',
    ...oscuro,
    '',
    '  /* Movimiento. En :root para usarlos en CSS crudo (Tailwind descarta los de @theme sin uso). */',
    ...movimiento,
    '',
    '  /* Capa 3: componente */',
    ...componentes,
    '}',
    '',
    ":root[data-theme='light'] {",
    '  color-scheme: light;',
    ...claro,
    '}',
    '',
    '.papel {',
    '  color-scheme: light;',
    ...papel,
    '',
    '  /*',
    '   * Componente otra vez: un var() se resuelve donde se declara, así que los de :root quedarían',
    '   * con los semánticos del oscuro (p. ej. texto blanco del botón secundario sobre crema).',
    '   */',
    ...componentes,
    '}',
    '',
    '/* Superficies oscuras de sección (dirección Plano): fijas con el sitio en oscuro o en claro. */',
    ...superficies.slice(1),
    '',
    '@theme inline {',
    ...temaColores,
    '',
    decl('font-sans', FUENTE_SANS),
    ...tipo,
    '',
    decl('container-page', '75rem'),
    ...Object.entries(RADIOS).map(([k, v]) => decl(`radius-${k}`, v)),
    decl('shadow-raised', SOMBRA_ELEVADA),
    '  /* Altura mínima táctil (WCAG 2.5.8 pide 24 px; nosotros, 48 px). */',
    decl('spacing-tap', '3rem'),
    '}',
    '',
  ].join('\n');
}
