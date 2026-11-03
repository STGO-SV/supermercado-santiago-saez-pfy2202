import { useEffect, useRef } from 'react'
import { useProductos } from '../hooks/useProductos.js'
import ControlesCantidad from './ControlesCantidad.jsx'
import { formatoPrecio } from '../utils/formatoPrecio.js'

function TarjetaProducto({ producto }) {
  const { carrito, agregarAlCarrito, disminuirCantidad, avisoCarrito } =
    useProductos()
  const cantidad =
    carrito.find((linea) => linea.productoId === producto.id)?.cantidad ?? 0
  const botonMas = useRef(null)
  const botonMenos = useRef(null)
  const focoPendiente = useRef(null)
  useEffect(() => {
    const destino = focoPendiente.current
    focoPendiente.current = null
    if (!destino) return
    const boton = destino === 'mas' ? botonMas.current : botonMenos.current
    if (boton && !boton.disabled) boton.focus()
  }, [cantidad, producto.stock])

  function aumentar() {
    if (producto.stock === 1) focoPendiente.current = 'menos'
    agregarAlCarrito(producto.id)
  }

  function disminuir() {
    if (cantidad === 1) focoPendiente.current = 'mas'
    disminuirCantidad(producto.id)
  }

  return (
    <article
      className="product-card"
      aria-labelledby={`producto-${producto.id}`}
    >
      <p className="category-label">{producto.categoria}</p>
      <h3 id={`producto-${producto.id}`}>{producto.nombre}</h3>
      <p className="product-price">
        {formatoPrecio(producto.precio)} <span>CLP por unidad</span>
      </p>
      <p id={`existencias-catalogo-${producto.id}`}>
        Stock:{' '}
        <strong>
          {producto.stock} {producto.stock === 1 ? 'unidad' : 'unidades'}
        </strong>
      </p>
      <p
        className={`availability ${producto.disponible ? 'available' : 'unavailable'}`}
      >
        {producto.disponible ? 'Disponible' : 'Sin stock'}
      </p>
      <ControlesCantidad
        producto={producto}
        cantidad={cantidad}
        compacto
        incrementar={aumentar}
        disminuir={disminuir}
        referenciaIncrementar={botonMas}
        referenciaDisminuir={botonMenos}
        descripcionExistencias={`existencias-catalogo-${producto.id}`}
      />
      {avisoCarrito?.productoId === producto.id &&
        avisoCarrito.tipo === 'error' && (
          <p role="alert" className="notice error-notice">
            {avisoCarrito.mensaje}
          </p>
        )}
    </article>
  )
}
export default TarjetaProducto
