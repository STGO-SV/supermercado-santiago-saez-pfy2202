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
        Déjanos tus consultas, sugerencias y comentarios usando el fomulario a
        continuación.
      </p>
      <FormularioContacto />
    </section>
  )
}
export default Contactanos
