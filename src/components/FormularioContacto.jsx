import { useState } from 'react'
import { validarContacto } from '../utils/validarContacto.js'

const camposIniciales = { nombre: '', email: '', asunto: '', mensaje: '' }

function FormularioContacto() {
  const [campos, setCampos] = useState(camposIniciales)
  const [errores, setErrores] = useState({})
  const [validado, setValidado] = useState(false)

  function actualizarCampo(evento) {
    const { name, value } = evento.target
    setCampos((actuales) => ({ ...actuales, [name]: value }))
    setErrores((actuales) => ({ ...actuales, [name]: '' }))
    setValidado(false)
  }

  function validarFormulario(evento) {
    evento.preventDefault()
    const nuevosErrores = validarContacto(campos)
    setErrores(nuevosErrores)
    setValidado(Object.keys(nuevosErrores).length === 0)
    const primerCampo = Object.keys(nuevosErrores)[0]
    if (primerCampo)
      evento.currentTarget.elements.namedItem(primerCampo).focus()
  }

  return (
    <form
      className="contact-form"
      noValidate
      onSubmit={validarFormulario}
      aria-describedby="ayuda-contacto"
    >
      <p id="ayuda-contacto" className="notice">
        Formulario demostrativo: valida tus datos, pero no envía mensajes a un
        servidor ni guarda tu información. Todos los campos son obligatorios.
      </p>
      {[
        { name: 'nombre', label: 'Nombre', type: 'text', autoComplete: 'name' },
        {
          name: 'email',
          label: 'Correo electrónico',
          type: 'email',
          autoComplete: 'email',
        },
        { name: 'asunto', label: 'Asunto', type: 'text', autoComplete: 'off' },
      ].map(({ name, label, type, autoComplete }) => (
        <div className="field" key={name}>
          <label htmlFor={`contacto-${name}`}>{label} (obligatorio)</label>
          <input
            id={`contacto-${name}`}
            name={name}
            type={type}
            autoComplete={autoComplete}
            required
            value={campos[name]}
            onChange={actualizarCampo}
            aria-invalid={Boolean(errores[name])}
            aria-describedby={errores[name] ? `error-${name}` : undefined}
          />
          {errores[name] && (
            <p id={`error-${name}`} className="field-error">
              {errores[name]}
            </p>
          )}
        </div>
      ))}
      <div className="field">
        <label htmlFor="contacto-mensaje">Mensaje (obligatorio)</label>
        <textarea
          id="contacto-mensaje"
          name="mensaje"
          rows={5}
          required
          value={campos.mensaje}
          onChange={actualizarCampo}
          aria-invalid={Boolean(errores.mensaje)}
          aria-describedby={errores.mensaje ? 'error-mensaje' : undefined}
        />
        {errores.mensaje && (
          <p id="error-mensaje" className="field-error">
            {errores.mensaje}
          </p>
        )}
      </div>
      {Object.values(errores).some(Boolean) && (
        <p role="alert" className="notice error-notice">
          Revisa los campos indicados antes de continuar.
        </p>
      )}
      {validado && (
        <p role="status" className="notice success-notice">
          Datos válidos. Demostración completada: no se ha enviado ningún
          mensaje.
        </p>
      )}
      <button type="submit" className="button-primary">
        Validar mensaje
      </button>
    </form>
  )
}
export default FormularioContacto
