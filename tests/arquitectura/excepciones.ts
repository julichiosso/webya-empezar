/**
 * Deuda registrada. Esta lista SOLO puede achicarse: el test falla si una entrada ya no hace falta.
 * Cada entrada dice quién la saca y en qué ola (docs/plan-sprint.md).
 */

/** "origen -> destino" (rutas dentro de src/, sin extensión) → motivo y dueño. */
export const EXCEPCIONES_CAPAS: Record<string, string> = {
  'brand/ilustracion/modulos/ModuloArte.tsx -> content/modulos':
    'Ola 2, ilustracion: el arte define sus ids y content los elige',
  'components/marketing/Hero.tsx -> features/explicativo/BotonExplicativo':
    'Ola 3, paginas: la página compone el botón (prop o slot)',
  'components/marketing/HeroMockup.tsx -> features/empezar/modulos-store':
    'Ola 3, paginas: el estado entra por props',
  'domain/leads/lead.ts -> content/demos/gastronomia/paletas':
    'Ola 1, integrador: el esquema recibe los catálogos por parámetro',
  'domain/leads/lead.ts -> content/demos/gastronomia/types':
    'Ola 1, integrador: el esquema recibe los catálogos por parámetro',
  'domain/leads/lead.ts -> content/modulos':
    'Ola 1, integrador: el esquema recibe los catálogos por parámetro',
  'domain/leads/lead.ts -> content/rubros':
    'Ola 1, integrador: el esquema recibe los catálogos por parámetro',
  'features/demo/gastronomia/compartir.ts -> features/empezar/desde-demo':
    'Ola 3, paginas: el traspaso demo → wizard baja a una capa común',
  'features/demo/gastronomia/DemoGastronomia.tsx -> features/empezar/desde-demo':
    'Ola 3, paginas: el traspaso demo → wizard baja a una capa común',
};

/** Archivo (ruta dentro de src/) → motivo y dueño. */
export const EXCEPCIONES_COPY: Record<string, string> = {
  'app/empezar/opengraph-image.tsx':
    'Ola 1, agente copy-empezar: mover el texto tal cual a src/content',
  'app/empezar/page.tsx': 'Ola 1, agente copy-empezar: mover el texto tal cual a src/content',
  'app/marca/page.tsx': 'Ola 1, agente copy-empezar: mover el texto tal cual a src/content',
  'components/marketing/ComoFunciona.tsx':
    'Ola 1, agente copy-empezar: mover el texto tal cual a src/content',
  'components/marketing/Confianza.tsx':
    'Ola 1, agente copy-empezar: mover el texto tal cual a src/content',
  'components/marketing/Faq.tsx':
    'Ola 1, agente copy-empezar: mover el texto tal cual a src/content',
  'components/marketing/Footer.tsx':
    'Ola 1, agente copy-empezar: mover el texto tal cual a src/content',
  'components/marketing/Hero.tsx':
    'Ola 1, agente copy-empezar: mover el texto tal cual a src/content',
  'components/marketing/HeroMockup.tsx':
    'Ola 1, agente copy-empezar: mover el texto tal cual a src/content',
  'components/marketing/QueIncluye.tsx':
    'Ola 1, agente copy-empezar: mover el texto tal cual a src/content',
  'components/patterns/NegocioPreview.tsx':
    'Ola 1, agente copy-empezar: mover el texto tal cual a src/content',
  'components/patterns/PreviewPanel.tsx':
    'Ola 1, agente copy-empezar: mover el texto tal cual a src/content',
  'components/ui/Field.tsx': 'Ola 1, agente copy-empezar: mover el texto tal cual a src/content',
  'components/ui/Hoja.tsx': 'Ola 1, agente copy-empezar: mover el texto tal cual a src/content',
  'components/ui/ModuloOption.tsx':
    'Ola 1, agente copy-empezar: mover el texto tal cual a src/content',
  'components/ui/ProgressBar.tsx':
    'Ola 1, agente copy-empezar: mover el texto tal cual a src/content',
  'features/empezar/Wizard.tsx':
    'Ola 1, agente copy-empezar: mover el texto tal cual a src/content',
  'features/empezar/WizardLazy.tsx':
    'Ola 1, agente copy-empezar: mover el texto tal cual a src/content',
  'features/empezar/state.ts': 'Ola 1, agente copy-empezar: mover el texto tal cual a src/content',
  'features/empezar/steps/StepDatos.tsx':
    'Ola 1, agente copy-empezar: mover el texto tal cual a src/content',
  'features/empezar/steps/StepListo.tsx':
    'Ola 1, agente copy-empezar: mover el texto tal cual a src/content',
  'features/empezar/steps/StepModulos.tsx':
    'Ola 1, agente copy-empezar: mover el texto tal cual a src/content',
  'features/empezar/steps/StepRubro.tsx':
    'Ola 1, agente copy-empezar: mover el texto tal cual a src/content',
};
