import CatalogoProductos from '../components/CatalogoProductos.jsx'
import { useProductos } from '../hooks/useProductos.js'

function Home() {
  const { productos, cargando, error } = useProductos()
  return (
    <>
      <section className="page-panel" aria-labelledby="titulo-inicio">
        <p className="eyebrow">Inicio · Despensa Verde</p>
        <h1 id="titulo-inicio">Catálogo</h1>
        <p>Consulta productos, precios y existencias.</p>
        <p className="demo-label">
          [DEMO] Este es un proyecto académico. Los productos, precios y
          existencias son demostrativos.
        </p>
      </section>
      <CatalogoProductos
        productos={productos}
        cargando={cargando}
        error={error}
      />
    </>
  )
}
export default Home
