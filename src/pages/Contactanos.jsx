import FormularioContacto from '../components/FormularioContacto.jsx'

function Contactanos() {
  return (
    <section
      className="page-panel contact-panel"
      aria-labelledby="titulo-contacto"
    >
      <p className="eyebrow">Contáctanos</p>
      <h1 id="titulo-contacto">Estamos para ayudarte</h1>
      <p>
        Practica el ingreso de una consulta sobre nuestro supermercado ficticio.
      </p>
      <FormularioContacto />
    </section>
  )
}
export default Contactanos
