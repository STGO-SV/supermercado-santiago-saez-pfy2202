import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { crearCargaJSON } from '../src/utils/cargaJSON.js'
import { tituloPagina } from '../src/utils/titulos.js'
import { normalizarProductos } from '../src/utils/productos.js'
import { validarSucursales } from '../src/utils/validarDatos.js'
import {
  estadoInicialProductos,
  productosReducer,
} from '../src/reducers/productosReducer.js'

for (const [ruta, titulo] of [
  ['/', 'Inicio'],
  ['/nuestras-tiendas', 'Nuestras tiendas'],
  ['/contactanos', 'Contáctanos'],
  ['/ingreso-articulos', 'Ingreso de artículos'],
  ['/inventario', 'Inventario'],
  ['/no-existe', 'Página no encontrada (404)'],
]) {
  test(`Título de ${ruta}`, () =>
    assert.equal(tituloPagina(ruta), `${titulo} | Despensa Verde`))
}
test('Los títulos siguen la coincidencia de Router en barras finales, mayúsculas y 404 anidada', () => {
  assert.equal(tituloPagina('/INVENTARIO/'), 'Inventario | Despensa Verde')
  assert.equal(
    tituloPagina('/contactanos/no-existe'),
    'Página no encontrada (404) | Despensa Verde',
  )
})

const diferida = () => {
  let resolver
  let rechazar
  const promesa = new Promise((resolve, reject) => {
    resolver = resolve
    rechazar = reject
  })
  return { promesa, resolver, rechazar }
}
const leer = (nombre) =>
  JSON.parse(
    readFileSync(
      new URL(`../public/data/${nombre}.json`, import.meta.url),
      'utf8',
    ),
  )
for (const nombre of ['productos', 'sucursales']) {
  const datos = leer(nombre)
  const transformar =
    nombre === 'productos'
      ? normalizarProductos
      : (valor) => {
          if (!validarSucursales(valor)) throw new Error('Datos inválidos')
          return valor
        }
  function preparar() {
    const solicitudes = []
    const eventos = []
    const operacion = crearCargaJSON({
      url: `/data/${nombre}.json`,
      transformar,
      alIniciar: () => eventos.push('cargando'),
      alCompletar: (valor) => eventos.push(valor),
      alFallar: () => eventos.push('error'),
      solicitar: (url, opciones) => {
        const respuesta = diferida()
        solicitudes.push({ ...respuesta, url, opciones })
        return respuesta.promesa
      },
    })
    return { operacion, solicitudes, eventos }
  }
  test(`${nombre}: fallo, segundo fallo y recuperación sin solicitudes simultáneas ni duplicaciones`, async () => {
    const { operacion, solicitudes, eventos } = preparar()
    const inicial = operacion.cargar()
    await operacion.cargar()
    assert.equal(solicitudes.length, 1)
    assert.deepEqual(eventos, ['cargando'])
    solicitudes[0].rechazar(new Error('Red'))
    await inicial
    assert.deepEqual(eventos, ['cargando', 'error'])
    const segundo = operacion.cargar()
    await operacion.cargar()
    assert.equal(solicitudes.length, 2)
    solicitudes[1].resolver({ ok: false })
    await segundo
    assert.deepEqual(eventos, ['cargando', 'error', 'cargando', 'error'])
    const tercero = operacion.cargar()
    solicitudes[2].resolver({ ok: true, json: async () => datos })
    await tercero
    assert.deepEqual(eventos.at(-1), transformar(datos))
    await operacion.cargar()
    assert.equal(solicitudes.length, 3)
    assert.equal(eventos.at(-1).length, datos.length)
    assert.equal(
      new Set(eventos.at(-1).map((item) => item.id)).size,
      datos.length,
    )
  })
  test(`${nombre}: reintento satisfactorio después de JSON mal formado o datos inválidos`, async () => {
    for (const json of [
      async () => {
        throw new SyntaxError('JSON')
      },
      async () => [datos[0], datos[0]],
    ]) {
      const { operacion, solicitudes, eventos } = preparar()
      const inicial = operacion.cargar()
      solicitudes[0].resolver({ ok: true, json })
      await inicial
      assert.equal(eventos.at(-1), 'error')
      const reintento = operacion.cargar()
      solicitudes[1].resolver({ ok: true, json: async () => datos })
      await reintento
      assert.deepEqual(eventos.at(-1), transformar(datos))
    }
  })
  test(`${nombre}: cancelación descarta éxito y error tardíos incluso si la solicitud ignora AbortSignal`, async () => {
    for (const falla of [false, true]) {
      const { operacion, solicitudes, eventos } = preparar()
      const inicial = operacion.cargar()
      operacion.cancelar()
      assert.equal(solicitudes[0].opciones.signal.aborted, true)
      if (falla) solicitudes[0].rechazar(new Error('Tardío'))
      else solicitudes[0].resolver({ ok: true, json: async () => datos })
      await inicial
      await operacion.cargar()
      assert.deepEqual(eventos, ['cargando'])
      assert.equal(solicitudes.length, 1)
    }
  })
  test(`${nombre}: lista vacía válida y cabecera JSON`, async () => {
    const { operacion, solicitudes, eventos } = preparar()
    const inicial = operacion.cargar()
    assert.equal(solicitudes[0].url, `/data/${nombre}.json`)
    assert.deepEqual(solicitudes[0].opciones.headers, {
      Accept: 'application/json',
    })
    solicitudes[0].resolver({ ok: true, json: async () => [] })
    await inicial
    assert.deepEqual(eventos, ['cargando', []])
  })
}

test('El reducer permite reintentar solo tras un fallo y reemplaza la semilla sin duplicarla', () => {
  const reducir = productosReducer
  const fallo = reducir(estadoInicialProductos, { type: 'CARGA_FALLIDA' })
  const carga = reducir(fallo, { type: 'CARGA_INICIADA' })
  assert.equal(carga.cargando, true)
  assert.equal(carga.error, '')
  assert.equal(reducir(carga, { type: 'CARGA_INICIADA' }), carga)
  const otroFallo = reducir(carga, { type: 'CARGA_FALLIDA' })
  const resultado = reducir(reducir(otroFallo, { type: 'CARGA_INICIADA' }), {
    type: 'CARGA_COMPLETADA',
    productos: normalizarProductos(leer('productos')),
  })
  assert.equal(resultado.productos.length, 12)
  assert.equal(resultado.cargando, false)
  assert.equal(resultado.error, '')
  assert.equal(reducir(resultado, { type: 'CARGA_INICIADA' }), resultado)
})
