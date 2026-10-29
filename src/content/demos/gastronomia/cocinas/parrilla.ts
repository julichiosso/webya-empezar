import { pesos } from '@/domain/pedidos/dinero';
import type { GrupoModificador } from '@/domain/pedidos/types';
import type { CocinaDemo } from '@/content/demos/gastronomia/types';

// Datos DE EJEMPLO para la demo: platos y precios ilustrativos, rotulados así en pantalla.

const punto: GrupoModificador = {
  id: 'punto',
  nombre: 'Punto de cocción',
  tipo: 'unico',
  obligatorio: true,
  opciones: [
    { id: 'jugoso', nombre: 'Jugoso', precio: 0 },
    { id: 'a_punto', nombre: 'A punto', precio: 0 },
    { id: 'cocido', nombre: 'Cocido', precio: 0 },
  ],
};

const agregadosCarne: GrupoModificador = {
  id: 'agregados',
  nombre: 'Agregados',
  tipo: 'multiple',
  obligatorio: false,
  opciones: [
    { id: 'huevo', nombre: 'Huevo frito', precio: pesos(1_500) },
    { id: 'chimichurri', nombre: 'Chimichurri extra', precio: 0 },
    { id: 'sin_sal', nombre: 'Sin sal', precio: 0 },
  ],
};

export const parrilla: CocinaDemo = {
  id: 'parrilla',
  nombre: 'Parrilla',
  nombreLocalPorDefecto: 'Tu parrilla',
  costoEnvio: pesos(2_500),
  menu: {
    categorias: [
      { id: 'entradas', nombre: 'Para empezar' },
      { id: 'parrilla', nombre: 'A la parrilla' },
      { id: 'guarniciones', nombre: 'Guarniciones' },
      { id: 'bebidas', nombre: 'Bebidas' },
      { id: 'postres', nombre: 'Postres' },
    ],
    productos: [
      {
        id: 'provoleta',
        categoriaId: 'entradas',
        nombre: 'Provoleta',
        descripcion: 'Con orégano y un toque de ají molido.',
        precio: pesos(7_800),
        ilustracion: 'queso',
        modificadores: [
          {
            id: 'extras',
            nombre: 'Extras',
            tipo: 'multiple',
            obligatorio: false,
            opciones: [
              { id: 'tomates', nombre: 'Tomates asados', precio: pesos(1_200) },
              { id: 'sin_aji', nombre: 'Sin ají', precio: 0 },
            ],
          },
        ],
      },
      {
        id: 'empanada_carne',
        categoriaId: 'entradas',
        nombre: 'Empanada de carne',
        descripcion: 'Cortada a cuchillo, al horno de barro.',
        precio: pesos(2_200),
        ilustracion: 'empanada',
        modificadores: [],
      },
      {
        id: 'choripan',
        categoriaId: 'entradas',
        nombre: 'Choripán',
        descripcion: 'Chorizo de cerdo en pan francés, con chimichurri.',
        precio: pesos(6_500),
        ilustracion: 'chorizo',
        modificadores: [
          {
            id: 'salsas',
            nombre: 'Salsas',
            tipo: 'multiple',
            obligatorio: false,
            opciones: [
              { id: 'criolla', nombre: 'Salsa criolla', precio: 0 },
              { id: 'sin_chimi', nombre: 'Sin chimichurri', precio: 0 },
            ],
          },
        ],
      },
      {
        id: 'bife_chorizo',
        categoriaId: 'parrilla',
        nombre: 'Bife de chorizo',
        descripcion: 'Unos 400 g, con sal entrefina.',
        precio: pesos(24_500),
        ilustracion: 'carne',
        modificadores: [punto, agregadosCarne],
      },
      {
        id: 'vacio',
        categoriaId: 'parrilla',
        nombre: 'Vacío',
        descripcion: 'Bien dorado por fuera, tierno por dentro.',
        precio: pesos(21_000),
        ilustracion: 'carne',
        modificadores: [punto, agregadosCarne],
      },
      {
        id: 'entrania',
        categoriaId: 'parrilla',
        nombre: 'Entraña',
        descripcion: 'Corte fino y sabroso, a la llama.',
        precio: pesos(22_800),
        ilustracion: 'carne',
        modificadores: [punto, agregadosCarne],
      },
      {
        id: 'pollo',
        categoriaId: 'parrilla',
        nombre: 'Pollo deshuesado',
        descripcion: 'Medio pollo con limón y ajo.',
        precio: pesos(15_900),
        ilustracion: 'pollo',
        modificadores: [],
      },
      {
        id: 'papas_fritas',
        categoriaId: 'guarniciones',
        nombre: 'Papas fritas',
        descripcion: 'Bastón, crocantes.',
        precio: pesos(6_200),
        ilustracion: 'papas',
        modificadores: [
          {
            id: 'estilo',
            nombre: 'Estilo',
            tipo: 'multiple',
            obligatorio: false,
            opciones: [
              { id: 'a_caballo', nombre: 'A caballo (con huevo)', precio: pesos(1_500) },
              { id: 'provenzal', nombre: 'Provenzal', precio: pesos(800) },
            ],
          },
        ],
      },
      {
        id: 'ensalada_mixta',
        categoriaId: 'guarniciones',
        nombre: 'Ensalada mixta',
        descripcion: 'Lechuga, tomate y cebolla.',
        precio: pesos(5_400),
        ilustracion: 'ensalada',
        modificadores: [
          {
            id: 'sin',
            nombre: 'Sacale',
            tipo: 'multiple',
            obligatorio: false,
            opciones: [
              { id: 'sin_cebolla', nombre: 'Sin cebolla', precio: 0 },
              { id: 'sin_tomate', nombre: 'Sin tomate', precio: 0 },
            ],
          },
        ],
      },
      {
        id: 'agua',
        categoriaId: 'bebidas',
        nombre: 'Agua',
        descripcion: 'Botella de 500 ml.',
        precio: pesos(2_300),
        ilustracion: 'agua',
        modificadores: [
          {
            id: 'tipo',
            nombre: 'Tipo',
            tipo: 'unico',
            obligatorio: true,
            opciones: [
              { id: 'sin_gas', nombre: 'Sin gas', precio: 0 },
              { id: 'con_gas', nombre: 'Con gas', precio: 0 },
            ],
          },
        ],
      },
      {
        id: 'gaseosa',
        categoriaId: 'bebidas',
        nombre: 'Gaseosa',
        descripcion: 'Lata de 354 ml.',
        precio: pesos(2_800),
        ilustracion: 'gaseosa',
        modificadores: [],
      },
      {
        id: 'vino_copa',
        categoriaId: 'bebidas',
        nombre: 'Copa de malbec',
        descripcion: 'De la casa.',
        precio: pesos(4_500),
        ilustracion: 'vino',
        modificadores: [],
      },
      {
        id: 'flan',
        categoriaId: 'postres',
        nombre: 'Flan casero',
        descripcion: 'Como el de la abuela.',
        precio: pesos(4_800),
        ilustracion: 'flan',
        modificadores: [
          {
            id: 'con',
            nombre: 'Acompañalo con',
            tipo: 'unico',
            obligatorio: false,
            opciones: [
              { id: 'ddl', nombre: 'Dulce de leche', precio: pesos(900) },
              { id: 'crema', nombre: 'Crema', precio: pesos(900) },
              { id: 'mixto', nombre: 'Mixto', precio: pesos(1_400) },
            ],
          },
        ],
      },
    ],
  },
  pedidosEjemplo: [
    {
      modalidad: 'mesa',
      mesa: '4',
      cliente: { nombre: 'Flor' },
      medioPago: 'efectivo',
      propinaPorcentaje: 10,
      items: [
        {
          productoId: 'bife_chorizo',
          cantidad: 2,
          modificadores: [{ grupoId: 'punto', opcionId: 'a_punto' }],
        },
        { productoId: 'papas_fritas', cantidad: 1, modificadores: [] },
        { productoId: 'vino_copa', cantidad: 2, modificadores: [] },
      ],
    },
    {
      modalidad: 'retiro',
      cliente: { nombre: 'Caro' },
      medioPago: 'mercado_pago',
      propinaPorcentaje: 0,
      items: [
        { productoId: 'empanada_carne', cantidad: 6, modificadores: [] },
        {
          productoId: 'choripan',
          cantidad: 2,
          modificadores: [{ grupoId: 'salsas', opcionId: 'criolla' }],
        },
      ],
    },
    {
      modalidad: 'delivery',
      direccion: 'Av. Siempre Viva 742',
      cliente: { nombre: 'Martín' },
      medioPago: 'mercado_pago',
      propinaPorcentaje: 15,
      items: [
        {
          productoId: 'vacio',
          cantidad: 1,
          modificadores: [{ grupoId: 'punto', opcionId: 'jugoso' }],
        },
        {
          productoId: 'ensalada_mixta',
          cantidad: 1,
          modificadores: [{ grupoId: 'sin', opcionId: 'sin_cebolla' }],
          nota: 'Aderezo aparte, por favor.',
        },
      ],
    },
  ],
};
