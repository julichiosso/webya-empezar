import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import { Icon } from '@/brand/ilustracion/iconos/Icon';
import { Logo } from '@/brand/logo/Logo';
import { buttonClasses } from '@/components/ui/Button';
import {
  type Combinacion,
  combinaciones,
  COMBINACIONES_BASE,
  PALETA_POR_DEFECTO,
  PALETAS_MARCA,
  type PaletaMarca,
  variablesDePaleta,
} from '@/brand/tokens/colores';
import { formatearPesos, pesos } from '@/domain/pedidos/dinero';
import { MARCA } from '@/content/marca';
import { SEO_MARCA } from '@/content/seo';
import { contraste } from '@/lib/color';

// Página interna para comparar paletas: no se indexa ni se lista en el sitemap.
export const metadata: Metadata = {
  title: SEO_MARCA.titulo,
  robots: { index: false, follow: false },
};

const RATIO = new Intl.NumberFormat('es-AR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Pedido de ejemplo para la tarjeta (el texto y los precios de muestra, en content/marca). */
const PEDIDO = {
  ...MARCA.pedidoMuestra,
  items: MARCA.pedidoMuestra.items.map((i) => ({ ...i, unitario: pesos(i.precio) })),
};
const TOTAL = PEDIDO.items.reduce((t, i) => t + i.cantidad * i.unitario, 0);

export default function MarcaPage() {
  return (
    <main className="mx-auto w-full max-w-xl px-4 pt-10 pb-16 lg:max-w-page lg:px-8 lg:pt-16">
      <header className="max-w-2xl">
        <Logo />
        <h1 className="mt-10 text-title font-semibold text-balance">{MARCA.titulo}</h1>
        <p className="mt-4 text-lead text-muted">{MARCA.bajada}</p>
        <p className="mt-4 text-small text-subtle">{MARCA.nota}</p>
      </header>

      {PALETAS_MARCA.map((p) => (
        <Paleta key={p.id} paleta={p} />
      ))}

      <section aria-labelledby="base-title" className="mt-16 border-t border-line pt-10">
        <h2 id="base-title" className="text-heading font-semibold">
          {MARCA.base.titulo}
        </h2>
        <TablaContraste combinaciones={COMBINACIONES_BASE} titulo={MARCA.base.tablaTitulo} />
      </section>
    </main>
  );
}

const MUESTRAS = MARCA.paleta.muestras;

function Paleta({ paleta }: { paleta: PaletaMarca }) {
  const id = `paleta-${paleta.id}`;
  return (
    <section
      aria-labelledby={id}
      style={variablesDePaleta(paleta) as CSSProperties}
      className="mt-16 border-t border-line pt-10"
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <h2 id={id} className="text-heading font-semibold">
          {paleta.nombre}
        </h2>
        {paleta.id === PALETA_POR_DEFECTO && (
          <span className="rounded-full border border-accent px-2 text-small leading-6 text-accent">
            {MARCA.paleta.porDefecto}
          </span>
        )}
      </div>
      <p className="mt-2 text-muted">{paleta.idea}</p>

      <ul className="mt-6 flex flex-wrap gap-4 text-small">
        <Muestra className="bg-accent" nombre={MUESTRAS.acento} valor={paleta.accent} />
        <Muestra
          className="bg-accent-ink"
          nombre={MUESTRAS.acentoSobrePapel}
          valor={paleta.accentInk}
        />
        <Muestra className="bg-paper" nombre={MUESTRAS.crema} valor="var(--paper)" />
        <Muestra
          className="border border-line-strong bg-bg"
          nombre={MUESTRAS.negro}
          valor="var(--bg)"
        />
        <Muestra className="bg-danger" nombre={MUESTRAS.error} valor={paleta.danger} />
      </ul>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:items-start">
        <HeroMuestra />
        <PedidoMuestra />
      </div>

      <TablaContraste
        combinaciones={combinaciones(paleta)}
        titulo={MARCA.paleta.tablaTitulo(paleta.nombre)}
      />
    </section>
  );
}

function Muestra({
  className,
  nombre,
  valor,
}: {
  className: string;
  nombre: string;
  valor: string;
}) {
  // "var(--…)" se muestra como el nombre del token; los hex, tal cual.
  const etiqueta = valor.startsWith('var(') ? valor.slice(4, -1) : valor;
  return (
    <li className="flex items-center gap-2">
      <span aria-hidden="true" className={`size-8 rounded-control ${className}`} />
      <span>
        {nombre} <span className="tabular text-subtle">{etiqueta}</span>
      </span>
    </li>
  );
}

/** El hero de /empezar en miniatura, con la paleta aplicada. Estático: no hay nada para tocar. */
function HeroMuestra() {
  const hero = MARCA.heroMuestra;
  return (
    <figure className="rounded-panel border border-line bg-bg p-6 lg:p-8">
      <figcaption className="text-small text-subtle">{hero.etiqueta}</figcaption>
      <p className="mt-6 text-title font-semibold text-balance">
        {hero.titulo}
        <span className="block text-muted">{hero.subtitulo}</span>
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-4">
        <span className={buttonClasses()}>
          {hero.cta}
          <Icon name="arrowDown" size={20} />
        </span>
        <span className="text-small text-accent">{hero.acento}</span>
      </div>
      <ul className="mt-8 grid grid-cols-2 gap-3">
        <Pieza id="carta_qr" nombre={hero.piezas.cartaQr} encendida />
        <Pieza id="pagos" nombre={hero.piezas.pagos} encendida={false} />
      </ul>
    </figure>
  );
}

function Pieza({
  id,
  nombre,
  encendida,
}: {
  id: 'carta_qr' | 'pagos';
  nombre: string;
  encendida: boolean;
}) {
  return (
    <li
      className={`relative flex min-h-28 flex-col justify-between gap-4 rounded-card border p-4 ${
        encendida ? 'border-accent bg-accent-soft' : 'border-line bg-surface'
      }`}
    >
      <span className={encendida ? 'text-accent' : 'text-fg'}>
        <Icon name={id} size={28} />
      </span>
      <span className="font-semibold">
        {nombre}
        <span className="sr-only">
          {encendida ? MARCA.heroMuestra.activado : MARCA.heroMuestra.sinActivar}
        </span>
      </span>
      {encendida && (
        <span
          aria-hidden="true"
          className="absolute top-3 right-3 flex size-6 items-center justify-center rounded-full bg-accent text-accent-fg"
        >
          <Icon name="check" size={16} />
        </span>
      )}
    </li>
  );
}

/** Comanda en papel crema, con la muesca de "encastre" arriba (como un ticket colgado del riel). */
function PedidoMuestra() {
  return (
    <figure className="papel encastre rounded-card bg-paper p-6 pt-8 text-paper-fg">
      <figcaption className="text-small text-paper-muted">{PEDIDO.etiqueta}</figcaption>
      <div className="mt-4 flex items-center justify-between gap-4">
        <p className="tabular text-heading font-semibold">{PEDIDO.titulo(PEDIDO.numero)}</p>
        <span className="rounded-full bg-accent px-2 text-small leading-6 font-semibold text-accent-fg">
          {PEDIDO.estado}
        </span>
      </div>
      <p className="tabular mt-1 text-small text-paper-muted">{PEDIDO.detalle}</p>

      <ul className="mt-4 border-t border-paper-line">
        {PEDIDO.items.map((i) => (
          <li
            key={i.nombre}
            className="flex items-start justify-between gap-4 border-b border-paper-line py-2"
          >
            <span>
              <span className="tabular">{i.cantidad} ×</span> {i.nombre}
              {i.nota && <span className="block text-small text-paper-muted">{i.nota}</span>}
            </span>
            <span className="tabular">{formatearPesos(i.cantidad * i.unitario)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 flex items-center justify-between font-semibold">
        <span>{PEDIDO.total}</span>
        <span className="tabular">{formatearPesos(TOTAL)}</span>
      </p>
      <p className="mt-4 text-small font-semibold text-accent-ink">{PEDIDO.aviso}</p>
      <span className={`${buttonClasses('primary', true)} mt-4`}>{PEDIDO.accion}</span>
    </figure>
  );
}

const TABLA = MARCA.tabla;

function TablaContraste({
  combinaciones: filas,
  titulo,
}: {
  combinaciones: Combinacion[];
  titulo: string;
}) {
  return (
    <table className="mt-8 w-full text-left text-small">
      <caption className="pb-2 text-left text-body font-semibold">{titulo}</caption>
      <thead className="text-subtle">
        <tr className="border-b border-line">
          <th scope="col" className="py-2 font-normal">
            {TABLA.combinacion}
          </th>
          <th scope="col" className="py-2 text-right font-normal">
            {TABLA.contraste}
          </th>
          <th scope="col" className="py-2 pl-4 text-right font-normal">
            {TABLA.minimo}
          </th>
          <th scope="col" className="py-2 pl-4 text-right font-normal">
            {TABLA.aa}
          </th>
        </tr>
      </thead>
      <tbody>
        {filas.map((c) => {
          const ratio = contraste(c.texto, c.fondo);
          const pasa = ratio >= c.minimo;
          return (
            <tr key={c.nombre} className="border-b border-line">
              <th scope="row" className="py-2 font-normal">
                <span className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="inline-flex size-8 shrink-0 items-center justify-center rounded-control font-semibold"
                    style={{ color: c.texto, background: c.fondo }}
                  >
                    {TABLA.muestra}
                  </span>
                  {c.nombre}
                </span>
              </th>
              <td className="tabular py-2 text-right">{RATIO.format(ratio)}:1</td>
              <td className="tabular py-2 pl-4 text-right text-muted">{RATIO.format(c.minimo)}</td>
              <td className={`py-2 pl-4 text-right font-semibold ${pasa ? '' : 'text-danger'}`}>
                {pasa ? TABLA.pasa : TABLA.noLlega}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
