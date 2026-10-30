import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import {
  ARTES_MODULO,
  Cargando,
  DIBUJOS,
  GRILLA_DIBUJO,
  GRILLA_ICONO,
  Icon,
  ICONOS,
  Ilustracion,
  ModuloArte,
  type GrupoDibujo,
  type GrupoIcono,
} from '@/brand/ilustracion';
import { Logo } from '@/brand/logo/Logo';
import { LOGO_ALTO, LOGO_TRAZOS } from '@/brand/logo/trazos';
import { TAMANIO_MINIMO, zonaDeRespeto } from '@/brand/logo/variantes';
import { DURACIONES_MS, PASO_PIEZA_MS, PRESUPUESTO, TOQUE, SNAP } from '@/brand/motion/presets';
import { COMPONENTES } from '@/brand/tokens/componentes';
import { COLOR, CURVA, ESPACIO, TIPO } from '@/brand/tokens/primitivos';
import {
  RADIOS,
  SOMBRA_ELEVADA,
  TEMA_CLARO,
  TEMA_OSCURO,
  TEMA_PAPEL,
  LINEA_FUERTE_PAPEL,
} from '@/brand/tokens/semanticos';
import { buttonClasses } from '@/components/ui/Button';
import { SISTEMA } from '@/content/sistema';
import { Snap } from './Snap';
import { Vitrina } from './Vitrina';

// Página interna del sistema de diseño: no se indexa ni se lista en el sitemap. Siempre en oscuro
// (el tema elegible solo aplica en /empezar; ver src/brand/tema/tema.ts).
export const metadata: Metadata = {
  title: SISTEMA.seo.titulo,
  robots: { index: false, follow: false },
};

const SECCIONES = [
  'logo',
  'color',
  'tipo',
  'forma',
  'movimiento',
  'componentes',
  'iconos',
  'ilustraciones',
] as const;

export default function SistemaPage() {
  return (
    <main className="mx-auto w-full max-w-xl px-4 pt-10 pb-16 lg:max-w-page lg:px-8 lg:pt-16">
      <header className="max-w-2xl">
        <Logo />
        <h1 className="mt-10 text-title font-semibold text-balance">{SISTEMA.titulo}</h1>
        <p className="mt-4 text-lead text-muted">{SISTEMA.bajada}</p>
        <p className="mt-4 text-small text-subtle">{SISTEMA.nota}</p>
        <p className="mt-2 text-small text-subtle">{SISTEMA.manual}</p>
      </header>

      <nav aria-label={SISTEMA.indice.etiqueta} className="mt-8">
        <ul className="flex flex-wrap gap-2">
          {SECCIONES.map((s) => (
            <li key={s}>
              <a href={`#${s}`} className={buttonClasses('pastilla')}>
                {SISTEMA.indice[s]}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <SeccionLogo />
      <SeccionColor />
      <SeccionTipo />
      <SeccionForma />
      <SeccionMovimiento />

      <Seccion
        id="componentes"
        titulo={SISTEMA.componentes.titulo}
        bajada={SISTEMA.componentes.bajada}
      >
        <Vitrina />
      </Seccion>

      <SeccionIconos />
      <SeccionIlustraciones />
    </main>
  );
}

/* ——— Piezas de la página ——— */

function Seccion({
  id,
  titulo,
  bajada,
  children,
}: {
  id: string;
  titulo: string;
  bajada?: string;
  children: ReactNode;
}) {
  return (
    <section
      aria-labelledby={`${id}-titulo`}
      id={id}
      className="mt-16 scroll-mt-8 border-t border-line pt-10"
    >
      <h2 id={`${id}-titulo`} className="text-heading font-semibold">
        {titulo}
      </h2>
      {bajada && <p className="mt-2 max-w-2xl text-muted">{bajada}</p>}
      {children}
    </section>
  );
}

function Subtitulo({ children, bajada }: { children: ReactNode; bajada?: string }) {
  return (
    <div className="mt-10">
      <h3 className="text-body font-semibold">{children}</h3>
      {bajada && <p className="mt-1 max-w-2xl text-small text-muted">{bajada}</p>}
    </div>
  );
}

/** Nombre de token en monoespaciada chica (es un identificador, no copy). */
function Token({ children }: { children: ReactNode }) {
  return <code className="font-mono text-small text-fg">{children}</code>;
}

function Valor({ children }: { children: ReactNode }) {
  return <span className="tabular block text-small break-all text-subtle">{children}</span>;
}

/* ——— Logo ——— */

/** Alto de la muestra grande del logo (px; es el h-16 de abajo) y su zona de respeto a esa escala. */
const ALTO_MUESTRA = 64;
const ZONA_PX = Math.round((zonaDeRespeto(LOGO_TRAZOS[0]) * ALTO_MUESTRA) / LOGO_ALTO);

function SeccionLogo() {
  const t = SISTEMA.logo;
  return (
    <Seccion id="logo" titulo={t.titulo} bajada={t.bajada}>
      <ul className="mt-8 grid gap-4 lg:grid-cols-3">
        <li className="rounded-card border border-line bg-surface p-6">
          <div className="flex h-24 items-center">
            <Logo className="h-12" decorativo />
          </div>
          <p className="mt-4 font-semibold">{t.variantes.completa}</p>
          <p className="text-small text-muted">{t.explicacion.completa}</p>
        </li>
        <li className="rounded-card border border-line bg-surface p-6">
          <div className="flex h-24 items-center">
            <Logo variante="compacta" className="h-12" decorativo />
          </div>
          <p className="mt-4 font-semibold">{t.variantes.compacta}</p>
          <p className="text-small text-muted">{t.explicacion.compacta}</p>
        </li>
        <li className="papel rounded-card border border-line bg-bg p-6 text-fg">
          <div className="flex h-24 items-center">
            <Logo variante="monocromo" className="h-12" decorativo />
          </div>
          <p className="mt-4 font-semibold">{t.variantes.monocromo}</p>
          <p className="text-small text-muted">{t.explicacion.monocromo}</p>
        </li>
      </ul>

      <div className="mt-8 grid gap-6 lg:grid-cols-2 lg:items-center">
        <div className="flex justify-center rounded-card border border-line bg-surface p-8">
          <div
            className="border border-dashed border-hueco-borde"
            style={{ padding: `${ZONA_PX}px` }}
          >
            <Logo decorativo className="h-16" />
          </div>
        </div>
        <dl className="grid gap-4">
          <div>
            <dt className="font-semibold">{t.zona}</dt>
            <dd className="text-small text-muted">{t.zonaExplicacion}</dd>
          </div>
          <div>
            <dt className="font-semibold">{t.minimo}</dt>
            <dd className="tabular text-small text-muted">
              {t.variantes.completa} {TAMANIO_MINIMO.completa} {t.unidadPx} · {t.variantes.compacta}{' '}
              {TAMANIO_MINIMO.compacta} {t.unidadPx}
            </dd>
          </div>
        </dl>
      </div>
    </Seccion>
  );
}

/* ——— Color ——— */

const PRIMITIVOS = Object.entries(COLOR).flatMap(([material, tonos]) =>
  Object.entries(tonos).map(([tono, valor]) => ({ nombre: `--${material}-${tono}`, valor })),
);

function Muestra({ fondo, nombre, valor }: { fondo: string; nombre: string; valor: string }) {
  return (
    <li className="flex items-center gap-4">
      <span
        aria-hidden="true"
        className="size-12 shrink-0 rounded-control border border-line"
        style={{ background: fondo }}
      />
      <span className="min-w-0">
        <Token>{nombre}</Token>
        <Valor>{valor}</Valor>
      </span>
    </li>
  );
}

const GRILLA_MUESTRAS = 'mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4';

function SeccionColor() {
  const t = SISTEMA.color;
  return (
    <Seccion id="color" titulo={t.titulo} bajada={t.bajada}>
      <Subtitulo>{t.primitivos}</Subtitulo>
      <ul className={GRILLA_MUESTRAS}>
        {PRIMITIVOS.map((p) => (
          <Muestra key={p.nombre} fondo={`var(${p.nombre})`} nombre={p.nombre} valor={p.valor} />
        ))}
      </ul>

      <Subtitulo>{t.semanticos}</Subtitulo>
      <ul className={GRILLA_MUESTRAS}>
        {Object.entries(TEMA_OSCURO).map(([nombre, v]) => (
          <Muestra
            key={nombre}
            fondo={`var(--${nombre})`}
            nombre={`--${nombre}`}
            valor={'ref' in v && v.ref ? `${v.ref} · ${v.valor}` : v.valor}
          />
        ))}
      </ul>

      <Subtitulo>{t.claro}</Subtitulo>
      <ul className={GRILLA_MUESTRAS}>
        {Object.entries(TEMA_CLARO).map(([nombre, v]) => (
          <Muestra key={nombre} fondo={v.valor} nombre={`--${nombre}`} valor={v.valor} />
        ))}
      </ul>

      <Subtitulo>{t.papel}</Subtitulo>
      <ul className={GRILLA_MUESTRAS}>
        {Object.entries(TEMA_PAPEL).map(([nombre, destino]) => (
          <Muestra
            key={nombre}
            fondo={`var(--${destino})`}
            nombre={`--${nombre}`}
            valor={`${t.apuntaA} --${destino}`}
          />
        ))}
        <Muestra
          fondo={LINEA_FUERTE_PAPEL.valor}
          nombre="--line-strong"
          valor={LINEA_FUERTE_PAPEL.valor}
        />
      </ul>

      <Subtitulo>{t.componentes}</Subtitulo>
      <ul className={GRILLA_MUESTRAS}>
        {Object.entries(COMPONENTES).map(([nombre, destino]) => (
          <Muestra
            key={nombre}
            fondo={`var(--${nombre})`}
            nombre={`--${nombre}`}
            valor={`${t.apuntaA} --${destino}`}
          />
        ))}
      </ul>
    </Seccion>
  );
}

/* ——— Tipografía ——— */

function SeccionTipo() {
  const t = SISTEMA.tipo;
  return (
    <Seccion id="tipo" titulo={t.titulo} bajada={t.bajada}>
      <ul className="mt-8 divide-y divide-line border-y border-line">
        {Object.entries(TIPO).map(([nombre, [tamanio, interlineado, tracking]]) => (
          <li key={nombre} className="grid gap-2 py-6 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-8">
            <div>
              <Token>{`text-${nombre}`}</Token>
              <Valor>
                {t.columnas.tamanio} {tamanio}
              </Valor>
              <Valor>
                {t.columnas.interlineado} {interlineado} · {t.columnas.tracking}{' '}
                {tracking ?? t.sinTracking}
              </Valor>
            </div>
            <p
              className="font-semibold text-balance"
              style={{
                fontSize: tamanio,
                lineHeight: interlineado,
                letterSpacing: tracking ?? undefined,
              }}
            >
              {t.muestra}
            </p>
          </li>
        ))}
      </ul>
    </Seccion>
  );
}

/* ——— Espacio, radios y sombra ——— */

function SeccionForma() {
  const t = SISTEMA.forma;
  return (
    <Seccion id="forma" titulo={t.titulo}>
      <Subtitulo bajada={t.espacioBajada}>{t.espacio}</Subtitulo>
      <ul className="mt-4 grid gap-2">
        {Object.entries(ESPACIO).map(([nombre, valor]) => (
          <li key={nombre} className="grid grid-cols-[8rem_minmax(0,1fr)] items-center gap-4">
            <span>
              <Token>{`--espacio-${nombre}`}</Token>
              <Valor>{valor}</Valor>
            </span>
            <span
              aria-hidden="true"
              className="h-4 rounded-full bg-line-strong"
              style={{ width: valor }}
            />
          </li>
        ))}
      </ul>

      <Subtitulo bajada={t.radiosBajada}>{t.radios}</Subtitulo>
      <ul className="mt-4 flex flex-wrap gap-6">
        {Object.entries(RADIOS).map(([nombre, valor]) => (
          <li key={nombre} className="grid gap-2">
            <span
              aria-hidden="true"
              className="size-24 border border-line-strong bg-surface"
              style={{ borderRadius: valor }}
            />
            <span>
              <span className="block font-semibold">
                {t.nombresRadio[nombre as keyof typeof t.nombresRadio]}
              </span>
              <Token>{`rounded-${nombre}`}</Token>
              <Valor>{valor}</Valor>
            </span>
          </li>
        ))}
      </ul>

      <Subtitulo bajada={t.sombraBajada}>{t.sombra}</Subtitulo>
      <div className="mt-4 grid gap-4 lg:grid-cols-[16rem_minmax(0,1fr)] lg:items-center">
        <div className="flex h-32 items-center justify-center rounded-card border border-line bg-surface shadow-raised">
          <span className="text-small text-muted">{t.sombraMuestra}</span>
        </div>
        <span>
          <Token>shadow-raised</Token>
          <Valor>{SOMBRA_ELEVADA}</Valor>
        </span>
      </div>
    </Seccion>
  );
}

/* ——— Movimiento ——— */

function Fila({ nombre, valor }: { nombre: string; valor: ReactNode }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-4 py-2">
      <dt className="text-small">{nombre}</dt>
      <dd className="tabular text-small text-subtle">{valor}</dd>
    </div>
  );
}

function SeccionMovimiento() {
  const t = SISTEMA.movimiento;
  const ms = (v: number) => `${v} ${t.unidadMs}`;
  return (
    <Seccion id="movimiento" titulo={t.titulo} bajada={t.bajada}>
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div>
          <h3 className="font-semibold">{t.duraciones}</h3>
          <dl className="mt-2 divide-y divide-line">
            {Object.entries(DURACIONES_MS).map(([nombre, valor]) => (
              <Fila
                key={nombre}
                nombre={t.nombresDuracion[nombre as keyof typeof t.nombresDuracion]}
                valor={ms(valor)}
              />
            ))}
          </dl>

          <h3 className="mt-8 font-semibold">{t.curvas}</h3>
          <dl className="mt-2 divide-y divide-line">
            {Object.entries(CURVA).map(([nombre, valor]) => (
              <Fila
                key={nombre}
                nombre={t.nombresCurva[nombre as keyof typeof t.nombresCurva]}
                valor={valor}
              />
            ))}
          </dl>

          <h3 className="mt-8 font-semibold">{t.escalas}</h3>
          <dl className="mt-2 divide-y divide-line">
            <Fila nombre={t.toque} valor={TOQUE.escala} />
            <Fila nombre={t.sobrepaso} valor={SNAP.sobrepaso} />
            <Fila nombre={t.pasoPieza} valor={ms(PASO_PIEZA_MS)} />
          </dl>
        </div>

        <div>
          <h3 className="font-semibold">{t.presupuesto}</h3>
          <dl className="mt-2 divide-y divide-line">
            <Fila nombre={t.propiedades} valor={PRESUPUESTO.propiedades.join(', ')} />
            <Fila nombre={t.excepcion} valor={PRESUPUESTO.excepcion.propiedades.join(', ')} />
            <Fila nombre={t.entradaMaxima} valor={PRESUPUESTO.entradaMaximaMs} />
            <Fila nombre={t.jsInicial} valor={PRESUPUESTO.jsInicialKb} />
            <Fila nombre={t.cls} valor={PRESUPUESTO.cls} />
          </dl>

          <h3 className="mt-8 font-semibold">{t.snap}</h3>
          <p className="mt-1 text-small text-muted">{t.snapBajada}</p>
          <Snap />
        </div>
      </div>
    </Seccion>
  );
}

/* ——— Íconos e ilustraciones ——— */

const GRUPOS_ICONO: readonly GrupoIcono[] = ['rubro', 'modulo', 'necesidad', 'interfaz'];
const GRUPOS_DIBUJO: readonly GrupoDibujo[] = ['plato', 'estado'];

function Pieza({ nombre, children }: { nombre: string; children: ReactNode }) {
  return (
    <li className="flex flex-col items-center gap-2 rounded-card border border-line bg-surface p-4 text-center">
      {children}
      <span className="text-small break-all text-subtle">{nombre}</span>
    </li>
  );
}

function SeccionIconos() {
  const t = SISTEMA.iconos;
  return (
    <Seccion id="iconos" titulo={t.titulo} bajada={t.bajada}>
      {GRUPOS_ICONO.map((g) => (
        <div key={g}>
          <Subtitulo>{t.grupos[g]}</Subtitulo>
          <ul className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-8">
            {ICONOS.filter((i) => i.grupo === g).map((i) => (
              <Pieza key={i.nombre} nombre={i.nombre}>
                <Icon name={i.nombre} size={GRILLA_ICONO.lado * 2} />
              </Pieza>
            ))}
          </ul>
        </div>
      ))}
    </Seccion>
  );
}

function SeccionIlustraciones() {
  const t = SISTEMA.ilustraciones;
  return (
    <Seccion id="ilustraciones" titulo={t.titulo} bajada={t.bajada}>
      {GRUPOS_DIBUJO.map((g) => (
        <div key={g}>
          <Subtitulo>{t.grupos[g]}</Subtitulo>
          <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {DIBUJOS.filter((d) => d.grupo === g).map((d) => (
              <Pieza key={d.id} nombre={d.id}>
                <Ilustracion id={d.id} size={GRILLA_DIBUJO.lado} />
              </Pieza>
            ))}
            {g === 'estado' && (
              <Pieza nombre={t.cargando}>
                <span className="flex size-24 items-center justify-center">
                  <Cargando size={GRILLA_ICONO.lado * 2} />
                </span>
              </Pieza>
            )}
          </ul>
        </div>
      ))}

      <Subtitulo bajada={t.modulosBajada}>{t.modulos}</Subtitulo>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {ARTES_MODULO.map((id) => (
          <li key={id} className="rounded-card border border-line bg-surface p-4">
            <p className="text-small text-subtle">{id}</p>
            <div className="mt-2 grid grid-cols-2 gap-4">
              <figure>
                <ModuloArte id={id} activo={false} />
                <figcaption className="mt-1 text-small text-muted">{t.apagado}</figcaption>
              </figure>
              <figure>
                <ModuloArte id={id} activo />
                <figcaption className="mt-1 text-small text-muted">{t.encendido}</figcaption>
              </figure>
            </div>
          </li>
        ))}
      </ul>
    </Seccion>
  );
}
