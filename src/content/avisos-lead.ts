/**
 * Avisos que recibe el equipo de WebYa cuando entra un lead (Telegram y mail). Los lee el dueño, no el
 * cliente: van directo al grano y con el link para escribirle con un toque.
 */
export interface DatosAvisoLead {
  negocio: string | null;
  rubro: string | null;
  ciudad?: string | null;
  modulos: readonly string[];
  pedidoLibre?: string | null;
  origen?: string | null;
  linkWhatsapp: string | null;
  whatsapp: string;
}

const lineas = (...l: readonly (string | null | false | undefined)[]) =>
  l.filter(Boolean).join('\n');

export const AVISOS_LEAD = {
  sinNombre: 'Sin nombre todavía',
  sinRubro: 'Sin rubro',
  asunto: (negocio: string | null) => `Lead nuevo: ${negocio ?? 'sin nombre todavía'}`,
  nuevo: (d: DatosAvisoLead) =>
    lineas(
      `Lead nuevo: ${d.negocio ?? AVISOS_LEAD.sinNombre}`,
      `Rubro: ${d.rubro ?? AVISOS_LEAD.sinRubro}`,
      d.ciudad && `Ciudad: ${d.ciudad}`,
      d.modulos.length > 0 && `Quiere: ${d.modulos.join(', ')}`,
      d.pedidoLibre && `Pedido: ${d.pedidoLibre}`,
      d.origen && `Vino de: ${d.origen}`,
      `WhatsApp: ${d.whatsapp}`,
      d.linkWhatsapp && `Escribile ahora: ${d.linkWhatsapp}`,
    ),
  /** Lo que se le abre a quien atiende el lead: el primer mensaje, ya escrito. */
  primerMensaje: (negocio: string | null) =>
    negocio
      ? `¡Hola! Te escribo de WebYa. Vi que estuviste armando ${negocio}. ¿Lo seguimos por acá?`
      : '¡Hola! Te escribo de WebYa. Vi que estuviste armando tu negocio. ¿Lo seguimos por acá?',
  asuntoCompletado: (negocio: string) => `Sumó datos: ${negocio}`,
  completado: (d: {
    negocio: string;
    nombre: string | null;
    email: string | null;
    mensaje: string | null;
  }) =>
    lineas(
      `Sumó datos: ${d.negocio}`,
      d.nombre && `Nombre: ${d.nombre}`,
      d.email && `Mail: ${d.email}`,
      d.mensaje && `Mensaje: ${d.mensaje}`,
    ),
} as const;
