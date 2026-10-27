import { useState } from 'react'
import { Link } from 'react-router'
import { useProductos } from '../hooks/useProductos.js'
import { validarArticulo } from '../utils/validarArticulo.js'

const camposIniciales = {
  nombre: '',
  marca: '',
  tipo: '',
  precio: '',
  stock: '',
}
const camposFormulario = [
  { name: 'nombre', label: 'Nombre', type: 'text' },
  { name: 'marca', label: 'Marca', type: 'text' },
  { name: 'tipo', label: 'Tipo o categoría', type: 'text' },
  { name: 'precio', label: 'Precio en CLP', type: 'number' },
  { name: 'stock', label: 'Cantidad disponible', type: 'number' },
]

function FormularioArticulo() {
  const { agregarArticulo } = useProductos()
  const [campos, setCampos] = useState(camposIniciales)
  const [errores, setErrores] = useState({})
  const [confirmacion, setConfirmacion] = useState('')
  const [errorIngreso, setErrorIngreso] = useState('')

  function actualizarCampo(evento) {
    const { name, value } = evento.target
    setCampos((actuales) => ({ ...actuales, [name]: value }))
    setErrores((actuales) => ({ ...actuales, [name]: '' }))
    setConfirmacion('')
    setErrorIngreso('')
  }

  function incorporarArticulo(evento) {
    evento.preventDefault()
    setConfirmacion('')
    setErrorIngreso('')
    const nuevosErrores = validarArticulo(campos)
    setErrores(nuevosErrores)
    const primerCampo = Object.keys(nuevosErrores)[0]
    if (primerCampo) {
      evento.currentTarget.elements.namedItem(primerCampo).focus()
      return
    }
    try {
      const producto = agregarArticulo(campos)
      setConfirmacion(
        `Se agregó «${producto.nombre}» al inventario y al catálogo.`,
      )
      setCampos(camposIniciales)
    } catch {
      setErrorIngreso(
        'No se pudo incorporar el artículo. Revisa los datos e inténtalo nuevamente.',
      )
    }
  }

  return (
    <form
      className="article-form"
      noValidate
      onSubmit={incorporarArticulo}
      aria-describedby="ayuda-articulo"
    >
      <p id="ayuda-articulo" className="notice">
        Todos los campos son obligatorios. Precio y cantidad deben ser enteros
        no negativos. Los artículos agregados se conservan durante la navegación
        y se pierden al recargar la página.
      </p>
      {camposFormulario.map(({ name, label, type }) => (
        <div className="field" key={name}>
          <label htmlFor={`articulo-${name}`}>{label} (obligatorio)</label>
          <input
            id={`articulo-${name}`}
            name={name}
            type={type}
            autoComplete="off"
            min={type === 'number' ? 0 : undefined}
            step={type === 'number' ? 1 : undefined}
            required
            value={campos[name]}
            onChange={actualizarCampo}
            aria-invalid={Boolean(errores[name])}
            aria-describedby={
              errores[name] ? `articulo-error-${name}` : undefined
            }
          />
          {errores[name] && (
            <p id={`articulo-error-${name}`} className="field-error">
              {errores[name]}
            </p>
          )}
        </div>
      ))}
      {Object.values(errores).some(Boolean) && (
        <p role="alert" className="notice error-notice">
          Revisa los campos indicados antes de continuar.
        </p>
      )}
      {errorIngreso && (
        <p role="alert" className="notice error-notice">
          {errorIngreso}
        </p>
      )}
      {confirmacion && (
        <p role="status" className="notice success-notice">
          {confirmacion} <Link to="/inventario">Ver inventario</Link>
        </p>
      )}
      <button type="submit" className="button-primary">
        Agregar artículo
      </button>
    </form>
  )
}

export default FormularioArticulo
