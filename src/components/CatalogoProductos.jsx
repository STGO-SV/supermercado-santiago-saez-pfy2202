import { useState } from 'react'
import TarjetaProducto from './TarjetaProducto.jsx'
import { normalizarTexto } from '../utils/normalizarTexto.js'

function CatalogoProductos({ productos, cargando, error }) {
  const [busqueda, setBusqueda] = useState('')
  const [categoria, setCategoria] = useState('')
  const categorias = [
    ...new Set(productos.map((producto) => producto.categoria)),
  ]
  const texto = normalizarTexto(busqueda.trim())
  const filtrados = productos.filter(
    (producto) =>
      (!categoria || producto.categoria === categoria) &&
      normalizarTexto(`${producto.nombre} ${producto.categoria}`).includes(
        texto,
      ),
  )

  return (
    <section aria-labelledby="titulo-catalogo" className="catalog-section">
      <div className="section-heading">
        <h2 id="titulo-catalogo">Catálogo de inventario</h2>
        <p>Consulta los productos y sus existencias de demostración.</p>
      </div>
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
          El catálogo todavía no tiene productos.
        </p>
      ) : (
        <>
          <form
            className="catalog-filters"
            role="search"
            aria-label="Buscar en el catálogo"
            onSubmit={(evento) => evento.preventDefault()}
          >
            <div className="field">
              <label htmlFor="busqueda">Buscar productos</label>
              <input
                id="busqueda"
                name="busqueda"
                type="search"
                value={busqueda}
                onChange={(evento) => setBusqueda(evento.target.value)}
                placeholder="Nombre o categoría"
              />
            </div>
            <div className="field">
              <label htmlFor="categoria">Categoría</label>
              <select
                id="categoria"
                value={categoria}
                onChange={(evento) => setCategoria(evento.target.value)}
              >
                <option value="">Todas las categorías</option>
                {categorias.map((nombre) => (
                  <option key={nombre} value={nombre}>
                    {nombre}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              className="button-secondary"
              onClick={() => {
                setBusqueda('')
                setCategoria('')
              }}
            >
              Limpiar filtros
            </button>
          </form>
          <p role="status" className="result-count">
            {filtrados.length} de {productos.length} productos
          </p>
          {filtrados.length > 0 ? (
            <div className="card-grid">
              {filtrados.map((producto) => (
                <TarjetaProducto key={producto.id} producto={producto} />
              ))}
            </div>
          ) : (
            <p className="notice">
              No se encontraron productos que coincidan con los filtros.
            </p>
          )}
        </>
      )}
    </section>
  )
}
export default CatalogoProductos
