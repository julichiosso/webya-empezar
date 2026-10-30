'use client';

import { domAnimation, LazyMotion } from 'motion/react';
import { useState, type ReactNode } from 'react';
import { Cargando } from '@/brand/ilustracion/Cargando';
import { Icon } from '@/brand/ilustracion/iconos/Icon';
import { isIconName } from '@/brand/ilustracion/iconos/paths';
import { Acordeon } from '@/components/ui/Acordeon';
import { Button } from '@/components/ui/Button';
import { Campo, CampoArea } from '@/components/ui/Campo';
import { Card } from '@/components/ui/Card';
import { Eleccion, GrupoEleccion } from '@/components/ui/Eleccion';
import { Interruptor } from '@/components/ui/Interruptor';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Spinner } from '@/components/ui/Spinner';
import { ESTADOS_MODULO_TEXTO } from '@/content/estados-modulo';
import { FAQ } from '@/content/faq';
import { LIMITES } from '@/content/leads';
import { MICROCOPY } from '@/content/microcopy';
import { getModulo } from '@/content/modulos';
import { NECESIDADES } from '@/content/necesidades';
import { RUBROS } from '@/content/rubros';
import { SISTEMA } from '@/content/sistema';

const T = SISTEMA.componentes;
const E = T.estados;

/** Una muestra con el nombre de su estado arriba. */
function Estado({ nombre, children }: { nombre: string; children: ReactNode }) {
  return (
    <div className="grid content-start gap-2">
      <p className="text-small text-subtle">{nombre}</p>
      {children}
    </div>
  );
}

function Bloque({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <div className="mt-10">
      <h3 className="text-body font-semibold">{titulo}</h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}

const FILA_ESTADOS = 'grid gap-6 sm:grid-cols-2 lg:grid-cols-5';

/**
 * Componentes de src/components/ui en sus estados, con datos reales de src/content cuando existen
 * (necesidades, rubros, módulos, FAQ). Es de cliente porque los controles tienen manejadores: hover,
 * foco y toque se prueban en vivo.
 */
export function Vitrina() {
  return (
    <LazyMotion features={domAnimation} strict>
      <Botones />
      <Campos />
      <Elecciones />
      <Interruptores />
      <Bloque titulo={T.acordeon.titulo}>
        <Acordeon
          items={FAQ.slice(0, 3).map((p, i) => ({
            id: `faq-${i}`,
            pregunta: p.pregunta,
            respuesta: p.respuesta,
            abierto: i === 0,
            deshabilitado: i === 2,
          }))}
        />
        <p className="mt-2 text-small text-subtle">
          {E.abierto} · {E.cerrado} · {E.deshabilitado}
        </p>
      </Bloque>
      <Tarjetas />
      <Bloque titulo={T.spinner.titulo}>
        <div className="flex items-center gap-8">
          <Estado nombre={T.spinner.titulo}>
            <Spinner etiqueta={T.spinner.etiqueta} />
          </Estado>
          <Estado nombre={E.cargando}>
            <Cargando size={32} title={T.spinner.etiqueta} />
          </Estado>
        </div>
      </Bloque>
      <Progreso />
      <Papel />
    </LazyMotion>
  );
}

function Botones() {
  const b = T.boton;
  return (
    <Bloque titulo={b.titulo}>
      <div className="grid gap-8">
        <div>
          <p className="mb-2 font-medium">{b.variantes.primario}</p>
          <div className={FILA_ESTADOS}>
            <Estado nombre={E.normal}>
              <Button>{b.muestra}</Button>
            </Estado>
            <Estado nombre={E.deshabilitado}>
              <Button disabled>{b.muestra}</Button>
            </Estado>
            <Estado nombre={E.cargando}>
              <Button cargando>{b.muestra}</Button>
            </Estado>
            <Estado nombre={E.exito}>
              <Button exito>{b.muestra}</Button>
            </Estado>
            <Estado nombre={E.error}>
              <Button idError="sistema-boton-error">{b.muestra}</Button>
              <p id="sistema-boton-error" className="text-small text-danger">
                {b.error}
              </p>
            </Estado>
          </div>
        </div>
        <div>
          <p className="mb-2 font-medium">{b.variantes.secundario}</p>
          <div className={FILA_ESTADOS}>
            <Estado nombre={E.normal}>
              <Button variante="secundario">{b.secundario}</Button>
            </Estado>
            <Estado nombre={E.deshabilitado}>
              <Button variante="secundario" disabled>
                {b.secundario}
              </Button>
            </Estado>
            <Estado nombre={E.cargando}>
              <Button variante="secundario" cargando>
                {b.secundario}
              </Button>
            </Estado>
          </div>
        </div>
        <div className={FILA_ESTADOS}>
          <Estado nombre={b.variantes.texto}>
            <Button variante="texto">{b.texto}</Button>
          </Estado>
          <Estado nombre={b.variantes.pastilla}>
            <Button variante="pastilla">{b.pastilla}</Button>
          </Estado>
          <Estado nombre={b.variantes.icono}>
            <Button variante="icono" etiquetaAccesible={b.icono}>
              <Icon name="cerrar" size={24} />
            </Button>
          </Estado>
          <Estado nombre={`${b.variantes.texto} · ${E.deshabilitado}`}>
            <Button variante="texto" disabled>
              {b.texto}
            </Button>
          </Estado>
        </div>
      </div>
    </Bloque>
  );
}

function Campos() {
  const c = T.campo;
  return (
    <Bloque titulo={c.titulo}>
      <div className="grid gap-8 lg:grid-cols-3">
        <Estado nombre={E.normal}>
          <Campo etiqueta={c.etiqueta} name="sistema-normal" />
        </Estado>
        <Estado nombre={E.ayuda}>
          <Campo etiqueta={c.etiqueta} ayuda={c.ayuda} opcional name="sistema-ayuda" />
        </Estado>
        <Estado nombre={E.error}>
          <Campo etiqueta={c.etiqueta} error={c.error} name="sistema-error" />
        </Estado>
        <Estado nombre={E.valido}>
          <Campo etiqueta={c.etiqueta} valido defaultValue={c.valor} name="sistema-valido" />
        </Estado>
        <Estado nombre={E.cargando}>
          <Campo etiqueta={c.etiqueta} cargando defaultValue={c.valor} name="sistema-cargando" />
        </Estado>
        <Estado nombre={E.deshabilitado}>
          <Campo
            etiqueta={c.etiqueta}
            disabled
            defaultValue={c.valor}
            name="sistema-deshabilitado"
          />
        </Estado>
        <div className="lg:col-span-3">
          <Estado nombre={E.contador}>
            <CampoArea
              etiqueta={c.area}
              maximo={LIMITES.necesidadLibre}
              etiquetaContador={c.contador}
              name="sistema-area"
            />
          </Estado>
        </div>
      </div>
    </Bloque>
  );
}

const MUESTRA_MODULOS = (['carta_qr', 'turnos', 'pagos'] as const).map(getModulo);

function Elecciones() {
  const e = T.eleccion;
  const [necesidades, setNecesidades] = useState<string[]>(() =>
    NECESIDADES.slice(0, 1).map((n) => n.id),
  );
  const [rubro, setRubro] = useState(() => RUBROS[0]?.id ?? '');
  const [modulos, setModulos] = useState<string[]>(() =>
    MUESTRA_MODULOS.slice(0, 1).map((m) => m.id),
  );
  const alternar = (lista: string[], valor: string, marcado: boolean) =>
    marcado ? [...lista, valor] : lista.filter((v) => v !== valor);

  return (
    <Bloque titulo={e.titulo}>
      <div className="grid gap-10">
        <GrupoEleccion
          tipo="multiple"
          leyenda={`${e.chip}: ${e.leyendaChip}`}
          claseLista="flex flex-wrap gap-2"
        >
          {NECESIDADES.slice(0, 3).map((n) => (
            <Eleccion
              key={n.id}
              tipo="multiple"
              forma="chip"
              etiqueta={n.etiqueta}
              descripcion={n.descripcion}
              value={n.id}
              checked={necesidades.includes(n.id)}
              onCambio={(v, marcado) => setNecesidades((l) => alternar(l, v, marcado))}
            />
          ))}
          {NECESIDADES.slice(3, 5).map((n, i) => (
            <Eleccion
              key={n.id}
              tipo="multiple"
              forma="chip"
              etiqueta={n.etiqueta}
              value={n.id}
              checked={false}
              cargando={i === 0}
              deshabilitado={i === 1}
              onCambio={() => {}}
            />
          ))}
        </GrupoEleccion>

        <GrupoEleccion
          tipo="unica"
          leyenda={`${e.fila}: ${e.leyendaFila}`}
          claseLista="grid gap-2 lg:grid-cols-3"
        >
          {RUBROS.slice(0, 3).map((r) => (
            <Eleccion
              key={r.id}
              tipo="unica"
              forma="fila"
              name="sistema-rubro"
              etiqueta={r.nombre}
              descripcion={r.descripcionCorta}
              value={r.id}
              checked={rubro === r.id}
              icono={isIconName(r.icono) ? <Icon name={r.icono} size={28} /> : undefined}
              onCambio={(v) => setRubro(v)}
            />
          ))}
        </GrupoEleccion>

        <GrupoEleccion
          tipo="multiple"
          leyenda={`${e.tarjeta}: ${e.leyendaTarjeta}`}
          claseLista="grid gap-2 sm:grid-cols-2 lg:grid-cols-4"
        >
          {MUESTRA_MODULOS.map((m, i) => (
            <Eleccion
              key={m.id}
              tipo="multiple"
              forma="tarjeta"
              etiqueta={m.nombre}
              descripcion={m.descripcion}
              insignia={i === 0 ? MICROCOPY.sugeridoParaTuRubro : undefined}
              estadoModulo={m.estado}
              textoEstado={ESTADOS_MODULO_TEXTO[m.estado].etiqueta}
              value={m.id}
              checked={modulos.includes(m.id)}
              onCambio={(v, marcado) => setModulos((l) => alternar(l, v, marcado))}
            />
          ))}
          <Eleccion
            tipo="multiple"
            forma="tarjeta"
            etiqueta={e.muestraProximamente.etiqueta}
            descripcion={e.muestraProximamente.descripcion}
            estadoModulo="proximamente"
            textoEstado={ESTADOS_MODULO_TEXTO.proximamente.etiqueta}
            value="muestra"
            checked={false}
            onCambio={() => {}}
          />
        </GrupoEleccion>

        <GrupoEleccion
          tipo="multiple"
          leyenda={`${E.error}: ${e.leyendaChip}`}
          error={e.error}
          claseLista="flex flex-wrap gap-2"
        >
          {NECESIDADES.slice(0, 2).map((n) => (
            <Eleccion
              key={n.id}
              tipo="multiple"
              forma="chip"
              etiqueta={n.etiqueta}
              value={n.id}
              checked={false}
              onCambio={() => {}}
            />
          ))}
        </GrupoEleccion>
      </div>
    </Bloque>
  );
}

function Interruptores() {
  const t = T.interruptor;
  const [voz, setVoz] = useState(true);
  const [filtro, setFiltro] = useState(false);
  return (
    <Bloque titulo={t.titulo}>
      <div className={FILA_ESTADOS}>
        <Estado nombre={voz ? E.presionado : E.normal}>
          <Interruptor
            presionado={voz}
            etiqueta={t.muestra}
            onCambio={setVoz}
            icono={<Icon name={voz ? 'volumen' : 'silencio'} size={20} />}
          />
        </Estado>
        <Estado nombre={filtro ? E.presionado : E.normal}>
          <Interruptor presionado={filtro} etiqueta={t.conEncaje} onCambio={setFiltro} conEncaje />
        </Estado>
        <Estado nombre={E.cargando}>
          <Interruptor
            presionado={false}
            etiqueta={t.conEncaje}
            onCambio={() => {}}
            conEncaje
            cargando
          />
        </Estado>
        <Estado nombre={E.deshabilitado}>
          <Interruptor presionado={false} etiqueta={t.muestra} onCambio={() => {}} disabled />
        </Estado>
        <Estado nombre={E.error}>
          <Interruptor
            presionado={false}
            etiqueta={t.muestra}
            onCambio={() => {}}
            idError="sistema-interruptor-error"
          />
          <p id="sistema-interruptor-error" className="text-small text-danger">
            {t.error}
          </p>
        </Estado>
      </div>
    </Bloque>
  );
}

function Tarjetas() {
  const t = T.tarjeta;
  const texto = <p className="text-small text-muted">{t.texto}</p>;
  return (
    <Bloque titulo={t.titulo}>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Estado nombre={t.tarjeta}>
          <Card>{texto}</Card>
        </Estado>
        <Estado nombre={t.panel}>
          <Card nivel="panel">{texto}</Card>
        </Estado>
        <Estado nombre={E.enlace}>
          <Card href="#componentes">{texto}</Card>
        </Estado>
        <Estado nombre={`${E.enlace} · ${E.deshabilitado}`}>
          <Card href="#componentes" deshabilitada>
            {texto}
          </Card>
        </Estado>
        <Estado nombre={E.cargando}>
          <Card estado="cargando" etiquetaCargando={T.spinner.etiqueta}>
            {texto}
          </Card>
        </Estado>
        <Estado nombre={E.error}>
          <Card estado="error">
            <p className="text-small text-danger">{t.error}</p>
          </Card>
        </Estado>
        <Estado nombre={E.exito}>
          <Card estado="exito">
            <p className="text-small">{t.exito}</p>
          </Card>
        </Estado>
      </div>
    </Bloque>
  );
}

const PASOS = 4;

function Progreso() {
  const p = T.progreso;
  const [paso, setPaso] = useState(2);
  return (
    <Bloque titulo={p.titulo}>
      <ProgressBar step={paso} total={PASOS} label={p.etiqueta} />
      <p className="tabular mt-2 text-small text-muted">{MICROCOPY.pasoDeTotal(paso, PASOS)}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button variante="secundario" disabled={paso <= 1} onClick={() => setPaso((v) => v - 1)}>
          {p.anterior}
        </Button>
        <Button
          variante="secundario"
          disabled={paso >= PASOS}
          onClick={() => setPaso((v) => v + 1)}
        >
          {p.siguiente}
        </Button>
      </div>
    </Bloque>
  );
}

function Papel() {
  const p = T.papel;
  const [elegido, setElegido] = useState(true);
  return (
    <Bloque titulo={p.titulo}>
      <p className="max-w-2xl text-small text-muted">{p.bajada}</p>
      <div className="papel mt-4 grid gap-6 rounded-panel bg-bg p-6 text-fg lg:grid-cols-3 lg:items-end">
        <Campo etiqueta={T.campo.etiqueta} ayuda={T.campo.ayuda} name="sistema-papel" />
        <div className="flex flex-wrap gap-2">
          <Button>{T.boton.muestra}</Button>
          <Button variante="secundario">{T.boton.secundario}</Button>
        </div>
        <div>
          {NECESIDADES.slice(0, 1).map((n) => (
            <Eleccion
              key={n.id}
              tipo="multiple"
              forma="chip"
              etiqueta={n.etiqueta}
              value={n.id}
              checked={elegido}
              onCambio={(_, marcado) => setElegido(marcado)}
            />
          ))}
        </div>
      </div>
    </Bloque>
  );
}
