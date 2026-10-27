import { NavLink } from 'react-router'

function MenuInventario() {
  return (
    <nav className="inventory-nav" aria-label="Navegación de inventario">
      <ul className="container inventory-nav-list">
        <li>
          <NavLink to="/ingreso-articulos" end>
            Ingresar artículos
          </NavLink>
        </li>
        <li>
          <NavLink to="/inventario" end>
            Ver inventario
          </NavLink>
        </li>
      </ul>
    </nav>
  )
}

export default MenuInventario
