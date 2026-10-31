// Controla una carga inicial y reintentos explícitos únicamente después de un error.
export function crearCargaJSON({
  url,
  transformar,
  alIniciar,
  alCompletar,
  alFallar,
  solicitar = fetch,
}) {
  let fase = 'inicial'
  let controlador

  async function cargar() {
    if (fase !== 'inicial' && fase !== 'error') return
    fase = 'cargando'
    const actual = new AbortController()
    controlador = actual
    alIniciar()
    try {
      const respuesta = await solicitar(url, {
        signal: actual.signal,
        headers: { Accept: 'application/json' },
      })
      if (!respuesta.ok) throw new Error('Respuesta HTTP inválida')
      const datos = transformar(await respuesta.json())
      if (actual.signal.aborted || controlador !== actual) return
      fase = 'completada'
      alCompletar(datos)
    } catch {
      if (actual.signal.aborted || controlador !== actual) return
      fase = 'error'
      alFallar()
    }
  }

  return {
    cargar,
    cancelar() {
      fase = 'cancelada'
      controlador?.abort()
    },
  }
}
