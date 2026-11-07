'use client';

import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { Icon } from '@/brand/ilustracion/iconos/Icon';
import { variablesDePaleta } from '@/brand/tokens/colores';
import { CodigoQR } from '@/components/patterns/CodigoQR';
import { SitioNegocio } from '@/components/patterns/SitioNegocio';
import { Telefono } from '@/components/patterns/Telefono';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Input } from '@/components/ui/Field';
import { ORIGEN_CREAR } from '@/config/origenes';
import { CREAR } from '@/content/crear';
import { PALETAS_CURADAS } from '@/content/paletas';
import { RUBROS_CON_VISTA_PREVIA, getRubro } from '@/content/rubros';
import { track } from '@/lib/analytics';
import { parsePhoneAR } from '@/lib/phone';
import { siteConfig } from '@/lib/site-config';
import { buildWhatsAppLink } from '@/lib/whatsapp';
import { crearLeadParcial } from '../api';
import {
  borradorVacio,
  codificarBorrador,
  decodificarBorrador,
  LIMITES_BORRADOR as L,
  sanearBorrador,
  whatsappDeBorrador,
  type BorradorSitio,
} from './borrador';

const CLAVE = 'webya:crear:v1';
const RUBRO_INICIAL = RUBROS_CON_VISTA_PREVIA[0]!.id;
const C = CREAR.campos;

type Estado = 'idle' | 'enviando' | 'listo' | 'error';

/** De dónde sale el borrador al abrir: el link, lo que venía armando o lo que eligió en el wizard. */
function borradorInicial(): BorradorSitio | null {
  const delLink = decodificarBorrador(window.location.hash.slice(1));
  if (delLink) return delLink;
  const q = new URLSearchParams(window.location.search);
  const rubro = q.get('rubro');
  if (rubro) {
    const b = sanearBorrador({
      ...borradorVacio(rubro),
      nombre: q.get('nombre') ?? '',
      paleta: q.get('paleta') ?? undefined,
    });
    if (b) return b;
  }
  try {
    const guardado = window.localStorage.getItem(CLAVE);
    return guardado ? sanearBorrador(JSON.parse(guardado)) : null;
  } catch {
    return null;
  }
}

/**
 * El creador autoservicio: la persona carga su negocio y ve el sitio mientras escribe. Se lleva un link
 * real (el borrador viaja en el link, sin cuenta y sin base) y, si quiere publicarlo, ahí recién deja
 * su WhatsApp. En celular, una cara a la vez; en escritorio, las dos.
 */
export function EditorSitio({ encabezado }: { encabezado: ReactNode }) {
  const [b, setB] = useState<BorradorSitio>(() => borradorVacio(RUBRO_INICIAL));
  const [vista, setVista] = useState<'editar' | 'ver'>('editar');
  const [hidratado, setHidratado] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const [conQr, setConQr] = useState(false);
  const [estado, setEstado] = useState<Estado>('idle');
  const [error, setError] = useState<string | null>(null);
  const [origen, setOrigen] = useState(siteConfig.url);
  const compartido = useRef(false);

  useEffect(() => {
    track('demo_view', { demo: 'crear', cocina: '' });
    const inicial = borradorInicial();
    // En un timer: no se llama a setState de forma síncrona dentro del efecto.
    const t = setTimeout(() => {
      if (inicial) setB(inicial);
      setOrigen(window.location.origin);
      setHidratado(true);
    }, 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!hidratado) return;
    try {
      window.localStorage.setItem(CLAVE, JSON.stringify(b));
    } catch {
      // sin localStorage el editor anda igual: el link es lo que importa
    }
  }, [b, hidratado]);

  const cambiar = (cambios: Partial<BorradorSitio>) => {
    setB((actual) => ({ ...actual, ...cambios }));
    setCopiado(false);
    if (estado !== 'enviando') setEstado('idle');
    setError(null);
  };

  const url = useMemo(() => `${origen}/ver#${codificarBorrador(b)}`, [origen, b]);
  const rutaVer = url.slice(origen.length);
  const nombre = b.nombre.trim() || getRubro(b.rubro)?.nombre || '';
  const numero = whatsappDeBorrador(b);
  const whatsappMal = b.whatsapp.trim() !== '' && !parsePhoneAR(b.whatsapp).ok;
  const items = b.items.length > 0 ? b.items : [{ nombre: '', precio: '' }];

  const cambiarItem = (i: number, cambio: Partial<{ nombre: string; precio: string }>) =>
    cambiar({ items: items.map((it, k) => (k === i ? { ...it, ...cambio } : it)) });

  const avisarCompartido = (como: string) => {
    if (!compartido.current) track('demo_whatsapp_click', { demo: `crear_${como}` });
    compartido.current = true;
  };

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiado(true);
      avisarCompartido('copiar');
    } catch {
      window.prompt(CREAR.compartir.copiar, url);
    }
  };

  const publicar = async () => {
    if (b.nombre.trim().length < 2) return setError(CREAR.publicar.faltaNombre);
    if (!numero) return setError(CREAR.publicar.faltaWhatsapp);
    setEstado('enviando');
    setError(null);
    track('cta_click', { destino: 'contacto', rubro: b.rubro, modulos: 0 });
    const r = await crearLeadParcial({
      whatsapp: b.whatsapp,
      nombreNegocio: b.nombre.trim(),
      ciudad: b.ciudad.trim() || undefined,
      rubro: b.rubro,
      modulos: [],
      website: '',
      origen: ORIGEN_CREAR,
      // El link entra si es corto; si no, llega por el WhatsApp que se abre después.
      ...(url.length <= 480 ? { necesidadLibre: `Borrador: ${url}` } : {}),
    });
    if (r.ok) {
      setEstado('listo');
      track('form_enviado', { rubro: b.rubro, ciudad: Boolean(b.ciudad.trim()), orden: 'crear' });
      return;
    }
    setEstado('error');
    setError(
      r.causa === 'limite'
        ? CREAR.publicar.errores.limite
        : r.causa === 'validacion'
          ? CREAR.publicar.errores.validacion
          : CREAR.publicar.errores.otro,
    );
  };

  const linkANosotros = buildWhatsAppLink(
    siteConfig.whatsappNumber,
    CREAR.publicar.mensaje(nombre, url),
  );
  // wa.me sin número deja elegir a quién mandarlo.
  const linkCompartir = `https://wa.me/?text=${encodeURIComponent(CREAR.compartir.mensaje(nombre, url))}`;

  const sitio = (
    <SitioNegocio
      rubro={b.rubro}
      nombre={b.nombre}
      paleta={b.paleta}
      bajada={b.bajada}
      ciudad={b.ciudad}
      horario={b.horario}
      items={b.items.filter((i) => i.nombre.trim())}
    />
  );

  return (
    <div className="mx-auto w-full max-w-page px-4 pt-6 pb-28 lg:px-8 lg:pt-10 lg:pb-16">
      {encabezado}
      <div className="mt-8 lg:grid lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start lg:gap-16">
        <div id="crear-editar" className={vista === 'editar' ? 'min-w-0' : 'min-w-0 max-lg:hidden'}>
          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-6">
            <fieldset>
              <legend className="mb-2 text-small font-semibold">{C.rubro.etiqueta}</legend>
              <div className="flex flex-wrap gap-2">
                {RUBROS_CON_VISTA_PREVIA.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    aria-pressed={b.rubro === r.id}
                    onClick={() => cambiar({ rubro: r.id, items: [] })}
                    className="min-h-tap rounded-full border border-line px-4 text-small font-medium hover:border-line-strong aria-pressed:border-accent aria-pressed:bg-accent-soft"
                  >
                    {r.nombreCorto ?? r.nombre}
                  </button>
                ))}
              </div>
            </fieldset>

            <Input
              label={C.nombre.etiqueta}
              placeholder={C.nombre.placeholder}
              value={b.nombre}
              maxLength={L.nombre}
              autoComplete="organization"
              onChange={(e) => cambiar({ nombre: e.target.value })}
            />
            <Input
              label={C.bajada.etiqueta}
              placeholder={C.bajada.placeholder}
              value={b.bajada}
              maxLength={L.bajada}
              optional
              onChange={(e) => cambiar({ bajada: e.target.value })}
            />

            <fieldset>
              <legend className="text-small font-semibold">{CREAR.items.leyenda}</legend>
              <p className="mb-2 text-small text-muted">{CREAR.items.ayuda}</p>
              <ul className="flex flex-col gap-2">
                {items.map((it, i) => (
                  <li key={i} className="grid grid-cols-[minmax(0,1fr)_7rem_auto] gap-2">
                    <input
                      aria-label={CREAR.items.nombre(i + 1)}
                      placeholder={CREAR.items.placeholderNombre}
                      value={it.nombre}
                      maxLength={L.itemNombre}
                      onChange={(e) => cambiarItem(i, { nombre: e.target.value })}
                      className="min-h-tap min-w-0 rounded-control border border-control-borde bg-control-fondo px-4 text-body text-fg placeholder:text-muted"
                    />
                    <input
                      aria-label={CREAR.items.precio(i + 1)}
                      placeholder={CREAR.items.placeholderPrecio}
                      value={it.precio}
                      maxLength={L.itemPrecio}
                      onChange={(e) => cambiarItem(i, { precio: e.target.value })}
                      className="tabular min-h-tap min-w-0 rounded-control border border-control-borde bg-control-fondo px-2 text-body text-fg placeholder:text-muted"
                    />
                    <button
                      type="button"
                      aria-label={CREAR.items.quitar(it.nombre)}
                      onClick={() => cambiar({ items: items.filter((_, k) => k !== i) })}
                      className="flex size-tap items-center justify-center rounded-control text-muted hover:text-fg"
                    >
                      <Icon name="cerrar" size={20} />
                    </button>
                  </li>
                ))}
              </ul>
              {items.length < L.items && (
                <Button
                  variant="ghost"
                  className="mt-2"
                  onClick={() => cambiar({ items: [...items, { nombre: '', precio: '' }] })}
                >
                  <Icon name="mas" size={20} />
                  {CREAR.items.sumar}
                </Button>
              )}
            </fieldset>

            <div className="grid gap-6 sm:grid-cols-2">
              <Input
                label={C.ciudad.etiqueta}
                placeholder={C.ciudad.placeholder}
                value={b.ciudad}
                maxLength={L.ciudad}
                optional
                autoComplete="address-level2"
                onChange={(e) => cambiar({ ciudad: e.target.value })}
              />
              <Input
                label={C.horario.etiqueta}
                placeholder={C.horario.placeholder}
                value={b.horario}
                maxLength={L.horario}
                optional
                onChange={(e) => cambiar({ horario: e.target.value })}
              />
            </div>
            <Input
              label={C.whatsapp.etiqueta}
              hint={C.whatsapp.ayuda}
              placeholder={C.whatsapp.placeholder}
              value={b.whatsapp}
              maxLength={L.whatsapp}
              inputMode="tel"
              autoComplete="tel-national"
              optional
              error={whatsappMal ? C.whatsapp.invalido : undefined}
              onChange={(e) => cambiar({ whatsapp: e.target.value })}
            />

            <fieldset>
              <legend className="mb-2 text-small font-semibold">{CREAR.colores.leyenda}</legend>
              <div className="flex flex-wrap gap-2">
                {PALETAS_CURADAS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    aria-pressed={b.paleta === p.id}
                    aria-label={CREAR.colores.opcion(p.nombre)}
                    title={p.nombre}
                    onClick={() => cambiar({ paleta: p.id })}
                    style={variablesDePaleta(p) as CSSProperties}
                    className="flex size-tap items-center justify-center rounded-full border border-line hover:border-line-strong aria-pressed:border-2 aria-pressed:border-fg"
                  >
                    <span aria-hidden="true" className="size-7 rounded-full bg-accent" />
                  </button>
                ))}
              </div>
            </fieldset>
            <p className="text-small text-muted">{CREAR.guardadoLocal}</p>
          </form>
        </div>

        <div
          id="crear-ver"
          className={
            vista === 'ver'
              ? 'min-w-0 lg:sticky lg:top-8'
              : 'min-w-0 max-lg:hidden lg:sticky lg:top-8'
          }
        >
          <Telefono pantallaClassName="h-[30rem] lg:bajo:h-[24rem]">
            <div className="h-full overflow-y-auto overscroll-contain" tabIndex={0}>
              {sitio}
            </div>
          </Telefono>

          <div className="mt-6 flex flex-col gap-2">
            <p className="font-semibold">{CREAR.compartir.titulo}</p>
            <p className="text-small text-muted">{CREAR.compartir.bajada}</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Button variant="secondary" onClick={() => void copiar()}>
                {copiado ? CREAR.compartir.copiado : CREAR.compartir.copiar}
              </Button>
              <ButtonLink
                href={rutaVer}
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
              >
                {CREAR.compartir.abrir}
              </ButtonLink>
            </div>
            <ButtonLink
              href={linkCompartir}
              target="_blank"
              rel="noopener noreferrer"
              variant="ghost"
              onClick={() => avisarCompartido('whatsapp')}
            >
              <Icon name="chat" size={20} />
              {CREAR.compartir.whatsapp}
            </ButtonLink>
            <Button variant="ghost" aria-expanded={conQr} onClick={() => setConQr((v) => !v)}>
              {CREAR.compartir.verQr}
            </Button>
            {conQr && (
              <div className="papel mx-auto">
                <CodigoQR url={url} etiqueta={CREAR.compartir.ariaQr} />
              </div>
            )}
          </div>

          <div className="mt-6 border-t border-line pt-6">
            <p className="font-semibold">{CREAR.publicar.titulo}</p>
            <p className="mt-1 text-small text-muted">{CREAR.publicar.bajada}</p>
            <div role="status" className="mt-4 flex flex-col gap-2">
              {estado === 'listo' ? (
                <>
                  <p className="text-small">{CREAR.publicar.listo}</p>
                  {linkANosotros && (
                    <ButtonLink href={linkANosotros} target="_blank" rel="noopener noreferrer">
                      <Icon name="chat" size={20} />
                      {CREAR.publicar.escribirnos}
                    </ButtonLink>
                  )}
                </>
              ) : (
                <Button
                  fullWidth
                  status={estado === 'enviando' ? 'loading' : 'idle'}
                  onClick={() => void publicar()}
                >
                  {estado === 'enviando' ? CREAR.publicar.enviando : CREAR.publicar.cta}
                </Button>
              )}
              {error && <p className="text-small text-danger">{error}</p>}
            </div>
            <p className="mt-2 text-small text-muted">
              {CREAR.publicar.privacidad}{' '}
              <a href="/privacidad" className="underline underline-offset-4">
                {CREAR.publicar.verPrivacidad}
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Abajo, flotante (celular): una cara a la vez. */}
      <div className="fixed inset-x-4 bottom-4 z-30 flex justify-center lg:hidden">
        <div
          role="group"
          aria-label={CREAR.vistas.aria}
          className="flex gap-1 rounded-full border border-line-strong bg-surface-2 p-1 shadow-raised"
        >
          {(['editar', 'ver'] as const).map((v) => (
            <button
              key={v}
              type="button"
              aria-pressed={vista === v}
              aria-controls={v === 'editar' ? 'crear-editar' : 'crear-ver'}
              onClick={() => {
                setVista(v);
                window.scrollTo({ top: 0 });
              }}
              className="min-h-tap rounded-full px-4 text-small font-semibold text-muted aria-pressed:bg-fg aria-pressed:text-bg"
            >
              {CREAR.vistas[v]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
