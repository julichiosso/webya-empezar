/**
 * Demo Studio: el texto común de todas las demos personalizables (barra, menú, "Enviarnos lo que armé",
 * asistente, marca, fotos y simulador). Lenguaje de todos los días, frases cortas, sin jerga.
 */

export const ESTUDIO = {
  marca: 'Demo',
  volver: 'Demos',
  volverAria: 'Volver a la lista de demos',
  menu: 'Menú',
  menuAria: 'Abrir el menú de la demo',
  cerrar: 'Cerrar',
  deshacer: 'Deshacer',
  rehacer: 'Rehacer',
  personalizar: 'Personalizar',
  textoGrande: 'Texto grande',
  quiero: 'Quiero este sistema',
  aviso: 'Demostración con datos de ejemplo.',
  menuTitulo: 'Opciones de la demo',
  queMas: 'Qué más hace el sistema real',
  guardado: 'Lo que armás se guarda solo en este dispositivo.',
  privacidad: 'Las fotos que subas no salen de tu dispositivo.',
  acciones: {
    compartir: 'Compartir mi demo',
    compartirAyuda: 'Un link con lo que armaste (sin fotos).',
    compartido: 'Link copiado.',
    compartirError: 'No se pudo copiar. Probá de nuevo.',
    reiniciar: 'Empezar de nuevo',
    reiniciarAyuda: 'Si te arrepentís, tocá Deshacer.',
    reiniciado: 'Listo, empezaste de nuevo.',
    escribinos: 'Escribinos por WhatsApp',
    otras: 'Ver las otras demos',
  },
  enviar: {
    titulo: 'Enviarnos lo que armé',
    bajada: 'Te respondemos con una propuesta para tu negocio.',
    resumen: 'Lo que armaste',
    whatsapp: 'Enviar por WhatsApp',
    copiar: 'Copiar el mensaje',
    copiado: 'Mensaje copiado.',
    mail: 'Enviar por mail',
    configurador: 'Prefiero armarlo paso a paso',
    asuntoMail: (sistema: string) => `Mi demo de ${sistema.toLowerCase()}`,
    mensaje: (sistema: string, lineas: readonly string[], link: string) =>
      [
        `Hola, vengo de webya.dev. Armé esta demo de ${sistema.toLowerCase()}:`,
        ...lineas.map((l) => `• ${l}`),
        link ? `La podés abrir acá: ${link}` : '',
      ]
        .filter(Boolean)
        .join('\n'),
  },
  asistente: {
    aria: 'Armá tu demo, paso a paso',
    paso: (n: number | string, total: number | string) => `Paso ${n} de ${total}`,
    atras: 'Atrás',
    siguiente: 'Siguiente',
    saltar: 'Saltar',
    saltarTodo: 'Ver la demo así',
    listo: 'Ver mi sistema',
    finTitulo: 'Listo. Mirá cómo quedó tu sistema.',
  },
  campos: {
    nombre: 'Nombre de tu negocio',
    nombreAyuda: 'Así lo van a ver tus clientes.',
    color: 'Elegí un color',
    colorAjustado: 'Lo oscurecimos un poco para que se lea bien.',
    colorAria: (nombre: string) => `Color ${nombre}`,
    fuente: 'Elegí un estilo de letra',
  },
  foto: {
    subir: 'Subir logo o foto',
    cambiar: 'Cambiar',
    quitar: 'Quitar',
    ayuda: 'Si no tenés, seguimos igual.',
    procesando: 'Preparando la foto…',
    errores: {
      tipo: 'Ese archivo no es una foto. Elegí una imagen.',
      peso: 'La foto es muy pesada. Probá con otra.',
      lectura: 'No pudimos abrir la foto. Probá con otra.',
    },
  },
  simulador: {
    iniciar: 'Simular un día de trabajo',
    pausar: 'Pausar',
    seguir: 'Seguir',
    detener: 'Terminar',
    rapido: 'Más rápido',
    normal: 'Normal',
    terminado: 'Terminó el día.',
    aria: 'Simulación de un día de trabajo',
  },
  dispositivo: {
    aria: 'Ver en',
    celular: 'Celular',
    tablet: 'Tablet',
    compu: 'Computadora',
  },
} as const;

/** Colores para la marca de la demo: los clásicos de un comercio. El contraste se corrige solo. */
export const COLORES_MARCA = [
  { id: 'negro', nombre: 'Negro', hex: '#111111' },
  { id: 'rojo', nombre: 'Rojo', hex: '#c62f2f' },
  { id: 'naranja', nombre: 'Naranja', hex: '#e2621b' },
  { id: 'amarillo', nombre: 'Amarillo', hex: '#f2b705' },
  { id: 'verde', nombre: 'Verde', hex: '#1f7a45' },
  { id: 'petroleo', nombre: 'Petróleo', hex: '#0e6870' },
  { id: 'azul', nombre: 'Azul', hex: '#1d4ed8' },
  { id: 'violeta', nombre: 'Violeta', hex: '#6d3fc0' },
  { id: 'rosa', nombre: 'Rosa', hex: '#c2255c' },
  { id: 'marron', nombre: 'Marrón', hex: '#7a4a2a' },
] as const;

export type ColorMarcaId = (typeof COLORES_MARCA)[number]['id'];

/** Estilos de letra: fuentes del sistema (cero descargas), cada una con un carácter distinto. */
export const FUENTES_MARCA = [
  { id: 'moderna', nombre: 'Moderna', pila: 'var(--font-sans), system-ui, sans-serif' },
  { id: 'clasica', nombre: 'Clásica', pila: 'Georgia, "Times New Roman", serif' },
  {
    id: 'redonda',
    nombre: 'Redondeada',
    pila: 'ui-rounded, "SF Pro Rounded", "Arial Rounded MT Bold", system-ui, sans-serif',
  },
  {
    id: 'fuerte',
    nombre: 'Fuerte',
    pila: '"Arial Black", "Helvetica Neue", Impact, system-ui, sans-serif',
  },
  {
    id: 'elegante',
    nombre: 'Elegante',
    pila: '"Palatino Linotype", Palatino, "Book Antiqua", serif',
  },
] as const;

export type FuenteMarcaId = (typeof FUENTES_MARCA)[number]['id'];

export const colorMarca = (id: string) =>
  COLORES_MARCA.find((c) => c.id === id) ?? COLORES_MARCA[0];
export const fuenteMarca = (id: string) =>
  FUENTES_MARCA.find((f) => f.id === id) ?? FUENTES_MARCA[0];
