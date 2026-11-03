import { Link } from 'react-router'
import { formatoPrecio } from '../utils/formatoPrecio.js'

function TablaInventario({ productos }) {
  return (
    <div
      className="inventory-table-scroll tw:max-w-full tw:overflow-x-auto"
      role="region"
      aria-label="Tabla de inventario con desplazamiento horizontal"
      tabIndex={0}
    >
      <table className="inventory-table tw:w-full tw:min-w-[56rem] tw:border-collapse tw:text-left tw:text-[0.95rem]">
        <caption>Artículos del inventario: {productos.length}</caption>
        <thead>
          <tr>
            {[
              'Identificador',
              'Nombre',
              'Marca',
              'Categoría',
              'Precio por unidad (CLP)',
              'Unidades disponibles',
              'Disponibilidad',
            ].map((titulo) => (
              <th key={titulo} scope="col">
                {titulo}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.id}>
              <td>{producto.id}</td>
              <th scope="row">
                <Link to={`/articulos/${encodeURIComponent(producto.id)}`}>
                  {producto.nombre}
                </Link>
              </th>
              <td>{producto.marca ?? 'Sin información'}</td>
              <td>{producto.categoria}</td>
              <td>{formatoPrecio(producto.precio)}</td>
              <td>{producto.stock}</td>
              <td>{producto.disponible ? 'Disponible' : 'Sin stock'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TablaInventario
