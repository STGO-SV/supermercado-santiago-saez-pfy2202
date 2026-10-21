import { useEffect, useState } from 'react'
import { validarProductos } from '../utils/validarDatos.js'

export function useProductos() {
  const [estado, setEstado] = useState({
    productos: [],
    cargando: true,
    error: '',
  })
  useEffect(() => {
    const controlador = new AbortController()
    async function cargarProductos() {
      try {
        const respuesta = await fetch(
          `${import.meta.env.BASE_URL}data/productos.json`,
          {
            signal: controlador.signal,
            headers: { Accept: 'application/json' },
          },
        )
        if (!respuesta.ok) throw new Error('Respuesta HTTP inválida')
        const productos = await respuesta.json()
        if (!validarProductos(productos)) throw new Error('Datos inválidos')
        if (!controlador.signal.aborted)
          setEstado({ productos, cargando: false, error: '' })
      } catch {
        if (!controlador.signal.aborted) {
          setEstado({
            productos: [],
            cargando: false,
            error:
              'No pudimos cargar los productos. Recarga la página para intentarlo nuevamente.',
          })
        }
      }
    }
    cargarProductos()
    return () => controlador.abort()
  }, [])
  return estado
}
