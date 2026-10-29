/** Compartir la demo: el QR para el celular y el mensaje del link de WhatsApp. */
export const COMPARTIR = {
  ariaQr: 'Código QR para abrir esta demo en tu celular',
  mensajeWhatsApp: (nombreLocal: string, url: string) =>
    `Mirá cómo quedaría ${nombreLocal} con WebYa (demo con datos de ejemplo): ${url}`,
} as const;
