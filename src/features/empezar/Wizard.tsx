'use client';

import { AnimatePresence, domAnimation, LazyMotion, MotionConfig } from 'motion/react';
import * as m from 'motion/react-m';
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { Icon } from '@/components/icons/Icon';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { getModulo, type ModuloId } from '@/config/modulos';
import { getRubro, RUBRO_OTRO_ID } from '@/config/rubros';
import { track } from '@/lib/analytics';
import { siteConfig } from '@/lib/site-config';
import { captureUtm, type Utm } from '@/lib/utm';
import type { DatosForm, LeadPayloadInput } from '@/lib/validation/lead';
import { buildWhatsAppLink, buildWhatsAppMessage } from '@/lib/whatsapp';
import { enviarLead } from './api';
import { modulosSeleccionados } from './modulos';
import { alternarModuloStore, publicarRubro, reiniciarModulos, useModulos } from './modulos-store';
import {
  borrarEstado,
  errorParaAvanzar,
  ESTADO_INICIAL,
  guardarEstado,
  leerEstadoGuardado,
  nombreRubroVisible,
  reducer,
  TOTAL_PASOS,
  type Paso,
} from './state';
import { StepDatos } from './steps/StepDatos';
import { StepListo } from './steps/StepListo';
import { StepModulos } from './steps/StepModulos';
import { StepRubro } from './steps/StepRubro';

const NOMBRES_PASO = ['rubro', 'modulos', 'datos', 'listo'] as const;

const variantes = {
  entrar: (dir: number) => ({ opacity: 0, x: dir * 28 }),
  centro: { opacity: 1, x: 0 },
  salir: (dir: number) => ({ opacity: 0, x: dir * -28 }),
};

export function Wizard() {
  const [state, dispatch] = useReducer(reducer, ESTADO_INICIAL);
  const [errorPaso, setErrorPaso] = useState<string | null>(null);
  const raiz = useRef<HTMLElement>(null);
  const titulo = useRef<HTMLHeadingElement>(null);
  const utm = useRef<Utm>({});
  const { hidratado, interactuo } = state;
  // Módulos: decisiones manuales (incluye lo que se activó en el hero) + sugerencias del rubro.
  // Se derivan con el rubro del wizard (sin esperar al store) para que nunca haya un cuadro de desfase.
  const { manual } = useModulos();
  const modulos = useMemo(() => modulosSeleccionados(state.rubro, manual), [state.rubro, manual]);

  // Hidratación desde sessionStorage (después del primer render, para no desalinear el HTML del servidor).
  useEffect(() => {
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
  // En el paso 3 el foco lo toma el primer campo (autofocus).
  const enfocarTitulo = useCallback(() => {
    if (state.paso !== 3) titulo.current?.focus({ preventScroll: true });
  }, [state.paso]);

  // El hero muestra lo mismo que el wizard: le publicamos el rubro elegido.
  useEffect(() => publicarRubro(state.rubro), [state.rubro]);

  const irA = useCallback((paso: Paso) => {
    setErrorPaso(null);
    dispatch({ tipo: 'irA', paso });
  }, []);

  const avanzar = (desde: 1 | 2) => {
    const error = errorParaAvanzar(state, desde, modulos.length);
    if (error) return setErrorPaso(error);
    track('paso_completado', { paso: desde, nombre: NOMBRES_PASO[desde - 1] ?? 'rubro' });
    irA((desde + 1) as Paso);
  };

  const rubro = getRubro(state.rubro);
  const rubroVisible = nombreRubroVisible(state);

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

  const onCambioDatos = useCallback((datos: DatosForm) => dispatch({ tipo: 'datos', datos }), []);

  const onToggleModulo = (id: ModuloId) => {
    setErrorPaso(null);
    const activo = alternarModuloStore(id);
    track('modulo_alternado', { modulo: id, activo, origen: 'wizard' });
  };

  const onEnviar = async (datos: DatosForm, honeypot: string) => {
    if (modulos.length === 0) {
      // No debería pasar (el paso 2 lo exige); si el estado quedó inconsistente, se vuelve a ese paso.
      irA(2);
      setErrorPaso('Activá al menos un módulo para seguir.');
      return { ok: false, causa: 'validacion' } as const;
    }
    const payload: LeadPayloadInput = {
      ...datos,
      rubro: state.rubro ?? '',
      rubroOtro: state.rubro === RUBRO_OTRO_ID ? state.rubroOtro : undefined,
      modulos,
      objetivos: state.objetivos,
      website: honeypot,
      ...utm.current,
    };
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

  const reiniciar = () => {
    borrarEstado(window.sessionStorage);
    reiniciarModulos();
    dispatch({ tipo: 'reiniciar' });
  };

  const { paso } = state;

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <section
          id="wizard"
          ref={raiz}
          aria-label="Creá tu negocio"
          className="scroll-mt-4 rounded-panel border border-line bg-surface/70 p-4 shadow-raised sm:p-8"
        >
          <div className="mb-6">
            <div className="mb-4 flex min-h-tap items-center justify-between">
              {/* El botón ocupa siempre su lugar (invisible en el paso 1 y 4): la barra no se mueve. */}
              <Button
                variant="ghost"
                onClick={() => irA((paso - 1) as Paso)}
                className={`-ml-3 ${paso === 1 || paso === 4 ? 'invisible' : ''}`}
                aria-hidden={paso === 1 || paso === 4 || undefined}
                tabIndex={paso === 1 || paso === 4 ? -1 : undefined}
              >
                <Icon name="arrowLeft" size={20} />
                Atrás
              </Button>
              <p className="tabular text-small text-muted">
                Paso {paso} de {TOTAL_PASOS}
              </p>
            </div>
            <ProgressBar step={paso} total={TOTAL_PASOS} label="Progreso del formulario" />
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
                  onContinuar={() => avanzar(1)}
                />
              )}
              {paso === 2 && (
                <StepModulos
                  rubro={state.rubro}
                  modulos={modulos}
                  objetivos={state.objetivos}
                  error={errorPaso}
                  headingRef={titulo}
                  onToggleModulo={onToggleModulo}
                  onToggleObjetivo={(id) => {
                    setErrorPaso(null);
                    dispatch({ tipo: 'toggleObjetivo', id });
                  }}
                  onContinuar={() => avanzar(2)}
                />
              )}
              {paso === 3 && (
                <StepDatos
                  inicial={state.datos}
                  headingRef={titulo}
                  enfocarPrimero={interactuo}
                  whatsappFallback={whatsappLink}
                  onCambio={onCambioDatos}
                  onEnviar={onEnviar}
                  onEnviado={() => {
                    track('paso_completado', { paso: 3, nombre: 'datos' });
                    dispatch({ tipo: 'enviado' });
                    irA(4);
                  }}
                />
              )}
              {paso === 4 && state.rubro && (
                <StepListo
                  nombre={state.datos.nombre}
                  rubro={rubroVisible}
                  modulos={modulos}
                  whatsappLink={whatsappLink}
                  headingRef={titulo}
                  onReiniciar={reiniciar}
                />
              )}
            </m.div>
          </AnimatePresence>
        </section>
      </MotionConfig>
    </LazyMotion>
  );
}
