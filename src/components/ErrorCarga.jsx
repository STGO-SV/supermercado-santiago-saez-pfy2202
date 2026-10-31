function ErrorCarga({ mensaje, reintentar }) {
  return (
    <div className="notice error-notice">
      <p role="alert">{mensaje}</p>
      <button type="button" className="button-secondary" onClick={reintentar}>
        Reintentar
      </button>
    </div>
  )
}

export default ErrorCarga
