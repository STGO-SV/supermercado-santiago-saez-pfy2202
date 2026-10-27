export function validarArticulo(campos) {
  const errores = {}
  for (const [campo, mensaje] of [
    ['nombre', 'Ingresa el nombre del artículo.'],
    ['marca', 'Ingresa la marca del artículo.'],
    ['tipo', 'Ingresa el tipo o categoría del artículo.'],
  ]) {
    if (typeof campos?.[campo] !== 'string' || !campos[campo].trim()) {
      errores[campo] = mensaje
    }
  }
  for (const [campo, etiqueta] of [
    ['precio', 'El precio en CLP'],
    ['stock', 'La cantidad disponible'],
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
