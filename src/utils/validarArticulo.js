import { textoValido, textoProductoValido } from './texto.js'

export function validarArticulo(campos) {
  const errores = {}
  for (const [campo, mensaje, etiqueta] of [
    ['nombre', 'Ingresa el nombre del artículo.', 'nombre'],
    ['marca', 'Ingresa la marca del artículo.', 'marca'],
    ['tipo', 'Ingresa la categoría del artículo.', 'categoría'],
  ]) {
    if (!textoValido(campos?.[campo])) {
      errores[campo] = mensaje
    } else if (!textoProductoValido(campos[campo])) {
      errores[campo] =
        `Formato de ${etiqueta} no válido. Usa letras, números o símbolos comerciales permitidos, sin saltos de línea ni caracteres invisibles.`
    }
  }
  for (const [campo, etiqueta] of [
    ['precio', 'El precio por unidad en CLP'],
    ['stock', 'La cantidad disponible en unidades'],
  ]) {
    const valor = campos?.[campo]
    if (
      typeof valor !== 'string' ||
      !/^\d+$/.test(valor.trim()) ||
      !Number.isSafeInteger(Number(valor))
    ) {
      errores[campo] = `${etiqueta} debe ser un entero no negativo y seguro.`
    }
  }
  return errores
}
