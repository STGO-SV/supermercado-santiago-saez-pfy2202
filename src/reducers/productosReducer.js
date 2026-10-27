import { validarProductosEstado } from '../utils/productos.js'

export const estadoInicialProductos = {
  productos: [],
  cargando: true,
  error: '',
}

export function productosReducer(estado, accion) {
  switch (accion.type) {
    case 'CARGA_COMPLETADA':
      if (!estado.cargando || !validarProductosEstado(accion.productos)) {
        return estado
      }
      return { productos: [...accion.productos], cargando: false, error: '' }
    case 'CARGA_FALLIDA':
      if (!estado.cargando) return estado
      return {
        productos: [],
        cargando: false,
        error:
          'No pudimos cargar los productos. Recarga la página para intentarlo nuevamente.',
      }
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
