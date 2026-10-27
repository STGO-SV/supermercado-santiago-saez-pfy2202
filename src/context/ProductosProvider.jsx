import { useEffect, useReducer } from 'react'
import { ProductosContext } from './ProductosContext.js'
import {
  estadoInicialProductos,
  productosReducer,
} from '../reducers/productosReducer.js'
import { crearArticulo, normalizarProductos } from '../utils/productos.js'

function ProductosProvider({ children }) {
  const [estado, dispatch] = useReducer(
    productosReducer,
    estadoInicialProductos,
  )

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
        const productos = normalizarProductos(await respuesta.json())
        if (!controlador.signal.aborted) {
          dispatch({ type: 'CARGA_COMPLETADA', productos })
        }
      } catch {
        if (!controlador.signal.aborted) dispatch({ type: 'CARGA_FALLIDA' })
      }
    }
    cargarProductos()
    return () => controlador.abort()
  }, [])

  function agregarArticulo(campos) {
    if (estado.cargando || estado.error) {
      throw new Error('La carga del inventario no está disponible.')
    }
    let id
    do {
      id = `art-${crypto.randomUUID()}`
    } while (estado.productos.some((producto) => producto.id === id))
    const producto = crearArticulo(campos, id)
    dispatch({ type: 'AGREGAR_ARTICULO', producto })
    return producto
  }

  return (
    <ProductosContext.Provider value={{ ...estado, agregarArticulo }}>
      {children}
    </ProductosContext.Provider>
  )
}

export default ProductosProvider
