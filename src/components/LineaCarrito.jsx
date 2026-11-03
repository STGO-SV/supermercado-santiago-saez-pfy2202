import { Link } from 'react-router'
import ControlesCantidad from './ControlesCantidad.jsx'
import { formatoPrecio } from '../utils/formatoPrecio.js'

function LineaCarrito({
  producto,
  cantidad,
  subtotal,
  incrementar,
  disminuir,
  referenciaDisminuir,
}) {
  return (
    <li className="tw:min-w-0 tw:rounded-lg tw:border tw:border-solid tw:border-[#c6d6ca] tw:bg-white tw:p-5">
      <article
        aria-labelledby={`carrito-${producto.id}`}
        className="tw:grid tw:gap-4 tw:md:grid-cols-[minmax(0,1fr)_auto] tw:md:items-center"
      >
        <div className="tw:min-w-0 tw:break-words">
          <h2 id={`carrito-${producto.id}`} className="tw:mt-0 tw:text-xl">
            <Link to={`/articulos/${encodeURIComponent(producto.id)}`}>
              {producto.nombre}
            </Link>
          </h2>
          <p>Precio unitario: {formatoPrecio(producto.precio)} CLP</p>
          <p id={`existencias-${producto.id}`}>
            Existencias adicionales disponibles: {producto.stock}.
            {producto.stock === 0 &&
              ' Sin existencias para aumentar la cantidad.'}
          </p>
          <p className="tw:mb-0">
            Subtotal: <strong>{formatoPrecio(subtotal)} CLP</strong>
          </p>
        </div>
        <ControlesCantidad
          producto={producto}
          cantidad={cantidad}
          incrementar={incrementar}
          disminuir={disminuir}
          referenciaDisminuir={referenciaDisminuir}
        />
      </article>
    </li>
  )
}

export default LineaCarrito
