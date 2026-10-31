import { useEffect, useRef, useState } from 'react'
import { validarSucursales } from '../utils/validarDatos.js'
import { crearCargaJSON } from '../utils/cargaJSON.js'

export function useSucursales() {
  const [estado, setEstado] = useState({
    sucursales: [],
    cargando: true,
    error: '',
  })
  const carga = useRef(null)
  useEffect(() => {
    const operacion = crearCargaJSON({
      url: `${import.meta.env.BASE_URL}data/sucursales.json`,
      transformar: (datos) => {
        if (!validarSucursales(datos)) throw new Error('Datos inválidos')
        return datos
      },
      alIniciar: () => setEstado({ sucursales: [], cargando: true, error: '' }),
      alCompletar: (sucursales) =>
        setEstado({ sucursales, cargando: false, error: '' }),
      alFallar: () =>
        setEstado({
          sucursales: [],
          cargando: false,
          error:
            'No pudimos cargar las sucursales. Inténtalo nuevamente con el botón Reintentar.',
        }),
    })
    carga.current = operacion
    operacion.cargar()
    return () => operacion.cancelar()
  }, [])
  function reintentar() {
    return carga.current?.cargar()
  }
  return { ...estado, reintentar }
}
