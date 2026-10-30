/**
 * Lo que todavía no está definido y decide el usuario. Cada texto empieza con "TODO:" y se muestra tal
 * cual donde haga falta (no se promete hasta tenerlo). Cuando se confirme, se reemplaza el texto
 * visible que lo acompaña y se borra la clave.
 */
export const PENDIENTES = {
  /** Plazo de la primera respuesta. Mientras tanto se dice "Te escribimos por WhatsApp". */
  plazoRespuesta:
    'TODO: confirmar el plazo de la primera respuesta (antes decía "menos de 24 hs").',
  /** Precios y planes. Mientras tanto: presupuesto sin compromiso. */
  precios: 'TODO: definir precios y planes.',
  /** Plazos de armado y entrega. Mientras tanto: "te lo decimos en el presupuesto". */
  plazoEntrega: 'TODO: definir plazos de armado y entrega.',
  /** Dominio propio: si se soporta y en qué condiciones. */
  dominio: 'TODO: confirmar si se puede usar dominio propio y en qué condiciones.',
  /** Política de privacidad. */
  privacidad: 'TODO: enlazar la política de privacidad.',
  /** Módulos en estado "disponible" que el usuario todavía no confirmó. */
  moduloSinConfirmar: 'TODO: confirmar que hoy lo entregamos.',
} as const;
