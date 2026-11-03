import { matchPath } from 'react-router'

const secciones = [
  ['/', 'Inicio'],
  ['/nuestras-tiendas', 'Nuestras tiendas'],
  ['/contactanos', 'Contáctanos'],
  ['/ingreso-articulos', 'Ingreso de artículos'],
  ['/inventario', 'Inventario'],
  ['/articulos/:id', 'Detalle de artículo'],
  ['/carrito', 'Carrito'],
]

export function tituloPagina(pathname) {
  const seccion = secciones.find(([path]) =>
    matchPath({ path, end: true }, pathname),
  )
  return `${seccion?.[1] ?? 'Página no encontrada (404)'} | Despensa Verde`
}
