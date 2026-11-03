import test, { before, after } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router'
import { createServer } from 'vite'
import react from '@vitejs/plugin-react'
import {
  estadoInicialProductos,
  productosReducer,
} from '../src/reducers/productosReducer.js'
import { normalizarProductos, crearArticulo } from '../src/utils/productos.js'
import { obtenerArticulosCarrito } from '../src/utils/carrito.js'
import { filtrarInventario } from '../src/utils/inventario.js'

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
const mover = (estado, type, productoId = 'p01', cantidad = 1) =>
  productosReducer(estado, { type, productoId, cantidad })
let servidor, Home, TarjetaProducto, ProductosContext, ControlesCantidad
before(async () => {
  servidor = await createServer({
    configFile: false,
    plugins: [react()],
    logLevel: 'silent',
    server: { middlewareMode: true, hmr: false, watch: null },
  })
  Home = (await servidor.ssrLoadModule('/src/pages/Home.jsx')).default
  TarjetaProducto = (
    await servidor.ssrLoadModule('/src/components/TarjetaProducto.jsx')
  ).default
  ProductosContext = (
    await servidor.ssrLoadModule('/src/context/ProductosContext.js')
  ).ProductosContext
  ControlesCantidad = (
    await servidor.ssrLoadModule('/src/components/ControlesCantidad.jsx')
  ).default
})
after(async () => {
  await servidor?.close()
})
function representar(estado, producto) {
  const valor = {
    ...estado,
    articulosCarrito: obtenerArticulosCarrito(estado.productos, estado.carrito),
    agregarAlCarrito() {},
    disminuirCantidad() {},
    reintentar() {},
  }
  return renderToStaticMarkup(
    createElement(
      MemoryRouter,
      null,
      createElement(
        ProductosContext.Provider,
        { value: valor },
        producto
          ? createElement(TarjetaProducto, { producto })
          : createElement(Home),
      ),
    ),
  )
}
const control = (html, operacion, nombre) =>
  [...html.matchAll(/<button\b([^>]*)>/g)]
    .map((x) => x[1])
    .find((atributos) =>
      atributos.includes(`aria-label="${operacion} cantidad de ${nombre}"`),
    )

test('Las doce tarjetas iniciales muestran controles en orden − 0 + con doce decrementos bloqueados', () => {
  const html = representar(cargar())
  assert.equal([...html.matchAll(/<article\b/g)].length, 12)
  assert.equal([...html.matchAll(/<strong>0<\/strong>/g)].length, 12)
  for (const producto of semilla) {
    const tarjeta = representar(cargar(), producto)
    assert.match(
      tarjeta,
      />−<\/button>[\s\S]*?<strong>0<\/strong>[\s\S]*?>\+<\/button>/,
    )
    assert.match(control(tarjeta, 'Disminuir', producto.nombre), /disabled=""/)
  }
})

test('Los agotados bloquean + y mantienen la información del producto visible', () => {
  const estado = cargar()
  for (const producto of estado.productos.filter((item) => item.stock === 0)) {
    const html = representar(estado, producto)
    assert.match(control(html, 'Aumentar', producto.nombre), /disabled=""/)
    assert.ok(html.includes('Sin stock'))
    assert.ok(html.includes(producto.nombre))
    assert.ok(html.includes(producto.categoria))
  }
  assert.doesNotMatch(
    control(
      representar(estado, estado.productos[0]),
      'Aumentar',
      estado.productos[0].nombre,
    ),
    /disabled=""/,
  )
})

test('Las reservas del contexto aparecen en la tarjeta sin perder stock ni atributos', () => {
  const estado = mover(cargar(), 'AGREGAR_AL_CARRITO', 'p01', 2)
  const html = representar(estado, estado.productos[0])
  assert.ok(html.includes('<strong>2</strong>'))
  assert.ok(html.includes('Stock: <strong>40 unidades</strong>'))
  assert.ok(html.includes('$1.490'))
  assert.doesNotMatch(
    control(html, 'Disminuir', estado.productos[0].nombre),
    /disabled=""/,
  )
})

test('El decremento devuelve unidades, muestra cero y bloquea − de nuevo', () => {
  const estado = mover(
    mover(cargar(), 'AGREGAR_AL_CARRITO'),
    'DISMINUIR_CARRITO',
  )
  const html = representar(estado, estado.productos[0])
  assert.ok(html.includes('<strong>0</strong>'))
  assert.ok(html.includes('Stock: <strong>42 unidades</strong>'))
  assert.match(
    control(html, 'Disminuir', estado.productos[0].nombre),
    /disabled=""/,
  )
  assert.deepEqual(estado.carrito, [])
})

test('Volver a renderizar una tarjeta filtrada conserva las unidades del contexto', () => {
  const estado = mover(cargar(), 'AGREGAR_AL_CARRITO', 'p01', 3)
  const copia = structuredClone(estado)
  const filtrados = filtrarInventario(estado.productos, 'Abarrotes')
  assert.ok(representar(estado, filtrados[0]).includes('<strong>3</strong>'))
  assert.ok(
    representar(estado, estado.productos[0]).includes('<strong>3</strong>'),
  )
  assert.deepEqual(estado, copia)
})

test('Incrementos desde el carrito se reflejan en el contador y la disponibilidad del catálogo', () => {
  let estado = mover(cargar(), 'AGREGAR_AL_CARRITO')
  estado = mover(estado, 'INCREMENTAR_CARRITO', 'p01', 41)
  const html = representar(estado, estado.productos[0])
  assert.ok(html.includes('<strong>42</strong>'))
  assert.ok(html.includes('Sin stock'))
  assert.match(
    control(html, 'Aumentar', estado.productos[0].nombre),
    /disabled=""/,
  )
  assert.doesNotMatch(
    control(html, 'Disminuir', estado.productos[0].nombre),
    /disabled=""/,
  )
})

test('Los artículos nuevos reciben los mismos controles y admiten reserva', () => {
  const producto = crearArticulo(
    {
      nombre: 'Avena catálogo',
      marca: 'Marca',
      tipo: 'Granel',
      precio: '1290',
      stock: '1',
    },
    'nuevo-catalogo',
  )
  let estado = productosReducer(cargar(), {
    type: 'AGREGAR_ARTICULO',
    producto,
  })
  assert.ok(representar(estado, producto).includes('<strong>0</strong>'))
  estado = mover(estado, 'AGREGAR_AL_CARRITO', producto.id)
  const html = representar(estado, estado.productos.at(-1))
  assert.ok(html.includes('<strong>1</strong>'))
  assert.match(control(html, 'Aumentar', producto.nombre), /disabled=""/)
})

test('Los controles identifican producto, existencias y cantidad anunciada', () => {
  const estado = cargar()
  const html = representar(estado, estado.productos[0])
  assert.ok(
    html.includes(
      'role="group" aria-label="Cantidad de Arroz grano largo 1 kg"',
    ),
  )
  assert.ok(html.includes('aria-describedby="existencias-catalogo-p01"'))
  assert.ok(html.includes('id="existencias-catalogo-p01"'))
  assert.ok(html.includes('aria-live="polite"'))
  assert.ok(html.includes('Unidades de Arroz grano largo 1 kg en el carrito:'))
})

test('Una operación rechazada conserva contador y stock y presenta una alerta comprensible', () => {
  const estado = mover(cargar(), 'AGREGAR_AL_CARRITO', 'p01', 43)
  const html = representar(estado, estado.productos[0])
  assert.ok(html.includes('role="alert"'))
  assert.ok(html.includes('No hay suficientes unidades'))
  assert.ok(html.includes('<strong>0</strong>'))
  assert.ok(html.includes('Stock: <strong>42 unidades</strong>'))
})

test('La variante predeterminada muestra − cantidad + con etiqueta exterior', () => {
  const html = renderToStaticMarkup(
    createElement(ControlesCantidad, {
      producto: semilla[0],
      cantidad: 2,
      incrementar() {},
      disminuir() {},
    }),
  )
  assert.match(
    html,
    />−<\/button>[\s\S]*?<strong>2<\/strong>[\s\S]*?>\+<\/button>/,
  )
  assert.ok(html.includes('Cantidad</p>'))
  assert.ok(html.indexOf('Cantidad</p>') < html.indexOf('role="group"'))
})

for (const compacto of [true, false]) {
  test(`Orden DOM y límites compartidos en variante ${compacto ? 'compacta' : 'carrito'}`, () => {
    const representarControl = (cantidad, stock) =>
      renderToStaticMarkup(
        createElement(ControlesCantidad, {
          producto: { ...semilla[0], stock },
          cantidad,
          compacto,
          incrementar() {},
          disminuir() {},
        }),
      )
    const inicial = representarControl(0, 42)
    const botones = [...inicial.matchAll(/<button\b([^>]*)>([^<]*)<\/button>/g)]
    assert.deepEqual(
      botones.map((item) => item[2]),
      ['−', '+'],
    )
    assert.match(botones[0][1], /disabled=""/)
    assert.doesNotMatch(botones[1][1], /disabled=""/)
    const agotado = representarControl(42, 0)
    const botonesAgotados = [...agotado.matchAll(/<button\b([^>]*)>/g)]
    assert.doesNotMatch(botonesAgotados[0][1], /disabled=""/)
    assert.match(botonesAgotados[1][1], /disabled=""/)
    const grupo = agotado.slice(agotado.indexOf('role="group"'))
    assert.ok(!grupo.includes('Cantidad</p>'))
    assert.ok(!grupo.includes('Cantidad:'))
  })
}
