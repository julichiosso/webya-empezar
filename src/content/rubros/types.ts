import type { ModuloId } from '@/content/modulos';

/** Un objetivo que el negocio puede querer lograr (chip del paso 2). */
export interface Objetivo {
  /** snake_case ASCII, estable: se guarda en la base. */
  id: string;
  /** Voseo rioplatense, empieza con verbo cuando se puede. */
  etiqueta: string;
}

/**
 * Definición de un rubro. Agregar un rubro = un archivo en `src/content/rubros/` + su línea
 * en `index.ts`. Ningún componente depende de un rubro concreto.
 */
export interface Rubro {
  /** snake_case ASCII minúsculas, estable: se guarda en la base. */
  id: string;
  nombre: string;
  /** Para la tarjeta de la pantalla 1 en celular, si `nombre` es largo (hasta 20 caracteres). */
  nombreCorto?: string;
  /** Clave del ícono (`RUBRO_ICONS` en `src/brand/ilustracion/iconos/paths.ts`; lo valida icons.test.ts). */
  icono: string;
  descripcionCorta: string;
  objetivos: readonly Objetivo[];
  modulosSugeridos: readonly ModuloId[];
  /** Qué se arma para este rubro, breve y sin prometer precios ni plazos. */
  ejemploResultado: string;
  /**
   * Sitio de ejemplo para la vista previa de /empezar ("Así te queda"). Todos los rubros lo tienen
   * salvo "otro", que no tiene vista previa (se arma a medida).
   */
  plantilla?: PlantillaRubro;
}

/**
 * Una pieza del sitio que depende de un módulo: con el módulo encendido se ve; apagado, en su lugar
 * queda el hueco punteado "Acá encaja…" (mismo tamaño: nada se mueve al prenderlo o apagarlo).
 */
export interface DetalleDeModulo {
  modulo: ModuloId;
  /** Lo que ve un cliente del negocio gracias a ese módulo ("Te recordamos el turno"). */
  texto: string;
}

/** Un servicio, plato o producto de ejemplo. Sin precios. */
export interface ItemDeEjemplo {
  nombre: string;
  detalle?: string;
}

/** Portada del sitio: el título es el nombre del negocio (el que escribió la persona). */
export interface PortadaPlantilla {
  /** Título mientras la persona no escribió el nombre de su negocio ("Tu peluquería"). */
  tituloDeEjemplo: string;
  bajada: string;
  /** Botón principal. Con su módulo encendido va en el acento; si no, queda `accionSinModulo`. */
  accion: { texto: string; modulo: ModuloId };
  accionSinModulo: string;
  detalle?: DetalleDeModulo;
}

interface SeccionBase {
  titulo: string;
  /** Módulo que hace funcionar la sección: apagado, la sección entera queda como hueco. */
  modulo?: ModuloId;
  detalle?: DetalleDeModulo;
}

/** Secciones del sitio de ejemplo. Un solo componente las dibuja para todos los rubros. */
export type SeccionPlantilla =
  | (SeccionBase & {
      tipo: 'lista';
      items: readonly ItemDeEjemplo[];
      /** Con este módulo encendido cada ítem lleva su botón para sumarlo (pedido o carrito). */
      moduloItems?: ModuloId;
    })
  | (SeccionBase & {
      tipo: 'agenda';
      modulo: ModuloId;
      /** Días cortos, en letras ("Mar"); el primero se ve elegido. */
      dias: readonly string[];
      /** Franjas en palabras ("Mañana"), nunca horas con cifras. */
      franjas: readonly string[];
    })
  | (SeccionBase & {
      tipo: 'formulario';
      modulo: ModuloId;
      /** Etiquetas de los campos ("Tu nombre"). */
      campos: readonly string[];
      accion: string;
    })
  | (SeccionBase & {
      tipo: 'horarios';
      filas: readonly { dias: string; horario: string }[];
    })
  | (SeccionBase & {
      tipo: 'contacto';
      whatsapp: string;
      /** Se reemplaza por la ciudad si la persona la cargó. */
      ubicacion: string;
    });

export type TipoSeccion = SeccionPlantilla['tipo'];

export interface PlantillaRubro {
  /**
   * Marca explícita: TODOS los textos de la plantilla son de ejemplo y la vista previa lo dice en
   * pantalla (`PREVIEW.deEjemplo`). Lo real lo armamos con la persona.
   */
  deEjemplo: true;
  /** Id de la escena de `IlustracionRubro` (src/brand/ilustracion/rubros); hoy, el id del rubro. */
  ilustracion: string;
  portada: PortadaPlantilla;
  /** En orden; cada una es una pieza que encaja al aparecer (ver LIMITES_PLANTILLA). */
  secciones: readonly SeccionPlantilla[];
}

/** Límites de contenido (los valida `rubros.test.ts`). */
export const LIMITES_RUBRO = {
  nombre: 40,
  nombreCorto: 20,
  descripcionCorta: 80,
  ejemploResultado: 160,
  etiquetaObjetivo: 48,
  minObjetivos: 2,
  maxObjetivos: 8,
} as const;

/**
 * Límites de la plantilla (los valida `rubros.test.ts`): lo que entra sin cortarse en la vista
 * previa a 320 px y en la columna de escritorio.
 */
export const LIMITES_PLANTILLA = {
  tituloDeEjemplo: 24,
  bajada: 72,
  accion: 20,
  tituloSeccion: 16,
  item: 26,
  detalleItem: 26,
  detalle: 36,
  dia: 3,
  franja: 8,
  campo: 22,
  horarioDias: 18,
  horario: 18,
  contacto: 26,
  minSecciones: 3,
  maxSecciones: 5,
  minItems: 2,
  maxItems: 3,
  minDias: 3,
  maxDias: 4,
  minFranjas: 2,
  maxFranjas: 3,
  campos: 2,
  minFilas: 1,
  maxFilas: 2,
} as const;
