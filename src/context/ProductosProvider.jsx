import { useEffect, useReducer, useRef } from 'react'
import { ProductosContext } from './ProductosContext.js'
import {
  estadoInicialProductos,
  productosReducer,
} from '../reducers/productosReducer.js'
import { crearCargaJSON } from '../utils/cargaJSON.js'
import { crearArticulo, normalizarProductos } from '../utils/productos.js'

function ProductosProvider({ children }) {
  const [estado, dispatch] = useReducer(
    productosReducer,
    estadoInicialProductos,
  )

  const carga = useRef(null)
  useEffect(() => {
    const operacion = crearCargaJSON({
      url: `${import.meta.env.BASE_URL}data/productos.json`,
      transformar: normalizarProductos,
      alIniciar: () => dispatch({ type: 'CARGA_INICIADA' }),
      alCompletar: (productos) =>
        dispatch({ type: 'CARGA_COMPLETADA', productos }),
      alFallar: () => dispatch({ type: 'CARGA_FALLIDA' }),
    })
    carga.current = operacion
    operacion.cargar()
    return () => operacion.cancelar()
  }, [])

  function reintentar() {
    return carga.current?.cargar()
  }

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
    <ProductosContext.Provider
      value={{ ...estado, agregarArticulo, reintentar }}
    >
      {children}
    </ProductosContext.Provider>
  )
}

export default ProductosProvider
