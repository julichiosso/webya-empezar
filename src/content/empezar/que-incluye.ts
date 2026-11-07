/** Sección "Qué incluye": los módulos salen de content/modulos.ts y cada uno dice su estado real. */
export const QUE_INCLUYE = {
  titulo: 'Activás solo lo que usás.',
  bajada: 'Esto ya lo entregamos hoy, armado para tu rubro.',
  proximos: (lista: string) =>
    `En camino: ${lista}. Si lo necesitás ya, contanos y lo armamos con vos.`,
} as const;
