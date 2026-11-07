/** Textos de /privacidad y /terminos. Cada sección: título y párrafos o lista. */
export interface SeccionLegal {
  titulo: string;
  parrafos?: readonly string[];
  lista?: readonly string[];
}

export interface TextoLegal {
  titulo: string;
  meta: string;
  intro: string;
  secciones: readonly SeccionLegal[];
}

export const LEGAL_UI = {
  volver: 'Volver a WebYa',
  contactoPrefijo: 'Escribinos a',
} as const;

export const PRIVACIDAD: TextoLegal = {
  titulo: 'Política de privacidad',
  meta: 'Qué datos guardamos en WebYa, para qué y cómo pedir que los borremos.',
  intro:
    'WebYa usa tus datos solo para armar y mejorar tu negocio online. No los vendemos ni los compartimos con otras empresas.',
  secciones: [
    {
      titulo: 'Qué datos guardamos',
      lista: [
        'Los que cargás en el formulario: nombre del negocio, tu nombre, WhatsApp, email y lo que quieras contarnos.',
        'Lo que elegiste en el armado: rubro y módulos.',
        'De dónde llegaste (por ejemplo, Instagram). La IP no se guarda en claro: la convertimos en un código que no se puede revertir y la usamos para frenar el spam.',
      ],
    },
    {
      titulo: 'Para qué los usamos',
      parrafos: [
        'Para contactarte por tu negocio, armar lo que pediste y avisarte novedades de tu proyecto. Nada más.',
      ],
    },
    {
      titulo: 'Quién más los ve',
      parrafos: [
        'Los guardamos con proveedores de infraestructura (hosting y base de datos) que trabajan por cuenta nuestra. Solo los entregamos si una autoridad competente nos lo exige.',
      ],
    },
    {
      titulo: 'Tus derechos',
      parrafos: [
        'Podés pedirnos ver, corregir o borrar tus datos cuando quieras. Según la ley argentina de Protección de Datos Personales, también podés reclamar ante la Agencia de Acceso a la Información Pública.',
      ],
    },
    {
      titulo: 'Cookies',
      parrafos: [
        'Guardamos en tu navegador solo lo necesario para recordar tu borrador y tu preferencia de tema. No usamos cookies de publicidad.',
      ],
    },
    {
      titulo: 'Cómo medimos',
      parrafos: [
        'Contamos por qué pantallas pasa cada visita para saber dónde se traba la página. Es un número al azar por pestaña, sin IP, sin cookies y sin lo que escribís. No lo cruzamos con tus datos ni lo compartimos.',
      ],
    },
  ],
};

export const TERMINOS: TextoLegal = {
  titulo: 'Términos de uso',
  meta: 'Condiciones para usar WebYa.',
  intro: 'Al usar WebYa aceptás estas condiciones. Son pocas y simples.',
  secciones: [
    {
      titulo: 'Qué es WebYa',
      parrafos: [
        'Un servicio para crear el sitio y las herramientas digitales de un negocio. Hoy el rubro más avanzado es gastronomía.',
      ],
    },
    {
      titulo: 'Tu contenido',
      parrafos: [
        'Lo que cargues (textos, fotos, precios) es tuyo. Nos das permiso para mostrarlo en tu sitio. Sos responsable de tener derecho a usarlo y de que los precios y horarios sean correctos.',
      ],
    },
    {
      titulo: 'Uso permitido',
      parrafos: [
        'No podés usar WebYa para vender cosas ilegales, engañar a otras personas ni dañar el servicio.',
      ],
    },
    {
      titulo: 'Precios',
      parrafos: ['Te informamos el precio antes de que publiques. No cobramos nada sin tu acuerdo.'],
    },
    {
      titulo: 'Disponibilidad',
      parrafos: [
        'Hacemos lo posible para que todo ande siempre, pero no podemos garantizar que no haya cortes. Si algo falla, escribinos.',
      ],
    },
    {
      titulo: 'Cambios y baja',
      parrafos: [
        'Podemos actualizar estos términos y te avisamos si el cambio es importante. Podés pedir la baja de tu negocio cuando quieras.',
      ],
    },
  ],
};
