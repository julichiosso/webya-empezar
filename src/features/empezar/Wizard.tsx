'use client';

import { AnimatePresence, domAnimation, LazyMotion, MotionConfig } from 'motion/react';
import * as m from 'motion/react-m';
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { Icon } from '@/brand/ilustracion/iconos/Icon';
import type { Dispositivo } from '@/components/patterns/MarcoDispositivo';
import {
  precargarPreviewNegocio,
  PreviewNegocioDiferido,
} from '@/components/patterns/PreviewNegocioDiferido';
import { PreviewPanel } from '@/components/patterns/PreviewPanel';
import { Button, ButtonLink } from '@/components/ui/Button';
import { ordenPedido } from '@/config/experimentos';
import { RUBRO_DEMO } from '@/content/demos/gastronomia/types';
import { WIZARD } from '@/content/empezar/wizard';
import { FLUJO } from '@/content/empezar/wizard-flujo';
import { getModulo, type ModuloId } from '@/content/modulos';
import { esPaletaCurada, PALETA_CURADA_POR_DEFECTO, type PaletaCuradaId } from '@/content/paletas';
import { getRubro } from '@/content/rubros';
import { MENSAJE_WHATSAPP } from '@/content/whatsapp';
import { urlDemoConDatos } from '@/domain/traspaso/demo-wizard';
import { track } from '@/lib/analytics';
import { siteConfig } from '@/lib/site-config';
import { captureUtm, type Utm } from '@/lib/utm';
import { buildWhatsAppLink } from '@/lib/whatsapp';
import { completarLead, crearLeadParcial, type EnvioResultado } from './api';
import { BarraCta } from './BarraCta';
import { aplicarTraspasoDemo } from './desde-demo';
import { Marco } from './Marco';
import { PantallaRubro } from './PantallaRubro';
import {
  borrarEstado,
  errorAMedida,
  esAMedida,
  ESTADO_INICIAL,
  guardarEstado,
  leerEstadoGuardado,
  modulosDe,
  nombreRubroVisible,
  nombresModulos,
  pantallaDe,
  pasoAnterior,
  reducer,
  type DatosFlujo,
  type Paso,
} from './state';
import { StepAMedida } from './steps/StepAMedida';
import { StepCompletar } from './steps/StepCompletar';
import { StepGracias } from './steps/StepGracias';
import { StepNegocio, type ValoresNegocio } from './steps/StepNegocio';
import { StepResultado, type ControlesPreview } from './steps/StepResultado';

/** Pantallas que enfocan su primer campo al llegar (el resto enfoca el título). */
const PASOS_CON_CAMPO: readonly Paso[] = ['aMedida', 'negocio', 'contacto', 'completar'];

/** Deja ver el check del botón antes de pasar a la pantalla siguiente. */
const PAUSA_EXITO_MS = 600;

const variantes = {
  entrar: (dir: number) => ({ opacity: 0, x: dir * 28 }),
  centro: { opacity: 1, x: 0 },
  salir: (dir: number) => ({ opacity: 0, x: dir * -28 }),
};

interface WizardProps {
  /** Rubro tocado en el HTML del servidor antes de que llegara el wizard (ver WizardLazy). */
  rubroInicial?: string | null;
}

/**
 * Flujo de /empezar: rubro → (Otro: pedido a medida) → negocio (guarda el lead parcial) →
 * "Así te queda" → completar (opcional) → gracias. Ver state.ts.
 */
export function Wizard({ rubroInicial = null }: WizardProps) {
  const [state, dispatch] = useReducer(reducer, ESTADO_INICIAL);
  const [errorPaso, setErrorPaso] = useState<string | null>(null);
  /** El guardado del lead falló por red o servidor: la vista previa se muestra igual. */
  const [sinGuardar, setSinGuardar] = useState(false);
  /** Cómo se ve la vista previa; null = el natural (celular en celular, navegador en escritorio). */
  const [dispositivo, setDispositivo] = useState<Dispositivo | null>(null);
  /** Desde lg la vista previa vive a la derecha, en un navegador: ese es el natural. */
  const [natural, setNatural] = useState<Dispositivo>('celular');
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia('(min-width: 64rem)');
    const actualizar = () => setNatural(mq.matches ? 'escritorio' : 'celular');
    actualizar();
    mq.addEventListener('change', actualizar);
    return () => mq.removeEventListener('change', actualizar);
  }, []);
  const raiz = useRef<HTMLElement>(null);
  const titulo = useRef<HTMLHeadingElement>(null);
  const utm = useRef<Utm>({});
  const ctaTocado = useRef(false);
  const { hidratado, interactuo, paso } = state;
  const aMedida = esAMedida(state);
  const modulos = useMemo(() => modulosDe(state), [state]);

  const irA = useCallback((siguiente: Paso) => {
    setErrorPaso(null);
    dispatch({ tipo: 'irA', paso: siguiente });
  }, []);

  const elegirRubro = useCallback(
    (id: string) => {
      // La vista previa se descarga ya: en la pantalla 3 (y en el panel de escritorio) está lista.
      if (!esAMedida({ rubro: id })) void precargarPreviewNegocio().catch(() => {});
      dispatch({ tipo: 'elegirRubro', id });
      track('rubro_elegido', { rubro: id });
      irA(esAMedida({ rubro: id }) ? 'aMedida' : 'negocio');
    },
    [irA],
  );

  // Hidratación desde sessionStorage (después del primer render, para no desalinear el HTML del
  // servidor). Si tocó un rubro antes de que llegara el wizard, se sigue desde ahí.
  useEffect(() => {
    aplicarTraspasoDemo(window.sessionStorage);
    dispatch({ tipo: 'hidratar', estado: leerEstadoGuardado(window.sessionStorage) });
    // El orden del experimento: el de la URL manda (`?orden=b`); si no, el guardado.
    const orden = ordenPedido(window.location.search);
    if (orden) dispatch({ tipo: 'orden', orden });
    utm.current = captureUtm(window.location.search, window.sessionStorage);
    track('empezar_view', {});
    if (rubroInicial && getRubro(rubroInicial)) {
      dispatch({ tipo: 'elegirRubro', id: rubroInicial });
      dispatch({ tipo: 'irA', paso: esAMedida({ rubro: rubroInicial }) ? 'aMedida' : 'negocio' });
      track('rubro_elegido', { rubro: rubroInicial });
    }
  }, [rubroInicial]);

  useEffect(() => {
    if (hidratado) guardarEstado(state, window.sessionStorage);
  }, [state, hidratado]);

  // Con el navegador libre se descarga la vista previa (por si llegó con un rubro ya elegido).
  useEffect(() => {
    const precargar = () => void precargarPreviewNegocio().catch(() => {});
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(precargar);
      return () => window.cancelIdleCallback(id);
    }
    const t = setTimeout(precargar, 1500);
    return () => clearTimeout(t);
  }, []);

  // Abandono: se va sin llegar al CTA. Una sola vez por visita, con la pantalla en la que estaba.
  const pasoActual = useRef(paso);
  useEffect(() => {
    pasoActual.current = paso;
  }, [paso]);
  useEffect(() => {
    let avisado = false;
    const alOcultar = () => {
      if (document.visibilityState !== 'hidden' || avisado || ctaTocado.current) return;
      if (pasoActual.current === 'listo') return;
      avisado = true;
      track('abandono_paso', { paso: pasoActual.current });
    };
    document.addEventListener('visibilitychange', alOcultar);
    return () => document.removeEventListener('visibilitychange', alOcultar);
  }, []);

  // Scroll al cambiar de pantalla. Solo si la persona navegó: al cargar o recargar no se mueve nada.
  useEffect(() => {
    if (!interactuo) return;
    const el = raiz.current;
    if (el && el.getBoundingClientRect().top < 0) el.scrollIntoView({ block: 'start' });
  }, [paso, interactuo]);

  // El foco va al título de la pantalla nueva cuando la anterior terminó de salir (con
  // AnimatePresence mode="wait" recién ahí existe). En las de formulario, al primer campo.
  const enfocarTitulo = useCallback(() => {
    if (!PASOS_CON_CAMPO.includes(paso)) titulo.current?.focus({ preventScroll: true });
  }, [paso]);

  const rubro = getRubro(state.rubro);
  const nombreNegocio = state.datos.nombreNegocio.trim();
  // La elegida en la vista previa; si no, la que traía de la demo; si no, la por defecto.
  const paletaDemo = state.demo?.paleta;
  const paleta: PaletaCuradaId =
    state.paleta ?? (esPaletaCurada(paletaDemo) ? paletaDemo : PALETA_CURADA_POR_DEFECTO);
  /** Orden B (experimento): vista previa con el nombre, el WhatsApp recién al tocar el CTA. */
  const ordenB = state.orden === 'b' && !aMedida;

  const whatsappLink = useMemo(
    () =>
      buildWhatsAppLink(
        siteConfig.whatsappNumber,
        MENSAJE_WHATSAPP.quieroEsto({
          nombre: state.datos.nombre.trim() || undefined,
          nombreNegocio: nombreNegocio || undefined,
          rubro: aMedida ? undefined : nombreRubroVisible(state),
          modulos: nombresModulos(modulos),
          necesidadLibre: aMedida ? state.necesidadLibre.trim() : undefined,
        }),
      ),
    [state, nombreNegocio, aMedida, modulos],
  );

  const demoUrl =
    state.rubro === RUBRO_DEMO ? urlDemoConDatos({ local: nombreNegocio, paleta }) : null;

  const onCambioDatos = useCallback(
    (datos: Partial<DatosFlujo>) => dispatch({ tipo: 'datos', datos }),
    [],
  );

  /**
   * Guarda el lead parcial con el rubro, el nombre, la ciudad y lo demás. Orden A: desde la
   * pantalla 2. Orden B: desde `contacto` (antes, la pantalla 2 solo pidió el nombre).
   */
  const onGuardarNegocio = async (
    valores: ValoresNegocio,
    honeypot: string,
  ): Promise<EnvioResultado> => {
    if (ordenB && paso === 'negocio') {
      // Solo el nombre: directo a la vista previa, sin lead todavía.
      setTimeout(() => irA('resultado'), PAUSA_EXITO_MS);
      return { ok: true };
    }
    const resultado = await crearLeadParcial({
      whatsapp: valores.whatsapp,
      nombreNegocio: valores.nombreNegocio || state.datos.nombreNegocio,
      ciudad: valores.ciudad || state.datos.ciudad || undefined,
      rubro: state.rubro ?? '',
      necesidadLibre: aMedida ? state.necesidadLibre : undefined,
      modulos,
      website: honeypot,
      ...utm.current,
      // Si vino de una demo: de dónde y lo que armó ahí (los dos, de listas cerradas).
      ...(state.origen ? { origen: state.origen } : {}),
      ...(state.demo ? { demo: state.demo } : {}),
    });
    // Sin red o con el servidor caído no se frena el "wow": la vista previa sale igual y el CTA
    // de WhatsApp lleva lo que armó. Validación y límite sí se quedan en el formulario.
    if (!resultado.ok && (resultado.causa === 'red' || resultado.causa === 'servidor')) {
      setSinGuardar(true);
      setTimeout(() => irA('resultado'), PAUSA_EXITO_MS);
      return { ok: true };
    }
    if (!resultado.ok) return resultado;
    setSinGuardar(false);
    dispatch({ tipo: 'leadParcial', lead: { id: resultado.id, token: resultado.token } });
    track('form_enviado', {
      rubro: state.rubro ?? '',
      ciudad: (valores.ciudad || state.datos.ciudad).length > 0,
      orden: state.orden,
    });
    setTimeout(() => irA('resultado'), PAUSA_EXITO_MS);
    return { ok: true };
  };

  const onCta = () => {
    ctaTocado.current = true;
    track('cta_click', { destino: 'whatsapp', rubro: state.rubro ?? '', modulos: modulos.length });
  };

  // CTA único de la pantalla 3 (el mismo en la pantalla y en la barra fija del celular). En el
  // orden B, sin lead todavía, primero pide el WhatsApp.
  const TXT_RES = FLUJO.resultado;
  const textoCta = aMedida ? TXT_RES.aMedida.cta : TXT_RES.cta;
  const cta =
    ordenB && !state.lead && !sinGuardar ? (
      <Button
        fullWidth
        onClick={() => {
          track('cta_click', {
            destino: 'contacto',
            rubro: state.rubro ?? '',
            modulos: modulos.length,
          });
          irA('contacto');
        }}
      >
        <Icon name="chat" size={20} />
        {textoCta}
      </Button>
    ) : whatsappLink ? (
      <ButtonLink
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        fullWidth
        onClick={onCta}
      >
        <Icon name="chat" size={20} />
        {textoCta}
      </ButtonLink>
    ) : (
      <p data-todo className="text-small text-subtle">
        {TXT_RES.todoWhatsapp}
      </p>
    );

  const controles: ControlesPreview | null = aMedida
    ? null
    : {
        dispositivo: dispositivo ?? natural,
        onDispositivo: (d) => {
          setDispositivo(d);
          track('preview_toggle', { dispositivo: d });
        },
        paleta,
        onPaleta: (id) => dispatch({ tipo: 'paleta', id }),
        modulos: (rubro?.modulosSugeridos ?? [])
          .filter((id) => getModulo(id).estado !== 'proximamente')
          .map((id) => ({ id, nombre: getModulo(id).nombre, activo: modulos.includes(id) })),
        onModulo: (id: ModuloId) => {
          const activo = !modulos.includes(id);
          dispatch({ tipo: 'alternarModulo', id });
          track('modulo_alternado', { modulo: id, activo, origen: 'preview' });
        },
      };

  const reiniciar = () => {
    borrarEstado(window.sessionStorage);
    setSinGuardar(false);
    dispatch({ tipo: 'reiniciar' });
  };

  // La vista previa por rubro: en escritorio vive a la derecha (sticky, navegador); en celular,
  // dentro de la pantalla 3 (celular). Sin rubro, o con "Otro", queda el panel de huecos.
  const vistaPrevia = (lugar: Dispositivo) => (
    <PreviewNegocioDiferido
      rubro={state.rubro ?? ''}
      nombre={nombreNegocio}
      paleta={paleta}
      dispositivo={dispositivo ?? lugar}
      modulos={modulos}
      ciudad={state.datos.ciudad}
    />
  );
  const aside =
    paso === 'rubro' || !rubro || aMedida ? (
      <PreviewPanel
        rubroNombre={
          paso === 'rubro' || !rubro ? undefined : nombreNegocio || nombreRubroVisible(state)
        }
        rubroIcono={rubro?.icono}
        activos={paso === 'rubro' ? [] : modulos}
      />
    ) : (
      <div data-testid="negocio-preview-panel">{vistaPrevia('escritorio')}</div>
    );

  useEffect(() => {
    if (paso === 'resultado' && !aMedida && state.rubro) {
      track('preview_visto', { rubro: state.rubro, paleta });
    }
  }, [paso, aMedida, state.rubro, paleta]);

  const anterior = pasoAnterior(state);

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <Marco
          ref={raiz}
          pantalla={pantallaDe(paso)}
          aside={aside}
          atras={
            anterior && (
              <Button variant="ghost" onClick={() => irA(anterior)}>
                <Icon name="arrowLeft" size={20} />
                {WIZARD.atras}
              </Button>
            )
          }
        >
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
              {paso === 'rubro' && (
                <PantallaRubro elegido={state.rubro} onElegir={elegirRubro} headingRef={titulo} />
              )}
              {paso === 'aMedida' && (
                <StepAMedida
                  texto={state.necesidadLibre}
                  error={errorPaso}
                  headingRef={titulo}
                  enfocarPrimero={interactuo}
                  onCambio={(texto) => {
                    setErrorPaso(null);
                    dispatch({ tipo: 'necesidadLibre', texto });
                  }}
                  onContinuar={() => {
                    const error = errorAMedida(state.necesidadLibre);
                    if (error) return setErrorPaso(error);
                    irA('negocio');
                  }}
                />
              )}
              {paso === 'negocio' && (
                <StepNegocio
                  inicial={state.datos}
                  aMedida={aMedida}
                  variante={ordenB ? 'soloNombre' : 'completo'}
                  headingRef={titulo}
                  enfocarPrimero={interactuo}
                  onCambio={onCambioDatos}
                  onEnviar={onGuardarNegocio}
                />
              )}
              {paso === 'resultado' && (
                <StepResultado
                  nombreNegocio={nombreNegocio}
                  aMedida={aMedida}
                  preview={<div data-testid="negocio-preview">{vistaPrevia('celular')}</div>}
                  controles={controles}
                  cta={cta}
                  demoUrl={demoUrl}
                  puedeCompletar={state.lead !== null && !sinGuardar}
                  sinGuardar={sinGuardar}
                  headingRef={titulo}
                  onDemo={() => track('demo_abierta', { rubro: state.rubro ?? '', paleta })}
                  onCompletar={() => irA('completar')}
                />
              )}
              {paso === 'contacto' && (
                <StepNegocio
                  inicial={state.datos}
                  aMedida={false}
                  variante="contacto"
                  headingRef={titulo}
                  enfocarPrimero={interactuo}
                  onCambio={onCambioDatos}
                  onEnviar={onGuardarNegocio}
                />
              )}
              {paso === 'completar' && state.lead && (
                <StepCompletar
                  inicial={state.datos}
                  headingRef={titulo}
                  enfocarPrimero={interactuo}
                  onCambio={onCambioDatos}
                  onEnviar={async (datos, honeypot) => {
                    const r = await completarLead(state.lead!, { ...datos, website: honeypot });
                    if (r.ok) {
                      track('lead_completado', { completo: true });
                      dispatch({ tipo: 'completado' });
                      setTimeout(() => irA('listo'), PAUSA_EXITO_MS);
                    }
                    return r;
                  }}
                  onOmitir={() => {
                    track('lead_completado', { completo: false });
                    irA('resultado');
                  }}
                />
              )}
              {paso === 'listo' && (
                <StepGracias
                  nombreNegocio={nombreNegocio}
                  whatsappLink={whatsappLink}
                  headingRef={titulo}
                  onWhatsapp={onCta}
                  onReiniciar={reiniciar}
                />
              )}
            </m.div>
          </AnimatePresence>
        </Marco>
        {paso === 'resultado' && <BarraCta>{cta}</BarraCta>}
      </MotionConfig>
    </LazyMotion>
  );
}
