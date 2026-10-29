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
    { id: 'chico', nombre: 'Chico', precio: 0 },
    { id: 'grande', nombre: 'Grande', precio: pesos(900) },
  ],
};

const leche: GrupoModificador = {
  id: 'leche',
  nombre: 'Leche',
  tipo: 'unico',
  obligatorio: false,
  opciones: [
    { id: 'entera', nombre: 'Entera', precio: 0 },
    { id: 'descremada', nombre: 'Descremada', precio: 0 },
    { id: 'vegetal', nombre: 'Vegetal', precio: pesos(700) },
  ],
};

const extrasCafe: GrupoModificador = {
  id: 'extras',
  nombre: 'Extras',
  tipo: 'multiple',
  obligatorio: false,
  opciones: [
    { id: 'shot', nombre: 'Shot extra de café', precio: pesos(800) },
    { id: 'crema', nombre: 'Crema', precio: pesos(600) },
    { id: 'sin_azucar', nombre: 'Sin azúcar', precio: 0 },
  ],
};

const cafe = (
  id: string,
  nombre: string,
  descripcion: string,
  precio: number,
  conLeche: boolean,
): Producto => ({
  id,
  categoriaId: 'cafe',
  nombre,
  descripcion,
  precio: pesos(precio),
  ilustracion: 'cafe',
  modificadores: conLeche ? [tamanio, leche, extrasCafe] : [tamanio, extrasCafe],
});

export const cafeteria: CocinaDemo = {
  id: 'cafe',
  nombre: 'Café',
  nombreLocalPorDefecto: 'Tu café',
  costoEnvio: pesos(1_500),
  menu: {
    categorias: [
      { id: 'cafe', nombre: 'Café' },
      { id: 'pasteleria', nombre: 'Pastelería' },
      { id: 'salado', nombre: 'Salado' },
      { id: 'jugos', nombre: 'Jugos' },
    ],
    productos: [
      cafe('espresso', 'Café', 'Espresso, corto y con cuerpo.', 2_600, false),
      cafe('cortado', 'Cortado', 'Espresso con un toque de leche.', 2_900, true),
      cafe('con_leche', 'Café con leche', 'En taza grande, como en casa.', 3_400, true),
      cafe('capuchino', 'Capuchino', 'Con espuma y cacao arriba.', 3_800, true),
      {
        id: 'medialuna_manteca',
        categoriaId: 'pasteleria',
        nombre: 'Medialuna de manteca',
        descripcion: 'Dulce, con almíbar.',
        precio: pesos(1_200),
        ilustracion: 'medialuna',
        modificadores: [],
      },
      {
        id: 'medialuna_grasa',
        categoriaId: 'pasteleria',
        nombre: 'Medialuna de grasa',
        descripcion: 'Saladita, para los que saben.',
        precio: pesos(1_100),
        ilustracion: 'medialuna',
        modificadores: [],
      },
      {
        id: 'alfajor',
        categoriaId: 'pasteleria',
        nombre: 'Alfajor de maicena',
        descripcion: 'Con dulce de leche y coco rallado.',
        precio: pesos(1_900),
        ilustracion: 'alfajor',
        modificadores: [],
      },
      {
        id: 'budin',
        categoriaId: 'pasteleria',
        nombre: 'Budín de limón',
        descripcion: 'Una porción generosa, con glasé.',
        precio: pesos(2_700),
        ilustracion: 'torta',
        modificadores: [],
      },
      {
        id: 'tostado',
        categoriaId: 'salado',
        nombre: 'Tostado de jamón y queso',
        descripcion: 'Bien dorado, con el queso derretido.',
        precio: pesos(5_200),
        ilustracion: 'tostado',
        modificadores: [
          {
            id: 'pan',
            nombre: 'Pan',
            tipo: 'unico',
            obligatorio: true,
            opciones: [
              { id: 'miga', nombre: 'De miga', precio: 0 },
              { id: 'arabe', nombre: 'Árabe', precio: 0 },
            ],
          },
          {
            id: 'agregados',
            nombre: 'Agregados',
            tipo: 'multiple',
            obligatorio: false,
            opciones: [
              { id: 'tomate', nombre: 'Tomate', precio: pesos(500) },
              { id: 'huevo', nombre: 'Huevo', precio: pesos(700) },
            ],
          },
        ],
      },
      {
        id: 'tostadas',
        categoriaId: 'salado',
        nombre: 'Tostadas con queso crema',
        descripcion: 'Pan de campo, queso crema y mermelada.',
        precio: pesos(3_900),
        ilustracion: 'tostado',
        modificadores: [],
      },
      {
        id: 'exprimido',
        categoriaId: 'jugos',
        nombre: 'Exprimido de naranja',
        descripcion: 'Recién hecho.',
        precio: pesos(3_300),
        ilustracion: 'jugo',
        modificadores: [tamanio],
      },
    ],
  },
  pedidosEjemplo: [
    {
      modalidad: 'mesa',
      mesa: '2',
      cliente: { nombre: 'Mesa 2' },
      medioPago: 'efectivo',
      propinaPorcentaje: 10,
      items: [
        {
          productoId: 'con_leche',
          cantidad: 2,
          modificadores: [
            { grupoId: 'tamanio', opcionId: 'grande' },
            { grupoId: 'leche', opcionId: 'descremada' },
          ],
        },
        { productoId: 'medialuna_manteca', cantidad: 4, modificadores: [] },
      ],
    },
    {
      modalidad: 'retiro',
      cliente: { nombre: 'Juli' },
      medioPago: 'mercado_pago',
      propinaPorcentaje: 0,
      items: [
        {
          productoId: 'capuchino',
          cantidad: 1,
          modificadores: [
            { grupoId: 'tamanio', opcionId: 'chico' },
            { grupoId: 'leche', opcionId: 'vegetal' },
          ],
        },
        { productoId: 'alfajor', cantidad: 1, modificadores: [] },
      ],
    },
    {
      modalidad: 'delivery',
      direccion: 'Pasaje Ejemplo 55',
      cliente: { nombre: 'Sofi' },
      medioPago: 'mercado_pago',
      propinaPorcentaje: 10,
      items: [
        {
          productoId: 'tostado',
          cantidad: 2,
          modificadores: [
            { grupoId: 'pan', opcionId: 'miga' },
            { grupoId: 'agregados', opcionId: 'tomate' },
          ],
        },
        {
          productoId: 'exprimido',
          cantidad: 2,
          modificadores: [{ grupoId: 'tamanio', opcionId: 'grande' }],
          nota: 'Sin hielo.',
        },
      ],
    },
  ],
};
