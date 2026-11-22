'use client';

import { useEffect, useReducer, useRef, useState, type ChangeEvent } from 'react';
import { BarraDemo } from '@/components/marketing/editorial/BarraDemo';
import { enlaceContacto } from '@/components/marketing/editorial/contacto';
import { EnUso } from '@/components/marketing/editorial/EnUso';
import { WhatsApp } from '@/components/marketing/editorial/Iconos';
import {
  MarcoVista,
  SelectorVista,
  type VistaDispositivo,
} from '@/components/marketing/editorial/MarcoVista';
import { cn } from '@/components/ui/clases';
import {
  COLORES_TIENDA,
  DEMO_TIENDA_UI as UI,
  MAX_PRODUCTOS,
  RUBROS_TIENDA,
  mensajeTienda,
} from '@/content/demos/tienda/datos';
import { track } from '@/lib/analytics';
import { estadoInicial, leerPrecio, reducirTienda, rubroDe, type EstadoTienda } from './estado';
import { FotoProducto } from './Fotos';
import { Tienda } from './Tienda';

const CAMPO =
  'block min-h-11 w-full rounded-xl border border-ed-line-strong bg-transparent px-3.5 text-base placeholder:text-ed-muted focus:border-ed-fg';
const ROTULO = 'e-rotulo text-ed-muted';

/** URL local de un archivo elegido (no sale del navegador). */
const urlLocal = (e: ChangeEvent<HTMLInputElement>) => {
  const f = e.target.files?.[0];
  e.target.value = '';
  return f && f.type.startsWith('image/') ? URL.createObjectURL(f) : undefined;
};

/**
 * "Creá tu tienda en vivo": rubro → nombre, color y logo → productos, y la tienda armada al lado, al
 * instante. Todo vive en el navegador (las fotos que se suben también). Al final, "Quiero esta tienda"
 * abre WhatsApp con el resumen. Es una vista previa: la tienda real se arma con el cliente.
 */
export function DemoTienda() {
  const [e, despachar] = useReducer(reducirTienda, undefined, () => estadoInicial());
  const [vista, setVista] = useState<VistaDispositivo>('movil');
  const [cara, setCara] = useState<'armar' | 'ver'>('armar');
  const urls = useRef(new Set<string>());

  // Las fotos subidas se liberan al salir de la demo.
  useEffect(() => {
    const lista = urls.current;
    return () => lista.forEach((u) => URL.revokeObjectURL(u));
  }, []);
  const guardar = (u?: string) => {
    if (u) urls.current.add(u);
    return u;
  };

  const rubro = rubroDe(e.rubroId);
  const color = COLORES_TIENDA.find((c) => c.id === e.colorId) ?? COLORES_TIENDA[0]!;
  const destino = enlaceContacto(
    mensajeTienda({
      nombre: e.nombre,
      rubro: rubro.nombre,
      color: color.nombre,
      productos: e.productos,
    }),
  );
  const tienda = (
    <Tienda
      nombre={e.nombre}
      rubro={rubro}
      color={color.valor}
      logo={e.logo}
      productos={e.productos}
    />
  );

  const armador = (movil: boolean) => (
    <Armador
      e={e}
      despachar={despachar}
      guardar={guardar}
      destino={destino.href}
      prefijo={movil ? 'm' : 'e'}
    />
  );

  return (
    <div className="tono-oscuro min-h-svh bg-ed-bg text-ed-fg">
      <BarraDemo demo="tienda" onReiniciar={() => despachar({ tipo: 'reiniciar' })} />
      <main>
        <h1 className="sr-only">{UI.titulo}</h1>
        <div className="d-escenario hidden justify-center gap-8 px-6 py-6 lg:flex xl:gap-12">
          <div className="d-barra-fina d-ventana relative w-88 shrink-0 overflow-y-auto pr-2">
            <div className="mb-8">
              <SelectorVista
                vista={vista}
                onVista={setVista}
                etiqueta={UI.vista}
                celular={UI.celular}
                computadora={UI.computadora}
              />
            </div>
            {armador(false)}
            <EnUso proyecto="petrucci" className="mt-6" />
          </div>
          <div className={cn('min-w-0', vista === 'escritorio' ? 'w-full max-w-248' : 'shrink-0')}>
            <p className="mb-2 text-center text-[0.75rem] text-ed-muted">{UI.ladoTienda}</p>
            <MarcoVista vista={vista} dominio={dominioDe(e.nombre)}>
              {tienda}
            </MarcoVista>
          </div>
        </div>

        <div className="flex h-[calc(100svh-3.5rem-var(--d-cta))] flex-col lg:hidden">
          <nav
            aria-label={UI.movil.aria}
            className="flex shrink-0 justify-center border-b border-ed-line bg-ed-bg px-4 py-2"
          >
            <div className="grid w-full max-w-sm grid-cols-2 gap-1 rounded-full border border-ed-line-strong p-1">
              {(['armar', 'ver'] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-pressed={cara === c}
                  onClick={() => setCara(c)}
                  className="flex min-h-12 items-center justify-center rounded-full px-5 text-[1.0625rem] font-semibold text-ed-muted aria-pressed:bg-ed-fg aria-pressed:text-ed-bg"
                >
                  {c === 'armar' ? UI.movil.armar : UI.movil.ver}
                </button>
              ))}
            </div>
          </nav>
          <div className="relative min-h-0 flex-1">
            <div
              className={cara === 'armar' ? 'relative h-full overflow-y-auto px-4 py-5' : 'hidden'}
            >
              {armador(true)}
            </div>
            <div className={cara === 'ver' ? 'h-full' : 'hidden'}>{tienda}</div>
          </div>
        </div>
      </main>
    </div>
  );
}

/** Dominio de ejemplo con el nombre del negocio (sin tildes ni espacios). */
function dominioDe(nombre: string) {
  const base = nombre
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');
  return `${base || 'tutienda'}.com.ar`;
}

function Armador({
  e,
  despachar,
  guardar,
  destino,
  prefijo,
}: {
  e: EstadoTienda;
  despachar: (a: Parameters<typeof reducirTienda>[1]) => void;
  guardar: (u?: string) => string | undefined;
  destino: string;
  prefijo: string;
}) {
  const rubro = rubroDe(e.rubroId);
  const marca = (COLORES_TIENDA.find((c) => c.id === e.colorId) ?? COLORES_TIENDA[0]!).valor;
  return (
    <div className="space-y-8" style={{ '--marca': marca } as React.CSSProperties}>
      <fieldset>
        <legend className={ROTULO}>{UI.pasos.rubro}</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {RUBROS_TIENDA.map((r) => (
            <label
              key={r.id}
              className="flex min-h-10 cursor-pointer items-center rounded-full border border-ed-line-strong px-4 text-[0.8125rem] font-medium has-[:checked]:border-ed-fg has-[:checked]:bg-ed-fg has-[:checked]:text-ed-bg has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[color:var(--e-foco)]"
            >
              <input
                type="radio"
                name={`${prefijo}-rubro`}
                className="sr-only"
                checked={r.id === e.rubroId}
                onChange={() => {
                  despachar({ tipo: 'rubro', id: r.id });
                  track('demo_personalizada', { demo: 'tienda', campo: 'rubro', valor: r.id });
                }}
              />
              {r.nombre}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className={ROTULO}>{UI.pasos.negocio}</legend>
        <label className="mt-3 block">
          <span className="e-chico text-ed-muted">{UI.nombre}</span>
          <input
            type="text"
            value={e.nombre}
            maxLength={40}
            autoComplete="organization"
            onChange={(ev) => despachar({ tipo: 'nombre', valor: ev.target.value })}
            className={`${CAMPO} mt-1.5`}
          />
        </label>
        <div role="radiogroup" aria-label={UI.color}>
          <span className="e-chico text-ed-muted">{UI.color}</span>
          <div className="mt-1.5 flex gap-2.5">
            {COLORES_TIENDA.map((c) => (
              <button
                key={c.id}
                type="button"
                role="radio"
                aria-checked={c.id === e.colorId}
                aria-label={UI.colorAria(c.nombre)}
                onClick={() => {
                  despachar({ tipo: 'color', id: c.id });
                  track('demo_personalizada', { demo: 'tienda', campo: 'paleta', valor: c.id });
                }}
                className="grid size-10 place-items-center rounded-full border border-ed-line-strong aria-checked:border-ed-fg"
              >
                <span className="size-7 rounded-full" style={{ background: c.valor }} />
              </button>
            ))}
          </div>
        </div>
        <div>
          <span className="e-chico text-ed-muted">{UI.logo}</span>
          <div className="mt-1.5 flex items-center gap-3">
            <label className="e-btn e-btn-secundario e-btn-chico cursor-pointer has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-[color:var(--e-foco)]">
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(ev) => {
                  const u = guardar(urlLocal(ev));
                  if (u) {
                    despachar({ tipo: 'logo', url: u });
                    track('demo_personalizada', { demo: 'tienda', campo: 'logo', valor: 'subido' });
                  }
                }}
              />
              {UI.subirLogo}
            </label>
            {e.logo ? (
              <button
                type="button"
                onClick={() => despachar({ tipo: 'logo' })}
                className="e-link e-chico text-ed-muted"
              >
                {UI.quitarLogo}
              </button>
            ) : null}
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend className={ROTULO}>{UI.pasos.productos}</legend>
        <ol className="mt-3 space-y-3">
          {e.productos.map((p, i) => (
            <li key={p.id} className="rounded-2xl border border-ed-line p-3.5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[0.8125rem] font-semibold">{UI.producto.numero(i + 1)}</p>
                {e.productos.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => despachar({ tipo: 'quitar', id: p.id })}
                    className="e-link e-chico text-ed-muted"
                  >
                    {UI.producto.quitar}
                  </button>
                ) : null}
              </div>
              <div className="mt-2.5 grid grid-cols-[1fr_7rem] gap-2.5">
                <label>
                  <span className="sr-only">{UI.producto.nombre}</span>
                  <input
                    type="text"
                    value={p.nombre}
                    maxLength={40}
                    placeholder={UI.producto.nombre}
                    onChange={(ev) =>
                      despachar({
                        tipo: 'producto',
                        id: p.id,
                        cambios: { nombre: ev.target.value },
                      })
                    }
                    className={CAMPO}
                  />
                </label>
                <label>
                  <span className="sr-only">{UI.producto.precio}</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={p.precio ? p.precio.toLocaleString('es-AR') : ''}
                    placeholder={UI.producto.precio}
                    onChange={(ev) =>
                      despachar({
                        tipo: 'producto',
                        id: p.id,
                        cambios: { precio: leerPrecio(ev.target.value) },
                      })
                    }
                    className={`${CAMPO} tabular-nums`}
                  />
                </label>
              </div>
              <div
                role="radiogroup"
                aria-label={UI.producto.foto}
                className="mt-2.5 flex flex-wrap items-center gap-2"
              >
                {rubro.fotos.map((f) => (
                  <button
                    key={f}
                    type="button"
                    role="radio"
                    aria-checked={!p.propia && p.foto === f}
                    aria-label={UI.producto.fotoAria(UI.fotos[f])}
                    onClick={() =>
                      despachar({
                        tipo: 'producto',
                        id: p.id,
                        cambios: { foto: f, propia: undefined },
                      })
                    }
                    className="size-11 overflow-hidden rounded-lg border border-ed-line aria-checked:border-2 aria-checked:border-ed-fg"
                  >
                    <FotoProducto foto={f} />
                  </button>
                ))}
                <label className="flex min-h-11 cursor-pointer items-center rounded-lg border border-dashed border-ed-line-strong px-3 text-[0.75rem] font-medium has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-[color:var(--e-foco)]">
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(ev) => {
                      const u = guardar(urlLocal(ev));
                      if (u) {
                        despachar({ tipo: 'producto', id: p.id, cambios: { propia: u } });
                        track('demo_personalizada', {
                          demo: 'tienda',
                          campo: 'producto',
                          valor: 'foto',
                        });
                      }
                    }}
                  />
                  {UI.producto.subirFoto}
                </label>
              </div>
            </li>
          ))}
        </ol>
        {e.productos.length < MAX_PRODUCTOS ? (
          <button
            type="button"
            onClick={() => despachar({ tipo: 'agregar' })}
            className="e-link e-chico mt-3 font-medium"
          >
            {UI.producto.agregar}
          </button>
        ) : null}
        <p className="e-chico mt-3 text-ed-muted">{UI.privado}</p>
      </fieldset>

      <div className="border-t border-ed-line pt-5">
        <p className="e-chico text-ed-muted">{UI.previa}</p>
        <a
          href={destino}
          target="_blank"
          rel="noopener"
          aria-label={UI.ctaAria}
          onClick={() => track('demo_cta_click', { demo: 'tienda', origen: 'quiero-esta-tienda' })}
          className="e-btn e-btn-primario mt-4 w-full"
        >
          <WhatsApp />
          <span>{UI.cta}</span>
        </a>
      </div>
    </div>
  );
}
