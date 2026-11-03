import { Link, useParams } from 'react-router'
import ErrorCarga from '../components/ErrorCarga.jsx'
import { useProductos } from '../hooks/useProductos.js'
import { seleccionarArticulo } from '../utils/inventario.js'
import { formatoPrecio } from '../utils/formatoPrecio.js'

function DetalleArticulo() {
  const { id } = useParams()
  const {
    productos,
    carrito,
    cargando,
    error,
    reintentar,
    agregarAlCarrito,
    avisoCarrito,
  } = useProductos()
  const producto = seleccionarArticulo(productos, id)
  const cantidad = carrito.find((item) => item.productoId === id)?.cantidad ?? 0
  const aviso = avisoCarrito?.productoId === id ? avisoCarrito : null

  return (
    <section
      className="page-panel inventory-panel"
      aria-labelledby="titulo-detalle"
    >
      <p className="eyebrow">Detalle de artículo</p>
      <h1 id="titulo-detalle">
        {cargando || error
          ? 'Detalle de artículo'
          : (producto?.nombre ?? 'Artículo no encontrado')}
      </h1>
      {cargando ? (
        <p role="status" className="notice">
          Cargando productos…
        </p>
      ) : error ? (
        <ErrorCarga mensaje={error} reintentar={reintentar} />
      ) : !producto ? (
        <p className="notice">
          El identificador no corresponde a un artículo del inventario actual.
        </p>
      ) : (
        <>
          <dl className="tw:grid tw:gap-2">
            <div>
              <dt>Marca</dt>
              <dd>{producto.marca ?? 'Sin información'}</dd>
            </div>
            <div>
              <dt>Tipo / categoría</dt>
              <dd>{producto.tipo}</dd>
            </div>
            <div>
              <dt>Precio CLP</dt>
              <dd>{formatoPrecio(producto.precio)}</dd>
            </div>
            <div>
              <dt>Stock disponible</dt>
              <dd>
                {producto.stock} {producto.stock === 1 ? 'unidad' : 'unidades'}
              </dd>
            </div>
            <div>
              <dt>Disponibilidad</dt>
              <dd>{producto.disponible ? 'Disponible' : 'Sin stock'}</dd>
            </div>
          </dl>
          <p>Unidades en el carrito: {cantidad}</p>
          {producto.stock === 0 && (
            <p id="ayuda-sin-stock" className="notice">
              No hay unidades disponibles para agregar al carrito.
            </p>
          )}
          <button
            type="button"
            className="button-primary tw:disabled:cursor-not-allowed tw:disabled:opacity-60"
            disabled={producto.stock === 0}
            aria-describedby={
              producto.stock === 0 ? 'ayuda-sin-stock' : undefined
            }
            onClick={() => agregarAlCarrito(producto.id)}
          >
            Agregar al carrito
          </button>
          {aviso && (
            <p
              role={aviso.tipo === 'error' ? 'alert' : 'status'}
              className={`notice ${aviso.tipo === 'error' ? 'error-notice' : 'success-notice'}`}
            >
              {aviso.mensaje}
            </p>
          )}
          <p className="demo-label">
            El carrito se conserva durante la navegación y se reinicia al
            recargar la página.
          </p>
        </>
      )}
      <p>
        <Link to="/inventario">Volver al inventario</Link>
      </p>
    </section>
  )
}

export default DetalleArticulo
