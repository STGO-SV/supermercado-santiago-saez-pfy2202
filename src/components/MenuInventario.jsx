import { NavLink } from 'react-router'

function MenuInventario() {
  return (
    <nav className="inventory-nav" aria-label="Navegación de inventario">
      <ul className="container inventory-nav-list tw:my-0 tw:flex tw:flex-wrap tw:gap-x-4 tw:gap-y-2 tw:py-3 tw:pl-0 tw:list-none">
        <li>
          <NavLink
            to="/ingreso-articulos"
            end
            className="tw:inline-block tw:rounded-[0.4rem] tw:border-2 tw:border-solid tw:border-transparent tw:p-3 tw:font-[650] tw:underline-offset-[0.25em]"
          >
            Ingresar artículos
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/inventario"
            end
            className="tw:inline-block tw:rounded-[0.4rem] tw:border-2 tw:border-solid tw:border-transparent tw:p-3 tw:font-[650] tw:underline-offset-[0.25em]"
          >
            Ver inventario
          </NavLink>
        </li>
      </ul>
    </nav>
  )
}

export default MenuInventario
