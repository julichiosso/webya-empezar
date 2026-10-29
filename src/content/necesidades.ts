import type { NecesidadId } from '@/config/necesidades';
import type { ModuloId } from '@/content/modulos';

export { NECESIDAD_IDS, NECESIDAD_OTRA_ID, type NecesidadId } from '@/config/necesidades';

/** Una opción del paso "¿Qué necesitás?" (se pueden marcar varias). */
export interface Necesidad {
  id: NecesidadId;
  /** Chip corto, empieza con verbo. */
  etiqueta: string;
  /** Una frase honesta: qué resuelve, sin cifras ni superlativos. */
  descripcion: string;
  /** Módulos que se sugieren al marcarla. "Otra cosa" no sugiere ninguno: abre el texto libre. */
  modulosSugeridos: readonly ModuloId[];
}

/** En el orden en que se muestran. Un test verifica que coincidan con NECESIDAD_IDS. */
export const NECESIDADES: readonly Necesidad[] = [
  {
    id: 'vender',
    etiqueta: 'Vender online',
    descripcion: 'Tus productos con precio y un lugar para que te compren sin escribirte.',
    modulosSugeridos: ['catalogo', 'pedidos', 'pagos'],
  },
  {
    id: 'turnos',
    etiqueta: 'Recibir turnos',
    descripcion: 'Que tus clientes elijan día y horario solos, y vos veas la agenda.',
    modulosSugeridos: ['turnos', 'notificaciones'],
  },
  {
    id: 'carta',
    etiqueta: 'Mostrar la carta',
    descripcion: 'Tu carta en el celular de cada cliente, con un código QR en la mesa.',
    modulosSugeridos: ['carta_qr', 'pedidos'],
  },
  {
    id: 'cobrar',
    etiqueta: 'Cobrar',
    descripcion: 'Señas, cuotas o ventas cobradas sin coordinar transferencias a mano.',
    modulosSugeridos: ['pagos'],
  },
  {
    id: 'clientes',
    etiqueta: 'Organizar clientes',
    descripcion: 'Tus clientes, sus consultas y su historial en un solo lugar.',
    modulosSugeridos: ['clientes', 'formularios', 'notificaciones'],
  },
  {
    id: 'otra',
    etiqueta: 'Otra cosa',
    descripcion: 'Contanos qué necesitás con tus palabras y vemos cómo armarlo a medida.',
    modulosSugeridos: [],
  },
];

export function getNecesidad(id: string | null | undefined): Necesidad | undefined {
  return NECESIDADES.find((n) => n.id === id);
}
