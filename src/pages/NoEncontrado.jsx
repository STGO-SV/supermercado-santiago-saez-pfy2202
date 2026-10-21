import { Link } from 'react-router'

function NoEncontrado() {
  return (
    <section className="page-panel" aria-labelledby="titulo-no-encontrado">
      <p className="eyebrow">Error 404</p>
      <h1 id="titulo-no-encontrado">Página no encontrada</h1>
      <p>La dirección que buscas no corresponde a una página de este sitio.</p>
      <Link className="return-link" to="/">
        Volver al inicio
      </Link>
    </section>
  )
}
export default NoEncontrado
