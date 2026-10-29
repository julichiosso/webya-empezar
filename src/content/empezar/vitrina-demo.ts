/** Vitrina de la demo en /empezar: el momento "esto es lo que me falta", a un toque. */
export const VITRINA_DEMO = {
  eyebrow: 'Demo en vivo · sin registrarte',
  titulo: 'Mirá tu local funcionando',
  bajada: 'Pedí como cliente desde el celular y miralo llegar al panel del dueño, en tiempo real.',
  cta: 'Probar la demo',
  /** Mini comanda decorativa: lo que ve el dueño cuando entra un pedido (datos de ejemplo). */
  comanda: {
    numero: '#24',
    estado: 'Nuevo',
    detalle: 'Mesa 4 · hace 1 min',
    items: [
      { cantidad: '2×', nombre: 'Muzzarella grande' },
      { cantidad: '1×', nombre: 'Fainá' },
    ],
  },
} as const;
