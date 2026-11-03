import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import {
  estadoInicialProductos,
  productosReducer,
} from '../src/reducers/productosReducer.js'
import {
  normalizarProductos,
  crearArticulo,
  validarProductosEstado,
} from '../src/utils/productos.js'
import {
  obtenerCategorias,
  filtrarInventario,
  seleccionarArticulo,
} from '../src/utils/inventario.js'
import { obtenerArticulosCarrito } from '../src/utils/carrito.js'
import { crearCargaJSON } from '../src/utils/cargaJSON.js'
import { tituloPagina } from '../src/utils/titulos.js'

const semilla = JSON.parse(
  readFileSync(
    new URL('../public/data/productos.json', import.meta.url),
    'utf8',
  ),
)
const cargar = (productos = normalizarProductos(semilla)) =>
  productosReducer(estadoInicialProductos, {
    type: 'CARGA_COMPLETADA',
    productos,
  })
const mover = (estado, type, productoId = 'p01', cantidad = 1) =>
  productosReducer(estado, { type, productoId, cantidad })
const agregar = (estado, id = 'p01', cantidad = 1) =>
  mover(estado, 'AGREGAR_AL_CARRITO', id, cantidad)
const disminuir = (estado, id = 'p01', cantidad = 1) =>
  mover(estado, 'DISMINUIR_CARRITO', id, cantidad)
const unidades = (estado, id) =>
  seleccionarArticulo(estado.productos, id).stock +
  (estado.carrito.find((linea) => linea.productoId === id)?.cantidad ?? 0)
function congelar(valor) {
  if (valor && typeof valor === 'object') {
    Object.values(valor).forEach(congelar)
    Object.freeze(valor)
  }
  return valor
}
function invariante(estado, totales) {
  assert.equal(validarProductosEstado(estado.productos), true)
  assert.equal(
    new Set(estado.carrito.map((linea) => linea.productoId)).size,
    estado.carrito.length,
  )
  for (const linea of estado.carrito) {
    assert.ok(Number.isSafeInteger(linea.cantidad) && linea.cantidad > 0)
    assert.ok(seleccionarArticulo(estado.productos, linea.productoId))
  }
  for (const [id, total] of totales) assert.equal(unidades(estado, id), total)
}

test('El filtro muestra todas las categorías y filtra sin mutar ni perder agotados', () => {
  const productos = congelar(cargar().productos)
  const copia = structuredClone(productos)
  assert.deepEqual(obtenerCategorias(productos), [
    'Abarrotes',
    'Lácteos',
    'Bebidas',
    'Limpieza',
    'Higiene',
  ])
  const filtrados = filtrarInventario(productos, 'Lácteos')
  assert.equal(filtrados.length, 3)
  assert.ok(filtrados.some((producto) => producto.stock === 0))
  assert.deepEqual(filtrarInventario(productos, ''), productos)
  assert.notEqual(filtrarInventario(productos, ''), productos)
  assert.deepEqual(filtrarInventario(productos, 'Inexistente'), [])
  assert.deepEqual(productos, copia)
  assert.equal(filtrados[0], productos[3])
})

test('La selección resuelve IDs exactos, listas vacías e identificadores desconocidos', () => {
  const productos = congelar(cargar().productos)
  assert.equal(seleccionarArticulo(productos, 'p01'), productos[0])
  for (const id of ['P01', '', 'desconocido', undefined, null, 1])
    assert.equal(seleccionarArticulo(productos, id), undefined)
  assert.equal(seleccionarArticulo([], 'p01'), undefined)
})

test('Detalle tiene título dinámico sin capturar rutas incompletas o anidadas desconocidas', () => {
  assert.equal(
    tituloPagina('/articulos/p01'),
    'Detalle de artículo | Despensa Verde',
  )
  assert.equal(
    tituloPagina('/articulos/nuevo-id/'),
    'Detalle de artículo | Despensa Verde',
  )
  for (const ruta of ['/articulos', '/articulos/p01/otro'])
    assert.equal(
      tituloPagina(ruta),
      'Página no encontrada (404) | Despensa Verde',
    )
})

test('La incorporación descuenta una unidad por defecto y crea una única línea', () => {
  const estado = cargar()
  const siguiente = productosReducer(estado, {
    type: 'AGREGAR_AL_CARRITO',
    productoId: 'p01',
  })
  assert.equal(siguiente.productos[0].stock, 41)
  assert.deepEqual(siguiente.carrito, [{ productoId: 'p01', cantidad: 1 }])
  assert.equal(siguiente.avisoCarrito.tipo, 'exito')
  assert.equal(siguiente.error, '')
  assert.equal(unidades(siguiente, 'p01'), 42)
})

test('Agregar cantidades e incrementar una línea acumula sin duplicaciones', () => {
  const estado = mover(
    agregar(cargar(), 'p01', 3),
    'INCREMENTAR_CARRITO',
    'p01',
    2,
  )
  const siguiente = agregar(estado, 'p01', 4)
  assert.deepEqual(siguiente.carrito, [{ productoId: 'p01', cantidad: 9 }])
  assert.equal(siguiente.productos[0].stock, 33)
  assert.equal(unidades(siguiente, 'p01'), 42)
})

test('El incremento exige una línea existente y ambos movimientos rechazan un ID desconocido', () => {
  const estado = cargar()
  for (const type of [
    'AGREGAR_AL_CARRITO',
    'INCREMENTAR_CARRITO',
    'DISMINUIR_CARRITO',
  ]) {
    const siguiente = mover(estado, type, 'desconocido')
    assert.equal(siguiente.productos, estado.productos)
    assert.equal(siguiente.carrito, estado.carrito)
    assert.equal(siguiente.avisoCarrito.tipo, 'error')
  }
  assert.equal(mover(estado, 'INCREMENTAR_CARRITO').avisoCarrito.tipo, 'error')
  assert.equal(disminuir(estado).avisoCarrito.tipo, 'error')
})

test('Cantidades cero, negativas, fraccionarias, inseguras o de tipo incorrecto no mueven unidades', () => {
  const estado = agregar(cargar(), 'p01', 3)
  for (const type of [
    'AGREGAR_AL_CARRITO',
    'INCREMENTAR_CARRITO',
    'DISMINUIR_CARRITO',
  ]) {
    for (const cantidad of [
      0,
      -1,
      1.2,
      NaN,
      Infinity,
      Number.MAX_SAFE_INTEGER + 1,
      '2',
      null,
      {},
      true,
    ]) {
      const siguiente = mover(estado, type, 'p01', cantidad)
      assert.equal(siguiente.productos, estado.productos)
      assert.equal(siguiente.carrito, estado.carrito)
      assert.equal(siguiente.avisoCarrito.tipo, 'error')
    }
  }
})

test('Consumir el stock exacto conserva el producto agotado y rechaza nuevas incorporaciones', () => {
  const estado = agregar(cargar(), 'p01', 42)
  assert.equal(estado.productos.length, 12)
  assert.equal(estado.productos[0].stock, 0)
  assert.equal(estado.productos[0].disponible, false)
  assert.equal(filtrarInventario(estado.productos, 'Abarrotes').length, 3)
  for (const type of ['AGREGAR_AL_CARRITO', 'INCREMENTAR_CARRITO']) {
    const siguiente = mover(estado, type)
    assert.equal(siguiente.productos, estado.productos)
    assert.equal(siguiente.carrito, estado.carrito)
    assert.equal(siguiente.avisoCarrito.tipo, 'error')
  }
})

test('Se rechaza consumir más stock que el disponible o agregar un artículo agotado de la semilla', () => {
  const estado = cargar()
  for (const [id, cantidad] of [
    ['p01', 43],
    ['p05', 1],
    ['p10', 1],
  ]) {
    const siguiente = agregar(estado, id, cantidad)
    assert.equal(siguiente.productos, estado.productos)
    assert.equal(siguiente.carrito, estado.carrito)
    assert.equal(siguiente.avisoCarrito.tipo, 'error')
  }
})

test('Disminuir devuelve unidades y reactiva la disponibilidad; llegar a cero elimina la línea', () => {
  const agotado = agregar(cargar(), 'p01', 42)
  const parcial = disminuir(agotado, 'p01', 2)
  assert.equal(parcial.productos[0].stock, 2)
  assert.equal(parcial.productos[0].disponible, true)
  assert.equal(parcial.carrito[0].cantidad, 40)
  const vacio = disminuir(parcial, 'p01', 40)
  assert.equal(vacio.productos[0].stock, 42)
  assert.deepEqual(vacio.carrito, [])
  assert.equal(unidades(vacio, 'p01'), 42)
})

test('Se rechaza devolver más unidades que las reservadas sin retornos parciales', () => {
  const estado = agregar(cargar(), 'p01', 2)
  const siguiente = disminuir(estado, 'p01', 3)
  assert.equal(siguiente.productos, estado.productos)
  assert.equal(siguiente.carrito, estado.carrito)
  assert.equal(siguiente.avisoCarrito.tipo, 'error')
})

test('Las transiciones son inmutables y conservan referencias de los registros no afectados', () => {
  const estado = congelar(agregar(cargar()))
  const copia = structuredClone(estado)
  const siguiente = agregar(estado)
  assert.deepEqual(estado, copia)
  assert.notEqual(siguiente.productos[0], estado.productos[0])
  assert.equal(siguiente.productos[1], estado.productos[1])
  assert.notEqual(siguiente.carrito[0], estado.carrito[0])
  assert.equal(siguiente.productos[0].nombre, estado.productos[0].nombre)
})

test('Las líneas derivadas consultan el producto actual y no duplican sus atributos en el carrito', () => {
  const estado = agregar(agregar(cargar(), 'p01', 3), 'p02', 2)
  const lineas = obtenerArticulosCarrito(estado.productos, estado.carrito)
  assert.equal(lineas[0].producto, estado.productos[0])
  assert.equal(lineas[0].cantidad, 3)
  assert.deepEqual(Object.keys(estado.carrito[0]), ['productoId', 'cantidad'])
  assert.deepEqual(obtenerArticulosCarrito([], []), [])
  assert.equal(disminuir(estado, 'p01', 3).carrito[0], estado.carrito[1])
})

test('Las altas aportan nuevas categorías, selección por ID y unidades al carrito', () => {
  const producto = crearArticulo(
    {
      nombre: ' Avena ',
      marca: ' Marca ',
      tipo: ' Granel ',
      precio: '1290',
      stock: '2',
    },
    'nuevo-1',
  )
  const estado = productosReducer(cargar(), {
    type: 'AGREGAR_ARTICULO',
    producto,
  })
  assert.ok(obtenerCategorias(estado.productos).includes('Granel'))
  assert.equal(filtrarInventario(estado.productos, 'Granel').length, 1)
  const siguiente = agregar(estado, 'nuevo-1', 2)
  assert.equal(seleccionarArticulo(siguiente.productos, 'nuevo-1').stock, 0)
  assert.equal(unidades(siguiente, 'nuevo-1'), 2)
  assert.equal(siguiente.productos.length, 13)
})

test('Las operaciones se bloquean durante carga y error y funcionan después del reintento', () => {
  const fallo = productosReducer(estadoInicialProductos, {
    type: 'CARGA_FALLIDA',
  })
  for (const base of [estadoInicialProductos, fallo]) {
    for (const type of [
      'AGREGAR_AL_CARRITO',
      'INCREMENTAR_CARRITO',
      'DISMINUIR_CARRITO',
    ]) {
      const siguiente = mover(base, type)
      assert.equal(siguiente.productos, base.productos)
      assert.equal(siguiente.carrito, base.carrito)
      assert.equal(siguiente.error, base.error)
      assert.equal(siguiente.cargando, base.cargando)
    }
  }
  const reintento = productosReducer(fallo, { type: 'CARGA_INICIADA' })
  const listo = productosReducer(reintento, {
    type: 'CARGA_COMPLETADA',
    productos: normalizarProductos(semilla),
  })
  assert.deepEqual(listo.carrito, [])
  assert.equal(listo.avisoCarrito, null)
  assert.equal(agregar(listo).carrito[0].cantidad, 1)
})

test('Respuestas tardías o repetidas no sobrescriben el carrito ni sus existencias', () => {
  const estado = agregar(cargar(), 'p01', 2)
  for (const accion of [
    { type: 'CARGA_COMPLETADA', productos: normalizarProductos(semilla) },
    { type: 'CARGA_FALLIDA' },
    { type: 'CARGA_INICIADA' },
  ]) {
    assert.equal(productosReducer(estado, accion), estado)
  }
  const nuevaInstancia = cargar()
  assert.deepEqual(nuevaInstancia.carrito, [])
  assert.equal(nuevaInstancia.productos[0].stock, 42)
})

test('Una secuencia de 2000 movimientos mantiene unidades, tipos, disponibilidad y líneas únicas', () => {
  let estado = cargar()
  const totales = estado.productos.map(({ id, stock }) => [id, stock])
  const acciones = [
    'AGREGAR_AL_CARRITO',
    'INCREMENTAR_CARRITO',
    'DISMINUIR_CARRITO',
  ]
  let semilla = 73
  for (let i = 0; i < 2000; i++) {
    semilla = (semilla * 1664525 + 1013904223) >>> 0
    const id = totales[semilla % totales.length][0]
    const accion = acciones[(semilla >>> 8) % acciones.length]
    const cantidad = ((semilla >>> 16) % 8) + 1
    estado = mover(congelar(estado), accion, id, cantidad)
    invariante(estado, totales)
  }
})

test('Pulsaciones consecutivas no pueden consumir una misma última unidad', () => {
  let estado = cargar([{ ...normalizarProductos(semilla)[0], stock: 1 }])
  for (let i = 0; i < 10; i++) estado = agregar(estado)
  assert.equal(estado.productos[0].stock, 0)
  assert.equal(estado.carrito[0].cantidad, 1)
})

test('El límite entero seguro permite transferir todas las unidades y devolverlas', () => {
  const estado = cargar([
    { ...normalizarProductos(semilla)[0], stock: Number.MAX_SAFE_INTEGER },
  ])
  const agotado = agregar(estado, 'p01', Number.MAX_SAFE_INTEGER)
  assert.equal(agotado.productos[0].stock, 0)
  assert.equal(agotado.carrito[0].cantidad, Number.MAX_SAFE_INTEGER)
  const vacio = disminuir(agotado, 'p01', Number.MAX_SAFE_INTEGER)
  assert.deepEqual(vacio.carrito, [])
  assert.equal(vacio.productos[0].stock, Number.MAX_SAFE_INTEGER)
})

test('La carga validada toma propiedad de los registros sin modificar la semilla recibida', () => {
  const productos = normalizarProductos(semilla)
  const estado = cargar(productos)
  assert.notEqual(estado.productos[0], productos[0])
  agregar(estado)
  assert.equal(productos[0].stock, 42)
})

test('Carga con fallo HTTP y recuperación integra la semilla antes de habilitar movimientos', async () => {
  let estado = estadoInicialProductos
  let solicitudes = 0
  const carga = crearCargaJSON({
    url: '/data/productos.json',
    transformar: normalizarProductos,
    alIniciar: () => {
      estado = productosReducer(estado, { type: 'CARGA_INICIADA' })
    },
    alCompletar: (productos) => {
      estado = productosReducer(estado, { type: 'CARGA_COMPLETADA', productos })
    },
    alFallar: () => {
      estado = productosReducer(estado, { type: 'CARGA_FALLIDA' })
    },
    solicitar: async () => ({
      ok: ++solicitudes > 1,
      json: async () => semilla,
    }),
  })
  await carga.cargar()
  assert.ok(estado.error)
  assert.deepEqual(agregar(estado).carrito, [])
  await carga.cargar()
  estado = agregar(estado)
  await carga.cargar()
  assert.equal(solicitudes, 2)
  assert.equal(estado.carrito[0].cantidad, 1)
  assert.equal(unidades(estado, 'p01'), 42)
})
