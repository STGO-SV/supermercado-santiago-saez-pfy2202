import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { textoValido, textoProductoValido } from '../src/utils/texto.js'
import { validarArticulo } from '../src/utils/validarArticulo.js'
import {
  validarProductos,
  validarSucursales,
} from '../src/utils/validarDatos.js'
import {
  crearArticulo,
  normalizarProductos,
  validarProductosEstado,
} from '../src/utils/productos.js'
import { crearCargaJSON } from '../src/utils/cargaJSON.js'
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
const sucursales = JSON.parse(
  readFileSync(
    new URL('../public/data/sucursales.json', import.meta.url),
    'utf8',
  ),
)
const campos = {
  nombre: 'Arroz grano largo 1 kg',
  marca: 'Campo Claro',
  tipo: 'Abarrotes',
  precio: '1490',
  stock: '2',
}
const validos = [
  'Arroz grano largo 1 kg',
  'Agua sin gas 1,5 L',
  'Ñandú & Cía.',
  '3M',
  '4711',
  'Bebida 0% (sin azúcar)',
  'A/B + C',
  'Café™',
  'Producto #1',
  'Cafe\u0301',
  '  Té  ',
]
const invalidos = [
  '',
  '   ',
  '---',
  '\u0301',
  '@@@',
  '😀',
  'A\nB',
  'A\tB',
  '\nTé',
  'Té\t',
  'A\u200BB',
  'A\u202EB',
  '<etiqueta>',
  '\u2028Té',
  'Té\u2029',
]
const otrosTipos = [null, undefined, 0, 1, false, true, {}, [], Object('Té')]

test('Presencia textual conserva su contrato genérico sin imponer formato comercial', () => {
  for (const valor of [
    ...validos,
    ...invalidos,
    ...otrosTipos,
    '\u00a0',
    '\t',
  ]) {
    const esperado = typeof valor === 'string' && valor.trim().length > 0
    assert.equal(textoValido(valor), esperado)
  }
  assert.equal(textoValido('@@@'), true)
  assert.equal(textoValido('A\nB'), true)
})

test('Formato comercial admite Unicode, símbolos aprobados y marcas numéricas sin estado entre llamadas', () => {
  for (let vuelta = 0; vuelta < 3; vuelta++) {
    for (const valor of validos)
      assert.equal(textoProductoValido(valor), true, valor)
    assert.equal(textoProductoValido(''), false)
  }
  assert.equal(textoProductoValido('Té\u00a0natural'), true)
  assert.equal(textoProductoValido('X'.repeat(10000)), true)
})

test('Formato comercial rechaza controles incluso en extremos, invisibles y contenido no significativo', () => {
  for (const valor of [...invalidos, ...otrosTipos]) {
    assert.equal(textoProductoValido(valor), false, String(valor))
  }
})

test('La política acepta los 36 textos de la semilla y conserva sus cinco marcas demostrativas', () => {
  const antes = structuredClone(semilla)
  for (const producto of semilla) {
    for (const campo of ['nombre', 'marca', 'categoria']) {
      assert.equal(textoProductoValido(producto[campo]), true)
    }
  }
  const productos = normalizarProductos(semilla)
  assert.equal(productos.length, 12)
  assert.equal(new Set(productos.map((producto) => producto.marca)).size, 5)
  assert.deepEqual(normalizarProductos(productos), productos)
  assert.deepEqual(semilla, antes)
})

for (const campo of ['nombre', 'marca', 'tipo']) {
  test(`Altas válidas para ${campo}: formato evaluado sin convertir el Unicode almacenado`, () => {
    for (const valor of validos) {
      const entrada = { ...campos, [campo]: valor }
      const copia = { ...entrada }
      assert.deepEqual(validarArticulo(entrada), {})
      const producto = crearArticulo(entrada, 'unicode-1')
      assert.equal(producto[campo], valor.trim())
      assert.equal(producto.tipo, producto.categoria)
      assert.equal(producto.stock, 2)
      assert.equal(producto.precio, 1490)
      assert.equal(producto.disponible, true)
      assert.equal(validarProductosEstado([producto]), true)
      assert.deepEqual(normalizarProductos([producto]), [producto])
      assert.deepEqual(entrada, copia)
    }
  })

  test(`Altas inválidas para ${campo}: ausencia y formato tienen mensajes distintos`, () => {
    const mensajeAusente = validarArticulo({ ...campos, [campo]: '' })[campo]
    for (const valor of [...invalidos, ...otrosTipos]) {
      const entrada = { ...campos, [campo]: valor }
      const errores = validarArticulo(entrada)
      assert.deepEqual(Object.keys(errores), [campo])
      if (textoValido(valor)) {
        assert.notEqual(errores[campo], mensajeAusente)
        assert.match(errores[campo], /^Formato de /)
      } else assert.equal(errores[campo], mensajeAusente)
      assert.throws(() => crearArticulo(entrada, 'rechazado'))
    }
  })
}

test('Modelo y normalización rechazan textos comerciales inválidos sin mutar registros', () => {
  const producto = normalizarProductos(semilla)[0]
  for (const campo of ['nombre', 'marca', 'categoria']) {
    for (const valor of invalidos) {
      const invalido = { ...producto, [campo]: valor }
      if (campo === 'categoria') invalido.tipo = valor
      const copia = { ...invalido }
      assert.equal(validarProductosEstado([invalido]), false)
      assert.throws(() => normalizarProductos([invalido]))
      assert.deepEqual(invalido, copia)
      if (campo !== 'marca') assert.equal(validarProductos([invalido]), false)
    }
  }
  assert.equal(
    validarProductosEstado([{ ...producto, tipo: 'Otra categoría' }]),
    false,
  )
})

test('Históricos sin marca o con null conservan idempotencia y secuencias Unicode originales', () => {
  const sinMarca = { ...semilla[0], nombre: 'Cafe\u0301' }
  delete sinMarca.marca
  for (const historico of [sinMarca, { ...sinMarca, marca: null }]) {
    const copia = structuredClone(historico)
    const resultado = normalizarProductos([historico])
    assert.equal(resultado[0].marca, null)
    assert.equal(resultado[0].nombre, 'Cafe\u0301')
    assert.notEqual(resultado[0].nombre, resultado[0].nombre.normalize('NFC'))
    assert.deepEqual(normalizarProductos(resultado), resultado)
    assert.deepEqual(historico, copia)
  }
})

test('IDs y sucursales mantienen presencia genérica, incluidos textos fuera de la política comercial', () => {
  const id = 'id@@@\n'
  assert.equal(validarProductos([{ ...semilla[0], id }]), true)
  assert.equal(crearArticulo(campos, ' id@@@ ').id, 'id@@@')
  for (const campo of ['id', 'nombre', 'comuna', 'direccion', 'horario']) {
    assert.equal(
      validarSucursales([{ ...sucursales[0], [campo]: '@@@\n' }]),
      true,
    )
    for (const valor of ['', ' ', null, 1]) {
      assert.equal(
        validarSucursales([{ ...sucursales[0], [campo]: valor }]),
        false,
      )
    }
  }
  assert.equal(validarSucursales(sucursales), true)
})

test('Una carga con texto comercial inválido falla y se recupera una vez sin duplicaciones', async () => {
  for (const campo of ['nombre', 'marca', 'categoria']) {
    let estado = estadoInicialProductos
    let solicitudes = 0
    const respuestas = [[{ ...semilla[0], [campo]: '@@@' }], semilla]
    const carga = crearCargaJSON({
      url: '/data/productos.json',
      transformar: normalizarProductos,
      alIniciar: () => {
        estado = productosReducer(estado, { type: 'CARGA_INICIADA' })
      },
      alCompletar: (productos) => {
        estado = productosReducer(estado, {
          type: 'CARGA_COMPLETADA',
          productos,
        })
      },
      alFallar: () => {
        estado = productosReducer(estado, { type: 'CARGA_FALLIDA' })
      },
      solicitar: async () => ({
        ok: true,
        json: async () => respuestas[solicitudes++],
      }),
    })
    await carga.cargar()
    assert.ok(estado.error)
    assert.deepEqual(estado.productos, [])
    assert.deepEqual(estado.carrito, [])
    await carga.cargar()
    assert.equal(estado.error, '')
    assert.equal(estado.cargando, false)
    assert.equal(estado.productos.length, 12)
    assert.equal(
      new Set(estado.productos.map((producto) => producto.id)).size,
      12,
    )
    await carga.cargar()
    assert.equal(solicitudes, 2)
    carga.cancelar()
  }
})

test('Un alta Unicode conserva precio, categoría y unidades durante los movimientos de carrito', () => {
  const producto = crearArticulo(
    { ...campos, nombre: ' Cafe\u0301 ', marca: '4711', tipo: 'Ñandú & Cía.' },
    'unicode-carrito',
  )
  const inicial = productosReducer(estadoInicialProductos, {
    type: 'CARGA_COMPLETADA',
    productos: [producto],
  })
  const reserva = productosReducer(inicial, {
    type: 'AGREGAR_AL_CARRITO',
    productoId: producto.id,
    cantidad: 2,
  })
  assert.equal(reserva.productos[0].stock, 0)
  assert.equal(reserva.productos[0].disponible, false)
  assert.equal(reserva.productos[0].nombre, 'Cafe\u0301')
  assert.equal(reserva.productos[0].marca, '4711')
  assert.equal(reserva.productos[0].categoria, producto.categoria)
  assert.equal(reserva.productos[0].precio, 1490)
  const devuelto = productosReducer(reserva, {
    type: 'DISMINUIR_CARRITO',
    productoId: producto.id,
    cantidad: 2,
  })
  assert.deepEqual(devuelto.productos, inicial.productos)
  assert.deepEqual(devuelto.carrito, [])
  assert.equal(inicial.productos[0].stock, 2)
})
