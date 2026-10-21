import { useEffect, useState } from 'react'
import { validarSucursales } from '../utils/validarDatos.js'

export function useSucursales() {
  const [estado, setEstado] = useState({
    sucursales: [],
    cargando: true,
    error: '',
  })
  useEffect(() => {
    const controlador = new AbortController()
    async function cargarSucursales() {
      try {
        const respuesta = await fetch(
          `${import.meta.env.BASE_URL}data/sucursales.json`,
          {
            signal: controlador.signal,
            headers: { Accept: 'application/json' },
          },
        )
        if (!respuesta.ok) throw new Error('Respuesta HTTP inválida')
        const sucursales = await respuesta.json()
        if (!validarSucursales(sucursales)) throw new Error('Datos inválidos')
        if (!controlador.signal.aborted)
          setEstado({ sucursales, cargando: false, error: '' })
      } catch {
        if (!controlador.signal.aborted) {
          setEstado({
            sucursales: [],
            cargando: false,
            error:
              'No pudimos cargar las sucursales. Recarga la página para intentarlo nuevamente.',
          })
        }
      }
    }
    cargarSucursales()
    return () => controlador.abort()
  }, [])
  return estado
}
