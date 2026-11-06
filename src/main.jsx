import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './tailwind.css'
import './index.css'
import './inventario.css'
import App from './App.jsx'
import ProductosProvider from './context/ProductosProvider.jsx'
import EnrutadorAplicacion from './components/EnrutadorAplicacion.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <EnrutadorAplicacion>
      <ProductosProvider>
        <App />
      </ProductosProvider>
    </EnrutadorAplicacion>
  </StrictMode>,
)
