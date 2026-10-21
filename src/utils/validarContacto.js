export function validarContacto(campos) {
  const errores = {}
  if (!campos.nombre.trim()) errores.nombre = 'Ingresa tu nombre.'
  if (!campos.email.trim()) {
    errores.email = 'Ingresa tu correo electrónico.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(campos.email.trim())) {
    errores.email = 'Ingresa un correo válido, por ejemplo nombre@dominio.cl.'
  }
  if (!campos.asunto.trim())
    errores.asunto = 'Ingresa el asunto de tu consulta.'
  if (!campos.mensaje.trim()) errores.mensaje = 'Escribe un mensaje.'
  return errores
}
