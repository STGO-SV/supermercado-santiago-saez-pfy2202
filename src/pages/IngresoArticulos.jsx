import FormularioArticulo from '../components/FormularioArticulo.jsx'
import { useProductos } from '../hooks/useProductos.js'

function IngresoArticulos() {
  const { cargando, error } = useProductos()
  return (
    <section
      className="page-panel inventory-panel"
      aria-labelledby="titulo-ingreso"
    >
      <p className="eyebrow">Inventario</p>
      <h1 id="titulo-ingreso">Ingresar artículos</h1>
      <p>Incorpora un artículo al inventario y al catálogo.</p>
      {cargando ? (
        <p role="status" className="notice">
          Cargando productos…
        </p>
      ) : error ? (
        <p role="alert" className="notice error-notice">
          {error}
        </p>
      ) : (
        <FormularioArticulo />
      )}
    </section>
  )
}

export default IngresoArticulos
