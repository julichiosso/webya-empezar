/**
 * La vitrina del hero: un negocio de ejemplo por rubro y lo que le entra mientras trabaja. Los nombres
 * son inventados y la leyenda lo dice. Lo que hace cada uno es lo que WebYa arma para ese rubro.
 */
export interface EscenaVitrina {
  /** Id de un rubro con plantilla (content/rubros). */
  rubro: string;
  negocio: string;
  /** Lo que se ve en el ticket que entra. */
  entra: { titulo: string; detalle: string };
}

export const VITRINA_RUBROS: readonly EscenaVitrina[] = [
  {
    rubro: 'peluqueria_estetica',
    negocio: 'Barbería Norte',
    entra: { titulo: 'Turno nuevo', detalle: 'Sábado a la mañana. Corte y barba.' },
  },
  {
    rubro: 'gastronomia',
    negocio: 'La Esquina',
    entra: { titulo: 'Pedido nuevo', detalle: 'Dos muzzarellas y una fainá, para llevar.' },
  },
  {
    rubro: 'comercio',
    negocio: 'Casa Olivia',
    entra: { titulo: 'Consulta nueva', detalle: '¿Tenés ese vestido en talle M?' },
  },
  {
    rubro: 'profesionales',
    negocio: 'Estudio Ríos',
    entra: { titulo: 'Consulta nueva', detalle: 'Quiere una reunión esta semana.' },
  },
  {
    rubro: 'gimnasio_deportes',
    negocio: 'Club Norte',
    entra: { titulo: 'Inscripción nueva', detalle: 'Funcional, martes y jueves.' },
  },
  {
    rubro: 'servicios_tecnicos',
    negocio: 'Gas Ramírez',
    entra: { titulo: 'Presupuesto pedido', detalle: 'Pérdida en la cocina, zona centro.' },
  },
];

export const VITRINA_UI = {
  leyenda: 'Negocios de ejemplo. Elegí tu rubro y mirá el tuyo.',
} as const;
