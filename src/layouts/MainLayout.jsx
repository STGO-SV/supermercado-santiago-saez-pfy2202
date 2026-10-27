import { NavLink, Outlet } from 'react-router'
import MenuInventario from '../components/MenuInventario.jsx'

function MainLayout() {
  return (
    <div className="app-layout">
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <header className="site-header">
        <div className="container">
          <p className="site-brand">Despensa Verde</p>
          <p className="site-tagline">Gestión de inventario</p>
        </div>
      </header>
      <MenuInventario />
      <main id="contenido" className="container main-content" tabIndex={-1}>
        <Outlet />
      </main>
      <nav className="bottom-nav" aria-label="Navegación principal">
        <ul className="container nav-list">
          <li>
            <NavLink to="/" end>
              Inicio
            </NavLink>
          </li>
          <li>
            <NavLink to="/nuestras-tiendas" end>
              Nuestras tiendas
            </NavLink>
          </li>
          <li>
            <NavLink to="/contactanos" end>
              Contáctanos
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  )
}
export default MainLayout
