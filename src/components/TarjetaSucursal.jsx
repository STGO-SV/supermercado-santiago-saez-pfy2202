function TarjetaSucursal({ sucursal }) {
  return (
    <article
      className="branch-card"
      aria-labelledby={`sucursal-${sucursal.id}`}
    >
      <p className="category-label">{sucursal.comuna}</p>
      <h2 id={`sucursal-${sucursal.id}`}>{sucursal.nombre}</h2>
      <dl>
        <div>
          <dt>Dirección</dt>
          <dd>{sucursal.direccion}</dd>
        </div>
        <div>
          <dt>Horario</dt>
          <dd>{sucursal.horario}</dd>
        </div>
      </dl>
      <p className="availability available">Sucursal activa</p>
    </article>
  )
}
export default TarjetaSucursal
