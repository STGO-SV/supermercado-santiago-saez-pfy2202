import { seleccionarArticulo } from './inventario.js'

// Los atributos se consultan en productos; las líneas almacenan solo ID y cantidad.
export function obtenerArticulosCarrito(productos, carrito) {
  return carrito.map(({ productoId, cantidad }) => ({
    producto: seleccionarArticulo(productos, productoId),
    cantidad,
  }))
}

export function moverUnidadesCarrito(
  estado,
  accion,
  sentido,
  requiereLinea = false,
) {
  const { productoId, cantidad = 1 } = accion
  function rechazar(mensaje) {
    return { ...estado, avisoCarrito: { productoId, tipo: 'error', mensaje } }
  }
  if (estado.cargando || estado.error) {
    return rechazar('La carga del inventario no está disponible.')
  }
  if (!Number.isSafeInteger(cantidad) || cantidad <= 0) {
    return rechazar('La cantidad debe ser un entero positivo y seguro.')
  }
  const producto = seleccionarArticulo(estado.productos, productoId)
  if (!producto) return rechazar('El artículo no existe en el inventario.')
  const linea = estado.carrito.find((item) => item.productoId === productoId)
  if (requiereLinea && !linea)
    return rechazar('El artículo no está en el carrito.')
  if (sentido === 1 && cantidad > producto.stock) {
    return rechazar(
      'No hay suficientes unidades disponibles para esa cantidad.',
    )
  }
  if (sentido === -1 && cantidad > (linea?.cantidad ?? 0)) {
    return rechazar('No se pueden devolver más unidades que las del carrito.')
  }
  const stock = producto.stock - sentido * cantidad
  const nuevaCantidad = (linea?.cantidad ?? 0) + sentido * cantidad
  if (!Number.isSafeInteger(stock) || !Number.isSafeInteger(nuevaCantidad)) {
    return rechazar('La operación supera el límite de unidades permitido.')
  }
  const carrito = linea
    ? estado.carrito
        .map((item) =>
          item.productoId === productoId
            ? { ...item, cantidad: nuevaCantidad }
            : item,
        )
        .filter((item) => item.cantidad > 0)
    : [...estado.carrito, { productoId, cantidad: nuevaCantidad }]
  return {
    ...estado,
    productos: estado.productos.map((item) =>
      item.id === productoId ? { ...item, stock, disponible: stock > 0 } : item,
    ),
    carrito,
    avisoCarrito: {
      productoId,
      tipo: 'exito',
      mensaje: `${producto.nombre}: ${nuevaCantidad} ${nuevaCantidad === 1 ? 'unidad' : 'unidades'} en el carrito. Stock disponible: ${stock}.`,
    },
  }
}
