# Interfaz del carrito y navegación

PFY2202 · Experiencia 1 · Semana 3 · Forma B · Etapa 2

Comprobación del 3 de noviembre de 2026, America/Santiago.

## Base y resultado

Se parte de `semana-3`, HEAD `6281d26` («Implementa filtro, detalle y lógica del carrito.»), con directorio limpio y 72 pruebas aprobadas antes de los cambios. Las referencias de `main`, `semana-1` y `semana-2` se conservan.

Se implementa `/carrito` sobre el contexto y operaciones de Etapa 1. No se modifica el reducer, el modelo, el proveedor, el hook de acceso al contexto ni las protecciones de carga. La interfaz muestra líneas, cantidades, precio unitario, subtotales, total y existencias adicionales. La eliminación de una línea se produce exclusivamente mediante el decremento existente al llegar a cero.

Los cambios de esta etapa permanecen sin preparar y sin commit. No se realizan fusiones, publicaciones, instalaciones ni configuración de GitHub Pages. Los informes y evidencias históricos permanecen intactos.

## Componentes e integración

`Carrito` consulta `articulosCarrito`, `carrito`, `cargando`, `error`, `reintentar`, `incrementarCantidad`, `disminuirCantidad` y `avisoCarrito`. La prioridad de presentación es carga, error y contenido disponible; un fallo de carga no se confunde con carrito vacío. El componente existente `ErrorCarga` permite reintentar sin recargar la aplicación.

`LineaCarrito` representa cada registro mediante un artículo semántico con encabezado y enlace al detalle. `ControlesCantidad` utiliza botones con nombres accesibles específicos del producto. El decremento elimina la entrada al llegar a cero; el incremento queda deshabilitado al agotar stock y referencia la explicación de existencias. Los avisos del contexto se presentan como estado o alerta según el resultado de la operación.

Los controladores de página delegan las modificaciones a las funciones existentes del contexto; no calculan ni despachan reemplazos de inventario. El reducer mantiene las validaciones y las actualizaciones atómicas de Etapa 1. Se conserva la suma de stock disponible y unidades reservadas para cada artículo.

## Importes derivados

`calcularImportesCarrito` recibe las líneas derivadas del contexto y devuelve una proyección con subtotales y total. Ninguno de esos valores se almacena en estado, contexto o persistencia.

Las cantidades y precios admiten enteros seguros de `Number`, pero su multiplicación puede superar ese límite. Se utiliza `BigInt(precio) * BigInt(cantidad)` y suma exacta con `0n`; se reutiliza `formatoPrecio` para representar CLP. Los datos originales mantienen sus tipos existentes. Se verifican precio cero e importes superiores al límite seguro, sin redondeos ni notación exponencial.

## Foco y navegación

Cuando una línea desaparece, un efecto posterior al render dirige el foco al decremento de la siguiente línea; si no existe, al de la anterior. Al eliminar la última entrada se enfoca el encabezado del estado vacío. Al consumir la última existencia mediante incremento, el foco pasa al decremento del mismo artículo. Las referencias de controles y el destino pendiente son locales y no representan otra fuente de inventario.

El menú secundario añade `Carrito` mediante `NavLink` con coincidencia completa. La navegación inferior conserva sus tres enlaces y estilos. El título centralizado incorpora «Carrito | Despensa Verde». Se conserva `BrowserRouter`, la navegación SPA, historial y acceso directo en el servidor local.

Tailwind 4.3.3 mantiene el prefijo `tw:` y la exclusión de Preflight. Se registran las fuentes de los tres componentes nuevos que contienen utilidades. Las tarjetas utilizan distribución adaptable, ajuste de líneas y anchos mínimos controlados; el menú secundario aprovecha su ajuste existente.

## Archivos afectados

Rutas relativas a la raíz del repositorio:

| Estado     | Archivo                                                                               | Finalidad                                           |
| ---------- | ------------------------------------------------------------------------------------- | --------------------------------------------------- |
| Creado     | `src/pages/Carrito.jsx`                                                               | Página, integración con contexto, estados y foco.   |
| Creado     | `src/components/LineaCarrito.jsx`                                                     | Información y subtotal de una línea.                |
| Creado     | `src/components/ControlesCantidad.jsx`                                                | Botones accesibles de incremento y disminución.     |
| Creado     | `src/utils/importesCarrito.js`                                                        | Proyección de subtotales y total exactos.           |
| Modificado | `src/App.jsx`                                                                         | Ruta `/carrito`.                                    |
| Modificado | `src/components/MenuInventario.jsx`                                                   | Enlace de navegación.                               |
| Modificado | `src/utils/titulos.js`                                                                | Título del carrito.                                 |
| Modificado | `src/tailwind.css`                                                                    | Fuentes explícitas nuevas.                          |
| Creado     | `tests/semana-3-etapa-2.test.js`                                                      | Doce pruebas de cálculo, integración y renderizado. |
| Modificado | `README.md`                                                                           | Funcionalidades y validación actuales.              |
| Creado     | Este informe, `docs/pruebas-semana-3-etapa-2.md` y `docs/evidencia/semana-3/etapa-2/` | Protocolo, resultados JSON y capturas.              |

## Pruebas automáticas ejecutadas

| Comprobación            | Resultado                                                                        |
| ----------------------- | -------------------------------------------------------------------------------- |
| Base inicial `npm test` | 72 pruebas anteriores aprobadas.                                                 |
| `npm test` con Etapa 2  | 84 aprobadas: 72 anteriores y 12 nuevas; cero fallos, cancelaciones u omisiones. |
| `npm run lint`          | Satisfactorio, sin errores ni advertencias.                                      |
| `npm run format:check`  | Satisfactorio.                                                                   |
| `npm run build`         | Satisfactorio, 130 módulos transformados.                                        |
| `git diff --check`      | Satisfactorio.                                                                   |

Las pruebas nuevas comprueban vacío, importes de varias líneas, incrementos, devolución, eliminación, precio cero, precisión numérica, título, enlaces, cantidad visible, existencias, incremento deshabilitado, carga, error, alerta de rechazo y selección activa del menú.

La verificación de interfaz utiliza `renderToStaticMarkup` sobre los componentes reales, cargados mediante Vite en modo middleware sin servidor HTTP ni HMR, dentro del contexto y `MemoryRouter` de prueba. Se cierran los recursos al finalizar. Estas pruebas validan el renderizado; las interacciones y el foco se prueban por separado en navegador. No se añaden dependencias.

## Navegador y evidencias

Se registran 42 escenarios satisfactorios en `evidencia/semana-3/etapa-2/navegador.json`. La ejecución utiliza Vite en `127.0.0.1:5173` y la compilación local en `127.0.0.1:4174`. El servidor temporal de compilación simula HTTP 503 y demoras de 1200 ms mediante configuración fuera del repositorio, sin alterar las semillas ni el código de aplicación.

Se verificaron los quince recorridos solicitados, detallados en el protocolo:

- Inventario, detalle y carrito; incorporaciones repetidas y dos artículos diferentes.
- Incremento y disminución desde el carrito, devolución de existencias, bloqueo por stock cero y eliminación de líneas.
- Subtotales y total: dos arroces y un fideo suman $3.970; incrementar arroz produce $5.460 y disminuirlo restablece $3.970.
- Alta de Avena con dos unidades a $1.290: una reserva eleva el total a $5.260; reservar la segunda agota stock y produce $6.550. Devolver ambas elimina la línea y restablece $3.970.
- Conservación del estado al navegar, enlaces de carrito a detalle, selección activa, historial y recarga con semilla inicial y carrito vacío.
- Error de carga, segundo fallo y recuperación al tercer intento sin recarga; las operaciones vuelven a estar disponibles.
- Enter, Espacio, Tab, foco visible, cambios de foco por agotamiento o eliminación y salto al contenido.
- Tres líneas en 375, 768 y 1366 px, sin desbordamiento horizontal del documento; se conservan los tres enlaces inferiores.
- Contacto vacío y válido, sucursales, filtros y 404 anidada sin selección activa incorrecta.

La pestaña de desarrollo no registró errores ni advertencias de consola. Los HTTP 503 del entorno de fallo son esperados. Las operaciones rechazadas se comprueban automáticamente mediante un estado generado por el reducer; en navegador se verifica el bloqueo preventivo del incremento sin existencias.

Las capturas son `carrito-375.jpg`, `carrito-768.jpg`, `carrito-1366.jpg`, `carrito-vacio.jpg`, `carrito-error.jpg` y `carrito-operacion.jpg`. Las tres primeras son capturas de página completa: la navegación fija se representa en su posición de la ventana durante la captura. `carrito-operacion.jpg` muestra una ventana normal con controles, total y foco del menú visibles.

## Problemas previstos y soluciones verificadas

La multiplicación de dos enteros seguros puede producir un importe inexacto con `Number`. La proyección con `BigInt` resuelve el cálculo sin modificar el modelo de productos ni introducir una limitación nueva a sus cantidades.

La eliminación del control que tiene el foco puede dejar la navegación por teclado sin destino claro. Las referencias y el efecto posterior al render mantienen el foco dentro del flujo de controles o en el estado vacío. Se verifican eliminación de primera y última línea, eliminación final y agotamiento de stock.

La carga fallida podría interpretarse como carrito vacío si se evaluara primero su longitud. Se priorizan carga y error, con el reintento existente. No se identificó un defecto reproducible que requiriera modificar el reducer o el modelo.

## Limitaciones y publicación pendiente

No hay persistencia; recargar restablece inventario inicial y carrito vacío. No se incorporan compra, pago, pedidos, autenticación, backend ni base de datos. La revisión de teclado y adaptación es parcial y no certifica accesibilidad exhaustiva ni compatibilidad con todos los navegadores.

GitHub Pages continúa pendiente: configuración de subruta de Vite, decisión final sobre enrutamiento estático, workflow de construcción/publicación y comprobación de enlaces directos, recargas, JSON y recursos en la URL publicada. Esta etapa no activa ni configura ese despliegue.

## Estado Git y conservación histórica

La rama permanece en `semana-3`, HEAD `6281d26`. Los cambios de Etapa 2 quedan exclusivamente en la copia de trabajo, sin preparar ni registrar. Las demás ramas, las dependencias, las semillas, el reducer, el contexto, el modelo, `src/main.jsx` y Vite permanecen intactos. Se conservan las evidencias e informes anteriores, incluidos los de Etapa 1 y las mejoras de retroalimentación de Semana 1.

## Corrección del enlace de continuidad al catálogo

El 3 de noviembre de 2026 se sustituye en `src/pages/Carrito.jsx` el enlace «Volver al inventario» por «Seguir comprando», con destino `/`. El texto del estado vacío orienta igualmente al catálogo de Inicio. El enlace común está disponible con y sin artículos; se conservan su presentación, semántica y foco visible. Los enlaces a detalle y el acceso académico a Inventario permanecen intactos.

Se actualizan las dos pruebas de renderizado afectadas para comprobar el texto y destino del enlace con carrito vacío y con reservas. La ejecución de `node --test tests/semana-3-etapa-2.test.js` finaliza con doce pruebas aprobadas. ESLint, Prettier, build y `git diff --check` finalizan satisfactoriamente; la compilación transforma 130 módulos.

La comprobación de navegador cubre siete verificaciones: destino `/`, regreso SPA con dos reservas conservadas y contador dos en Inicio, Atrás a Carrito con las mismas cantidades, Adelante a Inicio, foco visible y activación mediante Enter, disponibilidad del enlace con carrito vacío y regreso al catálogo con contador cero. La conservación de reservas durante la navegación confirma la continuidad de la instancia sin recarga completa. No se registran errores ni advertencias de consola.

Estos resultados son posteriores a los 42 escenarios originales de Etapa 2 y no alteran su registro ni las capturas históricas. No se modifican el reducer, el contexto, las operaciones o las dependencias. Los cambios continúan sin preparar ni registrar en `semana-3`.
