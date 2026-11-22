'use client';

import Link from 'next/link';
import { useEffect, useState, useSyncExternalStore } from 'react';
import { BARRA_DEMOS, getDemo, type DemoInfo } from '@/content/demos/hub';
import { ESTUDIO } from '@/content/demos/studio';
import type { ControlesEstudio } from '@/domain/studio/controles';
import { track } from '@/lib/analytics';
import { siteConfig } from '@/lib/site-config';
import { enlaceContacto } from './contacto';
import { EnUso } from './EnUso';
import { HojaDemo } from './HojaDemo';
import { WhatsApp } from './Iconos';

const CLAVE_TEXTO = 'webya:texto-grande';

const EVENTO_TEXTO = 'webya:texto-grande';
/** Si el almacenamiento falla (modo privado), el valor vive en memoria durante la visita. */
let textoEnMemoria = false;

function leerTextoGrande() {
  try {
    return window.localStorage.getItem(CLAVE_TEXTO) === '1';
  } catch {
    return textoEnMemoria;
  }
}

function suscribirTextoGrande(avisar: () => void) {
  window.addEventListener(EVENTO_TEXTO, avisar);
  window.addEventListener('storage', avisar);
  return () => {
    window.removeEventListener(EVENTO_TEXTO, avisar);
    window.removeEventListener('storage', avisar);
  };
}

/** "Texto grande": sube toda la letra un escalón (las demos miden en rem) y se recuerda en el dispositivo. */
function useTextoGrande() {
  const grande = useSyncExternalStore(suscribirTextoGrande, leerTextoGrande, () => false);
  useEffect(() => {
    document.documentElement.toggleAttribute('data-texto-grande', grande);
    return () => document.documentElement.removeAttribute('data-texto-grande');
  }, [grande]);
  const cambiar = () => {
    textoEnMemoria = !grande;
    try {
      window.localStorage.setItem(CLAVE_TEXTO, grande ? '0' : '1');
    } catch {
      // Queda en memoria.
    }
    window.dispatchEvent(new Event(EVENTO_TEXTO));
  };
  return [grande, cambiar] as const;
}

const BOTON =
  'flex min-h-12 items-center gap-2 rounded-full px-4 text-[1rem] font-medium transition-colors disabled:opacity-40';
const FILA =
  'flex min-h-14 w-full items-center gap-3 rounded-2xl bg-ed-surface px-5 text-left text-[1.0625rem] font-medium active:opacity-70';

/**
 * Barra de cada demo. Arriba: volver a las demos, el nombre y un solo "Menú" (en la compu, además,
 * Deshacer/Rehacer, Texto grande y "Quiero este sistema"). En el celular, "Quiero este sistema" va en una
 * barra fija abajo, grande y a mano del pulgar. "Quiero este sistema" abre "Enviarnos lo que armé": el
 * resumen de la demo y WhatsApp con el mensaje y el link ya escritos.
 */
export function BarraDemo({
  demo,
  onReiniciar,
  estudio,
  extra,
}: {
  demo: DemoInfo['id'];
  onReiniciar?: () => void;
  /** Demos personalizables: historial, link y resumen. */
  estudio?: ControlesEstudio;
  /** Un botón propio de la demo en la barra (por ejemplo, "Personalizar"). */
  extra?: React.ReactNode;
}) {
  const d = getDemo(demo);
  const [menu, setMenu] = useState(false);
  const [enviar, setEnviar] = useState(false);
  const [aviso, setAviso] = useState('');
  const [link, setLink] = useState('');
  const [grande, cambiarGrande] = useTextoGrande();
  const reiniciar = estudio?.reiniciar ?? onReiniciar;

  useEffect(() => {
    if (!aviso) return;
    const t = setTimeout(() => setAviso(''), 4000);
    return () => clearTimeout(t);
  }, [aviso]);

  // El link se arma al abrir "Enviarnos": así lleva lo último que armó la persona.
  useEffect(() => {
    if (!enviar || !estudio) return;
    let vivo = true;
    void estudio.enlace().then((l) => vivo && setLink(l));
    return () => {
      vivo = false;
    };
  }, [enviar, estudio]);

  const resumen = estudio?.resumen ?? [];
  const mensaje = estudio
    ? ESTUDIO.enviar.mensaje(d.barra, resumen, link)
    : BARRA_DEMOS.mensaje(d.barra);
  const whatsapp = enlaceContacto(mensaje).href;
  const mail = `mailto:${siteConfig.contactEmail}?subject=${encodeURIComponent(
    ESTUDIO.enviar.asuntoMail(d.barra),
  )}&body=${encodeURIComponent(mensaje)}`;

  const abrirEnviar = (origen: string) => {
    track('demo_cta_click', { demo, origen });
    setMenu(false);
    setEnviar(true);
  };

  const compartir = async () => {
    if (!estudio) return;
    track('demo_accion', { demo, accion: 'compartir' });
    try {
      const url = await estudio.enlace();
      if (navigator.share) await navigator.share({ title: d.titulo, url });
      else {
        await navigator.clipboard.writeText(url);
        setAviso(ESTUDIO.acciones.compartido);
      }
    } catch (e) {
      if ((e as Error)?.name !== 'AbortError') setAviso(ESTUDIO.acciones.compartirError);
    }
  };

  const copiarMensaje = async () => {
    track('demo_enviada', { demo, canal: 'copiar' });
    try {
      await navigator.clipboard.writeText(mensaje);
      setAviso(ESTUDIO.enviar.copiado);
    } catch {
      setAviso(ESTUDIO.acciones.compartirError);
    }
  };

  return (
    <>
      <div className="tono-oscuro sticky top-0 z-40 border-b border-ed-line bg-ed-bg">
        <div className="flex h-14 items-center gap-1.5 px-2 md:gap-2 md:px-4">
          <Link
            href="/demos"
            aria-label={ESTUDIO.volverAria}
            className="flex min-h-12 items-center gap-1 rounded-full px-2.5 text-[1rem] text-ed-muted hover:text-ed-fg"
          >
            <Volver />
            <span className="max-sm:sr-only">{ESTUDIO.volver}</span>
          </Link>
          <p className="flex min-w-0 flex-1 items-center gap-2">
            <span className="rounded-full bg-ed-fg/12 px-2 py-1 text-[0.75rem] leading-none font-semibold tracking-[0.04em] uppercase">
              {ESTUDIO.marca}
            </span>
            <span className="truncate text-[1.0625rem] font-semibold">{d.barra}</span>
          </p>
          {estudio ? (
            <span className="hidden items-center gap-1 lg:flex">
              <button
                type="button"
                className={BOTON}
                onClick={() => {
                  track('demo_accion', { demo, accion: 'deshacer' });
                  estudio.deshacer();
                }}
                disabled={!estudio.puedeDeshacer}
              >
                <Flecha atras />
                {ESTUDIO.deshacer}
              </button>
              <button
                type="button"
                className={BOTON}
                onClick={() => {
                  track('demo_accion', { demo, accion: 'rehacer' });
                  estudio.rehacer();
                }}
                disabled={!estudio.puedeRehacer}
              >
                <Flecha />
                {ESTUDIO.rehacer}
              </button>
            </span>
          ) : null}
          {extra}
          <button
            type="button"
            aria-pressed={grande}
            onClick={() => {
              track('demo_accion', { demo, accion: 'texto_grande' });
              cambiarGrande();
            }}
            className={`${BOTON} hidden aria-pressed:bg-ed-fg aria-pressed:text-ed-bg lg:flex`}
          >
            <Letra />
            {ESTUDIO.textoGrande}
          </button>
          <button
            type="button"
            aria-label={ESTUDIO.menuAria}
            aria-haspopup="dialog"
            onClick={() => setMenu(true)}
            className={`${BOTON} border border-ed-line-strong`}
          >
            <Hamburguesa />
            {ESTUDIO.menu}
          </button>
          {/* .e-btn fija su display: el ocultamiento va en un envoltorio. */}
          <span className="hidden lg:contents">
            <button
              type="button"
              onClick={() => abrirEnviar('barra')}
              className="e-btn e-btn-primario min-h-12"
            >
              {ESTUDIO.quiero}
            </button>
          </span>
        </div>
      </div>

      {/* Celular y tablet: la acción principal, sola, abajo. */}
      <div className="d-cta-fija tono-oscuro fixed inset-x-0 bottom-0 z-40 border-t border-ed-line bg-ed-bg px-4 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] lg:hidden">
        <button
          type="button"
          onClick={() => abrirEnviar('barra-movil')}
          className="e-btn e-btn-primario min-h-14 w-full text-[1.0625rem]"
        >
          {ESTUDIO.quiero}
        </button>
      </div>

      {aviso ? (
        <p
          role="status"
          className="tono-claro fixed inset-x-4 bottom-24 z-50 mx-auto max-w-md rounded-2xl bg-ed-fg px-5 py-4 text-center text-[1.0625rem] text-ed-bg lg:bottom-6"
        >
          {aviso}
        </p>
      ) : null}

      <HojaDemo abierta={menu} onCerrar={() => setMenu(false)} titulo={ESTUDIO.menuTitulo}>
        <ul className="space-y-2.5">
          {estudio ? (
            <>
              <li className="grid grid-cols-2 gap-2.5 lg:hidden">
                <button
                  type="button"
                  className={FILA}
                  disabled={!estudio.puedeDeshacer}
                  onClick={estudio.deshacer}
                >
                  <Flecha atras />
                  {ESTUDIO.deshacer}
                </button>
                <button
                  type="button"
                  className={FILA}
                  disabled={!estudio.puedeRehacer}
                  onClick={estudio.rehacer}
                >
                  <Flecha />
                  {ESTUDIO.rehacer}
                </button>
              </li>
              <li>
                <button type="button" className={FILA} onClick={compartir}>
                  <Compartir />
                  <span>
                    <span className="block">{ESTUDIO.acciones.compartir}</span>
                    <span className="block text-[0.9375rem] font-normal text-ed-muted">
                      {ESTUDIO.acciones.compartirAyuda}
                    </span>
                  </span>
                </button>
              </li>
            </>
          ) : null}
          <li className="lg:hidden">
            <button type="button" aria-pressed={grande} className={FILA} onClick={cambiarGrande}>
              <Letra />
              <span className="flex-1">{ESTUDIO.textoGrande}</span>
              <span
                aria-hidden="true"
                className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${grande ? 'bg-ed-fg' : 'bg-ed-line-strong'}`}
              >
                <span
                  className={`absolute top-1 left-1 size-5 rounded-full bg-ed-bg transition-transform ${grande ? 'translate-x-5' : ''}`}
                />
              </span>
            </button>
          </li>
          {reiniciar ? (
            <li>
              <button
                type="button"
                className={FILA}
                onClick={() => {
                  track('demo_accion', { demo, accion: 'reiniciar' });
                  reiniciar();
                  setMenu(false);
                  setAviso(estudio ? ESTUDIO.acciones.reiniciado : '');
                }}
              >
                <Reinicio />
                <span>
                  <span className="block">{ESTUDIO.acciones.reiniciar}</span>
                  {estudio ? (
                    <span className="block text-[0.9375rem] font-normal text-ed-muted">
                      {ESTUDIO.acciones.reiniciarAyuda}
                    </span>
                  ) : null}
                </span>
              </button>
            </li>
          ) : null}
          <li>
            <a
              href={enlaceContacto(BARRA_DEMOS.mensaje(d.barra)).href}
              target="_blank"
              rel="noopener"
              onClick={() => track('demo_whatsapp_click', { demo })}
              className={FILA}
            >
              <WhatsApp />
              {ESTUDIO.acciones.escribinos}
            </a>
          </li>
          <li>
            <Link href="/demos" className={FILA}>
              <Volver />
              {ESTUDIO.acciones.otras}
            </Link>
          </li>
        </ul>

        <div className="mt-7">
          <h3 className="text-[1.125rem] font-semibold">{ESTUDIO.queMas}</h3>
          <ul className="mt-3 space-y-2.5 text-[1.0625rem] text-ed-muted">
            {d.ademas.map((a) => (
              <li key={a} className="flex gap-3">
                <span aria-hidden="true" className="mt-[0.7em] h-px w-3 shrink-0 bg-ed-fg" />
                {a}
              </li>
            ))}
          </ul>
          {d.enUso ? <EnUso proyecto={d.enUso} className="mt-5" /> : null}
          <p className="mt-5 text-[0.9375rem] text-ed-muted">
            {ESTUDIO.aviso} {estudio ? ESTUDIO.guardado : null}
          </p>
        </div>
      </HojaDemo>

      <HojaDemo abierta={enviar} onCerrar={() => setEnviar(false)} titulo={ESTUDIO.enviar.titulo}>
        <p className="text-[1.0625rem] text-ed-muted">{ESTUDIO.enviar.bajada}</p>
        {resumen.length ? (
          <div className="mt-5 rounded-2xl bg-ed-surface p-5">
            <h3 className="text-[1rem] font-semibold">{ESTUDIO.enviar.resumen}</h3>
            <ul className="mt-2 space-y-1.5 text-[1.0625rem]">
              {resumen.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </div>
        ) : null}
        <div className="mt-5 grid gap-2.5">
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener"
            onClick={() => track('demo_enviada', { demo, canal: 'whatsapp' })}
            className="e-btn e-btn-primario min-h-14 w-full text-[1.0625rem]"
          >
            <WhatsApp />
            {ESTUDIO.enviar.whatsapp}
          </a>
          <div className="grid grid-cols-2 gap-2.5">
            <button type="button" onClick={copiarMensaje} className={FILA}>
              {ESTUDIO.enviar.copiar}
            </button>
            <a
              href={mail}
              onClick={() => track('demo_enviada', { demo, canal: 'mail' })}
              className={FILA}
            >
              {ESTUDIO.enviar.mail}
            </a>
          </div>
          <Link
            href={d.cta.href}
            className="flex min-h-12 items-center justify-center text-[1rem] text-ed-muted underline underline-offset-4"
          >
            {ESTUDIO.enviar.configurador}
          </Link>
        </div>
      </HojaDemo>
    </>
  );
}

const svg = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  className: 'size-5 shrink-0',
};

const Volver = () => (
  <svg {...svg}>
    <path d="M15 5l-7 7 7 7" />
  </svg>
);
const Hamburguesa = () => (
  <svg {...svg}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);
const Flecha = ({ atras = false }: { atras?: boolean }) => (
  <svg {...svg} style={atras ? undefined : { transform: 'scaleX(-1)' }}>
    <path d="M9 14 4 9l5-5" />
    <path d="M4 9h10a6 6 0 0 1 0 12h-3" />
  </svg>
);
const Letra = () => (
  <svg {...svg}>
    <path d="M3 19 9 5l6 14M5.5 14h7M16 19l3-7 3 7M17 17h4" />
  </svg>
);
const Compartir = () => (
  <svg {...svg}>
    <path d="M12 3v13M7 8l5-5 5 5M5 14v5h14v-5" />
  </svg>
);
const Reinicio = () => (
  <svg {...svg}>
    <path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4h4" />
  </svg>
);
