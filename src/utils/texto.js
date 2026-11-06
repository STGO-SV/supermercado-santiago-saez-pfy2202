const controlesProhibidos = /[\p{Cc}\p{Cf}\p{Zl}\p{Zp}]/u
const caracteresProducto = /^[\p{L}\p{M}\p{N}\p{Zs}.,'’"&+%°ºª()/#:®™×–—-]+$/u
const contenidoSignificativo = /[\p{L}\p{N}]/u

export function textoValido(valor) {
  return typeof valor === 'string' && valor.trim().length > 0
}

export function textoProductoValido(valor) {
  if (typeof valor !== 'string' || controlesProhibidos.test(valor)) return false
  const texto = valor.trim().normalize('NFC')
  return caracteresProducto.test(texto) && contenidoSignificativo.test(texto)
}
