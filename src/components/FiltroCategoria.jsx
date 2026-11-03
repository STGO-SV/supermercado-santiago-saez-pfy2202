function FiltroCategoria({ categorias, categoria, onChange }) {
  return (
    <div className="field tw:my-5 tw:max-w-md">
      <label htmlFor="categoria-inventario">Categoría del inventario</label>
      <select
        id="categoria-inventario"
        value={categoria}
        onChange={(evento) => onChange(evento.target.value)}
      >
        <option value="">Todas las categorías</option>
        {categorias.map((nombre) => (
          <option key={nombre} value={nombre}>
            {nombre}
          </option>
        ))}
      </select>
    </div>
  )
}

export default FiltroCategoria
