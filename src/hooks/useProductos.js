import { useContext } from 'react'
import { ProductosContext } from '../context/ProductosContext.js'

export function useProductos() {
  const contexto = useContext(ProductosContext)
  if (!contexto) throw new Error('useProductos requiere ProductosProvider')
  return contexto
}
