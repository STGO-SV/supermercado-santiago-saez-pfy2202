import { formatoPrecio } from '../utils/formatoPrecio.js'

function TablaInventario({ productos }) {
  return (
    <div
      className="inventory-table-scroll"
      role="region"
      aria-label="Tabla de inventario con desplazamiento horizontal"
      tabIndex={0}
    >
      <table className="inventory-table">
        <caption>Artículos del inventario: {productos.length}</caption>
        <thead>
          <tr>
            {[
              'Identificador',
              'Nombre',
              'Marca',
              'Tipo / categoría',
              'Precio CLP',
              'Stock',
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
              <th scope="row">{producto.nombre}</th>
              <td>{producto.marca ?? 'Sin información'}</td>
              <td>{producto.tipo}</td>
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
