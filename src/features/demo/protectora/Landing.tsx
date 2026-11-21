import type { CSSProperties } from 'react';
import { Boton } from '@/components/marketing/editorial/Boton';
import { CabezaSeccion } from '@/components/marketing/editorial/CabezaSeccion';
import { Cierre } from '@/components/marketing/editorial/Cierre';
import { enlaceContacto } from '@/components/marketing/editorial/contacto';
import { HeroPagina } from '@/components/marketing/editorial/Hero';
import { WhatsApp } from '@/components/marketing/editorial/Iconos';
import { Pagina } from '@/components/marketing/editorial/Pagina';
import { Telefono } from '@/components/marketing/editorial/Pantallas';
import { PasosTurnero } from '@/components/marketing/editorial/PasosTurnero';
import { cn } from '@/components/ui/clases';
import { ANIMALES, ESTADOS, TAMANOS, UI_PROTECTORA as U } from '@/content/demos/protectora';
import { CTA } from '@/content/home';
import { MODULOS_PROTECTORA, PROTECTORAS as P } from '@/content/protectoras';
import { Ilustracion } from './Ilustracion';
import { fechaActividad } from './formato';

const luna = ANIMALES.find((a) => a.id === 'luna')!;
const rulo = ANIMALES.find((a) => a.id === 'rulo')!;
const i = (n: number) => ({ '--i': n }) as CSSProperties;

/* ---------- Pantallas del celular (servidor, con la paleta de la demo) ---------- */

function Marco({ children }: { children: React.ReactNode }) {
  return (
    <div className="pr-paleta absolute inset-0 overflow-hidden px-3 pt-[calc(var(--tel-barra)+0.5rem)]">
      {children}
    </div>
  );
}

function PantallaFicha() {
  return (
    <Marco>
      <div className="pr-tono-arena grid aspect-square place-items-center rounded-xl">
        <Ilustracion especie={luna.especie} className="w-1/2 text-(--pr-tinta)" />
      </div>
      <p className="pr-titulo mt-2 text-[1.125rem] font-semibold">{luna.nombre}</p>
      <p className="text-[0.6875rem] text-(--pr-tinta-2)">
        {U.ficha.edad(luna.edadMeses)} · {TAMANOS[luna.tamano]} · {luna.caracter}
      </p>
      <p className="mt-1 line-clamp-2 text-[0.625rem] leading-snug text-(--pr-tinta-2)">
        {luna.historia}
      </p>
      <span className="pr-boton mt-2.5 min-h-8 w-full text-[0.75rem]">{U.ficha.quiero}</span>
    </Marco>
  );
}

function PantallaSolicitud() {
  return (
    <Marco>
      <p className="pr-titulo text-[0.9375rem] leading-tight font-semibold">
        {U.solicitud.titulo(luna.nombre)}
      </p>
      {[U.solicitud.nombre, U.solicitud.telefono, U.solicitud.vivienda].map((c) => (
        <div key={c} className="mt-2">
          <p className="text-[0.625rem] font-medium">{c}</p>
          <div className="mt-0.5 h-7 rounded-lg border border-(--pr-linea) bg-(--pr-papel)" />
        </div>
      ))}
      <p className="mt-2 text-[0.5625rem] leading-snug text-(--pr-tinta-2)">
        {U.solicitud.consentimiento}
      </p>
      <span className="pr-boton mt-2.5 min-h-8 w-full text-[0.75rem]">{U.solicitud.enviar}</span>
    </Marco>
  );
}

function PantallaEntrevista() {
  const horarios = [
    [2, 10],
    [2, 17],
    [3, 11],
  ] as const;
  return (
    <Marco>
      <p className="pr-titulo text-[0.9375rem] leading-tight font-semibold">
        {P.pantallas.horario}
      </p>
      <ul className="mt-2 space-y-1.5">
        {horarios.map(([d, h], n) => (
          <li
            key={n}
            className={cn(
              'rounded-lg border px-2.5 py-2 text-[0.6875rem]',
              n === 1 ? 'border-(--pr-tinta) font-semibold' : 'border-(--pr-linea) bg-(--pr-papel)',
            )}
          >
            {fechaActividad(d, h, new Date(2026, 10, 20))}
          </li>
        ))}
      </ul>
      <span className="pr-boton mt-3 min-h-8 w-full text-[0.75rem]">{P.pantallas.confirmar}</span>
    </Marco>
  );
}

function PantallaAdoptado() {
  return (
    <Marco>
      <div className="pr-tono-salvia grid aspect-square place-items-center rounded-xl">
        <Ilustracion especie={rulo.especie} className="w-1/2 text-(--pr-tinta)" />
      </div>
      <p className="mt-2 inline-block rounded-full bg-(--pr-ok-suave) px-2 py-0.5 text-[0.6875rem] font-semibold text-(--pr-ok)">
        {ESTADOS.adoptado}
      </p>
      <p className="pr-titulo mt-1 text-[1.125rem] font-semibold">{rulo.nombre}</p>
      <p className="text-[0.625rem] leading-snug text-(--pr-tinta-2)">{rulo.historia}</p>
    </Marco>
  );
}

/* ---------- Página ---------- */

/**
 * /protectoras: el sistema para protectoras y entidades sin fines de lucro. Escena del problema, una
 * adopción contada en el celular, los módulos (con su estado honesto: base lista o a medida), para quién,
 * cómo trabajamos, el cuidado de los datos y las condiciones, y el cierre.
 */
export function LandingProtectoras() {
  const contacto = enlaceContacto(P.mensaje);
  return (
    <Pagina>
      <HeroPagina
        rotulo={P.hero.rotulo}
        titulo={P.hero.titulo}
        bajada={P.hero.bajada}
        vidriera={
          <div className="flex justify-center">
            <Telefono etiqueta={P.hero.telefonoAlt} className="max-w-60 md:max-w-68">
              <PantallaFicha />
            </Telefono>
          </div>
        }
      >
        <Boton href={P.demo} variante="secundario" externo icono={false}>
          {CTA.verDemo}
        </Boton>
        <Boton href={P.armar}>{CTA.armar}</Boton>
      </HeroPagina>

      <section className="tono-claro" aria-labelledby="titulo-problema">
        <div className="e-wrap py-12 md:py-20">
          <CabezaSeccion
            idTitulo="titulo-problema"
            rotulo={P.problema.rotulo}
            titulo={P.problema.titulo}
          />
          <ol className="mt-8 grid gap-8 md:mt-12 md:grid-cols-3 md:gap-10">
            {P.problema.escenas.map((e, n) => (
              <li key={e.titulo} data-reveal="" style={i(n)}>
                <p className="e-h3">{e.titulo}</p>
                <p className="e-cuerpo mt-2 max-w-[34ch] text-ed-muted">{e.texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="tono-claro" aria-labelledby="titulo-adopcion">
        <div className="e-wrap pb-14 md:pb-24">
          <CabezaSeccion
            idTitulo="titulo-adopcion"
            rotulo={P.pasos.rotulo}
            titulo={P.pasos.titulo}
          />
          <div className="mt-8 md:mt-12">
            <PasosTurnero
              pasos={P.pasos.lista}
              etiqueta={P.pasos.etiqueta}
              pantallas={[
                <PantallaFicha key="ficha" />,
                <PantallaSolicitud key="solicitud" />,
                <PantallaEntrevista key="entrevista" />,
                <PantallaAdoptado key="adoptado" />,
              ]}
            />
          </div>
        </div>
      </section>

      <section className="tono-oscuro" aria-labelledby="titulo-modulos">
        <div className="e-wrap py-14 md:py-24">
          <CabezaSeccion
            idTitulo="titulo-modulos"
            rotulo={P.modulos.rotulo}
            titulo={P.modulos.titulo}
            bajada={P.modulos.nota}
          />
          <ul className="mt-10 grid gap-x-10 gap-y-7 md:grid-cols-2 lg:grid-cols-3">
            {MODULOS_PROTECTORA.map((m, n) => (
              <li key={m.id} data-reveal="" style={i(n % 3)}>
                <p className="e-rotulo text-ed-muted">{P.modulos.etiquetas[m.estado]}</p>
                <h3 className="mt-1.5 text-[1.125rem] font-semibold tracking-tight">{m.nombre}</h3>
                <p className="e-cuerpo mt-1 text-ed-muted">{m.texto}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="tono-claro" aria-labelledby="titulo-para-quien">
        <div className="e-wrap py-14 md:py-24">
          <CabezaSeccion
            idTitulo="titulo-para-quien"
            rotulo={P.paraQuien.rotulo}
            titulo={P.paraQuien.titulo}
            bajada={P.paraQuien.nota}
          />
          <ul className="mt-8 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
            {P.paraQuien.lista.map((x, n) => (
              <li key={x} data-reveal="" style={i(n % 3)} className="e-h3 py-3">
                {x}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="tono-claro" aria-labelledby="titulo-como">
        <div className="e-wrap pb-14 md:pb-24">
          <CabezaSeccion idTitulo="titulo-como" rotulo={P.como.rotulo} titulo={P.como.titulo} />
          <ol className="mt-8 grid gap-8 md:grid-cols-3 md:gap-10">
            {P.como.pasos.map((p, n) => (
              <li key={p.titulo} data-reveal="" style={i(n)}>
                <p className="e-h3">{p.titulo}</p>
                <p className="e-cuerpo mt-2 text-ed-muted">{p.texto}</p>
              </li>
            ))}
          </ol>
          <div className="mt-14 grid gap-10 md:grid-cols-2">
            <div data-reveal="">
              <h3 className="e-h3">{P.datos.titulo}</h3>
              <p className="e-cuerpo mt-2 max-w-[48ch] text-ed-muted">{P.datos.texto}</p>
            </div>
            <div data-reveal="" style={i(1)}>
              <h3 className="e-h3">{P.condiciones.titulo}</h3>
              <p className="e-cuerpo mt-2 max-w-[48ch] text-ed-muted">{P.condiciones.texto}</p>
              <div className="mt-5">
                <Boton
                  href={contacto.href}
                  variante="secundario"
                  externo
                  icono={contacto.canal === 'whatsapp' ? <WhatsApp /> : false}
                >
                  {CTA.escribinos}
                </Boton>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Cierre armar={P.armar} />
    </Pagina>
  );
}
