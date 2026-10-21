function textoValido(valor) {
  return typeof valor === 'string' && valor.trim().length > 0
}

export function validarProductos(datos) {
  if (!Array.isArray(datos)) return false
  const ids = new Set()
  return datos.every((producto) => {
    if (
      !producto ||
      !['id', 'nombre', 'categoria'].every((campo) =>
        textoValido(producto[campo]),
      ) ||
      !Number.isSafeInteger(producto.precio) ||
      producto.precio < 0 ||
      !Number.isSafeInteger(producto.stock) ||
      producto.stock < 0 ||
      typeof producto.disponible !== 'boolean' ||
      producto.disponible !== producto.stock > 0 ||
      ids.has(producto.id)
    )
      return false
    ids.add(producto.id)
    return true
  })
}

export function validarSucursales(datos) {
  if (!Array.isArray(datos)) return false
  const ids = new Set()
  return datos.every((sucursal) => {
    if (
      !sucursal ||
      !['id', 'nombre', 'comuna', 'direccion', 'horario'].every((campo) =>
        textoValido(sucursal[campo]),
      ) ||
      typeof sucursal.activa !== 'boolean' ||
      ids.has(sucursal.id)
    )
      return false
    ids.add(sucursal.id)
    return true
  })
}
