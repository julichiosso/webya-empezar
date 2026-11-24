'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type FormEvent, type RefObject } from 'react';
import { ASISTENTE as A } from '@/content/asistente';
import { DESTINOS_BUSQUEDA, PROBLEMAS, type DestinoBusqueda } from '@/content/buscador-destinos';
import { RUTAS } from '@/content/home';
import { buscar, detectarProblema, limpiarConsulta, normalizar } from '@/lib/busqueda';
import { enlaceContacto } from '../editorial/contacto';

type Mensaje = {
  id: number;
  de: 'bot' | 'yo';
  texto: string;
  /** Una o dos tarjetas con a dónde ir (el producto y su demo). */
  destinos?: DestinoBusqueda[];
  /** Link a otra página (la zona). */
  link?: { href: string; texto: string };
  /** Botón para seguir por WhatsApp con la pregunta ya escrita. */
  contacto?: string;
};

const PAUSA_MS = 650;
const LARGO_MAX = 240;

const contiene = (texto: string, claves: readonly string[]) => {
  const t = ` ${normalizar(texto)} `;
  return claves.some((c) => t.includes(normalizar(c)));
};
const destino = (id: string) => DESTINOS_BUSQUEDA.find((d) => d.id === id);

/** Qué contesta el asistente a lo que escribió la persona (todo local, sin red). */
export function responder(pregunta: string): Omit<Mensaje, 'id' | 'de'> {
  if (contiene(pregunta, A.claves.persona)) return { texto: A.persona, contacto: pregunta };
  if (contiene(pregunta, A.claves.zona))
    return { texto: A.zona, link: { href: RUTAS.zona, texto: A.verZona } };
  const problema = detectarProblema(pregunta, PROBLEMAS);
  if (problema) {
    const lista = [destino(problema.destino), problema.demo ? destino(problema.demo) : undefined];
    return { texto: problema.escucha, destinos: lista.filter((d): d is DestinoBusqueda => !!d) };
  }
  if (contiene(pregunta, A.claves.queHacen))
    return {
      texto: A.queHacen,
      destinos: ['turnero', 'pedidos', 'tienda', 'web'].flatMap((id) => destino(id) ?? []),
    };
  const [mejor] = buscar(DESTINOS_BUSQUEDA, pregunta, 1);
  if (mejor) return { texto: A.creo, destinos: [mejor] };
  return { texto: A.noEntendi, contacto: pregunta };
}

/**
 * El chat del asistente: saludo, preguntas rápidas y un campo para contar el problema con tus palabras.
 * Entiende lo mismo que el buscador del sitio (problemas, rubros, productos) y contesta con tarjetas que
 * llevan al producto o a su demo; si no sabe, te pasa con Julián por WhatsApp con tu pregunta escrita.
 * Es un diálogo: atrapa el foco, Escape lo cierra y el foco vuelve a la carita.
 */
export function PanelAsistente({
  cerrar,
  volverA,
}: {
  cerrar: () => void;
  volverA: RefObject<HTMLButtonElement | null>;
}) {
  const [mensajes, setMensajes] = useState<Mensaje[]>([{ id: 0, de: 'bot', texto: A.saludo }]);
  const [escribiendo, setEscribiendo] = useState(false);
  const [texto, setTexto] = useState('');
  const panel = useRef<HTMLDivElement>(null);
  const lista = useRef<HTMLOListElement>(null);
  const campo = useRef<HTMLInputElement>(null);
  const siguiente = useRef(1);
  const espera = useRef(0);

  useEffect(() => {
    const raiz = panel.current;
    const boton = volverA.current;
    // En la compu el foco va al campo; en el celular no (abriría el teclado tapando todo).
    if (matchMedia('(pointer: fine)').matches) campo.current?.focus();
    else raiz?.focus();
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === 'Escape') cerrar();
      if (e.key !== 'Tab' || !raiz) return;
      const f = [...raiz.querySelectorAll<HTMLElement>('a[href], button, input')].filter(
        (el) => el.offsetParent,
      );
      const primero = f[0];
      const ultimo = f[f.length - 1];
      if (!primero || !ultimo) return;
      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primero.focus();
      }
    };
    document.addEventListener('keydown', alTeclear);
    document.documentElement.toggleAttribute('data-asistente', true);
    return () => {
      document.removeEventListener('keydown', alTeclear);
      document.documentElement.removeAttribute('data-asistente');
      window.clearTimeout(espera.current);
      boton?.focus();
    };
  }, [cerrar, volverA]);

  // Cada mensaje nuevo queda a la vista.
  useEffect(() => {
    const el = lista.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [mensajes, escribiendo]);

  const preguntar = (crudo: string) => {
    const pregunta = limpiarConsulta(crudo, LARGO_MAX).trim();
    if (!pregunta || escribiendo) return;
    setMensajes((m) => [...m, { id: siguiente.current++, de: 'yo', texto: pregunta }]);
    setTexto('');
    setEscribiendo(true);
    espera.current = window.setTimeout(() => {
      setEscribiendo(false);
      setMensajes((m) => [...m, { id: siguiente.current++, de: 'bot', ...responder(pregunta) }]);
    }, PAUSA_MS);
  };

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    preguntar(texto);
  };

  const yaPregunto = mensajes.some((m) => m.de === 'yo');

  return (
    <>
      <div className="astp-fondo" aria-hidden="true" onClick={cerrar} />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={A.nombre}
        tabIndex={-1}
        className="tono-hueso astp"
      >
        <div className="astp-cabeza">
          <span className="astp-avatar" aria-hidden="true">
            <svg viewBox="0 0 64 64" focusable="false">
              <rect x="21" y="23" width="6" height="10" rx="3" />
              <rect x="37" y="23" width="6" height="10" rx="3" />
              <path d="M24 41q8 7 16 0" />
            </svg>
          </span>
          <div className="astp-quien">
            <p className="astp-nombre">{A.nombre}</p>
            <p className="astp-estado">{A.estado}</p>
          </div>
          <button type="button" className="astp-cerrar" aria-label={A.cerrar} onClick={cerrar}>
            <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
              <path d="m4 4 8 8M12 4l-8 8" />
            </svg>
          </button>
        </div>

        <ol ref={lista} className="astp-lista" aria-live="polite">
          {mensajes.map((m) => (
            <li key={m.id} className={m.de === 'bot' ? 'astp-msj astp-bot' : 'astp-msj astp-yo'}>
              <span className="sr-only">{m.de === 'bot' ? A.nombre : A.te}: </span>
              <p className="astp-burbuja">{m.texto}</p>
              {m.destinos?.length ? (
                <div className="astp-destinos">
                  {m.destinos.map((d) => (
                    <Link
                      key={d.id}
                      href={d.href}
                      prefetch={false}
                      onClick={cerrar}
                      className="astp-destino"
                    >
                      <span className="astp-destino-titulo">{d.titulo}</span>
                      <span className="astp-destino-texto">{d.texto}</span>
                    </Link>
                  ))}
                </div>
              ) : null}
              {m.link ? (
                <Link
                  href={m.link.href}
                  prefetch={false}
                  onClick={cerrar}
                  className="astp-chip astp-chip-link"
                >
                  {m.link.texto}
                </Link>
              ) : null}
              {m.contacto !== undefined ? <BotonContacto pregunta={m.contacto} /> : null}
            </li>
          ))}
          {escribiendo ? (
            <li className="astp-msj astp-bot" aria-label={A.escribiendo}>
              <p className="astp-burbuja astp-escribiendo" aria-hidden="true">
                <span />
                <span />
                <span />
              </p>
            </li>
          ) : null}
        </ol>

        {yaPregunto ? null : (
          <div className="astp-rapidas">
            {A.rapidas.map((r) => (
              <button key={r} type="button" className="astp-chip" onClick={() => preguntar(r)}>
                {r}
              </button>
            ))}
          </div>
        )}

        <form className="astp-form" onSubmit={enviar}>
          <label htmlFor="astp-campo" className="sr-only">
            {A.campo}
          </label>
          <input
            ref={campo}
            id="astp-campo"
            type="text"
            autoComplete="off"
            enterKeyHint="send"
            maxLength={LARGO_MAX}
            value={texto}
            placeholder={A.placeholder}
            onChange={(e) => setTexto(e.target.value)}
            className="astp-campo"
          />
          <button
            type="submit"
            className="astp-enviar"
            aria-label={A.enviar}
            disabled={!texto.trim()}
          >
            <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
              <path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" />
            </svg>
          </button>
        </form>
        <div className="astp-pie">
          <BotonContacto pregunta="" chico />
          <Link href={RUTAS.armar} prefetch={false} onClick={cerrar} className="astp-armar">
            {A.armar}
          </Link>
        </div>
      </div>
    </>
  );
}

function BotonContacto({ pregunta, chico = false }: { pregunta: string; chico?: boolean }) {
  const c = enlaceContacto(A.mensaje(pregunta));
  const externo = c.canal === 'whatsapp';
  return (
    <a
      href={c.href}
      target={externo ? '_blank' : undefined}
      rel={externo ? 'noopener' : undefined}
      className={chico ? 'astp-wa astp-wa-chico' : 'astp-wa'}
    >
      {externo ? A.whatsapp : A.mail}
    </a>
  );
}
