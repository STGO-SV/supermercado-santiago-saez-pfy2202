import { moverUnidadesCarrito } from '../utils/carrito.js'
import { validarProductosEstado } from '../utils/productos.js'

export const estadoInicialProductos = {
  productos: [],
  carrito: [],
  avisoCarrito: null,
  cargando: true,
  error: '',
}

export function productosReducer(estado, accion) {
  switch (accion.type) {
    case 'CARGA_INICIADA':
      if (estado.cargando || !estado.error) return estado
      return { ...estado, cargando: true, error: '' }
    case 'CARGA_COMPLETADA':
      if (!estado.cargando || !validarProductosEstado(accion.productos)) {
        return estado
      }
      return {
        ...estado,
        productos: accion.productos.map((producto) => ({ ...producto })),
        carrito: [],
        avisoCarrito: null,
        cargando: false,
        error: '',
      }
    case 'CARGA_FALLIDA':
      if (!estado.cargando) return estado
      return {
        ...estado,
        productos: [],
        carrito: [],
        avisoCarrito: null,
        cargando: false,
        error:
          'No pudimos cargar los productos. Inténtalo nuevamente con el botón Reintentar.',
      }
    case 'AGREGAR_AL_CARRITO':
      return moverUnidadesCarrito(estado, accion, 1)
    case 'INCREMENTAR_CARRITO':
      return moverUnidadesCarrito(estado, accion, 1, true)
    case 'DISMINUIR_CARRITO':
      return moverUnidadesCarrito(estado, accion, -1, true)
    case 'AGREGAR_ARTICULO': {
      const producto = accion.producto
      if (
        estado.cargando ||
        estado.error ||
        !validarProductosEstado([producto]) ||
        typeof producto.marca !== 'string' ||
        estado.productos.some((actual) => actual.id === producto.id)
      ) {
        return estado
      }
      return { ...estado, productos: [...estado.productos, { ...producto }] }
    }
    default:
      return estado
  }
}
