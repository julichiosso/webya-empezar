'use client';

import { useId, useState, type FormEvent } from 'react';
import { CONTACTO_RAPIDO as C, CTA } from '@/content/home';
import { MENSAJES_LEAD } from '@/content/leads-mensajes';
import { LIMITES_BASE } from '@/domain/leads/limites';
import { parsePhoneAR } from '@/lib/phone';
import { enlaceContacto } from './contacto';
import { BotonForm } from './Boton';
import { WhatsApp } from './Iconos';

type Estado = 'quieto' | 'enviando' | 'listo' | 'error';

const CAMPO =
  'mt-1.5 block min-h-12 w-full rounded-xl border border-ed-line-strong bg-transparent px-4 text-base placeholder:text-ed-muted focus:border-ed-fg';

/**
 * "Te escribimos nosotros": la persona deja su WhatsApp (y, si quiere, el negocio y qué necesita) y el
 * pedido entra al sistema de leads con una sola request (validación, rate limit y trampa anti-spam en el
 * servidor; aviso al instante a Webya). Si algo falla, el mismo texto sale por WhatsApp: nunca se pierde.
 */
export function ContactoRapido() {
  const id = useId();
  const [whatsapp, setWhatsapp] = useState('');
  const [negocio, setNegocio] = useState('');
  const [texto, setTexto] = useState('');
  const [trampa, setTrampa] = useState('');
  const [estado, setEstado] = useState<Estado>('quieto');
  const [error, setError] = useState('');

  const respaldo = enlaceContacto(C.mensajeRespaldo(negocio.trim(), texto.trim())).href;

  async function enviar(e: FormEvent) {
    e.preventDefault();
    if (estado === 'enviando') return;
    if (!whatsapp.trim()) return setError(MENSAJES_LEAD.whatsappVacio);
    if (!parsePhoneAR(whatsapp).ok) return setError(MENSAJES_LEAD.whatsappInvalido);
    setError('');
    setEstado('enviando');
    const pedido = texto.trim();
    const nombre = negocio.trim();
    try {
      const r = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parcial: true,
          whatsapp,
          nombreNegocio: nombre.length >= 2 ? nombre : undefined,
          necesidadLibre: pedido.length >= LIMITES_BASE.necesidadLibreMin ? pedido : undefined,
          necesidades: [],
          modulos: [],
          objetivos: [],
          website: trampa,
        }),
      });
      if (!r.ok) throw new Error(String(r.status));
      setEstado('listo');
    } catch {
      setEstado('error');
    }
  }

  if (estado === 'listo') {
    return (
      <p role="status" className="e-lead rounded-2xl border border-ed-line p-6">
        {C.listo}
      </p>
    );
  }

  return (
    <form
      onSubmit={enviar}
      noValidate
      className="rounded-2xl border border-ed-line p-5 md:p-7"
      aria-labelledby={`${id}-titulo`}
    >
      <p id={`${id}-titulo`} className="e-h3 max-w-[24ch]">
        {C.titulo}
      </p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="e-chico text-ed-muted">{C.whatsapp}</span>
          <input
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            aria-invalid={error ? true : undefined}
            aria-describedby={`${id}-ayuda`}
            className={CAMPO}
          />
          <span
            id={`${id}-ayuda`}
            className={`e-chico mt-1.5 block ${error ? 'text-ed-fg' : 'text-ed-muted'}`}
          >
            {error || C.whatsappAyuda}
          </span>
        </label>
        <label className="block">
          <span className="e-chico text-ed-muted">{C.negocio}</span>
          <input
            type="text"
            autoComplete="organization"
            maxLength={LIMITES_BASE.nombreNegocio}
            value={negocio}
            onChange={(e) => setNegocio(e.target.value)}
            placeholder={C.negocioPlaceholder}
            className={CAMPO}
          />
        </label>
      </div>
      <label className="mt-4 block">
        <span className="e-chico text-ed-muted">{C.mensaje}</span>
        <textarea
          rows={2}
          maxLength={LIMITES_BASE.necesidadLibre}
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder={C.mensajePlaceholder}
          className={`${CAMPO} resize-none py-3`}
        />
      </label>
      {/* Trampa para bots: invisible y fuera del recorrido con teclado. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={trampa}
        onChange={(e) => setTrampa(e.target.value)}
        className="absolute -left-[9999px] size-px opacity-0"
      />
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="e-chico text-ed-muted">{C.privacidad}</p>
        <BotonForm
          cargando={estado === 'enviando'}
          texto={estado === 'enviando' ? C.enviando : C.enviar}
        />
      </div>
      {estado === 'error' ? (
        <div role="alert" className="mt-5 border-t border-ed-line pt-4">
          <p className="e-chico">{C.error}</p>
          <a
            href={respaldo}
            target="_blank"
            rel="noopener"
            aria-label={`${C.errorBoton}${CTA.pestana}`}
            className="e-btn e-btn-secundario e-btn-chico mt-3"
          >
            <WhatsApp />
            <span>{C.errorBoton}</span>
          </a>
        </div>
      ) : null}
    </form>
  );
}
