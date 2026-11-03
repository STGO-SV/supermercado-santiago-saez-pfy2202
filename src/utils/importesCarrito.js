// Proyección calculada: no añade totales ni subtotales al estado compartido.
export function calcularImportesCarrito(articulosCarrito) {
  const lineas = articulosCarrito.map((linea) => ({
    ...linea,
    subtotal: BigInt(linea.producto.precio) * BigInt(linea.cantidad),
  }))
  return {
    lineas,
    total: lineas.reduce((suma, linea) => suma + linea.subtotal, 0n),
  }
}
