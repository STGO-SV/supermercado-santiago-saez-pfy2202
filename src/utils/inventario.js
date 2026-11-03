export function obtenerCategorias(productos) {
  return [...new Set(productos.map((producto) => producto.categoria))]
}

export function filtrarInventario(productos, categoria) {
  return productos.filter(
    (producto) => !categoria || producto.categoria === categoria,
  )
}

export function seleccionarArticulo(productos, id) {
  return productos.find((producto) => producto.id === id)
}
