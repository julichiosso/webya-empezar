/** Recorrido de marca: Creá → Digitalizá → Crecé. Una sola frase por paso. */
// TODO: confirmar qué se ofrece en "Crecé" (clientes, métricas) antes de prometer más que esto.
export const COMO_FUNCIONA = {
  titulo: 'Cómo funciona',
  pasos: [
    { nombre: 'Creá', texto: 'Elegí tu rubro y activá los módulos que necesitás.' },
    { nombre: 'Digitalizá', texto: 'Armamos lo que elegiste y lo ponemos online con vos.' },
    {
      nombre: 'Crecé',
      texto: 'Tus clientes te encuentran y te contactan, y vemos juntos qué sumar.',
    },
  ],
} as const;
