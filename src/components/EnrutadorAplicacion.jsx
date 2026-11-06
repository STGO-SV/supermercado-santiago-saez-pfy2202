import { BrowserRouter, HashRouter } from 'react-router'

function EnrutadorAplicacion({ children }) {
  const Router = import.meta.env.PROD ? HashRouter : BrowserRouter
  return <Router>{children}</Router>
}

export default EnrutadorAplicacion
