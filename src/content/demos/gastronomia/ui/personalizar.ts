/** "Personalizá tu demo" (features/demo/gastronomia/Personalizar). */
export const PERSONALIZAR = {
  titulo: 'Personalizá tu demo',
  nombreLocal: 'Nombre de tu local',
  paleta: 'Paleta',
  cocina: 'Tipo de cocina',
  qr: {
    boton: 'Probalo en tu celular',
    ayuda: (nombreLocal: string) =>
      `Escanealo con la cámara: se abre esta demo, con ${nombreLocal} y tu paleta.`,
  },
  whatsapp: 'Mandame esta demo por WhatsApp',
} as const;
