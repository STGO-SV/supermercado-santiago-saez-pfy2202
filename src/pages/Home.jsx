import CatalogoProductos from '../components/CatalogoProductos.jsx'
import { useProductos } from '../hooks/useProductos.js'

function Home() {
  const { productos, cargando, error } = useProductos()
  return (
    <>
      <section className="page-panel" aria-labelledby="titulo-inicio">
        <p className="eyebrow">Inicio · Aula Verde</p>
        <h1 id="titulo-inicio">El inventario, a la vista</h1>
        <p>
          Consulta los productos, precios y existencias de nuestro supermercado
          ficticio.
        </p>
        <p className="demo-label">
          Proyecto académico. Los productos, precios y cantidades son
          demostrativos.
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
