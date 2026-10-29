import { pesos } from '@/domain/pedidos/dinero';
import type { GrupoModificador, Producto } from '@/domain/pedidos/types';
import type { CocinaDemo } from '../types';

// Datos DE EJEMPLO para la demo: platos y precios ilustrativos, rotulados así en pantalla.

const tamanio: GrupoModificador = {
  id: 'tamanio',
  nombre: 'Tamaño',
  tipo: 'unico',
  obligatorio: true,
  opciones: [
    { id: 'mediana', nombre: 'Mediana (6 porciones)', precio: 0 },
    { id: 'grande', nombre: 'Grande (8 porciones)', precio: pesos(3_500) },
  ],
};

const agregadosPizza: GrupoModificador = {
  id: 'agregados',
  nombre: 'Agregados',
  tipo: 'multiple',
  obligatorio: false,
  opciones: [
    { id: 'extra_queso', nombre: 'Extra queso', precio: pesos(2_500) },
    { id: 'sin_aceitunas', nombre: 'Sin aceitunas', precio: 0 },
    { id: 'bien_cocida', nombre: 'Bien cocida', precio: 0 },
  ],
};

const pizza = (id: string, nombre: string, descripcion: string, precio: number): Producto => ({
  id,
  categoriaId: 'pizzas',
  nombre,
  descripcion,
  precio: pesos(precio),
  ilustracion: 'pizza',
  modificadores: [tamanio, agregadosPizza],
});

const empanada = (id: string, nombre: string, descripcion: string): Producto => ({
  id,
  categoriaId: 'empanadas',
  nombre,
  descripcion,
  precio: pesos(1_900),
  ilustracion: 'empanada',
  modificadores: [
    {
      id: 'coccion',
      nombre: 'Cocción',
      tipo: 'unico',
      obligatorio: true,
      opciones: [
        { id: 'horno', nombre: 'Al horno', precio: 0 },
        { id: 'frita', nombre: 'Frita', precio: 0 },
      ],
    },
  ],
});

export const pizzeria: CocinaDemo = {
  id: 'pizzeria',
  nombre: 'Pizzería',
  nombreLocalPorDefecto: 'Tu pizzería',
  costoEnvio: pesos(2_000),
  menu: {
    categorias: [
      { id: 'pizzas', nombre: 'Pizzas' },
      { id: 'empanadas', nombre: 'Empanadas' },
      { id: 'para_acompaniar', nombre: 'Para acompañar' },
      { id: 'bebidas', nombre: 'Bebidas' },
      { id: 'postres', nombre: 'Postres' },
    ],
    productos: [
      pizza('muzzarella', 'Muzzarella', 'Salsa de tomate, muzzarella y aceitunas.', 13_500),
      pizza('napolitana', 'Napolitana', 'Muzzarella, rodajas de tomate y ajo.', 15_200),
      pizza('fugazzeta', 'Fugazzeta', 'Rellena de queso, con cebolla arriba.', 16_800),
      pizza('calabresa', 'Calabresa', 'Muzzarella y longaniza calabresa.', 16_200),
      pizza('especial', 'Especial', 'Jamón, morrones y huevo duro.', 17_400),
      empanada('emp_carne', 'Empanada de carne', 'Carne suave, cebolla y huevo.'),
      empanada('emp_jyq', 'Empanada de jamón y queso', 'La que nunca falla.'),
      empanada('emp_humita', 'Empanada de humita', 'Choclo cremoso con salsa blanca.'),
      {
        id: 'faina',
        categoriaId: 'para_acompaniar',
        nombre: 'Fainá',
        descripcion: 'La porción para ponerle arriba a la pizza.',
        precio: pesos(1_800),
        ilustracion: 'faina',
        modificadores: [],
      },
      {
        id: 'gaseosa',
        categoriaId: 'bebidas',
        nombre: 'Gaseosa',
        descripcion: 'Botella de 1,5 l.',
        precio: pesos(4_200),
        ilustracion: 'gaseosa',
        modificadores: [],
      },
      {
        id: 'cerveza',
        categoriaId: 'bebidas',
        nombre: 'Cerveza',
        descripcion: 'Porrón de 1 l.',
        precio: pesos(5_600),
        ilustracion: 'cerveza',
        modificadores: [
          {
            id: 'estilo',
            nombre: 'Estilo',
            tipo: 'unico',
            obligatorio: true,
            opciones: [
              { id: 'rubia', nombre: 'Rubia', precio: 0 },
              { id: 'negra', nombre: 'Negra', precio: 0 },
            ],
          },
        ],
      },
      {
        id: 'helado',
        categoriaId: 'postres',
        nombre: 'Helado',
        descripcion: 'Un cuarto kilo, hasta tres gustos.',
        precio: pesos(6_900),
        ilustracion: 'helado',
        modificadores: [
          {
            id: 'gustos',
            nombre: 'Gustos',
            tipo: 'multiple',
            obligatorio: false,
            opciones: [
              { id: 'ddl', nombre: 'Dulce de leche', precio: 0 },
              { id: 'chocolate', nombre: 'Chocolate', precio: 0 },
              { id: 'frutilla', nombre: 'Frutilla', precio: 0 },
            ],
          },
        ],
      },
    ],
  },
  pedidosEjemplo: [
    {
      modalidad: 'delivery',
      direccion: 'Calle Falsa 123, 2° B',
      cliente: { nombre: 'Lucía' },
      medioPago: 'mercado_pago',
      propinaPorcentaje: 10,
      items: [
        {
          productoId: 'muzzarella',
          cantidad: 1,
          modificadores: [
            { grupoId: 'tamanio', opcionId: 'grande' },
            { grupoId: 'agregados', opcionId: 'sin_aceitunas' },
          ],
        },
        { productoId: 'faina', cantidad: 2, modificadores: [] },
      ],
    },
    {
      modalidad: 'retiro',
      cliente: { nombre: 'Nico' },
      medioPago: 'efectivo',
      propinaPorcentaje: 0,
      items: [
        {
          productoId: 'emp_carne',
          cantidad: 6,
          modificadores: [{ grupoId: 'coccion', opcionId: 'horno' }],
        },
        {
          productoId: 'emp_jyq',
          cantidad: 6,
          modificadores: [{ grupoId: 'coccion', opcionId: 'horno' }],
        },
      ],
    },
    {
      modalidad: 'mesa',
      mesa: '7',
      cliente: { nombre: 'Mati' },
      medioPago: 'efectivo',
      propinaPorcentaje: 15,
      items: [
        {
          productoId: 'fugazzeta',
          cantidad: 1,
          modificadores: [
            { grupoId: 'tamanio', opcionId: 'mediana' },
            { grupoId: 'agregados', opcionId: 'extra_queso' },
          ],
          nota: 'Cortala en 8, porfa.',
        },
        {
          productoId: 'cerveza',
          cantidad: 2,
          modificadores: [{ grupoId: 'estilo', opcionId: 'rubia' }],
        },
      ],
    },
  ],
};
