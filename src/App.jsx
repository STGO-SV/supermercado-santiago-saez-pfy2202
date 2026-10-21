import { Route, Routes } from 'react-router'
import MainLayout from './layouts/MainLayout.jsx'
import Home from './pages/Home.jsx'
import NuestrasTiendas from './pages/NuestrasTiendas.jsx'
import Contactanos from './pages/Contactanos.jsx'
import NoEncontrado from './pages/NoEncontrado.jsx'

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="nuestras-tiendas" element={<NuestrasTiendas />} />
        <Route path="contactanos" element={<Contactanos />} />
        <Route path="*" element={<NoEncontrado />} />
      </Route>
    </Routes>
  )
}
export default App
