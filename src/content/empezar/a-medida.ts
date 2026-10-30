/**
 * Sección propia "¿Y si lo que necesito no está?" (docs/plan-sprint.md §6, capa 3: a medida). Responde de
 * frente la duda que deja "todo lo digital". El CTA lleva al wizard con "Otra cosa" ya marcada.
 */
export const A_MEDIDA = {
  titulo: '¿Y si lo que necesito no está?',
  bajada: 'Lo armamos a medida. Contanos qué te falta con tus palabras, sin términos técnicos.',
  /** Ejemplos de pedidos libres (no son clientes ni casos reales: muestran cómo se puede escribir). */
  ejemplos: {
    leyenda: 'Lo podés contar así:',
    lista: [
      '"Quiero controlar el stock de mis dos locales."',
      '"Necesito que los repartos salgan ordenados."',
      '"Me gustaría mandar las facturas sin cargarlas a mano."',
    ],
  },
  /** Cómo sigue un pedido a medida. Lo que se compromete es la conversación y el presupuesto, no el resultado. */
  pasos: [
    { titulo: 'Nos contás', texto: 'Lo escribís en el formulario, en el paso "Otra cosa".' },
    {
      titulo: 'Lo vemos con vos',
      texto: 'Te escribimos por WhatsApp para entender bien qué necesitás.',
    },
    {
      titulo: 'Te decimos si se puede',
      texto: 'Y si se puede, te armamos un presupuesto sin compromiso.',
    },
  ],
  cta: 'Contanos qué necesitás',
} as const;
