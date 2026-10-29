/** Marco de la demo (features/demo/gastronomia/DemoGastronomia): selector de vista y CTA al lead. */
export const DEMO = {
  cargandoPanel: 'Cargando el panel…',
  vistas: {
    aria: 'Qué querés ver',
    /** Prefijo solo para lectores de pantalla ("Ver como Cliente"). */
    prefijo: 'Ver como ',
    cliente: 'Cliente',
    duenio: 'Dueño',
    pedidosNuevos: (n: number) => (n === 1 ? 'pedido nuevo' : 'pedidos nuevos'),
  },
  cta: {
    texto: 'Quiero esto para mi local',
    corto: 'Lo quiero',
    /** Nombre accesible de la versión corta: contiene el texto visible (WCAG 2.5.3). */
    ariaCorto: 'Lo quiero para mi local',
  },
} as const;
