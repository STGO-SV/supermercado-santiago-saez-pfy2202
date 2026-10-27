import { validarProductos } from './validarDatos.js'
import { validarArticulo } from './validarArticulo.js'

function textoValido(valor) {
  return typeof valor === 'string' && valor.trim().length > 0
}

export function validarProductosEstado(productos) {
  return (
    validarProductos(productos) &&
    productos.every(
      (producto) =>
        (producto.marca === null || textoValido(producto.marca)) &&
        producto.tipo === producto.categoria,
    )
  )
}

export function normalizarProductos(datos) {
  if (!validarProductos(datos)) throw new Error('Datos de productos inválidos')
  // El tipo representa la categoría; la semilla no informa marcas.
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
