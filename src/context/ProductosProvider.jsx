import { obtenerArticulosCarrito } from '../utils/carrito.js'
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

  function agregarAlCarrito(productoId, cantidad = 1) {
    dispatch({ type: 'AGREGAR_AL_CARRITO', productoId, cantidad })
  }

  function incrementarCantidad(productoId, cantidad = 1) {
    dispatch({ type: 'INCREMENTAR_CARRITO', productoId, cantidad })
  }

  function disminuirCantidad(productoId, cantidad = 1) {
    dispatch({ type: 'DISMINUIR_CARRITO', productoId, cantidad })
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
      value={{
        ...estado,
        agregarArticulo,
        reintentar,
        agregarAlCarrito,
        incrementarCantidad,
        disminuirCantidad,
        articulosCarrito: obtenerArticulosCarrito(
          estado.productos,
          estado.carrito,
        ),
      }}
    >
      {children}
    </ProductosContext.Provider>
  )
}

export default ProductosProvider
