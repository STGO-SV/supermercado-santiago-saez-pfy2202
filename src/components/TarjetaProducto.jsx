import { formatoPrecio } from '../utils/formatoPrecio.js'

function TarjetaProducto({ producto }) {
  return (
    <article
      className="product-card"
      aria-labelledby={`producto-${producto.id}`}
    >
      <p className="category-label">{producto.categoria}</p>
      <h3 id={`producto-${producto.id}`}>{producto.nombre}</h3>
      <p className="product-price">
        {formatoPrecio(producto.precio)} <span>CLP</span>
      </p>
      <p>
        Stock: <strong>{producto.stock} unidades</strong>
      </p>
      <p
        className={`availability ${producto.disponible ? 'available' : 'unavailable'}`}
      >
        {producto.disponible ? 'Disponible' : 'Sin stock'}
      </p>
    </article>
  )
}
export default TarjetaProducto
