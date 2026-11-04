/**
 * Negocios que ya usan WebYa y aceptaron mostrarse. Solo clientes reales y con permiso: el dueño de
 * WebYa agrega más acá. Sin cifras ni testimonios inventados.
 */
export interface Cliente {
  nombre: string;
  rubro: string;
  url: string;
  /** Captura real del sitio (ruta en /public). Sin captura, la tarjeta va sin imagen. */
  captura?: string;
  /** Qué muestra la captura, para lectores de pantalla. */
  alt?: string;
}

export const CLIENTES: readonly Cliente[] = [
  { nombre: "Micio's Pizzería", rubro: 'Pizzería', url: 'https://micios.com.ar' },
  {
    nombre: 'Abelardo',
    rubro: 'Gastronomía',
    url: 'https://abelardo.vercel.app',
    captura: '/clientes/abelardo.webp',
    alt: 'Carta de Abelardo en el celular: promos del día y categorías de pizzas y pizzanesas.',
  },
];

export const YA_LO_USAN = {
  titulo: 'Ya lo usan',
  bajada: 'Negocios reales con su sitio funcionando. Abrilos y probalos.',
  ver: 'Verlo funcionando',
  externo: ' (se abre en otra pestaña)',
  /** Explicación del pie "Creado con WebYa" que llevan los sitios. */
  pie: 'Cada sitio lleva un "Creado con WebYa" discreto al final, que lleva a esta página.',
} as const;
