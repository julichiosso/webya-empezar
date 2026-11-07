'use client';

import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { flushSync } from 'react-dom';
import { variablesDePaleta } from '@/brand/tokens/colores';
import { buttonClasses } from '@/components/ui/Button';
import { Telefono } from '@/components/patterns/Telefono';
import { ORIGEN_DEMO_PELUQUERIA } from '@/config/origenes';
import {
  HORARIO_DEMO,
  NOMBRE_POR_DEFECTO,
  NOMBRE_SERVICIO,
  PALABRAS_DIA,
  SERVICIOS_DEMO,
  TURNOS_SEMANA_DEMO,
} from '@/content/demos/peluqueria/datos';
import {
  AVISO_DEMO_PELU,
  BOT,
  CTA_PELU,
  DIA_LARGO,
  PANEL_PELU,
  PERSONALIZAR_PELU,
  VISTAS_PELU,
} from '@/content/demos/peluqueria/ui';
import {
  getPaletaCurada,
  PALETA_CURADA_POR_DEFECTO,
  PALETAS_CURADAS,
  type PaletaCuradaId,
} from '@/content/paletas';
import { dejarTraspasoDemo, URL_WIZARD_DESDE_DEMO } from '@/domain/traspaso/demo-wizard';
import { formatearHora, type Turno } from '@/domain/turnos/agenda';
import {
  CONVERSACION_INICIAL,
  responderBot,
  type ConversacionBot,
  type EntradaBot,
} from '@/domain/turnos/bot';
import { track } from '@/lib/analytics';
import { ChatBot, type MensajeChat } from './ChatBot';
import { PanelTurnos } from './PanelTurnos';

const RUBRO = 'peluqueria_estetica';

type Vista = 'cliente' | 'duenio';

/** Lo que el bot dice después de un paso: lo arma con los datos que ya tiene. */
function decirBot(c: ConversacionBot, nombre?: string): string[] {
  const salida: string[] = [];
  if (c.aviso) salida.push(BOT.avisos[c.aviso]);
  const dia = c.dia ? DIA_LARGO[c.dia] : '';
  const servicio = c.servicioId ? (NOMBRE_SERVICIO[c.servicioId] ?? '') : '';
  const hora = c.inicio !== null ? formatearHora(c.inicio) : '';
  if (c.aviso === 'no_entendi' || c.aviso === 'nombre_corto') return salida;
  if (c.paso === 'dia' && !c.aviso) salida.push(BOT.preguntaDia(servicio));
  if (c.paso === 'horario' && c.aviso !== 'ocupado')
    salida.push(BOT.preguntaHorario(dia, c.franja));
  if (c.paso === 'nombre') salida.push(BOT.preguntaNombre(dia, hora));
  if (c.paso === 'listo' && nombre) salida.push(BOT.confirmado(nombre, servicio, dia, hora));
  return salida;
}

export function DemoPeluqueria({ encabezado }: { encabezado: ReactNode }) {
  const [negocio, setNegocio] = useState('');
  const [paleta, setPaleta] = useState<PaletaCuradaId>(PALETA_CURADA_POR_DEFECTO);
  const [turnos, setTurnos] = useState<readonly Turno[]>(TURNOS_SEMANA_DEMO);
  const [conversacion, setConversacion] = useState<ConversacionBot>(CONVERSACION_INICIAL);
  const [mensajes, setMensajes] = useState<readonly MensajeChat[]>([]);
  const [ultimoTurno, setUltimoTurno] = useState<Turno | null>(null);
  const [anuncio, setAnuncio] = useState('');
  const [vista, setVista] = useState<Vista>('cliente');
  const siguienteId = useRef(0);
  const nombreVisible = negocio.trim() || NOMBRE_POR_DEFECTO;

  useEffect(() => {
    track('demo_view', { demo: RUBRO, cocina: '' });
  }, []);

  const conId = useMemo(
    () =>
      (de: MensajeChat['de'], texto: string): MensajeChat => ({
        id: siguienteId.current++,
        de,
        texto,
      }),
    [],
  );

  // El saludo sale con el nombre del negocio; cambia solo mientras la charla no empezó.
  const charlaEmpezada = mensajes.length > 1;
  const saludo = BOT.saludo(nombreVisible);
  const lista = charlaEmpezada ? mensajes : [{ id: -1, de: 'bot' as const, texto: saludo }];

  const onEntrada = (entrada: EntradaBot, texto: string) => {
    const r = responderBot(conversacion, entrada, {
      servicios: SERVICIOS_DEMO,
      palabrasDia: PALABRAS_DIA,
      horario: HORARIO_DEMO,
      turnos,
      nuevoId: () => `bot-${Date.now()}`,
    });
    setConversacion(r.conversacion);
    const dichos = decirBot(r.conversacion, r.reserva?.turno.cliente);
    setMensajes((m) => [
      ...(m.length > 0 ? m : [conId('bot', saludo)]),
      conId('persona', texto),
      ...dichos.map((d) => conId('bot', d)),
    ]);
    if (r.reserva) {
      const t = r.reserva.turno;
      setTurnos(r.reserva.turnos);
      setUltimoTurno(t);
      setAnuncio(PANEL_PELU.agenda.anuncio(t.cliente, DIA_LARGO[t.dia], formatearHora(t.inicio)));
      track('demo_pedido_creado', {
        demo: RUBRO,
        modalidad: t.dia,
        items: 1,
        medioPago: 'ninguno',
      });
    }
  };

  const reiniciar = () => {
    setConversacion(CONVERSACION_INICIAL);
    setMensajes([]);
  };

  const cambiarVista = (v: Vista) => {
    if (v === vista) return;
    const aplicar = () => {
      flushSync(() => setVista(v));
      window.scrollTo({ top: 0 });
    };
    const reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reducir && typeof document.startViewTransition === 'function') {
      document.startViewTransition(aplicar);
    } else {
      aplicar();
    }
  };

  const novedades = ultimoTurno && vista === 'cliente';

  return (
    <div
      style={variablesDePaleta(getPaletaCurada(paleta)) as CSSProperties}
      className="pb-24 lg:pb-0"
    >
      <div className="sticky top-0 z-30 flex h-14 items-center justify-center gap-4 bg-surface-2 px-4 lg:justify-between lg:px-8">
        <p role="note" className="text-center text-small leading-tight font-medium text-fg">
          {AVISO_DEMO_PELU}
        </p>
        <CtaQuiero negocio={negocio} origen="barra" className="hidden lg:inline-flex" />
      </div>

      <p aria-live="polite" className="sr-only">
        {anuncio}
      </p>

      <div className="mx-auto w-full max-w-[90rem] lg:px-8 lg:pb-16">
        <div className="px-4 pt-6 pb-6 lg:px-0 lg:pt-10">{encabezado}</div>
        <div className="flex flex-col gap-4 px-4 pb-6 sm:flex-row sm:items-end lg:px-0 lg:pb-8">
          <label className="block w-full max-w-sm">
            <span className="mb-2 block text-small font-semibold">
              {PERSONALIZAR_PELU.etiqueta}
            </span>
            <input
              value={negocio}
              maxLength={40}
              autoComplete="off"
              placeholder={PERSONALIZAR_PELU.placeholder}
              onChange={(e) => setNegocio(e.target.value)}
              className="min-h-tap w-full rounded-control border border-control-borde bg-control-fondo px-4 text-body text-fg placeholder:text-muted"
            />
          </label>
          <div role="group" aria-label={PERSONALIZAR_PELU.colores} className="flex flex-wrap gap-2">
            {PALETAS_CURADAS.map((p) => (
              <button
                key={p.id}
                type="button"
                aria-pressed={paleta === p.id}
                aria-label={p.nombre}
                title={p.nombre}
                onClick={() => setPaleta(p.id)}
                style={variablesDePaleta(p) as CSSProperties}
                className="flex size-tap items-center justify-center rounded-full border border-line hover:border-line-strong aria-pressed:border-2 aria-pressed:border-fg"
              >
                <span aria-hidden="true" className="size-7 rounded-full bg-accent" />
              </button>
            ))}
          </div>
        </div>
        <div className="lg:grid lg:grid-cols-[22rem_minmax(0,1fr)] lg:items-start lg:gap-12">
          <div
            id="vista-cliente"
            className={vista === 'cliente' ? 'px-4 lg:px-0' : 'max-lg:hidden'}
          >
            <Telefono
              pantallaClassName="h-[34rem] lg:h-[38rem]"
              className="max-w-[22rem] lg:sticky lg:top-20"
            >
              <div className="papel h-full bg-paper text-paper-fg">
                <ChatBot
                  mensajes={lista}
                  conversacion={conversacion}
                  turnos={turnos}
                  onEntrada={onEntrada}
                  onReiniciar={reiniciar}
                />
              </div>
            </Telefono>
          </div>
          <div id="vista-duenio" className={vista === 'duenio' ? 'px-4 lg:px-0' : 'max-lg:hidden'}>
            <PanelTurnos turnos={turnos} ultimoTurno={ultimoTurno} />
          </div>
        </div>
      </div>

      {/* Abajo, flotante (solo celular y tablet): qué cara ver y el CTA. */}
      <div className="fixed inset-x-4 bottom-4 z-30 flex items-center justify-between gap-2 lg:hidden">
        <div
          role="group"
          aria-label={VISTAS_PELU.aria}
          className="flex gap-1 rounded-full border border-line-strong bg-surface-2 p-1 shadow-raised"
        >
          <BotonVista activa={vista === 'cliente'} onClick={() => cambiarVista('cliente')}>
            {VISTAS_PELU.cliente}
          </BotonVista>
          <BotonVista activa={vista === 'duenio'} onClick={() => cambiarVista('duenio')}>
            {VISTAS_PELU.duenio}
            {novedades && <span aria-hidden="true" className="size-2 rounded-full bg-accent" />}
          </BotonVista>
        </div>
        <CtaQuiero negocio={negocio} origen="flotante" corto className="shadow-raised" />
      </div>
    </div>
  );
}

function BotonVista({
  activa,
  onClick,
  children,
}: {
  activa: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={activa}
      onClick={onClick}
      className="flex min-h-tap items-center gap-2 rounded-full px-4 text-small font-semibold text-muted aria-pressed:bg-fg aria-pressed:text-bg"
    >
      {children}
    </button>
  );
}

/** "Quiero esto": deja el wizard listo con el rubro y el turnero. Es un link de verdad, anda sin JS. */
function CtaQuiero({
  negocio,
  origen,
  corto = false,
  className,
}: {
  negocio: string;
  origen: string;
  corto?: boolean;
  className?: string;
}) {
  return (
    <a
      href={URL_WIZARD_DESDE_DEMO}
      onClick={() => {
        track('demo_cta_click', { demo: RUBRO, origen });
        try {
          dejarTraspasoDemo(
            {
              origen: ORIGEN_DEMO_PELUQUERIA,
              rubro: RUBRO,
              modulos: ['turnos'],
              nombreNegocio: negocio.trim(),
            },
            window.sessionStorage,
          );
        } catch {
          // sin sessionStorage el link igual abre el wizard, sin precargar
        }
      }}
      aria-label={corto ? CTA_PELU.ariaCorto : undefined}
      className={`${buttonClasses('primary', false, 'compacto')} ${className ?? ''}`}
    >
      {corto ? CTA_PELU.corto : CTA_PELU.texto}
    </a>
  );
}
