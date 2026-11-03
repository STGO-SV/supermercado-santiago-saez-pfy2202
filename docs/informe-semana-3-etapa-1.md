# Inventario detalle y operaciones del carrito

PFY2202 · Experiencia 1 · Semana 3 · Forma B · Etapa 1

Fecha de comprobación: 3 de noviembre de 2026, America/Santiago.

## Resultado y alcance

Se implementan el filtro de inventario, el detalle mediante ruta dinámica y las operaciones atómicas del carrito. La base corresponde a `semana-3`, HEAD `508eaf9`, con árbol de trabajo inicialmente limpio. Se conservan la implementación de Semana 2 y las mejoras de retroalimentación de Semana 1 incorporadas en `fb22a88` y `508eaf9`.

Esta etapa no incluye la página visual `/carrito`, configuración de GitHub Pages, cambios de enrutador, persistencia, backend ni servicios externos. No se añaden dependencias ni se realizan modificaciones visuales generales. No se ejecutan commits, fusiones o publicaciones.

## Arquitectura y estructura de estado

`ProductosProvider` y `productosReducer` continúan como única fuente de estado compartido. La estructura es:

```js
{
  productos: [],
  carrito: [{ productoId, cantidad }],
  avisoCarrito: null,
  cargando: true,
  error: ''
}
```

La lista de productos conserva sus atributos: `id`, `nombre`, `marca`, `tipo`, `categoria`, `precio`, `stock` y `disponible`. `stock` representa unidades disponibles; `disponible` se actualiza en la misma transición como `stock > 0`. El carrito almacena únicamente identificadores y cantidades. `articulosCarrito` es una proyección calculada que consulta los productos actuales; no constituye otra fuente de estado.

El aviso transitorio identifica `productoId`, `tipo` y `mensaje`. Un rechazo conserva las referencias de productos y carrito y solo cambia el aviso; `error` permanece reservado a los fallos de carga. El detalle muestra el aviso únicamente si corresponde al artículo actual. El conteo visible del carrito se consulta directamente en sus líneas, independientemente del último aviso.

El hook `useProductos` no requiere cambios: expone el contexto ampliado. Se conservan el proveedor montado durante la navegación y las protecciones de `crearCargaJSON`: bloqueo de solicitudes concurrentes, cancelación al desmontar, descarte de respuestas tardías y reintento explícito tras fallo inicial.

## Acciones y operaciones

| Acción                | Parámetros               | Transición                                                                                                     |
| --------------------- | ------------------------ | -------------------------------------------------------------------------------------------------------------- |
| `CARGA_INICIADA`      | Ninguno                  | Conserva la protección existente: solo reinicia tras fallo de carga.                                           |
| `CARGA_COMPLETADA`    | `productos`              | Valida y copia los registros, inicia el carrito vacío y limpia errores y avisos. Solo se admite durante carga. |
| `CARGA_FALLIDA`       | Ninguno                  | Mantiene productos y carrito vacíos, informa el fallo y permite reintento. Solo se admite durante carga.       |
| `AGREGAR_ARTICULO`    | `producto`               | Conserva el alta validada e inmutable; no modifica las reservas existentes.                                    |
| `AGREGAR_AL_CARRITO`  | `productoId`, `cantidad` | Descuenta stock y crea o acumula una línea única.                                                              |
| `INCREMENTAR_CARRITO` | `productoId`, `cantidad` | Exige una línea existente y suma unidades descontándolas del stock.                                            |
| `DISMINUIR_CARRITO`   | `productoId`, `cantidad` | Exige una línea existente, devuelve unidades y elimina la entrada al llegar a cero.                            |

Las tres operaciones aceptan cantidades enteras positivas y seguras; la cantidad omitida equivale a una unidad. El proveedor expone `agregarAlCarrito`, `incrementarCantidad` y `disminuirCantidad`. Las validaciones definitivas se ejecutan dentro de la transición sobre el estado vigente, evitando comprobaciones dependientes de un render anterior.

No se admiten operaciones durante carga o error, artículos inexistentes, cantidades nulas, negativas, fraccionarias, de tipo incorrecto o inseguras. Tampoco se admite consumir más stock del disponible ni devolver más unidades que las reservadas. No hay movimientos parciales.

## Invariantes

Para cada artículo durante una instancia de la aplicación:

- `stock` es un entero seguro no negativo y `disponible === (stock > 0)`.
- Cada entrada del carrito corresponde a un artículo existente, con cantidad entera segura positiva y sin IDs repetidos.
- `stock disponible + cantidad en carrito` conserva las unidades existentes al cargar o dar de alta el artículo.
- Los atributos descriptivos y el precio permanecen intactos durante los movimientos.
- Las transiciones crean nuevos arreglos y registros afectados; conservan las referencias de los registros no afectados.
- Los productos agotados permanecen en el inventario y pueden consultarse en el detalle.

Una carga ya completada no puede repetirse ni sustituir una sesión con reservas. La reinicialización se produce al recargar o abrir una nueva instancia: se restablece la semilla y el carrito queda vacío. Las altas de la sesión se pierden en ese proceso, conforme al alcance sin persistencia.

## Filtro detalle y navegación

El selector de `/inventario` mantiene su selección local. Las categorías se derivan de la lista actual, incluidas las altas. `filtrarInventario` devuelve filas mediante `filter`, sin mutar productos; «Todas las categorías» restaura la visualización completa. Se distinguen inventario vacío y ausencia de coincidencias. La selección se reinicia al desmontar la página.

El nombre de cada producto en la tabla utiliza `Link` con su ID codificado y permite apertura mediante teclado. `/articulos/:id` consulta el estado compartido con `useParams`; presenta nombre, marca, tipo/categoría, precio CLP, stock y disponibilidad. Se incorpora una unidad mediante el botón y se muestran las unidades actuales del carrito.

Durante la carga se muestra su estado; un fallo habilita el componente existente de reintento. La inexistencia se evalúa después de completar una carga válida. Con stock cero se muestra la explicación y se deshabilita el botón. Se conserva el enlace de regreso y la navegación general.

El título centralizado añade «Detalle de artículo | Despensa Verde». Las rutas incompletas y desconocidas conservan la página 404. `BrowserRouter` permanece intacto. La ruta `/carrito` sigue sin implementarse en esta etapa.

## Archivos creados y modificados

Rutas relativas a la raíz del repositorio:

| Estado     | Archivos                                                                | Finalidad                                                                                |
| ---------- | ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Creado     | `src/utils/inventario.js`                                               | Categorías, filtrado y selección por ID.                                                 |
| Creado     | `src/utils/carrito.js`                                                  | Transferencia atómica y proyección de líneas con atributos actuales.                     |
| Creado     | `src/components/FiltroCategoria.jsx`                                    | Selector accesible de inventario.                                                        |
| Creado     | `src/pages/DetalleArticulo.jsx`                                         | Consulta y reserva de unidades con carga, error e inexistencia.                          |
| Modificado | `src/reducers/productosReducer.js`, `src/context/ProductosProvider.jsx` | Estado y operaciones compartidas.                                                        |
| Modificado | `src/pages/Inventario.jsx`, `src/components/TablaInventario.jsx`        | Filtro, conteo y enlaces de detalle.                                                     |
| Modificado | `src/App.jsx`, `src/utils/titulos.js`                                   | Ruta dinámica y título.                                                                  |
| Modificado | `src/tailwind.css`                                                      | Fuentes de detección para el filtro y detalle, con el prefijo existente.                 |
| Creado     | `tests/semana-3-etapa-1.test.js`                                        | Veintiuna pruebas nuevas de la etapa.                                                    |
| Modificado | `tests/productos.test.js`                                               | Actualización de la expectativa de la estructura inicial; conserva los casos existentes. |
| Modificado | `README.md`                                                             | Funcionalidades actuales, pruebas y alcance de la etapa.                                 |
| Creado     | Este informe y `docs/evidencia/semana-3/etapa-1/`                       | Documentación, resultados JSON y tres capturas nuevas.                                   |

## Pruebas realmente ejecutadas

| Comando                | Resultado                                                                        |
| ---------------------- | -------------------------------------------------------------------------------- |
| `npm test`             | 72 aprobadas: 51 anteriores y 21 nuevas; cero fallos, cancelaciones u omisiones. |
| `npm run lint`         | Satisfactorio, sin errores ni advertencias.                                      |
| `npm run format:check` | Satisfactorio tras aplicar formato a los archivos del encargo.                   |
| `npm run build`        | Satisfactorio: 126 módulos transformados.                                        |
| `git diff --check`     | Satisfactorio, sin errores de espacios.                                          |

Las pruebas nuevas verifican filtro sin mutación, categorías, agotados, selección por ID, títulos de detalle, cantidades predeterminadas y explícitas, incrementos, decrementos, rechazo de cantidades inválidas e IDs desconocidos, límite de stock, recuperación de disponibilidad y eliminación de líneas. Incluyen altas con categorías nuevas, datos derivados, carga y recuperación, respuestas tardías y reinicialización. Una secuencia determinista de 2000 movimientos comprueba las invariantes tras cada operación; otro caso transfiere y devuelve `Number.MAX_SAFE_INTEGER` unidades sin perder precisión.

### Navegador

Se registran 33 escenarios satisfactorios en `evidencia/semana-3/etapa-1/navegador.json`. La ejecución utiliza Vite en `127.0.0.1:5173` y la compilación local en `127.0.0.1:4174`. El segundo servidor es temporal y exclusivo de pruebas; simula HTTP 503 y demoras de 1200 ms mediante archivos fuera del repositorio. Los JSON originales no se modifican.

Se verificaron:

- Doce artículos iniciales; filtro Lácteos con tres resultados, incluido Yogur sin stock; restauración del listado completo.
- Apertura del detalle mediante Enter y título correcto. Dos incorporaciones de arroz dejan 40 disponibles y dos en carrito; tabla y catálogo reflejan el mismo stock.
- Validación del formulario de alta, creación de un artículo con categoría Granel y una unidad, consulta de marca y consumo de la última unidad. El artículo agotado sigue visible y el botón queda deshabilitado.
- Conservación del carrito al navegar, reinicio tras recarga, agotados originales e identificadores desconocidos sin controles de incorporación.
- Fallo de carga en detalle sin confundirlo con artículo inexistente, segundo intento fallido, estado de carga sin botón y recuperación al tercer intento mientras cambia la ruta a Inventario. La incorporación posterior descuenta una unidad correctamente.
- Detalle e inventario filtrado en 375, 768 y 1366 px: seis combinaciones sin desbordamiento horizontal del documento. La tabla conserva su desplazamiento interno.
- Sucursales activas, validación de contacto, salto al contenido por teclado, ruta de detalle incompleta y ausencia intencionada de la página `/carrito`.

La consulta de consola de la pestaña de desarrollo no registró errores ni advertencias. Los HTTP 503 del entorno de fallo controlado son esperados. Incrementos y decrementos del carrito se verifican mediante pruebas unitarias; su interfaz completa queda para la siguiente etapa.

Las capturas nuevas son `detalle-carrito-escritorio.jpg`, `detalle-375.jpg` e `inventario-filtrado-768.jpg`. Se inspeccionaron las vistas, manteniendo la identidad visual y sin alterar capturas anteriores. Los resultados de navegador se mantienen separados de `npm test`.

## Problemas encontrados y soluciones

El reducer previo devolvía únicamente los campos de carga conocidos. Se amplían esas transiciones para inicializar expresamente carrito y aviso y se actualiza la expectativa del estado inicial en las pruebas anteriores.

La sincronización exige evitar dos actualizaciones independientes. Se concentra el movimiento en una función pura invocada por el reducer, con validación previa y actualización conjunta de ambos arreglos. La disponibilidad se recalcula con el nuevo stock y se preservan los artículos agotados.

El aviso de la última operación no representa el contenido completo del carrito. El detalle obtiene su cantidad directamente de las líneas y limita el aviso al artículo correspondiente; la comprobación de conservación consulta esa cantidad actual.

Tailwind limita sus fuentes explícitamente. Se incorporan únicamente los archivos nuevos que contienen utilidades para garantizar su presencia en producción. La inspección visual también detectó y corrigió la concordancia de «unidad» para cantidades iguales a uno.

## Límites y pendientes para Etapa 2

Quedan pendientes la página visual `/carrito`, su enlace de navegación, los controles visibles de incremento y disminución, el estado vacío y las pruebas de navegador del recorrido completo entre esas pantallas. El contexto ya proporciona los datos y operaciones necesarios.

La preparación de GitHub Pages, la decisión final de enrutador y la comprobación del sitio publicado corresponden a una fase posterior. No se introduce persistencia, autenticación, pedidos, pagos ni backend. Las pruebas de accesibilidad son parciales y no constituyen certificación completa.

## Estado Git

La rama permanece en `semana-3`, HEAD `508eaf9`. Todos los cambios de esta etapa quedan en la copia de trabajo, sin preparar ni registrar. No se modifican las referencias de `main`, `semana-1` o `semana-2`, los archivos de dependencias, las semillas, Vite ni `src/main.jsx`.

Las funcionalidades sumativas de esta etapa se documentan separadamente de la retroalimentación de Semana 1. Los informes y evidencias históricos de Semanas 1 y 2 permanecen intactos.
