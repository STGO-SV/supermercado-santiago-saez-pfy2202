import { validarProductos } from './validarDatos.js'
import { validarArticulo } from './validarArticulo.js'
import { textoValido, textoProductoValido } from './texto.js'

export function validarProductosEstado(productos) {
  return (
    validarProductos(productos) &&
    productos.every(
      (producto) =>
        (producto.marca === null || textoProductoValido(producto.marca)) &&
        producto.tipo === producto.categoria,
    )
  )
}

export function normalizarProductos(datos) {
  if (!validarProductos(datos)) throw new Error('Datos de productos inválidos')
  // El tipo representa la categoría; se conservan marcas informadas y ausencias históricas.
  const productos = datos.map((producto) => ({
    ...producto,
    marca: producto.marca === undefined ? null : producto.marca,
    tipo: producto.categoria,
  }))
  if (!validarProductosEstado(productos)) {
    throw new Error('Modelo de productos inválido')
  }
  return productos
}

export function crearArticulo(campos, id) {
  if (Object.keys(validarArticulo(campos)).length > 0 || !textoValido(id)) {
    throw new Error('Artículo inválido')
  }
  const stock = Number(campos.stock.trim())
  const tipo = campos.tipo.trim()
  return {
    id: id.trim(),
    nombre: campos.nombre.trim(),
    marca: campos.marca.trim(),
    tipo,
    categoria: tipo,
    precio: Number(campos.precio.trim()),
    stock,
    disponible: stock > 0,
  }
}
