export interface DatosWhatsApp {
  nombre: string;
  nombreNegocio: string;
  /** Nombre visible del rubro (si eligió "Otro", lo que escribió). */
  rubro: string;
  /** Nombres de los módulos que activó. */
  modulos: readonly string[];
  /** Opcionales: lo que quiere lograr. */
  objetivos: readonly string[];
  /** WhatsApp del lead, ya formateado para mostrar. */
  whatsapp?: string;
}

/** Mensaje prearmado con los datos del lead, en voseo. */
export function buildWhatsAppMessage(d: DatosWhatsApp): string {
  const lineas = [
    `¡Hola WebYa! Soy ${d.nombre}, de ${d.nombreNegocio} (${d.rubro}).`,
    d.modulos.length > 0 ? `Quiero activar: ${d.modulos.join(', ')}.` : '',
    d.objetivos.length > 0 ? `Quiero lograr: ${d.objetivos.join(', ')}.` : '',
    'Acabo de completar el formulario en webya.ar/empezar. ¿Hablamos?',
  ];
  return lineas.filter(Boolean).join('\n');
}

/**
 * Link wa.me. `numero` en formato internacional sin "+" ni espacios (ej. 5491123456789).
 * Devuelve null si el número del negocio no está configurado.
 */
export function buildWhatsAppLink(numero: string | undefined, mensaje: string): string | null {
  const limpio = (numero ?? '').replace(/\D/g, '');
  if (limpio.length < 10) return null;
  return `https://wa.me/${limpio}?text=${encodeURIComponent(mensaje)}`;
}
