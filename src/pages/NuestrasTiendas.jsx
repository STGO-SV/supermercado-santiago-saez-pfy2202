import TarjetaSucursal from '../components/TarjetaSucursal.jsx'
import { useSucursales } from '../hooks/useSucursales.js'

function NuestrasTiendas() {
  const { sucursales, cargando, error } = useSucursales()
  const activas = sucursales.filter((sucursal) => sucursal.activa)
  return (
    <>
      <section className="page-panel" aria-labelledby="titulo-tiendas">
        <p className="eyebrow">Nuestras tiendas</p>
        <h1 id="titulo-tiendas">Ecuentra tu Despensa Verde más cercana</h1>
        <p>
          Conoce nuestras sucursales, sus direcciones y horarios de atención.
        </p>
        <p className="demo-label">
          [DEMO]Todas las sucursales y direcciones son ficticias y puramente
          demostrativas.
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
