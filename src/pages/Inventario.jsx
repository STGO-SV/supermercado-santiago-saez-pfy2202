import TablaInventario from '../components/TablaInventario.jsx'
import { useProductos } from '../hooks/useProductos.js'

function Inventario() {
  const { productos, cargando, error } = useProductos()
  return (
    <section className="page-panel" aria-labelledby="titulo-inventario">
      <p className="eyebrow">Inventario</p>
      <h1 id="titulo-inventario">Inventario de artículos</h1>
      <p>
        Consulta todos los artículos del catálogo, incluidos aquellos sin stock.
      </p>
      <p className="demo-label">
        Los artículos agregados se conservan durante la navegación y se pierden
        al recargar la página.
      </p>
      {cargando ? (
        <p role="status" className="notice">
          Cargando productos…
        </p>
      ) : error ? (
        <p role="alert" className="notice error-notice">
          {error}
        </p>
      ) : productos.length === 0 ? (
        <p role="status" className="notice">
          El inventario todavía no tiene artículos.
        </p>
      ) : (
        <TablaInventario productos={productos} />
      )}
    </section>
  )
}

export default Inventario
