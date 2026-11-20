import { describe, expect, it } from 'vitest';
import { enlaceContacto } from '@/components/marketing/editorial/contacto';
import { MODULOS_POR_DEFECTO, mensajePedido } from '@/content/configurador';
import { ESTADO_INICIAL, mensajeDe, reducir, resumen, type Accion } from './estado';

const correr = (...acciones: Accion[]) => acciones.reduce(reducir, ESTADO_INICIAL);

describe('configurador: estado', () => {
  it('sin tipo no hay mensaje (el botón no se puede usar)', () => {
    expect(resumen(ESTADO_INICIAL).listo).toBe(false);
    expect(mensajeDe(ESTADO_INICIAL)).toBeNull();
  });

  it('elegir el tipo marca lo más pedido: tipo → rubro → enviar en tres toques', () => {
    const e = correr(
      { tipo: 'elegirTipo', valor: 'turnero' },
      { tipo: 'elegirRubro', valor: 'estetica' },
    );
    expect(e.modulos).toEqual([...MODULOS_POR_DEFECTO.turnero]);
    const m = mensajeDe(e)!;
    expect(m).toContain('Quiero armar: Turnero con seña.');
    expect(m).toContain('Rubro: Peluquería o estética.');
    expect(m).toContain('- Seña del 50% al reservar');
  });

  it('cambiar de tipo descarta lo que no aplica y conserva lo que sí', () => {
    const e = correr(
      { tipo: 'elegirTipo', valor: 'pedidos' },
      { tipo: 'alternarModulo', valor: 'mercadopago' },
      { tipo: 'elegirTipo', valor: 'web' },
    );
    expect(e.modulos).not.toContain('franjas');
    expect(e.modulos).not.toContain('mercadopago');
    const e2 = correr(
      { tipo: 'elegirTipo', valor: 'pedidos' },
      { tipo: 'alternarModulo', valor: 'mercadopago' },
      { tipo: 'elegirTipo', valor: 'tienda' },
    );
    expect(e2.modulos).toContain('mercadopago');
  });

  it('los atajos del bento preseleccionan tipo y módulo; ignoran ids desconocidos', () => {
    const e = correr({ tipo: 'preseleccionar', tipoSistema: 'turnero', modulo: 'bot' });
    expect(e.tipo).toBe('turnero');
    expect(e.modulos).toContain('bot');
    const igual = correr({ tipo: 'preseleccionar', tipoSistema: 'cualquiera', modulo: 'nada' });
    expect(igual).toEqual(ESTADO_INICIAL);
  });

  it('solo se mandan los módulos que aplican al tipo elegido', () => {
    const e = correr(
      { tipo: 'preseleccionar', modulo: 'franjas' },
      { tipo: 'elegirTipo', valor: 'web' },
    );
    expect(resumen(e).modulos).not.toContain('Pedidos por franja de 15 minutos');
  });

  it('"Otro" usa lo que escribió la persona, recortado', () => {
    const e = correr(
      { tipo: 'elegirTipo', valor: 'medida' },
      { tipo: 'elegirRubro', valor: 'otro' },
      { tipo: 'escribirRubroOtro', valor: 'Gomería' },
      { tipo: 'escribirNegocio', valor: '  Gomería Ruta 34  ' },
    );
    expect(mensajeDe(e)).toContain('Mi negocio: Gomería Ruta 34 (Gomería).');
  });

  it('reiniciar vuelve al principio', () => {
    expect(correr({ tipo: 'elegirTipo', valor: 'tienda' }, { tipo: 'reiniciar' })).toEqual(
      ESTADO_INICIAL,
    );
  });
});

describe('configurador: mensaje y destino', () => {
  it('el mensaje no lleva líneas vacías ni saltos de más', () => {
    const m = mensajePedido({ tipo: 'Página web', modulos: [] });
    expect(m).toBe(
      'Hola, vengo de webya.dev.\nQuiero armar: Página web.\n¿Me cuentan cómo lo armamos y cuánto sale?',
    );
  });

  it('con número abre WhatsApp; sin número cae a mail con el mismo texto', () => {
    const wa = enlaceContacto('hola', '5493406000000');
    expect(wa.canal).toBe('whatsapp');
    expect(wa.href).toBe('https://wa.me/5493406000000?text=hola');
    const mail = enlaceContacto('hola qué tal', '');
    expect(mail.canal).toBe('mail');
    expect(mail.href).toMatch(/^mailto:[^?]+\?subject=.+&body=hola%20qu%C3%A9%20tal$/);
  });
});
