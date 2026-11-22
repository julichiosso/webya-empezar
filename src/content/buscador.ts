/**
 * Buscador del hero: lo que la persona escribe con sus palabras ("turnos para mi peluquería", "vender
 * ropa", "cuánto sale") y a dónde la lleva. Todo vive acá y se busca en el navegador: no hay requests ni se
 * guarda lo que se escribe. Las palabras van sin tildes y en minúscula (la búsqueda las normaliza igual).
 */

export const BUSCADOR = {
  etiqueta: 'Contanos qué le pasa a tu negocio',
  placeholder: 'Escribilo como se lo contarías a alguien',
  /** Rotan en el campo vacío, como ejemplos de cómo escribir. */
  ejemplosRotan: [
    'Me reservan turno y después no vienen',
    'Los viernes no doy abasto con los pedidos',
    'Nadie me encuentra en Google',
    'Mando fotos de productos una por una',
    'Llevo todo en un cuaderno',
  ],
  /** Atajos: los cinco pedidos más comunes. */
  ejemplos: [
    'me reservan y no vienen',
    'no doy abasto con los pedidos',
    'nadie me encuentra',
    'quiero vender online',
    'cuánto sale',
  ],
  ejemplosEtiqueta: 'Por ejemplo',
  /** El buscador que escucha: primero la empatía, después la solución. */
  escucha: 'Te entendemos',
  solucion: (sistema: string) => `Lo resolvemos con: ${sistema}. Tocá para ver cómo.`,
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
