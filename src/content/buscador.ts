/**
 * Buscador del hero: lo que la persona escribe con sus palabras ("turnos para mi peluquería", "vender
 * ropa", "cuánto sale") y a dónde la lleva. Todo vive acá y se busca en el navegador: no hay requests ni se
 * guarda lo que se escribe. Las palabras van sin tildes y en minúscula (la búsqueda las normaliza igual).
 */

export const BUSCADOR = {
  etiqueta: '¿Qué necesita tu negocio?',
  placeholder: 'Escribí lo que necesitás',
  /** Rotan en el campo vacío, como ejemplos de cómo escribir. */
  ejemplosRotan: [
    'Quiero recibir pedidos de mi pizzería',
    'Necesito que no se me pierdan los turnos',
    'Quiero vender online mis productos',
    'Necesito una página para mi consultorio',
  ],
  /** Atajos: los cinco pedidos más comunes. */
  ejemplos: [
    'turnos para mi peluquería',
    'pedidos para mi pizzería',
    'vender online',
    'página para mi consultorio',
    'cuánto sale',
  ],
  ejemplosEtiqueta: 'Probá con',
  sugerencias: 'Sugerencias',
  limpiar: 'Borrar',
  /** Armar ese sistema en /armar, con el tipo (y el rubro, si lo nombró) ya elegidos. */
  armar: (sistema: string) => `Armá tu sistema: ${sistema.toLowerCase()}`,
  armarTexto: 'Ya va elegido. Sumás lo que quieras y nos lo mandás.',
  /** Siempre al final: lo que escribió, directo a WhatsApp. */
  escribinos: (texto: string) => `Contanos «${texto}» por WhatsApp`,
  escribinosTexto: 'Te respondemos nosotros.',
  mensaje: (texto: string) => `Hola, vengo de webya.dev. Necesito esto para mi negocio: ${texto}`,
  sinResultados: 'No encontramos eso en la página, pero seguro lo podemos armar.',
  resultados: (n: number | string) => `${n} sugerencias`,
} as const;

/** Largo máximo de lo que se escribe (nada más largo llega al buscador ni al mensaje). */
export const LARGO_BUSQUEDA = 80;
