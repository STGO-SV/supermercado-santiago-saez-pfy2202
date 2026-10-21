import TarjetaSucursal from '../components/TarjetaSucursal.jsx'
import { useSucursales } from '../hooks/useSucursales.js'

function NuestrasTiendas() {
  const { sucursales, cargando, error } = useSucursales()
  const activas = sucursales.filter((sucursal) => sucursal.activa)
  return (
    <>
      <section className="page-panel" aria-labelledby="titulo-tiendas">
        <p className="eyebrow">Nuestras tiendas</p>
        <h1 id="titulo-tiendas">Un espacio para cada comunidad</h1>
        <p>Conoce las sucursales activas de Aula Verde.</p>
        <p className="demo-label">
          Todas las sucursales y direcciones son ficticias y demostrativas. No
          corresponden a locales reales.
        </p>
      </section>
      <div className="branch-section">
        {cargando ? (
          <p role="status" className="notice">
            Cargando sucursales…
          </p>
        ) : error ? (
          <p role="alert" className="notice error-notice">
            {error}
          </p>
        ) : activas.length === 0 ? (
          <p role="status" className="notice">
            No hay sucursales activas para mostrar.
          </p>
        ) : (
          <div className="card-grid branch-grid">
            {activas.map((sucursal) => (
              <TarjetaSucursal key={sucursal.id} sucursal={sucursal} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
export default NuestrasTiendas
