import test, { before, after } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter, Routes, Route } from 'react-router'
import { createServer } from 'vite'
import react from '@vitejs/plugin-react'
import {
  crearArticulo,
  normalizarProductos,
  validarProductosEstado,
} from '../src/utils/productos.js'
import { validarArticulo } from '../src/utils/validarArticulo.js'
import {
  obtenerCategorias,
  filtrarInventario,
} from '../src/utils/inventario.js'
import { obtenerArticulosCarrito } from '../src/utils/carrito.js'
import {
  estadoInicialProductos,
  productosReducer,
} from '../src/reducers/productosReducer.js'

const datos = JSON.parse(
  readFileSync(
    new URL('../public/data/productos.json', import.meta.url),
    'utf8',
  ),
)
const campos = {
  nombre: 'Aceite de prueba 500 ml',
  marca: 'Marca de prueba',
  tipo: 'Despensa especial',
  precio: '1590',
  stock: '2',
}
const cargar = () =>
  productosReducer(estadoInicialProductos, {
    type: 'CARGA_COMPLETADA',
    productos: normalizarProductos(datos),
  })
let servidor,
  FormularioArticulo,
  TablaInventario,
  DetalleArticulo,
  Home,
  ProductosContext
before(async () => {
  servidor = await createServer({
    configFile: false,
    plugins: [react()],
    logLevel: 'silent',
    server: { middlewareMode: true, hmr: false, watch: null },
  })
  FormularioArticulo = (
    await servidor.ssrLoadModule('/src/components/FormularioArticulo.jsx')
  ).default
  TablaInventario = (
    await servidor.ssrLoadModule('/src/components/TablaInventario.jsx')
  ).default
  DetalleArticulo = (
    await servidor.ssrLoadModule('/src/pages/DetalleArticulo.jsx')
  ).default
  Home = (await servidor.ssrLoadModule('/src/pages/Home.jsx')).default
  ProductosContext = (
    await servidor.ssrLoadModule('/src/context/ProductosContext.js')
  ).ProductosContext
})
after(async () => {
  await servidor?.close()
})
function representar(
  componente,
  estado = cargar(),
  props = {},
  ruta = '/',
  patron = '*',
) {
  const valor = {
    ...estado,
    articulosCarrito: obtenerArticulosCarrito(estado.productos, estado.carrito),
    agregarArticulo() {},
    agregarAlCarrito() {},
    disminuirCantidad() {},
    reintentar() {},
  }
  return renderToStaticMarkup(
    createElement(
      MemoryRouter,
      { initialEntries: [ruta] },
      createElement(
        ProductosContext.Provider,
        { value: valor },
        createElement(
          Routes,
          null,
          createElement(Route, {
            path: patron,
            element: createElement(componente, props),
          }),
        ),
      ),
    ),
  )
}

test('El formulario solicita categoría y unidades con cinco campos sin selector de unidad de venta', () => {
  const html = representar(FormularioArticulo)
  for (const etiqueta of [
    'Nombre del artículo',
    'Marca',
    'Categoría',
    'Precio por unidad en CLP',
    'Cantidad disponible en unidades',
  ])
    assert.ok(html.includes(`${etiqueta} (obligatorio)`))
  assert.ok(!html.includes('Tipo o categoría'))
  assert.ok(html.includes('Los artículos se comercializan por unidades.'))
  assert.equal([...html.matchAll(/<input\b/g)].length, 5)
  assert.ok(!html.includes('<select'))
  assert.match(html, /<input[^>]*name="tipo"/)
  const stock = [...html.matchAll(/<input\b([^>]*)>/g)]
    .map((item) => item[1])
    .find((atributos) => atributos.includes('name="stock"'))
  assert.match(stock, /min="0"/)
  assert.match(stock, /step="1"/)
})

test('Los mensajes de validación identifican categoría, precio por unidad y cantidades en unidades', () => {
  const errores = validarArticulo({})
  assert.equal(errores.tipo, 'Ingresa la categoría del artículo.')
  assert.ok(errores.precio.startsWith('El precio por unidad en CLP'))
  assert.ok(errores.stock.startsWith('La cantidad disponible en unidades'))
  assert.deepEqual(validarArticulo(campos), {})
})

test('La creación conserva categoria como clasificación y tipo como alias existente sin migrar el contrato', () => {
  const producto = crearArticulo(campos, 'prueba-unidades')
  assert.equal(producto.categoria, 'Despensa especial')
  assert.equal(producto.tipo, producto.categoria)
  assert.equal(producto.stock, 2)
  assert.equal(producto.precio, 1590)
  assert.equal(validarProductosEstado([producto]), true)
  assert.deepEqual(
    Object.keys(producto).sort(),
    [
      'id',
      'nombre',
      'marca',
      'tipo',
      'categoria',
      'precio',
      'stock',
      'disponible',
    ].sort(),
  )
})

test('La normalización conserva las doce presentaciones históricas, precios y existencias', () => {
  const copia = structuredClone(datos)
  const productos = normalizarProductos(datos)
  assert.deepEqual(datos, copia)
  assert.equal(productos.length, 12)
  assert.ok(datos.some((producto) => producto.nombre.includes('kg')))
  assert.ok(datos.some((producto) => producto.nombre.includes('ml')))
  for (let i = 0; i < datos.length; i++) {
    for (const campo of Object.keys(datos[i]))
      assert.equal(productos[i][campo], datos[i][campo])
    assert.equal(productos[i].tipo, datos[i].categoria)
  }
})

test('Inventario y detalle muestran categoría, marca y precio por unidad con fallback histórico', () => {
  const producto = crearArticulo(campos, 'prueba-unidades')
  const estado = productosReducer(cargar(), {
    type: 'AGREGAR_ARTICULO',
    producto,
  })
  const tabla = representar(TablaInventario, estado, {
    productos: estado.productos,
  })
  assert.ok(tabla.includes('Categoría</th>'))
  assert.ok(tabla.includes('Precio por unidad (CLP)</th>'))
  assert.ok(tabla.includes('Unidades disponibles</th>'))
  assert.ok(tabla.includes('<td>Despensa especial</td>'))
  for (const marca of new Set(datos.map((articulo) => articulo.marca))) {
    assert.ok(tabla.includes(`<td>${marca}</td>`))
  }
  assert.ok(!tabla.includes('Sin información'))
  const detalle = representar(
    DetalleArticulo,
    estado,
    {},
    '/articulos/prueba-unidades',
    '/articulos/:id',
  )
  assert.ok(detalle.includes('<dt>Categoría</dt><dd>Despensa especial</dd>'))
  assert.ok(detalle.includes('<dt>Precio por unidad (CLP)</dt>'))
  assert.ok(detalle.includes('<dt>Unidades disponibles</dt>'))
  assert.ok(detalle.includes('<dt>Marca</dt><dd>Marca de prueba</dd>'))
  assert.ok(!tabla.includes('Tipo / categoría'))
  assert.ok(!detalle.includes('Tipo / categoría'))
  for (const articulo of estado.productos.slice(0, 12)) {
    const vista = representar(
      DetalleArticulo,
      estado,
      {},
      `/articulos/${articulo.id}`,
      '/articulos/:id',
    )
    assert.ok(vista.includes(`<dt>Marca</dt><dd>${articulo.marca}</dd>`))
  }
  const sinMarca = { ...datos[0] }
  delete sinMarca.marca
  const historicos = normalizarProductos([
    sinMarca,
    { ...datos[1], marca: null },
  ])
  const estadoHistorico = { ...estado, productos: historicos, carrito: [] }
  const tablaHistorica = representar(TablaInventario, estadoHistorico, {
    productos: historicos,
  })
  assert.equal(tablaHistorica.split('<td>Sin información</td>').length - 1, 2)
  for (const articulo of historicos) {
    const vista = representar(
      DetalleArticulo,
      estadoHistorico,
      {},
      `/articulos/${articulo.id}`,
      '/articulos/:id',
    )
    assert.ok(vista.includes('<dt>Marca</dt><dd>Sin información</dd>'))
  }
})

test('El alta añade una categoría a ambos filtros y aparece en el catálogo con precio por unidad', () => {
  const producto = crearArticulo(campos, 'prueba-unidades')
  const estado = productosReducer(cargar(), {
    type: 'AGREGAR_ARTICULO',
    producto,
  })
  assert.ok(obtenerCategorias(estado.productos).includes('Despensa especial'))
  assert.deepEqual(filtrarInventario(estado.productos, 'Despensa especial'), [
    producto,
  ])
  const html = representar(Home, estado)
  assert.ok(html.includes('Despensa especial'))
  assert.ok(html.includes('CLP por unidad'))
  assert.ok(html.includes('Aumentar cantidad de Aceite de prueba 500 ml'))
  const reserva = productosReducer(estado, {
    type: 'AGREGAR_AL_CARRITO',
    productoId: producto.id,
    cantidad: 1,
  })
  assert.ok(
    representar(Home, reserva).includes('Stock: <strong>1 unidad</strong>'),
  )
})

test('Los nombres con peso o volumen no cambian el descuento y devolución de unidades', () => {
  for (const id of ['p01', 'p11']) {
    const inicial = cargar()
    const antes = inicial.productos.find((producto) => producto.id === id)
    const reserva = productosReducer(inicial, {
      type: 'AGREGAR_AL_CARRITO',
      productoId: id,
      cantidad: 1,
    })
    const actual = reserva.productos.find((producto) => producto.id === id)
    assert.equal(actual.stock, antes.stock - 1)
    assert.equal(actual.nombre, antes.nombre)
    assert.equal(actual.categoria, antes.categoria)
    const devuelto = productosReducer(reserva, {
      type: 'DISMINUIR_CARRITO',
      productoId: id,
      cantidad: 1,
    })
    assert.deepEqual(devuelto.productos, inicial.productos)
    assert.deepEqual(devuelto.carrito, [])
  }
})

test('Se siguen rechazando existencias negativas y fraccionarias sin convertir pesos ni presentaciones', () => {
  for (const stock of ['-1', '1.5', '0.5', '1,5', '1e3', '1 kg']) {
    assert.ok(validarArticulo({ ...campos, stock }).stock)
    assert.throws(() => crearArticulo({ ...campos, stock }, 'invalido'))
  }
  assert.deepEqual(validarArticulo({ ...campos, stock: '0' }), {})
  assert.equal(
    crearArticulo({ ...campos, stock: '0' }, 'cero').disponible,
    false,
  )
})
