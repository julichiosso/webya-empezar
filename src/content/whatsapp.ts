/**
 * Mensajes precargados de WhatsApp (wa.me/?text=…): lo que la persona encuentra escrito al abrir el chat
 * con WebYa. Los escribe ella, así que van en primera persona y en voseo; al equipo lo trata de "ustedes".
 * Cortos, sin datos que no haya dado y con lugar para que siga escribiendo.
 */

/** Lo que el wizard sabe del lead al armar el mensaje. Todo opcional menos el WhatsApp, que ya lo tenemos. */
export interface DatosMensajeLead {
  nombre?: string;
  nombreNegocio?: string;
  /** Nombre visible del rubro (si eligió "Otro", lo que escribió). */
  rubro?: string;
  /** Nombres de los módulos que activó. */
  modulos?: readonly string[];
  /** Etiquetas de los objetivos que marcó. */
  objetivos?: readonly string[];
  /** Lo que escribió en "Otra cosa". */
  necesidadLibre?: string;
}

const conPunto = (t: string) => (/[.!?…]$/.test(t) ? t : `${t}.`);

function saludo(d: DatosMensajeLead): string {
  const quien = d.nombre ? `Soy ${d.nombre}` : '';
  const negocio = d.nombreNegocio ? `${quien ? ', de' : 'Escribo de'} ${d.nombreNegocio}` : '';
  const rubro = d.rubro ? ` (${d.rubro})` : '';
  const presentacion = `${quien}${negocio}${negocio || quien ? rubro : ''}`;
  return presentacion ? `Hola, WebYa. ${presentacion}.` : 'Hola, WebYa.';
}

export const MENSAJE_WHATSAPP = {
  /** CTA de contacto general (footer, nav, páginas de error): sin datos del lead. */
  contacto: 'Hola, WebYa. Vi la página y quiero armar lo digital de mi negocio. Les cuento qué necesito:',
  /** Desde la sección "¿Y si lo que necesito no está?". */
  aMedida:
    'Hola, WebYa. Necesito algo que no vi en la lista y quiero saber si lo pueden armar a medida. Es esto:',
  /** Respaldo cuando falla el envío del formulario. */
  respaldo:
    'Hola, WebYa. Quise dejar mis datos en la página y no se enviaron, así que les escribo por acá.',
  /**
   * Con lo que eligió en el wizard (botón "Hablar por WhatsApp" de la confirmación). Reemplaza al texto de
   * lib/whatsapp.ts (buildWhatsAppMessage), que es copy en una capa que no corresponde.
   */
  lead: (d: DatosMensajeLead) =>
    [
      saludo(d),
      d.modulos?.length ? `Quiero activar: ${d.modulos.join(', ')}.` : '',
      d.objetivos?.length ? `Quiero lograr: ${d.objetivos.join(', ')}.` : '',
      d.necesidadLibre ? `También necesito esto: ${conPunto(d.necesidadLibre)}` : '',
      'Dejé mis datos en webya.ar/empezar. ¿Hablamos?',
    ]
      .filter(Boolean)
      .join('\n'),
} as const;
