'use client';

import { AnimatePresence, domAnimation, LazyMotion, MotionConfig } from 'motion/react';
import * as m from 'motion/react-m';
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { Icon } from '@/brand/ilustracion/iconos/Icon';
import { PreviewPanel } from '@/components/patterns/PreviewPanel';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { getPaletaDemo } from '@/content/demos/gastronomia/paletas';
import { NOMBRES_COCINA, type CocinaId } from '@/content/demos/gastronomia/types';
import { WIZARD } from '@/content/empezar/wizard';
import { MICROCOPY } from '@/content/microcopy';
import { getModulo, type ModuloId } from '@/content/modulos';
import { getRubro, RUBRO_OTRO_ID } from '@/content/rubros';
import { track } from '@/lib/analytics';
import { siteConfig } from '@/lib/site-config';
import { captureUtm, type Utm } from '@/lib/utm';
import type { DatosForm, LeadPayloadInput } from '@/content/leads';
import { buildWhatsAppLink, buildWhatsAppMessage } from '@/lib/whatsapp';
import { completarLead, crearLeadParcial, enviarLead, type EnvioResultado } from './api';
import { aplicarTraspasoDemo } from './desde-demo';
import { modulosSeleccionados } from './modulos';
import {
  alternarModuloStore,
  publicarNecesidades,
  publicarRubro,
  reiniciarModulos,
  useModulos,
} from './modulos-store';
import {
  borrarEstado,
  errorParaAvanzar,
  esFlujoDemo,
  ESTADO_INICIAL,
  guardarEstado,
  leerEstadoGuardado,
  marcoOtraCosa,
  nombreRubroVisible,
  PASO_CONFIRMACION,
  progreso,
  reducer,
  type Paso,
} from './state';
import { StepCompletar } from './steps/StepCompletar';
import { StepDatos } from './steps/StepDatos';
import { StepListo } from './steps/StepListo';
import { StepModulos } from './steps/StepModulos';
import { StepNecesidad } from './steps/StepNecesidad';
import { StepRubro } from './steps/StepRubro';
import { StepWhatsapp } from './steps/StepWhatsapp';

const NOMBRES_PASO = ['necesidad', 'rubro', 'modulos', 'whatsapp', 'completar', 'listo'] as const;

/** Pasos que enfocan su primer campo al llegar (el resto enfoca el título). */
const PASOS_CON_CAMPO: readonly Paso[] = [4, 5];

/** Deja ver el check del botón antes de pasar al paso siguiente. */
const PAUSA_EXITO_MS = 700;

const variantes = {
  entrar: (dir: number) => ({ opacity: 0, x: dir * 28 }),
  centro: { opacity: 1, x: 0 },
  salir: (dir: number) => ({ opacity: 0, x: dir * -28 }),
};

/**
 * Wizard de /empezar: necesidad → rubro → módulos → solo WhatsApp (guarda el lead parcial) →
 * completar → confirmación. Quien viene de una demo entra en módulos y manda todo en un solo
 * formulario (ver state.ts).
 */
export function Wizard() {
  const [state, dispatch] = useReducer(reducer, ESTADO_INICIAL);
  const [errorPaso, setErrorPaso] = useState<string | null>(null);
  const raiz = useRef<HTMLElement>(null);
  const titulo = useRef<HTMLHeadingElement>(null);
  const utm = useRef<Utm>({});
  const { hidratado, interactuo } = state;
  const demo = esFlujoDemo(state);
  // Módulos: decisiones manuales (incluye lo que se activó en el hero) + sugerencias del rubro y de
  // las necesidades. Se derivan con el estado del wizard (sin esperar al store): nunca hay desfase.
  const { manual } = useModulos();
  const modulos = useMemo(
    () => modulosSeleccionados(state.rubro, manual, state.necesidades),
    [state.rubro, manual, state.necesidades],
  );

  // Hidratación desde sessionStorage (después del primer render, para no desalinear el HTML del servidor).
  useEffect(() => {
    aplicarTraspasoDemo(window.sessionStorage);
    dispatch({ tipo: 'hidratar', estado: leerEstadoGuardado(window.sessionStorage) });
    utm.current = captureUtm(window.location.search, window.sessionStorage);
    track('empezar_view', {});
  }, []);

  useEffect(() => {
    if (hidratado) guardarEstado(state, window.sessionStorage);
  }, [state, hidratado]);

  // Scroll al cambiar de paso. Solo si la persona navegó: al cargar o recargar no se mueve nada.
  useEffect(() => {
    if (!interactuo) return;
    const el = raiz.current;
    if (el && el.getBoundingClientRect().top < 0) el.scrollIntoView({ block: 'start' });
  }, [state.paso, interactuo]);

  // El foco se mueve al título del paso nuevo cuando el anterior terminó de salir: con
  // AnimatePresence mode="wait" el paso nuevo recién se monta ahí (antes el ref aún no existe).
  // En los pasos con formulario el foco lo toma el primer campo (autofocus).
  const enfocarTitulo = useCallback(() => {
    if (!PASOS_CON_CAMPO.includes(state.paso)) titulo.current?.focus({ preventScroll: true });
  }, [state.paso]);

  // El hero muestra lo mismo que el wizard: le publicamos el rubro y las necesidades.
  useEffect(() => publicarRubro(state.rubro), [state.rubro]);
  useEffect(() => publicarNecesidades(state.necesidades), [state.necesidades]);

  const irA = useCallback((paso: Paso) => {
    setErrorPaso(null);
    dispatch({ tipo: 'irA', paso });
  }, []);

  const avanzar = (desde: 1 | 2 | 3) => {
    const error = errorParaAvanzar(state, desde, modulos.length);
    if (error) return setErrorPaso(error);
    track('paso_completado', { paso: desde, nombre: NOMBRES_PASO[desde - 1] ?? 'necesidad' });
    irA((desde + 1) as Paso);
  };

  const rubro = getRubro(state.rubro);
  const rubroVisible = nombreRubroVisible(state);
  const otraCosa = marcoOtraCosa(state);

  const whatsappLink = useMemo(() => {
    const nombresModulos = modulos.map((id) => getModulo(id).nombre);
    const objetivos = (rubro?.objetivos ?? [])
      .filter((o) => state.objetivos.includes(o.id))
      .map((o) => o.etiqueta);
    return buildWhatsAppLink(
      siteConfig.whatsappNumber,
      buildWhatsAppMessage({
        nombre: state.datos.nombre,
        nombreNegocio: state.datos.nombreNegocio,
        rubro: rubroVisible,
        modulos: nombresModulos,
        objetivos,
      }),
    );
  }, [
    rubro,
    rubroVisible,
    modulos,
    state.objetivos,
    state.datos.nombre,
    state.datos.nombreNegocio,
  ]);

  // Si vino de la demo, se lo decimos: así entiende por qué ya hay cosas elegidas.
  const avisoDemo = state.demo
    ? WIZARD.avisoDemo(
        NOMBRES_COCINA[state.demo.cocina as CocinaId],
        getPaletaDemo(state.demo.paleta).nombre,
      )
    : undefined;

  const onCambioDatos = useCallback(
    (datos: Partial<DatosForm>) => dispatch({ tipo: 'datos', datos }),
    [],
  );

  const onToggleModulo = (id: ModuloId) => {
    setErrorPaso(null);
    const activo = alternarModuloStore(id);
    track('modulo_alternado', { modulo: id, activo, origen: 'wizard' });
  };

  /** Lo común a los dos envíos: rubro, módulos, objetivos, UTM y de dónde viene. */
  const contexto = () => ({
    rubro: state.rubro ?? '',
    rubroOtro: state.rubro === RUBRO_OTRO_ID ? state.rubroOtro : undefined,
    modulos,
    objetivos: state.objetivos,
    ...utm.current,
    // Si vino de una demo: de dónde y lo que armó ahí (los dos, de listas cerradas).
    ...(state.origen ? { origen: state.origen } : {}),
    ...(state.demo ? { demo: state.demo } : {}),
  });

  /** Paso 4 (flujo de siempre): guarda el lead parcial con todo lo elegido hasta acá. */
  const onGuardarWhatsapp = async (whatsapp: string, honeypot: string) => {
    const resultado = await crearLeadParcial({
      ...contexto(),
      whatsapp,
      necesidades: state.necesidades,
      necesidadLibre: otraCosa ? state.necesidadLibre : undefined,
      website: honeypot,
    });
    if (!resultado.ok) return resultado;
    track('lead_parcial', {
      rubro: state.rubro ?? '',
      modulos: modulos.length,
      necesidades: state.necesidades.length,
    });
    dispatch({ tipo: 'leadParcial', lead: { id: resultado.id, token: resultado.token }, whatsapp });
    setTimeout(() => irA(5), PAUSA_EXITO_MS);
    return { ok: true } as const;
  };

  /** Paso 4 desde la demo: el formulario completo, en un solo envío. */
  const onEnviarCompleto = async (datos: DatosForm, honeypot: string): Promise<EnvioResultado> => {
    if (modulos.length === 0) {
      // No debería pasar (el paso de módulos lo exige); si el estado quedó inconsistente, se vuelve ahí.
      irA(3);
      setErrorPaso(WIZARD.errores.sinModulos);
      return { ok: false, causa: 'validacion' };
    }
    const payload: LeadPayloadInput = { ...datos, ...contexto(), website: honeypot };
    const resultado = await enviarLead(payload);
    if (resultado.ok) {
      track('lead_enviado', {
        rubro: state.rubro ?? '',
        modulos: modulos.length,
        objetivos: state.objetivos.length,
      });
    }
    return resultado;
  };

  const terminar = (como: 'completo' | 'parcial') => {
    dispatch({ tipo: 'confirmar', como });
    irA(PASO_CONFIRMACION);
  };

  const reiniciar = () => {
    borrarEstado(window.sessionStorage);
    reiniciarModulos();
    dispatch({ tipo: 'reiniciar' });
  };

  const { paso } = state;
  // Atrás: no antes de donde arrancó (la demo entra en módulos) ni después de guardar el WhatsApp.
  const sinAtras = paso === 1 || paso >= 5 || (demo && paso === 3);
  const { paso: pasoVisible, total } = progreso(state);

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <section
          id="wizard"
          ref={raiz}
          aria-label={WIZARD.ariaSeccion}
          className="scroll-mt-4 rounded-panel border border-line bg-surface/70 p-4 shadow-raised sm:p-8 lg:p-10"
        >
          {/* Escritorio: pasos a la izquierda, vista previa sticky a la derecha. Mobile: una columna. */}
          <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_26rem]">
            <div>
              <div className="mb-6">
                <div className="mb-4 flex min-h-tap items-center justify-between">
                  {/* El botón ocupa siempre su lugar (invisible si no hay atrás): la barra no se mueve. */}
                  <Button
                    variant="ghost"
                    onClick={() => irA((paso - 1) as Paso)}
                    className={`-ml-3 ${sinAtras ? 'invisible' : ''}`}
                    aria-hidden={sinAtras || undefined}
                    tabIndex={sinAtras ? -1 : undefined}
                  >
                    <Icon name="arrowLeft" size={20} />
                    {WIZARD.atras}
                  </Button>
                  <p className="tabular text-small text-muted">
                    {MICROCOPY.pasoDeTotal(pasoVisible, total)}
                  </p>
                </div>
                <ProgressBar step={pasoVisible} total={total} label={WIZARD.ariaProgreso} />
              </div>

              <AnimatePresence
                mode="wait"
                initial={false}
                custom={state.direccion}
                onExitComplete={interactuo ? enfocarTitulo : undefined}
              >
                <m.div
                  key={paso}
                  custom={state.direccion}
                  variants={variantes}
                  initial="entrar"
                  animate="centro"
                  exit="salir"
                  transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                >
                  {paso === 1 && (
                    <StepNecesidad
                      necesidades={state.necesidades}
                      necesidadLibre={state.necesidadLibre}
                      error={errorPaso}
                      headingRef={titulo}
                      onToggle={(id) => {
                        setErrorPaso(null);
                        dispatch({ tipo: 'toggleNecesidad', id });
                      }}
                      onLibre={(texto) => {
                        setErrorPaso(null);
                        dispatch({ tipo: 'necesidadLibre', texto });
                      }}
                      onContinuar={() => avanzar(1)}
                    />
                  )}
                  {paso === 2 && (
                    <StepRubro
                      rubro={state.rubro}
                      rubroOtro={state.rubroOtro}
                      modulos={modulos}
                      error={errorPaso}
                      headingRef={titulo}
                      onElegir={(id) => {
                        setErrorPaso(null);
                        dispatch({ tipo: 'elegirRubro', id });
                        track('rubro_seleccionado', { rubro: id });
                      }}
                      onRubroOtro={(texto) => {
                        setErrorPaso(null);
                        dispatch({ tipo: 'rubroOtro', texto });
                      }}
                      onContinuar={() => avanzar(2)}
                    />
                  )}
                  {paso === 3 && (
                    <StepModulos
                      rubro={state.rubro}
                      necesidades={state.necesidades}
                      modulos={modulos}
                      objetivos={state.objetivos}
                      exigeModulo={demo}
                      error={errorPaso}
                      headingRef={titulo}
                      onToggleModulo={onToggleModulo}
                      onToggleObjetivo={(id) => {
                        setErrorPaso(null);
                        dispatch({ tipo: 'toggleObjetivo', id });
                      }}
                      onContinuar={() => avanzar(3)}
                      aviso={avisoDemo}
                    />
                  )}
                  {paso === 4 && demo && (
                    <StepDatos
                      inicial={state.datos}
                      headingRef={titulo}
                      enfocarPrimero={interactuo}
                      whatsappFallback={whatsappLink}
                      onCambio={onCambioDatos}
                      onEnviar={onEnviarCompleto}
                      onEnviado={() => {
                        track('paso_completado', { paso: 4, nombre: 'datos' });
                        terminar('completo');
                      }}
                    />
                  )}
                  {paso === 4 && !demo && (
                    <StepWhatsapp
                      inicial={state.datos.whatsapp}
                      headingRef={titulo}
                      enfocarPrimero={interactuo}
                      whatsappFallback={whatsappLink}
                      onEnviar={onGuardarWhatsapp}
                    />
                  )}
                  {paso === 5 && state.lead && (
                    <StepCompletar
                      inicial={state.datos}
                      headingRef={titulo}
                      enfocarPrimero={interactuo}
                      onCambio={onCambioDatos}
                      onEnviar={async (datos, honeypot) => {
                        const r = await completarLead(state.lead!, { ...datos, website: honeypot });
                        if (r.ok) {
                          track('lead_completado', { completo: true });
                          setTimeout(() => terminar('completo'), PAUSA_EXITO_MS);
                        }
                        return r;
                      }}
                      onOmitir={() => {
                        track('lead_completado', { completo: false });
                        terminar('parcial');
                      }}
                    />
                  )}
                  {paso === PASO_CONFIRMACION && state.rubro && (
                    <StepListo
                      nombre={state.datos.nombre}
                      rubro={rubroVisible}
                      modulos={modulos}
                      whatsappLink={whatsappLink}
                      variante={state.confirmacion ?? 'completo'}
                      aMedida={otraCosa}
                      headingRef={titulo}
                      onReiniciar={reiniciar}
                    />
                  )}
                </m.div>
              </AnimatePresence>
            </div>

            <aside aria-hidden="true" className="hidden lg:block">
              <div className="sticky top-8">
                <PreviewPanel
                  rubroNombre={rubro ? rubroVisible : undefined}
                  rubroIcono={rubro?.icono}
                  activos={modulos}
                />
              </div>
            </aside>
          </div>
        </section>
      </MotionConfig>
    </LazyMotion>
  );
}
