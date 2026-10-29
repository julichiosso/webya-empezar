/** Pie de /empezar. */
export const FOOTER = {
  lema: 'Creá. Digitalizá. Crecé.',
  bajada: 'Tu negocio. Nuestra tecnología.',
  /** Visible solo fuera de producción, mientras falte el mail de contacto. */
  todoEmail: 'TODO: configurar NEXT_PUBLIC_CONTACT_EMAIL.',
  instagram: 'Instagram @webya.dev',
  copyright: (anio: number) => `© ${anio} WebYa`,
} as const;
