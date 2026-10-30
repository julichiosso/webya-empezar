'use client';

import { useEffect, useId, useState, type CSSProperties } from 'react';
import { Icon } from '@/brand/ilustracion/iconos/Icon';
import { buttonClasses } from '@/components/ui/Button';
import {
  COCINA_IDS,
  COCINAS,
  getCocina,
  PALETAS_DEMO,
  RUBRO_DEMO,
} from '@/content/demos/gastronomia';
import { PERSONALIZAR } from '@/content/demos/gastronomia/ui/personalizar';
import { track } from '@/lib/analytics';
import { CodigoQR } from './CodigoQR';
import { linkWhatsAppDemo, urlCompartible } from './compartir';
import { LARGO_NOMBRE_LOCAL, personalizar, useDemo } from './store';

/**
 * "Personalizá tu demo": nombre del local, una de 6 paletas curadas y el tipo de cocina. La carta,
 * el panel y el seguimiento se repintan al instante (paleta = variables CSS con scope). Abajo,
 * compartir: QR para abrirla en el celular (escritorio) y el link por WhatsApp.
 */
export function Personalizar() {
  const { nombreLocal, paletaId, cocinaId } = useDemo();
  const cocina = getCocina(cocinaId);
  const [abierto, setAbierto] = useState(false);
  const [qr, setQr] = useState(false);
  const [origen, setOrigen] = useState('');
  const idCampos = useId();

  // El origen real (localhost, el dominio de Vercel o webya.ar) recién se conoce en el navegador.
  useEffect(() => {
    const t = setTimeout(() => setOrigen(window.location.origin), 0);
    return () => clearTimeout(t);
  }, []);

  const url = urlCompartible(origen, { nombreLocal, paletaId, cocinaId });
  const nombreVisible = nombreLocal ?? cocina.nombreLocalPorDefecto;

  return (
    <section
      aria-label={PERSONALIZAR.titulo}
      className="rounded-panel border border-line bg-surface p-4 lg:p-6"
    >
      <h2 className="text-heading font-semibold">
        {/* En celular el título abre y cierra los campos; en escritorio están siempre a la vista
            (ahí no hay botón: un aria-expanded falso confundiría a los lectores de pantalla). */}
        <span className="hidden lg:block">{PERSONALIZAR.titulo}</span>
        <button
          type="button"
          aria-expanded={abierto}
          aria-controls={idCampos}
          onClick={() => setAbierto(!abierto)}
          className="flex min-h-tap w-full items-center justify-between gap-4 text-left lg:hidden"
        >
          {PERSONALIZAR.titulo}
          <Icon
            name="arrowDown"
            size={20}
            className={`transition-transform ${abierto ? 'rotate-180' : ''}`}
          />
        </button>
      </h2>

      <div
        id={idCampos}
        className={`${abierto ? 'grid' : 'hidden'} mt-4 gap-6 lg:grid lg:grid-cols-[16rem_minmax(0,1fr)_auto] lg:items-start lg:gap-8`}
      >
        <label className="block">
          <span className="font-semibold">{PERSONALIZAR.nombreLocal}</span>
          <input
            name="nombreLocal"
            value={nombreLocal ?? ''}
            onChange={(e) => personalizar({ nombreLocal: e.target.value })}
            onBlur={() =>
              nombreLocal &&
              track('demo_personalizada', { demo: RUBRO_DEMO, campo: 'nombre', valor: 'escrito' })
            }
            maxLength={LARGO_NOMBRE_LOCAL}
            placeholder={cocina.nombreLocalPorDefecto}
            autoComplete="organization"
            className="mt-2 min-h-tap w-full rounded-control border border-line-strong bg-surface-2 px-4 text-body text-fg placeholder:text-subtle"
          />
        </label>

        <fieldset>
          <legend className="font-semibold">{PERSONALIZAR.paleta}</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {PALETAS_DEMO.map((p) => (
              <label key={p.id} className="cursor-pointer">
                <input
                  type="radio"
                  name="paleta-demo"
                  checked={paletaId === p.id}
                  onChange={() => {
                    personalizar({ paletaId: p.id });
                    track('demo_personalizada', { demo: RUBRO_DEMO, campo: 'paleta', valor: p.id });
                  }}
                  className="peer sr-only"
                />
                <span className="flex min-h-tap items-center gap-2 rounded-full border border-line px-2 pr-4 text-small font-medium text-muted peer-checked:border-fg peer-checked:text-fg peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent">
                  <span
                    aria-hidden="true"
                    className="size-6 rounded-full"
                    // El color sale de la config curada (con contraste verificado), no de un hex suelto.
                    style={{ background: p.accent } as CSSProperties}
                  />
                  {p.nombre}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="font-semibold">{PERSONALIZAR.cocina}</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {COCINA_IDS.map((id) => (
              <label key={id} className="cursor-pointer">
                <input
                  type="radio"
                  name="cocina-demo"
                  checked={cocinaId === id}
                  onChange={() => {
                    personalizar({ cocinaId: id });
                    track('demo_personalizada', { demo: RUBRO_DEMO, campo: 'cocina', valor: id });
                  }}
                  className="peer sr-only"
                />
                <span className="flex min-h-tap items-center rounded-full border border-line px-4 text-small font-semibold text-muted peer-checked:border-fg peer-checked:text-fg peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent">
                  {COCINAS[id].nombre}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-2 border-t border-line pt-4">
        {/* El QR tiene sentido en escritorio: en el celular ya estás en el celular. */}
        <div className="hidden lg:block">
          <button
            type="button"
            aria-expanded={qr}
            onClick={() => {
              if (!qr) track('demo_qr_celular', { demo: RUBRO_DEMO });
              setQr(!qr);
            }}
            className={buttonClasses('secondary', false, 'compacto')}
          >
            <Icon name="carta_qr" size={18} />
            {PERSONALIZAR.qr.boton}
          </button>
          {qr && origen && (
            <div className="mt-4 flex items-center gap-4">
              <CodigoQR url={url} />
              <p className="max-w-56 text-small text-muted">
                {PERSONALIZAR.qr.ayuda(nombreVisible)}
              </p>
            </div>
          )}
        </div>
        <a
          href={origen ? linkWhatsAppDemo(url, nombreVisible) : undefined}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track('demo_whatsapp_click', { demo: RUBRO_DEMO })}
          className={buttonClasses('secondary', false, 'compacto')}
        >
          <Icon name="chat" size={18} />
          {PERSONALIZAR.whatsapp}
        </a>
      </div>
    </section>
  );
}
