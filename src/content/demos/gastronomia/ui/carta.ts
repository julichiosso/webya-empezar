/** La carta que ve el cliente (features/demo/gastronomia/cliente/Carta). */
export const CARTA = {
  escaneaste: 'Escaneaste el QR de la mesa 4',
  buscar: {
    etiqueta: 'Buscar en la carta',
    placeholder: '¿Qué tenés ganas de comer?',
  },
  ariaCategorias: 'Categorías de la carta',
  sinResultados: (busqueda: string) => `No encontramos “${busqueda}”. Probá con otra palabra.`,
  pie: 'Carta y precios de ejemplo.',
} as const;

/** Selector − n + (cliente/Cantidad). `de` es el nombre del plato. */
export const CANTIDAD = {
  aria: (de: string) => `Cantidad de ${de}`,
  quitar: (de: string) => `Quitar ${de}`,
  restar: (de: string) => `Restar uno de ${de}`,
  sumar: (de: string) => `Sumar uno de ${de}`,
} as const;

/** Detalle de un plato (cliente/PlatoDetalle). */
export const PLATO = {
  sinCargo: 'Sin cargo',
  /** Precio extra de una opción, ya formateado ("$ 1.500"). */
  masPrecio: (precio: string) => `+ ${precio}`,
  ninguno: 'Ninguno',
  grupo: {
    obligatorio: 'Elegí una',
    opcional: 'Opcional',
    varias: 'Podés elegir varias',
    /** `grupo` llega en minúscula. */
    falta: (grupo: string) => `Falta elegir ${grupo}.`,
  },
  nota: {
    titulo: '¿Algo para la cocina?',
    ayuda: (maximo: number) => `Opcional, hasta ${maximo} letras.`,
    placeholder: 'Por ejemplo: sin sal, bien cocido',
  },
  agregar: 'Agregar',
} as const;
