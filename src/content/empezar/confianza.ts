import type { IconName } from '@/brand/ilustracion/iconos/paths';

/**
 * Marketing honesto: lo que genera confianza son compromisos que SÍ cumplimos (skill webya-brand:
 * nada de testimonios, logos de clientes, métricas ni sellos inventados).
 */
export const CONFIANZA: {
  titulo: string;
  compromisos: readonly { icono: IconName; titulo: string; texto: string }[];
} = {
  titulo: 'Por qué confiar en WebYa',
  compromisos: [
    {
      icono: 'chat',
      titulo: 'Hablás con una persona',
      texto: 'Te escribimos en menos de 24 hs, por WhatsApp, y armamos todo con vos.',
    },
    {
      icono: 'carta_qr',
      titulo: 'Probás antes de decidir',
      texto: 'La demo es real y la usás sin registrarte: pedí como cliente y miralo como dueño.',
    },
    {
      icono: 'catalogo',
      titulo: 'Solo lo que necesitás',
      texto: 'Activás solo las piezas que tu negocio necesita, y sumás más cuando quieras.',
    },
    {
      icono: 'clientes',
      titulo: 'Tus datos, cuidados',
      texto: 'Los usamos solo para contactarte y no los compartimos con nadie.',
    },
  ],
};
