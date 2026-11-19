import {
  DIAS_SEMANA,
  horariosLibres,
  reservar,
  type DiaSemana,
  type Franja,
  type HorarioLocal,
  type Servicio,
  type Turno,
} from './agenda';

/**
 * La conversación del bot de la demo, como máquina de estados pura: recibe lo que dijo la persona (una
 * opción tocada o texto libre) y devuelve el paso siguiente. Del texto saca todo lo que encuentre de
 * una ("corte el sábado a la tarde" resuelve tres preguntas). Los textos viven en content; acá solo hay
 * claves y datos.
 */
export type PasoBot = 'servicio' | 'dia' | 'horario' | 'nombre' | 'listo';

export interface ConversacionBot {
  paso: PasoBot;
  servicioId: string | null;
  dia: DiaSemana | null;
  franja: Franja | null;
  inicio: number | null;
  /** Aviso del último turno de la conversación: no entendió, o ese horario ya no está. */
  aviso: 'no_entendi' | 'sin_lugar' | 'ocupado' | 'nombre_corto' | null;
}

export const CONVERSACION_INICIAL: ConversacionBot = {
  paso: 'servicio',
  servicioId: null,
  dia: null,
  franja: null,
  inicio: null,
  aviso: null,
};

export type EntradaBot =
  | { tipo: 'servicio'; id: string }
  | { tipo: 'dia'; dia: DiaSemana }
  | { tipo: 'horario'; inicio: number }
  | { tipo: 'texto'; texto: string };

export interface ContextoBot {
  servicios: readonly (Servicio & { palabras: readonly string[] })[];
  /** Cómo se puede nombrar cada día. */
  palabrasDia: Readonly<Record<DiaSemana, readonly string[]>>;
  horario: HorarioLocal;
  turnos: readonly Turno[];
  /** Para el id del turno que se crea. */
  nuevoId: () => string;
}

export interface RespuestaBot {
  conversacion: ConversacionBot;
  /** Si en este paso se reservó, la agenda nueva y el turno creado. */
  reserva?: { turnos: Turno[]; turno: Turno };
}

/** Minúsculas y sin acentos: "Sábado" y "sabado" son lo mismo. */
export const normalizar = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();

const contienePalabra = (texto: string, palabra: string) =>
  new RegExp(`(^|[^a-z0-9])${palabra}($|[^a-z0-9])`).test(texto);

/** Lo que se entiende de un texto libre. "A la mañana" es la franja; no se confunde con "mañana". */
export function interpretar(
  crudo: string,
  ctx: Pick<ContextoBot, 'servicios' | 'palabrasDia'>,
): { servicioId?: string; dia?: DiaSemana; franja?: Franja; inicio?: number } {
  const texto = normalizar(crudo);
  const salida: ReturnType<typeof interpretar> = {};
  // El más específico primero: "corte y barba" antes que "corte".
  const servicios = [...ctx.servicios].sort(
    (a, b) =>
      Math.max(...b.palabras.map((p) => p.length)) - Math.max(...a.palabras.map((p) => p.length)),
  );
  const servicio = servicios.find((s) => s.palabras.some((p) => contienePalabra(texto, p)));
  if (servicio) salida.servicioId = servicio.id;
  const dia = DIAS_SEMANA.find((d) => ctx.palabrasDia[d].some((p) => contienePalabra(texto, p)));
  if (dia) salida.dia = dia;
  if (/\ba la manana\b|\bpor la manana\b|\bde manana\b/.test(texto)) salida.franja = 'manana';
  else if (/\btarde\b/.test(texto)) salida.franja = 'tarde';
  const hora = /\b(?:a las|las)\s+(\d{1,2})(?:[:.](\d{2}))?\b/.exec(texto);
  if (hora) salida.inicio = Number(hora[1]) * 60 + Number(hora[2] ?? 0);
  return salida;
}

const minutosDe = (ctx: ContextoBot, id: string | null) =>
  ctx.servicios.find((s) => s.id === id)?.minutos ?? 0;

/** Pasa al primer dato que falta, con lo que ya se sabe. */
function siguientePaso(c: ConversacionBot, ctx: ContextoBot): ConversacionBot {
  if (!c.servicioId) return { ...c, paso: 'servicio' };
  if (!c.dia) return { ...c, paso: 'dia' };
  const minutos = minutosDe(ctx, c.servicioId);
  const libres = horariosLibres(ctx.turnos, c.dia, minutos, ctx.horario, c.franja ?? undefined);
  if (c.inicio !== null && !libres.includes(c.inicio)) {
    return { ...c, paso: 'horario', inicio: null, aviso: 'ocupado' };
  }
  if (c.inicio === null) {
    if (libres.length === 0) {
      return { ...c, paso: 'dia', dia: null, franja: null, aviso: 'sin_lugar' };
    }
    return { ...c, paso: 'horario' };
  }
  return { ...c, paso: 'nombre' };
}

/** Un paso de la conversación. */
export function responderBot(
  actual: ConversacionBot,
  entrada: EntradaBot,
  ctx: ContextoBot,
): RespuestaBot {
  const c: ConversacionBot = { ...actual, aviso: null };

  if (entrada.tipo === 'texto' && actual.paso === 'nombre') {
    const nombre = entrada.texto.trim().slice(0, 40);
    if (nombre.length < 2) return { conversacion: { ...c, aviso: 'nombre_corto' } };
    const minutos = minutosDe(ctx, c.servicioId);
    const turno: Turno = {
      id: ctx.nuevoId(),
      dia: c.dia!,
      inicio: c.inicio!,
      minutos,
      servicioId: c.servicioId!,
      cliente: nombre,
      delBot: true,
    };
    const r = reservar(ctx.turnos, turno, ctx.horario);
    if (!r.ok) return { conversacion: { ...c, paso: 'horario', inicio: null, aviso: 'ocupado' } };
    return { conversacion: { ...c, paso: 'listo' }, reserva: { turnos: r.turnos, turno } };
  }

  if (entrada.tipo === 'servicio') {
    return { conversacion: siguientePaso({ ...c, servicioId: entrada.id, inicio: null }, ctx) };
  }
  if (entrada.tipo === 'dia') {
    return { conversacion: siguientePaso({ ...c, dia: entrada.dia, inicio: null }, ctx) };
  }
  if (entrada.tipo === 'horario') {
    return { conversacion: siguientePaso({ ...c, inicio: entrada.inicio }, ctx) };
  }

  const leido = interpretar(entrada.texto, ctx);
  if (Object.keys(leido).length === 0) return { conversacion: { ...c, aviso: 'no_entendi' } };
  return {
    conversacion: siguientePaso(
      {
        ...c,
        servicioId: leido.servicioId ?? c.servicioId,
        dia: leido.dia ?? c.dia,
        franja: leido.franja ?? c.franja,
        inicio: leido.inicio ?? c.inicio,
      },
      ctx,
    ),
  };
}
