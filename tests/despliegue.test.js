import test from 'node:test'
import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'
import { build, resolveConfig } from 'vite'

const root = fileURLToPath(new URL('../', import.meta.url))
const base = '/supermercado-santiago-saez-pfy2202/'

for (const [nombre, comando, preview, esperado] of [
  ['desarrollo', 'serve', false, '/'],
  ['compilación', 'build', false, base],
  ['vista previa', 'serve', true, base],
]) {
  test(`Base pública en ${nombre}`, async () => {
    const config = await resolveConfig(
      { root, logLevel: 'silent' },
      comando,
      preview ? 'production' : undefined,
      undefined,
      preview,
    )
    assert.equal(config.base, esperado)
  })
}

test('La compilación resuelve JS, CSS y ambas cargas JSON bajo la subruta pública', async () => {
  const resultado = await build({
    root,
    logLevel: 'silent',
    build: { write: false },
  })
  const salidas = resultado.output
  const html = salidas.find(
    (archivo) => archivo.fileName === 'index.html',
  ).source
  const recursos = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map(
    (coincidencia) => coincidencia[1],
  )
  assert.ok(recursos.some((ruta) => ruta.endsWith('.js')))
  assert.ok(recursos.some((ruta) => ruta.endsWith('.css')))
  for (const ruta of recursos) {
    assert.ok(ruta.startsWith(`${base}assets/`))
    assert.ok(
      salidas.some((archivo) => archivo.fileName === ruta.slice(base.length)),
    )
  }
  const js = salidas
    .filter((archivo) => archivo.type === 'chunk')
    .map((archivo) => archivo.code)
    .join('\n')
  for (const nombre of ['productos', 'sucursales']) {
    assert.ok(js.includes(`${base}data/${nombre}.json`))
  }
})
