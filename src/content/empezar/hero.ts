/**
 * Hero de /empezar: la promesa, el CTA que baja al creador y la prueba.
 * Es la variante `atiende_solo` de content/empezar/hero-variantes.ts (un test verifica que coincidan).
 */
export const HERO = {
  titulo: 'Tu negocio atiende mientras vos trabajás.',
  /** Debajo del titular: qué es, en cosas que se pueden tocar. */
  subtitulo: 'Pedidos, turnos con bot y tu sitio.',
  bajada:
    'Carta con QR y pedidos para gastronomía. Bot de turnos con agenda y estadísticas para peluquerías. Si lo tuyo es otra cosa, lo armamos a medida.',
  cta: 'Crear mi sistema',
  /** Debajo del creador: negocios reales, con link a sus casos. */
  prueba: { antes: 'Ya funcionando:' },
  /** Las demos que se pueden tocar sin dejar ningún dato. */
  demos: {
    antes: 'Probalo ahora:',
    separador: 'o',
    enlaces: [
      { texto: 'el bot de turnos', href: '/demo/peluqueria' },
      { texto: 'la carta con pedidos', href: '/demo/gastronomia' },
    ],
  },
} as const;
