/**
 * /sistema: vitrina interna del sistema de diseño (no se indexa). Los valores (colores, medidas,
 * duraciones, nombres de tokens e íconos) los lee la página de src/brand; acá va solo el texto que
 * los rodea. Los textos de muestra de los componentes son de ejemplo: no son copy de producción.
 */
export const SISTEMA = {
  seo: { titulo: 'Sistema de diseño' },
  titulo: 'Sistema de diseño',
  bajada:
    'Tokens, componentes, íconos e ilustraciones de WebYa, leídos de las fuentes reales: si cambia el código, cambia esta página.',
  nota: 'Página interna, no se indexa. Los textos de los componentes son de muestra.',
  manual: 'El manual de uso está en src/brand/BRAND.md.',

  indice: {
    etiqueta: 'Secciones',
    logo: 'Logo',
    color: 'Color',
    tipo: 'Tipografía',
    forma: 'Espacio y forma',
    movimiento: 'Movimiento',
    componentes: 'Componentes',
    iconos: 'Íconos',
    ilustraciones: 'Ilustraciones',
  },

  logo: {
    titulo: 'Logo',
    bajada:
      'Solo el wordmark, sin isotipo. Blanco sobre oscuro, negro sobre claro; nunca en Brasa, nunca deformado.',
    variantes: {
      completa: 'Completa',
      compacta: 'Compacta, la w sola',
      monocromo: 'Monocromo, sobre papel',
    },
    explicacion: {
      completa: 'La de siempre: header, pie, documentos.',
      compacta: 'Lugares chicos: favicon, avatar, app icon.',
      monocromo: 'Hereda la tinta del contenedor: papel, impresión.',
    },
    zona: 'Zona de respeto',
    zonaExplicacion:
      'Media altura de la w alrededor del logo: ahí no entra texto, borde ni otro logo.',
    minimo: 'Alto mínimo en pantalla',
    unidadPx: 'px',
  },

  color: {
    titulo: 'Color',
    bajada:
      'Tres capas: primitivos con nombre de material, semánticos con nombre de uso y de componente. El acento Brasa va solo en CTA, foco, selección y la pieza que encaja.',
    primitivos: 'Primitivos',
    semanticos: 'Semánticos, tema oscuro',
    claro: 'Lo que cambia en el tema claro',
    papel: 'Lo que cambia sobre papel',
    componentes: 'De componente',
    apuntaA: 'apunta a',
  },

  tipo: {
    titulo: 'Tipografía',
    bajada:
      'Outfit, con escala fluida. El cuerpo nunca baja de dieciséis píxeles: así iOS no hace zoom en los campos.',
    muestra: 'Tu negocio, pieza por pieza',
    columnas: { tamanio: 'Tamaño', interlineado: 'Interlineado', tracking: 'Tracking' },
    sinTracking: 'normal',
  },

  forma: {
    titulo: 'Espacio y forma',
    espacio: 'Espaciado',
    espacioBajada: 'Grilla de ocho píxeles. Estos tokens nombran los ritmos grandes.',
    radios: 'Radios',
    radiosBajada: 'Por jerarquía: control, tarjeta, panel. Nunca el mismo radio para todo.',
    nombresRadio: { control: 'Control', card: 'Tarjeta', panel: 'Panel' },
    sombra: 'Sombra',
    sombraBajada: 'Una sola elevación: un hilo de luz arriba y una sombra difusa.',
    sombraMuestra: 'Superficie elevada',
  },

  movimiento: {
    titulo: 'Movimiento',
    bajada:
      'Encastre: la pieza llega, se pasa apenas y asienta. Solo transform y opacity, una vez, y quieto con movimiento reducido.',
    duraciones: 'Duraciones',
    nombresDuracion: {
      instantaneo: 'Instantáneo: feedback de toque',
      rapido: 'Rápido: cambios chicos',
      base: 'Base: el snap, el clic de elegir',
      lento: 'Lento: entradas compuestas',
    },
    curvas: 'Curvas',
    nombresCurva: {
      salida: 'Salida, para casi todo',
      entradaSalida: 'Entrada y salida, para trazos',
    },
    escalas: 'Escalas',
    toque: 'Toque',
    sobrepaso: 'Sobrepaso del snap',
    pasoPieza: 'Paso entre piezas',
    presupuesto: 'Presupuesto',
    propiedades: 'Se anima',
    excepcion: 'Excepción, una vez y en trazos chicos',
    jsInicial: 'JS inicial de la ruta, en KB gzip',
    cls: 'Layout shift máximo',
    entradaMaxima: 'Entrada escalonada completa, en ms',
    unidadMs: 'ms',
    snap: 'Snap',
    snapBajada: 'Tocá para ver la pieza encajar otra vez. Con movimiento reducido aparece quieta.',
    snapRepetir: 'Encajar de nuevo',
    snapPieza: 'Pieza encajada',
  },

  componentes: {
    titulo: 'Componentes',
    bajada:
      'De src/components/ui, en sus estados. Hover, foco y toque se prueban en vivo: pasá el puntero, tabulá o tocá.',
    estados: {
      normal: 'Normal',
      deshabilitado: 'Deshabilitado',
      cargando: 'Cargando',
      exito: 'Listo',
      error: 'Con error',
      elegido: 'Elegido',
      sinElegir: 'Sin elegir',
      proximamente: 'Próximamente',
      presionado: 'Presionado',
      abierto: 'Abierto',
      cerrado: 'Cerrado',
      enlace: 'Enlace',
      valido: 'Válido',
      ayuda: 'Con ayuda',
      contador: 'Con contador',
    },
    boton: {
      titulo: 'Botón',
      variantes: {
        primario: 'Primario',
        secundario: 'Secundario',
        texto: 'Texto',
        pastilla: 'Pastilla',
        icono: 'Ícono',
      },
      muestra: 'Sumá una pieza',
      secundario: 'Mirá la demo',
      texto: 'Ahora no',
      pastilla: 'Filtrar',
      icono: 'Cerrar',
      error: 'No pudimos guardarlo. Probá de nuevo.',
    },
    campo: {
      titulo: 'Campo',
      etiqueta: 'Nombre del negocio',
      ayuda: 'Como lo conoce la gente del barrio.',
      error: 'Escribí el nombre del negocio para seguir.',
      valor: 'La esquina de Ana',
      area: 'Contanos qué necesitás',
      contador: (usados: number, maximo: number) => `${usados} de ${maximo} caracteres`,
    },
    eleccion: {
      titulo: 'Elección',
      chip: 'Chip, varias',
      fila: 'Fila, una sola',
      tarjeta: 'Tarjeta, varias',
      leyendaChip: 'Qué necesitás',
      leyendaFila: 'Tu rubro',
      leyendaTarjeta: 'Módulos',
      error: 'Elegí al menos una opción.',
      /** Ningún módulo real está "próximamente": la muestra del estado usa una pieza inventada. */
      muestraProximamente: {
        etiqueta: 'Pieza de muestra',
        descripcion: 'Así se ve un módulo que todavía no se entrega.',
      },
    },
    interruptor: {
      titulo: 'Interruptor',
      muestra: 'Con voz',
      conEncaje: 'Solo lo activado',
      error: 'No se pudo cambiar. Probá de nuevo.',
    },
    acordeon: { titulo: 'Acordeón' },
    tarjeta: {
      titulo: 'Tarjeta y panel',
      tarjeta: 'Tarjeta',
      panel: 'Panel',
      texto: 'Superficie con borde de un píxel y la elevación del sistema.',
      error: 'No pudimos cargar esto. Probá de nuevo.',
      exito: 'Guardado.',
    },
    spinner: { titulo: 'Spinner', etiqueta: 'Cargando…' },
    progreso: {
      titulo: 'Progreso',
      etiqueta: 'Progreso del armado',
      anterior: 'Paso anterior',
      siguiente: 'Paso siguiente',
    },
    papel: {
      titulo: 'Sobre papel',
      bajada: 'Los mismos componentes dentro de .papel: los tokens pasan solos a su versión clara.',
    },
  },

  iconos: {
    titulo: 'Íconos',
    bajada:
      'Propios, en grilla de veinticuatro, trazo uno y medio, sin relleno y con extremos redondos. Heredan el color del texto.',
    grupos: { rubro: 'Rubros', modulo: 'Módulos', necesidad: 'Necesidades', interfaz: 'Interfaz' },
  },

  ilustraciones: {
    titulo: 'Ilustraciones',
    bajada:
      'Grilla de noventa y seis, trazo dos, como mucho dos tonos planos. Lo que falta es un hueco punteado; lo que encaja, Brasa.',
    grupos: { plato: 'Platos de ejemplo', estado: 'Estados' },
    rubros: 'Escenas de rubro',
    rubrosBajada:
      'La portada de la vista previa en /empezar, chica y mediana. La pieza que encaja toma el acento de la paleta del negocio.',
    rubroGenerico: 'Genérico (otro rubro)',
    modulos: 'Arte de módulos',
    modulosBajada: 'Apagado en gris de línea; encendido, la pieza clave pasa al acento.',
    encendido: 'Encendido',
    apagado: 'Apagado',
    cargando: 'Cargando',
  },
} as const;
