import { useEffect, useRef } from 'react'
import { Link } from 'react-router'
import ErrorCarga from '../components/ErrorCarga.jsx'
import LineaCarrito from '../components/LineaCarrito.jsx'
import { useProductos } from '../hooks/useProductos.js'
import { calcularImportesCarrito } from '../utils/importesCarrito.js'
import { formatoPrecio } from '../utils/formatoPrecio.js'

function Carrito() {
  const {
    carrito,
    articulosCarrito,
    cargando,
    error,
    reintentar,
    incrementarCantidad,
    disminuirCantidad,
    avisoCarrito,
  } = useProductos()
  const { lineas, total } = calcularImportesCarrito(articulosCarrito)
  const botones = useRef(new Map())
  const tituloVacio = useRef(null)
  const focoPendiente = useRef(null)

  useEffect(() => {
    const pendiente = focoPendiente.current
    if (!pendiente) return
    focoPendiente.current = null
    if (
      pendiente.retirado &&
      carrito.some((linea) => linea.productoId === pendiente.retirado)
    )
      return
    const destino =
      botones.current.get(pendiente.destino) ?? tituloVacio.current
    destino?.focus()
  }, [carrito])

  function disminuir(productoId) {
    const indice = lineas.findIndex((linea) => linea.producto.id === productoId)
    if (lineas[indice]?.cantidad === 1) {
      focoPendiente.current = {
        retirado: productoId,
        destino:
          lineas[indice + 1]?.producto.id ?? lineas[indice - 1]?.producto.id,
      }
    }
    disminuirCantidad(productoId)
  }

  function incrementar(productoId) {
    if (
      lineas.find((linea) => linea.producto.id === productoId)?.producto
        .stock === 1
    ) {
      focoPendiente.current = { destino: productoId }
    }
    incrementarCantidad(productoId)
  }

  return (
    <section className="page-panel" aria-labelledby="titulo-carrito">
      <p className="eyebrow">Carrito</p>
      <h1 id="titulo-carrito">Carrito de artículos</h1>
      <p>
        Las cantidades reservadas se descuentan del inventario. Al disminuirlas,
        las unidades vuelven a estar disponibles.
      </p>
      <p className="demo-label">
        El carrito se conserva durante la navegación y se vacía al recargar la
        página.
      </p>
      {cargando ? (
        <p role="status" className="notice">
          Cargando productos…
        </p>
      ) : error ? (
        <ErrorCarga mensaje={error} reintentar={reintentar} />
      ) : (
        <>
          {avisoCarrito && (
            <p
              role={avisoCarrito.tipo === 'error' ? 'alert' : 'status'}
              className={`notice ${avisoCarrito.tipo === 'error' ? 'error-notice' : 'success-notice'}`}
            >
              {avisoCarrito.mensaje}
            </p>
          )}
          {lineas.length === 0 ? (
            <div className="notice">
              <h2 ref={tituloVacio} tabIndex={-1}>
                El carrito está vacío
              </h2>
              <p>
                Selecciona artículos desde el catálogo de Inicio para agregarlos
                al carrito.
              </p>
            </div>
          ) : (
            <ul
              aria-label="Artículos del carrito"
              className="tw:my-6 tw:grid tw:list-none tw:gap-4 tw:p-0"
            >
              {lineas.map((linea) => (
                <LineaCarrito
                  key={linea.producto.id}
                  {...linea}
                  incrementar={incrementar}
                  disminuir={disminuir}
                  referenciaDisminuir={(elemento) => {
                    if (elemento)
                      botones.current.set(linea.producto.id, elemento)
                    else botones.current.delete(linea.producto.id)
                  }}
                />
              ))}
            </ul>
          )}
          <p className="tw:my-6 tw:break-words tw:text-xl tw:font-bold">
            Total del carrito: {formatoPrecio(total)} CLP
          </p>
        </>
      )}
      <p>
        <Link to="/">Seguir comprando</Link>
      </p>
    </section>
  )
}

export default Carrito
