function ControlesCantidad({
  producto,
  cantidad,
  incrementar,
  disminuir,
  referenciaDisminuir,
  referenciaIncrementar,
  compacto = false,
  descripcionExistencias = `existencias-${producto.id}`,
}) {
  const aumento = (
    <button
      key="aumentar"
      type="button"
      ref={referenciaIncrementar}
      className="button-secondary tw:shrink-0 tw:disabled:cursor-not-allowed tw:disabled:opacity-60"
      aria-label={`Aumentar cantidad de ${producto.nombre}`}
      disabled={producto.stock === 0}
      aria-describedby={descripcionExistencias}
      onClick={() => incrementar(producto.id)}
    >
      +
    </button>
  )
  const disminucion = (
    <button
      key="disminuir"
      type="button"
      ref={referenciaDisminuir}
      className="button-secondary tw:shrink-0 tw:disabled:cursor-not-allowed tw:disabled:opacity-60"
      aria-label={`Disminuir cantidad de ${producto.nombre}`}
      disabled={cantidad === 0}
      onClick={() => disminuir(producto.id)}
    >
      −
    </button>
  )
  const contador = (
    <p
      key="cantidad"
      className="tw:m-0 tw:min-w-0 tw:break-all"
      aria-live={compacto ? 'polite' : undefined}
      aria-atomic={compacto ? true : undefined}
    >
      {compacto ? (
        <span className="tw:sr-only">
          Unidades de {producto.nombre} en el carrito:{' '}
        </span>
      ) : null}
      <strong>{cantidad}</strong>
    </p>
  )
  return (
    <div className="tw:grid tw:gap-2">
      {!compacto && <p className="tw:m-0">Cantidad</p>}
      <div
        role="group"
        aria-label={`Cantidad de ${producto.nombre}`}
        className="tw:flex tw:items-center tw:gap-3"
      >
        {disminucion}
        {contador}
        {aumento}
      </div>
    </div>
  )
}

export default ControlesCantidad
