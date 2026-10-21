import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import {
  validarProductos,
  validarSucursales,
} from '../src/utils/validarDatos.js'
import { validarContacto } from '../src/utils/validarContacto.js'
import { formatoPrecio } from '../src/utils/formatoPrecio.js'
import { normalizarTexto } from '../src/utils/normalizarTexto.js'

const productos = JSON.parse(
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
const producto = productos[0]
const sucursal = sucursales[0]
const contacto = {
  nombre: 'Persona de prueba',
  email: 'prueba@example.com',
  asunto: 'Consulta de prueba',
  mensaje: 'Mensaje ficticio',
}

test('El catálogo real contiene 12 productos válidos en cinco categorías', () => {
  assert.equal(productos.length, 12)
  assert.equal(new Set(productos.map((item) => item.categoria)).size, 5)
  assert.equal(validarProductos(productos), true)
})
test('Los datos de sucursales conservan tres activas y una inactiva válidas', () => {
  assert.equal(sucursales.length, 4)
  assert.equal(sucursales.filter((item) => item.activa).length, 3)
  assert.equal(validarSucursales(sucursales), true)
})
test('Los arreglos vacíos son válidos y los valores que no son listas se rechazan', () => {
  for (const validar of [validarProductos, validarSucursales]) {
    assert.equal(validar([]), true)
    for (const valor of [null, {}, '[]', 1]) assert.equal(validar(valor), false)
  }
})
test('Los IDs duplicados se rechazan en ambas listas', () => {
  assert.equal(validarProductos([producto, producto]), false)
  assert.equal(validarSucursales([sucursal, sucursal]), false)
})
test('Los textos y registros ausentes se rechazan', () => {
  assert.equal(validarProductos([null]), false)
  assert.equal(validarProductos([{ ...producto, nombre: ' ' }]), false)
  assert.equal(validarSucursales([null]), false)
  assert.equal(validarSucursales([{ ...sucursal, direccion: '' }]), false)
})
test('Precio y stock deben ser enteros seguros no negativos', () => {
  for (const campo of ['precio', 'stock']) {
    for (const valor of [
      -1,
      1.5,
      '5',
      NaN,
      Infinity,
      Number.MAX_SAFE_INTEGER + 1,
    ]) {
      assert.equal(validarProductos([{ ...producto, [campo]: valor }]), false)
    }
  }
})
test('La disponibilidad debe ser booleana y coherente con el stock', () => {
  assert.equal(validarProductos([{ ...producto, disponible: 'true' }]), false)
  assert.equal(
    validarProductos([{ ...producto, stock: 0, disponible: true }]),
    false,
  )
  assert.equal(
    validarProductos([{ ...producto, stock: 5, disponible: false }]),
    false,
  )
  assert.equal(
    validarProductos([{ ...producto, stock: 0, disponible: false }]),
    true,
  )
})
test('El estado de actividad debe ser booleano y permite cero sucursales activas', () => {
  assert.equal(validarSucursales([{ ...sucursal, activa: 'false' }]), false)
  const inactivas = sucursales.map((item) => ({ ...item, activa: false }))
  assert.equal(validarSucursales(inactivas), true)
  assert.equal(inactivas.filter((item) => item.activa).length, 0)
})
test('El formulario vacío identifica los cuatro campos obligatorios', () => {
  assert.deepEqual(
    Object.keys(
      validarContacto({ nombre: '', email: '', asunto: '', mensaje: '' }),
    ),
    ['nombre', 'email', 'asunto', 'mensaje'],
  )
})
test('El formulario rechaza contenido compuesto solo por espacios', () => {
  assert.equal(
    Object.keys(
      validarContacto({ nombre: ' ', email: ' ', asunto: ' ', mensaje: ' ' }),
    ).length,
    4,
  )
})
test('El formulario rechaza correos mal formados', () => {
  for (const email of ['sin-arroba.cl', 'a@b', 'a b@dominio.cl']) {
    assert.ok(validarContacto({ ...contacto, email }).email)
  }
})
test('El formulario acepta datos ficticios válidos y recorta espacios para validar', () => {
  assert.deepEqual(validarContacto(contacto), {})
  assert.deepEqual(
    validarContacto({ ...contacto, email: ' prueba@example.com ' }),
    {},
  )
})
test('Los precios CLP no contienen decimales y usan separador de miles', () => {
  assert.equal(formatoPrecio(1490), '$1.490')
  assert.equal(formatoPrecio(0), '$0')
})
test('La búsqueda ignora mayúsculas y tildes', () => {
  assert.equal(normalizarTexto('LÁCTEOS'), 'lacteos')
  assert.ok(normalizarTexto('Jabón de manos').includes('jabon'))
})
