import { CLIENTES } from '@/content/clientes';

/**
 * Hero de /empezar: quién es WebYa y qué hace, el CTA que baja al creador y la prueba real.
 * Es la variante `parte_digital` de content/empezar/hero-variantes.ts (un test verifica que coincidan).
 */
export const HERO = {
  titulo: 'Somos la parte digital de tu negocio.',
  /** Debajo del titular: qué se entrega, en cosas que se pueden tocar. */
  subtitulo: 'Sitios, cartas, pedidos y turnos que funcionan.',
  bajada:
    'WebYa diseña, programa y deja andando lo que tu negocio necesita. Hablás con una persona y nada sale online sin tu visto bueno.',
  cta: 'Crear mi sistema',
  ctaTrabajos: 'Ver trabajos',
  /** Debajo de los botones: negocios reales, con link a sus casos. */
  prueba: {
    antes: 'Ya funcionan con WebYa:',
    nombres: new Intl.ListFormat('es-AR').format(CLIENTES.map((c) => c.nombre)),
  },
  /** Al final del recorrido del hero, con los celulares ya en fila. */
  final: 'Estos negocios ya funcionan con WebYa.',
} as const;
