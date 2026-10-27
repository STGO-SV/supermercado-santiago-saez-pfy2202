import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import {
  normalizarProductos,
  crearArticulo,
  validarProductosEstado,
} from '../src/utils/productos.js'
import { validarArticulo } from '../src/utils/validarArticulo.js'
import {
  estadoInicialProductos,
  productosReducer,
} from '../src/reducers/productosReducer.js'

const semilla = JSON.parse(
  readFileSync(
    new URL('../public/data/productos.json', import.meta.url),
    'utf8',
  ),
)
const campos = {
  nombre: ' Avena de prueba ',
  marca: ' Marca de prueba ',
  tipo: ' Abarrotes ',
  precio: ' 1290 ',
  stock: ' 6 ',
}
const cargar = () =>
  productosReducer(estadoInicialProductos, {
    type: 'CARGA_COMPLETADA',
    productos: normalizarProductos(semilla),
  })
const agregar = (estado, producto) =>
  productosReducer(estado, { type: 'AGREGAR_ARTICULO', producto })

test('La normalización conserva los atributos originales sin modificar la semilla', () => {
  const copia = structuredClone(semilla)
  const productos = normalizarProductos(semilla)
  assert.deepEqual(semilla, copia)
  assert.equal(productos.length, 12)
  for (const [indice, producto] of productos.entries()) {
    for (const campo of Object.keys(semilla[indice]))
      assert.equal(producto[campo], semilla[indice][campo])
    assert.equal(producto.marca, null)
    assert.equal(producto.tipo, producto.categoria)
    assert.notEqual(producto, semilla[indice])
  }
  assert.equal(validarProductosEstado(productos), true)
})

test('La normalización admite una semilla vacía', () => {
  assert.deepEqual(normalizarProductos([]), [])
})

test('La normalización rechaza registros inválidos, IDs repetidos y marcas inválidas', () => {
  for (const datos of [
    null,
    {},
    [null],
    [semilla[0], semilla[0]],
    [{ ...semilla[0], precio: -1 }],
    [{ ...semilla[0], marca: ' ' }],
    [{ ...semilla[0], marca: 5 }],
  ]) {
    assert.throws(() => normalizarProductos(datos))
  }
})

test('La normalización es idempotente y conserva una marca informada', () => {
  const productos = normalizarProductos([
    { ...semilla[0], marca: 'Marca de prueba' },
  ])
  assert.deepEqual(normalizarProductos(productos), productos)
  assert.equal(productos[0].marca, 'Marca de prueba')
})

test('El modelo compartido rechaza tipo contradictorio y marca ausente', () => {
  const producto = normalizarProductos(semilla)[0]
  assert.equal(validarProductosEstado([{ ...producto, tipo: 'Otro' }]), false)
  assert.equal(
    validarProductosEstado([{ ...producto, marca: undefined }]),
    false,
  )
})

test('El ingreso exige los cinco campos y rechaza espacios y tipos incorrectos', () => {
  assert.deepEqual(Object.keys(validarArticulo({})), [
    'nombre',
    'marca',
    'tipo',
    'precio',
    'stock',
  ])
  for (const campo of Object.keys(campos)) {
    for (const valor of ['', ' ', null, undefined, 12]) {
      assert.ok(validarArticulo({ ...campos, [campo]: valor })[campo])
    }
  }
  assert.equal(Object.keys(validarArticulo(null)).length, 5)
})

test('Precio y cantidad rechazan negativos, decimales, notación exponencial y enteros inseguros', () => {
  for (const campo of ['precio', 'stock']) {
    for (const valor of [
      '-1',
      '1.5',
      '1,5',
      '1e3',
      'Infinity',
      'NaN',
      '9007199254740992',
      '1 000',
    ]) {
      assert.ok(validarArticulo({ ...campos, [campo]: valor })[campo])
    }
  }
})

test('Precio y cantidad admiten cero y el máximo entero seguro', () => {
  assert.deepEqual(
    validarArticulo({ ...campos, precio: '0', stock: '9007199254740991' }),
    {},
  )
})

test('La creación recorta textos, convierte números y deriva categoría y disponibilidad', () => {
  const copia = { ...campos }
  const producto = crearArticulo(campos, 'nuevo-1')
  assert.deepEqual(producto, {
    id: 'nuevo-1',
    nombre: 'Avena de prueba',
    marca: 'Marca de prueba',
    tipo: 'Abarrotes',
    categoria: 'Abarrotes',
    precio: 1290,
    stock: 6,
    disponible: true,
  })
  assert.deepEqual(campos, copia)
  assert.equal(validarProductosEstado([producto]), true)
})

test('Un artículo nuevo con cantidad cero conserva disponibilidad falsa', () => {
  const producto = crearArticulo(
    { ...campos, precio: '0', stock: '0' },
    'nuevo-0',
  )
  assert.equal(producto.stock, 0)
  assert.equal(producto.precio, 0)
  assert.equal(producto.disponible, false)
})

test('La creación rechaza datos inválidos e identificadores vacíos', () => {
  assert.throws(() => crearArticulo({ ...campos, marca: '' }, 'nuevo'))
  for (const id of ['', ' ', null, 1])
    assert.throws(() => crearArticulo(campos, id))
})

test('La carga completa establece la lista compartida y finaliza el estado de carga', () => {
  const estado = cargar()
  assert.equal(estado.productos.length, 12)
  assert.equal(estado.cargando, false)
  assert.equal(estado.error, '')
  assert.deepEqual(estadoInicialProductos, {
    productos: [],
    cargando: true,
    error: '',
  })
})

test('La carga vacía finaliza sin error y permite una incorporación posterior', () => {
  const vacio = productosReducer(estadoInicialProductos, {
    type: 'CARGA_COMPLETADA',
    productos: [],
  })
  assert.equal(vacio.cargando, false)
  assert.equal(vacio.error, '')
  assert.equal(
    agregar(vacio, crearArticulo(campos, 'nuevo')).productos.length,
    1,
  )
})

test('El fallo de carga informa error e impide agregar sobre una semilla fallida', () => {
  const estado = productosReducer(estadoInicialProductos, {
    type: 'CARGA_FALLIDA',
  })
  assert.equal(estado.cargando, false)
  assert.ok(estado.error)
  assert.deepEqual(estado.productos, [])
  assert.equal(agregar(estado, crearArticulo(campos, 'nuevo')), estado)
})

test('Una incorporación durante la carga no modifica el estado', () => {
  assert.equal(
    agregar(estadoInicialProductos, crearArticulo(campos, 'nuevo')),
    estadoInicialProductos,
  )
})

test('El reducer agrega inmutablemente y conserva los doce registros originales', () => {
  const estado = cargar()
  estado.productos.forEach(Object.freeze)
  Object.freeze(estado.productos)
  Object.freeze(estado)
  const producto = Object.freeze(crearArticulo(campos, 'nuevo-1'))
  const siguiente = agregar(estado, producto)
  assert.notEqual(siguiente, estado)
  assert.notEqual(siguiente.productos, estado.productos)
  assert.equal(estado.productos.length, 12)
  assert.deepEqual(siguiente.productos.slice(0, 12), estado.productos)
  assert.deepEqual(siguiente.productos[12], producto)
  assert.equal(validarProductosEstado(siguiente.productos), true)
})

test('El reducer rechaza IDs existentes y altas repetidas con el mismo ID', () => {
  const estado = cargar()
  assert.equal(agregar(estado, crearArticulo(campos, 'p01')), estado)
  const producto = crearArticulo(campos, 'nuevo-1')
  const siguiente = agregar(estado, producto)
  assert.equal(agregar(siguiente, producto), siguiente)
})

test('El reducer aplica altas consecutivas sin perder productos', () => {
  const estado = agregar(
    agregar(cargar(), crearArticulo(campos, 'nuevo-1')),
    crearArticulo(campos, 'nuevo-2'),
  )
  assert.equal(estado.productos.length, 14)
  assert.equal(
    new Set(estado.productos.map((producto) => producto.id)).size,
    14,
  )
})

test('El reducer rechaza altas incompletas o incoherentes', () => {
  const estado = cargar()
  const producto = crearArticulo(campos, 'nuevo-1')
  for (const invalido of [
    null,
    {},
    { ...producto, marca: null },
    { ...producto, disponible: false },
    { ...producto, tipo: 'Otro' },
    { ...producto, stock: -1 },
    { ...producto, precio: '1290' },
  ]) {
    assert.equal(agregar(estado, invalido), estado)
  }
})

test('Una respuesta de carga tardía o repetida no sobrescribe las altas', () => {
  const estado = agregar(cargar(), crearArticulo(campos, 'nuevo-1'))
  assert.equal(
    productosReducer(estado, {
      type: 'CARGA_COMPLETADA',
      productos: normalizarProductos(semilla),
    }),
    estado,
  )
  assert.equal(productosReducer(estado, { type: 'CARGA_FALLIDA' }), estado)
})

test('Las acciones desconocidas y cargas con datos inválidos no alteran el estado', () => {
  assert.equal(
    productosReducer(estadoInicialProductos, { type: 'OTRA' }),
    estadoInicialProductos,
  )
  assert.equal(
    productosReducer(estadoInicialProductos, {
      type: 'CARGA_COMPLETADA',
      productos: semilla,
    }),
    estadoInicialProductos,
  )
})
