'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Icon } from '@/brand/ilustracion/iconos/Icon';
import { cn } from '@/components/ui/clases';
import { HORARIO_DEMO, NOMBRE_SERVICIO, SERVICIOS_DEMO } from '@/content/demos/peluqueria/datos';
import { BOT, DIA_CORTO, DIA_LARGO } from '@/content/demos/peluqueria/ui';
import { DIAS_SEMANA, formatearHora, horariosLibres, type Turno } from '@/domain/turnos/agenda';
import type { ConversacionBot, EntradaBot } from '@/domain/turnos/bot';

export interface MensajeChat {
  id: number;
  de: 'bot' | 'persona';
  texto: string;
}

interface ChatBotProps {
  mensajes: readonly MensajeChat[];
  conversacion: ConversacionBot;
  turnos: readonly Turno[];
  onEntrada: (entrada: EntradaBot, texto: string) => void;
  onReiniciar: () => void;
}

const OPCION =
  'min-h-tap rounded-full border border-paper-line bg-paper px-4 text-small font-medium hover:border-paper-fg';

/** Hasta dónde mostrar horarios: lo que entra sin scrollear de más. */
const MAX_HORARIOS = 8;

/**
 * La cara del cliente: la charla con el bot. Se puede escribir con tus palabras o tocar una opción,
 * que dicen lo mismo. Sin estado propio salvo el texto que se está escribiendo.
 */
export function ChatBot({ mensajes, conversacion, turnos, onEntrada, onReiniciar }: ChatBotProps) {
  const [texto, setTexto] = useState('');
  const fondo = useRef<HTMLDivElement>(null);
  const enPaso = conversacion.paso;

  // La charla baja sola al último mensaje (solo su propio scroll, nunca el de la página).
  useEffect(() => {
    const el = fondo.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [mensajes, enPaso]);

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    const limpio = texto.trim();
    if (!limpio) return;
    onEntrada({ tipo: 'texto', texto: limpio }, limpio);
    setTexto('');
  };

  const minutos = SERVICIOS_DEMO.find((s) => s.id === conversacion.servicioId)?.minutos ?? 0;
  const horarios =
    enPaso === 'horario' && conversacion.dia
      ? horariosLibres(
          turnos,
          conversacion.dia,
          minutos,
          HORARIO_DEMO,
          conversacion.franja ?? undefined,
        ).slice(0, MAX_HORARIOS)
      : [];

  return (
    <div className="flex h-full flex-col">
      <div
        ref={fondo}
        role="log"
        aria-label={BOT.aria}
        aria-live="polite"
        tabIndex={0}
        className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto overscroll-contain p-4"
      >
        {mensajes.map((m) => (
          <p
            key={m.id}
            className={cn(
              'fade-in max-w-[85%] rounded-card px-4 py-2 text-small',
              m.de === 'bot'
                ? 'self-start border border-paper-line bg-paper-2'
                : 'self-end bg-accent text-accent-fg',
            )}
          >
            {m.texto}
          </p>
        ))}
        <div className="mt-2 flex flex-wrap gap-2 empty:hidden">
          {enPaso === 'servicio' &&
            SERVICIOS_DEMO.map((s) => (
              <button
                key={s.id}
                type="button"
                className={OPCION}
                onClick={() =>
                  onEntrada({ tipo: 'servicio', id: s.id }, NOMBRE_SERVICIO[s.id] ?? s.id)
                }
              >
                {NOMBRE_SERVICIO[s.id]}
              </button>
            ))}
          {enPaso === 'dia' &&
            DIAS_SEMANA.map((d) => (
              <button
                key={d}
                type="button"
                aria-label={DIA_LARGO[d]}
                className={OPCION}
                onClick={() => onEntrada({ tipo: 'dia', dia: d }, DIA_LARGO[d])}
              >
                {DIA_CORTO[d]}
              </button>
            ))}
          {horarios.map((inicio) => (
            <button
              key={inicio}
              type="button"
              className={`${OPCION} tabular`}
              onClick={() => onEntrada({ tipo: 'horario', inicio }, formatearHora(inicio))}
            >
              {formatearHora(inicio)}
            </button>
          ))}
          {enPaso === 'listo' && (
            <button type="button" className={OPCION} onClick={onReiniciar}>
              {BOT.reiniciar}
            </button>
          )}
        </div>
      </div>
      {enPaso !== 'listo' && (
        <form onSubmit={enviar} className="flex gap-2 border-t border-paper-line p-2">
          <label className="min-w-0 flex-1">
            <span className="sr-only">{BOT.campo}</span>
            <input
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              maxLength={80}
              autoComplete="off"
              placeholder={enPaso === 'nombre' ? BOT.placeholderNombre : BOT.placeholderTexto}
              className="min-h-tap w-full rounded-control border border-paper-line bg-paper px-4 text-body text-paper-fg placeholder:text-paper-muted"
            />
          </label>
          <button
            type="submit"
            aria-label={BOT.enviar}
            className="flex size-tap shrink-0 items-center justify-center rounded-control bg-accent text-accent-fg"
          >
            <Icon name="arrowRight" size={20} />
          </button>
        </form>
      )}
    </div>
  );
}
