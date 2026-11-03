import test, { before, after } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router'
import { createServer } from 'vite'
import react from '@vitejs/plugin-react'
import { calcularImportesCarrito } from '../src/utils/importesCarrito.js'
import { formatoPrecio } from '../src/utils/formatoPrecio.js'
import { tituloPagina } from '../src/utils/titulos.js'
import { normalizarProductos } from '../src/utils/productos.js'
import { obtenerArticulosCarrito } from '../src/utils/carrito.js'
import {
  estadoInicialProductos,
  productosReducer,
} from '../src/reducers/productosReducer.js'

const semilla = normalizarProductos(
  JSON.parse(
    readFileSync(
      new URL('../public/data/productos.json', import.meta.url),
      'utf8',
    ),
  ),
)
const cargar = () =>
  productosReducer(estadoInicialProductos, {
    type: 'CARGA_COMPLETADA',
    productos: semilla,
  })
const mover = (estado, type, productoId, cantidad = 1) =>
  productosReducer(estado, { type, productoId, cantidad })
const importes = (estado) =>
  calcularImportesCarrito(
    obtenerArticulosCarrito(estado.productos, estado.carrito),
  )

test('El carrito vacío tiene total exacto cero', () => {
  assert.deepEqual(calcularImportesCarrito([]), { lineas: [], total: 0n })
})

test('Subtotales y total se derivan de dos artículos sin mutar líneas ni productos', () => {
  const estado = mover(
    mover(cargar(), 'AGREGAR_AL_CARRITO', 'p01', 2),
    'AGREGAR_AL_CARRITO',
    'p02',
    3,
  )
  const articulos = obtenerArticulosCarrito(estado.productos, estado.carrito)
  const copia = structuredClone(articulos)
  articulos.forEach(Object.freeze)
  Object.freeze(articulos)
  const resultado = calcularImportesCarrito(articulos)
  assert.deepEqual(
    resultado.lineas.map((linea) => linea.subtotal),
    [2980n, 2970n],
  )
  assert.equal(resultado.total, 5950n)
  assert.equal(resultado.lineas[0].producto, estado.productos[0])
  assert.deepEqual(articulos, copia)
  assert.equal('subtotal' in estado.carrito[0], false)
})

test('Incremento, devolución y eliminación actualizan los importes derivados', () => {
  let estado = mover(cargar(), 'AGREGAR_AL_CARRITO', 'p01')
  estado = mover(estado, 'INCREMENTAR_CARRITO', 'p01')
  assert.equal(importes(estado).total, 2980n)
  assert.equal(estado.productos[0].stock, 40)
  estado = mover(estado, 'DISMINUIR_CARRITO', 'p01')
  assert.equal(importes(estado).total, 1490n)
  estado = mover(estado, 'DISMINUIR_CARRITO', 'p01')
  assert.equal(importes(estado).total, 0n)
  assert.equal(estado.productos[0].stock, 42)
})

test('Los importes permanecen exactos por encima del límite seguro de Number', () => {
  const maximo = Number.MAX_SAFE_INTEGER
  const resultado = calcularImportesCarrito([
    { producto: { precio: maximo }, cantidad: maximo },
    { producto: { precio: 1 }, cantidad: 1 },
  ])
  assert.equal(resultado.total, BigInt(maximo) * BigInt(maximo) + 1n)
  assert.equal(
    formatoPrecio(resultado.total),
    resultado.total.toLocaleString('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }),
  )
  assert.ok(!formatoPrecio(resultado.total).includes('e+'))
})

test('Precio cero y reservas rechazadas conservan un total coherente', () => {
  const producto = { ...semilla[0], precio: 0, stock: 1 }
  let estado = productosReducer(estadoInicialProductos, {
    type: 'CARGA_COMPLETADA',
    productos: [producto],
  })
  estado = mover(estado, 'AGREGAR_AL_CARRITO', 'p01')
  assert.equal(importes(estado).total, 0n)
  const rechazado = mover(estado, 'INCREMENTAR_CARRITO', 'p01')
  assert.equal(rechazado.avisoCarrito.tipo, 'error')
  assert.deepEqual(importes(rechazado), importes(estado))
})

test('Título del carrito respeta barras finales y mantiene la 404 de subrutas desconocidas', () => {
  for (const ruta of ['/carrito', '/CARRITO/'])
    assert.equal(tituloPagina(ruta), 'Carrito | Despensa Verde')
  assert.equal(
    tituloPagina('/carrito/no-existe'),
    'Página no encontrada (404) | Despensa Verde',
  )
})

let servidor
let Carrito
let ProductosContext
let MenuInventario
before(async () => {
  servidor = await createServer({
    configFile: false,
    plugins: [react()],
    logLevel: 'silent',
    server: { middlewareMode: true, hmr: false, watch: null },
  })
  Carrito = (await servidor.ssrLoadModule('/src/pages/Carrito.jsx')).default
  ProductosContext = (
    await servidor.ssrLoadModule('/src/context/ProductosContext.js')
  ).ProductosContext
  MenuInventario = (
    await servidor.ssrLoadModule('/src/components/MenuInventario.jsx')
  ).default
})
after(async () => {
  await servidor?.close()
})
function representar(estado) {
  const valor = {
    ...estado,
    articulosCarrito: obtenerArticulosCarrito(estado.productos, estado.carrito),
    incrementarCantidad() {},
    disminuirCantidad() {},
    reintentar() {},
  }
  return renderToStaticMarkup(
    createElement(
      MemoryRouter,
      { initialEntries: ['/carrito'] },
      createElement(
        ProductosContext.Provider,
        { value: valor },
        createElement(Carrito),
      ),
    ),
  )
}

test('La página presenta vacío, total cero y acceso al catálogo', () => {
  const html = representar(cargar())
  assert.ok(html.includes('El carrito está vacío'))
  assert.ok(html.includes('Total del carrito: $0 CLP'))
  assert.match(html, /<a[^>]*href="\/"[^>]*>Seguir comprando<\/a>/)
  assert.ok(html.includes('Selecciona artículos desde el catálogo de Inicio'))
  assert.ok(!html.includes('href="/inventario"'))
  assert.ok(!html.includes('aria-label="Aumentar cantidad'))
})

test('La página consume el contexto y muestra ambas líneas, enlaces, cantidades y total', () => {
  const estado = mover(
    mover(cargar(), 'AGREGAR_AL_CARRITO', 'p01', 2),
    'AGREGAR_AL_CARRITO',
    'p02',
  )
  const html = representar(estado)
  assert.match(html, /<a[^>]*href="\/"[^>]*>Seguir comprando<\/a>/)
  assert.ok(!html.includes('Volver al inventario'))
  assert.ok(html.includes('href="/articulos/p01"'))
  assert.ok(html.includes('href="/articulos/p02"'))
  assert.ok(html.includes('Precio unitario: $1.490 CLP'))
  assert.ok(html.includes('Subtotal: <strong>$2.980 CLP</strong>'))
  assert.ok(html.includes('Total del carrito: $3.970 CLP'))
  assert.ok(html.includes('Cantidad</p>'))
  assert.ok(html.includes('<strong>2</strong>'))
  assert.ok(html.includes('Existencias adicionales disponibles: 40.'))
  assert.ok(
    html.includes('aria-label="Disminuir cantidad de Arroz grano largo 1 kg"'),
  )
})

test('El incremento queda deshabilitado al agotar stock y el decremento sigue disponible', () => {
  const html = representar(mover(cargar(), 'AGREGAR_AL_CARRITO', 'p01', 42))
  const botones = [...html.matchAll(/<button\b([^>]*)>/g)].map(
    (coincidencia) => coincidencia[1],
  )
  const aumentar = botones.find((atributos) =>
    atributos.includes('Aumentar cantidad de Arroz'),
  )
  const disminuir = botones.find((atributos) =>
    atributos.includes('Disminuir cantidad de Arroz'),
  )
  assert.match(aumentar, /disabled=""/)
  assert.doesNotMatch(disminuir, /disabled=""/)
  assert.ok(html.includes('Sin existencias para aumentar la cantidad.'))
})

test('La página prioriza carga o error frente al estado vacío y expone el reintento', () => {
  const cargando = representar(estadoInicialProductos)
  assert.ok(cargando.includes('Cargando productos…'))
  assert.ok(!cargando.includes('El carrito está vacío'))
  const fallo = representar(
    productosReducer(estadoInicialProductos, { type: 'CARGA_FALLIDA' }),
  )
  assert.ok(fallo.includes('role="alert"'))
  assert.ok(fallo.includes('Reintentar'))
  assert.ok(!fallo.includes('Total del carrito:'))
})

test('Una operación rechazada muestra su alerta y mantiene los importes del estado compartido', () => {
  let estado = mover(cargar(), 'AGREGAR_AL_CARRITO', 'p01', 42)
  estado = mover(estado, 'INCREMENTAR_CARRITO', 'p01')
  const html = representar(estado)
  assert.ok(html.includes('role="alert"'))
  assert.ok(html.includes('No hay suficientes unidades disponibles'))
  assert.ok(html.includes('Total del carrito: $62.580 CLP'))
})

test('El menú secundario incluye Carrito y señala su ruta activa', () => {
  const html = renderToStaticMarkup(
    createElement(
      MemoryRouter,
      { initialEntries: ['/carrito'] },
      createElement(MenuInventario),
    ),
  )
  assert.ok(html.includes('href="/carrito"'))
  assert.match(html, /<a[^>]*aria-current="page"[^>]*href="\/carrito"/)
  assert.ok(html.includes('Ingresar artículos'))
  assert.ok(html.includes('Ver inventario'))
})
